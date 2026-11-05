import { Suspense } from "react"

import { PortfolioGallery } from "@/components/PortfolioGallery"
import { getPortfolioItems } from "@/lib/portfolio"

import type { Metadata } from "next"

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
  <div className="grid grid-cols-2 gap-0.5 sm:grid-cols-3 lg:grid-cols-4" aria-busy="true">
    {Array.from({ length: 8 }, (_, i) => (
      <div key={i} className="aspect-[4/5] animate-pulse bg-[#1c1914]" />
    ))}
  </div>
)

const PortfolioPage = ({ searchParams }: PortfolioPageProps) => {
  return (
    <main className="min-h-screen bg-[#15130f] pt-14 pb-20 md:pt-20 md:pb-28">
      <div className="mx-auto w-full max-w-[1760px] px-4 sm:px-8 lg:px-12">
        {/* Header */}
        <header className="mb-10 flex flex-col gap-4 border-b border-[#2a2620] pb-8 sm:flex-row sm:items-end sm:justify-between md:mb-14">
          <h1
            className="text-4xl leading-[1.1] text-[#ece6d6] italic md:text-5xl"
            style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
          >
            Selected work
          </h1>
          <p className="max-w-sm text-sm leading-relaxed text-[#ece6d6]/55 sm:text-right">
            Image editing, video, and 3D/CGI projects. Open any piece for the full set.
          </p>
        </header>

        {/* Gallery */}
        <Suspense fallback={<GallerySkeleton />}>
          <GalleryLoader searchParams={searchParams} />
        </Suspense>

        {/* Footer */}
        <div className="mt-16 flex flex-col items-center gap-2 border-t border-[#2a2620] pt-8 text-center md:mt-20">
          <p className="text-sm text-[#ece6d6]/55">Want work like this for your brand?</p>
          <a
            href="https://vizualgraphics.com/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-[#c49a56] underline underline-offset-4 transition-colors hover:text-[#d9b876]"
          >
            Get in touch
          </a>
        </div>
      </div>
    </main>
  )
}

export default PortfolioPage
