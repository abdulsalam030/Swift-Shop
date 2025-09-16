"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getCategories } from "@/lib/api"
import { useEffect, useState } from "react"

interface ProductFiltersProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export function ProductFilters({ selectedCategory, onCategoryChange }: ProductFiltersProps) {
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    setCategories(getCategories())
  }, [])

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-lg mb-3">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(category)}
              className="capitalize"
            >
              {category === "all" ? "All Products" : category}
            </Button>
          ))}
        </div>
      </div>

      {selectedCategory !== "all" && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filter:</span>
          <Badge variant="secondary" className="capitalize">
            {selectedCategory}
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 ml-2 hover:bg-transparent"
              onClick={() => onCategoryChange("all")}
            >
              ×
            </Button>
          </Badge>
        </div>
      )}
    </div>
  )
}
