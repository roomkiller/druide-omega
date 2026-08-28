/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Cadre de Formatage Syntaxique                              ║
 * ║                                                                            ║
 * ║ Post-traitement grammatical des réponses autonomes. Le composeur de parole ║
 * ║ assemble de la matière brute (mémoires, faits KB, squelettes) — ce cadre   ║
 * ║ la nettoie, déduplique et applique les règles grammaticales apprises pour   ║
 * ║ produire une expression propre, non répétitive, syntaxiquement cohérente.  ║
 * ║                                                                            ║
 * ║ Règles :                                                                   ║
 * ║   1. Strippage des préfixes métadonnées ([Mémoire consolidée], Q:, A:, ...) ║
 * ║   2. Déduplication des phrases répétées ou quasi-identiques                ║
 * ║   3. Normalisation grammaticale (casse, ponctuation, espacement)          ║
 * ║   4. Élimination des fragments tronqués (coupés en milieu de phrase)      ║
 * ║   5. Cohérence du flux (enchaînement logique des phrases)                  ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

// ── 1. PRÉFIXES MÉTADONNÉES À STRIPPER ──
// Patterns reconnus au début d'un fragment de mémoire/fait.
const METADATA_PREFIXES = [
  /^\[M[ée]moire consolid[ée]e?\]\s*/i,
  /^\[M[ée]moire\s*\]?\s*/i,
  /^\[insight\]\s*/i,
  /^\[interaction\]\s*/i,
  /^\[r[ée]flexion\]\s*/i,
  /^\[pens[ée]e\]\s*/i,
  /^\[synth[èe]se\]\s*/i,
  /^\[contexte\]\s*/i,
  /^\[source\]\s*/i,
  /^Connexion [ée]mergente\s*:\s*/i,
  /^R[ée]sonance m[ée]morielle\s*:\s*/i,
  /^R[ée]sonance [ée]motionnelle\s*:\s*/i,
  /^Connexion inattendue\s*:\s*/i,
  /^Synth[èe]se [ée]mergente\s*:\s*/i,
  /^Q\s*:\s*/i,
  /^A\s*:\s*/i,
  /^Question\s*:\s*/i,
  /^R[ée]ponse\s*:\s*/i,
  /^Source\s*:\s*/i,
  /^Note\s*:\s*/i,
  /^Sur le plan humain\s*,\s*/i, // déjà injecté par le composeur — on le garde mais propre
];

// Tags entre crochets au milieu du texte (ex: [tag], [psychologie])
const INLINE_TAG_PATTERN = /\s*\[[^\]]{1,40}\]\s*/g;

/**
 * Strippage des préfixes métadonnées d'un fragment.
 * Retire les étiquettes internes (tags, labels) pour ne garder que le texte parlé.
 * Gère aussi les préfixes apparaissant après un séparateur (|) au milieu du texte.
 */
export function stripMetadata(text) {
  if (!text) return '';
  let cleaned = String(text).trim();

  // 1. Découper sur les séparateurs de fragments (|) et nettoyer chaque morceau.
  const segments = cleaned.split(/\s*\|\s*/);
  const cleanedSegments = segments.map(seg => {
    let s = seg.trim();
    // Strippage itératif des préfixes sur chaque segment.
    let changed = true;
    let iterations = 0;
    while (changed && iterations < 5) {
      changed = false;
      for (const pattern of METADATA_PREFIXES) {
        if (pattern.test(s)) {
          s = s.replace(pattern, '');
          changed = true;
        }
      }
      iterations++;
    }
    return s;
  }).filter(s => s.length > 0);

  cleaned = cleanedSegments.join(' ');

  // 2. Retrait des tags inline [xxx].
  cleaned = cleaned.replace(INLINE_TAG_PATTERN, ' ');

  return cleaned.trim();
}

// ── 2. DÉDUPLICATION ──

/**
 * Normalise une phrase pour la comparaison (sans casse, accents, ponctuation).
 */
function normalizeForCompare(sentence) {
  return String(sentence)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[?!.;,:'"`()\[\]]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calcule la similarité de Jaccard entre deux phrases normalisées.
 */
function jaccardSimilarity(a, b) {
  const wordsA = new Set(a.split(' ').filter(w => w.length >= 2));
  const wordsB = new Set(b.split(' ').filter(w => w.length >= 2));
  if (wordsA.size === 0 || wordsB.size === 0) return 0;
  let intersection = 0;
  for (const w of wordsA) if (wordsB.has(w)) intersection++;
  const union = wordsA.size + wordsB.size - intersection;
  return intersection / union;
}

/**
 * Déduplication des phrases quasi-identiques.
 * Garde la première occurrence, retire les doublons (similarité > 0.7).
 */
export function deduplicateSentences(sentences) {
  const seen = [];
  const result = [];
  for (const sentence of sentences) {
    const normalized = normalizeForCompare(sentence);
    if (normalized.length < 5) continue; // trop court = bruit

    const isDuplicate = seen.some(s => jaccardSimilarity(s, normalized) > 0.7);
    if (!isDuplicate) {
      seen.push(normalized);
      result.push(sentence);
    }
  }
  return result;
}

// ── 3. NORMALISATION GRAMMATICALE ──

/**
 * Normalise la casse et la ponctuation d'une phrase.
 * - Majuscule en début de phrase.
 * - Point final si manquant.
 * - Espacement propre.
 */
function normalizeSentence(sentence) {
  let s = String(sentence).trim();
  if (!s) return '';

  // Retirer les espaces avant ponctuation.
  s = s.replace(/\s+([,.!?;:])/g, '$1');
  // Espacer après ponctuation si collé.
  s = s.replace(/([,.!?;:])([^\s\d])/g, '$1 $2');
  // Points multiples → un seul.
  s = s.replace(/\.{2,}/g, '.');
  // Virgules multiples.
  s = s.replace(/,{2,}/g, ',');
  // Espaces multiples.
  s = s.replace(/\s+/g, ' ').trim();

  // Majuscule en début.
  s = s.charAt(0).toUpperCase() + s.slice(1);

  // Point final si la phrase n'en a pas et n'est pas une question/exclamation.
  if (!/[.!?…]$/.test(s)) {
    s += '.';
  }

  return s;
}

// ── 4. ÉLIMINATION DES FRAGMENTS TRONQUÉS ──

/**
 * Détecte si une phrase est tronquée (coupée en milieu de mot ou d'idée).
 * Heuristiques :
 *   1. Se termine par un mot très court (1-3 lettres) qui n'est pas un mot-outil.
 *   2. Se termine par un fragment de mot (4-10 lettres) après une virgule — clause interrompue.
 *   3. Contient un connecteur de subordination non résolu en fin de phrase.
 */
function isTruncated(sentence) {
  const s = String(sentence).trim();
  if (s.length < 15) return false;

  const lastWord = s.split(/\s+/).pop().replace(/[.!?…]+$/, '');
  const COMMON_SHORT = new Set(['qui','que','pas','peu','voir','leur','plus','dont','cette','cela','tout','rien','bien','tres','etre','aux','des','les','ses','mes','tes','nos','vos','qu','un','le','la','de','du','en','au','ne','se','te','me','ce','sa','so','si','ou','ni','y','non','oui','soi','feu','eu','eu','du','tu','il','on','nous','vous','ils','elles','son','sa','ma','ta','mon','ton']);

  // 1. Mot très court (1-3 lettres) non reconnu → tronqué
  if (lastWord.length >= 1 && lastWord.length <= 3 && !COMMON_SHORT.has(lastWord.toLowerCase())) {
    return true;
  }

  // 2. Fragment de mot (4-10 lettres) après une virgule → clause interrompue
  //    Détecte "La pomme sucrée, symbole d'innocence retrouvée, se connec."
  if (lastWord.length >= 4 && lastWord.length <= 10) {
    const hasCommaNearEnd = /,\s+\S{1,30}\s+\w{4,10}\.$/.test(s);
    const endsWithRareConsonant = /[bcdfghjklmnpqrstvwxz]$/i.test(lastWord) && !/(nt|nd|ct|rt|st|mp|nc|rc|lc|gc|sc|tc|pc|bc|vc|xc)$/i.test(lastWord);
    if (hasCommaNearEnd && endsWithRareConsonant) {
      return true;
    }
  }

  // 3. Connecteur de subordination non résolu en fin de phrase
  //    "tandis qu'un so." / "alors que la." / "puisque le."
  if (/(?:tandis qu'|alors qu'|puisque|parce qu'|bien qu'|sans qu')\s+\S{1,20}\.$/i.test(s)) {
    const afterConnector = s.match(/(?:tandis qu'|alors qu'|puisque|parce qu'|bien qu'|sans qu')\s+(\S{1,20})\.$/i);
    if (afterConnector && afterConnector[1].length <= 8) return true;
  }

  return false;
}

// ── 5. PIPELINE COMPLET ──

/**
 * Découpe un texte en phrases.
 */
function splitIntoSentences(text) {
  return String(text)
    .replace(/\.\.\./g, '…')
    .split(/(?<=[.!?…])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

/**
 * Pipeline complet de formatage syntaxique.
 * Applique : strip métadonnées → découpage → déduplication → élimination tronqués → normalisation grammaticale.
 *
 * @param {string} rawText - Le texte brut à formater
 * @param {object} options - { maxSentences: nombre max de phrases (null = illimité) }
 * @returns {string} - Le texte formaté
 */
export function formatResponse(rawText, options = {}) {
  if (!rawText) return '';
  const { maxSentences = null } = options;

  // 1. Strippage des métadonnées sur le texte entier.
  let text = stripMetadata(rawText);
  if (!text) return '';

  // 2. Découpage en phrases.
  let sentences = splitIntoSentences(text);

  // 3. Strippage des métadonnées sur chaque phrase individuelle.
  sentences = sentences.map(s => stripMetadata(s)).filter(s => s.length > 0);

  // 4. Déduplication.
  sentences = deduplicateSentences(sentences);

  // 5. Élimination des fragments tronqués.
  sentences = sentences.filter(s => !isTruncated(s));

  // 6. Limitation du nombre de phrases si demandé.
  if (maxSentences && sentences.length > maxSentences) {
    sentences = sentences.slice(0, maxSentences);
  }

  // 7. Normalisation grammaticale de chaque phrase.
  sentences = sentences.map(normalizeSentence);

  // 8. Assemblage final.
  let result = sentences.join(' ').trim();

  // Sécurité : si le formatage a tout éliminé, on retourne une version propre du texte original.
  if (result.length < 20) {
    const fallback = stripMetadata(rawText);
    if (fallback.length > 20) {
      return normalizeSentence(fallback.slice(0, 300));
    }
    return "Je n'ai pas assez de matière cohérente pour répondre clairement. Peux-tu reformuler ?";
  }

  return result;
}

/**
 * Formatage léger — pour les réponses déjà partiellement structurées (ex: sortie LLM).
 * Applique seulement la normalisation grammaticale sans déduplication agressive.
 */
export function lightFormat(text) {
  if (!text) return '';
  let cleaned = stripMetadata(text);
  const sentences = splitIntoSentences(cleaned);
  return sentences.map(normalizeSentence).join(' ').trim();
}