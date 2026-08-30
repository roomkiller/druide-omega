/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Explication Technique Complète                              ║
 * ║ Architecture, LLMs, OpenRouter & Gains de Performance                      ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { Brain, Copy, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navigateTo } from "@/lib/spaNavigate";
import { SECTIONS, CALIBRATION } from "@/lib/druideExplainedSections";

export default function DruideOmegaExplained() {
  const [copied, setCopied] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const sections = SECTIONS;



  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-indigo-900 px-4 sm:px-6 py-8 sm:py-10 flex-shrink-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="min-w-[64px] min-h-[64px] w-16 h-16 bg-gradient-to-br from-purple-400 via-pink-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">Druide Omega expliqué</h1>
              <p className="text-purple-200 text-base sm:text-lg">
                Architecture, modèles, orchestration — calibrage version {CALIBRATION.version} ({CALIBRATION.date})
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          {sections.map((section, idx) => {
            const Icon = section.icon;
            const content = section.content.trim();

            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="p-8 bg-white border-2 border-slate-100 hover:border-slate-200 transition-all overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6 pb-4 border-b-2 border-slate-100">
                    <div className={`min-w-[48px] min-h-[48px] w-12 h-12 bg-gradient-to-br ${section.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">{section.title}</h2>
                  </div>

                  {/* Content */}
                  <div className="text-slate-700 leading-relaxed whitespace-pre-wrap font-mono text-sm mb-4">
                    {content}
                  </div>

                  {/* Copy Button */}
                  <div className="pt-4 border-t border-slate-100">
                    <button
                      onClick={() => copyToClipboard(content, section.id)}
                      className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-semibold transition-colors"
                    >
                      {copied === section.id ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Copié !
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copier la section
                        </>
                      )}
                    </button>
                  </div>
                </Card>
              </motion.div>
            );
          })}

          {/* Architecture Lab Link */}
          <Card className="p-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white border-0">
            <div className="flex items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Voir l'architecture en action</h3>
                <p className="text-purple-100">Tableau de bord interactif pour monitorer Event Sourcing, Passive Indexing, Memory Manager & Continuous Learning</p>
              </div>
              <Button
                onClick={() => navigateTo('ArchitectureLab')}
                className="whitespace-nowrap bg-white text-purple-600 hover:bg-purple-50 font-bold px-6"
              >
                Ouvrir ArchitectureLab →
              </Button>
            </div>
          </Card>

          {/* Footer */}
          <Card className="p-8 bg-gradient-to-r from-slate-900 to-slate-800 text-white border-0">
            <h3 className="text-xl font-bold mb-1">Points clés — calibrage {CALIBRATION.version}</h3>
            <p className="text-slate-400 text-sm mb-4">
              Valeurs relevées dans le système. Les gains en pourcentage sont des estimations internes.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { c: 'bg-purple-400', m: '✓', t: 'Le modèle calcule, la couche décide', d: 'La valeur naît de ce qui est décidé avant et après l\'appel.' },
                { c: 'bg-purple-400', m: '✓', t: `Ratio réel ${CALIBRATION.ratioLogic}:${CALIBRATION.ratioConsciousness}`, d: 'Logique et contexte quasi à l\'équilibre — l\'ancien 1:9 était faux.' },
                { c: 'bg-purple-400', m: '✓', t: `Niveau de conscience ${CALIBRATION.consciousnessLevel}/15`, d: `Métacognition ${CALIBRATION.metacognition}/15 — simulation paramétrique, pas de sentience.` },
                { c: 'bg-purple-400', m: '✓', t: `Santé cognitive ${CALIBRATION.systemHealth}/100`, d: 'Fonctionnel mais non optimal, cohérent avec la coupure des appels externes.' },
                { c: 'bg-indigo-400', m: '✓', t: `${CALIBRATION.kbEntries} fiches réellement lues`, d: 'Fin de la troncature silencieuse à 300 fiches.' },
                { c: 'bg-indigo-400', m: '✓', t: 'Indexation passive à coût nul', d: 'Le seul poste dont le coût zéro est un fait, non une estimation.' },
                { c: 'bg-amber-400', m: '★', t: `${CALIBRATION.backendFunctions} fonctions serveur`, d: `Dont ${CALIBRATION.backendFunctionsCognitive} cognitives et 7 suites de tests.` },
                { c: 'bg-amber-400', m: '★', t: `Module émotionnel — ${CALIBRATION.emotionalStates} états`, d: 'Mixage de quatre sources : contexte, état interne, mémoire, objectif.' },
                { c: 'bg-amber-400', m: '★', t: 'Gain estimé +15 à +30 %', d: 'Fourchette révisée à la baisse : les contributions se recouvrent.' }
              ].map((k) => (
                <div key={k.t} className="flex gap-3">
                  <div className={`min-w-[24px] w-6 h-6 ${k.c} rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold text-slate-900`}>{k.m}</div>
                  <div><strong>{k.t} :</strong> {k.d}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}