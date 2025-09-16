"use client"

import { useState, useEffect } from "react"
import { Sparkles } from "lucide-react"
import { ProductCard } from "./product-card"
import { getProducts } from "@/lib/api"
import type { Product } from "@/lib/types"

interface RecommendedProductsProps {
  currentProductId?: number
  limit?: number
}

export function RecommendedProducts({ currentProductId, limit = 4 }: RecommendedProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRecommendedProducts = async () => {
      try {
        const allProducts = await getProducts()
        // Filter out current product and get random recommendations
        const filtered = allProducts.filter((p) => p.id !== currentProductId)
        const shuffled = filtered.sort(() => 0.5 - Math.random())
        setProducts(shuffled.slice(0, limit))
      } catch (error) {
        console.error("Failed to load recommended products:", error)
      } finally {
        setLoading(false)
      }
    }

    loadRecommendedProducts()
  }, [currentProductId, limit])

  if (loading) {
    return (
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-2xl font-semibold">You Might Also Like</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-muted rounded-lg mb-4" />
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-6 bg-muted rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-2xl font-semibold">You Might Also Like</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={`recommended-${product.id}`} product={product} />
        ))}
      </div>
    </section>
  )
}
