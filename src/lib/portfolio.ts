// Shared portfolio types + helpers. Data comes from the vizualgraphics
// public feed: GET {NEXT_PUBLIC_API_URL}/api/portfolio/items (published only).

export interface PortfolioAsset {
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

export interface PortfolioItem {
  id: string
  slug: string
  title: string
  description: string | null
  clientName: string | null
  industry: string | null
  sortOrder: number
  assets: PortfolioAsset[]
  beforeImageUrl: string | null
  afterImageUrl: string | null
  galleryUrls: string[]
  coverImageUrl: string | null
  service: { id: string; title: string } | null
}

export interface PortfolioSlide {
  url: string
  kind: "image" | "video"
}

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "https://vizualgraphics.com").replace(
  /\/+$/,
  ""
)

// Root-relative /uploads/... paths are served by the vizualgraphics origin.
export const assetUrl = (path: string): string => {
  if (/^https?:\/\//.test(path)) return path
  return `${API_URL}${path.startsWith("/") ? "" : "/uploads/"}${path}`
}

const VIDEO_EXT = /\.(mp4|webm|mov)$/i

export const isVideo = (url: string) => VIDEO_EXT.test(url)

// Gallery slides shown after the before/after comparison in the dialog.
export const gallerySlides = (item: PortfolioItem): PortfolioSlide[] =>
  item.galleryUrls.map((url) => ({ url: assetUrl(url), kind: isVideo(url) ? "video" : "image" }))

export const hasComparison = (item: PortfolioItem) =>
  Boolean(item.beforeImageUrl && item.afterImageUrl)

export const coverUrl = (item: PortfolioItem): string | null => {
  const cover = item.coverImageUrl ?? item.afterImageUrl ?? item.galleryUrls[0] ?? null
  return cover ? assetUrl(cover) : null
}

// Older feed versions lacked the resolved role fields — derive them from
// `assets` so the app works against either API shape.
type RawItem = Partial<PortfolioItem> & Pick<PortfolioItem, "id" | "slug" | "title">

export const normalizeItem = (raw: RawItem): PortfolioItem => {
  const assets = [...(raw.assets ?? [])].sort((a, b) => a.sortOrder - b.sortOrder)
  const pathOf = (asset: PortfolioAsset) => asset.url ?? `/uploads/${asset.storageKey}`
  const before = assets.find((a) => a.caption === "before")
  const after = assets.find((a) => a.caption === "after")
  const gallery = assets.filter((a) => a !== before && a !== after).map(pathOf)

  const beforeImageUrl = raw.beforeImageUrl ?? (before ? pathOf(before) : null)
  const afterImageUrl = raw.afterImageUrl ?? (after ? pathOf(after) : null)
  const galleryUrls = raw.galleryUrls ?? gallery
  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    description: raw.description ?? null,
    clientName: raw.clientName ?? null,
    industry: raw.industry ?? null,
    sortOrder: raw.sortOrder ?? 0,
    assets,
    beforeImageUrl,
    afterImageUrl,
    galleryUrls,
    coverImageUrl: raw.coverImageUrl ?? afterImageUrl ?? galleryUrls[0] ?? beforeImageUrl,
    service: raw.service ?? null,
  }
}

export const getPortfolioItems = async (): Promise<PortfolioItem[]> => {
  try {
    const response = await fetch(`${API_URL}/api/portfolio/items`, {
      next: { revalidate: 60 },
    })
    if (!response.ok) {
      console.error("Failed to fetch portfolio items:", response.status)
      return []
    }
    const body = (await response.json()) as { data?: RawItem[] }
    return (body.data ?? []).map(normalizeItem)
  } catch (error) {
    console.error("Error fetching portfolio items:", error)
    return []
  }
}

export const INDUSTRY_LABEL: Record<string, string> = {
  FASHION: "Fashion",
  ECOMMERCE: "E-commerce",
  BEAUTY: "Beauty",
  JEWELRY: "Jewelry",
  LUXURY: "Luxury",
  FOOTWEAR: "Footwear",
  LIFESTYLE: "Lifestyle",
  HOME_LIVING: "Home & Living",
  SPORTS: "Sports",
  OTHER: "Other",
}
