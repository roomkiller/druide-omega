/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - AI Module Card Component                                   ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Download, Check } from "lucide-react";

export default function AIModuleCard({ module, isInstalled, onInstall }) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="text-4xl">{module.icon}</div>
        <Badge variant={isInstalled ? "default" : "secondary"}>
          {module.category}
        </Badge>
      </div>

      <h3 className="font-bold text-lg mb-2">{module.name}</h3>
      <p className="text-sm text-slate-600 mb-3 line-clamp-2">{module.description}</p>

      <div className="flex items-center gap-3 mb-3 text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          {module.rating}
        </div>
        <div className="flex items-center gap-1">
          <Download className="w-3 h-3" />
          {module.downloads}
        </div>
        <span>v{module.version}</span>
      </div>

      <div className="space-y-2 mb-4">
        {module.features.slice(0, 3).map((feature, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <Check className="w-3 h-3 text-green-600" />
            <span>{feature}</span>
          </div>
        ))}
      </div>

      <Button
        onClick={onInstall}
        disabled={isInstalled}
        className={`w-full ${isInstalled ? 'bg-green-600' : 'bg-purple-600'}`}
      >
        {isInstalled ? (
          <>
            <Check className="w-4 h-4 mr-2" />
            Installé
          </>
        ) : (
          <>
            <Download className="w-4 h-4 mr-2" />
            Installer
          </>
        )}
      </Button>
    </Card>
  );
}