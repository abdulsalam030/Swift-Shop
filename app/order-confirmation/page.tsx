"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Package, Truck, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const [orderNumber, setOrderNumber] = useState("")
  const [total, setTotal] = useState("")

  useEffect(() => {
    const order = searchParams.get("order")
    const orderTotal = searchParams.get("total")

    if (order) setOrderNumber(order)
    if (orderTotal) setTotal(orderTotal)
  }, [searchParams])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
          </div>

          {/* Order Details */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Order Number:</span>
                <span className="font-mono text-primary">#{orderNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Amount:</span>
                <span className="font-semibold text-lg">${total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Payment Status:</span>
                <span className="text-primary font-medium">Paid</span>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 text-left">
                <CreditCard className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Payment Processed</h4>
                  <p className="text-sm text-muted-foreground">Your payment has been successfully processed.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-left">
                <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-medium">Order Processing</h4>
                  <p className="text-sm text-muted-foreground">
                    We're preparing your items for shipment. You'll receive an email when your order ships.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-left">
                <Truck className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-medium">Shipping</h4>
                  <p className="text-sm text-muted-foreground">
                    Estimated delivery: 3-5 business days. Tracking information will be provided.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-4">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/">Continue Shopping</Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              Questions about your order?{" "}
              <Link href="/contact" className="text-primary hover:underline">
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
