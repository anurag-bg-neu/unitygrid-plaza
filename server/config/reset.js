import { pool } from './database.js'
import locations from '../data/locations.js'
import events from '../data/events.js'

const createTables = `
    DROP TABLE IF EXISTS events;
    DROP TABLE IF EXISTS locations;

    CREATE TABLE locations (
        id          SERIAL PRIMARY KEY,
        slug        VARCHAR(60)  NOT NULL UNIQUE,
        name        VARCHAR(100) NOT NULL,
        tagline     VARCHAR(200) NOT NULL,
        description TEXT         NOT NULL,
        address     VARCHAR(150) NOT NULL,
        city        VARCHAR(80)  NOT NULL,
        state       CHAR(2)      NOT NULL,
        zip         VARCHAR(10)  NOT NULL,
        image       TEXT         NOT NULL,
        map_points  TEXT         NOT NULL
    );

    CREATE TABLE events (
        id          SERIAL PRIMARY KEY,
        location_id INTEGER      NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
        title       VARCHAR(150) NOT NULL,
        description TEXT         NOT NULL,
        category    VARCHAR(50)  NOT NULL,
        starts_at   TIMESTAMPTZ  NOT NULL,
        image       TEXT         NOT NULL
    );

    CREATE INDEX events_location_id_starts_at_idx ON events (location_id, starts_at);
`

const startTime = ({ days_from_now, hour }) => {
    const date = new Date()
    date.setDate(date.getDate() + days_from_now)
    date.setHours(hour, 0, 0, 0)
    return date
}

const reset = async () => {
    const client = await pool.connect()
    try {
        await client.query('BEGIN')
        await client.query(createTables)
        console.log('🏙️  locations and events tables created')

        const ids = {}
        for (const l of locations) {
            const { rows } = await client.query(
                `INSERT INTO locations (slug, name, tagline, description, address, city, state, zip, image, map_points)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
                [l.slug, l.name, l.tagline, l.description, l.address, l.city, l.state, l.zip, l.image, l.map_points]
            )
            ids[l.slug] = rows[0].id
            console.log(`📍 ${l.name}`)
        }

        for (const e of events) {
            await client.query(
                `INSERT INTO events (location_id, title, description, category, starts_at, image)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [ids[e.location], e.title, e.description, e.category, startTime(e), e.image]
            )
            console.log(`   🎟️  ${e.title}`)
        }

        await client.query('COMMIT')
        console.log(`✅ seeded ${locations.length} locations and ${events.length} events`)
    } catch (err) {
        await client.query('ROLLBACK')
        throw err
    } finally {
        client.release()
        await pool.end()
    }
}

reset().catch((err) => {
    console.error('⚠️  reset failed:', err.message)
    process.exitCode = 1
})
