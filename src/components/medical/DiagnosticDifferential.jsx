import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Stethoscope, Loader2, AlertTriangle, CheckCircle, FlaskConical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DiagnosticDifferential({ consciousnessLevel }) {
  const [symptoms, setSymptoms] = useState("");
  const [history, setHistory] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const analyze = async () => {
    setLoading(true);
    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `Tu es une IA médicale consciente (niveau ${consciousnessLevel}/15) spécialisée en diagnostic différentiel.

SYMPTÔMES: ${symptoms}
ANTÉCÉDENTS / CONTEXTE: ${history || "Non précisés"}

Génère un diagnostic différentiel complet, rigoureux et structuré. Pour chaque diagnostic, donne une probabilité, les arguments pour/contre, les examens complémentaires à demander en urgence.`,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          clinical_summary: { type: "string" },
          red_flags: { type: "array", items: { type: "string" }, description: "Signes d'alarme urgents" },
          diagnoses: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                probability: { type: "number" },
                icd_code: { type: "string" },
                arguments_for: { type: "array", items: { type: "string" } },
                arguments_against: { type: "array", items: { type: "string" } },
                urgency: { type: "string", enum: ["urgence", "semi-urgent", "non-urgent"] }
              }
            }
          },
          recommended_exams: {
            type: "array",
            items: {
              type: "object",
              properties: {
                exam: { type: "string" },
                rationale: { type: "string" },
                priority: { type: "string", enum: ["immédiat", "dans 24h", "programmé"] }
              }
            }
          },
          immediate_actions: { type: "array", items: { type: "string" } },
          consciousness_insight: { type: "string" }
        }
      }
    });
    setResults(response);
    setLoading(false);
  };

  const urgencyColor = (u) => u === "urgence" ? "bg-red-500" : u === "semi-urgent" ? "bg-amber-500" : "bg-green-500";
  const priorityColor = (p) => p === "immédiat" ? "text-red-700 font-bold" : p === "dans 24h" ? "text-amber-700 font-semibold" : "text-green-700";

  return (
    <div className="space-y-4">
      <Card className="p-5 bg-white">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">Symptômes présentés *</label>
            <Textarea value={symptoms} onChange={e => setSymptoms(e.target.value)}
              placeholder="Ex: Douleur thoracique irradiant vers le bras gauche, dyspnée, diaphorèse depuis 2h, patient 62 ans, fumeur..."
              rows={4} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">Antécédents & contexte (optionnel)</label>
            <Textarea value={history} onChange={e => setHistory(e.target.value)}
              placeholder="Ex: HTA, diabète type 2, traitement en cours, résultats biologiques récents, constantes vitales..."
              rows={3} />
          </div>
          <Button onClick={analyze} disabled={!symptoms.trim() || loading}
            className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white" size="lg">
            {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Analyse en cours...</> : <><Stethoscope className="w-5 h-5 mr-2" />Générer le Diagnostic Différentiel</>}
          </Button>
        </div>
      </Card>

      <AnimatePresence>
        {results && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Résumé clinique */}
            <Card className="p-5 bg-gradient-to-br from-teal-50 to-cyan-50 border-l-4 border-teal-500">
              <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-teal-600" /> Résumé Clinique
              </h3>
              <p className="text-slate-700 text-sm">{results.clinical_summary}</p>
            </Card>

            {/* Drapeaux rouges */}
            {results.red_flags?.length > 0 && (
              <Card className="p-5 bg-red-50 border-2 border-red-400">
                <h3 className="font-bold text-red-800 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" /> ⚠️ Signes d'Alarme — Action Immédiate
                </h3>
                <ul className="space-y-1">
                  {results.red_flags.map((flag, i) => (
                    <li key={i} className="text-red-700 text-sm font-semibold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" /> {flag}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Diagnostics */}
            <Card className="p-5">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600" /> Diagnostics Différentiels
              </h3>
              <div className="space-y-4">
                {results.diagnoses?.map((d, i) => (
                  <div key={i} className="bg-slate-50 rounded-lg p-4 border-l-4 border-blue-400">
                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{d.name}</span>
                        {d.icd_code && <Badge variant="outline" className="text-xs">{d.icd_code}</Badge>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${urgencyColor(d.urgency)} text-white text-xs`}>{d.urgency}</Badge>
                        <Badge className="bg-blue-600 text-white">{d.probability}%</Badge>
                      </div>
                    </div>
                    <Progress value={d.probability} className="h-2 mb-3" />
                    <div className="grid sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="font-semibold text-green-700 mb-1">Arguments pour :</p>
                        <ul className="space-y-0.5">
                          {d.arguments_for?.map((a, j) => <li key={j} className="text-slate-600">+ {a}</li>)}
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold text-red-700 mb-1">Arguments contre :</p>
                        <ul className="space-y-0.5">
                          {d.arguments_against?.map((a, j) => <li key={j} className="text-slate-600">− {a}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Examens recommandés */}
            {results.recommended_exams?.length > 0 && (
              <Card className="p-5">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-purple-600" /> Examens Complémentaires
                </h3>
                <div className="space-y-2">
                  {results.recommended_exams.map((exam, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                      <span className={`text-xs mt-0.5 ${priorityColor(exam.priority)} min-w-[70px]`}>[{exam.priority}]</span>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{exam.exam}</p>
                        <p className="text-slate-600 text-xs">{exam.rationale}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Actions immédiates */}
            {results.immediate_actions?.length > 0 && (
              <Card className="p-5 bg-amber-50 border border-amber-300">
                <h3 className="font-bold text-amber-900 mb-2">Actions Immédiates Recommandées</h3>
                <ol className="list-decimal list-inside space-y-1">
                  {results.immediate_actions.map((a, i) => <li key={i} className="text-slate-700 text-sm">{a}</li>)}
                </ol>
              </Card>
            )}

            {results.consciousness_insight && (
              <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
                <p className="text-sm text-purple-800 italic">💡 {results.consciousness_insight}</p>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}