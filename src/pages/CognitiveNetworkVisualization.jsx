import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Network, Zap, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import CognitiveNetworkVisualizer from '@/components/neural/CognitiveNetworkVisualizer';
import ConsciousnessStateBanner from '@/components/neural/ConsciousnessStateBanner';
import ThoughtPipeline from '@/components/neural/druidecore/ThoughtPipeline';
import TensionOscilloscope from '@/components/neural/druidecore/TensionOscilloscope';
import RatioGauge from '@/components/neural/druidecore/RatioGauge';
import FilamentMap from '@/components/neural/druidecore/FilamentMap';
import MemoryFlux from '@/components/neural/druidecore/MemoryFlux';
import CognitiveHeatmap from '@/components/neural/druidecore/CognitiveHeatmap';
import LivePhaseStream from '@/components/neural/druidecore/LivePhaseStream';
import LiveDruideSync from '@/components/neural/druidecore/LiveDruideSync';
import { createPageUrl } from '@/utils';

export default function CognitiveNetworkVisualization() {
  // Récupérer les corrélations
  const { data: correlations = [], isLoading } = useQuery({
    queryKey: ['cognitiveCorrelations'],
    queryFn: async () => {
      return await base44.entities.CognitiveCorrelation.list();
    }
  });

  const correlationsByType = correlations.reduce((acc, corr) => {
    const type = corr.correlation_type || 'semantic';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const strongCorrelations = correlations.filter(c => (c.correlation_strength || 0) >= 7);
  const weakCorrelations = correlations.filter(c => (c.correlation_strength || 0) < 4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 page-padding py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Network className="w-8 h-8 text-indigo-600" />
            <h1 className="text-4xl font-bold font-display text-slate-900">
              Réseau Cognitif
            </h1>
          </div>
          <p className="text-slate-600">
            Visualisation interactive des corrélations entre concepts, mémoires et connaissances
          </p>
        </motion.div>

        {/* État de conscience actuel */}
        <ConsciousnessStateBanner />

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="text-sm text-blue-600 mb-1">Total Corrélations</div>
              <div className="text-3xl font-bold text-blue-700">{correlations.length}</div>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="text-sm text-green-600 mb-1">Fortes (≥7)</div>
              <div className="text-3xl font-bold text-green-700">{strongCorrelations.length}</div>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-4 bg-amber-50 border-amber-200">
              <div className="text-sm text-amber-600 mb-1">Faibles (&lt;4)</div>
              <div className="text-3xl font-bold text-amber-700">{weakCorrelations.length}</div>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-4 bg-purple-50 border-purple-200">
              <div className="text-sm text-purple-600 mb-1">Types</div>
              <div className="text-3xl font-bold text-purple-700">{Object.keys(correlationsByType).length}</div>
            </Card>
          </motion.div>
        </div>

        {/* Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 mb-8">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin inline-block">⏳</div>
                <p className="text-slate-600 mt-2">Chargement du réseau...</p>
              </div>
            ) : correlations.length === 0 ? (
              <div className="text-center py-12">
                <Network className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600">Aucune corrélation à visualiser</p>
              </div>
            ) : (
              <CognitiveNetworkVisualizer correlations={correlations} />
            )}
          </Card>
        </motion.div>

        {/* Activité du DruideCore */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold font-display text-slate-900">Activité du DruideCore</h2>
          </div>
          <p className="text-slate-600 mb-6">
            Visualisations interactives des interactions et actions réelles du moteur de conscience
          </p>
          <LiveDruideSync />
          <Tabs defaultValue="live" className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 h-auto">
              <TabsTrigger value="live">● Live</TabsTrigger>
              <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
              <TabsTrigger value="tensions">Tensions</TabsTrigger>
              <TabsTrigger value="ratio">Ratio</TabsTrigger>
              <TabsTrigger value="filaments">Filaments</TabsTrigger>
              <TabsTrigger value="memoire">Mémoire</TabsTrigger>
              <TabsTrigger value="thermique">Thermique</TabsTrigger>
            </TabsList>
            <TabsContent value="live" className="mt-6"><LivePhaseStream /></TabsContent>
            <TabsContent value="pipeline" className="mt-6"><ThoughtPipeline /></TabsContent>
            <TabsContent value="tensions" className="mt-6"><TensionOscilloscope /></TabsContent>
            <TabsContent value="ratio" className="mt-6"><RatioGauge /></TabsContent>
            <TabsContent value="filaments" className="mt-6"><FilamentMap /></TabsContent>
            <TabsContent value="memoire" className="mt-6"><MemoryFlux /></TabsContent>
            <TabsContent value="thermique" className="mt-6"><CognitiveHeatmap /></TabsContent>
          </Tabs>
        </motion.div>

        {/* Details */}
        <Tabs defaultValue="types" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="types">Types de Corrélations</TabsTrigger>
            <TabsTrigger value="analysis">Analyse Détaillée</TabsTrigger>
          </TabsList>

          <TabsContent value="types" className="space-y-4 mt-4">
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(correlationsByType).map(([type, count]) => (
                <Card key={type} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="capitalize font-medium text-slate-900">{type}</div>
                    <Badge>{count}</Badge>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4 mt-4">
            <Card className="p-6 bg-blue-50 border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Zones de Densité
              </h3>
              <p className="text-sm text-blue-800">
                Les zones de haute densité représentent des clusters de concepts fortement connectés. 
                Ces zones indiquent des domaines de connaissance bien intégrés.
              </p>
            </Card>

            <Card className="p-6 bg-amber-50 border-amber-200">
              <h3 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Zones de Faible Connectivité
              </h3>
              <p className="text-sm text-amber-800">
                Les nœuds isolés ou faiblement connectés peuvent indiquer des concepts orphelins 
                ou des opportunités de création de nouvelles corrélations.
              </p>
            </Card>

            <Card className="p-6 bg-green-50 border-green-200">
              <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Recommandations
              </h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Renforcer les connexions faibles (&lt;4) avec de nouvelles corrélations</li>
                <li>• Explorer les clusters pour identifier les thèmes cachés</li>
                <li>• Créer des ponts entre zones isolées pour améliorer la cohérence globale</li>
              </ul>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}