
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Database, Search, Clock, BarChart3 } from "lucide-react"; // Removed Plus icon as it's not used in the final outline
import { motion } from "framer-motion";
import { useLanguage } from "@/components/utils/LanguageContext";
import { useConsciousnessHub } from "@/components/system/ConsciousnessHub";
import { useMinimumLoadingTime } from "@/components/system/LoadingManager"; // New import
import PageTransition from "@/components/utils/PageTransition"; // New import
import ProactiveSuggestionsPanel from "../components/proactive/ProactiveSuggestionsPanel"; // New import
import MemoryCard from "../components/memory/MemoryCard";
import MemoryStats from "../components/memory/MemoryStats";
import AdvancedMemorySearch from "../components/memory/AdvancedMemorySearch";
import MemoryTimeline from "../components/memory/MemoryTimeline";

export default function Memory() {
  const { t } = useLanguage();
  const hub = useConsciousnessHub();
  const queryClient = useQueryClient();
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const { data: memories = [], isLoading: rawLoading } = useQuery({ // Changed isLoading to rawLoading
    queryKey: ['memories'],
    queryFn: () => base44.entities.Memory.list('-created_date', 1000),
    initialData: hub.memories || [],
  });

  const isLoading = useMinimumLoadingTime(rawLoading); // New line for controlled loading

  const deleteMemoryMutation = useMutation({
    mutationFn: (memoryId) => base44.entities.Memory.delete(memoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memories'] });
      hub.invalidateData(['memories']);
      setSelectedMemory(null);
    },
  });

  const handleMemorySelect = (memory) => {
    setSelectedMemory(memory);
    // Increment access count
    base44.entities.Memory.update(memory.id, {
      access_count: (memory.access_count || 0) + 1
    }).then(() => {
      queryClient.invalidateQueries({ queryKey: ['memories'] });
    });
  };

  return (
    <PageTransition> {/* Wrapped the entire content in PageTransition */}
      <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
        <ScrollArea className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            {/* Proactive Suggestions */}
            <ProactiveSuggestionsPanel
              context={{
                currentPage: 'Memory',
                lastAction: 'view_memories',
                memoryCount: memories.length
              }}
            />

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between mb-8"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Database className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 font-display">
                    {t('memory.title')}
                  </h1>
                  <p className="text-slate-600 mt-1">
                    Système de récupération avancée de mémoires
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Stats Overview */}
            <MemoryStats memories={memories} />

            {/* Main Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
              <TabsList className="grid grid-cols-4 w-full max-w-2xl">
                <TabsTrigger value="all" className="flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Toutes
                </TabsTrigger>
                <TabsTrigger value="search" className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Recherche
                </TabsTrigger>
                <TabsTrigger value="timeline" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Timeline
                </TabsTrigger>
                <TabsTrigger value="stats" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Stats
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto" />
                    <p className="text-slate-600 mt-4">Chargement des mémoires...</p>
                  </div>
                ) : memories.length === 0 ? (
                  <div className="text-center py-12">
                    <Database className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600">Aucune mémoire enregistrée</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {memories.map((memory) => (
                      <MemoryCard
                        key={memory.id}
                        memory={memory}
                        onClick={() => handleMemorySelect(memory)}
                        onDelete={() => deleteMemoryMutation.mutate(memory.id)}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="search" className="mt-6">
                <AdvancedMemorySearch
                  memories={memories}
                  onMemorySelect={handleMemorySelect}
                />
              </TabsContent>

              <TabsContent value="timeline" className="mt-6">
                <MemoryTimeline
                  memories={memories}
                  onMemoryClick={handleMemorySelect}
                />
              </TabsContent>

              <TabsContent value="stats" className="mt-6">
                <div className="grid gap-6">
                  <MemoryStats memories={memories} detailed />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </div>
    </PageTransition>
  );
}
