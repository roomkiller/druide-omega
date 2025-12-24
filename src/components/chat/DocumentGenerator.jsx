import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Loader2 } from "lucide-react";
import invokeLLM from "@/components/utils/LLMRouter";

export default function DocumentGenerator({ onDocumentGenerated }) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const result = await invokeLLM({
        prompt: `Génère un document professionnel basé sur: ${prompt}\n\nFormat: Titre, sections structurées, contenu détaillé en markdown.`,
      });

      if (onDocumentGenerated) {
        onDocumentGenerated(prompt, result);
      }
      
      setOpen(false);
      setPrompt("");
    } catch (error) {
      console.error("Erreur génération document:", error);
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
          <FileText className="w-4 h-4 text-purple-600" />
          <span className="text-xs sm:text-sm">Document</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>📄 Générer un Document</DialogTitle>
        </DialogHeader>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ex: Rapport d'activité 2025, CV professionnel, lettre de motivation..."
          className="min-h-[100px]"
        />
        <Button onClick={handleGenerate} disabled={!prompt.trim() || isGenerating} className="w-full">
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Générer"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}