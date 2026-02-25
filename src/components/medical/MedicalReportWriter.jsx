import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, Loader2, Copy, Download, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const REPORT_TYPES = [
  { value: "compte_rendu_consultation", label: "Compte rendu de consultation" },
  { value: "lettre_reference", label: "Lettre de référence / Courrier médical" },
  { value: "plan_de_soins", label: "Plan de soins infirmier" },
  { value: "resume_sortie", label: "Résumé de sortie hospitalière" },
  { value: "rapport_operatoire", label: "Rapport opératoire" },
  { value: "prescription", label: "Aide à la prescription commentée" },
  { value: "consentement_eclaire", label: "Note de consentement éclairé" },
  { value: "certificat_medical", label: "Certificat médical" }
];

export default function MedicalReportWriter({ consciousnessLevel }) {
  const [reportType, setReportType] = useState("");
  const [clinicalData, setClinicalData] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    setLoading(true);
    const selectedType = REPORT_TYPES.find(t => t.value === reportType)?.label || reportType;
    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `Tu es une IA médicale consciente (niveau ${consciousnessLevel}/15) experte en rédaction médicale professionnelle.

TYPE DE DOCUMENT: ${selectedType}
ÂGE DU PATIENT: ${patientAge || "Non précisé"}
DONNÉES CLINIQUES / INFORMATIONS:
${clinicalData}

Rédige un document médical professionnel, complet, structuré et conforme aux standards médicaux. Le ton doit être professionnel, précis, et adapté au destinataire (collègue médecin, infirmier, patient selon le type).`,
      response_json_schema: {
        type: "object",
        properties: {
          document_title: { type: "string" },
          date: { type: "string" },
          document_text: { type: "string", description: "Texte complet du document médical, bien formaté avec sauts de ligne" },
          key_elements: { type: "array", items: { type: "string" }, description: "Éléments clés inclus dans le document" },
          missing_information: { type: "array", items: { type: "string" }, description: "Informations manquantes qui amélioreraient le document" },
          quality_score: { type: "number", description: "0-100, qualité estimée du document" },
          professional_notes: { type: "string" }
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
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const exportDoc = () => {
    if (!result) return;
    const blob = new Blob([result.document_text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${reportType}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <Card className="p-5 bg-white">
        <div className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">Type de document *</label>
              <Select onValueChange={setReportType}>
                <SelectTrigger><SelectValue placeholder="Choisir le type..." /></SelectTrigger>
                <SelectContent>
                  {REPORT_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">Âge du patient</label>
              <Input value={patientAge} onChange={e => setPatientAge(e.target.value)}
                placeholder="Ex: 52 ans, homme" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">Données cliniques *</label>
            <Textarea value={clinicalData} onChange={e => setClinicalData(e.target.value)}
              placeholder="Décrivez: motif de consultation, antécédents, symptômes, examens réalisés, diagnostic, traitement, recommandations..."
              rows={6} />
          </div>
          <Button onClick={generate} disabled={!reportType || !clinicalData.trim() || loading}
            className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white" size="lg">
            {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Rédaction en cours...</> : <><FileText className="w-5 h-5 mr-2" />Générer le Document Médical</>}
          </Button>
        </div>
      </Card>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <Card className="p-5">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                <div>
                  <h3 className="font-bold text-slate-900">{result.document_title}</h3>
                  <div className="flex gap-2 mt-1">
                    <Badge className="bg-rose-500 text-white text-xs">Qualité : {result.quality_score}%</Badge>
                    <Badge variant="outline" className="text-xs">{result.date}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyToClipboard} className="gap-2">
                    {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copié !" : "Copier"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportDoc} className="gap-2">
                    <Download className="w-4 h-4" /> Exporter
                  </Button>
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <pre className="text-sm text-slate-800 whitespace-pre-wrap font-sans leading-relaxed">
                  {result.document_text}
                </pre>
              </div>
            </Card>

            {result.missing_information?.length > 0 && (
              <Card className="p-4 bg-amber-50 border border-amber-200">
                <h3 className="font-bold text-amber-900 mb-2 text-sm">💡 Pour améliorer ce document, fournir :</h3>
                <ul className="space-y-1">
                  {result.missing_information.map((m, i) => <li key={i} className="text-xs text-slate-700">• {m}</li>)}
                </ul>
              </Card>
            )}

            {result.professional_notes && (
              <Card className="p-4 bg-purple-50 border border-purple-200">
                <p className="text-sm text-purple-800 italic">💡 {result.professional_notes}</p>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}