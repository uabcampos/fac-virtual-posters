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
        <div className="relative h-screen w-full overflow-hidden bg-zinc-950 select-none">
            {/* Theatrical Lighting Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(30,58,138,0.15),transparent_70%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.05),transparent_50%)]" />

            {/* Floor perspective (Darker) */}
            <div className="absolute inset-x-0 bottom-0 h-[35vh] bg-gradient-to-t from-black to-transparent opacity-60" />

            {/* Exit/Controls Overlay */}
            <div className="absolute top-0 inset-x-0 z-50 p-6 flex items-center justify-between pointer-events-none">
                <Link
                    href={`/sessions/${sessionSlug}/posters`}
                    className="pointer-events-auto flex items-center gap-2 rounded-full bg-zinc-900/80 backdrop-blur-md px-5 py-2.5 text-sm font-black text-white shadow-2xl ring-1 ring-white/10 hover:bg-white hover:text-black transition-all group"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Exit Hall
                </Link>

                <div className="pointer-events-auto flex items-center gap-3">
                    <span className="hidden sm:block text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
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
                <div className="flex-shrink-0 hidden sm:block w-[20vw] h-1" />

                {/* Vertical Top Spacing (Mobile) */}
                <div className="flex-shrink-0 sm:hidden h-24 w-1" />

                {/* Poster Boards Row/Stack */}
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-16 sm:gap-[120px] pb-[5vh] px-6 sm:px-12">
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
                <div className="flex-shrink-0 hidden sm:block w-[20vw] h-1" />

                {/* Vertical Bottom Spacing (Mobile) */}
                <div className="flex-shrink-0 sm:hidden h-32 w-1" />
            </div>

            {/* Bottom Progress/Navigation */}
            <div className="absolute bottom-12 inset-x-0 z-50 flex items-center justify-center pointer-events-none">
                <div className="pointer-events-auto bg-zinc-900/90 backdrop-blur-xl rounded-full px-8 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/10 flex items-center gap-10">
                    <button
                        onClick={() => scrollRef.current?.scrollBy({ left: -500, behavior: 'smooth' })}
                        className="p-1 text-zinc-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="h-6 w-6" />
                    </button>

                    <div className="flex flex-col items-center">
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-0.5">
                            Spatial Gallery
                        </span>
                        <span className="text-xs font-bold text-white uppercase tracking-widest">
                            {posters.length} Posters Present
                        </span>
                    </div>

                    <button
                        onClick={() => scrollRef.current?.scrollBy({ left: 500, behavior: 'smooth' })}
                        className="p-1 text-zinc-400 hover:text-white transition-colors"
                    >
                        <ArrowRight className="h-6 w-6" />
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
