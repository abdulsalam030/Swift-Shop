"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/header"
import { ProductImageGallery } from "@/components/product-image-gallery"
import { ProductRating } from "@/components/product-rating"
import { QuantitySelector } from "@/components/quantity-selector"
import { RecommendedProducts } from "@/components/recommended-products"
import { useCart } from "@/contexts/cart-context"
import { useRecentlyViewed } from "@/hooks/use-recently-viewed"
import { getProduct } from "@/lib/api"
import type { Product } from "@/lib/types"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const { addToRecentlyViewed } = useRecentlyViewed()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const productId = Number.parseInt(params.id as string)

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) return

      setLoading(true)
      try {
        const productData = await getProduct(productId)
        if (productData) {
          setProduct(productData)
          addToRecentlyViewed(productData)
        } else {
          router.push("/404")
        }
      } catch (error) {
        console.error("Failed to load product:", error)
        router.push("/404")
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [productId, router, addToRecentlyViewed])

  const handleAddToCart = async () => {
    if (!product) return

    setIsAddingToCart(true)

    // Add multiple quantities
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }

    // Simulate a brief loading state
    setTimeout(() => {
      setIsAddingToCart(false)
    }, 500)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-32 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-muted rounded-lg" />
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4" />
                <div className="h-6 bg-muted rounded w-1/2" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Product Images */}
          <div>
            <ProductImageGallery images={[product.image]} title={product.title} />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category Badge */}
            <Badge variant="secondary" className="capitalize">
              {product.category}
            </Badge>

            {/* Title */}
            <h1 className="text-3xl font-bold text-balance">{product.title}</h1>

            {/* Rating */}
            <ProductRating rating={product.rating.rate} count={product.rating.count} />

            {/* Price */}
            <div className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            <Separator />

            {/* Add to Cart Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Quantity</label>
                  <QuantitySelector quantity={quantity} onQuantityChange={setQuantity} />
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleAddToCart} className="flex-1" size="lg" disabled={isAddingToCart}>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {isAddingToCart ? "Adding..." : "Add to Cart"}
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Features */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Truck className="h-5 w-5 text-primary" />
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="h-5 w-5 text-primary" />
                <span>2-year warranty included</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <RotateCcw className="h-5 w-5 text-primary" />
                <span>30-day return policy</span>
              </div>
            </div>
          </div>
        </div>

        <RecommendedProducts currentProductId={product.id} limit={4} />
      </main>
    </div>
  )
}
