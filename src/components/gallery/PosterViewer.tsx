'use client'

import React, { useState } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { ZoomIn, ZoomOut, Maximize, RotateCcw, Download, Loader2 } from 'lucide-react'
import { Document, Page, pdfjs } from 'react-pdf'

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

interface PosterViewerProps {
    imageUrl: string
    pdfUrl?: string | null
}

export function PosterViewer({ imageUrl, pdfUrl }: PosterViewerProps) {
    const [numPages, setNumPages] = useState<number | null>(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [loading, setLoading] = useState(true)

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages)
        setLoading(false)
    }

    return (
        <div className="relative flex flex-col gap-4">
            {/* Controls */}
            <div className="absolute top-4 left-4 z-10 flex gap-2">
                <div className="flex bg-black/50 backdrop-blur-md rounded-lg p-1 border border-white/10">
                    <ControlButton icon={<ZoomIn className="h-4 w-4" />} label="Zoom In" onClick={() => { }} />
                    <ControlButton icon={<ZoomOut className="h-4 w-4" />} label="Zoom Out" onClick={() => { }} />
                    <ControlButton icon={<RotateCcw className="h-4 w-4" />} label="Reset" onClick={() => { }} />
                </div>
                <div className="flex bg-black/50 backdrop-blur-md rounded-lg p-1 border border-white/10">
                    <ControlButton icon={<Maximize className="h-4 w-4" />} label="Fullscreen" onClick={() => { }} />
                </div>
            </div>

            {/* Viewer */}
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800 shadow-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
                {loading && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur-sm">
                        <Loader2 className="h-8 w-8 animate-spin text-forge-teal mb-2" />
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Loading High-Res Poster...</p>
                    </div>
                )}

                <TransformWrapper
                    initialScale={1}
                    minScale={0.5}
                    maxScale={5}
                    centerOnInit
                >
                    {({ zoomIn, zoomOut, resetTransform }) => (
                        <>
                            {/* Interactive Controls Overlay */}
                            <div className="absolute top-4 left-4 z-10 flex gap-2">
                                <div className="flex bg-black/50 backdrop-blur-md rounded-lg p-1 border border-white/10">
                                    <ControlButton icon={<ZoomIn className="h-4 w-4" />} label="Zoom In" onClick={() => zoomIn()} />
                                    <ControlButton icon={<ZoomOut className="h-4 w-4" />} label="Zoom Out" onClick={() => zoomOut()} />
                                    <ControlButton icon={<RotateCcw className="h-4 w-4" />} label="Reset" onClick={() => resetTransform()} />
                                </div>
                            </div>

                            <TransformComponent
                                wrapperStyle={{ width: '100%', height: '100%' }}
                                contentStyle={{ width: '100%', height: '100%' }}
                            >
                                <div className="flex items-center justify-center h-full w-full p-4">
                                    {pdfUrl ? (
                                        <Document
                                            file={pdfUrl}
                                            onLoadSuccess={onDocumentLoadSuccess}
                                            loading={null}
                                            className="shadow-2xl"
                                        >
                                            <Page
                                                pageNumber={pageNumber}
                                                renderMode="svg"
                                                width={1000} // Base width for coordinates, transform-wrapper handles zooming
                                                className="max-w-full h-auto"
                                                loading={null}
                                            />
                                        </Document>
                                    ) : (
                                        <img
                                            src={imageUrl}
                                            alt="Poster"
                                            className="h-full w-full object-contain"
                                        />
                                    )}
                                </div>
                            </TransformComponent>
                        </>
                    )}
                </TransformWrapper>
            </div>

            {/* Download Action */}
            <div className="flex justify-center">
                <a
                    href={pdfUrl || imageUrl}
                    download
                    className="flex items-center gap-2 rounded-full bg-forge-teal px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-forge-teal/90 hover:scale-105 active:scale-95"
                >
                    <Download className="h-4 w-4" />
                    Take this with you
                </a>
            </div>
        </div>
    )
}

function ControlButton({
    icon,
    onClick,
    label
}: {
    icon: React.ReactNode;
    onClick: () => void;
    label: string
}) {
    return (
        <button
            onClick={onClick}
            title={label}
            className="p-2 text-white hover:bg-white/20 rounded-md transition-colors"
        >
            {icon}
        </button>
}
