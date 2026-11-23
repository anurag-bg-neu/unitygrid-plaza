import { useEffect, useState } from 'react'

// Re-renders the caller every `interval` ms with the current timestamp.
const useNow = (interval = 1000) => {
    const [now, setNow] = useState(() => Date.now())

    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), interval)
        return () => clearInterval(id)
    }, [interval])

    return now
}

export default useNow
