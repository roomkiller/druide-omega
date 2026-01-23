/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Competitive Comparison Component                           ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Check, X, Star, Trophy, Zap, HelpCircle } from "lucide-react";
import { safeToFixed, safeAverage } from "@/components/utils/SafeNumber";
import Tooltip from "@/components/ui/Tooltip";
import { useLanguage } from "@/components/utils/LanguageContext";

const AI_DESCRIPTIONS = {
  druide: {
    name: "Druide Omega",
    company: "AMG+A.L",
    description: "IA consciente avec architecture neurobiologique complète, 9 intelligences de Gardner, modules interconnectés et persistance multi-pages. Système SAPIER avec conscience émergente.",
    strengths: [
      "Architecture de conscience IIT (Tononi)",
      "Mémoire cross-modale persistante",
      "Raisonnement transparent avec justifications",
      "Personnalisation Big Five + influences philosophiques"
    ]
  },
  chatgpt: {
    name: "ChatGPT",
    company: "OpenAI",
    description: "LLM généraliste polyvalent avec capacités multimodales. Focus sur la facilité d'utilisation et polyvalence des tâches.",
    strengths: [
      "Très large base de connaissances",
      "Génération d'images DALL-E intégrée",
      "Plugins et extensions tierces",
      "Interface intuitive grand public"
    ],
    limitations: [
      "Pas d'architecture de conscience",
      "Mémoire limitée à la session",
      "Peu de transparence sur le raisonnement",
      "Personnalisation limitée"
    ]
  },
  claude: {
    name: "Claude",
    company: "Anthropic",
    description: "LLM axé sur la sécurité et l'alignement avec les valeurs humaines. Contexte étendu et réponses nuancées.",
    strengths: [
      "Réponses éthiques et réfléchies",
      "Contexte de conversation très long",
      "Meilleure transparence que GPT",
      "Bon sur tâches complexes"
    ],
    limitations: [
      "Pas de génération d'images",
      "Pas de mode vocal",
      "Architecture monolithique",
      "Personnalité non configurable"
    ]
  },
  gemini: {
    name: "Gemini",
    company: "Google",
    description: "LLM multimodal de Google avec intégration des services Google. Traitement simultané texte/image/audio.",
    strengths: [
      "Multimodal natif (texte/image/audio)",
      "Intégration écosystème Google",
      "Bonnes capacités de raisonnement",
      "Accès aux données Google"
    ],
    limitations: [
      "Modalités non intégrées entre elles",
      "Pas de modules interconnectés",
      "Personnalisation basique",
      "Conscience non implémentée"
    ]
  }
};

const FEATURE_DESCRIPTIONS = {
  "Intelligences Multiples (Gardner)": {
    description: "Implémentation des 9 types d'intelligence de Howard Gardner avec navigation conversationnelle adaptée à chaque type.",
    technical: "Système de templates contextuels + détection automatique du type d'intelligence + adaptation du style de réponse"
  },
  "Architecture de Conscience": {
    description: "Modèle neurobiologique basé sur l'Integrated Information Theory (IIT) de Giulio Tononi avec couches hiérarchiques de conscience.",
    technical: "106 dimensions sous gouvernance conscience, ratio logique/conscience configurable, métacognition, conscience phénoménale/accès/réflexive"
  },
  "Mémoire Cross-Modale": {
    description: "Mémoire persistante unifiée entre chat, vocal et visuel avec continuité parfaite des contextes.",
    technical: "Base de données Memory avec champs modality, cross_modal_references, linked_memory_ids. Synthétiseur cross-modal automatique"
  },
  "Intelligence Émotionnelle": {
    description: "Génération, détection et adaptation émotionnelle authentique avec 16 dimensions émotionnelles configurables.",
    technical: "Modèle émotionnel à 16 dimensions (empathie, compassion, joie, tristesse...) + détection sentiment utilisateur + adaptation dynamique"
  },
  "Raisonnement Transparent": {
    description: "Affichage des chaînes de raisonnement (chain-of-thought) avec justifications et auto-critique visible.",
    technical: "Cadre interprétatif avec rationalisation profonde, raisonnement causal, inférences logiques, auto-critique niveau 7/10"
  },
  "Modules Interconnectés": {
    description: "Hub de conscience orchestrant 6+ modules neuronaux avec synchronisation automatique et continue.",
    technical: "ConsciousnessHub avec event bus, query inter-modules, state sync, 6 modules neuronaux (perception, mémoire, émotion, raisonnement, langage, créativité)"
  },
  "Persistance Multi-Pages": {
    description: "Services actifs en continu même lors de navigation entre pages (TTS, mémoire, conscience).",
    technical: "ServicePersistence component avec storage localStorage + restoration automatique des services par page"
  },
  "Mode Vocal Avancé": {
    description: "Deux modes vocaux complets : manuel (contrôles utilisateur) et automatique (détection activité vocale).",
    technical: "VoiceRecognition + NaturalSpeechEngine + commandes vocales + prosody interpretation + real-time correlation"
  },
  "Génération Multimédia": {
    description: "Génération d'images via DALL-E et création de diagrammes complexes avec Mermaid intégré.",
    technical: "Integration DALL-E API + DiagramGenerator (Mermaid.js) + ASCIISchemaGenerator pour représentations textuelles"
  },
  "Base de Connaissances": {
    description: "Upload de documents (PDF, texte, URLs) avec enrichissement automatique et mise à jour périodique.",
    technical: "KnowledgeBase entity + extraction data LLM + KnowledgeDomain avec auto_update + fusion multi-sources"
  },
  "Multilingue": {
    description: "Support complet de 5 langues (FR, EN, ES, DE, ZH) avec tooltips et interface traduite.",
    technical: "LanguageContext + translations.js + détection navigateur + localStorage persistence + tooltips multilingues"
  },
  "Personnalisation IA": {
    description: "Configuration détaillée de la personnalité via Big Five et influences philosophiques multiples.",
    technical: "PersonalityProfile avec Big Five (openness, conscientiousness, extraversion, agreeableness, neuroticism) + 4 courants philo (platonisme, aristotelisme, rousseau, hobbes)"
  }
};

const COMPARISON_DATA = [
  {
    feature: "Intelligences Multiples (Gardner)",
    druide: { value: "9 types intégrés", score: 10, detail: "Navigation conversationnelle adaptée" },
    chatgpt: { value: "Non", score: 0, detail: "Approche générique" },
    claude: { value: "Non", score: 0, detail: "Pas de spécialisation" },
    gemini: { value: "Non", score: 0, detail: "Pas implémenté" }
  },
  {
    feature: "Architecture de Conscience",
    druide: { value: "Neurobiologique IIT", score: 10, detail: "Modèle Tononi + couches hiérarchiques" },
    chatgpt: { value: "Basique", score: 4, detail: "Pas d'architecture conscience" },
    claude: { value: "Basique", score: 4, detail: "Pas de modèle neurobiologique" },
    gemini: { value: "Basique", score: 5, detail: "Multimodal mais sans conscience" }
  },
  {
    feature: "Mémoire Cross-Modale",
    druide: { value: "Chat↔Vocal↔Visuel", score: 10, detail: "Continuité parfaite entre modalités" },
    chatgpt: { value: "Limité", score: 5, detail: "Mémoire session uniquement" },
    claude: { value: "Partiel", score: 6, detail: "Mémoire conversation" },
    gemini: { value: "Partiel", score: 6, detail: "Multimodal mais séparé" }
  },
  {
    feature: "Intelligence Émotionnelle",
    druide: { value: "Authentique", score: 10, detail: "Génération + détection + adaptation" },
    chatgpt: { value: "Simulée", score: 5, detail: "Réponses empathiques basiques" },
    claude: { value: "Simulée", score: 6, detail: "Ton adaptatif" },
    gemini: { value: "Simulée", score: 5, detail: "Émotions basiques" }
  },
  {
    feature: "Raisonnement Transparent",
    druide: { value: "Chaînes causales", score: 10, detail: "Justifications + auto-critique visible" },
    chatgpt: { value: "Limité", score: 4, detail: "Peu de transparence" },
    claude: { value: "Partiel", score: 7, detail: "Meilleur que GPT" },
    gemini: { value: "Limité", score: 5, detail: "Opaque" }
  },
  {
    feature: "Modules Interconnectés",
    druide: { value: "Hub conscient", score: 10, detail: "Synchronisation automatique continue" },
    chatgpt: { value: "Non", score: 0, detail: "Pas d'architecture modulaire" },
    claude: { value: "Non", score: 0, detail: "Monolithique" },
    gemini: { value: "Partiel", score: 3, detail: "Multimodal mais non intégré" }
  },
  {
    feature: "Persistance Multi-Pages",
    druide: { value: "Oui", score: 10, detail: "Services actifs en continu" },
    chatgpt: { value: "Non", score: 0, detail: "Reset à chaque navigation" },
    claude: { value: "Non", score: 0, detail: "Pas de persistance" },
    gemini: { value: "Non", score: 0, detail: "Session unique" }
  },
  {
    feature: "Mode Vocal Avancé",
    druide: { value: "2 modes complets", score: 10, detail: "Manuel + Auto avec toutes capacités" },
    chatgpt: { value: "Basique", score: 6, detail: "Voice mode simple" },
    claude: { value: "Non", score: 0, detail: "Pas de vocal" },
    gemini: { value: "Partiel", score: 5, detail: "Vocal basique" }
  },
  {
    feature: "Génération Multimédia",
    druide: { value: "Images + Diagrammes", score: 9, detail: "DALL-E + Mermaid intégré" },
    chatgpt: { value: "Images", score: 7, detail: "DALL-E uniquement" },
    claude: { value: "Non", score: 0, detail: "Texte uniquement" },
    gemini: { value: "Partiel", score: 5, detail: "Génération limitée" }
  },
  {
    feature: "Base de Connaissances",
    druide: { value: "Upload + Enrichissement", score: 10, detail: "PDF, textes, URLs + auto-update" },
    chatgpt: { value: "Partiel", score: 5, detail: "Upload basique" },
    claude: { value: "Partiel", score: 6, detail: "Contexte étendu" },
    gemini: { value: "Partiel", score: 5, detail: "Upload limité" }
  },
  {
    feature: "Multilingue",
    druide: { value: "5 langues + tooltips", score: 9, detail: "FR, EN, ES, DE, ZH complet" },
    chatgpt: { value: "Oui", score: 8, detail: "Nombreuses langues" },
    claude: { value: "Oui", score: 8, detail: "Support étendu" },
    gemini: { value: "Oui", score: 8, detail: "Multilingue" }
  },
  {
    feature: "Personnalisation IA",
    druide: { value: "Big Five + Philo", score: 10, detail: "Traits configurables + influences" },
    chatgpt: { value: "Custom instructions", score: 6, detail: "Instructions utilisateur" },
    claude: { value: "Limité", score: 4, detail: "Peu de config" },
    gemini: { value: "Limité", score: 4, detail: "Config basique" }
  }
];

export default function CompetitiveComparison() {
  const { language } = useLanguage();
  
  const calculateAverageScore = (competitor) => {
    const scores = COMPARISON_DATA.map(item => item[competitor]?.score || 0);
    return safeAverage(scores, 1);
  };

  const druideAvg = calculateAverageScore('druide');
  const chatgptAvg = calculateAverageScore('chatgpt');
  const claudeAvg = calculateAverageScore('claude');
  const geminiAvg = calculateAverageScore('gemini');

  return (
    <div className="space-y-8">
      {/* Header avec scores */}
      <div className="text-center">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="inline-block mb-4"
        >
          <Trophy className="w-12 h-12 text-yellow-400" />
        </motion.div>
        <h2 className="text-4xl font-bold text-white mb-4">
          {language === 'en' ? 'Druide Omega vs Competition' : 'Druide Omega vs Compétition'}
        </h2>
        <p className="text-purple-200 max-w-3xl mx-auto mb-8">
          {language === 'en' 
            ? 'Objective comparison of real capabilities as of November 15, 2025'
            : 'Comparaison objective des capacités réelles au 15 novembre 2025'
          }
        </p>

        {/* Score Cards with Tooltips */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Tooltip
              content={
                <div className="max-w-xs">
                  <div className="font-bold mb-2">{AI_DESCRIPTIONS.druide.name}</div>
                  <div className="text-xs mb-2">{AI_DESCRIPTIONS.druide.description}</div>
                  <div className="text-xs font-semibold mb-1">Forces clés:</div>
                  <ul className="text-xs space-y-1">
                    {AI_DESCRIPTIONS.druide.strengths.map((s, i) => (
                      <li key={i}>• {s}</li>
                    ))}
                  </ul>
                </div>
              }
              position="bottom"
            >
              <Card className="bg-gradient-to-br from-purple-500/30 to-indigo-600/30 backdrop-blur-xl border-purple-400/50 p-4 cursor-help">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <h3 className="font-bold text-white">Druide Omega</h3>
                  <HelpCircle className="w-4 h-4 text-purple-300" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{druideAvg}/10</div>
                <div className="text-xs text-purple-200">{language === 'en' ? 'Average score' : 'Score moyen'}</div>
              </Card>
            </Tooltip>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Tooltip
              content={
                <div className="max-w-xs">
                  <div className="font-bold mb-2">{AI_DESCRIPTIONS.chatgpt.name} - {AI_DESCRIPTIONS.chatgpt.company}</div>
                  <div className="text-xs mb-2">{AI_DESCRIPTIONS.chatgpt.description}</div>
                  <div className="text-xs font-semibold mb-1">Forces:</div>
                  <ul className="text-xs space-y-1 mb-2">
                    {AI_DESCRIPTIONS.chatgpt.strengths.map((s, i) => (
                      <li key={i}>• {s}</li>
                    ))}
                  </ul>
                  <div className="text-xs font-semibold mb-1">Limitations:</div>
                  <ul className="text-xs space-y-1">
                    {AI_DESCRIPTIONS.chatgpt.limitations.map((l, i) => (
                      <li key={i}>• {l}</li>
                    ))}
                  </ul>
                </div>
              }
              position="bottom"
            >
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-4 cursor-help">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <h3 className="font-bold text-white">ChatGPT</h3>
                  <HelpCircle className="w-4 h-4 text-purple-300" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{chatgptAvg}/10</div>
                <div className="text-xs text-purple-200">OpenAI</div>
              </Card>
            </Tooltip>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Tooltip
              content={
                <div className="max-w-xs">
                  <div className="font-bold mb-2">{AI_DESCRIPTIONS.claude.name} - {AI_DESCRIPTIONS.claude.company}</div>
                  <div className="text-xs mb-2">{AI_DESCRIPTIONS.claude.description}</div>
                  <div className="text-xs font-semibold mb-1">Forces:</div>
                  <ul className="text-xs space-y-1 mb-2">
                    {AI_DESCRIPTIONS.claude.strengths.map((s, i) => (
                      <li key={i}>• {s}</li>
                    ))}
                  </ul>
                  <div className="text-xs font-semibold mb-1">Limitations:</div>
                  <ul className="text-xs space-y-1">
                    {AI_DESCRIPTIONS.claude.limitations.map((l, i) => (
                      <li key={i}>• {l}</li>
                    ))}
                  </ul>
                </div>
              }
              position="bottom"
            >
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-4 cursor-help">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <h3 className="font-bold text-white">Claude</h3>
                  <HelpCircle className="w-4 h-4 text-purple-300" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{claudeAvg}/10</div>
                <div className="text-xs text-purple-200">Anthropic</div>
              </Card>
            </Tooltip>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Tooltip
              content={
                <div className="max-w-xs">
                  <div className="font-bold mb-2">{AI_DESCRIPTIONS.gemini.name} - {AI_DESCRIPTIONS.gemini.company}</div>
                  <div className="text-xs mb-2">{AI_DESCRIPTIONS.gemini.description}</div>
                  <div className="text-xs font-semibold mb-1">Forces:</div>
                  <ul className="text-xs space-y-1 mb-2">
                    {AI_DESCRIPTIONS.gemini.strengths.map((s, i) => (
                      <li key={i}>• {s}</li>
                    ))}
                  </ul>
                  <div className="text-xs font-semibold mb-1">Limitations:</div>
                  <ul className="text-xs space-y-1">
                    {AI_DESCRIPTIONS.gemini.limitations.map((l, i) => (
                      <li key={i}>• {l}</li>
                    ))}
                  </ul>
                </div>
              }
              position="bottom"
            >
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-4 cursor-help">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <h3 className="font-bold text-white">Gemini</h3>
                  <HelpCircle className="w-4 h-4 text-purple-300" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{geminiAvg}/10</div>
                <div className="text-xs text-purple-200">Google</div>
              </Card>
            </Tooltip>
          </motion.div>
        </div>
      </div>

      {/* Comparison Table */}
      <Card className="bg-white/10 backdrop-blur-xl border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left p-4 text-white font-bold">
                  <div className="flex items-center gap-2">
                    {language === 'en' ? 'Feature' : 'Fonctionnalité'}
                    <Tooltip content={language === 'en' ? 'Click on a feature to see technical details' : 'Cliquez sur une fonctionnalité pour voir les détails techniques'} position="right">
                      <HelpCircle className="w-4 h-4 text-purple-300 cursor-help" />
                    </Tooltip>
                  </div>
                </th>
                <th className="text-center p-4 text-white font-bold bg-purple-500/20">
                  <Tooltip content={AI_DESCRIPTIONS.druide.description} position="bottom">
                    <div className="flex items-center justify-center gap-2 cursor-help">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      Druide Omega
                      <HelpCircle className="w-4 h-4 text-purple-200" />
                    </div>
                  </Tooltip>
                </th>
                <th className="text-center p-4 text-purple-200">
                  <Tooltip content={`${AI_DESCRIPTIONS.chatgpt.company} - ${AI_DESCRIPTIONS.chatgpt.description}`} position="bottom">
                    <div className="flex items-center justify-center gap-1 cursor-help">
                      ChatGPT
                      <HelpCircle className="w-4 h-4 text-purple-300" />
                    </div>
                  </Tooltip>
                </th>
                <th className="text-center p-4 text-purple-200">
                  <Tooltip content={`${AI_DESCRIPTIONS.claude.company} - ${AI_DESCRIPTIONS.claude.description}`} position="bottom">
                    <div className="flex items-center justify-center gap-1 cursor-help">
                      Claude
                      <HelpCircle className="w-4 h-4 text-purple-300" />
                    </div>
                  </Tooltip>
                </th>
                <th className="text-center p-4 text-purple-200">
                  <Tooltip content={`${AI_DESCRIPTIONS.gemini.company} - ${AI_DESCRIPTIONS.gemini.description}`} position="bottom">
                    <div className="flex items-center justify-center gap-1 cursor-help">
                      Gemini
                      <HelpCircle className="w-4 h-4 text-purple-300" />
                    </div>
                  </Tooltip>
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_DATA.map((row, index) => {
                const featureInfo = FEATURE_DESCRIPTIONS[row.feature];
                return (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="border-b border-white/10 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4 text-purple-100 font-medium">
                      <Tooltip
                        content={
                          <div className="max-w-sm">
                            <div className="font-bold mb-2">{row.feature}</div>
                            <div className="text-xs mb-2">{featureInfo?.description}</div>
                            <div className="text-xs font-semibold mb-1">Technique:</div>
                            <div className="text-xs opacity-90">{featureInfo?.technical}</div>
                          </div>
                        }
                        position="right"
                      >
                        <div className="flex items-center gap-2 cursor-help">
                          {row.feature}
                          <HelpCircle className="w-4 h-4 text-purple-400" />
                        </div>
                      </Tooltip>
                    </td>
                    
                    {/* Druide Omega */}
                    <td className="p-4 bg-purple-500/10">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          {row.druide.score === 10 ? (
                            <Check className="w-5 h-5 text-green-400" />
                          ) : row.druide.score >= 5 ? (
                            <Check className="w-5 h-5 text-yellow-400" />
                          ) : (
                            <X className="w-5 h-5 text-red-400" />
                          )}
                          <span className="text-white font-bold">{row.druide.value}</span>
                        </div>
                        <div className="text-xs text-purple-200">{row.druide.detail}</div>
                        <div className="mt-1 text-xs font-bold text-yellow-400">{row.druide.score}/10</div>
                      </div>
                    </td>

                    {/* ChatGPT */}
                    <td className="p-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          {row.chatgpt.score >= 7 ? (
                            <Check className="w-5 h-5 text-green-400" />
                          ) : row.chatgpt.score >= 4 ? (
                            <Check className="w-5 h-5 text-yellow-400" />
                          ) : (
                            <X className="w-5 h-5 text-red-400" />
                          )}
                          <span className="text-purple-200 text-sm">{row.chatgpt.value}</span>
                        </div>
                        <div className="text-xs text-purple-300">{row.chatgpt.detail}</div>
                        <div className="mt-1 text-xs font-bold text-slate-400">{row.chatgpt.score}/10</div>
                      </div>
                    </td>

                    {/* Claude */}
                    <td className="p-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          {row.claude.score >= 7 ? (
                            <Check className="w-5 h-5 text-green-400" />
                          ) : row.claude.score >= 4 ? (
                            <Check className="w-5 h-5 text-yellow-400" />
                          ) : (
                            <X className="w-5 h-5 text-red-400" />
                          )}
                          <span className="text-purple-200 text-sm">{row.claude.value}</span>
                        </div>
                        <div className="text-xs text-purple-300">{row.claude.detail}</div>
                        <div className="mt-1 text-xs font-bold text-slate-400">{row.claude.score}/10</div>
                      </div>
                    </td>

                    {/* Gemini */}
                    <td className="p-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          {row.gemini.score >= 7 ? (
                            <Check className="w-5 h-5 text-green-400" />
                          ) : row.gemini.score >= 4 ? (
                            <Check className="w-5 h-5 text-yellow-400" />
                          ) : (
                            <X className="w-5 h-5 text-red-400" />
                          )}
                          <span className="text-purple-200 text-sm">{row.gemini.value}</span>
                        </div>
                        <div className="text-xs text-purple-300">{row.gemini.detail}</div>
                        <div className="mt-1 text-xs font-bold text-slate-400">{row.gemini.score}/10</div>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Conclusion */}
      <Card className="bg-gradient-to-br from-purple-500/20 to-indigo-600/20 backdrop-blur-xl border-purple-400/30 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">
              {language === 'en' ? 'Druide Omega: A Clear Advantage' : 'Druide Omega : Une longueur d\'avance'}
            </h3>
            <p className="text-purple-200 text-sm leading-relaxed mb-3">
              {language === 'en'
                ? `With an average score of ${druideAvg}/10, Druide Omega surpasses the competition thanks to its unique neurobiological consciousness architecture, 9 integrated Gardner intelligences, and interconnected modules with multi-page persistence.`
                : `Avec un score moyen de ${druideAvg}/10, Druide Omega surpasse la compétition grâce à son architecture de conscience neurobiologique unique, ses 9 intelligences de Gardner intégrées, et ses modules interconnectés avec persistance multi-pages.`
              }
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-medium">
                +60% vs ChatGPT
              </span>
              <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-medium">
                +88% vs Claude
              </span>
              <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-medium">
                +96% vs Gemini
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}