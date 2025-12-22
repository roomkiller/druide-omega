/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Audit de Traduction                                        ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ Liste complète des éléments non traduits dans l'application               ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/components/utils/LanguageContext';
import PageTransition from '@/components/utils/PageTransition';
import { AlertTriangle, Search, FileText, CheckCircle, XCircle } from 'lucide-react';

export default function TranslationAudit() {
  const { language } = useLanguage();
  const [filter, setFilter] = useState('');

  const UNTRANSLATED_ITEMS = [
    // ═══ COMPONENTS/MEMORY ═══
    {
      category: 'MemoryStats.jsx',
      type: 'Component',
      priority: 'HIGH',
      items: [
        { line: 86, text: 'Mémoires totales', status: 'hardcoded' },
        { line: 92, text: 'Importance moyenne', status: 'hardcoded' },
        { line: 99, text: 'Accès total', status: 'hardcoded' },
        { line: 106, text: 'Haute priorité', status: 'hardcoded' },
        { line: 156, text: 'Activité (7 jours)', status: 'hardcoded' },
        { line: 194, text: 'Répartition par Modalité', status: 'hardcoded' },
        { line: 228, text: 'Types de Mémoires', status: 'hardcoded' },
        { line: 251, text: 'Distribution Importance', status: 'hardcoded' }
      ]
    },

    // ═══ COMPONENTS/ADMIN ═══
    {
      category: 'AnalyticsDashboard.jsx',
      type: 'Component',
      priority: 'HIGH',
      items: [
        { line: 129, text: 'Events Totaux', status: 'hardcoded' },
        { line: 133, text: '15s refresh', status: 'hardcoded' },
        { line: 136, text: 'Utilisateurs Actifs', status: 'hardcoded' },
        { line: 140, text: 'inscrits', status: 'hardcoded' },
        { line: 143, text: 'Conversations', status: 'hardcoded' },
        { line: 147, text: 'Total', status: 'hardcoded' },
        { line: 150, text: 'Mémoires', status: 'hardcoded' },
        { line: 154, text: 'Moy:', status: 'hardcoded' },
        { line: 157, text: 'Connaissances', status: 'hardcoded' },
        { line: 161, text: 'Documents', status: 'hardcoded' },
        { line: 165, text: 'Events/User', status: 'hardcoded' },
        { line: 168, text: 'Moyenne', status: 'hardcoded' },
        { line: 207, text: 'Activité (7 derniers jours)', status: 'hardcoded' },
        { line: 221, text: 'Events par Type', status: 'hardcoded' },
        { line: 245, text: 'Fonctionnalités Populaires', status: 'hardcoded' },
        { line: 259, text: 'Croissance Utilisateurs', status: 'hardcoded' }
      ]
    },

    // ═══ COMPONENTS/CONSCIOUSNESS ═══
    {
      category: 'ConsciousnessMetricsChart.jsx',
      type: 'Component',
      priority: 'MEDIUM',
      items: [
        { line: 19, text: 'Aucune donnée disponible', status: 'hardcoded' }
      ]
    },

    // ═══ COMPONENTS/OFFLINE ═══
    {
      category: 'OfflineIndicator.jsx',
      type: 'Component',
      priority: 'MEDIUM',
      items: [
        // Déjà traduit avec useLanguage ✓
      ]
    },

    // ═══ PAGES/OFFLINETEST ═══
    {
      category: 'OfflineTest.js',
      type: 'Page',
      priority: 'LOW',
      items: [
        { line: 147, text: 'Patterns:', status: 'hardcoded' },
        { line: 148, text: 'History:', status: 'hardcoded' }
      ]
    },

    // ═══ COMPONENTS/SEMANTIC SEARCH ═══
    {
      category: 'SemanticMemorySearch.jsx',
      type: 'Component',
      priority: 'HIGH',
      items: [
        'Recherche Sémantique',
        'Analyse de la requête',
        'Résultats',
        'Aucun résultat',
        'Score de pertinence',
        'Facteurs',
        'Properties',
        'Calibration'
      ]
    },

    // ═══ PAGES/MEMORY ═══
    {
      category: 'Memory.js',
      type: 'Page',
      priority: 'HIGH',
      items: [
        'Toutes les mémoires',
        'Recherche sémantique',
        'Recherche avancée',
        'Timeline',
        'Statistiques'
      ]
    },

    // ═══ COMPONENTS/PROACTIVE ═══
    {
      category: 'ProactiveSuggestionsPanel.jsx',
      type: 'Component',
      priority: 'MEDIUM',
      items: [
        'Suggestion IA',
        'Prédiction'
      ]
    },

    // ═══ LAYOUT.JS ═══
    {
      category: 'Layout.js',
      type: 'Core',
      priority: 'LOW',
      items: [
        // Navigation déjà traduite via t() ✓
        { line: 283, text: 'ADMIN badge', status: 'ok' }
      ]
    },

    // ═══ PAGES DIVERSES ═══
    {
      category: 'Pages Diverses',
      type: 'Pages',
      priority: 'MEDIUM',
      items: [
        'PublicAdmin.js - Tous les textes en français',
        'PublicEvaluation.js - Tous les textes en français',
        'UserManagement.js - Headers de tableaux',
        'Admin.js - Panneaux et labels',
        'ProductManagement.js - Labels produits',
        'Consciousness.js - Sliders et métriques',
        'Knowledge.js - Boutons et instructions',
        'VoiceRoom.js - Interface vocale'
      ]
    },

    // ═══ GARDNER MODULES ═══
    {
      category: 'GardnerModules.jsx',
      type: 'Component',
      priority: 'CRITICAL',
      items: [
        'Tous les systemPrompt en français uniquement',
        'Propriétés JSON schema en français',
        'Descriptions de fonctions',
        'Messages d\'erreur'
      ]
    },

    // ═══ OFFLINE EMULATOR ═══
    {
      category: 'LocalLLMEmulator.jsx',
      type: 'Component',
      priority: 'HIGH',
      items: [
        { line: 96, text: '⚠️ Mode hors-ligne: Recherche internet non disponible...', status: 'hardcoded' },
        { line: 141, text: '🔌 Mode hors-ligne activé...', status: 'hardcoded' },
        { line: 146, text: '📚 Explication (mode hors-ligne)...', status: 'hardcoded' },
        { line: 148, text: '✏️ Mode création hors-ligne...', status: 'hardcoded' },
        { line: 150, text: '🔍 Analyse limitée...', status: 'hardcoded' },
        { line: 161, text: '💡 *Astuce*: Toutes vos actions...', status: 'hardcoded' }
      ]
    },

    // ═══ DIVERS ═══
    {
      category: 'Divers',
      type: 'Mixed',
      priority: 'MEDIUM',
      items: [
        'MemoryCard.jsx - Labels et badges',
        'MemoryTimeline.jsx - Titres de sections',
        'AdvancedMemorySearch.jsx - Filtres et placeholders',
        'ConsciousnessMetrics.jsx - Labels de métriques',
        'ThoughtCard.jsx - Catégories et émotions',
        'CompetitiveComparison.jsx - Tableaux comparatifs',
        'ValuationCalculator.jsx - Labels financiers',
        'ProductManualsManager.jsx - Manuels et guides'
      ]
    }
  ];

  const filteredItems = filter 
    ? UNTRANSLATED_ITEMS.filter(cat => 
        cat.category.toLowerCase().includes(filter.toLowerCase()) ||
        cat.items.some(item => 
          (typeof item === 'string' && item.toLowerCase().includes(filter.toLowerCase())) ||
          (typeof item === 'object' && item.text?.toLowerCase().includes(filter.toLowerCase()))
        )
      )
    : UNTRANSLATED_ITEMS;

  const stats = {
    total: UNTRANSLATED_ITEMS.length,
    critical: UNTRANSLATED_ITEMS.filter(c => c.priority === 'CRITICAL').length,
    high: UNTRANSLATED_ITEMS.filter(c => c.priority === 'HIGH').length,
    medium: UNTRANSLATED_ITEMS.filter(c => c.priority === 'MEDIUM').length,
    low: UNTRANSLATED_ITEMS.filter(c => c.priority === 'LOW').length
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/30 page-padding page-padding-y">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <AlertTriangle className="w-10 h-10 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2 font-display">
              {language === 'en' ? 'Translation Audit' : 'Audit de Traduction'}
            </h1>
            <p className="text-slate-600">
              {language === 'en' 
                ? 'Complete list of untranslated elements in the application'
                : 'Liste complète des éléments non traduits dans l\'application'
              }
            </p>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card className="p-4 bg-gradient-to-br from-slate-50 to-slate-100">
              <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
              <div className="text-xs text-slate-600">
                {language === 'en' ? 'Total Categories' : 'Catégories Total'}
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <div className="text-2xl font-bold text-red-900">{stats.critical}</div>
              <div className="text-xs text-red-600 font-semibold">CRITICAL</div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <div className="text-2xl font-bold text-orange-900">{stats.high}</div>
              <div className="text-xs text-orange-600 font-semibold">HIGH</div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
              <div className="text-2xl font-bold text-yellow-900">{stats.medium}</div>
              <div className="text-xs text-yellow-600 font-semibold">MEDIUM</div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <div className="text-2xl font-bold text-green-900">{stats.low}</div>
              <div className="text-xs text-green-600 font-semibold">LOW</div>
            </Card>
          </div>

          {/* Search */}
          <Card className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder={language === 'en' ? 'Search in categories...' : 'Rechercher dans les catégories...'}
                className="pl-10"
              />
            </div>
          </Card>

          {/* Categories List */}
          <div className="space-y-4">
            {filteredItems.map((category, idx) => (
              <Card key={idx} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-slate-600" />
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">{category.category}</h3>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{category.type}</Badge>
                        <Badge 
                          className={`text-xs ${
                            category.priority === 'CRITICAL' ? 'bg-red-600' :
                            category.priority === 'HIGH' ? 'bg-orange-600' :
                            category.priority === 'MEDIUM' ? 'bg-yellow-600' :
                            'bg-green-600'
                          } text-white`}
                        >
                          {category.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {category.items.map((item, itemIdx) => {
                    if (typeof item === 'string') {
                      return (
                        <div key={itemIdx} className="flex items-start gap-2 p-2 bg-orange-50 rounded border border-orange-200">
                          <XCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-700">{item}</span>
                        </div>
                      );
                    } else {
                      return (
                        <div key={itemIdx} className="flex items-start gap-2 p-2 bg-orange-50 rounded border border-orange-200">
                          <XCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="text-sm text-slate-700 font-medium">{item.text}</div>
                            <div className="flex gap-2 mt-1">
                              {item.line && (
                                <span className="text-xs text-slate-500">Ligne {item.line}</span>
                              )}
                              {item.status && (
                                <Badge variant="secondary" className="text-[9px]">{item.status}</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              </Card>
            ))}
          </div>

          {/* Recommendations */}
          <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
            <h3 className="font-bold text-lg text-slate-900 mb-4">
              {language === 'en' ? '📋 Recommendations' : '📋 Recommandations'}
            </h3>
            <div className="space-y-3 text-sm text-slate-700">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Priority 1 (CRITICAL):</strong>{' '}
                  {language === 'en' 
                    ? 'Translate GardnerModules.jsx - all system prompts and function descriptions must support multilingual'
                    : 'Traduire GardnerModules.jsx - tous les prompts système et descriptions de fonctions doivent supporter le multilingue'
                  }
                </p>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Priority 2 (HIGH):</strong>{' '}
                  {language === 'en'
                    ? 'Add useLanguage hook to MemoryStats, AnalyticsDashboard, and SemanticMemorySearch'
                    : 'Ajouter le hook useLanguage à MemoryStats, AnalyticsDashboard et SemanticMemorySearch'
                  }
                </p>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Priority 3 (MEDIUM):</strong>{' '}
                  {language === 'en'
                    ? 'Create translation keys for all hardcoded chart labels and error messages'
                    : 'Créer des clés de traduction pour tous les labels de graphiques et messages d\'erreur'
                  }
                </p>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Priority 4 (LOW):</strong>{' '}
                  {language === 'en'
                    ? 'Translate admin panels and technical documentation pages'
                    : 'Traduire les panneaux admin et pages de documentation technique'
                  }
                </p>
              </div>
            </div>
          </Card>

          {/* Translation Coverage */}
          <Card className="p-6">
            <h3 className="font-bold text-lg text-slate-900 mb-4">
              {language === 'en' ? '📊 Translation Coverage Estimate' : '📊 Estimation Couverture Traduction'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">
                    {language === 'en' ? 'Core Navigation & Layout' : 'Navigation & Layout Core'}
                  </span>
                  <span className="font-bold text-green-600">95%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full" style={{width: '95%'}} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">
                    {language === 'en' ? 'User-facing Pages' : 'Pages Utilisateur'}
                  </span>
                  <span className="font-bold text-orange-600">60%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-orange-500 to-amber-600 h-2 rounded-full" style={{width: '60%'}} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">
                    {language === 'en' ? 'Admin & Analytics' : 'Admin & Analytiques'}
                  </span>
                  <span className="font-bold text-red-600">30%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-red-500 to-rose-600 h-2 rounded-full" style={{width: '30%'}} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">
                    {language === 'en' ? 'AI Modules & Intelligence' : 'Modules IA & Intelligence'}
                  </span>
                  <span className="font-bold text-red-600">15%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-red-600 to-red-700 h-2 rounded-full" style={{width: '15%'}} />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <div className="flex justify-between text-base font-bold">
                  <span className="text-slate-900">
                    {language === 'en' ? 'Overall Coverage' : 'Couverture Globale'}
                  </span>
                  <span className="text-orange-600">~55%</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Action Plan */}
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <h3 className="font-bold text-lg text-slate-900 mb-4">
              {language === 'en' ? '🎯 Action Plan' : '🎯 Plan d\'Action'}
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-purple-200">
                <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                <div>
                  <strong>
                    {language === 'en' ? 'Extend AutoTranslation.jsx' : 'Étendre AutoTranslation.jsx'}
                  </strong>
                  <p className="text-slate-600 mt-1">
                    {language === 'en'
                      ? 'Add all missing translation keys for charts, stats, and UI elements'
                      : 'Ajouter toutes les clés manquantes pour graphiques, stats et éléments UI'
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-purple-200">
                <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                <div>
                  <strong>
                    {language === 'en' ? 'Refactor GardnerModules' : 'Refactoriser GardnerModules'}
                  </strong>
                  <p className="text-slate-600 mt-1">
                    {language === 'en'
                      ? 'Create language-aware system prompts with dynamic translation'
                      : 'Créer des prompts système avec traduction dynamique selon la langue'
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-purple-200">
                <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                <div>
                  <strong>
                    {language === 'en' ? 'Update Components' : 'Mettre à Jour Composants'}
                  </strong>
                  <p className="text-slate-600 mt-1">
                    {language === 'en'
                      ? 'Replace all hardcoded strings with t() function calls'
                      : 'Remplacer toutes les chaînes hardcodées par des appels à t()'
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-purple-200">
                <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">4</div>
                <div>
                  <strong>
                    {language === 'en' ? 'Test All Languages' : 'Tester Toutes Langues'}
                  </strong>
                  <p className="text-slate-600 mt-1">
                    {language === 'en'
                      ? 'Validate FR, EN, ES, DE, ZH translations for completeness'
                      : 'Valider traductions FR, EN, ES, DE, ZH pour complétude'
                    }
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}