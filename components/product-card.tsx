"use client";

import type React from "react";
import { memo } from "react";
import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LazyImage } from "@/components/lazy-image";
import { useCart } from "@/contexts/cart-context";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

function ProductCardComponent({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="group h-full overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
        <div className="aspect-square relative overflow-hidden bg-muted">
          <LazyImage
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            width={400}
            height={400}
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
            {product.category}
          </Badge>
        </div>

        <CardContent className="p-4 flex-1">
          <h3 className="font-semibold text-sm line-clamp-2 mb-2 text-balance">
            {product.title}
          </h3>

          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-muted-foreground ml-1">
                {product.rating.rate} ({product.rating.count})
              </span>
            </div>
          </div>

          <p className="text-lg font-bold text-primary">
            ${product.price.toFixed(2)}
          </p>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button onClick={handleAddToCart} className="w-full" size="sm">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}

export const ProductCard = memo(ProductCardComponent);
