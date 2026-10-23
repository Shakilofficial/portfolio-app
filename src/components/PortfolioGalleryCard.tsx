"use client"

import Image from "next/image"
import { PlayCircle } from "lucide-react"

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

interface PortfolioGalleryCardProps {
  item: PortfolioItem
  onOpen: () => void
}

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

export const PortfolioGalleryCard = ({ item, onOpen }: PortfolioGalleryCardProps) => {
  const primaryAsset = item.assets?.[0]

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative h-96 w-full overflow-hidden rounded-2xl text-left transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
    >
      {/* Asset Display */}
      {primaryAsset && primaryAsset.kind === "image" && (
        <Image
          src={buildAssetUrl(primaryAsset)}
          alt={primaryAsset.caption || item.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      )}

      {primaryAsset && primaryAsset.kind === "video" && (
        <div className="relative h-full w-full bg-black">
          <video
            src={buildAssetUrl(primaryAsset)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            muted
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="transition-transform duration-300 group-hover:scale-110">
              <PlayCircle className="h-16 w-16 text-white drop-shadow-lg" />
            </div>
          </div>
        </div>
      )}

      {!primaryAsset && (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-black">
          <div className="text-center">
            <div className="mb-2 text-5xl font-black opacity-20" style={{ color: "var(--ink)" }}>
              {item.title.charAt(0).toUpperCase()}
            </div>
            <p className="text-sm opacity-40" style={{ color: "var(--ink-soft)" }}>
              {item.title}
            </p>
          </div>
        </div>
      )}

      {/* Overlay - Always visible with gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex flex-col justify-end p-6">
        <div className="space-y-3">
          <div>
            {item.service && (
              <p
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: "var(--color-accent)" }}
              >
                {item.service.name}
              </p>
            )}
            <h3 className="mt-1 text-2xl font-bold" style={{ color: "var(--ink)" }}>
              {item.title}
            </h3>
          </div>

          {item.clientName && (
            <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
              {item.clientName}
            </p>
          )}

          {item.description && (
            <p className="line-clamp-2 text-sm" style={{ color: "var(--ink-soft)" }}>
              {item.description}
            </p>
          )}

          <div className="flex items-center gap-2 pt-2 transition-transform duration-300 group-hover:translate-y-0 translate-y-2">
            <span className="text-sm font-semibold" style={{ color: "var(--color-accent)" }}>
              View Details
            </span>
            <svg
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              style={{ color: "var(--color-accent)" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Asset count badge */}
      {item.assets && item.assets.length > 1 && (
        <div
          className="absolute top-4 right-4 rounded-full px-3 py-1 text-xs font-medium text-white backdrop-blur-sm"
          style={{ backgroundColor: "rgba(0, 201, 255, 0.9)" }}
        >
          {item.assets.length} items
        </div>
      )}
    </button>
  )
}
