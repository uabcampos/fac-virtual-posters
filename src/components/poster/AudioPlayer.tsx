'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, Volume2 } from 'lucide-react'

interface AudioPlayerProps {
    textToSpeak: string
    scholarName?: string
}

export function AudioPlayer({ textToSpeak, scholarName }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [isSupported, setIsSupported] = useState(false)
    const [progress, setProgress] = useState(0)
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if ('speechSynthesis' in window) {
            setIsSupported(true)
        }
    }, [])

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
            window.speechSynthesis.cancel()
        }
    }, [])

    const handlePlay = () => {
        if (!isSupported) return

        if (isPlaying) {
            window.speechSynthesis.pause()
            setIsPlaying(false)
            if (intervalRef.current) clearInterval(intervalRef.current)
        } else {
            if (window.speechSynthesis.paused) {
                window.speechSynthesis.resume()
                setIsPlaying(true)
            } else {
                const utterance = new SpeechSynthesisUtterance(textToSpeak)
                utteranceRef.current = utterance

                // Select a good voice if available
                const voices = window.speechSynthesis.getVoices()
                const preferredVoice = voices.find(v => v.lang === 'en-US' && v.name.includes('Google')) || voices[0]
                if (preferredVoice) utterance.voice = preferredVoice

                utterance.pitch = 1
                utterance.rate = 0.9

                utterance.onend = () => {
                    setIsPlaying(false)
                    setProgress(100)
                    if (intervalRef.current) clearInterval(intervalRef.current)
                }

                utterance.onstart = () => {
                    setIsPlaying(true)
                    // Fake progress bar since speech synthesis doesn't give duration
                    let p = 0
                    intervalRef.current = setInterval(() => {
                        p += 1
                        if (p > 95) p = 95
                        setProgress(p)
                    }, 100) // Rough estimate speed
                }

                window.speechSynthesis.speak(utterance)
            }
        }
    }

    if (!isSupported) return null

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 shadow-sm">
            <div className="flex items-center gap-4">
                <button
                    onClick={handlePlay}
                    className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md flex-shrink-0"
                >
                    {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 ml-1 fill-current" />}
                </button>

                <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                            Scholar Voice AI
                        </span>
                        <span className="text-[10px] font-medium text-zinc-400">
                            {isPlaying ? 'Playing...' : 'Listen to Summary'}
                        </span>
                    </div>

                    <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
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
