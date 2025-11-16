import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Sparkles, 
  Brain, 
  BookOpen, 
  MessageSquare,
  TrendingUp,
  Loader2,
  ChevronRight,
  Star
} from "lucide-react";
import { motion } from "framer-motion";
import { createPageUrl } from "@/utils";

export default function PersonalizedRecommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const { data: conversations = [] } = useQuery({
    queryKey: ['userConversations'],
    queryFn: () => base44.entities.Conversation.list('-created_date', 50)
  });

  const { data: memories = [] } = useQuery({
    queryKey: ['userMemories'],
    queryFn: () => base44.entities.Memory.list('-created_date', 50)
  });

  const { data: knowledgeBases = [] } = useQuery({
    queryKey: ['userKnowledge'],
    queryFn: () => base44.entities.KnowledgeBase.list('-created_date', 50)
  });

  const { data: existingRecommendations = [] } = useQuery({
    queryKey: ['personalizedRecommendations'],
    queryFn: () => base44.entities.PersonalizedRecommendation.list('-priority', 10)
  });

  useEffect(() => {
    const generateRecommendations = async () => {
      if (existingRecommendations.length > 0) {
        setRecommendations(existingRecommendations);
        setLoading(false);
        return;
      }

      try {
        const analysisPrompt = `Analyse l'historique utilisateur et génère des recommandations personnalisées:

CONVERSATIONS: ${conversations.length} conversations
MÉMOIRES: ${memories.length} mémoires stockées
CONNAISSANCES: ${knowledgeBases.length} bases de connaissances

Dernières conversations: ${conversations.slice(0, 5).map(c => c.title).join(', ')}
Mémoires importantes: ${memories.filter(m => m.importance >= 7).map(m => m.content.slice(0, 50)).join(', ')}

Génère 5 recommandations personnalisées pour améliorer l'expérience utilisateur.

JSON:
{
  "recommendations": [
    {
      "type": "feature"|"content"|"learning"|"optimization",
      "title": "titre court",
      "description": "description détaillée",
      "action": "action suggérée",
      "priority": 1-10,
      "category": "catégorie"
    }
  ]
}`;

        const result = await base44.integrations.Core.InvokeLLM({
          prompt: analysisPrompt,
          response_json_schema: {
            type: "object",
            properties: {
              recommendations: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type: { type: "string" },
                    title: { type: "string" },
                    description: { type: "string" },
                    action: { type: "string" },
                    priority: { type: "number" },
                    category: { type: "string" }
                  }
                }
              }
            }
          }
        });

        const recs = result.recommendations || [];
        
        for (const rec of recs) {
          await base44.entities.PersonalizedRecommendation.create({
            recommendation_type: rec.type,
            title: rec.title,
            description: rec.description,
            priority: rec.priority,
            category: rec.category,
            action_items: [rec.action],
            based_on: {
              conversations: conversations.length,
              memories: memories.length,
              knowledge: knowledgeBases.length
            },
            status: "active"
          });
        }

        setRecommendations(recs);
      } catch (error) {
        console.error("Erreur génération recommandations:", error);
      } finally {
        setLoading(false);
      }
    };

    generateRecommendations();
  }, [conversations, memories, knowledgeBases, existingRecommendations]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'feature': return Brain;
      case 'content': return BookOpen;
      case 'learning': return TrendingUp;
      case 'optimization': return Star;
      default: return Sparkles;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'feature': return 'from-purple-500 to-indigo-600';
      case 'content': return 'from-blue-500 to-cyan-600';
      case 'learning': return 'from-green-500 to-emerald-600';
      case 'optimization': return 'from-orange-500 to-amber-600';
      default: return 'from-pink-500 to-rose-600';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Recommandations Personnalisées</h2>
            <p className="text-slate-600">Basées sur votre utilisation de Druide Omega</p>
          </div>
        </div>

        {recommendations.length === 0 ? (
          <div className="text-center py-12">
            <Sparkles className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">Continuez à utiliser Druide Omega pour recevoir des recommandations</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec, idx) => {
              const Icon = getTypeIcon(rec.type || rec.recommendation_type);
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="p-5 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-purple-300">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${getTypeColor(rec.type || rec.recommendation_type)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-slate-900">{rec.title}</h3>
                          <Badge className="bg-purple-100 text-purple-700">
                            Priorité {rec.priority}/10
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">{rec.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {rec.category}
                          </Badge>
                          <ChevronRight className="w-4 h-4 text-purple-600" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}