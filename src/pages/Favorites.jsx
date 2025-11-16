/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Favorites Page                                             ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star, MessageSquare, Database, BookOpen, Brain, Image, Trash2, Search } from "lucide-react";
import { motion } from "framer-motion";
import { createPageUrl } from "@/utils";

export default function Favorites() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => base44.entities.Favorite.list('-created_date')
  });

  const deleteFavoriteMutation = useMutation({
    mutationFn: (id) => base44.entities.Favorite.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    }
  });

  const filtered = favorites.filter(fav => {
    const matchesSearch = fav.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          fav.preview?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || fav.item_type === filterType;
    return matchesSearch && matchesType;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'conversation': return <MessageSquare className="w-5 h-5" />;
      case 'memory': return <Database className="w-5 h-5" />;
      case 'knowledge': return <BookOpen className="w-5 h-5" />;
      case 'thought': return <Brain className="w-5 h-5" />;
      case 'visual': return <Image className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'conversation': return 'from-purple-500 to-indigo-600';
      case 'memory': return 'from-indigo-500 to-blue-600';
      case 'knowledge': return 'from-blue-500 to-cyan-600';
      case 'thought': return 'from-purple-500 to-pink-600';
      case 'visual': return 'from-pink-500 to-rose-600';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  const navigate = (fav) => {
    const routes = {
      conversation: `Chat?id=${fav.item_id}`,
      memory: 'Memory',
      knowledge: 'Knowledge',
      thought: 'Consciousness',
      visual: 'VisualGallery'
    };
    window.location.href = createPageUrl(routes[fav.item_type] || 'Home');
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 px-6 py-8 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
              <Star className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Favoris</h1>
              <p className="text-yellow-100">Vos éléments préférés sauvegardés</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Rechercher dans les favoris..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/90 backdrop-blur-sm"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/90 backdrop-blur-sm border border-slate-200"
            >
              <option value="all">Tous types</option>
              <option value="conversation">Conversations</option>
              <option value="memory">Mémoires</option>
              <option value="knowledge">Connaissances</option>
              <option value="thought">Pensées</option>
              <option value="visual">Visuels</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <Star className="w-20 h-20 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Aucun favori</h3>
              <p className="text-slate-600">Ajoutez des éléments en favoris pour les retrouver ici</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((fav, idx) => (
                <motion.div
                  key={fav.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(fav)}>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${getColor(fav.item_type)} rounded-xl flex items-center justify-center`}>
                        {getIcon(fav.item_type)}
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteFavoriteMutation.mutate(fav.id);
                        }}
                        className="h-8 w-8"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>

                    <h3 className="font-bold text-slate-900 mb-2 line-clamp-2">{fav.title}</h3>
                    <p className="text-sm text-slate-600 mb-3 line-clamp-3">{fav.preview}</p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline">{fav.item_type}</Badge>
                      {fav.tags?.map(tag => (
                        <Badge key={tag} className="bg-purple-100 text-purple-700">{tag}</Badge>
                      ))}
                    </div>

                    {fav.notes && (
                      <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="text-xs text-yellow-900">{fav.notes}</p>
                      </div>
                    )}

                    <p className="text-xs text-slate-400 mt-3">
                      Ajouté le {new Date(fav.created_date).toLocaleDateString()}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}