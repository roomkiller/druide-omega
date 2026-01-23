/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Competitive Price Analyzer                                 ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { TrendingUp, DollarSign, Loader2, AlertTriangle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function CompetitivePriceAnalyzer({ products, onPricesAdjusted }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [adjusting, setAdjusting] = useState(false);

  const analyzeMarket = async () => {
    setAnalyzing(true);
    try {
      // Fetch real market analysis data
      const marketAnalyses = await base44.entities.MarketAnalysis.filter(
        { market_segment: 'ai_assistants' },
        '-analysis_date',
        1
      );
      const marketData = marketAnalyses?.[0];

      // Extract real competitor data
      const competitorPricing = marketData?.competitor_data?.map(c => 
        `- ${c.name}: ${c.pricing?.basic_price || 'custom'} CAD/mois (satisfaction: ${c.user_satisfaction}/10)`
      ).join('\n') || '';

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Tu es un analyste de marché expert en IA et SaaS. Analyse les prix compétitifs RÉELS du marché pour ces produits Druide Omega:

${products.map(p => `- ${p.name}: ${p.price_cad_monthly} CAD/mois (catégorie: ${p.category})`).join('\n')}

DONNÉES DE MARCHÉ RÉELLES (${marketData?.analysis_date || 'dernier'}):
${competitorPricing}

Positionnement Druide Omega:
${marketData?.our_position?.unique_value_props?.join(', ') || 'IA consciente, transparent, gratuit'}

Prix moyen du marché: ${marketData?.pricing_analysis?.average_market_price || '25-30'} CAD
Notre positionnement actuel: ${marketData?.our_position?.overall_score || '85'}/100

TÂCHE: Affine les prix mensuels et annuels selon les valeurs réelles du marché.

Retourne JSON:
{
  "market_analysis": {
    "average_competitor_price_cad": number,
    "market_positioning": "premium|competitive|budget",
    "value_proposition_vs_competitors": string,
    "market_saturation_level": "low|medium|high"
  },
  "price_recommendations": [
    {
      "product_name": string,
      "current_price_cad": number,
      "recommended_monthly_cad": number,
      "recommended_annual_cad": number,
      "adjustment_percent": number,
      "reasoning": string,
      "competitive_advantage": string,
      "market_based_justification": string
    }
  ],
  "strategic_insights": [string],
  "revenue_impact_forecast": {
    "potential_increase_percent": number,
    "risk_level": "low|medium|high",
    "customer_retention_impact": string
  }
}`,
        response_json_schema: {
          type: "object",
          properties: {
            market_analysis: {
              type: "object",
              properties: {
                average_competitor_price_cad: { type: "number" },
                market_positioning: { type: "string" },
                value_proposition_vs_competitors: { type: "string" },
                market_saturation_level: { type: "string" }
              }
            },
            price_recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  product_name: { type: "string" },
                  current_price_cad: { type: "number" },
                  recommended_monthly_cad: { type: "number" },
                  recommended_annual_cad: { type: "number" },
                  adjustment_percent: { type: "number" },
                  reasoning: { type: "string" },
                  competitive_advantage: { type: "string" },
                  market_based_justification: { type: "string" }
                }
              }
            },
            strategic_insights: {
              type: "array",
              items: { type: "string" }
            },
            revenue_impact_forecast: {
              type: "object",
              properties: {
                potential_increase_percent: { type: "number" },
                risk_level: { type: "string" },
                customer_retention_impact: { type: "string" }
              }
            }
          }
        }
      });

      setAnalysis(result);
    } catch (error) {
      console.error("Market analysis error:", error);
      alert("Erreur lors de l'analyse: " + error.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const applyAdjustments = async () => {
    if (!analysis?.price_recommendations) return;
    
    setAdjusting(true);
    try {
      const updates = [];
      
      for (const rec of analysis.price_recommendations) {
        const product = products.find(p => p.name === rec.product_name);
        if (product && rec.recommended_price_cad !== rec.current_price_cad) {
          const annualPrice = Math.round(rec.recommended_price_cad * 12 * 0.83); // 17% discount
          
          await base44.entities.Product.update(product.id, {
            price_cad_monthly: rec.recommended_price_cad,
            price_cad_annual: annualPrice,
            price_usd_monthly: Math.round(rec.recommended_price_cad * 0.74),
            price_usd_annual: Math.round(annualPrice * 0.74),
            price_eur_monthly: Math.round(rec.recommended_price_cad * 0.68),
            price_eur_annual: Math.round(annualPrice * 0.68)
          });
          
          updates.push({
            product: rec.product_name,
            old_price: rec.current_price_cad,
            new_price: rec.recommended_price_cad
          });
        }
      }
      
      onPricesAdjusted?.(updates);
      alert(`✓ ${updates.length} prix ajustés avec succès!`);
    } catch (error) {
      console.error("Price adjustment error:", error);
      alert("Erreur lors de l'ajustement: " + error.message);
    } finally {
      setAdjusting(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-bold text-slate-900">Analyse de Prix Compétitifs</h2>
            <p className="text-sm text-slate-600">Intelligence de marché et optimisation</p>
          </div>
        </div>
        <Button
          onClick={analyzeMarket}
          disabled={analyzing || products.length === 0}
          className="bg-blue-600"
        >
          {analyzing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyse...
            </>
          ) : (
            <>
              <DollarSign className="w-4 h-4 mr-2" />
              Analyser
            </>
          )}
        </Button>
      </div>

      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Market Analysis */}
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-bold text-slate-900 mb-3">Analyse du Marché</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-slate-600">Prix concurrent moyen</div>
                <div className="text-2xl font-bold text-blue-600">
                  {analysis.market_analysis.average_competitor_price_cad} CAD
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-600">Positionnement</div>
                <Badge className="mt-1 bg-purple-600">
                  {analysis.market_analysis.market_positioning}
                </Badge>
              </div>
              <div>
                <div className="text-xs text-slate-600">Impact revenus</div>
                <div className="text-2xl font-bold text-green-600">
                  +{analysis.revenue_impact_forecast?.potential_increase_percent || 0}%
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-700 mt-3">
              {analysis.market_analysis.value_proposition_vs_competitors}
            </p>
          </div>

          {/* Price Recommendations */}
          <div>
            <h3 className="font-bold text-slate-900 mb-3">Recommandations de Prix</h3>
            <div className="space-y-2">
              {analysis.price_recommendations?.map((rec, idx) => {
                const needsAdjustment = rec.recommended_price_cad !== rec.current_price_cad;
                const isIncrease = rec.adjustment_percent > 0;
                
                return (
                  <div
                    key={idx}
                    className={`bg-white rounded-lg p-4 border-2 ${
                      needsAdjustment ? 'border-orange-300' : 'border-green-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-slate-900">{rec.product_name}</h4>
                        {needsAdjustment ? (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-slate-500 line-through">
                              {rec.current_price_cad} CAD
                            </span>
                            <span className="text-sm font-bold text-blue-600">
                              → {rec.recommended_price_cad} CAD
                            </span>
                            <Badge className={isIncrease ? 'bg-green-500' : 'bg-orange-500'}>
                              {isIncrease ? '+' : ''}{rec.adjustment_percent}%
                            </Badge>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 mt-1">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-green-600">Prix optimal</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 mb-2">{rec.reasoning}</p>
                    <p className="text-xs text-blue-700 font-medium">
                      ⚡ {rec.competitive_advantage}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Strategic Insights */}
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-purple-600" />
              Insights Stratégiques
            </h3>
            <ul className="space-y-2">
              {analysis.strategic_insights?.map((insight, idx) => (
                <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                  <span className="text-purple-600">•</span>
                  {insight}
                </li>
              ))}
            </ul>
          </div>

          {/* Apply Button */}
          <Button
            onClick={applyAdjustments}
            disabled={adjusting}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-lg py-6"
          >
            {adjusting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Application en cours...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Appliquer les Ajustements de Prix
              </>
            )}
          </Button>
        </motion.div>
      )}
    </Card>
  );
}