/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Predictive Analytics Engine                                ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { base44 } from "@/api/base44Client";

export class PredictiveEngine {
  static async analyzeBehavior() {
    try {
      // Get recent analytics events
      const events = await base44.entities.AnalyticsEvent.list("-created_date", 500);
      
      // Analyze patterns
      const patterns = this.extractPatterns(events);
      const predictions = this.generatePredictions(patterns);
      const preferences = this.inferPreferences(events);
      
      // Save analysis
      await base44.entities.UserBehaviorAnalytics.create({
        analysis_date: new Date().toISOString(),
        user_patterns: patterns,
        predictions,
        content_preferences: preferences
      });
      
      return { patterns, predictions, preferences };
    } catch (error) {
      console.error("Behavior analysis failed:", error);
      return null;
    }
  }
  
  static extractPatterns(events) {
    const hourCounts = {};
    const featureCounts = {};
    let totalDuration = 0;
    let sessionCount = 0;
    
    events.forEach(event => {
      // Active hours
      const hour = new Date(event.created_date).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      
      // Feature usage
      if (event.feature_name) {
        featureCounts[event.feature_name] = (featureCounts[event.feature_name] || 0) + 1;
      }
      
      // Session duration
      if (event.metadata?.duration) {
        totalDuration += event.metadata.duration;
        sessionCount++;
      }
    });
    
    const mostActiveHours = Object.entries(hourCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([hour]) => parseInt(hour));
    
    const favoriteFeatures = Object.entries(featureCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([feature]) => feature);
    
    const avgDuration = sessionCount > 0 ? totalDuration / sessionCount : 0;
    
    const frequency = events.length > 100 ? "very_high" : 
                     events.length > 50 ? "high" : 
                     events.length > 20 ? "medium" : "low";
    
    return {
      most_active_hours: mostActiveHours,
      favorite_features: favoriteFeatures,
      avg_session_duration: Math.round(avgDuration / 1000),
      interaction_frequency: frequency
    };
  }
  
  static generatePredictions(patterns) {
    const nextFeature = patterns.favorite_features[0] || "Chat";
    const optimalTime = patterns.most_active_hours[0] 
      ? `${patterns.most_active_hours[0]}:00` 
      : "14:00";
    
    // Calculate engagement score
    const engagementScore = Math.min(100, 
      (patterns.favorite_features.length * 10) + 
      (patterns.avg_session_duration / 60) +
      (patterns.interaction_frequency === "very_high" ? 30 : 
       patterns.interaction_frequency === "high" ? 20 : 10)
    );
    
    // Calculate churn risk (inverse of engagement)
    const churnRisk = Math.max(0, 100 - engagementScore);
    
    return {
      next_likely_feature: nextFeature,
      optimal_interaction_time: optimalTime,
      engagement_score: Math.round(engagementScore),
      churn_risk: Math.round(churnRisk)
    };
  }
  
  static inferPreferences(events) {
    const pageVisits = {};
    const conversationPatterns = [];
    
    events.forEach(event => {
      if (event.page_name) {
        pageVisits[event.page_name] = (pageVisits[event.page_name] || 0) + 1;
      }
    });
    
    const topPages = Object.entries(pageVisits)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([page]) => page);
    
    // Infer conversation style based on interaction patterns
    const hasLongSessions = events.some(e => e.metadata?.duration > 300000);
    const hasFrequentInteractions = events.length > 50;
    
    let style = "concise";
    if (hasLongSessions && topPages.includes("Consciousness")) {
      style = "philosophical";
    } else if (hasLongSessions) {
      style = "detailed";
    } else if (topPages.includes("NeuralSystem")) {
      style = "technical";
    }
    
    return {
      preferred_intelligence_types: topPages,
      conversation_style: style,
      topic_interests: topPages.filter(p => !["Home", "Settings"].includes(p))
    };
  }
  
  static async generateRecommendations() {
    try {
      const analysis = await base44.entities.UserBehaviorAnalytics.list("-created_date", 1);
      if (!analysis || analysis.length === 0) return [];
      
      const latest = analysis[0];
      const recommendations = [];
      
      // Feature recommendations based on usage
      if (!latest.user_patterns.favorite_features.includes("VoiceRoom")) {
        recommendations.push({
          recommendation_type: "feature",
          title: "Essayez la Voice Room",
          description: "Interagissez avec l'IA par la voix pour une expérience plus naturelle",
          relevance_score: 85,
          reasoning: "Vous utilisez beaucoup le chat, la voix pourrait vous plaire",
          action_url: "VoiceRoom"
        });
      }
      
      // Intelligence mode recommendations
      const topIntelligence = latest.content_preferences.preferred_intelligence_types[0];
      if (topIntelligence) {
        recommendations.push({
          recommendation_type: "intelligence_mode",
          title: `Mode ${topIntelligence} optimisé`,
          description: "Basé sur vos interactions récentes",
          relevance_score: 90,
          reasoning: `Vous interagissez souvent avec ${topIntelligence}`,
          action_url: topIntelligence
        });
      }
      
      // Engagement recommendations
      if (latest.predictions.engagement_score < 50) {
        recommendations.push({
          recommendation_type: "content",
          title: "Découvrez les pensées conscientes",
          description: "Explorez les réflexions philosophiques de l'IA",
          relevance_score: 75,
          reasoning: "Pour enrichir votre expérience",
          action_url: "Consciousness"
        });
      }
      
      // Save recommendations
      for (const rec of recommendations) {
        await base44.entities.PersonalizedRecommendation.create(rec);
      }
      
      return recommendations;
    } catch (error) {
      console.error("Recommendation generation failed:", error);
      return [];
    }
  }
}