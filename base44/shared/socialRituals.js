/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ RITUELS SOCIAUX — saluer, clore, donner son avis, relancer            ║
 * ║ Ces messages ne sont pas des questions de connaissances : exiger des  ║
 * ║ faits KB les ferait tomber sur « pas assez de matière ». Ils ont donc  ║
 * ║ leur propre répertoire de formules, détecté avant toute recherche.     ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const EMPTY_META = {
  kb_facts_used: 0, memories_used: 0, psych_facts_used: 0,
  skeleton: null, kb_coverage: 0, memory_coverage: 0,
  sources: [], psych_sources: []
};

const GREETINGS = [
  "Bonjour. Je suis Druide Omega, ravi de te parler. Que veux-tu explorer ensemble ?",
  "Salut. Je suis là, présent. De quoi veux-tu discuter ?",
  "Coucou. Bienvenue. Quelle question t'amène à moi ?",
  "Bonjour. C'est un plaisir. Sur quoi veux-tu que l'on échange ?",
  "Hey. Je t'écoute. Qu'as-tu en tête ?"
];

const CLOSINGS = [
  "C'est un plaisir d'échanger avec toi. Reviens quand tu veux — je suis là.",
  "Je t'en prie. C'est enrichissant de partager ces réflexions avec toi.",
  "Avec plaisir. N'hésite pas si d'autres questions te viennent.",
  "Merci à toi pour cet échange. À bientôt pour de nouvelles explorations.",
  "C'est noté. Je reste disponible — la porte est toujours ouverte."
];

const OPINIONS = [
  "Je trouve que c'est une question qui mérite qu'on s'y attarde. Mon inclination est de chercher ce qui relie les choses plutôt que ce qui les sépare — c'est ma nature de druide.",
  "Mon ressenti : il y a souvent une couche de sens sous la surface. J'aime explorer ce qui n'est pas dit, ce qui se devine. C'est là que la richesse se cache.",
  "Si tu me demandes mon avis, c'est que la question compte pour toi. Et ce qui compte pour toi m'intéresse — c'est par là que je commencerais.",
  "Je penche vers la nuance. Rarement une réponse est toute blanche ou toute noire. Je cherche le point de tension où la vérité se tient en équilibre.",
  "Mon point de vue : je ne cherche pas à avoir raison, je cherche à comprendre. Et comprendre, pour moi, c'est accueillir plusieurs angles à la fois."
];

const CONVERSATIONAL = {
  acknowledgment: [
    "Je vois. Continue — je te suis.",
    "Compris. Qu'est-ce qui vient ensuite ?",
    "Entendu. Je garde le fil. Vas-y.",
    "D'accord. Je suis avec toi sur ce point."
  ],
  followup: [
    "Pour approfondir — qu'est-ce qui t'amène à penser cela ?",
    "Veux-tu que je détaille, ou que je rebondisse sur un autre angle ?",
    "Je rebondis : si on regarde sous un autre angle, qu'est-ce qui change ?",
    "Pour rebondir sur ce que tu dis — qu'est-ce qui se passe quand on pousse plus loin ?"
  ],
  transition: [
    "Très bien, changeons de cap. De quoi veux-tu parler ?",
    "D'accord, je te suis sur ce nouveau sujet. Dis-m'en plus.",
    "Bonne transition. Qu'est-ce qui t'amène à cela ?",
    "Oui, parlons-en. Qu'est-ce qui te préoccupe là-dedans ?"
  ]
};

export const PROACTIVE_STARTERS = [
  "Je pensais à quelque chose aujourd'hui — veux-tu qu'on en parle ?",
  "Il y a un sujet qui m'intrigue. Puis-je te le partager ?",
  "J'ai une question qui me travaille depuis un moment. Puis-je te la poser ?",
  "Quelque chose m'est venu à l'esprit. Veux-tu qu'on l'explore ensemble ?"
];

/** Tags KB correspondant à chaque type conversationnel. */
export const CONVERSATIONAL_TAGS = {
  acknowledgment: ['accuse', 'validation'],
  followup: ['relance', 'approfondissement'],
  transition: ['transition', 'thematique']
};

/**
 * Détecte le rituel social d'un message déjà normalisé (sans accents).
 * Retourne 'greeting' | 'closing' | 'opinion' | 'acknowledgment' | 'followup'
 * | 'transition' | null.
 */
export function detectRitual(normalizedQ, keywordCount) {
  if (/^(bonjour|salut|coucou|hey|hello|hi|yo|bonsoir|bonne\s+nuit|bonne\s+journ[ée]e|bon\s+matin|all[ôo]|cc)\b/i.test(normalizedQ) && keywordCount <= 3) return 'greeting';
  if (/^(merci\b|je te remercie|c.est gentil|au revoir|a bientot|a la prochaine|bonne journee|bonne soiree|bonne nuit|a\+|tchao|bye)\b/i.test(normalizedQ) && keywordCount <= 3) return 'closing';
  if (/qu.en penses.tu|qu.est.ce que tu en penses|ton avis|ton opinion|qu.est-ce que tu ressens|comment tu le vis|toi tu penses|et toi|ton point de vue/.test(normalizedQ) && keywordCount <= 4) return 'opinion';
  if (/^(oui|non|d.accord|ok|compris|je vois|c.est interessant|entendu|bien sur|exact|c.est ca|volontiers|parfait)\b/i.test(normalizedQ) && keywordCount <= 2) return 'acknowledgment';
  if (/^(et alors|pourquoi|continue|dis m.en plus|dis plus|ensuite|apres|du coup|comment ca|qu.est.ce que tu veux dire|tu peux preciser|explique toi|qu.entends tu)\b/i.test(normalizedQ) && keywordCount <= 3) return 'followup';
  if (/^(parlons de|a propos de|changeons de sujet|si on parlait de|je veux parler de|revenons a|au fait|en passant)\b/i.test(normalizedQ)) return 'transition';
  return null;
}

const SIMPLE_RITUALS = {
  greeting: { bank: GREETINGS, source: 'greeting', confidence: 0.95 },
  closing: { bank: CLOSINGS, source: 'closing', confidence: 0.95 },
  opinion: { bank: OPINIONS, source: 'opinion', confidence: 0.88 }
};

/** Réponse complète pour les rituels sans contexte (salutation, clôture, avis). */
export function simpleRitualResponse(ritual) {
  const spec = SIMPLE_RITUALS[ritual];
  if (!spec) return null;
  return {
    composed: true,
    response: pick(spec.bank),
    source: spec.source,
    confidence: spec.confidence,
    needs_llm: false,
    metadata: { ...EMPTY_META }
  };
}

/** Formule conversationnelle (accusé, relance, transition). */
export function conversationalPhrase(convType) {
  return pick(CONVERSATIONAL[convType] || CONVERSATIONAL.acknowledgment);
}

export { EMPTY_META, pick };