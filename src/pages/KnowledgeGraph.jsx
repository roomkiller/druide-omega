import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Network, Download, Maximize2, Minimize2, RotateCcw } from "lucide-react";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageTransition from "@/components/utils/PageTransition";
import InteractiveKnowledgeGraph from "../components/knowledge/InteractiveKnowledgeGraph";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

export default function KnowledgeGraph() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [graphKey, setGraphKey] = useState(0);
  const [stats, setStats] = useState({ nodes: 0, edges: 0 });

  const { data: knowledgeBases = [] } = useQuery({
    queryKey: ['knowledgeBases'],
    queryFn: () => base44.entities.KnowledgeBase.list('-updated_date', 1000),
    initialData: [],
  });

  useEffect(() => {
    setStats({
      nodes: knowledgeBases.length,
      edges: Math.max(0, Math.floor(knowledgeBases.length * 0.7))
    });
  }, [knowledgeBases]);

  const handleReset = () => setGraphKey(prev => prev + 1);

  const handleExport = () => {
    const link = document.createElement('a');
    link.href = `data:text/plain;charset=utf-8,${encodeURIComponent(JSON.stringify(knowledgeBases, null, 2))}`;
    link.download = `graphe-connaissance-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  return (
    <PageTransition>
      <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'min-h-screen'} bg-gradient-to-br from-slate-50 via-white to-indigo-50/30`}>
        <div className={`${isFullscreen ? 'h-full' : ''} max-w-7xl mx-auto page-padding page-padding-y flex flex-col`}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${isFullscreen ? '' : 'header-spacing'}`}
        >
          {!isFullscreen && (
            <Link to={createPageUrl("Knowledge")}>
              <Button variant="ghost" size="sm" className="mb-4 hover:bg-slate-100">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à la Base de Connaissance
              </Button>
            </Link>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Network className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 font-display">
                  Graphe de Connaissance
                </h1>
                <p className="text-slate-600 mt-1">
                  {stats.nodes} nœuds • {stats.edges} connexions
                </p>
              </div>
            </div>

            {!isFullscreen && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  title="Réinitialiser le graphe"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Réinitialiser
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  title="Exporter les données"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Exporter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFullscreen(true)}
                  title="Mode plein écran"
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ height: isFullscreen ? 'calc(100vh - 60px)' : '80vh', minHeight: 600 }}
          className={`rounded-xl overflow-hidden border border-slate-200 shadow-lg ${isFullscreen ? 'mt-0' : 'mt-6'}`}
        >
          {isFullscreen && (
            <div className="absolute top-4 right-4 z-10">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsFullscreen(false)}
                className="bg-white/90 hover:bg-white"
              >
                <Minimize2 className="w-4 h-4 mr-1" />
                Quitter plein écran
              </Button>
            </div>
          )}
          <InteractiveKnowledgeGraph key={graphKey} />
        </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}