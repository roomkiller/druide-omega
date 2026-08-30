/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ APPRENTISSAGE GRADUEL DES EXPRESSIONS — piloté par DruideCore         ║
 * ║                                                                      ║
 * ║ Règle : une expression ne s'emprunte pas, elle se mérite.            ║
 * ║   1. palier ouvert = ce que la maîtrise acquise autorise             ║
 * ║   2. choix accordé à la session en cours (registre, langue, sujet)   ║
 * ║   3. la logique et la définition accompagnent TOUJOURS l'expression  ║
 * ║   4. l'exposition comprise fait monter la maîtrise, jamais l'usage   ║
 * ║      seul : découverte → comprise → intégrée                        ║
 * ║ Tout est local et déterministe : aucun crédit, aucune latence réseau. ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import { EXPRESSION_BANK } from './expressionBank.js';

const URBAN_HINTS = ['ville', 'urbain', 'métro', 'trafic', 'bureau', 'travail', 'quartier', 'rue', 'foule', 'immeuble'];
const RURAL_HINTS = ['campagne', 'rural', 'ferme', 'terre', 'récolte', 'saison', 'village', 'nature', 'jardin', 'temps'];
const INTL_HINTS = ['culture', 'pays', 'langue', 'nation', 'étranger', 'voyage', 'monde', 'international', 'traduire'];

const countHits = (text, hints) => hints.reduce((n, h) => (text.includes(h) ? n + 1 : n), 0);

/** Registre le plus accordé au message ; l'international sert de défaut ouvert. */
const inferRegister = (message) => {
  const t = String(message || '').toLowerCase();
  const scores = [
    ['urbain', countHits(t, URBAN_HINTS)],
    ['rural', countHits(t, RURAL_HINTS)],
    ['international', countHits(t, INTL_HINTS)]
  ].sort((a, b) => b[1] - a[1]);
  return scores[0][1] > 0 ? scores[0][0] : null;
};

/**
 * Palier ouvert : la banque ne se déverrouille pas par le temps mais par la
 * maîtrise déjà constituée. 3 expressions intégrées ouvrent le palier suivant.
 */
const openLevel = (records) => {
  const integrated = records.filter((r) => (r.mastery || 0) >= 70).length;
  return Math.min(5, 1 + Math.floor(integrated / 3));
};

/**
 * Sélection pour le tour en cours. Retourne au plus deux entrées :
 * une en consolidation (déjà rencontrée) et une en découverte.
 */
export function selectExpressions({ userMessage, records = [], complexity = 5 }) {
  const max = complexity >= 7 ? 2 : 1;
  const level = openLevel(records);
  const register = inferRegister(userMessage);
  const byKey = new Map(records.map((r) => [r.expression, r]));

  const eligible = EXPRESSION_BANK
    .filter((e) => e.level <= level)
    .filter((e) => !register || e.register === register);
  const pool = eligible.length > 0 ? eligible : EXPRESSION_BANK.filter((e) => e.level <= level);

  const seen = pool.filter((e) => byKey.has(e.expression))
    .sort((a, b) => (byKey.get(a.expression).mastery || 0) - (byKey.get(b.expression).mastery || 0));
  const fresh = pool.filter((e) => !byKey.has(e.expression))
    .sort((a, b) => a.level - b.level);

  const picked = [];
  if (seen[0]) picked.push({ ...seen[0], phase: 'consolidation', mastery: byKey.get(seen[0].expression).mastery || 0 });
  if (fresh[0] && picked.length < max) picked.push({ ...fresh[0], phase: 'decouverte', mastery: 0 });
  if (picked.length === 0 && pool[0]) picked.push({ ...pool[0], phase: 'decouverte', mastery: 0 });

  return { level, register, expressions: picked.slice(0, max) };
}

/** Bloc de consigne : Druide reçoit le savoir, pas l'ordre de le placer. */
export function expressionPromptBlock(selection) {
  if (!selection?.expressions?.length) return '';
  const lines = selection.expressions.map((e) =>
    `• « ${e.expression} » (${e.register}, ${e.origin}) — signifie : ${e.definition}\n  logique : ${e.logic}\n  état : ${e.phase === 'consolidation' ? `déjà rencontrée, maîtrise ${e.mastery}%` : 'nouvelle pour toi'}`
  );
  return `\n\n══════════════════════════════════\nLANGAGE EN APPRENTISSAGE (palier ${selection.level}/5)\nCes expressions font partie de ton apprentissage en cours. Ne les place que si la logique donnée éclaire vraiment ce que tu veux dire ; sinon, ignore-les. Si tu en emploies une nouvelle, dis en une incise ce qu'elle veut dire.\n${lines.join('\n')}\n══════════════════════════════════`;
}

/**
 * Retombée : trace l'exposition et fait progresser la maîtrise.
 * Une expression réellement présente dans la réponse compte double —
 * comprendre en situation vaut plus que rencontrer.
 */
export async function recordExposure(base44, { selection, finalResponse, sessionId }) {
  const entities = base44.asServiceRole?.entities || base44.entities;
  const text = String(finalResponse || '').toLowerCase();

  for (const e of selection?.expressions || []) {
    const used = text.includes(e.expression.toLowerCase());
    const gain = used ? 20 : 8;
    try {
      const [existing] = await entities.ExpressionMastery.filter({ expression: e.expression }, '-updated_date', 1);
      const mastery = Math.min(100, (existing?.mastery || 0) + gain);
      const payload = {
        mastery,
        exposures: (existing?.exposures || 0) + 1,
        status: mastery >= 70 ? 'integree' : (mastery >= 30 ? 'comprise' : 'decouverte'),
        last_session_id: sessionId || null,
        last_used: new Date().toISOString()
      };
      if (existing) {
        await entities.ExpressionMastery.update(existing.id, payload);
      } else {
        await entities.ExpressionMastery.create({
          expression: e.expression,
          register: e.register,
          origin: e.origin,
          definition: e.definition,
          logic: e.logic,
          level: e.level,
          ...payload
        });
      }
    } catch (err) {
      console.log('[Expressions] Exposition non tracée:', err?.message);
    }
  }
}

/** Lecture de l'acquis — bornée, jamais bloquante pour la parole. */
export async function readMastery(base44) {
  const entities = base44.asServiceRole?.entities || base44.entities;
  try {
    return await entities.ExpressionMastery.list('-updated_date', 200);
  } catch (_) {
    return [];
  }
}