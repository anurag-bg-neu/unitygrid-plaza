import { pool } from '../config/database.js'

// Joined with locations so the client can show where each event happens.
const SELECT_EVENTS = `
    SELECT e.*, l.slug AS location_slug, l.name AS location_name
    FROM events e
    JOIN locations l ON l.id = e.location_id
`

const getEvents = async (req, res) => {
    const { location } = req.query
    const order = req.query.sort === 'desc' ? 'DESC' : 'ASC'

    try {
        const results = location
            ? await pool.query(`${SELECT_EVENTS} WHERE l.slug = $1 ORDER BY e.starts_at ${order}`, [location])
            : await pool.query(`${SELECT_EVENTS} ORDER BY e.starts_at ${order}`)
        res.status(200).json(results.rows)
    } catch (error) {
        console.error('getEvents failed:', error)
        res.status(500).json({ error: 'Could not load events' })
    }
}

const getEventById = async (req, res) => {
    const id = Number(req.params.id)
    if (!Number.isInteger(id)) {
        return res.status(400).json({ error: 'Event id must be an integer' })
    }

    try {
        const results = await pool.query(`${SELECT_EVENTS} WHERE e.id = $1`, [id])
        if (results.rows.length === 0) {
            return res.status(404).json({ error: 'Event not found' })
        }
        res.status(200).json(results.rows[0])
    } catch (error) {
        console.error('getEventById failed:', error)
        res.status(500).json({ error: 'Could not load event' })
    }
}

const getEventsByLocation = async (req, res) => {
    try {
        const location = await pool.query('SELECT id FROM locations WHERE slug = $1', [req.params.slug])
        if (location.rows.length === 0) {
            return res.status(404).json({ error: 'Location not found' })
        }
        const results = await pool.query(
            `${SELECT_EVENTS} WHERE e.location_id = $1 ORDER BY e.starts_at`,
            [location.rows[0].id]
        )
        res.status(200).json(results.rows)
    } catch (error) {
        console.error('getEventsByLocation failed:', error)
        res.status(500).json({ error: 'Could not load events for this location' })
    }
}

export default { getEvents, getEventById, getEventsByLocation }
