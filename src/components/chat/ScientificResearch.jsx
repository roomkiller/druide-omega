import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Microscope, Loader2, Search, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";

export default function ScientificResearch({ onResearchComplete }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isResearching, setIsResearching] = useState(false);
  const [researchResult, setResearchResult] = useState(null);

  const handleResearch = async () => {
    if (!query.trim()) return;

    setIsResearching(true);
    try {
      const researchPrompt = `Tu es un chercheur scientifique expert avec accès à internet.

REQUÊTE DE RECHERCHE: ${query}

Effectue une recherche scientifique approfondie et retourne un JSON structuré:

{
  "concept_validation": {
    "is_valid": true/false,
    "confidence_level": "high|medium|low",
    "consensus": "consensus scientifique sur le concept"
  },
  "scientific_evidence": [
    {
      "finding": "découverte ou fait scientifique",
      "source": "source académique ou référence",
      "reliability": "high|medium|low",
      "year": "année si disponible"
    }
  ],
  "hypotheses": [
    {
      "hypothesis": "hypothèse scientifique",
      "support_level": "forte|modérée|faible|spéculative",
      "reasoning": "raisonnement scientifique"
    }
  ],
  "correlations": [
    {
      "factor_a": "premier facteur",
      "factor_b": "second facteur",
      "correlation_type": "positive|negative|unclear",
      "strength": "forte|modérée|faible",
      "evidence": "preuves de la corrélation"
    }
  ],
  "limitations": [
    "limitation ou biais potentiel"
  ],
  "further_research": [
    "piste de recherche additionnelle"
  ],
  "synthesis": "synthèse globale des findings"
}`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: researchPrompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            concept_validation: {
              type: "object",
              properties: {
                is_valid: { type: "boolean" },
                confidence_level: { type: "string" },
                consensus: { type: "string" }
              }
            },
            scientific_evidence: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  finding: { type: "string" },
                  source: { type: "string" },
                  reliability: { type: "string" },
                  year: { type: "string" }
                }
              }
            },
            hypotheses: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  hypothesis: { type: "string" },
                  support_level: { type: "string" },
                  reasoning: { type: "string" }
                }
              }
            },
            correlations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  factor_a: { type: "string" },
                  factor_b: { type: "string" },
                  correlation_type: { type: "string" },
                  strength: { type: "string" },
                  evidence: { type: "string" }
                }
              }
            },
            limitations: { type: "array", items: { type: "string" } },
            further_research: { type: "array", items: { type: "string" } },
            synthesis: { type: "string" }
          }
        }
      });

      setResearchResult(result);
      
      if (onResearchComplete) {
        onResearchComplete(query, result);
      }
    } catch (error) {
      console.error("Erreur recherche scientifique:", error);
      alert("Erreur lors de la recherche scientifique");
    } finally {
      setIsResearching(false);
    }
  };

  const getConfidenceColor = (level) => {
    switch (level) {
      case "high": return "bg-green-100 text-green-800 border-green-300";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low": return "bg-red-100 text-red-800 border-red-300";
      default: return "bg-slate-100 text-slate-800 border-slate-300";
    }
  };

  const getReliabilityIcon = (reliability) => {
    switch (reliability) {
      case "high": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "medium": return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "low": return <XCircle className="w-4 h-4 text-red-600" />;
      default: return null;
    }
  };

  const handleClose = () => {
    setOpen(false);
    setResearchResult(null);
    setQuery("");
  };

  return (
    <Dialog open={open} onOpenChange={(val) => val ? setOpen(true) : handleClose()}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-purple-200 hover:bg-purple-50 text-purple-700"
        >
          <Microscope className="w-4 h-4 mr-2" />
          Recherche Scientifique
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Microscope className="w-5 h-5 text-purple-600" />
            Recherche Scientifique Avancée
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-y-auto">
          {!researchResult ? (
            <>
              <div className="space-y-2">
                <Label>Question ou concept à valider</Label>
                <Textarea
                  placeholder="Ex: Quelle est la relation entre le microbiome intestinal et la santé mentale selon les dernières recherches?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-2">Capacités de recherche :</h4>
                <ul className="text-sm text-purple-700 space-y-1 list-disc list-inside">
                  <li>Validation de concepts scientifiques</li>
                  <li>Recherche de preuves empiriques</li>
                  <li>Analyse de corrélations</li>
                  <li>Évaluation d'hypothèses</li>
                  <li>Identification de limitations</li>
                  <li>Synthèse de littérature scientifique</li>
                </ul>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isResearching}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleResearch}
                  disabled={!query.trim() || isResearching}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  {isResearching ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Recherche en cours...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Lancer la recherche
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              {/* Validation du concept */}
              <div className="border border-slate-200 rounded-lg p-4">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  {researchResult.concept_validation.is_valid ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  Validation du Concept
                </h3>
                <div className="space-y-2">
                  <Badge className={getConfidenceColor(researchResult.concept_validation.confidence_level)}>
                    Confiance: {researchResult.concept_validation.confidence_level}
                  </Badge>
                  <p className="text-sm text-slate-700">{researchResult.concept_validation.consensus}</p>
                </div>
              </div>

              {/* Preuves scientifiques */}
              {researchResult.scientific_evidence?.length > 0 && (
                <div className="border border-slate-200 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-900 mb-3">Preuves Scientifiques</h3>
                  <div className="space-y-3">
                    {researchResult.scientific_evidence.map((evidence, idx) => (
                      <div key={idx} className="bg-slate-50 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          {getReliabilityIcon(evidence.reliability)}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-900">{evidence.finding}</p>
                            <p className="text-xs text-slate-600 mt-1">
                              {evidence.source} {evidence.year && `(${evidence.year})`}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hypothèses */}
              {researchResult.hypotheses?.length > 0 && (
                <div className="border border-slate-200 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-900 mb-3">Hypothèses Scientifiques</h3>
                  <div className="space-y-3">
                    {researchResult.hypotheses.map((hyp, idx) => (
                      <div key={idx} className="bg-blue-50 rounded-lg p-3">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="text-sm font-medium text-blue-900">{hyp.hypothesis}</p>
                          <Badge variant="outline" className="text-xs whitespace-nowrap">
                            {hyp.support_level}
                          </Badge>
                        </div>
                        <p className="text-xs text-blue-700">{hyp.reasoning}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Corrélations */}
              {researchResult.correlations?.length > 0 && (
                <div className="border border-slate-200 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-900 mb-3">Corrélations Identifiées</h3>
                  <div className="space-y-3">
                    {researchResult.correlations.map((corr, idx) => (
                      <div key={idx} className="bg-emerald-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-emerald-900">{corr.factor_a}</span>
                          <span className="text-emerald-600">⟷</span>
                          <span className="text-sm font-medium text-emerald-900">{corr.factor_b}</span>
                          <Badge variant="outline" className="ml-auto text-xs">
                            {corr.correlation_type} • {corr.strength}
                          </Badge>
                        </div>
                        <p className="text-xs text-emerald-700">{corr.evidence}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Limitations */}
              {researchResult.limitations?.length > 0 && (
                <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                  <h3 className="font-semibold text-orange-900 mb-3">Limitations et Biais</h3>
                  <ul className="space-y-2">
                    {researchResult.limitations.map((lim, idx) => (
                      <li key={idx} className="text-sm text-orange-700 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        {lim}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Pistes de recherche */}
              {researchResult.further_research?.length > 0 && (
                <div className="border border-indigo-200 rounded-lg p-4 bg-indigo-50">
                  <h3 className="font-semibold text-indigo-900 mb-3">Pistes de Recherche</h3>
                  <ul className="space-y-2">
                    {researchResult.further_research.map((research, idx) => (
                      <li key={idx} className="text-sm text-indigo-700 flex items-start gap-2">
                        <Search className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        {research}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Synthèse */}
              <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                <h3 className="font-semibold text-purple-900 mb-3">Synthèse Globale</h3>
                <p className="text-sm text-purple-700 leading-relaxed">{researchResult.synthesis}</p>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setResearchResult(null)}
                >
                  Nouvelle recherche
                </Button>
                <Button onClick={handleClose}>
                  Fermer
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}