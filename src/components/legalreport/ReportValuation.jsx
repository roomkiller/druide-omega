import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const methods = [
  {
    name: "Valeur de remplacement (coût de reconstruction)",
    range: "150 000 – 300 000 $ CAD",
    confidence: "Élevée",
    cls: "border-green-500/40",
    detail: "Reconstruction par une agence québécoise (90-150 $/h) : environ 10 à 18 mois-développeur pour ~175 pages, 500+ composants, 80+ fonctions backend et la visualisation 3D. Nuance : le recours à des outils de développement IA tire la valeur vers le bas de la fourchette.",
  },
  {
    name: "Valeur de vente immédiate (marchés Acquire.com / Flippa)",
    range: "5 000 – 50 000 $ CAD",
    confidence: "Élevée",
    cls: "border-yellow-500/40",
    detail: "Prix réels observés pour des applications pré-revenus, sans utilisateurs payants, quelle que soit leur sophistication technique. Sans revenus, un acheteur acquiert un projet, pas un business.",
  },
  {
    name: "Valorisation en levée de fonds (pré-seed)",
    range: "500 000 – 2 000 000 $ CAD",
    confidence: "Conditionnelle",
    cls: "border-purple-500/40",
    detail: "Fourchette des pré-seed au Canada avec démo forte, fondateur crédible et plan commercial. Il s'agit de la valeur de l'entreprise future, pas de l'application seule — elle exige traction et équipe.",
  },
];

export default function ReportValuation() {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">3. Évaluation financière — trois méthodes reconnues</CardTitle>
        <p className="text-sm text-slate-400">Fourchettes de marché authentiques. Seul un évaluateur agréé (CBV) peut produire un chiffre opposable légalement.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {methods.map((m) => (
          <div key={m.name} className={`bg-slate-700/30 rounded-lg p-4 border ${m.cls}`}>
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
              <p className="font-semibold text-white">{m.name}</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-slate-300 border-slate-500">Fiabilité : {m.confidence}</Badge>
                <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-sm">{m.range}</Badge>
              </div>
            </div>
            <p className="text-sm text-slate-300">{m.detail}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}