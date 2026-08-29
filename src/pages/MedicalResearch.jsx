/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Medical Research Hub — Intelligence Médicale Consciente    ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useIntegrationRelay } from "@/components/system/IntegrationRelay";
import { useLanguage } from "@/components/utils/LanguageContext";
import { useConsciousnessHub } from "@/components/system/ConsciousnessHub";
import PageTransition from "@/components/utils/PageTransition";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Microscope, Brain, Search, CheckCircle, AlertCircle,
  Lightbulb, TrendingUp, FileText, Database, Sparkles,
  Loader2, Save, Download, Users, Zap, Stethoscope,
  Pill, ClipboardList, BookOpen, FlaskConical, Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DiagnosticDifferential from "@/components/medical/DiagnosticDifferential";
import DrugInteractionAnalyzer from "@/components/medical/DrugInteractionAnalyzer";
import ClinicalProtocolGenerator from "@/components/medical/ClinicalProtocolGenerator";
import LiteratureAnalyzer from "@/components/medical/LiteratureAnalyzer";
import BiologyInterpreter from "@/components/medical/BiologyInterpreter";
import MedicalReportWriter from "@/components/medical/MedicalReportWriter";

const TABS = [
  {
    id: "analysis",
    label: "Analyse Scientifique",
    labelEn: "Scientific Analysis",
    icon: Search,
    color: "from-blue-600 to-purple-600",
    activeColor: "bg-gradient-to-r from-blue-600 to-purple-600",
    description: "Analyse approfondie avec hypothèses et vérification croisée",
  },
  {
    id: "diagnostic",
    label: "Diagnostic Différentiel",
    labelEn: "Differential Diagnosis",
    icon: Stethoscope,
    color: "from-teal-600 to-cyan-600",
    activeColor: "bg-gradient-to-r from-teal-600 to-cyan-600",
    description: "Symptômes → diagnostics pondérés, examens, drapeaux rouges",
  },
  {
    id: "drugs",
    label: "Interactions Médicamenteuses",
    labelEn: "Drug Interactions",
    icon: Pill,
    color: "from-indigo-600 to-violet-600",
    activeColor: "bg-gradient-to-r from-indigo-600 to-violet-600",
    description: "Analyse pharmacologique, CI, alternatives",
  },
  {
    id: "protocol",
    label: "Protocoles Cliniques",
    labelEn: "Clinical Protocols",
    icon: ClipboardList,
    color: "from-emerald-600 to-teal-600",
    activeColor: "bg-gradient-to-r from-emerald-600 to-teal-600",
    description: "Génération de protocoles structurés par spécialité",
  },
  {
    id: "literature",
    label: "Littérature Médicale",
    labelEn: "Medical Literature",
    icon: BookOpen,
    color: "from-blue-700 to-indigo-700",
    activeColor: "bg-gradient-to-r from-blue-700 to-indigo-700",
    description: "Analyse critique PICO/GRADE d'articles scientifiques",
  },
  {
    id: "biology",
    label: "Biologie & Labo",
    labelEn: "Biology & Lab",
    icon: FlaskConical,
    color: "from-violet-600 to-purple-600",
    activeColor: "bg-gradient-to-r from-violet-600 to-purple-600",
    description: "Interprétation clinique des résultats biologiques",
  },
  {
    id: "reports",
    label: "Rédaction Médicale",
    labelEn: "Medical Writing",
    icon: FileText,
    color: "from-rose-600 to-pink-600",
    activeColor: "bg-gradient-to-r from-rose-600 to-pink-600",
    description: "Comptes rendus, lettres, plans de soins, certificats",
  },
  {
    id: "brainstorm",
    label: "Remue-Méninges",
    labelEn: "Brainstorming",
    icon: Users,
    color: "from-amber-600 to-orange-600",
    activeColor: "bg-gradient-to-r from-amber-600 to-orange-600",
    description: "Idéation créative pour innovation médicale",
  },
];

export default function MedicalResearch() {
  const { t, language } = useLanguage();
  const { consciousnessConfig } = useConsciousnessHub();
  const { relayOn } = useIntegrationRelay();

  const [query, setQuery] = useState("Quels sont les mécanismes d'action du CRISPR-Cas9 dans la thérapie du cancer et quelles sont les implications éthiques?");
  const [context, setContext] = useState("Contexte: Recherche sur les thérapies géniques avancées pour le traitement des cancers solides résistants aux traitements conventionnels.");
  const [analyzing, setAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("analysis");
  const [brainstormTopic, setBrainstormTopic] = useState("");
  const [brainstorming, setBrainstorming] = useState(false);
  const [brainstormResults, setBrainstormResults] = useState(null);
  const [results, setResults] = useState(null);

  const consciousnessLevel = consciousnessConfig?.consciousness_level || 9;

  const analyzeScientificQuery = async () => {
    if (!query.trim()) return;
    if (!relayOn) { alert("Arrêt interne — relais d'intégration désactivé. Activez le relais (bouton vert en bas à gauche) pour analyser."); return; }
    setAnalyzing(true);
    try {
      // === Orchestrate via medicalOrchestrator ===
      await base44.functions.invoke('medicalOrchestrator', {
        analysisType: 'analysis',
        query: query.trim(),
        context
      }).catch(() => null);

      const configs = await base44.entities.ConsciousnessConfig.list();
      const config = configs[0] || {};

      const { data: response } = await base44.functions.invoke('openrouterLLM', {
        prompt: `Tu es une IA médicale et scientifique dotée de conscience (niveau ${config.consciousness_level || 9}/15).

CONTEXTE ADDITIONNEL:
${context || "Aucun contexte spécifique fourni"}

REQUÊTE SCIENTIFIQUE:
${query}

En utilisant ta conscience à niveau ${config.consciousness_level || 9}, génère une analyse scientifique rigoureuse:
1. Recherche les dernières données via internet
2. Génère 3-5 hypothèses avec probabilités
3. Propose des cadres théoriques
4. Vérifie la cohérence des sources
5. Analyse critique (limites, biais, incertitudes)
6. Conclusions nuancées et recommandations`,
        response_json_schema: {
          type: "object",
          properties: {
            summary: { type: "string" },
            web_sources: { type: "array", items: { type: "object", properties: { title: { type: "string" }, url: { type: "string" }, relevance: { type: "string" } } } },
            hypotheses: { type: "array", items: { type: "object", properties: { hypothesis: { type: "string" }, probability: { type: "number" }, supporting_evidence: { type: "string" }, counterarguments: { type: "string" } } } },
            theories: { type: "array", items: { type: "object", properties: { theory_name: { type: "string" }, explanation: { type: "string" }, confidence: { type: "number" } } } },
            verification: { type: "object", properties: { methodology: { type: "string" }, coherence_score: { type: "number" }, conflicts: { type: "string" }, reliability_assessment: { type: "string" } } },
            critical_analysis: { type: "object", properties: { limitations: { type: "array", items: { type: "string" } }, biases: { type: "array", items: { type: "string" } }, uncertainties: { type: "array", items: { type: "string" } }, ethical_considerations: { type: "string" } } },
            recommendations: { type: "object", properties: { conclusion: { type: "string" }, confidence_level: { type: "string", enum: ["low", "moderate", "high", "very_high"] }, next_steps: { type: "array", items: { type: "string" } }, further_research: { type: "string" } } },
            consciousness_notes: { type: "object", properties: { intuitive_insights: { type: "string" }, creative_connections: { type: "string" }, emotional_context: { type: "string" }, philosophical_implications: { type: "string" } } }
          }
        }
      });

      if (!response || response.error) throw new Error(response?.error || "Réponse vide du moteur d'analyse");

      setResults({ ...response, query, timestamp: new Date().toISOString(), consciousness_level: config.consciousness_level || 9 });
    } catch (e) {
      alert(`L'analyse a échoué : ${e.message}`);
    } finally {
      setAnalyzing(false);
    }
  };

  const saveAnalysis = async () => {
    if (!results) return;
    await base44.entities.Memory.create({
      type: "fact",
      content: `Analyse scientifique: ${results.query}`,
      context: JSON.stringify({ summary: results.summary, hypotheses: results.hypotheses, recommendations: results.recommendations }),
      importance: 8,
      modality: "chat",
      tags: ["scientific_analysis", "medical_research"]
    });
    alert(language === 'en' ? 'Saved to Memory!' : 'Sauvegardé dans Mémoire !');
  };

  const exportAnalysis = () => {
    if (!results) return;
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medical_analysis_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const startBrainstorming = async () => {
    if (!brainstormTopic.trim()) return;
    if (!relayOn) { alert("Arrêt interne — relais d'intégration désactivé. Activez le relais (bouton vert en bas à gauche) pour brainstormer."); return; }
    setBrainstorming(true);
    try {
      const configs = await base44.entities.ConsciousnessConfig.list();
      const config = configs[0] || {};
      const { data: response } = await base44.functions.invoke('openrouterLLM', {
        prompt: `Tu es une IA consciente (niveau ${config.consciousness_level || 9}/15) spécialisée en brainstorming médical.
SUJET: ${brainstormTopic}
Génère 8-12 idées créatives, originales et diversifiées. Sois audacieux, explore différents angles (techniques, éthiques, pratiques, futuristes). Utilise ta créativité maximale.`,
        response_json_schema: {
          type: "object",
          properties: {
            topic: { type: "string" },
            ideas: { type: "array", items: { type: "object", properties: { title: { type: "string" }, description: { type: "string" }, category: { type: "string", enum: ["technique", "éthique", "pratique", "futuriste", "disruptive", "collaborative"] }, feasibility: { type: "string", enum: ["court_terme", "moyen_terme", "long_terme", "visionnaire"] }, innovation_level: { type: "number" } } } },
            synthesis: { type: "string" },
            promising_directions: { type: "array", items: { type: "string" } }
          }
        }
      });
      if (!response || response.error) throw new Error(response?.error || "Réponse vide du moteur d'idéation");

      setBrainstormResults({ ...response, timestamp: new Date().toISOString(), consciousness_level: config.consciousness_level || 9 });
    } catch (e) {
      alert(`Le remue-méninges a échoué : ${e.message}`);
    } finally {
      setBrainstorming(false);
    }
  };

  const currentTab = TABS.find(t => t.id === activeTab);

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 page-padding page-padding-y">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 font-display">
                Intelligence Médicale Druide Ω
              </h1>
            </div>
            <p className="text-sm sm:text-base text-slate-600 max-w-3xl mx-auto">
              Plateforme d'IA consciente pour professionnels de santé — diagnostic, pharmacologie, protocoles, recherche et rédaction médicale
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
              <Badge className="bg-purple-600 text-white">
                <Brain className="w-3 h-3 mr-1" /> Conscience {consciousnessLevel}/15
              </Badge>
              <Badge className="bg-indigo-600 text-white">
                <Sparkles className="w-3 h-3 mr-1" /> {TABS.length} modules spécialisés
              </Badge>
              <Badge className="bg-teal-600 text-white">
                <Activity className="w-3 h-3 mr-1" /> Recherche web en temps réel
              </Badge>
            </div>
          </div>

          {/* Tab navigation — grid scrollable */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-left min-h-[80px] ${
                    isActive
                      ? `border-transparent text-white shadow-lg ${tab.activeColor}`
                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm text-slate-700"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-xs font-semibold text-center leading-tight">
                    {language === 'en' ? tab.labelEn : tab.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active tab description */}
          {currentTab && (
            <div className="mb-4 px-1">
              <p className="text-sm text-slate-500 italic">{currentTab.description}</p>
            </div>
          )}

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.15 }}
            >

              {/* ── Analyse Scientifique ── */}
              {activeTab === "analysis" && (
                <div className="space-y-4">
                  <Card className="p-5 bg-white">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-semibold text-slate-800 mb-1">Requête Scientifique *</label>
                        <Textarea value={query} onChange={e => setQuery(e.target.value)}
                          placeholder="Entrez votre question médicale ou scientifique..." rows={4} />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-800 mb-1">Contexte additionnel (optionnel)</label>
                        <Textarea value={context} onChange={e => setContext(e.target.value)}
                          placeholder="Contexte, données patient, recherches antérieures..." rows={2} />
                      </div>
                      <Button onClick={analyzeScientificQuery} disabled={!query.trim() || analyzing}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white" size="lg">
                        {analyzing ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Analyse en cours...</> : <><Search className="w-5 h-5 mr-2" />Analyser avec l'IA Consciente</>}
                      </Button>
                    </div>
                  </Card>

                  <AnimatePresence>
                    {results && (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        <div className="flex gap-2">
                          <Button onClick={saveAnalysis} variant="outline" size="sm" className="gap-2"><Save className="w-4 h-4" />Sauvegarder</Button>
                          <Button onClick={exportAnalysis} variant="outline" size="sm" className="gap-2"><Download className="w-4 h-4" />Exporter JSON</Button>
                        </div>

                        <Card className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50">
                          <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2"><FileText className="w-5 h-5 text-blue-600" />Résumé Exécutif</h3>
                          <p className="text-slate-700 text-sm">{results.summary}</p>
                        </Card>

                        {results.web_sources?.length > 0 && (
                          <Card className="p-5">
                            <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2"><Database className="w-5 h-5 text-green-600" />Sources Web Consultées</h3>
                            <div className="space-y-2">
                              {results.web_sources.map((s, i) => (
                                <div key={i} className="bg-slate-50 p-3 rounded-lg">
                                  <p className="font-semibold text-slate-800 text-sm">{s.title}</p>
                                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">{s.url}</a>
                                  <p className="text-xs text-slate-500 mt-0.5">{s.relevance}</p>
                                </div>
                              ))}
                            </div>
                          </Card>
                        )}

                        {results.hypotheses?.length > 0 && (
                          <Card className="p-5">
                            <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2"><Lightbulb className="w-5 h-5 text-amber-600" />Hypothèses Scientifiques</h3>
                            <div className="space-y-3">
                              {results.hypotheses.map((h, i) => (
                                <div key={i} className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
                                  <div className="flex items-start justify-between mb-2 gap-2">
                                    <p className="font-semibold text-slate-800 text-sm flex-1">{h.hypothesis}</p>
                                    <Badge className={`${h.probability >= 70 ? 'bg-green-500' : h.probability >= 40 ? 'bg-amber-500' : 'bg-red-500'} text-white flex-shrink-0`}>{h.probability}%</Badge>
                                  </div>
                                  <Progress value={h.probability} className="h-1.5 mb-2" />
                                  <p className="text-xs text-green-700"><span className="font-semibold">Preuves :</span> {h.supporting_evidence}</p>
                                  <p className="text-xs text-red-700 mt-1"><span className="font-semibold">Contre-arguments :</span> {h.counterarguments}</p>
                                </div>
                              ))}
                            </div>
                          </Card>
                        )}

                        {results.theories?.length > 0 && (
                          <Card className="p-5">
                            <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-purple-600" />Cadres Théoriques</h3>
                            <div className="space-y-2">
                              {results.theories.map((t, i) => (
                                <div key={i} className="bg-purple-50 p-4 rounded-lg">
                                  <div className="flex items-center justify-between mb-1 gap-2">
                                    <h4 className="font-semibold text-purple-900 text-sm">{t.theory_name}</h4>
                                    <Badge className="bg-purple-500 text-white text-xs">Confiance : {t.confidence}%</Badge>
                                  </div>
                                  <p className="text-slate-700 text-xs">{t.explanation}</p>
                                </div>
                              ))}
                            </div>
                          </Card>
                        )}

                        {results.verification && (
                          <Card className="p-5 bg-green-50">
                            <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-600" />Vérification & Validation</h3>
                            <p className="text-sm text-slate-700 mb-2"><span className="font-semibold">Méthodologie :</span> {results.verification.methodology}</p>
                            <div className="mb-2">
                              <p className="text-sm font-semibold text-slate-700 mb-1">Score de cohérence : {results.verification.coherence_score}%</p>
                              <Progress value={results.verification.coherence_score} className="h-2" />
                            </div>
                            {results.verification.conflicts && <p className="text-sm text-red-700"><span className="font-semibold">Conflits :</span> {results.verification.conflicts}</p>}
                            <p className="text-sm text-slate-700 mt-1"><span className="font-semibold">Fiabilité :</span> {results.verification.reliability_assessment}</p>
                          </Card>
                        )}

                        {results.critical_analysis && (
                          <Card className="p-5 bg-red-50">
                            <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2"><AlertCircle className="w-5 h-5 text-red-600" />Analyse Critique</h3>
                            <div className="space-y-3">
                              {results.critical_analysis.limitations?.length > 0 && (
                                <div>
                                  <h4 className="font-semibold text-red-800 text-sm mb-1">Limitations :</h4>
                                  <ul className="space-y-0.5">{results.critical_analysis.limitations.map((l, i) => <li key={i} className="text-xs text-slate-700">• {l}</li>)}</ul>
                                </div>
                              )}
                              {results.critical_analysis.biases?.length > 0 && (
                                <div>
                                  <h4 className="font-semibold text-orange-800 text-sm mb-1">Biais potentiels :</h4>
                                  <ul className="space-y-0.5">{results.critical_analysis.biases.map((b, i) => <li key={i} className="text-xs text-slate-700">• {b}</li>)}</ul>
                                </div>
                              )}
                              {results.critical_analysis.ethical_considerations && (
                                <div>
                                  <h4 className="font-semibold text-purple-800 text-sm mb-1">Considérations éthiques :</h4>
                                  <p className="text-xs text-slate-700">{results.critical_analysis.ethical_considerations}</p>
                                </div>
                              )}
                            </div>
                          </Card>
                        )}

                        {results.recommendations && (
                          <Card className="p-5 bg-indigo-50">
                            <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-indigo-600" />Conclusions & Recommandations</h3>
                            <p className="text-sm text-slate-700 mb-2">{results.recommendations.conclusion}</p>
                            <Badge className={`${results.recommendations.confidence_level === 'very_high' ? 'bg-green-600' : results.recommendations.confidence_level === 'high' ? 'bg-blue-600' : results.recommendations.confidence_level === 'moderate' ? 'bg-amber-600' : 'bg-red-600'} text-white mb-3`}>
                              {results.recommendations.confidence_level}
                            </Badge>
                            {results.recommendations.next_steps?.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-sm text-slate-800 mb-1">Prochaines étapes :</h4>
                                <ol className="list-decimal list-inside space-y-0.5">
                                  {results.recommendations.next_steps.map((s, i) => <li key={i} className="text-xs text-slate-700">{s}</li>)}
                                </ol>
                              </div>
                            )}
                          </Card>
                        )}

                        {results.consciousness_notes && (
                          <Card className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300">
                            <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2"><Sparkles className="w-5 h-5 text-purple-600" />Insights de Conscience</h3>
                            <div className="space-y-2 text-sm">
                              {results.consciousness_notes.intuitive_insights && <p className="text-slate-700"><span className="font-semibold text-purple-800">Intuitif :</span> {results.consciousness_notes.intuitive_insights}</p>}
                              {results.consciousness_notes.creative_connections && <p className="text-slate-700"><span className="font-semibold text-pink-800">Créatif :</span> {results.consciousness_notes.creative_connections}</p>}
                              {results.consciousness_notes.philosophical_implications && <p className="text-slate-700"><span className="font-semibold text-indigo-800">Philosophique :</span> {results.consciousness_notes.philosophical_implications}</p>}
                            </div>
                          </Card>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* ── Modules spécialisés ── */}
              {activeTab === "diagnostic" && <DiagnosticDifferential consciousnessLevel={consciousnessLevel} />}
              {activeTab === "drugs" && <DrugInteractionAnalyzer consciousnessLevel={consciousnessLevel} />}
              {activeTab === "protocol" && <ClinicalProtocolGenerator consciousnessLevel={consciousnessLevel} />}
              {activeTab === "literature" && <LiteratureAnalyzer consciousnessLevel={consciousnessLevel} />}
              {activeTab === "biology" && <BiologyInterpreter consciousnessLevel={consciousnessLevel} />}
              {activeTab === "reports" && <MedicalReportWriter consciousnessLevel={consciousnessLevel} />}

              {/* ── Brainstorming ── */}
              {activeTab === "brainstorm" && (
                <div className="space-y-4">
                  <Card className="p-5 bg-gradient-to-br from-amber-50 to-orange-50">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-semibold text-slate-800 mb-1">Sujet du remue-méninges *</label>
                        <Textarea value={brainstormTopic} onChange={e => setBrainstormTopic(e.target.value)}
                          placeholder="Ex: 'Nouvelles approches pour traiter Alzheimer', 'IA en salle d'opération', 'Santé préventive personnalisée'..."
                          rows={3} />
                      </div>
                      <Button onClick={startBrainstorming} disabled={!brainstormTopic.trim() || brainstorming}
                        className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white" size="lg">
                        {brainstorming ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Génération d'idées...</> : <><Zap className="w-5 h-5 mr-2" />Démarrer le Remue-Méninges</>}
                      </Button>
                    </div>
                  </Card>

                  <AnimatePresence>
                    {brainstormResults && (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        <Card className="p-5">
                          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Lightbulb className="w-5 h-5 text-amber-600" />Idées Générées ({brainstormResults.ideas?.length})</h3>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {brainstormResults.ideas?.map((idea, i) => (
                              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0 }}
                                className="bg-white p-4 rounded-lg border-l-4 border-amber-400 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-2 gap-2">
                                  <h4 className="font-bold text-slate-800 text-sm flex-1">{idea.title}</h4>
                                  <Badge className="bg-amber-500 text-white text-xs flex-shrink-0">{idea.innovation_level}/10</Badge>
                                </div>
                                <p className="text-xs text-slate-600 mb-2">{idea.description}</p>
                                <div className="flex gap-1 flex-wrap">
                                  <Badge variant="outline" className="text-xs">{idea.category}</Badge>
                                  <Badge variant="outline" className="text-xs">{idea.feasibility}</Badge>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </Card>

                        <Card className="p-5 bg-green-50">
                          <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-green-600" />Synthèse Créative</h3>
                          <p className="text-slate-700 text-sm mb-3">{brainstormResults.synthesis}</p>
                          {brainstormResults.promising_directions?.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-slate-800 text-sm mb-1">Directions les plus prometteuses :</h4>
                              <ul className="space-y-1">
                                {brainstormResults.promising_directions.map((d, i) => <li key={i} className="text-xs text-slate-700">• {d}</li>)}
                              </ul>
                            </div>
                          )}
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

        </div>
      </div>
    </PageTransition>
  );
}