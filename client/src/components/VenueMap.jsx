import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import plaza from '../assets/unitygrid.jpg'
import '../css/VenueMap.css'

// Places the hover label above the top-center of a polygon.
const labelAnchor = (points) => {
    const coords = points.trim().split(/\s+/).map((pair) => pair.split(',').map(Number))
    const xs = coords.map(([x]) => x)
    const ys = coords.map(([, y]) => y)
    const x = (Math.min(...xs) + Math.max(...xs)) / 2
    const y = Math.max(Math.min(...ys) + 40, 60)
    return { x: Math.min(Math.max(x, 140), 860), y }
}

const VenueMap = ({ locations }) => {
    const navigate = useNavigate()
    const [active, setActive] = useState(null)

    const go = (slug) => navigate(`/locations/${slug}`)

    return (
        <div className='venue-map'>
            <svg viewBox='0 0 1000.32 500' role='group' aria-label='Map of UnityGrid Plaza venues'>
                <image href={plaza} width='1000.32' height='500' preserveAspectRatio='xMidYMid slice' />

                {locations.map((location) => (
                    <polygon
                        key={location.id}
                        id={`venue-${location.slug}`}
                        className={active === location.slug ? 'active' : ''}
                        points={location.map_points}
                        role='link'
                        tabIndex={0}
                        aria-label={`${location.name}: view events`}
                        onClick={() => go(location.slug)}
                        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), go(location.slug))}
                        onMouseEnter={() => setActive(location.slug)}
                        onMouseLeave={() => setActive(null)}
                        onFocus={() => setActive(location.slug)}
                        onBlur={() => setActive(null)}
                    />
                ))}

                {locations.map((location) => {
                    const { x, y } = labelAnchor(location.map_points)
                    // Rough width for 17px uppercase bold text, plus padding.
                    const width = location.name.length * 13 + 40
                    return (
                        <g
                            key={location.id}
                            className={`venue-label${active === location.slug ? ' visible' : ''}`}
                            transform={`translate(${x} ${y})`}
                            aria-hidden='true'
                        >
                            <rect x={-width / 2} y='-22' width={width} height='44' rx='22' />
                            <text textAnchor='middle' dominantBaseline='central'>{location.name}</text>
                        </g>
                    )
                })}
            </svg>
            <p className='venue-map-hint'>Hover over a building and click it to see what&apos;s happening there.</p>
        </div>
    )
}

export default VenueMap
