import { Fraunces } from "next/font/google"

import "./globals.css"
import "./portfolio-vars.css"

import type { Metadata } from "next"

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT"],
})

export const metadata: Metadata = {
  title: "Private Portfolio | Vizual Graphics",
  description: "Exclusive portfolio gallery showcasing our latest work.",
  robots: "noindex, nofollow",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`scroll-smooth ${fraunces.variable}`}>
      <body className="flex min-h-full flex-col antialiased">{children}</body>
    </html>
  )
}
