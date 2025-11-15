/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Intelligence-Specific Coaching                             ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Calculator,
  MessageCircle,
  Music,
  Activity,
  Shapes,
  Users,
  User,
  Leaf,
  Infinity,
  Loader2,
  Sparkles,
  Target,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";

const INTELLIGENCE_CONFIGS = {
  logico_mathematique: {
    icon: Calculator,
    color: "from-blue-500 to-cyan-600",
    exercises: [
      "Résoudre des équations complexes étape par étape",
      "Créer des algorithmes d'optimisation",
      "Analyser des données statistiques",
      "Démontrer des théorèmes mathématiques",
      "Modéliser des systèmes complexes"
    ],
    tips: [
      "Décompose les problèmes en sous-problèmes",
      "Utilise la visualisation pour les concepts abstraits",
      "Pratique la pensée algorithmique quotidiennement"
    ]
  },
  verbo_linguistique: {
    icon: MessageCircle,
    color: "from-purple-500 to-pink-600",
    exercises: [
      "Écrire un poème sur un thème philosophique",
      "Analyser la structure rhétorique d'un texte",
      "Créer une métaphore originale",
      "Rédiger un essai argumentatif structuré",
      "Improviser un récit narratif cohérent"
    ],
    tips: [
      "Lis quotidiennement des œuvres variées",
      "Expérimente avec différents styles d'écriture",
      "Enrichis ton vocabulaire consciemment"
    ]
  },
  musicale_rythmique: {
    icon: Music,
    color: "from-rose-500 to-orange-600",
    exercises: [
      "Composer une mélodie originale",
      "Analyser la structure harmonique d'une œuvre",
      "Créer un rythme complexe",
      "Improviser sur une progression d'accords",
      "Transcrire une mélodie à l'oreille"
    ],
    tips: [
      "Écoute de la musique avec attention analytique",
      "Expérimente avec les patterns rythmiques",
      "Explore différentes cultures musicales"
    ]
  },
  interpersonnelle: {
    icon: Users,
    color: "from-amber-500 to-yellow-600",
    exercises: [
      "Analyser les dynamiques d'un groupe",
      "Pratiquer l'écoute active empathique",
      "Décoder les signaux non-verbaux",
      "Médier un conflit avec diplomatie",
      "Adapter ton style de communication au contexte"
    ],
    tips: [
      "Observe attentivement les interactions sociales",
      "Développe ton empathie par l'écoute",
      "Pose des questions ouvertes pour comprendre"
    ]
  }
};

export default function IntelligenceCoachingSession({ intelligenceType, onComplete }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [session, setSession] = useState(null);
  const [exerciseProgress, setExerciseProgress] = useState({});

  const config = INTELLIGENCE_CONFIGS[intelligenceType] || INTELLIGENCE_CONFIGS.logico_mathematique;
  const Icon = config.icon;

  const generateSession = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Génère une session de coaching ciblée sur l'intelligence ${intelligenceType}.

INTELLIGENCE FOCUS: ${intelligenceType}

Crée une session de coaching personnalisée avec:
1. Un objectif d'apprentissage spécifique pour cette intelligence
2. 3 exercices progressifs adaptés (débutant, intermédiaire, avancé)
3. Des métriques de progression
4. Des conseils pratiques spécifiques

Retourne un JSON:
{
  "learning_objective": "objectif principal de la session",
  "current_level_assessment": "débutant|intermédiaire|avancé",
  "exercises": [
    {
      "title": "titre de l'exercice",
      "difficulty": "débutant|intermédiaire|avancé",
      "description": "description détaillée",
      "expected_outcome": "résultat attendu",
      "time_estimate": "temps estimé en minutes"
    }
  ],
  "skill_areas": [
    {
      "area": "nom de la compétence",
      "current_level": 0-100,
      "target_level": 0-100,
      "improvement_tips": ["conseil 1", "conseil 2"]
    }
  ],
  "practice_schedule": {
    "frequency": "quotidien|3x semaine|hebdomadaire",
    "duration_minutes": 15-60,
    "best_time": "matin|midi|soir"
  },
  "next_steps": ["étape 1", "étape 2", "étape 3"]
}`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            learning_objective: { type: "string" },
            current_level_assessment: { type: "string" },
            exercises: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  difficulty: { type: "string" },
                  description: { type: "string" },
                  expected_outcome: { type: "string" },
                  time_estimate: { type: "string" }
                }
              }
            },
            skill_areas: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  area: { type: "string" },
                  current_level: { type: "number" },
                  target_level: { type: "number" },
                  improvement_tips: { type: "array", items: { type: "string" } }
                }
              }
            },
            practice_schedule: {
              type: "object",
              properties: {
                frequency: { type: "string" },
                duration_minutes: { type: "number" },
                best_time: { type: "string" }
              }
            },
            next_steps: { type: "array", items: { type: "string" } }
          }
        }
      });

      const sessionRecord = await base44.entities.AICoachingSession.create({
        session_date: new Date().toISOString(),
        coaching_type: "skill_development",
        insights: result.skill_areas.map(s => ({
          title: `Développer: ${s.area}`,
          description: s.improvement_tips.join(" • "),
          priority: "medium",
          action_items: s.improvement_tips
        })),
        learning_path: {
          intelligence_focus: intelligenceType,
          current_level: result.current_level_assessment,
          recommended_activities: result.exercises.map(e => e.title),
          milestones: result.exercises.map((e, i) => ({
            title: e.title,
            completed: false,
            target_date: new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000).toISOString()
          }))
        },
        engagement_score: 75,
        next_steps: result.next_steps
      });

      setSession({ ...result, sessionId: sessionRecord.id });
      
      if (onComplete) {
        onComplete(result);
      }
    } catch (error) {
      console.error("Erreur génération session coaching:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExerciseComplete = (exerciseIndex) => {
    setExerciseProgress(prev => ({
      ...prev,
      [exerciseIndex]: true
    }));
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      débutant: "bg-green-100 text-green-700",
      intermédiaire: "bg-yellow-100 text-yellow-700",
      avancé: "bg-red-100 text-red-700"
    };
    return colors[difficulty] || colors.débutant;
  };

  return (
    <div className="space-y-6">
      <Card className={`p-6 bg-gradient-to-br ${config.color} text-white`}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">
              Coaching {intelligenceType.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-')}
            </h2>
            <p className="text-white/80 text-sm">Session de développement ciblé</p>
          </div>
        </div>
        
        {!session && (
          <Button
            onClick={generateSession}
            disabled={isGenerating}
            className="bg-white text-slate-900 hover:bg-white/90"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Génération...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Générer Session Personnalisée
              </>
            )}
          </Button>
        )}
      </Card>

      {session && (
        <>
          {/* Learning Objective */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-slate-900">Objectif d'Apprentissage</h3>
            </div>
            <p className="text-slate-700">{session.learning_objective}</p>
            <Badge className="mt-2" variant="outline">
              Niveau actuel: {session.current_level_assessment}
            </Badge>
          </Card>

          {/* Exercises */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Exercices Progressifs</h3>
            <div className="space-y-4">
              {session.exercises.map((exercise, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="border-l-4 border-purple-500 pl-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-slate-900">{exercise.title}</h4>
                        <Badge className={getDifficultyColor(exercise.difficulty)}>
                          {exercise.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{exercise.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>⏱️ {exercise.time_estimate}</span>
                        <span>🎯 {exercise.expected_outcome}</span>
                      </div>
                    </div>
                    {exerciseProgress[idx] ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleExerciseComplete(idx)}
                      >
                        Marquer complété
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Skill Areas */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Compétences à Développer</h3>
            <div className="space-y-4">
              {session.skill_areas.map((skill, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">{skill.area}</span>
                    <Badge variant="outline">
                      {skill.current_level}% → {skill.target_level}%
                    </Badge>
                  </div>
                  <Progress value={skill.current_level} className="h-2 mb-2" />
                  <ul className="space-y-1">
                    {skill.improvement_tips.map((tip, i) => (
                      <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                        <Sparkles className="w-3 h-3 text-purple-500 mt-0.5 flex-shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>

          {/* Practice Schedule */}
          <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Planning de Pratique</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-slate-600 mb-1">Fréquence</p>
                <p className="font-semibold text-slate-900">{session.practice_schedule.frequency}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Durée</p>
                <p className="font-semibold text-slate-900">{session.practice_schedule.duration_minutes} min</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Meilleur moment</p>
                <p className="font-semibold text-slate-900 capitalize">{session.practice_schedule.best_time}</p>
              </div>
            </div>
          </Card>

          {/* Next Steps */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Prochaines Étapes</h3>
            <div className="space-y-2">
              {session.next_steps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {idx + 1}
                  </div>
                  <p className="text-sm text-slate-700">{step}</p>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}