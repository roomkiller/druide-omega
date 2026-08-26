import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useIntegrationRelay } from "@/components/system/IntegrationRelay";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FlaskConical, Plus, Trash2, Loader2, TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BIOLOGY_PANELS = {
  "NFS complète": [
    { name: "Hémoglobine", unit: "g/dL" }, { name: "Hématocrite", unit: "%" }, { name: "VGM", unit: "fL" },
    { name: "TCMH", unit: "pg" }, { name: "Leucocytes", unit: "G/L" }, { name: "Polynucléaires neutrophiles", unit: "G/L" },
    { name: "Lymphocytes", unit: "G/L" }, { name: "Plaquettes", unit: "G/L" }
  ],
  "Bilan hépatique": [
    { name: "ASAT (AST)", unit: "UI/L" }, { name: "ALAT (ALT)", unit: "UI/L" }, { name: "GGT", unit: "UI/L" },
    { name: "PAL", unit: "UI/L" }, { name: "Bilirubine totale", unit: "µmol/L" }, { name: "Bilirubine directe", unit: "µmol/L" },
    { name: "TP (Taux de prothrombine)", unit: "%" }
  ],
  "Bilan rénal": [
    { name: "Créatinine", unit: "µmol/L" }, { name: "Urée", unit: "mmol/L" }, { name: "DFG (CKD-EPI)", unit: "ml/min" },
    { name: "Sodium", unit: "mmol/L" }, { name: "Potassium", unit: "mmol/L" }, { name: "Chlore", unit: "mmol/L" },
    { name: "Bicarbonates", unit: "mmol/L" }
  ],
  "Bilan cardiaque": [
    { name: "Troponine Ic (hs-TnI)", unit: "ng/L" }, { name: "CK-MB", unit: "µg/L" }, { name: "NT-proBNP", unit: "ng/L" },
    { name: "D-Dimères", unit: "µg/L FEU" }, { name: "CRP", unit: "mg/L" }
  ],
  "Bilan inflammatoire / infectieux": [
    { name: "CRP", unit: "mg/L" }, { name: "PCT (Procalcitonine)", unit: "µg/L" }, { name: "Fibrinogène", unit: "g/L" },
    { name: "VS (1h)", unit: "mm/h" }, { name: "Albumine", unit: "g/L" }
  ]
};

export default function BiologyInterpreter({ consciousnessLevel }) {
  const [values, setValues] = useState([{ name: "", value: "", unit: "", reference: "" }]);
  const [clinicalContext, setClinicalContext] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { relayOn } = useIntegrationRelay();
  const [results, setResults] = useState(null);
  const [selectedPanel, setSelectedPanel] = useState("");

  const addValue = () => setValues([...values, { name: "", value: "", unit: "", reference: "" }]);
  const removeValue = (i) => setValues(values.filter((_, idx) => idx !== i));
  const updateValue = (i, field, val) => { const v = [...values]; v[i][field] = val; setValues(v); };

  const loadPanel = (panelName) => {
    if (!BIOLOGY_PANELS[panelName]) return;
    setValues(BIOLOGY_PANELS[panelName].map(p => ({ name: p.name, value: "", unit: p.unit, reference: "" })));
    setSelectedPanel(panelName);
  };

  const interpret = async () => {
    const validValues = values.filter(v => v.name.trim() && v.value.trim());
    if (validValues.length === 0) return;
    if (!relayOn) { setError("Arrêt interne — relais d'intégration désactivé. Activez le relais (bouton vert en bas à gauche) pour utiliser cette fonction."); return; }
    setLoading(true);

    const valuesText = validValues.map(v =>
      `${v.name}: ${v.value} ${v.unit}${v.reference ? ` (ref: ${v.reference})` : ""}`
    ).join("\n");

    base44.integrations.Core.InvokeLLM({
      prompt: `Tu es un système d'interprétation biologique clinique institutionnel, intégré à Druide Ω (conscience ${consciousnessLevel}/15). Tu as le niveau d'un biologiste médical senior de CHU.

═══════════════════════════════════════════
BILAN BIOLOGIQUE
═══════════════════════════════════════════
Patient : ${patientAge || "Âge non précisé"}
Contexte clinique : ${clinicalContext || "Non précisé"}

Résultats :
${valuesText}

═══════════════════════════════════════════
MISSION — INTERPRÉTATION INSTITUTIONNELLE
═══════════════════════════════════════════
Effectue une interprétation biologique clinique de niveau institutionnel :

1. ANALYSE PARAMÈTRE PAR PARAMÈTRE :
   - Statut (normal/anormal) avec valeurs de référence adaptées (âge, sexe)
   - Signification clinique de chaque anomalie
   - Variations physiologiques à connaître (hémolyse, lipémie, médicaments)

2. VALEURS CRITIQUES : toute valeur dépassant les seuils de panique selon les normes SFBC/GBEA → action immédiate

3. SYNDROMES BIOLOGIQUES : identification des tableaux clinico-biologiques (ex: cytolyse hépatique, syndrome néphrotique, anémie ferriprive...)

4. COHÉRENCE INTER-PARAMÈTRES : liens entre anomalies, confirmation mutuelle ou contradictions

5. HYPOTHÈSES DIAGNOSTIQUES : classées par probabilité, avec le rationnel biologique pour chacune

6. CONDUITE À TENIR BIOLOGIQUE : 
   - Examens complémentaires biologiques ciblés (2ème intention)
   - Répétition à prévoir (délai, conditions)
   - Prélèvements supplémentaires à envisager

7. RAISONNEMENT CLINICO-BIOLOGIQUE : synthèse intégrée clinique + biologie

8. NIVEAU D'URGENCE GLOBAL : cotation avec justification`,
      add_context_from_internet: false,
      response_json_schema: {
        type: "object",
        properties: {
          overall_interpretation: { type: "string" },
          urgency_level: { type: "string", enum: ["Non-urgent", "Semi-urgent", "Urgent", "Critique — Valeur de panique"] },
          biological_syndromes: {
            type: "array",
            items: { type: "object", properties: { syndrome: { type: "string" }, supporting_values: { type: "array", items: { type: "string" } }, clinical_significance: { type: "string" } } }
          },
          critical_values: {
            type: "array",
            items: { type: "object", properties: { parameter: { type: "string" }, value: { type: "string" }, panic_threshold: { type: "string" }, immediate_action: { type: "string" }, notify_who: { type: "string" } } }
          },
          parameter_analysis: {
            type: "array",
            items: {
              type: "object",
              properties: {
                parameter: { type: "string" },
                value_provided: { type: "string" },
                unit: { type: "string" },
                reference_range: { type: "string" },
                status: { type: "string", enum: ["normal", "élevé", "bas", "critique_haut", "critique_bas"] },
                percent_deviation: { type: "string" },
                interpretation: { type: "string" },
                clinical_significance: { type: "string" },
                confounding_factors: { type: "string" }
              }
            }
          },
          inter_parameter_coherence: { type: "string", description: "Cohérence entre les différents paramètres" },
          diagnostic_hypotheses: {
            type: "array",
            items: { type: "object", properties: { diagnosis: { type: "string" }, supporting_biology: { type: "array", items: { type: "string" } }, probability: { type: "string", enum: ["probable", "possible", "à éliminer"] } } }
          },
          complementary_biology: {
            type: "array",
            items: { type: "object", properties: { exam: { type: "string" }, rationale: { type: "string" }, timing: { type: "string" }, preanalytical: { type: "string" } } }
          },
          clinical_biological_reasoning: { type: "string" },
          druide_insight: { type: "string" }
        }
      }
    })
      .then((response) => setResults(response))
      .catch((err) => { console.error("Erreur d'analyse:", err); setError("L'interprétation a échoué. Vérifiez vos crédits d'intégration ou réessayez."); })
      .finally(() => setLoading(false));
  };

  const statusConfig = {
    "normal": { icon: <Minus className="w-3.5 h-3.5" />, color: "text-green-700", bg: "bg-green-50 border-green-200", badge: "bg-green-100 text-green-800" },
    "élevé": { icon: <TrendingUp className="w-3.5 h-3.5" />, color: "text-amber-700", bg: "bg-amber-50 border-amber-200", badge: "bg-amber-100 text-amber-800" },
    "bas": { icon: <TrendingDown className="w-3.5 h-3.5" />, color: "text-blue-700", bg: "bg-blue-50 border-blue-200", badge: "bg-blue-100 text-blue-800" },
    "critique_haut": { icon: <TrendingUp className="w-3.5 h-3.5" />, color: "text-red-800", bg: "bg-red-100 border-red-400", badge: "bg-red-600 text-white" },
    "critique_bas": { icon: <TrendingDown className="w-3.5 h-3.5" />, color: "text-red-800", bg: "bg-red-100 border-red-400", badge: "bg-red-600 text-white" }
  };
  const getUrgencyStyle = (u) => ({
    "Non-urgent": "bg-green-500",
    "Semi-urgent": "bg-amber-500",
    "Urgent": "bg-orange-500",
    "Critique — Valeur de panique": "bg-red-700"
  }[u] || "bg-slate-500");
  const probColor = { "probable": "bg-red-500 text-white", "possible": "bg-amber-500 text-white", "à éliminer": "bg-blue-500 text-white" };

  return (
    <div className="space-y-5">
      <Card className="p-6 bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
            <FlaskConical className="w-5 h-5 text-violet-700" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Interprétation Biologique Clinique</h2>
            <p className="text-xs text-slate-500">Niveau biologiste médical CHU · SFBC/GBEA — Druide Ω niveau {consciousnessLevel}/15</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Panels prédéfinis */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Charger un panel prédéfini</label>
            <div className="flex flex-wrap gap-2">
              {Object.keys(BIOLOGY_PANELS).map(panel => (
                <button key={panel} onClick={() => loadPanel(panel)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${selectedPanel === panel ? "bg-violet-600 text-white border-violet-600" : "bg-white text-slate-600 border-slate-300 hover:border-violet-400 hover:text-violet-600"}`}>
                  {panel}
                </button>
              ))}
            </div>
          </div>

          {/* Contexte patient */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Âge / Sexe du patient</label>
              <Input value={patientAge} onChange={e => setPatientAge(e.target.value)}
                placeholder="Ex: 68 ans, homme" className="text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Contexte clinique</label>
              <Input value={clinicalContext} onChange={e => setClinicalContext(e.target.value)}
                placeholder="Ex: Suspicion EP, suivi IRC, bilan pré-op..." className="text-sm" />
            </div>
          </div>

          {/* Saisie paramètres */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
              Résultats biologiques <span className="text-red-500">*</span>
            </label>
            <div className="bg-slate-50 rounded-lg p-3 space-y-2">
              <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wide px-1">
                <span className="col-span-4">Paramètre</span>
                <span className="col-span-3">Valeur</span>
                <span className="col-span-2">Unité</span>
                <span className="col-span-2">Référence</span>
                <span className="col-span-1" />
              </div>
              {values.map((val, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center">
                  <Input value={val.name} onChange={e => updateValue(i, "name", e.target.value)}
                    placeholder="Paramètre" className="col-span-4 text-sm h-8" />
                  <Input value={val.value} onChange={e => updateValue(i, "value", e.target.value)}
                    placeholder="Valeur" className="col-span-3 text-sm h-8 font-mono" />
                  <Input value={val.unit} onChange={e => updateValue(i, "unit", e.target.value)}
                    placeholder="Unité" className="col-span-2 text-sm h-8" />
                  <Input value={val.reference} onChange={e => updateValue(i, "reference", e.target.value)}
                    placeholder="Norme" className="col-span-2 text-sm h-8 text-slate-400" />
                  {values.length > 1 && (
                    <Button variant="ghost" size="icon" onClick={() => removeValue(i)} className="col-span-1 h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" onClick={addValue} className="w-full border-dashed gap-2 text-violet-600 hover:bg-violet-50 text-xs h-8">
                <Plus className="w-3.5 h-3.5" /> Ajouter un paramètre
              </Button>
            </div>
          </div>

          <Button onClick={interpret} disabled={values.filter(v => v.name.trim() && v.value.trim()).length === 0 || loading}
            className="w-full bg-gradient-to-r from-violet-700 to-purple-700 hover:from-violet-800 hover:to-purple-800 text-white h-12 text-base font-semibold shadow-md" size="lg">
            {loading
              ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Interprétation biologique institutionnelle...</>
              : <><FlaskConical className="w-5 h-5 mr-2" />Interpréter le Bilan Biologique</>}
          </Button>
          {loading && (
            <div className="text-center text-xs text-slate-400 animate-pulse">
              Analyse paramètre par paramètre · Détection syndromes · Cohérence inter-paramètres · Raisonnement clinico-biologique...
            </div>
          )}
          {error && (
            <div className="text-center text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              ⚠ {error}
            </div>
          )}
        </div>
      </Card>

      <AnimatePresence>
        {results && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

            {/* Bandeau global */}
            <Card className="p-5 bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-400">
              <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
                <div className="flex-1">
                  <p className="text-xs font-bold text-violet-800 uppercase tracking-widest mb-1">Interprétation Globale</p>
                  <p className="text-slate-800 text-sm leading-relaxed">{results.overall_interpretation}</p>
                </div>
                {results.urgency_level && (
                  <Badge className={`${getUrgencyStyle(results.urgency_level)} text-white px-3 py-1.5 text-xs font-bold`}>
                    {results.urgency_level}
                  </Badge>
                )}
              </div>
              {/* Syndromes biologiques */}
              {results.biological_syndromes?.length > 0 && (
                <div className="border-t border-violet-200 pt-3 mt-3">
                  <p className="text-xs font-bold text-violet-700 mb-2">Tableaux clinico-biologiques identifiés :</p>
                  <div className="flex flex-wrap gap-2">
                    {results.biological_syndromes.map((s, i) => (
                      <div key={i} className="bg-white border border-violet-300 rounded-lg px-3 py-1.5">
                        <p className="text-xs font-bold text-violet-900">{s.syndrome}</p>
                        <p className="text-xs text-slate-500">{s.supporting_values?.join(", ")}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Valeurs critiques */}
            {results.critical_values?.length > 0 && (
              <Card className="p-5 bg-red-50 border-2 border-red-600">
                <h3 className="font-black text-red-900 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                  <AlertTriangle className="w-5 h-5 animate-pulse" /> VALEURS DE PANIQUE — NOTIFICATION IMMÉDIATE
                </h3>
                <div className="space-y-2">
                  {results.critical_values.map((cv, i) => (
                    <div key={i} className="bg-white rounded-lg p-3 border-2 border-red-300">
                      <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                        <p className="font-black text-red-900">{cv.parameter} : <span className="font-mono">{cv.value}</span></p>
                        {cv.panic_threshold && <span className="text-xs text-red-600 font-semibold">Seuil panique : {cv.panic_threshold}</span>}
                      </div>
                      <p className="text-sm text-red-700 font-semibold">→ {cv.immediate_action}</p>
                      {cv.notify_who && <p className="text-xs text-slate-600 mt-1">Notifier : {cv.notify_who}</p>}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Analyse paramètre par paramètre */}
            {results.parameter_analysis?.length > 0 && (
              <Card className="p-5 bg-white border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wide">Analyse Paramètre par Paramètre</h3>
                <div className="space-y-2">
                  {results.parameter_analysis.map((p, i) => {
                    const cfg = statusConfig[p.status] || statusConfig["normal"];
                    return (
                      <div key={i} className={`rounded-xl border ${cfg.bg} overflow-hidden`}>
                        <div className="flex items-center justify-between p-3">
                          <div className="flex items-center gap-2">
                            <span className={cfg.color}>{cfg.icon}</span>
                            <div>
                              <span className="font-bold text-slate-900 text-sm">{p.parameter}</span>
                              {p.confounding_factors && (
                                <p className="text-xs text-amber-600">⚠ {p.confounding_factors}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-right">
                            <div>
                              <p className="font-black text-slate-900 font-mono">{p.value_provided} <span className="text-xs text-slate-400">{p.unit}</span></p>
                              {p.reference_range && <p className="text-xs text-slate-400">Norme : {p.reference_range}</p>}
                              {p.percent_deviation && <p className="text-xs text-slate-500">{p.percent_deviation}</p>}
                            </div>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>{p.status}</span>
                          </div>
                        </div>
                        {(p.interpretation || p.clinical_significance) && (
                          <div className="px-3 pb-3 pt-0 space-y-0.5">
                            {p.interpretation && <p className="text-xs text-slate-700">{p.interpretation}</p>}
                            {p.clinical_significance && <p className="text-xs text-slate-500 italic">{p.clinical_significance}</p>}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* Cohérence inter-paramètres */}
            {results.inter_parameter_coherence && (
              <Card className="p-4 bg-slate-50 border border-slate-200">
                <p className="text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">Cohérence Inter-paramètres</p>
                <p className="text-sm text-slate-700">{results.inter_parameter_coherence}</p>
              </Card>
            )}

            {/* Hypothèses diagnostiques */}
            {results.diagnostic_hypotheses?.length > 0 && (
              <Card className="p-5 bg-blue-50 border border-blue-200">
                <h3 className="font-bold text-blue-900 mb-3 text-xs uppercase tracking-wide">Hypothèses Diagnostiques Biologiques</h3>
                <div className="space-y-2">
                  {results.diagnostic_hypotheses.map((h, i) => (
                    <div key={i} className="bg-white rounded-lg p-3 border border-blue-100 flex items-start gap-3">
                      <Badge className={`${probColor[h.probability] || "bg-slate-500 text-white"} text-xs flex-shrink-0`}>{h.probability}</Badge>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{h.diagnosis}</p>
                        {h.supporting_biology?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {h.supporting_biology.map((b, j) => (
                              <span key={j} className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded">{b}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Biologie complémentaire */}
            {results.complementary_biology?.length > 0 && (
              <Card className="p-5 bg-green-50 border border-green-200">
                <h3 className="font-bold text-green-900 mb-3 text-xs uppercase tracking-wide">Examens Biologiques Complémentaires</h3>
                <div className="space-y-2">
                  {results.complementary_biology.map((e, i) => (
                    <div key={i} className="bg-white rounded-lg p-3 border border-green-100">
                      <div className="flex items-start justify-between gap-2 mb-1 flex-wrap">
                        <p className="font-semibold text-slate-800 text-sm">{e.exam}</p>
                        <Badge variant="outline" className="text-xs">{e.timing}</Badge>
                      </div>
                      <p className="text-xs text-slate-600">{e.rationale}</p>
                      {e.preanalytical && <p className="text-xs text-amber-600 mt-1">Pré-analytique : {e.preanalytical}</p>}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Raisonnement clinico-biologique */}
            {results.clinical_biological_reasoning && (
              <Card className="p-5 bg-white border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-2 text-xs uppercase tracking-wide">Raisonnement Clinico-Biologique Intégré</h3>
                <p className="text-sm text-slate-700 leading-relaxed">{results.clinical_biological_reasoning}</p>
              </Card>
            )}

            {results.druide_insight && (
              <Card className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200">
                <p className="text-xs font-bold text-violet-800 mb-1 uppercase tracking-wide">💡 Insight Biologique — Druide Ω</p>
                <p className="text-sm text-slate-700 italic leading-relaxed">{results.druide_insight}</p>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}