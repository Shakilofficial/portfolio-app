"use client"

import { ArrowLeft, ArrowRight, X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

import { INDUSTRY_LABEL, portfolioSlides } from "@/lib/portfolio"

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

  const [shownIndex, setShownIndex] = useState(index)
  const [direction, setDirection] = useState(1)
  if (shownIndex !== index) {
    setDirection(index > shownIndex ? 1 : -1)
    setShownIndex(index)
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
      if (event.key === "ArrowRight" && hasNext) onNavigate(index + 1)
      if (event.key === "ArrowLeft" && hasPrev) onNavigate(index - 1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [index, hasNext, hasPrev, onClose, onNavigate])

  if (!item) return null

  const slides = portfolioSlides(item)
  const current = slides[slide] ?? slides[0]
  const industry = item.industry ? INDUSTRY_LABEL[item.industry] : null

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
      className="fixed inset-0 z-110 flex items-stretch justify-center bg-black/80 backdrop-blur-md sm:items-center sm:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.4, ease: EASE_OUT }}
        onClick={(event) => event.stopPropagation()}
        className="bg-bg text-ink relative flex h-full w-full max-w-7xl flex-col overflow-hidden sm:h-[min(92svh,860px)] sm:rounded-3xl"
      >
        {/* Progress through the collection */}
        <div className="bg-border absolute inset-x-0 top-0 z-20 h-0.5">
          <motion.div
            className="h-full origin-left"
            style={{ backgroundImage: "var(--gradient-accent)" }}
            initial={false}
            animate={{ scaleX: (index + 1) / Math.max(items.length, 1) }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
          />
        </div>

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="bg-bg/80 border-border hover:bg-ink hover:text-bg absolute top-4 right-4 z-30 flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-md transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[minmax(0,1fr)_380px] lg:overflow-hidden">
          {/* Stage */}
          <div className="bg-bg-3 relative flex flex-col lg:min-h-0">
            <div className="relative flex h-[60svh] items-center justify-center p-4 pt-16 sm:p-8 lg:h-auto lg:flex-1">
              <AnimatePresence mode="wait" custom={direction} initial={false}>
                <motion.div
                  key={`${item.id}-${slide}`}
                  initial={{ opacity: 0, x: 60 * direction }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 * direction }}
                  transition={{ duration: 0.4, ease: EASE_OUT }}
                  className="relative h-full w-full"
                >
                  {!current ? (
                    <div className="text-ink-soft flex h-full items-center justify-center text-sm">
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
                      className="object-contain"
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {hasPrev && (
                <button
                  type="button"
                  onClick={() => onNavigate(index - 1)}
                  aria-label="Previous project"
                  className="absolute left-3 z-10 rounded-full bg-black/40 p-2 text-white transition-colors hover:bg-black/60"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}
              {hasNext && (
                <button
                  type="button"
                  onClick={() => onNavigate(index + 1)}
                  aria-label="Next project"
                  className="absolute right-3 z-10 rounded-full bg-black/40 p-2 text-white transition-colors hover:bg-black/60"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              )}
            </div>

            {slides.length > 1 && (
              <div className="flex gap-2 overflow-x-auto px-4 pb-4 sm:px-8" role="tablist">
                {slides.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-selected={i === slide}
                    aria-label={`Media ${i + 1}`}
                    onClick={() => setSlide(i)}
                    className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-md transition-opacity ${
                      i === slide ? "ring-accent ring-2" : "opacity-60 hover:opacity-90"
                    }`}
                  >
                    {s.kind === "video" ? (
                      <video
                        src={s.url}
                        className="h-full w-full object-cover"
                        muted
                        preload="metadata"
                      />
                    ) : (
                      <Image src={s.url} alt="" fill unoptimized className="object-cover" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="border-border bg-bg flex flex-col gap-6 border-t p-6 lg:overflow-y-auto lg:border-t-0 lg:border-l">
            {(item.service || industry) && (
              <p className="text-accent-text text-xs font-bold tracking-widest uppercase">
                {item.service?.title ?? industry}
              </p>
            )}
            <h2 className="pr-10 text-3xl leading-tight font-bold">{item.title}</h2>

            {item.clientName && (
              <div>
                <p className="text-ink-soft text-xs font-medium tracking-wide uppercase">Client</p>
                <p className="mt-1 text-lg font-semibold">{item.clientName}</p>
              </div>
            )}

            {item.description && (
              <div>
                <p className="text-ink-soft text-xs font-medium tracking-wide uppercase">About</p>
                <p className="mt-2 text-sm leading-relaxed whitespace-pre-line">
                  {item.description}
                </p>
              </div>
            )}

            <p className="text-ink-soft mt-auto font-mono text-xs">
              {index + 1} / {items.length}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
