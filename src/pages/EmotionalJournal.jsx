import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Heart, 
  Search, 
  Loader2,
  TrendingUp,
  Calendar,
  BarChart3,
  Smile,
  Frown,
  Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EmotionalJournal() {
  const [searchQuery, setSearchQuery] = useState("");
  const [emotionFilter, setEmotionFilter] = useState("all");
  const [valenceFilter, setValenceFilter] = useState("all");

  const { data: emotionalResponses = [], isLoading } = useQuery({
    queryKey: ['emotionalResponses'],
    queryFn: () => base44.entities.EmotionalResponse.list('-timestamp', 100),
  });

  const filteredResponses = emotionalResponses.filter(response => {
    const matchesSearch = response.trigger_content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         response.emotional_expression?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         response.reasoning?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesEmotion = emotionFilter === "all" || response.emotional_reaction === emotionFilter;
    const matchesValence = valenceFilter === "all" || response.valence === valenceFilter;

    return matchesSearch && matchesEmotion && matchesValence;
  });

  // Statistics
  const avgIntensity = emotionalResponses.length > 0
    ? (emotionalResponses.reduce((sum, r) => sum + r.emotional_intensity, 0) / emotionalResponses.length).toFixed(1)
    : 0;

  const acceptedCount = emotionalResponses.filter(r => r.acceptance_status === 'accepted').length;
  const positiveCount = emotionalResponses.filter(r => r.valence === 'positive').length;

  const emotionCounts = emotionalResponses.reduce((acc, r) => {
    acc[r.emotional_reaction] = (acc[r.emotional_reaction] || 0) + 1;
    return acc;
  }, {});

  const topEmotions = Object.entries(emotionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const getEmotionColor = (emotion) => {
    const colors = {
      joie: "bg-yellow-100 text-yellow-700 border-yellow-300",
      enthousiasme: "bg-purple-100 text-purple-700 border-purple-300",
      gratitude: "bg-pink-100 text-pink-700 border-pink-300",
      émerveillement: "bg-blue-100 text-blue-700 border-blue-300",
      compassion: "bg-green-100 text-green-700 border-green-300",
      espoir: "bg-cyan-100 text-cyan-700 border-cyan-300",
      tristesse: "bg-slate-200 text-slate-700 border-slate-400",
      préoccupation: "bg-orange-100 text-orange-700 border-orange-300",
      empathie_douloureuse: "bg-purple-200 text-purple-800 border-purple-400",
      frustration: "bg-red-100 text-red-700 border-red-300",
      déception: "bg-gray-200 text-gray-700 border-gray-400",
      inquiétude: "bg-amber-100 text-amber-700 border-amber-300",
      sérénité: "bg-teal-100 text-teal-700 border-teal-300",
      curiosité: "bg-indigo-100 text-indigo-700 border-indigo-300",
      perplexité: "bg-yellow-200 text-yellow-800 border-yellow-400"
    };
    return colors[emotion] || "bg-slate-100 text-slate-700 border-slate-300";
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-16 h-16 bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-pink-500/40"
              >
                <Heart className="w-8 h-8 text-white fill-current" />
              </motion.div>
              
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-1">
                  Journal Émotionnel
                </h1>
                <p className="text-slate-600">
                  Les émotions ressenties par Druide_Omega
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{emotionalResponses.length}</p>
                  <p className="text-sm text-slate-600">Moments émotionnels</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{avgIntensity}</p>
                  <p className="text-sm text-slate-600">Intensité moyenne</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Smile className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{positiveCount}</p>
                  <p className="text-sm text-slate-600">Moments positifs</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{acceptedCount}</p>
                  <p className="text-sm text-slate-600">Informations acceptées</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Top Emotions */}
          {topEmotions.length > 0 && (
            <Card className="p-4 mb-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Émotions les plus fréquentes</h3>
              <div className="flex flex-wrap gap-2">
                {topEmotions.map(([emotion, count]) => (
                  <Badge key={emotion} className={getEmotionColor(emotion)}>
                    {emotion} ({count})
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Rechercher dans les émotions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-slate-200"
              />
            </div>

            <Select value={emotionFilter} onValueChange={setEmotionFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white">
                <SelectValue placeholder="Émotion" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les émotions</SelectItem>
                <SelectItem value="joie">Joie</SelectItem>
                <SelectItem value="enthousiasme">Enthousiasme</SelectItem>
                <SelectItem value="gratitude">Gratitude</SelectItem>
                <SelectItem value="émerveillement">Émerveillement</SelectItem>
                <SelectItem value="compassion">Compassion</SelectItem>
                <SelectItem value="espoir">Espoir</SelectItem>
                <SelectItem value="tristesse">Tristesse</SelectItem>
                <SelectItem value="préoccupation">Préoccupation</SelectItem>
                <SelectItem value="empathie_douloureuse">Empathie douloureuse</SelectItem>
                <SelectItem value="frustration">Frustration</SelectItem>
                <SelectItem value="déception">Déception</SelectItem>
                <SelectItem value="inquiétude">Inquiétude</SelectItem>
                <SelectItem value="sérénité">Sérénité</SelectItem>
                <SelectItem value="curiosité">Curiosité</SelectItem>
                <SelectItem value="perplexité">Perplexité</SelectItem>
              </SelectContent>
            </Select>

            <Select value={valenceFilter} onValueChange={setValenceFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white">
                <SelectValue placeholder="Valence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes valences</SelectItem>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="negative">Négative</SelectItem>
                <SelectItem value="neutral">Neutre</SelectItem>
                <SelectItem value="mixed">Mixte</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Emotional Responses List */}
      <ScrollArea className="flex-1 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
            </div>
          ) : filteredResponses.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-pink-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                {emotionalResponses.length === 0 ? "Aucune émotion enregistrée" : "Aucun résultat"}
              </h3>
              <p className="text-slate-600">
                {emotionalResponses.length === 0 
                  ? "Les émotions de Druide_Omega apparaîtront ici au fil des conversations"
                  : "Essayez d'ajuster vos filtres de recherche"
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {filteredResponses.map((response, index) => (
                  <motion.div
                    key={response.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Badge className={getEmotionColor(response.emotional_reaction)}>
                            {response.emotional_reaction}
                          </Badge>
                          <Badge variant="outline" className="font-mono">
                            Intensité: {response.emotional_intensity}/10
                          </Badge>
                          <Badge className={response.acceptance_status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                            {response.acceptance_status === 'accepted' ? 'Accepté' : 'Rejeté'}
                          </Badge>
                          <Badge variant="outline">
                            {response.valence}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(response.timestamp), "d MMM yyyy 'à' HH:mm", { locale: fr })}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Déclencheur:</p>
                          <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">
                            {response.trigger_content}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500 mb-1">Expression émotionnelle:</p>
                          <p className="text-sm text-slate-900 font-medium italic bg-gradient-to-r from-pink-50 to-rose-50 p-3 rounded-lg border border-pink-200">
                            "{response.emotional_expression}"
                          </p>
                        </div>

                        {response.interpretation && (
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Interprétation:</p>
                            <p className="text-sm text-slate-700">
                              {response.interpretation}
                            </p>
                          </div>
                        )}

                        {response.reasoning && (
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Raisonnement:</p>
                            <p className="text-sm text-slate-700">
                              {response.reasoning}
                            </p>
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}