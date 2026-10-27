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
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-max" aria-busy="true">
    {Array.from({ length: 6 }, (_, i) => (
      <div key={i} className="bg-linear-to-br from-slate-800 to-slate-900 aspect-4/5 animate-pulse rounded-lg border border-slate-700" />
    ))}
  </div>
)

export default function PortfolioPage({ searchParams }: PortfolioPageProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 pt-16 pb-24 md:pt-20 md:pb-32">
      {/* Gradient decoration - top right */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full blur-3xl opacity-20"
        style={{ background: "radial-gradient(circle, #60a5fa 0%, transparent 70%)" }}
      />

      {/* Gradient decoration - bottom left */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full blur-3xl opacity-10"
        style={{ background: "radial-gradient(circle, #a78bfa 0%, transparent 70%)" }}
      />

      {/* Noise background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.02] mix-blend-overlay"
        style={{ backgroundImage: NOISE_BG }}
      />

      <div className="site-container relative">
        {/* Header */}
        <header className="mb-16 space-y-6 md:mb-20">
          <div className="space-y-4">
            <p className="text-sm font-bold tracking-widest uppercase text-blue-400">
              Creative Portfolio
            </p>
            <h1 className="text-5xl md:text-6xl 2xl:text-7xl font-bold text-white leading-tight">
              Our Creative Work
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl leading-relaxed">
              Explore a curated collection of professional projects showcasing image editing, video production, and creative design work. Click on any project to view the full details and story behind it.
            </p>
          </div>
        </header>

        {/* Gallery */}
        <div className="mb-16">
          <Suspense fallback={<GallerySkeleton />}>
            <GalleryLoader searchParams={searchParams} />
          </Suspense>
        </div>

        {/* Footer CTA */}
        <div className="mt-24 rounded-xl p-12 md:p-16 text-center bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 backdrop-blur-sm">
          <h2 className="mb-4 text-3xl md:text-4xl font-bold text-white">
            Ready to create something amazing?
          </h2>
          <p className="mb-8 text-lg text-gray-300 max-w-2xl mx-auto">
            Let&apos;s work together to bring your vision to life with professional design and creative excellence.
          </p>
          <a
            href="https://vizualgraphics.com/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-lg px-8 py-3 font-semibold transition-all hover:scale-105 bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </main>
  )
}
