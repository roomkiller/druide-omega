/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Multimodal Image Analyzer                                  ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import invokeLLM from "@/components/utils/LLMRouter";
import { Upload, Eye, Sparkles, Loader2, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function ImageAnalyzer({ onAnalysisComplete }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleImageSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setAnalyzing(true);
    try {
      // Upload image
      const { file_url } = await base44.integrations.Core.UploadFile({
        file: selectedImage
      });

      // Analyze with AI
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyse cette image en profondeur. Fournis:
1. Description détaillée de ce que tu vois
2. Contexte et signification
3. Émotions transmises
4. Éléments techniques (couleurs, composition, style)
5. Concepts clés identifiés
6. Suggestions d'utilisation ou d'application

Sois précis, analytique et créatif.`,
        file_urls: [file_url],
        response_json_schema: {
          type: "object",
          properties: {
            description: { type: "string" },
            context: { type: "string" },
            emotions: { type: "array", items: { type: "string" } },
            technical_elements: {
              type: "object",
              properties: {
                colors: { type: "array", items: { type: "string" } },
                composition: { type: "string" },
                style: { type: "string" }
              }
            },
            key_concepts: { type: "array", items: { type: "string" } },
            suggestions: { type: "array", items: { type: "string" } }
          }
        }
      });

      setAnalysis({ ...result, image_url: file_url });

      // Create multimodal memory
      await base44.entities.Memory.create({
        type: "fact",
        content: `Image analysée: ${result.description}. Concepts: ${result.key_concepts?.join(', ')}`,
        importance: 7,
        modality: "visual",
        tags: result.key_concepts || [],
        context: `Analyse d'image: ${result.context || 'N/A'}`,
        emotional_context: {
          emotion: result.emotions?.[0] || 'neutral',
          intensity: 5
        }
      });

      onAnalysisComplete?.({ ...result, image_url: file_url });
    } catch (error) {
      console.error("Erreur analyse image:", error);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
          <Eye className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Analyse d'Image IA</h3>
          <p className="text-sm text-slate-600">Vision multimodale avancée</p>
        </div>
      </div>

      <div className="space-y-4">
        {!imagePreview ? (
          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 hover:border-purple-500 transition-colors">
              <div className="text-center">
                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-sm text-slate-600 mb-2">
                  Cliquez pour sélectionner une image
                </p>
                <p className="text-xs text-slate-400">
                  PNG, JPG, JPEG jusqu'à 10MB
                </p>
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </label>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden border-2 border-slate-200">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-auto max-h-96 object-contain"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={analyzeImage}
                disabled={analyzing}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Analyser
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedImage(null);
                  setImagePreview(null);
                  setAnalysis(null);
                }}
              >
                Nouvelle Image
              </Button>
            </div>
          </div>
        )}

        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 mt-6"
          >
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
              <h4 className="font-semibold text-slate-900 mb-2">Description</h4>
              <p className="text-sm text-slate-700">{analysis.description}</p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-slate-900 mb-2">Contexte</h4>
              <p className="text-sm text-slate-700">{analysis.context}</p>
            </div>

            {analysis.emotions?.length > 0 && (
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Émotions</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.emotions.map((emotion, idx) => (
                    <Badge key={idx} className="bg-pink-100 text-pink-700">
                      {emotion}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {analysis.technical_elements && (
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-3">Éléments Techniques</h4>
                <div className="space-y-2 text-sm text-slate-700">
                  <p><strong>Style:</strong> {analysis.technical_elements.style}</p>
                  <p><strong>Composition:</strong> {analysis.technical_elements.composition}</p>
                  {analysis.technical_elements.colors?.length > 0 && (
                    <div>
                      <strong>Couleurs:</strong>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {analysis.technical_elements.colors.map((color, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {color}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {analysis.key_concepts?.length > 0 && (
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Concepts Clés</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.key_concepts.map((concept, idx) => (
                    <Badge key={idx} className="bg-indigo-100 text-indigo-700">
                      {concept}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {analysis.suggestions?.length > 0 && (
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 className="font-semibold text-slate-900 mb-2">Suggestions</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                  {analysis.suggestions.map((suggestion, idx) => (
                    <li key={idx}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </Card>
  );
}