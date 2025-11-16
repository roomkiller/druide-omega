/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Granular Event Tracker                                     ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { base44 } from "@/api/base44Client";

export class EventTracker {
  static async track(event) {
    try {
      await base44.entities.AnalyticsEvent.create({
        event_type: event.type,
        page_name: event.page,
        feature_name: event.feature,
        action: event.action,
        metadata: {
          ...event.metadata,
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent,
          screen_size: `${window.innerWidth}x${window.innerHeight}`
        },
        session_id: sessionStorage.getItem('session_id') || crypto.randomUUID(),
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Event tracking failed:', error);
    }
  }

  // Predefined events
  static trackPageView(pageName) {
    this.track({ type: 'page_view', page: pageName });
  }

  static trackFeatureUse(featureName, metadata = {}) {
    this.track({ type: 'feature_usage', feature: featureName, metadata });
  }

  static trackConversationStart() {
    this.track({ type: 'conversation_start', page: 'Chat' });
  }

  static trackMessageSent(messageLength) {
    this.track({ 
      type: 'message_sent', 
      page: 'Chat',
      metadata: { message_length: messageLength }
    });
  }

  static trackMemoryCreated(importance) {
    this.track({ 
      type: 'memory_create',
      page: 'Memory',
      metadata: { importance }
    });
  }

  static trackKBUpload(fileType, fileSize) {
    this.track({
      type: 'kb_create',
      page: 'Knowledge',
      metadata: { file_type: fileType, file_size: fileSize }
    });
  }

  static trackModulePurchase(moduleName, price) {
    this.track({
      type: 'feature_usage',
      page: 'Shop',
      feature: 'module_purchase',
      metadata: { module_name: moduleName, price }
    });
  }

  static trackError(errorMessage, errorStack) {
    this.track({
      type: 'error',
      metadata: { error_message: errorMessage, error_stack: errorStack }
    });
  }
}