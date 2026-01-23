/**
 * Search Indicator - Affiche les résultats de recherche intégrés
 */

import React from "react";
import { motion } from "framer-motion";
import { Search, Globe, BookOpen, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SearchIndicator({ searchResults, onDismiss }) {
  if (!searchResults || searchResults.searches?.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mx-12 mt-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Search className="w-4 h-4 text-blue-600" />
            <p className="text-sm font-semibold text-blue-900">
              Recherche enrichie: "{searchResults.searchQuery}"
            </p>
          </div>

          <div className="space-y-2">
            {searchResults.searches.map((search, idx) => (
              <div key={idx} className="text-sm">
                <div className="flex items-center gap-2 mb-1">
                  {search.source === "web_search" ? (
                    <Globe className="w-3 h-3 text-cyan-600" />
                  ) : (
                    <BookOpen className="w-3 h-3 text-indigo-600" />
                  )}
                  <Badge className="text-xs bg-blue-100 text-blue-800">
                    {search.source === "web_search" ? "Web" : "Knowledge Base"}
                  </Badge>
                </div>

                {search.findings && search.findings.length > 0 && (
                  <ul className="ml-4 space-y-1 text-blue-800">
                    {search.findings.slice(0, 2).map((f, i) => (
                      <li key={i} className="text-xs">
                        • <span className="font-medium">{f.title}:</span> {f.content?.slice(0, 60)}...
                      </li>
                    ))}
                  </ul>
                )}

                {search.summary && (
                  <p className="ml-4 text-xs text-blue-700 italic mt-1">
                    {search.summary.slice(0, 100)}...
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="text-blue-400 hover:text-blue-600 transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}