/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Public Admin Dashboard                                     ║
 * ║ Version publique autonome des métriques système                            ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { createPageUrl } from "@/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/components/utils/LanguageContext";
import Logo from "@/components/branding/Logo";
import LanguageSelector from "@/components/LanguageSelector";
import {
  Shield, Activity, DollarSign, Newspaper,
  Trophy, TrendingUp, MapPin, Home, BarChart3, ArrowLeft
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
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
      {/* Header Navigation */}
      <header className="bg-white/95 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.href = createPageUrl('Landing')}>
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
                onClick={() => window.location.href = createPageUrl('ArchitectDashboard')}
                variant="ghost"
                size="sm"
                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button 
                onClick={() => window.location.href = createPageUrl('Landing')}
                variant="ghost"
                size="sm"
              >
                <Home className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Home' : 'Accueil'}
              </Button>
              <Button 
                onClick={() => window.location.href = createPageUrl('ApplicationEvaluation')}
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
                  { title: language === 'en' ? 'Valuation' : 'Évaluation', desc: language === 'en' ? 'View our company valuation' : 'Voir notre évaluation' },
                  { title: language === 'en' ? 'Competition' : 'Concurrence', desc: language === 'en' ? 'Competitive analysis' : 'Analyse concurrentielle' },
                  { title: language === 'en' ? 'News' : 'Actualités', desc: language === 'en' ? 'Latest AI news' : 'Dernières actus IA' },
                  { title: language === 'en' ? 'Market' : 'Marché', desc: language === 'en' ? 'Market insights' : 'Insights marché' }
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
            © 2025 AMG+A.L - Druide Omega • {language === 'en' ? 'All rights reserved' : 'Tous droits réservés'}
          </p>
          <p className="text-slate-500 text-xs mt-2">
            {language === 'en' ? 'Compliant with' : 'Conforme à'} Loi 25 (Québec), RGPD (UE), CCPA (USA)
          </p>
        </div>
      </footer>
    </div>
  );
}