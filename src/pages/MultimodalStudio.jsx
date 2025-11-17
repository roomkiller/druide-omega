/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Multimodal Studio                                          ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Layers, Eye, BarChart3, Brain } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/utils/LanguageContext";
import ImageAnalyzer from "@/components/multimodal/ImageAnalyzer";
import VisualResponseGenerator from "@/components/multimodal/VisualResponseGenerator";
import CrossModalSynthesizer from "@/components/multimodal/CrossModalSynthesizer";

export default function MultimodalStudio() {
  const { t } = useLanguage();
  const [visualResults, setVisualResults] = useState([]);

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      <ScrollArea className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 via-pink-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Layers className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 font-display">
                  Studio Multimodal
                </h1>
                <p className="text-slate-600 mt-1">
                  Vision, génération et synthèse intelligente
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                Analyse d'Images
              </Badge>
              <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                Génération Visuelle
              </Badge>
              <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                Synthèse Cross-Modale
              </Badge>
            </div>
          </motion.div>

          <Tabs defaultValue="analyze" className="space-y-6">
            <TabsList className="grid grid-cols-3 w-full max-w-2xl">
              <TabsTrigger value="analyze">
                <Eye className="w-4 h-4 mr-2" />
                Analyser
              </TabsTrigger>
              <TabsTrigger value="generate">
                <BarChart3 className="w-4 h-4 mr-2" />
                Générer
              </TabsTrigger>
              <TabsTrigger value="synthesize">
                <Brain className="w-4 h-4 mr-2" />
                Synthétiser
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analyze">
              <ImageAnalyzer 
                onAnalysisComplete={(result) => {
                  setVisualResults(prev => [...prev, { type: "analysis", ...result }]);
                }} 
              />
            </TabsContent>

            <TabsContent value="generate">
              <div className="grid lg:grid-cols-2 gap-6">
                <VisualResponseGenerator
                  context={{
                    topic: "Intelligence Artificielle",
                    data: "Analyse des performances",
                    timestamp: new Date().toISOString()
                  }}
                  onGenerated={(result) => {
                    setVisualResults(prev => [...prev, { type: "generation", ...result }]);
                  }}
                />

                {visualResults.filter(r => r.type === "generation").length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900">Résultats Générés</h3>
                    {visualResults
                      .filter(r => r.type === "generation")
                      .slice(-3)
                      .map((result, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-white rounded-lg p-4 border border-slate-200"
                        >
                          {result.url && (
                            <img 
                              src={result.url} 
                              alt={result.description}
                              className="w-full rounded-lg mb-3"
                            />
                          )}
                          {result.data && (
                            <div className="bg-slate-50 rounded p-3">
                              <p className="text-sm font-semibold text-slate-900 mb-2">
                                {result.data.title}
                              </p>
                              <Badge variant="outline" className="text-xs">
                                {result.data.chart_type}
                              </Badge>
                            </div>
                          )}
                          {result.content && (
                            <pre className="text-xs bg-slate-900 text-green-400 p-3 rounded overflow-x-auto">
                              {result.content}
                            </pre>
                          )}
                        </motion.div>
                      ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="synthesize">
              <CrossModalSynthesizer />
            </TabsContent>
          </Tabs>

          {visualResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200"
            >
              <h3 className="font-bold text-slate-900 mb-2">
                Session Multimodale Active
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                {visualResults.length} éléments créés ou analysés dans cette session
              </p>
              <div className="flex gap-2">
                <Badge className="bg-purple-100 text-purple-700">
                  {visualResults.filter(r => r.type === "analysis").length} analyses
                </Badge>
                <Badge className="bg-blue-100 text-blue-700">
                  {visualResults.filter(r => r.type === "generation").length} générations
                </Badge>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}