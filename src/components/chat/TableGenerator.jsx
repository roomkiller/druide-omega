import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Table, Loader2 } from "lucide-react";
import invokeLLM from "@/components/utils/LLMRouter";

export default function TableGenerator({ onTableGenerated }) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const result = await invokeLLM({
        prompt: `Génère un tableau de données structuré pour: ${prompt}\n\nFormat: tableau markdown avec colonnes et lignes pertinentes, données réalistes.`,
      });

      if (onTableGenerated) {
        onTableGenerated(prompt, result);
      }
      
      setOpen(false);
      setPrompt("");
    } catch (error) {
      console.error("Erreur génération tableau:", error);
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
          <Table className="w-4 h-4 text-purple-600" />
          <span className="text-xs sm:text-sm">Tableau</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>📊 Créer un Tableau</DialogTitle>
        </DialogHeader>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ex: planning hebdomadaire, comparaison produits, budget mensuel..."
          className="min-h-[100px]"
        />
        <Button onClick={handleGenerate} disabled={!prompt.trim() || isGenerating} className="w-full">
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Générer"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}