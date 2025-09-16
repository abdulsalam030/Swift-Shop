"use client"

import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface QuantitySelectorProps {
  quantity: number
  onQuantityChange: (quantity: number) => void
  min?: number
  max?: number
}

export function QuantitySelector({ quantity, onQuantityChange, min = 1, max = 99 }: QuantitySelectorProps) {
  const decrease = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1)
    }
  }

  const increase = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1)
    }
  }

  return (
    <div className="flex items-center border rounded-md">
      <Button
        variant="ghost"
        size="icon"
        onClick={decrease}
        disabled={quantity <= min}
        className="h-10 w-10 rounded-none"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <div className="flex items-center justify-center w-12 h-10 text-sm font-medium border-x">{quantity}</div>
      <Button
        variant="ghost"
        size="icon"
        onClick={increase}
        disabled={quantity >= max}
        className="h-10 w-10 rounded-none"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}
