import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FlaskConical, Plus, Trash2, Loader2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BiologyInterpreter({ consciousnessLevel }) {
  const [values, setValues] = useState([{ name: "", value: "", unit: "" }]);
  const [clinicalContext, setClinicalContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const addValue = () => setValues([...values, { name: "", value: "", unit: "" }]);
  const removeValue = (i) => setValues(values.filter((_, idx) => idx !== i));
  const updateValue = (i, field, val) => { const v = [...values]; v[i][field] = val; setValues(v); };

  const interpret = async () => {
    const validValues = values.filter(v => v.name.trim() && v.value.trim());
    if (validValues.length === 0) return;
    setLoading(true);
    const valuesText = validValues.map(v => `${v.name}: ${v.value} ${v.unit}`).join("\n");
    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `Tu es une IA biologiste médicale consciente (niveau ${consciousnessLevel}/15).

RÉSULTATS BIOLOGIQUES:
${valuesText}

CONTEXTE CLINIQUE: ${clinicalContext || "Non précisé"}

Interprète ces résultats biologiques de façon clinique, identifie les anomalies, propose un raisonnement diagnostique et les actions à envisager.`,
      add_context_from_internet: false,
      response_json_schema: {
        type: "object",
        properties: {
          overall_interpretation: { type: "string" },
          critical_values: { type: "array", items: { type: "object", properties: { parameter: { type: "string" }, value: { type: "string" }, action: { type: "string" } } } },
          parameter_analysis: {
            type: "array",
            items: {
              type: "object",
              properties: {
                parameter: { type: "string" },
                value_provided: { type: "string" },
                normal_range: { type: "string" },
                status: { type: "string", enum: ["normal", "élevé", "bas", "critique_haut", "critique_bas"] },
                interpretation: { type: "string" },
                clinical_significance: { type: "string" }
              }
            }
          },
          syndrome_pattern: { type: "string", description: "Tableau clinico-biologique" },
          diagnostic_hypotheses: { type: "array", items: { type: "string" } },
          additional_tests: { type: "array", items: { type: "string" } },
          urgency_level: { type: "string", enum: ["non-urgent", "semi-urgent", "urgent", "critique"] },
          clinical_reasoning: { type: "string" }
        }
      }
    });
    setResults(response);
    setLoading(false);
  };

  const statusConfig = {
    "normal": { icon: <Minus className="w-4 h-4" />, color: "text-green-600", bg: "bg-green-50 border-green-300" },
    "élevé": { icon: <TrendingUp className="w-4 h-4" />, color: "text-amber-600", bg: "bg-amber-50 border-amber-300" },
    "bas": { icon: <TrendingDown className="w-4 h-4" />, color: "text-blue-600", bg: "bg-blue-50 border-blue-300" },
    "critique_haut": { icon: <TrendingUp className="w-4 h-4" />, color: "text-red-700", bg: "bg-red-100 border-red-500" },
    "critique_bas": { icon: <TrendingDown className="w-4 h-4" />, color: "text-red-700", bg: "bg-red-100 border-red-500" }
  };
  const urgencyColors = { "non-urgent": "bg-green-500", "semi-urgent": "bg-amber-500", "urgent": "bg-orange-500", "critique": "bg-red-600" };

  return (
    <div className="space-y-4">
      <Card className="p-5 bg-white">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">Résultats biologiques *</label>
            <div className="space-y-2">
              {values.map((val, i) => (
                <div key={i} className="flex gap-2">
                  <Input value={val.name} onChange={e => updateValue(i, "name", e.target.value)}
                    placeholder="Paramètre (ex: Hémoglobine)" className="flex-1" />
                  <Input value={val.value} onChange={e => updateValue(i, "value", e.target.value)}
                    placeholder="Valeur" className="w-24" />
                  <Input value={val.unit} onChange={e => updateValue(i, "unit", e.target.value)}
                    placeholder="Unité" className="w-24" />
                  {values.length > 1 && (
                    <Button variant="outline" size="icon" onClick={() => removeValue(i)} className="text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" onClick={addValue} className="w-full border-dashed gap-2 text-violet-600">
                <Plus className="w-4 h-4" /> Ajouter un paramètre
              </Button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">Contexte clinique (optionnel)</label>
            <Textarea value={clinicalContext} onChange={e => setClinicalContext(e.target.value)}
              placeholder="Ex: Patient 45 ans, suspicion d'anémie ferriprive, fatigue depuis 3 mois..."
              rows={2} />
          </div>
          <Button onClick={interpret} disabled={values.filter(v => v.name.trim() && v.value.trim()).length === 0 || loading}
            className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white" size="lg">
            {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Interprétation biologique...</> : <><FlaskConical className="w-5 h-5 mr-2" />Interpréter les Résultats</>}
          </Button>
        </div>
      </Card>

      <AnimatePresence>
        {results && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* En-tête */}
            <Card className="p-5 bg-gradient-to-br from-violet-50 to-purple-50 border-l-4 border-violet-500">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <h3 className="font-bold text-slate-900">Interprétation Globale</h3>
                {results.urgency_level && (
                  <Badge className={`${urgencyColors[results.urgency_level]} text-white`}>{results.urgency_level.toUpperCase()}</Badge>
                )}
              </div>
              <p className="text-slate-700 text-sm">{results.overall_interpretation}</p>
              {results.syndrome_pattern && (
                <p className="text-sm font-semibold text-violet-800 mt-2">Tableau : {results.syndrome_pattern}</p>
              )}
            </Card>

            {/* Valeurs critiques */}
            {results.critical_values?.length > 0 && (
              <Card className="p-5 bg-red-50 border-2 border-red-400">
                <h3 className="font-bold text-red-800 mb-3">🚨 Valeurs Critiques — Intervention Urgente</h3>
                <div className="space-y-2">
                  {results.critical_values.map((cv, i) => (
                    <div key={i} className="bg-white rounded p-3 border border-red-300">
                      <p className="font-semibold text-red-900 text-sm">{cv.parameter} : {cv.value}</p>
                      <p className="text-red-700 text-xs">→ {cv.action}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Analyse par paramètre */}
            {results.parameter_analysis?.length > 0 && (
              <Card className="p-5">
                <h3 className="font-bold text-slate-900 mb-3">Analyse Paramètre par Paramètre</h3>
                <div className="space-y-2">
                  {results.parameter_analysis.map((p, i) => {
                    const cfg = statusConfig[p.status] || statusConfig["normal"];
                    return (
                      <div key={i} className={`p-3 rounded-lg border ${cfg.bg}`}>
                        <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className={cfg.color}>{cfg.icon}</span>
                            <span className="font-semibold text-slate-800 text-sm">{p.parameter}</span>
                          </div>
                          <div className="flex gap-2 items-center">
                            <span className="text-sm font-bold text-slate-700">{p.value_provided}</span>
                            {p.normal_range && <span className="text-xs text-slate-500">(norme: {p.normal_range})</span>}
                          </div>
                        </div>
                        {p.interpretation && <p className="text-xs text-slate-700 mt-1">{p.interpretation}</p>}
                        {p.clinical_significance && <p className="text-xs text-slate-500 mt-0.5 italic">{p.clinical_significance}</p>}
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* Hypothèses diagnostiques */}
            {results.diagnostic_hypotheses?.length > 0 && (
              <Card className="p-5 bg-blue-50">
                <h3 className="font-bold text-blue-900 mb-2">Hypothèses Diagnostiques</h3>
                <ol className="list-decimal list-inside space-y-1">
                  {results.diagnostic_hypotheses.map((h, i) => <li key={i} className="text-sm text-slate-700">{h}</li>)}
                </ol>
              </Card>
            )}

            {results.additional_tests?.length > 0 && (
              <Card className="p-4 bg-green-50">
                <h3 className="font-bold text-green-900 mb-2 text-sm">Examens Complémentaires Conseillés</h3>
                <ul className="space-y-1">{results.additional_tests.map((t, i) => <li key={i} className="text-xs text-slate-700">• {t}</li>)}</ul>
              </Card>
            )}

            {results.clinical_reasoning && (
              <Card className="p-4 bg-slate-50 border border-slate-200">
                <p className="text-sm font-semibold text-slate-700 mb-1">Raisonnement Clinique :</p>
                <p className="text-sm text-slate-600">{results.clinical_reasoning}</p>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}