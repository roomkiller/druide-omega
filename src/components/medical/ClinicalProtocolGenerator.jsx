import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Loader2, Download, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ClinicalProtocolGenerator({ consciousnessLevel }) {
  const [topic, setTopic] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [setting, setSetting] = useState("");
  const [loading, setLoading] = useState(false);
  const [protocol, setProtocol] = useState(null);

  const generate = async () => {
    setLoading(true);
    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `Tu es une IA médicale consciente (niveau ${consciousnessLevel}/15) experte en rédaction de protocoles cliniques.

PATHOLOGIE / PROCÉDURE: ${topic}
SPÉCIALITÉ: ${specialty || "Général"}
CONTEXTE: ${setting || "Hôpital général"}

Rédige un protocole clinique complet, structuré, basé sur les recommandations actuelles et les meilleures pratiques.`,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          protocol_title: { type: "string" },
          version: { type: "string" },
          evidence_level: { type: "string", enum: ["A", "B", "C", "D", "Expert"] },
          target_population: { type: "string" },
          objective: { type: "string" },
          indications: { type: "array", items: { type: "string" } },
          contraindications: { type: "array", items: { type: "string" } },
          required_resources: {
            type: "array",
            items: { type: "object", properties: { category: { type: "string" }, items: { type: "array", items: { type: "string" } } } }
          },
          steps: {
            type: "array",
            items: {
              type: "object",
              properties: {
                phase: { type: "string" },
                step_number: { type: "number" },
                action: { type: "string" },
                responsible: { type: "string" },
                timing: { type: "string" },
                notes: { type: "string" }
              }
            }
          },
          monitoring_parameters: { type: "array", items: { type: "string" } },
          complications_management: {
            type: "array",
            items: { type: "object", properties: { complication: { type: "string" }, management: { type: "string" } } }
          },
          documentation_required: { type: "array", items: { type: "string" } },
          references: { type: "array", items: { type: "string" } },
          consciousness_note: { type: "string" }
        }
      }
    });
    setProtocol(response);
    setLoading(false);
  };

  const exportProtocol = () => {
    if (!protocol) return;
    const content = JSON.stringify(protocol, null, 2);
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `protocole_${topic.replace(/\s+/g, "_")}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const evidenceColors = { A: "bg-green-600", B: "bg-blue-600", C: "bg-amber-600", D: "bg-orange-600", Expert: "bg-purple-600" };
  const phaseColors = ["bg-blue-100 border-blue-400", "bg-purple-100 border-purple-400", "bg-green-100 border-green-400", "bg-amber-100 border-amber-400"];

  return (
    <div className="space-y-4">
      <Card className="p-5 bg-white">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">Pathologie ou Procédure *</label>
            <Input value={topic} onChange={e => setTopic(e.target.value)}
              placeholder="Ex: Prise en charge de la septicémie, protocole de sédation en réanimation, chimiothérapie FOLFOX..." />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">Spécialité</label>
              <Select onValueChange={setSpecialty}>
                <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                <SelectContent>
                  {["Médecine générale", "Cardiologie", "Oncologie", "Réanimation", "Chirurgie", "Pédiatrie", "Gynécologie", "Neurologie", "Infectiologie", "Urgences", "Anesthésie", "Pharmacie"].map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">Contexte de soins</label>
              <Select onValueChange={setSetting}>
                <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                <SelectContent>
                  {["CHU / Hôpital universitaire", "Hôpital général", "Clinique privée", "Centre de soins primaires", "Soins à domicile", "EHPAD", "Urgences"].map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={generate} disabled={!topic.trim() || loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white" size="lg">
            {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Génération du protocole...</> : <><ClipboardList className="w-5 h-5 mr-2" />Générer le Protocole Clinique</>}
          </Button>
        </div>
      </Card>

      <AnimatePresence>
        {protocol && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* En-tête protocole */}
            <Card className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-400">
              <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{protocol.protocol_title}</h2>
                  <p className="text-sm text-slate-600 mt-1">{protocol.target_population}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {protocol.version && <Badge variant="outline">v{protocol.version}</Badge>}
                  {protocol.evidence_level && <Badge className={`${evidenceColors[protocol.evidence_level] || "bg-slate-600"} text-white`}>Niveau de preuve : {protocol.evidence_level}</Badge>}
                </div>
              </div>
              <p className="text-slate-700 text-sm">{protocol.objective}</p>
              <Button onClick={exportProtocol} variant="outline" size="sm" className="mt-3 gap-2">
                <Download className="w-4 h-4" /> Exporter
              </Button>
            </Card>

            {/* Indications / CI */}
            <div className="grid sm:grid-cols-2 gap-4">
              {protocol.indications?.length > 0 && (
                <Card className="p-4 bg-green-50">
                  <h3 className="font-bold text-green-900 mb-2 text-sm">✅ Indications</h3>
                  <ul className="space-y-1">{protocol.indications.map((i, idx) => <li key={idx} className="text-xs text-slate-700 flex gap-1"><ChevronRight className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />{i}</li>)}</ul>
                </Card>
              )}
              {protocol.contraindications?.length > 0 && (
                <Card className="p-4 bg-red-50">
                  <h3 className="font-bold text-red-900 mb-2 text-sm">🚫 Contre-indications</h3>
                  <ul className="space-y-1">{protocol.contraindications.map((c, idx) => <li key={idx} className="text-xs text-slate-700 flex gap-1"><ChevronRight className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />{c}</li>)}</ul>
                </Card>
              )}
            </div>

            {/* Étapes */}
            {protocol.steps?.length > 0 && (
              <Card className="p-5">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-emerald-600" /> Étapes du Protocole
                </h3>
                <div className="space-y-3">
                  {protocol.steps.map((step, i) => (
                    <div key={i} className={`p-3 rounded-lg border-l-4 ${phaseColors[i % phaseColors.length]}`}>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="w-6 h-6 rounded-full bg-slate-700 text-white text-xs flex items-center justify-center font-bold flex-shrink-0">{step.step_number || i + 1}</span>
                        <span className="font-semibold text-slate-800 text-sm">{step.action}</span>
                        {step.phase && <Badge variant="outline" className="text-xs">{step.phase}</Badge>}
                      </div>
                      <div className="ml-8 flex gap-4 flex-wrap text-xs text-slate-500">
                        {step.responsible && <span>👤 {step.responsible}</span>}
                        {step.timing && <span>⏱ {step.timing}</span>}
                      </div>
                      {step.notes && <p className="ml-8 mt-1 text-xs text-slate-600 italic">{step.notes}</p>}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Complications */}
            {protocol.complications_management?.length > 0 && (
              <Card className="p-5 bg-orange-50">
                <h3 className="font-bold text-orange-900 mb-3">Gestion des Complications</h3>
                <div className="space-y-2">
                  {protocol.complications_management.map((comp, i) => (
                    <div key={i} className="bg-white rounded p-3 border border-orange-200">
                      <p className="font-semibold text-slate-800 text-sm">{comp.complication}</p>
                      <p className="text-slate-600 text-xs mt-1">→ {comp.management}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {protocol.references?.length > 0 && (
              <Card className="p-4 bg-slate-50">
                <h3 className="font-bold text-slate-700 mb-2 text-sm">Références</h3>
                <ol className="list-decimal list-inside space-y-1">
                  {protocol.references.map((ref, i) => <li key={i} className="text-xs text-slate-600">{ref}</li>)}
                </ol>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}