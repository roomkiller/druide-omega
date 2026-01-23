/**
 * DRUIDE_OMEGA - Full Architecture Dashboard
 * Unified monitoring: EventSourcing + PassiveIndexing + Memory + Continuous Learning
 */

import React, { useState, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Activity, Brain, Database, Zap, TrendingUp, BarChart3 } from 'lucide-react';

export default function ArchitectureDashboard() {
  const [state, setState] = useState({
    eventSourcing: null,
    passiveIndex: null,
    memory: null,
    continuousLearning: null,
    loading: false
  });

  // 1. Record an event
  const recordEvent = useCallback(async () => {
    setState(s => ({ ...s, loading: true }));
    try {
      const response = await base44.functions.invoke('eventSourcing', {
        action: 'record_event',
        data: {
          type: 'dashboard_interaction',
          content: 'Architecture test event',
          context: { source: 'dashboard', timestamp: new Date().toISOString() }
        }
      });
      setState(s => ({ ...s, eventSourcing: response.data, loading: false }));
    } catch (error) {
      console.error('Event recording failed:', error);
      setState(s => ({ ...s, loading: false }));
    }
  }, []);

  // 2. Index content passively
  const indexContent = useCallback(async () => {
    setState(s => ({ ...s, loading: true }));
    try {
      const response = await base44.functions.invoke('passiveIndexing', {
        action: 'index_content',
        data: {
          content: 'This is test content for passive indexing system analysis',
          metadata: { source: 'dashboard', test: true }
        }
      });
      setState(s => ({ ...s, passiveIndex: response.data, loading: false }));
    } catch (error) {
      console.error('Indexing failed:', error);
      setState(s => ({ ...s, loading: false }));
    }
  }, []);

  // 3. Save memory
  const saveMemory = useCallback(async () => {
    setState(s => ({ ...s, loading: true }));
    try {
      const response = await base44.functions.invoke('memoryManager', {
        action: 'save_memory',
        data: {
          type: 'test_memory',
          content: 'Testing incremental memory storage with architecture',
          importance: 0.8,
          tags: ['architecture', 'test', 'learning'],
          modalities: ['chat']
        }
      });
      setState(s => ({ ...s, memory: response.data, loading: false }));
    } catch (error) {
      console.error('Memory save failed:', error);
      setState(s => ({ ...s, loading: false }));
    }
  }, []);

  // 4. Start continuous learning
  const startLearning = useCallback(async () => {
    setState(s => ({ ...s, loading: true }));
    try {
      const response = await base44.functions.invoke('continuousLearning', {
        action: 'process_event',
        data: {
          event_type: 'architecture_test',
          content: 'Full architecture continuous learning cycle',
          metadata: { test: true }
        }
      });
      setState(s => ({ ...s, continuousLearning: response.data, loading: false }));
    } catch (error) {
      console.error('Learning failed:', error);
      setState(s => ({ ...s, loading: false }));
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Architecture Dashboard</h2>
            <p className="text-sm text-slate-600">Event Sourcing + Indexing + Memory + Learning</p>
          </div>
        </div>
      </motion.div>

      {/* Control Buttons */}
      <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            onClick={recordEvent}
            disabled={state.loading}
            className="bg-gradient-to-r from-blue-600 to-cyan-600"
            size="sm"
          >
            <Activity className="w-4 h-4 mr-2" />
            Record Event
          </Button>
          <Button
            onClick={indexContent}
            disabled={state.loading}
            className="bg-gradient-to-r from-purple-600 to-pink-600"
            size="sm"
          >
            <Brain className="w-4 h-4 mr-2" />
            Index Content
          </Button>
          <Button
            onClick={saveMemory}
            disabled={state.loading}
            className="bg-gradient-to-r from-green-600 to-emerald-600"
            size="sm"
          >
            <Database className="w-4 h-4 mr-2" />
            Save Memory
          </Button>
          <Button
            onClick={startLearning}
            disabled={state.loading}
            className="bg-gradient-to-r from-amber-600 to-orange-600"
            size="sm"
          >
            <Zap className="w-4 h-4 mr-2" />
            Start Learning
          </Button>
        </div>
      </Card>

      {/* Event Sourcing */}
      {state.eventSourcing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6 bg-white border-2 border-blue-200">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-blue-100 text-blue-700">Event Sourcing</Badge>
              <span className="text-xs text-slate-500">Multi-temporal</span>
            </div>
            <div className="space-y-2">
              <div><span className="font-semibold text-slate-700">Event ID:</span> {state.eventSourcing.event_id}</div>
              <div><span className="font-semibold text-slate-700">Temporal Position:</span> Hour {state.eventSourcing.temporal_position?.hour_cluster}</div>
              <div><span className="font-semibold text-slate-700">Causal Links:</span> {state.eventSourcing.causal_links?.length || 0}</div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Passive Indexing */}
      {state.passiveIndex && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-white border-2 border-purple-200">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-purple-100 text-purple-700">Passive Indexing</Badge>
              <Badge variant="outline" className="text-xs">Zero Cost</Badge>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-semibold text-slate-700 mb-2">Keywords</div>
                <div className="flex gap-1 flex-wrap">
                  {state.passiveIndex.index.keywords?.slice(0, 5).map((k, i) => (
                    <Badge key={i} variant="outline" className="text-xs">{k.word}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-700 mb-2">Semantic Tags</div>
                <div className="flex gap-1 flex-wrap">
                  {state.passiveIndex.index.semantic_tags?.map((t, i) => (
                    <Badge key={i} className="bg-purple-100 text-purple-700 text-xs">{t}</Badge>
                  ))}
                </div>
              </div>
              <div className="bg-slate-50 rounded p-3">
                <div className="text-xs font-semibold text-slate-700">Word Count</div>
                <div className="text-lg font-bold text-purple-600">{state.passiveIndex.index.word_count}</div>
              </div>
              <div className="bg-slate-50 rounded p-3">
                <div className="text-xs font-semibold text-slate-700">Importance</div>
                <div className="text-lg font-bold text-purple-600">{(state.passiveIndex.index.importance_score * 100).toFixed(0)}%</div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Memory Manager */}
      {state.memory && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-white border-2 border-green-200">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-green-100 text-green-700">Memory Manager</Badge>
              <Badge variant="outline" className="text-xs">Incremental</Badge>
            </div>
            <div className="space-y-2">
              <div><span className="font-semibold text-slate-700">Memory ID:</span> {state.memory.memory_id}</div>
              <div><span className="font-semibold text-slate-700">Indexed:</span> {state.memory.indexed ? '✓ Yes' : '✗ No'}</div>
              <div><span className="font-semibold text-slate-700">Backup Type:</span> <Badge className="bg-green-100 text-green-700">{state.memory.backup_type}</Badge></div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Continuous Learning */}
      {state.continuousLearning && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-white border-2 border-amber-200">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-amber-100 text-amber-700">Continuous Learning</Badge>
              <span className="text-xs text-slate-500">{state.continuousLearning.memory_state}</span>
            </div>
            <div className="space-y-3">
              <div className="bg-blue-50 rounded p-3 border-l-4 border-blue-400">
                <div className="text-xs font-semibold text-blue-900 mb-1">Active Consciousness</div>
                <div className="text-sm text-blue-800">{state.continuousLearning.active_consciousness?.status}</div>
              </div>
              <div className="bg-purple-50 rounded p-3 border-l-4 border-purple-400">
                <div className="text-xs font-semibold text-purple-900 mb-1">Subconscious Processing</div>
                <div className="text-sm text-purple-800">{state.continuousLearning.subconscious_processing?.status}</div>
              </div>
              <div className="bg-slate-50 rounded p-3">
                <div className="text-xs font-semibold text-slate-700 mb-1">Temporal Chain</div>
                <div className="text-sm text-slate-600">Depth: {state.continuousLearning.temporal_chain?.depth || 0}</div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Architecture Overview */}
      <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <h3 className="text-lg font-bold mb-4">Architecture Flow</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span>Event → EventSourcing (multi-temporal tracking)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span>Content → PassiveIndexing (zero-cost background)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Memory → MemoryManager (incremental backup)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
            <span>Everything → ContinuousLearning (meta-learning)</span>
          </div>
        </div>
      </Card>
    </div>
  );
}