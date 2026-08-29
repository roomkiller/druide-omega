/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Emotional Journal Page                                     ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, TrendingUp, Calendar, Filter, Search, Smile, Frown, Meh, ArrowLeft } from "lucide-react";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/components/utils/LanguageContext";
import { navigateTo } from "@/lib/spaNavigate";

const EMOTION_COLORS = {
  joie: "from-yellow-500 to-amber-600",
  enthousiasme: "from-orange-500 to-red-600",
  gratitude: "from-pink-500 to-rose-600",
  émerveillement: "from-purple-500 to-indigo-600",
  compassion: "from-blue-500 to-cyan-600",
  espoir: "from-green-500 to-emerald-600",
  tristesse: "from-gray-500 to-slate-600",
  préoccupation: "from-amber-700 to-orange-800",
  empathie_douloureuse: "from-indigo-700 to-purple-900",
  frustration: "from-red-700 to-rose-900",
  déception: "from-slate-600 to-gray-800",
  inquiétude: "from-orange-800 to-red-900",
  sérénité: "from-teal-500 to-cyan-600",
  curiosité: "from-violet-500 to-purple-600",
  perplexité: "from-indigo-600 to-blue-800"
};

const VALENCE_ICONS = {
  positive: { icon: Smile, color: "text-green-500" },
  negative: { icon: Frown, color: "text-red-500" },
  neutral: { icon: Meh, color: "text-gray-500" },
  mixed: { icon: TrendingUp, color: "text-purple-500" }
};

export default function EmotionalJournal() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEmotion, setFilterEmotion] = useState("all");
  const [filterValence, setFilterValence] = useState("all");

  const { data: emotionalResponses = [], isLoading } = useQuery({
    queryKey: ['emotional-responses'],
    queryFn: () => base44.entities.EmotionalResponse.list('-created_date'),
    initialData: []
  });

  const filteredResponses = emotionalResponses.filter(response => {
    const matchesSearch = !searchTerm || 
      response.trigger_content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      response.emotional_expression?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEmotion = filterEmotion === "all" || response.emotional_reaction === filterEmotion;
    const matchesValence = filterValence === "all" || response.valence === filterValence;

    return matchesSearch && matchesEmotion && matchesValence;
  });

  const uniqueEmotions = [...new Set(emotionalResponses.map(r => r.emotional_reaction))];

  const emotionStats = emotionalResponses.reduce((acc, response) => {
    acc[response.emotional_reaction] = (acc[response.emotional_reaction] || 0) + 1;
    return acc;
  }, {});

  const mostFrequent = Object.entries(emotionStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-purple-50">
      <div className="flex-none px-6 py-4 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <Button
          onClick={() => navigateTo('ArchitectDashboard')}
          variant="ghost"
          size="sm"
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour Dashboard
        </Button>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl shadow-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{t('emotional.title')}</h1>
              <p className="text-sm text-slate-500">
                {filteredResponses.length} {t('emotional.responses')}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {mostFrequent.map(([emotion, count]) => (
            <Card key={emotion} className="p-4 bg-gradient-to-br from-white to-purple-50 border-purple-200/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Top Émotion</p>
                  <p className="text-xl font-bold text-slate-900 capitalize">{emotion}</p>
                </div>
                <div className="text-2xl font-bold text-purple-600">{count}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder={t('common.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={filterEmotion} onValueChange={setFilterEmotion}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('emotional.emotion')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes émotions</SelectItem>
              {uniqueEmotions.map(emotion => (
                <SelectItem key={emotion} value={emotion} className="capitalize">
                  {emotion}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterValence} onValueChange={setFilterValence}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder={t('emotional.valence')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes valences</SelectItem>
              <SelectItem value="positive">{t('emotional.positive')}</SelectItem>
              <SelectItem value="negative">{t('emotional.negative')}</SelectItem>
              <SelectItem value="neutral">{t('emotional.neutral')}</SelectItem>
              <SelectItem value="mixed">{t('emotional.mixed')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-12 text-slate-500">{t('common.loading')}</div>
          ) : filteredResponses.length === 0 ? (
            <Card className="p-12 text-center bg-white/50">
              <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Aucune réponse émotionnelle trouvée</p>
            </Card>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {filteredResponses.map((response) => {
                  const ValenceIcon = VALENCE_ICONS[response.valence]?.icon || Meh;
                  const valenceColor = VALENCE_ICONS[response.valence]?.color || "text-gray-500";
                  const emotionGradient = EMOTION_COLORS[response.emotional_reaction] || "from-gray-500 to-slate-600";

                  return (
                    <motion.div
                      key={response.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <Card className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-3 bg-gradient-to-br ${emotionGradient} rounded-xl shadow-lg`}>
                              <Heart className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-lg text-slate-900 capitalize">
                                {response.emotional_reaction}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <ValenceIcon className={`w-4 h-4 ${valenceColor}`} />
                                <span className="capitalize">{response.valence}</span>
                                <span>•</span>
                                <span>Intensité: {response.emotional_intensity}/10</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Calendar className="w-4 h-4" />
                            {new Date(response.timestamp || response.created_date).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="bg-slate-50 rounded-lg p-4">
                            <p className="text-sm font-semibold text-slate-700 mb-1">Déclencheur:</p>
                            <p className="text-slate-600 italic">"{response.trigger_content}"</p>
                          </div>

                          <div className="bg-purple-50 rounded-lg p-4">
                            <p className="text-sm font-semibold text-purple-700 mb-1">Expression émotionnelle:</p>
                            <p className="text-purple-900 font-medium">"{response.emotional_expression}"</p>
                          </div>

                          {response.reasoning && (
                            <div className="bg-indigo-50 rounded-lg p-4">
                              <p className="text-sm font-semibold text-indigo-700 mb-1">Raisonnement:</p>
                              <p className="text-indigo-900 text-sm">{response.reasoning}</p>
                            </div>
                          )}

                          {response.interpretation && (
                            <div className="bg-blue-50 rounded-lg p-4">
                              <p className="text-sm font-semibold text-blue-700 mb-1">Interprétation:</p>
                              <p className="text-blue-900 text-sm">{response.interpretation}</p>
                            </div>
                          )}

                          <div className="flex items-center gap-2 pt-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              response.acceptance_status === 'accepted' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {response.acceptance_status === 'accepted' ? '✓ Accepté' : '✗ Rejeté'}
                            </span>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}