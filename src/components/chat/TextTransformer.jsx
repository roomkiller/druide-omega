import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileEdit, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import invokeLLM from "@/components/utils/LLMRouter";

export default function TextTransformer({ onTextTransformed }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [mode, setMode] = useState("resume");
  const [isGenerating, setIsGenerating] = useState(false);

  const modes = {
    resume: "Résumer",
    reformule_formel: "Reformuler (formel)",
    reformule_creatif: "Reformuler (créatif)",
    simplifie: "Simplifier",
    developpe: "Développer"
  };

  const handleGenerate = async () => {
    if (!text.trim()) return;
    
    setIsGenerating(true);
    try {
      let instruction = "";
      if (mode === "resume") instruction = "Résume ce texte de manière concise:";
      else if (mode === "reformule_formel") instruction = "Reformule ce texte dans un style formel et professionnel:";
      else if (mode === "reformule_creatif") instruction = "Reformule ce texte dans un style créatif et engageant:";
      else if (mode === "simplifie") instruction = "Simplifie ce texte pour le rendre plus accessible:";
      else if (mode === "developpe") instruction = "Développe et enrichis ce texte avec plus de détails:";

      const result = await invokeLLM({
        prompt: `${instruction}\n\n${text}`,
      });

      if (onTextTransformed) {
        onTextTransformed(text, result, mode);
      }
      
      setOpen(false);
      setText("");
    } catch (error) {
      console.error("Erreur transformation texte:", error);
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
          <FileEdit className="w-4 h-4 text-purple-600" />
          <span className="text-xs sm:text-sm">Transformer</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>📝 Transformer le Texte</DialogTitle>
        </DialogHeader>
        <Select value={mode} onValueChange={setMode}>
          <SelectTrigger>
            <SelectValue placeholder="Mode" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(modes).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Collez votre texte ici..."
          className="min-h-[150px]"
        />
        <Button onClick={handleGenerate} disabled={!text.trim() || isGenerating} className="w-full">
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Transformer"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}