"use client"

import Image from "next/image"
import { useRef, useState } from "react"

import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from "react"

interface BeforeAfterSliderProps {
  beforeImageUrl: string
  afterImageUrl: string
  alt: string
}

// Drag-handle before/after comparison — same approach as vizualgraphics'
// public BeforeAfterSlider (both images `fill` the frame; the before image is
// revealed via clip-path so nothing distorts while dragging).
export const BeforeAfterSlider = ({
  beforeImageUrl,
  afterImageUrl,
  alt,
}: BeforeAfterSliderProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const [position, setPosition] = useState(50)

  const updatePosition = (clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect || rect.width === 0) return
    const percent = ((clientX - rect.left) / rect.width) * 100
    setPosition(Math.min(100, Math.max(0, percent)))
  }

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    isDragging.current = true
    containerRef.current?.setPointerCapture(event.pointerId)
    updatePosition(event.clientX)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
    // Keep the dialog's own arrow-key item navigation from firing too.
    event.stopPropagation()
    event.preventDefault()
    setPosition((p) => Math.min(100, Math.max(0, p + (event.key === "ArrowRight" ? 5 : -5))))
  }

  return (
    <div
      ref={containerRef}
      data-testid="before-after-slider"
      role="slider"
      tabIndex={0}
      aria-label={`${alt} before/after comparison`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(position)}
      onPointerDown={onPointerDown}
      onPointerMove={(event) => isDragging.current && updatePosition(event.clientX)}
      onPointerUp={() => (isDragging.current = false)}
      onPointerCancel={() => (isDragging.current = false)}
      onKeyDown={onKeyDown}
      className="bg-bg-3 relative h-full w-full cursor-ew-resize touch-none overflow-hidden rounded-xl select-none focus-visible:outline-2"
    >
      <Image
        src={afterImageUrl}
        alt={`${alt} — after`}
        fill
        unoptimized
        draggable={false}
        className="object-contain"
      />
      <Image
        src={beforeImageUrl}
        alt={`${alt} — before`}
        fill
        unoptimized
        draggable={false}
        className="object-contain"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      />

      <div
        aria-hidden
        className="bg-accent absolute inset-y-0 w-0.5 shadow-lg"
        style={{ left: `${position}%` }}
      >
        <div className="bg-accent absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white shadow-lg">
          <div className="flex gap-0.5">
            <span className="h-0 w-0 border-t-4 border-r-4 border-b-4 border-t-transparent border-r-[#020e27] border-b-transparent" />
            <span className="h-0 w-0 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent border-l-[#020e27]" />
          </div>
        </div>
      </div>

      <span className="absolute top-3 left-3 rounded-full bg-black/60 px-2 py-1 text-[10px] font-bold tracking-[0.06em] text-white uppercase">
        Before
      </span>
      <span className="absolute top-3 right-3 rounded-full bg-black/60 px-2 py-1 text-[10px] font-bold tracking-[0.06em] text-white uppercase">
        After
      </span>
    </div>
  )
}
