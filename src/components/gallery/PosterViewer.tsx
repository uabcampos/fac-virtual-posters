'use client'

import React from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { ZoomIn, ZoomOut, Maximize, RotateCcw, Download } from 'lucide-react'

interface PosterViewerProps {
    imageUrl: string
    pdfUrl?: string | null
}

export function PosterViewer({ imageUrl, pdfUrl }: PosterViewerProps) {
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
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800 shadow-2xl border border-zinc-200 dark:border-zinc-800">
                <TransformWrapper
                    initialScale={1}
                    minScale={0.5}
                    maxScale={4}
                    centerOnInit
                >
                    {({ zoomIn, zoomOut, resetTransform }) => (
                        <>
                            {/* Overriding the default controls to use the buttons above */}
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
                                <img
                                    src={imageUrl}
                                    alt="Poster"
                                    className="h-full w-full object-contain"
                                />
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
                    className="flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-blue-700 hover:scale-105 active:scale-95"
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
    )
}
