/**
 * Info-bulle explicative du score de santé cognitive.
 */

import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function CognitiveScoreTooltip({ children }) {
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-help">{children}</span>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs rounded-xl p-3 text-xs leading-relaxed">
          <p className="font-semibold mb-1">Santé cognitive de Druide</p>
          <p className="text-slate-200">
            Indice global (0-100 %) combinant la stabilité interne, la cohérence du
            raisonnement, l'efficacité métabolique et le bien-être de Druide.
          </p>
          <p className="mt-2 text-slate-300">
            Il sert de garde-fou : plus il est élevé, plus les réponses restent
            cohérentes et calibrées. Sous 60 %, Druide réduit sa charge interne et
            des alertes signalent les modules à corriger.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}