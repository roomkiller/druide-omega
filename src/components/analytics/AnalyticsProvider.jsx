/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Analytics Provider                                         ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { createContext, useContext, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";

const AnalyticsContext = createContext();

export function AnalyticsProvider({ children, currentPage }) {
  const sessionIdRef = useRef(null);
  const pageStartTimeRef = useRef(Date.now());

  useEffect(() => {
    // Generate session ID on mount
    if (!sessionIdRef.current) {
      sessionIdRef.current = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      trackEvent("session_start", {
        page_name: currentPage,
        metadata: {
          device_type: getDeviceType(),
          screen_size: `${window.innerWidth}x${window.innerHeight}`
        }
      });
    }

    // Track page view
    pageStartTimeRef.current = Date.now();
    trackEvent("page_view", {
      page_name: currentPage,
      metadata: {
        device_type: getDeviceType(),
        screen_size: `${window.innerWidth}x${window.innerHeight}`
      }
    });

    // Track page exit
    return () => {
      const duration = Date.now() - pageStartTimeRef.current;
      trackEvent("page_view", {
        page_name: currentPage,
        metadata: {
          duration,
          device_type: getDeviceType()
        }
      });
    };
  }, [currentPage]);

  // Error tracking
  useEffect(() => {
    const handleError = (event) => {
      trackEvent("error", {
        page_name: currentPage,
        action: "runtime_error",
        metadata: {
          error_message: event.error?.message || event.message,
          stack: event.error?.stack
        }
      });
    };

    const handleUnhandledRejection = (event) => {
      trackEvent("error", {
        page_name: currentPage,
        action: "unhandled_promise_rejection",
        metadata: {
          error_message: event.reason?.message || String(event.reason)
        }
      });
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, [currentPage]);

  const trackEvent = async (eventType, data = {}) => {
    try {
      await base44.entities.AnalyticsEvent.create({
        event_type: eventType,
        session_id: sessionIdRef.current,
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        ...data
      });
    } catch (error) {
      console.error("Analytics tracking failed:", error);
    }
  };

  const trackFeature = (featureName, action, metadata = {}) => {
    trackEvent("feature_usage", {
      feature_name: featureName,
      action,
      page_name: currentPage,
      metadata: {
        ...metadata,
        device_type: getDeviceType()
      }
    });
  };

  const trackClick = (elementName, metadata = {}) => {
    trackEvent("button_click", {
      action: elementName,
      page_name: currentPage,
      metadata
    });
  };

  const trackUserFlow = (flowName, step, metadata = {}) => {
    trackEvent("user_flow", {
      action: `${flowName}_${step}`,
      page_name: currentPage,
      metadata
    });
  };

  const value = {
    trackEvent,
    trackFeature,
    trackClick,
    trackUserFlow,
    sessionId: sessionIdRef.current
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useAnalytics must be used within AnalyticsProvider");
  }
  return context;
}

function getDeviceType() {
  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}