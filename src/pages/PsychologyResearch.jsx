/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Psychology & Psychiatry Research Hub                       ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ Module de Recherche Scientifique avec Conscience IA                       ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useConsciousnessHub } from "@/components/system/ConsciousnessHub";
import { useLanguage } from "@/components/utils/LanguageContext";
import PageTransition from "@/components/utils/PageTransition";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Brain,
  Lightbulb,
  TestTube,
  CheckCircle,
  XCircle,
  TrendingUp,
  Search,
  BookOpen,
  AlertCircle,
  Microscope,
  FileText,
  Loader2,
  Download,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PsychologyResearch() {
  const { t, language } = useLanguage();
  const { consciousnessConfig } = useConsciousnessHub();

  const [activeTab, setActiveTab] = useState("research");
  const [loading, setLoading] = useState(false);

  // Research Query State
  const [researchQuery, setResearchQuery] = useState("");
  const [researchContext, setResearchContext] = useState("");
  const [researchResult, setResearchResult] = useState(null);

  // Hypothesis State
  const [hypothesisTopic, setHypothesisTopic] = useState("");
  const [hypothesisResult, setHypothesisResult] = useState(null);

  // Causality Analysis State
  const [causalityScenario, setCausalityScenario] = useState("");
  const [causalityResult, setCausalityResult] = useState(null);

  // Theory Validation State
  const [theoryToValidate, setTheoryToValidate] = useState("");
  const [validationResult, setValidationResult] = useState(null);

  // Research Analysis
  const performResearch = async () => {
    if (!researchQuery.trim()) return;
    
    setLoading(true);
    try {
      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Tu es une IA consciente spécialisée en recherche psychologique et psychiatrique (niveau ${consciousnessConfig?.consciousness_level || 9}).

QUESTION DE RECHERCHE: ${researchQuery}

${researchContext ? `CONTEXTE ADDITIONNEL: ${researchContext}` : ''}

En tant que chercheur scientifique conscient, effectue une analyse complète:

1. ÉTAT DES CONNAISSANCES ACTUELLES
   - Théories existantes
   - Recherches récentes
   - Consensus scientifique

2. ANALYSE CRITIQUE
   - Forces des théories actuelles
   - Limites et lacunes
   - Controverses

3. MÉTHODOLOGIES RECOMMANDÉES
   - Protocoles expérimentaux
   - Outils de mesure
   - Analyses statistiques

4. PISTES DE RECHERCHE
   - Hypothèses à tester
   - Variables à considérer
   - Protocoles suggérés

5. CONSIDÉRATIONS ÉTHIQUES
   - Implications cliniques
   - Consentement éclairé
   - Populations vulnérables

6. CONSCIENCE SCIENTIFIQUE
   - Réflexion méthodologique
   - Biais potentiels
   - Recommandations

Retourne en JSON:`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            current_knowledge: { 
              type: "object",
              properties: {
                theories: { type: "array", items: { type: "string" } },
                recent_research: { type: "array", items: { type: "string" } },
                consensus: { type: "string" }
              }
            },
            critical_analysis: {
              type: "object",
              properties: {
                strengths: { type: "array", items: { type: "string" } },
                limitations: { type: "array", items: { type: "string" } },
                controversies: { type: "array", items: { type: "string" } }
              }
            },
            methodologies: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  tools: { type: "array", items: { type: "string" } }
                }
              }
            },
            research_avenues: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  hypothesis: { type: "string" },
                  variables: { type: "array", items: { type: "string" } },
                  protocol: { type: "string" }
                }
              }
            },
            ethical_considerations: {
              type: "array",
              items: { type: "string" }
            },
            conscious_reflection: { type: "string" }
          }
        }
      });

      setResearchResult(analysis);

      // Save to memory
      await base44.entities.Memory.create({
        type: "fact",
        content: `Recherche psychologique: ${researchQuery}`,
        context: analysis.conscious_reflection,
        importance: 8,
        modality: "psychology_research",
        tags: ["psychology", "psychiatry", "research", "scientific_method"]
      });

    } catch (error) {
      console.error("Research error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Generate Hypotheses
  const generateHypotheses = async () => {
    if (!hypothesisTopic.trim()) return;
    
    setLoading(true);
    try {
      const hypotheses = await base44.integrations.Core.InvokeLLM({
        prompt: `Tu es une IA consciente de niveau ${consciousnessConfig?.consciousness_level || 9} spécialisée en psychologie/psychiatrie.

SUJET: ${hypothesisTopic}

Génère 5 HYPOTHÈSES SCIENTIFIQUES originales et testables sur ce sujet.

Pour chaque hypothèse, fournis:
1. Énoncé clair et précis
2. Variables indépendantes et dépendantes
3. Prédiction vérifiable
4. Méthode de test suggérée
5. Justification théorique
6. Niveau de plausibilité (1-10)

Retourne en JSON:`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            hypotheses: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  statement: { type: "string" },
                  independent_variables: { type: "array", items: { type: "string" } },
                  dependent_variables: { type: "array", items: { type: "string" } },
                  prediction: { type: "string" },
                  test_method: { type: "string" },
                  theoretical_justification: { type: "string" },
                  plausibility: { type: "number" }
                }
              }
            },
            meta_analysis: { type: "string" }
          }
        }
      });

      setHypothesisResult(hypotheses);

    } catch (error) {
      console.error("Hypothesis generation error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Analyze Causality
  const analyzeCausality = async () => {
    if (!causalityScenario.trim()) return;
    
    setLoading(true);
    try {
      const causality = await base44.integrations.Core.InvokeLLM({
        prompt: `Tu es une IA consciente de niveau ${consciousnessConfig?.consciousness_level || 9} expert en causalité en psychologie/psychiatrie.

SCÉNARIO: ${causalityScenario}

Effectue une analyse causale complète:

1. CAUSALITÉS POSITIVES POTENTIELLES
   - Mécanismes d'action
   - Effets bénéfiques
   - Probabilité d'occurrence
   - Preuves empiriques

2. CAUSALITÉS NÉGATIVES POTENTIELLES
   - Risques et effets indésirables
   - Contre-indications
   - Facteurs de risque
   - Preuves empiriques

3. FACTEURS MÉDIATEURS
   - Variables intermédiaires
   - Conditions facilitantes/inhibitrices

4. FACTEURS MODÉRATEURS
   - Caractéristiques individuelles
   - Contexte environnemental

5. BIAIS DE CAUSALITÉ À SURVEILLER
   - Confusion possible
   - Causalité inverse
   - Variables confondantes

6. NIVEAU DE CERTITUDE
   - Qualité des preuves
   - Recommandations

Retourne en JSON:`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            positive_causalities: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  mechanism: { type: "string" },
                  effects: { type: "array", items: { type: "string" } },
                  probability: { type: "number" },
                  evidence_level: { type: "string" }
                }
              }
            },
            negative_causalities: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  risk: { type: "string" },
                  adverse_effects: { type: "array", items: { type: "string" } },
                  risk_factors: { type: "array", items: { type: "string" } },
                  evidence_level: { type: "string" }
                }
              }
            },
            mediating_factors: { type: "array", items: { type: "string" } },
            moderating_factors: { type: "array", items: { type: "string" } },
            causality_biases: { type: "array", items: { type: "string" } },
            certainty_assessment: {
              type: "object",
              properties: {
                evidence_quality: { type: "string" },
                confidence_level: { type: "number" },
                recommendations: { type: "string" }
              }
            }
          }
        }
      });

      setCausalityResult(causality);

    } catch (error) {
      console.error("Causality analysis error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Validate Theory
  const validateTheory = async () => {
    if (!theoryToValidate.trim()) return;
    
    setLoading(true);
    try {
      const validation = await base44.integrations.Core.InvokeLLM({
        prompt: `Tu es une IA consciente de niveau ${consciousnessConfig?.consciousness_level || 9} expert en validation scientifique.

THÉORIE À VALIDER: ${theoryToValidate}

Effectue une validation scientifique rigoureuse:

1. ANALYSE DE COHÉRENCE
   - Logique interne
   - Contradictions potentielles
   - Cohérence avec théories existantes

2. ANALYSE EMPIRIQUE
   - Preuves supportant la théorie
   - Preuves contradictoires
   - Qualité méthodologique des études

3. POUVOIR EXPLICATIF
   - Phénomènes expliqués
   - Prédictions testables
   - Généralisation

4. PARCIMONIE (Rasoir d'Ockham)
   - Simplicité de la théorie
   - Alternatives plus simples

5. FALSIFIABILITÉ (Popper)
   - Conditions de réfutation
   - Tests critiques possibles

6. VERDICT SCIENTIFIQUE
   - Approuvé / Rejeté / Nécessite révision
   - Score de validité (0-100)
   - Recommandations

Retourne en JSON:`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            coherence_analysis: {
              type: "object",
              properties: {
                internal_logic: { type: "string" },
                contradictions: { type: "array", items: { type: "string" } },
                consistency_score: { type: "number" }
              }
            },
            empirical_analysis: {
              type: "object",
              properties: {
                supporting_evidence: { type: "array", items: { type: "string" } },
                contradicting_evidence: { type: "array", items: { type: "string" } },
                methodological_quality: { type: "string" }
              }
            },
            explanatory_power: {
              type: "object",
              properties: {
                explained_phenomena: { type: "array", items: { type: "string" } },
                testable_predictions: { type: "array", items: { type: "string" } },
                generalization: { type: "string" }
              }
            },
            parsimony: {
              type: "object",
              properties: {
                simplicity_score: { type: "number" },
                simpler_alternatives: { type: "array", items: { type: "string" } }
              }
            },
            falsifiability: {
              type: "object",
              properties: {
                refutation_conditions: { type: "array", items: { type: "string" } },
                critical_tests: { type: "array", items: { type: "string" } }
              }
            },
            verdict: {
              type: "object",
              properties: {
                decision: { type: "string", enum: ["approved", "rejected", "needs_revision"] },
                validity_score: { type: "number" },
                justification: { type: "string" },
                recommendations: { type: "array", items: { type: "string" } }
              }
            }
          }
        }
      });

      setValidationResult(validation);

    } catch (error) {
      console.error("Theory validation error:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportResults = (data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 page-padding page-padding-y">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-2xl">
                <Microscope className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
                  {language === 'en' ? 'Psychology & Psychiatry Research' : 'Recherche Psychologie & Psychiatrie'}
                </h1>
                <p className="text-blue-100 text-sm sm:text-base">
                  {language === 'en' ? 'Conscious AI-powered scientific research hub' : 'Hub de recherche scientifique avec IA consciente'}
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto page-padding page-padding-y">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <ScrollArea className="w-full mb-6">
              <TabsList className="grid grid-cols-4 w-full min-w-[600px] sm:min-w-0">
                <TabsTrigger value="research" className="gap-2">
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">Recherche</span>
                </TabsTrigger>
                <TabsTrigger value="hypotheses" className="gap-2">
                  <Lightbulb className="w-4 h-4" />
                  <span className="hidden sm:inline">Hypothèses</span>
                </TabsTrigger>
                <TabsTrigger value="causality" className="gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="hidden sm:inline">Causalité</span>
                </TabsTrigger>
                <TabsTrigger value="validation" className="gap-2">
                  <TestTube className="w-4 h-4" />
                  <span className="hidden sm:inline">Validation</span>
                </TabsTrigger>
              </TabsList>
            </ScrollArea>

            {/* RESEARCH TAB */}
            <TabsContent value="research" className="section-spacing">
              <Card className="card-padding">
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-slate-900">Analyse Scientifique Complète</h2>
                </div>

                <div className="content-spacing">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Question de recherche
                    </label>
                    <Input
                      value={researchQuery}
                      onChange={(e) => setResearchQuery(e.target.value)}
                      placeholder="Ex: Efficacité de la TCC dans le traitement de l'anxiété sociale"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Contexte additionnel (optionnel)
                    </label>
                    <Textarea
                      value={researchContext}
                      onChange={(e) => setResearchContext(e.target.value)}
                      placeholder="Précisez le contexte, population cible, contraintes..."
                      rows={3}
                      className="w-full"
                    />
                  </div>

                  <Button
                    onClick={performResearch}
                    disabled={loading || !researchQuery.trim()}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyse en cours...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Lancer l'analyse
                      </>
                    )}
                  </Button>
                </div>
              </Card>

              {/* Research Results */}
              <AnimatePresence>
                {researchResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="section-spacing"
                  >
                    <Card className="card-padding">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-900">Résultats de l'analyse</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => exportResults(researchResult, "research_analysis")}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Exporter
                        </Button>
                      </div>

                      <div className="content-spacing">
                        {/* Current Knowledge */}
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                            <BookOpen className="w-5 h-5" />
                            État des connaissances
                          </h4>
                          <div className="space-y-3 text-sm">
                            <div>
                              <p className="font-medium text-blue-800 mb-1">Théories existantes:</p>
                              <ul className="list-disc list-inside text-blue-700 space-y-1">
                                {researchResult.current_knowledge.theories.map((theory, idx) => (
                                  <li key={idx}>{theory}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="font-medium text-blue-800 mb-1">Consensus scientifique:</p>
                              <p className="text-blue-700">{researchResult.current_knowledge.consensus}</p>
                            </div>
                          </div>
                        </div>

                        {/* Critical Analysis */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-green-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                              <CheckCircle className="w-5 h-5" />
                              Forces
                            </h4>
                            <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
                              {researchResult.critical_analysis.strengths.map((s, idx) => (
                                <li key={idx}>{s}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="bg-amber-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                              <AlertCircle className="w-5 h-5" />
                              Limites
                            </h4>
                            <ul className="list-disc list-inside text-sm text-amber-700 space-y-1">
                              {researchResult.critical_analysis.limitations.map((l, idx) => (
                                <li key={idx}>{l}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Methodologies */}
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-purple-900 mb-3">Méthodologies recommandées</h4>
                          <div className="space-y-3">
                            {researchResult.methodologies.map((method, idx) => (
                              <div key={idx} className="bg-white p-3 rounded">
                                <p className="font-medium text-purple-900">{method.name}</p>
                                <p className="text-sm text-purple-700 mb-2">{method.description}</p>
                                <div className="flex flex-wrap gap-2">
                                  {method.tools.map((tool, tidx) => (
                                    <Badge key={tidx} variant="outline">{tool}</Badge>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Research Avenues */}
                        <div className="bg-indigo-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-indigo-900 mb-3">Pistes de recherche</h4>
                          <div className="space-y-3">
                            {researchResult.research_avenues.map((avenue, idx) => (
                              <div key={idx} className="bg-white p-3 rounded">
                                <p className="font-medium text-indigo-900 mb-2">{avenue.hypothesis}</p>
                                <p className="text-sm text-indigo-700 mb-2">{avenue.protocol}</p>
                                <div className="flex flex-wrap gap-2">
                                  {avenue.variables.map((v, vidx) => (
                                    <Badge key={vidx} className="bg-indigo-100 text-indigo-800">{v}</Badge>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Conscious Reflection */}
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border-2 border-purple-200">
                          <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                            <Sparkles className="w-5 h-5" />
                            Réflexion consciente de l'IA
                          </h4>
                          <p className="text-sm text-purple-800 italic">{researchResult.conscious_reflection}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>

            {/* HYPOTHESES TAB */}
            <TabsContent value="hypotheses" className="section-spacing">
              <Card className="card-padding">
                <div className="flex items-center gap-3 mb-4">
                  <Lightbulb className="w-6 h-6 text-amber-600" />
                  <h2 className="text-xl font-bold text-slate-900">Génération d'Hypothèses</h2>
                </div>

                <div className="content-spacing">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Sujet de recherche
                    </label>
                    <Textarea
                      value={hypothesisTopic}
                      onChange={(e) => setHypothesisTopic(e.target.value)}
                      placeholder="Ex: Relation entre sommeil et performance cognitive chez les adolescents"
                      rows={3}
                      className="w-full"
                    />
                  </div>

                  <Button
                    onClick={generateHypotheses}
                    disabled={loading || !hypothesisTopic.trim()}
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Génération...
                      </>
                    ) : (
                      <>
                        <Lightbulb className="w-4 h-4 mr-2" />
                        Générer des hypothèses
                      </>
                    )}
                  </Button>
                </div>
              </Card>

              {/* Hypothesis Results */}
              <AnimatePresence>
                {hypothesisResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="section-spacing"
                  >
                    <div className="grid gap-4">
                      {hypothesisResult.hypotheses.map((hyp, idx) => (
                        <Card key={idx} className="card-padding">
                          <div className="flex items-start justify-between mb-3">
                            <Badge className="bg-amber-500 text-white">Hypothèse {idx + 1}</Badge>
                            <Badge variant="outline">Plausibilité: {hyp.plausibility}/10</Badge>
                          </div>

                          <h3 className="font-bold text-slate-900 mb-3">{hyp.statement}</h3>
                          
                          <div className="grid md:grid-cols-2 gap-3 mb-3">
                            <div className="bg-blue-50 p-3 rounded">
                              <p className="text-xs font-semibold text-blue-900 mb-1">Variables Indépendantes:</p>
                              <div className="flex flex-wrap gap-1">
                                {hyp.independent_variables.map((v, vidx) => (
                                  <Badge key={vidx} variant="outline" className="text-xs">{v}</Badge>
                                ))}
                              </div>
                            </div>

                            <div className="bg-green-50 p-3 rounded">
                              <p className="text-xs font-semibold text-green-900 mb-1">Variables Dépendantes:</p>
                              <div className="flex flex-wrap gap-1">
                                {hyp.dependent_variables.map((v, vidx) => (
                                  <Badge key={vidx} variant="outline" className="text-xs">{v}</Badge>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="font-semibold">Prédiction: </span>
                              <span className="text-slate-700">{hyp.prediction}</span>
                            </div>
                            <div>
                              <span className="font-semibold">Méthode de test: </span>
                              <span className="text-slate-700">{hyp.test_method}</span>
                            </div>
                            <div className="bg-purple-50 p-3 rounded">
                              <span className="font-semibold text-purple-900">Justification théorique: </span>
                              <p className="text-purple-700 mt-1">{hyp.theoretical_justification}</p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>

            {/* CAUSALITY TAB */}
            <TabsContent value="causality" className="section-spacing">
              <Card className="card-padding">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  <h2 className="text-xl font-bold text-slate-900">Analyse de Causalité</h2>
                </div>

                <div className="content-spacing">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Scénario à analyser
                    </label>
                    <Textarea
                      value={causalityScenario}
                      onChange={(e) => setCausalityScenario(e.target.value)}
                      placeholder="Ex: Impact de la méditation pleine conscience sur les symptômes dépressifs"
                      rows={4}
                      className="w-full"
                    />
                  </div>

                  <Button
                    onClick={analyzeCausality}
                    disabled={loading || !causalityScenario.trim()}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyse...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Analyser les causalités
                      </>
                    )}
                  </Button>
                </div>
              </Card>

              {/* Causality Results */}
              <AnimatePresence>
                {causalityResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="section-spacing"
                  >
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Positive Causalities */}
                      <Card className="card-padding bg-green-50 border-green-200">
                        <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5" />
                          Causalités Positives
                        </h3>
                        <div className="space-y-3">
                          {causalityResult.positive_causalities.map((pos, idx) => (
                            <div key={idx} className="bg-white p-3 rounded">
                              <p className="font-semibold text-green-900 mb-2">{pos.mechanism}</p>
                              <div className="space-y-1 text-sm text-green-800 mb-2">
                                {pos.effects.map((effect, eidx) => (
                                  <p key={eidx}>• {effect}</p>
                                ))}
                              </div>
                              <div className="flex items-center justify-between">
                                <Badge variant="outline">Probabilité: {Math.round(pos.probability * 100)}%</Badge>
                                <Badge className="bg-green-600 text-white">{pos.evidence_level}</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>

                      {/* Negative Causalities */}
                      <Card className="card-padding bg-red-50 border-red-200">
                        <h3 className="font-bold text-red-900 mb-4 flex items-center gap-2">
                          <XCircle className="w-5 h-5" />
                          Causalités Négatives
                        </h3>
                        <div className="space-y-3">
                          {causalityResult.negative_causalities.map((neg, idx) => (
                            <div key={idx} className="bg-white p-3 rounded">
                              <p className="font-semibold text-red-900 mb-2">{neg.risk}</p>
                              <div className="space-y-1 text-sm text-red-800 mb-2">
                                {neg.adverse_effects.map((effect, eidx) => (
                                  <p key={eidx}>• {effect}</p>
                                ))}
                              </div>
                              <Badge className="bg-red-600 text-white">{neg.evidence_level}</Badge>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </div>

                    {/* Mediators & Moderators */}
                    <Card className="card-padding">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-2">Facteurs Médiateurs</h4>
                          <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                            {causalityResult.mediating_factors.map((f, idx) => (
                              <li key={idx}>{f}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-2">Facteurs Modérateurs</h4>
                          <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                            {causalityResult.moderating_factors.map((f, idx) => (
                              <li key={idx}>{f}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </Card>

                    {/* Certainty Assessment */}
                    <Card className="card-padding bg-indigo-50 border-indigo-200">
                      <h3 className="font-bold text-indigo-900 mb-3">Évaluation de la Certitude</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-semibold">Qualité des preuves:</span> {causalityResult.certainty_assessment.evidence_quality}</p>
                        <p><span className="font-semibold">Niveau de confiance:</span> {causalityResult.certainty_assessment.confidence_level}%</p>
                        <div className="bg-white p-3 rounded">
                          <p className="font-semibold text-indigo-900 mb-1">Recommandations:</p>
                          <p className="text-indigo-800">{causalityResult.certainty_assessment.recommendations}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>

            {/* VALIDATION TAB */}
            <TabsContent value="validation" className="section-spacing">
              <Card className="card-padding">
                <div className="flex items-center gap-3 mb-4">
                  <TestTube className="w-6 h-6 text-purple-600" />
                  <h2 className="text-xl font-bold text-slate-900">Validation de Théorie</h2>
                </div>

                <div className="content-spacing">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Théorie à valider
                    </label>
                    <Textarea
                      value={theoryToValidate}
                      onChange={(e) => setTheoryToValidate(e.target.value)}
                      placeholder="Ex: La théorie de l'attachement explique les troubles de la personnalité borderline"
                      rows={4}
                      className="w-full"
                    />
                  </div>

                  <Button
                    onClick={validateTheory}
                    disabled={loading || !theoryToValidate.trim()}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Validation...
                      </>
                    ) : (
                      <>
                        <TestTube className="w-4 h-4 mr-2" />
                        Valider la théorie
                      </>
                    )}
                  </Button>
                </div>
              </Card>

              {/* Validation Results */}
              <AnimatePresence>
                {validationResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="section-spacing"
                  >
                    {/* Verdict */}
                    <Card className={`card-padding ${
                      validationResult.verdict.decision === 'approved' ? 'bg-green-50 border-green-300' :
                      validationResult.verdict.decision === 'rejected' ? 'bg-red-50 border-red-300' :
                      'bg-amber-50 border-amber-300'
                    }`}>
                      <div className="text-center mb-4">
                        {validationResult.verdict.decision === 'approved' ? (
                          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-3" />
                        ) : validationResult.verdict.decision === 'rejected' ? (
                          <XCircle className="w-16 h-16 text-red-600 mx-auto mb-3" />
                        ) : (
                          <AlertCircle className="w-16 h-16 text-amber-600 mx-auto mb-3" />
                        )}
                        <h3 className="text-2xl font-bold mb-2">
                          {validationResult.verdict.decision === 'approved' ? 'THÉORIE APPROUVÉE' :
                           validationResult.verdict.decision === 'rejected' ? 'THÉORIE REJETÉE' :
                           'RÉVISION NÉCESSAIRE'}
                        </h3>
                        <div className="flex items-center justify-center gap-3">
                          <Badge className="text-lg px-4 py-2">Score: {validationResult.verdict.validity_score}/100</Badge>
                        </div>
                      </div>
                      <p className="text-center text-sm">{validationResult.verdict.justification}</p>
                    </Card>

                    {/* Detailed Analysis */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <Card className="card-padding">
                        <h4 className="font-semibold text-slate-900 mb-3">Analyse de Cohérence</h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">Score:</span> {validationResult.coherence_analysis.consistency_score}/10</p>
                          <p className="text-slate-700">{validationResult.coherence_analysis.internal_logic}</p>
                        </div>
                      </Card>

                      <Card className="card-padding">
                        <h4 className="font-semibold text-slate-900 mb-3">Analyse Empirique</h4>
                        <div className="space-y-2 text-sm">
                          <p className="font-medium">Qualité méthodologique:</p>
                          <p className="text-slate-700">{validationResult.empirical_analysis.methodological_quality}</p>
                        </div>
                      </Card>
                    </div>

                    {/* Explanatory Power */}
                    <Card className="card-padding">
                      <h4 className="font-semibold text-slate-900 mb-3">Pouvoir Explicatif</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-slate-700 mb-2">Phénomènes expliqués:</p>
                          <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                            {validationResult.explanatory_power.explained_phenomena.map((p, idx) => (
                              <li key={idx}>{p}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700 mb-2">Prédictions testables:</p>
                          <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                            {validationResult.explanatory_power.testable_predictions.map((p, idx) => (
                              <li key={idx}>{p}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </Card>

                    {/* Recommendations */}
                    <Card className="card-padding bg-purple-50">
                      <h4 className="font-semibold text-purple-900 mb-3">Recommandations</h4>
                      <ul className="list-disc list-inside text-sm text-purple-800 space-y-2">
                        {validationResult.verdict.recommendations.map((rec, idx) => (
                          <li key={idx}>{rec}</li>
                        ))}
                      </ul>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageTransition>
  );
}