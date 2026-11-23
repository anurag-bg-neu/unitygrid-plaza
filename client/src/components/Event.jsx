import React from 'react'
import { Link } from 'react-router-dom'
import useNow from '../hooks/useNow'
import { formatAgo, formatDate, formatDuration, formatTime } from '../utils/dates'
import '../css/Event.css'

const Event = ({ event, showLocation = false }) => {
    const now = useNow(1000)
    const remaining = new Date(event.starts_at).getTime() - now
    const isPast = remaining <= 0

    return (
        <article className={`event-card${isPast ? ' event-past' : ''}`} data-testid='event-card'>
            <div className='event-image'>
                <img src={event.image} alt='' loading='lazy' />
                <span className='event-category'>{event.category}</span>
            </div>

            <div className='event-body'>
                <h3 className='event-title'>{event.title}</h3>
                <p className='event-when'>
                    <time dateTime={event.starts_at}>{formatDate(event.starts_at)} · {formatTime(event.starts_at)}</time>
                </p>
                {showLocation && (
                    <p className='event-location'>
                        📍 <Link to={`/locations/${event.location_slug}`}>{event.location_name}</Link>
                    </p>
                )}
                <p className='event-description'>{event.description}</p>

                {isPast ? (
                    <p className='event-countdown ended' id={`remaining-${event.id}`}>
                        Event ended {formatAgo(remaining)}
                    </p>
                ) : (
                    <p className='event-countdown' id={`remaining-${event.id}`}>
                        Starts in <strong>{formatDuration(remaining)}</strong>
                    </p>
                )}
            </div>
        </article>
    )
}

export default Event
