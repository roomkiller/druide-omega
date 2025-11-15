/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Registry Entry Editor                                      ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";

export default function RegistryEditor({ entry, onSave, onCancel }) {
  const [formData, setFormData] = useState(entry || {
    item_type: "component",
    item_name: "",
    file_path: "",
    description: "",
    status: "stable",
    version: "1.0.0",
    category: "",
    tags: [],
    dependencies: [],
    used_by: [],
    author: "",
    priority: "medium",
    notes: ""
  });

  const [newTag, setNewTag] = useState("");
  const [newDep, setNewDep] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      last_updated: new Date().toISOString()
    };

    if (entry) {
      await base44.entities.RegistryEntry.update(entry.id, data);
    } else {
      await base44.entities.RegistryEntry.create(data);
    }

    onSave();
  };

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), newTag]
      });
      setNewTag("");
    }
  };

  const removeTag = (tag) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  const addDependency = () => {
    if (newDep && !formData.dependencies.includes(newDep)) {
      setFormData({
        ...formData,
        dependencies: [...(formData.dependencies || []), newDep]
      });
      setNewDep("");
    }
  };

  const removeDependency = (dep) => {
    setFormData({
      ...formData,
      dependencies: formData.dependencies.filter(d => d !== dep)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <Card className="p-4">
        <h3 className="font-semibold text-slate-900 mb-4">Informations de base</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Type *</Label>
            <Select value={formData.item_type} onValueChange={(value) => setFormData({...formData, item_type: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="page">Page</SelectItem>
                <SelectItem value="component">Component</SelectItem>
                <SelectItem value="entity">Entity</SelectItem>
                <SelectItem value="integration">Integration</SelectItem>
                <SelectItem value="service">Service</SelectItem>
                <SelectItem value="utility">Utility</SelectItem>
                <SelectItem value="concept">Concept</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Statut *</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stable">Stable</SelectItem>
                <SelectItem value="beta">Beta</SelectItem>
                <SelectItem value="experimental">Experimental</SelectItem>
                <SelectItem value="deprecated">Deprecated</SelectItem>
                <SelectItem value="planned">Planned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4">
          <Label>Nom de l'élément *</Label>
          <Input
            value={formData.item_name}
            onChange={(e) => setFormData({...formData, item_name: e.target.value})}
            placeholder="Ex: ConsciousnessMetrics"
            required
          />
        </div>

        <div className="mt-4">
          <Label>Chemin du fichier *</Label>
          <Input
            value={formData.file_path}
            onChange={(e) => setFormData({...formData, file_path: e.target.value})}
            placeholder="Ex: components/consciousness/ConsciousnessMetrics"
            required
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <Label>Version</Label>
            <Input
              value={formData.version}
              onChange={(e) => setFormData({...formData, version: e.target.value})}
              placeholder="1.0.0"
            />
          </div>

          <div>
            <Label>Priorité</Label>
            <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Description */}
      <Card className="p-4">
        <h3 className="font-semibold text-slate-900 mb-4">Documentation</h3>
        
        <div>
          <Label>Description</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Description détaillée de l'élément..."
            rows={4}
          />
        </div>

        <div className="mt-4">
          <Label>Catégorie</Label>
          <Input
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            placeholder="Ex: UI, Data, Logic"
          />
        </div>

        <div className="mt-4">
          <Label>Auteur</Label>
          <Input
            value={formData.author}
            onChange={(e) => setFormData({...formData, author: e.target.value})}
            placeholder="Nom de l'auteur"
          />
        </div>

        <div className="mt-4">
          <Label>Notes techniques</Label>
          <Textarea
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            placeholder="Notes, détails d'implémentation..."
            rows={3}
          />
        </div>
      </Card>

      {/* Tags */}
      <Card className="p-4">
        <h3 className="font-semibold text-slate-900 mb-4">Tags</h3>
        
        <div className="flex gap-2 mb-3">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Ajouter un tag..."
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          />
          <Button type="button" onClick={addTag} size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {formData.tags && formData.tags.map((tag, idx) => (
            <Badge key={idx} variant="secondary" className="flex items-center gap-1">
              {tag}
              <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
            </Badge>
          ))}
        </div>
      </Card>

      {/* Dependencies */}
      <Card className="p-4">
        <h3 className="font-semibold text-slate-900 mb-4">Dépendances</h3>
        
        <div className="flex gap-2 mb-3">
          <Input
            value={newDep}
            onChange={(e) => setNewDep(e.target.value)}
            placeholder="Nom de la dépendance..."
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDependency())}
          />
          <Button type="button" onClick={addDependency} size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {formData.dependencies && formData.dependencies.map((dep, idx) => (
            <Badge key={idx} variant="outline" className="flex items-center gap-1">
              {dep}
              <X className="w-3 h-3 cursor-pointer" onClick={() => removeDependency(dep)} />
            </Badge>
          ))}
        </div>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" className="bg-gradient-to-r from-indigo-600 to-purple-600">
          {entry ? "Mettre à jour" : "Créer"}
        </Button>
      </div>
    </form>
  );
}