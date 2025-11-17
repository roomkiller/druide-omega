
/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Global Semantic Search Component                           ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SemanticSearchEngine } from "./SemanticSearchEngine";
import { useBehaviorTracking } from "../analytics/BehaviorTracker";
import { Search, Sparkles, Loader2, MessageCircle, Database, BookOpen, Zap, Brain } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function GlobalSemanticSearch() {
  const { trackAction } = useBehaviorTracking('semantic_search');
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("search"); // search | question

  const handleSearch = async () => {
    if (!query.trim()) return;

    const startTime = Date.now();
    trackAction(mode === 'question' ? 'ask_question' : 'search', {
      query_length: query.length,
      mode
    });

    setLoading(true);
    setResults(null);
    setAnswer(null);

    let currentTotalResults = 0; // Variable to hold total results for tracking

    try {
      if (mode === "question") {
        const response = await SemanticSearchEngine.askQuestion(query);
        setAnswer(response);
        currentTotalResults = response.sources.memories.length +
                              response.sources.knowledgeBases.length +
                              response.sources.conversations.length +
                              response.sources.workflows.length;
        setResults({
          memories: response.sources.memories,
          knowledgeBases: response.sources.knowledgeBases,
          conversations: response.sources.conversations,
          workflows: response.sources.workflows,
          query_understanding: response.understanding,
          total_results: currentTotalResults
        });
      } else {
        const searchResults = await SemanticSearchEngine.search(query);
        currentTotalResults = searchResults ? (
          searchResults.memories.length +
          searchResults.knowledgeBases.length +
          searchResults.conversations.length +
          searchResults.workflows.length
        ) : 0;
        setResults(searchResults);
      }

      const duration = Date.now() - startTime;
      trackAction('search_completed', {
        duration_ms: duration,
        results_count: currentTotalResults,
        mode
      });
    } catch (error) {
      console.error("Erreur:", error);
      trackAction('search_error', { error_message: error.message, mode });
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'memory': return Database;
      case 'knowledge_base': return BookOpen;
      case 'conversation': return MessageCircle;
      case 'workflow': return Zap;
      default: return Database;
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'memory': return 'indigo';
      case 'knowledge_base': return 'purple';
      case 'conversation': return 'blue';
      case 'workflow': return 'green';
      default: return 'slate';
    }
  };

  const allResults = results ? [
    ...results.memories,
    ...results.knowledgeBases,
    ...results.conversations,
    ...results.workflows
  ].sort((a, b) => b.relevance_score - a.relevance_score) : [];

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="space-y-4">
          <div className="flex gap-2 mb-4">
            <Button
              variant={mode === "search" ? "default" : "outline"}
              onClick={() => setMode("search")}
              size="sm"
            >
              <Search className="w-4 h-4 mr-2" />
              Recherche
            </Button>
            <Button
              variant={mode === "question" ? "default" : "outline"}
              onClick={() => setMode("question")}
              size="sm"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Question
            </Button>
          </div>

          <div className="flex gap-3">
            <Input
              placeholder={mode === "question" ? "Posez votre question en langage naturel..." : "Recherchez dans toutes vos données..."}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 text-base"
            />
            <Button
              onClick={handleSearch}
              disabled={loading || !query.trim()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 px-6"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  {mode === "question" ? "Répondre" : "Chercher"}
                </>
              )}
            </Button>
          </div>

          {loading && (
            <div className="flex items-center gap-2 text-sm text-purple-600">
              <Brain className="w-4 h-4 animate-pulse" />
              <span>Analyse sémantique en cours...</span>
            </div>
          )}
        </div>
      </Card>

      {/* Answer (mode question) */}
      <AnimatePresence>
        {answer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-2 border-purple-300">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-2">Réponse</h3>
                  <p className="text-slate-700 leading-relaxed">{answer.answer}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-purple-200">
                <p className="text-xs font-semibold text-slate-600 mb-2">📚 Sources utilisées:</p>
                <div className="flex flex-wrap gap-2">
                  {answer.sources.memories.length > 0 && (
                    <Badge className="bg-indigo-100 text-indigo-700">
                      {answer.sources.memories.length} Mémoires
                    </Badge>
                  )}
                  {answer.sources.knowledgeBases.length > 0 && (
                    <Badge className="bg-purple-100 text-purple-700">
                      {answer.sources.knowledgeBases.length} Connaissances
                    </Badge>
                  )}
                  {answer.sources.conversations.length > 0 && (
                    <Badge className="bg-blue-100 text-blue-700">
                      {answer.sources.conversations.length} Conversations
                    </Badge>
                  )}
                  {answer.sources.workflows.length > 0 && (
                    <Badge className="bg-green-100 text-green-700">
                      {answer.sources.workflows.length} Workflows
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Understanding */}
      {results?.query_understanding && (
        <Card className="p-4 bg-purple-50 border-purple-200">
          <div className="flex items-start gap-3">
            <Brain className="w-5 h-5 text-purple-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900 mb-2">
                Compréhension: {results.query_understanding.intent}
              </p>
              <div className="flex flex-wrap gap-1">
                {results.query_understanding.key_concepts?.map((concept, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {concept}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Results */}
      {results && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">
              Résultats ({results.total_results})
            </h3>
            {results.synthesis && (
              <Button variant="outline" size="sm">
                <Sparkles className="w-4 h-4 mr-2" />
                Synthèse
              </Button>
            )}
          </div>

          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              <AnimatePresence>
                {allResults.map((result, idx) => {
                  const Icon = getTypeIcon(result.type);
                  const color = getTypeColor(result.type);

                  return (
                    <motion.div
                      key={`${result.type}-${result.id}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.02 }}
                    >
                      <Card className="p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 bg-${color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <Icon className={`w-4 h-4 text-${color}-600`} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={`bg-${color}-100 text-${color}-700 text-xs`}>
                                {result.type}
                              </Badge>
                              <Badge className="bg-green-100 text-green-700 text-xs">
                                {result.relevance_score}% pertinent
                              </Badge>
                            </div>

                            <div className="mb-2">
                              {result.type === 'memory' && (
                                <>
                                  <p className="text-sm text-slate-700 mb-1">
                                    {result.content?.slice(0, 200)}...
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {result.tags?.slice(0, 3).map(tag => (
                                      <Badge key={tag} variant="outline" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </>
                              )}

                              {result.type === 'knowledge_base' && (
                                <>
                                  <p className="font-semibold text-slate-900 text-sm mb-1">
                                    {result.name}
                                  </p>
                                  <p className="text-sm text-slate-600">
                                    {result.description?.slice(0, 150)}...
                                  </p>
                                </>
                              )}

                              {result.type === 'conversation' && (
                                <>
                                  <p className="font-semibold text-slate-900 text-sm">
                                    {result.title || 'Conversation'}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {result.message_count || 0} messages · {new Date(result.created_date).toLocaleDateString()}
                                  </p>
                                </>
                              )}

                              {result.type === 'workflow' && (
                                <>
                                  <p className="font-semibold text-slate-900 text-sm mb-1">
                                    {result.name}
                                  </p>
                                  <p className="text-sm text-slate-600">
                                    {result.description?.slice(0, 120)}
                                  </p>
                                </>
                              )}
                            </div>

                            {result.explanation && (
                              <div className="p-2 bg-purple-50 rounded text-xs text-purple-700 italic">
                                💡 {result.explanation}
                              </div>
                            )}

                            {result.matching_concepts && result.matching_concepts.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {result.matching_concepts.map((concept, i) => (
                                  <Badge key={i} className="bg-purple-100 text-purple-700 text-xs">
                                    {concept}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </Card>
      )}
    </div>
  );
}
