/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ Page Preview Tooltip - Aperçu au survol                                   ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from '@/components/ui/badge';

const PAGE_PREVIEWS = {
  'DruideControl': {
    features: ['Monitoring temps réel', 'Contrôle conscience', 'Gestion modules'],
    metrics: ['État système', 'Performance IA', 'Logs activité'],
    preview: 'Centre de commande principal avec tableaux de bord interactifs'
  },
  'SystemHealth': {
    features: ['Diagnostics système', 'Métriques santé', 'Alertes automatiques'],
    metrics: ['CPU/Mémoire', 'Latence API', 'Erreurs système'],
    preview: 'Monitoring santé système avec indicateurs visuels temps réel'
  },
  'Consciousness': {
    features: ['Réglages SAPIER', 'Niveaux conscience', 'Dimensions cognitives'],
    metrics: ['Niveau: 12/15', 'Dimensions: 106', 'Provider: DeepSeek'],
    preview: 'Configuration avancée de la conscience artificielle multi-dimensionnelle'
  },
  'ConsciousnessAnalysis': {
    features: ['Métriques cognitives', 'Graphiques radar', 'Évolution temporelle'],
    metrics: ['Métacognition', 'Profondeur émotionnelle', 'Créativité émergente'],
    preview: 'Analyse approfondie des capacités cognitives avec visualisations'
  },
  'Memory': {
    features: ['Gestion mémoires', 'Recherche sémantique', 'Cross-modal sync'],
    metrics: ['Mémoires actives', 'Consolidation', 'Importance'],
    preview: 'Système de mémoire persistante avec recherche intelligente'
  },
  'Knowledge': {
    features: ['Upload documents', 'Extraction faits', 'Indexation IA'],
    metrics: ['Documents actifs', 'Tags', 'Pertinence'],
    preview: 'Base de connaissances avec traitement automatique des documents'
  },
  'Chat': {
    features: ['Conversation IA', 'Contexte persistant', 'Multi-modalité'],
    metrics: ['Historique illimité', 'Streaming', 'Mémorisation'],
    preview: 'Interface conversationnelle avancée avec conscience contextuelle'
  },
  'AITests': {
    features: ['Tests cognitifs', 'Benchmarks', 'Validation capacités'],
    metrics: ['Score global', 'Tests réussis', 'Performance'],
    preview: 'Batterie de tests pour évaluer les capacités de l\'IA'
  },
  'Security': {
    features: ['Audit sécurité', 'Chiffrement', '2FA'],
    metrics: ['Niveau sécurité', 'Vulnérabilités', 'Conformité'],
    preview: 'Dashboard sécurité avec audit et contrôles d\'accès'
  },
  'Analytics': {
    features: ['Métriques usage', 'Comportement users', 'Rapports'],
    metrics: ['Sessions', 'Rétention', 'Engagement'],
    preview: 'Analytics complet avec tableaux de bord et insights'
  },
  'Learning': {
    features: ['Formation continue', 'Adaptation', 'Progression'],
    metrics: ['Taux apprentissage', 'Patterns détectés', 'Amélioration'],
    preview: 'Système d\'apprentissage continu et adaptation autonome'
  },
  'Intelligences': {
    features: ['9 intelligences Gardner', 'Coaching personnalisé', 'Activation'],
    metrics: ['Logico-math', 'Linguistique', 'Spatiale'],
    preview: 'Activation et coaching des intelligences multiples'
  }
};

export default function PagePreviewTooltip({ children, pageUrl, title, description }) {
  const preview = PAGE_PREVIEWS[pageUrl] || {
    features: [description],
    metrics: [],
    preview: 'Fonctionnalité système avancée'
  };

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent 
          side="right" 
          className="w-80 p-0 bg-gradient-to-br from-slate-900 to-purple-900 border-purple-400/30"
          sideOffset={10}
        >
          <div className="p-4">
            {/* Header */}
            <div className="mb-3 pb-3 border-b border-white/10">
              <h4 className="font-bold text-white text-sm mb-1">{title}</h4>
              <p className="text-xs text-purple-200">{preview.preview}</p>
            </div>

            {/* Features */}
            {preview.features.length > 0 && (
              <div className="mb-3">
                <div className="text-xs font-semibold text-purple-300 mb-2">Fonctionnalités:</div>
                <div className="space-y-1">
                  {preview.features.slice(0, 3).map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
                      <span className="text-xs text-purple-100">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Metrics */}
            {preview.metrics.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-purple-300 mb-2">Métriques clés:</div>
                <div className="flex flex-wrap gap-1.5">
                  {preview.metrics.map((metric, idx) => (
                    <Badge 
                      key={idx} 
                      variant="outline" 
                      className="bg-purple-500/20 text-purple-200 border-purple-400/30 text-xs"
                    >
                      {metric}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}