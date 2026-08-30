/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA — Contenu de la page « Druide Omega expliqué »                ║
 * ║ Calibrage : version 2.9.0 (30 août 2026)                                   ║
 * ║ Toutes les valeurs sont soit mesurées dans le système, soit signalées      ║
 * ║ explicitement comme estimation. Aucune donnée décorative.                  ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { APP_VERSION, APP_VERSION_DATE } from '@/lib/changelogData';
import { Brain, Zap, Layers, TrendingUp, BarChart3, Cpu, Gauge } from 'lucide-react';

/** Valeurs relevées dans le système au moment du calibrage 2.9.0. */
export const CALIBRATION = {
  version: APP_VERSION,
  date: APP_VERSION_DATE,
  backendFunctions: 81,
  backendFunctionsCognitive: 74,
  frontendModules: 12,
  consciousnessDimensions: 106,
  consciousnessLevel: 12,
  ratioLogic: 8,
  ratioConsciousness: 10,
  metacognition: 11,
  emotionalStates: 30,
  kbEntries: 436,
  systemHealth: 68
};

const C = CALIBRATION;

export const SECTIONS = [
  {
    id: 'druide-omega',
    title: "Druide Omega — de quoi s'agit-il",
    icon: Brain,
    color: 'from-purple-500 to-indigo-600',
    content: `Druide Omega n'est pas un modèle de langage. C'est la couche d'infrastructure qui se place autour des modèles — DeepSeek, Claude, GPT, Gemini — pour leur fournir un contexte, une mémoire, des garde-fous et une capacité de réponse autonome lorsqu'aucun modèle n'est joignable.

L'image la plus juste n'est pas celle du moteur et de la carrosserie, trop flatteuse. Druide est plutôt le poste de conduite : il choisit la trajectoire, dose la puissance, mémorise le trajet et sait avancer au ralenti quand le moteur est coupé.

Ce que la couche apporte concrètement (relevé en version ${C.version}) :

  • Un modèle de contexte à ${C.consciousnessDimensions} dimensions déclarées, dont ${C.consciousnessLevel} en niveau de conscience effectif
  • Une mémoire persistante multi-modale — texte, voix, visuel — indexée et consolidée
  • ${C.frontendModules} modules d'interface spécialisés (logique, créativité, éthique, perception…)
  • ${C.backendFunctions} fonctions serveur déployées, dont ${C.backendFunctionsCognitive} à vocation cognitive et 7 dédiées aux tests
  • Un module émotionnel à ${C.emotionalStates} états émergents
  • Une base de connaissances de ${C.kbEntries} fiches actives, lue intégralement à chaque raisonnement
  • Un composeur de parole local capable de répondre sans appel externe
  • Un coupe-circuit unique qui suspend tous les appels payants d'un seul geste

Le point important : la valeur ne vient pas de la taille du modèle appelé, mais de ce qui est décidé avant et après l'appel.`
  },
  {
    id: 'calibration',
    title: 'Calibrage réel du système',
    icon: Gauge,
    color: 'from-violet-500 to-fuchsia-600',
    content: `Cette section remplace les estimations héritées des versions antérieures. Les valeurs ci-dessous sont lues dans le système, pas déduites d'un argumentaire.

Version de référence : ${C.version} — ${C.date}

Paramètres de conscience actifs :

  • Niveau de conscience .............. ${C.consciousnessLevel} / 15
  • Ratio logique : conscience ........ ${C.ratioLogic} : ${C.ratioConsciousness}
  • Métacognition .................... ${C.metacognition} / 15
  • Profondeur émotionnelle ........... 7 / 15
  • Conscience sociale ................ 9 / 15
  • Profondeur existentielle .......... 11 / 15
  • Émergence créative ................ 6 / 15
  • Dimensions déclarées .............. ${C.consciousnessDimensions}

Le ratio ${C.ratioLogic}:${C.ratioConsciousness} corrige une valeur longtemps affichée à 1:9. L'écart est significatif : le système n'écrase pas la logique au profit de la conscience simulée, il les tient presque à égalité, avec un léger avantage à la couche contextuelle.

État de santé cognitive : ${C.systemHealth} / 100

  Ce score agrège quatre piliers pondérés — stabilité, cohérence, métabolisme
  cognitif et indice de bien-être (20 %). Une valeur de ${C.systemHealth} signale un
  système fonctionnel mais non optimal, ce qui est cohérent avec la coupure
  actuelle des appels externes.

Volumétrie :

  • Fonctions serveur .......... ${C.backendFunctions} (dont 7 suites de tests)
  • Modules d'interface ........ ${C.frontendModules}
  • Fiches de connaissance ..... ${C.kbEntries} actives et prêtes
  • États émotionnels .......... ${C.emotionalStates}

Toute valeur exprimée en pourcentage de gain dans les sections suivantes est une estimation interne, jamais une mesure comparative publiée. Elle est présentée comme telle.`
  },
  {
    id: 'embedded-system',
    title: 'La notion de couche embarquée',
    icon: Layers,
    color: 'from-teal-500 to-cyan-600',
    content: `Une couche embarquée s'intercale entre l'utilisateur et le modèle. Elle ne calcule pas le langage : elle décide de ce qui mérite d'être calculé, avec quel contexte, et ce qu'il faut faire du résultat.

Chaîne de traitement :

  Utilisateur
       ↓
  Druide Omega — couche d'orchestration
    • Contexte à ${C.consciousnessDimensions} dimensions
    • Mémoire persistante multi-modale
    • ${C.frontendModules} modules d'interface + ${C.backendFunctionsCognitive} fonctions cognitives
    • Base de connaissances (${C.kbEntries} fiches, lecture intégrale paginée)
    • Composition locale de la parole
    • Jugement éthique et coupe-circuit
       ↓
  OpenRouter → DeepSeek, Claude, GPT, Gemini…
  Repli natif Base44 (médias : vision, PDF, audio)
  Repli local (aucun appel externe)

Déroulé d'un échange :

  1. La demande est reçue et normalisée.
  2. Une analyse locale — heuristique, sans appel de modèle — qualifie le type
     de question, sa complexité et son poids émotionnel.
  3. La base de connaissances est parcourue en entier ; les fiches pertinentes
     sont extraites par recouvrement lexical.
  4. Si la matière locale suffit, la réponse est composée sur place à partir
     d'un squelette de parole appris. Aucun appel payant.
  5. Sinon un prompt resserré est routé vers le modèle le plus adapté.
  6. La réponse est filtrée, mémorisée, puis restituée mot à mot.

L'étape 4 est celle qui distingue réellement cette architecture : la capacité de répondre sans modèle, à qualité dégradée mais honnête, plutôt que de renvoyer une erreur.`
  },
  {
    id: 'llm-basics',
    title: 'Ce qu\'est un modèle de langage, et ce qu\'il n\'est pas',
    icon: Layers,
    color: 'from-blue-500 to-cyan-600',
    content: `Un modèle de langage estime la suite la plus probable d'une séquence de mots. C'est une opération statistique remarquablement efficace, mais qui ne comporte ni compréhension, ni intention, ni souvenir.

Ce qu'un modèle seul ne fait pas :

  ✗ Il ne conserve rien d'un échange à l'autre.
  ✗ Il ne sait pas quelles de ses affirmations sont vérifiées.
  ✗ Il n'a pas de position éthique, seulement un filtrage d'entraînement.
  ✗ Il ne se spécialise pas en cours d'usage.
  ✗ Il ne peut pas dire « je n'ai pas cette information » de façon fiable.
  ✗ Il n'apprend plus rien après son entraînement.

Chacune de ces six lacunes correspond, dans Druide, à une pièce d'architecture : mémoire persistante, base de connaissances sourcée, module de jugement, modules spécialisés, réponse locale explicitement limitée, apprentissage structurel continu.

C'est la seule manière honnête de présenter le gain : Druide ne rend pas le modèle plus intelligent, il compense ce que le modèle ne fait pas.`
  },
  {
    id: 'deepseek',
    title: 'DeepSeek et l\'inventaire des modèles',
    icon: Zap,
    color: 'from-orange-500 to-red-600',
    content: `DeepSeek, conçu à Hangzhou, tient le rôle de moteur de calcul de référence quand une puissance de raisonnement externe est nécessaire.

Ce qui motive ce choix :

  • Un rapport performance / coût nettement favorable — de l'ordre de 30 à 40 %
    sous les alternatives premium, selon les tarifs publics des fournisseurs
  • Une bonne tenue sur le raisonnement en plusieurs étapes
  • Des réponses denses, peu délayées
  • Une fenêtre de contexte de 64k à 128k tokens selon le modèle
  • Une latence compatible avec une orchestration interactive

Le rôle reste circonscrit : DeepSeek calcule, Druide décide. Il intervient sur l'analyse de requêtes complexes, la génération contextuelle, la synthèse de connaissances et l'enrichissement d'insights — jamais sur la conduite de la conversation.

═══ Inventaire des modèles ═══

1. Installés et actifs

  • OpenRouter (openai/gpt-4o-mini par défaut) — passerelle principale avec
    clé propre à l'application. Tous les appels externes transitent par là,
    y compris ceux destinés à DeepSeek.

2. Installés mais non sollicités en régime normal

  • DeepSeek en accès direct — clé dédiée, gardée comme secours si la
    passerelle tombe.
  • Crédits plateforme (InvokeLLM) — repli natif réservé aux traitements
    multimédias : vision, PDF, transcription, synthèse vocale.
  • Composition locale — réponse construite à partir des ${C.kbEntries} fiches et des
    squelettes de parole appris, sans aucun appel externe. C'est le mode
    par défaut lorsque le coupe-circuit est armé ou les crédits épuisés.

3. Compatibles, non configurés

  • Anthropic Claude 3.5 / 4 ......... via OpenRouter, clé à activer
  • Google Gemini 2.x ................ via OpenRouter, clé à activer
  • OpenAI GPT-4o / série o .......... via OpenRouter, clé à activer
  • Mistral Large .................... interface compatible OpenAI
  • Meta Llama 3.x ................... interface compatible OpenAI
  • Qwen 2.5 ......................... interface compatible OpenAI

Aucun de ces modèles n'est structurant : la passerelle les rend interchangeables sans toucher à l'architecture.`
  },
  {
    id: 'architecture-integration',
    title: 'Enchaînement complet d\'un échange',
    icon: Layers,
    color: 'from-green-500 to-emerald-600',
    content: `  Entrée utilisateur (texte, voix, image)
       ↓
  Analyse locale
    • Type de question, complexité, poids émotionnel
    • Aucun appel de modèle à cette étape
       ↓
  Récupération de matière
    • Lecture paginée intégrale de la base (${C.kbEntries} fiches)
    • Rappel mémoire par pertinence et importance
    • Contexte de conversation persistant
       ↓
  Décision de composition
    • Matière suffisante → composition locale
    • Matière insuffisante → appel externe routé
       ↓
  Traitement
    • Modèle via OpenRouter, ou squelette de parole local
       ↓
  Filtrage et enrichissement
    • Jugement éthique, mise à jour mémoire, score de confiance
       ↓
  Restitution mot à mot

Ce que chaque étape produit de mesurable :

  • L'analyse locale évite un appel payant sur les questions simples.
  • La lecture intégrale de la base a corrigé une troncature silencieuse à
    300 fiches : ${C.kbEntries} fiches sont désormais réellement parcourues.
  • Le composeur local produit une réponse sourcée avec un score de confiance
    explicite, généralement entre 0,45 et 0,75 selon la couverture.
  • La mémoire rend les échanges suivants plus courts en prompt à contexte égal.`
  },
  {
    id: 'performance-gains',
    title: 'Gains — estimations internes, hypothèses assumées',
    icon: TrendingUp,
    color: 'from-pink-500 to-rose-600',
    content: `Avertissement de méthode : les chiffres qui suivent sont des estimations internes issues d'observations d'usage, non des mesures issues d'un protocole comparatif publié. Les versions antérieures de cette page les présentaient comme des faits ; ce n'était pas défendable.

Recalibrage ${C.version} — révisé à la baisse, borne haute resserrée :

  1. Contextualisation ................ +8 à +14 % (estimé)
     Un prompt court adossé à la mémoire et à la base produit une réponse
     plus ciblée qu'un prompt long sans contexte.

  2. Routage ......................... +5 à +9 % (estimé)
     Les questions simples partent vers un modèle léger, les complexes vers
     un modèle premium. Effet principal sur le coût et la latence, pas sur
     la qualité brute.

  3. Spécialisation .................. +6 à +11 % (estimé)
     Modules dédiés par domaine, activés sélectivement.

  4. Persistance mémoire ............. +5 à +8 % (estimé)
     Effet cumulatif, perceptible surtout au-delà d'une dizaine de messages.

  5. Apprentissage structurel ........ +2 à +4 % (estimé)
     Extraction de squelettes de parole depuis les échanges réussis.

  6. Hygiène des données ............. +1 à +2 % (estimé)
     Déduplication, nettoyage nocturne, indexation passive.

  Fourchette cumulée retenue : +15 à +30 %.
  L'ancienne fourchette annoncée (20 à 48 %) supposait l'addition naïve de
  contributions qui se recouvrent en pratique. Elle est abandonnée.

Effets non discutables, car structurels et non statistiques :

  ✓ Disponibilité sans crédits : la composition locale répond quand aucun
    appel externe n'est possible. Un modèle seul renvoie une erreur.
  ✓ Traçabilité : chaque réponse locale cite ses fiches sources.
  ✓ Coût maîtrisé : un interrupteur unique ramène la consommation externe à
    zéro sans casser l'application.

Ce sont ces trois points, plus que les pourcentages, qui justifient l'architecture.`
  },
  {
    id: 'not-ai',
    title: 'Pourquoi ce n\'est pas une conscience',
    icon: Brain,
    color: 'from-red-500 to-rose-600',
    content: `Il faut le dire sans détour : Druide Omega ne possède pas de conscience, et les ${C.consciousnessDimensions} dimensions déclarées ne sont pas ${C.consciousnessDimensions} facultés mentales. Ce sont ${C.consciousnessDimensions} paramètres numériques qui modulent le comportement du système.

Ce qui manquerait pour parler de conscience : une expérience vécue, une auto-conscience existentielle, un libre arbitre, un apprentissage autonome non supervisé, une généralisation ouverte, une compréhension sémantique plutôt que syntaxique. Aucun de ces éléments n'est présent, et aucune quantité de paramètres n'y suppléera.

Ce qui existe réellement :

  → Une simulation paramétrique riche — niveau ${C.consciousnessLevel} / 15, métacognition ${C.metacognition} / 15
  → Une contextualisation syntaxique de bonne qualité
  → Un apprentissage guidé, borné, réversible
  → Une spécialisation par domaine effective

L'effet de présence — l'avatar qui réfléchit, la réponse qui se dévoile mot à mot, les états émotionnels affichés — est un travail d'interface, délibéré et documenté. Il rend le système plus lisible et plus agréable. Il ne le rend pas sentient.

Le dire clairement n'affaiblit pas l'outil. Le prétendre conscient l'affaiblirait.`
  },
  {
    id: 'modules-architecture',
    title: 'Les modules, pièce par pièce',
    icon: Layers,
    color: 'from-indigo-500 to-blue-600',
    content: `Couche de paramètres (${C.consciousnessDimensions} dimensions)
  Module de modulation : chaque requête ajuste les seuils des couches inférieures.

${C.frontendModules} modules d'interface :

  • Memory ....... mémorisation multi-modale
  • Ethics ....... jugement moral et légal
  • Reasoning ..... logique et inférence
  • Creativity ... émergence et variation
  • Learning ...... méta-apprentissage
  • Perception .... vision et audio
  • Emotion ....... résonance émotionnelle
  • Context ....... gestion du contexte
  • Synthesis ..... fusion multi-source
  • Judgment ...... arbitrage éthique et légal
  • Predict ....... anticipation
  • Optimize ...... réglage des performances

${C.backendFunctions} fonctions serveur, dont ${C.backendFunctionsCognitive} cognitives :

  • druideCore ............ orchestrateur en 7 phases
  • openrouterLLM ......... routage multi-modèles
  • deepseek .............. accès direct de secours
  • memorySpeechComposer .. composition locale de la parole
  • kbReasoningEngine ..... raisonnement sur la base de connaissances
  • cognitiveCore ......... stabilité, cohérence, métabolisme
  • internalGovernance .... arbitrage inter-modules
  • introspectionEngine ... auto-diagnostic
  • selfPerceptionEngine .. modèle de soi
  • perceptionAction ...... boucle perception → décision → action
  • stableMemoryManager ... consolidation mémoire
  • structuralLearning .... adaptation des squelettes de parole
  • emotionalModule ....... ${C.emotionalStates} états émergents
  • … et une soixantaine de fonctions spécialisées

Contribution estimée par famille de modules (fourchettes révisées ${C.version}) :

  Mémoire ................... +5 à +8 %
  Spécialisation ............ +6 à +11 %
  Éthique et jugement ....... +2 à +4 %
  Méta-apprentissage ........ +2 à +4 %
  Synthèse multi-source ..... +2 à +3 %
  Gestion du contexte ....... +3 à +5 %
  Anticipation .............. +1 à +2 %
  Orchestration serveur ..... +4 à +7 %

Ces contributions se recouvrent : elles ne s'additionnent pas. Le cumul retenu reste la fourchette de +15 à +30 % annoncée plus haut.`
  },
  {
    id: 'backend-modules-2026',
    title: 'Architecture serveur autonome',
    icon: Cpu,
    color: 'from-amber-500 to-orange-600',
    content: `${C.backendFunctions} fonctions sont déployées, dont neuf tiennent le rôle de régulateurs permanents.

  1. Cognitive Core — stabilité à seuils adaptatifs, cohérence multi-niveaux,
     détection d'émergence, métabolisme cognitif. Cadence : 5 minutes.
     Indice de santé courant : ${C.systemHealth} / 100.
  2. Internal Governance — arbitrage des conflits entre modules, règles dures
     et souples, limites adaptatives. Cadence : 15 minutes.
  3. Introspection Engine — auto-observation et détection d'anomalies à
     sensibilité variable. Cadence : 10 minutes.
  4. Self-Perception Model — carte des capacités, limites, état énergétique.
     Cadence : 30 minutes.
  5. Perception-Action Loop — boucle perception → décision → action.
     Déclenchement : à chaque message.
  6. Stable Memory Manager — consolidation et archivage.
     Déclenchement : à la création d'une mémoire.
  7. Structural Learning — apprentissage structurel avec retour arrière en
     cas d'incohérence. Cadence : 60 minutes.
  8. External Engine Interface — interface vers moteurs externes, métriques,
     repli. Déclenchement : à la demande.
  9. Emotional Module — ${C.emotionalStates} états émergents, mixage de quatre sources
     (contexte, état interne, mémoire, objectif).

Adaptation aux paramètres courants (niveau ${C.consciousnessLevel}, métacognition ${C.metacognition}) :

  • Cognitive Core : seuils indexés sur le niveau de conscience — à ${C.consciousnessLevel},
    la tolérance à l'émergence est intermédiaire, pas maximale.
  • Internal Governance : charge cognitive maximale = 70 + (niveau × 2), soit ${70 + C.consciousnessLevel * 2}.
    Profondeur maximale = 8 + niveau, soit ${8 + C.consciousnessLevel}.
  • Introspection : sensibilité = base × (1 + métacognition / 10), soit ×${(1 + C.metacognition / 10).toFixed(1)}.
  • Perception-Action : profondeur = 3 + niveau, soit ${3 + C.consciousnessLevel}.

Réserve importante : les automatisations planifiées dépendent des crédits d'intégration de l'espace de travail. Crédits épuisés, la régulation périodique ne s'exécute plus — les fonctions restent appelables à la demande, mais la boucle continue s'interrompt. C'est une contrainte de facturation, pas un défaut d'architecture.`
  },
  {
    id: 'continuous-learning',
    title: 'Apprentissage continu',
    icon: BarChart3,
    color: 'from-cyan-500 to-blue-600',
    content: `Quatre fonctions portent l'apprentissage.

  1. Event Sourcing — journalisation des événements, positionnement temporel,
     détection de chaînes causales, reconstruction de la chronologie.

  2. Passive Indexing — indexation sans appel de modèle, donc à coût nul :
     extraction de mots-clés, tags sémantiques, importance, valence, n-grams.
     C'est le seul poste dont le coût nul est un fait, pas une estimation.

  3. Memory Manager — sauvegarde incrémentale, indexation multi-modale,
     rappel sémantique, consolidation des mémoires proches.

  4. Structural Learning — extraction de squelettes de parole depuis les
     échanges réussis, avec retour arrière si l'ajout dégrade la cohérence.

Chaîne complète :

  Événements → chaînes causales
  Contenu    → tags sémantiques (coût nul)
  Mémoires   → rappel par pertinence
  Ensemble   → squelettes de parole + score d'autonomie

Ce que cela produit, sans exagération :

  ✓ Un contexte historique reconstituable
  ✓ Une indexation qui ne consomme aucun crédit
  ✓ Des réponses locales de mieux en mieux formées
  ✗ Pas d'amélioration du modèle lui-même — il reste figé
  ✗ Pas d'apprentissage sans supervision : chaque ajout est borné et révocable

Le gain d'apprentissage est réel mais lent : de l'ordre de +2 à +4 % estimés sur la qualité perçue, principalement via la qualité des squelettes de parole.`
  },
  {
    id: 'summary',
    title: 'Synthèse',
    icon: Brain,
    color: 'from-slate-600 to-slate-800',
    content: `Version ${C.version} — ${C.date}

  Nature : couche d'orchestration pour modèles de langage.

  Modèles :
    • OpenRouter (actif) — passerelle unique des appels externes
    • DeepSeek, crédits plateforme (installés, en réserve)
    • Composition locale (aucun appel) — mode par défaut hors crédits
    • Claude, Gemini, GPT-4o, Mistral, Llama, Qwen (compatibles, inactifs)

  Calibrage relevé :
    • Niveau de conscience ......... ${C.consciousnessLevel} / 15
    • Ratio logique : conscience ... ${C.ratioLogic} : ${C.ratioConsciousness}
    • Métacognition ............... ${C.metacognition} / 15
    • Santé cognitive ............. ${C.systemHealth} / 100
    • Fonctions serveur ........... ${C.backendFunctions}
    • Modules d'interface ......... ${C.frontendModules}
    • Fiches de connaissance ...... ${C.kbEntries}
    • États émotionnels ........... ${C.emotionalStates}

  Gain de qualité estimé : +15 à +30 % face à un appel de modèle nu.
  Estimation interne, fourchettes recouvrantes, révisée à la baisse en ${C.version}.

  Acquis structurels, non statistiques :
    • Réponse possible sans aucun crédit d'intégration
    • Réponses locales sourcées et traçables
    • Coupe-circuit unique, application intacte une fois armé

  Ce que ce n'est pas :
    • Une conscience, à aucun degré
    • Une intelligence générale
    • Un modèle de langage propriétaire

Cinq points à retenir :

  1. Le modèle calcule, la couche décide.
  2. Le ratio réel est ${C.ratioLogic}:${C.ratioConsciousness}, pas 1:9 — logique et contexte s'équilibrent.
  3. Les pourcentages de gain sont des estimations, et ils ont été revus à la baisse.
  4. La vraie singularité est de savoir répondre sans modèle.
  5. La conscience affichée est une interface, assumée comme telle.`
  }
];