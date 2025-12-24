import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sigma, Loader2 } from "lucide-react";
import invokeLLM from "@/components/utils/LLMRouter";

export default function FormulaGenerator({ onFormulaGenerated }) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const result = await invokeLLM({
        prompt: `Génère des formules mathématiques pour: ${prompt}\n\nInclus:\n- Formules LaTeX\n- Explications détaillées\n- Exemples d'application`,
      });

      if (onFormulaGenerated) {
        onFormulaGenerated(prompt, result);
      }
      
      setOpen(false);
      setPrompt("");
    } catch (error) {
      console.error("Erreur génération formules:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full h-12 flex items-center justify-center gap-2 border-slate-300 hover:bg-purple-50 hover:border-purple-300"
        >
          <Sigma className="w-4 h-4 text-purple-600" />
          <span className="text-xs sm:text-sm">Formule</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>🧮 Générer Formules Math</DialogTitle>
        </DialogHeader>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ex: équation du second degré, formule d'Einstein, théorème de Pythagore..."
          className="min-h-[100px]"
        />
        <Button onClick={handleGenerate} disabled={!prompt.trim() || isGenerating} className="w-full">
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Générer"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}