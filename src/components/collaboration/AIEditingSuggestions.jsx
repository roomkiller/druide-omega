/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - AI Editing Suggestions Panel                               ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, X, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function AIEditingSuggestions({ suggestions, onApply, onDismiss }) {
  const severityColors = {
    low: "bg-blue-100 text-blue-700",
    medium: "bg-orange-100 text-orange-700",
    high: "bg-red-100 text-red-700"
  };

  const typeIcons = {
    clarity: "💡",
    conciseness: "✂️",
    grammar: "📝",
    style: "🎨"
  };

  if (suggestions.length === 0) {
    return (
      <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="text-center">
          <Check className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-sm text-slate-600">Aucune suggestion</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-purple-600" />
        <h3 className="font-semibold text-slate-900">Suggestions IA</h3>
        <Badge variant="secondary">{suggestions.length}</Badge>
      </div>

      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="space-y-3">
          {suggestions.map((suggestion, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="p-3 border-purple-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{typeIcons[suggestion.type]}</span>
                  <Badge className={severityColors[suggestion.severity]}>
                    {suggestion.severity}
                  </Badge>
                </div>

                <p className="text-xs text-slate-600 mb-2">{suggestion.reason}</p>

                <div className="space-y-2">
                  <div className="p-2 bg-red-50 rounded text-xs line-through text-red-700">
                    {suggestion.original}
                  </div>
                  <div className="p-2 bg-green-50 rounded text-xs text-green-700">
                    {suggestion.suggested}
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    onClick={() => onApply(suggestion)}
                    className="flex-1 bg-purple-600"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Appliquer
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDismiss(suggestion)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}