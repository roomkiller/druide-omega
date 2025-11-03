/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Memory System                                              ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ INNOVATION PROTÉGÉE: Mémoire Cross-Modale Persistante                     ║
 * ║ Fingerprint: AMG:AL:2025:DO:NBC:8F7E:4C9A:3B2F:1E6D:5C4B                 ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Database, Search, Tag, Calendar, TrendingUp, Grid, List, Link2 } from "lucide-react";
import { motion } from "framer-motion";
import MemoryCard from "../components/memory/MemoryCard";
import MemoryStats from "../components/memory/MemoryStats";

const MODALITY_COLORS = {
  chat: "bg-purple-100 text-purple-700 border-purple-300",
  voice: "bg-green-100 text-green-700 border-green-300",
  visual: "bg-pink-100 text-pink-700 border-pink-300",
  system: "bg-blue-100 text-blue-700 border-blue-300"
};

export default function Memory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedModality, setSelectedModality] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [activeTab, setActiveTab] = useState("all");
  
  const queryClient = useQueryClient();

  const { data: memories = [], isLoading } = useQuery({
    queryKey: ['memories'],
    queryFn: () => base44.entities.Memory.list('-importance'),
  });

  const allTags = [...new Set(memories.flatMap(m => m.tags || []))];
  const modalityCounts = memories.reduce((acc, m) => {
    acc[m.modality] = (acc[m.modality] || 0) + 1;
    return acc;
  }, {});

  const filteredMemories = memories.filter(memory => {
    const matchesSearch = !searchTerm || 
      memory.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      memory.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTag = !selectedTag || memory.tags?.includes(selectedTag);
    const matchesModality = !selectedModality || memory.modality === selectedModality;
    
    let matchesTab = true;
    if (activeTab === "important") {
      matchesTab = memory.importance >= 7;
    } else if (activeTab === "recent") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesTab = new Date(memory.created_date) > weekAgo;
    } else if (activeTab === "crossmodal") {
      matchesTab = memory.cross_modal_references?.length > 0 || memory.linked_memory_ids?.length > 0;
    }
    
    return matchesSearch && matchesTag && matchesModality && matchesTab;
  });

  const importantMemories = memories.filter(m => m.importance >= 7);
  const recentMemories = memories.filter(m => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(m.created_date) > weekAgo;
  });
  const crossModalMemories = memories.filter(m => 
    m.cross_modal_references?.length > 0 || m.linked_memory_ids?.length > 0
  );

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-6 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/40"
              >
                <Database className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Système de Mémoire</h1>
                <p className="text-slate-600">Mémoire cross-modale avec apprentissage continu</p>
              </div>
            </div>
            
            <MemoryStats memories={memories} />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-slate-200/60 px-6 py-4 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Rechercher dans les mémoires..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white"
              />
            </div>

            {/* Modality Filter */}
            <div className="flex gap-2 flex-wrap">
              {Object.keys(modalityCounts).map((modality) => (
                <Button
                  key={modality}
                  variant={selectedModality === modality ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedModality(selectedModality === modality ? null : modality)}
                  className={selectedModality === modality ? "" : "border-slate-300"}
                >
                  {modality} ({modalityCounts[modality]})
                </Button>
              ))}
            </div>

            {/* View Mode */}
            <div className="flex gap-1 border border-slate-200 rounded-lg p-1 bg-white">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="px-3"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="px-3"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Tags Filter */}
          {allTags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Tag className="w-3 h-3" />
                Tags:
              </span>
              {allTags.slice(0, 10).map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${selectedTag === tag ? 'bg-indigo-600' : 'hover:bg-slate-100'}`}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                >
                  {tag}
                </Badge>
              ))}
              {allTags.length > 10 && (
                <Badge variant="outline" className="text-slate-500">
                  +{allTags.length - 10} plus
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 bg-white border border-slate-200">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                Toutes ({memories.length})
              </TabsTrigger>
              <TabsTrigger value="important" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Importantes ({importantMemories.length})
              </TabsTrigger>
              <TabsTrigger value="recent" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Récentes ({recentMemories.length})
              </TabsTrigger>
              <TabsTrigger value="crossmodal" className="flex items-center gap-2">
                <Link2 className="w-4 h-4" />
                Cross-modales ({crossModalMemories.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              {isLoading ? (
                <div className="text-center py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block"
                  >
                    <Database className="w-12 h-12 text-indigo-600" />
                  </motion.div>
                  <p className="text-slate-600 mt-4">Chargement des mémoires...</p>
                </div>
              ) : filteredMemories.length === 0 ? (
                <div className="text-center py-12">
                  <Database className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucune mémoire trouvée</h3>
                  <p className="text-slate-600">
                    {searchTerm || selectedTag || selectedModality
                      ? "Essayez d'ajuster vos filtres"
                      : "Les mémoires seront créées automatiquement lors de vos interactions"}
                  </p>
                </div>
              ) : (
                <div className={viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                  : "space-y-4"
                }>
                  {filteredMemories.map((memory, index) => (
                    <motion.div
                      key={memory.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <MemoryCard 
                        memory={memory} 
                        onUpdate={() => queryClient.invalidateQueries({ queryKey: ['memories'] })}
                        viewMode={viewMode}
                      />
                    </motion.div>
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

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SCEAU DE PROPRIÉTÉ INTELLECTUELLE
 * © 2025 AMG+A.L - PROPRIÉTAIRE - Utilisation non autorisée interdite
 * Innovation: Mémoire Cross-Modale Persistante avec Références Croisées
 * Référence: AMG-AL-DO-2025-001
 * ═══════════════════════════════════════════════════════════════════════════
 */