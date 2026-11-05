"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { Lock, Mail, Sparkles } from "lucide-react"

type ActionResult<T> =
  | {
      success: true
      data: T
    }
  | {
      success: false
      error: string
    }

type DetailsData = { email: string; name: string }
type CodeData = { redirectUrl: string }

const NOISE_BG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

const RESEND_COOLDOWN_SECONDS = 30

const sendCodeAction = async (
  _prevState: ActionResult<DetailsData> | null,
  formData: FormData
): Promise<ActionResult<DetailsData>> => {
  const email = formData.get("email")?.toString().trim() ?? ""
  const name = formData.get("name")?.toString().trim() ?? ""
  const consent = formData.get("consent")

  if (!email || !name || !consent) {
    return { success: false, error: "Fill in your name and email, and accept the consent." }
  }

  try {
    const response = await fetch("/api/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, consent: consent === "on" }),
    })
    const data = await response.json()

    if (!response.ok || !data.success) {
      return { success: false, error: data.error || "Couldn't send a code. Please try again." }
    }

    return { success: true, data: { email, name } }
  } catch {
    return { success: false, error: "Something went wrong. Please try again." }
  }
}

const verifyCodeAction = async (
  email: string,
  _prevState: ActionResult<CodeData> | null,
  formData: FormData
): Promise<ActionResult<CodeData>> => {
  const code = formData.get("code")?.toString().trim() ?? ""

  if (code.length !== 6) {
    return { success: false, error: "Enter the 6-digit code from your email." }
  }

  try {
    const response = await fetch("/api/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    })
    const data = await response.json()

    if (!response.ok || !data.success) {
      return { success: false, error: data.error || "That code didn't work. Please try again." }
    }

    return { success: true, data: { redirectUrl: data.data.redirectUrl } }
  } catch {
    return { success: false, error: "Something went wrong. Please try again." }
  }
}

const CardShell = ({ children }: { children: React.ReactNode }) => (
  <div
    className="relative w-full max-w-sm overflow-hidden rounded-lg p-5 sm:p-8 lg:p-10"
    style={{
      backgroundColor: "var(--color-glass-bg)",
      backdropFilter: "blur(20px) saturate(180%)",
      WebkitBackdropFilter: "blur(20px) saturate(180%)",
      border: "1px solid var(--color-glass-border)",
      boxShadow: "0 8px 32px 0 rgb(2 14 39 / 0.06), inset 0 1px 0 0 rgb(255 255 255 / 0.45)",
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
    {children}
  </div>
)

const IconBadge = ({ icon }: { icon: React.ReactNode }) => (
  <div className="flex items-center justify-center">
    <div
      className="flex h-12 w-12 items-center justify-center rounded-full sm:h-14 sm:w-14"
      style={{ backgroundColor: "rgba(0, 201, 255, 0.15)" }}
    >
      {icon}
    </div>
  </div>
)

const SubmitButton = ({
  isPending,
  pendingLabel,
  label,
}: {
  isPending: boolean
  pendingLabel: string
  label: string
}) => (
  <button
    type="submit"
    disabled={isPending}
    className="w-full rounded-sm px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
    style={{ backgroundColor: "var(--ink)" }}
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
        <span>{pendingLabel}</span>
      </span>
    ) : (
      label
    )}
  </button>
)

const DetailsStep = ({ onSent }: { onSent: (data: DetailsData) => void }) => {
  const [state, formAction, isPending] = useActionState(sendCodeAction, null)

  useEffect(() => {
    if (state?.success) onSent(state.data)
  }, [state, onSent])

  return (
    <div className="space-y-5 sm:space-y-6">
      <IconBadge
        icon={<Lock className="h-6 w-6 sm:h-7 sm:w-7" style={{ color: "var(--color-accent)" }} />}
      />

      <div className="space-y-2 text-center">
        <h2 className="font-display text-2xl font-bold sm:text-3xl" style={{ color: "var(--ink)" }}>
          Access portfolio
        </h2>
        <p className="text-xs leading-relaxed sm:text-sm" style={{ color: "var(--ink-soft)" }}>
          Tell us who you are and we&apos;ll email you a one-time code to view our work.
        </p>
      </div>

      <form action={formAction} className="space-y-3">
        {state && !state.success && (
          <div className="rounded-sm border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-600 sm:text-sm dark:text-red-400">
            {state.error}
          </div>
        )}

        <div className="space-y-1.5">
          <label
            htmlFor="name"
            className="block text-xs font-semibold sm:text-sm"
            style={{ color: "var(--ink)" }}
          >
            Your name
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
            Email address
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

        <SubmitButton isPending={isPending} pendingLabel="Sending code…" label="Send access code" />
      </form>

      <div className="border-t pt-3 text-center" style={{ borderColor: "rgba(2, 14, 39, 0.12)" }}>
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
  )
}

const CodeStep = ({ email, onBack }: { email: string; onBack: () => void }) => {
  const boundAction = verifyCodeAction.bind(null, email)
  const [state, formAction, isPending] = useActionState(boundAction, null)
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS)
  const [resendState, setResendState] = useState<"idle" | "sending" | "sent">("idle")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => setCooldown((value) => value - 1), 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  useEffect(() => {
    if (state?.success) {
      setTimeout(() => {
        window.location.href = state.data.redirectUrl
      }, 400)
    }
  }, [state])

  const resend = async () => {
    setResendState("sending")
    try {
      const response = await fetch("/api/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: "there", consent: true }),
      })
      const data = await response.json()
      if (response.ok && data.success) {
        setResendState("sent")
        setCooldown(RESEND_COOLDOWN_SECONDS)
      } else {
        setResendState("idle")
      }
    } catch {
      setResendState("idle")
    }
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <span
        className="mx-auto flex w-fit items-center gap-1.5 rounded-full px-3 py-1"
        style={{ backgroundColor: "rgba(0, 201, 255, 0.1)" }}
      >
        <Mail className="h-3.5 w-3.5" style={{ color: "var(--color-accent)" }} />
        <span
          className="text-[10px] font-bold tracking-wider sm:text-xs"
          style={{ color: "var(--accent-text)" }}
        >
          Check your email
        </span>
      </span>

      <div className="space-y-2 text-center">
        <h2 className="font-display text-2xl font-bold sm:text-3xl" style={{ color: "var(--ink)" }}>
          Enter your code
        </h2>
        <p className="text-xs leading-relaxed sm:text-sm" style={{ color: "var(--ink-soft)" }}>
          We sent a 6-digit code to{" "}
          <span className="font-semibold" style={{ color: "var(--ink)" }}>
            {email}
          </span>
          . It expires in 10 minutes.
        </p>
      </div>

      <form action={formAction} className="space-y-3">
        {state && !state.success && (
          <div className="rounded-sm border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-600 sm:text-sm dark:text-red-400">
            {state.error}
          </div>
        )}

        <div className="space-y-1.5">
          <label
            htmlFor="code"
            className="block text-xs font-semibold sm:text-sm"
            style={{ color: "var(--ink)" }}
          >
            Access code
          </label>
          <input
            ref={inputRef}
            id="code"
            name="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            required
            disabled={isPending}
            onInput={(e) => {
              e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "").slice(0, 6)
            }}
            className="w-full rounded-sm border px-3 py-3 text-center text-2xl font-semibold transition-colors focus:ring-1 focus:outline-none disabled:opacity-50"
            style={{
              backgroundColor: "var(--bg)",
              color: "var(--ink)",
              borderColor: "var(--border)",
              letterSpacing: "0.5em",
              fontFamily: "ui-monospace, Menlo, Consolas, monospace",
            }}
            placeholder="000000"
          />
        </div>

        <SubmitButton isPending={isPending} pendingLabel="Verifying…" label="Verify & continue" />
      </form>

      <div
        className="flex items-center justify-between border-t pt-3"
        style={{ borderColor: "rgba(2, 14, 39, 0.12)" }}
      >
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-semibold transition-colors hover:opacity-80 sm:text-sm"
          style={{ color: "var(--ink-soft)" }}
        >
          Use a different email
        </button>

        <button
          type="button"
          onClick={resend}
          disabled={cooldown > 0 || resendState === "sending"}
          className="text-xs font-semibold transition-colors hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
          style={{ color: "var(--color-accent)" }}
        >
          {resendState === "sending"
            ? "Sending…"
            : cooldown > 0
              ? `Resend in ${cooldown}s`
              : "Resend code"}
        </button>
      </div>
    </div>
  )
}

export default function Home() {
  const [details, setDetails] = useState<DetailsData | null>(null)

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
                  <span>A one-time code sent to your inbox — no password to remember</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 shrink-0 text-xs" style={{ color: "var(--color-accent)" }}>
                    ◆
                  </span>
                  <span>Full project galleries, curated by client</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right: Access Form */}
          <div className="flex w-full justify-center lg:w-auto">
            <CardShell>
              {details ? (
                <CodeStep email={details.email} onBack={() => setDetails(null)} />
              ) : (
                <DetailsStep onSent={setDetails} />
              )}
            </CardShell>
          </div>
        </div>
      </div>
    </main>
  )
}
