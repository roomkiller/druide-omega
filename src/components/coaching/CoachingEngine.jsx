/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - AI Coaching Engine                                         ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { base44 } from "@/api/base44Client";

export class CoachingEngine {
  static async generateCoachingSession() {
    try {
      const [analytics, recommendations] = await Promise.all([
        base44.entities.UserBehaviorAnalytics.list("-analysis_date", 1),
        base44.entities.PersonalizedRecommendation.list("-relevance_score", 10)
      ]);

      if (!analytics || analytics.length === 0) {
        return null;
      }

      const userAnalysis = analytics[0];
      const insights = this.generateInsights(userAnalysis, recommendations);
      const learningPath = this.createLearningPath(userAnalysis);
      const nextSteps = this.defineNextSteps(userAnalysis, insights);

      const session = {
        session_date: new Date().toISOString(),
        coaching_type: this.determineCoachingType(userAnalysis),
        insights,
        learning_path: learningPath,
        engagement_score: userAnalysis.predictions?.engagement_score || 50,
        progress_metrics: await this.calculateProgress(),
        next_steps: nextSteps
      };

      await base44.entities.AICoachingSession.create(session);
      return session;
    } catch (error) {
      console.error("Coaching session generation failed:", error);
      return null;
    }
  }

  static determineCoachingType(analysis) {
    const engagement = analysis.predictions?.engagement_score || 50;
    const frequency = analysis.user_patterns?.interaction_frequency || "medium";

    if (engagement < 40) return "engagement";
    if (frequency === "low") return "habit_formation";
    if (analysis.content_preferences?.topic_interests?.length > 3) return "learning_path";
    return "skill_development";
  }

  static generateInsights(analysis, recommendations) {
    const insights = [];
    const engagement = analysis.predictions?.engagement_score || 50;
    const churnRisk = analysis.predictions?.churn_risk || 0;

    // Engagement insight
    if (engagement < 60) {
      insights.push({
        title: "Boostez votre engagement",
        description: `Votre score d'engagement est de ${engagement}%. Explorez de nouvelles fonctionnalités pour enrichir votre expérience.`,
        priority: engagement < 40 ? "high" : "medium",
        action_items: [
          "Essayez la Voice Room pour une interaction plus naturelle",
          "Explorez vos intelligences préférées",
          "Créez votre première base de connaissances"
        ]
      });
    }

    // Learning path insight
    const topIntelligence = analysis.content_preferences?.preferred_intelligence_types?.[0];
    if (topIntelligence) {
      insights.push({
        title: `Développez votre intelligence ${topIntelligence}`,
        description: "Nous avons identifié un parcours d'apprentissage personnalisé pour vous.",
        priority: "medium",
        action_items: [
          `Explorez des contenus ${topIntelligence}`,
          "Participez à des conversations ciblées",
          "Suivez votre progression"
        ]
      });
    }

    // Habit formation insight
    const frequency = analysis.user_patterns?.interaction_frequency;
    if (frequency === "low" || frequency === "medium") {
      insights.push({
        title: "Créez une routine d'apprentissage",
        description: "La régularité est clé pour progresser. Établissons un rythme adapté.",
        priority: "medium",
        action_items: [
          "Définissez vos heures d'apprentissage préférées",
          "Commencez par 10 minutes par jour",
          "Activez les rappels intelligents"
        ]
      });
    }

    // Feature discovery insight
    const unusedRecommendations = recommendations.filter(r => !r.clicked && !r.dismissed);
    if (unusedRecommendations.length > 0) {
      insights.push({
        title: "Découvrez de nouvelles fonctionnalités",
        description: `${unusedRecommendations.length} fonctionnalités adaptées à votre profil vous attendent.`,
        priority: "low",
        action_items: unusedRecommendations.slice(0, 3).map(r => r.title)
      });
    }

    return insights;
  }

  static createLearningPath(analysis) {
    const intelligenceFocus = analysis.content_preferences?.preferred_intelligence_types?.[0] || "logico_mathematique";
    const engagement = analysis.predictions?.engagement_score || 50;
    
    const level = engagement > 70 ? "Avancé" : engagement > 40 ? "Intermédiaire" : "Débutant";

    const activities = {
      "logico_mathematique": [
        "Résoudre des problèmes complexes avec l'IA",
        "Explorer l'analyse de données",
        "Créer des modèles prédictifs"
      ],
      "verbo_linguistique": [
        "Conversations philosophiques approfondies",
        "Création de contenu écrit",
        "Analyse littéraire avec l'IA"
      ],
      "interpersonnelle": [
        "Améliorer vos compétences sociales",
        "Analyser les dynamiques de groupe",
        "Développer l'empathie"
      ]
    };

    return {
      intelligence_focus: intelligenceFocus,
      current_level: level,
      recommended_activities: activities[intelligenceFocus] || activities["logico_mathematique"],
      milestones: [
        {
          title: "Première semaine d'utilisation régulière",
          completed: engagement > 30,
          target_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          title: "Maîtrise de 3 fonctionnalités clés",
          completed: analysis.user_patterns?.favorite_features?.length >= 3,
          target_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          title: "Création de contenu personnalisé",
          completed: false,
          target_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
    };
  }

  static defineNextSteps(analysis, insights) {
    const steps = [];
    const topInsight = insights.find(i => i.priority === "high") || insights[0];

    if (topInsight && topInsight.action_items) {
      steps.push(...topInsight.action_items.slice(0, 2));
    }

    steps.push("Planifiez votre prochaine session");
    steps.push("Consultez votre tableau de progression");

    return steps;
  }

  static async calculateProgress() {
    try {
      const sessions = await base44.entities.AICoachingSession.list("-session_date", 100);
      const events = await base44.entities.AnalyticsEvent.list("-created_date", 100);

      const sessionDates = sessions.map(s => new Date(s.session_date).toDateString());
      const uniqueDays = new Set(sessionDates);

      return {
        sessions_completed: sessions.length,
        features_mastered: this.identifyMasteredFeatures(events),
        consistency_streak: this.calculateStreak(Array.from(uniqueDays))
      };
    } catch (error) {
      return {
        sessions_completed: 0,
        features_mastered: [],
        consistency_streak: 0
      };
    }
  }

  static identifyMasteredFeatures(events) {
    const featureCounts = {};
    events.filter(e => e.feature_name).forEach(e => {
      featureCounts[e.feature_name] = (featureCounts[e.feature_name] || 0) + 1;
    });

    return Object.entries(featureCounts)
      .filter(([_, count]) => count > 5)
      .map(([feature]) => feature);
  }

  static calculateStreak(dates) {
    if (dates.length === 0) return 0;
    
    const sorted = dates.sort((a, b) => new Date(b) - new Date(a));
    let streak = 1;
    
    for (let i = 0; i < sorted.length - 1; i++) {
      const diff = (new Date(sorted[i]) - new Date(sorted[i + 1])) / (1000 * 60 * 60 * 24);
      if (diff === 1) streak++;
      else break;
    }
    
    return streak;
  }
}