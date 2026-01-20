'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, ArrowLeft, Upload, CheckCircle2, FileText, User, Image as ImageIcon, Loader2 } from 'lucide-react'

interface SubmissionFormProps {
    sessionId?: string
}

export function SubmissionForm({ sessionId }: SubmissionFormProps) {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        scholarNames: '',
        institutions: '',
        tags: '',
        whyThisMatters: '', // New field
        summaryProblem: '',
        summaryAudience: '',
        summaryMethods: '',
        summaryFindings: '',
        summaryChange: '',
        welcomeMessage: '',
        feedbackPrompt: '',
    })

    const [files, setFiles] = useState<{
        poster: File | null
        photo: File | null
    }>({
        poster: null,
        photo: null
    })

    // Handlers
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'poster' | 'photo') => {
        if (e.target.files?.[0]) {
            setFiles(prev => ({ ...prev, [field]: e.target.files![0] }))
        }
    }

    const nextStep = () => setStep(prev => prev + 1)
    const prevStep = () => setStep(prev => prev - 1)

    const uploadFile = async (file: File) => {
        const uploadFormData = new FormData()
        uploadFormData.append('file', file)
        const res = await fetch('/api/upload', {
            method: 'POST',
            body: uploadFormData
        })
        if (!res.ok) throw new Error('Upload failed')
        return await res.json()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!sessionId) {
            setError('No active session found for submission.')
            return
        }

        setIsSubmitting(true)
        setError(null)

        try {
            // 1. Upload files
            let posterPath = ''
            let photoPath = ''

            if (files.poster) {
                const posterRes = await uploadFile(files.poster)
                posterPath = posterRes.url
            }

            if (files.photo) {
                const photoRes = await uploadFile(files.photo)
                photoPath = photoRes.url
            }

            // 2. Submit to database
            const res = await fetch('/api/posters/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    sessionId,
                    posterImageUrl: posterPath,
                    posterPdfUrl: files.poster?.type === 'application/pdf' ? posterPath : null,
                    scholarPhotoUrl: photoPath,
                    scholarNames: formData.scholarNames.split(',').map(s => s.trim()),
                    institutions: formData.institutions.split(',').map(i => i.trim()),
                    tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
                })
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Submission failed')
            }

            setStep(4) // Success step
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-8">
            {/* Progress Bar */}
            {step < 4 && (
                <div className="relative mb-8">
                    <div className="flex justify-between mb-2">
                        {[1, 2, 3].map((s) => (
                            <span key={s} className={`text-xs font-bold uppercase tracking-wider ${step === s ? 'text-blue-600' : 'text-zinc-400'}`}>
                                Step {s}: {s === 1 ? 'Details' : s === 2 ? 'Summary' : 'Media'}
                            </span>
                        ))}
                    </div>
                    <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800">
                        <div
                            className="h-full rounded-full bg-blue-600 transition-all duration-500"
                            style={{ width: `${(step - 1) * 50}%` }}
                        />
                    </div>
                </div>
            )}

            {error && (
                <div className="rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
                    {error}
                </div>
            )}

            {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="col-span-2">
                            <label className="mb-2 block text-sm font-bold text-zinc-900 dark:text-zinc-200">Poster Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleTextChange}
                                placeholder="e.g., The Impact of Urban Green Spaces on Community Wellness"
                                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-bold text-zinc-900 dark:text-zinc-200">Scholars (comma separated)</label>
                            <input
                                type="text"
                                name="scholarNames"
                                value={formData.scholarNames}
                                onChange={handleTextChange}
                                placeholder="Jane Doe, John Smith"
                                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-bold text-zinc-900 dark:text-zinc-200">Institutions</label>
                            <input
                                type="text"
                                name="institutions"
                                value={formData.institutions}
                                onChange={handleTextChange}
                                placeholder="University of Science, City College"
                                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                                required
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="mb-2 block text-sm font-bold text-zinc-900 dark:text-zinc-200">Why this matters (short hook)</label>
                            <input
                                type="text"
                                name="whyThisMatters"
                                value={formData.whyThisMatters}
                                onChange={handleTextChange}
                                placeholder="e.g., Green spaces reduce stress levels by 40% in urban areas."
                                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                                required
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="mb-2 block text-sm font-bold text-zinc-900 dark:text-zinc-200">Tags (optional, comma separated)</label>
                            <input
                                type="text"
                                name="tags"
                                value={formData.tags}
                                onChange={handleTextChange}
                                placeholder="Biology, Sustainability, Urban Planning"
                                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                            />
                        </div>
                    </div>
                    <button
                        onClick={nextStep}
                        disabled={!formData.title || !formData.scholarNames || !formData.institutions || !formData.whyThisMatters}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 font-bold text-white shadow-lg transition-all hover:bg-blue-700 disabled:opacity-50"
                    >
                        Next: Summary <ArrowRight className="h-5 w-5" />
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="space-y-6">
                        <div>
                            <label className="mb-2 block text-sm font-bold text-zinc-900 dark:text-zinc-200">What problem does this address?</label>
                            <textarea
                                name="summaryProblem"
                                value={formData.summaryProblem}
                                onChange={handleTextChange}
                                rows={3}
                                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white resize-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-bold text-zinc-900 dark:text-zinc-200">Who does it matter to?</label>
                            <textarea
                                name="summaryAudience"
                                value={formData.summaryAudience}
                                onChange={handleTextChange}
                                rows={3}
                                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white resize-none"
                                required
                            />
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-bold text-zinc-900 dark:text-zinc-200">What did you do?</label>
                                <textarea
                                    name="summaryMethods"
                                    value={formData.summaryMethods}
                                    onChange={handleTextChange}
                                    rows={5}
                                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white resize-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-bold text-zinc-900 dark:text-zinc-200">What did you find?</label>
                                <textarea
                                    name="summaryFindings"
                                    value={formData.summaryFindings}
                                    onChange={handleTextChange}
                                    rows={5}
                                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white resize-none"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-bold text-zinc-900 dark:text-zinc-200">What could this change?</label>
                            <textarea
                                name="summaryChange"
                                value={formData.summaryChange}
                                onChange={handleTextChange}
                                rows={3}
                                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white resize-none"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={prevStep}
                            className="flex items-center gap-2 rounded-2xl bg-zinc-100 px-8 py-4 font-bold text-zinc-600 transition-all hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
                        >
                            <ArrowLeft className="h-5 w-5" /> Back
                        </button>
                        <button
                            onClick={nextStep}
                            disabled={!formData.summaryProblem || !formData.summaryFindings}
                            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 font-bold text-white shadow-lg transition-all hover:bg-blue-700 disabled:opacity-50"
                        >
                            Next: Media <ArrowRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="grid gap-8 sm:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-bold text-zinc-900 dark:text-zinc-200">Upload Poster (PDF or high-res JPG)</label>
                            <div className={`relative flex aspect-[4/3] flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all ${files.poster ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : 'border-zinc-200 bg-zinc-50 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950'}`}>
                                <input
                                    type="file"
                                    onChange={(e) => handleFileChange(e, 'poster')}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    className="absolute inset-0 cursor-pointer opacity-0"
                                />
                                {files.poster ? (
                                    <div className="text-center">
                                        <FileText className="mx-auto mb-2 h-10 w-10 text-blue-600" />
                                        <p className="max-w-[150px] truncate text-xs font-bold text-blue-800 dark:text-blue-400">{files.poster.name}</p>
                                        <p className="text-[10px] text-zinc-500">Click to replace</p>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <Upload className="mx-auto mb-2 h-10 w-10 text-zinc-400" />
                                        <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400">Select Poster File</p>
                                        <p className="mt-1 text-[10px] text-zinc-500">PDF, JPG, or PNG (Max 10MB)</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-bold text-zinc-900 dark:text-zinc-200">Scholar Photo (optional)</label>
                            <div className={`relative flex aspect-[4/3] flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all ${files.photo ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : 'border-zinc-200 bg-zinc-50 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950'}`}>
                                <input
                                    type="file"
                                    onChange={(e) => handleFileChange(e, 'photo')}
                                    accept=".jpg,.jpeg,.png"
                                    className="absolute inset-0 cursor-pointer opacity-0"
                                />
                                {files.photo ? (
                                    <div className="text-center">
                                        <User className="mx-auto mb-2 h-10 w-10 text-blue-600" />
                                        <p className="max-w-[150px] truncate text-xs font-bold text-blue-800 dark:text-blue-400">{files.photo.name}</p>
                                        <p className="text-[10px] text-zinc-500">Click to replace</p>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <ImageIcon className="mx-auto mb-2 h-10 w-10 text-zinc-400" />
                                        <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400">Select Photo</p>
                                        <p className="mt-1 text-[10px] text-zinc-500">Optional (JPG or PNG)</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="col-span-2 space-y-6">
                            <div>
                                <label className="mb-2 block text-sm font-bold text-zinc-900 dark:text-zinc-200">Welcome Message (optional)</label>
                                <input
                                    type="text"
                                    name="welcomeMessage"
                                    value={formData.welcomeMessage}
                                    onChange={handleTextChange}
                                    placeholder="e.g., Hi! Excited to share my research on local biodiversity."
                                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-bold text-zinc-900 dark:text-zinc-200">What would you love feedback on?</label>
                                <input
                                    type="text"
                                    name="feedbackPrompt"
                                    value={formData.feedbackPrompt}
                                    onChange={handleTextChange}
                                    placeholder="e.g., My methodology or potential for future application."
                                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={prevStep}
                            className="flex items-center gap-2 rounded-2xl bg-zinc-100 px-8 py-4 font-bold text-zinc-600 transition-all hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
                        >
                            <ArrowLeft className="h-5 w-5" /> Back
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !files.poster}
                            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 font-bold text-white shadow-lg transition-all hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" /> Submitting...
                                </>
                            ) : (
                                <>
                                    Submit Poster <CheckCircle2 className="h-5 w-5" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {step === 4 && (
                <div className="py-12 text-center animate-in zoom-in-95 duration-500">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30">
                        <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <h2 className="mb-2 text-3xl font-extrabold text-zinc-900 dark:text-white">Submission Successful!</h2>
                    <p className="mx-auto max-w-md text-lg text-zinc-600 dark:text-zinc-400 mb-8">
                        Your poster has been received and is currently under review. You'll receive an email once it's published to the gallery.
                    </p>
                    <button
                        onClick={() => router.push('/')}
                        className="rounded-2xl bg-zinc-900 px-8 py-4 font-bold text-white transition-all hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                    >
                        Return Home
                    </button>
                </div>
            )}
        </div>
    )
}
