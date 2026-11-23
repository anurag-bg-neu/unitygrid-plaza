import { pool } from '../config/database.js'

const getLocations = async (req, res) => {
    try {
        const results = await pool.query('SELECT * FROM locations ORDER BY id')
        res.status(200).json(results.rows)
    } catch (error) {
        console.error('getLocations failed:', error)
        res.status(500).json({ error: 'Could not load locations' })
    }
}

const getLocationBySlug = async (req, res) => {
    try {
        const results = await pool.query('SELECT * FROM locations WHERE slug = $1', [req.params.slug])
        if (results.rows.length === 0) {
            return res.status(404).json({ error: 'Location not found' })
        }
        res.status(200).json(results.rows[0])
    } catch (error) {
        console.error('getLocationBySlug failed:', error)
        res.status(500).json({ error: 'Could not load location' })
    }
}

export default { getLocations, getLocationBySlug }
