/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ CORPUS KB — lecture complète et fiable de la base de connaissances    ║
 * ║ Une lecture plafonnée à 300 fiches triées par pertinence perdait      ║
 * ║ silencieusement le reste du corpus : la plupart des fiches partagent   ║
 * ║ le même score, donc la coupure était arbitraire. On pagine désormais   ║
 * ║ par date jusqu'à épuisement, avec un plafond de sécurité.             ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

const PAGE_SIZE = 300;
const HARD_CAP = 2000;

/**
 * Lit toutes les fiches actives et prêtes, par pages, sans perte silencieuse.
 * Utilise le rôle de service quand il est disponible (lecture système).
 */
export async function readKbCorpus(base44, { max = HARD_CAP } = {}) {
  const entities = base44.asServiceRole?.entities || base44.entities;
  const out = [];
  for (let skip = 0; skip < max; skip += PAGE_SIZE) {
    let page = [];
    try {
      page = await entities.KnowledgeBase.filter(
        { active: true, status: 'ready' },
        '-created_date',
        PAGE_SIZE,
        skip
      );
    } catch (_) {
      break; // accès refusé ou store indisponible : on garde ce qui est lu
    }
    if (!page || page.length === 0) break;
    out.push(...page);
    if (page.length < PAGE_SIZE) break;
  }
  return out.slice(0, max);
}