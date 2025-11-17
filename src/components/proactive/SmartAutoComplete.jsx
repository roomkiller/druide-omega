/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Smart Auto-Complete with AI Predictions                    ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PredictiveEngine } from "./PredictiveEngine";

export default function SmartAutoComplete({ currentInput, recentMessages, onSelect }) {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentInput.length > 10) {
      generateSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [currentInput]);

  const generateSuggestions = async () => {
    setIsLoading(true);
    const results = await PredictiveEngine.generateProactiveSuggestions(currentInput, recentMessages);
    setSuggestions(results);
    setIsLoading(false);
  };

  if (suggestions.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="mb-2"
      >
        <Card className="p-3 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-semibold text-slate-700">Suggestions IA</span>
          </div>
          <div className="space-y-1">
            {suggestions.map((sugg, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelect(sugg.text)}
                className="w-full text-left p-2 rounded bg-white hover:bg-purple-50 border border-transparent hover:border-purple-300 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700 group-hover:text-purple-900">
                    {sugg.text}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {sugg.confidence}%
                  </Badge>
                </div>
                <span className="text-xs text-slate-500 capitalize">{sugg.type}</span>
              </motion.button>
            ))}
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}