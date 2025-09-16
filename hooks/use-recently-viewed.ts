"use client";

import { useState, useEffect, useCallback } from "react";
import type { Product } from "@/lib/types";

const RECENTLY_VIEWED_KEY = "recentlyViewed";
const MAX_RECENTLY_VIEWED = 10;

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(RECENTLY_VIEWED_KEY);
    if (saved) {
      try {
        setRecentlyViewed(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to load recently viewed:", error);
      }
    }
  }, []);

  const addToRecentlyViewed = (product: Product) => {
    setRecentlyViewed((prev) => {
      // Remove if already exists
      const filtered = prev.filter((p) => p.id !== product.id);
      // Add to beginning
      const updated = [product, ...filtered].slice(0, MAX_RECENTLY_VIEWED);
      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
      return updated;
    });
  };
  // const addToRecentlyViewed = useCallback(
  //   (product: Product) => {
  //     setRecentlyViewed((prev) => {
  //       // Remove if already exists
  //       const filtered = prev.filter((p) => p.id !== product.id);
  //       // Add to beginning
  //       const updated = [product, ...filtered].slice(0, MAX_RECENTLY_VIEWED);
  //       localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
  //       return updated;
  //     });
  //   },
  //   [setRecentlyViewed]
  // );

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
    localStorage.removeItem(RECENTLY_VIEWED_KEY);
  };

  return {
    recentlyViewed,
    addToRecentlyViewed,
    clearRecentlyViewed,
  };
}
