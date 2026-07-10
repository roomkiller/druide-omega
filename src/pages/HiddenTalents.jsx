/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Hidden Talents & Capabilities                              ║
 * ║ Talents et capacités du système — vue par catégories                      ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { createPageUrl } from "@/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/utils/LanguageContext";
import { TALENTS, TALENT_CATEGORIES } from "@/components/talents/talentsData";
import { Brain, Sparkles, Layers, CheckCircle2, ArrowLeft, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function HiddenTalents() {
  const { language } = useLanguage();
  const en = language === 'en';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white page-padding py-12">
        <div className="max-w-7xl mx-auto">
          <Button
            onClick={() => window.location.href = createPageUrl('ArchitectDashboard')}
            variant="ghost"
            size="sm"
            className="mb-4 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {en ? 'Back to Dashboard' : 'Retour Dashboard'}
          </Button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-4 mb-4">
              <Sparkles className="w-12 h-12" />
              <h1 className="text-4xl font-bold font-display">
                {en ? 'Hidden Talents' : 'Talents Cachés'}
              </h1>
            </div>
            <p className="text-purple-100 text-lg max-w-3xl">
              {en
                ? 'The full spectrum of Druide Omega\'s deep capabilities — all active, organized by domain'
                : 'Le spectre complet des capacités profondes de Druide Omega — toutes actives, organisées par domaine'}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto page-padding -mt-8 mb-8">
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-green-700 mb-1">
                    {en ? 'Active Capabilities' : 'Capacités Actives'}
                  </div>
                  <div className="text-3xl font-bold text-green-700">{TALENTS.length}</div>
                </div>
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-indigo-700 mb-1">
                    {en ? 'Domains' : 'Domaines'}
                  </div>
                  <div className="text-3xl font-bold text-indigo-700">{TALENT_CATEGORIES.length}</div>
                </div>
                <Layers className="w-10 h-10 text-indigo-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-purple-700 mb-1">
                    {en ? 'In Evolution' : 'En Évolution'}
                  </div>
                  <div className="text-3xl font-bold text-purple-700">∞</div>
                </div>
                <Brain className="w-10 h-10 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Talents by category */}
      <div className="max-w-7xl mx-auto page-padding pb-12">
        <div className="mb-8">
          <Button
            onClick={() => window.location.href = createPageUrl('Chat_2')}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            size="lg"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            {en ? 'Explore in Deep Chat' : 'Explorer en Chat Profond'}
          </Button>
        </div>

        <div className="space-y-10">
          {TALENT_CATEGORIES.map((cat) => {
            const catTalents = TALENTS.filter(t => t.category === cat.id);
            return (
              <div key={cat.id}>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-2xl font-bold text-slate-900 font-display">
                    {en ? cat.en : cat.fr}
                  </h2>
                  <Badge variant="outline" className="text-purple-700 border-purple-300">
                    {catTalents.length}
                  </Badge>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {catTalents.map((talent, idx) => {
                    const Icon = talent.icon;
                    return (
                      <motion.div
                        key={talent.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <Card className="h-full border-2 border-purple-100 hover:border-purple-300 hover:shadow-xl transition-all">
                          <CardHeader>
                            <div className="flex items-start justify-between mb-3">
                              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${talent.color} flex items-center justify-center`}>
                                <Icon className="w-6 h-6 text-white" />
                              </div>
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            </div>
                            <CardTitle className="text-lg">
                              {en ? talent.titleEn : talent.titleFr}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-slate-600 mb-4">
                              {en ? talent.descEn : talent.descFr}
                            </p>
                            <Badge className={`bg-gradient-to-r ${talent.color} text-white`}>
                              {talent.level}
                            </Badge>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}