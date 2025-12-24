/**
 * Advanced Gesture Handler - Gestes tactiles pour mobile
 */

import React, { useRef, useState } from 'react';

export default function GestureHandler({ 
  children, 
  onSwipeLeft, 
  onSwipeRight, 
  onSwipeUp, 
  onSwipeDown,
  onLongPress,
  onDoubleTap,
  swipeThreshold = 50,
  longPressDelay = 500
}) {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const longPressTimer = useRef(null);
  const lastTap = useRef(0);

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now()
    });

    // Long press detection
    if (onLongPress) {
      longPressTimer.current = setTimeout(() => {
        onLongPress();
      }, longPressDelay);
    }
  };

  const handleTouchMove = (e) => {
    setTouchEnd({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });

    // Cancel long press if moved
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }

    if (!touchStart || !touchEnd) return;

    const deltaX = touchStart.x - touchEnd.x;
    const deltaY = touchStart.y - touchEnd.y;
    
    // Determine if it's a horizontal or vertical swipe
    const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);

    if (isHorizontal) {
      // Horizontal swipe
      if (Math.abs(deltaX) > swipeThreshold) {
        if (deltaX > 0) {
          onSwipeLeft?.();
        } else {
          onSwipeRight?.();
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > swipeThreshold) {
        if (deltaY > 0) {
          onSwipeUp?.();
        } else {
          onSwipeDown?.();
        }
      }
    }

    // Double tap detection
    const now = Date.now();
    const timeSinceLastTap = now - lastTap.current;
    if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
      onDoubleTap?.();
    }
    lastTap.current = now;
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'pan-y' }}
    >
      {children}
    </div>
  );
}