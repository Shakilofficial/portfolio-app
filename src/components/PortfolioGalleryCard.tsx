"use client"

import { Play } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

import { coverUrl, INDUSTRY_LABEL, isVideo } from "@/lib/portfolio"

import type { PortfolioItem } from "@/lib/portfolio"

interface PortfolioGalleryCardProps {
  item: PortfolioItem
  onOpen: () => void
}

export const PortfolioGalleryCard = ({ item, onOpen }: PortfolioGalleryCardProps) => {
  const [failed, setFailed] = useState(false)
  const cover = failed ? null : coverUrl(item)
  const mediaCount = item.imageUrls.length
  const eyebrow = item.service?.title ?? (item.industry ? INDUSTRY_LABEL[item.industry] : null)

  return (
    <button
      type="button"
      onClick={onOpen}
      data-testid="portfolio-card"
      data-slug={item.slug}
      aria-label={`Open ${item.title}`}
      className="group relative block w-full overflow-hidden rounded-lg text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative w-full aspect-4/5 overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950">
        {cover && isVideo(cover) ? (
          <>
            <video
              src={cover}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              muted
              playsInline
              preload="metadata"
              onError={() => setFailed(true)}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors duration-300">
              <Play className="h-16 w-16 text-white drop-shadow-lg fill-white" />
            </div>
          </>
        ) : cover ? (
          <Image
            src={cover}
            alt={item.title}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            onError={() => setFailed(true)}
            priority={false}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
            <span className="text-7xl font-black text-white/10">
              {item.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* Media Count Badge */}
        {mediaCount > 1 && (
          <div className="absolute top-4 right-4 inline-flex items-center gap-2 rounded-lg bg-black/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md border border-white/10">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400" />
            {mediaCount} images
          </div>
        )}
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/90 to-black/20 p-6 pt-12">
        {eyebrow && (
          <p className="text-blue-400 text-xs font-bold tracking-widest uppercase mb-2">
            {eyebrow}
          </p>
        )}
        <h3 className="text-lg font-bold text-white leading-tight mb-1 group-hover:text-blue-200 transition-colors">
          {item.title}
        </h3>
        {item.clientName && (
          <p className="text-sm text-gray-300 mb-3">{item.clientName}</p>
        )}
        <div className="flex items-center gap-2 text-blue-400 text-sm font-semibold opacity-0 transform translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0">
          <span>Explore project</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Hover Border Effect */}
      <div className="absolute inset-0 pointer-events-none rounded-lg border border-white/0 group-hover:border-white/10 transition-colors duration-300" />
    </button>
  )
}
