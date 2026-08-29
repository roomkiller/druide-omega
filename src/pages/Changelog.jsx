/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Changelog Page                                             ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Plus, Bug, Zap, Shield, Package } from "lucide-react";

const VERSIONS = [
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
      { type: "security", text: "Purge complète du contenu confidentiel across l'interface et la documentation (ProjectOverview, CognitiveNetworkVisualization)" },
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

const TYPE_CONFIG = {
  feature: { icon: Plus, label: "Nouveauté", color: "bg-green-100 text-green-700" },
  improvement: { icon: Zap, label: "Amélioration", color: "bg-blue-100 text-blue-700" },
  fix: { icon: Bug, label: "Correction", color: "bg-orange-100 text-orange-700" },
  security: { icon: Shield, label: "Sécurité", color: "bg-red-100 text-red-700" }
};

export default function Changelog() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30 dark:from-slate-900 dark:via-purple-900/20 dark:to-pink-900/20">
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-6 py-12">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">Changelog</h1>
            <p className="text-purple-100">Historique des versions et nouveautés</p>
          </div>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
          {VERSIONS.map((version) => (
            <Card key={version.version} className="p-6 dark:bg-slate-800 dark:border-slate-700">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Package className="w-8 h-8 text-purple-600" />
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      v{version.version}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{version.date}</p>
                  </div>
                </div>
                {version.type === 'major' && (
                  <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                    Version majeure
                  </Badge>
                )}
              </div>

              <div className="space-y-3">
                {version.changes.map((change, idx) => {
                  const config = TYPE_CONFIG[change.type];
                  const Icon = config.icon;
                  return (
                    <div key={idx} className="flex items-start gap-3">
                      <Badge className={`${config.color} flex items-center gap-1 flex-shrink-0`}>
                        <Icon className="w-3 h-3" />
                        {config.label}
                      </Badge>
                      <p className="text-slate-700 dark:text-slate-300">{change.text}</p>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}

          <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2">À venir</h3>
            <p className="text-blue-700 dark:text-blue-300 text-sm">
              • API publique documentée<br />
              • Webhooks avancés<br />
              • Mode collaboration temps réel<br />
              • Mobile app native (iOS/Android)
            </p>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}