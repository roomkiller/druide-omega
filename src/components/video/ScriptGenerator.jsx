/**
 * AI Script Generator
 * Generates full video scripts from user prompts using LLM
 */

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/components/utils/LanguageContext";
import { motion } from "framer-motion";
import { FileText, Copy, Download } from "lucide-react";
import { toast } from "sonner";

export default function ScriptGenerator({ onScriptGenerated }) {
  const { language } = useLanguage();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [script, setScript] = useState(null);

  const generateScript = async () => {
    if (!prompt.trim()) {
      toast.error(language === 'fr' ? "Entrez une description" : "Enter a description");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate a detailed video script for the following concept:\n\n${prompt}\n\nInclude:\n- Scene descriptions\n- Narration/dialogue\n- Visual transitions\n- Duration per scene\n- Camera directions\n\nFormat as JSON with scenes array.`,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            duration: { type: "number" },
            scenes: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  sceneNumber: { type: "number" },
                  description: { type: "string" },
                  narration: { type: "string" },
                  duration: { type: "number" },
                  cameraDirection: { type: "string" }
                }
              }
            },
            summary: { type: "string" }
          }
        }
      });

      const scriptData = response.data || response;
      setScript(scriptData);
      onScriptGenerated?.(scriptData);
      
      toast.success(language === 'fr' ? "Script généré" : "Script generated");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadScript = () => {
    const content = JSON.stringify(script, null, 2);
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `script_${Date.now()}.json`;
    a.click();
  };

  return (
    <Card className="bg-slate-900 border-blue-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-400">
          <FileText className="w-5 h-5" />
          {language === 'fr' ? "Générateur de Script IA" : "AI Script Generator"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder={language === 'fr' 
            ? "Décrivez votre concept vidéo..." 
            : "Describe your video concept..."}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="bg-slate-800 border-slate-700 min-h-24"
        />

        <Button
          onClick={generateScript}
          disabled={isGenerating || !prompt.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isGenerating 
            ? language === 'fr' ? "Génération..." : "Generating..."
            : language === 'fr' ? "Générer script" : "Generate script"}
        </Button>

        {script && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="bg-slate-800 p-3 rounded space-y-2">
              <h3 className="font-bold text-blue-300">{script.title}</h3>
              <p className="text-xs text-slate-400">
                ⏱️ {script.duration?.toFixed(1) || "?"} {language === 'fr' ? "secondes" : "seconds"}
              </p>
              <p className="text-xs text-slate-300">{script.summary}</p>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {script.scenes?.map((scene) => (
                <div key={scene.sceneNumber} className="bg-slate-700 p-2 rounded text-xs space-y-1">
                  <p className="font-semibold text-blue-400">
                    Scene {scene.sceneNumber} ({scene.duration}s)
                  </p>
                  <p className="text-slate-300">{scene.description}</p>
                  {scene.narration && (
                    <p className="text-slate-400 italic">🎤 {scene.narration.substring(0, 80)}...</p>
                  )}
                </div>
              ))}
            </div>

            <Button
              onClick={downloadScript}
              variant="outline"
              className="w-full text-xs"
            >
              <Download className="w-3 h-3 mr-2" />
              {language === 'fr' ? "Télécharger" : "Download"}
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}