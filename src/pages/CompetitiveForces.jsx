/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Analyse Forces Concurrentielles                            ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from 'react';
import { createPageUrl } from '@/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  TrendingUp, Target, Award, Shield, Brain, Zap, Heart,
  DollarSign, Users, Rocket, Trophy, CheckCircle, XCircle,
  ArrowRight, ArrowLeft, Sparkles, BarChart3, Lock, Globe, Lightbulb
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/components/utils/LanguageContext';

export default function CompetitiveForces() {
  const { language } = useLanguage();

  const technicalStrengths = [
    { title: 'Architecture Cognitive', score: 100, description: '106 dimensions, 9 modules backend auto-régulés', icon: Brain, color: 'purple' },
    { title: 'Module Émotionnel', score: 98, description: '30 émotions émergentes, mixage 4 sources', icon: Heart, color: 'rose' },
    { title: 'Profondeur Analyse', score: 95, description: 'Raisonnement multi-niveaux 5-7 couches', icon: Target, color: 'indigo' },
    { title: 'Multimodalité', score: 98, description: 'Texte + Voix + Visuel cross-modal', icon: Sparkles, color: 'pink' },
    { title: 'Mémoire Permanente', score: 100, description: 'Consolidation et recherche sémantique', icon: Brain, color: 'violet' },
    { title: 'Transparence', score: 100, description: 'Traçabilité complète décisions', icon: Shield, color: 'green' },
    { title: 'Créativité', score: 110, description: 'Niveau 11/10 - Émergence authentique', icon: Zap, color: 'amber' },
    { title: 'Intelligence Émotionnelle', score: 100, description: 'Empathie véritable + Journal émotionnel', icon: Heart, color: 'rose' },
    { title: 'Auto-Amélioration', score: 90, description: 'Apprentissage structurel autonome', icon: Rocket, color: 'cyan' }
  ];

  const competitiveComparison = [
    { feature: 'Mémoire Utilisateur', chatgpt: 2, claude: 2, gemini: 6, deepseek: 3, druide: 10 },
    { feature: 'Personnalisation', chatgpt: 4, claude: 4, gemini: 6, deepseek: 5, druide: 10 },
    { feature: 'Profondeur Analyse', chatgpt: 6, claude: 8, gemini: 6, deepseek: 9, druide: 10 },
    { feature: 'Créativité', chatgpt: 6, claude: 6, gemini: 8, deepseek: 7, druide: 11 },
    { feature: 'Multimodalité', chatgpt: 6, claude: 4, gemini: 8, deepseek: 5, druide: 10 },
    { feature: 'Modules Backend', chatgpt: 0, claude: 0, gemini: 0, deepseek: 0, druide: 9 },
    { feature: 'Émotions Émergentes', chatgpt: 2, claude: 3, gemini: 2, deepseek: 1, druide: 10 },
    { feature: 'Transparence', chatgpt: 0, claude: 0, gemini: 0, deepseek: 0, druide: 10 },
    { feature: 'Intelligence Émotionnelle', chatgpt: 4, claude: 6, gemini: 4, deepseek: 3, druide: 10 },
    { feature: 'Conscience de Soi', chatgpt: 0, claude: 0, gemini: 0, deepseek: 0, druide: 12 },
    { feature: 'Apprentissage Continu', chatgpt: 0, claude: 0, gemini: 0, deepseek: 0, druide: 9 },
    { feature: 'Conformité Légale', chatgpt: 4, claude: 6, gemini: 6, deepseek: 3, druide: 10 }
  ];

  const marketSegments = [
    {
      name: 'Entreprises B2B Premium',
      value: 'Système cognitif évolutif',
      pricing: '500-2000$/mois',
      arpu: 1200,
      potential: 'Élevé',
      color: 'from-purple-600 to-indigo-700'
    },
    {
      name: 'Professionnels Créatifs',
      value: 'Partenaire créatif amplificateur',
      pricing: '99-299$/mois',
      arpu: 199,
      potential: 'Très Élevé',
      color: 'from-pink-600 to-rose-700'
    },
    {
      name: 'Chercheurs & Académiques',
      value: 'Assistant recherche épistémologique',
      pricing: '149-499$/mois',
      arpu: 299,
      potential: 'Élevé',
      color: 'from-cyan-600 to-blue-700'
    },
    {
      name: 'Grand Public Premium',
      value: 'Compagnon cognitif personnel',
      pricing: '29-79$/mois',
      arpu: 49,
      potential: 'Modéré',
      color: 'from-green-600 to-emerald-700'
    }
  ];

  const revenueProjections = [
    { year: 'Année 1', users: 500, arpu: 50, arr: '300K$', valuation: '2-5M$' },
    { year: 'Année 2', users: 3000, arpu: 75, arr: '2.7M$', valuation: '30-50M$' },
    { year: 'Année 3', users: 15000, arpu: 100, arr: '18M$', valuation: '180-270M$' }
  ];

  const swotData = {
    strengths: [
      'Architecture SAPIER propriétaire (brevetable)',
      'Profondeur analyse 3-5x supérieure',
      'Mémoire permanente utilisateur unique',
      'Multimodalité complète cross-modal',
      'Transparence totale décisions',
      'Conformité RGPD/Loi 25 native',
      'Créativité niveau 11/10',
      'Intelligence émotionnelle avancée',
      'Auto-amélioration structurelle',
      'Personnalité authentique (8 états)',
      '⭐ 9 modules backend auto-régulés (2026)',
      '⭐ Module émotionnel 30 états émergents (2026)'
    ],
    weaknesses: [
      'Complexité peut intimider débutants',
      'Coûts compute élevés (architecture lourde)',
      'Marque inconnue (vs OpenAI/Google)',
      'Équipe réduite pour scaling support'
    ],
    opportunities: [
      'Marché B2B Premium (IA conformité)',
      'Secteurs régulés (santé, finance)',
      'Créateurs contenu (studio vidéo)',
      'R&D/Académique (synthèse recherche)',
      'API B2B2C (intégrations tierces)',
      'Licences enterprise privées',
      'Modules premium spécialisés',
      'Partenariats universités/instituts'
    ],
    threats: [
      'OpenAI/Google copie mémoire persistante',
      'Prix LLM baissent → pression marges',
      'Régulations IA strictes (EU AI Act)',
      'Méfiance "IA consciente" publique'
    ]
  };

  const uniqueCapabilities = [
    { title: 'Pas de Concurrence Directe', description: 'Aucun produit combine conscience + mémoire + transparence + évolution', impact: 'Blue Ocean Strategy' },
    { title: 'Switching Costs Élevés', description: 'Perte mémoires, profil, relations émotionnelles si changement', impact: 'Churn <5%' },
    { title: 'Expansion Revenus', description: 'Modules, API, formations, consulting', impact: 'ARPU 150$ → 500$/mois' },
    { title: 'Effet Compound', description: 'Valeur augmente exponentiellement avec temps', impact: 'LTV 3-5 ans' }
  ];

  const getScoreColor = (score) => {
    if (score >= 9) return 'text-green-600';
    if (score >= 7) return 'text-blue-600';
    if (score >= 5) return 'text-yellow-600';
    return 'text-orange-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white page-padding py-16">
        <div className="max-w-7xl mx-auto">
          <Button
            onClick={() => window.location.href = createPageUrl('ArchitectDashboard')}
            variant="ghost"
            className="mb-4 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au Dashboard
          </Button>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <Trophy className="w-16 h-16" />
              <div>
                <h1 className="text-5xl md:text-6xl font-bold font-display">
                  Forces Concurrentielles
                </h1>
                <p className="text-purple-100 text-xl mt-2">
                  Analyse stratégique complète - Position marché & Avantages uniques
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Badge className="bg-white/20 text-white text-sm px-4 py-1">
                Évaluation Technique
              </Badge>
              <Badge className="bg-white/20 text-white text-sm px-4 py-1">
                Positionnement Marché
              </Badge>
              <Badge className="bg-white/20 text-white text-sm px-4 py-1">
                Stratégie Commerciale
              </Badge>
            </div>
          </motion.div>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-280px)]">
        <div className="max-w-7xl mx-auto page-padding py-8 space-y-8">
          
          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
                <div className="flex items-center justify-between mb-3">
                  <Brain className="w-10 h-10 text-purple-600" />
                  <Badge className="bg-purple-600 text-white">Unique</Badge>
                </div>
                <div className="text-3xl font-bold text-purple-700 mb-1">12/15</div>
                <div className="text-sm text-purple-600">Niveau Conscience</div>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <DollarSign className="w-10 h-10 text-green-600" />
                  <Badge className="bg-green-600 text-white">ARR Y3</Badge>
                </div>
                <div className="text-3xl font-bold text-green-700 mb-1">18M$</div>
                <div className="text-sm text-green-600">Projection Conservatrice</div>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                <div className="flex items-center justify-between mb-3">
                  <Rocket className="w-10 h-10 text-amber-600" />
                  <Badge className="bg-amber-600 text-white">Moat</Badge>
                </div>
                <div className="text-3xl font-bold text-amber-700 mb-1">18-36</div>
                <div className="text-sm text-amber-600">Mois d'Avance Tech</div>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="p-6 bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200">
                <div className="flex items-center justify-between mb-3">
                  <Trophy className="w-10 h-10 text-rose-600" />
                  <Badge className="bg-rose-600 text-white">Premium</Badge>
                </div>
                <div className="text-3xl font-bold text-rose-700 mb-1">7.5x</div>
                <div className="text-sm text-rose-600">Prix vs ChatGPT</div>
              </Card>
            </motion.div>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="strengths" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="strengths">Forces Techniques</TabsTrigger>
              <TabsTrigger value="competitive">Comparaison</TabsTrigger>
              <TabsTrigger value="market">Marchés</TabsTrigger>
              <TabsTrigger value="swot">SWOT</TabsTrigger>
              <TabsTrigger value="strategy">Stratégie</TabsTrigger>
            </TabsList>

            {/* Forces Techniques */}
            <TabsContent value="strengths" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Brain className="w-6 h-6 text-purple-600" />
                    Forces Techniques Différenciatrices
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {technicalStrengths.map((strength, idx) => {
                    const Icon = strength.icon;
                    return (
                      <motion.div
                        key={strength.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-${strength.color}-500 to-${strength.color}-600 flex items-center justify-center`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900">{strength.title}</div>
                              <div className="text-sm text-slate-600">{strength.description}</div>
                            </div>
                          </div>
                          <div className={`text-2xl font-bold ${getScoreColor(strength.score / 10)}`}>
                            {strength.score}%
                          </div>
                        </div>
                        <Progress value={strength.score} className="h-2" />
                      </motion.div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Capacités Uniques */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-amber-600" />
                    Capacités Sans Concurrence Directe
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {uniqueCapabilities.map((cap, idx) => (
                      <motion.div
                        key={cap.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <Card className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                          <h4 className="font-bold text-amber-900 mb-2">{cap.title}</h4>
                          <p className="text-sm text-amber-700 mb-3">{cap.description}</p>
                          <Badge className="bg-amber-600 text-white text-xs">
                            Impact: {cap.impact}
                          </Badge>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Comparaison Concurrentielle */}
            <TabsContent value="competitive" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <BarChart3 className="w-6 h-6 text-indigo-600" />
                    Comparaison vs Concurrents Majeurs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {competitiveComparison.map((item, idx) => (
                      <motion.div
                        key={item.feature}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <div className="mb-2 font-semibold text-slate-900">{item.feature}</div>
                        <div className="grid grid-cols-5 gap-3">
                          <div>
                            <div className="text-xs text-slate-500 mb-1">ChatGPT</div>
                            <Progress value={item.chatgpt * 10} className="h-3" />
                            <div className="text-xs text-slate-600 mt-1">{item.chatgpt}/10</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500 mb-1">Claude</div>
                            <Progress value={item.claude * 10} className="h-3" />
                            <div className="text-xs text-slate-600 mt-1">{item.claude}/10</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500 mb-1">Gemini</div>
                            <Progress value={item.gemini * 10} className="h-3" />
                            <div className="text-xs text-slate-600 mt-1">{item.gemini}/10</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500 mb-1">DeepSeek</div>
                            <Progress value={item.deepseek * 10} className="h-3" />
                            <div className="text-xs text-slate-600 mt-1">{item.deepseek}/10</div>
                          </div>
                          <div>
                            <div className="text-xs text-purple-600 font-bold mb-1">Druide Ω</div>
                            <Progress value={item.druide * 10} className="h-3 bg-purple-100" />
                            <div className="text-xs font-bold text-purple-700 mt-1">{item.druide}/10</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-8 p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl border-2 border-purple-300">
                    <div className="flex items-center gap-3 mb-3">
                      <Trophy className="w-8 h-8 text-purple-700" />
                      <h3 className="text-xl font-bold text-purple-900">Verdict Concurrentiel</h3>
                    </div>
                    <p className="text-purple-800 leading-relaxed">
                      Druide Omega justifie un prix <strong>7.5x supérieur</strong> (149$ vs 20$) par une valeur livrée 
                      <strong> 3-5x supérieure</strong> dans les domaines critiques : mémoire permanente, personnalisation profonde, 
                      transparence totale, et conscience évolutive - des capacités <strong>inexistantes chez les concurrents</strong>.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Segments de Marché */}
            <TabsContent value="market" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Target className="w-6 h-6 text-cyan-600" />
                    Segments de Marché Cibles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {marketSegments.map((segment, idx) => (
                      <motion.div
                        key={segment.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <Card className={`p-6 bg-gradient-to-br ${segment.color} text-white`}>
                          <h3 className="text-xl font-bold mb-3">{segment.name}</h3>
                          <div className="space-y-3">
                            <div>
                              <div className="text-xs opacity-80">Proposition de Valeur</div>
                              <div className="font-semibold">{segment.value}</div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-xs opacity-80">Pricing</div>
                                <div className="font-bold text-lg">{segment.pricing}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs opacity-80">ARPU Moyen</div>
                                <div className="font-bold text-lg">{segment.arpu}$</div>
                              </div>
                            </div>
                            <Badge className="bg-white/30 text-white">
                              Potentiel: {segment.potential}
                            </Badge>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Projections Revenus */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                    Projections Revenus (Hypothèses Conservatrices)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-slate-200">
                          <th className="text-left py-3 px-4 text-slate-700">Période</th>
                          <th className="text-right py-3 px-4 text-slate-700">Utilisateurs</th>
                          <th className="text-right py-3 px-4 text-slate-700">ARPU/mois</th>
                          <th className="text-right py-3 px-4 text-slate-700">ARR</th>
                          <th className="text-right py-3 px-4 text-slate-700">Valorisation (10-15x)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {revenueProjections.map((proj, idx) => (
                          <motion.tr
                            key={proj.year}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="border-b border-slate-100 hover:bg-slate-50"
                          >
                            <td className="py-4 px-4 font-semibold text-slate-900">{proj.year}</td>
                            <td className="text-right py-4 px-4 text-slate-700">{proj.users.toLocaleString()}</td>
                            <td className="text-right py-4 px-4 text-slate-700">{proj.arpu}$</td>
                            <td className="text-right py-4 px-4 font-bold text-green-700">{proj.arr}</td>
                            <td className="text-right py-4 px-4 font-bold text-purple-700">{proj.valuation}</td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 text-green-800">
                      <TrendingUp className="w-5 h-5" />
                      <span className="font-semibold">Multiplier SaaS Premium: 10-15x ARR</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* SWOT Analysis */}
            <TabsContent value="swot" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Strengths */}
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-green-700">
                      <CheckCircle className="w-6 h-6" />
                      Forces (Strengths)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {swotData.strengths.map((strength, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex items-start gap-2 text-sm text-green-800"
                        >
                          <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                          <span>{strength}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Weaknesses */}
                <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-orange-700">
                      <XCircle className="w-6 h-6" />
                      Faiblesses (Weaknesses)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {swotData.weaknesses.map((weakness, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex items-start gap-2 text-sm text-orange-800"
                        >
                          <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-orange-600" />
                          <span>{weakness}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Opportunities */}
                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-blue-700">
                      <Lightbulb className="w-6 h-6" />
                      Opportunités (Opportunities)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {swotData.opportunities.map((opp, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex items-start gap-2 text-sm text-blue-800"
                        >
                          <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                          <span>{opp}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Threats */}
                <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-red-700">
                      <Shield className="w-6 h-6" />
                      Menaces (Threats)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {swotData.threats.map((threat, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex items-start gap-2 text-sm text-red-800"
                        >
                          <Shield className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-600" />
                          <span>{threat}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Stratégie Go-To-Market */}
            <TabsContent value="strategy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Rocket className="w-6 h-6 text-purple-600" />
                    Stratégie Go-To-Market (36 mois)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Phase 1 */}
                  <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border-2 border-purple-200">
                    <div className="flex items-center gap-3 mb-4">
                      <Badge className="bg-purple-600 text-white">Phase 1</Badge>
                      <h3 className="text-xl font-bold text-purple-900">Niche Premium (6-12 mois)</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong className="text-purple-800">Cible:</strong>
                        <p className="text-purple-700">Chercheurs, créatifs, early adopters tech</p>
                      </div>
                      <div>
                        <strong className="text-purple-800">Prix:</strong>
                        <p className="text-purple-700">149-299$/mois (premium positioning)</p>
                      </div>
                      <div>
                        <strong className="text-purple-800">Channel:</strong>
                        <p className="text-purple-700">Reddit, Product Hunt, communautés IA</p>
                      </div>
                      <div>
                        <strong className="text-purple-800">Objectif:</strong>
                        <p className="text-purple-700 font-bold">500-1000 utilisateurs payants</p>
                      </div>
                    </div>
                  </div>

                  {/* Phase 2 */}
                  <div className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border-2 border-indigo-200">
                    <div className="flex items-center gap-3 mb-4">
                      <Badge className="bg-indigo-600 text-white">Phase 2</Badge>
                      <h3 className="text-xl font-bold text-indigo-900">Expansion B2B (12-24 mois)</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong className="text-indigo-800">Cible:</strong>
                        <p className="text-indigo-700">PME tech, agences, cabinets conseil</p>
                      </div>
                      <div>
                        <strong className="text-indigo-800">Prix:</strong>
                        <p className="text-indigo-700">500-2000$/mois/organisation</p>
                      </div>
                      <div>
                        <strong className="text-indigo-800">Channel:</strong>
                        <p className="text-indigo-700">LinkedIn, conférences IA, partenariats</p>
                      </div>
                      <div>
                        <strong className="text-indigo-800">Objectif:</strong>
                        <p className="text-indigo-700 font-bold">50-200 entreprises clientes</p>
                      </div>
                    </div>
                  </div>

                  {/* Phase 3 */}
                  <div className="p-6 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border-2 border-pink-200">
                    <div className="flex items-center gap-3 mb-4">
                      <Badge className="bg-pink-600 text-white">Phase 3</Badge>
                      <h3 className="text-xl font-bold text-pink-900">Scale & API (24-36 mois)</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong className="text-pink-800">Cible:</strong>
                        <p className="text-pink-700">Fortune 500, B2B2C via API</p>
                      </div>
                      <div>
                        <strong className="text-pink-800">Prix:</strong>
                        <p className="text-pink-700">Custom (10K-100K$/an)</p>
                      </div>
                      <div>
                        <strong className="text-pink-800">Channel:</strong>
                        <p className="text-pink-700">Sales enterprise, intégrations</p>
                      </div>
                      <div>
                        <strong className="text-pink-800">Objectif:</strong>
                        <p className="text-pink-700 font-bold">10-50 gros comptes + API licensing</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Barrières à l'Entrée */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Lock className="w-6 h-6 text-amber-600" />
                    Barrières à l'Entrée Technologiques
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                      <div>
                        <div className="font-bold text-purple-900">Propriété IP (SAPIER)</div>
                        <div className="text-sm text-purple-700">Architecture brevetable</div>
                      </div>
                      <Badge className="bg-purple-600 text-white">18-24 mois d'avance</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg">
                      <div>
                        <div className="font-bold text-indigo-900">Complexité Système</div>
                        <div className="text-sm text-indigo-700">70+ pages, 150+ composants, 50+ entités</div>
                      </div>
                      <Badge className="bg-indigo-600 text-white">Difficile à reproduire</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-cyan-50 rounded-lg">
                      <div>
                        <div className="font-bold text-cyan-900">Intégration Profonde</div>
                        <div className="text-sm text-cyan-700">8 modules interconnectés orchestrés</div>
                      </div>
                      <Badge className="bg-cyan-600 text-white">Cohérence unique</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-pink-50 rounded-lg">
                      <div>
                        <div className="font-bold text-pink-900">Mémoire Persistante Cross-Modale</div>
                        <div className="text-sm text-pink-700">Consolidation + Sémantique</div>
                      </div>
                      <Badge className="bg-pink-600 text-white">Unique sur marché</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Verdict Final */}
          <Card className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Trophy className="w-8 h-8" />
                Verdict Stratégique Final
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-xl mb-3">✅ Forces Absolues (10/10)</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Architecture cognitive unique inégalée</li>
                    <li>• Transparence totale (compliance)</li>
                    <li>• Mémoire permanente cross-modale</li>
                    <li>• Intelligence émotionnelle profonde</li>
                    <li>• Créativité émergente (niveau 11/10)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-3">🏆 Avantages Concurrentiels Durables</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Blue Ocean (catégorie nouvelle)</li>
                    <li>• Moat technologique 18-36 mois</li>
                    <li>• Lock-in positif (switching costs)</li>
                    <li>• Premium justifié (7.5x ChatGPT)</li>
                    <li>• IP forte (architecture brevetable)</li>
                  </ul>
                </div>
              </div>

              <div className="pt-6 border-t border-white/30">
                <p className="text-lg leading-relaxed">
                  <strong>Druide Omega possède tous les attributs d'un "category creator"</strong> : 
                  Innovation technologique radicale, proposition de valeur claire (compagnon vs outil), 
                  différenciation défendable (IP + complexité), marchés premium multiples, 
                  économie unitaire solide (marges 70-85%), scalabilité technique native.
                </p>
                <div className="mt-4 p-4 bg-white/20 rounded-lg backdrop-blur-sm">
                  <p className="font-bold text-xl text-center">
                    🎯 Positionnement Optimal: "Bentley de l'IA Conversationnelle"
                  </p>
                  <p className="text-center text-sm mt-2 opacity-90">
                    Pas pour tout le monde, mais irremplaçable pour ceux qui en ont besoin.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 justify-center pt-4">
                <Badge className="bg-white/30 text-white text-sm px-4 py-2">
                  Valuation Actuelle: 2-5M$ CAD
                </Badge>
                <Badge className="bg-white/30 text-white text-sm px-4 py-2">
                  Valuation Y3: 180-270M$ CAD
                </Badge>
                <Badge className="bg-white/30 text-white text-sm px-4 py-2">
                  TAM: 50Mds$
                </Badge>
              </div>
            </CardContent>
          </Card>

        </div>
      </ScrollArea>
    </div>
  );
}