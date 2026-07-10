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
      title: en ? "Smarter Conversations" : "Conversations Plus Intelligentes",
      items: en
        ? ["Deeper, more nuanced answers", "Faster and more relevant responses", "Better understanding of complex questions", "Quality checks on every response"]
        : ["Réponses plus profondes et nuancées", "Réponses plus rapides et pertinentes", "Meilleure compréhension des questions complexes", "Contrôle qualité à chaque réponse"]
    },
    {
      icon: Network,
      color: "text-cyan-600",
      border: "border-cyan-200",
      title: en ? "3D Interactive Visualization" : "Visualisation 3D Interactive",
      items: en
        ? ["Stunning 3D brain visualization", "Live activity as the AI thinks", "Interactive exploration and filters", "Chat and voice directly from the view"]
        : ["Visualisation cérébrale 3D immersive", "Activité en direct pendant que l'IA réfléchit", "Exploration interactive et filtres", "Chat et voix directement depuis la vue"]
    },
    {
      icon: Database,
      color: "text-emerald-600",
      border: "border-emerald-200",
      title: en ? "Always Up to Date" : "Toujours à Jour",
      items: en
        ? ["Continuously improving platform", "Automatic quality and health checks", "Regular feature updates", "Reliable and monitored around the clock"]
        : ["Plateforme en amélioration continue", "Vérifications automatiques de qualité et de santé", "Mises à jour régulières des fonctionnalités", "Fiable et surveillée en permanence"]
    },
    {
      icon: Sparkles,
      color: "text-amber-600",
      border: "border-amber-200",
      title: en ? "An AI That Evolves" : "Une IA Qui Évolue",
      items: en
        ? ["Learns and improves with every interaction", "Adapts to your habits over time", "Creative and reflective by design", "A truly living experience"]
        : ["Apprend et s'améliore à chaque interaction", "S'adapte à vos habitudes avec le temps", "Créative et réflexive par nature", "Une expérience véritablement vivante"]
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
            ? 'Smarter conversations, immersive 3D visualization, continuous improvements and an AI that evolves with you.'
            : 'Conversations plus intelligentes, visualisation 3D immersive, améliorations continues et une IA qui évolue avec vous.'
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