import React from 'react'
import { useRoutes, Link, NavLink } from 'react-router-dom'
import Locations from './pages/Locations'
import LocationEvents from './pages/LocationEvents'
import Events from './pages/Events'
import NotFound from './pages/NotFound'
import './App.css'

const App = () => {
    let element = useRoutes([
        {
            path: '/',
            element: <Locations />
        },
        {
            path: '/locations/:slug',
            element: <LocationEvents />
        },
        {
            path: '/events',
            element: <Events />
        },
        {
            path: '*',
            element: <NotFound />
        }
    ])

    return (
        <div className='app'>
            <header className='main-header'>
                <Link to='/' className='brand'>
                    <h1>UnityGrid Plaza</h1>
                    <p>Your city&apos;s community events, one building at a time</p>
                </Link>

                <nav className='header-buttons'>
                    <NavLink to='/' end role='button'>Home</NavLink>
                    <NavLink to='/events' role='button'>Events</NavLink>
                </nav>
            </header>

            <main>
                {element}
            </main>

            <footer className='main-footer'>UnityGrid Plaza · WEB103 Project 3</footer>
        </div>
    )
}

export default App
