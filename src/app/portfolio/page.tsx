import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { PortfolioGallery } from "@/components/PortfolioGallery"

const NOISE_BG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "A gallery of image editing, video, and 3D/CGI projects — open any piece to see the full story.",
}

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

async function getPortfolioItems(): Promise<PortfolioItem[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/portfolio/items`,
      {
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    )

    if (!response.ok) {
      console.error("Failed to fetch portfolio items:", response.status)
      return []
    }

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error("Error fetching portfolio items:", error)
    return []
  }
}

interface PortfolioPageProps {
  searchParams?: Promise<{ item?: string }>
}

export default async function PortfolioPage(props: PortfolioPageProps) {
  const items = await getPortfolioItems()
  const searchParams = await props.searchParams
  const initialOpenSlug = searchParams?.item as string | undefined

  // Validate that the open item exists
  if (initialOpenSlug && !items.some((it) => it.slug === initialOpenSlug)) {
    notFound()
  }

  return (
    <main
      className="relative overflow-hidden pt-10 pb-24 md:pt-16 md:pb-32 min-h-screen"
      style={{ backgroundColor: "var(--bg)" }}
    >
      {/* Gradient decoration */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-0 h-160 w-160 translate-x-1/3 rounded-full blur-[90px]"
        style={{ background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)" }}
      />

      {/* Noise background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{ backgroundImage: NOISE_BG }}
      />

      <div className="site-container relative">
        {/* Header */}
        <header className="mb-10 grid gap-8 md:mb-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p
              className="text-xs font-bold tracking-widest uppercase mb-5"
              style={{ color: "var(--color-accent)" }}
            >
              Portfolio Gallery
            </p>
            <h1
              className="font-display text-5xl leading-[0.95] font-extrabold tracking-tighter uppercase md:text-6xl 2xl:text-7xl"
              style={{ color: "var(--ink)" }}
            >
              Our Best Work
            </h1>
            <p
              className="mt-5 max-w-xl text-base leading-relaxed md:text-lg"
              style={{ color: "var(--ink-soft)" }}
            >
              A curated selection of image editing, video production, and 3D/CGI projects we&apos;ve
              delivered for brands worldwide. Click any piece to explore the full story.
            </p>
          </div>
        </header>

        {/* Gallery */}
        <div className="mb-10">
          <PortfolioGallery items={items} initialOpenSlug={initialOpenSlug} />
        </div>

        {/* Footer CTA */}
        <div
          className="rounded-lg p-12 text-center mt-20"
          style={{
            backgroundColor: "var(--color-glass-bg)",
            border: "1px solid var(--color-glass-border)",
          }}
        >
          <h2 className="mb-4 text-3xl font-bold" style={{ color: "var(--ink)" }}>
            Ready to work together?
          </h2>
          <p className="mb-8 text-lg" style={{ color: "var(--ink-soft)" }}>
            Let&apos;s create something extraordinary for your brand.
          </p>
          <a
            href="https://vizualgraphics.com/contact"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "var(--ink)",
            }}
            className="inline-block rounded-sm px-8 py-3 font-semibold transition-opacity hover:opacity-90"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </main>
  )
}
