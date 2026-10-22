import type { NextRequest } from "next/server"

interface PortfolioUnlockRequest {
  email: string
  name: string
  consent: boolean
}

interface PortfolioUnlockResponse {
  success: boolean
  data?: {
    redirectUrl: string
    accessToken: string
  }
  error?: string
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body: PortfolioUnlockRequest = await request.json()
    const { email, name, consent } = body

    if (!email || !name || !consent) {
      return Response.json({
        success: false,
        error: "Missing required fields",
      } as PortfolioUnlockResponse)
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return Response.json({
        success: false,
        error: "Invalid email address",
      } as PortfolioUnlockResponse)
    }

    // Call the main vizualgraphics backend API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://vizualgraphics.com"
    const backendResponse = await fetch(`${apiUrl}/api/portfolio/unlock`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Forwarded-For": request.headers.get("x-forwarded-for") || "",
      },
      body: JSON.stringify({
        email,
        name,
        consent,
      }),
    })

    const data = await backendResponse.json()

    if (!backendResponse.ok) {
      return Response.json(data, { status: backendResponse.status })
    }

    return Response.json(data)
  } catch (error) {
    console.error("Portfolio unlock error:", error)
    return Response.json({
      success: false,
      error: "Server error",
    } as PortfolioUnlockResponse)
  }
}
