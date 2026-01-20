'use client'

import { useRef, useEffect } from 'react'
import { PosterBoard } from './PosterBoard'
import { Poster } from '@prisma/client'
import { motion, useScroll, useSpring } from 'framer-motion'
import { ArrowLeft, ArrowRight, Expand } from 'lucide-react'
import Link from 'next/link'

interface PosterHallProps {
    posters: Poster[]
    sessionSlug: string
}

export function PosterHall({ posters, sessionSlug }: PosterHallProps) {
    const scrollRef = useRef<HTMLDivElement>(null)

    // Handle vertical wheel to horizontal scroll
    useEffect(() => {
        const el = scrollRef.current
        if (!el) return

        const handleWheel = (e: WheelEvent) => {
            if (e.deltaY === 0) return

            // On mobile/trackpads with natural horizontal scrolling, don't interfere
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return

            e.preventDefault()
            el.scrollLeft += e.deltaY * 1.5 // Easing/multiplication for "walking" feel
        }

        el.addEventListener('wheel', handleWheel, { passive: false })
        return () => el.removeEventListener('wheel', handleWheel)
    }, [])

    return (
        <div className="relative h-screen w-full overflow-hidden bg-zinc-50 dark:bg-black select-none">
            {/* Background Perspective Lines (Subtle Architecture) */}
            <div className="absolute inset-x-0 top-[20%] h-px bg-zinc-200 dark:bg-zinc-800 opacity-50" />
            <div className="absolute inset-x-0 bottom-[25%] h-px bg-zinc-200 dark:bg-zinc-800 opacity-50" />

            {/* Exit/Controls Overlay */}
            <div className="absolute top-0 inset-x-0 z-50 p-6 flex items-center justify-between pointer-events-none">
                <Link
                    href={`/sessions/${sessionSlug}/posters`}
                    className="pointer-events-auto flex items-center gap-2 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-5 py-2.5 text-sm font-black text-zinc-900 dark:text-white shadow-xl ring-1 ring-zinc-200 dark:ring-zinc-800 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all group"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Exit Hall
                </Link>

                <div className="pointer-events-auto flex items-center gap-3">
                    <span className="hidden sm:block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
                        Use Mouse Wheel or Swipe to Explore
                    </span>
                </div>
            </div>

            {/* Scrollable Track */}
            <div
                ref={scrollRef}
                className="h-full w-full overflow-x-auto overflow-y-auto sm:overflow-y-hidden snap-x snap-y snap-mandatory no-scrollbar flex flex-col sm:flex-row sm:items-center"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {/* Horizontal Padding Area (Desktop) */}
                <div className="flex-shrink-0 hidden sm:block w-[15vw] h-1" />

                {/* Vertical Top Spacing (Mobile) */}
                <div className="flex-shrink-0 sm:hidden h-24 w-1" />

                {/* Poster Boards Row/Stack */}
                <div className="flex flex-col sm:flex-row items-center sm:items-end gap-12 sm:gap-[64px] pb-[10vh] px-6 sm:px-0">
                    {posters.map((poster, index) => (
                        <PosterBoard
                            key={poster.id}
                            poster={poster}
                            sessionSlug={sessionSlug}
                            index={index}
                        />
                    ))}
                </div>

                {/* Horizontal Padding Area (Desktop) */}
                <div className="flex-shrink-0 hidden sm:block w-[15vw] h-1" />

                {/* Vertical Bottom Spacing (Mobile) */}
                <div className="flex-shrink-0 sm:hidden h-32 w-1" />
            </div>

            {/* Bottom Progress/Navigation */}
            <div className="absolute bottom-12 inset-x-0 z-50 flex items-center justify-center pointer-events-none">
                <div className="pointer-events-auto bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-full px-6 py-3 shadow-2xl ring-1 ring-zinc-200 dark:ring-zinc-800 flex items-center gap-8">
                    <button
                        onClick={() => scrollRef.current?.scrollBy({ left: -400, behavior: 'smooth' })}
                        className="p-1 hover:text-blue-600 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-widest">
                            Exploring {posters.length} Posters
                        </span>
                    </div>

                    <button
                        onClick={() => scrollRef.current?.scrollBy({ left: 400, behavior: 'smooth' })}
                        className="p-1 hover:text-blue-600 transition-colors"
                    >
                        <ArrowRight className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    )
}
