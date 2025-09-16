"use client"

import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRecentlyViewed } from "@/hooks/use-recently-viewed"

export function ClearRecentlyViewed() {
  const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed()

  if (recentlyViewed.length === 0) {
    return null
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={clearRecentlyViewed}
      className="text-muted-foreground hover:text-destructive"
    >
      <Trash2 className="h-4 w-4 mr-2" />
      Clear History
    </Button>
  )
}
