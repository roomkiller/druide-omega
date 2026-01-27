/**
 * SearchResultsInMessage - Affiche résultats recherche intégrés dans message
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SearchResultsInMessage({ searchResults }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!searchResults || searchResults.searches?.length === 0) return null;

  const webSearches = searchResults.searches.filter(s => s.source === "web_search");
  if (webSearches.length === 0) return null;

  const webSearch = webSearches[0];
  const findings = webSearch.findings || [];
  const topFindings = findings.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-200"
    >
      {/* Header avec recherche */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between group"
      >
        <div className="flex items-center gap-2 text-left flex-1">
          <Globe className="w-5 h-5 text-cyan-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Recherche web enrichie
            </p>
            <p className="text-xs text-slate-600 mt-0.5">
              "{searchResults.searchQuery}"
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 ml-2"
        >
          <ChevronDown className="w-5 h-5 text-slate-400" />
        </motion.div>
      </button>

      {/* Thumbnails toujours visibles */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        {topFindings.map((finding, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white rounded-lg p-2 border border-cyan-200 hover:border-cyan-400 hover:shadow-md transition-all cursor-pointer"
            title={finding.title}
          >
            {/* Thumbnail image or placeholder */}
            <div className="w-full aspect-square bg-gradient-to-br from-cyan-200 to-blue-300 rounded-md flex items-center justify-center text-sm font-bold text-white mb-2">
              {idx + 1}
            </div>
            <p className="text-xs font-medium text-slate-900 line-clamp-2">
              {finding.title}
            </p>
            <p className="text-xs text-cyan-600 mt-1">{finding.source || "Web"}</p>
          </motion.div>
        ))}
      </div>

      {/* Expandable Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-3 overflow-hidden"
          >
            {/* Résumé */}
            {webSearch.summary && (
              <div className="bg-white rounded-lg p-3 border border-cyan-200">
                <p className="text-xs font-semibold text-slate-900 mb-1.5">
                  Résumé
                </p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {webSearch.summary}
                </p>
              </div>
            )}

            {/* Tous les résultats si plus que 3 */}
            {findings.length > 3 && (
              <div className="bg-white rounded-lg p-3 border border-cyan-200">
                <p className="text-xs font-semibold text-slate-900 mb-2">
                  Tous les résultats ({findings.length})
                </p>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {findings.map((finding, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-2 bg-slate-50 rounded-lg border border-slate-200 hover:border-cyan-300 hover:bg-slate-100/50 transition-all"
                    >
                      <p className="text-sm font-medium text-slate-900 line-clamp-2">
                        {finding.title}
                      </p>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                        {finding.content}
                      </p>
                      <Badge className="mt-2 text-xs bg-cyan-100 text-cyan-700">
                        {finding.source || "Web"}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}