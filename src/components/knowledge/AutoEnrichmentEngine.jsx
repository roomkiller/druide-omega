/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Auto Knowledge Enrichment Engine                           ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { base44 } from "@/api/base44Client";
import { 
  Sparkles, 
  RefreshCw, 
  Brain,
  TrendingUp,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";

export default function AutoEnrichmentEngine({ conversations = [], memories = [] }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isEnriching, setIsEnriching] = useState(false);
  const [lastEnrichment, setLastEnrichment] = useState(null);

  const enrichKnowledge = async () => {
    setIsEnriching(true);

    try {
      // Analyser les conversations récentes pour trouver des sujets d'intérêt
      const recentConversations = conversations.slice(-10);
      const conversationText = recentConversations
        .flatMap(c => c.messages || [])
        .map(m => m.content)
        .join('\n')
        .slice(0, 3000);

      // Extraire les topics d'intérêt
      const topicsAnalysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyse ces conversations récentes et identifie 3-5 sujets d'intérêt qui méritent enrichissement de connaissances:

${conversationText}

Retourne JSON avec:
- topics: [{name: str, importance: 1-10, search_query: str}]
- reasoning: str`,
        response_json_schema: {
          type: "object",
          properties: {
            topics: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  importance: { type: "number" },
                  search_query: { type: "string" }
                }
              }
            },
            reasoning: { type: "string" }
          }
        }
      });

      const enrichedTopics = [];

      // Pour chaque topic, enrichir depuis Wikipedia
      for (const topic of topicsAnalysis.topics.slice(0, 3)) {
        try {
          const wikiResponse = await fetch(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic.search_query)}`
          );
          const wikiData = await wikiResponse.json();

          if (wikiData.extract) {
            // Créer une knowledge base
            await base44.entities.KnowledgeBase.create({
              name: `Auto-enrichment: ${topic.name}`,
              description: `Enrichissement automatique basé sur l'analyse des conversations`,
              content: wikiData.extract,
              source_url: wikiData.content_urls?.desktop?.page,
              tags: ["auto-enrichment", topic.name.toLowerCase()],
              category: "auto_enriched",
              version: "1.0",
              active: true,
              metadata: {
                enrichment_date: new Date().toISOString(),
                importance: topic.importance,
                reasoning: topicsAnalysis.reasoning
              }
            });

            enrichedTopics.push(topic.name);
          }
        } catch (error) {
          console.error(`Erreur enrichissement ${topic.name}:`, error);
        }
      }

      setLastEnrichment({
        date: new Date().toISOString(),
        topics: enrichedTopics,
        count: enrichedTopics.length
      });

    } catch (error) {
      console.error("Erreur enrichissement:", error);
    } finally {
      setIsEnriching(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ 
              rotate: isEnriching ? 360 : 0,
              scale: isEnriching ? [1, 1.1, 1] : 1
            }}
            transition={{ 
              rotate: { duration: 2, repeat: isEnriching ? Infinity : 0, ease: "linear" },
              scale: { duration: 1, repeat: isEnriching ? Infinity : 0 }
            }}
            className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg"
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h3 className="font-bold text-slate-900">Enrichissement Automatique</h3>
            <p className="text-xs text-slate-600">
              Enrichit les connaissances basé sur vos conversations
            </p>
          </div>
        </div>

        <Switch
          checked={isEnabled}
          onCheckedChange={setIsEnabled}
        />
      </div>

      {isEnabled && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-4"
        >
          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-slate-700">
                Intelligence Contextuelle
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Le système analyse automatiquement vos conversations pour identifier
              les sujets pertinents et enrichir votre base de connaissances avec
              des sources externes fiables.
            </p>
            
            <Button
              onClick={enrichKnowledge}
              disabled={isEnriching}
              size="sm"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600"
            >
              {isEnriching ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Enrichissement en cours...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Lancer Enrichissement
                </>
              )}
            </Button>
          </div>

          {lastEnrichment && (
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-semibold text-green-900">
                  Dernier enrichissement
                </span>
              </div>
              <p className="text-xs text-green-700 mb-2">
                {new Date(lastEnrichment.date).toLocaleString('fr-FR')}
              </p>
              <div className="flex flex-wrap gap-1">
                {lastEnrichment.topics.map((topic, idx) => (
                  <Badge key={idx} className="bg-green-100 text-green-700 text-xs">
                    {topic}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-green-600 mt-2 font-semibold">
                ✓ {lastEnrichment.count} nouvelles connaissances ajoutées
              </p>
            </div>
          )}
        </motion.div>
      )}
    </Card>
  );
}