import { useEffect, useState } from 'react'

// Runs an async loader whenever `deps` change and tracks { data, error, loading }.
// Stale responses from earlier runs are ignored.
const useAsync = (loader, deps) => {
    const [state, setState] = useState({ data: null, error: null, loading: true })

    useEffect(() => {
        let active = true
        setState((s) => ({ ...s, loading: true, error: null }))
        loader()
            .then((data) => active && setState({ data, error: null, loading: false }))
            .catch((error) => active && setState({ data: null, error, loading: false }))
        return () => { active = false }
    }, deps) // eslint-disable-line react-hooks/exhaustive-deps

    return state
}

export default useAsync
