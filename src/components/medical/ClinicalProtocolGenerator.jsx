import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Loader2, Download, ChevronRight, Users, Calendar, AlertTriangle, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ClinicalProtocolGenerator({ consciousnessLevel }) {
  const [topic, setTopic] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [setting, setSetting] = useState("");
  const [additionalConstraints, setAdditionalConstraints] = useState("");
  const [loading, setLoading] = useState(false);
  const [protocol, setProtocol] = useState(null);

  const generate = async () => {
    setLoading(true);
    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `Tu es un système expert en rédaction de protocoles cliniques institutionnels, intégré à Druide Ω (conscience ${consciousnessLevel}/15). Tu génères des protocoles conformes aux standards HAS, SFAR, SFMU, Haute Autorité de Santé et WHO Clinical Protocols.

═══════════════════════════════════════════
COMMANDE DE PROTOCOLE
═══════════════════════════════════════════
Pathologie / Procédure : ${topic}
Spécialité : ${specialty || "Médecine générale"}
Contexte / Établissement : ${setting || "Hôpital général"}
Contraintes spécifiques : ${additionalConstraints || "Aucune"}

═══════════════════════════════════════════
EXIGENCES DU PROTOCOLE INSTITUTIONNEL
═══════════════════════════════════════════
Génère un protocole clinique COMPLET conforme aux standards institutionnels :

1. EN-TÊTE OFFICIEL : titre, version, niveau de preuve (GRADE A/B/C/D/Expert), date de révision, sociétés savantes de référence

2. POPULATION CIBLE : critères d'inclusion détaillés, critères d'exclusion, sous-groupes spéciaux (pédiatrie, grossesse, IR, IH, sujet âgé)

3. RESSOURCES REQUISES : par catégorie (personnel, matériel, médicaments, dispositifs médicaux)

4. PROTOCOLE PAS-À-PAS : organisé par PHASES clairement nommées, chaque étape avec responsable, timing, décision conditionnelle si applicable

5. ARBRE DÉCISIONNEL : points de décision critiques avec chemins si/alors

6. MONITORING CLINIQUE : paramètres à surveiller, fréquence, valeurs cibles, seuils d'alerte

7. GESTION DES COMPLICATIONS : par complication, conduite à tenir structurée

8. CRITÈRES DE SUCCÈS / SORTIE : critères pour clore le protocole

9. DOCUMENTATION OBLIGATOIRE : ce qui doit figurer dans le dossier médical

10. REFERENCES : sociétés savantes, guidelines, niveau de preuve de chaque recommandation clé

Qualité institutionnelle requise : chaque étape doit être actionnable, sans ambiguïté, utilisable directement par le personnel soignant.`,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          protocol_title: { type: "string" },
          short_title: { type: "string" },
          version: { type: "string" },
          creation_date: { type: "string" },
          revision_date: { type: "string" },
          evidence_level: { type: "string", enum: ["A", "B", "C", "D", "Expert"] },
          reference_societies: { type: "array", items: { type: "string" } },
          target_population: { type: "string" },
          inclusion_criteria: { type: "array", items: { type: "string" } },
          exclusion_criteria: { type: "array", items: { type: "string" } },
          special_populations: { type: "array", items: { type: "object", properties: { group: { type: "string" }, adaptation: { type: "string" } } } },
          objective: { type: "string" },
          indications: { type: "array", items: { type: "string" } },
          contraindications: { type: "array", items: { type: "string" } },
          required_resources: {
            type: "array",
            items: { type: "object", properties: { category: { type: "string" }, items: { type: "array", items: { type: "string" } } } }
          },
          phases: {
            type: "array",
            items: {
              type: "object",
              properties: {
                phase_name: { type: "string" },
                phase_objective: { type: "string" },
                steps: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      step_number: { type: "number" },
                      action: { type: "string" },
                      responsible: { type: "string" },
                      timing: { type: "string" },
                      decision_point: { type: "boolean" },
                      if_yes: { type: "string" },
                      if_no: { type: "string" },
                      critical: { type: "boolean" },
                      notes: { type: "string" }
                    }
                  }
                }
              }
            }
          },
          monitoring_parameters: {
            type: "array",
            items: { type: "object", properties: { parameter: { type: "string" }, frequency: { type: "string" }, target: { type: "string" }, alert: { type: "string" } } }
          },
          complications_management: {
            type: "array",
            items: { type: "object", properties: { complication: { type: "string" }, frequency: { type: "string" }, management: { type: "string" }, escalation: { type: "string" } } }
          },
          success_criteria: { type: "array", items: { type: "string" } },
          documentation_required: { type: "array", items: { type: "string" } },
          references: { type: "array", items: { type: "object", properties: { citation: { type: "string" }, evidence_level: { type: "string" } } } }
        }
      }
    });
    setProtocol(response);
    setLoading(false);
  };

  const exportProtocol = () => {
    if (!protocol) return;
    const lines = [];
    lines.push(`PROTOCOLE CLINIQUE INSTITUTIONNEL`);
    lines.push(`${"=".repeat(60)}`);
    lines.push(`Titre : ${protocol.protocol_title}`);
    lines.push(`Version : ${protocol.version || "1.0"} | Niveau de preuve : ${protocol.evidence_level}`);
    lines.push(`Date de révision : ${protocol.revision_date || "À définir"}`);
    lines.push(`Sociétés de référence : ${protocol.reference_societies?.join(", ")}`);
    lines.push(`\nPOPULATION CIBLE : ${protocol.target_population}`);
    lines.push(`\nOBJECTIF : ${protocol.objective}`);
    if (protocol.phases) {
      protocol.phases.forEach(phase => {
        lines.push(`\n--- ${phase.phase_name.toUpperCase()} ---`);
        phase.steps?.forEach(step => {
          lines.push(`  ${step.step_number}. [${step.responsible}] ${step.action}${step.timing ? ` (${step.timing})` : ""}`);
          if (step.notes) lines.push(`     Note: ${step.notes}`);
        });
      });
    }
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `protocole_${(protocol.short_title || topic).replace(/\s+/g, "_")}_v${protocol.version || "1"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const evidenceColors = { A: "bg-green-700", B: "bg-blue-700", C: "bg-amber-600", D: "bg-orange-600", Expert: "bg-purple-700" };
  const evidenceDesc = { A: "Méta-analyse / ECR", B: "Études contrôlées", C: "Études observationnelles", D: "Opinion d'experts / Consensus", Expert: "Avis d'experts" };

  return (
    <div className="space-y-5">
      <Card className="p-6 bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Générateur de Protocoles Cliniques Institutionnels</h2>
            <p className="text-xs text-slate-500">Conforme HAS · SFAR · SFMU · OMS — Druide Ω niveau {consciousnessLevel}/15</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Pathologie ou Procédure <span className="text-red-500">*</span></label>
            <Input value={topic} onChange={e => setTopic(e.target.value)}
              placeholder="Ex: Prise en charge du choc septique, Protocole de sédation en réanimation, FOLFOX4 adjuvant côlon stade III..."
              className="text-sm" />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Spécialité</label>
              <Select onValueChange={setSpecialty}>
                <SelectTrigger className="text-sm"><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                <SelectContent>
                  {["Médecine générale", "Cardiologie", "Oncologie", "Réanimation / Soins intensifs", "Chirurgie générale", "Chirurgie cardiaque", "Pédiatrie", "Gynécologie-Obstétrique", "Neurologie", "Infectiologie / Maladies infectieuses", "Urgences", "Anesthésie", "Pharmacie clinique", "Pneumologie", "Gastro-entérologie", "Rhumatologie", "Psychiatrie"].map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Contexte de soins</label>
              <Select onValueChange={setSetting}>
                <SelectTrigger className="text-sm"><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                <SelectContent>
                  {["CHU / Centre hospitalier universitaire", "Hôpital général de district", "Clinique privée", "Centre de soins primaires / GMF", "Soins à domicile / SAD", "EHPAD / Soins de longue durée", "Service d'urgences", "Bloc opératoire", "Unité de soins intensifs", "Hôpital de jour"].map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Contraintes / Précisions spécifiques</label>
            <Textarea value={additionalConstraints} onChange={e => setAdditionalConstraints(e.target.value)}
              placeholder="Ex: Protocole pour pédiatrie uniquement, adaptation insuffisance rénale, ressources limitées, version simplifiée pour infirmières..."
              rows={2} className="text-sm" />
          </div>
          <Button onClick={generate} disabled={!topic.trim() || loading}
            className="w-full bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white h-12 text-base font-semibold shadow-md" size="lg">
            {loading
              ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Génération du protocole institutionnel...</>
              : <><ClipboardList className="w-5 h-5 mr-2" />Générer le Protocole Clinique</>}
          </Button>
          {loading && (
            <div className="text-center text-xs text-slate-400 animate-pulse">
              Consultation guidelines HAS · Recherche recommandations sociétés savantes · Structuration institutionnelle...
            </div>
          )}
        </div>
      </Card>

      <AnimatePresence>
        {protocol && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

            {/* En-tête officiel */}
            <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-500">
              <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                <div className="flex-1">
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-1">Protocole Clinique Institutionnel</p>
                  <h2 className="text-xl font-black text-slate-900 leading-tight">{protocol.protocol_title}</h2>
                  <p className="text-sm text-slate-600 mt-1">{protocol.target_population}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex gap-2 flex-wrap justify-end">
                    {protocol.version && <Badge variant="outline" className="font-mono">v{protocol.version}</Badge>}
                    {protocol.evidence_level && (
                      <Badge className={`${evidenceColors[protocol.evidence_level]} text-white`}>
                        Grade {protocol.evidence_level} — {evidenceDesc[protocol.evidence_level]}
                      </Badge>
                    )}
                  </div>
                  {protocol.reference_societies?.length > 0 && (
                    <div className="flex gap-1 flex-wrap justify-end">
                      {protocol.reference_societies.map((s, i) => (
                        <span key={i} className="text-xs bg-white border border-emerald-300 text-emerald-700 px-2 py-0.5 rounded">{s}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Calendar className="w-3 h-3" /> Révision : {protocol.revision_date || "À définir"}
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-700 bg-white/60 rounded-lg p-3">{protocol.objective}</p>
              <Button onClick={exportProtocol} variant="outline" size="sm" className="mt-3 gap-2 bg-white">
                <Download className="w-4 h-4" /> Exporter le protocole (.txt)
              </Button>
            </Card>

            {/* Critères inclusion/exclusion */}
            <div className="grid sm:grid-cols-2 gap-4">
              {protocol.inclusion_criteria?.length > 0 && (
                <Card className="p-4 bg-green-50 border border-green-200">
                  <h3 className="font-bold text-green-900 mb-2 text-xs uppercase tracking-wide flex items-center gap-1.5">
                    <Users className="w-4 h-4" /> Critères d'Inclusion
                  </h3>
                  <ul className="space-y-1">
                    {protocol.inclusion_criteria.map((c, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
                        <ChevronRight className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />{c}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
              {protocol.exclusion_criteria?.length > 0 && (
                <Card className="p-4 bg-red-50 border border-red-200">
                  <h3 className="font-bold text-red-900 mb-2 text-xs uppercase tracking-wide flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Critères d'Exclusion
                  </h3>
                  <ul className="space-y-1">
                    {protocol.exclusion_criteria.map((c, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
                        <ChevronRight className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />{c}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>

            {/* Populations spéciales */}
            {protocol.special_populations?.length > 0 && (
              <Card className="p-4 bg-amber-50 border border-amber-200">
                <h3 className="font-bold text-amber-900 mb-2 text-xs uppercase tracking-wide">Adaptations Populations Spéciales</h3>
                <div className="space-y-1.5">
                  {protocol.special_populations.map((sp, i) => (
                    <div key={i} className="flex items-start gap-2 bg-white rounded p-2 border border-amber-100">
                      <Badge className="bg-amber-500 text-white text-xs flex-shrink-0">{sp.group}</Badge>
                      <p className="text-xs text-slate-700">{sp.adaptation}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Ressources requises */}
            {protocol.required_resources?.length > 0 && (
              <Card className="p-5 bg-white border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wide">Ressources Requises</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {protocol.required_resources.map((res, i) => (
                    <div key={i} className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs font-bold text-slate-600 uppercase mb-1.5">{res.category}</p>
                      <ul className="space-y-0.5">
                        {res.items?.map((item, j) => <li key={j} className="text-xs text-slate-700 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-slate-400 flex-shrink-0" />{item}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Phases du protocole */}
            {protocol.phases?.map((phase, pi) => (
              <Card key={pi} className="p-5 bg-white border border-slate-200 overflow-hidden">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                  <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center flex-shrink-0">{pi + 1}</span>
                  <div>
                    <h3 className="font-black text-slate-900">{phase.phase_name}</h3>
                    {phase.phase_objective && <p className="text-xs text-slate-500">{phase.phase_objective}</p>}
                  </div>
                </div>
                <div className="space-y-2 relative">
                  <div className="absolute left-3.5 top-0 bottom-0 w-0.5 bg-slate-100" />
                  {phase.steps?.map((step, si) => (
                    <div key={si} className={`ml-7 p-3 rounded-lg border ${step.critical ? "border-red-300 bg-red-50" : step.decision_point ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-slate-50"}`}>
                      <div className="flex items-start gap-3">
                        <span className={`absolute -left-3.5 w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-black flex-shrink-0 ${step.critical ? "border-red-500 bg-red-500 text-white" : step.decision_point ? "border-blue-500 bg-blue-500 text-white" : "border-slate-300 bg-white text-slate-700"}`}>
                          {step.step_number || si + 1}
                        </span>
                        <div className="flex-1 -ml-3.5 pl-3.5">
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <p className="font-semibold text-slate-800 text-sm">{step.action}</p>
                            <div className="flex gap-1.5 flex-wrap">
                              {step.critical && <Badge className="bg-red-500 text-white text-xs">Critique</Badge>}
                              {step.decision_point && <Badge className="bg-blue-500 text-white text-xs">Décision</Badge>}
                            </div>
                          </div>
                          <div className="flex gap-4 mt-1 text-xs text-slate-500 flex-wrap">
                            {step.responsible && <span className="flex items-center gap-1">👤 {step.responsible}</span>}
                            {step.timing && <span className="flex items-center gap-1">⏱ {step.timing}</span>}
                          </div>
                          {step.decision_point && (
                            <div className="mt-2 grid grid-cols-2 gap-2">
                              {step.if_yes && <div className="bg-green-100 rounded p-1.5 text-xs"><span className="font-bold text-green-700">✓ Si OUI :</span> {step.if_yes}</div>}
                              {step.if_no && <div className="bg-red-100 rounded p-1.5 text-xs"><span className="font-bold text-red-700">✗ Si NON :</span> {step.if_no}</div>}
                            </div>
                          )}
                          {step.notes && <p className="mt-1 text-xs text-slate-500 italic bg-white rounded px-2 py-1 border border-slate-100">{step.notes}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}

            {/* Monitoring */}
            {protocol.monitoring_parameters?.length > 0 && (
              <Card className="p-5 bg-blue-50 border border-blue-200">
                <h3 className="font-bold text-blue-900 mb-3 text-xs uppercase tracking-wide">Paramètres de Surveillance</h3>
                <div className="space-y-2">
                  {protocol.monitoring_parameters.map((m, i) => (
                    <div key={i} className="bg-white rounded-lg p-3 border border-blue-100 grid sm:grid-cols-4 gap-2 text-xs">
                      <p className="font-bold text-slate-800">{m.parameter}</p>
                      <p className="text-slate-600">{m.frequency}</p>
                      <p className="text-green-700">{m.target}</p>
                      <p className="text-red-700 font-semibold">{m.alert}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Complications */}
            {protocol.complications_management?.length > 0 && (
              <Card className="p-5 bg-orange-50 border border-orange-200">
                <h3 className="font-bold text-orange-900 mb-3 text-xs uppercase tracking-wide">Gestion des Complications</h3>
                <div className="space-y-2">
                  {protocol.complications_management.map((comp, i) => (
                    <div key={i} className="bg-white rounded-lg p-3 border border-orange-200">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="font-bold text-slate-900 text-sm">{comp.complication}</p>
                        {comp.frequency && <span className="text-xs text-slate-400">({comp.frequency})</span>}
                      </div>
                      <p className="text-xs text-slate-700">→ {comp.management}</p>
                      {comp.escalation && <p className="text-xs text-red-700 mt-1">⬆ Escalade : {comp.escalation}</p>}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Références */}
            {protocol.references?.length > 0 && (
              <Card className="p-4 bg-slate-50 border border-slate-200">
                <h3 className="font-bold text-slate-700 mb-2 text-xs uppercase tracking-wide flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" /> Références & Niveau de Preuve
                </h3>
                <ol className="space-y-1.5">
                  {protocol.references.map((ref, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <span className="font-mono text-slate-400">[{i + 1}]</span>
                      <span className="flex-1">{ref.citation || ref}</span>
                      {ref.evidence_level && <Badge variant="outline" className="text-xs flex-shrink-0">{ref.evidence_level}</Badge>}
                    </li>
                  ))}
                </ol>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}