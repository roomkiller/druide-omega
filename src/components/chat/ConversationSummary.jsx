import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Tag, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function ConversationSummary({ summaries }) {
  const [expanded, setExpanded] = React.useState({});

  if (!summaries || summaries.length === 0) return null;

  const toggleExpand = (index) => {
    setExpanded(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {summaries.map((summary, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200/50 overflow-hidden">
              <button
                onClick={() => toggleExpand(index)}
                className="w-full p-4 text-left hover:bg-white/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-slate-900">
                          Résumé • Messages {summary.message_range}
                        </h4>
                        {summary.key_topics && summary.key_topics.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {summary.key_topics.length} sujets
                          </Badge>
                        )}
                      </div>
                      {expanded[index] ? (
                        <ChevronUp className="w-4 h-4 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                      )}
                    </div>

                    {!expanded[index] && (
                      <p className="text-sm text-slate-600 line-clamp-1">
                        {summary.summary}
                      </p>
                    )}
                  </div>
                </div>
              </button>

              <AnimatePresence>
                {expanded[index] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-2 border-t border-indigo-200/50">
                      <p className="text-sm text-slate-700 leading-relaxed mb-3">
                        {summary.summary}
                      </p>
                      
                      {summary.key_topics && summary.key_topics.length > 0 && (
                        <div className="flex items-start gap-2 mb-2">
                          <Tag className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                          <div className="flex flex-wrap gap-1">
                            {summary.key_topics.map((topic, idx) => (
                              <Badge key={idx} variant="secondary" className="bg-white/60 text-indigo-700 text-xs">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {summary.timestamp && (
                        <p className="text-xs text-slate-500">
                          Généré le {format(new Date(summary.timestamp), "d MMM yyyy 'à' HH:mm", { locale: fr })}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}