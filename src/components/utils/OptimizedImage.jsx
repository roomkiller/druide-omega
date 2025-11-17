/**
 * Image optimisée avec lazy loading et cache
 */

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const imageCache = new Map();
const loadingImages = new Map();

export default function OptimizedImage({ 
  src, 
  alt, 
  className = "", 
  placeholder = "blur",
  priority = false,
  onLoad,
  fallback = null
}) {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    // Si prioritaire, charger immédiatement
    if (priority) {
      loadImage(src);
      return;
    }

    // Sinon, lazy load avec IntersectionObserver
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            loadImage(src);
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "50px" }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [src, priority]);

  const loadImage = async (url) => {
    // Check cache first
    if (imageCache.has(url)) {
      setImageSrc(imageCache.get(url));
      setIsLoading(false);
      onLoad?.();
      return;
    }

    // Check if already loading
    if (loadingImages.has(url)) {
      const promise = loadingImages.get(url);
      try {
        const loadedSrc = await promise;
        setImageSrc(loadedSrc);
        setIsLoading(false);
        onLoad?.();
      } catch (err) {
        setError(true);
        setIsLoading(false);
      }
      return;
    }

    // Load new image
    const loadPromise = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        imageCache.set(url, url);
        loadingImages.delete(url);
        resolve(url);
      };
      img.onerror = () => {
        loadingImages.delete(url);
        reject(new Error("Image load failed"));
      };
      img.src = url;
    });

    loadingImages.set(url, loadPromise);

    try {
      const loadedSrc = await loadPromise;
      setImageSrc(loadedSrc);
      setIsLoading(false);
      onLoad?.();
    } catch (err) {
      setError(true);
      setIsLoading(false);
    }
  };

  if (error && fallback) {
    return fallback;
  }

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {isLoading && placeholder === "blur" && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 animate-pulse" />
      )}
      {imageSrc && (
        <motion.img
          src={imageSrc}
          alt={alt}
          className={`w-full h-full object-cover ${className}`}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          loading={priority ? "eager" : "lazy"}
        />
      )}
    </div>
  );
}

/**
 * Préchargement d'images
 */
export function preloadImages(urls) {
  urls.forEach(url => {
    if (!imageCache.has(url) && !loadingImages.has(url)) {
      const img = new Image();
      img.onload = () => imageCache.set(url, url);
      img.src = url;
    }
  });
}

/**
 * Clear cache
 */
export function clearImageCache() {
  imageCache.clear();
  loadingImages.clear();
}