"use client"

import { useEffect } from "react"
import { useActionState } from "react"
import { Lock, Sparkles } from "lucide-react"

type ActionResult<T> =
  | {
      success: true
      data: T
    }
  | {
      success: false
      error: string
    }

const NOISE_BG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

const submitForm = async (
  _prevState: ActionResult<{ redirectUrl: string }> | null,
  formData: FormData
): Promise<ActionResult<{ redirectUrl: string }>> => {
  try {
    const email = formData.get("email")
    const name = formData.get("name")
    const consent = formData.get("consent")

    // Validate required fields
    if (!email || !name || !consent) {
      return {
        success: false,
        error: "Please fill in all fields and accept the consent",
      }
    }

    // Call the unlock API endpoint
    const response = await fetch("/api/unlock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        name,
        consent: consent === "on",
      }),
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.error || "Failed to unlock portfolio",
      }
    }

    return {
      success: true,
      data: { redirectUrl: "/portfolio" },
    }
  } catch (error) {
    console.error("Form submission error:", error)
    return {
      success: false,
      error: "An error occurred. Please try again.",
    }
  }
}

export default function Home() {
  const [state, formAction, isPending] = useActionState(submitForm, null)

  useEffect(() => {
    if (state?.success && state.data?.redirectUrl) {
      setTimeout(() => {
        window.location.href = state.data.redirectUrl
      }, 500)
    }
  }, [state])

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden py-4 sm:py-6 md:py-8"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-0 h-160 w-160 translate-x-1/3 rounded-full blur-[90px]"
        style={{ background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)" }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{ backgroundImage: NOISE_BG }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-3 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-center lg:gap-12">
          {/* Left: Promotional Banner - Hidden on mobile */}
          <div className="hidden flex-col justify-center space-y-8 lg:flex">
            <div className="space-y-6">
              <div
                className="inline-flex w-fit items-center gap-3 rounded-full px-4 py-2"
                style={{ backgroundColor: "rgba(0, 201, 255, 0.1)" }}
              >
                <Sparkles className="h-5 w-5" style={{ color: "var(--color-accent)" }} />
                <span
                  className="text-sm font-semibold tracking-widest uppercase"
                  style={{ color: "var(--color-accent)" }}
                >
                  Curated Collection
                </span>
              </div>

              <h1
                className="font-display text-4xl leading-[1.2] font-black tracking-tight lg:text-5xl"
                style={{ color: "var(--ink)" }}
              >
                Our <span style={{ color: "var(--color-accent)" }}>Exclusive</span> Work
              </h1>

              <p
                className="max-w-lg text-base leading-relaxed font-light lg:text-lg"
                style={{ color: "var(--ink-soft)" }}
              >
                Discover our latest portfolio of retouched photos, product films, and 3D renders
                crafted for brands worldwide. This exclusive collection showcases projects that
                define our studio&apos;s aesthetic and technical excellence.
              </p>
            </div>

            <div
              className="space-y-3 border-l-2 pl-4"
              style={{ borderColor: "rgba(0, 201, 255, 0.3)" }}
            >
              <h3
                className="text-xs font-bold tracking-widest uppercase"
                style={{ color: "var(--ink)" }}
              >
                What to expect:
              </h3>
              <ul className="space-y-2 text-sm" style={{ color: "var(--ink-soft)" }}>
                <li className="flex items-start gap-2">
                  <span className="mt-1 shrink-0 text-xs" style={{ color: "var(--color-accent)" }}>
                    ◆
                  </span>
                  <span>High-resolution portfolio showcase</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 shrink-0 text-xs" style={{ color: "var(--color-accent)" }}>
                    ◆
                  </span>
                  <span>Before and after comparisons</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 shrink-0 text-xs" style={{ color: "var(--color-accent)" }}>
                    ◆
                  </span>
                  <span>Project details and case studies</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right: Access Form */}
          <div className="flex w-full justify-center lg:w-auto">
            <div
              className="relative w-full max-w-sm overflow-hidden rounded-lg p-5 sm:p-8 lg:p-10"
              style={{
                backgroundColor: "var(--color-glass-bg)",
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                border: "1px solid var(--color-glass-border)",
                boxShadow:
                  "0 8px 32px 0 rgb(2 14 39 / 0.06), inset 0 1px 0 0 rgb(255 255 255 / 0.45)",
              }}
            >
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-1"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-2) 100%)",
                }}
              />

              <div className="space-y-5 sm:space-y-6">
                <div className="flex items-center justify-center">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full sm:h-14 sm:w-14"
                    style={{ backgroundColor: "rgba(0, 201, 255, 0.15)" }}
                  >
                    <Lock
                      className="h-6 w-6 sm:h-7 sm:w-7"
                      style={{ color: "var(--color-accent)" }}
                    />
                  </div>
                </div>

                <div className="space-y-2 text-center">
                  <h2
                    className="font-display text-2xl font-bold sm:text-3xl"
                    style={{ color: "var(--ink)" }}
                  >
                    Access Portfolio
                  </h2>
                  <p
                    className="text-xs leading-relaxed sm:text-sm"
                    style={{ color: "var(--ink-soft)" }}
                  >
                    Enter your details to view our curated work
                  </p>
                </div>

                <form action={formAction} className="space-y-3">
                  {state?.success && (
                    <div className="rounded-sm border border-green-500/20 bg-green-500/10 px-3 py-2 text-xs text-green-600 sm:text-sm dark:text-green-400">
                      ✓ Portfolio access granted! Redirecting...
                    </div>
                  )}

                  {state && !state.success && (
                    <div className="rounded-sm border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-600 sm:text-sm dark:text-red-400">
                      {state.error || "Something went wrong. Please try again."}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label
                      htmlFor="name"
                      className="block text-xs font-semibold sm:text-sm"
                      style={{ color: "var(--ink)" }}
                    >
                      Your Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      disabled={isPending}
                      className="w-full rounded-sm border px-3 py-2 text-xs transition-colors focus:ring-1 focus:outline-none disabled:opacity-50 sm:text-sm"
                      style={{
                        backgroundColor: "var(--bg)",
                        color: "var(--ink)",
                        borderColor: "var(--border)",
                      }}
                      placeholder="Jane Doe"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="email"
                      className="block text-xs font-semibold sm:text-sm"
                      style={{ color: "var(--ink)" }}
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      disabled={isPending}
                      className="w-full rounded-sm border px-3 py-2 text-xs transition-colors focus:ring-1 focus:outline-none disabled:opacity-50 sm:text-sm"
                      style={{
                        backgroundColor: "var(--bg)",
                        color: "var(--ink)",
                        borderColor: "var(--border)",
                      }}
                      placeholder="jane@example.com"
                    />
                  </div>

                  <label className="group flex cursor-pointer items-start gap-2">
                    <input
                      name="consent"
                      type="checkbox"
                      required
                      disabled={isPending}
                      className="mt-0.5 h-4 w-4 cursor-pointer"
                      style={{ accentColor: "var(--color-accent)" }}
                    />
                    <span className="text-xs leading-snug" style={{ color: "var(--ink-soft)" }}>
                      I consent to receive communications about this portfolio.
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full rounded-sm px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{
                      backgroundColor: "var(--ink)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(2, 14, 39, 0.85)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--ink)"
                    }}
                  >
                    {isPending ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Unlocking...</span>
                      </span>
                    ) : (
                      "Unlock Portfolio"
                    )}
                  </button>
                </form>

                <div
                  className="border-t pt-3 text-center"
                  style={{ borderColor: "rgba(2, 14, 39, 0.12)" }}
                >
                  <p className="text-xs leading-snug" style={{ color: "var(--ink-soft)" }}>
                    Team member?{" "}
                    <a
                      href="https://vizualgraphics.com/portal/login"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold transition-colors hover:opacity-80"
                      style={{ color: "var(--color-accent)" }}
                    >
                      Sign in
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
