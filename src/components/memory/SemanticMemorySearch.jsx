/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Recherche Sémantique de Mémoires                           ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ Recherche par sens et contexte + enrichissement via Module de Jugement    ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Brain,
  Sparkles,
  Scale,
  Loader2,
  Lightbulb,
  Target,
  Zap,
  CheckCircle,
  AlertCircle,
  Info,
  Eye,
  MessageCircle,
  Mic,
  Hash,
  TrendingUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { judge } from "@/components/consciousness/JudgementModule";

const IMPORTANCE_COLORS = {
  "ultra_léger": "bg-slate-100 text-slate-600 border-slate-200",
  "léger": "bg-blue-50 text-blue-700 border-blue-200",
  "modéré": "bg-amber-50 text-amber-700 border-amber-200",
  "important": "bg-orange-50 text-orange-700 border-orange-200",
  "ultra_important": "bg-red-50 text-red-700 border-red-200"
};

const IMPACT_CONFIG = {
  "positif": { icon: CheckCircle, color: "text-green-500", bg: "bg-green-50" },
  "négatif": { icon: AlertCircle, color: "text-red-500", bg: "bg-red-50" },
  "neutre": { icon: Info, color: "text-slate-500", bg: "bg-slate-50" },
  "mixte": { icon: Zap, color: "text-amber-500", bg: "bg-amber-50" }
};

const MODALITY_ICONS = {
  chat: MessageCircle,
  voice: Mic,
  visual: Eye,
  system: Brain
};

export default function SemanticMemorySearch({ memories = [], onMemorySelect }) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [searchMode, setSearchMode] = useState("semantic");
  const [queryJudgement, setQueryJudgement] = useState(null);

  // Calcul de similarité sémantique basique (cosine-like sur mots)
  const computeSemanticScore = useCallback((text1, text2) => {
    const normalize = (text) => {
      return (text || "").toLowerCase()
        .replace(/[^\wàâçéèêëîïôùûüÿñ]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 2);
    };

    const words1 = normalize(text1);
    const words2 = normalize(text2);
    
    if (words1.length === 0 || words2.length === 0) return 0;

    // Mots en commun
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    const intersection = [...set1].filter(w => set2.has(w)).length;
    const union = new Set([...words1, ...words2]).size;
    
    return union > 0 ? intersection / union : 0;
  }, []);

  // Expansion sémantique via LLM
  const expandQuerySemantically = useCallback(async (originalQuery) => {
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Tu es un expert en recherche sémantique. 
      
Requête utilisateur: "${originalQuery}"

Génère une expansion sémantique de cette requête pour améliorer la recherche dans une base de mémoires.
Inclus: synonymes, concepts liés, variations, intentions possibles.

Retourne en JSON:
{
  "expanded_terms": ["terme1", "terme2", ...],
  "related_concepts": ["concept1", "concept2", ...],
  "intent": "description de l'intention de recherche",
  "emotional_context": "contexte émotionnel détecté"
}`,
      response_json_schema: {
        type: "object",
        properties: {
          expanded_terms: { type: "array", items: { type: "string" } },
          related_concepts: { type: "array", items: { type: "string" } },
          intent: { type: "string" },
          emotional_context: { type: "string" }
        }
      }
    });
    return result;
  }, []);

  // Recherche sémantique principale
  const handleSemanticSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    setResults([]);

    // 1. Analyser la requête avec le module de jugement
    const queryAnalysis = judge({
      content: query,
      metadata: {
        intent: "explorative",
        domain: "autre"
      }
    });
    setQueryJudgement(queryAnalysis);

    // 2. Expansion sémantique
    let expansion = null;
    if (searchMode === "semantic") {
      expansion = await expandQuerySemantically(query);
    }

    // 3. Rechercher et scorer chaque mémoire
    const scoredMemories = memories.map(memory => {
      // Score de base sur le contenu
      let score = computeSemanticScore(query, memory.content || "");
      score += computeSemanticScore(query, memory.context || "") * 0.5;
      
      // Bonus pour les tags correspondants
      const queryTags = queryAnalysis.properties.facteurs;
      const memoryTags = memory.tags || [];
      const tagOverlap = queryTags.filter(t => 
        memoryTags.some(mt => mt.toLowerCase().includes(t.toLowerCase()))
      ).length;
      score += tagOverlap * 0.15;

      // Bonus sémantique avec expansion
      if (expansion) {
        const allTerms = [...(expansion.expanded_terms || []), ...(expansion.related_concepts || [])];
        for (const term of allTerms) {
          score += computeSemanticScore(term, memory.content || "") * 0.3;
        }
      }

      // Bonus importance originale de la mémoire
      const memoryImportance = (memory.importance || 5) / 10;
      score += memoryImportance * 0.1;

      // Analyser la mémoire avec le module de jugement
      const memoryJudgement = judge({
        content: memory.content || "",
        metadata: {
          domain: memory.type === "fact" ? "technique" : "autre"
        }
      });

      // Bonus si même nature/catégorie que la requête
      if (memoryJudgement.properties.catégorie === queryAnalysis.properties.catégorie) {
        score += 0.15;
      }
      if (memoryJudgement.properties.nature === queryAnalysis.properties.nature) {
        score += 0.1;
      }

      return {
        memory,
        score: Math.min(score, 1),
        judgement: memoryJudgement,
        matchedTerms: expansion?.expanded_terms?.filter(t => 
          (memory.content || "").toLowerCase().includes(t.toLowerCase())
        ) || []
      };
    });

    // Filtrer et trier par score
    const filteredResults = scoredMemories
      .filter(r => r.score > 0.05)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    setResults(filteredResults);
    setIsSearching(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSemanticSearch();
    }
  };

  const getScoreColor = (score) => {
    if (score >= 0.7) return "text-green-600 bg-green-50";
    if (score >= 0.4) return "text-amber-600 bg-amber-50";
    return "text-slate-600 bg-slate-50";
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="border-purple-200 bg-gradient-to-br from-white to-purple-50/30">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Recherche Sémantique</h2>
              <p className="text-sm text-slate-500 font-normal">Trouvez des mémoires par sens et contexte</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Mode Selector */}
          <Tabs value={searchMode} onValueChange={setSearchMode} className="mb-4">
            <TabsList className="grid grid-cols-2 w-full max-w-sm">
              <TabsTrigger value="semantic" className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Sémantique
              </TabsTrigger>
              <TabsTrigger value="hybrid" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Hybride
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Search Input */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Brain className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
              <Input
                placeholder="Décrivez ce que vous cherchez en langage naturel..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 border-purple-200 focus:border-purple-400"
              />
            </div>
            <Button 
              onClick={handleSemanticSearch}
              disabled={isSearching || !query.trim()}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Rechercher
                </>
              )}
            </Button>
          </div>

          {/* Query Analysis Display */}
          <AnimatePresence>
            {queryJudgement && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Scale className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-semibold text-slate-700">Analyse de la requête</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className={IMPORTANCE_COLORS[queryJudgement.importance]}>
                    {queryJudgement.importance.replace('_', ' ')}
                  </Badge>
                  <Badge variant="outline">{queryJudgement.properties.nature}</Badge>
                  <Badge variant="outline">{queryJudgement.properties.catégorie}</Badge>
                  {queryJudgement.properties.facteurs.slice(0, 4).map((f, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      <Hash className="w-3 h-3 mr-1" />{f}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Results */}
      <AnimatePresence>
        {isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8"
          >
            <div className="w-12 h-12 mx-auto mb-3 relative">
              <div className="absolute inset-0 border-4 border-purple-200 rounded-full" />
              <div className="absolute inset-0 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
              <Brain className="absolute inset-2 w-8 h-8 text-purple-600" />
            </div>
            <p className="text-slate-600">Analyse sémantique en cours...</p>
          </motion.div>
        )}

        {!isSearching && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    {results.length} résultat{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">
                    Triés par pertinence sémantique
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-3">
                    {results.map(({ memory, score, judgement, matchedTerms }, index) => {
                      const ModalityIcon = MODALITY_ICONS[memory.modality] || Brain;
                      const ImpactIcon = IMPACT_CONFIG[judgement.properties.impact]?.icon || Info;

                      return (
                        <motion.div
                          key={memory.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => onMemorySelect?.(memory)}
                          className="bg-white border border-slate-200 rounded-xl p-4 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer group"
                        >
                          {/* Header */}
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${IMPACT_CONFIG[judgement.properties.impact]?.bg || 'bg-slate-100'}`}>
                                <ModalityIcon className={`w-4 h-4 ${IMPACT_CONFIG[judgement.properties.impact]?.color || 'text-slate-500'}`} />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">{memory.type}</Badge>
                                  <Badge className={`text-xs ${IMPORTANCE_COLORS[judgement.importance]}`}>
                                    {judgement.importance.replace('_', ' ')}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            
                            {/* Score */}
                            <div className="flex items-center gap-2">
                              <div className={`px-2 py-1 rounded-lg flex items-center gap-1.5 ${getScoreColor(score)}`}>
                                <TrendingUp className="w-3 h-3" />
                                <span className="text-xs font-bold">{(score * 100).toFixed(0)}%</span>
                              </div>
                            </div>
                          </div>

                          {/* Content */}
                          <p className="text-sm text-slate-700 mb-3 line-clamp-3 group-hover:line-clamp-none transition-all">
                            {memory.content}
                          </p>

                          {/* Judgement Properties Bar */}
                          <div className="grid grid-cols-3 gap-2 mb-3">
                            <div>
                              <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                                <span>Nuance</span>
                                <span>{(judgement.properties.nuance * 100).toFixed(0)}%</span>
                              </div>
                              <Progress value={judgement.properties.nuance * 100} className="h-1" />
                            </div>
                            <div>
                              <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                                <span>Relationnel</span>
                                <span>{(judgement.properties.relationnel * 100).toFixed(0)}%</span>
                              </div>
                              <Progress value={judgement.properties.relationnel * 100} className="h-1" />
                            </div>
                            <div>
                              <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                                <span>Info</span>
                                <span>{(judgement.properties.informationnel * 100).toFixed(0)}%</span>
                              </div>
                              <Progress value={judgement.properties.informationnel * 100} className="h-1" />
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              {matchedTerms.slice(0, 3).map((term, i) => (
                                <Badge key={i} className="bg-purple-100 text-purple-700 text-[10px]">
                                  ✓ {term}
                                </Badge>
                              ))}
                              {(memory.tags || []).slice(0, 2).map((tag, i) => (
                                <Badge key={`tag-${i}`} variant="outline" className="text-[10px]">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <span className="text-[10px] text-slate-400">
                              {format(new Date(memory.created_date), 'dd/MM/yyyy')}
                            </span>
                          </div>

                          {/* Calibration indicator */}
                          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-2">
                            <Scale className="w-3 h-3 text-slate-400" />
                            <div className="flex-1 h-1.5 bg-gradient-to-r from-red-200 via-slate-200 to-green-200 rounded-full relative">
                              <div 
                                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-purple-600 rounded-full border border-white shadow"
                                style={{ left: `${((judgement.calibration.level + 7) / 14) * 100}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {judgement.calibration.level > 0 ? '+' : ''}{judgement.calibration.level}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {!isSearching && query && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Search className="w-16 h-16 mx-auto mb-4 text-slate-200" />
            <p className="text-slate-500">Aucune mémoire correspondante trouvée</p>
            <p className="text-sm text-slate-400 mt-1">Essayez avec d'autres termes ou concepts</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}