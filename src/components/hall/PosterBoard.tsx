'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Poster } from '@prisma/client'

interface PosterBoardProps {
    poster: Poster
    sessionSlug: string
    index: number
}

export function PosterBoard({ poster, sessionSlug, index }: PosterBoardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex-shrink-0 snap-center"
        >
            <Link
                href={`/sessions/${sessionSlug}/posters/${poster.slug}`}
                className="group relative block flex flex-col items-center"
            >
                {/* Square Poster Board Frame - Blended Dark Theme */}
                <div className="relative w-[380px] h-[380px] bg-zinc-900/40 backdrop-blur-sm rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/10 overflow-hidden transition-all duration-300 group-hover:scale-[1.05] group-hover:shadow-blue-500/20 group-hover:ring-blue-500/40">
                    {/* Inner Spotlight Glow on hover */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Poster Image - Perfect Geometric Centering */}
                    <div className="absolute inset-8 flex items-center justify-center pointer-events-none">
                        {poster.posterImageUrl ? (
                            <div className="relative w-full h-full flex items-center justify-center">
                                <Image
                                    src={poster.posterImageUrl}
                                    alt={poster.title}
                                    fill
                                    className="object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-500"
                                    sizes="380px"
                                    priority={index < 4}
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-zinc-600">
                                <span className="text-4xl font-black">{index + 1}</span>
                            </div>
                        )}
                    </div>

                    {/* Glass Surface Reflect */}
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/5 to-transparent" />
                </div>

                {/* Label Strip - Perfectly Centered Relative to Board */}
                <div className="mt-10 text-center w-full max-w-[380px] flex flex-col items-center space-y-3">
                    <div className="inline-flex items-center gap-2">
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] bg-blue-950/40 px-4 py-1.5 rounded-full ring-1 ring-blue-500/30 group-hover:bg-blue-600 group-hover:text-white group-hover:ring-blue-600 transition-all shadow-lg">
                            POSTER NO. {index + 1}
                        </span>
                    </div>
                    <h3 className="text-lg font-black text-white line-clamp-2 px-6 tracking-tight leading-tight group-hover:text-blue-400 transition-colors">
                        {poster.title}
                    </h3>
                    <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.25em]">
                        {poster.scholarNames?.[0] || 'Researcher'}
                    </p>
                </div>
            </Link>
        </motion.div>
    )
}
