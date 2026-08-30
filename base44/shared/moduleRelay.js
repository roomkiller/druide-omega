/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ RÉPÉTEUR / ACTIONNEUR — la couche entre les modules et leurs branches  ║
 * ║                                                                        ║
 * ║ Un module publie des SIGNAUX. Le répéteur ne calcule rien : il route   ║
 * ║ vers les branches (module-moteurs) qui écoutent ces signaux, et leur   ║
 * ║ passe le contexte déjà lu, en lecture seule.                           ║
 * ║                                                                        ║
 * ║ Deux vitesses, jamais mélangées :                                      ║
 * ║   sync     → arithmétique pure, aucune E/S, plafond de quelques ms.    ║
 * ║              Peut influencer la réponse.                               ║
 * ║   deferred → travail lourd, lancé APRÈS l'envoi, jamais attendu.       ║
 * ║              Ne peut pas influencer la réponse en cours.               ║
 * ║                                                                        ║
 * ║ Règle absolue : une branche qui échoue ou traîne est abandonnée. La    ║
 * ║ parole ne dépend jamais d'une branche.                                 ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

/** Plafond d'une branche synchrone : au-delà, elle est abandonnée. */
const SYNC_CEILING_MS = 120;

const withCeiling = (promise, ms, name) => Promise.race([
  promise,
  new Promise((_, reject) => setTimeout(() => reject(new Error(`branche ${name} hors délai (${ms}ms)`)), ms))
]);

/**
 * Crée un répéteur pour un tour de traitement.
 * @param base44 client SDK
 * @param sharedContext contexte déjà lu (mémoires, KB, tensions…) — partagé
 *        entre toutes les branches pour qu'aucune ne relise la base.
 */
export function createRelay(base44, { sharedContext = {} } = {}) {
  const branches = [];
  const signals = new Set();
  const trace = [];
  const frozen = Object.freeze({ ...sharedContext });

  return {
    /** Déclare une ou plusieurs branches. */
    register(...declared) {
      declared.flat().filter(Boolean).forEach((b) => branches.push(b));
      return this;
    },

    /** Publie un ou plusieurs signaux. Aucun calcul déclenché ici. */
    emit(...emitted) {
      emitted.flat().filter(Boolean).forEach((s) => signals.add(s));
      return this;
    },

    /** Contexte partagé, en lecture seule. */
    context() {
      return frozen;
    },

    /**
     * Exécute les branches synchrones dont un signal est publié.
     * Retourne un objet { nomBranche: résultat } — les branches abandonnées
     * sont simplement absentes.
     */
    async runSync() {
      const eligible = branches.filter((b) => b.mode === 'sync' && b.signals.some((s) => signals.has(s)));
      if (eligible.length === 0) return {};

      const started = Date.now();
      const settled = await Promise.allSettled(
        eligible.map((b) => withCeiling(Promise.resolve().then(() => b.run(frozen, base44)), SYNC_CEILING_MS, b.name))
      );

      const results = {};
      settled.forEach((outcome, i) => {
        const name = eligible[i].name;
        if (outcome.status === 'fulfilled') {
          results[name] = outcome.value;
          trace.push({ branch: name, mode: 'sync', ok: true });
        } else {
          trace.push({ branch: name, mode: 'sync', ok: false, reason: String(outcome.reason?.message || outcome.reason).slice(0, 120) });
        }
      });
      trace.push({ branch: '(vague sync)', mode: 'sync', ms: Date.now() - started, count: eligible.length });
      return results;
    },

    /**
     * Lance les branches différées et retourne IMMÉDIATEMENT.
     * À appeler après avoir composé la réponse.
     */
    runDeferred(extra = {}) {
      const eligible = branches.filter((b) => b.mode === 'deferred' && b.signals.some((s) => signals.has(s)));
      const ctx = { ...frozen, ...extra };
      eligible.forEach((b) => {
        try {
          Promise.resolve()
            .then(() => b.run(ctx, base44))
            .catch((e) => console.log(`[Relay] branche différée ${b.name} échouée:`, e?.message));
        } catch (e) {
          console.log(`[Relay] branche différée ${b.name} n'a pas démarré:`, e?.message);
        }
        trace.push({ branch: b.name, mode: 'deferred', launched: true });
      });
      return eligible.length;
    },

    /** Journal du tour : quel signal, quelle branche, combien de ms. */
    trace() {
      return { signals: [...signals], branches: trace };
    }
  };
}