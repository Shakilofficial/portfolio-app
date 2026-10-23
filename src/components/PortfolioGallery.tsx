"use client"

import { AnimatePresence } from "motion/react"
import { useCallback, useEffect, useState } from "react"

import { PortfolioDialog } from "./PortfolioDialog"
import { PortfolioGalleryCard } from "./PortfolioGalleryCard"

import type { PortfolioItem } from "@/lib/portfolio"

interface PortfolioGalleryProps {
  items: PortfolioItem[]
  initialOpenSlug?: string
}

// Deep link: ?item=<slug>. replaceState keeps the gallery as one history entry.
const setItemParam = (slug: string | null) => {
  const url = new URL(window.location.href)
  if (slug) url.searchParams.set("item", slug)
  else url.searchParams.delete("item")
  window.history.replaceState(window.history.state, "", url)
}

const indexOfSlug = (items: PortfolioItem[], slug?: string | null) => {
  if (!slug) return null
  const index = items.findIndex((item) => item.slug === slug)
  return index === -1 ? null : index
}

export const PortfolioGallery = ({ items, initialOpenSlug }: PortfolioGalleryProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(() =>
    indexOfSlug(items, initialOpenSlug)
  )

  // Drop an unknown ?item= so the URL never points at nothing.
  useEffect(() => {
    if (initialOpenSlug && indexOfSlug(items, initialOpenSlug) === null) setItemParam(null)
  }, [items, initialOpenSlug])

  const open = useCallback(
    (index: number) => {
      const item = items[index]
      if (!item) return
      setOpenIndex(index)
      setItemParam(item.slug)
    },
    [items]
  )

  const close = useCallback(() => {
    setOpenIndex(null)
    setItemParam(null)
  }, [])

  if (items.length === 0) {
    return (
      <p className="text-ink-soft py-24 text-center text-sm" data-testid="portfolio-empty">
        No portfolio items to display yet.
      </p>
    )
  }

  return (
    <>
      <div
        data-testid="portfolio-grid"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {items.map((item, index) => (
          <PortfolioGalleryCard key={item.id} item={item} onOpen={() => open(index)} />
        ))}
      </div>

      <AnimatePresence>
        {openIndex !== null && items[openIndex] && (
          <PortfolioDialog
            key="portfolio-dialog"
            items={items}
            index={openIndex}
            onClose={close}
            onNavigate={open}
          />
        )}
      </AnimatePresence>
    </>
  )
}
