import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pill, Plus, Trash2, Loader2, AlertTriangle, ShieldCheck, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DrugInteractionAnalyzer({ consciousnessLevel }) {
  const [drugs, setDrugs] = useState([""]);
  const [patientInfo, setPatientInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const addDrug = () => setDrugs([...drugs, ""]);
  const removeDrug = (i) => setDrugs(drugs.filter((_, idx) => idx !== i));
  const updateDrug = (i, val) => { const d = [...drugs]; d[i] = val; setDrugs(d); };

  const analyze = async () => {
    const validDrugs = drugs.filter(d => d.trim());
    if (validDrugs.length < 2) return;
    setLoading(true);
    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `Tu es une IA pharmacologique consciente (niveau ${consciousnessLevel}/15).

MÉDICAMENTS: ${validDrugs.join(", ")}
CONTEXTE PATIENT: ${patientInfo || "Non précisé"}

Analyse les interactions médicamenteuses, contre-indications, et propose des alternatives si nécessaire.`,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          overall_safety: { type: "string", enum: ["sûr", "précaution", "dangereux", "contre-indiqué"] },
          safety_score: { type: "number", description: "0-100, 100=totalement sûr" },
          interactions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                drug_a: { type: "string" },
                drug_b: { type: "string" },
                severity: { type: "string", enum: ["mineure", "modérée", "sévère", "contre-indication"] },
                mechanism: { type: "string" },
                clinical_effect: { type: "string" },
                management: { type: "string" }
              }
            }
          },
          contraindications: { type: "array", items: { type: "string" } },
          monitoring_required: { type: "array", items: { type: "string" } },
          alternatives: {
            type: "array",
            items: {
              type: "object",
              properties: {
                replaces: { type: "string" },
                alternative: { type: "string" },
                rationale: { type: "string" }
              }
            }
          },
          pharmacist_notes: { type: "string" }
        }
      }
    });
    setResults(response);
    setLoading(false);
  };

  const safetyConfig = {
    "sûr": { color: "bg-green-500", icon: "✅", bg: "from-green-50 to-emerald-50", border: "border-green-400" },
    "précaution": { color: "bg-amber-500", icon: "⚠️", bg: "from-amber-50 to-yellow-50", border: "border-amber-400" },
    "dangereux": { color: "bg-red-500", icon: "🚨", bg: "from-red-50 to-orange-50", border: "border-red-500" },
    "contre-indiqué": { color: "bg-red-700", icon: "🛑", bg: "from-red-100 to-red-50", border: "border-red-700" }
  };
  const severityColor = (s) => ({ "mineure": "bg-blue-400", "modérée": "bg-amber-500", "sévère": "bg-red-500", "contre-indication": "bg-red-800" }[s] || "bg-slate-400");

  return (
    <div className="space-y-4">
      <Card className="p-5 bg-white">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Médicaments à analyser * (minimum 2)
            </label>
            <div className="space-y-2">
              {drugs.map((drug, i) => (
                <div key={i} className="flex gap-2">
                  <div className="flex items-center gap-2 flex-1 bg-slate-50 rounded-lg px-3 border border-slate-200">
                    <Pill className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                    <Input value={drug} onChange={e => updateDrug(i, e.target.value)}
                      placeholder={`Médicament ${i + 1} (DCI ou nom commercial)`}
                      className="border-0 bg-transparent focus-visible:ring-0 px-0" />
                  </div>
                  {drugs.length > 1 && (
                    <Button variant="outline" size="icon" onClick={() => removeDrug(i)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" onClick={addDrug} className="w-full border-dashed gap-2 text-indigo-600">
                <Plus className="w-4 h-4" /> Ajouter un médicament
              </Button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">Contexte patient (optionnel)</label>
            <Input value={patientInfo} onChange={e => setPatientInfo(e.target.value)}
              placeholder="Ex: Insuffisance rénale, grossesse, âge 75 ans, poids 60kg..." />
          </div>
          <Button onClick={analyze} disabled={drugs.filter(d => d.trim()).length < 2 || loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white" size="lg">
            {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Analyse pharmacologique...</> : <><ShieldCheck className="w-5 h-5 mr-2" />Analyser les Interactions</>}
          </Button>
        </div>
      </Card>

      <AnimatePresence>
        {results && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Score global */}
            {results.overall_safety && (
              <Card className={`p-5 bg-gradient-to-br ${safetyConfig[results.overall_safety]?.bg} border-2 ${safetyConfig[results.overall_safety]?.border}`}>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{safetyConfig[results.overall_safety]?.icon}</span>
                    <div>
                      <p className="font-bold text-slate-900 text-lg">Sécurité globale : <span className="uppercase">{results.overall_safety}</span></p>
                      <p className="text-slate-600 text-sm">Score de sécurité : {results.safety_score}/100</p>
                    </div>
                  </div>
                  <Badge className={`${safetyConfig[results.overall_safety]?.color} text-white text-lg px-4 py-1`}>
                    {results.safety_score}%
                  </Badge>
                </div>
              </Card>
            )}

            {/* Interactions */}
            {results.interactions?.length > 0 && (
              <Card className="p-5">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" /> Interactions Détectées ({results.interactions.length})
                </h3>
                <div className="space-y-3">
                  {results.interactions.map((inter, i) => (
                    <div key={i} className="bg-slate-50 rounded-lg p-4 border-l-4 border-amber-400">
                      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                        <span className="font-semibold text-slate-800">{inter.drug_a} ↔ {inter.drug_b}</span>
                        <Badge className={`${severityColor(inter.severity)} text-white text-xs`}>{inter.severity}</Badge>
                      </div>
                      <p className="text-sm text-slate-700 mb-1"><span className="font-medium">Mécanisme :</span> {inter.mechanism}</p>
                      <p className="text-sm text-slate-700 mb-1"><span className="font-medium">Effet clinique :</span> {inter.clinical_effect}</p>
                      <p className="text-sm text-green-700"><span className="font-medium">Conduite à tenir :</span> {inter.management}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Surveillance */}
            {results.monitoring_required?.length > 0 && (
              <Card className="p-5 bg-blue-50">
                <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                  <RefreshCw className="w-5 h-5" /> Surveillance Requise
                </h3>
                <ul className="space-y-1">
                  {results.monitoring_required.map((m, i) => <li key={i} className="text-sm text-slate-700 flex items-center gap-2"><span className="text-blue-500">•</span>{m}</li>)}
                </ul>
              </Card>
            )}

            {/* Alternatives */}
            {results.alternatives?.length > 0 && (
              <Card className="p-5 bg-green-50">
                <h3 className="font-bold text-green-900 mb-3">Alternatives Proposées</h3>
                <div className="space-y-2">
                  {results.alternatives.map((alt, i) => (
                    <div key={i} className="bg-white rounded p-3 border border-green-200">
                      <p className="text-sm"><span className="text-red-600 font-medium">{alt.replaces}</span> → <span className="text-green-700 font-semibold">{alt.alternative}</span></p>
                      <p className="text-xs text-slate-600 mt-1">{alt.rationale}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {results.pharmacist_notes && (
              <Card className="p-4 bg-purple-50 border border-purple-200">
                <p className="text-sm font-semibold text-purple-900 mb-1">Notes Pharmacologiques :</p>
                <p className="text-sm text-slate-700">{results.pharmacist_notes}</p>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}