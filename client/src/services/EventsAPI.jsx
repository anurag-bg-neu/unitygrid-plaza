import { request } from './LocationsAPI'

const getAllEvents = ({ location, sort } = {}) => {
    const params = new URLSearchParams()
    if (location) params.set('location', location)
    if (sort) params.set('sort', sort)
    const query = params.toString()
    return request(`/api/events${query ? `?${query}` : ''}`)
}

const getEventById = (id) => request(`/api/events/${encodeURIComponent(id)}`)

export default { getAllEvents, getEventById }
