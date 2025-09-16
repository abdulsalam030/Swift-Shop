"use client"

import { Clock } from "lucide-react"
import { ProductCard } from "./product-card"
import { useRecentlyViewed } from "@/hooks/use-recently-viewed"

interface RecentlyViewedProps {
  limit?: number
  showTitle?: boolean
}

export function RecentlyViewed({ limit = 4, showTitle = true }: RecentlyViewedProps) {
  const { recentlyViewed } = useRecentlyViewed()

  if (recentlyViewed.length === 0) {
    return null
  }

  const displayProducts = recentlyViewed.slice(0, limit)

  return (
    <section className="space-y-6">
      {showTitle && (
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-2xl font-semibold">Recently Viewed</h2>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayProducts.map((product) => (
          <ProductCard key={`recently-viewed-${product.id}`} product={product} />
        ))}
      </div>
    </section>
  )
}
