"""Records the README walkthrough GIF (docs/walkthrough.gif). Build and start the app first:

    npm run build && npm start                     # terminal 1
    .venv/bin/python tools/record_walkthrough.py   # terminal 2

Part 1 runs real psql (from the postgres Docker image) against the database in server/.env
and replays its output in a terminal-styled page with the password masked. Part 2 drives the app.
"""
import html
import json
import os
import shutil
import subprocess
import tempfile
from pathlib import Path

import imageio_ffmpeg
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
BASE = os.environ.get("BASE_URL", "http://localhost:3002")
OUT = ROOT / "docs" / "walkthrough.gif"
SIZE = {"width": 1280, "height": 760}
QUERIES = [
    "SELECT id, slug, name, city, state FROM locations;",
    "SELECT * FROM events;",
]


def pg_env():
    env = {}
    for line in (ROOT / "server" / ".env").read_text().splitlines():
        if "=" in line and not line.lstrip().startswith("#"):
            key, value = line.split("=", 1)
            env[key.strip()] = value.strip().strip('"')
    return env


def run_psql(env):
    script = "\\pset format wrapped\n\\pset columns 182\n" + "\n".join(f"\\echo __SPLIT__\n{q}" for q in QUERIES) + "\n"
    out = subprocess.run(
        ["docker", "run", "--rm", "-i", "-e", f"PGPASSWORD={env['PGPASSWORD']}", "postgres:16-alpine",
         "psql", "-q", "-h", env["PGHOST"], "-p", env.get("PGPORT", "5432"), "-U", env["PGUSER"], env["PGDATABASE"],
         "--set", "sslmode=require"],
        input=script, capture_output=True, text=True, check=True,
    )
    return [chunk.strip("\n") for chunk in out.stdout.split("__SPLIT__")[1:]]


def terminal_page(env, outputs):
    db = env["PGDATABASE"]
    steps = [["$ ", f"PGPASSWORD=******** psql -h {env['PGHOST']} -U {env['PGUSER']} {db}", ""],
             [f"{db}=> ", "\\pset format wrapped", "Output format is wrapped.\n"]]
    steps += [[f"{db}=> ", q, out + "\n"] for q, out in zip(QUERIES, outputs)]
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>
      html, body {{ margin:0; height:100%; background:#0d1117; color:#c9d1d9; }}
      .bar {{ position:sticky; top:0; background:#21262d; color:#8b949e; padding:8px 14px; font:12px -apple-system,sans-serif; }}
      .bar b {{ color:#58a6ff; }}
      pre {{ margin:0; padding:10px 14px; white-space:pre; font:10.5px/1.32 Menlo,monospace; }}
      .p {{ color:#7ee787; }}
    </style></head><body>
      <div class="bar"><b>Terminal</b> &mdash; psql connected to Render PostgreSQL (password hidden)</div>
      <pre id="t"></pre>
      <script>
        const steps = {json.dumps(steps)};
        const t = document.getElementById('t');
        const sleep = ms => new Promise(r => setTimeout(r, ms));
        const bottom = () => window.scrollTo(0, document.body.scrollHeight);
        window.play = async () => {{
          for (const [prompt, cmd, out] of steps) {{
            const p = document.createElement('span'); p.className = 'p'; p.textContent = prompt; t.append(p);
            for (const ch of cmd) {{ t.append(ch); await sleep(26); }}
            t.append('\\n'); await sleep(450);
            t.append(out); bottom(); await sleep(out.length > 2000 ? 5500 : 2200);
          }}
        }};
      </script></body></html>"""


OVERLAY = """
(() => {
  if (location.protocol === 'file:') return;
  const mount = () => {
    const bar = document.createElement('div');
    bar.id = '__urlbar';
    bar.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:99999;background:#e8eaed;color:#202124;' +
      'font:13px -apple-system,sans-serif;padding:7px 14px;border-bottom:1px solid #c4c7c5;';
    const sync = () => { bar.textContent = location.href; };
    sync(); setInterval(sync, 200);
    const cap = document.createElement('div');
    cap.id = '__caption';
    cap.style.cssText = 'position:fixed;bottom:18px;left:50%;transform:translateX(-50%);z-index:99999;' +
      'background:rgba(0,0,0,.85);color:#fff;font:600 15px -apple-system,sans-serif;padding:9px 18px;' +
      'border-radius:6px;max-width:90%;text-align:center;';
    cap.hidden = true;
    document.body.append(bar, cap);
    document.body.style.paddingTop = '34px';
  };
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', mount) : mount();
})();
"""


def caption(page, text):
    page.evaluate("t => { const c = document.getElementById('__caption'); c.textContent = t; c.hidden = false; }", text)


def scroll(page, to, steps=25):
    page.evaluate("""async ([to, steps]) => {
      const from = scrollY;
      for (let i = 1; i <= steps; i++) { scrollTo(0, from + (to - from) * i / steps); await new Promise(r => setTimeout(r, 40)); }
    }""", [to, steps])


def scroll_to(page, selector, offset=90):
    y = page.evaluate("([s, o]) => document.querySelector(s).getBoundingClientRect().top + scrollY - o", [selector, offset])
    scroll(page, y)


def record(term_html, video_dir):
    with sync_playwright() as p:
        browser = p.chromium.launch()
        ctx = browser.new_context(viewport=SIZE, record_video_dir=video_dir, record_video_size=SIZE)
        ctx.add_init_script(OVERLAY)
        page = ctx.new_page()

        # 1. Table contents straight from Render via psql
        page.goto(term_html.as_uri())
        page.evaluate("play()")

        # 2. Home: title + visual map of locations
        page.goto(BASE + "/")
        page.wait_for_selector(".venue-map polygon")
        page.wait_for_timeout(800)
        caption(page, "React front end — locations come from /api/locations (Express + Render PostgreSQL)")
        scroll_to(page, ".intro", 40)
        page.wait_for_timeout(1200)
        caption(page, "Visual interface: hover a building on the plaza map to pick a location")
        for slug in ["nebula-arcade", "spire-amphitheater", "prism-dome", "verdant-commons"]:
            page.hover(f"#venue-{slug}")
            page.wait_for_timeout(1000)

        # 3. Location detail page with its own URL and events
        page.click("#venue-nebula-arcade")
        page.wait_for_selector(".event-card")
        caption(page, "Each location has its own URL and lists its events from the events table")
        page.wait_for_timeout(2600)
        caption(page, "Stretch: live countdown to each event")
        scroll_to(page, ".section-title")
        page.wait_for_timeout(2600)
        page.evaluate("document.querySelectorAll('.section-title')[1]?.scrollIntoView({behavior: 'smooth'})")
        caption(page, "Stretch: past events are greyed out, crossed out, and marked as ended")
        page.wait_for_timeout(2800)

        page.goto(BASE + "/")
        page.wait_for_selector(".venue-map polygon")
        scroll_to(page, ".intro", 40)
        page.hover("#venue-prism-dome")
        page.wait_for_timeout(700)
        page.click("#venue-prism-dome")
        page.wait_for_selector(".event-card")
        caption(page, "Another location: /locations/prism-dome")
        page.wait_for_timeout(2400)

        # 4. Events page: filter + sort
        scroll(page, 0, 10)
        page.click(".header-buttons a[href='/events']")
        page.wait_for_selector(".event-card")
        caption(page, "Stretch: Events page shows every event across all locations")
        page.wait_for_timeout(2200)
        caption(page, "Filter events by location")
        page.select_option("#location-filter", "spire-amphitheater")
        page.wait_for_timeout(2400)
        caption(page, "Sort by date (latest first) and hide past events")
        page.select_option("#sort-order", "desc")
        page.wait_for_timeout(1500)
        page.check("#hide-past")
        page.wait_for_timeout(2000)
        scroll(page, 380)
        page.wait_for_timeout(1500)

        # 5. 404
        page.goto(BASE + "/locations/atlantis")
        page.wait_for_selector(".not-found")
        caption(page, "Unknown locations show a friendly 404")
        page.wait_for_timeout(2200)

        video = page.video.path()
        ctx.close()
        browser.close()
        return Path(video)


def to_gif(video):
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    OUT.parent.mkdir(exist_ok=True)
    vf = "fps=8,scale=840:-1:flags=lanczos"
    subprocess.run([ffmpeg, "-y", "-loglevel", "error", "-i", str(video), "-vf",
                    f"{vf},split[a][b];[a]palettegen=max_colors=96:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4",
                    str(OUT)], check=True)
    shutil.copy(video, OUT.with_suffix(".webm"))


if __name__ == "__main__":
    env = pg_env()
    outputs = run_psql(env)
    with tempfile.TemporaryDirectory() as tmp:
        term = Path(tmp) / "terminal.html"
        term.write_text(terminal_page(env, outputs))
        video = record(term, tmp)
        to_gif(video)
    print(f"Saved {OUT.relative_to(ROOT)} ({OUT.stat().st_size / 1e6:.1f} MB) and {OUT.with_suffix('.webm').name}")
