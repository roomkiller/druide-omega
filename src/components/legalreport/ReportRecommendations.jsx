import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

const recos = [
  { priority: "1", text: "Obtenir 3 à 5 premiers clients payants — c'est le levier le plus rentable pour transformer la valeur de prototype en valeur commerciale prouvée." },
  { priority: "2", text: "Vérifier la disponibilité de la marque « Druide Omega » (OPIC) avant tout usage commercial, en raison du conflit potentiel avec Druide informatique (Antidote)." },
  { priority: "3", text: "Constituer une preuve d'antériorité du code (dépôt horodaté, archivage notarié ou dépôt volontaire au registre du droit d'auteur canadien, ~50 $)." },
  { priority: "4", text: "Formaliser la confidentialité du savoir-faire (NDA systématiques) pour préserver la protection par secret commercial." },
  { priority: "5", text: "Faire auditer la conformité Loi 25 / RGPD par un tiers si des données personnelles de clients réels sont traitées." },
  { priority: "6", text: "Consulter un avocat en propriété intellectuelle au Québec et, pour un chiffre opposable, un évaluateur d'entreprise agréé (CBV)." },
];

export default function ReportRecommendations() {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">5. Recommandations prioritaires</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {recos.map((r) => (
          <div key={r.priority} className="flex items-start gap-3 bg-slate-700/30 rounded-lg p-3">
            <span className="bg-purple-500/30 text-purple-200 font-bold rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0">{r.priority}</span>
            <p className="text-sm text-slate-300">{r.text}</p>
          </div>
        ))}
        <div className="flex items-start gap-2 mt-4 pt-4 border-t border-slate-700">
          <ChevronRight className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-slate-500">
            Avertissement : ce rapport est un éclairage analytique généré à partir de l'inventaire interne de
            l'application. Il ne constitue ni un avis juridique, ni une évaluation certifiée, ni un document
            opposable à des tiers.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}