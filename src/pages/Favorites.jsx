import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Brain, Newspaper, Filter } from "lucide-react";
import { motion } from "framer-motion";
import ThoughtCard from "../components/consciousness/ThoughtCard";

export default function Favorites() {
  const [filter, setFilter] = useState("all");
  
  const queryClient = useQueryClient();

  const { data: favoriteThoughts = [], isLoading: loadingThoughts } = useQuery({
    queryKey: ['favoriteThoughts'],
    queryFn: async () => {
      const allThoughts = await base44.entities.ConsciousThought.list('-created_date');
      return allThoughts.filter(t => t.favorited);
    },
  });

  const { data: favoriteBriefings = [], isLoading: loadingBriefings } = useQuery({
    queryKey: ['favoriteBriefings'],
    queryFn: async () => {
      const allBriefings = await base44.entities.DailyBriefing.list('-created_date');
      return allBriefings.filter(b => b.favorited);
    },
  });

  const handleToggleFavorite = async (id, currentFavorited) => {
    await base44.entities.ConsciousThought.update(id, { favorited: !currentFavorited });
    queryClient.invalidateQueries({ queryKey: ['favoriteThoughts'] });
  };

  const isLoading = loadingThoughts || loadingBriefings;
  const totalFavorites = favoriteThoughts.length + favoriteBriefings.length;

  const filteredContent = filter === "all" 
    ? [...favoriteThoughts, ...favoriteBriefings]
    : filter === "thoughts" 
    ? favoriteThoughts 
    : favoriteBriefings;

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-yellow-50/30 to-amber-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-6 flex-shrink-0">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="w-16 h-16 bg-gradient-to-br from-yellow-500 via-amber-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-yellow-500/40"
              >
                <Star className="w-8 h-8 text-white fill-current" />
              </motion.div>
              
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Moments Favoris</h1>
                <p className="text-slate-600">Pensées et briefings marqués comme favoris</p>
              </div>
            </div>

            <Badge variant="outline" className="text-lg px-4 py-2 bg-white">
              <Star className="w-4 h-4 mr-2 fill-current" />
              {totalFavorites} favori{totalFavorites !== 1 ? 's' : ''}
            </Badge>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-slate-200/60 px-6 py-4 flex-shrink-0">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-slate-500" />
            
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
              className={filter === "all" ? "" : "border-slate-300"}
            >
              Tout ({totalFavorites})
            </Button>
            
            <Button
              variant={filter === "thoughts" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("thoughts")}
              className={filter === "thoughts" ? "" : "border-slate-300"}
            >
              <Brain className="w-4 h-4 mr-1" />
              Pensées ({favoriteThoughts.length})
            </Button>

            <Button
              variant={filter === "briefings" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("briefings")}
              className={filter === "briefings" ? "" : "border-slate-300"}
            >
              <Newspaper className="w-4 h-4 mr-1" />
              Briefings ({favoriteBriefings.length})
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {isLoading ? (
            <div className="text-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block"
              >
                <Star className="w-12 h-12 text-yellow-600 fill-current" />
              </motion.div>
              <p className="text-slate-600 mt-4">Chargement des favoris...</p>
            </div>
          ) : filteredContent.length === 0 ? (
            <div className="text-center py-12">
              <Star className="w-16 h-16 text-slate-300 mx-auto mb-4 fill-current" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Aucun favori
              </h3>
              <p className="text-slate-600">
                {filter === "all" 
                  ? "Marquez des pensées ou briefings comme favoris pour les retrouver ici"
                  : filter === "thoughts"
                  ? "Aucune pensée favorite pour le moment"
                  : "Aucun briefing favori pour le moment"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filter === "all" || filter === "thoughts" ? (
                favoriteThoughts.map((thought, index) => (
                  <motion.div
                    key={`thought-${thought.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ThoughtCard
                      thought={thought}
                      onToggleFavorite={handleToggleFavorite}
                      onUpdate={() => queryClient.invalidateQueries({ queryKey: ['favoriteThoughts'] })}
                    />
                  </motion.div>
                ))
              ) : null}

              {(filter === "all" || filter === "briefings") && favoriteBriefings.length > 0 ? (
                <div className="col-span-full">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Newspaper className="w-5 h-5" />
                    Briefings Favoris
                  </h3>
                  <p className="text-slate-600 text-sm">
                    Les briefings favoris sont accessibles dans la page "Briefings Intelligents"
                  </p>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}