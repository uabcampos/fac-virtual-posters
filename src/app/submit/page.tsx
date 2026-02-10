import { SubmissionForm } from '@/components/submission/SubmissionForm'
import prisma from '@/lib/prisma'
import { SessionStatus } from '@prisma/client'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function ErrorState({ title, message }: { title: string; message: string }) {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center px-6">
            <div className="max-w-xl text-center">
                <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{title}</h1>
                <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">{message}</p>
            </div>
        </div>
    )
}

export default async function SubmitPage() {
    if (!process.env.DATABASE_URL) {
        return (
            <ErrorState
                title="Submissions unavailable"
                message="The database connection is not configured for this deployment."
            />
        )
    }

    let activeSession = null
    try {
        // Get the active session to display its name
        activeSession = await prisma.session.findFirst({
            where: { status: SessionStatus.LIVE },
            orderBy: { startAt: 'desc' }
        })
    } catch (error) {
        console.error('SubmitPage error:', error)
        return (
            <ErrorState
                title="Submissions unavailable"
                message="We ran into a problem loading the submission form. Please try again soon."
            />
        )
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
                        Submit Your Poster
                    </h1>
                    <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
                        {activeSession
                            ? `Share your research with the ${activeSession.name} community.`
                            : 'Join our research community and share your work.'}
                    </p>
                </div>

                <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800 sm:p-12">
                    <SubmissionForm sessionId={activeSession?.id} />
                </div>

                <p className="mt-8 text-center text-xs text-zinc-500">
                    Trouble with your submission? Contact support at support@fac-posters.org
                </p>
            </div>
        </div>
    )
}
