/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Mobile Gesture Handler (Swipe Navigation)                  ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useEffect, useRef } from "react";

export default function GestureHandler({ 
  children, 
  onSwipeLeft, 
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onPullToRefresh,
  threshold = 50 
}) {
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      };
    };

    const handleTouchEnd = (e) => {
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const deltaTime = Date.now() - touchStartRef.current.time;

      // Only trigger if swipe is fast enough (< 300ms)
      if (deltaTime > 300) return;

      // Determine swipe direction
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > threshold) {
          if (deltaX > 0) {
            onSwipeRight?.();
            if ('vibrate' in navigator) navigator.vibrate(10);
          } else {
            onSwipeLeft?.();
            if ('vibrate' in navigator) navigator.vibrate(10);
          }
        }
      } else {
        // Vertical swipe
        if (Math.abs(deltaY) > threshold) {
          if (deltaY > 0) {
            onSwipeDown?.();
            // Pull to refresh
            if (window.scrollY === 0 && deltaY > threshold * 2) {
              onPullToRefresh?.();
              if ('vibrate' in navigator) navigator.vibrate([10, 20, 10]);
            }
          } else {
            onSwipeUp?.();
          }
        }
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onPullToRefresh, threshold]);

  return (
    <div ref={containerRef} className="w-full h-full">
      {children}
    </div>
  );
}