import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Box, Loader2, Sparkles, Copy, Check } from "lucide-react";
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

const ASCII_TYPES = [
  { id: "flowchart", name: "Flowchart ASCII", example: "Processus avec flèches et boîtes" },
  { id: "tree", name: "Arbre Hiérarchique", example: "Structure arborescente" },
  { id: "graph", name: "Graphe de Relations", example: "Nœuds et connexions" },
  { id: "timeline", name: "Timeline ASCII", example: "Chronologie visuelle" },
  { id: "architecture", name: "Architecture Système", example: "Composants système" },
  { id: "concept_map", name: "Carte Conceptuelle", example: "Concepts interconnectés" }
];

export default function ASCIISchemaGenerator({ onSchemaGenerated }) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [schemaType, setSchemaType] = useState("flowchart");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSchema, setGeneratedSchema] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const enhancedPrompt = `Tu es un expert en visualisation de données et diagrammes ASCII.

Crée un schéma ASCII de type "${ASCII_TYPES.find(t => t.id === schemaType)?.name}" pour: ${prompt}

CONSIGNES STRICTES:
1. Utilise UNIQUEMENT des caractères ASCII standards: ┌─┐│└┘├┤┬┴┼╔═╗║╚╝╠╣╦╩╬►▼◄▲●○■□▪▫
2. Crée un diagramme CLAIR et BIEN STRUCTURÉ
3. Utilise des espaces pour l'alignement
4. Ajoute des légendes explicatives
5. Garde une largeur maximale de 80 caractères
6. Sois PRÉCIS et INFORMATIF

Format de sortie:
[Titre du schéma]

[Schéma ASCII]

[Légende explicative]

IMPORTANT: Retourne UNIQUEMENT le schéma ASCII, sans markdown, sans balises de code.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: enhancedPrompt,
        add_context_from_internet: false
      });

      setGeneratedSchema(result);
      
      if (onSchemaGenerated) {
        onSchemaGenerated(prompt, result, schemaType);
      }
    } catch (error) {
      console.error("Erreur génération schéma ASCII:", error);
      alert("Erreur lors de la génération du schéma ASCII");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setOpen(false);
    setGeneratedSchema("");
    setPrompt("");
  };

  return (
    <Dialog open={open} onOpenChange={(val) => val ? setOpen(true) : handleClose()}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-cyan-200 hover:bg-cyan-50 text-cyan-700"
        >
          <Box className="w-4 h-4 mr-2" />
          Schéma ASCII
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Box className="w-5 h-5 text-cyan-600" />
            Générateur de Schémas ASCII
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-y-auto">
          {!generatedSchema ? (
            <>
              <div className="space-y-2">
                <Label>Type de schéma</Label>
                <Select value={schemaType} onValueChange={setSchemaType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ASCII_TYPES.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        <div>
                          <div className="font-medium">{type.name}</div>
                          <div className="text-xs text-slate-500">{type.example}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Décrivez ce que vous voulez visualiser</Label>
                <Textarea
                  placeholder="Ex: Le cycle de vie d'une requête HTTP dans une architecture microservices..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={5}
                  className="resize-none font-mono text-sm"
                />
              </div>

              <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                <h4 className="font-semibold text-cyan-900 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Exemples de schémas ASCII générables
                </h4>
                <ul className="text-sm text-cyan-700 space-y-1 list-disc list-inside">
                  <li>Architecture de systèmes complexes</li>
                  <li>Flux de données et processus</li>
                  <li>Structures hiérarchiques</li>
                  <li>Timelines et chronologies</li>
                  <li>Graphes de dépendances</li>
                  <li>Cartes conceptuelles</li>
                </ul>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isGenerating}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Génération...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Générer le schéma
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Schéma généré</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copié !
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copier
                      </>
                    )}
                  </Button>
                </div>
                <div className="bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                  <pre className="font-mono text-xs whitespace-pre">{generatedSchema}</pre>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setGeneratedSchema("")}
                >
                  Nouveau schéma
                </Button>
                <Button onClick={handleClose}>
                  Fermer
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}