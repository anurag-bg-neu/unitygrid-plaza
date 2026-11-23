import React from 'react'
import { Link } from 'react-router-dom'
import LocationsAPI from '../services/LocationsAPI'
import useAsync from '../hooks/useAsync'
import VenueMap from '../components/VenueMap'
import '../css/Locations.css'

const Locations = () => {
    const { data: locations, error, loading } = useAsync(() => LocationsAPI.getAllLocations(), [])

    if (loading) return <p className='status' aria-busy='true'>Loading the plaza...</p>
    if (error) return <p className='status error'>Could not load locations. Is the API server running and connected to the database?</p>

    return (
        <div className='available-locations'>
            <section className='intro'>
                <h2>Choose a venue</h2>
                <p>Four landmarks, one community. Click a building on the plaza map to see its events.</p>
            </section>

            <VenueMap locations={locations} />

            <section className='venue-cards' aria-label='Venues'>
                {locations.map((location) => (
                    <Link key={location.id} to={`/locations/${location.slug}`} className='venue-card'>
                        <img src={location.image} alt='' />
                        <div>
                            <h3>{location.name}</h3>
                            <p>{location.tagline}</p>
                        </div>
                    </Link>
                ))}
            </section>
        </div>
    )
}

export default Locations
