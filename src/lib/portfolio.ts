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
  /** Ordered image list — the first one is the cover. */
  imageUrls: string[]
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

// All of an item's images as resolved slides, in display order.
export const portfolioSlides = (item: PortfolioItem): PortfolioSlide[] =>
  item.imageUrls.map((url) => ({ url: assetUrl(url), kind: isVideo(url) ? "video" : "image" }))

export const coverUrl = (item: PortfolioItem): string | null => {
  const cover = item.coverImageUrl ?? item.imageUrls[0] ?? null
  return cover ? assetUrl(cover) : null
}

// Older feed versions lacked the resolved `imageUrls`/`coverImageUrl` fields
// — derive them from `assets` so the app works against either API shape.
type RawItem = Partial<PortfolioItem> & Pick<PortfolioItem, "id" | "slug" | "title">

export const normalizeItem = (raw: RawItem): PortfolioItem => {
  const assets = [...(raw.assets ?? [])].sort((a, b) => a.sortOrder - b.sortOrder)
  const pathOf = (asset: PortfolioAsset) => asset.url ?? `/uploads/${asset.storageKey}`

  const imageUrls = raw.imageUrls ?? assets.map(pathOf)
  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    description: raw.description ?? null,
    clientName: raw.clientName ?? null,
    industry: raw.industry ?? null,
    sortOrder: raw.sortOrder ?? 0,
    assets,
    imageUrls,
    coverImageUrl: raw.coverImageUrl ?? imageUrls[0] ?? null,
    service: raw.service ?? null,
  }
}

export const getPortfolioItems = async (): Promise<PortfolioItem[]> => {
  try {
    const response = await fetch(`${API_URL}/api/portfolio/items`, {
      next: { revalidate: 30 },
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
