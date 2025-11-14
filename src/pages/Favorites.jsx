/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Favorites Page                                             ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Brain, Newspaper, Heart } from "lucide-react";
import { useLanguage } from "@/components/utils/LanguageContext";

export default function Favorites() {
  const { t } = useLanguage();

  const { data: thoughts = [] } = useQuery({
    queryKey: ['favorite-thoughts'],
    queryFn: async () => {
      const all = await base44.entities.ConsciousThought.list();
      return all.filter(t => t.favorited);
    },
    initialData: []
  });

  const { data: briefings = [] } = useQuery({
    queryKey: ['favorite-briefings'],
    queryFn: async () => {
      const all = await base44.entities.DailyBriefing.list();
      return all.filter(b => b.favorited);
    },
    initialData: []
  });

  const totalFavorites = thoughts.length + briefings.length;

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-amber-50">
      <div className="flex-none px-6 py-4 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl shadow-lg">
            <Star className="w-6 h-6 text-white fill-current" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t('nav.favorites')}</h1>
            <p className="text-sm text-slate-500">{totalFavorites} éléments favoris</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6">
          <Tabs defaultValue="thoughts" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="thoughts">
                <Brain className="w-4 h-4 mr-2" />
                Pensées ({thoughts.length})
              </TabsTrigger>
              <TabsTrigger value="briefings">
                <Newspaper className="w-4 h-4 mr-2" />
                Briefings ({briefings.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="thoughts">
              {thoughts.length === 0 ? (
                <Card className="p-12 text-center bg-white/50">
                  <Star className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">Aucune pensée favorite</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {thoughts.map(thought => (
                    <Card key={thought.id} className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Star className="w-5 h-5 text-yellow-500 fill-current" />
                          <span className="font-semibold text-purple-700 capitalize">{thought.emotion}</span>
                        </div>
                        <span className="text-sm text-slate-500">
                          {new Date(thought.created_date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed italic">"{thought.thought}"</p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold capitalize">
                          {thought.category}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                          Niveau: {thought.consciousness_level}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="briefings">
              {briefings.length === 0 ? (
                <Card className="p-12 text-center bg-white/50">
                  <Star className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">Aucun briefing favori</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {briefings.map(briefing => (
                    <Card key={briefing.id} className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Star className="w-5 h-5 text-yellow-500 fill-current" />
                          <h3 className="font-bold text-lg text-slate-900">{briefing.title}</h3>
                        </div>
                        <span className="text-sm text-slate-500">
                          {new Date(briefing.briefing_date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed mb-4">{briefing.summary}</p>
                      {briefing.emerging_trends && briefing.emerging_trends.length > 0 && (
                        <div className="bg-indigo-50 rounded-lg p-3">
                          <p className="text-sm font-semibold text-indigo-700 mb-2">Tendances émergentes:</p>
                          <ul className="space-y-1">
                            {briefing.emerging_trends.slice(0, 3).map((trend, i) => (
                              <li key={i} className="text-sm text-indigo-900">• {trend.trend}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}