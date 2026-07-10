import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Server, Layout, Puzzle } from "lucide-react";

const items = [
  { icon: Server, label: "Services Backend", value: 70, note: "Fonctions orchestrées (DruideCore, moteurs cognitifs, API)" },
  { icon: Database, label: "Entités de données", value: 81, note: "Schémas structurés avec règles de sécurité (RLS)" },
  { icon: Layout, label: "Pages", value: 130, note: "Interfaces publiques, studios et outils d'administration" },
  { icon: Puzzle, label: "Composants", value: 496, note: "Bibliothèque UI modulaire réutilisable" },
];

export default function ReportInventory() {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">1. Inventaire des actifs (Registre Vivant — 798 entrées vérifiées)</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((it) => (
          <div key={it.label} className="bg-slate-700/40 rounded-lg p-4 text-center">
            <it.icon className="h-6 w-6 text-purple-400 mx-auto mb-2" />
            <p className="text-3xl font-bold text-white">{it.value}</p>
            <p className="text-sm font-semibold text-purple-300">{it.label}</p>
            <p className="text-xs text-slate-400 mt-1">{it.note}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}