"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CreditCard, Lock, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"

interface CheckoutFormData {
  // Shipping Information
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string

  // Payment Information
  cardNumber: string
  expiryDate: string
  cvv: string
  cardName: string

  // Options
  saveInfo: boolean
  sameAsBilling: boolean
}

const initialFormData: CheckoutFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  country: "US",
  cardNumber: "",
  expiryDate: "",
  cvv: "",
  cardName: "",
  saveInfo: false,
  sameAsBilling: true,
}

export function CheckoutForm() {
  const [formData, setFormData] = useState<CheckoutFormData>(initialFormData)
  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const { clearCart, getTotalPrice } = useCart()
  const { toast } = useToast()
  const router = useRouter()

  const updateField = (field: keyof CheckoutFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<CheckoutFormData> = {}

    // Required fields validation
    const requiredFields: (keyof CheckoutFormData)[] = [
      "firstName",
      "lastName",
      "email",
      "address",
      "city",
      "state",
      "zipCode",
      "cardNumber",
      "expiryDate",
      "cvv",
      "cardName",
    ]

    requiredFields.forEach((field) => {
      if (!formData[field] || (typeof formData[field] === "string" && !formData[field].trim())) {
        newErrors[field] = "This field is required" as any
      }
    })

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address" as any
    }

    // Phone validation (if provided)
    if (formData.phone && !/^\+?[\d\s\-$$$$]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number" as any
    }

    // Card number validation (basic)
    if (formData.cardNumber && !/^\d{13,19}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
      newErrors.cardNumber = "Please enter a valid card number" as any
    }

    // Expiry date validation
    if (formData.expiryDate && !/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = "Please enter a valid expiry date (MM/YY)" as any
    }

    // CVV validation
    if (formData.cvv && !/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = "Please enter a valid CVV" as any
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Please fix the errors",
        description: "Check the form for validation errors and try again.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock payment success
      const orderNumber = Math.random().toString(36).substr(2, 9).toUpperCase()

      toast({
        title: "Order placed successfully!",
        description: `Your order #${orderNumber} has been confirmed.`,
      })

      // Clear cart and redirect
      clearCart()
      router.push(`/order-confirmation?order=${orderNumber}&total=${getTotalPrice().toFixed(2)}`)
    } catch (error) {
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }
    return v
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Shipping Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Shipping Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                className={errors.firstName ? "border-destructive" : ""}
              />
              {errors.firstName && <p className="text-sm text-destructive mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                className={errors.lastName ? "border-destructive" : ""}
              />
              {errors.lastName && <p className="text-sm text-destructive mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className={errors.phone ? "border-destructive" : ""}
            />
            {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
          </div>

          <div>
            <Label htmlFor="address">Street Address *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => updateField("address", e.target.value)}
              className={errors.address ? "border-destructive" : ""}
            />
            {errors.address && <p className="text-sm text-destructive mt-1">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => updateField("city", e.target.value)}
                className={errors.city ? "border-destructive" : ""}
              />
              {errors.city && <p className="text-sm text-destructive mt-1">{errors.city}</p>}
            </div>
            <div>
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => updateField("state", e.target.value)}
                className={errors.state ? "border-destructive" : ""}
              />
              {errors.state && <p className="text-sm text-destructive mt-1">{errors.state}</p>}
            </div>
            <div>
              <Label htmlFor="zipCode">ZIP Code *</Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => updateField("zipCode", e.target.value)}
                className={errors.zipCode ? "border-destructive" : ""}
              />
              {errors.zipCode && <p className="text-sm text-destructive mt-1">{errors.zipCode}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="country">Country</Label>
            <Select value={formData.country} onValueChange={(value) => updateField("country", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="CA">Canada</SelectItem>
                <SelectItem value="UK">United Kingdom</SelectItem>
                <SelectItem value="AU">Australia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payment Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="cardName">Cardholder Name *</Label>
            <Input
              id="cardName"
              value={formData.cardName}
              onChange={(e) => updateField("cardName", e.target.value)}
              className={errors.cardName ? "border-destructive" : ""}
            />
            {errors.cardName && <p className="text-sm text-destructive mt-1">{errors.cardName}</p>}
          </div>

          <div>
            <Label htmlFor="cardNumber">Card Number *</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChange={(e) => updateField("cardNumber", formatCardNumber(e.target.value))}
              className={errors.cardNumber ? "border-destructive" : ""}
              maxLength={19}
            />
            {errors.cardNumber && <p className="text-sm text-destructive mt-1">{errors.cardNumber}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiryDate">Expiry Date *</Label>
              <Input
                id="expiryDate"
                placeholder="MM/YY"
                value={formData.expiryDate}
                onChange={(e) => updateField("expiryDate", formatExpiryDate(e.target.value))}
                className={errors.expiryDate ? "border-destructive" : ""}
                maxLength={5}
              />
              {errors.expiryDate && <p className="text-sm text-destructive mt-1">{errors.expiryDate}</p>}
            </div>
            <div>
              <Label htmlFor="cvv">CVV *</Label>
              <Input
                id="cvv"
                placeholder="123"
                value={formData.cvv}
                onChange={(e) => updateField("cvv", e.target.value.replace(/\D/g, ""))}
                className={errors.cvv ? "border-destructive" : ""}
                maxLength={4}
              />
              {errors.cvv && <p className="text-sm text-destructive mt-1">{errors.cvv}</p>}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="saveInfo"
              checked={formData.saveInfo}
              onCheckedChange={(checked) => updateField("saveInfo", checked as boolean)}
            />
            <Label htmlFor="saveInfo" className="text-sm">
              Save payment information for future purchases
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted p-3 rounded-md">
        <Lock className="h-4 w-4" />
        <span>Your payment information is encrypted and secure</span>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
        {isProcessing ? "Processing..." : "Complete Order"}
      </Button>
    </form>
  )
}
