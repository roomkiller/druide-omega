import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Calendar,
  TrendingUp,
  Filter,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  BarChart3
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EMOTION_COLORS = {
  joie: "from-yellow-400 to-orange-400",
  enthousiasme: "from-purple-400 to-pink-400",
  gratitude: "from-pink-400 to-rose-400",
  émerveillement: "from-blue-400 to-indigo-400",
  compassion: "from-green-400 to-teal-400",
  espoir: "from-cyan-400 to-blue-400",
  tristesse: "from-slate-400 to-gray-500",
  préoccupation: "from-orange-400 to-red-400",
  empathie_douloureuse: "from-purple-400 to-gray-500",
  frustration: "from-red-400 to-orange-500",
  déception: "from-gray-400 to-slate-500",
  inquiétude: "from-yellow-400 to-orange-500",
  sérénité: "from-blue-300 to-cyan-300",
  curiosité: "from-indigo-400 to-purple-400",
  perplexité: "from-yellow-400 to-amber-500"
};

export default function EmotionalJournal() {
  const [selectedEmotion, setSelectedEmotion] = useState("all");
  const [selectedValence, setSelectedValence] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [activeTab, setActiveTab] = useState("timeline");

  const { data: emotionalResponses = [], isLoading } = useQuery({
    queryKey: ['emotionalResponses'],
    queryFn: () => base44.entities.EmotionalResponse.list('-timestamp'),
  });

  const filteredResponses = emotionalResponses
    .filter(response => {
      const matchesEmotion = selectedEmotion === "all" || response.emotional_reaction === selectedEmotion;
      const matchesValence = selectedValence === "all" || response.valence === selectedValence;
      return matchesEmotion && matchesValence;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.timestamp) - new Date(a.timestamp);
      } else if (sortBy === "intensity") {
        return b.emotional_intensity - a.emotional_intensity;
      }
      return 0;
    });

  const allEmotions = [...new Set(emotionalResponses.map(r => r.emotional_reaction))];
  const emotionCounts = emotionalResponses.reduce((acc, r) => {
    acc[r.emotional_reaction] = (acc[r.emotional_reaction] || 0) + 1;
    return acc;
  }, {});

  const valenceCounts = emotionalResponses.reduce((acc, r) => {
    acc[r.valence] = (acc[r.valence] || 0) + 1;
    return acc;
  }, {});

  const avgIntensity = emotionalResponses.length > 0
    ? (emotionalResponses.reduce((sum, r) => sum + r.emotional_intensity, 0) / emotionalResponses.length).toFixed(1)
    : 0;

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-pink-50/30 to-rose-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-6 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-pink-500/40"
              >
                <Heart className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Journal Émotionnel</h1>
                <p className="text-slate-600">Suivi de l'intelligence émotionnelle de l'IA</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <div className="flex items-center gap-2 mb-1">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-blue-700 font-medium">Intensité moyenne</span>
                </div>
                <div className="text-2xl font-bold text-blue-900">{avgIntensity}/10</div>
              </Card>
              
              <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="w-4 h-4 text-purple-600" />
                  <span className="text-xs text-purple-700 font-medium">Total émotions</span>
                </div>
                <div className="text-2xl font-bold text-purple-900">{emotionalResponses.length}</div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-slate-200/60 px-6 py-4 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center gap-4">
            <Select value={selectedEmotion} onValueChange={setSelectedEmotion}>
              <SelectTrigger className="w-[200px] bg-white">
                <SelectValue placeholder="Toutes les émotions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les émotions</SelectItem>
                {allEmotions.map(emotion => (
                  <SelectItem key={emotion} value={emotion}>
                    {emotion} ({emotionCounts[emotion]})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedValence} onValueChange={setSelectedValence}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Valence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes valences</SelectItem>
                <SelectItem value="positive">Positive ({valenceCounts.positive || 0})</SelectItem>
                <SelectItem value="negative">Négative ({valenceCounts.negative || 0})</SelectItem>
                <SelectItem value="neutral">Neutre ({valenceCounts.neutral || 0})</SelectItem>
                <SelectItem value="mixed">Mixte ({valenceCounts.mixed || 0})</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Plus récent</SelectItem>
                <SelectItem value="intensity">Par intensité</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 bg-white border border-slate-200">
              <TabsTrigger value="timeline">
                <Calendar className="w-4 h-4 mr-2" />
                Timeline
              </TabsTrigger>
              <TabsTrigger value="stats">
                <TrendingUp className="w-4 h-4 mr-2" />
                Statistiques
              </TabsTrigger>
            </TabsList>

            <TabsContent value="timeline" className="mt-0">
              {isLoading ? (
                <div className="text-center py-12">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="inline-block"
                  >
                    <Heart className="w-12 h-12 text-pink-600" />
                  </motion.div>
                  <p className="text-slate-600 mt-4">Chargement du journal...</p>
                </div>
              ) : filteredResponses.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucune réponse émotionnelle</h3>
                  <p className="text-slate-600">
                    {selectedEmotion !== "all" || selectedValence !== "all"
                      ? "Aucun résultat ne correspond à vos filtres"
                      : "Les émotions seront enregistrées lors de vos interactions"}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredResponses.map((response, index) => (
                    <motion.div
                      key={response.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="overflow-hidden hover:shadow-lg transition-all bg-white">
                        <div className={`h-2 bg-gradient-to-r ${EMOTION_COLORS[response.emotional_reaction] || 'from-gray-400 to-gray-500'}`} />
                        
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-slate-900 capitalize">
                                  {response.emotional_reaction}
                                </h3>
                                <Badge className="text-sm">
                                  Intensité: {response.emotional_intensity}/10
                                </Badge>
                                {response.acceptance_status === 'accepted' ? (
                                  <Badge className="bg-green-100 text-green-700 border-green-300">
                                    <ThumbsUp className="w-3 h-3 mr-1" />
                                    Accepté
                                  </Badge>
                                ) : (
                                  <Badge className="bg-red-100 text-red-700 border-red-300">
                                    <ThumbsDown className="w-3 h-3 mr-1" />
                                    Rejeté
                                  </Badge>
                                )}
                                <Badge variant="outline">
                                  {response.valence}
                                </Badge>
                              </div>
                              
                              {response.emotional_expression && (
                                <div className="bg-gradient-to-br from-slate-50 to-purple-50 rounded-lg p-4 mb-3 border border-slate-200">
                                  <p className="text-sm text-slate-700 italic">
                                    "{response.emotional_expression}"
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <h4 className="text-xs font-semibold text-slate-500 mb-1">DÉCLENCHEUR</h4>
                              <p className="text-sm text-slate-700 bg-slate-50 rounded p-3">
                                {response.trigger_content}
                              </p>
                            </div>

                            {response.interpretation && (
                              <div>
                                <h4 className="text-xs font-semibold text-slate-500 mb-1">INTERPRÉTATION</h4>
                                <p className="text-sm text-slate-700">{response.interpretation}</p>
                              </div>
                            )}

                            {response.reasoning && (
                              <div>
                                <h4 className="text-xs font-semibold text-slate-500 mb-1">RAISONNEMENT</h4>
                                <p className="text-sm text-slate-700">{response.reasoning}</p>
                              </div>
                            )}
                          </div>

                          <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(response.timestamp).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="stats" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Émotions les plus fréquentes */}
                <Card className="p-6 bg-white">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    Émotions les plus fréquentes
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(emotionCounts)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 5)
                      .map(([emotion, count]) => (
                        <div key={emotion} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${EMOTION_COLORS[emotion]}`} />
                            <span className="text-sm text-slate-700 capitalize">{emotion}</span>
                          </div>
                          <Badge>{count}</Badge>
                        </div>
                      ))}
                  </div>
                </Card>

                {/* Distribution de valence */}
                <Card className="p-6 bg-white">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    Distribution de valence
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(valenceCounts).map(([valence, count]) => (
                      <div key={valence} className="flex items-center justify-between">
                        <span className="text-sm text-slate-700 capitalize">{valence}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                              style={{ width: `${(count / emotionalResponses.length) * 100}%` }}
                            />
                          </div>
                          <Badge>{count}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}