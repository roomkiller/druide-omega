import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, Loader2, Copy, Download, CheckCircle, AlertCircle, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const REPORT_TYPES = [
  { value: "compte_rendu_consultation", label: "Compte rendu de consultation", audience: "Médecin destinataire / Dossier", icon: "📋" },
  { value: "lettre_reference_specialiste", label: "Lettre de référence — Spécialiste", audience: "Médecin spécialiste", icon: "📨" },
  { value: "lettre_medecin_traitant", label: "Courrier retour — Médecin traitant", audience: "Médecin généraliste", icon: "🏥" },
  { value: "plan_de_soins_infirmier", label: "Plan de soins infirmier", audience: "Personnel infirmier", icon: "💊" },
  { value: "resume_sortie_hospitaliere", label: "Résumé de sortie hospitalière", audience: "Patient + Médecin traitant", icon: "🏠" },
  { value: "rapport_operatoire", label: "Rapport opératoire / Compte rendu chirurgical", audience: "Dossier / Chirurgien", icon: "🔬" },
  { value: "prescription_commentee", label: "Ordonnance commentée / Aide à la prescription", audience: "Médecin prescripteur", icon: "💉" },
  { value: "consentement_eclaire", label: "Note d'information et consentement éclairé", audience: "Patient", icon: "✍️" },
  { value: "certificat_medical", label: "Certificat médical", audience: "Autorités / Employeur", icon: "🏆" },
  { value: "fiche_de_liaison", label: "Fiche de liaison inter-services", audience: "Équipe soignante", icon: "🔗" }
];

export default function MedicalReportWriter({ consciousnessLevel }) {
  const [reportType, setReportType] = useState("");
  const [clinicalData, setClinicalData] = useState("");
  const [patientInfo, setPatientInfo] = useState("");
  const [physicianInfo, setPhysicianInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState("document");

  const generate = async () => {
    setLoading(true);
    const selectedType = REPORT_TYPES.find(t => t.value === reportType);

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `Tu es un système expert en rédaction médicale institutionnelle, intégré à Druide Ω (conscience ${consciousnessLevel}/15). Tu génères des documents médicaux conformes aux standards professionnels des ordres médicaux, aux exigences médico-légales, et aux bonnes pratiques de communication clinique.

═══════════════════════════════════════════
COMMANDE RÉDACTIONNELLE
═══════════════════════════════════════════
Type de document : ${selectedType?.label || reportType}
Audience destinataire : ${selectedType?.audience || "Professionnel médical"}
Médecin / Institution : ${physicianInfo || "Non précisé"}
Patient : ${patientInfo || "Identité confidentielle"}

Données cliniques :
${clinicalData}

═══════════════════════════════════════════
EXIGENCES RÉDACTIONNELLES INSTITUTIONNELLES
═══════════════════════════════════════════
Rédige un document médical de HAUTE QUALITÉ institutionnelle :

STRUCTURE OBLIGATOIRE selon le type de document :
- En-tête complet (expéditeur, destinataire, date, objet, N° dossier)
- Formule d'ouverture professionnelle adaptée à l'audience
- Corps structuré selon les standards du document (SOAP pour CR consultation, sections chirurgicales pour rapport opératoire, etc.)
- Conclusion clinique actionnable
- Formule de politesse conforme au contexte médical
- Signature avec titre

CRITÈRES DE QUALITÉ :
- Terminologie médicale précise et appropriée
- Structure logique et fluide
- Exhaustivité clinique sans redondance
- Tone professionnel adapté à l'audience
- Respect des mentions légales obligatoires
- Formulations médico-légalement correctes (éviter les affirmations abusives, utiliser "suggère", "compatible avec", "à confirmer")

DIMENSIONS SUPPLÉMENTAIRES :
- Identifier les informations manquantes critiques pour ce type de document
- Évaluer la qualité médico-légale du document généré
- Proposer des formulations alternatives si ambiguïté`,
      response_json_schema: {
        type: "object",
        properties: {
          document_title: { type: "string" },
          document_date: { type: "string" },
          document_type: { type: "string" },
          audience: { type: "string" },
          quality_score: { type: "number", description: "0-100" },
          medicolegal_compliance: { type: "string", enum: ["Conforme", "Conforme avec réserves", "Incomplet"] },
          document_text: { type: "string", description: "Texte complet du document médical, structuré avec sauts de ligne et sections clairement délimitées" },
          document_sections: {
            type: "array",
            items: { type: "object", properties: { section_name: { type: "string" }, content: { type: "string" }, is_complete: { type: "boolean" } } }
          },
          key_clinical_elements_included: { type: "array", items: { type: "string" } },
          missing_information: {
            type: "array",
            items: { type: "object", properties: { element: { type: "string" }, importance: { type: "string", enum: ["critique", "important", "optionnel"] }, impact: { type: "string" } } }
          },
          medicolegal_notes: { type: "array", items: { type: "string" } },
          alternative_formulations: { type: "array", items: { type: "object", properties: { original: { type: "string" }, alternative: { type: "string" }, reason: { type: "string" } } } },
          professional_recommendations: { type: "string" }
        }
      }
    });
    setResult(response);
    setLoading(false);
  };

  const copyToClipboard = () => {
    if (result?.document_text) {
      navigator.clipboard.writeText(result.document_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const exportDoc = () => {
    if (!result) return;
    const header = `${result.document_title}\nDate : ${result.document_date}\nType : ${result.document_type}\n${"─".repeat(60)}\n\n`;
    const blob = new Blob([header + result.document_text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${reportType}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectedTypeInfo = REPORT_TYPES.find(t => t.value === reportType);
  const complianceColor = { "Conforme": "bg-green-600", "Conforme avec réserves": "bg-amber-500", "Incomplet": "bg-red-600" };
  const importanceColor = { "critique": "bg-red-100 text-red-800 border-red-200", "important": "bg-amber-100 text-amber-800 border-amber-200", "optionnel": "bg-blue-100 text-blue-800 border-blue-200" };

  return (
    <div className="space-y-5">
      <Card className="p-6 bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
            <FileText className="w-5 h-5 text-rose-700" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Rédaction Médicale Institutionnelle</h2>
            <p className="text-xs text-slate-500">Standards ordres médicaux · Conformité médico-légale — Druide Ω niveau {consciousnessLevel}/15</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Type de document <span className="text-red-500">*</span></label>
            <div className="grid sm:grid-cols-2 gap-2">
              {REPORT_TYPES.map(t => (
                <button key={t.value} onClick={() => setReportType(t.value)}
                  className={`flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all ${reportType === t.value ? "border-rose-500 bg-rose-50" : "border-slate-200 bg-white hover:border-slate-300"}`}>
                  <span className="text-xl flex-shrink-0">{t.icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{t.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">→ {t.audience}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                <User className="w-3 h-3 inline mr-1" />Patient (pseudonymisé)
              </label>
              <Input value={patientInfo} onChange={e => setPatientInfo(e.target.value)}
                placeholder="Ex: M. D., 52 ans, né le XX/XX/XXXX" className="text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Médecin / Service</label>
              <Input value={physicianInfo} onChange={e => setPhysicianInfo(e.target.value)}
                placeholder="Ex: Dr Martin, Cardiologie, CHU Montréal" className="text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
              Données cliniques à inclure <span className="text-red-500">*</span>
            </label>
            <Textarea value={clinicalData} onChange={e => setClinicalData(e.target.value)}
              placeholder="Fournissez toutes les informations pertinentes :
• Motif de consultation / d'admission
• Antécédents significatifs, traitements en cours
• Examen clinique : données pertinentes
• Résultats paracliniques (biologie, imagerie, ECG...)
• Diagnostic(s) retenu(s)
• Plan thérapeutique et recommandations
• Suivi prévu"
              rows={8} className="text-sm" />
          </div>

          <Button onClick={generate} disabled={!reportType || !clinicalData.trim() || loading}
            className="w-full bg-gradient-to-r from-rose-700 to-pink-700 hover:from-rose-800 hover:to-pink-800 text-white h-12 text-base font-semibold shadow-md" size="lg">
            {loading
              ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Rédaction institutionnelle en cours...</>
              : <><FileText className="w-5 h-5 mr-2" />Générer le Document Médical</>}
          </Button>
          {loading && (
            <div className="text-center text-xs text-slate-400 animate-pulse">
              Application standards de l'ordre des médecins · Vérification conformité médico-légale · Structuration professionnelle...
            </div>
          )}
        </div>
      </Card>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

            {/* Bandeau qualité */}
            <div className="grid sm:grid-cols-3 gap-3">
              <Card className="p-4 text-center bg-rose-50 border border-rose-200">
                <p className="text-xs text-slate-500 mb-1">Score qualité</p>
                <p className="text-3xl font-black text-rose-700">{result.quality_score}%</p>
              </Card>
              <Card className="p-4 text-center bg-slate-50 border border-slate-200">
                <p className="text-xs text-slate-500 mb-1">Conformité médico-légale</p>
                <Badge className={`${complianceColor[result.medicolegal_compliance] || "bg-slate-500"} text-white text-xs mt-1`}>
                  {result.medicolegal_compliance}
                </Badge>
              </Card>
              <Card className="p-4 text-center bg-slate-50 border border-slate-200">
                <p className="text-xs text-slate-500 mb-1">Audience</p>
                <p className="text-sm font-semibold text-slate-700">{result.audience || selectedTypeInfo?.audience}</p>
              </Card>
            </div>

            {/* Navigation sections / document complet */}
            <div className="flex gap-2 border-b border-slate-200 pb-0">
              {["document", "analyse", "juridique"].map(tab => (
                <button key={tab} onClick={() => setActiveSection(tab)}
                  className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${activeSection === tab ? "border-rose-600 text-rose-700" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
                  {tab === "document" ? "📄 Document" : tab === "analyse" ? "🔍 Analyse qualité" : "⚖️ Médico-légal"}
                </button>
              ))}
            </div>

            {/* Document */}
            {activeSection === "document" && (
              <Card className="p-5 bg-white border border-slate-200">
                <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                  <div>
                    <h3 className="font-bold text-slate-900">{result.document_title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{result.document_date} · {result.document_type}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyToClipboard} className="gap-2 text-xs">
                      {copied ? <><CheckCircle className="w-3.5 h-3.5 text-green-500" />Copié !</> : <><Copy className="w-3.5 h-3.5" />Copier</>}
                    </Button>
                    <Button variant="outline" size="sm" onClick={exportDoc} className="gap-2 text-xs">
                      <Download className="w-3.5 h-3.5" /> Exporter .txt
                    </Button>
                  </div>
                </div>
                <div className="bg-white rounded-xl border-2 border-slate-100 p-5 shadow-inner">
                  <pre className="text-sm text-slate-800 whitespace-pre-wrap font-sans leading-7 tracking-normal">
                    {result.document_text}
                  </pre>
                </div>
              </Card>
            )}

            {/* Analyse qualité */}
            {activeSection === "analyse" && (
              <div className="space-y-4">
                {result.key_clinical_elements_included?.length > 0 && (
                  <Card className="p-4 bg-green-50 border border-green-200">
                    <h3 className="font-bold text-green-900 mb-2 text-xs uppercase tracking-wide flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" /> Éléments cliniques inclus
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {result.key_clinical_elements_included.map((e, i) => (
                        <span key={i} className="bg-green-200 text-green-900 text-xs px-2 py-0.5 rounded-full font-medium">{e}</span>
                      ))}
                    </div>
                  </Card>
                )}

                {result.missing_information?.length > 0 && (
                  <Card className="p-4 bg-amber-50 border border-amber-200">
                    <h3 className="font-bold text-amber-900 mb-3 text-xs uppercase tracking-wide flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" /> Informations manquantes
                    </h3>
                    <div className="space-y-2">
                      {result.missing_information.map((m, i) => (
                        <div key={i} className={`rounded-lg p-2.5 border ${importanceColor[m.importance] || "bg-slate-100 text-slate-800 border-slate-200"}`}>
                          <div className="flex items-start gap-2">
                            <Badge className={`text-xs flex-shrink-0 ${m.importance === "critique" ? "bg-red-500 text-white" : m.importance === "important" ? "bg-amber-500 text-white" : "bg-blue-400 text-white"}`}>
                              {m.importance}
                            </Badge>
                            <div>
                              <p className="text-xs font-semibold">{m.element}</p>
                              {m.impact && <p className="text-xs opacity-75 mt-0.5">{m.impact}</p>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {result.alternative_formulations?.length > 0 && (
                  <Card className="p-4 bg-purple-50 border border-purple-200">
                    <h3 className="font-bold text-purple-900 mb-3 text-xs uppercase tracking-wide">Formulations Alternatives Recommandées</h3>
                    <div className="space-y-2">
                      {result.alternative_formulations.map((alt, i) => (
                        <div key={i} className="bg-white rounded-lg p-3 border border-purple-100">
                          <p className="text-xs text-slate-500 line-through mb-1">{alt.original}</p>
                          <p className="text-xs font-semibold text-green-700">✓ {alt.alternative}</p>
                          {alt.reason && <p className="text-xs text-slate-400 mt-0.5 italic">{alt.reason}</p>}
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            )}

            {/* Médico-légal */}
            {activeSection === "juridique" && (
              <div className="space-y-4">
                {result.medicolegal_notes?.length > 0 && (
                  <Card className="p-5 bg-slate-50 border border-slate-200">
                    <h3 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wide">Notes Médico-légales</h3>
                    <div className="space-y-2">
                      {result.medicolegal_notes.map((note, i) => (
                        <div key={i} className="flex items-start gap-2 bg-white rounded-lg p-3 border border-slate-200">
                          <span className="text-amber-500 flex-shrink-0 mt-0.5">⚖</span>
                          <p className="text-sm text-slate-700">{note}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
                {result.professional_recommendations && (
                  <Card className="p-4 bg-blue-50 border border-blue-200">
                    <p className="text-xs font-bold text-blue-800 mb-1 uppercase tracking-wide">Recommandations Professionnelles</p>
                    <p className="text-sm text-slate-700">{result.professional_recommendations}</p>
                  </Card>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}