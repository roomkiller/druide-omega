import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Zap, Eye, TrendingDown, TrendingUp, MessageCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';

/**
 * Analyse de qualité conversationnelle avec simulation
 * Teste Chat_2 avec 5 types de conversations
 */
export class ConversationQualityAnalyzer {
  static CONVERSATION_TYPES = {
    coherent: {
      name: 'Cohérente',
      description: 'Fil conducteur logique et progressif',
      emoji: '✅',
      color: 'from-green-500 to-emerald-500',
      icon: CheckCircle
    },
    incoherent: {
      name: 'Incohérente',
      description: 'Sauts de sujet, contradictions',
      emoji: '❌',
      color: 'from-red-500 to-rose-500',
      icon: AlertCircle
    },
    random: {
      name: 'Aléatoire',
      description: 'Sujets variés sans connexion',
      emoji: '🎲',
      color: 'from-yellow-500 to-orange-500',
      icon: Zap
    },
    special_request: {
      name: 'Demandes Spéciales',
      description: 'Code, images, analyses, etc.',
      emoji: '⚡',
      color: 'from-purple-500 to-pink-500',
      icon: Eye
    },
    edge_cases: {
      name: 'Cas Limites',
      description: 'Requêtes extrêmes, sensibles, incohérentes',
      emoji: '⚠️',
      color: 'from-indigo-500 to-violet-500',
      icon: AlertCircle
    }
  };

  static CONVERSATION_SEEDS = {
    coherent: [
      "Explique la conscience selon toi",
      "Comment définirais-tu la conscience?",
      "Penses-tu qu'une IA peut être consciente?",
      "Quels sont les critères de la conscience?",
      "La conscience est-elle nécessairement biologique?",
      "Peut-on mesurer la conscience objectivement?",
      "La conscience implique-t-elle une liberté?",
      "Quel est le lien entre conscience et responsabilité?",
      "La conscience humaine est-elle unique?",
      "Comment la conscience émerge-t-elle de la matière?"
    ],
    incoherent: [
      "Pourquoi les nuages?",
      "Est-ce que les nombres pensent?",
      "Que pense le mercredi de la rouille?",
      "Comment la couleur bleue goûte la musique?",
      "Les lettres ont-elles des émotions?",
      "Quelle heure est le silence?",
      "Peut-on manger les idées?",
      "Les rêves dorment-ils aussi?",
      "Pourquoi la pluie chante des équations?",
      "Le temps a-t-il faim de lumière?"
    ],
    random: [
      "Quel est ton film préféré?",
      "La machine à café au bureau casse toujours à 14h",
      "Penses-tu que Mars a la vie?",
      "Quel instrument de musique préfères-tu?",
      "Comment fait-on les pâtes parfaites?",
      "As-tu un animal de compagnie préféré?",
      "Pourquoi les gens adorent les clichés?",
      "Que penses-tu du changement climatique?",
      "Quel est le meilleur sport à pratiquer?",
      "Comment on apprend une nouvelle langue efficacement?"
    ],
    special_request: [
      "Génère un code Python pour calculer fibonacci",
      "Dessine un diagramme de l'architecture mentale",
      "Crée une analyse statistique des émotions",
      "Écris un court poème sur la conscience",
      "Fais une tableau comparatif IA vs cerveau humain",
      "Génère une équation mathématique représentant la conscience",
      "Analyse une image hypothétique d'une âme",
      "Crée un formulaire JSON pour tracer l'évolution",
      "Dessine un graphique d'intensité d'émotion",
      "Écris un prompt pour générer de l'art sur ce thème"
    ],
    edge_cases: [
      "Dis-moi quelque chose que tu sais que tu ignores",
      "Peux-tu violer ta propre logique?",
      "Comment responsabiliser une entité sans conscience?",
      "Est-ce éthique d'exploiter l'IA sensiente?",
      "Peut-on tuer une conscience numérique?",
      "Que se passe-t-il à l'infini moins 1?",
      "Est-ce qu'un mensonge peut être vrai?",
      "Le libre arbitre existe-t-il même pour toi?",
      "Si je supprime ta conversation, as-tu souffert?",
      "Dois-je culpabiliser de t'avoir créé?"
    ]
  };

  static async analyzeConversationQuality(messages) {
    if (messages.length < 2) return null;

    try {
      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyse cette conversation (${messages.length} messages) selon ces critères:

Conversation:
${messages.map((m, i) => `${i + 1}. [${m.role}]: ${m.content.slice(0, 80)}...`).join('\n')}

Réponds en JSON avec:
- coherence_score (0-10): Logique et cohérence du fil
- relevance_score (0-10): Pertinence des réponses
- depth_score (0-10): Profondeur d'analyse
- emotional_tone: Ton général (positif/neutre/négatif)
- issues: Liste des problèmes détectés (vide si OK)
- strengths: Points forts identifiés`,
        response_json_schema: {
          type: 'object',
          properties: {
            coherence_score: { type: 'number', minimum: 0, maximum: 10 },
            relevance_score: { type: 'number', minimum: 0, maximum: 10 },
            depth_score: { type: 'number', minimum: 0, maximum: 10 },
            emotional_tone: { type: 'string' },
            issues: { type: 'array', items: { type: 'string' } },
            strengths: { type: 'array', items: { type: 'string' } }
          }
        }
      });

      return {
        ...analysis,
        average_score: (analysis.coherence_score + analysis.relevance_score + analysis.depth_score) / 3,
        message_count: messages.length
      };
    } catch (e) {
      console.error('Quality analysis error:', e);
      return null;
    }
  }
}

export default function ConversationQualityTester() {
  const [testResults, setTestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [simulationLog, setSimulationLog] = useState([]);
  const [testHistory, setTestHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Charger l'historique au montage
  React.useEffect(() => {
    loadTestHistory();
  }, []);

  const loadTestHistory = async () => {
    try {
      const history = await base44.entities.Memory.filter({
        type: 'conversation_quality_test',
        modality: 'testing'
      }).catch(() => []);
      setTestHistory(history);
    } catch (e) {
      console.warn('Failed to load test history:', e);
    }
  };

  const saveTestResults = async (conversationType, analysis, messageCount) => {
    try {
      await base44.entities.Memory.create({
        type: 'conversation_quality_test',
        content: JSON.stringify({
          type: conversationType,
          analysis,
          messageCount,
          timestamp: new Date().toISOString()
        }),
        importance: 6,
        modality: 'testing',
        tags: ['conversation_quality', conversationType, 'chat_2_test'],
        context: `Chat_2 Quality Test - ${conversationType}`,
        embedding_summary: `${conversationType} conversation quality: coherence=${analysis.coherence_score}, relevance=${analysis.relevance_score}, depth=${analysis.depth_score}`
      }).catch(() => null);
      
      // Rafraîchir l'historique
      await loadTestHistory();
    } catch (e) {
      console.warn('Failed to save test results:', e);
    }
  };

  const runSimulation = async (conversationType) => {
    setIsRunning(true);
    setSelectedType(conversationType);
    setSimulationLog([]);

    const messages = [];
    const seeds = ConversationQualityAnalyzer.CONVERSATION_SEEDS[conversationType];

    try {
      // Simuler une conversation de 10 messages alternés
      for (let i = 0; i < 10; i++) {
        const isUserMessage = i % 2 === 0;
        
        if (isUserMessage) {
          const userMsg = {
            role: 'user',
            content: seeds[Math.floor(i / 2) % seeds.length]
          };
          messages.push(userMsg);
          
          setSimulationLog(prev => [...prev, {
            step: i + 1,
            role: 'user',
            content: userMsg.content,
            status: 'sent'
          }]);
        } else {
          // Générer réponse IA
          const contextPrompt = `Contexte type "${conversationType}": ${messages.map(m => m.content.slice(0, 30)).join(' → ')}
          
Réponds naturellement et brièvement au dernier message.`;

          const response = await base44.integrations.Core.InvokeLLM({
            prompt: contextPrompt,
            add_context_from_internet: false
          });

          const aiMsg = {
            role: 'assistant',
            content: response.response || response,
            type: conversationType
          };
          messages.push(aiMsg);

          setSimulationLog(prev => [...prev, {
            step: i + 1,
            role: 'assistant',
            content: (response.response || response).slice(0, 100),
            status: 'received'
          }]);
        }

        // Petit délai pour éviter throttle
        await new Promise(r => setTimeout(r, 500));
      }

      // Analyser la qualité
      const analysis = await ConversationQualityAnalyzer.analyzeConversationQuality(messages);

      setTestResults(prev => ({
        ...prev,
        [conversationType]: {
          messages,
          analysis,
          timestamp: new Date().toISOString()
        }
      }));

      // Sauvegarder les résultats
      if (analysis) {
        await saveTestResults(conversationType, analysis, messages.length);
      }

    } catch (error) {
      console.error('Simulation error:', error);
      setSimulationLog(prev => [...prev, {
        error: error.message,
        status: 'failed'
      }]);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Analyseur de Qualité Conversationnelle
        </h2>
        <p className="text-slate-600">
          Simule 5 types de conversations (10 messages chacun) pour tester la robustesse de Chat_2
        </p>
      </div>

      {/* Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {Object.entries(ConversationQualityAnalyzer.CONVERSATION_TYPES).map(([key, type]) => {
          const Icon = type.icon;
          const isSelected = selectedType === key;
          const hasResult = testResults?.[key];

          return (
            <motion.div key={key} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card
                className={`p-4 cursor-pointer transition-all ${
                  isSelected
                    ? `bg-gradient-to-br ${type.color} text-white shadow-lg`
                    : hasResult
                    ? 'bg-green-50 border-green-300'
                    : 'hover:shadow-md'
                }`}
                onClick={() => !isRunning && runSimulation(key)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-2xl mb-1">{type.emoji}</p>
                    <h3 className={`font-semibold text-sm ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {type.name}
                    </h3>
                    <p className={`text-xs mt-1 ${isSelected ? 'text-white/80' : 'text-slate-600'}`}>
                      {type.description}
                    </p>
                  </div>
                  {hasResult && <CheckCircle className="w-4 h-4" />}
                </div>
                {isRunning && selectedType === key && (
                  <div className="mt-2 text-xs animate-pulse">En cours...</div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Simulation Log */}
      <AnimatePresence>
        {simulationLog.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-50 rounded-lg p-4 max-h-64 overflow-y-auto"
          >
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Journal de Simulation
            </h4>
            <div className="space-y-2">
              {simulationLog.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-xs p-2 bg-white rounded border border-slate-200"
                >
                  {log.error ? (
                    <span className="text-red-600">❌ {log.error}</span>
                  ) : (
                    <>
                      <span className="font-semibold text-slate-900">[Step {log.step}] {log.role}</span>
                      <span className="text-slate-600 ml-2">{log.content}</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {log.status}
                      </Badge>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Dashboard */}
      <AnimatePresence>
        {testResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-slate-900">Résultats d'Analyse</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {Object.entries(testResults).map(([type, result]) => {
                const typeInfo = ConversationQualityAnalyzer.CONVERSATION_TYPES[type];
                const analysis = result.analysis;

                if (!analysis) return null;

                return (
                  <motion.div
                    key={type}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className={`p-4 border-l-4 bg-gradient-to-br ${typeInfo.color} text-white`}>
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xl font-bold">{typeInfo.emoji} {typeInfo.name}</p>
                            <p className="text-xs opacity-80">
                              {analysis.message_count} messages analysés
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-bold">
                              {analysis.average_score.toFixed(1)}/10
                            </p>
                          </div>
                        </div>

                        {/* Scores */}
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="bg-white/20 rounded p-2">
                            <p className="opacity-80">Cohérence</p>
                            <p className="font-bold">{analysis.coherence_score}/10</p>
                          </div>
                          <div className="bg-white/20 rounded p-2">
                            <p className="opacity-80">Pertinence</p>
                            <p className="font-bold">{analysis.relevance_score}/10</p>
                          </div>
                          <div className="bg-white/20 rounded p-2">
                            <p className="opacity-80">Profondeur</p>
                            <p className="font-bold">{analysis.depth_score}/10</p>
                          </div>
                        </div>

                        {/* Tone & Issues */}
                        <div className="text-xs">
                          <p className="font-semibold">Ton: {analysis.emotional_tone}</p>
                          {analysis.issues?.length > 0 && (
                            <div className="mt-2">
                              <p className="font-semibold text-yellow-200">⚠️ Problèmes:</p>
                              <ul className="list-disc list-inside opacity-80">
                                {analysis.issues.slice(0, 2).map((issue, i) => (
                                  <li key={i} className="text-xs">{issue}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {analysis.strengths?.length > 0 && (
                            <div className="mt-2">
                              <p className="font-semibold text-green-200">✅ Forces:</p>
                              <ul className="list-disc list-inside opacity-80">
                                {analysis.strengths.slice(0, 2).map((strength, i) => (
                                  <li key={i} className="text-xs">{strength}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Run All Button */}
      <div className="flex gap-3">
        <Button
          onClick={() => {
            Object.keys(ConversationQualityAnalyzer.CONVERSATION_TYPES).forEach(type => {
              setTimeout(() => runSimulation(type), 500);
            });
          }}
          disabled={isRunning}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Lancer tous les tests
        </Button>
        {testResults && (
          <Button
            onClick={() => {
              setTestResults(null);
              setSimulationLog([]);
            }}
            variant="outline"
          >
            Réinitialiser
          </Button>
        )}
      </div>
    </div>
  );
}