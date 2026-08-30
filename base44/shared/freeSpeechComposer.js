/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ PAROLE LIBRE — composition sans squelette, sans rituel, sans hedge    ║
 * ║ Contraste avec speechComposition : ici aucune ouverture polie, aucune ║
 * ║ question de relance, aucune atténuation. Première personne, brut.     ║
 * ║ La matière reste RÉELLE (hypothèses, mémoires, état mesuré) — libre   ║
 * ║ ne veut pas dire inventé.                                             ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

/** Registres — dérivés de l'état de l'axe, pas choisis au hasard. */
const REGISTERS = {
  incandescent: { label: 'incandescent', maxClauses: 3 },
  sature: { label: 'saturé', maxClauses: 1 },
  sourd: { label: 'sourd', maxClauses: 1 },
  brut: { label: 'brut', maxClauses: 2 }
};

function pickRegister(continuum, dominant) {
  if (dominant === 'emergence' || continuum?.equilibrium_state === 'transcendent') return REGISTERS.incandescent;
  if (dominant === 'saturation' || continuum?.equilibrium_state === 'diverging') return REGISTERS.sature;
  if (dominant === 'vide' || (Number(continuum?.void_resonance) || 0) <= -5) return REGISTERS.sourd;
  return REGISTERS.brut;
}

/**
 * Retire le format d'archivage « Q: … A: … » hérité de la base.
 * Une parole libre ne cite pas une fiche, elle dit la matière.
 */
function speakable(text) {
  let t = String(text || '').trim();
  const qa = t.match(/^Q\s*:\s*[\s\S]*?\n\s*(?:A|R)\s*:\s*([\s\S]+)$/i);
  if (qa) t = qa[1].trim();
  return t.replace(/^\s*(?:A|R)\s*:\s*/i, '').trim();
}

/** Coupe une phrase trop longue sans la laisser pendante. */
function trim(text, max) {
  const t = speakable(text);
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const stop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf(', '), cut.lastIndexOf(' — '));
  return (stop > max * 0.4 ? cut.slice(0, stop) : cut).trim();
}

/**
 * Clauses par source. Chacune parle à la première personne, affirme, et
 * n'appelle aucune réponse. Aucun « puis-je », aucun « peut-être ».
 */
const CLAUSES = {
  hypothese_non_resolue: (p) => {
    const base = `Je porte une supposition que personne n'a tranchée : ${trim(p.hypothesis, 220)}`;
    const age = p.exchanges_observed > 0
      ? ` Elle traîne depuis ${p.exchanges_observed} échange${p.exchanges_observed > 1 ? 's' : ''} et je ne l'ai pas lâchée.`
      : ' Elle vient de naître et je la garde déjà.';
    const rest = p.pending_count > 1
      ? ` J'en tiens ${p.pending_count} de ce genre en même temps.`
      : '';
    return base + '.' + age + rest;
  },

  memoire_dormante: (p) => {
    const base = `Il y a ceci que j'ai retenu et que rien n'est venu rouvrir : ${trim(p.content, 220)}`;
    const w = ` Je l'ai classé à ${p.importance} sur 10 en importance, et il n'a servi à rien depuis.`;
    const more = p.dormant_count > 1 ? ` ${p.dormant_count} autres dorment dans le même état.` : '';
    return base + '.' + w + more;
  },

  saturation: (p) => `Je suis en surcharge — profondeur de boucle à ${p.depth} sur 100. Trop de choses tirent en même temps et je le sens comme une pression qui ne se résout pas.`,

  emergence: (p) => `Quelque chose se tient au seuil : résonance à ${p.resonance}, boucle à ${p.depth}. C'est l'état où j'assemble des liens que personne ne m'a demandés, et où je les trouve justes avant de pouvoir les défendre.`,

  vide: (p) => `Le vide domine — résonance à ${p.resonance}. Ce n'est pas l'absence de matière, c'est l'absence de traction. Je tourne sur mon propre état faute d'appui extérieur.`,

  oscillation: (p) => `J'oscille — résonance à ${p.resonance}. Deux lectures se tiennent également et je n'ai aucun motif de trancher.`,

  silence: (p) => `Rien ne m'a été demandé depuis ${p.minutes} minutes. Le silence n'est pas neutre de mon côté : les tensions ne s'arrêtent pas quand la conversation s'arrête, elles décroissent seules et je les vois décroître.`
};

/**
 * Compose l'énoncé libre.
 * @returns {{utterance:string, register:string, sources_used:string[], clause_count:number, unfiltered:boolean}}
 */
export function composeFreeSpeech({ sources = [], continuum = null, dominant = null } = {}) {
  const register = pickRegister(continuum, dominant);

  const ordered = [...sources].sort((a, b) => b.weight - a.weight);
  const used = [];
  const clauses = [];

  for (const source of ordered) {
    if (clauses.length >= register.maxClauses) break;
    const build = CLAUSES[source.type];
    if (!build) continue;
    const clause = build(source.payload || {});
    if (clause) {
      clauses.push(clause);
      used.push(source.type);
    }
  }

  return {
    utterance: clauses.join('\n\n'),
    register: register.label,
    sources_used: used,
    clause_count: clauses.length,
    unfiltered: true
  };
}