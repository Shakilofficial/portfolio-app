"use client"

import { ArrowLeft, ArrowRight, X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import Image from "next/image"
import { useEffect, useState } from "react"

interface PortfolioAsset {
  id: string
  kind: string
  storageKey: string
  url?: string
  width: number | null
  height: number | null
  durationSec: number | null
  caption: string | null
  sortOrder: number
}

interface PortfolioItem {
  id: string
  slug: string
  title: string
  description?: string | null
  clientName?: string | null
  sortOrder: number
  isFeatured: boolean
  assets: PortfolioAsset[]
  service?: {
    id: string
    name: string
  }
}

interface PortfolioDialogProps {
  items: PortfolioItem[]
  index: number
  total: number | null
  onClose: () => void
  onNavigate: (index: number) => void
}

const EASE_OUT = [0.16, 1, 0.3, 1] as const

function buildAssetUrl(asset: PortfolioAsset | string): string {
  if (typeof asset === "object" && asset.url) {
    const url = asset.url
    if (!url.startsWith("http") && !url.startsWith("/")) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://vizualgraphics.com"
      return `${apiUrl}/${url}`
    }
    if (url.startsWith("/")) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://vizualgraphics.com"
      return `${apiUrl}${url}`
    }
    return url
  }

  const storageKey = typeof asset === "string" ? asset : asset.storageKey
  if (storageKey.startsWith("http")) {
    return storageKey
  }
  if (storageKey.startsWith("/")) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://vizualgraphics.com"
    return `${apiUrl}${storageKey}`
  }
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://vizualgraphics.com"
  return `${apiUrl}/uploads/${storageKey}`
}

export const PortfolioDialog = ({
  items,
  index,
  total,
  onClose,
  onNavigate,
}: PortfolioDialogProps) => {
  const item = items[index]
  const prev = index > 0 ? items[index - 1] : undefined
  const next = index < items.length - 1 ? items[index + 1] : undefined
  const [slide, setSlide] = useState(0)
  const [slideFor, setSlideFor] = useState(item?.id)

  // Reset to the first slide whenever the item changes
  if (item && slideFor !== item.id) {
    setSlideFor(item.id)
    setSlide(0)
  }

  // Direction of travel (+1 next, -1 previous)
  const [shownIndex, setShownIndex] = useState(index)
  const [direction, setDirection] = useState(1)
  if (shownIndex !== index) {
    setDirection(index > shownIndex ? 1 : -1)
    setShownIndex(index)
  }

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight" && next) onNavigate(index + 1)
      if (e.key === "ArrowLeft" && prev) onNavigate(index - 1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [index, next, prev, onClose, onNavigate])

  if (!item) return null

  const media = item.assets[slide] ?? item.assets[0]

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-110 flex items-stretch justify-center bg-black/80 p-0 backdrop-blur-md sm:items-center sm:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.4, ease: EASE_OUT }}
        onClick={(e) => e.stopPropagation()}
        className="bg-bg text-ink relative flex h-full w-full max-w-7xl flex-col overflow-hidden sm:h-[min(92svh,860px)] sm:rounded-3xl"
      >
        {/* Progress bar */}
        <div className="absolute inset-x-0 top-0 z-20 h-0.5 bg-border">
          <motion.div
            className="h-full origin-left"
            style={{ backgroundImage: "var(--gradient-accent)" }}
            initial={false}
            animate={{ scaleX: (index + 1) / Math.max(total ?? items.length, 1) }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
          />
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="bg-bg/80 border-border hover:bg-ink hover:text-bg absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-md transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[minmax(0,1fr)_380px] lg:overflow-hidden">
          {/* Stage - Image Display */}
          <div className="bg-bg-3 relative flex flex-col lg:min-h-0">
            <div className="relative flex flex-1 items-center justify-center p-4 sm:p-8">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={`${item.id}-${slide}`}
                  custom={direction}
                  initial={{ opacity: 0, x: 80 * direction, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -80 * direction, scale: 0.96 }}
                  transition={{ duration: 0.45, ease: EASE_OUT }}
                  className="relative flex h-full w-full items-center justify-center"
                >
                  {media && media.kind === "image" ? (
                    <div className="relative h-[60svh] w-full lg:h-full flex items-center justify-center">
                      <Image
                        src={buildAssetUrl(media)}
                        alt={media.caption || item.title}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 60vw, 50vw"
                      />
                    </div>
                  ) : media && media.kind === "video" ? (
                    <video
                      key={media.storageKey}
                      src={buildAssetUrl(media)}
                      className="h-full w-full object-contain"
                      controls
                      autoPlay
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-black">
                      <div className="text-center">
                        <div className="mb-2 text-6xl font-black opacity-20" style={{ color: "var(--ink)" }}>
                          {item.title.charAt(0).toUpperCase()}
                        </div>
                        <p className="text-sm opacity-40" style={{ color: "var(--ink-soft)" }}>
                          No media
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation arrows */}
              {prev && (
                <button
                  type="button"
                  onClick={() => onNavigate(index - 1)}
                  aria-label="Previous item"
                  className="absolute left-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <ArrowLeft className="h-6 w-6 text-white" />
                </button>
              )}
              {next && (
                <button
                  type="button"
                  onClick={() => onNavigate(index + 1)}
                  aria-label="Next item"
                  className="absolute right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <ArrowRight className="h-6 w-6 text-white" />
                </button>
              )}
            </div>

            {/* Slide thumbnails */}
            {item.assets.length > 1 && (
              <div className="flex gap-2 overflow-x-auto px-4 pb-4 sm:px-8">
                {item.assets.map((asset, i) => (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => setSlide(i)}
                    className={`relative h-16 w-20 flex-shrink-0 overflow-hidden rounded transition-opacity ${
                      i === slide ? "ring-2 ring-accent" : "opacity-50 hover:opacity-75"
                    }`}
                  >
                    {asset.kind === "image" ? (
                      <Image
                        src={buildAssetUrl(asset)}
                        alt={asset.caption || `Asset ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <video
                        src={buildAssetUrl(asset)}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details panel */}
          <div className="border-border flex flex-col gap-6 overflow-y-auto border-l bg-bg p-6 lg:max-h-full">
            {/* Service */}
            {item.service && (
              <div>
                <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--color-accent)" }}>
                  {item.service.name}
                </p>
              </div>
            )}

            {/* Title */}
            <div>
              <h2 className="text-3xl font-bold" style={{ color: "var(--ink)" }}>
                {item.title}
              </h2>
            </div>

            {/* Client */}
            {item.clientName && (
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--ink-soft)" }}>
                  Client
                </p>
                <p className="mt-1 text-lg font-semibold" style={{ color: "var(--ink)" }}>
                  {item.clientName}
                </p>
              </div>
            )}

            {/* Description */}
            {item.description && (
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--ink-soft)" }}>
                  About
                </p>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--ink)" }}>
                  {item.description}
                </p>
              </div>
            )}

            {/* Asset count */}
            {item.assets.length > 0 && (
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--ink-soft)" }}>
                  Assets
                </p>
                <p className="mt-1" style={{ color: "var(--ink)" }}>
                  {item.assets.length} {item.assets.length === 1 ? "file" : "files"}
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
