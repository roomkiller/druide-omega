import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload, Link as LinkIcon, FileText, Loader2, Plus } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function UploadKnowledgeDialog({ onSuccess }) {
  const [open, setOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("file");

  // File upload state
  const [file, setFile] = useState(null);
  const [fileTitle, setFileTitle] = useState("");

  // URL state
  const [url, setUrl] = useState("");
  const [urlTitle, setUrlTitle] = useState("");

  // Text state
  const [textContent, setTextContent] = useState("");
  const [textTitle, setTextTitle] = useState("");

  const resetForm = () => {
    setFile(null);
    setFileTitle("");
    setUrl("");
    setUrlTitle("");
    setTextContent("");
    setTextTitle("");
    setActiveTab("file");
  };

  const handleFileUpload = async () => {
    if (!file || !fileTitle.trim()) return;

    setIsProcessing(true);
    try {
      // Upload file
      const { file_url } = await base44.integrations.Core.UploadFile({ file });

      // Fetch file content
      const response = await fetch(file_url);
      const content = await response.text();

      // Create knowledge base entry
      const kb = await base44.entities.KnowledgeBase.create({
        title: fileTitle.trim(),
        source_type: "file",
        file_url: file_url,
        content: content.slice(0, 50000), // Limit to 50k chars
        status: "processing",
        active: true,
        access_count: 0
      });

      // Process in background
      processKnowledgeBase(kb.id, content.slice(0, 50000));

      onSuccess?.();
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error("Erreur upload fichier:", error);
      alert("Erreur lors de l'upload du fichier");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUrlSubmit = async () => {
    if (!url.trim() || !urlTitle.trim()) return;

    setIsProcessing(true);
    try {
      // Fetch URL content using LLM with internet context
      const content = await base44.integrations.Core.InvokeLLM({
        prompt: `Extrait le contenu textuel principal de cette URL: ${url}. Retourne uniquement le texte principal, sans HTML ni code.`,
        add_context_from_internet: true
      });

      // Create knowledge base entry
      const kb = await base44.entities.KnowledgeBase.create({
        title: urlTitle.trim(),
        source_type: "url",
        source_url: url.trim(),
        content: content.slice(0, 50000),
        status: "processing",
        active: true,
        access_count: 0
      });

      // Process in background
      processKnowledgeBase(kb.id, content.slice(0, 50000));

      onSuccess?.();
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error("Erreur fetch URL:", error);
      alert("Erreur lors de la récupération de l'URL");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTextSubmit = async () => {
    if (!textContent.trim() || !textTitle.trim()) return;

    setIsProcessing(true);
    try {
      const kb = await base44.entities.KnowledgeBase.create({
        title: textTitle.trim(),
        source_type: "text",
        content: textContent.trim().slice(0, 50000),
        status: "processing",
        active: true,
        access_count: 0
      });

      // Process in background
      processKnowledgeBase(kb.id, textContent.trim().slice(0, 50000));

      onSuccess?.();
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error("Erreur création texte:", error);
      alert("Erreur lors de la création");
    } finally {
      setIsProcessing(false);
    }
  };

  const processKnowledgeBase = async (kbId, content) => {
    try {
      const prompt = `Analyse ce document et extrait:
1. Un résumé concis (2-3 phrases)
2. Les 5-10 faits ou informations clés les plus importantes
3. 3-5 tags/mots-clés pertinents

Document:
${content.slice(0, 10000)}

Retourne un JSON avec:
{
  "summary": "résumé du document",
  "facts": ["fait 1", "fait 2", ...],
  "tags": ["tag1", "tag2", ...]
}`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        response_json_schema: {
          type: "object",
          properties: {
            summary: { type: "string" },
            facts: { type: "array", items: { type: "string" } },
            tags: { type: "array", items: { type: "string" } }
          }
        }
      });

      // Update knowledge base
      await base44.entities.KnowledgeBase.update(kbId, {
        summary: result.summary,
        extracted_facts: result.facts,
        tags: result.tags,
        status: "ready"
      });

      // Store key facts as memories
      for (const fact of result.facts.slice(0, 5)) {
        await base44.entities.Memory.create({
          type: "fact",
          content: fact,
          context: `Document: ${content.slice(0, 50)}...`,
          importance: 7,
          tags: result.tags,
          access_count: 0
        });
      }
    } catch (error) {
      console.error("Erreur traitement KB:", error);
      await base44.entities.KnowledgeBase.update(kbId, {
        status: "error"
      });
    }
  };

  const handleSubmit = () => {
    switch (activeTab) {
      case "file":
        handleFileUpload();
        break;
      case "url":
        handleUrlSubmit();
        break;
      case "text":
        handleTextSubmit();
        break;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une Source
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ajouter une Source de Connaissance</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="file">
              <Upload className="w-4 h-4 mr-2" />
              Fichier
            </TabsTrigger>
            <TabsTrigger value="url">
              <LinkIcon className="w-4 h-4 mr-2" />
              URL
            </TabsTrigger>
            <TabsTrigger value="text">
              <FileText className="w-4 h-4 mr-2" />
              Texte
            </TabsTrigger>
          </TabsList>

          <TabsContent value="file" className="space-y-4">
            <div className="space-y-2">
              <Label>Titre du document</Label>
              <Input
                placeholder="Mon document..."
                value={fileTitle}
                onChange={(e) => setFileTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Fichier (PDF, TXT, CSV...)</Label>
              <Input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                accept=".txt,.pdf,.csv,.doc,.docx"
              />
            </div>
          </TabsContent>

          <TabsContent value="url" className="space-y-4">
            <div className="space-y-2">
              <Label>Titre</Label>
              <Input
                placeholder="Article ou page web..."
                value={urlTitle}
                onChange={(e) => setUrlTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>URL</Label>
              <Input
                placeholder="https://..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="text" className="space-y-4">
            <div className="space-y-2">
              <Label>Titre</Label>
              <Input
                placeholder="Mes notes..."
                value={textTitle}
                onChange={(e) => setTextTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Contenu</Label>
              <Textarea
                placeholder="Collez ou tapez votre texte ici..."
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                rows={10}
                className="font-mono text-sm"
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isProcessing}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Traitement...
              </>
            ) : (
              "Ajouter"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}