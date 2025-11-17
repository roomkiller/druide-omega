/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Memory Timeline Visualization                              ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Calendar,
  MessageCircle,
  Mic,
  Eye,
  Brain,
  TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";
import { format, isToday, isYesterday, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";

export default function MemoryTimeline({ memories = [], onMemoryClick }) {
  const groupedMemories = useMemo(() => {
    const sorted = [...memories].sort((a, b) => 
      new Date(b.created_date).getTime() - new Date(a.created_date).getTime()
    );

    const groups = {};
    sorted.forEach(memory => {
      const date = new Date(memory.created_date);
      let key;
      
      if (isToday(date)) {
        key = "Aujourd'hui";
      } else if (isYesterday(date)) {
        key = "Hier";
      } else if (differenceInDays(new Date(), date) <= 7) {
        key = format(date, 'EEEE', { locale: fr });
      } else if (differenceInDays(new Date(), date) <= 30) {
        key = "Ce mois-ci";
      } else if (differenceInDays(new Date(), date) <= 90) {
        key = "3 derniers mois";
      } else {
        key = format(date, 'MMMM yyyy', { locale: fr });
      }

      if (!groups[key]) groups[key] = [];
      groups[key].push(memory);
    });

    return groups;
  }, [memories]);

  const getModalityIcon = (modality) => {
    switch (modality) {
      case 'chat': return <MessageCircle className="w-4 h-4" />;
      case 'voice': return <Mic className="w-4 h-4" />;
      case 'visual': return <Eye className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const getModalityColor = (modality) => {
    switch (modality) {
      case 'chat': return 'from-blue-500 to-cyan-500';
      case 'voice': return 'from-green-500 to-emerald-500';
      case 'visual': return 'from-purple-500 to-pink-500';
      default: return 'from-indigo-500 to-purple-500';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Timeline des Mémoires</h2>
        <Badge className="ml-auto bg-purple-100 text-purple-700">
          {memories.length} mémoires
        </Badge>
      </div>

      <ScrollArea className="h-[600px]">
        <div className="space-y-6">
          {Object.entries(groupedMemories).map(([period, periodMemories], groupIdx) => (
            <div key={period} className="relative">
              {/* Period Header */}
              <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg px-4 py-2 mb-4 border border-purple-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 capitalize">{period}</h3>
                  <Badge variant="outline" className="text-xs">
                    {periodMemories.length} mémoires
                  </Badge>
                </div>
              </div>

              {/* Timeline */}
              <div className="relative pl-8">
                {/* Vertical Line */}
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-300 via-indigo-300 to-purple-300" />

                {periodMemories.map((memory, idx) => (
                  <motion.div
                    key={memory.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: groupIdx * 0.1 + idx * 0.05 }}
                    className="relative mb-6 group"
                  >
                    {/* Timeline Dot */}
                    <div 
                      className={`absolute -left-5 top-3 w-4 h-4 rounded-full bg-gradient-to-br ${getModalityColor(memory.modality)} border-2 border-white shadow-lg z-10`}
                    />

                    {/* Memory Card */}
                    <div 
                      className="bg-white rounded-lg border border-slate-200 p-4 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer ml-4"
                      onClick={() => onMemoryClick?.(memory)}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className={`p-1.5 rounded-lg bg-gradient-to-br ${getModalityColor(memory.modality)}`}>
                            {getModalityIcon(memory.modality)}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {memory.type}
                          </Badge>
                          {memory.importance >= 7 && (
                            <Badge className="bg-orange-100 text-orange-700 text-xs flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              Important
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-slate-500 flex-shrink-0">
                          {format(new Date(memory.created_date), 'HH:mm')}
                        </span>
                      </div>

                      <p className="text-sm text-slate-700 mb-2 line-clamp-2">
                        {memory.content}
                      </p>

                      {memory.context && (
                        <p className="text-xs text-slate-500 italic mb-2 line-clamp-1">
                          {memory.context}
                        </p>
                      )}

                      {memory.tags && memory.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {memory.tags.slice(0, 3).map((tag, tagIdx) => (
                            <Badge key={tagIdx} variant="outline" className="text-[10px]">
                              {tag}
                            </Badge>
                          ))}
                          {memory.tags.length > 3 && (
                            <Badge variant="outline" className="text-[10px]">
                              +{memory.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Access Count */}
                      {memory.access_count > 0 && (
                        <div className="mt-2 pt-2 border-t border-slate-100">
                          <span className="text-[10px] text-slate-500">
                            Accédée {memory.access_count} fois
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}