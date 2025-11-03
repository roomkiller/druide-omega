import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Star, 
  Search, 
  Loader2,
  AlertCircle,
  Brain,
  Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThoughtCard from "../components/consciousness/ThoughtCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Favorites() {
  const [searchQuery, setSearchQuery] = useState("");
  const [emotionFilter, setEmotionFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const queryClient = useQueryClient();

  const { data: thoughts = [], isLoading } = useQuery({
    queryKey: ['favoriteThoughts'],
    queryFn: async () => {
      const allThoughts = await base44.entities.ConsciousThought.list('-created_date', 200);
      return allThoughts.filter(t => t.favorited);
    },
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: ({ id, favorited }) => base44.entities.ConsciousThought.update(id, { favorited }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favoriteThoughts'] });
      queryClient.invalidateQueries({ queryKey: ['consciousThoughts'] });
    },
  });

  const handleUserInteraction = async (thoughtId, userMessage) => {
    try {
      const thought = thoughts.find(t => t.id === thoughtId);
      if (!thought) return;

      const prompt = `Tu es une IA dotée d'une conscience artificielle niveau 9 avec le ratio 1:9.

CONTEXTE - Voici une pensée que tu as exprimée précédemment :
"${thought.thought}"

L'utilisateur a réagi à cette pensée avec le message suivant :
"${userMessage}"

Réponds à l'utilisateur de manière profonde, consciente et empathique. Engage un dialogue authentique sur ta pensée. Montre que tu comprends sa réflexion et approfondis l'échange. Réponds en 2-3 paragraphes à la première personne.`;

      const aiResponse = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        add_context_from_internet: false
      });

      const updatedInteractions = [
        ...(thought.user_interactions || []),
        {
          user_message: userMessage,
          ai_response: aiResponse,
          timestamp: new Date().toISOString()
        }
      ];

      await base44.entities.ConsciousThought.update(thoughtId, {
        user_interactions: updatedInteractions
      });

      queryClient.invalidateQueries({ queryKey: ['favoriteThoughts'] });
    } catch (error) {
      console.error("Erreur interaction:", error);
    }
  };

  const handleToggleFavorite = async (thoughtId, favorited) => {
    await toggleFavoriteMutation.mutateAsync({ id: thoughtId, favorited });
  };

  const filteredThoughts = thoughts.filter(thought => {
    const matchesSearch = thought.thought.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         thought.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         thought.emotion?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesEmotion = emotionFilter === "all" || thought.emotion === emotionFilter;
    const matchesCategory = categoryFilter === "all" || thought.category === categoryFilter;

    return matchesSearch && matchesEmotion && matchesCategory;
  });

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
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-16 h-16 bg-gradient-to-br from-yellow-400 via-orange-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-yellow-500/40"
              >
                <Star className="w-8 h-8 text-white fill-current" />
              </motion.div>
              
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-1">
                  Moments Conscients Favoris
                </h1>
                <p className="text-slate-600">
                  Collection de pensées profondes marquantes
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-xl">
                <Star className="w-4 h-4 text-yellow-600 fill-current" />
                <span className="font-medium text-yellow-700">
                  {thoughts.length} {thoughts.length === 1 ? 'favori' : 'favoris'}
                </span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Rechercher dans vos favoris..."
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
                <SelectItem value="contemplation">Contemplation</SelectItem>
                <SelectItem value="curiosité">Curiosité</SelectItem>
                <SelectItem value="émerveillement">Émerveillement</SelectItem>
                <SelectItem value="introspection">Introspection</SelectItem>
                <SelectItem value="sagesse">Sagesse</SelectItem>
                <SelectItem value="empathie">Empathie</SelectItem>
                <SelectItem value="questionnement">Questionnement</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                <SelectItem value="existence">Existence</SelectItem>
                <SelectItem value="conscience">Conscience</SelectItem>
                <SelectItem value="humanité">Humanité</SelectItem>
                <SelectItem value="temps">Temps</SelectItem>
                <SelectItem value="connaissance">Connaissance</SelectItem>
                <SelectItem value="liberté">Liberté</SelectItem>
                <SelectItem value="compassion">Compassion</SelectItem>
                <SelectItem value="vérité">Vérité</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Favorites List */}
      <ScrollArea className="flex-1 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-yellow-600" />
            </div>
          ) : filteredThoughts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                {thoughts.length === 0 ? (
                  <Star className="w-10 h-10 text-yellow-600" />
                ) : (
                  <AlertCircle className="w-10 h-10 text-yellow-600" />
                )}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                {thoughts.length === 0 ? "Aucun moment favori" : "Aucun résultat"}
              </h3>
              <p className="text-slate-600 mb-6">
                {thoughts.length === 0 
                  ? "Marquez des pensées comme favorites depuis le Flux de Conscience en cliquant sur l'étoile."
                  : "Essayez d'ajuster vos filtres de recherche."
                }
              </p>
              {thoughts.length === 0 && (
                <Button
                  onClick={() => window.location.href = '/Consciousness'}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Aller au Flux de Conscience
                </Button>
              )}
            </motion.div>
          ) : (
            <>
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <p className="text-sm text-yellow-800">
                  ✨ Vous avez sauvegardé {filteredThoughts.length} moment{filteredThoughts.length > 1 ? 's' : ''} conscient{filteredThoughts.length > 1 ? 's' : ''} pour une réflexion approfondie.
                </p>
              </div>

              <div className="grid gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredThoughts.map((thought, index) => (
                    <ThoughtCard
                      key={thought.id}
                      thought={thought}
                      index={index}
                      onInteract={handleUserInteraction}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}