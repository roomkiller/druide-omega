import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Image as ImageIcon, Loader2, Zap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { base44 } from "@/api/base44Client";

export default function ImageGenerationButton({ onImageGenerated }) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const enhancedPrompt = `Create a detailed, professional, and visually appealing image based on this description: ${prompt}. Style: clean, modern, high-quality.`;
      
      const result = await base44.integrations.Core.GenerateImage({
        prompt: enhancedPrompt
      });

      onImageGenerated(prompt, result.url);
      setOpen(false);
      setPrompt("");
    } catch (error) {
      console.error("Erreur génération image:", error);
      alert("Erreur lors de la génération de l'image");
    } finally {
      setIsGenerating(false);
    }
  };

  const suggestions = [
    "Un diagramme montrant le concept de conscience artificielle",
    "Une visualisation de réseaux de neurones interconnectés",
    "Un schéma illustrant la mémoire et l'apprentissage de l'IA",
    "Une représentation abstraite de la philosophie et de l'intelligence"
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-purple-200 hover:bg-purple-50 text-purple-700"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Générer une image
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-purple-600" />
            Génération d'image par l'IA
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Décrivez l'image à générer</Label>
            <Textarea
              placeholder="Ex: Un diagramme montrant la connexion entre mémoires et connaissances..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-slate-600">Suggestions rapides :</Label>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, idx) => (
                <Button
                  key={idx}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPrompt(suggestion)}
                  className="text-xs"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  {suggestion.slice(0, 40)}...
                </Button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isGenerating}
            >
              Annuler
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Génération...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Générer
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-slate-500 text-center pt-2">
            La génération d'image prend 5-10 secondes • L'image sera ajoutée à la conversation
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}