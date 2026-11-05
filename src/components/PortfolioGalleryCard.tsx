"use client"

import { Play } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

import { coverUrl, isVideo } from "@/lib/portfolio"

import type { PortfolioItem } from "@/lib/portfolio"

interface PortfolioGalleryCardProps {
  item: PortfolioItem
  onOpen: () => void
}

export const PortfolioGalleryCard = ({ item, onOpen }: PortfolioGalleryCardProps) => {
  const [failed, setFailed] = useState(false)
  const cover = failed ? null : coverUrl(item)
  const mediaCount = item.imageUrls.length

  return (
    <button
      type="button"
      onClick={onOpen}
      data-testid="portfolio-card"
      data-slug={item.slug}
      aria-label={`Open ${item.title}`}
      className="group relative block aspect-[4/5] w-full overflow-hidden bg-[#1c1914] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c49a56]"
    >
      {cover && isVideo(cover) ? (
        <>
          <video
            src={cover}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            muted
            playsInline
            preload="metadata"
            onError={() => setFailed(true)}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors duration-300 group-hover:bg-black/20">
            <Play className="h-10 w-10 text-[#ece6d6]/90" strokeWidth={1.25} />
          </div>
        </>
      ) : cover ? (
        <Image
          src={cover}
          alt={item.title}
          fill
          unoptimized
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          onError={() => setFailed(true)}
          priority={false}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span
            className="text-6xl text-[#ece6d6]/10 italic"
            style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
          >
            {item.title.charAt(0).toUpperCase()}
          </span>
        </div>
      )}

      {/* Caption — revealed on hover/focus only */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        <p
          className="text-base leading-snug text-[#ece6d6] italic"
          style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
        >
          {item.title}
        </p>
        {mediaCount > 1 && <p className="mt-0.5 text-xs text-[#ece6d6]/60">{mediaCount} images</p>}
      </div>
    </button>
  )
}
