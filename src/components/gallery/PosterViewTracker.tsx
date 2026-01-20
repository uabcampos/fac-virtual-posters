'use client'

import { useEffect } from 'react'

interface PosterViewTrackerProps {
    posterId: string
}

export function PosterViewTracker({ posterId }: PosterViewTrackerProps) {
    useEffect(() => {
        // Increment view count on mount
        // We wrap this in a timeout or check if it's already been counted in this session if needed
        fetch(`/api/posters/${posterId}/view`, { method: 'POST' })
            .catch(err => console.error('Failed to track view:', err))
    }, [posterId])

    return null // This component doesn't render anything
}
