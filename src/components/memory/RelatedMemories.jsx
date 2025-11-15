/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Related Memories Component                                 ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link2, Calendar, Star, Tag, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function RelatedMemories({ currentMemory, allMemories, onMemoryClick }) {
  const relatedMemories = useMemo(() => {
    if (!currentMemory || !allMemories) return [];

    const currentDate = new Date(currentMemory.created_date);
    const related = [];

    allMemories.forEach(memory => {
      if (memory.id === currentMemory.id) return;

      let score = 0;
      const reasons = [];

      // Linked memories (highest priority)
      if (currentMemory.linked_memory_ids?.includes(memory.id)) {
        score += 50;
        reasons.push("Lien direct");
      }

      // Shared tags
      const sharedTags = (currentMemory.tags || []).filter(tag => 
        (memory.tags || []).includes(tag)
      );
      if (sharedTags.length > 0) {
        score += sharedTags.length * 10;
        reasons.push(`${sharedTags.length} tag${sharedTags.length > 1 ? 's' : ''} commun${sharedTags.length > 1 ? 's' : ''}`);
      }

      // Same type
      if (memory.type === currentMemory.type) {
        score += 5;
        reasons.push("Même type");
      }

      // Same modality
      if (memory.modality === currentMemory.modality) {
        score += 5;
        reasons.push("Même modalité");
      }

      // Temporal proximity (within 7 days)
      const memoryDate = new Date(memory.created_date);
      const daysDiff = Math.abs((currentDate - memoryDate) / (1000 * 60 * 60 * 24));
      if (daysDiff <= 7) {
        score += Math.max(0, 10 - daysDiff);
        reasons.push("Proximité temporelle");
      }

      // Context similarity (simple keyword matching)
      if (currentMemory.context && memory.context) {
        const currentWords = currentMemory.context.toLowerCase().split(/\s+/);
        const memoryWords = memory.context.toLowerCase().split(/\s+/);
        const commonWords = currentWords.filter(word => 
          word.length > 4 && memoryWords.includes(word)
        );
        if (commonWords.length > 0) {
          score += commonWords.length * 3;
          reasons.push("Contexte similaire");
        }
      }

      // Emotional context similarity
      if (currentMemory.emotional_context && memory.emotional_context) {
        if (currentMemory.emotional_context.emotion === memory.emotional_context.emotion) {
          score += 8;
          reasons.push("Même émotion");
        }
      }

      if (score > 0) {
        related.push({ memory, score, reasons: [...new Set(reasons)] });
      }
    });

    return related
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  }, [currentMemory, allMemories]);

  if (relatedMemories.length === 0) return null;

  return (
    <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
      <div className="flex items-center gap-2 mb-4">
        <Link2 className="w-5 h-5 text-indigo-600" />
        <h3 className="text-lg font-bold text-slate-900">Mémoires Associées</h3>
        <Badge variant="secondary" className="ml-auto">{relatedMemories.length}</Badge>
      </div>

      <div className="space-y-3">
        {relatedMemories.map(({ memory, score, reasons }, idx) => (
          <motion.div
            key={memory.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="p-4 hover:shadow-md transition-all cursor-pointer bg-white" onClick={() => onMemoryClick?.(memory)}>
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge variant="outline" className="text-xs">
                      {memory.type}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Star className="w-3 h-3 text-yellow-500" />
                      {memory.importance}/10
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(memory.created_date), "d MMM")}
                    </div>
                  </div>

                  <p className="text-sm text-slate-700 line-clamp-2 mb-2">
                    {memory.content}
                  </p>

                  <div className="flex items-center gap-2 flex-wrap">
                    {reasons.map((reason, i) => (
                      <Badge key={i} variant="secondary" className="text-xs bg-indigo-100 text-indigo-700">
                        {reason}
                      </Badge>
                    ))}
                    {memory.tags?.slice(0, 2).map((tag, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        <Tag className="w-2 h-2 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button variant="ghost" size="sm" className="flex-shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}