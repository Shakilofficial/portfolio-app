"use client"

import { Columns2, Images, PlayCircle } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

import { coverUrl, hasComparison, INDUSTRY_LABEL, isVideo } from "@/lib/portfolio"

import type { PortfolioItem } from "@/lib/portfolio"

interface PortfolioGalleryCardProps {
  item: PortfolioItem
  onOpen: () => void
}

export const PortfolioGalleryCard = ({ item, onOpen }: PortfolioGalleryCardProps) => {
  const [failed, setFailed] = useState(false)
  const cover = failed ? null : coverUrl(item)
  const comparison = hasComparison(item)
  const mediaCount = item.galleryUrls.length + (comparison ? 1 : 0)
  const eyebrow = item.service?.title ?? (item.industry ? INDUSTRY_LABEL[item.industry] : null)

  return (
    <button
      type="button"
      onClick={onOpen}
      data-testid="portfolio-card"
      data-slug={item.slug}
      aria-label={`Open ${item.title}`}
      className="group bg-bg-3 focus-visible:outline-accent relative block aspect-4/5 w-full overflow-hidden rounded-2xl text-left shadow-(--shadow-card) transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-2"
    >
      {cover && isVideo(cover) ? (
        <>
          <video
            src={cover}
            className="h-full w-full object-cover"
            muted
            playsInline
            preload="metadata"
            onError={() => setFailed(true)}
          />
          <PlayCircle className="absolute top-1/2 left-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 text-white drop-shadow-lg" />
        </>
      ) : cover ? (
        <Image
          src={cover}
          alt={item.title}
          fill
          unoptimized
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          data-testid="card-placeholder"
          className="flex h-full w-full items-center justify-center bg-linear-to-br from-[#0a1d45] to-[#01040d]"
        >
          <span className="text-6xl font-black text-white/20">
            {item.title.charAt(0).toUpperCase()}
          </span>
        </div>
      )}

      {/* Badges */}
      <div className="absolute top-3 right-3 left-3 flex justify-between gap-2">
        {comparison ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold tracking-[0.06em] text-white uppercase backdrop-blur-sm">
            <Columns2 className="h-3 w-3" /> Before / After
          </span>
        ) : (
          <span />
        )}
        {mediaCount > 1 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
            <Images className="h-3 w-3" /> {mediaCount}
          </span>
        )}
      </div>

      {/* Overlay — white text on a dark scrim, readable in both themes */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-linear-to-t from-black/90 via-black/55 to-transparent p-5 pt-16">
        {eyebrow && (
          <p className="text-accent text-[11px] font-bold tracking-widest uppercase">{eyebrow}</p>
        )}
        <h3 className="text-xl leading-tight font-bold text-white">{item.title}</h3>
        {item.clientName && <p className="text-sm text-white/70">{item.clientName}</p>}
        <span className="text-accent mt-2 inline-flex items-center gap-1 text-sm font-semibold opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
          View project →
        </span>
      </div>
    </button>
  )
}
