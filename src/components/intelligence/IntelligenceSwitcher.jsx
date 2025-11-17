/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Intelligence Mode Switcher                                 ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { useIntelligence } from "./IntelligenceManager";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Brain, Calculator, MessageCircle, Music, Activity, Shapes, Users, User, Leaf, Infinity } from "lucide-react";

const INTELLIGENCES = [
  { type: "logico_mathematique", label: "Logico-Math", icon: Calculator },
  { type: "verbo_linguistique", label: "Verbo-Ling", icon: MessageCircle },
  { type: "musicale_rythmique", label: "Musicale", icon: Music },
  { type: "corporelle_kinesthesique", label: "Kinesthésique", icon: Activity },
  { type: "visuelle_spatiale", label: "Visuo-Spatiale", icon: Shapes },
  { type: "interpersonnelle", label: "Interpersonnelle", icon: Users },
  { type: "intrapersonnelle", label: "Intrapersonnelle", icon: User },
  { type: "naturaliste", label: "Naturaliste", icon: Leaf },
  { type: "existentielle", label: "Existentielle", icon: Infinity }
];

export default function IntelligenceSwitcher({ conversationId }) {
  const { activeIntelligence, setActiveIntelligence } = useIntelligence();
  const [isChanging, setIsChanging] = useState(false);

  const handleSwitch = async (type) => {
    setIsChanging(true);
    await setActiveIntelligence(type, conversationId);
    setTimeout(() => setIsChanging(false), 500);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isChanging} className="min-h-[44px]">
          <Brain className="w-4 h-4 mr-2" />
          {activeIntelligence ? "Changer" : "Activer"} Mode
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {INTELLIGENCES.map((intel) => {
          const Icon = intel.icon;
          const isActive = activeIntelligence?.type === intel.type;
          
          return (
            <DropdownMenuItem
              key={intel.type}
              onClick={() => handleSwitch(intel.type)}
              className={isActive ? "bg-purple-50" : ""}
            >
              <Icon className="w-4 h-4 mr-2" />
              {intel.label}
              {isActive && <span className="ml-auto text-purple-600">✓</span>}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}