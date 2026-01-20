import Link from 'next/link'
import { ArrowRight, GalleryVertical, Send, ShieldCheck } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black font-sans">
      {/* Header Branding */}
      <header className="bg-forge-teal px-6 py-4 shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-white/20">
              <span className="text-xl font-black text-forge-teal">F</span>
            </div>
            <h1 className="text-lg font-bold tracking-tight text-white sm:text-xl">
              Forge AHEAD Center Virtual Posters
            </h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center sm:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-10 flex justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-forge-teal/80 ring-1 ring-forge-teal/20 hover:ring-forge-teal/40 dark:text-zinc-400 dark:ring-zinc-800 dark:hover:ring-zinc-700">
              Now accepting poster submissions for 2026.{' '}
              <Link href="/submit" className="font-semibold text-brand-blue dark:text-blue-400">
                <span className="absolute inset-0" aria-hidden="true" />
                Submit yours here <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-zinc-900 sm:text-6xl dark:text-zinc-100">
            Bridging Health Equity Through Innovation
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Explore our virtual poster sessions featuring the latest research and initiatives from the Forge AHEAD Center scholars.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/sessions/live-session/posters"
              className="rounded-full bg-forge-teal px-8 py-4 text-sm font-bold text-white shadow-lg hover:bg-forge-blue transition-all flex items-center gap-2"
            >
              <GalleryVertical className="h-4 w-4" />
              Enter Gallery
            </Link>
            <Link
              href="/submit"
              className="text-sm font-bold leading-6 text-zinc-900 dark:text-zinc-100 flex items-center gap-2 hover:opacity-70 transition-opacity"
            >
              Become a Scholar <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mx-auto mt-24 max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            <FeatureCard
              icon={<GalleryVertical className="text-brand-blue" />}
              title="Interactive Viewer"
              description="High-resolution poster viewing with precision zoom and pan features for a deep-dive experience."
            />
            <FeatureCard
              icon={<Send className="text-forge-teal" />}
              title="Direct Engagement"
              description="Connect directly with scholars through our structured conversation panels and feedback system."
            />
            <FeatureCard
              icon={<ShieldCheck className="text-zinc-600" />}
              title="Moderated Content"
              description="A curated environment ensuring high-quality research and professional academic discourse."
            />
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-12 text-center text-sm text-zinc-500">
        <div className="flex justify-center gap-6 mb-4">
          <Link href="/admin" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-full text-xs font-bold">
            Admin Access
          </Link>
        </div>
        <p>&copy; 2026 FAC Virtual Poster Sessions. All rights reserved.</p>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
        {icon}
      </div>
      <h3 className="text-base font-bold leading-7 text-zinc-900 dark:text-zinc-100">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {description}
      </p>
    </div>
  )
}
