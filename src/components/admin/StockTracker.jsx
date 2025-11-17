/**
 * Tracker Actions IA (MSFT, GOOGL, NVDA, META)
 */
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, DollarSign, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StockTracker() {
  const [stockData, setStockData] = useState(null);
  const [fetching, setFetching] = useState(false);

  const fetchStocksMutation = useMutation({
    mutationFn: async () => {
      setFetching(true);

      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Donne-moi les prix actuels et variations des actions IA majeures (données approximatives 2025):
- Microsoft (MSFT) - OpenAI investor
- Google (GOOGL) - Gemini
- NVIDIA (NVDA) - GPU pour IA
- Meta (META) - LLaMA

Inclus aussi une estimation de valorisation pour Druide Omega si coté en bourse.

Retourne JSON:
{
  "stocks": [{
    "symbol": str,
    "company": str,
    "price": number,
    "change_percent": number,
    "market_cap_billions": number,
    "ai_exposure": str (high/medium/low)
  }],
  "druide_estimated": {
    "estimated_price": number,
    "estimated_market_cap_millions": number,
    "comparison": str
  },
  "market_sentiment": str,
  "analysis_date": str
}`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            stocks: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  symbol: { type: "string" },
                  company: { type: "string" },
                  price: { type: "number" },
                  change_percent: { type: "number" },
                  market_cap_billions: { type: "number" },
                  ai_exposure: { type: "string" }
                }
              }
            },
            druide_estimated: {
              type: "object",
              properties: {
                estimated_price: { type: "number" },
                estimated_market_cap_millions: { type: "number" },
                comparison: { type: "string" }
              }
            },
            market_sentiment: { type: "string" },
            analysis_date: { type: "string" }
          }
        }
      });

      setStockData(analysis);
      setFetching(false);
      return analysis;
    },
  });

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Tracker Boursier IA</h2>
              <p className="text-sm text-slate-600">Actions IA & Estimation Druide Omega</p>
            </div>
          </div>
          <Button
            onClick={() => fetchStocksMutation.mutate()}
            disabled={fetching}
            className="min-h-[44px]"
          >
            {fetching ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            {fetching ? 'Mise à jour...' : 'Actualiser'}
          </Button>
        </div>

        {stockData ? (
          <>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl mb-6 border border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900">Sentiment Marché IA</h3>
              </div>
              <p className="text-lg text-slate-700">{stockData.market_sentiment}</p>
              <p className="text-xs text-slate-500 mt-2">Analyse du {stockData.analysis_date}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {stockData.stocks?.map((stock, idx) => {
                const isPositive = stock.change_percent >= 0;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="p-4 hover:shadow-lg transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="font-mono">
                          {stock.symbol}
                        </Badge>
                        <Badge className={stock.ai_exposure === 'high' ? 'bg-purple-500' : 'bg-blue-500'}>
                          {stock.ai_exposure}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2">{stock.company}</h3>
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-2xl font-bold text-slate-900">
                          ${stock.price.toFixed(2)}
                        </span>
                        <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                          {isPositive ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          <span className="text-sm font-semibold">
                            {isPositive ? '+' : ''}{stock.change_percent.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500">
                        Cap: ${stock.market_cap_billions}B
                      </p>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {stockData.druide_estimated && (
              <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Si Druide Omega était coté...</h3>
                    <p className="text-xs text-slate-600">Estimation basée sur comparables</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Prix Action Estimé</div>
                    <div className="text-3xl font-bold text-purple-600">
                      ${stockData.druide_estimated.estimated_price.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Market Cap Estimé</div>
                    <div className="text-3xl font-bold text-purple-600">
                      ${stockData.druide_estimated.estimated_market_cap_millions}M
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-white rounded-lg">
                  <p className="text-sm text-slate-700">{stockData.druide_estimated.comparison}</p>
                </div>
              </Card>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 mb-4">Aucune donnée boursière chargée</p>
            <Button onClick={() => fetchStocksMutation.mutate()}>
              Charger les Données
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}