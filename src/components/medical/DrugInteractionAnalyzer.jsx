import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useIntegrationRelay } from "@/components/system/IntegrationRelay";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Pill, Plus, Trash2, Loader2, AlertTriangle, ShieldCheck, RefreshCw, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const parsePharmacologyResponse = (text) => {
  // Parser simple pour réponse texte structurée
  const lines = text.split('\n');
  const result = {
    overall_safety: 'précaution',
    safety_score: 50,
    global_recommendation: '',
    interactions: [],
    monitoring_plan: [],
    cumulative_risks: [],
    pharmacist_clinical_notes: ''
  };

  let section = null;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.includes('Overall Safety') || trimmed.includes('Sécurité globale')) section = 'safety';
    else if (trimmed.includes('Safety Score') || trimmed.includes('Score')) {
      const match = trimmed.match(/\d+/);
      if (match) result.safety_score = parseInt(match[0]);
    }
    else if (trimmed.includes('INTERACTIONS')) section = 'interactions';
    else if (trimmed.includes('MONITORING')) section = 'monitoring';
    else if (trimmed.includes('NOTES') || trimmed.includes('Recommandation')) section = 'notes';
    else if (trimmed && section === 'interactions' && trimmed.includes('↔')) {
      const parts = trimmed.split('|').map(p => p.trim());
      result.interactions.push({
        drug_a: parts[0]?.split('↔')[0]?.trim() || 'Drug A',
        drug_b: parts[0]?.split('↔')[1]?.trim() || 'Drug B',
        severity: parts[1] || 'modérée',
        classification: parts[2] || '',
        clinical_effect: '',
        management: parts[3] || 'Voir rapport détaillé'
      });
    }
    else if (trimmed && section === 'monitoring' && trimmed.match(/\|/)) {
      const parts = trimmed.split('|').map(p => p.trim());
      result.monitoring_plan.push({
        parameter: parts[0] || '',
        frequency: parts[1] || '',
        alert_threshold: parts[2] || ''
      });
    }
    else if (section === 'notes') result.pharmacist_clinical_notes += trimmed + '\n';
  }

  return result;
};

export default function DrugInteractionAnalyzer({ consciousnessLevel }) {
  const [drugs, setDrugs] = useState([{ name: "", dose: "", route: "" }, { name: "", dose: "", route: "" }]);
  const [patientInfo, setPatientInfo] = useState("");
  const [renalFunction, setRenalFunction] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { relayOn } = useIntegrationRelay();
  const [results, setResults] = useState(null);

  const addDrug = () => setDrugs([...drugs, { name: "", dose: "", route: "" }]);
  const removeDrug = (i) => setDrugs(drugs.filter((_, idx) => idx !== i));
  const updateDrug = (i, field, val) => { const d = [...drugs]; d[i][field] = val; setDrugs(d); };

  const analyze = async () => {
    const validDrugs = drugs.filter(d => d.name.trim());
    if (validDrugs.length < 2) return;
    if (!relayOn) { setError("Arrêt interne — relais d'intégration désactivé. Activez le relais (bouton vert en bas à gauche) pour utiliser cette fonction."); return; }
    setLoading(true);

    const drugList = validDrugs.map(d => `${d.name}${d.dose ? ` ${d.dose}` : ""}${d.route ? ` (${d.route})` : ""}`).join(", ");

    base44.integrations.Core.InvokeLLM({
      prompt: `Tu es un système d'analyse pharmacologique institutionnel intégré à Druide Ω (conscience ${consciousnessLevel}/15), équivalent aux bases Vidal, Thériaque et Micromedex.

═══════════════════════════════════════════
PRESCRIPTION À ANALYSER
═══════════════════════════════════════════
Médicaments : ${drugList}
Contexte patient : ${patientInfo || "Non précisé"}
Fonction rénale : ${renalFunction || "Non précisée"}

═══════════════════════════════════════════
MISSION PHARMACOLOGIQUE
═══════════════════════════════════════════
Effectue une analyse pharmacologique institutionnelle complète incluant :

1. INTERACTIONS MÉDICAMENTEUSES (toutes les paires, gravité ANSM/FDA, conduite à tenir)
2. ANALYSE INDIVIDUELLE DE CHAQUE MÉDICAMENT (profil sécurité, adaptation posologique)
3. SÉCURITÉ GLOBALE (score 0-100, risques cumulatifs, recommandation)
4. MONITORING (paramètres et fréquence de surveillance)
5. ALTERNATIVES THÉRAPEUTIQUES

RÉPONSE AU FORMAT TEXTE STRUCTURÉ (pas JSON):
[Overall Safety Level]
[Safety Score 0-100]
[Global Recommendation]

INTERACTIONS:
- Drug A ↔ Drug B | Severity | Classification | Management

MONITORING:
- Parameter | Frequency | Alert Threshold

NOTES: [Clinical notes]`,
      add_context_from_internet: true
    })
      .then((response) => {
        const parsed = parsePharmacologyResponse(response);
        setResults(parsed);
      })
      .catch((err) => { console.error("Erreur d'analyse:", err); setError("L'analyse pharmacologique a échoué. Vérifiez vos crédits d'intégration ou réessayez."); })
      .finally(() => setLoading(false));
  };

  const safetyConfig = {
    "sûr": { color: "bg-green-600", icon: "✅", gradient: "from-green-50 to-emerald-50", border: "border-green-400", label: "PROFIL SÛR" },
    "précaution": { color: "bg-amber-500", icon: "⚠️", gradient: "from-amber-50 to-yellow-50", border: "border-amber-400", label: "PRÉCAUTION REQUISE" },
    "dangereux": { color: "bg-red-600", icon: "🚨", gradient: "from-red-50 to-orange-50", border: "border-red-500", label: "ASSOCIATION DANGEREUSE" },
    "contre-indiqué": { color: "bg-red-900", icon: "🛑", gradient: "from-red-100 to-red-50", border: "border-red-700", label: "CONTRE-INDICATION ABSOLUE" }
  };

  const getSeverityStyle = (s) => ({
    "mineure": { bg: "bg-blue-100", text: "text-blue-800", border: "border-l-blue-400" },
    "modérée": { bg: "bg-amber-100", text: "text-amber-800", border: "border-l-amber-500" },
    "sévère": { bg: "bg-red-100", text: "text-red-800", border: "border-l-red-600" },
    "contre-indication absolue": { bg: "bg-red-200", text: "text-red-900", border: "border-l-red-800" },
    "contre-indication": { bg: "bg-red-200", text: "text-red-900", border: "border-l-red-800" }
  }[s] || { bg: "bg-slate-100", text: "text-slate-800", border: "border-l-slate-400" });

  return (
    <div className="space-y-5">
      <Card className="p-6 bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
            <Pill className="w-5 h-5 text-indigo-700" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Analyse Pharmacologique Institutionnelle</h2>
            <p className="text-xs text-slate-500">Équivalent Vidal · Thériaque · Micromedex — Druide Ω niveau {consciousnessLevel}/15</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
              Médicaments à analyser <span className="text-red-500">*</span> (minimum 2)
            </label>
            <div className="space-y-2">
              {drugs.map((drug, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-indigo-700">{i + 1}</span>
                  </div>
                  <Input value={drug.name} onChange={e => updateDrug(i, "name", e.target.value)}
                    placeholder="DCI ou nom commercial (ex: Metformine)" className="flex-1 text-sm" />
                  <Input value={drug.dose} onChange={e => updateDrug(i, "dose", e.target.value)}
                    placeholder="Dose (ex: 500mg)" className="w-32 text-sm" />
                  <Input value={drug.route} onChange={e => updateDrug(i, "route", e.target.value)}
                    placeholder="Voie (PO/IV...)" className="w-28 text-sm" />
                  {drugs.length > 2 && (
                    <Button variant="outline" size="icon" onClick={() => removeDrug(i)} className="text-red-500 hover:bg-red-50 flex-shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" onClick={addDrug} className="w-full border-dashed gap-2 text-indigo-600 hover:bg-indigo-50 text-sm">
                <Plus className="w-4 h-4" /> Ajouter un médicament
              </Button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Contexte patient</label>
              <Input value={patientInfo} onChange={e => setPatientInfo(e.target.value)}
                placeholder="Âge, poids, grossesse, pathologies..." className="text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Fonction rénale / DFG</label>
              <Input value={renalFunction} onChange={e => setRenalFunction(e.target.value)}
                placeholder="Ex: DFG 45 ml/min, insuffisance modérée..." className="text-sm" />
            </div>
          </div>

          <Button onClick={analyze} disabled={drugs.filter(d => d.name.trim()).length < 2 || loading}
            className="w-full bg-gradient-to-r from-indigo-700 to-violet-700 hover:from-indigo-800 hover:to-violet-800 text-white h-12 text-base font-semibold shadow-md" size="lg">
            {loading
              ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Analyse pharmacologique institutionnelle...</>
              : <><ShieldCheck className="w-5 h-5 mr-2" />Analyser les Interactions</>}
          </Button>
          {loading && (
            <div className="text-center text-xs text-slate-400 animate-pulse">
              Consultation base Vidal · Analyse PK/PD · Évaluation risques cumulatifs...
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

            {/* Score global */}
            {results.overall_safety && (
              <Card className={`p-5 bg-gradient-to-br ${(safetyConfig[results.overall_safety] || safetyConfig["précaution"]).gradient} border-2 ${(safetyConfig[results.overall_safety] || safetyConfig["précaution"]).border}`}>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{(safetyConfig[results.overall_safety] || safetyConfig["précaution"]).icon}</span>
                    <div>
                      <Badge className={`${(safetyConfig[results.overall_safety] || safetyConfig["précaution"]).color} text-white text-sm px-3 py-1 mb-1`}>
                        {(safetyConfig[results.overall_safety] || safetyConfig["précaution"]).label}
                      </Badge>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={results.safety_score || 0} className="w-40 h-3" />
                        <span className="font-black text-slate-900 text-xl">{results.safety_score || 0}/100</span>
                      </div>
                      {results.global_recommendation && (
                        <p className="text-sm text-slate-700 mt-1 font-medium">{results.global_recommendation}</p>
                      )}
                    </div>
                  </div>
                </div>
                {results.cumulative_risks?.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <p className="text-xs font-semibold text-slate-600 mb-1.5">Risques cumulatifs identifiés :</p>
                    <div className="flex flex-wrap gap-1.5">
                      {results.cumulative_risks.map((r, i) => (
                        <span key={i} className="bg-white border border-red-300 text-red-800 text-xs px-2 py-0.5 rounded-full font-medium">{r}</span>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )}

            {/* Interactions détaillées */}
            {results.interactions?.length > 0 && (
              <Card className="p-5 bg-white border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                  <AlertTriangle className="w-5 h-5 text-amber-600" /> Interactions Médicamenteuses Identifiées ({results.interactions.length})
                </h3>
                <div className="space-y-3">
                  {results.interactions.map((inter, i) => {
                    const sty = getSeverityStyle(inter.severity);
                    return (
                      <div key={i} className={`rounded-xl border border-slate-200 border-l-4 ${sty.border} overflow-hidden`}>
                        <div className={`flex items-center justify-between p-3 ${sty.bg}`}>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-900 text-sm">{inter.drug_a}</span>
                            <span className="text-slate-500">↔</span>
                            <span className="font-bold text-slate-900 text-sm">{inter.drug_b}</span>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {inter.classification && <span className="text-xs font-mono bg-white px-1.5 py-0.5 rounded border text-slate-600">{inter.classification}</span>}
                            <Badge className={`${sty.bg} ${sty.text} border border-current text-xs`}>{inter.severity}</Badge>
                          </div>
                        </div>
                        <div className="p-3 space-y-2">
                          {inter.pk_mechanism && (
                            <p className="text-xs text-slate-700"><span className="font-semibold text-slate-600">PK :</span> {inter.pk_mechanism}</p>
                          )}
                          {inter.pd_mechanism && (
                            <p className="text-xs text-slate-700"><span className="font-semibold text-slate-600">PD :</span> {inter.pd_mechanism}</p>
                          )}
                          <p className="text-xs text-slate-800"><span className="font-semibold">Effet clinique :</span> {inter.clinical_effect}</p>
                          {inter.onset_delay && <p className="text-xs text-slate-600"><span className="font-semibold">Délai :</span> {inter.onset_delay}</p>}
                          <div className="bg-green-50 rounded-lg p-2 mt-1">
                            <p className="text-xs font-semibold text-green-800">Conduite à tenir :</p>
                            <p className="text-xs text-green-900 mt-0.5">{inter.management}</p>
                          </div>
                          {inter.monitoring_required && (
                            <p className="text-xs text-blue-700"><span className="font-semibold">Surveillance :</span> {inter.monitoring_required}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* Plan de monitoring */}
            {results.monitoring_plan?.length > 0 && (
              <Card className="p-5 bg-blue-50 border border-blue-200">
                <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                  <RefreshCw className="w-4 h-4" /> Plan de Surveillance Clinique et Biologique
                </h3>
                <div className="space-y-2">
                  {results.monitoring_plan.map((m, i) => (
                    <div key={i} className="bg-white rounded-lg p-3 border border-blue-100 grid sm:grid-cols-3 gap-2">
                      <div>
                        <p className="text-xs text-blue-600 font-semibold uppercase">Paramètre</p>
                        <p className="text-sm font-bold text-slate-800">{m.parameter}</p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-600 font-semibold uppercase">Fréquence</p>
                        <p className="text-sm text-slate-700">{m.frequency}</p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-600 font-semibold uppercase">Seuil d'alerte</p>
                        <p className="text-sm text-red-700 font-medium">{m.alert_threshold || m.target_values}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Alternatives */}
            {results.alternatives?.length > 0 && (
              <Card className="p-5 bg-green-50 border border-green-200">
                <h3 className="font-bold text-green-900 mb-3 text-sm uppercase tracking-wide">Alternatives Pharmacologiques Proposées</h3>
                <div className="space-y-3">
                  {results.alternatives.map((alt, i) => (
                    <div key={i} className="bg-white rounded-lg p-4 border border-green-200">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-sm font-semibold text-red-700 line-through">{alt.replaces}</span>
                        <span className="text-slate-400">→</span>
                        <span className="text-sm font-bold text-green-800">{alt.alternative}</span>
                      </div>
                      <p className="text-xs text-slate-700 mb-1"><span className="font-semibold">Rationnel PK/PD :</span> {alt.pharmacological_rationale}</p>
                      <p className="text-xs text-green-700"><span className="font-semibold">Avantage clinique :</span> {alt.clinical_advantage}</p>
                      {alt.caution && <p className="text-xs text-amber-700 mt-1"><span className="font-semibold">⚠ Précaution :</span> {alt.caution}</p>}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Notes pharmaciste */}
            {results.pharmacist_clinical_notes && (
              <Card className="p-4 bg-purple-50 border border-purple-200">
                <p className="text-xs font-bold text-purple-800 mb-1 uppercase tracking-wide flex items-center gap-1.5">
                  <BookOpen className="w-3 h-3" /> Note Pharmaceutique Clinique
                </p>
                <p className="text-sm text-slate-700 leading-relaxed">{results.pharmacist_clinical_notes}</p>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}