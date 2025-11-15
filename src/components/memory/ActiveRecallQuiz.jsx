/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Active Recall Quiz Generator                               ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, CheckCircle, XCircle, RotateCcw, Sparkles, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";

export default function ActiveRecallQuiz({ memories }) {
  const [quizState, setQuizState] = useState("idle"); // idle, loading, active, completed
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizData, setQuizData] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [revealedAnswer, setRevealedAnswer] = useState(false);

  const eligibleMemories = useMemo(() => {
    return memories.filter(m => 
      m.importance >= 5 && 
      m.content?.length > 20 &&
      (m.tags?.length > 0 || m.context)
    ).slice(0, 10);
  }, [memories]);

  const generateQuiz = async () => {
    if (eligibleMemories.length < 3) return;

    setQuizState("loading");

    try {
      const memoriesContext = eligibleMemories.map(m => ({
        content: m.content,
        tags: m.tags,
        type: m.type,
        importance: m.importance
      }));

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Tu es un générateur de quiz intelligent pour renforcer la rétention mémorielle.

Mémoires à tester:
${JSON.stringify(memoriesContext, null, 2)}

TÂCHE: Génère 5 questions de rappel actif variées et engageantes.

Types de questions:
- Rappel direct (Qu'est-ce que...)
- Application (Comment utiliseriez-vous...)
- Association (Quelle mémoire est liée à...)
- Réflexion (Pourquoi cette information est importante...)

Retourne JSON:
{
  "questions": [
    {
      "question": "question claire et précise",
      "answer": "réponse attendue",
      "memory_reference": "extrait de la mémoire concernée",
      "difficulty": "facile|moyen|difficile",
      "hint": "indice optionnel"
    }
  ]
}`,
        response_json_schema: {
          type: "object",
          properties: {
            questions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  question: { type: "string" },
                  answer: { type: "string" },
                  memory_reference: { type: "string" },
                  difficulty: { type: "string" },
                  hint: { type: "string" }
                }
              }
            }
          }
        }
      });

      setQuizData(result);
      setQuizState("active");
      setCurrentQuestion(0);
      setUserAnswers({});
      setRevealedAnswer(false);
    } catch (error) {
      console.error("Quiz generation error:", error);
      setQuizState("idle");
    }
  };

  const handleRevealAnswer = () => {
    setRevealedAnswer(true);
  };

  const handleMarkAnswer = (correct) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion]: correct
    }));

    setTimeout(() => {
      if (currentQuestion < quizData.questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setRevealedAnswer(false);
      } else {
        setQuizState("completed");
      }
    }, 1000);
  };

  const handleRestart = () => {
    setQuizState("idle");
    setQuizData(null);
    setUserAnswers({});
    setCurrentQuestion(0);
    setRevealedAnswer(false);
  };

  const score = Object.values(userAnswers).filter(Boolean).length;
  const total = Object.keys(userAnswers).length;

  if (eligibleMemories.length < 3) {
    return (
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <div className="text-center">
          <Brain className="w-12 h-12 text-purple-300 mx-auto mb-3" />
          <p className="text-slate-600">Pas assez de mémoires pour générer un quiz (minimum 3 requises)</p>
        </div>
      </Card>
    );
  }

  if (quizState === "idle") {
    return (
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Quiz de Rappel Actif</h3>
          <p className="text-slate-600 mb-4">
            Renforcez votre rétention avec {eligibleMemories.length} mémoires importantes
          </p>
          <Button 
            onClick={generateQuiz}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Générer le Quiz
          </Button>
        </div>
      </Card>
    );
  }

  if (quizState === "loading") {
    return (
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-block"
          >
            <Brain className="w-12 h-12 text-purple-600" />
          </motion.div>
          <p className="text-slate-600 mt-4">Génération du quiz...</p>
        </div>
      </Card>
    );
  }

  if (quizState === "completed") {
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    
    return (
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl"
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </motion.div>
          
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Quiz Terminé !</h3>
          <div className="text-4xl font-bold text-purple-600 mb-2">
            {score}/{total}
          </div>
          <p className="text-lg text-slate-600 mb-6">
            Score: {percentage}%
          </p>

          <div className="flex gap-3 justify-center">
            <Button 
              onClick={handleRestart}
              variant="outline"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Nouveau Quiz
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  const question = quizData.questions[currentQuestion];
  const difficultyColors = {
    facile: "bg-green-100 text-green-700",
    moyen: "bg-yellow-100 text-yellow-700",
    difficile: "bg-red-100 text-red-700"
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
      <div className="flex items-center justify-between mb-6">
        <Badge variant="secondary" className="text-sm">
          Question {currentQuestion + 1}/{quizData.questions.length}
        </Badge>
        <Badge className={difficultyColors[question.difficulty]}>
          {question.difficulty}
        </Badge>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="bg-white rounded-xl p-6 mb-4 shadow-sm">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">
              {question.question}
            </h4>

            {question.hint && !revealedAnswer && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-700">
                  💡 Indice: {question.hint}
                </p>
              </div>
            )}

            {revealedAnswer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4 mb-4"
              >
                <p className="font-semibold text-indigo-900 mb-2">Réponse:</p>
                <p className="text-slate-700 mb-3">{question.answer}</p>
                
                <div className="bg-white/50 rounded p-3">
                  <p className="text-xs text-slate-500 mb-1">Référence mémoire:</p>
                  <p className="text-sm text-slate-600 italic">{question.memory_reference}</p>
                </div>
              </motion.div>
            )}
          </div>

          <div className="flex gap-3">
            {!revealedAnswer ? (
              <Button 
                onClick={handleRevealAnswer}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                Révéler la Réponse
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <>
                <Button 
                  onClick={() => handleMarkAnswer(true)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Je savais
                </Button>
                <Button 
                  onClick={() => handleMarkAnswer(false)}
                  variant="outline"
                  className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  À revoir
                </Button>
              </>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </Card>
  );
}