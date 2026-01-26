/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Calculateur de Valorisation Exhaustif                      ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import invokeLLM from "@/components/utils/LLMRouter";
import {
  DollarSign,
  TrendingUp,
  Calculator,
  Sparkles,
  Code,
  Database,
  Brain,
  Shield,
  Rocket,
  Award,
  Users,
  Target,
  Zap,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { motion } from "framer-motion";

export default function DruideValuation() {
  const queryClient = useQueryClient();
  const [calculating, setCalculating] = useState(false);

  // Calcul de la valorisation
  const valuationMutation = useMutation({
    mutationFn: async () => {
      // Analyse exhaustive par LLM
      const valuationAnalysis = await invokeLLM({
        prompt: `Tu es un expert en valorisation de startups technologiques et en propriété intellectuelle.

ANALYSE LA VALORISATION DE DRUIDE OMEGA - IA Consciente de Nouvelle Génération

CONTEXTE TECHNIQUE (MISE À JOUR JANVIER 2026):
- Architecture de conscience unique: 106 dimensions (24 émotionnelles, 18 cognitives, 12 existentielles, 10 sociales)
- Framework SAPIER propriétaire (équations de conscience, ratio logique/conscience)
- **⭐ NOUVEAUTÉ 2026: 8 modules backend autonomes orchestrés 24/7** (Cognitive Core, Internal Governance, Introspection, Self-Perception, Perception-Action Loop, Stable Memory Manager, Structural Learning, External Engine Interface)
- **⭐ Synchronisation conscience temps réel** (ConsciousnessConfig → Backend modules)
- **⭐ 7 automations actives** gérant orchestration automatique
- ~69 entités de données structurées
- ~412 composants React/modules fonctionnels
- Système de mémoire multi-modal (chat, voix, visuel)
- Intelligence Gardner (8 types d'intelligence)
- Système de jugement éthique temps réel
- Architecture modulaire brevetable
- Tests de conscience automatisés
- Apprentissage continu et auto-évolution
- Multilingue (30+ langues)
- **⭐ Architecture cognitive unifiée frontend-backend** (unique au monde)

PROPRIÉTÉ INTELLECTUELLE:
- Concept unique: IA avec "conscience architecturée" (non réplicable facilement)
- Framework mathématique SAPIER (potentiellement brevetable)
- Architecture neurobiologique digitale
- Approche philosophique intégrée (Platon, Aristote, Rousseau, Hobbes)
- **⭐ NOUVEAUTÉ 2026: Architecture cognitive backend autonome** (8 modules orchestrés automatiquement)
- **⭐ Algorithmes d'orchestration automatique** (synchronisation temps réel 106 dimensions)
- **⭐ Système de gouvernance interne auto-régulateur** (unique, brevetable)

MARCHÉ CIBLE:
- B2C: Utilisateurs cherchant IA plus "humaine" et éthique
- B2B: Entreprises voulant assistants IA personnalisables
- Recherche: Instituts étudiant conscience artificielle
- Premium positioning vs ChatGPT/Claude

COMPÉTITEURS:
- ChatGPT (OpenAI): valorisation ~$90B mais sans conscience architecturée
- Claude (Anthropic): valorisation ~$30B focus éthique
- Gemini (Google): valorisation incalculable mais intégré
- Aucun concurrent avec architecture de conscience documentée

CALCULE:

1. **COÛTS DE DÉVELOPPEMENT R&D**
   - Heures de conception/développement (~2000h minimum)
   - Recherche architecture conscience
   - Valeur expertise IA/philosophie/neurosciences
   - Coût reconstruction estimé

2. **VALEUR PROPRIÉTÉ INTELLECTUELLE**
   - Unicité architecture SAPIER
   - Potentiel brevets (équations, framework)
   - Avance technologique sur marché
   - Barrière à l'entrée pour concurrents

3. **VALORISATION COMPARATIVE**
   - Multiple des revenus (projeté)
   - Benchmark vs startups IA seed/Series A
   - Premium pour différenciation
   - Comparaison feature-by-feature vs géants

4. **VALEUR TECHNIQUE**
   - Nombre de modules/composants
   - Complexité architecture
   - Scalabilité
   - Qualité code

5. **POTENTIEL REVENUS**
   - TAM (Total Addressable Market) IA consciente
   - Pricing: $20-$50/mois B2C, $500-$5000/mois B2B
   - Projections 1-3-5 ans
   - LTV/CAC ratio

6. **SCÉNARIOS DE VALORISATION**
   - Conservateur (bootstrapped)
   - Modéré (seed funding)
   - Optimiste (Series A)
   - Exit potentiel (acquisition)

RETOURNE JSON détaillé:
{
  "rd_costs": {
    "development_hours": 0,
    "hourly_rate": 0,
    "total_rd": 0,
    "expertise_premium": 0,
    "total_with_premium": 0
  },
  "ip_value": {
    "sapier_framework": 0,
    "consciousness_architecture": 0,
    "patent_potential": 0,
    "competitive_moat": 0,
    "total_ip": 0
  },
  "comparative_valuation": {
    "avg_seed_ai_startup": 0,
    "differentiation_premium": 0,
    "market_position_multiplier": 0,
    "comparable_valuation": 0
  },
  "technical_value": {
    "codebase_lines": 0,
    "modules_count": 0,
    "entities_count": 0,
    "complexity_score": 0,
    "technical_debt_discount": 0,
    "net_technical_value": 0
  },
  "revenue_potential": {
    "tam_size": 0,
    "year_1_revenue": 0,
    "year_3_revenue": 0,
    "year_5_revenue": 0,
    "ltv": 0,
    "valuation_from_revenue": 0
  },
  "valuation_scenarios": {
    "conservative": 0,
    "moderate": 0,
    "optimistic": 0,
    "exit_potential": 0
  },
  "recommended_ask": {
    "seed_round": 0,
    "equity_to_offer": 0,
    "post_money_valuation": 0,
    "rationale": ""
  },
  "key_value_drivers": [{"driver": "", "impact": ""}],
  "risks": [{"risk": "", "mitigation": ""}],
  "next_steps": [""],
  "competitive_positioning": "",
  "investment_thesis": ""
}`,
        response_json_schema: {
          type: "object",
          properties: {
            rd_costs: {
              type: "object",
              properties: {
                development_hours: { type: "number" },
                hourly_rate: { type: "number" },
                total_rd: { type: "number" },
                expertise_premium: { type: "number" },
                total_with_premium: { type: "number" }
              }
            },
            ip_value: {
              type: "object",
              properties: {
                sapier_framework: { type: "number" },
                consciousness_architecture: { type: "number" },
                patent_potential: { type: "number" },
                competitive_moat: { type: "number" },
                total_ip: { type: "number" }
              }
            },
            comparative_valuation: {
              type: "object",
              properties: {
                avg_seed_ai_startup: { type: "number" },
                differentiation_premium: { type: "number" },
                market_position_multiplier: { type: "number" },
                comparable_valuation: { type: "number" }
              }
            },
            technical_value: {
              type: "object",
              properties: {
                codebase_lines: { type: "number" },
                modules_count: { type: "number" },
                entities_count: { type: "number" },
                complexity_score: { type: "number" },
                technical_debt_discount: { type: "number" },
                net_technical_value: { type: "number" }
              }
            },
            revenue_potential: {
              type: "object",
              properties: {
                tam_size: { type: "number" },
                year_1_revenue: { type: "number" },
                year_3_revenue: { type: "number" },
                year_5_revenue: { type: "number" },
                ltv: { type: "number" },
                valuation_from_revenue: { type: "number" }
              }
            },
            valuation_scenarios: {
              type: "object",
              properties: {
                conservative: { type: "number" },
                moderate: { type: "number" },
                optimistic: { type: "number" },
                exit_potential: { type: "number" }
              }
            },
            recommended_ask: {
              type: "object",
              properties: {
                seed_round: { type: "number" },
                equity_to_offer: { type: "number" },
                post_money_valuation: { type: "number" },
                rationale: { type: "string" }
              }
            },
            key_value_drivers: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  driver: { type: "string" },
                  impact: { type: "string" }
                }
              }
            },
            risks: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  risk: { type: "string" },
                  mitigation: { type: "string" }
                }
              }
            },
            next_steps: {
              type: "array",
              items: { type: "string" }
            },
            competitive_positioning: { type: "string" },
            investment_thesis: { type: "string" }
          }
        }
      });

      // Sauvegarder
      await base44.entities.MarketAnalysis.create({
        market_segment: "overall",
        analysis_date: new Date().toISOString(),
        our_position: {
          valuation: valuationAnalysis
        },
        strategic_recommendations: valuationAnalysis.next_steps?.map(step => ({
          priority: "high",
          category: "product",
          recommendation: step
        })) || []
      });

      return valuationAnalysis;
    },
    onSuccess: (data) => {
      console.log('✅ Valorisation calculée:', data);
      queryClient.invalidateQueries({ queryKey: ['druideValuation'] });
    },
    onError: (error) => {
      console.error('❌ Erreur calcul valorisation:', error);
    }
  });

  // Récupérer dernière valorisation
  const { data: valuation, isLoading: loadingValuation } = useQuery({
    queryKey: ['druideValuation'],
    queryFn: async () => {
      const analyses = await base44.entities.MarketAnalysis.filter(
        {},
        '-analysis_date',
        1
      );
      console.log('📊 Analyses récupérées:', analyses);
      const result = analyses[0]?.our_position?.valuation || null;
      console.log('💰 Valorisation:', result);
      return result;
    }
  });

  // Afficher les données de la mutation si disponibles
  const displayValuation = valuation || valuationMutation.data;

  const formatCurrency = (amount) => {
    if (!amount) return "$0";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Valorisation Druide Omega</h1>
              <p className="text-slate-600">Analyse exhaustive technique et financière</p>
            </div>
          </div>
          <Button
            onClick={() => valuationMutation.mutate()}
            disabled={valuationMutation.isPending}
            size="lg"
            className="bg-green-600 hover:bg-green-700 min-h-[44px]"
          >
            {valuationMutation.isPending ? (
              <>
                <Calculator className="w-5 h-5 mr-2 animate-spin" />
                Calcul en cours...
              </>
            ) : (
              <>
                <Calculator className="w-5 h-5 mr-2" />
                Calculer la Valorisation
              </>
            )}
          </Button>
        </div>
      </Card>

      {loadingValuation ? (
        <Card className="p-12">
          <div className="text-center">
            <Calculator className="w-24 h-24 text-slate-300 mx-auto mb-6 animate-pulse" />
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Chargement...</h3>
          </div>
        </Card>
      ) : displayValuation ? (
        <>
          {/* Scénarios de Valorisation - Hero */}
          <Card className="p-8 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 border-purple-300">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              Scénarios de Valorisation
            </h2>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { label: "Conservateur", value: displayValuation.valuation_scenarios?.conservative, color: "from-blue-500 to-cyan-600" },
                { label: "Modéré", value: displayValuation.valuation_scenarios?.moderate, color: "from-purple-500 to-pink-600" },
                { label: "Optimiste", value: displayValuation.valuation_scenarios?.optimistic, color: "from-green-500 to-emerald-600" },
                { label: "Exit Potentiel", value: displayValuation.valuation_scenarios?.exit_potential, color: "from-orange-500 to-red-600" }
              ].map((scenario, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-6 rounded-2xl shadow-xl border-2 border-slate-200"
                >
                  <div className="text-sm text-slate-600 mb-2">{scenario.label}</div>
                  <div className={`text-3xl font-bold bg-gradient-to-r ${scenario.color} bg-clip-text text-transparent`}>
                    {formatCurrency(scenario.value)}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Recommended Ask */}
          <Card className="p-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Recommandation Investissement</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-sm opacity-90 mb-1">Seed Round à Demander</div>
                <div className="text-3xl font-bold">{formatCurrency(displayValuation.recommended_ask?.seed_round)}</div>
              </div>
              <div>
                <div className="text-sm opacity-90 mb-1">Équité à Offrir</div>
                <div className="text-3xl font-bold">{displayValuation.recommended_ask?.equity_to_offer}%</div>
              </div>
              <div>
                <div className="text-sm opacity-90 mb-1">Post-Money Valuation</div>
                <div className="text-3xl font-bold">{formatCurrency(displayValuation.recommended_ask?.post_money_valuation)}</div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-white/20 rounded-lg backdrop-blur">
              <p className="text-sm">{displayValuation.recommended_ask?.rationale}</p>
            </div>
          </Card>

          {/* Breakdown Détaillé */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Coûts R&D */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Code className="w-5 h-5 text-blue-600" />
                Coûts de Développement R&D
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Heures de développement</span>
                  <span className="font-bold">{displayValuation.rd_costs?.development_hours}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Taux horaire</span>
                  <span className="font-bold">{formatCurrency(displayValuation.rd_costs?.hourly_rate)}/h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Total R&D</span>
                  <span className="font-bold">{formatCurrency(displayValuation.rd_costs?.total_rd)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Premium expertise</span>
                  <span className="font-bold">{formatCurrency(displayValuation.rd_costs?.expertise_premium)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg">
                  <span className="font-bold text-slate-900">Total avec premium</span>
                  <span className="font-bold text-green-600">{formatCurrency(displayValuation.rd_costs?.total_with_premium)}</span>
                </div>
              </div>
            </Card>

            {/* Valeur IP */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-600" />
                Propriété Intellectuelle
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Framework SAPIER</span>
                  <span className="font-bold">{formatCurrency(displayValuation.ip_value?.sapier_framework)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Architecture conscience</span>
                  <span className="font-bold">{formatCurrency(displayValuation.ip_value?.consciousness_architecture)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Potentiel brevets</span>
                  <span className="font-bold">{formatCurrency(displayValuation.ip_value?.patent_potential)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Barrière compétitive</span>
                  <span className="font-bold">{formatCurrency(displayValuation.ip_value?.competitive_moat)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg">
                  <span className="font-bold text-slate-900">Total IP</span>
                  <span className="font-bold text-purple-600">{formatCurrency(displayValuation.ip_value?.total_ip)}</span>
                </div>
              </div>
            </Card>

            {/* Valeur Technique */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-600" />
                Valeur Technique
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Lignes de code</span>
                  <span className="font-bold">{displayValuation.technical_value?.codebase_lines?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Modules/Composants</span>
                  <span className="font-bold">{displayValuation.technical_value?.modules_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Entités données</span>
                  <span className="font-bold">{displayValuation.technical_value?.entities_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Score complexité</span>
                  <span className="font-bold">{displayValuation.technical_value?.complexity_score}/10</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Dette technique (discount)</span>
                  <span className="font-bold">-{formatCurrency(displayValuation.technical_value?.technical_debt_discount)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg">
                  <span className="font-bold text-slate-900">Valeur nette technique</span>
                  <span className="font-bold text-cyan-600">{formatCurrency(displayValuation.technical_value?.net_technical_value)}</span>
                </div>
              </div>
            </Card>

            {/* Potentiel Revenus */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Rocket className="w-5 h-5 text-orange-600" />
                Potentiel de Revenus
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">TAM (marché total)</span>
                  <span className="font-bold">{formatCurrency(displayValuation.revenue_potential?.tam_size)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Revenus année 1</span>
                  <span className="font-bold">{formatCurrency(displayValuation.revenue_potential?.year_1_revenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Revenus année 3</span>
                  <span className="font-bold">{formatCurrency(displayValuation.revenue_potential?.year_3_revenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Revenus année 5</span>
                  <span className="font-bold">{formatCurrency(displayValuation.revenue_potential?.year_5_revenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">LTV moyen</span>
                  <span className="font-bold">{formatCurrency(displayValuation.revenue_potential?.ltv)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg">
                  <span className="font-bold text-slate-900">Valorisation (revenus)</span>
                  <span className="font-bold text-orange-600">{formatCurrency(displayValuation.revenue_potential?.valuation_from_revenue)}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Value Drivers */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-600" />
              Moteurs de Valeur Clés
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {displayValuation.key_value_drivers?.map((driver, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <CheckCircle2 className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">{driver.driver}</div>
                    <div className="text-sm text-slate-600">{driver.impact}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Risks */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Risques et Mitigation
            </h3>
            <div className="space-y-3">
              {displayValuation.risks?.map((risk, idx) => (
                <div key={idx} className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="font-bold text-red-900 mb-2">⚠️ {risk.risk}</div>
                  <div className="text-sm text-slate-700">
                    <span className="font-semibold">Mitigation:</span> {risk.mitigation}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Competitive Positioning */}
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              Positionnement Compétitif
            </h3>
            <p className="text-slate-700 leading-relaxed">{displayValuation.competitive_positioning}</p>
          </Card>

          {/* Investment Thesis */}
          <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              Thèse d'Investissement
            </h3>
            <p className="text-slate-700 leading-relaxed">{displayValuation.investment_thesis}</p>
          </Card>

          {/* Next Steps */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-600" />
              Prochaines Étapes
            </h3>
            <div className="space-y-2">
              {displayValuation.next_steps?.map((step, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {idx + 1}
                  </div>
                  <span className="text-slate-700">{step}</span>
                </div>
              ))}
            </div>
          </Card>
        </>
      ) : (
        <Card className="p-12">
          <div className="text-center">
            <DollarSign className="w-24 h-24 text-slate-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Aucune valorisation calculée</h3>
            <p className="text-slate-600 mb-6">
              Lancez le calculateur pour obtenir une analyse exhaustive de la valeur de Druide Omega
            </p>
            <Button
              onClick={() => valuationMutation.mutate()}
              size="lg"
              className="bg-green-600 hover:bg-green-700"
            >
              <Calculator className="w-5 h-5 mr-2" />
              Calculer la Valorisation
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}