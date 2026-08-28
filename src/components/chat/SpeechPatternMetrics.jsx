import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Award, Layers, MessageSquare, TrendingUp, RefreshCw } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/components/utils/LanguageContext";

/**
 * SpeechPatternMetrics: Affiche les métriques agrégées de succès conversationnel
 * - Nombre total de squelettes
 * - Taux de succès moyen
 * - Squelettes de haute qualité (≥ 70%)
 * - Squelettes les plus utilisés
 * - Volume de feedback reçu
 */
export default function SpeechPatternMetrics() {
  const { language } = useLanguage();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const patterns = await base44.entities.SpeechPattern.list('-success_rate', 200);
      const feedbacks = await base44.entities.UserFeedback.list('-created_date', 50);

      const total = patterns.length;
      const highQuality = patterns.filter(p => (p.success_rate || 0) >= 70);
      const avgSuccess = total > 0
        ? Math.round((patterns.reduce((s, p) => s + (p.success_rate || 0), 0) / total) * 10) / 10
        : 0;
      const totalUsage = patterns.reduce((s, p) => s + (p.usage_count || 0), 0);
      const totalFeedback = patterns.reduce((s, p) => s + (p.feedback_count || 0), 0) + feedbacks.length;

      const topPatterns = patterns
        .filter(p => (p.usage_count || 0) > 1)
        .sort((a, b) => (b.usage_count || 0) - (a.usage_count || 0))
        .slice(0, 5);

      setMetrics({
        total,
        highQuality: highQuality.length,
        highQualityPct: total > 0 ? Math.round((highQuality.length / total) * 1000) / 10 : 0,
        avgSuccess,
        totalUsage,
        totalFeedback,
        topPatterns
      });
    } catch (e) {
      console.log('[SpeechPatternMetrics] load error:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="w-5 h-5 border-2 border-slate-200 border-t-purple-600 rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="p-4 text-center text-slate-500 text-sm">
        {language === 'en' ? 'Unable to load metrics' : 'Métriques indisponibles'}
      </div>
    );
  }

  const cards = [
    {
      icon: Layers,
      label: language === 'en' ? 'Skeletons' : 'Squelettes',
      value: metrics.total,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      icon: TrendingUp,
      label: language === 'en' ? 'Avg Success' : 'Succès moyen',
      value: `${metrics.avgSuccess}%`,
      color: metrics.avgSuccess >= 65 ? 'text-emerald-600' : 'text-amber-600',
      bg: metrics.avgSuccess >= 65 ? 'bg-emerald-50' : 'bg-amber-50'
    },
    {
      icon: Award,
      label: language === 'en' ? 'High Quality' : 'Haute qualité',
      value: `${metrics.highQuality} (${metrics.highQualityPct}%)`,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50'
    },
    {
      icon: MessageSquare,
      label: language === 'en' ? 'Feedback' : 'Feedbacks',
      value: metrics.totalFeedback,
      color: 'text-pink-600',
      bg: 'bg-pink-50'
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-purple-600" />
          {language === 'en' ? 'Conversation Success' : 'Succès Conversationnel'}
        </h4>
        <button
          onClick={loadMetrics}
          className="text-slate-400 hover:text-purple-600 transition-colors"
          title={language === 'en' ? 'Refresh' : 'Rafraîchir'}
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-2.5 rounded-xl border border-slate-200 ${card.bg}`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Icon className={`w-3.5 h-3.5 ${card.color}`} />
                <span className="text-[10px] font-medium text-slate-600 uppercase tracking-wide">
                  {card.label}
                </span>
              </div>
              <div className={`text-base font-bold ${card.color}`}>
                {card.value}
              </div>
            </motion.div>
          );
        })}
      </div>

      {metrics.topPatterns.length > 0 && (
        <div className="pt-2 border-t border-slate-200">
          <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide mb-2">
            {language === 'en' ? 'Most Used' : 'Plus utilisés'}
          </p>
          <div className="space-y-1.5">
            {metrics.topPatterns.map((p, i) => (
              <div key={p.id} className="flex items-center justify-between text-xs">
                <span className="text-slate-700 truncate max-w-[60%]" title={p.example_question || p.question_signature}>
                  {i + 1}. {p.example_question || p.question_signature}
                </span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-slate-400">×{p.usage_count || 0}</span>
                  <span className={`font-medium ${(p.success_rate || 0) >= 70 ? 'text-emerald-600' : (p.success_rate || 0) >= 50 ? 'text-amber-600' : 'text-red-500'}`}>
                    {Math.round(p.success_rate || 0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="pt-1 text-[10px] text-slate-400 italic">
        {language === 'en'
          ? '📊 Updated from your feedback — thumbs up/down improve the success rate'
          : '📊 Mis à jour par vos feedbacks — pouce levé/baissé améliore le taux de succès'}
      </p>
    </div>
  );
}