import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

const rows = [
  { status: "acquis", title: "Droit d'auteur (code source)", detail: "Protection automatique dès la création au Canada (Loi sur le droit d'auteur) : architecture DruideCore 7 phases, 70 fonctions, 496 composants, visualisation neuronale 3D. Sous réserve des conditions de la plateforme Base44 sur le code généré." },
  { status: "acquis", title: "Secret commercial (savoir-faire)", detail: "L'orchestration spécifique (phases, ratios logique/conscience, tensions émergentes, filaments) constitue un savoir-faire protégeable tant qu'il reste confidentiel." },
  { status: "risque", title: "Marque « Druide Omega »", detail: "Non enregistrée. Risque de conflit réel : « Druide » est une marque établie au Québec (Druide informatique / Antidote). Vérification de disponibilité requise avant usage commercial." },
  { status: "risque", title: "Conformité RGPD / Loi 25 / CCPA", detail: "Mécanismes présents dans le code (consentement, export de données, journal d'audit, 2FA), mais aucune certification ni audit externe : ce sont des déclarations, pas des attestations." },
  { status: "absent", title: "Brevet", detail: "Aucun dépôt. Un brevet logiciel serait coûteux (15 000 – 50 000 $+) et incertain. L'architecture repose sur l'orchestration de LLM tiers (DeepSeek, Base44), non sur un modèle propriétaire." },
  { status: "absent", title: "Contrats et licences commerciales", detail: "Aucun contrat client, licence signée ni revenu récurrent constaté — la valeur légale opposable à des tiers est donc limitée à la PI elle-même." },
];

const config = {
  acquis: { icon: CheckCircle2, cls: "bg-green-500/20 text-green-300 border-green-500/30", label: "Acquis" },
  risque: { icon: AlertTriangle, cls: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30", label: "À sécuriser" },
  absent: { icon: XCircle, cls: "bg-red-500/20 text-red-300 border-red-500/30", label: "Absent" },
};

export default function ReportLegalStatus() {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">2. Statut légal de la propriété intellectuelle</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {rows.map((r) => {
          const c = config[r.status];
          return (
            <div key={r.title} className="flex items-start gap-3 bg-slate-700/30 rounded-lg p-4">
              <c.icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${r.status === "acquis" ? "text-green-400" : r.status === "risque" ? "text-yellow-400" : "text-red-400"}`} />
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="font-semibold text-white">{r.title}</p>
                  <Badge className={c.cls}>{c.label}</Badge>
                </div>
                <p className="text-sm text-slate-300">{r.detail}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}