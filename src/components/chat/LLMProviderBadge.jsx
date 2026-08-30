import React from "react";
import { Badge } from "@/components/ui/badge";
import { Zap, AlertTriangle, CircleOff, Cpu } from "lucide-react";

const PROVIDERS = {
  openrouter: { label: "OpenRouter actif", className: "bg-emerald-100 text-emerald-800 border-emerald-300", Icon: Zap },
  platform_credits: { label: "Crédits plateforme (OpenRouter indisponible)", className: "bg-amber-100 text-amber-800 border-amber-300", Icon: AlertTriangle },
  deepseek: { label: "DeepSeek de secours (OpenRouter épuisé)", className: "bg-orange-100 text-orange-800 border-orange-300", Icon: AlertTriangle },
  disabled: { label: "Raisonnement LLM éteint", className: "bg-slate-100 text-slate-700 border-slate-300", Icon: CircleOff },
  memory: { label: "Répondu par la mémoire (sans LLM)", className: "bg-indigo-100 text-indigo-800 border-indigo-300", Icon: Cpu }
};

export default function LLMProviderBadge({ provider, failures = [] }) {
  const key = provider || "memory";
  const cfg = PROVIDERS[key];
  if (!cfg) return null;
  const { label, className, Icon } = cfg;
  const reason = failures?.length > 0 ? failures.join(" · ") : null;

  return (
    <Badge variant="outline" className={`${className} text-xs gap-1`} title={reason || label}>
      <Icon className="w-3 h-3" />
      {label}
    </Badge>
  );
}