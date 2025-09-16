import { Star } from "lucide-react"

interface ProductRatingProps {
  rating: number
  count: number
  showCount?: boolean
}

export function ProductRating({ rating, count, showCount = true }: ProductRatingProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : i < rating
                  ? "fill-yellow-200 text-yellow-400"
                  : "fill-muted text-muted-foreground"
            }`}
          />
        ))}
      </div>
      <span className="text-sm font-medium">{rating.toFixed(1)}</span>
      {showCount && <span className="text-sm text-muted-foreground">({count} reviews)</span>}
    </div>
  )
}
