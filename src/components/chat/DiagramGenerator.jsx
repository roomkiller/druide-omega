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
  const [generatedDiagram, setGeneratedDiagram] = useState(null);

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
      
      const response = await base44.integrations.Core.GenerateImage({
        prompt: enhancedPrompt
      });

      const result = { url: response.url || response };

      // Sauvegarder dans VisualContent
      await base44.entities.VisualContent.create({
        type: "diagram",
        url: result.url,
        description: `Diagramme ${selectedType.name}: ${prompt}`,
        prompt: enhancedPrompt,
        tags: ["diagram", diagramType, "ai-generated"]
      });

      setGeneratedDiagram(result.url);

      if (onDiagramGenerated) {
        onDiagramGenerated(prompt, result.url, diagramType);
      }
    } catch (error) {
      console.error("Erreur génération diagramme:", error);
      alert(`Erreur lors de la génération du diagramme: ${error.message || error}`);
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
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
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

          {!generatedDiagram ? (
            <>
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
            </>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3 text-green-900 font-semibold">
                  <Network className="w-5 h-5" />
                  Diagramme généré avec succès!
                </div>
                <div className="rounded-lg overflow-hidden border border-green-300">
                  <img 
                    src={generatedDiagram} 
                    alt="Diagramme généré"
                    className="w-full h-auto"
                    onError={(e) => {
                      console.error("Erreur chargement diagramme:", generatedDiagram);
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23ddd' width='400' height='300'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EErreur chargement%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setGeneratedDiagram(null);
                    setPrompt("");
                  }}
                  className="flex-1"
                >
                  Nouveau diagramme
                </Button>
                <Button
                  onClick={() => {
                    setOpen(false);
                    setPrompt("");
                    setGeneratedDiagram(null);
                  }}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600"
                >
                  Fermer
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}