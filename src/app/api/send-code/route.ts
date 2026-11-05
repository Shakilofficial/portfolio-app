import type { NextRequest } from "next/server"

interface SendCodeRequest {
  email: string
  name: string
  consent: boolean
}

interface SendCodeResponse {
  success: boolean
  data?: {
    email: string
    expiresInSeconds: number
  }
  error?: string
  message?: string
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body: SendCodeRequest = await request.json()
    const { email, name, consent } = body

    if (!email || !name || !consent) {
      return Response.json({
        success: false,
        error: "Missing required fields",
      } as SendCodeResponse)
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return Response.json({
        success: false,
        error: "Invalid email address",
      } as SendCodeResponse)
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://vizualgraphics.com"
    const backendResponse = await fetch(`${apiUrl}/api/portfolio/send-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Forwarded-For": request.headers.get("x-forwarded-for") || "",
      },
      body: JSON.stringify({ email, name, consent }),
    })

    const data = await backendResponse.json()

    if (!backendResponse.ok || !data.success) {
      return Response.json(
        { success: false, error: data.message || data.error || "Failed to send code" },
        { status: backendResponse.ok ? 400 : backendResponse.status }
      )
    }

    return Response.json({ success: true, data: data.data } as SendCodeResponse)
  } catch (error) {
    console.error("Portfolio send-code error:", error)
    return Response.json({
      success: false,
      error: "Server error",
    } as SendCodeResponse)
  }
}
