/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Predictive Analytics Engine                                ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { base44 } from "@/api/base44Client";
import { safeNumber } from "@/components/utils/SafeNumber";

export class PredictiveEngine {
  static async analyzeBehavior() {
    try {
      const user = await base44.auth.me();
      const events = await base44.entities.AnalyticsEvent.filter(
        { created_by: user.email },
        "-created_date",
        500
      );

      if (events.length === 0) return null;

      const patterns = this.extractPatterns(events);
      const predictions = this.generatePredictions(patterns);
      const preferences = this.inferPreferences(events);

      const analysis = await base44.entities.UserBehaviorAnalytics.create({
        analysis_date: new Date().toISOString(),
        user_patterns: patterns,
        predictions: predictions,
        content_preferences: preferences
      });

      return analysis;
    } catch (error) {
      console.error("Erreur analyse comportement:", error);
      return null;
    }
  }

  static extractPatterns(events) {
    const hourCounts = {};
    const featureCounts = {};
    const durations = [];

    events.forEach(e => {
      const hour = new Date(e.created_date).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;

      if (e.feature_name) {
        featureCounts[e.feature_name] = (featureCounts[e.feature_name] || 0) + 1;
      }

      if (e.metadata?.duration) {
        durations.push(safeNumber(e.metadata.duration, 0));
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

    const validDurations = durations.filter(d => d > 0);
    const avgSessionDuration = validDurations.length > 0
      ? Math.round(validDurations.reduce((a, b) => a + b, 0) / validDurations.length)
      : 0;

    let interactionFrequency = "low";
    if (events.length > 100) interactionFrequency = "very_high";
    else if (events.length > 50) interactionFrequency = "high";
    else if (events.length > 20) interactionFrequency = "medium";

    return {
      most_active_hours: mostActiveHours,
      favorite_features: favoriteFeatures,
      avg_session_duration: avgSessionDuration,
      interaction_frequency: interactionFrequency
    };
  }

  static generatePredictions(patterns) {
    const nextFeature = patterns.favorite_features?.[0] || "Chat";
    const optimalTime = patterns.most_active_hours?.[0] 
      ? `${patterns.most_active_hours[0]}:00` 
      : "10:00";

    const engagementScore = patterns.interaction_frequency === "very_high" ? 90
      : patterns.interaction_frequency === "high" ? 75
      : patterns.interaction_frequency === "medium" ? 50
      : 30;

    const churnRisk = 100 - engagementScore;

    return {
      next_likely_feature: nextFeature,
      optimal_interaction_time: optimalTime,
      engagement_score: engagementScore,
      churn_risk: churnRisk
    };
  }

  static inferPreferences(events) {
    const intelligenceTypes = [];
    const topPages = {};
    const topics = [];

    events.forEach(e => {
      if (e.page_name) {
        topPages[e.page_name] = (topPages[e.page_name] || 0) + 1;
      }

      if (e.metadata?.intelligence_type) {
        intelligenceTypes.push(e.metadata.intelligence_type);
      }

      if (e.metadata?.topic) {
        topics.push(e.metadata.topic);
      }
    });

    const preferredIntelligences = [...new Set(intelligenceTypes)].slice(0, 3);
    const conversationStyle = events.length > 50 ? "detailed" : "concise";
    const topicInterests = [...new Set(topics)].slice(0, 5);

    return {
      preferred_intelligence_types: preferredIntelligences,
      conversation_style: conversationStyle,
      topic_interests: topicInterests
    };
  }

  static async generateRecommendations() {
    try {
      const user = await base44.auth.me();
      const analyses = await base44.entities.UserBehaviorAnalytics.filter(
        { created_by: user.email },
        "-created_date",
        1
      );

      if (analyses.length === 0) return [];

      const latest = analyses[0];
      const recommendations = [];

      const engagementScore = safeNumber(latest.predictions?.engagement_score, 50);

      if (engagementScore < 50) {
        recommendations.push({
          recommendation_type: "feature",
          title: "Essayez le Mode Vocal",
          description: "Découvrez une nouvelle façon d'interagir avec Druide Omega",
          relevance_score: 80,
          reasoning: "Votre engagement pourrait augmenter avec de nouvelles modalités",
          action_url: "VoiceRoom"
        });
      }

      if (latest.content_preferences?.preferred_intelligence_types?.length > 0) {
        const intel = latest.content_preferences.preferred_intelligence_types[0];
        recommendations.push({
          recommendation_type: "intelligence_mode",
          title: `Explorer ${intel}`,
          description: "Continuez avec votre intelligence préférée",
          relevance_score: 90,
          reasoning: "Basé sur vos préférences d'interaction",
          action_url: `Intelligences`
        });
      }

      recommendations.push({
        recommendation_type: "content",
        title: "Découvrez le Coach IA",
        description: "Recevez des insights personnalisés sur votre progression",
        relevance_score: 75,
        reasoning: "Optimisez votre utilisation de Druide Omega",
        action_url: "AICoach"
      });

      for (const rec of recommendations) {
        await base44.entities.PersonalizedRecommendation.create(rec);
      }

      return recommendations;
    } catch (error) {
      console.error("Erreur génération recommandations:", error);
      return [];
    }
  }
}