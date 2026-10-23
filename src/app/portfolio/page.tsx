import { Suspense } from "react"

import { PortfolioGallery } from "@/components/PortfolioGallery"
import { getPortfolioItems } from "@/lib/portfolio"

import type { Metadata } from "next"

const NOISE_BG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "A gallery of image editing, video, and 3D/CGI projects — open any piece to see the full story.",
}

interface PortfolioPageProps {
  searchParams: Promise<{ item?: string | string[] }>
}

// Dynamic part (request-time search params + feed) lives inside Suspense so
// the page shell can prerender under cacheComponents.
const GalleryLoader = async ({ searchParams }: PortfolioPageProps) => {
  const [items, params] = await Promise.all([getPortfolioItems(), searchParams])
  const item = Array.isArray(params.item) ? params.item[0] : params.item
  return <PortfolioGallery items={items} initialOpenSlug={item} />
}

const GallerySkeleton = () => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
    {Array.from({ length: 6 }, (_, i) => (
      <div key={i} className="bg-bg-3 aspect-4/5 animate-pulse rounded-2xl" />
    ))}
  </div>
)

export default function PortfolioPage({ searchParams }: PortfolioPageProps) {
  return (
    <main
      className="relative min-h-screen overflow-hidden pt-10 pb-24 md:pt-16 md:pb-32"
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
              className="mb-5 text-xs font-bold tracking-widest uppercase"
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
          <Suspense fallback={<GallerySkeleton />}>
            <GalleryLoader searchParams={searchParams} />
          </Suspense>
        </div>

        {/* Footer CTA */}
        <div
          className="mt-20 rounded-lg p-12 text-center"
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
              color: "var(--color-on-accent)",
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
