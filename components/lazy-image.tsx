"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface LazyImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  width?: number;
  height?: number;
}

export function LazyImage({
  src,
  alt,
  fill,
  className,
  sizes,
  priority = false,
  width,
  height,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const getPlaceholderUrl = () => {
    const w = width || 400;
    const h = height || 400;
    const query = alt
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "+");
    return `/placeholder.svg?height=${h}&width=${w}&text=${query}`;
  };

  const imageSrc = hasError ? getPlaceholderUrl() : src || getPlaceholderUrl();

  return (
    <div ref={imgRef} className={`relative ${className || ""}`}>
      {/* Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted animate-pulse rounded-md flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-muted-foreground/20 border-t-muted-foreground/60 rounded-full animate-spin" />
        </div>
      )}

      {/* Actual Image */}
      {isInView && (
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={alt}
          fill={fill}
          width={width}
          height={height}
          className={`transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          } ${className || ""}`}
          sizes={sizes}
          priority={priority}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true);
            setIsLoaded(true);
          }}
        />
      )}
    </div>
  );
}
