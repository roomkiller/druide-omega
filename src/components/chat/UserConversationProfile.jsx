/**
 * UserConversationProfile - Suivi du profil utilisateur par conversation
 * Mémorise préférences, patterns, expertise, etc.
 */

export class UserConversationProfile {
  static createProfile() {
    return {
      conversationId: null,
      createdAt: new Date().toISOString(),
      
      // Profil de communication
      communication: {
        preferredDetailLevel: 'balanced', // brief, balanced, detailed
        usesEmoji: true,
        formalityLevel: 'informal', // formal, balanced, informal
        languageVariant: 'quebec-french'
      },

      // Sensibilité & État émotionnel
      emotionalProfile: {
        averageEmotionalLoad: 0,
        emotionalPatterns: [], // [{ type: 'emotional', frequency: 3, intensity: 7 }]
        vulnerabilityLevel: 'moderate', // low, moderate, high
        lastEmotionalInteraction: null
      },

      // Expertise & Apprentissage
      expertise: {
        levels: {}, // { 'practical': 'intermediate', 'philosophical': 'expert' }
        learningStyle: 'unknown', // visual, kinesthetic, linguistic, logical, mixed
        questionsAskedCount: 0
      },

      // Patterns conversationnels
      patterns: {
        dominantTopics: [], // [{ topic: 'conscience', frequency: 5 }]
        questionTypes: {}, // { practical: 3, emotional: 7, philosophical: 2 }
        averageDepth: 'moderate',
        repeatingThemes: [],
        transitionPatterns: [] // comment passe-t-il entre sujets
      },

      // Interaction avec Druide
      druidInteraction: {
        trustLevel: 0, // 0-10, grandi avec interactions positives
        preferredDruideMode: 'balanced', // contemplative, analytical, creative, compassionate
        responseQualityRating: 0, // moyenne des ratings
        whatWorks: [], // [{ type: 'emotional', what: 'questions creusantes' }]
        whatDoesnt: []
      },

      // Données de qualité
      quality: {
        usefulResponses: 0,
        totalInteractions: 0,
        usefulnessRatio: 0,
        lastQualityFeedback: null
      },

      // Historique des décisions adaptatives
      adaptationHistory: {
        modeChanges: [], // [{ from: 'contemplative', to: 'analytical', trigger: 'question', timestamp }]
        promptAdjustments: []
      }
    };
  }

  static updateProfileFromInteraction(
    profile,
    userMessage,
    aiResponse,
    questionAnalysis,
    isUserSatisfied = null
  ) {
    if (!profile) profile = this.createProfile();

    // === Update emotion profile ===
    if (questionAnalysis.characteristics.emotionalLoad > 0) {
      const currentAvg = profile.emotionalProfile.averageEmotionalLoad;
      profile.emotionalProfile.averageEmotionalLoad =
        (currentAvg + questionAnalysis.characteristics.emotionalLoad) / 2;
    }

    // === Update question types ===
    const qType = questionAnalysis.primaryType;
    profile.patterns.questionTypes[qType] = (profile.patterns.questionTypes[qType] || 0) + 1;

    // === Extract and track topics ===
    const topicKeywords = this.extractTopics(userMessage);
    topicKeywords.forEach(topic => {
      const existing = profile.patterns.dominantTopics.find(t => t.topic === topic);
      if (existing) {
        existing.frequency += 1;
      } else {
        profile.patterns.dominantTopics.push({ topic, frequency: 1 });
      }
    });

    // === Track quality if feedback given ===
    if (isUserSatisfied !== null) {
      profile.quality.totalInteractions += 1;
      if (isUserSatisfied) {
        profile.quality.usefulResponses += 1;
        profile.druidInteraction.trustLevel = Math.min(10, profile.druidInteraction.trustLevel + 0.5);
      } else {
        profile.druidInteraction.trustLevel = Math.max(0, profile.druidInteraction.trustLevel - 0.3);
      }
      profile.quality.usefulnessRatio = profile.quality.usefulResponses / profile.quality.totalInteractions;
      profile.quality.lastQualityFeedback = new Date().toISOString();
    }

    // === Detect expertise level ===
    const messageLength = userMessage.split(/\s+/).length;
    const technicalDepth = /conceptuel|abstrait|nuance|paradigme|framework/i.test(userMessage) ? 2 : 0;
    
    if (!profile.expertise.levels[qType]) {
      profile.expertise.levels[qType] = messageLength > 20 && technicalDepth > 0 ? 'advanced' : 'intermediate';
    }

    profile.expertise.questionsAskedCount += 1;

    return profile;
  }

  static getRecommendedDetailLevel(profile) {
    if (!profile) return 'balanced';
    
    const usefulnessRatio = profile.quality.usefulnessRatio || 0.5;
    const avgLoad = profile.emotionalProfile.averageEmotionalLoad;

    if (avgLoad > 6) return 'balanced'; // Émotionnel = pas trop dense
    if (usefulnessRatio > 0.7) return profile.communication.preferredDetailLevel;
    return 'balanced'; // Default safe
  }

  static getAdaptationSuggestions(profile) {
    const suggestions = [];

    // Si beaucoup d'émotionnel, favorer validation + exploration
    const emotionalFreq = profile.patterns.questionTypes['emotional'] || 0;
    if (emotionalFreq > profile.expertise.questionsAskedCount * 0.4) {
      suggestions.push({ type: 'emotional', action: 'prioritize_validation_and_exploration' });
    }

    // Si peu de feedback positif, ajuster
    if (profile.quality.usefulnessRatio < 0.5 && profile.quality.totalInteractions > 3) {
      suggestions.push({ type: 'quality', action: 'simplify_or_be_more_specific' });
    }

    // Si pattern de topics récurrents, mémoriser et utiliser
    if (profile.patterns.dominantTopics.length > 0) {
      const topTopic = profile.patterns.dominantTopics.sort((a, b) => b.frequency - a.frequency)[0];
      suggestions.push({ type: 'context', action: `leverage_recurring_topic_${topTopic.topic}` });
    }

    return suggestions;
  }

  static extractTopics(text) {
    const topicMap = {
      'conscience|consciousness|aware': 'consciousness',
      'émotion|emotion|feeling|ressent': 'emotions',
      'exist|vie|life|être|being': 'existence',
      'human|humain|personne|people': 'humanity',
      'création|create|art|music': 'creativity',
      'apprentiss|learn|teach|growth': 'learning',
      'relation|relationship|connection': 'relationships',
      'nature|environment|écologie|ecology': 'nature'
    };

    const topics = [];
    Object.entries(topicMap).forEach(([pattern, topic]) => {
      if (new RegExp(pattern, 'i').test(text)) {
        topics.push(topic);
      }
    });

    return [...new Set(topics)];
  }

  static getProfileSummary(profile) {
    if (!profile) return 'Profil vierge';

    const dominantType = Object.entries(profile.patterns.questionTypes)
      .sort(([, a], [, b]) => b - a)[0];
    const topTopic = profile.patterns.dominantTopics
      .sort((a, b) => b.frequency - a.frequency)[0];

    return `Utilisateur léger-moyen sur ${dominantType?.[0] || 'général'}, intéressé par ${topTopic?.topic || 'divers'}. Utilité: ${(profile.quality.usefulnessRatio * 100).toFixed(0)}%`;
  }
}