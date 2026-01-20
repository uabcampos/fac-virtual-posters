'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, Volume2 } from 'lucide-react'

interface AudioPlayerProps {
    audioUrl?: string | null
    scholarName?: string
}

export function AudioPlayer({ audioUrl, scholarName }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        if (!audioUrl) return

        if (!audioRef.current) {
            audioRef.current = new Audio(audioUrl)
            audioRef.current.onended = () => setIsPlaying(false)
            audioRef.current.onpause = () => setIsPlaying(false)
            audioRef.current.onplay = () => setIsPlaying(true)
        } else {
            audioRef.current.src = audioUrl
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause()
            }
        }
    }, [audioUrl])

    const handlePlay = async () => {
        if (!audioUrl || !audioRef.current) return

        if (isPlaying && audioRef.current) {
            audioRef.current.pause()
            setIsPlaying(false)
            return
        }

        setIsLoading(true)
        try {
            await audioRef.current.play()
            setIsPlaying(true)
        } catch (error) {
            console.error('TTS Error:', error)
            alert('Unable to play the audio guide at this time.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 shadow-sm">
            <div className="flex items-center gap-4">
                <button
                    onClick={handlePlay}
                    disabled={isLoading || !audioUrl}
                    className={`flex items-center justify-center h-12 w-12 rounded-full text-white transition-all shadow-md flex-shrink-0 ${isLoading || !audioUrl ? 'bg-zinc-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
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
                            Scholar Audio Guide
                        </span>
                        <span className="text-[10px] font-medium text-zinc-400">
                            {audioUrl ? (isLoading ? 'Loading Audio...' : isPlaying ? 'Playing...' : 'Ready') : 'Audio Coming Soon'}
                        </span>
                    </div>

                    {/* Visualizer Placeholder / Progress Bar */}
                    <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div
                            className={`h-full bg-blue-500 rounded-full transition-all duration-300 ${isPlaying ? 'animate-pulse w-2/3' : 'w-0'}`}
                        />
                    </div>

                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
                        {audioUrl
                            ? `Narrating takeaways from ${scholarName || 'the researcher'}...`
                            : 'Audio guide is not available yet.'}
                    </p>
                </div>

                <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400">
                    <Volume2 className="h-4 w-4" />
                </div>
            </div>
        </div>
    )
}
