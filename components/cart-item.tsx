"use client"

import Image from "next/image"
import Link from "next/link"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { QuantitySelector } from "@/components/quantity-selector"
import { useCart } from "@/contexts/cart-context"
import type { CartItem } from "@/lib/types"

interface CartItemProps {
  item: CartItem
}

export function CartItemComponent({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart()

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(item.id, newQuantity)
  }

  const handleRemove = () => {
    removeFromCart(item.id)
  }

  const itemTotal = item.price * item.quantity

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Product Image */}
          <Link href={`/products/${item.id}`} className="flex-shrink-0">
            <div className="relative w-20 h-20 bg-muted rounded-md overflow-hidden">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
          </Link>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <Link
              href={`/products/${item.id}`}
              className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors"
            >
              {item.title}
            </Link>
            <p className="text-sm text-muted-foreground capitalize mt-1">{item.category}</p>
            <div className="flex items-center justify-between mt-3">
              <div className="text-lg font-semibold text-primary">${itemTotal.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</div>
            </div>
          </div>
        </div>

        {/* Quantity and Remove */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <QuantitySelector quantity={item.quantity} onQuantityChange={handleQuantityChange} />
          <Button variant="ghost" size="sm" onClick={handleRemove} className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Remove
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
