import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

export const instant = false

export const metadata: Metadata = {
  title: "Portfolio",
  description: "A gallery of image editing, video, and 3D/CGI projects — open any piece to see details and full production work.",
}

interface PortfolioAsset {
  id: string
  kind: string
  storageKey: string
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
  service: {
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
      console.error(
        "Failed to fetch portfolio items:",
        response.status
      )
      return []
    }

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error("Error fetching portfolio items:", error)
    return []
  }
}

function buildAssetUrl(storageKey: string): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://vizualgraphics.com'
  return `${apiUrl}/${storageKey}`
}

export default async function PortfolioPage(props: {
  searchParams?: Promise<{ item?: string }>
}) {
  const items = await getPortfolioItems()
  const searchParams = await props.searchParams
  const selectedItemSlug = searchParams?.item

  // If an item is selected, show detail view
  if (selectedItemSlug) {
    const selectedItem = items.find((p) => p.slug === selectedItemSlug)

    if (!selectedItem) {
      notFound()
    }

    return (
        <main
          className="min-h-screen py-12 md:py-20"
          style={{ backgroundColor: "var(--bg)" }}
        >
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <div className="mb-8">
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-70"
                style={{ color: "var(--color-accent)" }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Gallery
              </Link>
            </div>

            {/* Project Header */}
            <div className="mb-12 grid gap-8 lg:grid-cols-3 lg:items-start">
              <div className="lg:col-span-2 space-y-6">
                <div className="space-y-3">
                  <p
                    className="text-xs font-bold tracking-widest uppercase"
                    style={{ color: "var(--color-accent)" }}
                  >
                    {selectedItem.service?.name}
                  </p>
                  <h1
                    className="font-display text-4xl md:text-5xl font-black tracking-tight"
                    style={{ color: "var(--ink)" }}
                  >
                    {selectedItem.title}
                  </h1>
                </div>

                {selectedItem.description && (
                  <p
                    className="text-base md:text-lg leading-relaxed max-w-2xl"
                    style={{ color: "var(--ink-soft)" }}
                  >
                    {selectedItem.description}
                  </p>
                )}

                {selectedItem.clientName && (
                  <div
                    className="rounded-lg p-4 border"
                    style={{
                      backgroundColor: "var(--bg-2)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <p className="text-xs font-semibold uppercase mb-1" style={{ color: "var(--ink-soft)" }}>
                      Client
                    </p>
                    <p className="text-lg font-semibold" style={{ color: "var(--ink)" }}>
                      {selectedItem.clientName}
                    </p>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div
                className="rounded-lg p-6 border"
                style={{
                  backgroundColor: "var(--color-glass-bg)",
                  borderColor: "var(--color-glass-border)",
                }}
              >
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase mb-2" style={{ color: "var(--ink-soft)" }}>
                      Project Type
                    </p>
                    <p className="text-lg font-semibold" style={{ color: "var(--ink)" }}>
                      {selectedItem.service?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase mb-2" style={{ color: "var(--ink-soft)" }}>
                      Assets
                    </p>
                    <p className="text-lg font-semibold" style={{ color: "var(--ink)" }}>
                      {selectedItem.assets?.length || 0} file{selectedItem.assets && selectedItem.assets.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Assets Gallery */}
            {selectedItem.assets && selectedItem.assets.length > 0 && (
              <div className="mb-16">
                <div className="mb-8">
                  <h2
                    className="text-2xl font-bold"
                    style={{ color: "var(--ink)" }}
                  >
                    Project Showcase
                  </h2>
                </div>
                <div className="space-y-8">
                  {selectedItem.assets.map((asset) => (
                    <div key={asset.id} className="space-y-3">
                      {asset.kind === "image" && (
                        <div
                          className="relative w-full overflow-hidden rounded-2xl"
                          style={{
                            backgroundColor: "var(--bg-2)",
                            border: "1px solid var(--border)",
                          }}
                        >
                          <Image
                            src={buildAssetUrl(asset.storageKey)}
                            alt={asset.caption || selectedItem.title}
                            width={asset.width || 1200}
                            height={asset.height || 800}
                            className="w-full h-auto"
                            priority={selectedItem.assets && selectedItem.assets.indexOf(asset) === 0}
                          />
                        </div>
                      )}

                      {asset.kind === "video" && (
                        <div
                          className="relative w-full overflow-hidden rounded-2xl bg-black"
                          style={{
                            backgroundColor: "var(--bg-2)",
                            border: "1px solid var(--border)",
                          }}
                        >
                          <video
                            src={buildAssetUrl(asset.storageKey)}
                            controls
                            className="w-full h-auto"
                          />
                        </div>
                      )}

                      {asset.caption && (
                        <p
                          className="text-sm font-medium"
                          style={{ color: "var(--ink-soft)" }}
                        >
                          {asset.caption}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Footer */}
            <div className="mt-16 mb-0">
              <div
                className="rounded-2xl p-8 md:p-12 text-center"
                style={{
                  backgroundColor: "var(--color-glass-bg)",
                  border: "1px solid var(--color-glass-border)",
                }}
              >
                <h2
                  className="mb-3 text-3xl md:text-4xl font-bold"
                  style={{ color: "var(--ink)" }}
                >
                  Interested in working together?
                </h2>
                <p
                  className="mb-8 text-base md:text-lg max-w-2xl mx-auto"
                  style={{ color: "var(--ink-soft)" }}
                >
                  Let's create something extraordinary for your brand.
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
          </div>
        </main>
      )
  }

  return (
    <main
      className="min-h-screen py-20"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {/* Header */}
          <div className="space-y-6">
            <h1
              className="font-display text-5xl font-black tracking-tight md:text-6xl"
              style={{ color: "var(--ink)" }}
            >
              Our Portfolio
            </h1>
            <p
              className="max-w-2xl text-xl leading-relaxed"
              style={{ color: "var(--ink-soft)" }}
            >
              Explore our exclusive collection of premium visual productions featuring photo
              retouching, product films, and 3D renders.
            </p>
          </div>

          {/* Gallery Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {items.length > 0 ? (
              items.map((item) => {
                const primaryAsset = item.assets?.[0]

                return (
                  <Link
                    key={item.id}
                    href={`/portfolio?item=${item.slug}`}
                    className="group"
                  >
                    <div className="relative overflow-hidden rounded-2xl h-96 cursor-pointer">
                      {/* Asset Display */}
                      {primaryAsset && primaryAsset.kind === "image" && (
                        <Image
                          src={buildAssetUrl(primaryAsset.storageKey)}
                          alt={primaryAsset.caption || item.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          priority
                        />
                      )}

                      {primaryAsset && primaryAsset.kind === "video" && (
                        <div className="relative w-full h-full bg-black">
                          <video
                            src={buildAssetUrl(primaryAsset.storageKey)}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            controls={false}
                            muted
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-white/30 group-hover:bg-white/50 flex items-center justify-center transition-colors">
                              <svg
                                className="w-8 h-8 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      )}

                      {!primaryAsset && (
                        <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-gray-800 via-gray-900 to-black">
                          <div className="text-center">
                            <div className="text-5xl font-black opacity-20 mb-2" style={{ color: "var(--ink)" }}>
                              {item.title.charAt(0).toUpperCase()}
                            </div>
                            <p className="text-sm opacity-40" style={{ color: "var(--ink-soft)" }}>
                              {item.title}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Overlay - Always visible with gradient */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/70 to-transparent flex flex-col justify-end p-6">
                        <div className="space-y-3">
                          <div>
                            {item.service && (
                              <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--color-accent)" }}>
                                {item.service.name}
                              </p>
                            )}
                            <h3 className="text-2xl font-bold mt-1" style={{ color: "var(--ink)" }}>
                              {item.title}
                            </h3>
                          </div>

                          {item.clientName && (
                            <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
                              {item.clientName}
                            </p>
                          )}

                          {item.description && (
                            <p className="text-sm line-clamp-2" style={{ color: "var(--ink-soft)" }}>
                              {item.description}
                            </p>
                          )}

                          <div className="pt-2 flex items-center gap-2 group/btn group-hover:translate-y-0 translate-y-2 transition-transform duration-300">
                            <span
                              className="text-sm font-semibold"
                              style={{ color: "var(--color-accent)" }}
                            >
                              View Details
                            </span>
                            <svg className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" style={{ color: "var(--color-accent)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    </div>
                  </Link>
                )
              })
            ) : null}
          </div>

          {/* Footer CTA */}
          <div
            className="rounded-lg p-12 text-center"
            style={{
              backgroundColor: "var(--color-glass-bg)",
              border: "1px solid var(--color-glass-border)",
            }}
          >
            <h2
              className="mb-4 text-3xl font-bold"
              style={{ color: "var(--ink)" }}
            >
              Ready to work together?
            </h2>
            <p
              className="mb-8 text-lg"
              style={{ color: "var(--ink-soft)" }}
            >
              Let's create something extraordinary for your brand.
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
      </div>
    </main>
  )
}
