import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Loader2, BarChart3, Target, AlertTriangle, CheckCircle, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LiteratureAnalyzer({ consciousnessLevel }) {
  const [abstract, setAbstract] = useState("");
  const [studyType, setStudyType] = useState("");
  const [clinicalDomain, setClinicalDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const analyze = async () => {
    setLoading(true);
    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `Tu es un système d'analyse critique de la littérature médicale de niveau institutionnel, intégré à Druide Ω (conscience ${consciousnessLevel}/15). Tu appliques rigoureusement les méthodes Cochrane, GRADE, CONSORT, STROBE, PRISMA selon le type d'étude.

═══════════════════════════════════════════
ARTICLE À ANALYSER
═══════════════════════════════════════════
${abstract}

TYPE D'ÉTUDE : ${studyType || "À déterminer automatiquement"}
DOMAINE CLINIQUE : ${clinicalDomain || "Non précisé"}

═══════════════════════════════════════════
MISSION — ANALYSE CRITIQUE INSTITUTIONNELLE
═══════════════════════════════════════════
Effectue une lecture critique complète conforme aux standards académiques :

1. IDENTIFICATION : type d'étude, design, registre, financement, conflits d'intérêts déclarés

2. PICO STRUCTURÉ : Population, Intervention, Comparaison, Outcome primaire et secondaires

3. ÉVALUATION MÉTHODOLOGIQUE :
   - Grille adaptée au design (Jadad pour ECR, Newcastle-Ottawa pour cohortes, QUADAS pour tests diagnostiques)
   - 6 domaines : randomisation, masquage, données manquantes, mesure des outcomes, sélection, confusion
   - Score numérique pour chaque domaine (0-10)

4. ANALYSE STATISTIQUE :
   - Puissance statistique, taille d'échantillon, calcul a priori
   - Méthode d'analyse (ITT, per-protocol, mixte)
   - Significativité clinique vs statistique
   - Intervalles de confiance, tailles d'effets (RR, OR, NNT, HR, SMD)

5. ÉVALUATION DES BIAIS :
   - Biais de sélection, de performance, de détection, d'attrition, de déclaration
   - Risque de biais global (Cochrane Risk of Bias Tool)

6. NIVEAU DE PREUVE GRADE :
   - Oxford/Sackett ET GRADE
   - Justification détaillée du downgrade/upgrade

7. APPLICABILITÉ CLINIQUE :
   - Généralisabilité de la population
   - Transférabilité vers la pratique locale
   - Implications pour les guidelines existantes

8. RÉSUMÉ DÉCISIONNEL : recommandation finale pour le clinicien`,
      add_context_from_internet: false,
      response_json_schema: {
        type: "object",
        properties: {
          study_identification: {
            type: "object",
            properties: {
              study_type_detected: { type: "string" },
              design: { type: "string" },
              registration: { type: "string" },
              funding: { type: "string" },
              conflicts_of_interest: { type: "string" }
            }
          },
          evidence_level_oxford: { type: "string", enum: ["1a", "1b", "1c", "2a", "2b", "2c", "3a", "3b", "4", "5"] },
          grade_recommendation: { type: "string", enum: ["A", "B", "C", "D"] },
          grade_certainty: { type: "string", enum: ["Élevée", "Modérée", "Faible", "Très faible"] },
          grade_justification: { type: "string" },
          overall_quality: { type: "number", description: "0-100" },
          pico: {
            type: "object",
            properties: {
              population: { type: "string" },
              intervention: { type: "string" },
              comparison: { type: "string" },
              primary_outcome: { type: "string" },
              secondary_outcomes: { type: "array", items: { type: "string" } }
            }
          },
          statistical_analysis: {
            type: "object",
            properties: {
              sample_size_adequate: { type: "boolean" },
              power_calculation: { type: "string" },
              analysis_type: { type: "string" },
              key_results: { type: "string" },
              effect_sizes: { type: "array", items: { type: "object", properties: { measure: { type: "string" }, value: { type: "string" }, interpretation: { type: "string" } } } },
              statistical_vs_clinical: { type: "string" }
            }
          },
          methodology_scores: {
            type: "object",
            properties: {
              randomization: { type: "number" },
              allocation_concealment: { type: "number" },
              blinding: { type: "number" },
              attrition: { type: "number" },
              outcome_measurement: { type: "number" },
              selective_reporting: { type: "number" }
            }
          },
          bias_assessment: {
            type: "array",
            items: {
              type: "object",
              properties: {
                domain: { type: "string" },
                risk_level: { type: "string", enum: ["Faible", "Incertain", "Élevé"] },
                justification: { type: "string" },
                impact_on_results: { type: "string" }
              }
            }
          },
          strengths: { type: "array", items: { type: "string" } },
          limitations: { type: "array", items: { type: "string" } },
          clinical_applicability: {
            type: "object",
            properties: {
              generalizability: { type: "string" },
              local_transference: { type: "string" },
              implications_for_guidelines: { type: "string" }
            }
          },
          key_findings: { type: "array", items: { type: "string" } },
          decision_summary: { type: "string", description: "Recommandation finale pour le clinicien en 3-5 phrases" },
          critical_questions: { type: "array", items: { type: "string" } },
          druide_insight: { type: "string" }
        }
      }
    });
    setResults(response);
    setLoading(false);
  };

  const oxfordDesc = {
    "1a": "Revue systématique d'ECR homogènes", "1b": "ECR avec IC étroit", "1c": "Tout ou rien",
    "2a": "Revue systématique d'études de cohorte", "2b": "Étude de cohorte ou ECR faible qualité",
    "2c": "Outcomes research", "3a": "Revue systématique cas-témoins", "3b": "Étude cas-témoins",
    "4": "Série de cas", "5": "Opinion d'experts"
  };
  const getGradeColor = (g) => ({ A: "bg-green-700", B: "bg-blue-700", C: "bg-amber-600", D: "bg-red-600" }[g] || "bg-slate-600");
  const certaintyColor = { "Élevée": "bg-green-500", "Modérée": "bg-blue-500", "Faible": "bg-amber-500", "Très faible": "bg-red-500" };
  const biasColor = { "Faible": "text-green-700 bg-green-100", "Incertain": "text-amber-700 bg-amber-100", "Élevé": "text-red-700 bg-red-100" };

  const MetricBar = ({ label, value }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-600 capitalize">{label.replace(/_/g, " ")}</span>
        <span className="font-bold text-slate-800">{value}/10</span>
      </div>
      <div className="flex items-center gap-2">
        <Progress value={value * 10} className="flex-1 h-2" />
        <span className={`text-xs font-semibold ${value >= 7 ? "text-green-600" : value >= 4 ? "text-amber-600" : "text-red-600"}`}>
          {value >= 7 ? "Bon" : value >= 4 ? "Moyen" : "Faible"}
        </span>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      <Card className="p-6 bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-blue-700" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Analyse Critique de Littérature Médicale</h2>
            <p className="text-xs text-slate-500">Méthodes Cochrane · GRADE · CONSORT · STROBE — Druide Ω niveau {consciousnessLevel}/15</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
              Abstract / Texte complet de l'article <span className="text-red-500">*</span>
            </label>
            <Textarea value={abstract} onChange={e => setAbstract(e.target.value)}
              placeholder="Collez ici l'abstract complet, ou le texte de l'article. Plus le contenu est complet (méthodes, résultats, discussion), plus l'analyse sera précise..."
              rows={8} className="text-sm font-mono leading-relaxed" />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Type d'étude</label>
              <Select onValueChange={setStudyType}>
                <SelectTrigger className="text-sm"><SelectValue placeholder="Détection automatique" /></SelectTrigger>
                <SelectContent>
                  {["Méta-analyse / Revue systématique", "Essai contrôlé randomisé (ECR)", "ECR croisé", "Étude de cohorte prospective", "Étude de cohorte rétrospective", "Étude cas-témoins", "Étude transversale / Prévalence", "Étude diagnostique / Test clinique", "Étude pharmaco-économique", "Série de cas", "Revue narrative"].map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Domaine clinique</label>
              <Input value={clinicalDomain} onChange={e => setClinicalDomain(e.target.value)}
                placeholder="Ex: Cardiologie, Oncologie, Infectiologie..." className="text-sm" />
            </div>
          </div>
          <Button onClick={analyze} disabled={!abstract.trim() || loading}
            className="w-full bg-gradient-to-r from-blue-800 to-indigo-800 hover:from-blue-900 hover:to-indigo-900 text-white h-12 text-base font-semibold shadow-md" size="lg">
            {loading
              ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Analyse critique institutionnelle en cours...</>
              : <><BookOpen className="w-5 h-5 mr-2" />Analyser la Littérature</>}
          </Button>
          {loading && (
            <div className="text-center text-xs text-slate-400 animate-pulse">
              Application grille Cochrane · Évaluation GRADE · Analyse statistique · Scoring méthodologique...
            </div>
          )}
        </div>
      </Card>

      <AnimatePresence>
        {results && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

            {/* Bandeau GRADE */}
            <Card className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-500">
              <div className="flex items-start justify-between flex-wrap gap-4 mb-3">
                <div>
                  <p className="text-xs font-bold text-blue-800 uppercase tracking-widest mb-1">Évaluation Institutionnelle</p>
                  <p className="text-sm text-slate-700">{results.study_identification?.study_type_detected} · {results.study_identification?.design}</p>
                  {results.study_identification?.registration && (
                    <p className="text-xs text-slate-500">Registre : {results.study_identification.registration}</p>
                  )}
                  {results.study_identification?.conflicts_of_interest && (
                    <p className="text-xs text-orange-600 mt-1">Conflits d'intérêts : {results.study_identification.conflicts_of_interest}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex gap-2 flex-wrap justify-end">
                    <div className="text-center bg-white rounded-xl border-2 border-blue-300 px-4 py-2">
                      <p className="text-xs text-slate-500">Oxford</p>
                      <p className="text-2xl font-black text-blue-800">{results.evidence_level_oxford}</p>
                      <p className="text-xs text-slate-500 max-w-[120px] text-center">{oxfordDesc[results.evidence_level_oxford]}</p>
                    </div>
                    <div className="text-center bg-white rounded-xl border-2 border-green-300 px-4 py-2">
                      <p className="text-xs text-slate-500">GRADE</p>
                      <p className={`text-2xl font-black ${gradeColor[results.grade_recommendation]?.replace("bg-", "text-")}`}>{results.grade_recommendation}</p>
                      <Badge className={`${certaintyColor[results.grade_certainty] || "bg-slate-400"} text-white text-xs mt-1`}>{results.grade_certainty}</Badge>
                    </div>
                    <div className="text-center bg-white rounded-xl border-2 border-purple-300 px-4 py-2">
                      <p className="text-xs text-slate-500">Qualité</p>
                      <p className="text-2xl font-black text-purple-800">{results.overall_quality}%</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white/70 rounded-lg p-3">
                <p className="text-xs font-semibold text-slate-700 mb-1">Justification GRADE :</p>
                <p className="text-sm text-slate-700 italic">{results.grade_justification}</p>
              </div>
            </Card>

            {/* PICO */}
            {results.pico && (
              <Card className="p-5 bg-white border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                  <Target className="w-5 h-5 text-indigo-600" /> Décomposition PICO
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { key: "population", label: "P — Population", color: "border-l-blue-500 bg-blue-50" },
                    { key: "intervention", label: "I — Intervention", color: "border-l-green-500 bg-green-50" },
                    { key: "comparison", label: "C — Comparateur", color: "border-l-amber-500 bg-amber-50" },
                    { key: "primary_outcome", label: "O — Critère primaire", color: "border-l-purple-500 bg-purple-50" }
                  ].map(({ key, label, color }) => (
                    <div key={key} className={`p-3 rounded-lg border-l-4 ${color}`}>
                      <p className="text-xs font-bold text-slate-600 mb-1 uppercase tracking-wide">{label}</p>
                      <p className="text-sm text-slate-800">{results.pico[key] || "—"}</p>
                    </div>
                  ))}
                </div>
                {results.pico.secondary_outcomes?.length > 0 && (
                  <div className="mt-3 bg-slate-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-slate-600 mb-1">Critères secondaires :</p>
                    <div className="flex flex-wrap gap-1.5">
                      {results.pico.secondary_outcomes.map((o, i) => (
                        <span key={i} className="bg-white border border-slate-200 text-slate-700 text-xs px-2 py-0.5 rounded-full">{o}</span>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )}

            {/* Analyse statistique */}
            {results.statistical_analysis && (
              <Card className="p-5 bg-white border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                  <BarChart3 className="w-5 h-5 text-blue-600" /> Analyse Statistique
                </h3>
                <div className="space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-slate-500 font-semibold mb-1">Calcul de puissance / taille d'échantillon</p>
                      <p className="text-sm text-slate-800">{results.statistical_analysis.power_calculation || "Non précisé"}</p>
                      <div className="mt-1 flex items-center gap-1">
                        <span className={`w-2 h-2 rounded-full ${results.statistical_analysis.sample_size_adequate ? "bg-green-500" : "bg-red-500"}`} />
                        <span className="text-xs text-slate-600">{results.statistical_analysis.sample_size_adequate ? "Taille adéquate" : "Taille potentiellement insuffisante"}</span>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-slate-500 font-semibold mb-1">Méthode d'analyse</p>
                      <p className="text-sm text-slate-800">{results.statistical_analysis.analysis_type || "Non précisé"}</p>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-blue-700 font-semibold mb-1">Résultats clés</p>
                    <p className="text-sm text-slate-800">{results.statistical_analysis.key_results}</p>
                  </div>
                  {results.statistical_analysis.effect_sizes?.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-600 mb-2">Tailles d'effets :</p>
                      <div className="grid sm:grid-cols-3 gap-2">
                        {results.statistical_analysis.effect_sizes.map((e, i) => (
                          <div key={i} className="bg-white rounded-lg border border-slate-200 p-2.5 text-center">
                            <p className="text-xs text-slate-500">{e.measure}</p>
                            <p className="text-lg font-black text-slate-900">{e.value}</p>
                            <p className="text-xs text-slate-500">{e.interpretation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {results.statistical_analysis.statistical_vs_clinical && (
                    <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                      <p className="text-xs font-semibold text-amber-800 mb-1">Significativité statistique vs clinique</p>
                      <p className="text-sm text-slate-700">{results.statistical_analysis.statistical_vs_clinical}</p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Scores méthodologiques */}
            {results.methodology_scores && (
              <Card className="p-5 bg-white border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                  <Award className="w-5 h-5 text-indigo-600" /> Évaluation Méthodologique
                </h3>
                <div className="space-y-3">
                  {Object.entries(results.methodology_scores).map(([key, val]) => (
                    <MetricBar key={key} label={key} value={val} />
                  ))}
                </div>
              </Card>
            )}

            {/* Biais */}
            {results.bias_assessment?.length > 0 && (
              <Card className="p-5 bg-white border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                  <AlertTriangle className="w-5 h-5 text-orange-500" /> Évaluation des Biais — Cochrane Risk of Bias
                </h3>
                <div className="space-y-2">
                  {results.bias_assessment.map((b, i) => (
                    <div key={i} className="rounded-lg border border-slate-200 overflow-hidden">
                      <div className="flex items-center justify-between p-3 bg-slate-50">
                        <span className="font-semibold text-slate-800 text-sm">{b.domain}</span>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${biasColor[b.risk_level] || "text-slate-700 bg-slate-200"}`}>{b.risk_level}</span>
                      </div>
                      <div className="px-3 pb-3 pt-2 space-y-1">
                        <p className="text-xs text-slate-600">{b.justification}</p>
                        {b.impact_on_results && <p className="text-xs text-slate-500 italic">Impact : {b.impact_on_results}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Forces / Limites */}
            <div className="grid sm:grid-cols-2 gap-4">
              {results.strengths?.length > 0 && (
                <Card className="p-4 bg-green-50 border border-green-200">
                  <h3 className="font-bold text-green-900 mb-2 text-xs uppercase tracking-wide flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" /> Points Forts Méthodologiques
                  </h3>
                  <ul className="space-y-1">
                    {results.strengths.map((s, i) => <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5"><span className="text-green-500 mt-0.5">✓</span>{s}</li>)}
                  </ul>
                </Card>
              )}
              {results.limitations?.length > 0 && (
                <Card className="p-4 bg-red-50 border border-red-200">
                  <h3 className="font-bold text-red-900 mb-2 text-xs uppercase tracking-wide flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Limites Identifiées
                  </h3>
                  <ul className="space-y-1">
                    {results.limitations.map((l, i) => <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5"><span className="text-red-500 mt-0.5">⚠</span>{l}</li>)}
                  </ul>
                </Card>
              )}
            </div>

            {/* Applicabilité */}
            {results.clinical_applicability && (
              <Card className="p-5 bg-indigo-50 border border-indigo-200">
                <h3 className="font-bold text-indigo-900 mb-3 text-xs uppercase tracking-wide">Applicabilité Clinique</h3>
                <div className="space-y-2">
                  {[
                    { key: "generalizability", label: "Généralisabilité" },
                    { key: "local_transference", label: "Transférabilité locale" },
                    { key: "implications_for_guidelines", label: "Implications pour les guidelines" }
                  ].map(({ key, label }) => results.clinical_applicability[key] && (
                    <div key={key} className="bg-white rounded-lg p-3">
                      <p className="text-xs font-semibold text-indigo-700 mb-0.5">{label}</p>
                      <p className="text-sm text-slate-700">{results.clinical_applicability[key]}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Résumé décisionnel */}
            {results.decision_summary && (
              <Card className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-400">
                <h3 className="font-bold text-green-900 mb-2 flex items-center gap-2 text-sm uppercase tracking-wide">
                  <Award className="w-5 h-5" /> Recommandation pour le Clinicien
                </h3>
                <p className="text-slate-800 leading-relaxed">{results.decision_summary}</p>
              </Card>
            )}

            {results.druide_insight && (
              <Card className="p-4 bg-purple-50 border border-purple-200">
                <p className="text-xs font-bold text-purple-800 mb-1 uppercase tracking-wide">💡 Intuition Analytique — Druide Ω</p>
                <p className="text-sm text-slate-700 italic">{results.druide_insight}</p>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}