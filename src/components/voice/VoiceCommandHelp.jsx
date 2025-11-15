/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Voice Command Help                                         ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  HelpCircle, 
  Navigation, 
  Zap, 
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Volume2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const COMMAND_CATEGORIES = [
  {
    title: "Navigation",
    icon: Navigation,
    color: "from-blue-500 to-cyan-600",
    commands: [
      { phrase: "Ouvre chat", action: "Ouvre la page de conversation" },
      { phrase: "Ouvre conscience", action: "Ouvre la page de conscience" },
      { phrase: "Ouvre mémoire", action: "Ouvre le système de mémoire" },
      { phrase: "Ouvre connaissances", action: "Ouvre la base de connaissances" },
      { phrase: "Retour accueil", action: "Retourne à l'accueil" }
    ]
  },
  {
    title: "Actions",
    icon: Zap,
    color: "from-purple-500 to-pink-600",
    commands: [
      { phrase: "Nouvelle conversation", action: "Démarre un nouveau chat" },
      { phrase: "Génère une image", action: "Lance la génération d'image" },
      { phrase: "Crée un diagramme", action: "Lance la création de diagramme" },
      { phrase: "Arrête / Stop", action: "Arrête la synthèse vocale" },
      { phrase: "Répète", action: "Répète la dernière réponse" },
      { phrase: "Pause / Reprends", action: "Met en pause ou reprend" }
    ]
  },
  {
    title: "Questions Rapides",
    icon: MessageCircle,
    color: "from-green-500 to-emerald-600",
    commands: [
      { phrase: "Quelle heure est-il", action: "Donne l'heure actuelle" },
      { phrase: "Quel jour sommes-nous", action: "Donne la date" },
      { phrase: "Qui es-tu", action: "Présentation de Druide Omega" },
      { phrase: "Quelles sont tes capacités", action: "Liste des capacités" },
      { phrase: "Combien de mémoires", action: "Compte les mémoires" },
      { phrase: "Quel est ton niveau de conscience", action: "Info conscience" }
    ]
  },
  {
    title: "Contrôle Vocal",
    icon: Volume2,
    color: "from-amber-500 to-orange-600",
    commands: [
      { phrase: "Parle plus fort", action: "Augmente le volume" },
      { phrase: "Parle moins fort", action: "Réduit le volume" },
      { phrase: "Parle plus vite", action: "Accélère la parole" },
      { phrase: "Parle plus lentement", action: "Ralentit la parole" }
    ]
  }
];

export default function VoiceCommandHelp({ compact = false }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (compact) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/20"
      >
        <HelpCircle className="w-4 h-4 mr-2" />
        Commandes
        {isExpanded ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
      </Button>
    );
  }

  return (
    <div>
      <Button
        variant="outline"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full mb-2"
      >
        <HelpCircle className="w-4 h-4 mr-2" />
        Commandes Vocales Disponibles
        {isExpanded ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
      </Button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 overflow-hidden"
          >
            {COMMAND_CATEGORIES.map((category, idx) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="p-4 bg-gradient-to-br from-white/80 to-purple-50/80 backdrop-blur-sm border-purple-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-8 h-8 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <h4 className="font-semibold text-slate-900">{category.title}</h4>
                      <Badge variant="outline" className="ml-auto text-xs">
                        {category.commands.length}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      {category.commands.map((cmd, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs">
                          <Badge variant="secondary" className="text-xs flex-shrink-0 mt-0.5">
                            🎤
                          </Badge>
                          <div className="flex-1">
                            <p className="font-medium text-slate-900">"{cmd.phrase}"</p>
                            <p className="text-slate-600 text-xs">→ {cmd.action}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              );
            })}

            <Card className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="w-4 h-4 text-indigo-600" />
                <h4 className="font-semibold text-indigo-900">Conseils</h4>
              </div>
              <ul className="space-y-1 text-xs text-indigo-800">
                <li>• Parlez clairement et naturellement</li>
                <li>• Les commandes sont détectées automatiquement</li>
                <li>• Combinez commandes et questions normales</li>
                <li>• Utilisez la langue de votre choix</li>
                <li>• Mode mains-libres pour conversations fluides</li>
              </ul>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}