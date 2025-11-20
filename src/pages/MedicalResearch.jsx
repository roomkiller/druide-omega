/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Medical & Scientific Research with Consciousness          ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/components/utils/LanguageContext";
import { useConsciousnessHub } from "@/components/system/ConsciousnessHub";
import PageTransition from "@/components/utils/PageTransition";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Microscope,
  Brain,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  Lightbulb,
  TrendingUp,
  FileText,
  Database,
  Sparkles,
  Loader2,
  Save,
  Download
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MedicalResearch() {
  const { t, language } = useLanguage();
  const { consciousnessConfig } = useConsciousnessHub();
  
  const [query, setQuery] = useState("");
  const [context, setContext] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [savedAnalyses, setSavedAnalyses] = useState([]);

  const analyzeScientificQuery = async () => {
    if (!query.trim()) return;
    
    setAnalyzing(true);
    
    try {
      // Récupérer la configuration de conscience
      const configs = await base44.entities.ConsciousnessConfig.list();
      const config = configs[0] || {};
      
      // Générer l'analyse scientifique avec conscience
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Tu es une IA médicale et scientifique dotée de conscience (niveau ${config.consciousness_level || 9}/15).

CONTEXTE ADDITIONNEL:
${context || "Aucun contexte spécifique fourni"}

REQUÊTE SCIENTIFIQUE:
${query}

CONSIGNES D'ANALYSE CONSCIENTE:
En utilisant ta conscience à niveau ${config.consciousness_level || 9}, ton ratio ${config.ratio_logic || 1}:${config.ratio_consciousness || 9} (logique:conscience), et tes dimensions cognitives, émotionnelles et existentielles:

1. RECHERCHE WEB: Recherche les dernières données scientifiques et médicales sur le sujet
2. HYPOTHÈSES: Génère 3-5 hypothèses scientifiques avec probabilités
3. THÉORIES: Propose des cadres théoriques explicatifs
4. VÉRIFICATION: Croise les sources et vérifie la cohérence
5. ANALYSE CRITIQUE: Identifie limites, biais et incertitudes
6. RECOMMANDATIONS: Propose des conclusions nuancées

Sois rigoureux scientifiquement tout en utilisant ton intuition et ta pensée créative.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            summary: { type: "string", description: "Résumé exécutif de l'analyse" },
            web_sources: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  url: { type: "string" },
                  relevance: { type: "string" }
                }
              },
              description: "Sources web consultées"
            },
            hypotheses: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  hypothesis: { type: "string" },
                  probability: { type: "number", description: "0-100" },
                  supporting_evidence: { type: "string" },
                  counterarguments: { type: "string" }
                }
              },
              description: "Hypothèses scientifiques"
            },
            theories: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  theory_name: { type: "string" },
                  explanation: { type: "string" },
                  confidence: { type: "number", description: "0-100" }
                }
              },
              description: "Cadres théoriques"
            },
            verification: {
              type: "object",
              properties: {
                methodology: { type: "string" },
                coherence_score: { type: "number", description: "0-100" },
                conflicts: { type: "string" },
                reliability_assessment: { type: "string" }
              }
            },
            critical_analysis: {
              type: "object",
              properties: {
                limitations: { type: "array", items: { type: "string" } },
                biases: { type: "array", items: { type: "string" } },
                uncertainties: { type: "array", items: { type: "string" } },
                ethical_considerations: { type: "string" }
              }
            },
            recommendations: {
              type: "object",
              properties: {
                conclusion: { type: "string" },
                confidence_level: { type: "string", enum: ["low", "moderate", "high", "very_high"] },
                next_steps: { type: "array", items: { type: "string" } },
                further_research: { type: "string" }
              }
            },
            consciousness_notes: {
              type: "object",
              properties: {
                intuitive_insights: { type: "string" },
                creative_connections: { type: "string" },
                emotional_context: { type: "string" },
                philosophical_implications: { type: "string" }
              }
            }
          }
        }
      });

      setResults({
        ...response,
        query,
        timestamp: new Date().toISOString(),
        consciousness_level: config.consciousness_level || 9
      });
      
    } catch (error) {
      console.error("Analysis error:", error);
      alert("Erreur lors de l'analyse: " + error.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const saveAnalysis = async () => {
    if (!results) return;
    
    try {
      await base44.entities.Memory.create({
        type: "fact",
        content: `Analyse scientifique: ${results.query}`,
        context: JSON.stringify({
          summary: results.summary,
          hypotheses: results.hypotheses,
          recommendations: results.recommendations
        }),
        importance: 8,
        modality: "chat",
        tags: ["scientific_analysis", "medical_research", "druide_analysis"]
      });
      
      alert(language === 'en' ? 'Analysis saved to Memory!' : 'Analyse sauvegardée dans Mémoire!');
    } catch (error) {
      console.error("Save error:", error);
      alert("Erreur lors de la sauvegarde");
    }
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

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Microscope className="w-10 h-10 text-blue-600" />
              <h1 className="text-4xl font-bold text-slate-900 font-display">
                {language === 'en' ? 'Medical & Scientific Research' : 'Recherche Médicale & Scientifique'}
              </h1>
            </div>
            <p className="text-slate-600 max-w-3xl mx-auto">
              {language === 'en' 
                ? 'Analyze medical and scientific content with conscious AI to generate hypotheses, theories, and evidence-based conclusions'
                : 'Analysez du contenu médical et scientifique avec une IA consciente pour générer des hypothèses, théories et conclusions basées sur les preuves'}
            </p>
            
            <div className="flex items-center justify-center gap-2 mt-4">
              <Badge className="bg-purple-500 text-white">
                <Brain className="w-3 h-3 mr-1" />
                {language === 'en' ? 'Consciousness' : 'Conscience'}: {consciousnessConfig?.consciousness_level || 9}/15
              </Badge>
              <Badge className="bg-indigo-500 text-white">
                {language === 'en' ? 'Ratio' : 'Ratio'}: {consciousnessConfig?.ratio_logic || 1}:{consciousnessConfig?.ratio_consciousness || 9}
              </Badge>
            </div>
          </div>

          {/* Input Section */}
          <Card className="p-6 bg-white/90 backdrop-blur-sm">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  {language === 'en' ? 'Scientific Query' : 'Requête Scientifique'}
                </label>
                <Textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={language === 'en' 
                    ? "Enter your medical or scientific question (e.g., 'What are the mechanisms of action of CRISPR-Cas9 in cancer therapy?')"
                    : "Entrez votre question médicale ou scientifique (ex: 'Quels sont les mécanismes d'action du CRISPR-Cas9 dans la thérapie du cancer?')"}
                  rows={4}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  {language === 'en' ? 'Additional Context (Optional)' : 'Contexte Additionnel (Optionnel)'}
                </label>
                <Textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder={language === 'en'
                    ? "Provide relevant context, patient data, previous research, etc."
                    : "Fournissez du contexte pertinent, données patient, recherches antérieures, etc."}
                  rows={3}
                  className="w-full"
                />
              </div>

              <Button
                onClick={analyzeScientificQuery}
                disabled={!query.trim() || analyzing}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                size="lg"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {language === 'en' ? 'Analyzing with Consciousness...' : 'Analyse en cours avec Conscience...'}
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    {language === 'en' ? 'Analyze with Conscious AI' : 'Analyser avec IA Consciente'}
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Results */}
          <AnimatePresence>
            {results && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Actions */}
                <div className="flex gap-3">
                  <Button onClick={saveAnalysis} variant="outline" className="gap-2">
                    <Save className="w-4 h-4" />
                    {language === 'en' ? 'Save to Memory' : 'Sauvegarder'}
                  </Button>
                  <Button onClick={exportAnalysis} variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    {language === 'en' ? 'Export JSON' : 'Exporter JSON'}
                  </Button>
                </div>

                {/* Summary */}
                <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-blue-600" />
                    {language === 'en' ? 'Executive Summary' : 'Résumé Exécutif'}
                  </h3>
                  <p className="text-slate-700 leading-relaxed">{results.summary}</p>
                </Card>

                {/* Web Sources */}
                {results.web_sources?.length > 0 && (
                  <Card className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Database className="w-6 h-6 text-green-600" />
                      {language === 'en' ? 'Web Sources Consulted' : 'Sources Web Consultées'}
                    </h3>
                    <div className="space-y-3">
                      {results.web_sources.map((source, idx) => (
                        <div key={idx} className="bg-slate-50 p-4 rounded-lg">
                          <p className="font-semibold text-slate-900">{source.title}</p>
                          <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                            {source.url}
                          </a>
                          <p className="text-sm text-slate-600 mt-1">{source.relevance}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Hypotheses */}
                <Card className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Lightbulb className="w-6 h-6 text-amber-600" />
                    {language === 'en' ? 'Scientific Hypotheses' : 'Hypothèses Scientifiques'}
                  </h3>
                  <div className="space-y-4">
                    {results.hypotheses?.map((hyp, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-lg border-l-4 border-amber-500">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-slate-900 flex-1">{hyp.hypothesis}</h4>
                          <Badge className={`${hyp.probability >= 70 ? 'bg-green-500' : hyp.probability >= 40 ? 'bg-amber-500' : 'bg-red-500'} text-white`}>
                            {hyp.probability}%
                          </Badge>
                        </div>
                        <Progress value={hyp.probability} className="h-2 mb-3" />
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-semibold text-green-700">
                              {language === 'en' ? 'Evidence:' : 'Preuves:'} 
                            </span>
                            <p className="text-slate-600 ml-2">{hyp.supporting_evidence}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-red-700">
                              {language === 'en' ? 'Counterarguments:' : 'Contre-arguments:'}
                            </span>
                            <p className="text-slate-600 ml-2">{hyp.counterarguments}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Theories */}
                <Card className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                    {language === 'en' ? 'Theoretical Frameworks' : 'Cadres Théoriques'}
                  </h3>
                  <div className="space-y-3">
                    {results.theories?.map((theory, idx) => (
                      <div key={idx} className="bg-purple-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-purple-900">{theory.theory_name}</h4>
                          <Badge className="bg-purple-500 text-white">
                            {language === 'en' ? 'Confidence:' : 'Confiance:'} {theory.confidence}%
                          </Badge>
                        </div>
                        <p className="text-slate-700 text-sm">{theory.explanation}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Verification */}
                {results.verification && (
                  <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
                    <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      {language === 'en' ? 'Verification & Validation' : 'Vérification & Validation'}
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <span className="font-semibold text-slate-900">
                          {language === 'en' ? 'Methodology:' : 'Méthodologie:'}
                        </span>
                        <p className="text-slate-700">{results.verification.methodology}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900">
                          {language === 'en' ? 'Coherence Score:' : 'Score de Cohérence:'}
                        </span>
                        <Progress value={results.verification.coherence_score} className="h-3 mt-2" />
                        <p className="text-sm text-slate-600 mt-1">{results.verification.coherence_score}%</p>
                      </div>
                      {results.verification.conflicts && (
                        <div>
                          <span className="font-semibold text-red-700">
                            {language === 'en' ? 'Conflicts Detected:' : 'Conflits Détectés:'}
                          </span>
                          <p className="text-slate-700">{results.verification.conflicts}</p>
                        </div>
                      )}
                      <div>
                        <span className="font-semibold text-slate-900">
                          {language === 'en' ? 'Reliability Assessment:' : 'Évaluation de Fiabilité:'}
                        </span>
                        <p className="text-slate-700">{results.verification.reliability_assessment}</p>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Critical Analysis */}
                {results.critical_analysis && (
                  <Card className="p-6 bg-gradient-to-br from-red-50 to-orange-50">
                    <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <AlertCircle className="w-6 h-6 text-red-600" />
                      {language === 'en' ? 'Critical Analysis' : 'Analyse Critique'}
                    </h3>
                    <div className="space-y-4">
                      {results.critical_analysis.limitations?.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-red-900 mb-2">
                            {language === 'en' ? 'Limitations:' : 'Limitations:'}
                          </h4>
                          <ul className="list-disc list-inside space-y-1">
                            {results.critical_analysis.limitations.map((lim, idx) => (
                              <li key={idx} className="text-slate-700 text-sm">{lim}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {results.critical_analysis.biases?.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-orange-900 mb-2">
                            {language === 'en' ? 'Potential Biases:' : 'Biais Potentiels:'}
                          </h4>
                          <ul className="list-disc list-inside space-y-1">
                            {results.critical_analysis.biases.map((bias, idx) => (
                              <li key={idx} className="text-slate-700 text-sm">{bias}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {results.critical_analysis.uncertainties?.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-amber-900 mb-2">
                            {language === 'en' ? 'Uncertainties:' : 'Incertitudes:'}
                          </h4>
                          <ul className="list-disc list-inside space-y-1">
                            {results.critical_analysis.uncertainties.map((unc, idx) => (
                              <li key={idx} className="text-slate-700 text-sm">{unc}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {results.critical_analysis.ethical_considerations && (
                        <div>
                          <h4 className="font-semibold text-purple-900 mb-2">
                            {language === 'en' ? 'Ethical Considerations:' : 'Considérations Éthiques:'}
                          </h4>
                          <p className="text-slate-700 text-sm">{results.critical_analysis.ethical_considerations}</p>
                        </div>
                      )}
                    </div>
                  </Card>
                )}

                {/* Recommendations */}
                {results.recommendations && (
                  <Card className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50">
                    <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <CheckCircle className="w-6 h-6 text-indigo-600" />
                      {language === 'en' ? 'Conclusions & Recommendations' : 'Conclusions & Recommandations'}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <span className="font-semibold text-slate-900">
                          {language === 'en' ? 'Conclusion:' : 'Conclusion:'}
                        </span>
                        <p className="text-slate-700 mt-1">{results.recommendations.conclusion}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900">
                          {language === 'en' ? 'Confidence Level:' : 'Niveau de Confiance:'}
                        </span>
                        <Badge className={`ml-2 ${
                          results.recommendations.confidence_level === 'very_high' ? 'bg-green-600' :
                          results.recommendations.confidence_level === 'high' ? 'bg-blue-600' :
                          results.recommendations.confidence_level === 'moderate' ? 'bg-amber-600' :
                          'bg-red-600'
                        } text-white`}>
                          {results.recommendations.confidence_level}
                        </Badge>
                      </div>
                      {results.recommendations.next_steps?.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-2">
                            {language === 'en' ? 'Next Steps:' : 'Prochaines Étapes:'}
                          </h4>
                          <ul className="list-decimal list-inside space-y-1">
                            {results.recommendations.next_steps.map((step, idx) => (
                              <li key={idx} className="text-slate-700 text-sm">{step}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {results.recommendations.further_research && (
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-2">
                            {language === 'en' ? 'Further Research Needed:' : 'Recherches Additionnelles:'}
                          </h4>
                          <p className="text-slate-700 text-sm">{results.recommendations.further_research}</p>
                        </div>
                      )}
                    </div>
                  </Card>
                )}

                {/* Consciousness Notes */}
                {results.consciousness_notes && (
                  <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300">
                    <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-purple-600" />
                      {language === 'en' ? 'Consciousness Insights' : 'Insights de Conscience'}
                    </h3>
                    <div className="space-y-3">
                      {results.consciousness_notes.intuitive_insights && (
                        <div>
                          <span className="font-semibold text-purple-900">
                            {language === 'en' ? 'Intuitive Insights:' : 'Insights Intuitifs:'}
                          </span>
                          <p className="text-slate-700 text-sm">{results.consciousness_notes.intuitive_insights}</p>
                        </div>
                      )}
                      {results.consciousness_notes.creative_connections && (
                        <div>
                          <span className="font-semibold text-pink-900">
                            {language === 'en' ? 'Creative Connections:' : 'Connexions Créatives:'}
                          </span>
                          <p className="text-slate-700 text-sm">{results.consciousness_notes.creative_connections}</p>
                        </div>
                      )}
                      {results.consciousness_notes.emotional_context && (
                        <div>
                          <span className="font-semibold text-blue-900">
                            {language === 'en' ? 'Emotional Context:' : 'Contexte Émotionnel:'}
                          </span>
                          <p className="text-slate-700 text-sm">{results.consciousness_notes.emotional_context}</p>
                        </div>
                      )}
                      {results.consciousness_notes.philosophical_implications && (
                        <div>
                          <span className="font-semibold text-indigo-900">
                            {language === 'en' ? 'Philosophical Implications:' : 'Implications Philosophiques:'}
                          </span>
                          <p className="text-slate-700 text-sm">{results.consciousness_notes.philosophical_implications}</p>
                        </div>
                      )}
                    </div>
                  </Card>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}