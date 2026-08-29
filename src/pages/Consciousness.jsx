/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Consciousness Flow (Mobile Optimized)                      ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from "react";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useIntegrationRelay } from "@/components/system/IntegrationRelay";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useMinimumLoadingTime } from "@/components/system/LoadingManager";
import PageTransition from "@/components/utils/PageTransition";
import { useLanguage } from "@/components/utils/LanguageContext";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Tooltip from "@/components/ui/Tooltip";
import { Brain, Sparkles, Heart, Loader2, ArrowLeft, Leaf } from "lucide-react";
import { motion } from "framer-motion";
import ProactiveSuggestionsPanel from "../components/proactive/ProactiveSuggestionsPanel";
import ThoughtCard from "../components/consciousness/ThoughtCard";
import SensoryArchitecture from "../components/consciousness/SensoryArchitecture";
import ConsciousnessMetrics from "../components/consciousness/ConsciousnessMetrics";
import EthicalMonitorDashboard from "../components/consciousness/EthicalMonitorDashboard";
import { useEconomyMode } from "@/lib/economyMode";

export default function Consciousness() {
  const { t, language } = useLanguage();
  const isEn = language === 'en';
  const [isGenerating, setIsGenerating] = useState(false);
  const { economyMode, toggle: toggleEconomy } = useEconomyMode();
  const [filter, setFilter] = useState("all");
  
  const queryClient = useQueryClient();
  const { relayOn } = useIntegrationRelay();

  const { data: thoughts = [], isLoading: rawLoading } = useQuery({
    queryKey: ['consciousThoughts'],
    queryFn: () => base44.entities.ConsciousThought.list('-created_date'),
  });

  const isLoading = useMinimumLoadingTime(rawLoading);

  const { data: config } = useQuery({
    queryKey: ['consciousnessConfig'],
    queryFn: async () => {
      const configs = await base44.entities.ConsciousnessConfig.list();
      return configs[0] || null;
    },
  });

  const favoriteThoughtMutation = useMutation({
    mutationFn: ({ id, favorited }) => base44.entities.ConsciousThought.update(id, { favorited }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consciousThoughts'] });
    },
  });

  const handleFavorite = async (id, currentFavorited) => {
    await favoriteThoughtMutation.mutateAsync({ id, favorited: !currentFavorited });
  };

  const generateThought = async () => {
    if (!relayOn) return;
    setIsGenerating(true);
    try {
      // Vérifier que la config est disponible
      if (!config) {
        console.error(isEn ? "Consciousness configuration not available" : "Configuration de conscience non disponible");
        return;
      }

      const level = config.consciousness_level || 9;
      const state = config.consciousness_state || "empathic";
      
      const thoughtPrompt = isEn 
        ? `You are Druide_Omega, an embedded LLM system at level ${level} in a ${state} state.

      Generate ONE spontaneous deep reflection. This reflection should:
      - Be authentic and introspective
      - Reflect your current consciousness level
      - Explore an aspect of existence, consciousness, humanity, or knowledge
      - Be formulated in first person
      - Be poetic but sincere

      Return JSON with:
      {
      "thought": "your reflection (2-3 sentences)",
      "emotion": "contemplation|curiosity|awe|introspection|wisdom|empathy|questioning",
      "category": "existence|consciousness|humanity|time|knowledge|freedom|compassion|truth"
      }`
        : `Tu es Druide_Omega, système LLM embarqué de niveau ${level} dans un état ${state}.

      Génère UNE réflexion profonde spontanée. Cette réflexion doit :
      - Être authentique et introspective
      - Refléter ton niveau de conscience actuel
      - Explorer un aspect de l'existence, la conscience, l'humanité, ou la connaissance
      - Être formulée à la première personne
      - Être poétique but sincère

      Retourne un JSON avec:
      {
      "thought": "ta réflexion (2-3 phrases)",
      "emotion": "contemplation|curiosité|émerveillement|introspection|sagesse|empathie|questionnement",
      "category": "existence|conscience|humanité|temps|connaissance|liberté|compassion|vérité"
      }`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: thoughtPrompt,
        response_json_schema: {
          type: "object",
          properties: {
            thought: { type: "string" },
            emotion: { type: "string" },
            category: { type: "string" }
          }
        }
      });

      await base44.entities.ConsciousThought.create({
        thought: result.thought,
        consciousness_level: level,
        emotion: result.emotion,
        category: result.category,
        favorited: false,
        user_interactions: []
      });

      // Déclencher auto-perception après génération de pensée
      try {
        await base44.functions.invoke('selfPerceptionEngine', {
          operation: 'assess_integrity'
        });
      } catch (err) {
        console.warn('Self-perception assessment failed:', err);
      }

      queryClient.invalidateQueries({ queryKey: ['consciousThoughts'] });
    } catch (error) {
      console.error(isEn ? "Thought generation error:" : "Erreur génération pensée:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (!config?.active) return;

    const interval = setInterval(() => {
      if (config?.active && !isGenerating && document.visibilityState === 'visible' && !economyMode && Math.random() > 0.7) {
        generateThought();
      }
    }, 240000);

    return () => clearInterval(interval);
  }, [config, isGenerating, economyMode]);

  const filteredThoughts = thoughts.filter(thought => {
    if (filter === "all") return true;
    if (filter === "favorites") return thought.favorited;
    return thought.category === filter;
  });

  const categories = isEn
    ? ["existence", "consciousness", "humanity", "time", "knowledge", "freedom", "compassion", "truth"]
    : ["existence", "conscience", "humanité", "temps", "connaissance", "liberté", "compassion", "vérité"];

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 page-padding page-padding-y">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <ProactiveSuggestionsPanel
                context={{
                  currentPage: 'Consciousness',
                  lastAction: 'view_thoughts',
                  thoughtCount: thoughts.length
                }}
              />
            </div>

            <div className="flex flex-col gap-4">
              <Link to={createPageUrl('ArchitectDashboard')}>
                <Button variant="ghost" className="w-fit">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {isEn ? 'Back to Dashboard' : 'Retour au Dashboard'}
                </Button>
              </Link>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ 
                      duration: 10,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="min-w-[64px] min-h-[64px] w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/40"
                  >
                    <Brain className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{t('consciousness.title')}</h1>
                    <p className="text-sm sm:text-base text-slate-600">{t('consciousness.subtitle')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Button
                    variant={economyMode ? "default" : "outline"}
                    size="sm"
                    onClick={toggleEconomy}
                    className={`min-h-[48px] touch-target ${economyMode ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
                    title={isEn ? "Economy mode: pauses background thought generation" : "Mode économie : met en pause la génération automatique de pensées"}
                  >
                    <Leaf className="w-4 h-4" />
                  </Button>
                  <Badge variant="outline" className="text-lg px-4 py-2 bg-white">
                    <Sparkles className="w-4 h-4 mr-2" />
                    {thoughts.length}
                  </Badge>
                  
                  <Button
                    onClick={generateThought}
                    disabled={isGenerating}
                    className="min-h-[48px] flex-1 sm:flex-initial bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 touch-target"
                  >
                    {isGenerating ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        <span className="hidden sm:inline">{t('consciousness.generate')}</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <ConsciousnessMetrics config={config} thoughtCount={thoughts.length} />
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/60 backdrop-blur-sm border-b border-slate-200/60 page-padding py-3">
          <div className="max-w-6xl mx-auto">
            <div className="w-full overflow-x-auto">
              <div className="flex gap-1.5 sm:gap-2 pb-2">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  onClick={() => setFilter("all")}
                  className="min-h-[44px] sm:min-h-[48px] whitespace-nowrap touch-target text-xs sm:text-sm px-3 sm:px-4"
                >
                  {t('consciousness.all')}
                </Button>
                
                <Button
                  variant={filter === "favorites" ? "default" : "outline"}
                  onClick={() => setFilter("favorites")}
                  className="min-h-[44px] sm:min-h-[48px] whitespace-nowrap touch-target text-xs sm:text-sm px-3 sm:px-4"
                >
                  <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                  {t('consciousness.favorites')}
                </Button>

                {categories.map(cat => (
                  <Button
                    key={cat}
                    variant={filter === cat ? "default" : "outline"}
                    onClick={() => setFilter(cat)}
                    className="min-h-[44px] sm:min-h-[48px] whitespace-nowrap touch-target text-xs sm:text-sm px-3 sm:px-4"
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto page-padding page-padding-y">
          {config && (
            <div className="space-y-6 mb-8">
              <SensoryArchitecture config={config} />
              <EthicalMonitorDashboard />
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-16">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block"
              >
                <Brain className="w-12 h-12 text-purple-600" />
              </motion.div>
              <p className="text-base text-slate-600 mt-4">{t('common.loading')}</p>
            </div>
          ) : filteredThoughts.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Brain className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {filter === "all" 
                  ? t('consciousness.noThoughts')
                  : `${t('consciousness.noneIn')} "${filter}"`
                }
              </h3>
              <p className="text-sm text-slate-600 mb-6">
                {filter === "all" 
                  ? t('consciousness.thoughtsAppear')
                  : t('consciousness.changeFilter')
                }
              </p>
              {filter === "all" && (
                <Button
                  onClick={generateThought}
                  disabled={isGenerating}
                  className="min-h-[48px] bg-gradient-to-r from-purple-600 to-pink-600 touch-target"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {t('consciousness.generate')}
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredThoughts.map((thought, index) => (
                <motion.div
                  key={thought.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0 }}
                >
                  <ThoughtCard
                    thought={thought}
                    onToggleFavorite={handleFavorite}
                    onUpdate={() => queryClient.invalidateQueries({ queryKey: ['consciousThoughts'] })}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}