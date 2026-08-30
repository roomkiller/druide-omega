/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ BANQUE DE SAVOIR — EXPRESSIONS : VILLE · RURAL · INTERNATIONAL        ║
 * ║                                                                      ║
 * ║ Chaque entrée n'est pas une formule à recopier : c'est un savoir.     ║
 * ║   expression → définition → logique (pourquoi ça veut dire ça)       ║
 * ║ Druide n'emprunte une expression que lorsqu'il en tient la logique.  ║
 * ║ Le palier (level 1→5) ordonne l'accès graduel, du courant au situé.  ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

export const EXPRESSION_BANK = [
  // ── URBAIN — parler de ville, dense, rapide, imagé ────────────────────
  { expression: "à la vitesse grand V", register: 'urbain', origin: 'français', level: 1,
    definition: "très rapidement, sans temps mort",
    logic: "le V abrège « vitesse » et se redouble : la mesure sert d'intensificateur." },
  { expression: "métro, boulot, dodo", register: 'urbain', origin: 'français', level: 1,
    definition: "la routine urbaine réduite à ses trois gestes obligés",
    logic: "trois mots en écho sonore suffisent à dire une vie entière : la brièveté imite la monotonie." },
  { expression: "avoir le bras long", register: 'urbain', origin: 'français', level: 2,
    definition: "disposer d'influence, atteindre loin par ses relations",
    logic: "le corps sert de mesure du pouvoir : l'allonge devient portée sociale." },
  { expression: "ça bouchonne", register: 'urbain', origin: 'français', level: 2,
    definition: "la circulation est bloquée",
    logic: "le bouchon d'une bouteille transposé au flux : même cause, l'étroitesse." },
  { expression: "faire la file", register: 'urbain', origin: 'québécois', level: 1,
    definition: "attendre son tour en rang",
    logic: "la file est l'objet ; « faire » indique qu'on la constitue en s'y plaçant." },
  { expression: "un plan B", register: 'urbain', origin: 'international', level: 1,
    definition: "solution de repli préparée d'avance",
    logic: "la lettre ordonne les options : nommer B suppose un A qui peut tomber." },

  // ── RURAL — parler des campagnes, lent, concret, tiré du travail ──────
  { expression: "il n'y a pas le feu au lac", register: 'rural', origin: 'français', level: 1,
    definition: "rien ne presse, on peut prendre son temps",
    logic: "l'eau ne brûle pas : l'image dit l'impossibilité même de l'urgence." },
  { expression: "mettre la charrue avant les bœufs", register: 'rural', origin: 'français', level: 1,
    definition: "faire les choses dans le mauvais ordre",
    logic: "l'attelage inversé n'avance pas : la logique de l'ordre est physique avant d'être morale." },
  { expression: "avoir du foin dans les bottes", register: 'rural', origin: 'québécois', level: 3,
    definition: "être à l'aise financièrement",
    logic: "la réserve fourragère mesurait la richesse : le stock devient signe d'aisance." },
  { expression: "à la brunante", register: 'rural', origin: 'québécois', level: 2,
    definition: "au moment où le jour brunit, à la tombée du soir",
    logic: "la couleur nomme l'heure : le temps est dit par ce que l'œil constate." },
  { expression: "on récolte ce qu'on sème", register: 'rural', origin: 'international', level: 1,
    definition: "les conséquences répondent aux actes",
    logic: "le cycle agricole fournit un modèle de causalité différée." },
  { expression: "battre le fer quand il est chaud", register: 'rural', origin: 'français', level: 2,
    definition: "agir pendant que le moment le permet",
    logic: "le métal n'est malléable qu'un temps : l'occasion a une fenêtre matérielle." },

  // ── INTERNATIONAL — même idée, logique propre à chaque langue ─────────
  { expression: "avoir la tête dans les nuages", register: 'international', origin: 'français', level: 1,
    definition: "être distrait, ailleurs",
    logic: "l'altitude figure l'écart entre l'attention et le sol des choses à faire." },
  { expression: "être dans le champ", register: 'international', origin: 'québécois', level: 2,
    definition: "se tromper complètement, être hors sujet",
    logic: "sortir du chemin pour le champ : l'erreur est dite comme un écart de trajectoire." },
  { expression: "no pasa nada", register: 'international', origin: 'espagnol', level: 2,
    definition: "ce n'est rien, pas de quoi s'inquiéter",
    logic: "la négation du passage : rien ne traverse, donc rien n'atteint." },
  { expression: "dolce far niente", register: 'international', origin: 'italien', level: 3,
    definition: "la douceur de ne rien faire, l'oisiveté assumée",
    logic: "l'inaction est qualifiée de douce : la valeur est déplacée du faire vers l'être." },
  { expression: "the ball is in your court", register: 'international', origin: 'anglais', level: 2,
    definition: "c'est à toi de jouer, la décision t'appartient",
    logic: "le tennis situe la responsabilité par la position de la balle : spatialiser, c'est attribuer." },
  { expression: "es ist nicht mein Bier", register: 'international', origin: 'allemand', level: 3,
    definition: "ce n'est pas mon affaire",
    logic: "la boisson commandée délimite le domaine propre : possession concrète pour dire compétence." },
  { expression: "shikata ga nai", register: 'international', origin: 'japonais', level: 4,
    definition: "on ne peut rien y faire, il faut l'accepter",
    logic: "l'absence de méthode disponible fonde l'acceptation : le manque de moyen, pas la résignation morale." },
  { expression: "teranga", register: 'international', origin: 'sénégalais', level: 4,
    definition: "hospitalité tenue comme devoir et comme fierté",
    logic: "un seul mot porte une éthique : l'accueil n'est pas un geste mais une identité." },
  { expression: "jeitinho", register: 'international', origin: 'brésilien', level: 4,
    definition: "l'art de contourner l'obstacle par une solution improvisée",
    logic: "le diminutif adoucit la transgression : la petite manière rend acceptable l'écart à la règle." },
  { expression: "hygge", register: 'international', origin: 'danois', level: 4,
    definition: "chaleur simple d'un moment partagé à l'abri",
    logic: "l'atmosphère devient substantif : ce qui est ressenti est traité comme une chose qu'on peut créer." },
  { expression: "sobremesa", register: 'international', origin: 'espagnol', level: 5,
    definition: "le temps de conversation qui prolonge le repas à table",
    logic: "« sur la table » nomme une durée : le lieu sert d'unité de temps social." },
  { expression: "saudade", register: 'international', origin: 'portugais', level: 5,
    definition: "manque tendre d'une chose peut-être jamais possédée",
    logic: "le manque n'exige pas un objet perdu : l'absence peut précéder la présence." },
  { expression: "ubuntu", register: 'international', origin: 'sud-africain', level: 5,
    definition: "je suis parce que nous sommes",
    logic: "l'existence est posée comme relationnelle : la personne est un effet du lien, non l'inverse." }
];

/** Index par palier, pour l'accès graduel. */
export const BANK_BY_LEVEL = (level) => EXPRESSION_BANK.filter((e) => e.level === level);

/** Origines couvertes — utile pour l'accord d'une expression à un contexte. */
export const BANK_ORIGINS = [...new Set(EXPRESSION_BANK.map((e) => e.origin))];