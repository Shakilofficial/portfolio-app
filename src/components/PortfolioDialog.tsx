"use client"

import { ArrowLeft, ArrowRight, X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

import { portfolioSlides } from "@/lib/portfolio"

import type { PortfolioItem } from "@/lib/portfolio"

interface PortfolioDialogProps {
  items: PortfolioItem[]
  index: number
  onClose: () => void
  onNavigate: (index: number) => void
}

const EASE_OUT = [0.16, 1, 0.3, 1] as const

export const PortfolioDialog = ({ items, index, onClose, onNavigate }: PortfolioDialogProps) => {
  const item = items[index]
  const hasPrev = index > 0
  const hasNext = index < items.length - 1
  const closeRef = useRef<HTMLButtonElement>(null)

  const [slide, setSlide] = useState(0)
  const [slideFor, setSlideFor] = useState(item?.id)
  if (item && slideFor !== item.id) {
    setSlideFor(item.id)
    setSlide(0)
  }

  const slides = item ? portfolioSlides(item) : []
  const slideCount = slides.length
  const current = slides[slide] ?? slides[0]

  const goPrev = () => {
    if (slide > 0) setSlide((s) => s - 1)
    else if (hasPrev) onNavigate(index - 1)
  }
  const goNext = () => {
    if (slide < slideCount - 1) setSlide((s) => s + 1)
    else if (hasNext) onNavigate(index + 1)
  }

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
      if (event.key === "ArrowRight") goNext()
      if (event.key === "ArrowLeft") goPrev()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slide, slideCount, hasNext, hasPrev, index, onClose, onNavigate])

  if (!item) return null

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      data-testid="portfolio-dialog"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-110 flex items-center justify-center bg-[#0b0a08]/97"
      onClick={onClose}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-5 right-5 z-30 flex h-9 w-9 items-center justify-center text-[#ece6d6]/70 transition-colors hover:text-[#ece6d6]"
      >
        <X className="h-5 w-5" strokeWidth={1.5} />
      </button>

      {slides.length > 1 && (
        <p
          className="absolute top-6 left-6 z-30 text-xs text-[#ece6d6]/50 italic"
          style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
        >
          {slide + 1} / {slides.length}
        </p>
      )}

      {/* Stage */}
      <div
        className="relative flex h-full w-full items-center justify-center p-4 sm:p-10 lg:p-16"
        onClick={(event) => event.stopPropagation()}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${item.id}-${slide}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
            className="relative h-full w-full"
          >
            {!current ? (
              <div className="flex h-full items-center justify-center text-sm text-[#ece6d6]/50">
                No media
              </div>
            ) : current.kind === "video" ? (
              <video
                key={current.url}
                src={current.url}
                className="h-full w-full object-contain"
                controls
                playsInline
              />
            ) : (
              <Image
                src={current.url}
                alt={item.title}
                fill
                unoptimized
                priority
                className="object-contain"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {(hasPrev || slide > 0) && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              goPrev()
            }}
            aria-label="Previous"
            className="absolute left-2 z-10 flex h-11 w-11 items-center justify-center text-[#ece6d6]/50 transition-colors hover:text-[#ece6d6] sm:left-4"
          >
            <ArrowLeft className="h-6 w-6" strokeWidth={1.25} />
          </button>
        )}
        {(hasNext || slide < slides.length - 1) && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              goNext()
            }}
            aria-label="Next"
            className="absolute right-2 z-10 flex h-11 w-11 items-center justify-center text-[#ece6d6]/50 transition-colors hover:text-[#ece6d6] sm:right-4"
          >
            <ArrowRight className="h-6 w-6" strokeWidth={1.25} />
          </button>
        )}
      </div>

      {/* Dot indicators — slideshow wayfinding, no project details shown */}
      {slides.length > 1 && (
        <div
          className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2"
          onClick={(event) => event.stopPropagation()}
        >
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to image ${i + 1}`}
              onClick={() => setSlide(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === slide ? "w-5 bg-[#c49a56]" : "w-1.5 bg-[#ece6d6]/25 hover:bg-[#ece6d6]/40"
              }`}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}
