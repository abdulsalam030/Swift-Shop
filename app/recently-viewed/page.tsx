"use client"

import Link from "next/link"
import { ArrowLeft, Clock } from "lucide-react"
import { Header } from "@/components/header"
import { ProductCard } from "@/components/product-card"
import { ClearRecentlyViewed } from "@/components/clear-recently-viewed"
import { useRecentlyViewed } from "@/hooks/use-recently-viewed"

export default function RecentlyViewedPage() {
  const { recentlyViewed } = useRecentlyViewed()

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/"
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Store
            </Link>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-6 w-6 text-muted-foreground" />
              <h1 className="text-3xl font-bold">Recently Viewed</h1>
            </div>
            <p className="text-muted-foreground">
              {recentlyViewed.length} product{recentlyViewed.length !== 1 ? "s" : ""} in your history
            </p>
          </div>

          <ClearRecentlyViewed />
        </div>

        {/* Content */}
        {recentlyViewed.length === 0 ? (
          <div className="text-center py-16">
            <Clock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">No recently viewed products</h2>
            <p className="text-muted-foreground mb-8">Products you view will appear here for easy access.</p>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recentlyViewed.map((product) => (
              <ProductCard key={`history-${product.id}`} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
