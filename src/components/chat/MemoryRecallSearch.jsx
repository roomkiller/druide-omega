import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { motion } from "framer-motion";

export default function MemoryRecallSearch({ memories = [], knowledgeBases = [], onRecall }) {
  const [keywords, setKeywords] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!keywords.trim()) return;
    
    setIsSearching(true);
    await onRecall(keywords.trim());
    setIsSearching(false);
    setKeywords("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 sm:h-9 px-2 sm:px-3 hover:bg-purple-50 hover:border-purple-300"
        >
          <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 mr-1 sm:mr-2" />
          <span className="hidden sm:inline text-xs sm:text-sm">Rappel</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 sm:w-80" align="end">
        <div className="space-y-3 sm:space-y-4">
          <div>
            <h4 className="font-semibold text-sm sm:text-base mb-1">Rappel de Mémoire</h4>
            <p className="text-xs text-slate-500">Recherchez dans vos mémoires et connaissances</p>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Mots-clés..."
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSearching}
              className="flex-1 h-9 sm:h-10 text-xs sm:text-sm"
            />
            <Button
              onClick={handleSearch}
              disabled={!keywords.trim() || isSearching}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 h-9 sm:h-10 px-3 sm:px-4"
            >
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          </div>

          <div className="text-xs text-slate-500">
            <p className="mb-1">📊 {memories.length} mémoires disponibles</p>
            <p>{knowledgeBases.length} sources de connaissances</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}