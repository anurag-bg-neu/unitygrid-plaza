import React from 'react'
import { useSearchParams } from 'react-router-dom'
import Event from '../components/Event'
import EventsAPI from '../services/EventsAPI'
import LocationsAPI from '../services/LocationsAPI'
import useAsync from '../hooks/useAsync'
import '../css/Events.css'

const Events = () => {
    // Filters live in the URL (e.g. /events?location=prism-dome&sort=desc) so views are shareable.
    const [params, setParams] = useSearchParams()
    const location = params.get('location') || ''
    const sort = params.get('sort') === 'desc' ? 'desc' : 'asc'
    const hidePast = params.get('hidePast') === '1'

    const locations = useAsync(() => LocationsAPI.getAllLocations(), [])
    const events = useAsync(() => EventsAPI.getAllEvents({ location, sort }), [location, sort])

    const update = (key, value) => {
        const next = new URLSearchParams(params)
        value ? next.set(key, value) : next.delete(key)
        setParams(next, { replace: true })
    }

    const now = Date.now()
    const visible = (events.data || []).filter((e) => !hidePast || new Date(e.starts_at).getTime() > now)

    return (
        <div className='all-events'>
            <header className='events-header'>
                <h2>All events</h2>
                <p>Everything happening across UnityGrid Plaza.</p>
            </header>

            <form className='events-filters' onSubmit={(e) => e.preventDefault()}>
                <label>
                    Location
                    <select id='location-filter' value={location} onChange={(e) => update('location', e.target.value)}>
                        <option value=''>All locations</option>
                        {(locations.data || []).map((l) => <option key={l.id} value={l.slug}>{l.name}</option>)}
                    </select>
                </label>
                <label>
                    Sort by date
                    <select id='sort-order' value={sort} onChange={(e) => update('sort', e.target.value === 'desc' ? 'desc' : '')}>
                        <option value='asc'>Soonest first</option>
                        <option value='desc'>Latest first</option>
                    </select>
                </label>
                <label className='checkbox'>
                    <input type='checkbox' id='hide-past' checked={hidePast} onChange={(e) => update('hidePast', e.target.checked ? '1' : '')} />
                    Hide past events
                </label>
            </form>

            {events.loading && !events.data && <p className='status' aria-busy='true'>Loading events...</p>}
            {events.error && <p className='status error'>Could not load events. Please try again.</p>}
            {events.data && !events.error && (
                <>
                    <p className='status' id='events-count' aria-busy={events.loading}>{visible.length} event{visible.length === 1 ? '' : 's'}</p>
                    <div className='event-grid'>
                        {visible.map((e) => <Event key={e.id} event={e} showLocation />)}
                    </div>
                </>
            )}
        </div>
    )
}

export default Events
