import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, Search, Clock, BarChart3, Sparkles, ArrowLeft } from "lucide-react";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/utils/LanguageContext";
import { useConsciousnessHub } from "@/components/system/ConsciousnessHub";
import { useMinimumLoadingTime } from "@/components/system/LoadingManager";
import PageTransition from "@/components/utils/PageTransition";
import ProactiveSuggestionsPanel from "../components/proactive/ProactiveSuggestionsPanel";
import MemoryCard from "../components/memory/MemoryCard";
import MemoryStats from "../components/memory/MemoryStats";
import AdvancedMemorySearch from "../components/memory/AdvancedMemorySearch";
import SemanticMemorySearch from "../components/memory/SemanticMemorySearch";
import MemoryTimeline from "../components/memory/MemoryTimeline";
import MemoryDetailModal from "../components/memory/MemoryDetailModal";

export default function Memory() {
  const { t } = useLanguage();
  const hub = useConsciousnessHub();
  const queryClient = useQueryClient();
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const { data: memories = [], isLoading: rawLoading } = useQuery({
    queryKey: ['memories'],
    queryFn: () => base44.entities.Memory.list('-created_date', 1000),
    initialData: hub.memories || [],
  });

  const isLoading = useMinimumLoadingTime(rawLoading);

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
    // Mise à jour optimiste du cache (sans refetch de toute la liste)
    queryClient.setQueryData(['memories'], (old = []) =>
      old.map((m) => m.id === memory.id
        ? { ...m, access_count: (m.access_count || 0) + 1 }
        : m
      )
    );
    // Fire-and-forget : persister le compteur côté serveur sans invalider
    base44.entities.Memory.update(memory.id, {
      access_count: (memory.access_count || 0) + 1
    }).catch(() => {});
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
        <div className="max-w-7xl mx-auto page-padding page-padding-y">
          <ProactiveSuggestionsPanel
            context={{
              currentPage: 'Memory',
              lastAction: 'view_memories',
              memoryCount: memories.length
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="header-spacing"
          >
            <Link to={createPageUrl("PublicHome")}>
              <Button variant="ghost" size="sm" className="mb-4 hover:bg-slate-100">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('common.back')}
              </Button>
            </Link>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0">
                  <Database className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 font-display">
                    {t('memory.title')}
                  </h1>
                  <p className="text-sm sm:text-base text-slate-600 mt-0.5 sm:mt-1">
                    {t('memory.subtitle')}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <MemoryStats memories={memories} />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="header-spacing">
            <div className="w-full overflow-x-auto">
              <TabsList className="grid grid-cols-5 w-full min-w-[600px] sm:min-w-0 sm:max-w-3xl">
                <TabsTrigger value="all" className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                  <Database className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {t('memory.all')}
                </TabsTrigger>
                <TabsTrigger value="semantic" className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">{t('memory.semantic')}</span>
                  <span className="sm:hidden">{t('memory.semantic').substring(0, 3)}.</span>
                </TabsTrigger>
                <TabsTrigger value="search" className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                  <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {t('memory.filters')}
                </TabsTrigger>
                <TabsTrigger value="timeline" className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">{t('memory.timeline')}</span>
                  <span className="sm:hidden">Time</span>
                </TabsTrigger>
                <TabsTrigger value="stats" className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                  <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {t('memory.stats')}
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="header-spacing">
              {isLoading ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="animate-spin w-10 h-10 sm:w-12 sm:h-12 border-3 sm:border-4 border-purple-600 border-t-transparent rounded-full mx-auto" />
                  <p className="text-sm sm:text-base text-slate-600 mt-3 sm:mt-4">{t('memory.loading')}</p>
                </div>
              ) : memories.length === 0 ? (
                <div className="text-center py-8 sm:py-12 px-4">
                  <Database className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 mx-auto mb-3 sm:mb-4" />
                  <p className="text-sm sm:text-base text-slate-600">{t('memory.noMemory')}</p>
                </div>
              ) : (
                <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
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

            <TabsContent value="semantic" className="mt-6">
              <SemanticMemorySearch
                memories={memories}
                onMemorySelect={handleMemorySelect}
              />
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

        <MemoryDetailModal memory={selectedMemory} onClose={() => setSelectedMemory(null)} />
      </div>
    </PageTransition>
  );
}