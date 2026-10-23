import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Projects open in a dialog on /portfolio — old /portfolio/<slug> links
  // land on the gallery with that piece open (same as vizualgraphics /work).
  async redirects() {
    return [{ source: "/portfolio/:slug", destination: "/portfolio?item=:slug", permanent: true }]
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
}

export default nextConfig
