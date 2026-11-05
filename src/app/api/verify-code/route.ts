import { cookies } from "next/headers"

import type { NextRequest } from "next/server"

const PORTFOLIO_ACCESS_COOKIE = "portfolio_access"
const PORTFOLIO_COOKIE_MAX_AGE_SECONDS = 30 * 24 * 60 * 60 // 30 days

interface VerifyCodeRequest {
  email: string
  code: string
}

interface VerifyCodeResponse {
  success: boolean
  data?: {
    redirectUrl: string
  }
  error?: string
  message?: string
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body: VerifyCodeRequest = await request.json()
    const { email, code } = body

    if (!email || !code) {
      return Response.json({
        success: false,
        error: "Enter the 6-digit code from your email",
      } as VerifyCodeResponse)
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://vizualgraphics.com"
    const backendResponse = await fetch(`${apiUrl}/api/portfolio/verify-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Forwarded-For": request.headers.get("x-forwarded-for") || "",
      },
      body: JSON.stringify({ email, code }),
    })

    const data = await backendResponse.json()

    if (!backendResponse.ok || !data.success) {
      return Response.json(
        { success: false, error: data.message || data.error || "That code didn't work" },
        { status: backendResponse.ok ? 400 : backendResponse.status }
      )
    }

    // The backend grants access on its own domain; mirror it here with our
    // own cookie so a returning visitor on this origin stays unlocked too.
    if (data.data?.accessToken) {
      const cookieStore = await cookies()
      cookieStore.set(PORTFOLIO_ACCESS_COOKIE, data.data.accessToken, {
        maxAge: PORTFOLIO_COOKIE_MAX_AGE_SECONDS,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      })
    }

    // Redirect ALWAYS goes to the portfolio gallery on this origin.
    return Response.json({
      success: true,
      data: { redirectUrl: "/portfolio" },
    } as VerifyCodeResponse)
  } catch (error) {
    console.error("Portfolio verify-code error:", error)
    return Response.json({
      success: false,
      error: "Server error",
    } as VerifyCodeResponse)
  }
}
