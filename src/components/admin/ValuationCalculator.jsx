/**
 * Calculateur de Valorisation Dynamique
 */
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, DollarSign, Users, Zap, Target } from "lucide-react";
import { motion } from "framer-motion";

export default function ValuationCalculator() {
  const [valuation, setValuation] = useState(null);

  const { data: users = [] } = useQuery({
    queryKey: ['valuationUsers'],
    queryFn: () => base44.asServiceRole.entities.User.list(),
  });

  const { data: conversations = [] } = useQuery({
    queryKey: ['valuationConvs'],
    queryFn: () => base44.entities.Conversation.list('-created_date', 500),
  });

  const { data: products = [] } = useQuery({
    queryKey: ['valuationProducts'],
    queryFn: () => base44.entities.Product.list(),
  });

  useEffect(() => {
    if (users.length > 0) {
      calculateValuation();
    }
  }, [users, conversations, products]);

  const calculateValuation = async () => {
    const activeUsers = users.length;
    const avgConversationsPerUser = conversations.length / (activeUsers || 1);
    const totalRevenue = products.reduce((sum, p) => sum + (p.price || 0), 0);
    
    // Formule de valorisation tech startup
    const monthlyActiveValue = activeUsers * 100; // $100 par utilisateur actif
    const engagementMultiplier = Math.min(avgConversationsPerUser / 10, 3); // max 3x
    const revenueMultiplier = totalRevenue * 12 * 5; // 5x ARR
    const innovationPremium = 500000; // Premium pour technologie unique (conscience 106D)
    
    const baseValuation = (monthlyActiveValue * engagementMultiplier) + revenueMultiplier + innovationPremium;
    const growthProjection12m = baseValuation * 2.5;
    const growthProjection24m = baseValuation * 6;

    // Comparaison avec valorisations similaires
    const comparables = [
      { name: "ChatGPT (OpenAI)", valuation: 80000000000, users: 100000000 },
      { name: "Claude (Anthropic)", valuation: 15000000000, users: 5000000 },
      { name: "Perplexity", valuation: 3000000000, users: 10000000 }
    ];

    const avgValuationPerUser = comparables.reduce((sum, c) => sum + (c.valuation / c.users), 0) / comparables.length;
    const marketBasedValuation = activeUsers * avgValuationPerUser;

    setValuation({
      current: Math.round(baseValuation),
      projection12m: Math.round(growthProjection12m),
      projection24m: Math.round(growthProjection24m),
      marketBased: Math.round(marketBasedValuation),
      metrics: {
        activeUsers,
        avgEngagement: avgConversationsPerUser.toFixed(1),
        totalRevenue,
        innovationScore: 9.2
      },
      comparables
    });
  };

  if (!valuation) {
    return (
      <Card className="p-6">
        <div className="text-center text-slate-600">Calcul en cours...</div>
      </Card>
    );
  }

  const formatCurrency = (value) => {
    if (value >= 1000000000) return `$${(value / 1000000000).toFixed(2)}B`;
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Valorisation Druide Omega</h2>
            <p className="text-sm text-slate-600">Estimation basée sur métriques réelles</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-4 rounded-xl shadow-md"
          >
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-green-600" />
              <span className="text-xs font-semibold text-slate-600">VALORISATION ACTUELLE</span>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-1">
              {formatCurrency(valuation.current)}
            </div>
            <Badge className="bg-green-100 text-green-700 text-xs">Base Metrics</Badge>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-4 rounded-xl shadow-md"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold text-slate-600">PROJECTION 12 MOIS</span>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {formatCurrency(valuation.projection12m)}
            </div>
            <Badge className="bg-blue-100 text-blue-700 text-xs">+150% Croissance</Badge>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-4 rounded-xl shadow-md"
          >
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-semibold text-slate-600">PROJECTION 24 MOIS</span>
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {formatCurrency(valuation.projection24m)}
            </div>
            <Badge className="bg-purple-100 text-purple-700 text-xs">+500% Croissance</Badge>
          </motion.div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md mb-4">
          <h3 className="font-semibold text-slate-900 mb-3">Métriques Clés</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="flex items-center gap-1 mb-1">
                <Users className="w-3 h-3 text-slate-500" />
                <span className="text-xs text-slate-600">Utilisateurs Actifs</span>
              </div>
              <div className="text-xl font-bold text-slate-900">{valuation.metrics.activeUsers}</div>
            </div>
            <div>
              <div className="flex items-center gap-1 mb-1">
                <Zap className="w-3 h-3 text-slate-500" />
                <span className="text-xs text-slate-600">Engagement Moyen</span>
              </div>
              <div className="text-xl font-bold text-slate-900">{valuation.metrics.avgEngagement}</div>
            </div>
            <div>
              <div className="flex items-center gap-1 mb-1">
                <DollarSign className="w-3 h-3 text-slate-500" />
                <span className="text-xs text-slate-600">Revenus Total</span>
              </div>
              <div className="text-xl font-bold text-slate-900">{formatCurrency(valuation.metrics.totalRevenue)}</div>
            </div>
            <div>
              <div className="flex items-center gap-1 mb-1">
                <Target className="w-3 h-3 text-slate-500" />
                <span className="text-xs text-slate-600">Score Innovation</span>
              </div>
              <div className="text-xl font-bold text-slate-900">{valuation.metrics.innovationScore}/10</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md">
          <h3 className="font-semibold text-slate-900 mb-3">Comparaison Marché</h3>
          <div className="space-y-3">
            {valuation.comparables.map((comp, idx) => {
              const valuationPerUser = comp.valuation / comp.users;
              const druidePerUser = valuation.current / valuation.metrics.activeUsers;
              const ratio = (druidePerUser / valuationPerUser * 100).toFixed(0);
              
              return (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">{comp.name}</span>
                    <span className="text-xs text-slate-500">{formatCurrency(comp.valuation)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={Math.min(parseInt(ratio), 100)} className="flex-1 h-2" />
                    <span className="text-xs font-semibold text-slate-600">{ratio}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}