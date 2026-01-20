'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, Volume2 } from 'lucide-react'

interface AudioPlayerProps {
    textToSpeak: string
    scholarName?: string
}

export function AudioPlayer({ textToSpeak, scholarName }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [audioUrl, setAudioUrl] = useState<string | null>(null)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        // Cleanup audio URL on unmount
        return () => {
            if (audioUrl) URL.revokeObjectURL(audioUrl)
        }
    }, [audioUrl])

    const handlePlay = async () => {
        if (isPlaying && audioRef.current) {
            audioRef.current.pause()
            setIsPlaying(false)
            return
        }

        if (audioUrl && audioRef.current) {
            audioRef.current.play()
            setIsPlaying(true)
            return
        }

        // Fetch and play
        setIsLoading(true)
        try {
            const response = await fetch('/api/audio/speech', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: textToSpeak }),
            })

            if (!response.ok) throw new Error('Failed to generate audio')

            const data = await response.json()
            const binaryString = window.atob(data.audioContent)
            const bytes = new Uint8Array(binaryString.length)
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i)
            }
            const blob = new Blob([bytes], { type: 'audio/mp3' })
            const url = URL.createObjectURL(blob)

            setAudioUrl(url)

            // Create audio element if needed
            if (!audioRef.current) {
                audioRef.current = new Audio(url)
                audioRef.current.onended = () => setIsPlaying(false)
                audioRef.current.onpause = () => setIsPlaying(false)
                audioRef.current.onplay = () => setIsPlaying(true)
            } else {
                audioRef.current.src = url
            }

            audioRef.current.play()
            setIsPlaying(true)

        } catch (error) {
            console.error('TTS Error:', error)
            alert('Unable to play audio summary at this time.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 shadow-sm">
            <div className="flex items-center gap-4">
                <button
                    onClick={handlePlay}
                    disabled={isLoading}
                    className={`flex items-center justify-center h-12 w-12 rounded-full text-white transition-all shadow-md flex-shrink-0 ${isLoading ? 'bg-zinc-400 cursor-wait' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                >
                    {isLoading ? (
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : isPlaying ? (
                        <Pause className="h-5 w-5 fill-current" />
                    ) : (
                        <Play className="h-5 w-5 ml-1 fill-current" />
                    )}
                </button>

                <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                            Scholar Voice AI
                        </span>
                        <span className="text-[10px] font-medium text-zinc-400">
                            {isLoading ? 'Generating Audio...' : isPlaying ? 'Playing...' : 'Journey Neural Voice'}
                        </span>
                    </div>

                    {/* Visualizer Placeholder / Progress Bar */}
                    <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div
                            className={`h-full bg-blue-500 rounded-full transition-all duration-300 ${isPlaying ? 'animate-pulse w-2/3' : 'w-0'}`}
                        />
                    </div>

                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
                        Narrating takeaways from {scholarName || 'the researcher'}...
                    </p>
                </div>

                <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400">
                    <Volume2 className="h-4 w-4" />
                </div>
            </div>
        </div>
    )
}
