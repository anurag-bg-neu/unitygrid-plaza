const dateFormat = new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
const timeFormat = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' })

export const formatDate = (iso) => dateFormat.format(new Date(iso))

export const formatTime = (iso) => timeFormat.format(new Date(iso))

const pad = (n) => String(n).padStart(2, '0')

// Turns a millisecond difference into "3d 04h 12m 09s" (or "04h 12m 09s" when under a day).
export const formatDuration = (ms) => {
    const total = Math.floor(Math.abs(ms) / 1000)
    const days = Math.floor(total / 86400)
    const hours = Math.floor((total % 86400) / 3600)
    const minutes = Math.floor((total % 3600) / 60)
    const seconds = total % 60
    const clock = `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`
    return days > 0 ? `${days}d ${clock}` : clock
}

// Coarse "3 days ago" style text for events that already happened.
export const formatAgo = (ms) => {
    const minutes = Math.floor(Math.abs(ms) / 60000)
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
    const days = Math.floor(hours / 24)
    return `${days} day${days === 1 ? '' : 's'} ago`
}
