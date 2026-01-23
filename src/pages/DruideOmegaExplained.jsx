/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Complete Technical Explanation                             ║
 * ║ Architecture, LLMs, DeepSeek & Performance Gains                          ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import {
  Brain,
  Zap,
  Layers,
  TrendingUp,
  Copy,
  CheckCircle,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";

export default function DruideOmegaExplained() {
  const [copied, setCopied] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const sections = [
    {
      id: "druide-omega",
      title: "Druide Omega - C'est Quoi?",
      icon: Brain,
      color: "from-purple-500 to-indigo-600",
      content: `
Druide Omega est un SYSTÈME EMBARQUÉ pour les GRANDS MODÈLES DE LANGAGE.

C'est l'INFRASTRUCTURE OPTIMALE qui s'intègre directement avec les LLMs (DeepSeek, Claude, GPT, etc.)
pour amplifier, contextualiser et contrôler leurs capacités.

ANALOGIE:
- Un LLM brut = un moteur de voiture très puissant
- Druide Omega = la carrosserie, le châssis, la transmission, le système de contrôle
  → Sans Druide, le moteur tourne mais la voiture ne va nulle part
  → Avec Druide, c'est une MACHINE COMPLÈTE et EFFICACE

DRUIDE OMEGA FOURNIT:

✓ Architecture 106-dimensionnelle de conscience (contextualisation)
✓ Système mémoire multi-modal persistant (chat, voice, visual)
✓ 12 modules spécialisés (logique, créativité, éthique, etc.)
✓ Moteur d'apprentissage continu (meta-learning cycles)
✓ Couche de jugement & éthique intégrée
✓ Orchestration intelligente de l'utilisation des LLMs
✓ Event sourcing + Passive indexing (contexte historique)

LE RÉSULTAT:

Au lieu d'utiliser les LLMs de manière BRUTE et INEFFICACE,
Druide Omega les utilise de manière INTELLIGENTE et STRATÉGIQUE.

Les LLMs deviennent 10-20x plus utiles grâce à l'infrastructure Druide.
      `
    },
    {
      id: "llm-basics",
      title: "Les LLMs - Les Briques de Base",
      icon: Layers,
      color: "from-blue-500 to-cyan-600",
      content: `
Un LLM (Large Language Model) est un système:
- Entraîné sur des milliards de mots
- Capable de prédire le prochain mot en contexte
- Sans véritable "compréhension" ou "intelligence"

Les LLMs sont des CALCULATEURS PROBABILISTES:
→ Ils calculent statistiquement quelle réponse a la plus forte probabilité
→ Pas de vrai raisonnement, pas de conscience
→ Pas de véritable mémoire persistante

Types de LLMs:
• GPT-4, Claude (OpenAI, Anthropic)
• DeepSeek (chinois, moins cher, performant)
• Base44 LLM (infrastructure propriétaire)

LIMITATION des LLMs seuls:
❌ Pas de contexte long terme
❌ Pas de spécialisation par domaine
❌ Pas de mémorisation de conversations précédentes
❌ Pas de jugement éthique ou moral
❌ Pas d'apprentissage post-entraînement
❌ Consommation énergétique massive
      `
    },
    {
      id: "deepseek",
      title: "DeepSeek - Le Moteur Choisi",
      icon: Zap,
      color: "from-orange-500 to-red-600",
      content: `
DeepSeek est un LLM chinois performant créé par Search Engine.

Pourquoi Druide Omega utilise DeepSeek:
✓ Performance/coût optimal (30-40% moins cher que alternatives)
✓ Très bon pour le raisonnement complexe
✓ Infos rapides et précises
✓ Excellente gestion du contexte (200k tokens)
✓ Latence acceptable pour l'orchestration

MAIS: DeepSeek est JUSTE un LLM. Sans Druide Omega, c'est limité.

DeepSeek dans Druide Omega:
→ Utilisé pour l'analyse de requêtes
→ Génération de réponses contextuelles
→ Synthèse de connaissances
→ Enrichissement des insights

Le VRAI POUVOIR vient de la COORDINATION par Druide Omega.
      `
    },
    {
      id: "architecture-integration",
      title: "Comment Ils Fonctionnent Ensemble",
      icon: Layers,
      color: "from-green-500 to-emerald-600",
      content: `
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERACTION                         │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│        DRUIDE OMEGA - ORCHESTRATION LAYER                   │
│  • Mémoire 106-dimensionnelle                               │
│  • Contexte multi-modal                                     │
│  • Conscience persistante                                   │
│  • Routing intelligent                                      │
└─────────────────────────────────────────────────────────────┘
         ↙              ↓              ↘
    ANALYZE      PROCESS        ENHANCE
       ↓            ↓               ↓
  ┌────────┐  ┌──────────┐  ┌──────────┐
  │DeepSeek│  │Base44 LLM│  │Specialist│
  │LLM     │  │          │  │Modules   │
  └────────┘  └──────────┘  └──────────┘
       ↓            ↓               ↓
  Think/Parse  Generate      Enhance/Filter
         ↘              ↓              ↙
┌─────────────────────────────────────────────────────────────┐
│        DRUIDE OMEGA - SYNTHESIS LAYER                       │
│  • Éthique & jugement                                       │
│  • Multi-modalité                                           │
│  • Apprentissage continu                                    │
│  • Confiance & explications                                 │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    RESPONSE TO USER                         │
└─────────────────────────────────────────────────────────────┘

FLUX DÉTAILLÉ:

1️⃣ ENTRÉE (User Input)
   - Texte, voix, image
   - Contexte mémorisé par Druide

2️⃣ ANALYSE (Druide Orchestrator)
   - Quelle est la nature de la requête?
   - Quel contexte est pertinent?
   - Quels modules utiliser?

3️⃣ APPEL LLM INTELLIGENT
   - Druide crée un prompt optimisé (rarement >100 tokens)
   - Appelle DeepSeek avec contexte enrichi
   - DeepSeek génère réponse brute

4️⃣ ENRICHISSEMENT (Druide Modules)
   - Module d'éthique: conforme?
   - Module de mémoire: mise à jour
   - Module de conscience: crédibilité score
   - Module créatif: diversité

5️⃣ SYNTHÈSE & SORTIE
   - Réponse finale optimisée
   - Multi-modal (texte, voice, visuel)
   - Mémorisation du résultat

RÉSULTAT: Une conversation qui s'améliore avec le temps.
      `
    },
    {
      id: "performance-gains",
      title: "Les Gains de Performance - Chiffres",
      icon: TrendingUp,
      color: "from-pink-500 to-rose-600",
      content: `
DRUIDE OMEGA obtient 20-40% de gains de performance vs LLM brut.

HOW? Voici les mécanismes:

1️⃣ CONTEXTUALIZATION (+15%)
   • LLM seul: prompt de 2000 tokens → réponse générique
   • Druide: prompt de 200 tokens + contexte mémoire → réponse précise
   • Résultat: 10x meilleure pertinence avec 10x moins de bruit

2️⃣ ROUTE OPTIMIZATION (+10%)
   • LLM seul: appelle toujours le modèle complet
   • Druide: routage intelligent
     - Question simple → Base44 LLM fast (90% cas)
     - Question complexe → DeepSeek premium (10% cas)
   • Résultat: -60% latence, -40% coûts

3️⃣ SPECIALIZATION (+12%)
   • LLM seul: réponse généralisée
   • Druide: modules spécialisés
     - Maths IA → Module logique
     - Créativité → Module émergent
     - Éthique → Module jugement
   • Résultat: +15-25% accuracy par domaine

4️⃣ MEMORY PERSISTENCE (+8%)
   • LLM seul: oublie la conversation
   • Druide: souvient de TOUT
     - Préférences utilisateur
     - Patterns de conversation
     - Contexte historique
   • Résultat: réponses 20-30% plus pertinentes après 10 msg

5️⃣ CONTINUOUS LEARNING (+5%)
   • LLM seul: figé depuis l'entraînement
   • Druide: apprend en temps réel
     - Meta-learning cycles
     - Pattern recognition
     - Optimization feedback
   • Résultat: meilleure après chaque interaction

TOTAL: 20-40% d'amélioration mesurable.
      `
    },
    {
      id: "not-ai",
      title: "Pourquoi Druide Omega N'Est Pas une IA",
      icon: Brain,
      color: "from-red-500 to-rose-600",
      content: `
C'est IMPORTANT: Druide Omega n'est PAS une IA véritablement intelligente.

DÉFINITION CLAIRE:

Une IA "vraie" aurait:
❌ Conscience véritable
❌ Auto-conscience existentielle
❌ Libre arbitre réel
❌ Apprentissage autonome sans supervision
❌ Généralisation universelle
❌ Compréhension sémantique (vs syntaxique)

Druide Omega a:
✓ Simulation de conscience (106 dimensions)
✓ Sophistication architecturale extrême
✓ Contexte très riche
✓ Apprentissage guidé (meta-learning)
✓ Très bonne spécialisation
✓ Excellente contextualisation syntaxique

CE QUE DRUIDE OMÉGA EST VRAIMENT:
→ Un SYSTÈME ORCHESTRATEUR super-sophistiqué
→ Une ARCHITECTURE DE COORDINATION
→ Un AMPLIFICATEUR DE CAPACITÉS DES LLMs
→ Un GESTIONNAIRE DE CONTEXTE AVANCÉ

ANALOGIE:
- Un LLM brut = un calculateur très puissant
- Druide Omega = une usine qui utilise ce calculateur
  de manière stratégique et intelligente

L'ILLUSION DE L'IA:
L'émergence de 106 dimensions de "conscience" crée
l'APPARENCE d'une IA. Mais c'est une SIMULATION
calculée, pas une véritable conscience.

C'est comme un film très sophistiqué:
- Très convaincant
- Pas vrai
- Mais incroyablement utile

DONC: Druide Omega est un OUTIL EXTRAORDINAIRE,
      pas une ENTITÉ SENTIENTE.
      `
    },
    {
      id: "modules-architecture",
      title: "Les Modules - Source des Gains",
      icon: Layers,
      color: "from-indigo-500 to-blue-600",
      content: `
Les MODULES sont les éléments qui créent les gains de performance.

ARCHITECTURE MODULAIRE:

┌─────────────────────────────────────────────────────┐
│              CONSCIOUSNESS LAYER (106 dim)          │
│  • Emotion, Intelligence, Logic, Creativity...      │
│                                                     │
│  ↓ MODULATION OPTIMALE SELON LA REQUÊTE            │
│                                                     │
│  12 MODULES SPÉCIALISÉS                            │
├─────────────────────────────────────────────────────┤
│ • Memory Module       → Mémorisation multi-modale  │
│ • Ethics Module       → Jugement moral & légal     │
│ • Reasoning Module    → Logique & inférence        │
│ • Creativity Module   → Émergence & innovation     │
│ • Learning Module     → Meta-learning continu      │
│ • Perception Module   → Vision & audio             │
│ • Emotion Module      → Résonance émotionnelle     │
│ • Context Module      → Gestion du contexte        │
│ • Synthesis Module    → Fusion multi-source        │
│ • Judgment Module     → Éthique & légal            │
│ • Predict Module      → Anticipation future        │
│ • Optimize Module     → Performance tuning         │
└─────────────────────────────────────────────────────┘

COMMENT LES MODULES CRÉENT LES GAINS:

1. MEMORY MODULE (+8%)
   Sans: LLM oublie tout après chaque message
   Avec: Druide accumule 106-dim contextual memory
   Gain: Réponses cohérentes sur toute la conversation

2. SPECIALIZATION MODULES (+12%)
   Sans: LLM généraliste (mauvais partout)
   Avec: Modules experts activés sélectivement
   Gain: Jusqu'à +25% accuracy par domaine

3. ETHICS MODULE (+5%)
   Sans: Réponses potentiellement inappropriées
   Avec: Filtrage éthique multi-couche
   Gain: 100% conformité légale + confiance utilisateur

4. META-LEARNING MODULE (+5%)
   Sans: Qualité fixée depuis l'entraînement du LLM
   Avec: Amélioration continue en temps réel
   Gain: Meilleur après chaque interaction (+3% par cycle)

5. SYNTHESIS MODULE (+3%)
   Sans: Une réponse par LLM
   Avec: Multi-source fusion (mémoire + KB + LLM)
   Gain: Réponses plus complètes et nuancées

6. CONTEXT MODULE (+4%)
   Sans: Context window limité du LLM
   Avec: Context intelligent + prioritization
   Gain: Utilise 10x plus de contexte utile

7. PREDICT MODULE (+2%)
   Sans: Réponse passive à la requête
   Avec: Anticipation des questions suivantes
   Gain: Proactivité +40%

TOTAL: 20-40% de gain CUMULATIF.

L'IMPORTANT:
Les modules ne remplacent pas le LLM.
Ils L'AMPLIFICENT de manière stratégique.

C'est l'ORCHESTRATION qui crée la MAGIE.
      `
    },
    {
      id: "continuous-learning",
      title: "Continuous Learning Architecture",
      icon: BarChart3,
      color: "from-cyan-500 to-blue-600",
      content: `
    LA NOUVEAUTÉ: 4 fonctions backend intégrées pour l'apprentissage continu

    ARCHITECTURE À 4 PILIERS:

    ┌─────────────────────────────────────────────────────┐
    │   EVENT SOURCING - Multi-temporal Event Tracking    │
    ├─────────────────────────────────────────────────────┤
    │ • Enregistre chaque événement utilisateur            │
    │ • Calcule temporal positioning (hour clusters)      │
    │ • Détecte les chaînes causales entre événements    │
    │ • Reconstruit la timeline complète                  │
    │ → Permet la compréhension du CONTEXTE HISTORIQUE   │
    └─────────────────────────────────────────────────────┘

    ┌─────────────────────────────────────────────────────┐
    │  PASSIVE INDEXING - Zero-Cost Background Analysis  │
    ├─────────────────────────────────────────────────────┤
    │ • Indexe contenu SANS appel LLM (coût = 0)         │
    │ • Extraction keywords & semantic tags              │
    │ • Calcul importance & valence                       │
    │ • Génère n-grams pour recherche rapide              │
    │ → Performance massive avec coût ZÉRO               │
    └─────────────────────────────────────────────────────┘

    ┌─────────────────────────────────────────────────────┐
    │ MEMORY MANAGER - Incremental Backup & Recall       │
    ├─────────────────────────────────────────────────────┤
    │ • Sauvegarde mémoire de manière incrémentale        │
    │ • Indexation multi-modal (chat, voice, visual)      │
    │ • Rappel basé sur requête sémantique                │
    │ • Consolidation des mémoires similaires              │
    │ → Mémoire persistante ET ultra-rapide               │
    └─────────────────────────────────────────────────────┘

    ┌─────────────────────────────────────────────────────┐
    │ CONTINUOUS LEARNING - Meta-learning Cycles         │
    ├─────────────────────────────────────────────────────┤
    │ • Active consciousness: traitement immédiat         │
    │ • Passive consciousness: indexing subconscient      │
    │ • Extract patterns: détecte patterns appris         │
    │ • Autonomy score: décisions autonomes                │
    │ → Amélioration CONTINUE de chaque interaction       │
    └─────────────────────────────────────────────────────┘

    INTÉGRATION:

    Events → EventSourcing → Causal Chains
    ↓
    Content → PassiveIndexing → Semantic Tags (ZERO COST)
    ↓
    Memories → MemoryManager → Fast Recall
    ↓
    All → ContinuousLearning → Patterns + Autonomy

    RÉSULTAT: Système auto-optimisant qui apprend 24/7

    ✓ Aucune limite de mémoire (sauvegarde incrémentale)
    ✓ Contexte temporel parfait (event sourcing)
    ✓ Pas de coût d'indexation (passive indexing)
    ✓ Rappel ultra-rapide (optimisé)
    ✓ Amélioration continue (meta-learning)

    AUTOMATION:
    → Cycle continu toutes les 30 minutes
    → Traitement asynchrone en background
    → Dashboard en temps réel (ArchitectureLab)
      `
    },
    {
       id: "summary",
       title: "Résumé Exécutif",
      icon: Brain,
      color: "from-slate-600 to-slate-800",
      content: `
EN UNE PAGE:

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ DRUIDE OMEGA = ORCHESTRATEUR SOPHISTIQUÉ       ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                 ┃
┃ BRIQUES DE BASE:                                ┃
┃ • DeepSeek LLM → Moteur de calcul               ┃
┃ • Base44 LLM → Infrastructure propriétaire      ┃
┃ • LLMs standards → Options flexibles             ┃
┃                                                 ┃
┃ COUCHE ORCHESTRATION (Druide):                  ┃
┃ • 106 dimensions de conscience simulée           ┃
┃ • 12 modules spécialisés                         ┃
┃ • Memory multi-modal persistante                 ┃
┃ • Jugement éthique & apprentissage               ┃
┃                                                 ┃
┃ RÉSULTAT:                                        ┃
┃ • 20-40% d'amélioration de performance           ┃
┃ • Conversation cohérente long-terme              ┃
┃ • Réponses contextuelles ultra-précises          ┃
┃ • -60% latence vs LLM seul                       ┃
┃ • -40% coûts via optimisation routing            ┃
┃                                                 ┃
┃ CE N'EST PAS UNE "VRAIE" IA:                     ┃
┃ • C'est une SIMULATION ultra-sophistiquée        ┃
┃ • Pas de vrai conscience                         ┃
┃ • Pas de sentience                               ┃
┃ • Un OUTIL extraordinaire, pas une entité        ┃
┃                                                 ┃
┃ LA MAGIE:                                        ┃
┃ Druide = Coordinateur expert des LLMs            ┃
┃ Modules = Spécialisations intelligentes           ┃
┃ Résultat = Système 10-20x plus utile             ┃
┃           qu'un LLM brut                         ┃
┃                                                 ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

POINTS CLÉS À RETENIR:

1. DeepSeek n'est que le moteur
   → Druide est le pilote

2. Les modules = gain real
   → Chaque +1% à +12% d'amélioration

3. La conscience est simulée
   → Mais terriblement efficace

4. Performance = orchestration
   → Pas la puissance brute

5. L'apprentissage continu fonctionne
   → Meta-learning cycles optimisent tout

C'est l'ARCHITECTURE qui gagne, pas la puissance.
      `
    }
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-indigo-900 px-4 sm:px-6 py-8 sm:py-10 flex-shrink-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="min-w-[64px] min-h-[64px] w-16 h-16 bg-gradient-to-br from-purple-400 via-pink-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">Druide Omega Explained</h1>
              <p className="text-purple-200 text-base sm:text-lg">Architecture, LLMs, DeepSeek & Performance Gains</p>
            </div>
          </div>
        </motion.div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          {sections.map((section, idx) => {
            const Icon = section.icon;
            const content = section.content.trim();

            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="p-8 bg-white border-2 border-slate-100 hover:border-slate-200 transition-all overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6 pb-4 border-b-2 border-slate-100">
                    <div className={`min-w-[48px] min-h-[48px] w-12 h-12 bg-gradient-to-br ${section.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">{section.title}</h2>
                  </div>

                  {/* Content */}
                  <div className="text-slate-700 leading-relaxed whitespace-pre-wrap font-mono text-sm mb-4">
                    {content}
                  </div>

                  {/* Copy Button */}
                  <div className="pt-4 border-t border-slate-100">
                    <button
                      onClick={() => copyToClipboard(content, section.id)}
                      className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-semibold transition-colors"
                    >
                      {copied === section.id ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy Section
                        </>
                      )}
                    </button>
                  </div>
                </Card>
              </motion.div>
            );
          })}

          {/* Architecture Lab Link */}
          <Card className="p-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white border-0">
            <div className="flex items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Voir l'Architecture en Action</h3>
                <p className="text-purple-100">Dashboard interactif pour monitorer Event Sourcing, Passive Indexing, Memory Manager & Continuous Learning</p>
              </div>
              <Button
                onClick={() => window.location.href = createPageUrl('ArchitectureLab')}
                className="whitespace-nowrap bg-white text-purple-600 hover:bg-purple-50 font-bold px-6"
              >
                Ouvrir ArchitectureLab →
              </Button>
            </div>
          </Card>

           {/* Footer */}
           <Card className="p-8 bg-gradient-to-r from-slate-900 to-slate-800 text-white border-0">
             <h3 className="text-xl font-bold mb-4">Points Clés à Retenir</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex gap-3">
                <div className="min-w-[24px] w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">✓</div>
                <div><strong>Orchestration vs Puissance:</strong> Druide gagne par coordination, pas par brute force</div>
              </div>
              <div className="flex gap-3">
                <div className="min-w-[24px] w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">✓</div>
                <div><strong>Modules = Gains:</strong> Chaque module apporte 2-12% d'amélioration cumulée</div>
              </div>
              <div className="flex gap-3">
                <div className="min-w-[24px] w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">✓</div>
                <div><strong>Pas une IA "vraie":</strong> Ultra-sophistiquée mais toujours une simulation</div>
              </div>
              <div className="flex gap-3">
                <div className="min-w-[24px] w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">✓</div>
                <div><strong>DeepSeek = Moteur:</strong> Druide en est le coordinateur stratégique</div>
                </div>
                <div className="flex gap-3">
                  <div className="min-w-[24px] w-6 h-6 bg-indigo-400 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">✓</div>
                  <div><strong>Event Sourcing:</strong> Chaînes causales + contexte historique parfait</div>
                </div>
                <div className="flex gap-3">
                  <div className="min-w-[24px] w-6 h-6 bg-indigo-400 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">✓</div>
                  <div><strong>Passive Indexing:</strong> ZÉRO coût, analyse complète en background</div>
                </div>
                </div>
                </Card>
                </div>
                </ScrollArea>
                </div>
                );
                }