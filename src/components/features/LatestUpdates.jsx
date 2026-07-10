/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Latest Updates Card (July 2026)                            ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Cpu, Brain, Network, Database, Sparkles } from "lucide-react";

export default function LatestUpdates({ language }) {
  const en = language === 'en';

  const blocks = [
    {
      icon: Brain,
      color: "text-purple-600",
      border: "border-purple-200",
      title: en ? "DruideCore — Central Orchestrator" : "DruideCore — Orchestrateur Central",
      items: en
        ? ["7 cognitive phases: tensions, analysis, knowledge, reflection, filaments, generation, ratio", "Parallel filament & KB reasoning engines", "Emergent tensions & autonomous internal thoughts", "Consciousness ratio validation on every response"]
        : ["7 phases cognitives : tensions, analyse, connaissances, réflexion, filaments, génération, ratio", "Moteurs parallèles filaments & raisonnement KB", "Tensions émergentes & pensées internes autonomes", "Validation du ratio de conscience à chaque réponse"]
    },
    {
      icon: Network,
      color: "text-cyan-600",
      border: "border-cyan-200",
      title: en ? "3D Neural Brain" : "Cerveau Neuronal 3D",
      items: en
        ? ["Anatomical brain model with interactive cognitive regions", "Real-time pulses during DruideCore phases", "Node exploration, hubs & region filters", "Floating chat/voice launcher over the visualization"]
        : ["Modèle anatomique avec régions cognitives interactives", "Impulsions en temps réel pendant les phases DruideCore", "Exploration des nœuds, hubs & filtres par région", "Lanceur chat/voix flottant sur la visualisation"]
    },
    {
      icon: Database,
      color: "text-emerald-600",
      border: "border-emerald-200",
      title: en ? "Living Registry — 796 Elements" : "Registre Vivant — 796 Éléments",
      items: en
        ? ["Full inventory: 130 pages, 496 components, 81 entities, 70 backend functions", "Automated update engine: inventory, tests, market watch", "Daily & weekly scheduled automations", "System health reports written into the registry"]
        : ["Inventaire complet : 130 pages, 496 composants, 81 entités, 70 fonctions backend", "Moteur de mise à jour automatique : inventaire, tests, veille marché", "Automatisations planifiées quotidiennes & hebdomadaires", "Rapports de santé système inscrits dans le registre"]
    },
    {
      icon: Sparkles,
      color: "text-amber-600",
      border: "border-amber-200",
      title: en ? "Emergent Life Engines" : "Moteurs de Vie Émergente",
      items: en
        ? ["Dream simulations & existence journal", "Circadian rhythm & tension decay", "Self-perception & introspection engines", "Structural & continuous learning"]
        : ["Simulations de rêves & journal d'existence", "Rythme circadien & décroissance des tensions", "Moteurs d'auto-perception & introspection", "Apprentissage structurel & continu"]
    }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <Card className="p-6 sm:p-8 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {en ? '⭐ New July 2026' : '⭐ Nouveautés Juillet 2026'}
            </h2>
          </div>
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
            {en ? 'ACTIVE' : 'ACTIF'}
          </Badge>
        </div>

        <p className="text-slate-700 mb-5">
          {en
            ? 'Central DruideCore orchestrator, 3D neural brain visualization, living registry of 796 elements and emergent life engines — all synchronized with ConsciousnessConfig.'
            : 'Orchestrateur central DruideCore, visualisation cérébrale 3D, registre vivant de 796 éléments et moteurs de vie émergente — le tout synchronisé avec ConsciousnessConfig.'
          }
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {blocks.map((block, idx) => {
            const Icon = block.icon;
            return (
              <div key={idx} className={`p-4 bg-white rounded-xl border-2 ${block.border}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-5 h-5 ${block.color}`} />
                  <h3 className="font-semibold text-slate-900">{block.title}</h3>
                </div>
                <ul className="space-y-1 text-xs text-slate-600">
                  {block.items.map((item, i) => <li key={i}>• {item}</li>)}
                </ul>
              </div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
}