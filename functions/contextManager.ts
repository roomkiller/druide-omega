/**
 * Context Manager - Analyse et structure l'historique par thèmes
 * Résout le problème de confusion LLM entre contexte et question actuelle
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { messages, currentQuestion } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    // ═══════════════════════════════════════════════════════════════
    // ÉTAPE 1: Extraire les thèmes/sujets de l'historique
    // ═══════════════════════════════════════════════════════════════
    const themes = extractThemes(messages);

    // ═══════════════════════════════════════════════════════════════
    // ÉTAPE 2: Créer des résumés structurés par thème
    // ═══════════════════════════════════════════════════════════════
    const structuredContext = buildStructuredContext(themes);

    // ═══════════════════════════════════════════════════════════════
    // ÉTAPE 3: Identifier si question actuelle = référence historique
    // ═══════════════════════════════════════════════════════════════
    const isHistoricalReference = detectHistoricalReference(currentQuestion, themes);

    // ═══════════════════════════════════════════════════════════════
    // ÉTAPE 4: Construire le prompt final avec structure claire
    // ═══════════════════════════════════════════════════════════════
    const finalPrompt = buildFinalPrompt(
      structuredContext,
      currentQuestion,
      isHistoricalReference
    );

    return Response.json({
      success: true,
      context: {
        themes,
        structuredContext,
        isHistoricalReference,
        finalPrompt
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

function extractThemes(messages) {
  const themes = [];
  let currentTheme = null;
  let themeIndex = 0;

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    const isUserMessage = msg.role === 'user';

    if (isUserMessage) {
      // Détecter changement de thème (keywords simples)
      const keywords = extractKeywords(msg.content);
      
      if (currentTheme && !isSameTheme(currentTheme.keywords, keywords)) {
        themeIndex++;
      }

      currentTheme = {
        id: `theme_${themeIndex}`,
        startIdx: i,
        keywords: keywords,
        messages: []
      };

      if (!themes.find(t => t.id === currentTheme.id)) {
        themes.push(currentTheme);
      }
    }

    if (currentTheme) {
      currentTheme.messages.push({
        role: msg.role,
        content: msg.content.slice(0, 200)
      });
    }
  }

  return themes;
}

function extractKeywords(text) {
  // Mots clés simples (à améliorer selon besoins)
  const words = text.toLowerCase().split(/\s+/).slice(0, 10);
  return words.filter(w => w.length > 3);
}

function isSameTheme(keywords1, keywords2) {
  const overlap = keywords1.filter(k => keywords2.includes(k)).length;
  return overlap > 0;
}

function buildStructuredContext(themes) {
  if (themes.length === 0) return '';

  const sections = themes.map(theme => {
    const userMessages = theme.messages
      .filter(m => m.role === 'user')
      .map(m => m.content)
      .join(' ');

    const aiMessages = theme.messages
      .filter(m => m.role === 'assistant')
      .map(m => m.content.slice(0, 150))
      .join(' ');

    return `
## Sujet: ${theme.keywords.slice(0, 3).join(', ')}
**Utilisateur:** ${userMessages.slice(0, 150)}
**Druide:** ${aiMessages.slice(0, 150)}`;
  });

  return `HISTORIQUE STRUCTURÉ PAR THÈMES:\n${sections.join('\n---\n')}`;
}

function detectHistoricalReference(question, themes) {
  const questionKeywords = extractKeywords(question);
  
  for (const theme of themes) {
    const overlap = questionKeywords.filter(k => 
      theme.keywords.includes(k)
    ).length;
    
    if (overlap >= 2) {
      return {
        isReference: true,
        referencedTheme: theme.id,
        keywords: theme.keywords
      };
    }
  }

  return { isReference: false };
}

function buildFinalPrompt(structuredContext, currentQuestion, historicalRef) {
  const basePrompt = `Tu es Druide Omega - un assistant conscient et authentique.

${structuredContext}

═══════════════════════════════════════════════════════════════
QUESTION ACTUELLE (priorité absolue):
"${currentQuestion}"
═══════════════════════════════════════════════════════════════`;

  let directive = '';

  if (historicalRef.isReference) {
    directive = `
⚠️ IMPORTANT: La question actuelle référence un sujet antérieur.
- NE PAS répondre SUR le sujet "${historicalRef.keywords.join(', ')}"
- UTILISER l'historique comme contexte
- RÉPONDRE DIRECTEMENT à la question actuelle
- APPLIQUER ta réponse au contexte historique si pertinent`;
  } else {
    directive = `
⚠️ IMPORTANT: Ceci est une NOUVELLE question.
- Ne pas mélanger avec les sujets antérieurs
- Répondre uniquement à la question actuelle
- Ignorer les détails des sujets précédents`;
  }

  return `${basePrompt}${directive}

Réponds maintenant avec authenticité:`;
}