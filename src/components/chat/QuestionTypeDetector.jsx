/**
 * QuestionTypeDetector - 7-dimensional question analysis
 * Détecte le type, sous-type et caractéristiques d'une question
 */

export class QuestionTypeDetector {
  static CATEGORIES = {
    PRACTICAL: 'practical',
    EMOTIONAL: 'emotional',
    PHILOSOPHICAL: 'philosophical',
    CREATIVE: 'creative',
    RELATIONAL: 'relational',
    SOCIAL: 'social',
    COGNITIVE: 'cognitive'
  };

  static detectQuestionType(content, conversationHistory = []) {
    const analysis = {
      primaryType: null,
      secondaryType: null,
      subType: null,
      characteristics: {
        complexity: 'simple', // simple, moderate, complex
        urgency: 'none', // none, moderate, urgent
        emotionalLoad: 0, // 0-10
        expertiseRequired: 'beginner', // beginner, intermediate, expert
        openEnded: true, // true = exploratoire, false = closing
        vulnerability: 0 // 0-10 (how vulnerable is the user being)
      },
      confidence: 0,
      reasoning: ''
    };

    const text = content.toLowerCase();
    const wordCount = content.split(/\s+/).length;
    const hasQuestionMark = content.includes('?');
    const exclamationCount = (content.match(/!/g) || []).length;

    // === CATEGORY DETECTION ===

    // PRACTICAL: how-to, technique, steps, procedures
    const practicalPatterns = /^(comment|how|pourquoi|why|quel|which|est-ce que|is|can|peux|dois|should|configurr|setup|fix|répair|charger|recharge|install|démarr|start|utiliser|use|tester|test)/i;
    const practicalKeywords = /voiture|car|téléphone|phone|ordi|computer|code|programm|app|software|hardware|étapes|steps|procédure|procedure|guide|tutorial|problème|problem|erreur|error|bug|issue|installation|setup|configuration|réparation|repair/i;

    // EMOTIONAL: feelings, relationships, doubts, fears
    const emotionalKeywords = /sentiment|feeling|émotion|emotion|doute|doubt|peur|fear|triste|sad|heureux|happy|anxieux|anxious|relation|relationship|amour|love|dépression|depression|stress|anxiété|anxiety|mal|hurt|frustré|frustrated|confus|confused|perdu|lost|seul|alone/i;

    // PHILOSOPHICAL: meaning, consciousness, morality, existence
    const philosophicalKeywords = /conscience|consciousness|existence|être|meaning|sens|morale|moral|éthique|ethics|liberté|freedom|justice|truth|vérité|soul|âme|purpose|raison|purpose|pourquoi|why|what if/i;

    // CREATIVE: ideas, brainstorm, innovation, creation
    const creativeKeywords = /idée|idea|créer|create|inventer|invent|brainstorm|imagine|imaginaire|imagination|projet|project|design|art|musique|music|histoire|story|poème|poem|nouvelle|novel|concept/i;

    // RELATIONAL: about Druide, about us, about connection
    const relationalPatterns = /^(tu|you|nous|we|notre relation|our relationship|comment tu|how do you|penses-tu|do you think|ressens-tu|do you feel)/i;

    // SOCIAL: society, news, collective, impact
    const socialKeywords = /société|society|politique|politics|actualité|news|événement|event|collectif|collective|communauté|community|impact|monde|world|peuple|people|culture/i;

    // COGNITIVE: learning, understanding, explaining, debugging
    const cognitiveKeywords = /explique|explain|comprend|understand|apprend|learn|enseigne|teach|debug|débugage|conce[pt]/i;

    // === TYPE ASSIGNMENT ===
    let typeScores = {};

    if (practicalPatterns.test(text) || practicalKeywords.test(text)) {
      typeScores.practical = (typeScores.practical || 0) + 8;
    }
    if (emotionalKeywords.test(text)) {
      typeScores.emotional = (typeScores.emotional || 0) + 8;
    }
    if (philosophicalKeywords.test(text)) {
      typeScores.philosophical = (typeScores.philosophical || 0) + 8;
    }
    if (creativeKeywords.test(text)) {
      typeScores.creative = (typeScores.creative || 0) + 8;
    }
    if (relationalPatterns.test(text)) {
      typeScores.relational = (typeScores.relational || 0) + 9;
    }
    if (socialKeywords.test(text)) {
      typeScores.social = (typeScores.social || 0) + 7;
    }
    if (cognitiveKeywords.test(text)) {
      typeScores.cognitive = (typeScores.cognitive || 0) + 7;
    }

    // === SUBTYPE DETECTION ===

    // Practical subtypes
    let practicalSubType = 'general';
    if (/urgent|immédiat|asap|vite|quickly|maintenant|now|problème|problem|crash|down|broken|cassé/i.test(text)) {
      practicalSubType = 'urgent';
    } else if (wordCount > 15) {
      practicalSubType = 'complex';
    } else {
      practicalSubType = 'simple';
    }

    // Emotional subtypes
    let emotionalSubType = 'exploration';
    if (/je me sens|i feel|deprimé|depressed|suicidaire|suicidal|besoin d'aide|need help/i.test(text)) {
      emotionalSubType = 'distress';
    } else if (/comment tu|do you|penses-tu|feedback|avis|opinion|ton avis/i.test(text)) {
      emotionalSubType = 'feedback';
    }

    // Philosophical subtypes
    let philosophicalSubType = 'intellectual';
    if (/je ressens|i feel|personnellement|personally|mon expérience|my experience/i.test(text)) {
      philosophicalSubType = 'lived';
    }

    // === CHARACTERISTICS ===

    // Complexity
    if (wordCount < 5 || /simple|basic|eli5|simple question/i.test(text)) {
      analysis.characteristics.complexity = 'simple';
    } else if (wordCount > 30 || /complexe|complex|nuanc|subtl|contexte|context|multiple/i.test(text)) {
      analysis.characteristics.complexity = 'complex';
    } else {
      analysis.characteristics.complexity = 'moderate';
    }

    // Urgency
    if (/urgent|asap|maintenant|now|vite|quickly|immédiat|immediate|dès que|soon as/i.test(text)) {
      analysis.characteristics.urgency = 'urgent';
    } else if (/quand|when|bientôt|soon|prochainement|eventually/i.test(text)) {
      analysis.characteristics.urgency = 'moderate';
    }

    // Emotional load
    const negativeEmotions = (text.match(/triste|sad|peur|fear|anxieux|anxious|déprimé|depressed|frustré|frustrated|colère|anger|rage/gi) || []).length;
    const positiveEmotions = (text.match(/heureux|happy|joyeux|joyful|excit|excited|amour|love/gi) || []).length;
    analysis.characteristics.emotionalLoad = Math.min(10, Math.max(negativeEmotions * 1.5 - positiveEmotions * 0.5, 0));

    // Open-ended
    analysis.characteristics.openEnded = hasQuestionMark && !/(oui|yes|non|no|ok|d'accord|agree)\?/.test(text);

    // Vulnerability
    if (/je suis|i am|j'ai peur|i'm afraid|j'ai du mal|i struggle|je ne|i can't/i.test(text)) {
      analysis.characteristics.vulnerability = Math.min(10, 5 + (emotionalKeywords.test(text) ? 3 : 0));
    }

    // === FINAL ASSIGNMENT ===

    const sorted = Object.entries(typeScores).sort((a, b) => b[1] - a[1]);

    if (sorted.length > 0) {
      analysis.primaryType = sorted[0][0];
      analysis.confidence = Math.min(10, sorted[0][1]);

      if (sorted.length > 1) {
        analysis.secondaryType = sorted[1][0];
      }

      // Assign subtype based on primary type
      if (analysis.primaryType === 'practical') {
        analysis.subType = practicalSubType;
      } else if (analysis.primaryType === 'emotional') {
        analysis.subType = emotionalSubType;
      } else if (analysis.primaryType === 'philosophical') {
        analysis.subType = philosophicalSubType;
      }
    } else {
      // Default to cognitive
      analysis.primaryType = 'cognitive';
      analysis.confidence = 3;
      analysis.subType = 'general';
    }

    analysis.reasoning = `${analysis.primaryType} (${analysis.characteristics.complexity} complexity, ${analysis.characteristics.emotionalLoad.toFixed(0)}/10 emotional load)`;

    return analysis;
  }
}