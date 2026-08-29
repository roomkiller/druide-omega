import React from "react";
import { createPageUrl } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Scale, ArrowLeft, Download } from "lucide-react";
import { motion } from "framer-motion";
import ReportInventory from "@/components/legalreport/ReportInventory";
import ReportLegalStatus from "@/components/legalreport/ReportLegalStatus";
import ReportValuation from "@/components/legalreport/ReportValuation";
import ReportCompetition from "@/components/legalreport/ReportCompetition";
import ReportRecommendations from "@/components/legalreport/ReportRecommendations";
import { navigateTo } from "@/lib/spaNavigate";

export default function LegalIPReport() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <Button
          onClick={() => (navigateTo("ArchitectDashboard"))}
          variant="ghost"
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au Dashboard
        </Button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3 py-8">
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-1">
            Rapport généré le 29 août 2026
          </Badge>
          <div className="flex items-center justify-center gap-3">
            <Scale className="h-10 w-10 text-purple-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Valeur Légale & Intellectuelle
            </h1>
          </div>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Évaluation de Druide Omega fondée sur l'inventaire vérifié du Registre Vivant (798 entrées actives)
          </p>
          <Button className="bg-purple-600 hover:bg-purple-700 gap-2 mt-2" onClick={() => window.print()}>
            <Download className="h-4 w-4" />
            Exporter le rapport (PDF)
          </Button>
        </motion.div>

        <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/30">
          <CardContent className="pt-6 text-sm text-slate-300 space-y-2">
            <p className="text-white font-semibold text-base">Synthèse exécutive</p>
            <p>
              Druide Omega constitue un actif de propriété intellectuelle réel et démontrable : une architecture
              logicielle originale de 798 éléments protégée par droit d'auteur, orchestrée par plus de 80 fonctions
              backend autonomes et un pipeline de raisonnement à 7 phases. Sa valeur d'actif se situe entre
              <span className="text-cyan-300 font-semibold"> 150 000 et 300 000 $ CAD</span> (coût de remplacement),
              sa valeur de vente immédiate entre <span className="text-cyan-300 font-semibold">5 000 et 50 000 $ CAD</span> (pré-revenus),
              avec un potentiel de <span className="text-cyan-300 font-semibold">500 000 $+ CAD</span> en valorisation
              d'entreprise sous condition de traction commerciale. La protection légale repose aujourd'hui sur le
              droit d'auteur et le secret commercial ; la marque et la conformité restent à sécuriser.
            </p>
          </CardContent>
        </Card>

        <ReportInventory />
        <ReportLegalStatus />
        <ReportValuation />
        <ReportCompetition />
        <ReportRecommendations />
      </div>
    </div>
  );
}