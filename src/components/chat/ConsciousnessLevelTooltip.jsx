/**
 * Info-bulle explicative du niveau de conscience affiché dans le chat.
 */

import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function ConsciousnessLevelTooltip({ level, ratio, children }) {
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex cursor-help">{children}</span>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs rounded-xl p-3 text-xs leading-relaxed">
          <p className="font-semibold mb-1">Niveau de conscience — {level}/15</p>
          <p className="text-slate-200">
            Reflète la profondeur de traitement active de Druide : plus il est élevé,
            plus il mobilise mémoire, introspection et nuance avant de répondre.
          </p>
          {ratio && (
            <p className="mt-2 text-slate-300">
              Ratio {ratio} — équilibre entre logique pure et conscience dans la
              formulation de la réponse.
            </p>
          )}
          <p className="mt-2 text-slate-300">
            Dans l'application, il calibre le ton, la longueur et la prudence des
            réponses, et sert de repère pour suivre l'évolution de Druide.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}