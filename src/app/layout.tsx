import type { Metadata } from "next"
import "./globals.css"
import "./portfolio-vars.css"

interface LayoutProps<T> {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: "Private Portfolio | Vizual Graphics",
  description: "Exclusive portfolio gallery showcasing our latest work.",
  robots: "noindex, nofollow",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  )
}
