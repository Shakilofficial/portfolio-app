"use client"

import { AnimatePresence } from "motion/react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { PortfolioDialog } from "./PortfolioDialog"
import { PortfolioGalleryCard } from "./PortfolioGalleryCard"

interface PortfolioAsset {
  id: string
  kind: string
  storageKey: string
  url?: string
  width: number | null
  height: number | null
  durationSec: number | null
  caption: string | null
  sortOrder: number
}

interface PortfolioItem {
  id: string
  slug: string
  title: string
  description?: string | null
  clientName?: string | null
  sortOrder: number
  isFeatured: boolean
  assets: PortfolioAsset[]
  service?: {
    id: string
    name: string
  }
}

interface PortfolioGalleryProps {
  items: PortfolioItem[]
  initialOpenSlug?: string
}

const useColumnCount = () => {
  const [count, setCount] = useState(3)
  useEffect(() => {
    const update = () => setCount(window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1)
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])
  return count
}

const setPortfolioParam = (slug: string | null) => {
  const url = new URL(window.location.href)
  if (slug) url.searchParams.set("item", slug)
  else url.searchParams.delete("item")
  window.history.replaceState(window.history.state, "", url)
}

export const PortfolioGallery = ({ items, initialOpenSlug }: PortfolioGalleryProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(() => {
    if (!initialOpenSlug) return null
    const i = items.findIndex((it) => it.slug === initialOpenSlug)
    return i === -1 ? null : i
  })

  const columnCount = useColumnCount()

  const open = useCallback(
    (index: number) => {
      const item = items[index]
      if (!item) return
      setOpenIndex(index)
      setPortfolioParam(item.slug)
    },
    [items]
  )

  const close = useCallback(() => {
    setOpenIndex(null)
    setPortfolioParam(null)
  }, [])

  const columns = useMemo(() => {
    const cols: { item: PortfolioItem; index: number }[][] = Array.from(
      { length: columnCount },
      () => []
    )
    const heights = new Array<number>(columnCount).fill(0)
    items.forEach((item, index) => {
      let target = 0
      for (let c = 1; c < columnCount; c++) {
        if ((heights[c] ?? 0) < (heights[target] ?? 0)) target = c
      }
      cols[target]?.push({ item, index })
      heights[target] = (heights[target] ?? 0) + (item.assets[0]?.height || 1) / (item.assets[0]?.width || 1)
    })
    return cols
  }, [items, columnCount])

  if (items.length === 0) {
    return (
      <p className="py-24 text-center text-sm" style={{ color: "var(--ink-soft)" }}>
        No portfolio items to display.
      </p>
    )
  }

  return (
    <>
      <div className="flex gap-3">
        {columns.map((col, c) => (
          <div key={c} className="flex min-w-0 flex-1 flex-col gap-3">
            {col.map(({ item, index }) => (
              <PortfolioGalleryCard
                key={item.id}
                item={item}
                onOpen={() => open(index)}
              />
            ))}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {openIndex !== null && items[openIndex] && (
          <PortfolioDialog
            items={items}
            index={openIndex}
            total={items.length}
            onClose={close}
            onNavigate={open}
          />
        )}
      </AnimatePresence>
    </>
  )
}
