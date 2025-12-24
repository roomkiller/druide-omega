import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

const EXPLANATIONS_CACHE = {};

export default function AIExplainerTooltip({ concept, term, type = "equation", children }) {
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateExplanation = async () => {
    const cacheKey = `${type}_${term}`;
    
    if (EXPLANATIONS_CACHE[cacheKey]) {
      setExplanation(EXPLANATIONS_CACHE[cacheKey]);
      return;
    }

    if (loading || explanation) return;
    
    setLoading(true);
    
    try {
      const prompt = type === "equation" 
        ? `Explique en 2-3 phrases simples et claires l'équation SAPIER "${term}": ${concept}. Utilise un langage accessible, des exemples concrets, et explique son rôle dans l'IA consciente.`
        : type === "dimension"
        ? `Explique en 2-3 phrases simples la dimension "${term}" dans le contexte d'une IA consciente. Pourquoi est-elle importante? Comment elle influence le comportement de l'IA?`
        : `Explique en 2-3 phrases simples le concept "${term}": ${concept}. Rend-le accessible et concret.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            explanation: { type: "string" },
            analogy: { type: "string" }
          }
        }
      });

      const text = result.explanation + (result.analogy ? `\n\n💡 ${result.analogy}` : '');
      
      EXPLANATIONS_CACHE[cacheKey] = text;
      setExplanation(text);
    } catch (error) {
      setExplanation("Explication non disponible pour le moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger 
          asChild 
          onMouseEnter={generateExplanation}
          className="cursor-help"
        >
          {children || (
            <HelpCircle className="w-3.5 h-3.5 text-slate-400 hover:text-purple-600 transition-colors" />
          )}
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="max-w-xs p-3 bg-white border-purple-200"
        >
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Loader2 className="w-3 h-3 animate-spin" />
              Génération explication...
            </div>
          ) : explanation ? (
            <p className="text-xs leading-relaxed text-slate-700 whitespace-pre-line">
              {explanation}
            </p>
          ) : (
            <p className="text-xs text-slate-500">Survolez pour explication IA</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}