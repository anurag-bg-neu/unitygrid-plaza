"""End-to-end checks for UnityGrid Plaza. Build and start the app first:

    npm run build && npm start                    # terminal 1
    .venv/bin/python tools/e2e_test.py            # terminal 2
"""
import json
import os
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone

from playwright.sync_api import sync_playwright

BASE = os.environ.get("BASE_URL", "http://localhost:3002")
results = []


def check(name, condition, detail=""):
    results.append(condition)
    print(f"{'PASS' if condition else 'FAIL'}  {name}" + (f"  ({detail})" if detail and not condition else ""))


def get(path):
    try:
        with urllib.request.urlopen(BASE + path) as r:
            return r.status, r.read().decode()
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()


def api(path):
    status, body = get(path)
    return status, json.loads(body)


def starts(e):
    return datetime.fromisoformat(e["starts_at"].replace("Z", "+00:00"))


print(f"== API ({BASE})")
status, locations = api("/api/locations")
check("GET /api/locations returns 200", status == 200, status)
check("at least four locations", len(locations) >= 4, len(locations))
slugs = [l["slug"] for l in locations]

status, events = api("/api/events")
check("GET /api/events returns events", status == 200 and len(events) > 0, status)
check("events have the expected columns",
      all({"id", "location_id", "title", "description", "category", "starts_at", "image", "location_slug"} <= set(e) for e in events))
check("every location has events", all(any(e["location_slug"] == s for e in events) for s in slugs))
now = datetime.now(timezone.utc)
check("seed data mixes past and upcoming events",
      any(starts(e) < now for e in events) and any(starts(e) > now for e in events))

slug = slugs[0]
status, loc = api(f"/api/locations/{slug}")
check("GET /api/locations/:slug returns that location", status == 200 and loc["slug"] == slug, status)
status, loc_events = api(f"/api/locations/{slug}/events")
check("GET /api/locations/:slug/events only returns that location's events",
      status == 200 and loc_events and all(e["location_slug"] == slug for e in loc_events))
_, filtered = api(f"/api/events?location={slug}")
check("GET /api/events?location= filters by location", {e["id"] for e in filtered} == {e["id"] for e in loc_events})
_, desc = api("/api/events?sort=desc")
check("GET /api/events?sort=desc sorts latest first", [e["id"] for e in desc] == [e["id"] for e in sorted(events, key=starts, reverse=True)])
status, one = api(f"/api/events/{events[0]['id']}")
check("GET /api/events/:id returns one event", status == 200 and one["id"] == events[0]["id"], status)
check("unknown location -> 404", api("/api/locations/nowhere")[0] == 404)
check("non-numeric event id -> 400", api("/api/events/abc")[0] == 400)
check("unknown event id -> 404", api("/api/events/999999")[0] == 404)
check("SQL-injection-style slug is treated as text", api("/api/locations/x'%20OR%20'1'='1")[0] == 404)

print("== Browser")
with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1280, "height": 800})
    errors = []
    page.on("console", lambda m: m.type == "error" and errors.append(m.text))
    page.on("pageerror", lambda e: errors.append(str(e)))

    page.goto(BASE + "/")
    page.wait_for_selector(".venue-map polygon")
    check("title is displayed", page.inner_text("h1").strip().lower() == "unitygrid plaza")
    check("map shows one clickable shape per location", page.locator(".venue-map polygon").count() == len(locations))

    target = locations[3]
    page.hover(f"#venue-{target['slug']}")
    check("hovering a building shows its name", target["name"] in page.text_content(".venue-label.visible"))
    page.click(f"#venue-{target['slug']}")
    page.wait_for_selector(".event-card")
    check("clicking a building opens its unique URL", page.url.endswith(f"/locations/{target['slug']}"), page.url)
    check("detail page shows the location name", target["name"].lower() in page.inner_text(".location-info h2").lower())
    _, expected = api(f"/api/locations/{target['slug']}/events")
    check("detail page lists all of that location's events", page.locator(".event-card").count() == len(expected))

    page.wait_for_timeout(1200)
    first = page.locator(".event-countdown:not(.ended)").first.inner_text()
    page.wait_for_timeout(1500)
    check("countdown ticks every second", page.locator(".event-countdown:not(.ended)").first.inner_text() != first)
    past = page.locator(".event-past")
    check("past events are styled differently",
          past.count() > 0 and "line-through" in past.first.locator(".event-title").evaluate("e => getComputedStyle(e).textDecorationLine")
          and "ended" in past.first.inner_text().lower())

    page.goto(BASE + "/")
    page.wait_for_selector(".venue-map polygon")
    page.focus(f"#venue-{locations[1]['slug']}")
    page.keyboard.press("Enter")
    page.wait_for_url(f"**/locations/{locations[1]['slug']}")
    check("map works with the keyboard (Tab + Enter)", True)

    page.click(".header-buttons a[href='/events']")
    page.wait_for_url("**/events")
    page.wait_for_selector(".event-card")
    check("Events page lists every event", page.locator(".event-card").count() == len(events))
    page.select_option("#location-filter", slug)
    page.wait_for_function(f"document.querySelector('#events-count')?.textContent.startsWith('{len(loc_events)} ')")
    check("Events page filters by location", page.locator(".event-card").count() == len(loc_events))
    check("filter is reflected in the URL", f"location={slug}" in page.url, page.url)
    page.select_option("#location-filter", "")
    page.select_option("#sort-order", "desc")
    page.wait_for_function(f"document.querySelectorAll('.event-card').length === {len(events)}")
    page.wait_for_timeout(300)
    check("Events page sorts latest first", page.locator(".event-title").first.inner_text().lower() == desc[0]["title"].lower())
    page.check("#hide-past")
    upcoming = sum(1 for e in events if starts(e) > datetime.now(timezone.utc))
    check("Hide past events removes past events", page.locator(".event-card").count() == upcoming)
    check("no browser console errors", not errors, errors)

    page.goto(BASE + "/locations/nowhere")
    page.wait_for_selector(".not-found")
    check("unknown location shows a 404 view", "not on the plaza map" in page.inner_text(".not-found"))
    page.goto(BASE + "/some/random/page")
    page.wait_for_selector(".not-found")
    check("unknown route shows a 404 view", True)

    mobile = browser.new_page(viewport={"width": 390, "height": 844})
    mobile.goto(BASE + "/")
    mobile.wait_for_selector(".venue-card")
    check("no horizontal scroll on a phone", mobile.evaluate("document.documentElement.scrollWidth <= window.innerWidth"))
    browser.close()

passed = sum(results)
print(f"\n{passed}/{len(results)} checks passed")
sys.exit(0 if passed == len(results) else 1)
