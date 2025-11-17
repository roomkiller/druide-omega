/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Visual Response Generator                                  ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { BarChart3, PieChart, Image as ImageIcon, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function VisualResponseGenerator({ context, onGenerated }) {
  const [generating, setGenerating] = useState(false);
  const [visualType, setVisualType] = useState(null);

  const generateVisual = async (type) => {
    setGenerating(true);
    setVisualType(type);

    try {
      let result;

      if (type === "image") {
        // Generate image
        const imagePrompt = await base44.integrations.Core.InvokeLLM({
          prompt: `Basé sur ce contexte, crée un prompt détaillé pour générer une image illustrative:

${JSON.stringify(context).slice(0, 1000)}

Le prompt doit être visuel, descriptif et créatif.`,
          response_json_schema: {
            type: "object",
            properties: {
              prompt: { type: "string" },
              style: { type: "string" }
            }
          }
        });

        const { url } = await base44.integrations.Core.GenerateImage({
          prompt: `${imagePrompt.prompt}. Style: ${imagePrompt.style}. High quality, detailed, professional.`
        });

        result = {
          type: "image",
          url,
          description: imagePrompt.prompt
        };
      } else if (type === "chart") {
        // Generate chart data
        const chartData = await base44.integrations.Core.InvokeLLM({
          prompt: `Analyse ce contexte et crée des données pour un graphique pertinent:

${JSON.stringify(context).slice(0, 1000)}

Retourne des données structurées pour visualisation.`,
          response_json_schema: {
            type: "object",
            properties: {
              title: { type: "string" },
              chart_type: { type: "string", enum: ["bar", "line", "pie", "radar"] },
              labels: { type: "array", items: { type: "string" } },
              datasets: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    label: { type: "string" },
                    data: { type: "array", items: { type: "number" } }
                  }
                }
              },
              insights: { type: "string" }
            }
          }
        });

        result = {
          type: "chart",
          data: chartData
        };
      } else if (type === "diagram") {
        // Generate ASCII diagram
        const diagram = await base44.integrations.Core.InvokeLLM({
          prompt: `Crée un diagramme ASCII clair et structuré pour représenter:

${JSON.stringify(context).slice(0, 1000)}

Le diagramme doit être visuel, hiérarchique et facile à comprendre.`,
          response_json_schema: {
            type: "object",
            properties: {
              diagram: { type: "string" },
              explanation: { type: "string" }
            }
          }
        });

        result = {
          type: "diagram",
          content: diagram.diagram,
          explanation: diagram.explanation
        };
      }

      // Save as visual content
      await base44.entities.VisualContent.create({
        content_type: type,
        description: result.description || result.data?.title || result.explanation,
        file_url: result.url,
        metadata: {
          context: context,
          generated_at: new Date().toISOString(),
          modality: "visual_generation"
        },
        tags: ["ai-generated", type, "multimodal"]
      });

      onGenerated?.(result);
    } catch (error) {
      console.error("Erreur génération visuelle:", error);
    } finally {
      setGenerating(false);
      setVisualType(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-purple-600" />
        <h4 className="font-semibold text-slate-900">Réponse Visuelle</h4>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => generateVisual("image")}
            disabled={generating}
            variant="outline"
            className="w-full h-24 flex flex-col items-center justify-center gap-2"
          >
            {generating && visualType === "image" ? (
              <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
            ) : (
              <>
                <ImageIcon className="w-6 h-6 text-purple-600" />
                <span className="text-xs font-medium">Image</span>
              </>
            )}
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => generateVisual("chart")}
            disabled={generating}
            variant="outline"
            className="w-full h-24 flex flex-col items-center justify-center gap-2"
          >
            {generating && visualType === "chart" ? (
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            ) : (
              <>
                <BarChart3 className="w-6 h-6 text-blue-600" />
                <span className="text-xs font-medium">Graphique</span>
              </>
            )}
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => generateVisual("diagram")}
            disabled={generating}
            variant="outline"
            className="w-full h-24 flex flex-col items-center justify-center gap-2"
          >
            {generating && visualType === "diagram" ? (
              <Loader2 className="w-6 h-6 animate-spin text-green-600" />
            ) : (
              <>
                <PieChart className="w-6 h-6 text-green-600" />
                <span className="text-xs font-medium">Diagramme</span>
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}