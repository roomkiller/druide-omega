/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Behavior Analytics Engine (Optimized)                      ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { base44 } from "@/api/base44Client";

export class BehaviorAnalyticsEngine {
  static SESSION_KEY = 'druide_analytics_session';
  static BATCH_SIZE = 10;
  static eventQueue = [];
  static lastFlush = Date.now();
  static FLUSH_INTERVAL = 60000; // 1 minute
  static insightsCache = null;
  static lastInsightsGeneration = 0;
  static INSIGHTS_CACHE_DURATION = 300000; // 5 minutes

  /**
   * Track user interaction (lightweight, no API calls)
   */
  static async trackInteraction(section, action, metadata = {}) {
    try {
      const event = {
        event_type: 'interaction',
        section,
        action,
        metadata,
        timestamp: new Date().toISOString(),
        session_id: this.getSessionId(),
        user_agent: navigator.userAgent,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        page: window.location.pathname
      };

      // Add to queue
      this.eventQueue.push(event);

      // Only flush if batch is full OR enough time has passed
      const timeSinceLastFlush = Date.now() - this.lastFlush;
      if (this.eventQueue.length >= this.BATCH_SIZE || timeSinceLastFlush > this.FLUSH_INTERVAL) {
        await this.flushQueue();
      }

      // Save to localStorage for offline support
      this.saveToLocalStorage(event);
    } catch (error) {
      console.error("Error tracking interaction:", error);
    }
  }

  /**
   * Track feature usage
   */
  static async trackFeatureUsage(feature, duration_ms = null) {
    await this.trackInteraction('feature_usage', 'use', {
      feature,
      duration_ms,
      timestamp: Date.now()
    });
  }

  /**
   * Track navigation
   */
  static async trackNavigation(from, to) {
    await this.trackInteraction('navigation', 'navigate', {
      from,
      to,
      timestamp: Date.now()
    });
  }

  /**
   * Track search query
   */
  static async trackSearch(query, results_count, search_type = 'semantic') {
    await this.trackInteraction('search', 'query', {
      query: query.slice(0, 100),
      results_count,
      search_type,
      timestamp: Date.now()
    });
  }

  /**
   * Track workflow execution
   */
  static async trackWorkflowAction(workflow_id, action_type) {
    await this.trackInteraction('workflow', action_type, {
      workflow_id,
      timestamp: Date.now()
    });
  }

  /**
   * Flush event queue to database
   */
  static async flushQueue() {
    if (this.eventQueue.length === 0) return;

    const eventsToSave = [...this.eventQueue];
    this.eventQueue = [];
    this.lastFlush = Date.now();

    try {
      await Promise.all(
        eventsToSave.map(event => 
          base44.entities.UserBehaviorAnalytics.create(event)
        )
      );
    } catch (error) {
      console.error("Error flushing analytics queue:", error);
      // Re-add to queue on failure
      this.eventQueue.unshift(...eventsToSave);
    }
  }

  /**
   * Get or create session ID
   */
  static getSessionId() {
    let sessionId = sessionStorage.getItem(this.SESSION_KEY);
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem(this.SESSION_KEY, sessionId);
    }
    return sessionId;
  }

  /**
   * Save to localStorage for offline
   */
  static saveToLocalStorage(event) {
    try {
      const stored = JSON.parse(localStorage.getItem('druide_analytics_offline') || '[]');
      stored.push(event);
      // Keep last 100 events
      if (stored.length > 100) stored.shift();
      localStorage.setItem('druide_analytics_offline', JSON.stringify(stored));
    } catch (error) {
      console.warn("Could not save to localStorage:", error);
    }
  }

  /**
   * Analyze user behavior patterns (cached)
   */
  static async analyzePatterns(timeRange = 7) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - timeRange);

      const events = await base44.entities.UserBehaviorAnalytics.list('-timestamp', 500);
      
      const recentEvents = events.filter(e => 
        new Date(e.timestamp) >= startDate
      );

      // Calculate metrics (no AI calls)
      const sectionUsage = this.calculateSectionUsage(recentEvents);
      const featureFrequency = this.calculateFeatureFrequency(recentEvents);
      const actionSequences = this.detectActionSequences(recentEvents);
      const repetitivePatterns = this.detectRepetitivePatterns(recentEvents);
      const peakHours = this.detectPeakHours(recentEvents);
      const avgSessionDuration = this.calculateAvgSessionDuration(recentEvents);

      // Only generate insights if cache is expired
      let insights = this.insightsCache;
      const timeSinceLastInsights = Date.now() - this.lastInsightsGeneration;
      
      if (!insights || timeSinceLastInsights > this.INSIGHTS_CACHE_DURATION) {
        insights = await this.generateInsights({
          sectionUsage,
          featureFrequency,
          actionSequences,
          repetitivePatterns
        });
        this.insightsCache = insights;
        this.lastInsightsGeneration = Date.now();
      }

      return {
        timeRange,
        totalEvents: recentEvents.length,
        sectionUsage,
        featureFrequency,
        actionSequences,
        repetitivePatterns,
        peakHours,
        avgSessionDuration,
        insights
      };
    } catch (error) {
      console.error("Error analyzing patterns:", error);
      return null;
    }
  }

  /**
   * Calculate section usage
   */
  static calculateSectionUsage(events) {
    const sections = {};
    events.forEach(e => {
      const section = e.section || 'unknown';
      sections[section] = (sections[section] || 0) + 1;
    });
    
    const total = Object.values(sections).reduce((a, b) => a + b, 0);
    return Object.entries(sections)
      .map(([section, count]) => ({
        section,
        count,
        percentage: ((count / total) * 100).toFixed(1)
      }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Calculate feature frequency
   */
  static calculateFeatureFrequency(events) {
    const features = {};
    events
      .filter(e => e.section === 'feature_usage')
      .forEach(e => {
        const feature = e.metadata?.feature || 'unknown';
        features[feature] = (features[feature] || 0) + 1;
      });
    
    return Object.entries(features)
      .map(([feature, count]) => ({ feature, count }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Detect action sequences
   */
  static detectActionSequences(events) {
    const sequences = {};
    const sortedEvents = events.sort((a, b) => 
      new Date(a.timestamp) - new Date(b.timestamp)
    );

    for (let i = 1; i < sortedEvents.length; i++) {
      const prev = sortedEvents[i - 1];
      const curr = sortedEvents[i];
      
      // Only if within 5 minutes
      const timeDiff = new Date(curr.timestamp) - new Date(prev.timestamp);
      if (timeDiff < 5 * 60 * 1000) {
        const sequence = `${prev.section}:${prev.action} → ${curr.section}:${curr.action}`;
        sequences[sequence] = (sequences[sequence] || 0) + 1;
      }
    }

    return Object.entries(sequences)
      .map(([sequence, count]) => ({ sequence, count }))
      .filter(s => s.count >= 3)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  /**
   * Detect repetitive patterns
   */
  static detectRepetitivePatterns(events) {
    const patterns = {};
    
    events.forEach(e => {
      const pattern = `${e.section}:${e.action}`;
      if (!patterns[pattern]) {
        patterns[pattern] = { count: 0, timestamps: [] };
      }
      patterns[pattern].count++;
      patterns[pattern].timestamps.push(new Date(e.timestamp));
    });

    // Find patterns that occur frequently in short time windows
    const repetitive = [];
    for (const [pattern, data] of Object.entries(patterns)) {
      if (data.count >= 5) {
        // Calculate time between occurrences
        const timestamps = data.timestamps.sort((a, b) => a - b);
        const intervals = [];
        for (let i = 1; i < timestamps.length; i++) {
          intervals.push(timestamps[i] - timestamps[i - 1]);
        }
        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        
        if (avgInterval < 10 * 60 * 1000) { // Less than 10 minutes average
          repetitive.push({
            pattern,
            count: data.count,
            avg_interval_minutes: (avgInterval / 60000).toFixed(1),
            automation_potential: data.count >= 10 ? 'high' : 'medium'
          });
        }
      }
    }

    return repetitive.sort((a, b) => b.count - a.count);
  }

  /**
   * Detect peak usage hours
   */
  static detectPeakHours(events) {
    const hours = {};
    events.forEach(e => {
      const hour = new Date(e.timestamp).getHours();
      hours[hour] = (hours[hour] || 0) + 1;
    });

    return Object.entries(hours)
      .map(([hour, count]) => ({ hour: parseInt(hour), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  /**
   * Calculate average session duration
   */
  static calculateAvgSessionDuration(events) {
    const sessions = {};
    events.forEach(e => {
      const sid = e.session_id;
      if (!sessions[sid]) {
        sessions[sid] = { start: e.timestamp, end: e.timestamp };
      } else {
        if (new Date(e.timestamp) < new Date(sessions[sid].start)) {
          sessions[sid].start = e.timestamp;
        }
        if (new Date(e.timestamp) > new Date(sessions[sid].end)) {
          sessions[sid].end = e.timestamp;
        }
      }
    });

    const durations = Object.values(sessions).map(s => 
      (new Date(s.end) - new Date(s.start)) / 60000
    );

    return durations.length > 0
      ? (durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(1)
      : 0;
  }

  /**
   * Generate AI-powered insights (CACHED - called max once per 5 min)
   */
  static async generateInsights(data) {
    try {
      const insights = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyse comportementale Druide_Omega:

UTILISATION:
${data.sectionUsage.slice(0, 5).map(s => `- ${s.section}: ${s.percentage}%`).join('\n')}

TOP FONCTIONNALITÉS:
${data.featureFrequency.slice(0, 5).map(f => `- ${f.feature}: ${f.count}x`).join('\n')}

SÉQUENCES:
${data.actionSequences.slice(0, 3).map(s => `- ${s.sequence}: ${s.count}x`).join('\n')}

PATTERNS RÉPÉTITIFS:
${data.repetitivePatterns.slice(0, 3).map(p => `- ${p.pattern}: ${p.count}x`).join('\n')}

Génère 3 suggestions d'automatisation et 2 recommandations de fonctionnalités.`,
        response_json_schema: {
          type: "object",
          properties: {
            automation_opportunities: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  pattern: { type: "string" },
                  suggested_workflow: { type: "string" },
                  time_saved: { type: "string" },
                  priority: { type: "string" }
                }
              }
            },
            feature_recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  feature: { type: "string" },
                  reason: { type: "string" },
                  usage_potential: { type: "string" }
                }
              }
            },
            ui_optimizations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  area: { type: "string" },
                  suggestion: { type: "string" },
                  expected_impact: { type: "string" }
                }
              }
            },
            quick_actions: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

      return insights;
    } catch (error) {
      console.error("Error generating insights:", error);
      return {
        automation_opportunities: [],
        feature_recommendations: [],
        ui_optimizations: [],
        quick_actions: []
      };
    }
  }

  /**
   * Get heatmap data for visualization
   */
  static async getHeatmapData(days = 7) {
    const events = await base44.entities.UserBehaviorAnalytics.list('-timestamp', 1000);
    const heatmap = {};

    events.forEach(e => {
      const date = new Date(e.timestamp);
      const day = date.toISOString().split('T')[0];
      const hour = date.getHours();
      const key = `${day}_${hour}`;
      
      heatmap[key] = (heatmap[key] || 0) + 1;
    });

    return heatmap;
  }
}