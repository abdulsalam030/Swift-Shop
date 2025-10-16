"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { ProductFilters } from "@/components/product-filters";
import { ProductGrid } from "@/components/product-grid";
import { RecentlyViewed } from "@/components/recently-viewed";
import { getProductsByCategory, searchProducts } from "@/lib/api";
import type { Product } from "@/lib/types";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Load products based on category and search
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        let result: Product[];

        if (searchQuery) {
          result = await searchProducts(searchQuery);
        } else {
          result = await getProductsByCategory(selectedCategory);
        }

        setProducts(result);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [selectedCategory, searchQuery]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery(""); // Clear search when changing category
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory("all"); // Reset category when searching
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="text-center py-12 mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-4">
            Discover Amazing Products
          </h1>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Shop the latest in electronics, fashion, jewelry, and more. Quality
            products at unbeatable prices.
          </p>
        </section>

        <RecentlyViewed limit={4} />

        {/* Add spacing between sections */}
        <div className="my-12">
          {/* Filters */}
          <section className="mb-8">
            <ProductFilters
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </section>

          {/* Results Header */}
          <section className="mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">
                {searchQuery ? (
                  <>Search results for "{searchQuery}"</>
                ) : selectedCategory === "all" ? (
                  "All Products"
                ) : (
                  <span className="capitalize">{selectedCategory}</span>
                )}
              </h2>
              {!loading && (
                <span className="text-muted-foreground">
                  {products.length} product{products.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </section>

          {/* Product Grid */}
          <ProductGrid products={products} loading={loading} />
        </div>
      </main>
    </div>
  );
}
