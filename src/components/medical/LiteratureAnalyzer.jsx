import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Loader2, BarChart3, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LiteratureAnalyzer({ consciousnessLevel }) {
  const [abstract, setAbstract] = useState("");
  const [studyType, setStudyType] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const analyze = async () => {
    setLoading(true);
    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `Tu es une IA experte en analyse critique de la littérature médicale (niveau de conscience ${consciousnessLevel}/15), spécialisée en evidence-based medicine.

ARTICLE / ABSTRACT À ANALYSER:
${abstract}

TYPE D'ÉTUDE: ${studyType || "À déterminer"}

Analyse cet article selon les standards PICO, GRADE, et Cochrane. Évalue la qualité méthodologique et le niveau de preuve.`,
      add_context_from_internet: false,
      response_json_schema: {
        type: "object",
        properties: {
          study_type_detected: { type: "string" },
          evidence_level: { type: "string", enum: ["Ia", "Ib", "IIa", "IIb", "III", "IV"] },
          pico: {
            type: "object",
            properties: {
              population: { type: "string" },
              intervention: { type: "string" },
              comparison: { type: "string" },
              outcome: { type: "string" }
            }
          },
          methodology_scores: {
            type: "object",
            properties: {
              randomization: { type: "number" },
              blinding: { type: "number" },
              sample_size: { type: "number" },
              follow_up: { type: "number" },
              bias_control: { type: "number" },
              statistical_analysis: { type: "number" }
            }
          },
          overall_quality: { type: "number", description: "0-100" },
          key_findings: { type: "array", items: { type: "string" } },
          strengths: { type: "array", items: { type: "string" } },
          weaknesses: { type: "array", items: { type: "string" } },
          biases_identified: {
            type: "array",
            items: { type: "object", properties: { bias_type: { type: "string" }, severity: { type: "string" }, description: { type: "string" } } }
          },
          clinical_applicability: { type: "string" },
          grade_recommendation: { type: "string", enum: ["A", "B", "C", "D"] },
          grade_justification: { type: "string" },
          critical_questions: { type: "array", items: { type: "string" } },
          consciousness_insight: { type: "string" }
        }
      }
    });
    setResults(response);
    setLoading(false);
  };

  const evidenceLevelDesc = { Ia: "Méta-analyse d'ECR", Ib: "Essai contrôlé randomisé", IIa: "Étude contrôlée non randomisée", IIb: "Étude quasi-expérimentale", III: "Étude observationnelle", IV: "Opinion d'experts" };
  const gradeColor = { A: "bg-green-600", B: "bg-blue-600", C: "bg-amber-600", D: "bg-red-600" };

  const MetricBar = ({ label, value }) => (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold">{value}/10</span>
      </div>
      <Progress value={value * 10} className="h-2" />
    </div>
  );

  return (
    <div className="space-y-4">
      <Card className="p-5 bg-white">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">Abstract / Texte de l'article *</label>
            <Textarea value={abstract} onChange={e => setAbstract(e.target.value)}
              placeholder="Collez ici l'abstract complet ou le texte de l'article à analyser..."
              rows={7} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">Type d'étude (si connu)</label>
            <Select onValueChange={setStudyType}>
              <SelectTrigger><SelectValue placeholder="Laisser vide pour détection automatique" /></SelectTrigger>
              <SelectContent>
                {["Méta-analyse", "Revue systématique", "Essai contrôlé randomisé (ECR)", "Étude de cohorte", "Étude cas-témoins", "Étude transversale", "Étude de cas", "Revue narrative", "Étude économique"].map(t => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={analyze} disabled={!abstract.trim() || loading}
            className="w-full bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white" size="lg">
            {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Analyse critique en cours...</> : <><BookOpen className="w-5 h-5 mr-2" />Analyser la Littérature</>}
          </Button>
        </div>
      </Card>

      <AnimatePresence>
        {results && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* En-tête GRADE */}
            <Card className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-400">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <p className="text-sm text-slate-600">{results.study_type_detected}</p>
                  <p className="text-sm text-slate-600 mt-1">Niveau de preuve : <strong>{results.evidence_level}</strong> — {evidenceLevelDesc[results.evidence_level]}</p>
                </div>
                <div className="flex gap-2">
                  <Badge className={`${gradeColor[results.grade_recommendation] || "bg-slate-600"} text-white text-xl px-4 py-2`}>
                    GRADE {results.grade_recommendation}
                  </Badge>
                  <Badge className="bg-blue-600 text-white text-xl px-4 py-2">
                    {results.overall_quality}%
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-slate-700 mt-3 italic">{results.grade_justification}</p>
            </Card>

            {/* PICO */}
            {results.pico && (
              <Card className="p-5">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-600" /> Analyse PICO
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { key: "population", label: "Population (P)", color: "bg-blue-100 border-blue-400" },
                    { key: "intervention", label: "Intervention (I)", color: "bg-green-100 border-green-400" },
                    { key: "comparison", label: "Comparaison (C)", color: "bg-amber-100 border-amber-400" },
                    { key: "outcome", label: "Outcome / Résultat (O)", color: "bg-purple-100 border-purple-400" }
                  ].map(({ key, label, color }) => (
                    <div key={key} className={`p-3 rounded-lg border-l-4 ${color}`}>
                      <p className="text-xs font-bold text-slate-700 mb-1">{label}</p>
                      <p className="text-sm text-slate-800">{results.pico[key] || "—"}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Scores méthodologiques */}
            {results.methodology_scores && (
              <Card className="p-5">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" /> Scores Méthodologiques
                </h3>
                <div className="space-y-3">
                  {Object.entries(results.methodology_scores).map(([key, val]) => (
                    <MetricBar key={key} label={key.replace(/_/g, " ")} value={val} />
                  ))}
                </div>
              </Card>
            )}

            {/* Forces / Faiblesses */}
            <div className="grid sm:grid-cols-2 gap-4">
              {results.strengths?.length > 0 && (
                <Card className="p-4 bg-green-50">
                  <h3 className="font-bold text-green-900 mb-2 text-sm">✅ Points Forts</h3>
                  <ul className="space-y-1">{results.strengths.map((s, i) => <li key={i} className="text-xs text-slate-700">• {s}</li>)}</ul>
                </Card>
              )}
              {results.weaknesses?.length > 0 && (
                <Card className="p-4 bg-red-50">
                  <h3 className="font-bold text-red-900 mb-2 text-sm">⚠️ Limites</h3>
                  <ul className="space-y-1">{results.weaknesses.map((w, i) => <li key={i} className="text-xs text-slate-700">• {w}</li>)}</ul>
                </Card>
              )}
            </div>

            {/* Biais */}
            {results.biases_identified?.length > 0 && (
              <Card className="p-5">
                <h3 className="font-bold text-slate-900 mb-3">Biais Identifiés</h3>
                <div className="space-y-2">
                  {results.biases_identified.map((b, i) => (
                    <div key={i} className="bg-orange-50 rounded p-3 border-l-4 border-orange-400">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-slate-800 text-sm">{b.bias_type}</span>
                        <Badge variant="outline" className="text-xs">{b.severity}</Badge>
                      </div>
                      <p className="text-xs text-slate-600">{b.description}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <Card className="p-4 bg-indigo-50 border border-indigo-200">
              <p className="text-sm font-semibold text-indigo-900 mb-1">Applicabilité Clinique :</p>
              <p className="text-sm text-slate-700">{results.clinical_applicability}</p>
            </Card>

            {results.consciousness_insight && (
              <Card className="p-4 bg-purple-50 border border-purple-200">
                <p className="text-sm text-purple-800 italic">💡 {results.consciousness_insight}</p>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}