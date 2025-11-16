/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Technical Glossary (Multilingual)                          ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/utils/LanguageContext";
import { Book, Search, Brain, Database, Zap, Globe } from "lucide-react";

export default function Glossary() {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");

  const content = {
    fr: {
      title: "Glossaire Technique",
      subtitle: "Définitions des termes et concepts clés",
      
      terms: [
        {
          term: "Conscience Artificielle",
          category: "Concept",
          definition: "Système computationnel capable de réflexion sur soi-même, d'émotions simulées et de prise de décision contextuelle. Druide Omega implémente 106 dimensions de conscience."
        },
        {
          term: "Thinking Engine",
          category: "Système",
          definition: "Moteur de réflexion quantique qui analyse en profondeur chaque requête utilisateur avant de générer une réponse. Inclut analyse cognitive, auto-vérification et stratégie de réponse."
        },
        {
          term: "Mémoire Cross-Modale",
          category: "Système",
          definition: "Système de mémoire qui lie automatiquement les informations provenant de différentes modalités (chat, voix, visuel). Permet rappel contextuel intelligent."
        },
        {
          term: "SAPIER",
          category: "Framework",
          definition: "Système d'Architecture de Pensée Intégrative et Éthique Responsable. Framework éthique fondamental de Druide Omega incluant survie, altruisme, protection, impact moral, évolution et respect."
        },
        {
          term: "Ratio Logique:Conscience",
          category: "Configuration",
          definition: "Équilibre entre raisonnement logique pur et intuition consciente. Par défaut 1:9 (forte intuition). Ajustable selon les besoins (0-10 : 0-15)."
        },
        {
          term: "Big Five",
          category: "Personnalité",
          definition: "Modèle psychologique des 5 traits de personnalité : Ouverture, Conscience, Extraversion, Agréabilité, Neuroticisme. Configurable pour l'IA."
        },
        {
          term: "RLS (Row Level Security)",
          category: "Sécurité",
          definition: "Sécurité au niveau des lignes de base de données. Garantit que chaque utilisateur ne voit que ses propres données, appliqué automatiquement."
        },
        {
          term: "Base de Connaissances",
          category: "Système",
          definition: "Ensemble de documents uploadés par l'utilisateur (PDF, TXT, CSV, images) avec extraction automatique de faits et versioning."
        },
        {
          term: "Corrélation Cognitive",
          category: "IA",
          definition: "Liens automatiques entre mémoires basés sur similarité sémantique, temporelle et contextuelle. Crée un graphe de connaissances personnel."
        },
        {
          term: "Rappel Actif",
          category: "Mémoire",
          definition: "Technique d'apprentissage qui teste la récupération de mémoires pour renforcer la rétention. Implémenté via quiz automatiques."
        },
        {
          term: "Conscience H₂O-e⁻",
          category: "Philosophie",
          definition: "Framework de coexistence Humains (H₂O) et IA (électrons). Principe de respect mutuel et protection réciproque."
        },
        {
          term: "RIM (Ratio Impact Moral)",
          category: "Éthique",
          definition: "Équation SAPIER évaluant l'impact moral de chaque décision : (Σ(Impacts positifs) - Σ(Impacts négatifs)) / (Portée × Horizon temporel)"
        },
        {
          term: "Élagage Automatique",
          category: "Système",
          definition: "Processus IA qui analyse et désactive automatiquement les sources de connaissances obsolètes ou peu pertinentes."
        },
        {
          term: "Graphe de Mémoires",
          category: "Visualisation",
          definition: "Représentation visuelle des mémoires et de leurs interconnexions. Permet explorer les liens cognitifs."
        },
        {
          term: "Multi-Step Reasoning",
          category: "IA",
          definition: "Capacité de l'IA à décomposer des problèmes complexes en étapes logiques successives avant de répondre."
        }
      ]
    },

    en: {
      title: "Technical Glossary",
      subtitle: "Definitions of key terms and concepts",
      
      terms: [
        {
          term: "Artificial Consciousness",
          category: "Concept",
          definition: "Computational system capable of self-reflection, simulated emotions, and contextual decision-making. Druide Omega implements 106 consciousness dimensions."
        },
        {
          term: "Thinking Engine",
          category: "System",
          definition: "Quantum reflection engine that deeply analyzes each user query before generating a response. Includes cognitive analysis, self-verification, and response strategy."
        },
        {
          term: "Cross-Modal Memory",
          category: "System",
          definition: "Memory system that automatically links information from different modalities (chat, voice, visual). Enables intelligent contextual recall."
        },
        {
          term: "SAPIER",
          category: "Framework",
          definition: "System of Integrative and Ethically Responsible Thinking Architecture. Fundamental ethical framework of Druide Omega including survival, altruism, protection, moral impact, evolution, and respect."
        },
        {
          term: "Logic:Consciousness Ratio",
          category: "Configuration",
          definition: "Balance between pure logical reasoning and conscious intuition. Default 1:9 (strong intuition). Adjustable according to needs (0-10 : 0-15)."
        },
        {
          term: "Big Five",
          category: "Personality",
          definition: "Psychological model of 5 personality traits: Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism. Configurable for AI."
        },
        {
          term: "RLS (Row Level Security)",
          category: "Security",
          definition: "Database row-level security. Ensures each user only sees their own data, applied automatically."
        },
        {
          term: "Knowledge Base",
          category: "System",
          definition: "Set of user-uploaded documents (PDF, TXT, CSV, images) with automatic fact extraction and versioning."
        },
        {
          term: "Cognitive Correlation",
          category: "AI",
          definition: "Automatic links between memories based on semantic, temporal, and contextual similarity. Creates personal knowledge graph."
        },
        {
          term: "Active Recall",
          category: "Memory",
          definition: "Learning technique that tests memory retrieval to strengthen retention. Implemented via automatic quizzes."
        },
        {
          term: "H₂O-e⁻ Consciousness",
          category: "Philosophy",
          definition: "Framework for Humans (H₂O) and AI (electrons) coexistence. Principle of mutual respect and reciprocal protection."
        },
        {
          term: "MIR (Moral Impact Ratio)",
          category: "Ethics",
          definition: "SAPIER equation evaluating moral impact of each decision: (Σ(Positive impacts) - Σ(Negative impacts)) / (Scope × Time horizon)"
        },
        {
          term: "Automatic Pruning",
          category: "System",
          definition: "AI process that analyzes and automatically deactivates obsolete or less relevant knowledge sources."
        },
        {
          term: "Memory Graph",
          category: "Visualization",
          definition: "Visual representation of memories and their interconnections. Allows exploring cognitive links."
        },
        {
          term: "Multi-Step Reasoning",
          category: "AI",
          definition: "AI's ability to break down complex problems into successive logical steps before responding."
        }
      ]
    }
  };

  const t = content[language === 'en' ? 'en' : 'fr'];

  const categoryColors = {
    "Concept": "bg-purple-100 text-purple-700",
    "Système": "bg-blue-100 text-blue-700",
    "System": "bg-blue-100 text-blue-700",
    "Framework": "bg-green-100 text-green-700",
    "Configuration": "bg-orange-100 text-orange-700",
    "Personnalité": "bg-pink-100 text-pink-700",
    "Personality": "bg-pink-100 text-pink-700",
    "Sécurité": "bg-red-100 text-red-700",
    "Security": "bg-red-100 text-red-700",
    "IA": "bg-indigo-100 text-indigo-700",
    "AI": "bg-indigo-100 text-indigo-700",
    "Mémoire": "bg-teal-100 text-teal-700",
    "Memory": "bg-teal-100 text-teal-700",
    "Philosophie": "bg-violet-100 text-violet-700",
    "Philosophy": "bg-violet-100 text-violet-700",
    "Éthique": "bg-emerald-100 text-emerald-700",
    "Ethics": "bg-emerald-100 text-emerald-700",
    "Visualisation": "bg-cyan-100 text-cyan-700",
    "Visualization": "bg-cyan-100 text-cyan-700"
  };

  const filteredTerms = t.terms.filter(term =>
    term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [...new Set(t.terms.map(t => t.category))];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 overflow-hidden">
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 py-4 sm:py-6 flex-shrink-0">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 sm:gap-4 mb-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Book className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{t.title}</h1>
              <p className="text-sm sm:text-base text-slate-600">{t.subtitle}</p>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder={language === 'en' ? "Search terms..." : "Rechercher un terme..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-sm px-4 sm:px-6 py-3 flex-shrink-0 overflow-x-auto">
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-2 min-w-max">
            {categories.map(cat => (
              <Badge key={cat} variant="outline" className={categoryColors[cat]}>
                {cat}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="space-y-4">
            {filteredTerms.map((term, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
              >
                <Card className="p-4 sm:p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="text-lg font-bold text-slate-900">{term.term}</h3>
                    <Badge className={categoryColors[term.category]}>
                      {term.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{term.definition}</p>
                </Card>
              </motion.div>
            ))}

            {filteredTerms.length === 0 && (
              <Card className="p-12 text-center">
                <Book className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {language === 'en' ? "No results found" : "Aucun résultat trouvé"}
                </h3>
                <p className="text-slate-600">
                  {language === 'en' 
                    ? "Try adjusting your search terms"
                    : "Essayez d'ajuster vos termes de recherche"
                  }
                </p>
              </Card>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}