import type { Metadata } from "next"
import "./globals.css"
import "./portfolio-vars.css"

export const metadata: Metadata = {
  title: "Private Portfolio | Vizual Graphics",
  description: "Exclusive portfolio gallery showcasing our latest work.",
  robots: "noindex, nofollow",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="flex min-h-full flex-col antialiased">{children}</body>
    </html>
  )
}
