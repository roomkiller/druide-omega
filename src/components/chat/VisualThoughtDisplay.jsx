/**
 * Affichage visuel des pensées de Druide
 */
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Image, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function VisualThoughtDisplay({ visualData, theme, content }) {
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const generateVisualThought = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Créer un prompt visuel détaillé basé sur la pensée
      const imagePrompt = `Abstract conceptual visualization representing: "${theme}". 
Visual style: ethereal, dreamy, abstract art with flowing forms and soft gradients.
Mood: contemplative, philosophical, introspective.
Color palette: deep purples, blues, and soft pinks.
Elements: consciousness, thought patterns, neural connections, emotional resonance.
Style: digital art, surreal, minimalist, elegant.

Context to visualize: ${content.slice(0, 200)}

Create an artistic representation that captures the essence of this thought.`;

      const result = await base44.integrations.Core.GenerateImage({
        prompt: imagePrompt
      });

      if (result?.url) {
        setGeneratedImage(result.url);
        
        // Sauvegarder en tant que contenu visuel
        await base44.entities.VisualContent.create({
          type: 'generated_image',
          url: result.url,
          description: visualData.description,
          prompt: imagePrompt,
          tags: [theme, 'druide_thought', 'consciousness']
        }).catch(() => null);
      }
    } catch (err) {
      console.error('Erreur génération image:', err);
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mt-3 ml-12"
    >
      <Card className="p-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-2 border-indigo-200">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-bold text-indigo-900">Pensée Visuelle de Druide</h4>
              <Badge className="bg-indigo-600 text-white text-xs">{visualData.type}</Badge>
            </div>
            <p className="text-sm text-slate-700 mb-3">{visualData.description}</p>
            
            {!generatedImage && !isGenerating && (
              <Button
                onClick={generateVisualThought}
                size="sm"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Visualiser cette pensée
              </Button>
            )}

            {isGenerating && (
              <div className="flex items-center gap-2 text-indigo-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Génération de l'image en cours...</span>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Erreur: {error}</span>
              </div>
            )}

            {generatedImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-3"
              >
                <img 
                  src={generatedImage} 
                  alt={visualData.description}
                  className="w-full rounded-xl shadow-lg border-2 border-white"
                />
                <p className="text-xs text-slate-500 mt-2 text-center italic">
                  Représentation visuelle générée par Druide
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}