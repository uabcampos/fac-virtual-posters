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
                className="group relative block"
            >
                {/* Square Poster Board Frame */}
                <div className="relative w-[380px] h-[380px] bg-white dark:bg-zinc-900 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] ring-1 ring-zinc-200 dark:ring-zinc-800 overflow-hidden transition-all duration-300 group-hover:scale-[1.05] group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.4)] group-hover:ring-blue-500/50">
                    {/* Poster Image - Perfect Centering */}
                    <div className="absolute inset-8 flex items-center justify-center rounded-lg overflow-hidden pointer-events-none">
                        {poster.posterImageUrl ? (
                            <Image
                                src={poster.posterImageUrl}
                                alt={poster.title}
                                fill
                                className="object-contain transition-all duration-500"
                                sizes="380px"
                                priority={index < 4}
                            />
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-zinc-400">
                                <span className="text-4xl font-black">{index + 1}</span>
                            </div>
                        )}

                        {/* Overlay to prevent reading text clearly at rest */}
                        <div className="absolute inset-0 bg-white/5 dark:bg-black/5 pointer-events-none" />
                    </div>

                    {/* Subtle Board Texture/Shadow */}
                    <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_40px_rgba(0,0,0,0.2)]" />
                </div>

                {/* Label Strip - High Design Typography */}
                <div className="mt-8 text-center space-y-2">
                    <div className="inline-flex items-center gap-2">
                        <span className="text-[10px] font-black text-blue-400 dark:text-blue-500 uppercase tracking-[0.3em] bg-blue-900/20 px-3 py-1 rounded-full ring-1 ring-blue-500/30 group-hover:bg-blue-600 group-hover:text-white group-hover:ring-blue-600 transition-all">
                            Poster No. {index + 1}
                        </span>
                    </div>
                    <h3 className="text-base font-black text-white line-clamp-1 px-6 tracking-tight group-hover:text-blue-400 transition-colors">
                        {poster.title}
                    </h3>
                    <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
                        {poster.scholarNames?.[0] || 'Researcher'}
                    </p>
                </div>
            </Link>
        </motion.div>
    )
}
