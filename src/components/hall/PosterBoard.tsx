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
                {/* Poster Board Frame */}
                <div className="relative w-[320px] h-[480px] bg-white dark:bg-zinc-900 rounded-lg shadow-xl ring-1 ring-zinc-200 dark:ring-zinc-800 overflow-hidden transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-2xl group-hover:ring-blue-500/50">
                    {/* Poster Image */}
                    <div className="absolute inset-4 flex items-center justify-center bg-zinc-50 dark:bg-zinc-800/50 rounded pointer-events-none">
                        {poster.posterImageUrl ? (
                            <Image
                                src={poster.posterImageUrl}
                                alt={poster.title}
                                fill
                                className="object-contain p-2 blur-[1px] group-hover:blur-0 transition-all duration-500"
                                sizes="320px"
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

                {/* Label Strip */}
                <div className="mt-6 text-center space-y-1">
                    <div className="inline-flex items-center gap-2">
                        <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full ring-1 ring-blue-100 dark:ring-blue-800/50 group-hover:bg-blue-600 group-hover:text-white group-hover:ring-blue-600 transition-colors">
                            Poster #{index + 1}
                        </span>
                    </div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1 px-4 group-hover:text-blue-600 transition-colors">
                        {poster.title}
                    </h3>
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        {poster.scholarNames?.[0] || 'Unknown Scholar'}
                    </p>
                </div>
            </Link>
        </motion.div>
    )
}
