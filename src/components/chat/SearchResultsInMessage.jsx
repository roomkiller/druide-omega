/**
 * SearchResultsInMessage - Affiche résultats recherche intégrés dans message
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SearchResultsInMessage({ searchResults }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!searchResults) return null;

  // Supporter deux formats: {searches: [...]} ou direct {source, findings, ...}
  const searchData = searchResults.searches ? searchResults.searches[0] : searchResults;
  if (!searchData) return null;

  const isWebSearch = searchData.source === "web_search";
  const isKB = searchData.source === "knowledge_base";
  
  if (!isWebSearch && !isKB) return null;

  // Normaliser structure
  const findings = isWebSearch 
    ? (searchData.findings || []).map(f => ({
        title: f.title,
        content: f.content,
        source: f.source || "Web"
      }))
    : (searchData.results || []).map(r => ({
        title: r.title,
        content: r.summary || r.excerpt,
        source: r.source || "Knowledge Base"
      }));

  const topFindings = findings.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-200 w-full overflow-hidden"
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
                {isWebSearch ? "Recherche web enrichie" : "Sources de la base de connaissances"}
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                "{searchResults.searchQuery || searchData.query || 'Recherche'}"
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

      {/* Thumbnails toujours visibles - compact */}
      <div className="mt-3 grid grid-cols-3 gap-2 w-full">
        {topFindings.map((finding, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white rounded-lg overflow-hidden border border-cyan-200 hover:border-cyan-400 hover:shadow-md transition-all cursor-pointer group"
            title={finding.title}
          >
            {/* Thumbnail image or placeholder - réduit */}
            <div className="w-full h-20 bg-gradient-to-br from-cyan-100 to-blue-200 rounded-t-md flex flex-col items-center justify-center text-sm font-bold text-slate-600 relative overflow-hidden">
              {/* Placeholder avec icône + numéro */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-lg font-bold text-cyan-600">{idx + 1}</div>
                </div>
              </div>
              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200"></div>
            </div>
            <div className="p-1.5">
              <p className="text-xs font-medium text-slate-900 line-clamp-1">
                {finding.title}
              </p>
              <p className="text-xs text-cyan-600 mt-0.5 truncate">{finding.source || "Web"}</p>
            </div>
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
            className="mt-4 space-y-3 overflow-visible w-full"
          >
            {/* Résumé */}
            {searchData.summary && (
              <div className="bg-white rounded-lg p-3 border border-cyan-200">
                <p className="text-xs font-semibold text-slate-900 mb-1.5">
                  Résumé
                </p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {searchData.summary}
                </p>
              </div>
            )}

            {/* Tous les résultats si plus que 3 */}
            {findings.length > 3 && (
              <div className="bg-white rounded-lg p-3 border border-cyan-200">
                <p className="text-xs font-semibold text-slate-900 mb-2">
                  Tous les résultats ({findings.length})
                </p>
                <div className="space-y-2 max-h-60 overflow-y-auto w-full">
                   {findings.map((finding, idx) => (
                     <motion.div
                       key={idx}
                       initial={{ opacity: 0, x: -10 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ delay: idx * 0.05 }}
                       className="p-2 bg-slate-50 rounded-lg border border-slate-200 hover:border-cyan-300 hover:bg-slate-100/50 transition-all w-full min-w-0"
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