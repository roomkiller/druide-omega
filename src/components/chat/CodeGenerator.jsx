import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Code, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import invokeLLM from "@/components/utils/LLMRouter";

export default function CodeGenerator({ onCodeGenerated }) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const result = await invokeLLM({
        prompt: `Génère du code ${language} pour: ${prompt}\n\nInclus:\n- Code propre et commenté\n- Explications\n- Exemples d'utilisation`,
      });

      if (onCodeGenerated) {
        onCodeGenerated(prompt, result, language);
      }
      
      setOpen(false);
      setPrompt("");
    } catch (error) {
      console.error("Erreur génération code:", error);
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
          <Code className="w-4 h-4 text-purple-600" />
          <span className="text-xs sm:text-sm">Code</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>💻 Générer du Code</DialogTitle>
        </DialogHeader>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger>
            <SelectValue placeholder="Langage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="react">React</SelectItem>
            <SelectItem value="typescript">TypeScript</SelectItem>
            <SelectItem value="sql">SQL</SelectItem>
          </SelectContent>
        </Select>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ex: fonction de tri, API REST, composant React..."
          className="min-h-[100px]"
        />
        <Button onClick={handleGenerate} disabled={!prompt.trim() || isGenerating} className="w-full">
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Générer"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}