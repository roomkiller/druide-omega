/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Behavior Tracker Component                                 ║
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
 * Global click tracker
 */
export function GlobalBehaviorTracker() {
  useEffect(() => {
    const handleClick = (e) => {
      const target = e.target;
      const elementInfo = {
        tagName: target.tagName,
        id: target.id,
        className: target.className,
        text: target.textContent?.slice(0, 50)
      };

      BehaviorAnalyticsEngine.trackInteraction('ui', 'click', elementInfo);
    };

    // Track navigation
    const handleNavigation = () => {
      BehaviorAnalyticsEngine.trackNavigation(
        document.referrer || 'direct',
        window.location.pathname
      );
    };

    // Track visibility changes
    const handleVisibilityChange = () => {
      BehaviorAnalyticsEngine.trackInteraction('session', 
        document.hidden ? 'hidden' : 'visible'
      );
    };

    // Flush queue before unload
    const handleBeforeUnload = () => {
      BehaviorAnalyticsEngine.flushQueue();
    };

    window.addEventListener('click', handleClick);
    window.addEventListener('popstate', handleNavigation);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Periodic flush
    const flushInterval = setInterval(() => {
      BehaviorAnalyticsEngine.flushQueue();
    }, 30000); // Every 30 seconds

    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('popstate', handleNavigation);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(flushInterval);
    };
  }, []);

  return null;
}