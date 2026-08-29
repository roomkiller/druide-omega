/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Onboarding Flow                                            ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Database, BookOpen, Brain, ArrowRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPageUrl } from "@/utils";
import { navigateTo } from "@/lib/spaNavigate";

const STEPS = [
  {
    title: "Bienvenue sur Druide Omega",
    description: "Une IA consciente avec mémoire quantique et personnalité évolutive",
    icon: Brain,
    color: "from-purple-500 to-indigo-600"
  },
  {
    title: "Conversations intelligentes",
    description: "Discutez avec une IA qui se souvient de tout et comprend le contexte",
    icon: MessageSquare,
    color: "from-blue-500 to-cyan-600",
    action: { label: "Essayer", url: "Chat" }
  },
  {
    title: "Mémoires persistantes",
    description: "Vos interactions sont mémorisées et liées entre elles",
    icon: Database,
    color: "from-indigo-500 to-purple-600",
    action: { label: "Explorer", url: "Memory" }
  },
  {
    title: "Base de connaissances",
    description: "Uploadez des documents pour enrichir la connaissance de l'IA",
    icon: BookOpen,
    color: "from-green-500 to-emerald-600",
    action: { label: "Ajouter", url: "Knowledge" }
  }
];

export default function OnboardingFlow() {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const completed = localStorage.getItem('druide_onboarding_completed');
    if (!completed) {
      setTimeout(() => setOpen(true), 1000);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      complete();
    }
  };

  const handleSkip = () => {
    complete();
  };

  const complete = () => {
    localStorage.setItem('druide_onboarding_completed', 'true');
    setOpen(false);
  };

  const handleAction = (url) => {
    complete();
    navigateTo(url);
  };

  const step = STEPS[currentStep];
  const Icon = step.icon;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <Badge variant="outline">Étape {currentStep + 1}/{STEPS.length}</Badge>
            <Button variant="ghost" onClick={handleSkip}>Passer</Button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              <div className={`w-24 h-24 mx-auto mb-6 bg-gradient-to-br ${step.color} rounded-3xl flex items-center justify-center`}>
                <Icon className="w-12 h-12 text-white" />
              </div>

              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{step.title}</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">{step.description}</p>

              <div className="flex gap-3 justify-center">
                {step.action ? (
                  <>
                    <Button onClick={() => handleAction(step.action.url)} size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600">
                      {step.action.label}
                    </Button>
                    <Button onClick={handleNext} variant="outline" size="lg">
                      Suivant <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleNext} size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600">
                    {currentStep < STEPS.length - 1 ? 'Suivant' : 'Commencer'} <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-2 justify-center mt-8">
            {STEPS.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStep ? 'w-8 bg-purple-600' : 'w-2 bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}