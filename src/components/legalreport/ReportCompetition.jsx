import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportCompetition() {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">4. Position face à la compétition</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-slate-300">
        <p>
          <span className="text-purple-300 font-semibold">Nature de l'actif :</span> Druide Omega est une
          couche d'orchestration cognitive construite au-dessus de modèles LLM tiers (DeepSeek, Base44).
          Sa valeur réside dans l'orchestration (7 phases, mémoire persistante, tensions émergentes,
          registre auto-documenté), non dans un modèle d'IA propriétaire.
        </p>
        <p>
          <span className="text-green-300 font-semibold">Force :</span> positionnement de niche —
          aucun des grands acteurs (OpenAI, Microsoft Copilot, Anthropic) ne vend de système nerveux
          organisationnel clé en main avec mémoire longue durée et traçabilité décisionnelle intégrée.
        </p>
        <p>
          <span className="text-red-300 font-semibold">Dépendance :</span> le fonctionnement repose sur des
          API externes (coûts, disponibilité, conditions de licence). Aucun multiple de valorisation des
          géants de l'IA n'est applicable à cet actif.
        </p>
      </CardContent>
    </Card>
  );
}