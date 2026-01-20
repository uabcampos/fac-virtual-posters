'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal } from 'lucide-react'
import { useCallback, useState, useTransition } from 'react'

interface PosterFiltersProps {
    tags: string[]
}

export function PosterFilters({ tags }: PosterFiltersProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()

    const [query, setQuery] = useState(searchParams.get('q') || '')

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            if (value) {
                params.set(name, value)
            } else {
                params.delete(name)
            }
            return params.toString()
        },
        [searchParams]
    )

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        startTransition(() => {
            router.push(pathname + '?' + createQueryString('q', query))
        })
    }

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        startTransition(() => {
            router.push(pathname + '?' + createQueryString('sort', e.target.value))
        })
    }

    const handleTagChange = (tag: string) => {
        const currentTag = searchParams.get('tag')
        const newTag = currentTag === tag ? '' : tag
        startTransition(() => {
            router.push(pathname + '?' + createQueryString('tag', newTag))
        })
    }

    return (
        <div className="mb-10 space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                {/* Search */}
                <form onSubmit={handleSearch} className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search by title, scholar, or institution..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                    />
                </form>

                {/* Sort */}
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-zinc-400" />
                    <select
                        defaultValue={searchParams.get('sort') || 'recently_active'}
                        onChange={handleSortChange}
                        className="rounded-xl border border-zinc-200 bg-white py-2 px-3 text-sm outline-none focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                    >
                        <option value="recently_active">Recently Active</option>
                        <option value="most_commented">Most Commented</option>
                        <option value="az">A – Z</option>
                    </select>
                </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <button
                        key={tag}
                        onClick={() => handleTagChange(tag)}
                        className={cn(
                            "rounded-full px-4 py-1.5 text-xs font-semibold transition-all",
                            searchParams.get('tag') === tag
                                ? "bg-blue-600 text-white"
                                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                        )}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            {isPending && <div className="h-0.5 w-full animate-pulse bg-blue-500" />}
        </div>
    )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}
