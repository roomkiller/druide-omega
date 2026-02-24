/**
 * SearchResultsInMessage - Affiche résultats recherche intégrés dans message
 * Priorité: Web search affiché en premier, KB en second
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Globe, BookOpen } from "lucide-react";

export default function SearchResultsInMessage({ searchResults }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!searchResults) return null;

  const searchArray = Array.isArray(searchResults.searches)
    ? searchResults.searches
    : [searchResults];

  if (searchArray.length === 0) return null;

  // Priorité: web_search d'abord, puis knowledge_base
  const webData = searchArray.find(s => s.source === "web_search");
  const kbData = searchArray.find(s => s.source === "knowledge_base");

  // Choisir la source principale à afficher (web > KB)
  const primaryData = webData || kbData;
  if (!primaryData) return null;

  const isWebSearch = primaryData.source === "web_search";

  // Normaliser les findings de la source principale
  const findings = isWebSearch
    ? (primaryData.findings || []).map(f => ({
        title: f.title || "Résultat",
        content: typeof f.content === "string" ? f.content.slice(0, 150) : "",
        source: f.source || "Web"
      }))
    : (primaryData.results || []).map(r => ({
        title: r.title || "Source",
        content: typeof r.excerpt === "string" ? r.excerpt.replace(/#+\s*/g, '').slice(0, 150) : "",
        source: r.source || "Base de connaissances"
      }));

  if (findings.length === 0) return null;

  const topFindings = findings.slice(0, 3);
  const searchQuery = searchResults.searchQuery || primaryData.query || "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-3 rounded-xl border border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50 overflow-hidden"
    >
      {/* Header cliquable */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-cyan-100/40 transition-colors text-left"
      >
        <div className="flex items-center gap-2 min-w-0">
          {isWebSearch
            ? <Globe className="w-4 h-4 text-cyan-600 flex-shrink-0" />
            : <BookOpen className="w-4 h-4 text-indigo-600 flex-shrink-0" />
          }
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 leading-tight">
              {isWebSearch ? "Recherche web" : "Base de connaissances"}
              {webData && kbData && (
                <span className="ml-1.5 text-xs font-normal text-slate-500">+ KB</span>
              )}
            </p>
            {searchQuery && (
              <p className="text-xs text-slate-500 truncate max-w-xs">
                « {searchQuery} »
              </p>
            )}
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </motion.div>
      </button>

      {/* Thumbnails toujours visibles */}
      <div className="px-4 pb-3 grid grid-cols-3 gap-2">
        {topFindings.map((finding, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg border border-cyan-200 overflow-hidden hover:border-cyan-400 hover:shadow-sm transition-all"
          >
            <div className="h-8 bg-gradient-to-r from-cyan-400 to-blue-400 flex items-center justify-center">
              <span className="text-white text-xs font-bold">{idx + 1}</span>
            </div>
            <div className="p-2">
              <p className="text-xs font-medium text-slate-800 line-clamp-2 leading-tight">
                {finding.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Détails expandables */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-cyan-200"
          >
            <div className="px-4 py-3 space-y-2 max-h-72 overflow-y-auto">
              {/* Résumé web */}
              {isWebSearch && primaryData.summary && (
                <div className="bg-white rounded-lg p-3 border border-cyan-100">
                  <p className="text-xs font-semibold text-slate-700 mb-1">Résumé</p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {primaryData.summary}
                  </p>
                </div>
              )}

              {/* Tous les résultats */}
              <div className="space-y-1.5">
                {findings.map((finding, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-lg p-2.5 border border-slate-100 hover:border-cyan-200 transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-bold text-cyan-600 flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800 leading-tight mb-0.5">
                          {finding.title}
                        </p>
                        {finding.content && (
                          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                            {finding.content}
                          </p>
                        )}
                        {finding.source && (
                          <p className="text-xs text-cyan-600 mt-1 font-medium">
                            {finding.source}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Section KB si les deux sont présents */}
              {webData && kbData && kbData.results?.length > 0 && (
                <div className="mt-2 pt-2 border-t border-cyan-100">
                  <p className="text-xs font-semibold text-indigo-700 mb-1.5 flex items-center gap-1">
                    <BookOpen className="w-3 h-3" /> Base de connaissances interne
                  </p>
                  {kbData.results.slice(0, 2).map((r, idx) => (
                    <div key={idx} className="bg-indigo-50 rounded-lg p-2 border border-indigo-100 mb-1.5">
                      <p className="text-xs font-medium text-slate-800 leading-tight">
                        {r.title}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}