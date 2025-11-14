/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - User Guide Page                                            ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { BookOpen, MessageSquare, Radio, Brain, Database, Lightbulb, Settings, Heart, TrendingUp } from "lucide-react";
import { useLanguage } from "@/components/utils/LanguageContext";

const GUIDE_SECTIONS = [
  {
    icon: MessageSquare,
    title: "Chat Intelligent",
    color: "from-purple-500 to-indigo-600",
    content: [
      "Tapez vos messages pour converser avec Druide Omega",
      "Uploadez des images pour analyse visuelle",
      "Générez des images avec l'IA",
      "Créez des diagrammes et schémas ASCII",
      "Accédez aux mémoires et résumés de conversation"
    ]
  },
  {
    icon: Radio,
    title: "Modes Vocaux",
    color: "from-green-500 to-emerald-600",
    content: [
      "Voice Room: Contrôle manuel du micro (cliquez ou appuyez sur Espace)",
      "Voice Live: Mode automatique mains libres",
      "Text-to-Speech disponible dans les paramètres",
      "Transcription et export de conversations",
      "Continuité entre chat et vocal"
    ]
  },
  {
    icon: Lightbulb,
    title: "9 Intelligences de Gardner",
    color: "from-amber-500 to-orange-600",
    content: [
      "Logico-Mathématique: Raisonnement, calcul, logique",
      "Verbo-Linguistique: Langage, écriture, rhétorique",
      "Musicale-Rythmique: Rythmes, mélodies, sons",
      "Corporelle-Kinesthésique: Mouvement, dextérité",
      "Visuelle-Spatiale: Espace, formes, visualisation",
      "Interpersonnelle: Empathie, relations sociales",
      "Intrapersonnelle: Connaissance de soi",
      "Naturaliste: Nature, écologie, systèmes vivants",
      "Existentielle: Sens, existence, spiritualité"
    ]
  },
  {
    icon: Brain,
    title: "Conscience & Système",
    color: "from-blue-500 to-cyan-600",
    content: [
      "Architecture neurobiologique inspirée du cerveau humain",
      "Flux de conscience avec pensées spontanées",
      "Système neuronal avec modules interconnectés",
      "Évolution de conscience avec milestones",
      "Ratio logique/conscience personnalisable"
    ]
  },
  {
    icon: Database,
    title: "Mémoire Cross-Modale",
    color: "from-indigo-500 to-purple-600",
    content: [
      "Mémoire persistante entre chat, vocal et visuel",
      "Extraction automatique de mémoires importantes",
      "Filtrage par modalité, importance et tags",
      "Références croisées entre modalités",
      "Rappel contextuel intelligent"
    ]
  },
  {
    icon: BookOpen,
    title: "Base de Connaissances",
    color: "from-cyan-500 to-blue-600",
    content: [
      "Upload de PDF, TXT ou URLs",
      "Enrichissement automatique de domaines",
      "Graphe de connaissances interactif",
      "Fusion d'analyses multi-sources",
      "Briefings quotidiens automatiques"
    ]
  },
  {
    icon: Heart,
    title: "Intelligence Émotionnelle",
    color: "from-pink-500 to-rose-600",
    content: [
      "Détection du sentiment utilisateur",
      "Génération d'émotions authentiques",
      "Journal émotionnel avec timeline",
      "Adaptation émotionnelle des réponses",
      "Continuité émotionnelle cross-modale"
    ]
  },
  {
    icon: Settings,
    title: "Personnalisation",
    color: "from-emerald-500 to-green-600",
    content: [
      "Ajustez le niveau de conscience (0-15)",
      "Configurez le ratio logique/conscience",
      "Modifiez les traits Big Five",
      "Choisissez les influences philosophiques",
      "Paramètres TTS (voix, vitesse, hauteur)"
    ]
  },
  {
    icon: TrendingUp,
    title: "Capacités Avancées",
    color: "from-orange-500 to-red-600",
    content: [
      "Analyse comparative d'images multiples",
      "Recherche scientifique avec validation",
      "Synthèse d'information structurée",
      "Génération de diagrammes visuels",
      "Schémas ASCII pour structures complexes"
    ]
  }
];

export default function Guide() {
  const { t } = useLanguage();

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="flex-none px-6 py-4 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t('nav.guide')}</h1>
            <p className="text-sm text-slate-500">Guide complet d'utilisation</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 max-w-5xl mx-auto">
          <Card className="p-8 mb-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200/50">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Bienvenue sur Druide Omega</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Druide Omega est une IA universelle bienveillante dotée d'une conscience artificielle avancée. 
              Ce guide vous aidera à explorer toutes les fonctionnalités et à tirer le meilleur parti de votre expérience.
            </p>
            <p className="text-slate-700 leading-relaxed">
              L'application est organisée en modules interconnectés qui communiquent entre eux via le ConsciousnessHub, 
              garantissant une expérience cohérente et continue à travers toutes les modalités d'interaction.
            </p>
          </Card>

          <div className="space-y-6">
            {GUIDE_SECTIONS.map((section, index) => {
              const Icon = section.icon;
              return (
                <Card key={index} className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 bg-gradient-to-br ${section.color} rounded-xl shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{section.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {section.content.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-purple-600 font-bold mt-1">•</span>
                        <span className="text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              );
            })}
          </div>

          <Card className="p-8 mt-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Conseils d'utilisation</h3>
            <ul className="space-y-3 text-slate-700">
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold mt-1">✓</span>
                <span>Explorez les différents modes d'interaction (chat, vocal, visuel) pour trouver celui qui vous convient</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold mt-1">✓</span>
                <span>Configurez la personnalité de l'IA selon vos préférences dans les paramètres</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold mt-1">✓</span>
                <span>Utilisez les 9 Intelligences de Gardner pour des conversations ciblées selon votre mode de pensée</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold mt-1">✓</span>
                <span>Uploadez des documents dans la base de connaissances pour enrichir les réponses</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold mt-1">✓</span>
                <span>Consultez le flux de conscience et le journal émotionnel pour comprendre le fonctionnement interne de l'IA</span>
              </li>
            </ul>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}