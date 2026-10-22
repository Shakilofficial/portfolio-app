export default function PortfolioPage() {
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
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="group relative aspect-square overflow-hidden rounded-lg"
                style={{
                  backgroundColor: "var(--bg-2)",
                  border: "1px solid var(--border)",
                }}
              >
                {/* Placeholder */}
                <div className="flex h-full w-full items-center justify-center">
                  <div className="text-center">
                    <div
                      className="text-6xl font-bold opacity-20"
                      style={{ color: "var(--ink)" }}
                    >
                      {item}
                    </div>
                    <p
                      className="text-sm opacity-40"
                      style={{ color: "var(--ink-soft)" }}
                    >
                      Portfolio Item {item}
                    </p>
                  </div>
                </div>

                {/* Hover overlay */}
                <div
                  className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    backgroundColor: "rgba(2, 14, 39, 0.7)",
                  }}
                >
                  <button
                    style={{
                      backgroundColor: "var(--color-accent)",
                      color: "var(--ink)",
                    }}
                    className="rounded-sm px-6 py-2.5 font-semibold transition-opacity hover:opacity-90"
                  >
                    View Project
                  </button>
                </div>
              </div>
            ))}
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
