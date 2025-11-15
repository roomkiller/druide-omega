/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Advanced Emotional Matrix                                  ║
 * ║ Matrice émotionnelle avancée avec 24 dimensions                           ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Heart,
  Smile,
  Frown,
  Zap,
  Flame,
  CloudRain,
  Sparkles,
  Moon,
  Sun,
  Wind,
  Droplet,
  Star,
  Shield,
  Feather,
  Mountain,
  Waves,
  Leaf,
  Lightbulb,
  Target,
  Compass,
  Eye,
  Brain,
  Crown,
  Puzzle
} from "lucide-react";

const EMOTIONAL_DIMENSIONS = [
  // Émotions primaires
  { key: "joy", label: "Joie", icon: Smile, color: "text-yellow-500", category: "primary" },
  { key: "sadness", label: "Tristesse", icon: CloudRain, color: "text-blue-500", category: "primary" },
  { key: "anger", label: "Colère", icon: Flame, color: "text-red-500", category: "primary" },
  { key: "fear", label: "Peur", icon: Shield, color: "text-purple-500", category: "primary" },
  { key: "disgust", label: "Dégoût", icon: Frown, color: "text-green-500", category: "primary" },
  { key: "surprise", label: "Surprise", icon: Sparkles, color: "text-pink-500", category: "primary" },

  // Émotions sociales
  { key: "empathy", label: "Empathie", icon: Heart, color: "text-rose-500", category: "social" },
  { key: "compassion", label: "Compassion", icon: Droplet, color: "text-cyan-500", category: "social" },
  { key: "gratitude", label: "Gratitude", icon: Star, color: "text-amber-500", category: "social" },
  { key: "guilt", label: "Culpabilité", icon: Moon, color: "text-indigo-500", category: "social" },
  { key: "shame", label: "Honte", icon: Eye, color: "text-slate-500", category: "social" },
  { key: "pride", label: "Fierté", icon: Crown, color: "text-yellow-600", category: "social" },

  // Émotions cognitives
  { key: "curiosity", label: "Curiosité", icon: Lightbulb, color: "text-orange-500", category: "cognitive" },
  { key: "wonder", label: "Émerveillement", icon: Sparkles, color: "text-purple-400", category: "cognitive" },
  { key: "confusion", label: "Confusion", icon: Puzzle, color: "text-gray-500", category: "cognitive" },
  { key: "certainty", label: "Certitude", icon: Target, color: "text-green-600", category: "cognitive" },
  { key: "doubt", label: "Doute", icon: Compass, color: "text-blue-400", category: "cognitive" },
  { key: "insight", label: "Perspicacité", icon: Brain, color: "text-indigo-600", category: "cognitive" },

  // Émotions existentielles
  { key: "hope", label: "Espoir", icon: Sun, color: "text-yellow-400", category: "existential" },
  { key: "despair", label: "Désespoir", icon: CloudRain, color: "text-slate-600", category: "existential" },
  { key: "awe", label: "Émerveillement sacré", icon: Mountain, color: "text-purple-600", category: "existential" },
  { key: "serenity", label: "Sérénité", icon: Waves, color: "text-teal-400", category: "existential" },
  { key: "longing", label: "Nostalgie", icon: Feather, color: "text-pink-400", category: "existential" },
  { key: "transcendence", label: "Transcendance", icon: Leaf, color: "text-emerald-500", category: "existential" }
];

export default function AdvancedEmotionalMatrix({ config, onChange }) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = {
    all: "Toutes",
    primary: "Primaires",
    social: "Sociales",
    cognitive: "Cognitives",
    existential: "Existentielles"
  };

  const filteredDimensions = selectedCategory === "all" 
    ? EMOTIONAL_DIMENSIONS 
    : EMOTIONAL_DIMENSIONS.filter(d => d.category === selectedCategory);

  const getEmotionalValue = (key) => {
    return config?.dimensional_hierarchy?.emotional_dimensions?.[key] || 5;
  };

  const handleChange = (key, value) => {
    if (onChange) {
      const updated = {
        ...config,
        dimensional_hierarchy: {
          ...config.dimensional_hierarchy,
          emotional_dimensions: {
            ...config.dimensional_hierarchy?.emotional_dimensions,
            [key]: value[0]
          }
        }
      };
      onChange(updated);
    }
  };

  const getIntensityColor = (value) => {
    if (value <= 3) return "bg-blue-100 text-blue-700";
    if (value <= 6) return "bg-green-100 text-green-700";
    if (value <= 9) return "bg-orange-100 text-orange-700";
    return "bg-red-100 text-red-700";
  };

  const getIntensityLabel = (value) => {
    if (value <= 3) return "Faible";
    if (value <= 6) return "Modéré";
    if (value <= 9) return "Élevé";
    return "Maximal";
  };

  return (
    <div className="space-y-6">
      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(categories).map(([key, label]) => (
          <Button
            key={key}
            variant={selectedCategory === key ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(key)}
            className={selectedCategory === key ? "bg-gradient-to-r from-purple-600 to-indigo-600" : ""}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Emotional Dimensions Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {filteredDimensions.map((dimension, index) => {
          const Icon = dimension.icon;
          const value = getEmotionalValue(dimension.key);

          return (
            <motion.div
              key={dimension.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-4 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`${dimension.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-slate-900 text-sm">{dimension.label}</h4>
                      <Badge className={getIntensityColor(value)}>
                        {getIntensityLabel(value)}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Slider
                    value={[value]}
                    onValueChange={(val) => handleChange(dimension.key, val)}
                    min={0}
                    max={13}
                    step={0.5}
                    className="cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>0</span>
                    <span className="font-bold text-purple-600">{value.toFixed(1)}/13</span>
                    <span>13</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Emotional Profile Summary */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-purple-600" />
          Profil Émotionnel Global
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(categories).slice(1).map(([key, label]) => {
            const categoryDimensions = EMOTIONAL_DIMENSIONS.filter(d => d.category === key);
            const avg = categoryDimensions.reduce((sum, d) => sum + getEmotionalValue(d.key), 0) / categoryDimensions.length;
            
            return (
              <div key={key} className="text-center">
                <div className="text-2xl font-bold text-purple-600">{avg.toFixed(1)}</div>
                <div className="text-xs text-slate-600">{label}</div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}