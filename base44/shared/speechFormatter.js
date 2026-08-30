/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ FORMATAGE DE PAROLE — règles grammaticales apprises                   ║
 * ║ Transforme la matière brute (mémoires, faits KB) en expression propre.║
 * ║ Plus exigeant que responseFormatter : détecte les phrases tronquées,  ║
 * ║ préserve les listes numérotées, corrige les corruptions d'encodage.   ║
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
  const cleaned = segments.map((seg) => {
    // Splitter aussi sur les fins de phrase : un préfixe peut être en milieu de bloc.
    return seg.split(/(?<=[.!?…])\s+/).map((sub) => {
      let s = sub.trim();
      let changed = true, iter = 0;
      while (changed && iter < 5) {
        changed = false;
        for (const p of META_PREFIXES) { if (p.test(s)) { s = s.replace(p, ''); changed = true; } }
        iter++;
      }
      return s;
    }).filter((s) => s.length > 0).join(' ');
  }).filter((s) => s.length > 0).join(' ');
  return cleaned.replace(INLINE_TAG, ' ').trim();
}

export function normalizeForCmp(s) {
  return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[?!.;,:'"`()\[\]]/g, '').replace(/\s+/g, ' ').trim();
}

export function jaccard(a, b) {
  const wa = new Set(a.split(' ').filter((w) => w.length >= 2));
  const wb = new Set(b.split(' ').filter((w) => w.length >= 2));
  if (!wa.size || !wb.size) return 0;
  let inter = 0; for (const w of wa) if (wb.has(w)) inter++;
  return inter / (wa.size + wb.size - inter);
}

const COMMON_SHORT = new Set(['qui','que','pas','peu','voir','leur','plus','dont','cette','cela','tout','rien','bien','tres','etre','aux','des','les','ses','mes','tes','nos','vos','qu','un','le','la','de','du','en','au','ne','se','te','me','ce','sa','so','si','ou','ni','y','non','oui','soi','feu','tu','il','on','nous','vous','ils','elles','son','ma','ta','mon','ton']);

const NO_END_WORDS = new Set(['les','des','aux','de','du','au','la','le','un','une','et','ou','mais','donc','or','ni','car','que','qui','dans','sur','sous','pour','par','avec','sans','vers','chez','sont','est','ont','a','se','ce','sa','son','mes','tes','nos','vos','leur']);

const VALID_ENDINGS = /^(?:.{2,}?)(?:tion|ment|it[eé]|eur|aux|eaux|ois|ait|ent|ant|ond|ont|art|ort|ard|oup|oing|ing|um|ail|eil|euil|ouil|aille|eille|euille|ouille|agne|egne|ogne|sm|me|te|ge|ce|se|ne|ve|re|ie|ée|ai|oi|ui|eau|eu|ou|au|op|up|ip|ep|ap|ex|ix|ux|ez|iz|uz|az|oz|er|ir|oir|eir|nd|nt|rt|st|ct|pt|ft|gt|bt|dt|kt|mt|lt|xt|mp|np|rp|lp|tp|vp|bp|dp|kp|nc|rc|lc|gc|sc|tc|pc|bc|vc|xc|ck|sk|nk|rk|lk|tk|pk|bk|dk|gk|fk|mk|vk)$/i;

const VALID_CONS_CLUSTERS = new Set(['nt','nd','ct','rt','st','pt','ft','gt','mp','nc','rc','lc','sc','tc','pc','bc','vc','xc','ns','rs','ls','ts','ps','fs','gs','bs','ds','ks','ms','rd','ld','ng','nk','rk','lk','sk','ck','rm','lm','rn','ln','lt','rv','lv','nb','np','nf','rg','lg','dg','tg','mg','vg','bg','pg','kg','fg','cg','xg','tk','pk','bk','dk','gk','fk','mk','vk']);

/** Une phrase coupée en plein mot ou sur un mot-outil est inutilisable. */
export function isTruncated(sentence) {
  const s = String(sentence).trim();
  if (s.length < 15) return false;
  const lastWord = s.split(/\s+/).pop().replace(/[.!?…]+$/, '');
  const lw = lastWord.toLowerCase();

  if (lastWord.length >= 1 && lastWord.length <= 3 && !COMMON_SHORT.has(lw)) return true;
  if (NO_END_WORDS.has(lw) && s.length > 20) return true;

  if (lastWord.length >= 4 && lastWord.length <= 12) {
    if (!VALID_ENDINGS.test(lw) && /[bcdfghjklmnpqrstvwxz]$/i.test(lastWord)) {
      if (!VALID_CONS_CLUSTERS.has(lw.slice(-2))) return true;
    }
  }

  if (lastWord.length >= 5 && lastWord.length <= 14) {
    const bare = lw.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    // "eme" sans accent est rare en français (vs "ème"), sauf "rème" (problème, poème).
    if (/eme$/.test(bare) && !/reme$/.test(bare)) return true;
    // Suffixes longs coupés avant la fin.
    if (/(?:emen|isseme|issem|tio|aiso|iqu|umen)$/i.test(bare)) return true;
    // "ti" isolé en fin de mot long (→ "tion").
    if (bare.length >= 6 && /ti$/.test(bare) && !/(?:anti|pati|parti|arti|enti|sorti)$/i.test(bare)) return true;
  }

  // Connecteur de subordination laissé sans suite.
  const sub = s.match(/(?:tandis qu'|alors qu'|puisque|parce qu'|bien qu'|sans qu')\s+(\S{1,20})\.$/i);
  if (sub && sub[1].length <= 8) return true;

  return false;
}

/**
 * Minusculiser SEULEMENT la première lettre — un `toLowerCase()` complet
 * détruisait les sigles et les noms propres au milieu des phrases enchâssées
 * (« mais l'ia et le llm… »).
 */
export function lowerFirst(text) {
  const s = String(text || '').trim();
  if (!s) return '';
  // Un mot initial tout en majuscules est un sigle : on le laisse intact.
  const first = s.split(/\s+/)[0].replace(/[.,;:]$/, '');
  if (first.length > 1 && first === first.toUpperCase()) return s;
  return s.charAt(0).toLowerCase() + s.slice(1);
}

/**
 * Couper un texte sans le briser en plein mot : on s'arrête à la dernière
 * fin de phrase, sinon à la dernière frontière de mot. Une coupure brute
 * produisait des fragments que le filtre de troncature rejetait ensuite.
 */
export function clipAtBoundary(text, maxLen) {
  const s = String(text || '').trim();
  if (s.length <= maxLen) return s;
  const head = s.slice(0, maxLen);
  const lastStop = Math.max(head.lastIndexOf('. '), head.lastIndexOf('! '), head.lastIndexOf('? '));
  if (lastStop >= maxLen * 0.5) return head.slice(0, lastStop + 1).trim();
  const lastSpace = head.lastIndexOf(' ');
  return (lastSpace > 0 ? head.slice(0, lastSpace) : head).trim();
}

export function normalizeSentence(sentence) {
  let s = String(sentence).trim();
  if (!s) return '';
  s = s.replace(/\s+([,.!?;:])/g, '$1');
  // Protéger les sigles pointés (AMG+A.L, A.M.G) : y insérer une espace
  // coupait le sigle en deux et la seconde moitié était rejetée ensuite.
  const ACRONYM = /\b([A-Z])\.(?=[A-Z]\b|[A-Z]\.)/g;
  s = s.replace(ACRONYM, '$1\u0001');
  s = s.replace(/([,.!?;:])([^\s\d])/g, '$1 $2');
  s = s.replace(/\u0001/g, '.');
  s = s.replace(/\.{2,}/g, '.').replace(/,{2,}/g, ',').replace(/\s+/g, ' ').trim();
  s = s.charAt(0).toUpperCase() + s.slice(1);
  if (!/[.!?…]$/.test(s)) s += '.';
  return s;
}

/** Découpe en phrases, en protégeant les préfixes de liste numérotée ("1. "). */
export function splitSentences(text) {
  return String(text).replace(/(\d+)\.\s/g, '$1§')
    .replace(/\.\.\./g, '…')
    .split(/(?<=[.!?…])\s+/)
    .map((s) => s.trim().replace(/(\d+)§/g, '$1. '))
    .filter((s) => s.length > 0);
}

/**
 * Formatage complet de la parole composée : strip, déduplication tolérante aux
 * listes, rejet des phrases tronquées, normalisation, corrections d'encodage.
 */
export function formatResponse(rawText) {
  if (!rawText) return '';
  const text = stripMetadata(rawText);
  if (!text) return '';

  let sentences = splitSentences(text).map((s) => stripMetadata(s)).filter((s) => s.length > 0);

  // Déduplication : les items de liste partagent des mots sans être des doublons,
  // ils ont donc un seuil plus élevé (0.85) que la prose ordinaire (0.65).
  const seen = [];
  const kept = [];
  for (const sentence of sentences) {
    const norm = normalizeForCmp(sentence);
    if (norm.length < 5) continue;
    const isListItem = /^\d+\.\s/.test(sentence.trim());
    const dup = seen.some((s) => jaccard(s, norm) > (isListItem ? 0.85 : 0.65));
    if (!dup) { seen.push(norm); kept.push(sentence); }
  }

  sentences = kept
    .filter((s) => /^\d+\.\s/.test(s.trim()) || !isTruncated(s))
    .map(normalizeSentence);

  let res = sentences.join(' ').trim();
  res = res.replace(/\?\s*\.\s*/g, '? ').replace(/\!\s*\.\s*/g, '! ');
  res = res.replace(/\s*\.\s*\./g, '. ').replace(/\s+/g, ' ').trim();
  // Corruption récurrente dans les mémoires : "âme" à la place de "ême".
  res = res.replace(/elle-m[âa]me/gi, 'elle-même')
    .replace(/lui-m[âa]me/gi, 'lui-même')
    .replace(/soi-m[âa]me/gi, 'soi-même');

  if (res.length < 20) {
    return "Je n'ai pas assez de matière cohérente pour répondre clairement. Peux-tu reformuler ?";
  }
  return res;
}