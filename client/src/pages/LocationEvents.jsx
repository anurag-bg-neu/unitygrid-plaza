import React from 'react'
import { Link, useParams } from 'react-router-dom'
import Event from '../components/Event'
import LocationsAPI from '../services/LocationsAPI'
import useAsync from '../hooks/useAsync'
import useNow from '../hooks/useNow'
import NotFound from './NotFound'
import '../css/LocationEvents.css'

const LocationEvents = () => {
    const { slug } = useParams()
    const { data, error, loading } = useAsync(
        () => Promise.all([LocationsAPI.getLocationBySlug(slug), LocationsAPI.getLocationEvents(slug)]),
        [slug]
    )
    // Re-split upcoming/past once a minute so events move to "Past" without a reload.
    const now = useNow(60000)

    if (loading) return <p className='status' aria-busy='true'>Loading venue...</p>
    if (error?.status === 404) return <NotFound message='That venue is not on the plaza map.' />
    if (error) return <p className='status error'>Could not load this venue. Please try again.</p>

    const [location, events] = data
    const upcoming = events.filter((e) => new Date(e.starts_at).getTime() > now)
    const past = events.filter((e) => new Date(e.starts_at).getTime() <= now).reverse()

    return (
        <div className='location-events'>
            <header className='location-hero'>
                <img className='location-image' src={location.image} alt={location.name} />
                <div className='location-info'>
                    <p className='eyebrow'>Venue</p>
                    <h2>{location.name}</h2>
                    <p className='tagline'>{location.tagline}</p>
                    <p>{location.description}</p>
                    <p className='address'>📍 {location.address}, {location.city}, {location.state} {location.zip}</p>
                    <p className='counts'>
                        <span>{upcoming.length} upcoming</span>
                        <span>{past.length} past</span>
                        <Link to={`/events?location=${location.slug}`}>See in all events →</Link>
                    </p>
                </div>
            </header>

            {events.length === 0 ? (
                <h3 className='status'>No events scheduled at this location yet!</h3>
            ) : (
                <>
                    <section>
                        <h3 className='section-title'>Upcoming events</h3>
                        {upcoming.length > 0
                            ? <div className='event-grid'>{upcoming.map((e) => <Event key={e.id} event={e} />)}</div>
                            : <p className='status'>Nothing upcoming here right now.</p>}
                    </section>
                    {past.length > 0 && (
                        <section>
                            <h3 className='section-title'>Past events</h3>
                            <div className='event-grid'>{past.map((e) => <Event key={e.id} event={e} />)}</div>
                        </section>
                    )}
                </>
            )}
        </div>
    )
}

export default LocationEvents
