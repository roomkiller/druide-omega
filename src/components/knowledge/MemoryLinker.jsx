/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Automatic Memory-KB Linker                                 ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link2, Sparkles, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

export default function MemoryLinker({ knowledgeBase, onLinksCreated }) {
  const [isLinking, setIsLinking] = useState(false);
  const [suggestedLinks, setSuggestedLinks] = useState([]);

  const { data: memories = [] } = useQuery({
    queryKey: ['memories'],
    queryFn: () => base44.entities.Memory.list('-importance', 50)
  });

  useEffect(() => {
    if (knowledgeBase && memories.length > 0) {
      findRelevantMemories();
    }
  }, [knowledgeBase?.id]);

  const findRelevantMemories = async () => {
    if (isLinking) return;
    
    setIsLinking(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyse cette source de connaissance et identifie les mémoires pertinentes à lier.

SOURCE KB:
Titre: ${knowledgeBase.title}
Résumé: ${knowledgeBase.summary}
Tags: ${(knowledgeBase.tags || []).join(', ')}
Contenu (extrait): ${knowledgeBase.content?.substring(0, 500)}

MÉMOIRES DISPONIBLES:
${memories.slice(0, 20).map((m, i) => `[${i}] ${m.content} (Type: ${m.type}, Tags: ${(m.tags || []).join(', ')})`).join('\n')}

CRITÈRES DE LIAISON:
1. Chevauchement thématique
2. Tags communs
3. Contexte similaire
4. Complémentarité d'information
5. Référence explicite ou implicite

Identifie jusqu'à 5 mémoires les plus pertinentes à lier.

Retourne JSON:
{
  "suggested_links": [
    {
      "memory_index": 0,
      "relevance_score": 0-100,
      "link_reason": "explication de la pertinence du lien",
      "link_type": "reference|context|related|supports|contradicts",
      "bidirectional": true
    }
  ]
}`,
        response_json_schema: {
          type: "object",
          properties: {
            suggested_links: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  memory_index: { type: "number" },
                  relevance_score: { type: "number" },
                  link_reason: { type: "string" },
                  link_type: { type: "string" },
                  bidirectional: { type: "boolean" }
                }
              }
            }
          }
        }
      });

      const linksWithData = result.suggested_links.map(link => ({
        ...link,
        memory: memories[link.memory_index]
      })).filter(link => link.memory);

      setSuggestedLinks(linksWithData);
    } catch (error) {
      console.error("Erreur liaison mémoires:", error);
    } finally {
      setIsLinking(false);
    }
  };

  const handleCreateLinks = async () => {
    if (suggestedLinks.length === 0) return;

    try {
      // Update KB with memory references
      const memoryRefs = suggestedLinks.map(link => ({
        memory_id: link.memory.id,
        link_type: link.link_type,
        relevance: link.relevance_score,
        reason: link.link_reason
      }));

      await base44.entities.KnowledgeBase.update(knowledgeBase.id, {
        linked_memories: memoryRefs,
        last_memory_link_update: new Date().toISOString()
      });

      // Update memories with KB reference (bidirectional)
      for (const link of suggestedLinks.filter(l => l.bidirectional)) {
        const existingRefs = link.memory.linked_knowledge_bases || [];
        await base44.entities.Memory.update(link.memory.id, {
          linked_knowledge_bases: [
            ...existingRefs,
            {
              kb_id: knowledgeBase.id,
              link_type: link.link_type,
              linked_at: new Date().toISOString()
            }
          ]
        });
      }

      onLinksCreated?.(suggestedLinks);
      setSuggestedLinks([]);
    } catch (error) {
      console.error("Erreur création liens:", error);
    }
  };

  if (suggestedLinks.length === 0 && !isLinking) {
    return (
      <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <Button
          size="sm"
          onClick={findRelevantMemories}
          disabled={isLinking}
          variant="outline"
          className="w-full border-blue-300 text-blue-700"
        >
          <Link2 className="w-4 h-4 mr-2" />
          Rechercher Mémoires Liées
        </Button>
      </Card>
    );
  }

  const linkTypeColors = {
    reference: "bg-blue-100 text-blue-700",
    context: "bg-purple-100 text-purple-700",
    related: "bg-green-100 text-green-700",
    supports: "bg-emerald-100 text-emerald-700",
    contradicts: "bg-red-100 text-red-700"
  };

  return (
    <Card className="p-4 bg-white border-indigo-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Link2 className="w-4 h-4 text-indigo-600" />
          <h4 className="text-sm font-semibold text-slate-900">Mémoires Suggérées</h4>
          <Badge variant="secondary">{suggestedLinks.length}</Badge>
        </div>
        <Button
          size="sm"
          onClick={handleCreateLinks}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <CheckCircle className="w-3 h-3 mr-1" />
          Lier Toutes
        </Button>
      </div>

      <div className="space-y-2">
        {suggestedLinks.map((link, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="p-3 bg-indigo-50/50 border-indigo-100">
              <div className="flex items-start gap-2 mb-2">
                <Badge className={`text-xs ${linkTypeColors[link.link_type]}`}>
                  {link.link_type}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {link.relevance_score}% pertinent
                </Badge>
              </div>
              <p className="text-sm text-slate-900 mb-1 line-clamp-2">
                {link.memory.content}
              </p>
              <p className="text-xs text-slate-600 italic">
                {link.link_reason}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}