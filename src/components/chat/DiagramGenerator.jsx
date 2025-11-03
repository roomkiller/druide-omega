import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Network, Loader2, Zap, GitBranch, Layers } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { base44 } from "@/api/base44Client";

const DIAGRAM_TYPES = [
  {
    id: "flowchart",
    name: "Flowchart / Organigramme",
    icon: GitBranch,
    description: "Représente un processus ou un flux de décision",
    prompt: "Create a detailed flowchart diagram showing"
  },
  {
    id: "mindmap",
    name: "Mind Map / Carte Mentale",
    icon: Network,
    description: "Visualise les connexions entre concepts",
    prompt: "Create a comprehensive mind map illustrating"
  },
  {
    id: "architecture",
    name: "Diagramme d'Architecture",
    icon: Layers,
    description: "Structure de système ou architecture",
    prompt: "Create a detailed architecture diagram representing"
  },
  {
    id: "process",
    name: "Diagramme de Processus",
    icon: Zap,
    description: "Étapes séquentielles d'un processus",
    prompt: "Create a clear process diagram showing the steps of"
  }
];

export default function DiagramGenerator({ onDiagramGenerated }) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [diagramType, setDiagramType] = useState("flowchart");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const selectedType = DIAGRAM_TYPES.find(t => t.id === diagramType);
      
      const enhancedPrompt = `${selectedType.prompt} ${prompt}. 
      
Style requirements:
- Clean, professional diagram with clear labels
- Use appropriate shapes and connectors
- High contrast colors for readability
- Modern, minimalist design
- White or light background
- Clear hierarchy and flow
- Professional typography

Create a ${selectedType.name.toLowerCase()} that is easy to understand and visually appealing.`;
      
      const result = await base44.integrations.Core.GenerateImage({
        prompt: enhancedPrompt
      });

      onDiagramGenerated(prompt, result.url, diagramType);
      setOpen(false);
      setPrompt("");
    } catch (error) {
      console.error("Erreur génération diagramme:", error);
      alert("Erreur lors de la génération du diagramme");
    } finally {
      setIsGenerating(false);
    }
  };

  const suggestions = [
    "Le cycle de vie d'un projet de développement logiciel",
    "Les connexions entre mémoire, conscience et intelligence artificielle",
    "Le processus de prise de décision éthique",
    "L'architecture d'un système d'IA conversationnelle"
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-green-200 hover:bg-green-50 text-green-700"
        >
          <Network className="w-4 h-4 mr-2" />
          Créer un diagramme
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Network className="w-5 h-5 text-green-600" />
            Générateur de Diagrammes
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Type de diagramme</Label>
            <Select value={diagramType} onValueChange={setDiagramType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DIAGRAM_TYPES.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    <div className="flex items-center gap-2">
                      <type.icon className="w-4 h-4" />
                      <span>{type.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-600">
              {DIAGRAM_TYPES.find(t => t.id === diagramType)?.description}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Décrivez ce que vous voulez visualiser</Label>
            <Textarea
              placeholder="Ex: Le processus de traitement d'une requête utilisateur dans notre système..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-slate-600">Suggestions rapides :</Label>
            <div className="grid grid-cols-2 gap-2">
              {suggestions.map((suggestion, idx) => (
                <Button
                  key={idx}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPrompt(suggestion)}
                  className="text-xs h-auto py-2 justify-start"
                >
                  <Zap className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="line-clamp-2 text-left">{suggestion}</span>
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
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Génération...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Générer le diagramme
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-slate-500 text-center pt-2">
            La génération prend 5-15 secondes • Le diagramme sera ajouté à la conversation
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}