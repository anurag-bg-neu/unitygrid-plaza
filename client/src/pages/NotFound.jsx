import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = ({ message = 'This page does not exist.' }) => (
    <div className='not-found'>
        <h2>404</h2>
        <p>{message}</p>
        <Link to='/' role='button'>Back to the plaza</Link>
    </div>
)

export default NotFound
