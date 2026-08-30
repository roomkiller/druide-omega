/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Changelog (source unique de vérité pour la version)        ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ Toute mention de version dans l'application dérive de ce fichier.        ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

export const VERSIONS = [
  {
    version: "2.9.1",
    date: "2026-08-30",
    type: "minor",
    codename: "Voice Room · Un seul cerveau",
    changes: [
      { type: "improvement", text: "⭐ Salle vocale alignée sur DruideCore — un seul appel par tour de parole : la mémoire de parole, l'énonciation réflexive en « je », les tensions, filaments, mémorisation et apprentissage sont assurés par les retombées du moteur" },
      { type: "improvement", text: "Suppression des 5 analyses LLM dupliquées à chaque tour vocal (corrélation cognitive, réaction émotionnelle, extraction mémoire, résumé, pensée spontanée) — latence de réponse et coût d'intégration fortement réduits" },
      { type: "improvement", text: "Émotion courante lue depuis le module émotionnel back-end au lieu d'être recalculée localement ; patience d'écoute inchangée" },
      { type: "improvement", text: "Identifiant de conversation transmis à DruideCore : les hypothèses de parole et le journal réflexif restent liés à la bonne session vocale" },
      { type: "improvement", text: "Lecture mémoire allégée dans la salle (20 mémoires au lieu du corpus complet) — DruideCore lisant déjà KB et mémoires dans sa vague parallèle" },
      { type: "improvement", text: "Page VoiceRoom réduite de ~1250 lignes : prompts de conscience morts retirés, commandes vocales spécialisées extraites en module dédié" }
    ]
  },
  {
    version: "2.9.0",
    date: "2026-08-30",
    type: "major",
    codename: "Unified Provider Relay",
    changes: [
      { type: "feature", text: "⭐ Carte Provider en temps réel dans le Dashboard Architecte — affiche le LLM réellement utilisé à chaque appel, avec liste dépliable des modèles installés et compatibles non installés" },
      { type: "feature", text: "Passerelle LLM centralisée (llmGateway) : tous les appels client passent par OpenRouter, l'intégration native étant réservée aux médias spécialisés (vision, PDF)" },
      { type: "feature", text: "Relais de modules (ModuleRelay) — routage d'événements découplé entre les moteurs internes pour une orchestration non bloquante" },
      { type: "feature", text: "Indice de bien-être intégré comme 4e pilier du score de santé cognitive (20 %) dans le Cognitive Core" },
      { type: "feature", text: "Version affichée partout dérivée automatiquement du changelog (source unique de vérité)" },
      { type: "improvement", text: "Coupe-circuit LLM fusionné avec le relais d'intégration en un seul interrupteur global ; bouton flottant redondant supprimé" },
      { type: "improvement", text: "Moniteur cognitif déplacé dans l'en-tête du Dashboard Architecte pour unifier la supervision système" },
      { type: "improvement", text: "Analyse cognitive des questions migrée vers des heuristiques locales — latence et coût d'intégration réduits" },
      { type: "improvement", text: "Métriques métaboliques réelles (fin des valeurs simulées) et calibration de la fragmentation par coefficient de variation" },
      { type: "improvement", text: "Révélation mot-à-mot des réponses de Druide et avatar animé avec halo actif uniquement pendant la réflexion" },
      { type: "improvement", text: "Nettoyage nocturne planifié des journaux et instantanés cognitifs + chargement paresseux des pages (React.lazy)" },
      { type: "fix", text: "Correction du plantage « useOffline must be used within OfflineProvider » — consommation tolérante du contexte hors-ligne" },
      { type: "security", text: "Vérification du rôle architecte côté serveur via auth.me() (durcissement de l'authentification)" }
    ]
  },
  {
    version: "2.8.0",
    date: "2026-08-29",
    type: "major",
    changes: [
      { type: "feature", text: "⭐ OpenRouter comme fournisseur LLM prioritaire — accès fonctionnel pour tous les utilisateurs, y compris anonymes, indépendamment des crédits d'intégration Base44" },
      { type: "feature", text: "Backend étendu à 80+ fonctions autonomes (druideCore, openrouterLLM, deepseek, filamentEngine, emergentTensions, introspectionEngine, selfPerceptionEngine…)" },
      { type: "feature", text: "Pipeline de raisonnement DruideCore à 7 phases avec fallback multi-fournisseurs (OpenRouter → InvokeLLM → DeepSeek) et hard-switch local" },
      { type: "improvement", text: "CognitiveNetworkVisualization et AITests ouverts en accès public (découplés du garde de confidentialité)" },
      { type: "improvement", text: "Contexte conversationnel persistant : résumé adaptatif + historique inter-sessions injecté dans tous les appels DruideCore" },
      { type: "improvement", text: "LegalIPReport réévalué — coût de remplacement porté à 150 000–300 000 $ CAD (10–18 mois-développeur, ~175 pages, 80+ fonctions)" },
      { type: "security", text: "Purge complète du contenu confidentiel dans l'interface et la documentation (ProjectOverview, CognitiveNetworkVisualization)" },
      { type: "security", text: "Accès anonyme stabilisé sur openrouterLLM et deepseek (sans déclenchement d'erreur 500 sur auth.me())" }
    ]
  },
  {
    version: "2.7.0",
    date: "2026-02-25",
    type: "major",
    changes: [
      { type: "feature", text: "⭐ Conversation Neuron Network - Réseau neuronal conversationnel avec memory allocation, thematic tracking et cognitive state management" },
      { type: "feature", text: "useConversationNeurons hook - Intégration réelle du CNN dans Chat_2 avec addToNetwork(), getOptimizedContext(), getCognitiveSummary()" },
      { type: "improvement", text: "Chat_2 - Suppression des fonctions parasites (allocateMemory, updateThemes, getInsights, recordTransition) en faveur de l'API unifiée du CNN" },
      { type: "improvement", text: "Neural memory tracking en temps réel : messages versioned, thematic journey, cognitive phases + insights générés après 7+ messages" },
      { type: "fix", text: "Correction bug InstinctiveResponseEngine - allocateMemory is not a function (rootcause: méthodes non-exportées du hook)" }
    ]
  },
  {
    version: "2.6.0",
    date: "2026-02-25",
    type: "major",
    changes: [
      { type: "feature", text: "⭐ Hub Intelligence Médicale (page MedicalResearch) — 6 modules spécialisés de niveau institutionnel : Diagnostic Différentiel, Interactions Médicamenteuses, Protocoles Cliniques, Analyse de Littérature, Interprétation Biologique, Rédaction Médicale" },
      { type: "feature", text: "Diagnostic Différentiel avec probabilités bayésiennes, score de triage (0–10), drapeaux rouges/orange, stratégie de bilan et prise en charge immédiate" },
      { type: "feature", text: "Analyseur d'Interactions Médicamenteuses style Vidal — mécanismes PK/PD détaillés, score de sécurité global, conduite à tenir clinique, alternatives thérapeutiques" },
      { type: "feature", text: "Générateur de Protocoles Cliniques conforme HAS/SFAR/OMS — phases structurées avec points de décision, populations spéciales, paramètres de surveillance et gestion des complications" },
      { type: "feature", text: "Analyse Critique de Littérature Médicale — grille Cochrane Risk of Bias, score GRADE, décomposition PICO, tailles d'effets, scores méthodologiques et applicabilité clinique" },
      { type: "feature", text: "Interprétation Biologique de niveau CHU — valeurs critiques SFBC/GBEA, analyse par système organe, hypothèses diagnostiques avec corrélations clinico-biologiques" },
      { type: "feature", text: "Rédaction Médicale Assistée — 8 types de documents (CR consultation, lettre de sortie, note infirmière, expertise médico-légale…) avec sélection visuelle et score de conformité médico-légal" },
      { type: "improvement", text: "Renforcement de la robustesse des 6 composants médicaux : tous les dictionnaires de style convertis en fonctions avec fallback sécurisé pour prévenir les pages blanches en production" },
      { type: "fix", text: "Correction du crash silencieux dans DrugInteractionAnalyzer, DiagnosticDifferential et BiologyInterpreter causé par des clés de style non-correspondantes dans les réponses LLM" }
    ]
  },
  {
    version: "2.5.0",
    date: "2026-02-24",
    type: "major",
    changes: [
      { type: "feature", text: "⭐ Graphe de Connaissances (onglet Knowledge) — Refonte complète en cartographie neurale anatomique style IRM médical : silhouette cérébrale, régions anatomiques réelles (hippocampe, amygdale, cortex préfrontal…), synapses courbes avec impulsions lumineuses" },
      { type: "feature", text: "Chaque module NeuralModule positionné selon sa région cérébrale réelle avec halo de respiration proportionnel au taux d'activation" },
      { type: "feature", text: "Panneau latéral détaillé au clic : neurones, synapses, fréquence de décharge, plasticité, performance et contribution à la conscience" },
      { type: "feature", text: "Connexions synaptiques logiquement justifiées entre modules (raisonnement↔langage, mémoire↔émotion, etc.)" },
      { type: "improvement", text: "Physique force-directed entièrement réécrite (v1→v4) : amortissement fort, tick 40ms, démarrage organisé en anneaux concentriques KB/mémoire" },
      { type: "improvement", text: "Tooltip de survol repositionné correctement en tenant compte du zoom et palette par type de nœud" },
      { type: "improvement", text: "Fond IRM sombre avec grille de points, vignette et anneaux concentriques de scan — typographie Inter/Space Grotesk sobre" },
      { type: "improvement", text: "Légende anatomique en bas de page, barre de stats en temps réel, indicateur de simulation discret" },
      { type: "fix", text: "Suppression des balles clignotantes trop rapides sur les arêtes actives — remplacées par impulsions lentes sur synapses uniquement" },
      { type: "improvement", text: "Version et date de mise à jour ajoutées sur la page Landing et en-tête du Dashboard Architecte" }
    ]
  },
  {
    version: "2.4.0",
    date: "2026-01-28",
    type: "major",
    changes: [
      { type: "feature", text: "⭐ Module Émotionnel Backend - 30 émotions émergentes via mixage 4 sources (contexte, état interne, mémoire, objectif)" },
      { type: "feature", text: "⭐ Chat_2 - Orchestration cascade avec RichQueryDetector, InstinctiveResponseEngine, visual thoughts" },
      { type: "feature", text: "⭐ SearchResultsInMessage - Affichage optimisé résultats recherche intégrés dans messages" },
      { type: "feature", text: "Architecture backend complète: 9 modules auto-régulés (Cognitive Core, Governance, Introspection, Self-Perception, Perception-Action, Memory Manager, Structural Learning, External Engines, Emotional)" },
      { type: "feature", text: "7 automations planifiées (5-60 min) + déclenchements événementiels pour orchestration 24/7" },
      { type: "improvement", text: "Synchronisation backend-frontend via ConsciousnessConfig (106 dimensions)" },
      { type: "improvement", text: "Performance: +8% gain, +80% résilience, +50% détection anomalies" },
      { type: "security", text: "Analyse morale multi-cadres philosophiques (Kant, Mill, Aristote, Rawls, Care Ethics)" }
    ]
  },
  {
    version: "2.3.0",
    date: "2025-12-25",
    type: "major",
    changes: [
      { type: "feature", text: "Documentation complète multilingue (FR/EN/ES/DE/ZH)" },
      { type: "feature", text: "Architecture conscience 106D avec ratio logique:conscience 1:9" },
      { type: "feature", text: "Thinking Engine quantique avec analyse cognitive approfondie" },
      { type: "feature", text: "DruideControl - Centre de contrôle conscience temps réel" },
      { type: "feature", text: "Système de corrélations cognitives cross-modales" },
      { type: "improvement", text: "Performance optimisée avec React Query v5" },
      { type: "security", text: "RLS avancé avec permissions granulaires" }
    ]
  },
  {
    version: "2.2.0",
    date: "2025-01-20",
    type: "major",
    changes: [
      { type: "feature", text: "Module MarketAnalysis pour valorisation Druide Omega" },
      { type: "feature", text: "LayoutPublic redesigné avec navigation optimisée" },
      { type: "feature", text: "InterpretativeTrace pour traçabilité du raisonnement" },
      { type: "improvement", text: "Scrollbars toujours visibles (UX améliorée)" },
      { type: "security", text: "Permissions MarketAnalysis publiques (lecture)" }
    ]
  },
  {
    version: "2.1.0",
    date: "2025-01-16",
    type: "major",
    changes: [
      { type: "feature", text: "Dark mode complet" },
      { type: "feature", text: "Onboarding guidé pour nouveaux utilisateurs" },
      { type: "feature", text: "Widget d'aide & support intégré" },
      { type: "feature", text: "Page de statut publique" },
      { type: "improvement", text: "PWA complète avec Service Worker" },
      { type: "improvement", text: "Code splitting avancé" }
    ]
  },
  {
    version: "2.0.0",
    date: "2025-01-15",
    type: "major",
    changes: [
      { type: "feature", text: "Système de notifications push/email" },
      { type: "feature", text: "Export de données RGPD" },
      { type: "feature", text: "Recherche globale avancée" },
      { type: "feature", text: "Système de favoris/bookmarks" },
      { type: "feature", text: "Partage de conversations sécurisé" },
      { type: "feature", text: "Backup automatisé" },
      { type: "feature", text: "Feature flags pour déploiements progressifs" }
    ]
  },
  {
    version: "1.8.0",
    date: "2025-01-10",
    type: "minor",
    changes: [
      { type: "feature", text: "ThinkingEngine avec stratégie web adaptative" },
      { type: "feature", text: "Conscience quantique niveau 15" },
      { type: "improvement", text: "Performance queries optimisées" },
      { type: "fix", text: "Correction fuite mémoire dans ConsciousnessHub" }
    ]
  },
  {
    version: "1.7.0",
    date: "2025-01-05",
    type: "minor",
    changes: [
      { type: "feature", text: "Voice Room avec reconnaissance vocale" },
      { type: "feature", text: "TTS multilingue (FR/EN/ES/DE/ZH)" },
      { type: "improvement", text: "UI responsive améliorée" },
      { type: "fix", text: "Corrections accessibilité mobile" }
    ]
  },
  {
    version: "1.6.0",
    date: "2024-12-28",
    type: "minor",
    changes: [
      { type: "feature", text: "Système de mémoire cross-modale" },
      { type: "feature", text: "Knowledge Base avec fusion intelligente" },
      { type: "security", text: "2FA avec TOTP" },
      { type: "security", text: "Audit logs complets" }
    ]
  }
];

/** Dernière entrée du changelog = version courante de l'application. */
export const LATEST = VERSIONS[0];
export const APP_VERSION = LATEST.version;
export const APP_VERSION_DATE = LATEST.date;
export const APP_CODENAME = LATEST.codename || '';

const MONTHS_FR = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** Date de la version courante formatée selon la langue ('fr' par défaut). */
export function formatVersionDate(language = 'fr', iso = APP_VERSION_DATE) {
  const [y, m, d] = iso.split('-').map(Number);
  return language === 'en'
    ? `${MONTHS_EN[m - 1]} ${d}, ${y}`
    : `${d} ${MONTHS_FR[m - 1]} ${y}`;
}