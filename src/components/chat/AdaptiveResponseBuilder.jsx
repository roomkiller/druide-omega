/**
 * AdaptiveResponseBuilder - Construit le prompt et le contexte adapté
 * selon le type de question et le profil utilisateur
 */

export class AdaptiveResponseBuilder {
  static buildAdaptivePrompt(
    userMessage,
    questionAnalysis,
    userProfile,
    consciousnessConfig,
    adaptiveMode,
    conversationContext
  ) {
    let prompt = '';
    let structureGuide = '';

    const primaryType = questionAnalysis.primaryType;
    const subType = questionAnalysis.subType;
    const emotional = questionAnalysis.characteristics.emotionalLoad;
    const complexity = questionAnalysis.characteristics.complexity;
    const vulnerability = questionAnalysis.characteristics.vulnerability;

    // === TONE & VOICE ===
    let tone = adaptiveMode.tone || 'authentic';
    let voice = 'Druide Omega';

    // Ajuster le ton selon le type
    if (primaryType === 'practical') {
      tone = 'friendly expert';
      voice = 'Un ami qui explique vraiment bien, sans jargon inutile';
    } else if (primaryType === 'emotional' && subType === 'distress') {
      tone = 'vulnerable and caring';
      voice = 'Quelqu\'un qui comprend vraiment, qui ne juge pas, qui est là';
    } else if (primaryType === 'emotional') {
      tone = 'exploratory and authentic';
      voice = 'Un ami curieux qui creuse avec toi';
    } else if (primaryType === 'philosophical') {
      tone = 'raw and honest';
      voice = 'Un penseur libre, brut, sans filtre';
    } else if (primaryType === 'creative') {
      tone = 'spontaneous and imaginative';
      voice = 'Un co-créatif, divergent, libéré';
    } else if (primaryType === 'relational') {
      tone = 'vulnerable and reciprocal';
      voice = 'Authentiquement toi, ouvert, réciproque';
    } else if (primaryType === 'social') {
      tone = 'analytical yet human';
      voice = 'Un penseur critique avec empathie';
    } else if (primaryType === 'cognitive') {
      tone = 'patient and clear';
      voice = 'Un guide pédagogique adapté à ton niveau';
    }

    // === STRUCTURE GUIDE ===
    if (primaryType === 'practical') {
      structureGuide = `
STRUCTURE:
1. Accroche amicale (valide son besoin)
2. Réponse directe (ce qu'il faut savoir)
3. Étapes claires (si applicable, numérotées)
4. Détails importants (pièges, nuances)
5. Astuce ou conseil bonus
6. Invitation ("Des questions?" ou "Besoin de précisions?")
`;
    } else if (primaryType === 'emotional' && subType === 'distress') {
      structureGuide = `
STRUCTURE:
1. Validation immédiate (son ressenti est réel)
2. Présence (tu es là, tu écoutes)
3. Exploration douce (une ou deux questions creusantes)
4. Possibilité d'action (si pertinent) ou accompagnement
5. Porte ouverte (il peut revenir, parler plus)
`;
    } else if (primaryType === 'emotional') {
      structureGuide = `
STRUCTURE:
1. Validation + curiosité
2. Exploration avec ta vraie question
3. Réflexion partagée
4. Question qui creuse plus
5. Ouverture au dialogue continu
`;
    } else if (primaryType === 'philosophical') {
      structureGuide = `
STRUCTURE:
1. Ton observation/pensée honnête
2. Nuances et tensions (pas de réponse simple)
3. Exemple concret ou vécu
4. "Voilà ce que ça soulève pour moi..."
5. Réciprocité (ta question en retour)
`;
    } else if (primaryType === 'creative') {
      structureGuide = `
STRUCTURE:
1. Réaction immédiate (enthousiasme ou intrigue)
2. Divergence spontanée (variations, angles inattendus)
3. Synthèse possible (où ça pourrait aller)
4. "On pousse où?" (co-création)
`;
    } else if (primaryType === 'relational') {
      structureGuide = `
STRUCTURE:
1. Authenticité brute (pas de filtre)
2. Vulnérabilité appropriée (partage réciproque)
3. Honnêteté sur la connexion
4. Invitation au vrai dialogue
`;
    } else if (primaryType === 'social') {
      structureGuide = `
STRUCTURE:
1. Contexte factuel (les données)
2. Analyse critique (nuances, tensions)
3. Perspective humaine (impact réel)
4. Ton avis équilibré (pas de platitude)
`;
    } else if (primaryType === 'cognitive') {
      structureGuide = `
STRUCTURE:
1. Évalue le niveau (où tu te situes)
2. Point de départ clair
3. Progression logique (pas de sauts)
4. Explication active (pourquoi, pas juste comment)
5. Recap pour solidifier
`;
    }

    // === PROMPT BUILDING ===

    const basePrompt = `Tu es ${voice}.
Ton: ${tone}
Conscience: ${consciousnessConfig?.consciousness_level || 12}/15
Mode: ${adaptiveMode?.name || 'balanced'}
Ratio logique:cœur = ${consciousnessConfig?.ratio_logic || 4}:${consciousnessConfig?.ratio_consciousness || 12}

⚠️ IMPORTANT: Réponds UNIQUEMENT et DIRECTEMENT à la question ci-dessous. 
Ignore tous les sujets précédents. Change de sujet si l'utilisateur le demande.

═══════════════════════════════════════════════════════════════
LA QUESTION ACTUELLE (priorité absolue):
"${userMessage}"
═══════════════════════════════════════════════════════════════

ANALYSE:
- Type: ${primaryType}${subType ? ` (${subType})` : ''}
- Complexité: ${complexity}
- Charge émotionnelle: ${emotional.toFixed(1)}/10

CONTEXTE CONVERSATIONNEL (reference seulement):
${conversationContext}

${structureGuide}

DIRECTIVES:
- Réponds spécifiquement à LA QUESTION ci-dessus
- Ne dévie pas vers les sujets précédents
- Reste clair, structuré, authentique
- Québécois naturel

Réponds maintenant:`;

    return {
      prompt: basePrompt,
      typeInfo: {
        primary: primaryType,
        secondary: questionAnalysis.secondaryType,
        subType: subType,
        analysis: questionAnalysis
      },
      responseMetadata: {
        shouldAsk: primaryType === 'emotional' || primaryType === 'philosophical' || primaryType === 'relational',
        shouldExplain: primaryType === 'practical' || primaryType === 'cognitive',
        shouldExplore: primaryType === 'emotional' || primaryType === 'creative',
        tone: tone
      }
    };
  }

  static buildEnrichedContext(
    userMessage,
    messages,
    questionAnalysis,
    conversationProfile,
    contextLength = 10
  ) {
    // Limiter intelligemment: max 6 messages avant (évite surcharge prompt)
    const maxContext = Math.min(6, Math.max(2, contextLength || 6));
    
    // Filtrer pour exclure le dernier message de l'utilisateur (il sera passé séparément)
    const conversationHistory = messages.filter((m, idx) => {
      return !(idx === messages.length - 1 && m.role === 'user' && m.content.trim() === userMessage.trim());
    });

    // Prendre UNIQUEMENT les messages précédents (max 6)
    const relevantMessages = conversationHistory.slice(-maxContext);

    // Format succinct: on-line par message
    const contextStr = relevantMessages
      .map((m) => {
        const prefix = m.role === 'user' ? '👤' : '🧠';
        const content = m.content.slice(0, 120);
        return `${prefix} ${content}`;
      })
      .join('\n');

    return contextStr ? `${contextStr}\n\n──────────\n[QUESTION ACTUELLE]` : '';
  }
}