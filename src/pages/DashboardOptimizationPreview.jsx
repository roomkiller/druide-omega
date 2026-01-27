/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ APERÇU OPTIMISATION - Architect Dashboard                                 ║
 * ║ Analyse et recommandations avant implémentation                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import { 
  ArrowLeft, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp,
  Layers,
  Grid3x3,
  LayoutGrid
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardOptimizationPreview() {
  const currentState = {
    totalPages: 102,
    totalCategories: 20,
    averagePagesPerCategory: 5.1,
    currentGridCols: '2-4',
    estimatedScrollHeight: '~8500px'
  };

  const proposedChanges = {
    layout: {
      title: 'Optimisation Layout',
      changes: [
        '✓ Grid: md:grid-cols-3 lg:grid-cols-5 (au lieu de 2-4)',
        '✓ Padding cartes: p-4 (au lieu de p-6)',
        '✓ Icônes: w-10 h-10 (au lieu de w-12 h-12)',
        '✓ Texte titre: text-base (au lieu de text-lg)',
        '✓ Espacement vertical réduit entre catégories'
      ],
      impact: '↓ 40% hauteur scroll estimée'
    },
    categories: {
      title: 'Regroupement Catégories',
      merges: [
        {
          from: ['Exploration & Créativité', 'Éthique & Valeurs'],
          to: 'Éthique & Exploration',
          count: 9
        },
        {
          from: ['Recherche & Spécialisation', 'Accessibilité & Conformité'],
          to: 'Conformité & Recherche',
          count: 3
        },
        {
          from: ['Configuration & Déploiement', 'Ressources & Support'],
          to: 'Support & Configuration',
          count: 12
        }
      ],
      before: 20,
      after: 17,
      impact: '↓ 15% catégories'
    },
    distribution: {
      title: 'Rééquilibrage Distribution',
      issues: [
        '⚠️ "Sécurité & Légal" - 9 pages (trop chargée)',
        '⚠️ "Documentation & Guides" - 9 pages (trop chargée)',
        '⚠️ "Analyses & Insights" - 9 pages (trop chargée)',
        '✓ Autres catégories bien équilibrées (3-7 pages)'
      ],
      recommendation: 'Fusionner certaines documentations similaires ou créer sous-catégories'
    }
  };

  const visualComparison = {
    current: {
      cardHeight: '~160px',
      cardsPerRow: { md: 2, lg: 4 },
      totalRows: 26,
      estimatedHeight: '4160px + headers'
    },
    proposed: {
      cardHeight: '~120px',
      cardsPerRow: { md: 3, lg: 5 },
      totalRows: 21,
      estimatedHeight: '2520px + headers'
    },
    improvement: '↓ 39% hauteur totale'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50/20 page-padding py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => window.location.href = createPageUrl('ArchitectDashboard')}
            variant="outline"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour Dashboard Architecte
          </Button>
          <h1 className="text-4xl font-bold text-slate-900 mb-2 font-display">
            Aperçu Optimisation Dashboard
          </h1>
          <p className="text-lg text-slate-600">
            Analyse et recommandations pour améliorer la navigation
          </p>
        </div>

        {/* État Actuel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6 mb-8 border-2 border-orange-200">
            <div className="flex items-center gap-3 mb-4">
              <LayoutGrid className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-slate-900">État Actuel</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="text-sm text-slate-600 mb-1">Pages Totales</div>
                <div className="text-3xl font-bold text-slate-900">{currentState.totalPages}</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="text-sm text-slate-600 mb-1">Catégories</div>
                <div className="text-3xl font-bold text-slate-900">{currentState.totalCategories}</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="text-sm text-slate-600 mb-1">Scroll Estimé</div>
                <div className="text-2xl font-bold text-orange-600">{currentState.estimatedScrollHeight}</div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Optimisations Proposées */}
        <div className="space-y-6">
          {/* Layout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 border-2 border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <Grid3x3 className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-bold text-slate-900">{proposedChanges.layout.title}</h2>
                <Badge className="bg-green-100 text-green-700">
                  {proposedChanges.layout.impact}
                </Badge>
              </div>
              <ul className="space-y-2">
                {proposedChanges.layout.changes.map((change, idx) => (
                  <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>

          {/* Catégories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <Layers className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-slate-900">{proposedChanges.categories.title}</h2>
                <Badge className="bg-blue-100 text-blue-700">
                  {proposedChanges.categories.before} → {proposedChanges.categories.after} catégories
                </Badge>
              </div>
              <div className="space-y-4">
                {proposedChanges.categories.merges.map((merge, idx) => (
                  <div key={idx} className="bg-blue-50 rounded-lg p-4">
                    <div className="font-semibold text-blue-900 mb-2">{merge.to}</div>
                    <div className="text-sm text-blue-700 mb-1">
                      Fusion de: {merge.from.join(' + ')}
                    </div>
                    <div className="text-xs text-blue-600">{merge.count} pages totales</div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 border-2 border-amber-200">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
                <h2 className="text-xl font-bold text-slate-900">{proposedChanges.distribution.title}</h2>
              </div>
              <ul className="space-y-2 mb-4">
                {proposedChanges.distribution.issues.map((issue, idx) => (
                  <li key={idx} className="text-sm text-slate-700">
                    {issue}
                  </li>
                ))}
              </ul>
              <div className="bg-amber-50 rounded-lg p-3 text-sm text-amber-800">
                💡 {proposedChanges.distribution.recommendation}
              </div>
            </Card>
          </motion.div>

          {/* Comparaison Visuelle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 border-2 border-purple-200">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-bold text-slate-900">Comparaison Visuelle</h2>
                <Badge className="bg-purple-100 text-purple-700">
                  {visualComparison.improvement}
                </Badge>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="font-bold text-slate-900 mb-3">Actuel</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Hauteur carte:</span>
                      <span className="font-semibold">{visualComparison.current.cardHeight}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Cartes/rangée (MD):</span>
                      <span className="font-semibold">{visualComparison.current.cardsPerRow.md}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Cartes/rangée (LG):</span>
                      <span className="font-semibold">{visualComparison.current.cardsPerRow.lg}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Rangées totales:</span>
                      <span className="font-semibold text-orange-600">{visualComparison.current.totalRows}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-slate-600">Hauteur estimée:</span>
                      <span className="font-bold text-orange-600">{visualComparison.current.estimatedHeight}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-bold text-green-900 mb-3">Proposé</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Hauteur carte:</span>
                      <span className="font-semibold">{visualComparison.proposed.cardHeight}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Cartes/rangée (MD):</span>
                      <span className="font-semibold text-green-600">{visualComparison.proposed.cardsPerRow.md}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Cartes/rangée (LG):</span>
                      <span className="font-semibold text-green-600">{visualComparison.proposed.cardsPerRow.lg}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Rangées totales:</span>
                      <span className="font-semibold text-green-600">{visualComparison.proposed.totalRows}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-slate-600">Hauteur estimée:</span>
                      <span className="font-bold text-green-600">{visualComparison.proposed.estimatedHeight}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Mockup Visuel */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 font-display">
            Mockup: Comparaison Taille Cartes
          </h2>
          
          {/* Actuel */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-700 mb-3">Version Actuelle (p-6, 2-4 cols)</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <Card key={i} className="p-6 border-2 border-orange-100">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center mb-4">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Exemple Page {i}</h3>
                  <p className="text-sm text-slate-600">Description de la fonctionnalité</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Proposé */}
          <div>
            <h3 className="text-lg font-semibold text-green-700 mb-3">Version Optimisée (p-4, 3-5 cols)</h3>
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map(i => (
                <Card key={i} className="p-4 border-2 border-green-100">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center mb-3">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">Exemple {i}</h3>
                  <p className="text-xs text-slate-600">Description fonctionnalité</p>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Résumé Impact */}
        <Card className="p-6 mt-8 bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-300">
          <h2 className="text-xl font-bold text-purple-900 mb-4">Résumé Impact Global</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">↓ 40%</div>
              <div className="text-sm text-slate-600">Hauteur scroll</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">+25%</div>
              <div className="text-sm text-slate-600">Pages visibles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">↓ 15%</div>
              <div className="text-sm text-slate-600">Catégories</div>
            </div>
          </div>
        </Card>

        {/* Recommandations Finales */}
        <Card className="p-6 mt-8 border-2 border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Recommandations Finales</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-semibold text-slate-900">Appliquer optimisation layout</div>
                <div className="text-sm text-slate-600">Cartes plus compactes, grid 3-5 colonnes</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-semibold text-slate-900">Fusionner catégories similaires</div>
                <div className="text-sm text-slate-600">Réduire de 20 à 17 catégories</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-semibold text-slate-900">Considérer recherche/filtrage</div>
                <div className="text-sm text-slate-600">Avec 102 pages, une barre de recherche pourrait améliorer UX</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8 justify-center">
          <Button
            onClick={() => window.location.href = createPageUrl('ArchitectDashboard')}
            variant="outline"
            size="lg"
          >
            Annuler
          </Button>
          <Button
            onClick={() => alert('Implémentation recommandée - contactez développeur')}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white"
            size="lg"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Approuver & Implémenter
          </Button>
        </div>
      </div>
    </div>
  );
}