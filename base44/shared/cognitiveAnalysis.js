/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ ANALYSE COGNITIVE LOCALE — lire la question sans dépenser un appel IA  ║
 * ║                                                                        ║
 * ║ Mesuré : l'analyse par IA coûtait ~1 à 2 s et un appel complet sur     ║
 * ║ chaque tour, pour produire quatre valeurs (type, complexité, domaines, ║
 * ║ poids émotionnel) qui se déduisent de la forme même de la question.    ║
 * ║ Ce module les déduit localement, en quelques microsecondes.            ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

/** Familles de questions, testées dans l'ordre : la première qui matche gagne. */
const TYPE_RULES = [
  { type: 'emotional', re: /\b(je me sens|ressent|ressens|peur|angoisse|anxi|tristesse|triste|joie|seul|solitude|souffr|blessé|aime|amour|colère|honte)\b/i },
  { type: 'philosophical', re: /\b(pourquoi|sens de|conscience|existence|libre arbitre|vérité|réalité|âme|mort|infini|être|essence)\b/i },
  { type: 'ethical', re: /\b(devrait|moral|éthique|bien ou mal|juste|injuste|droit de|acceptable|responsab)\b/i },
  { type: 'meta', re: /\b(tu penses|tu ressens|ta mémoire|ton architecture|tes modules|toi-même|ta conscience|comment fais-tu)\b/i },
  { type: 'creative', re: /\b(imagine|invente|crée|écris-moi|raconte|poème|histoire|et si)\b/i },
  { type: 'procedural', re: /\b(comment (faire|je|on|puis)|étapes|procédure|méthode|tutoriel|configure|installe)\b/i },
  { type: 'technical', re: /\b(code|fonction|api|base de données|entité|module|latence|performance|bug|erreur|architecture)\b/i },
  { type: 'clarification', re: /\b(c'est-à-dire|tu veux dire|je ne comprends pas|répète|précise|quoi\?)\b/i }
];

/** Domaines de savoir reconnus par vocabulaire. */
const DOMAIN_RULES = [
  { domain: 'technique', re: /\b(code|fonction|api|serveur|module|latence|donnée|entité|algorithme|architecture)\b/i },
  { domain: 'cognition', re: /\b(mémoire|pensée|conscience|apprentissage|raisonnement|attention|cognitif)\b/i },
  { domain: 'emotion', re: /\b(émotion|sentiment|ressenti|humeur|bien-être|affect)\b/i },
  { domain: 'philosophie', re: /\b(existence|vérité|sens|morale|éthique|métaphysique|liberté)\b/i },
  { domain: 'science', re: /\b(physique|biologie|chimie|math|statistique|recherche|expérience)\b/i },
  { domain: 'sante', re: /\b(santé|médic|symptôme|diagnostic|clinique|patient|traitement)\b/i },
  { domain: 'social', re: /\b(relation|ami|famille|équipe|communauté|société|conflit)\b/i },
  { domain: 'creation', re: /\b(art|musique|écriture|design|image|poème|récit)\b/i }
];

const EMOTION_WORDS = /\b(peur|angoisse|anxi|tristesse|triste|désespoir|joie|heureux|seul|solitude|souffr|douleur|blessé|colère|rage|honte|culpabilité|aime|amour|espoir|épuisé|fatigué)\b/gi;
const INTENSIFIERS = /\b(très|vraiment|extrêmement|tellement|profondément|terriblement)\b/gi;

/** Complexité : longueur, sous-questions, subordination, abstraction. */
function scoreComplexity(message, type) {
  const words = message.trim().split(/\s+/).length;
  let score = 3;
  if (words > 8) score += 1;
  if (words > 20) score += 1;
  if (words > 40) score += 1;
  // Plusieurs interrogations dans un même message = plusieurs choses à tenir.
  const questions = (message.match(/\?/g) || []).length;
  if (questions > 1) score += 1;
  // Subordination et mise en relation : marque un raisonnement, pas un fait.
  if (/\b(parce que|puisque|alors que|tandis que|bien que|si .* alors|entre .* et|relation entre|différence entre|lien entre)\b/i.test(message)) score += 2;
  if (/\b(compare|analyse|explique pourquoi|justifie|démontre|synthétise)\b/i.test(message)) score += 1;
  // Les familles abstraites demandent d'emblée plus de profondeur.
  if (type === 'philosophical' || type === 'ethical') score += 2;
  if (type === 'meta') score += 1;
  if (type === 'clarification') score -= 1;
  return Math.max(1, Math.min(10, score));
}

/** Poids émotionnel : densité de mots affectifs, intensificateurs, ponctuation. */
function scoreEmotionalWeight(message, type) {
  const hits = (message.match(EMOTION_WORDS) || []).length;
  const boost = (message.match(INTENSIFIERS) || []).length;
  let score = 2 + hits * 2 + boost;
  if (/\bje\b/i.test(message) && hits > 0) score += 1; // parle de soi
  if (/!{1,}/.test(message)) score += 1;
  if (type === 'emotional') score = Math.max(score, 6);
  if (type === 'technical' || type === 'procedural') score = Math.min(score, 4);
  return Math.max(1, Math.min(10, score));
}

/**
 * Analyse locale complète d'un message. Déterministe, sans réseau, sans crédit.
 * Retourne la même forme que l'ancienne analyse par IA — les appelants ne
 * changent pas.
 */
export function analyzeLocally(userMessage) {
  const message = String(userMessage || '');
  const type = (TYPE_RULES.find((r) => r.re.test(message)) || { type: 'factual' }).type;
  const domains = DOMAIN_RULES.filter((r) => r.re.test(message)).map((r) => r.domain);

  return {
    question_type: type,
    complexity: scoreComplexity(message, type),
    domains: domains.length > 0 ? domains : ['general'],
    emotional_weight: scoreEmotionalWeight(message, type),
    ethical_considerations: type === 'ethical'
      ? 'Question à portée morale — peser les intérêts en présence avant de trancher.'
      : '',
    analysis_source: 'local'
  };
}