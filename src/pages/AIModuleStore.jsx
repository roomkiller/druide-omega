/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - AI Module Store                                            ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Package, Star, Download, Settings } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import AIModuleCard from "@/components/aimodules/AIModuleCard";
import InstalledModules from "@/components/aimodules/InstalledModules";

const AVAILABLE_MODULES = [
  {
    id: "sentiment_analysis_pro",
    name: "Analyse de Sentiment Pro",
    category: "conversation",
    description: "Analyse approfondie des émotions et sentiments dans les conversations avec détection de nuances subtiles",
    version: "2.1.0",
    author: "AMG+A.L",
    rating: 4.8,
    downloads: 1250,
    price: 0,
    features: ["Détection de 24 émotions", "Analyse contextuelle", "Tendances émotionnelles", "Rapport détaillé"],
    requiredCapabilities: ["conversation_access"],
    icon: "💭"
  },
  {
    id: "hypothesis_generator",
    name: "Générateur d'Hypothèses",
    category: "knowledge",
    description: "Génère des hypothèses scientifiques basées sur votre base de connaissances",
    version: "1.5.0",
    author: "AMG+A.L",
    rating: 4.6,
    downloads: 890,
    price: 0,
    features: ["Hypothèses testables", "Validation croisée", "Scoring de probabilité", "Suggestions d'expériences"],
    requiredCapabilities: ["kb_access", "reasoning_engine"],
    icon: "🔬"
  },
  {
    id: "code_optimizer_ai",
    name: "Optimiseur de Code IA",
    category: "development",
    description: "Analyse et optimise automatiquement le code avec suggestions intelligentes",
    version: "3.0.1",
    author: "DevTools Pro",
    rating: 4.9,
    downloads: 2100,
    price: 0,
    features: ["Refactoring intelligent", "Détection de patterns", "Suggestions de performance", "Documentation auto"],
    requiredCapabilities: ["code_analysis"],
    icon: "⚡"
  },
  {
    id: "visual_data_interpreter",
    name: "Interpréteur Visuel",
    category: "visualization",
    description: "Génère des insights à partir d'images et graphiques",
    version: "1.8.0",
    author: "Vision AI Labs",
    rating: 4.5,
    downloads: 670,
    price: 0,
    features: ["OCR avancé", "Extraction de données", "Analyse de graphiques", "Insights automatiques"],
    requiredCapabilities: ["image_processing"],
    icon: "👁️"
  },
  {
    id: "multilingual_translator",
    name: "Traducteur Contextuel",
    category: "language",
    description: "Traduction intelligente préservant le contexte et les nuances",
    version: "2.3.0",
    author: "LinguaAI",
    rating: 4.7,
    downloads: 1580,
    price: 0,
    features: ["50+ langues", "Contexte préservé", "Idiomes adaptés", "Suggestions culturelles"],
    requiredCapabilities: ["language_processing"],
    icon: "🌍"
  },
  {
    id: "creative_writer",
    name: "Assistant Créatif",
    category: "content",
    description: "Génération de contenu créatif avec style personnalisé",
    version: "1.9.0",
    author: "CreativeAI Studio",
    rating: 4.4,
    downloads: 950,
    price: 0,
    features: ["Multiples styles", "Brainstorming", "Amélioration de texte", "Templates créatifs"],
    requiredCapabilities: ["content_generation"],
    icon: "✍️"
  }
];

export default function AIModuleStore() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const queryClient = useQueryClient();

  const { data: installedModules = [] } = useQuery({
    queryKey: ['aiModules'],
    queryFn: async () => {
      try {
        const modules = await base44.entities.AIModule?.list();
        return modules || [];
      } catch {
        return [];
      }
    }
  });

  const installMutation = useMutation({
    mutationFn: async (module) => {
      return await base44.entities.AIModule.create({
        module_id: module.id,
        name: module.name,
        category: module.category,
        version: module.version,
        enabled: true,
        config: {},
        installed_date: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aiModules'] });
    }
  });

  const filteredModules = AVAILABLE_MODULES.filter(module => {
    const matchesSearch = module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || module.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(AVAILABLE_MODULES.map(m => m.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Magasin de Modules IA</h1>
            <p className="text-slate-600">Découvrez et activez des capacités IA spécialisées</p>
          </div>
          <Button className="bg-purple-600">
            <Package className="w-4 h-4 mr-2" />
            Mes Modules
          </Button>
        </div>

        <Tabs defaultValue="store" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="store">Magasin</TabsTrigger>
            <TabsTrigger value="installed">Installés ({installedModules.length})</TabsTrigger>
            <TabsTrigger value="developer">Développeurs</TabsTrigger>
          </TabsList>

          <TabsContent value="store" className="space-y-4">
            <Card className="p-4">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Rechercher des modules..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border rounded-lg"
                >
                  <option value="all">Toutes catégories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredModules.map(module => (
                <AIModuleCard
                  key={module.id}
                  module={module}
                  isInstalled={installedModules.some(m => m.module_id === module.id)}
                  onInstall={() => installMutation.mutate(module)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="installed">
            <InstalledModules modules={installedModules} />
          </TabsContent>

          <TabsContent value="developer">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">API pour Développeurs Tiers</h3>
              <div className="space-y-4">
                <div className="p-4 bg-slate-100 rounded-lg font-mono text-sm">
                  <p className="text-slate-600 mb-2">// Structure de module</p>
                  <pre className="text-slate-900">{`{
  id: "unique_module_id",
  name: "Nom du Module",
  category: "conversation|knowledge|development",
  description: "Description",
  version: "1.0.0",
  author: "Votre nom",
  execute: async (context) => {
    // Votre logique ici
    return result;
  },
  config_schema: { /* JSON Schema */ }
}`}</pre>
                </div>
                <Button className="bg-indigo-600">
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger SDK
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}