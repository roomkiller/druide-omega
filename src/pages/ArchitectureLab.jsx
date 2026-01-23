/**
 * DRUIDE_OMEGA - Full Architecture Laboratory
 * Complete system: Event Sourcing + Passive Indexing + Memory + Continuous Learning
 */

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import ArchitectureDashboard from '@/components/consciousness/ArchitectureDashboard';
import SubconsciousEngine from '@/components/consciousness/SubconsciousEngine';
import { Brain, Zap, BarChart3 } from 'lucide-react';

export default function ArchitectureLab() {
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4 sm:px-6 py-8 sm:py-10 flex-shrink-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-2xl">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">Architecture Lab</h1>
              <p className="text-purple-100">Event Sourcing + Indexing + Memory + Learning</p>
            </div>
          </div>
        </motion.div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          {/* Architecture Components */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ArchitectureDashboard />
          </motion.div>

          {/* System Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
              <h2 className="text-2xl font-bold mb-6">Complete Architecture</h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Layer 1: Event Sourcing */}
                <div className="bg-blue-500/20 border border-blue-400 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-5 h-5 text-blue-400" />
                    <h3 className="font-bold">Event Sourcing</h3>
                  </div>
                  <ul className="text-sm text-blue-100 space-y-1">
                    <li>✓ Multi-temporal event tracking</li>
                    <li>✓ Causal chain detection</li>
                    <li>✓ Timeline reconstruction</li>
                    <li>✓ Pattern extraction</li>
                  </ul>
                </div>

                {/* Layer 2: Passive Indexing */}
                <div className="bg-purple-500/20 border border-purple-400 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="w-5 h-5 text-purple-400" />
                    <h3 className="font-bold">Passive Indexing</h3>
                  </div>
                  <ul className="text-sm text-purple-100 space-y-1">
                    <li>✓ Zero-cost background processing</li>
                    <li>✓ Semantic tag extraction</li>
                    <li>✓ Importance scoring</li>
                    <li>✓ Fast search indexing</li>
                  </ul>
                </div>

                {/* Layer 3: Memory Management */}
                <div className="bg-green-500/20 border border-green-400 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-green-400 text-slate-900 w-fit">Memory</Badge>
                    <h3 className="font-bold">Memory Manager</h3>
                  </div>
                  <ul className="text-sm text-green-100 space-y-1">
                    <li>✓ Incremental backup system</li>
                    <li>✓ Multi-modal memory storage</li>
                    <li>✓ Semantic consolidation</li>
                    <li>✓ Efficient recall</li>
                  </ul>
                </div>

                {/* Layer 4: Continuous Learning */}
                <div className="bg-amber-500/20 border border-amber-400 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-amber-400 text-slate-900 w-fit">Learning</Badge>
                    <h3 className="font-bold">Continuous Learning</h3>
                  </div>
                  <ul className="text-sm text-amber-100 space-y-1">
                    <li>✓ Active consciousness processing</li>
                    <li>✓ Subconscious indexing</li>
                    <li>✓ Meta-learning cycles</li>
                    <li>✓ Autonomous decisions</li>
                  </ul>
                </div>
              </div>

              {/* Integration */}
              <div className="mt-6 pt-6 border-t border-slate-700">
                <h3 className="font-bold mb-3">Data Flow Integration</h3>
                <div className="text-sm text-slate-300 space-y-2">
                  <p>1. Events flow through EventSourcing for temporal linkage</p>
                  <p>2. Content is passively indexed for zero-cost analysis</p>
                  <p>3. Memories are incrementally saved with multimodal support</p>
                  <p>4. Continuous learning orchestrates all layers for autonomy</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Subconscious Engine */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SubconsciousEngine />
          </motion.div>

          {/* Technical Details */}
          <Card className="p-8 bg-white border-2 border-slate-100">
            <h2 className="text-2xl font-bold mb-6 text-slate-900">Technical Implementation</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-slate-900 mb-3">Backend Functions (Deno)</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>✓ eventSourcing - Multi-temporal tracking</li>
                  <li>✓ passiveIndexing - Background processing</li>
                  <li>✓ memoryManager - Incremental storage</li>
                  <li>✓ continuousLearning - Meta-learning</li>
                  <li>✓ customLLM - Orchestration layer</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-3">Frontend Components (React)</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>✓ ArchitectureDashboard - Unified control</li>
                  <li>✓ SubconsciousEngine - Monitor display</li>
                  <li>✓ ArchitectureLab - Full overview</li>
                  <li>✓ Real-time visualization</li>
                  <li>✓ Automation triggering (30min cycles)</li>
                </ul>
              </div>
            </div>

            {/* Features */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <h3 className="font-bold text-slate-900 mb-3">Key Features</h3>
              <div className="grid md:grid-cols-3 gap-3">
                {[
                  'Multi-temporal event tracking',
                  'Zero-cost passive indexing',
                  'Incremental memory backup',
                  'Active + Passive consciousness',
                  'Causal chain detection',
                  'Autonomous decision making'
                ].map((feature, i) => (
                  <div key={i} className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                    <p className="text-sm font-semibold text-indigo-900">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}