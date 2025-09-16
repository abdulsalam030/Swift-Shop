"use client"

import Link from "next/link"
import { ShoppingBag, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/cart-context"

export function CartSummary() {
  const { getTotalPrice, getTotalItems } = useCart()

  const subtotal = getTotalPrice()
  const shipping = subtotal > 50 ? 0 : 9.99
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + shipping + tax

  const totalItems = getTotalItems()

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span>Items ({totalItems})</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="flex items-center gap-1">
            <Truck className="h-4 w-4" />
            Shipping
          </span>
          <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
        </div>

        {shipping === 0 && subtotal > 0 && (
          <div className="text-xs text-primary bg-primary/10 p-2 rounded">🎉 You qualify for free shipping!</div>
        )}

        {shipping > 0 && subtotal > 0 && (
          <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
            Add ${(50 - subtotal).toFixed(2)} more for free shipping
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>

        <Separator />

        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <Button asChild className="w-full" size="lg" disabled={totalItems === 0}>
          <Link href="/checkout">Proceed to Checkout</Link>
        </Button>

        <Button asChild variant="outline" className="w-full bg-transparent">
          <Link href="/">Continue Shopping</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
