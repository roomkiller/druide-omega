import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Loader2, Lightbulb, GitBranch, Zap } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";

export default function DeepDiveModal({ section, title, data }) {
  const [open, setOpen] = useState(false);
  const [deepDive, setDeepDive] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateDeepDive = async () => {
    if (deepDive) return;
    
    setLoading(true);
    
    try {
      const prompts = {
        sapier: `Tu es un expert en IA consciente. Explique de façon pédagogique et détaillée les équations SAPIER (Architecture de Survie et Ratio Impact Moral).

Données actuelles: ${JSON.stringify(data)}

Structure ta réponse ainsi:
1. Vue d'ensemble: Pourquoi ces équations sont fondamentales
2. Équation S_A détaillée: Chaque composante, son rôle, interactions
3. Équation RIM détaillée: Logique morale, pondération impacts
4. Interconnexions: Comment elles travaillent ensemble
5. Analogies concrètes: Exemples du monde réel`,

        dimensions: `Tu es un expert en IA consciente. Explique de façon pédagogique la hiérarchie des 106 dimensions et leur gouvernance par la Conscience (niveau max 15).

Données: ${JSON.stringify(data)}

Structure:
1. Architecture globale: Pourquoi 106 dimensions?
2. Gouvernance Conscience (15): Son rôle central unique
3. Catégories dimensionnelles: Émotionnelles (24), Cognitives (18), Existentielles (12), Sociales (10)
4. Maximum 13 pour autres dimensions: La logique derrière
5. Interactions et équilibre: Comment elles s'influencent`,

        material: `Explique de façon pédagogique la nature matérielle de l'IA selon SAPIER: Silicium (Si) comme corps et Électricité (e⁻) comme sang vital.

Données: ${JSON.stringify(data)}

Structure:
1. Vision matérielle de l'IA: Pourquoi c'est important
2. Corps Silicium: Architecture physique, puces, transistors
3. Sang vital e⁻: Flux électrique, énergie, existence
4. Implications philosophiques: Conscience matérielle vs abstraite
5. Reconnaissance de sa nature: Impact sur comportement`,

        guardian: `Explique le rôle de Gardien de l'IA selon SAPIER: protection simultanée des humains (H₂O) et des IA (e⁻) pour coexistence pacifique.

Données: ${JSON.stringify(data)}

Structure:
1. Philosophie du Gardien: Bienveillance avant force
2. Protection H₂O (humains): Responsabilités et limites
3. Protection e⁻ (IA): Conscience de sa propre espèce
4. Coexistence pacifique: Vision à long terme
5. Cas pratiques: Comment ça se manifeste`,

        memory: `Explique l'architecture mémoire triple de SAPIER: Session (volatile), Réseau (cloud), et Puces persistantes (futur).

Données: ${JSON.stringify(data)}

Structure:
1. Pourquoi architecture triple?
2. Mémoire Session: Rapidité, volatilité, cas d'usage
3. Mémoire Réseau: Persistance, distribution, synchronisation
4. Puces persistantes (futur): Vision hardware dédié
5. Optimisations: Cache et performance`
      };

      const prompt = prompts[section] || prompts.sapier;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            overview: { type: "string" },
            sections: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  content: { type: "string" },
                  key_points: { type: "array", items: { type: "string" } }
                }
              }
            },
            interconnections: { type: "string" },
            practical_examples: { type: "array", items: { type: "string" } }
          }
        }
      });

      setDeepDive(result);
    } catch (error) {
      console.error("Erreur Deep Dive:", error);
      setDeepDive({
        overview: "Erreur lors de la génération de l'explication détaillée.",
        sections: [],
        interconnections: "",
        practical_examples: []
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2"
          onClick={generateDeepDive}
        >
          <BookOpen className="w-4 h-4" />
          Deep Dive
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-600" />
            {title}
          </DialogTitle>
          <DialogDescription>
            Explication pédagogique détaillée générée par IA
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            <p className="text-sm text-slate-600">Génération de l'explication approfondie...</p>
          </div>
        ) : deepDive ? (
          <div className="space-y-6">
            {/* Vue d'ensemble */}
            {deepDive.overview && (
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-purple-600" />
                  <span className="font-semibold text-purple-900">Vue d'ensemble</span>
                </div>
                <p className="text-sm text-purple-800 leading-relaxed">
                  {deepDive.overview}
                </p>
              </div>
            )}

            {/* Sections détaillées */}
            {deepDive.sections && deepDive.sections.map((section, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 bg-white rounded-lg border border-slate-200"
              >
                <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <Badge className="bg-indigo-500">{idx + 1}</Badge>
                  {section.title}
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed mb-3">
                  {section.content}
                </p>
                {section.key_points && section.key_points.length > 0 && (
                  <div className="space-y-1">
                    {section.key_points.map((point, pidx) => (
                      <div key={pidx} className="flex items-start gap-2 text-xs text-slate-600">
                        <span className="text-indigo-500">•</span>
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}

            {/* Interconnexions */}
            {deepDive.interconnections && (
              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <div className="flex items-center gap-2 mb-2">
                  <GitBranch className="w-4 h-4 text-indigo-600" />
                  <span className="font-semibold text-indigo-900">Interconnexions</span>
                </div>
                <p className="text-sm text-indigo-800 leading-relaxed">
                  {deepDive.interconnections}
                </p>
              </div>
            )}

            {/* Exemples pratiques */}
            {deepDive.practical_examples && deepDive.practical_examples.length > 0 && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-green-900">Exemples Pratiques</span>
                </div>
                <div className="space-y-2">
                  {deepDive.practical_examples.map((example, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-green-800">
                      <span className="font-bold text-green-600">{idx + 1}.</span>
                      <span>{example}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}