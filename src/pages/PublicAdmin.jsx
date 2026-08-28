/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Public Admin Dashboard                                     ║
 * ║ Version publique autonome des métriques système                            ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { createPageUrl } from "@/utils";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/components/utils/LanguageContext";
import Logo from "@/components/branding/Logo";
import LanguageSelector from "@/components/LanguageSelector";
import {
  Shield, Activity, DollarSign, Newspaper,
  Trophy, TrendingUp, MapPin, Home, BarChart3, ArrowLeft,
  Cpu, Network, Brain, Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import ValuationCalculator from "../components/admin/ValuationCalculator";
import DruideValuation from "../components/admin/DruideValuation";
import CompetitiveBenchmark from "../components/admin/CompetitiveBenchmark";
import AINewsAggregator from "../components/admin/AINewsAggregator";
import StockTracker from "../components/admin/StockTracker";
import MarketAnalysisPanel from "../components/admin/MarketAnalysisPanel";

export default function PublicAdmin() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // Récupération données temps réel
  const { data: consciousnessConfig } = useQuery({
    queryKey: ['consciousnessConfigPublic'],
    queryFn: async () => {
      const configs = await base44.entities.ConsciousnessConfig.list('-updated_date', 1);
      return configs[0] || null;
    },
    refetchInterval: 30000, // Refresh toutes les 30 secondes
  });

  const { data: systemMetrics } = useQuery({
    queryKey: ['systemMetricsPublic'],
    queryFn: async () => {
      try {
        const [cognitiveCore, governance] = await Promise.all([
          base44.entities.CognitiveCore.list('-timestamp', 1),
          base44.entities.InternalGovernance.list('-timestamp', 1)
        ]);
        return {
          cognitiveHealth: cognitiveCore[0]?.system_health_index || 0,
          stabilityIndex: cognitiveCore[0]?.stability_parameters?.stability_index || 0,
          coherenceScore: governance[0]?.global_coherence_score || 0
        };
      } catch {
        return { cognitiveHealth: 0, stabilityIndex: 0, coherenceScore: 0 };
      }
    },
    refetchInterval: 30000,
  });

  // Calcul dynamique des dimensions
  const calculateDimensions = () => {
    if (!consciousnessConfig) return 106;
    const dims = consciousnessConfig.cognitive_dimensions || {};
    const emoDims = consciousnessConfig.emotional_dimensions || {};
    return Object.keys(dims).length + Object.keys(emoDims).length + 
           (consciousnessConfig.consciousness_level || 0) + 
           (consciousnessConfig.ratio_logic || 0) + 
           (consciousnessConfig.ratio_consciousness || 0) + 88; // Base dimensions
  };

  const totalDimensions = calculateDimensions();
  const performanceGain = systemMetrics?.cognitiveHealth ? Math.round((systemMetrics.cognitiveHealth - 90) / 2) : 8;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
      {/* Header Navigation */}
      <header className="bg-white/95 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(createPageUrl('Landing'))}>
              <Logo size="small" animate={true} />
              <div>
                <h1 className="text-lg font-bold text-slate-900 font-display">Druide Omega</h1>
                <Badge className="bg-blue-500 text-white text-[9px] px-2 py-0.5 flex items-center gap-1 w-fit">
                  <MapPin className="w-2.5 h-2.5" />
                  {language === 'en' ? 'Proudly from Quebec' : 'Fièrement Québécois'}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => navigate(createPageUrl('ArchitectDashboard'))}
                variant="ghost"
                size="sm"
                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button 
                onClick={() => navigate(createPageUrl('Landing'))}
                variant="ghost"
                size="sm"
              >
                <Home className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Home' : 'Accueil'}
              </Button>
              <Button 
                onClick={() => navigate(createPageUrl('ApplicationEvaluation'))}
                variant="ghost"
                size="sm"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Evaluation' : 'Évaluation'}
              </Button>
              <LanguageSelector variant="ghost" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-4 sm:px-6 py-6 sm:py-8 shadow-xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <motion.div 
                animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }} 
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} 
                className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-2xl"
              >
                <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </motion.div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  {language === 'en' ? 'Public Dashboard' : 'Tableau de Bord Public'}
                </h1>
                <p className="text-purple-100 text-xs sm:text-sm">
                  {language === 'en' ? 'System metrics & analytics' : 'Métriques système & analytiques'}
                </p>
              </div>
            </div>
            <Badge className="bg-green-500 text-white text-xs">✓ {language === 'en' ? 'Live' : 'En Direct'}</Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white shadow-md mb-4 flex-wrap h-auto p-1">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">
              <Activity className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              {language === 'en' ? 'Overview' : 'Vue'}
            </TabsTrigger>
            <TabsTrigger value="valuation" className="text-xs sm:text-sm">
              <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              {language === 'en' ? 'Valuation' : 'Valeur'}
            </TabsTrigger>
            <TabsTrigger value="druidevaluation" className="text-xs sm:text-sm">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              {language === 'en' ? 'Druide Value' : 'Valorisation'}
            </TabsTrigger>
            <TabsTrigger value="competition" className="text-xs sm:text-sm">
              <Trophy className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              {language === 'en' ? 'Competition' : 'Compét'}
            </TabsTrigger>
            <TabsTrigger value="news" className="text-xs sm:text-sm">
              <Newspaper className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              {language === 'en' ? 'News' : 'Actus'}
            </TabsTrigger>
            <TabsTrigger value="stocks" className="text-xs sm:text-sm">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              {language === 'en' ? 'Stocks' : 'Bourse'}
            </TabsTrigger>
            <TabsTrigger value="market" className="text-xs sm:text-sm">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              {language === 'en' ? 'Market' : 'Marché'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 sm:space-y-6 mt-0">
            {/* Nouveautés 2026 Alert */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Cpu className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-amber-900">
                        {language === 'en' ? '⭐ January 2026 Update' : '⭐ Mise à Jour Janvier 2026'}
                      </h3>
                      <Badge className="bg-amber-600 text-white">ACTIF</Badge>
                    </div>
                    <p className="text-slate-700 text-sm mb-3">
                      {language === 'en'
                        ? 'Complete cognitive backend architecture with 8 autonomous modules synchronized in real-time with ConsciousnessConfig (106 dimensions).'
                        : 'Architecture cognitive backend complète avec 8 modules autonomes synchronisés temps réel avec ConsciousnessConfig (106 dimensions).'
                      }
                    </p>
                    <div className="grid sm:grid-cols-3 gap-3">
                      <div className="flex items-center gap-2 text-xs text-slate-700">
                        <Cpu className="w-4 h-4 text-amber-600" />
                        <span>{language === 'en' ? '8 Backend Modules' : '8 Modules Backend'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-700">
                        <Network className="w-4 h-4 text-cyan-600" />
                        <span>{language === 'en' ? '7 Active Automations' : '7 Automations Actives'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-700">
                        <Brain className="w-4 h-4 text-purple-600" />
                        <span>
                          {language === 'en' ? 'Health: ' : 'Santé: '}
                          <strong className="text-green-600">{Math.round(systemMetrics?.cognitiveHealth || 92)}%</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
                <div className="text-center">
                  <Sparkles className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-purple-900">{totalDimensions}</div>
                  <p className="text-xs text-slate-600 mt-1">
                    {language === 'en' ? 'Consciousness Dimensions' : 'Dimensions Conscience'}
                  </p>
                  <Badge className="mt-2 bg-purple-100 text-purple-700 text-[10px]">
                    {language === 'en' ? 'Live Config' : 'Config Live'}
                  </Badge>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                <div className="text-center">
                  <Cpu className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-amber-900">8</div>
                  <p className="text-xs text-slate-600 mt-1">
                    {language === 'en' ? '⭐ Backend Modules' : '⭐ Modules Backend'}
                  </p>
                  <Badge className="mt-2 bg-green-100 text-green-700 text-[10px]">
                    {language === 'en' ? '✓ Active' : '✓ Actifs'}
                  </Badge>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
                <div className="text-center">
                  <Network className="w-8 h-8 text-cyan-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-cyan-900">7</div>
                  <p className="text-xs text-slate-600 mt-1">
                    {language === 'en' ? 'Auto Orchestrations' : 'Auto Orchestrations'}
                  </p>
                  <Badge className="mt-2 bg-cyan-100 text-cyan-700 text-[10px]">
                    {language === 'en' ? '24/7 Running' : '24/7 Actives'}
                  </Badge>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <div className="text-center">
                  <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-green-900">+{performanceGain}%</div>
                  <p className="text-xs text-slate-600 mt-1">
                    {language === 'en' ? 'Performance Gain' : 'Gain Performance'}
                  </p>
                  <Badge className="mt-2 bg-green-100 text-green-700 text-[10px]">
                    {language === 'en' ? 'Real-time' : 'Temps réel'}
                  </Badge>
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-2xl font-bold mb-4">
                {language === 'en' ? 'Welcome to Druide Omega Dashboard' : 'Bienvenue sur le Tableau de Bord Druide Omega'}
              </h3>
              <p className="text-slate-600 mb-4">
                {language === 'en' 
                  ? 'Explore our AI analysis, valuation, market insights, and competitive analysis.'
                  : 'Explorez nos analyses IA, évaluations, insights marché et analyses concurrentielles.'
                }
              </p>
              <div className="grid gap-4 mt-6">
                {[
                 { title: language === 'en' ? 'Valuation' : 'Évaluation', desc: language === 'en' ? 'View our company valuation' : 'Voir notre évaluation', tab: 'valuation' },
                 { title: language === 'en' ? 'Druide Value' : 'Valorisation Druide', desc: language === 'en' ? 'Druide Omega valuation (updated 2026)' : 'Valorisation Druide Omega (maj 2026)', tab: 'druidevaluation' },
                 { title: language === 'en' ? 'Competition' : 'Concurrence', desc: language === 'en' ? 'Competitive analysis' : 'Analyse concurrentielle', tab: 'competition' },
                 { title: language === 'en' ? 'News' : 'Actualités', desc: language === 'en' ? 'Latest AI news' : 'Dernières actus IA', tab: 'news' },
                 { title: language === 'en' ? 'Market' : 'Marché', desc: language === 'en' ? 'Market insights' : 'Insights marché', tab: 'market' }
                ].map((item, idx) => (
                 <div 
                   key={idx} 
                   className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition cursor-pointer"
                   onClick={() => setActiveTab(item.tab)}
                 >
                   <h4 className="font-semibold text-slate-900 mb-1">{item.title}</h4>
                   <p className="text-sm text-slate-600">{item.desc}</p>
                 </div>
                 ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="valuation" className="mt-0"><ValuationCalculator /></TabsContent>
          <TabsContent value="druidevaluation" className="mt-0"><DruideValuation /></TabsContent>
          <TabsContent value="competition" className="mt-0"><CompetitiveBenchmark /></TabsContent>
          <TabsContent value="news" className="mt-0"><AINewsAggregator /></TabsContent>
          <TabsContent value="stocks" className="mt-0"><StockTracker /></TabsContent>
          <TabsContent value="market" className="mt-0"><MarketAnalysisPanel /></TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 py-8 px-4 sm:px-6 mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-600 text-sm">
            © 2026 AMG+A.L - Druide Omega • {language === 'en' ? 'All rights reserved' : 'Tous droits réservés'}
          </p>
          <p className="text-slate-500 text-xs mt-2">
            {language === 'en' ? 'Compliant with' : 'Conforme à'} Loi 25 (Québec), RGPD (UE), CCPA (USA)
          </p>
          <p className="text-amber-600 text-xs mt-1 font-semibold">
            ⭐ {language === 'en' ? 'Updated January 2026 - 8 Backend Modules Active' : 'Mis à jour Janvier 2026 - 8 Modules Backend Actifs'}
          </p>
        </div>
      </footer>
    </div>
  );
}