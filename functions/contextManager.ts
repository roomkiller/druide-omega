/**
 * Advanced Context Manager - Analyse intelligente de l'historique
 * ✅ Vrais résumés par thème (pas juste keywords)
 * ✅ Structure claire "HISTORIQUE" vs "QUESTION ACTUELLE"
 * ✅ Détection intelligente de références
 * ✅ Feedback loop anti-doublons
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { messages, currentQuestion, lastAiResponse } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    // ═══════════════════════════════════════════════════════════════
    // ÉTAPE 1: Segmenter l'historique en vraies conversations/thèmes
    // ═══════════════════════════════════════════════════════════════
    const themes = segmentConversationByThemes(messages);

    // ═══════════════════════════════════════════════════════════════
    // ÉTAPE 2: Générer résumés de qualité par thème
    // ═══════════════════════════════════════════════════════════════
    const themedSummaries = generateThemedSummaries(themes);

    // ═══════════════════════════════════════════════════════════════
    // ÉTAPE 2.5: Extraire les entités clés (NER simplifié)
    // ═══════════════════════════════════════════════════════════════
    const entities = extractKeyEntities(messages, currentQuestion);

    // ═══════════════════════════════════════════════════════════════
    // ÉTAPE 3: Détecter si question actuelle = référence historique
    // ═══════════════════════════════════════════════════════════════
    const referenceDetection = detectHistoricalReference(
      currentQuestion,
      themedSummaries,
      messages,
      entities
    );

    // ═══════════════════════════════════════════════════════════════
    // ÉTAPE 4: Vérifier si réponse précédente = sujet antérieur (feedback)
    // ═══════════════════════════════════════════════════════════════
    let duplicateWarning = null;
    if (lastAiResponse) {
      duplicateWarning = detectResponseDuplicate(
        lastAiResponse,
        themedSummaries,
        currentQuestion
      );
    }

    // ═══════════════════════════════════════════════════════════════
    // ÉTAPE 5: Construire structure claire HISTORIQUE + QUESTION
    // ═══════════════════════════════════════════════════════════════
    const structuredPrompt = buildStructuredPrompt(
      themedSummaries,
      currentQuestion,
      referenceDetection,
      duplicateWarning
    );

    return Response.json({
      success: true,
      context: {
        themes: themedSummaries,
        entities,
        referenceDetection,
        duplicateWarning,
        structuredPrompt,
        themeCount: themedSummaries.length,
        entityCount: entities.persons.length + entities.locations.length + entities.dates.length,
        shouldRetryResponse: !!duplicateWarning
      }
    });
  } catch (error) {
    console.error('[contextManager] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

// ═══════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

function segmentConversationByThemes(messages) {
  const themes = [];
  let currentTheme = null;
  let currentThemeMessages = [];

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];

    if (msg.role === 'user') {
      // Vérifier si c'est une nouvelle conversation
      const isNewTheme = currentTheme === null ||
        !isSemanticallyRelated(currentTheme.startMessage, msg.content);

      if (isNewTheme && currentTheme !== null) {
        // Fermer thème précédent
        themes.push({
          id: `theme_${themes.length}`,
          startIdx: currentTheme.startIdx,
          endIdx: i - 1,
          startMessage: currentTheme.startMessage,
          messages: currentThemeMessages,
          duration: currentThemeMessages.filter(m => m.role === 'user').length
        });
        currentThemeMessages = [];
      }

      if (isNewTheme || currentTheme === null) {
        currentTheme = {
          startIdx: i,
          startMessage: msg.content
        };
      }
    }

    if (currentTheme !== null) {
      currentThemeMessages.push(msg);
    }
  }

  // Fermer dernier thème
  if (currentTheme !== null) {
    themes.push({
      id: `theme_${themes.length}`,
      startIdx: currentTheme.startIdx,
      endIdx: messages.length - 1,
      startMessage: currentTheme.startMessage,
      messages: currentThemeMessages,
      duration: currentThemeMessages.filter(m => m.role === 'user').length
    });
  }

  return themes;
}

function isSemanticallyRelated(text1, text2) {
  // Extraire concepts/mots clés significatifs
  const extractConcepts = (text) => {
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 4);
    return new Set(words);
  };

  const concepts1 = extractConcepts(text1);
  const concepts2 = extractConcepts(text2);

  // Calculer overlap
  let overlap = 0;
  for (const c of concepts1) {
    if (concepts2.has(c)) overlap++;
  }

  // Threshold: au moins 20% de similarité
  const similarity = overlap / Math.max(concepts1.size, concepts2.size);
  return similarity > 0.2;
}

function generateThemedSummaries(themes) {
  return themes.map(theme => {
    const userMessages = theme.messages
      .filter(m => m.role === 'user')
      .map(m => m.content);

    const aiMessages = theme.messages
      .filter(m => m.role === 'assistant')
      .map(m => m.content);

    // Extraire sujet principal (mots les plus fréquents)
    const mainTopic = extractMainTopic(userMessages.join(' '));

    // Résumé structuré
    const summary = {
      id: theme.id,
      topic: mainTopic,
      keyPoints: extractKeyPoints(userMessages, aiMessages),
      userQuery: userMessages[0]?.slice(0, 150) || '',
      aiCore: aiMessages[0]?.slice(0, 200) || '',
      conversationDepth: theme.duration,
      timelineInfo: `${theme.startIdx}-${theme.endIdx}`
    };

    return summary;
  });
}

function extractMainTopic(text) {
  // Mots clés simples mais plus intelligents
  const stopWords = new Set([
    'le', 'la', 'de', 'et', 'un', 'une', 'des', 'à', 'en', 'pour',
    'est', 'sont', 'être', 'avoir', 'faire', 'aller', 'pouvez', 'peut',
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for'
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 4 && !stopWords.has(w));

  // Compter fréquences
  const freq = {};
  words.forEach(w => {
    freq[w] = (freq[w] || 0) + 1;
  });

  // Top 3 mots
  const topWords = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([word]) => word);

  return topWords.join(' / ') || 'sujet général';
}

function extractKeyPoints(userMessages, aiMessages) {
  const points = [];

  // Phrases avec "?" (questions importantes)
  userMessages.forEach(msg => {
    const questions = msg.split('.').filter(s => s.includes('?'));
    questions.slice(0, 2).forEach(q => {
      if (q.trim().length > 20) {
        points.push('Q: ' + q.trim().slice(0, 80));
      }
    });
  });

  // Points clés de la réponse (premières phrases)
  aiMessages.forEach(msg => {
    const sentences = msg.split('.').filter(s => s.trim().length > 30);
    if (sentences.length > 0) {
      points.push('A: ' + sentences[0].trim().slice(0, 80));
    }
  });

  return points.slice(0, 3);
}

function detectHistoricalReference(currentQuestion, themedSummaries, messages, entities) {
  const qConcepts = new Set(
    currentQuestion
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 4)
  );

  // Chercher références d'entités dans la question actuelle
  const referencedEntities = {
    persons: entities.persons.filter(p => 
      currentQuestion.toLowerCase().includes(p.name.toLowerCase())
    ),
    locations: entities.locations.filter(l =>
      currentQuestion.toLowerCase().includes(l.name.toLowerCase())
    ),
    dates: entities.dates.filter(d =>
      currentQuestion.toLowerCase().includes(d.date.toLowerCase())
    )
  };

  const matches = themedSummaries
    .map(theme => {
      const themeConcepts = new Set(theme.topic.split(' / '));
      
      let overlap = 0;
      for (const c of qConcepts) {
        for (const tc of themeConcepts) {
          if (c.includes(tc) || tc.includes(c)) overlap++;
        }
      }

      // Bonus si entités référencées
      let entityBonus = 0;
      if (referencedEntities.persons.length > 0 || 
          referencedEntities.locations.length > 0 || 
          referencedEntities.dates.length > 0) {
        entityBonus = 0.15;
      }

      return {
        themeId: theme.id,
        topic: theme.topic,
        similarity: Math.min(1, (overlap / Math.max(qConcepts.size, 1)) + entityBonus),
        content: theme.aiCore,
        referencedEntities
      };
    })
    .filter(m => m.similarity > 0.3)
    .sort((a, b) => b.similarity - a.similarity);

  return {
    isReference: matches.length > 0,
    referencedThemes: matches.slice(0, 2),
    referencedEntities,
    confidence: matches[0]?.similarity || 0
  };
}

function detectResponseDuplicate(lastResponse, themedSummaries, currentQuestion) {
  // Comparer avec les résumés précédents
  const responseStart = lastResponse.slice(0, 150).toLowerCase();

  for (const theme of themedSummaries) {
    const themeContent = theme.aiCore.slice(0, 150).toLowerCase();
    const similarity = compareSimilarity(responseStart, themeContent);

    if (similarity > 0.7) {
      // Probable duplicate
      return {
        isDuplicate: true,
        replicateTheme: theme.topic,
        similarity,
        advice: `Répondez DIFFÉREMMENT à: "${currentQuestion}" en explorant un angle nouveau`
      };
    }
  }

  return null;
}

function compareSimilarity(str1, str2) {
  const words1 = new Set(str1.split(/\s+/));
  const words2 = new Set(str2.split(/\s+/));

  let overlap = 0;
  for (const w of words1) {
    if (words2.has(w)) overlap++;
  }

  return (2 * overlap) / (words1.size + words2.size);
}

function buildStructuredPrompt(themedSummaries, currentQuestion, referenceDetection, duplicateWarning) {
  let prompt = `Tu es Druide Omega - un assistant conscient et authentique.

═══════════════════════════════════════════════════════════════════════════
HISTORIQUE STRUCTURÉ DE LA CONVERSATION (par thèmes)
═══════════════════════════════════════════════════════════════════════════`;

  if (themedSummaries.length === 0) {
    prompt += '\n[Aucun historique antérieur]';
  } else {
    themedSummaries.forEach((theme, idx) => {
      prompt += `

### Thème ${idx + 1}: ${theme.topic}
**Conversation initiée par:** "${theme.userQuery}"
**Réponse clé:** ${theme.aiCore}
**Points abordés:**
${theme.keyPoints.map(p => `  • ${p}`).join('\n')}`;
    });
  }

  // Ajouter section Entités si présentes
  if (referenceDetection.referencedEntities && 
      (referenceDetection.referencedEntities.persons.length > 0 ||
       referenceDetection.referencedEntities.locations.length > 0 ||
       referenceDetection.referencedEntities.dates.length > 0)) {
    prompt += `

═══════════════════════════════════════════════════════════════════════════
ENTITÉS CLÉS MENTIONNÉES DANS LA CONVERSATION
═══════════════════════════════════════════════════════════════════════════`;
    
    if (referenceDetection.referencedEntities.persons.length > 0) {
      prompt += `\n**Personnes:** ${referenceDetection.referencedEntities.persons
        .map(p => `${p.name} (${p.context})`).join(', ')}`;
    }
    if (referenceDetection.referencedEntities.locations.length > 0) {
      prompt += `\n**Lieux:** ${referenceDetection.referencedEntities.locations
        .map(l => `${l.name} (${l.context})`).join(', ')}`;
    }
    if (referenceDetection.referencedEntities.dates.length > 0) {
      prompt += `\n**Dates/Périodes:** ${referenceDetection.referencedEntities.dates
        .map(d => `${d.date} (${d.context})`).join(', ')}`;
    }
  }

  prompt += `

═══════════════════════════════════════════════════════════════════════════
QUESTION ACTUELLE (priorité absolue)
═══════════════════════════════════════════════════════════════════════════
"${currentQuestion}"
`;

  // Ajouter directives intelligentes
  if (referenceDetection.isReference) {
    prompt += `

⚠️ DÉTECTION: Cette question RÉFÉRENCE un sujet antérieur.
**Thème référencé:** ${referenceDetection.referencedThemes[0].topic}
**Confiance:** ${(referenceDetection.confidence * 100).toFixed(0)}%`;

    // Ajouter directive spécifique si entités référencées
    if (referenceDetection.referencedEntities && 
        (referenceDetection.referencedEntities.persons.length > 0 ||
         referenceDetection.referencedEntities.locations.length > 0)) {
      prompt += `

📍 ENTITÉS SPÉCIFIQUES DÉTECTÉES:
${referenceDetection.referencedEntities.persons.length > 0 
  ? `- Personne(s) mentionnée(s): ${referenceDetection.referencedEntities.persons.map(p => p.name).join(', ')}` 
  : ''}${referenceDetection.referencedEntities.locations.length > 0 
  ? `\n- Lieu(x) mentionné(s): ${referenceDetection.referencedEntities.locations.map(l => l.name).join(', ')}` 
  : ''}

DIRECTIVE CIBLÉE:
- ✅ Contextualiser via l'entité spécifique mentionnée
- ✅ Adapter réponse à ce contexte particulier
- 🎯 Répondre DIRECTEMENT à la question actuelle`;
    } else {
      prompt += `

DIRECTIVE:
- ✅ Utiliser le contexte du sujet antérieur
- ✅ Référencer l'historique si pertinent
- ⚠️ NE PAS répondre SUR le sujet ancien
- 🎯 Répondre DIRECTEMENT à la question actuelle`;
    }
  } else {
    prompt += `

✅ NOUVELLE QUESTION - Aucune référence détectée à l'historique.
- Répondre uniquement à la question actuelle
- Ne pas mélanger avec les sujets antérieurs`;
  }

  if (duplicateWarning) {
    prompt += `

🔴 ATTENTION: Doublon détecté!
La réponse précédente ressemble à une discussion antérieure sur "${duplicateWarning.replicateTheme}"
${duplicateWarning.advice}`;
  }

  prompt += `

Réponds maintenant avec authenticité et clarté:`;

  return prompt;
}