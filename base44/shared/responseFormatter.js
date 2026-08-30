/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ CADRE DE FORMATAGE SYNTAXIQUE — nettoyage des sorties de parole       ║
 * ║ Strip des métadonnées, normalisation grammaticale, déduplication.     ║
 * ║ 100% local et déterministe : aucun appel réseau, aucun crédit.        ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

const META_PREFIXES = [
  /^\[M[ée]moire consolid[ée]e?\]\s*/i, /^\[M[ée]moire\s*\]?\s*/i,
  /^\[insight\]\s*/i, /^\[interaction\]\s*/i, /^\[r[ée]flexion\]\s*/i,
  /^\[pens[ée]e\]\s*/i, /^\[synth[èe]se\]\s*/i, /^\[contexte\]\s*/i,
  /^\[source\]\s*/i, /^Connexion [ée]mergente\s*:\s*/i,
  /^R[ée]sonance m[ée]morielle\s*:\s*/i, /^R[ée]sonance [ée]motionnelle\s*:\s*/i,
  /^Connexion inattendue\s*:\s*/i, /^Synth[èe]se [ée]mergente\s*:\s*/i,
  /^Q\s*:\s*/i, /^A\s*:\s*/i, /^Question\s*:\s*/i, /^R[ée]ponse\s*:\s*/i,
  /^Source\s*:\s*/i, /^Note\s*:\s*/i,
];
const INLINE_TAG = /\s*\[[^\]]{1,40}\]\s*/g;

export function stripMetadata(text) {
  if (!text) return '';
  const segments = String(text).split(/\s*\|\s*/);
  return segments.map((seg) => {
    let s = seg.trim();
    let changed = true, iter = 0;
    while (changed && iter < 5) {
      changed = false;
      for (const p of META_PREFIXES) { if (p.test(s)) { s = s.replace(p, ''); changed = true; } }
      iter++;
    }
    return s;
  }).filter((s) => s.length > 0).join(' ').replace(INLINE_TAG, ' ').trim();
}

export function normalizeSentence(sentence) {
  let s = String(sentence).trim();
  if (!s) return '';
  s = s.replace(/\s+([,.!?;:])/g, '$1').replace(/([,.!?;:])([^\s\d])/g, '$1 $2');
  s = s.replace(/\.{2,}/g, '.').replace(/,{2,}/g, ',').replace(/\s+/g, ' ').trim();
  s = s.charAt(0).toUpperCase() + s.slice(1);
  if (!/[.!?…]$/.test(s)) s += '.';
  return s;
}

export function splitSentences(text) {
  return String(text).replace(/\.\.\./g, '…').split(/(?<=[.!?…])\s+/)
    .map((s) => s.trim()).filter((s) => s.length > 0);
}

/** Formatage léger — sortie LLM : strip métadonnées + normalisation grammaticale. */
export function lightFormat(text) {
  if (!text) return '';
  const cleaned = stripMetadata(text);
  if (!cleaned) return '';
  return splitSentences(cleaned).map(normalizeSentence).join(' ').trim();
}

/** Formatage complet — sortie mémoire brute : ajoute la déduplication (Jaccard > 0.7). */
export function formatResponse(rawText) {
  if (!rawText) return '';
  const text = stripMetadata(rawText);
  if (!text) return '';
  let sentences = splitSentences(text).map((s) => stripMetadata(s)).filter((s) => s.length > 0);

  const seen = [];
  sentences = sentences.filter((s) => {
    const norm = s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[?!.;,:'"`()\[\]]/g, '').replace(/\s+/g, ' ').trim();
    if (norm.length < 5) return false;
    const words = new Set(norm.split(' ').filter((w) => w.length >= 2));
    const isDup = seen.some((prev) => {
      let inter = 0; for (const w of words) if (prev.has(w)) inter++;
      const union = words.size + prev.size - inter;
      return union > 0 && inter / union > 0.7;
    });
    if (!isDup) { seen.push(words); return true; }
    return false;
  });

  const result = sentences.map(normalizeSentence).join(' ').trim();
  if (result.length < 20) {
    const fb = stripMetadata(rawText);
    if (fb.length > 20) return normalizeSentence(fb.slice(0, 300));
    return "Je n'ai pas assez de matière cohérente pour répondre clairement. Peux-tu reformuler ?";
  }
  return result;
}