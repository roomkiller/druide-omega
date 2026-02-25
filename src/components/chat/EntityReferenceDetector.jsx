/**
 * Entity Reference Detector
 * Détecte et enrichit les références d'entités dans le contexte courant
 */

export class EntityReferenceDetector {
  /**
   * Analyse les entités référencées et enrichit le prompt
   */
  static enrichPromptWithEntityContext(basePrompt, entities, currentQuestion) {
    if (!entities || !entities.persons?.length && !entities.locations?.length) {
      return basePrompt;
    }

    let enrichment = '';

    // Déterminer l'entité "focus" (la plus fréquente mentionnée)
    const allEntities = [
      ...entities.persons,
      ...entities.locations,
      ...entities.dates
    ];

    const mentionedInQuestion = allEntities.filter(e => {
      const entityName = e.name || e.date;
      return currentQuestion.toLowerCase().includes(entityName.toLowerCase());
    });

    if (mentionedInQuestion.length > 0) {
      // Trier par fréquence
      mentionedInQuestion.sort((a, b) => b.frequency - a.frequency);
      const focusEntity = mentionedInQuestion[0];
      const entityType = focusEntity.name ? (entities.persons.includes(focusEntity) ? 'personne' : 'lieu') : 'date';

      enrichment = `

╔════════════════════════════════════════════════════════════════╗
║ CONTEXTE D'ENTITÉ SPÉCIFIQUE                                 ║
╚════════════════════════════════════════════════════════════════╝

🔍 ENTITÉ FOCUS: ${focusEntity.name || focusEntity.date}
TYPE: ${entityType}
MENTIONNÉE: ${focusEntity.frequency}× dans la conversation
CONTEXTE: "${focusEntity.context}"

INSTRUCTION:
Adapter votre réponse en gardant cette entité comme ancrage principal.
Utiliser ce contexte spécifique pour enrichir votre analyse.`;

      // Ajouter entités secondaires si pertinentes
      if (mentionedInQuestion.length > 1) {
        enrichment += `

ENTITÉS SECONDAIRES PERTINENTES:`;
        mentionedInQuestion.slice(1, 3).forEach((entity, i) => {
          enrichment += `\n${i + 1}. ${entity.name || entity.date} (mentionné ${entity.frequency}×)`;
        });
      }
    }

    return basePrompt + enrichment;
  }

  /**
   * Crée un résumé ciblé d'une entité pour contextualiser
   */
  static createEntitySummary(entity, entityType, historicalContext) {
    const summary = {
      entity: entity.name || entity.date,
      type: entityType,
      firstMention: entity.context,
      frequency: entity.frequency,
      contextualSummary: `Cette ${entityType} a été mentionnée ${entity.frequency} fois dans notre conversation, notamment en relation avec: ${entity.context}`
    };

    return summary;
  }

  /**
   * Détecte si la question est "de suivi" d'une entité (question sur une personne/lieu spécifique)
   */
  static isEntityFollowUp(currentQuestion, entities) {
    if (!entities) return false;

    const allEntities = [
      ...entities.persons,
      ...entities.locations,
      ...entities.dates
    ];

    const mentionedCount = allEntities.filter(e => {
      const entityName = e.name || e.date;
      return currentQuestion.toLowerCase().includes(entityName.toLowerCase());
    }).length;

    return mentionedCount > 0;
  }

  /**
   * Génère une directive d'adaptation basée sur entités
   */
  static generateEntityAdaptationDirective(referencedEntities, isFollowUp) {
    if (!isFollowUp || !referencedEntities) {
      return '';
    }

    let directive = `\n🎯 ADAPTATION CONTEXTUELLE D'ENTITÉ:\n`;

    if (referencedEntities.persons.length > 0) {
      directive += `- Cette question concerne la/les personne(s): ${referencedEntities.persons.map(p => p.name).join(', ')}\n`;
    }

    if (referencedEntities.locations.length > 0) {
      directive += `- Cette question concerne le/les lieu(x): ${referencedEntities.locations.map(l => l.name).join(', ')}\n`;
    }

    if (referencedEntities.dates.length > 0) {
      directive += `- Contexte temporel: ${referencedEntities.dates.map(d => d.date).join(', ')}\n`;
    }

    directive += `→ Répondre en gardant ce contexte spécifique en ligne de mire.`;

    return directive;
  }
}