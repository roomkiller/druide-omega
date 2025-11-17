/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Advanced Knowledge Manager                                 ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Tag, Link2, Database, Filter, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdvancedKnowledgeManager() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [semanticSearch, setSemanticSearch] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const queryClient = useQueryClient();

  const { data: memories = [] } = useQuery({
    queryKey: ['memories'],
    queryFn: () => base44.entities.Memory.list('-importance'),
  });

  const { data: knowledgeBases = [] } = useQuery({
    queryKey: ['knowledgeBases'],
    queryFn: () => base44.entities.KnowledgeBase.list(),
  });

  // Extraire tous les tags uniques
  const allTags = [...new Set([
    ...memories.flatMap(m => m.tags || []),
    ...knowledgeBases.flatMap(kb => kb.tags || [])
  ])];

  const handleSemanticSearch = async () => {
    if (!searchQuery) return;

    setSemanticSearch(true);

    try {
      // Recherche sémantique avec IA
      const results = await base44.integrations.Core.InvokeLLM({
        prompt: `Recherche sémantique dans la base de connaissances:

REQUÊTE: "${searchQuery}"

MÉMOIRES (${memories.length}):
${memories.slice(0, 20).map(m => `- ${m.content?.slice(0, 100)} [tags: ${m.tags?.join(', ')}]`).join('\n')}

BASES DE CONNAISSANCES (${knowledgeBases.length}):
${knowledgeBases.slice(0, 10).map(kb => `- ${kb.name}: ${kb.description?.slice(0, 100)}`).join('\n')}

Identifie les éléments les plus pertinents selon:
1. Similarité sémantique
2. Contexte et intention
3. Relations conceptuelles

Retourne les IDs et scores de pertinence (0-100).`,
        response_json_schema: {
          type: "object",
          properties: {
            memory_matches: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  memory_index: { type: "number" },
                  relevance: { type: "number" },
                  reason: { type: "string" }
                }
              }
            },
            kb_matches: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  kb_index: { type: "number" },
                  relevance: { type: "number" },
                  reason: { type: "string" }
                }
              }
            },
            semantic_insights: { type: "string" }
          }
        }
      });

      const matchedMemories = results.memory_matches.map(m => ({
        ...memories[m.memory_index],
        relevance: m.relevance,
        reason: m.reason
      }));

      const matchedKBs = results.kb_matches.map(kb => ({
        ...knowledgeBases[kb.kb_index],
        relevance: kb.relevance,
        reason: kb.reason
      }));

      setSearchResults({
        memories: matchedMemories,
        knowledgeBases: matchedKBs,
        insights: results.semantic_insights
      });
    } catch (error) {
      console.error("Erreur recherche sémantique:", error);
    } finally {
      setSemanticSearch(false);
    }
  };

  const handleBasicSearch = () => {
    const query = searchQuery.toLowerCase();
    
    const matchedMemories = memories.filter(m => 
      m.content?.toLowerCase().includes(query) ||
      m.tags?.some(t => t.toLowerCase().includes(query))
    );

    const matchedKBs = knowledgeBases.filter(kb =>
      kb.name?.toLowerCase().includes(query) ||
      kb.description?.toLowerCase().includes(query) ||
      kb.tags?.some(t => t.toLowerCase().includes(query))
    );

    setSearchResults({
      memories: matchedMemories,
      knowledgeBases: matchedKBs,
      insights: `${matchedMemories.length + matchedKBs.length} résultats trouvés`
    });
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const filteredByTags = selectedTags.length > 0 ? {
    memories: memories.filter(m => selectedTags.some(t => m.tags?.includes(t))),
    knowledgeBases: knowledgeBases.filter(kb => selectedTags.some(t => kb.tags?.includes(t)))
  } : null;

  const displayResults = searchResults || filteredByTags || { memories, knowledgeBases };

  return (
    <div className="space-y-6">
      {/* Recherche */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Rechercher dans toutes les connaissances..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleBasicSearch()}
                className="w-full"
              />
            </div>
            <Button onClick={handleBasicSearch} variant="outline">
              <Search className="w-4 h-4 mr-2" />
              Rechercher
            </Button>
            <Button 
              onClick={handleSemanticSearch}
              disabled={semanticSearch || !searchQuery}
              className="bg-gradient-to-r from-purple-600 to-pink-600"
            >
              {semanticSearch ? (
                <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              Sémantique
            </Button>
          </div>

          {searchResults?.insights && (
            <div className="p-3 bg-purple-50 rounded-lg text-sm text-purple-900">
              💡 {searchResults.insights}
            </div>
          )}
        </div>
      </Card>

      {/* Tags */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-slate-600" />
            <span className="font-semibold text-slate-900">Tags</span>
          </div>
          <Badge variant="outline">{allTags.length} tags</Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          {allTags.slice(0, 30).map(tag => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </Card>

      {/* Résultats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mémoires */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-600" />
              <span className="font-semibold text-slate-900">Mémoires</span>
            </div>
            <Badge variant="outline">{displayResults.memories.length}</Badge>
          </div>

          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              <AnimatePresence>
                {displayResults.memories.slice(0, 20).map((memory, idx) => (
                  <motion.div
                    key={memory.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                  >
                    <Card className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <Badge className="bg-indigo-100 text-indigo-700 text-xs">
                          Importance: {memory.importance}/10
                        </Badge>
                        {memory.relevance && (
                          <Badge className="bg-green-100 text-green-700 text-xs">
                            {memory.relevance}% pertinent
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-700 mb-2">
                        {memory.content?.slice(0, 150)}...
                      </p>
                      {memory.reason && (
                        <p className="text-xs text-purple-600 italic mb-2">
                          💡 {memory.reason}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1">
                        {memory.tags?.slice(0, 4).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </Card>

        {/* Bases de Connaissances */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Link2 className="w-4 h-4 text-purple-600" />
              <span className="font-semibold text-slate-900">Bases de Connaissances</span>
            </div>
            <Badge variant="outline">{displayResults.knowledgeBases.length}</Badge>
          </div>

          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              <AnimatePresence>
                {displayResults.knowledgeBases.slice(0, 20).map((kb, idx) => (
                  <motion.div
                    key={kb.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                  >
                    <Card className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-slate-900">{kb.name}</h4>
                        {kb.relevance && (
                          <Badge className="bg-green-100 text-green-700 text-xs">
                            {kb.relevance}% pertinent
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mb-2">
                        {kb.description?.slice(0, 120)}...
                      </p>
                      {kb.reason && (
                        <p className="text-xs text-purple-600 italic mb-2">
                          💡 {kb.reason}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1">
                        {kb.tags?.slice(0, 4).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}