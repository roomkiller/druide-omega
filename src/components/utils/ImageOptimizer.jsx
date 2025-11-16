/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Image Optimizer Component                                  ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function ImageOptimizer({ 
  src, 
  alt, 
  className = "",
  width,
  height,
  quality = 80,
  placeholder = "blur"
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSrc, setCurrentSrc] = useState("");

  useEffect(() => {
    if (!src) return;

    // Generate optimized URL (use CDN if available)
    const optimizedSrc = optimizeImageUrl(src, { width, height, quality });
    
    // Preload image
    const img = new Image();
    img.src = optimizedSrc;
    img.onload = () => {
      setCurrentSrc(optimizedSrc);
      setIsLoading(false);
    };
    img.onerror = () => {
      setCurrentSrc(src); // Fallback to original
      setIsLoading(false);
    };
  }, [src, width, height, quality]);

  // Generate blur placeholder
  const blurDataUrl = placeholder === "blur" 
    ? "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Cimage preserveAspectRatio='none' filter='url(%23b)' width='100%25' height='100%25' href='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='/%3E%3C/svg%3E"
    : null;

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
        </div>
      )}
      
      {blurDataUrl && isLoading && (
        <img
          src={blurDataUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        />
      )}

      <img
        src={currentSrc}
        alt={alt}
        loading="lazy"
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  );
}

function optimizeImageUrl(url, { width, height, quality }) {
  // If using a CDN (Cloudflare, Imgix, etc.)
  // Example: return `https://cdn.example.com/${url}?w=${width}&q=${quality}`;
  
  // For now, return original URL
  // In production, integrate with CDN service
  return url;
}