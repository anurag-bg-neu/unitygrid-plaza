const request = async (url) => {
    const response = await fetch(url)
    if (!response.ok) {
        const error = new Error(`Request to ${url} failed with ${response.status}`)
        error.status = response.status
        throw error
    }
    return response.json()
}

const getAllLocations = () => request('/api/locations')

const getLocationBySlug = (slug) => request(`/api/locations/${encodeURIComponent(slug)}`)

const getLocationEvents = (slug) => request(`/api/locations/${encodeURIComponent(slug)}/events`)

export { request }
export default { getAllLocations, getLocationBySlug, getLocationEvents }
