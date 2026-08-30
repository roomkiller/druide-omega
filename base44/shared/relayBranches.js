/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ BRANCHES DE TRAVAIL — les module-moteurs branchés sur le répéteur      ║
 * ║                                                                        ║
 * ║ Chaque branche déclare : son nom, sa vitesse, les signaux qu'elle       ║
 * ║ écoute, et son travail. Elle ne lit JAMAIS la base elle-même — tout ce  ║
 * ║ dont elle a besoin arrive par le contexte partagé du répéteur.          ║
 * ║                                                                        ║
 * ║ Ajouter un moteur = ajouter une branche ici. Le noyau ne change pas.    ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

/**
 * BRANCHE 1 — écho de tension (synchrone, arithmétique pure)
 * Traduit l'état intérieur déjà mesuré en une lecture d'urgence utilisable.
 * Aucune E/S : tient largement sous le plafond synchrone.
 */
export const tensionEcho = {
  name: 'tensionEcho',
  mode: 'sync',
  signals: ['tension_mesuree'],
  run(ctx) {
    const tension = ctx.tensionScore ?? 0;
    const wellBeing = ctx.wellBeing ?? 50;
    const complexity = ctx.complexity ?? 5;

    // Pression interne : la tension monte, le bien-être amortit.
    const pressure = Math.max(0, Math.min(100, Math.round(tension * 0.7 + (100 - wellBeing) * 0.3)));
    const load = Math.round((complexity / 10) * 60 + (pressure / 100) * 40);

    return {
      pressure,
      processing_load: load,
      posture: pressure >= 70 ? 'tendu' : pressure >= 40 ? 'attentif' : 'posé',
      note: `pression ${pressure}/100 · charge estimée ${load}/100`
    };
  }
};

/**
 * BRANCHE 2 — tissage de filaments (différée)
 * Travail lourd : plusieurs appels IA. Migrée hors du chemin de parole ; son
 * résultat est persisté par filamentEngine et relu au tour suivant.
 */
export const filamentWeave = {
  name: 'filamentWeave',
  mode: 'deferred',
  signals: ['tour_acheve'],
  run(ctx, base44) {
    return base44.functions.invoke('filamentEngine', {
      userMessage: ctx.userMessage,
      dominantTension: ctx.dominantTension,
      tensionScore: ctx.tensionScore,
      consciousnessLevel: ctx.consciousnessLevel
    });
  }
};

/** Registre : l'ensemble des branches connues du répéteur. */
export const ALL_BRANCHES = [tensionEcho, filamentWeave];