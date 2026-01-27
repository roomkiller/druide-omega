/**
 * InfoNet Panel - Affiche résultats recherche web comme notification latérale
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, Globe, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function InfoNetPanel({ searchResults, onDismiss }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!searchResults || searchResults.searches?.length === 0) return null;

  const webSearches = searchResults.searches.filter(s => s.source === "web_search");
  if (webSearches.length === 0) return null;

  const webSearch = webSearches[0]; // Prendre le premier résultat web
  const findings = webSearch.findings || [];
  const topFindings = findings.slice(0, 3); // Max 3 thumbnails

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-72 bg-white border-l border-slate-200 flex flex-col max-h-full"
    >
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-slate-200 sticky top-0 bg-white/95 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-600" />
            <h3 className="font-semibold text-slate-900 text-sm">InfoNet</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDismiss}
            className="h-6 w-6"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
        <Badge className="text-xs bg-cyan-100 text-cyan-700">
          Recherche: {searchResults.searchQuery}
        </Badge>
      </div>

      {/* Thumbnails */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Thumbnails Section */}
        <div>
          <p className="text-xs font-semibold text-slate-600 mb-2">Résultats</p>
          <div className="space-y-2">
            {topFindings.map((finding, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-2.5 border border-cyan-200 hover:border-cyan-400 transition-all cursor-pointer group"
              >
                <div className="flex gap-2">
                  {/* Thumbnail placeholder avec icône */}
                  <div className="w-14 h-14 flex-shrink-0 bg-gradient-to-br from-cyan-200 to-blue-300 rounded-md flex items-center justify-center text-xs font-bold text-white group-hover:shadow-md transition-shadow">
                    {idx + 1}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-xs text-slate-900 line-clamp-2">
                      {finding.title}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                      {finding.source || "Web"}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Expandable Details */}
        <div className="border-t border-slate-200 pt-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 transition-colors group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-xs font-medium text-slate-700">
                Détails recherche
              </span>
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
            </motion.div>
          </button>

          {/* Expanded Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 space-y-2 overflow-hidden"
              >
                {/* Résumé */}
                {webSearch.summary && (
                  <div className="bg-blue-50 rounded-lg p-2 border border-blue-200">
                    <p className="text-xs font-semibold text-blue-900 mb-1">
                      Résumé
                    </p>
                    <p className="text-xs text-blue-800 line-clamp-3">
                      {webSearch.summary}
                    </p>
                  </div>
                )}

                {/* Tous les résultats */}
                {findings.length > 3 && (
                  <div className="bg-slate-50 rounded-lg p-2 border border-slate-200">
                    <p className="text-xs font-semibold text-slate-700 mb-1.5">
                      Tous les résultats ({findings.length})
                    </p>
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {findings.map((finding, idx) => (
                        <div key={idx} className="p-1.5 bg-white rounded border border-slate-200 hover:border-slate-300 transition-colors">
                          <p className="text-xs font-medium text-slate-900 line-clamp-2">
                            {finding.title}
                          </p>
                          <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                            {finding.content}
                          </p>
                          <p className="text-xs text-cyan-600 mt-0.5">
                            {finding.source || "Source"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}