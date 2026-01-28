/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Palette Émotionnelle Complète                              ║
 * ║ Table hexadécimale des émotions du module émotionnel                      ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { 
  Heart, AlertTriangle, Sparkles, Eye, Power, 
  Shield, Zap, Copy, Check, Search, Home
} from "lucide-react";
import { createPageUrl } from "@/utils";

// Palette complète du module émotionnel
const PALETTE_COMPLETE = {
  // Émotions de base
  neutre: { hex: "#94A3B8", rgb: "148, 163, 184", icon: Eye, description: "État par défaut, équilibre" },
  alerte: { hex: "#EF4444", rgb: "239, 68, 68", icon: AlertTriangle, description: "Danger détecté, activation défensive" },
  validation: { hex: "#10B981", rgb: "16, 185, 129", icon: Check, description: "Opportunité confirmée, ouverture" },
  curiosite: { hex: "#3B82F6", rgb: "59, 130, 246", icon: Sparkles, description: "Nouveauté stimulante, exploration" },
  calme: { hex: "#6366F1", rgb: "99, 102, 241", icon: Heart, description: "Stabilité perçue, sérénité" },
  shutdown: { hex: "#6B7280", rgb: "107, 116, 128", icon: Power, description: "Saturation cognitive, retrait" },
  
  // Émotions secondaires (mixages)
  vigilance: { hex: "#F59E0B", rgb: "245, 158, 11", icon: Eye, description: "Alerte + Curiosité (danger + exploration)" },
  confiance: { hex: "#14B8A6", rgb: "20, 184, 166", icon: Shield, description: "Validation + Calme (opportunité + stabilité)" },
  engagement: { hex: "#8B5CF6", rgb: "139, 92, 246", icon: Zap, description: "Curiosité + Validation (exploration + confirmation)" },
  tension: { hex: "#DC2626", rgb: "220, 38, 38", icon: AlertTriangle, description: "Alerte haute + Objectif urgent" },
  
  // États complexes
  incertitude: { hex: "#A78BFA", rgb: "167, 139, 250", icon: Sparkles, description: "Curiosité + Calme (exploration prudente)" },
  determination: { hex: "#059669", rgb: "5, 150, 105", icon: Zap, description: "Validation + Objectif (focus actif)" },
  contemplation: { hex: "#818CF8", rgb: "129, 140, 248", icon: Eye, description: "Calme + Curiosité (observation réflexive)" },
  prudence: { hex: "#F97316", rgb: "249, 115, 22", icon: Shield, description: "Alerte modérée + Stabilité" },
  
  // États extrêmes
  euphorie: { hex: "#22D3EE", rgb: "34, 211, 238", icon: Sparkles, description: "Validation maximale + Nouveauté" },
  panique: { hex: "#991B1B", rgb: "153, 27, 27", icon: AlertTriangle, description: "Danger extrême + Saturation" },
  apaisement: { hex: "#4F46E5", rgb: "79, 70, 229", icon: Heart, description: "Calme profond + Validation" },
  surchauffe: { hex: "#44403C", rgb: "68, 64, 60", icon: Power, description: "Shutdown imminent, épuisement" }
};

// Tendances comportementales
const TENDANCES = {
  neutre: "observer",
  alerte: "protéger",
  validation: "agir",
  curiosite: "explorer",
  calme: "intégrer",
  shutdown: "pause",
  vigilance: "analyser",
  confiance: "collaborer",
  engagement: "créer",
  tension: "agir vite",
  incertitude: "clarifier",
  determination: "persévérer",
  contemplation: "réfléchir",
  prudence: "tester",
  euphorie: "célébrer",
  panique: "fuir",
  apaisement: "savourer",
  surchauffe: "arrêter"
};

export default function EmotionalPalette() {
  const [copiedHex, setCopiedHex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const copyToClipboard = (hex, emotion) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(emotion);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const filteredEmotions = Object.entries(PALETTE_COMPLETE).filter(([emotion, data]) =>
    emotion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    data.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    TENDANCES[emotion].toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-indigo-50/20 page-padding page-padding-y">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.location.href = createPageUrl('ArchitectDashboard')}
            >
              <Home className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 font-display">
                Palette Émotionnelle Complète
              </h1>
              <p className="text-slate-600 mt-1">
                Table hexadécimale des {Object.keys(PALETTE_COMPLETE).length} émotions du module émotionnel
              </p>
            </div>
          </div>
          <Badge className="bg-purple-100 text-purple-700 text-sm px-4 py-2">
            Module Émotionnel v2.0
          </Badge>
        </div>

        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            placeholder="Rechercher une émotion, description ou tendance..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
            <p className="text-2xl font-bold text-purple-700">{Object.keys(PALETTE_COMPLETE).length}</p>
            <p className="text-sm text-slate-600">Émotions totales</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <p className="text-2xl font-bold text-blue-700">6</p>
            <p className="text-sm text-slate-600">Émotions de base</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <p className="text-2xl font-bold text-green-700">8</p>
            <p className="text-sm text-slate-600">Mixages secondaires</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
            <p className="text-2xl font-bold text-orange-700">4</p>
            <p className="text-sm text-slate-600">États extrêmes</p>
          </Card>
        </div>

        {/* Table des émotions */}
        <div className="grid gap-4">
          {filteredEmotions.map(([emotion, data], index) => {
            const Icon = data.icon;
            const tendance = TENDANCES[emotion];
            
            return (
              <motion.div
                key={emotion}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Card className="p-6 hover:shadow-lg transition-all duration-300 border-2 border-slate-200 hover:border-purple-300">
                  <div className="flex items-center gap-6">
                    {/* Couleur visuelle */}
                    <div className="flex-shrink-0">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-24 h-24 rounded-2xl shadow-lg border-4 border-white"
                        style={{ backgroundColor: data.hex }}
                      />
                    </div>

                    {/* Info principale */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="w-6 h-6 text-slate-700" />
                        <h3 className="text-2xl font-bold text-slate-900 capitalize">
                          {emotion}
                        </h3>
                        <Badge className="bg-indigo-100 text-indigo-700">
                          → {tendance}
                        </Badge>
                      </div>
                      <p className="text-slate-600 mb-3">{data.description}</p>
                      
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold text-slate-900">
                            {data.hex}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => copyToClipboard(data.hex, emotion)}
                          >
                            {copiedHex === emotion ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4 text-slate-400" />
                            )}
                          </Button>
                        </div>
                        <div className="text-slate-500">
                          <span className="font-medium">RGB:</span> {data.rgb}
                        </div>
                      </div>
                    </div>

                    {/* Badge catégorie */}
                    <div className="flex-shrink-0">
                      {index < 6 ? (
                        <Badge className="bg-purple-100 text-purple-700">Base</Badge>
                      ) : index < 10 ? (
                        <Badge className="bg-blue-100 text-blue-700">Secondaire</Badge>
                      ) : index < 14 ? (
                        <Badge className="bg-green-100 text-green-700">Complexe</Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-700">Extrême</Badge>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Légende */}
        <Card className="mt-8 p-6 bg-gradient-to-br from-slate-50 to-purple-50/30 border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Légende du système émotionnel</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-700">
            <div>
              <p className="font-medium mb-2">🎨 Catégories:</p>
              <ul className="space-y-1 ml-4">
                <li><strong>Base:</strong> 6 émotions fondamentales</li>
                <li><strong>Secondaire:</strong> Mixages de 2 sources</li>
                <li><strong>Complexe:</strong> États multi-facteurs</li>
                <li><strong>Extrême:</strong> Intensités maximales</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-2">🧠 Génération:</p>
              <ul className="space-y-1 ml-4">
                <li><strong>Contexte:</strong> Danger, opportunité, nouveauté, stabilité</li>
                <li><strong>État interne:</strong> Énergie, charge cognitive, saturation</li>
                <li><strong>Mémoire:</strong> Valence historique, intensité passée</li>
                <li><strong>Objectif:</strong> Urgence, importance, type (exploration/protection)</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}