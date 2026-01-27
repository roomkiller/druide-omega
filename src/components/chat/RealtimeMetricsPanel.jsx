import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gauge, Heart, Zap, Target, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/utils/LanguageContext";

/**
 * RealtimeMetricsPanel: Affiche les métriques d'évaluation en temps réel
 * - Résonance: Quelle profondeur émotionnelle/intellectuelle de la réponse?
 * - Authenticité: Est-ce que ça sonne vrai/honnête/pas robbot?
 * - Sentiment: Ton émotionnel dominant
 * - Breakthrough: Y-a-t-il eu un insight/révélation?
 */
export default function RealtimeMetricsPanel({ feedback = null, messageFeedback = {} }) {
  const { language } = useLanguage();

  // Récupérer le feedback le plus récent
  const latestFeedback = useMemo(() => {
    if (feedback) return feedback;
    
    const feedbackArray = Object.values(messageFeedback);
    return feedbackArray.length > 0 ? feedbackArray[feedbackArray.length - 1] : null;
  }, [feedback, messageFeedback]);

  const metrics = latestFeedback
    ? [
        {
          icon: Heart,
          label: language === 'en' ? 'Resonance' : 'Résonance',
          value: latestFeedback.resonance_level,
          max: 10,
          description: language === 'en' 
            ? 'Depth of emotional/intellectual connection' 
            : 'Profondeur de connexion émotionnelle/intellectuelle',
          color: 'text-pink-500',
          bgColor: 'bg-pink-50',
          barColor: 'bg-pink-500'
        },
        {
          icon: Zap,
          label: language === 'en' ? 'Authenticity' : 'Authenticité',
          value: latestFeedback.authenticity,
          max: 100,
          description: language === 'en'
            ? 'How genuine, honest, non-robotic'
            : 'Honnêteté, absence de robot-speak',
          color: 'text-amber-500',
          bgColor: 'bg-amber-50',
          barColor: 'bg-amber-500'
        },
        {
          icon: Target,
          label: language === 'en' ? 'Sentiment' : 'Sentiment',
          value: latestFeedback.sentiment_druide || 'neutral',
          description: language === 'en'
            ? 'Dominant emotional tone'
            : 'Ton émotionnel dominant',
          color: 'text-indigo-500',
          bgColor: 'bg-indigo-50',
          isText: true
        },
        {
          icon: TrendingUp,
          label: language === 'en' ? 'Breakthrough' : 'Déverrouillage',
          value: latestFeedback.breakthrough ? language === 'en' ? 'Yes' : 'Oui' : language === 'en' ? 'No' : 'Non',
          description: language === 'en'
            ? 'Significant insight or revelation detected'
            : 'Insight ou révélation détecté',
          color: latestFeedback.breakthrough ? 'text-purple-600' : 'text-slate-400',
          bgColor: latestFeedback.breakthrough ? 'bg-purple-50' : 'bg-slate-50',
          isBoolean: true
        }
      ]
    : [];

  if (!latestFeedback) {
    return (
      <div className="p-4 text-center text-slate-500">
        <p className="text-sm">
          {language === 'en' ? 'No metrics yet...' : 'Pas de métriques pour l\'instant...'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4">
      <div className="mb-2">
        <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-3">
          ⚡ {language === 'en' ? 'Real-time Evaluation' : 'Évaluation Temps Réel'}
        </h4>
      </div>

      <AnimatePresence>
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          const isNumeric = typeof metric.value === 'number';
          const percentage = isNumeric ? (metric.value / metric.max) * 100 : 0;

          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className={`p-3 border border-slate-200 ${metric.bgColor}`}>
                <div className="space-y-2">
                  {/* Header avec icône et label */}
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${metric.color}`} />
                    <span className="text-xs font-semibold text-slate-900">
                      {metric.label}
                    </span>
                  </div>

                  {/* Valeur */}
                  <div>
                    {isNumeric ? (
                      <>
                        <div className="text-lg font-bold text-slate-900">
                          {metric.value}/{metric.max}
                        </div>
                        {/* Barre de progression */}
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mt-1">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className={`h-full ${metric.barColor}`}
                          />
                        </div>
                      </>
                    ) : (
                      <Badge className={`${metric.bgColor} ${metric.color} border-0`}>
                        {metric.value}
                      </Badge>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 italic">
                    {metric.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Footer avec contexte */}
      <div className="pt-2 border-t border-slate-200 text-xs text-slate-500 italic">
        <p>
          {language === 'en'
            ? '📊 Metrics evaluate Druide\'s response quality in real-time'
            : '📊 Les métriques évaluent la qualité de la réponse en temps réel'}
        </p>
      </div>
    </div>
  );
}