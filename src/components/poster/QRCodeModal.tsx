'use client'

import { QRCodeCanvas } from 'qrcode.react'
import { Download, Share2, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface QRCodeModalProps {
    url: string
    title: string
    posterNumber: number
}

export function QRCodeModal({ url, title, posterNumber }: QRCodeModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [fullUrl, setFullUrl] = useState('')
    const qrRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setFullUrl(`${window.location.origin}${url}`)
        }
    }, [url])

    const downloadQR = () => {
        const canvas = qrRef.current?.querySelector('canvas')
        if (canvas) {
            const pngUrl = canvas.toDataURL('image/png')
            const downloadLink = document.createElement('a')
            downloadLink.href = pngUrl
            downloadLink.download = `poster-${posterNumber}-qr.png`
            document.body.appendChild(downloadLink)
            downloadLink.click()
            document.body.removeChild(downloadLink)
        }
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors uppercase tracking-wider"
            >
                <Share2 className="h-4 w-4" />
                Share / QR
            </button>
        )
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl ring-1 ring-zinc-200 dark:ring-zinc-800 relative animate-in zoom-in-95 duration-200">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="text-center space-y-6">
                    <div>
                        <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 mb-4">
                            <Share2 className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-black text-zinc-900 dark:text-white">Share this Poster</h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
                            Scan to view on mobile or share with colleagues.
                        </p>
                    </div>

                    <div className="flex justify-center" ref={qrRef}>
                        <div className="p-4 bg-white rounded-xl shadow-sm ring-1 ring-zinc-100">
                            {fullUrl && (
                                <QRCodeCanvas
                                    value={fullUrl}
                                    size={200}
                                    level={"H"}
                                    includeMargin={true}
                                    imageSettings={{
                                        src: "https://static.vecteezy.com/system/resources/previews/010/353/284/original/blue-lightning-bolt-icon-on-white-background-thunderbolt-logo-flash-lighting-thunder-icons-simple-lightning-strike-sign-vector.jpg",
                                        x: undefined,
                                        y: undefined,
                                        height: 24,
                                        width: 24,
                                        excavate: true,
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            onClick={downloadQR}
                            className="w-full flex items-center justify-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
                        >
                            <Download className="h-4 w-4" />
                            Download QR Code
                        </button>
                        <p className="text-[10px] text-zinc-400 mt-3 uppercase tracking-widest">
                            Poster #{posterNumber} • {title.substring(0, 20)}...
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
