import Image from "next/image"
import Link from "next/link"

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

function buildAssetUrl(storageKey: string): string {
  return `/portfolio/${storageKey}`
}

interface PageProps {
  params: {
    slug: string
  }
}

// Sample portfolio items data
const portfolioItems: PortfolioItem[] = [
  {
    id: "1",
    slug: "photo-retouching-fashion",
    title: "Fashion Brand Photo Retouching",
    description: "Professional photo retouching for luxury fashion campaign featuring product photography and lifestyle shots",
    clientName: "Luxury Fashion Inc",
    sortOrder: 1,
    isFeatured: true,
    assets: [
      {
        id: "a1",
        kind: "image",
        storageKey: "fashion-portfolio-1.jpg",
        width: 1200,
        height: 800,
        durationSec: null,
        caption: "Fashion campaign hero image",
        sortOrder: 1,
      },
    ],
    service: { id: "s1", name: "Photo Retouching" },
  },
  {
    id: "2",
    slug: "product-film-tech",
    title: "Product Film - Latest Smartphone",
    description: "High-quality cinematic product video showcasing latest smartphone features and design details",
    clientName: "TechCorp Electronics",
    sortOrder: 2,
    isFeatured: true,
    assets: [
      {
        id: "a2",
        kind: "video",
        storageKey: "tech-product-video.mp4",
        width: 1920,
        height: 1080,
        durationSec: 60,
        caption: "Product showcase video",
        sortOrder: 1,
      },
    ],
    service: { id: "s2", name: "Video Production" },
  },
  {
    id: "3",
    slug: "3d-architectural-render",
    title: "3D Building Design Visualization",
    description: "Photorealistic 3D rendering of modern architectural design for marketing materials",
    clientName: "Architectural Studio",
    sortOrder: 3,
    isFeatured: false,
    assets: [
      {
        id: "a3",
        kind: "image",
        storageKey: "architecture-render-1.jpg",
        width: 2400,
        height: 1600,
        durationSec: null,
        caption: "Architectural visualization",
        sortOrder: 1,
      },
    ],
    service: { id: "s3", name: "3D Rendering" },
  },
  {
    id: "4",
    slug: "wedding-photography",
    title: "Wedding Photography - Premium Package",
    description: "Comprehensive wedding photography documentation with professional retouching and color grading",
    clientName: "Premium Events",
    sortOrder: 4,
    isFeatured: false,
    assets: [
      {
        id: "a4",
        kind: "image",
        storageKey: "wedding-ceremony.jpg",
        width: 1600,
        height: 1200,
        durationSec: null,
        caption: "Wedding ceremony moments",
        sortOrder: 1,
      },
    ],
    service: { id: "s4", name: "Photography" },
  },
]

export default function PortfolioDetailPage({ params }: PageProps) {
  const item = portfolioItems.find((p) => p.slug === params.slug)

  if (!item) {
    return (
      <main
        className="min-h-screen py-20"
        style={{ backgroundColor: "var(--bg)" }}
      >
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <h1
              className="text-3xl font-bold mb-4"
              style={{ color: "var(--ink)" }}
            >
              Portfolio Item Not Found (slug: {params.slug})
            </h1>
            <p
              className="mb-8"
              style={{ color: "var(--ink-soft)" }}
            >
              The portfolio item you're looking for doesn't exist.
            </p>
            <Link
              href="/portfolio"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "var(--ink)",
              }}
              className="inline-block rounded-sm px-8 py-3 font-semibold transition-opacity hover:opacity-90"
            >
              Back to Portfolio
            </Link>
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
        {/* Back Button */}
        <div className="mb-12">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 transition-opacity hover:opacity-70"
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
            Back to Portfolio
          </Link>
        </div>

        {/* Project Header */}
        <div className="mb-12 space-y-6">
          <div>
            <p
              className="text-sm font-medium mb-2"
              style={{ color: "var(--color-accent)" }}
            >
              {item.service?.name}
            </p>
            <h1
              className="font-display text-5xl font-black tracking-tight md:text-6xl mb-4"
              style={{ color: "var(--ink)" }}
            >
              {item.title}
            </h1>
            {item.clientName && (
              <p
                className="text-xl"
                style={{ color: "var(--ink-soft)" }}
              >
                Client: <span style={{ color: "var(--ink)" }}>{item.clientName}</span>
              </p>
            )}
          </div>

          {item.description && (
            <p
              className="text-lg leading-relaxed max-w-2xl"
              style={{ color: "var(--ink-soft)" }}
            >
              {item.description}
            </p>
          )}
        </div>

        {/* Assets Gallery */}
        {item.assets && item.assets.length > 0 && (
          <div className="space-y-8 mb-16">
            {item.assets.map((asset) => (
              <div key={asset.id} className="space-y-3">
                {asset.kind === "image" && (
                  <div
                    className="relative w-full overflow-hidden rounded-lg"
                    style={{
                      backgroundColor: "var(--bg-2)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <Image
                      src={buildAssetUrl(asset.storageKey)}
                      alt={asset.caption || item.title}
                      width={asset.width || 1200}
                      height={asset.height || 800}
                      className="w-full h-auto"
                    />
                  </div>
                )}

                {asset.kind === "video" && (
                  <div
                    className="relative w-full overflow-hidden rounded-lg bg-black"
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
                    className="text-sm"
                    style={{ color: "var(--ink-soft)" }}
                  >
                    {asset.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Project Info */}
        <div
          className="rounded-lg p-8 mb-16"
          style={{
            backgroundColor: "var(--bg-2)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="grid md:grid-cols-3 gap-8">
            {item.service && (
              <div>
                <p
                  className="text-xs font-medium mb-2 uppercase"
                  style={{ color: "var(--ink-soft)" }}
                >
                  Service
                </p>
                <p
                  className="text-lg font-semibold"
                  style={{ color: "var(--ink)" }}
                >
                  {item.service.name}
                </p>
              </div>
            )}

            {item.clientName && (
              <div>
                <p
                  className="text-xs font-medium mb-2 uppercase"
                  style={{ color: "var(--ink-soft)" }}
                >
                  Client
                </p>
                <p
                  className="text-lg font-semibold"
                  style={{ color: "var(--ink)" }}
                >
                  {item.clientName}
                </p>
              </div>
            )}

            <div>
              <p
                className="text-xs font-medium mb-2 uppercase"
                style={{ color: "var(--ink-soft)" }}
              >
                Assets
              </p>
              <p
                className="text-lg font-semibold"
                style={{ color: "var(--ink)" }}
              >
                {item.assets?.length || 0} file{item.assets && item.assets.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* CTA Footer */}
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
            Interested in working together?
          </h2>
          <p
            className="mb-8 text-lg"
            style={{ color: "var(--ink-soft)" }}
          >
            Let's create something extraordinary for your project.
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
