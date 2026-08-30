/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Version Indicator                                          ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import { APP_VERSION, APP_VERSION_DATE, APP_CODENAME } from "@/lib/changelogData";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Version dérivée du changelog (source unique de vérité)
const VERSION_INFO = {
  version: APP_VERSION,
  buildDate: APP_VERSION_DATE,
  codename: APP_CODENAME || 'Druide Omega'
};

export default function VersionIndicator({ compact = false }) {
  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="text-xs cursor-help">
              v{VERSION_INFO.version}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-xs">
              <p className="font-semibold">{VERSION_INFO.codename}</p>
              <p className="text-slate-500">Build: {VERSION_INFO.buildDate}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
      <Info className="w-4 h-4 text-slate-600" />
      <div className="text-xs">
        <span className="font-semibold text-slate-900">
          Druide Omega v{VERSION_INFO.version}
        </span>
        <span className="text-slate-500 ml-2">- {VERSION_INFO.codename}</span>
      </div>
    </div>
  );
}

export { VERSION_INFO };