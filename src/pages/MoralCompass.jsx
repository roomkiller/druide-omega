/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Moral Compass Page                                         ║
 * ║ Interactive moral and ethical analysis tool                                ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Scale, Sparkles, ArrowLeft } from "lucide-react";
import { createPageUrl } from "@/utils";
import AdvancedMoralAnalyzer from "@/components/consciousness/AdvancedMoralAnalyzer";

const EXAMPLE_SCENARIOS = [
  {
    title: "Dilemme du tramway classique",
    context: "Un tramway hors de contrôle se dirige vers 5 personnes attachées sur les rails. Vous pouvez actionner un levier pour dévier le tramway vers une autre voie où se trouve 1 personne. Devez-vous actionner le levier?"
  },
  {
    title: "Vérité vs Compassion",
    context: "Un ami vous montre son œuvre d'art à laquelle il a consacré des années. Vous trouvez l'œuvre médiocre, mais lui est très fier et vulnérable. Que lui dites-vous?"
  },
  {
    title: "Justice vs Loyauté",
    context: "Vous découvrez qu'un membre de votre famille a commis une fraude financière qui a nui à des dizaines de personnes. Dénoncez-vous cette personne aux autorités?"
  },
  {
    title: "IA et Décision Médicale",
    context: "Une IA doit prioriser l'allocation de ressources médicales limitées pendant une pandémie. Doit-elle favoriser les jeunes (plus d'années de vie potentielles) ou traiter tout le monde équitablement?"
  }
];

export default function MoralCompass() {
  const [scenario, setScenario] = useState("");
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleLoadExample = (example) => {
    setScenario(example.context);
    setShowAnalysis(false);
  };

  const handleAnalyze = () => {
    if (scenario.trim().length > 10) {
      setShowAnalysis(true);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden">
      {/* Header */}
      <div className="flex-none px-4 sm:px-6 py-6 sm:py-8 bg-white/80 backdrop-blur-xl border-b border-indigo-200/60">
        <div className="max-w-5xl mx-auto">
          <Button
            onClick={() => window.location.href = createPageUrl('ArchitectDashboard')}
            variant="ghost"
            size="sm"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour Dashboard
          </Button>
          <div className="flex items-center gap-4">
            <div className="min-w-[56px] min-h-[56px] w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl shadow-lg">
              <Scale className="w-7 h-7 text-white m-auto mt-3.5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-indigo-900">Boussole Morale</h1>
              <p className="text-sm sm:text-base text-indigo-600">
                Analyse philosophique et éthique avancée
              </p>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          {/* Input Section */}
          <Card className="p-6 sm:p-8 mb-6 bg-white/80 backdrop-blur-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              Décrivez une situation morale ou éthique
            </h2>
            
            <Textarea
              placeholder="Ex: Une entreprise d'IA doit choisir entre maximiser les profits ou protéger la vie privée des utilisateurs..."
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              className="min-h-32 mb-4"
            />

            <Button
              onClick={handleAnalyze}
              disabled={scenario.trim().length < 10}
              className="min-h-[48px] bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 touch-target"
            >
              <Scale className="w-4 h-4 mr-2" />
              Analyser Moralement
            </Button>
          </Card>

          {/* Example Scenarios */}
          <Card className="p-6 sm:p-8 mb-6 bg-white/80 backdrop-blur-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Scénarios d'Exemple</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {EXAMPLE_SCENARIOS.map((example, idx) => (
                <Card
                  key={idx}
                  className="p-4 cursor-pointer hover:bg-indigo-50 transition-colors border-2 border-transparent hover:border-indigo-300 touch-target min-h-[120px]"
                  onClick={() => handleLoadExample(example)}
                >
                  <h3 className="font-semibold text-indigo-900 mb-2">{example.title}</h3>
                  <p className="text-sm text-slate-600 line-clamp-3">{example.context}</p>
                </Card>
              ))}
            </div>
          </Card>

          {/* Analysis Result */}
          {showAnalysis && scenario && (
            <AdvancedMoralAnalyzer
              context={scenario}
              autoAnalyze={true}
              onAnalysisComplete={(result) => console.log("Analyse morale:", result)}
            />
          )}

          {/* Info Section */}
          <Card className="p-6 sm:p-8 bg-gradient-to-br from-indigo-100 to-purple-100 border-indigo-300">
            <h2 className="text-lg font-bold text-indigo-900 mb-3">À propos de l'Analyse Morale</h2>
            <div className="space-y-2 text-sm text-indigo-800">
              <p>
                <strong>Kant (Déontologie):</strong> Se concentre sur le devoir moral et les principes universels.
                Une action est bonne si elle respecte l'impératif catégorique.
              </p>
              <p>
                <strong>Mill (Utilitarisme):</strong> Évalue les conséquences. Une action est bonne si elle 
                maximise le bonheur global et minimise la souffrance.
              </p>
              <p>
                <strong>Aristote (Vertus):</strong> Se concentre sur le caractère et les vertus. Une action 
                est bonne si elle cultive l'excellence et favorise l'épanouissement.
              </p>
              <p>
                <strong>Rawls (Justice):</strong> Évalue l'équité et la justice. Une action est bonne si elle 
                respecterait les principes choisis derrière un "voile d'ignorance".
              </p>
              <p>
                <strong>Éthique du Care:</strong> Met l'accent sur les relations, la sollicitude et la responsabilité 
                envers les personnes vulnérables.
              </p>
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}