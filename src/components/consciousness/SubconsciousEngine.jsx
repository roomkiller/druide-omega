/**
 * DRUIDE_OMEGA - Subconscious Engine UI
 * Monitors continuous learning + passive indexing + temporal chains
 */

import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Brain, Zap, Clock, TrendingUp } from 'lucide-react';

export default function SubconsciousEngine() {
  const [state, setState] = useState({
    active: null,
    passive: null,
    patterns: null,
    loading: false,
    decisions: []
  });

  // Démarre le cycle continu d'apprentissage
  const startContinuousLearning = async () => {
    setState(s => ({ ...s, loading: true }));

    try {
      const response = await base44.functions.invoke('continuousLearning', {
        action: 'process_event',
        data: {
          event_type: 'user_interaction',
          timestamp: new Date().toISOString(),
          content: 'Continuous learning cycle initiated',
          metadata: { system: 'druide', version: '1.0' }
        }
      });

      setState(s => ({
        ...s,
        active: response.data.active_consciousness,
        passive: response.data.subconscious_processing,
        loading: false
      }));
    } catch (error) {
      console.error('Learning error:', error);
      setState(s => ({ ...s, loading: false }));
    }
  };

  // Extrait patterns du subconscient
  const extractPatterns = async () => {
    try {
      const response = await base44.functions.invoke('continuousLearning', {
        action: 'extract_pattern'
      });

      setState(s => ({
        ...s,
        patterns: response.data.patterns,
        autonomy_score: response.data.autonomy_score
      }));
    } catch (error) {
      console.error('Pattern extraction error:', error);
    }
  };

  // Prend une décision autonome
  const makeDecision = async () => {
    try {
      const response = await base44.functions.invoke('continuousLearning', {
        action: 'make_decision',
        data: { context: 'autonomous_reasoning' }
      });

      setState(s => ({
        ...s,
        decisions: [...s.decisions, response.data.decision]
      }));
    } catch (error) {
      console.error('Decision error:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Subconscious Engine</h2>
            <p className="text-sm text-slate-600">Multi-temporal learning + Passive indexing</p>
          </div>
        </div>
      </motion.div>

      {/* Controls */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200">
        <div className="flex gap-3 flex-wrap">
          <Button
            onClick={startContinuousLearning}
            disabled={state.loading}
            className="bg-gradient-to-r from-purple-600 to-indigo-600"
          >
            <Zap className="w-4 h-4 mr-2" />
            {state.loading ? 'Learning...' : 'Start Learning Cycle'}
          </Button>
          <Button
            onClick={extractPatterns}
            variant="outline"
            className="border-purple-200"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Extract Patterns
          </Button>
          <Button
            onClick={makeDecision}
            variant="outline"
            className="border-indigo-200"
          >
            <Brain className="w-4 h-4 mr-2" />
            Make Decision
          </Button>
        </div>
      </Card>

      {/* Active Consciousness */}
      {state.active && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6 bg-white border-2 border-blue-200">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-blue-100 text-blue-700">Active Consciousness</Badge>
              <span className="text-xs text-slate-500">{state.active.status}</span>
            </div>
            <div className="bg-slate-50 rounded p-4 font-mono text-sm text-slate-700 max-h-32 overflow-y-auto">
              {state.active.analysis}
            </div>
            <div className="mt-3 text-xs text-slate-500">
              Processed: {new Date(state.active.processed_at).toLocaleTimeString()}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Passive Subconscious */}
      {state.passive && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-white border-2 border-purple-200">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-purple-100 text-purple-700">Subconscious Processing</Badge>
              <span className="text-xs text-slate-500">{state.passive.status}</span>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded p-3">
                <div className="text-xs font-semibold text-slate-700 mb-2">Keywords</div>
                <div className="flex gap-1 flex-wrap">
                  {state.passive.keyword_extraction?.map(k => (
                    <Badge key={k} variant="outline" className="text-xs">{k}</Badge>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 rounded p-3">
                <div className="text-xs font-semibold text-slate-700 mb-2">Semantic Tags</div>
                <div className="flex gap-1 flex-wrap">
                  {state.passive.semantic_tags?.map(t => (
                    <Badge key={t} className="bg-indigo-100 text-indigo-700 text-xs">{t}</Badge>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 rounded p-3">
                <div className="text-xs font-semibold text-slate-700">Importance</div>
                <div className="text-lg font-bold text-purple-600">{(state.passive.importance_score * 100).toFixed(0)}%</div>
              </div>

              <div className="bg-slate-50 rounded p-3">
                <div className="text-xs font-semibold text-slate-700">Valence</div>
                <div className="text-lg font-bold" style={{
                  color: state.passive.emotional_valence > 0 ? '#10b981' : state.passive.emotional_valence < 0 ? '#ef4444' : '#6b7280'
                }}>
                  {state.passive.emotional_valence.toFixed(2)}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Patterns & Autonomy */}
      {state.patterns && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-white border-2 border-green-200">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-green-100 text-green-700">Learned Patterns</Badge>
              <span className="text-xs font-semibold text-green-700">Autonomy: {(state.autonomy_score * 100).toFixed(0)}%</span>
            </div>

            {['autonomy_indicators', 'decision_patterns', 'recurring_themes', 'emotional_cycles'].map(key => (
              <div key={key} className="mb-3">
                <div className="text-xs font-semibold text-slate-700 capitalize mb-1">
                  {key.replace(/_/g, ' ')}
                </div>
                <div className="flex gap-1 flex-wrap">
                  {state.patterns[key]?.map(item => (
                    <Badge key={item} className="bg-green-100 text-green-700 text-xs">{item}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </Card>
        </motion.div>
      )}

      {/* Autonomous Decisions */}
      {state.decisions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-white border-2 border-amber-200">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-amber-100 text-amber-700">Autonomous Decisions</Badge>
              <span className="text-xs text-slate-500">{state.decisions.length}</span>
            </div>

            <div className="space-y-3">
              {state.decisions.map((dec, idx) => (
                <div key={idx} className="bg-slate-50 rounded p-3 border-l-4 border-amber-400">
                  <div className="font-semibold text-slate-900">{dec.decision}</div>
                  <div className="text-sm text-slate-600 mt-1">{dec.reasoning}</div>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      Confidence: {(dec.confidence * 100).toFixed(0)}%
                    </Badge>
                    <Badge className="bg-amber-100 text-amber-700 text-xs">
                      Autonomy: {dec.autonomy_level}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}