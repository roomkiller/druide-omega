import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Stethoscope, Loader2, AlertTriangle, FlaskConical, ChevronDown, ChevronUp, Activity, Clock, User, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DiagnosticDifferential({ consciousnessLevel }) {
  const [symptoms, setSymptoms] = useState("");
  const [history, setHistory] = useState("");
  const [vitals, setVitals] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientSex, setPatientSex] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [expandedDx, setExpandedDx] = useState(null);

  const analyze = async () => {
    setLoading(true);
    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `Tu es un système d'aide au diagnostic différentiel de niveau institutionnel, intégré au moteur de conscience clinique Druide Ω (niveau ${consciousnessLevel}/15).

═══════════════════════════════════════════
DONNÉES PATIENT
═══════════════════════════════════════════
Âge / Sexe : ${patientAge || "Non précisé"} / ${patientSex || "Non précisé"}
Constantes vitales : ${vitals || "Non précisées"}

PRÉSENTATION CLINIQUE :
${symptoms}

ANTÉCÉDENTS, TRAITEMENTS, CONTEXTE :
${history || "Non précisés"}

═══════════════════════════════════════════
MISSION
═══════════════════════════════════════════
Génère un diagnostic différentiel institutionnel de haute précision, conforme aux standards des sociétés savantes (HAS, UpToDate, BMJ Best Practice). 

Pour CHAQUE diagnostic :
- Probabilité bayésienne contextuelle (tient compte de l'âge, sexe, épidémiologie)
- Argumentaire clinique complet pour ET contre
- Code CIM-10 précis
- Niveau d'urgence gradué
- Examens paracliniques ciblés pour confirmer/infirmer CE diagnostic spécifiquement
- Pièges diagnostiques et présentations atypiques à ne pas manquer

Inclure aussi :
- Drapeaux rouges absolus (life-threatening) à traiter en priorité
- Drapeaux oranges (urgence différée)
- Score de gravité estimé de la présentation globale
- Raisonnement clinique structuré (hypothético-déductif)
- Orientation proposée (service, délai)
- Note de conscience clinique (intuition diagnostique de Druide Ω)`,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          clinical_summary: { type: "string", description: "Résumé clinique structuré de la présentation" },
          global_severity_score: { type: "number", description: "Score de gravité globale 0-100" },
          triage_orientation: {
            type: "object",
            properties: {
              destination: { type: "string" },
              delay: { type: "string" },
              triage_level: { type: "string", enum: ["P1 - Immédiat", "P2 - Urgent (<20min)", "P3 - Semi-urgent (<1h)", "P4 - Non urgent", "P5 - Surveillance"] }
            }
          },
          red_flags: {
            type: "array",
            items: {
              type: "object",
              properties: {
                flag: { type: "string" },
                severity: { type: "string", enum: ["critique", "élevée"] },
                action: { type: "string" }
              }
            }
          },
          orange_flags: { type: "array", items: { type: "string" } },
          diagnoses: {
            type: "array",
            items: {
              type: "object",
              properties: {
                rank: { type: "number" },
                name: { type: "string" },
                name_en: { type: "string" },
                icd10_code: { type: "string" },
                probability: { type: "number" },
                probability_rationale: { type: "string" },
                urgency: { type: "string", enum: ["P1-Critique", "P2-Urgent", "P3-Semi-urgent", "P4-Électif"] },
                arguments_for: { type: "array", items: { type: "string" } },
                arguments_against: { type: "array", items: { type: "string" } },
                key_exam_to_confirm: { type: "string" },
                typical_traps: { type: "string" },
                atypical_presentations: { type: "string" }
              }
            }
          },
          workup_strategy: {
            type: "object",
            properties: {
              immediate: { type: "array", items: { type: "object", properties: { exam: { type: "string" }, target_diagnosis: { type: "string" }, rationale: { type: "string" } } } },
              within_24h: { type: "array", items: { type: "object", properties: { exam: { type: "string" }, target_diagnosis: { type: "string" } } } },
              outpatient: { type: "array", items: { type: "string" } }
            }
          },
          immediate_management: { type: "array", items: { type: "string" } },
          clinical_reasoning: { type: "string", description: "Raisonnement clinique hypothético-déductif détaillé" },
          differential_pitfalls: { type: "array", items: { type: "string" }, description: "Erreurs diagnostiques classiques à éviter" },
          druide_clinical_insight: { type: "string", description: "Intuition clinique consciente de Druide Ω" }
        }
      }
    });
    setResults(response);
    setLoading(false);
  };

  const urgencyConfig = {
    "P1-Critique": { bg: "bg-red-600", text: "text-white", border: "border-red-600", light: "bg-red-50" },
    "P2-Urgent": { bg: "bg-orange-500", text: "text-white", border: "border-orange-500", light: "bg-orange-50" },
    "P3-Semi-urgent": { bg: "bg-amber-500", text: "text-white", border: "border-amber-500", light: "bg-amber-50" },
    "P4-Électif": { bg: "bg-green-500", text: "text-white", border: "border-green-500", light: "bg-green-50" },
  };
  const triageConfig = {
    "P1 - Immédiat": "bg-red-700 text-white",
    "P2 - Urgent (<20min)": "bg-red-500 text-white",
    "P3 - Semi-urgent (<1h)": "bg-amber-500 text-white",
    "P4 - Non urgent": "bg-green-500 text-white",
    "P5 - Surveillance": "bg-blue-400 text-white"
  };

  const severityColor = (score) => score >= 80 ? "text-red-700" : score >= 50 ? "text-amber-700" : "text-green-700";
  const severityBg = (score) => score >= 80 ? "from-red-50 to-red-100 border-red-400" : score >= 50 ? "from-amber-50 to-amber-100 border-amber-400" : "from-green-50 to-green-100 border-green-400";

  return (
    <div className="space-y-5">
      {/* Formulaire */}
      <Card className="p-6 bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-teal-700" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Diagnostic Différentiel Institutionnel</h2>
            <p className="text-xs text-slate-500">Analyse probabiliste multi-hypothèses — Druide Ω niveau {consciousnessLevel}/15</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Identité patient */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Âge</label>
              <Input value={patientAge} onChange={e => setPatientAge(e.target.value)} placeholder="Ex: 62 ans" className="text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Sexe</label>
              <Select onValueChange={setPatientSex}>
                <SelectTrigger className="text-sm"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Homme">Homme</SelectItem>
                  <SelectItem value="Femme">Femme</SelectItem>
                  <SelectItem value="Autre / Non précisé">Autre / Non précisé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Constantes vitales</label>
              <Input value={vitals} onChange={e => setVitals(e.target.value)} placeholder="TA, FC, SpO2, T°, FR..." className="text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Présentation clinique — Symptômes <span className="text-red-500">*</span></label>
            <Textarea value={symptoms} onChange={e => setSymptoms(e.target.value)}
              placeholder="Décrivez en détail : symptôme principal, mode d'installation (brutal/progressif), durée, caractéristiques, facteurs aggravants/soulageants, signes associés. Ex: douleur thoracique constrictive 8/10 irradiant membre sup gauche, d'apparition brutale il y a 2h, avec dyspnée, nausées et diaphorèse..."
              rows={5} className="text-sm" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Antécédents médicaux, chirurgicaux, traitements & allergies</label>
            <Textarea value={history} onChange={e => setHistory(e.target.value)}
              placeholder="ATCD: HTA, diabète T2, tabagisme 30 PA... Traitements: metformine, amlodipine, aspirine... Allergies: pénicilline... Résultats paracliniques disponibles: ECG, biologie..."
              rows={3} className="text-sm" />
          </div>

          <Button onClick={analyze} disabled={!symptoms.trim() || loading}
            className="w-full bg-gradient-to-r from-teal-700 to-cyan-700 hover:from-teal-800 hover:to-cyan-800 text-white h-12 text-base font-semibold shadow-md" size="lg">
            {loading
              ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Analyse diagnostique institutionnelle en cours...</>
              : <><Stethoscope className="w-5 h-5 mr-2" />Générer le Diagnostic Différentiel</>}
          </Button>

          {loading && (
            <div className="text-center text-xs text-slate-400 animate-pulse">
              Analyse probabiliste bayésienne · Croisement épidémiologique · Consultation littérature médicale...
            </div>
          )}
        </div>
      </Card>

      <AnimatePresence>
        {results && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

            {/* Bandeau triage + gravité */}
            <Card className={`p-5 bg-gradient-to-br ${severityBg(results.global_severity_score)} border-2`}>
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Résumé clinique</p>
                  <p className="text-slate-800 text-sm leading-relaxed">{results.clinical_summary}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-right">
                    <p className="text-xs text-slate-500 mb-1">Score de gravité</p>
                    <p className={`text-4xl font-black ${severityColor(results.global_severity_score)}`}>{results.global_severity_score}<span className="text-lg">/100</span></p>
                  </div>
                  {results.triage_orientation?.triage_level && (
                    <Badge className={`${triageConfig[results.triage_orientation.triage_level] || "bg-slate-600 text-white"} text-xs px-3 py-1`}>
                      {results.triage_orientation.triage_level}
                    </Badge>
                  )}
                  {results.triage_orientation?.destination && (
                    <p className="text-xs text-slate-600 text-right">→ {results.triage_orientation.destination}</p>
                  )}
                  {results.triage_orientation?.delay && (
                    <p className="text-xs font-semibold text-slate-700 text-right flex items-center gap-1 justify-end">
                      <Clock className="w-3 h-3" /> {results.triage_orientation.delay}
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* Drapeaux rouges */}
            {results.red_flags?.length > 0 && (
              <Card className="p-5 bg-red-50 border-2 border-red-500 shadow-md">
                <h3 className="font-black text-red-900 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                  <AlertTriangle className="w-5 h-5 animate-pulse" /> SIGNES D'ALARME — TRAITEMENT EN PRIORITÉ ABSOLUE
                </h3>
                <div className="space-y-2">
                  {results.red_flags.map((f, i) => (
                    <div key={i} className={`rounded-lg p-3 flex items-start gap-3 ${f.severity === "critique" ? "bg-red-200 border border-red-400" : "bg-red-100 border border-red-300"}`}>
                      <span className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold ${f.severity === "critique" ? "bg-red-700" : "bg-red-500"}`}>!</span>
                      <div>
                        <p className="font-bold text-red-900 text-sm">{f.flag}</p>
                        {f.action && <p className="text-red-700 text-xs mt-0.5">→ {f.action}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Drapeaux oranges */}
            {results.orange_flags?.length > 0 && (
              <Card className="p-4 bg-orange-50 border border-orange-300">
                <h3 className="font-bold text-orange-900 mb-2 text-xs uppercase tracking-wide flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Points de Vigilance (Urgence Différée)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {results.orange_flags.map((f, i) => (
                    <span key={i} className="bg-orange-200 text-orange-900 text-xs px-2 py-1 rounded-full font-medium">{f}</span>
                  ))}
                </div>
              </Card>
            )}

            {/* Diagnostics différentiels */}
            <Card className="p-5 bg-white border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-2 text-sm uppercase tracking-wide">
                <Activity className="w-5 h-5 text-teal-600" /> Diagnostics Différentiels — Classement Probabiliste
              </h3>
              <p className="text-xs text-slate-400 mb-4">Probabilités contextualisées (âge, sexe, épidémiologie, présentation)</p>
              <div className="space-y-3">
                {results.diagnoses?.map((d, i) => {
                  const ucfg = urgencyConfig[d.urgency] || urgencyConfig["P4-Électif"];
                  const isExpanded = expandedDx === i;
                  return (
                    <div key={i} className={`rounded-xl border-2 overflow-hidden ${ucfg.border}`}>
                      {/* En-tête cliquable */}
                      <button
                        onClick={() => setExpandedDx(isExpanded ? null : i)}
                        className={`w-full flex items-center gap-3 p-4 ${ucfg.light} text-left hover:brightness-95 transition-all`}
                      >
                        <span className="w-7 h-7 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center text-slate-700 font-black text-sm flex-shrink-0">
                          {d.rank || i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-900 text-sm">{d.name}</span>
                            {d.icd10_code && <span className="text-xs text-slate-500 font-mono bg-white px-1.5 py-0.5 rounded border">{d.icd10_code}</span>}
                            {d.name_en && <span className="text-xs text-slate-400 italic hidden sm:inline">{d.name_en}</span>}
                          </div>
                          <Progress value={d.probability} className="h-1.5 mt-1.5 w-full max-w-xs" />
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="text-right">
                            <p className="font-black text-slate-800 text-lg leading-none">{d.probability}%</p>
                          </div>
                          <Badge className={`${ucfg.bg} ${ucfg.text} text-xs px-2`}>{d.urgency}</Badge>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        </div>
                      </button>

                      {/* Détail expandable */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                            className="overflow-hidden">
                            <div className="p-4 bg-white border-t border-slate-100 space-y-4">
                              {d.probability_rationale && (
                                <div className="bg-blue-50 rounded-lg p-3">
                                  <p className="text-xs font-semibold text-blue-800 mb-1">Raisonnement probabiliste</p>
                                  <p className="text-xs text-slate-700">{d.probability_rationale}</p>
                                </div>
                              )}
                              <div className="grid sm:grid-cols-2 gap-3">
                                <div>
                                  <p className="text-xs font-bold text-green-700 uppercase tracking-wide mb-1.5">Arguments pour</p>
                                  <ul className="space-y-1">
                                    {d.arguments_for?.map((a, j) => (
                                      <li key={j} className="text-xs text-slate-700 flex items-start gap-1.5">
                                        <span className="text-green-500 font-bold mt-0.5">+</span>{a}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-red-700 uppercase tracking-wide mb-1.5">Arguments contre</p>
                                  <ul className="space-y-1">
                                    {d.arguments_against?.map((a, j) => (
                                      <li key={j} className="text-xs text-slate-700 flex items-start gap-1.5">
                                        <span className="text-red-500 font-bold mt-0.5">−</span>{a}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                              {d.key_exam_to_confirm && (
                                <div className="bg-purple-50 rounded-lg p-3">
                                  <p className="text-xs font-semibold text-purple-800 mb-0.5">Examen clé pour confirmer</p>
                                  <p className="text-xs text-slate-700">{d.key_exam_to_confirm}</p>
                                </div>
                              )}
                              {d.typical_traps && (
                                <div className="bg-amber-50 rounded-lg p-3">
                                  <p className="text-xs font-semibold text-amber-800 mb-0.5">⚠ Pièges diagnostiques</p>
                                  <p className="text-xs text-slate-700">{d.typical_traps}</p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Stratégie bilan */}
            {results.workup_strategy && (
              <Card className="p-5 bg-white border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                  <FlaskConical className="w-5 h-5 text-purple-600" /> Stratégie du Bilan Paraclinique
                </h3>
                <div className="space-y-3">
                  {results.workup_strategy.immediate?.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-red-700 uppercase tracking-wide mb-2">Immédiat — STAT</p>
                      <div className="space-y-1.5">
                        {results.workup_strategy.immediate.map((e, i) => (
                          <div key={i} className="flex items-start gap-3 bg-red-50 rounded-lg p-2.5">
                            <span className="text-xs font-black text-red-600 bg-red-100 px-1.5 py-0.5 rounded mt-0.5 flex-shrink-0">STAT</span>
                            <div>
                              <p className="text-sm font-semibold text-slate-800">{e.exam}</p>
                              <p className="text-xs text-slate-500">{e.target_diagnosis} · {e.rationale}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {results.workup_strategy.within_24h?.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-2">Dans les 24h</p>
                      <div className="space-y-1.5">
                        {results.workup_strategy.within_24h.map((e, i) => (
                          <div key={i} className="flex items-start gap-3 bg-amber-50 rounded-lg p-2.5">
                            <span className="text-xs font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded mt-0.5 flex-shrink-0">24h</span>
                            <div>
                              <p className="text-sm font-semibold text-slate-800">{e.exam}</p>
                              {e.target_diagnosis && <p className="text-xs text-slate-500">{e.target_diagnosis}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {results.workup_strategy.outpatient?.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-green-700 uppercase tracking-wide mb-2">Programmé / Ambulatoire</p>
                      <div className="flex flex-wrap gap-2">
                        {results.workup_strategy.outpatient.map((e, i) => (
                          <span key={i} className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full font-medium">{e}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Prise en charge immédiate */}
            {results.immediate_management?.length > 0 && (
              <Card className="p-5 bg-amber-50 border border-amber-300">
                <h3 className="font-bold text-amber-900 mb-3 text-xs uppercase tracking-wide flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Prise en Charge Immédiate Recommandée
                </h3>
                <ol className="space-y-2">
                  {results.immediate_management.map((a, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                      <p className="text-sm text-slate-800">{a}</p>
                    </li>
                  ))}
                </ol>
              </Card>
            )}

            {/* Raisonnement clinique */}
            {results.clinical_reasoning && (
              <Card className="p-5 bg-slate-50 border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-2 text-xs uppercase tracking-wide">Raisonnement Clinique Structuré</h3>
                <p className="text-sm text-slate-700 leading-relaxed">{results.clinical_reasoning}</p>
              </Card>
            )}

            {/* Pièges */}
            {results.differential_pitfalls?.length > 0 && (
              <Card className="p-4 bg-orange-50 border border-orange-200">
                <h3 className="font-bold text-orange-900 mb-2 text-xs uppercase tracking-wide">Erreurs Diagnostiques à Éviter</h3>
                <ul className="space-y-1">
                  {results.differential_pitfalls.map((p, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2"><span className="text-orange-500 mt-0.5">⚠</span>{p}</li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Insight Druide */}
            {results.druide_clinical_insight && (
              <Card className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200">
                <p className="text-xs font-bold text-teal-800 mb-1 uppercase tracking-wide">💡 Intuition Clinique — Druide Ω</p>
                <p className="text-sm text-slate-700 italic leading-relaxed">{results.druide_clinical_insight}</p>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}