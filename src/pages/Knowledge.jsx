import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Plus, Database, Sparkles, Globe, Network, ArrowLeft } from "lucide-react";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/utils/LanguageContext";
import { useConsciousnessHub } from "@/components/system/ConsciousnessHub";
import { useMinimumLoadingTime } from "@/components/system/LoadingManager";
import PageTransition from "@/components/utils/PageTransition";
import ProactiveSuggestionsPanel from "../components/proactive/ProactiveSuggestionsPanel";
import KnowledgeCard from "../components/knowledge/KnowledgeCard";
import UploadKnowledgeDialog from "../components/knowledge/UploadKnowledgeDialog";
import FreeDataSourcesManager from "../components/knowledge/FreeDataSourcesManager";
import AutoEnrichmentEngine from "../components/knowledge/AutoEnrichmentEngine";
import CompatibleDataSources from "../components/knowledge/CompatibleDataSources";
import InteractiveKnowledgeGraph from "../components/knowledge/InteractiveKnowledgeGraph";

export default function Knowledge() {
  const { t } = useLanguage();
  const hub = useConsciousnessHub();
  const queryClient = useQueryClient();
  const [showUpload, setShowUpload] = useState(false);
  const [activeTab, setActiveTab] = useState("compatible");

  const { data: knowledgeBases = [], isLoading: rawLoading } = useQuery({
    queryKey: ['knowledgeBases'],
    queryFn: () => base44.entities.KnowledgeBase.list('-created_date', 1000),
    initialData: hub.knowledgeBases || [],
  });

  const isLoading = useMinimumLoadingTime(rawLoading);

  const { data: conversations = [] } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => base44.entities.Conversation.list('-created_date', 50),
    initialData: [],
  });

  const { data: memories = [] } = useQuery({
    queryKey: ['memories'],
    queryFn: () => base44.entities.Memory.list('-created_date', 100),
    initialData: [],
  });

  const deleteKBMutation = useMutation({
    mutationFn: (kbId) => base44.entities.KnowledgeBase.delete(kbId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBases'] });
      hub.invalidateData(['knowledgeBases']);
    },
  });

  const handleDataImported = ({ sourceId, count }) => {
    queryClient.invalidateQueries({ queryKey: ['knowledgeBases'] });
    hub.invalidateData(['knowledgeBases']);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="max-w-7xl mx-auto page-padding page-padding-y">
          <ProactiveSuggestionsPanel
            context={{
              currentPage: 'Knowledge',
              lastAction: 'view_knowledge',
              knowledgeCount: knowledgeBases.length
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

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 font-display">
                    {t('knowledge.title')}
                  </h1>
                  <p className="text-slate-600 mt-1">
                    {t('knowledge.compatibleSources')} • {t('knowledge.autoEnrichment')} • {t('knowledge.interactiveGraph')}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setShowUpload(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('knowledge.add')}
              </Button>
            </div>
          </motion.div>

          <div className="mb-6">
            <AutoEnrichmentEngine
              conversations={conversations}
              memories={memories}
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 w-full max-w-3xl mb-6">
              <TabsTrigger value="compatible">
                <Globe className="w-4 h-4 mr-2" />
                {t('knowledge.compatible')}
              </TabsTrigger>
              <TabsTrigger value="graph">
                <Network className="w-4 h-4 mr-2" />
                {t('knowledge.graph')}
              </TabsTrigger>
              <TabsTrigger value="sources">
                <Sparkles className="w-4 h-4 mr-2" />
                {t('knowledge.sources')}
              </TabsTrigger>
              <TabsTrigger value="all">
                <Database className="w-4 h-4 mr-2" />
                {t('knowledge.allKnowledge')}
              </TabsTrigger>
              <TabsTrigger value="imported">
                <BookOpen className="w-4 h-4 mr-2" />
                {t('knowledge.imported')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="compatible">
              <CompatibleDataSources onDataImported={handleDataImported} />
            </TabsContent>

            <TabsContent value="graph">
              <div style={{ height: '80vh', minHeight: 600 }} className="rounded-xl overflow-hidden border border-slate-200">
                <InteractiveKnowledgeGraph />
              </div>
            </TabsContent>

            <TabsContent value="sources">
              <FreeDataSourcesManager onDataImported={handleDataImported} />
            </TabsContent>

            <TabsContent value="all">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
                  <p className="text-slate-600 mt-4">{t('common.loading')}</p>
                </div>
              ) : knowledgeBases.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">{t('knowledge.noKnowledge')}</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {knowledgeBases.map((kb) => (
                    <KnowledgeCard
                      key={kb.id}
                      knowledge={kb}
                      onDelete={() => deleteKBMutation.mutate(kb.id)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="imported">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {knowledgeBases
                  .filter(kb => kb.category === "external_data" || kb.category === "auto_enriched")
                  .map((kb) => (
                    <KnowledgeCard
                      key={kb.id}
                      knowledge={kb}
                      onDelete={() => deleteKBMutation.mutate(kb.id)}
                    />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {showUpload && (
          <UploadKnowledgeDialog
            onClose={() => setShowUpload(false)}
            onSuccess={() => {
              setShowUpload(false);
              queryClient.invalidateQueries({ queryKey: ['knowledgeBases'] });
            }}
          />
        )}
      </div>
    </PageTransition>
  );
}