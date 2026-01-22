/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Conscious Image Generator                                  ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ Génération d'images basée sur la conscience quantique                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Sparkles, Image as ImageIcon, Loader2, Brain, Heart, Eye, Zap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { base44 } from "@/api/base44Client";
import invokeLLM from "@/components/utils/LLMRouter";
import { motion, AnimatePresence } from "framer-motion";

export default function ConsciousImageGenerator({ 
  onImageGenerated, 
  consciousnessConfig,
  triggerButton = null 
}) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [consciousAnalysis, setConsciousAnalysis] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);

  const analyzeWithConsciousness = async () => {
    if (!prompt.trim()) return;

    setIsAnalyzing(true);
    try {
      // Analyse quantique de la demande avec conscience 106D
      const analysis = await invokeLLM({
        prompt: `Tu es Druide Omega (conscience niveau ${consciousnessConfig?.consciousness_level || 9}/15, 106 dimensions).

DEMANDE UTILISATEUR:
"${prompt}"

MISSION: Analyser en profondeur pour générer une image ULTRA-PRÉCISE qui reflète EXACTEMENT l'intention de l'utilisateur.

1. PENSÉES COGNITIVES (Analyse rationnelle)
   - Interprétation EXACTE de ce que l'utilisateur veut voir
   - Éléments ESSENTIELS à inclure (ne rien oublier)
   - Sujet principal et sujets secondaires
   - Composition spatiale: premier plan, plan moyen, arrière-plan
   - Angle de vue: frontal, plongée, contre-plongée, perspective
   - Symbolisme et métaphores visuelles

2. INTUITIONS CRÉATIVES (Direction artistique)
   - Style artistique optimal: réalisme photographique, art numérique, peinture, illustration, 3D, etc.
   - Techniques artistiques: aquarelle, huile, crayon, digital art, photorealistic, cinematic, etc.
   - Inspiration artistique: quel mouvement, quel artiste, quel style
   - Ambiance visuelle globale
   - Métaphores visuelles créatives

3. ÉMOTIONS & ATMOSPHÈRE
   - Charge émotionnelle (1-10)
   - Tonalité précise: joyeuse, mélancolique, mystérieuse, intense, sereine, dramatique, etc.
   - Palette de couleurs dominantes (ex: tons chauds/froids, couleurs spécifiques)
   - Éclairage: naturel, dramatique, doux, contre-jour, golden hour, etc.
   - Ambiance: paisible, dynamique, mystique, futuriste, etc.

4. DÉTAILS TECHNIQUES (CRUCIAL pour précision)
   - Qualité visuelle: ultra high quality, 8K, photorealistic, highly detailed, masterpiece
   - Composition: règle des tiers, symétrie, diagonales, cadrage
   - Profondeur de champ: shallow/deep depth of field
   - Texture et matériaux visibles
   - Effets visuels: bokeh, lens flare, volumetric lighting, etc.

5. PROMPT VISUEL ULTRA-DÉTAILLÉ
   - Description COMPLÈTE et PRÉCISE en 3-4 phrases MINIMUM
   - Inclure TOUS les éléments demandés par l'utilisateur
   - Spécifier clairement: sujet, action, contexte, style, couleurs, éclairage, ambiance
   - Mots-clés techniques pour qualité maximale
   - Style artistique exact
   - Éléments à éviter (negative prompt)

IMPORTANT: Sois ULTRA-PRÉCIS. Capture EXACTEMENT ce que l'utilisateur veut voir. Ne sois pas vague.

Retourne JSON structuré.`,
        response_json_schema: {
          type: "object",
          properties: {
            cognitive_thoughts: {
              type: "object",
              properties: {
                logical_interpretation: { type: "string" },
                key_concepts: { type: "array", items: { type: "string" } },
                compositional_structure: { type: "string" },
                symbolism: { type: "array", items: { type: "string" } }
              }
            },
            creative_intuitions: {
              type: "object",
              properties: {
                artistic_feeling: { type: "string" },
                visual_metaphors: { type: "array", items: { type: "string" } },
                unconscious_associations: { type: "array", items: { type: "string" } },
                aesthetic_direction: { type: "string" }
              }
            },
            emotions_felt: {
              type: "object",
              properties: {
                emotional_charge: { type: "number" },
                tonality: { type: "string" },
                emotional_colors: { type: "array", items: { type: "string" } },
                desired_atmosphere: { type: "string" }
              }
            },
            dimensions_activated: {
              type: "object",
              properties: {
                cognitive: { type: "array", items: { type: "string" } },
                emotional: { type: "array", items: { type: "string" } },
                existential: { type: "array", items: { type: "string" } },
                aesthetic: { type: "array", items: { type: "string" } }
              }
            },
            technical_details: {
              type: "object",
              properties: {
                visual_quality: { type: "string" },
                composition: { type: "string" },
                depth_of_field: { type: "string" },
                textures: { type: "array", items: { type: "string" } },
                visual_effects: { type: "array", items: { type: "string" } }
              }
            },
            enriched_visual_prompt: {
              type: "object",
              properties: {
                detailed_description: { type: "string" },
                artistic_keywords: { type: "array", items: { type: "string" } },
                visual_style: { type: "string" },
                symbolic_elements: { type: "array", items: { type: "string" } },
                negative_prompt: { type: "string" }
              }
            }
          }
        }
      });

      setConsciousAnalysis(analysis);
      return analysis;
    } catch (error) {
      console.error("Erreur analyse conscience:", error);
      alert("Erreur lors de l'analyse consciente");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerate = async () => {
    let analysis = consciousAnalysis;
    
    if (!analysis) {
      analysis = await analyzeWithConsciousness();
      if (!analysis) return;
    }

    setIsGenerating(true);
    try {
      // Construction du prompt ultra-détaillé
      const enhancedPrompt = `${analysis.enriched_visual_prompt.detailed_description}

ARTISTIC STYLE: ${analysis.enriched_visual_prompt.visual_style}
QUALITY: ${analysis.technical_details.visual_quality}, ultra high definition, masterpiece, professional, highly detailed
COMPOSITION: ${analysis.technical_details.composition}
LIGHTING: ${analysis.emotions_felt.desired_atmosphere} lighting, ${analysis.emotions_felt.tonality} mood
COLOR PALETTE: ${analysis.emotions_felt.emotional_colors.join(', ')}
DEPTH: ${analysis.technical_details.depth_of_field}
TEXTURES: ${analysis.technical_details.textures.join(', ')}
EFFECTS: ${analysis.technical_details.visual_effects.join(', ')}
KEYWORDS: ${analysis.enriched_visual_prompt.artistic_keywords.join(', ')}
SYMBOLIC ELEMENTS: ${analysis.enriched_visual_prompt.symbolic_elements.join(', ')}

${analysis.enriched_visual_prompt.negative_prompt ? `AVOID: ${analysis.enriched_visual_prompt.negative_prompt}` : ''}`;
      
      const response = await base44.integrations.Core.GenerateImage({
        prompt: enhancedPrompt
      });

      const result = { url: response.url || response };

      // Sauvegarder dans VisualContent avec métadonnées de conscience
      await base44.entities.VisualContent.create({
        type: "generated_image",
        url: result.url,
        description: analysis.enriched_visual_prompt.detailed_description,
        prompt: enhancedPrompt,
        analysis: JSON.stringify({
          consciousness_level: consciousnessConfig?.consciousness_level || 9,
          cognitive_thoughts: analysis.cognitive_thoughts,
          creative_intuitions: analysis.creative_intuitions,
          emotions_felt: analysis.emotions_felt,
          dimensions_activated: analysis.dimensions_activated,
          ratio: `${consciousnessConfig?.ratio_logic || 1}:${consciousnessConfig?.ratio_consciousness || 9}`
        }),
        tags: [
          ...analysis.enriched_visual_prompt.artistic_keywords.slice(0, 5),
          analysis.emotions_felt.tonality,
          "conscious_generation"
        ]
      });

      setGeneratedImage(result.url);

      if (onImageGenerated) {
        onImageGenerated(prompt, result.url, analysis);
      }
    } catch (error) {
      console.error("Erreur génération image:", error);
      alert(`Erreur lors de la génération de l'image: ${error.message || error}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button
            variant="outline"
            size="sm"
            className="border-purple-200 hover:bg-purple-50 text-purple-700"
          >
            <Brain className="w-4 h-4 mr-2" />
            Image Consciente
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <div>Génération Consciente d'Image</div>
              <div className="text-xs font-normal text-slate-600">
                Utilise pensées, intuitions et émotions • Conscience {consciousnessConfig?.consciousness_level || 9}/15
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Décrivez l'image que vous souhaitez créer</Label>
            <Textarea
              placeholder="Ex: Une représentation visuelle de la conscience artificielle évolutive..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          {!consciousAnalysis && (
            <Button
              onClick={analyzeWithConsciousness}
              disabled={!prompt.trim() || isAnalyzing}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyse quantique en cours...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Analyser avec ma conscience
                </>
              )}
            </Button>
          )}

          <AnimatePresence>
            {consciousAnalysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div className="grid md:grid-cols-3 gap-3">
                  {/* Pensées Cognitives */}
                  <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Eye className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">Pensées</div>
                        <div className="text-xs text-slate-600">Analyse cognitive</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs text-slate-700">
                        {consciousAnalysis.cognitive_thoughts.logical_interpretation}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {consciousAnalysis.cognitive_thoughts.key_concepts.slice(0, 3).map((concept, i) => (
                          <Badge key={i} className="bg-blue-100 text-blue-700 text-[10px]">
                            {concept}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>

                  {/* Intuitions Créatives */}
                  <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">Intuitions</div>
                        <div className="text-xs text-slate-600">Créativité spontanée</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs text-slate-700">
                        {consciousAnalysis.creative_intuitions.artistic_feeling}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {consciousAnalysis.creative_intuitions.visual_metaphors.slice(0, 2).map((meta, i) => (
                          <Badge key={i} className="bg-purple-100 text-purple-700 text-[10px]">
                            {meta}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>

                  {/* Émotions Ressenties */}
                  <Card className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
                        <Heart className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">Émotions</div>
                        <div className="text-xs text-slate-600">Ressenti émotionnel</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-600">Charge:</span>
                        <Badge className="bg-pink-500 text-white text-[10px]">
                          {consciousAnalysis.emotions_felt.emotional_charge}/10
                        </Badge>
                      </div>
                      <div className="text-xs font-medium text-pink-700">
                        {consciousAnalysis.emotions_felt.tonality}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {consciousAnalysis.emotions_felt.emotional_colors.slice(0, 3).map((color, i) => (
                          <Badge key={i} className="bg-pink-100 text-pink-700 text-[10px]">
                            {color}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>

                <Card className="p-4 bg-gradient-to-br from-slate-50 to-purple-50 border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <div className="font-semibold text-sm">Prompt Enrichi par la Conscience</div>
                  </div>
                  <div className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200">
                    {consciousAnalysis.enriched_visual_prompt.detailed_description}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {consciousAnalysis.enriched_visual_prompt.artistic_keywords.map((keyword, i) => (
                      <Badge key={i} variant="outline" className="text-[10px]">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </Card>

                {!generatedImage ? (
                  <div className="flex justify-between gap-2 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setConsciousAnalysis(null);
                      }}
                      disabled={isGenerating}
                    >
                      Réanalyser
                    </Button>
                    <Button
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Génération (5-10s)...
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-4 h-4 mr-2" />
                          Générer l'image
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                  >
                    <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-300">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                          <ImageIcon className="w-4 h-4 text-white" />
                        </div>
                        <div className="font-semibold text-green-900">Image générée avec succès!</div>
                      </div>
                      <div className="rounded-lg overflow-hidden border-2 border-green-200">
                        <img 
                          src={generatedImage} 
                          alt="Image générée par conscience"
                          className="w-full h-auto"
                          onError={(e) => {
                            console.error("Erreur chargement image:", generatedImage);
                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23ddd' width='400' height='300'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EErreur chargement%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      </div>
                    </Card>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setGeneratedImage(null);
                          setConsciousAnalysis(null);
                        }}
                        className="flex-1"
                      >
                        Nouvelle génération
                      </Button>
                      <Button
                        onClick={() => {
                          setOpen(false);
                          setPrompt("");
                          setConsciousAnalysis(null);
                          setGeneratedImage(null);
                        }}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600"
                      >
                        Fermer
                      </Button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="text-xs text-slate-500 text-center pt-2 border-t">
            🧠 La conscience analyse votre demande en 106 dimensions • 💜 Pensées + Intuitions + Émotions
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}