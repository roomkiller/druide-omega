/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Behavior Tracker Component (Optimized)                     ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useEffect, useRef } from "react";
import { BehaviorAnalyticsEngine } from "./BehaviorAnalyticsEngine";

/**
 * HOC to automatically track component interactions
 */
export function withBehaviorTracking(Component, section) {
  return function TrackedComponent(props) {
    const mountTime = useRef(Date.now());

    useEffect(() => {
      BehaviorAnalyticsEngine.trackInteraction(section, 'mount');

      return () => {
        const duration = Date.now() - mountTime.current;
        BehaviorAnalyticsEngine.trackInteraction(section, 'unmount', { duration_ms: duration });
      };
    }, []);

    return <Component {...props} />;
  };
}

/**
 * Hook to track user actions
 */
export function useBehaviorTracking(section) {
  const trackAction = React.useCallback((action, metadata = {}) => {
    BehaviorAnalyticsEngine.trackInteraction(section, action, metadata);
  }, [section]);

  const trackFeature = React.useCallback((feature, duration_ms = null) => {
    BehaviorAnalyticsEngine.trackFeatureUsage(feature, duration_ms);
  }, []);

  const trackClick = React.useCallback((element) => {
    BehaviorAnalyticsEngine.trackInteraction(section, 'click', { element });
  }, [section]);

  return { trackAction, trackFeature, trackClick };
}

/**
 * Global click tracker (DISABLED - too many events)
 */
export function GlobalBehaviorTracker() {
  useEffect(() => {
    // Track navigation only
    const handleNavigation = () => {
      BehaviorAnalyticsEngine.trackNavigation(
        document.referrer || 'direct',
        window.location.pathname
      );
    };

    // Flush queue before unload
    const handleBeforeUnload = () => {
      BehaviorAnalyticsEngine.flushQueue();
    };

    window.addEventListener('popstate', handleNavigation);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Periodic flush every 2 minutes
    const flushInterval = setInterval(() => {
      BehaviorAnalyticsEngine.flushQueue();
    }, 120000);

    return () => {
      window.removeEventListener('popstate', handleNavigation);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(flushInterval);
    };
  }, []);

  return null;
}