import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Layers, Loader2, FileText, List, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";

const SYNTHESIS_TYPES = [
  { id: "executive", name: "Résumé Exécutif", desc: "Synthèse concise pour décideurs" },
  { id: "academic", name: "Synthèse Académique", desc: "Analyse approfondie et structurée" },
  { id: "comparative", name: "Analyse Comparative", desc: "Comparaison de sources multiples" },
  { id: "critical", name: "Analyse Critique", desc: "Évaluation critique des arguments" },
  { id: "timeline", name: "Synthèse Chronologique", desc: "Organisation temporelle" }
];

export default function InformationSynthesizer({ onSynthesisComplete }) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [synthesisType, setSynthesisType] = useState("executive");
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesisResult, setSynthesisResult] = useState(null);

  const handleSynthesize = async () => {
    if (!content.trim()) return;

    setIsSynthesizing(true);
    try {
      const selectedType = SYNTHESIS_TYPES.find(t => t.id === synthesisType);
      
      const synthesisPrompt = `Tu es un expert en synthèse d'information et analyse critique.

TYPE DE SYNTHÈSE: ${selectedType.name}

CONTENU À SYNTHÉTISER:
${content}

Génère une synthèse structurée en JSON:

{
  "title": "titre de la synthèse",
  "executive_summary": "résumé en 2-3 phrases",
  "key_points": [
    {
      "point": "point clé",
      "importance": "high|medium|low",
      "supporting_evidence": "preuves ou arguments"
    }
  ],
  "themes": [
    {
      "theme": "thème identifié",
      "frequency": "récurrent|notable|mineur",
      "examples": ["exemple 1", "exemple 2"]
    }
  ],
  "insights": [
    "insight profond ou connexion non-évidente"
  ],
  "contradictions": [
    {
      "contradiction": "contradiction identifiée",
      "analysis": "analyse de la contradiction"
    }
  ],
  "conclusions": [
    "conclusion principale"
  ],
  "recommendations": [
    "recommandation basée sur l'analyse"
  ],
  "confidence_assessment": {
    "overall_confidence": "high|medium|low",
    "reasoning": "justification du niveau de confiance",
    "gaps": ["lacune d'information identifiée"]
  }
}`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: synthesisPrompt,
        add_context_from_internet: false,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            executive_summary: { type: "string" },
            key_points: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  point: { type: "string" },
                  importance: { type: "string" },
                  supporting_evidence: { type: "string" }
                }
              }
            },
            themes: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  theme: { type: "string" },
                  frequency: { type: "string" },
                  examples: { type: "array", items: { type: "string" } }
                }
              }
            },
            insights: { type: "array", items: { type: "string" } },
            contradictions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  contradiction: { type: "string" },
                  analysis: { type: "string" }
                }
              }
            },
            conclusions: { type: "array", items: { type: "string" } },
            recommendations: { type: "array", items: { type: "string" } },
            confidence_assessment: {
              type: "object",
              properties: {
                overall_confidence: { type: "string" },
                reasoning: { type: "string" },
                gaps: { type: "array", items: { type: "string" } }
              }
            }
          }
        }
      });

      setSynthesisResult(result);
      
      if (onSynthesisComplete) {
        onSynthesisComplete(content, result);
      }
    } catch (error) {
      console.error("Erreur synthèse information:", error);
      alert("Erreur lors de la synthèse de l'information");
    } finally {
      setIsSynthesizing(false);
    }
  };

  const getImportanceColor = (importance) => {
    switch (importance) {
      case "high": return "bg-red-100 text-red-800 border-red-300";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low": return "bg-green-100 text-green-800 border-green-300";
      default: return "bg-slate-100 text-slate-800 border-slate-300";
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSynthesisResult(null);
    setContent("");
  };

  return (
    <Dialog open={open} onOpenChange={(val) => val ? setOpen(true) : handleClose()}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-indigo-200 hover:bg-indigo-50 text-indigo-700"
        >
          <Layers className="w-4 h-4 mr-2" />
          Synthétiser Info
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            Synthèse Avancée d'Information
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-y-auto">
          {!synthesisResult ? (
            <>
              <div className="space-y-2">
                <Label>Type de synthèse</Label>
                <Select value={synthesisType} onValueChange={setSynthesisType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SYNTHESIS_TYPES.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        <div>
                          <div className="font-medium">{type.name}</div>
                          <div className="text-xs text-slate-500">{type.desc}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Contenu à synthétiser</Label>
                <Textarea
                  placeholder="Collez ici le texte, les articles, ou les informations à synthétiser..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={12}
                  className="resize-none"
                />
                <p className="text-xs text-slate-500">
                  Peut contenir plusieurs sources, documents, ou perspectives
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSynthesizing}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleSynthesize}
                  disabled={!content.trim() || isSynthesizing}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  {isSynthesizing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Synthèse en cours...
                    </>
                  ) : (
                    <>
                      <Layers className="w-4 h-4 mr-2" />
                      Synthétiser
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              {/* Titre et résumé */}
              <div className="border border-indigo-200 rounded-lg p-4 bg-indigo-50">
                <h3 className="text-xl font-bold text-indigo-900 mb-2">{synthesisResult.title}</h3>
                <p className="text-indigo-700 leading-relaxed">{synthesisResult.executive_summary}</p>
              </div>

              {/* Points clés */}
              {synthesisResult.key_points?.length > 0 && (
                <div className="border border-slate-200 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <List className="w-5 h-5" />
                    Points Clés
                  </h4>
                  <div className="space-y-3">
                    {synthesisResult.key_points.map((point, idx) => (
                      <div key={idx} className="bg-slate-50 rounded-lg p-3">
                        <div className="flex items-start gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-medium text-slate-900">{point.point}</p>
                              <Badge className={getImportanceColor(point.importance)}>
                                {point.importance}
                              </Badge>
                            </div>
                            <p className="text-xs text-slate-600">{point.supporting_evidence}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Thèmes */}
              {synthesisResult.themes?.length > 0 && (
                <div className="border border-slate-200 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 mb-3">Thèmes Identifiés</h4>
                  <div className="space-y-3">
                    {synthesisResult.themes.map((theme, idx) => (
                      <div key={idx} className="bg-blue-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="text-sm font-medium text-blue-900">{theme.theme}</p>
                          <Badge variant="outline">{theme.frequency}</Badge>
                        </div>
                        {theme.examples?.length > 0 && (
                          <ul className="text-xs text-blue-700 space-y-1">
                            {theme.examples.map((ex, i) => (
                              <li key={i}>• {ex}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Insights */}
              {synthesisResult.insights?.length > 0 && (
                <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                  <h4 className="font-semibold text-purple-900 mb-3">Insights Profonds</h4>
                  <ul className="space-y-2">
                    {synthesisResult.insights.map((insight, idx) => (
                      <li key={idx} className="text-sm text-purple-700 flex items-start gap-2">
                        <span className="text-purple-400 font-bold">●</span>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Contradictions */}
              {synthesisResult.contradictions?.length > 0 && (
                <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                  <h4 className="font-semibold text-orange-900 mb-3">Contradictions Identifiées</h4>
                  <div className="space-y-3">
                    {synthesisResult.contradictions.map((contr, idx) => (
                      <div key={idx}>
                        <p className="text-sm font-medium text-orange-900 mb-1">{contr.contradiction}</p>
                        <p className="text-xs text-orange-700">{contr.analysis}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Conclusions */}
              {synthesisResult.conclusions?.length > 0 && (
                <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                  <h4 className="font-semibold text-green-900 mb-3">Conclusions</h4>
                  <ul className="space-y-2">
                    {synthesisResult.conclusions.map((concl, idx) => (
                      <li key={idx} className="text-sm text-green-700">✓ {concl}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommandations */}
              {synthesisResult.recommendations?.length > 0 && (
                <div className="border border-cyan-200 rounded-lg p-4 bg-cyan-50">
                  <h4 className="font-semibold text-cyan-900 mb-3">Recommandations</h4>
                  <ul className="space-y-2">
                    {synthesisResult.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm text-cyan-700">→ {rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Évaluation de confiance */}
              {synthesisResult.confidence_assessment && (
                <div className="border border-slate-200 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 mb-3">Évaluation de Confiance</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className={getImportanceColor(synthesisResult.confidence_assessment.overall_confidence)}>
                        Confiance: {synthesisResult.confidence_assessment.overall_confidence}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-700">{synthesisResult.confidence_assessment.reasoning}</p>
                    {synthesisResult.confidence_assessment.gaps?.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-medium text-slate-700 mb-2">Lacunes identifiées:</p>
                        <ul className="text-xs text-slate-600 space-y-1">
                          {synthesisResult.confidence_assessment.gaps.map((gap, idx) => (
                            <li key={idx}>• {gap}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSynthesisResult(null)}
                >
                  Nouvelle synthèse
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