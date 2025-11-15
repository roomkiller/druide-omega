/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - KB Version Commit with Notes & Activity Log               ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { GitCommit, Save } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function VersionCommitDialog({ knowledgeBase, previousVersion, onCommit }) {
  const [open, setOpen] = useState(false);
  const [commitMessage, setCommitMessage] = useState("");
  const [changeType, setChangeType] = useState("update");
  const [detailedNotes, setDetailedNotes] = useState("");
  const [isCommitting, setIsCommitting] = useState(false);

  const handleCommit = async () => {
    if (!commitMessage.trim()) {
      alert("Message de commit requis");
      return;
    }

    setIsCommitting(true);
    try {
      const versionNumber = (previousVersion?.version_number || 0) + 1;
      
      // Detect changes
      const changes = {
        title_changed: previousVersion?.title !== knowledgeBase.title,
        content_changed: previousVersion?.content !== knowledgeBase.content,
        summary_changed: previousVersion?.summary !== knowledgeBase.summary,
        tags_added: (knowledgeBase.tags || []).filter(t => 
          !(previousVersion?.tags || []).includes(t)
        ),
        tags_removed: (previousVersion?.tags || []).filter(t => 
          !(knowledgeBase.tags || []).includes(t)
        ),
        active_toggled: previousVersion?.active !== knowledgeBase.active
      };

      // Create version entry
      const versionData = {
        knowledge_base_id: knowledgeBase.id,
        version_number: versionNumber,
        commit_message: commitMessage,
        change_type: changeType,
        detailed_notes: detailedNotes,
        changes: changes,
        snapshot: {
          title: knowledgeBase.title,
          content: knowledgeBase.content,
          summary: knowledgeBase.summary,
          tags: knowledgeBase.tags,
          active: knowledgeBase.active
        },
        is_current: true,
        created_at: new Date().toISOString(),
        created_by: (await base44.auth.me()).email
      };

      // Mark previous versions as not current
      if (previousVersion) {
        await base44.entities.KnowledgeBase.update(previousVersion.id, {
          is_current: false
        });
      }

      // Create activity log entry
      await base44.entities.KnowledgeBase.create({
        ...versionData,
        entity_type: "kb_version"
      });

      // Update main KB with version info
      await base44.entities.KnowledgeBase.update(knowledgeBase.id, {
        current_version: versionNumber,
        last_commit_message: commitMessage,
        last_commit_date: new Date().toISOString()
      });

      onCommit?.(versionData);
      setOpen(false);
      setCommitMessage("");
      setDetailedNotes("");
    } catch (error) {
      console.error("Erreur commit:", error);
      alert("Erreur lors du commit");
    } finally {
      setIsCommitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="border-indigo-200 text-indigo-600">
          <GitCommit className="w-4 h-4 mr-2" />
          Commit Version
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Enregistrer une Nouvelle Version</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Type de Changement</Label>
            <div className="flex gap-2 mt-2">
              {["update", "feature", "fix", "refactor"].map(type => (
                <Badge
                  key={type}
                  variant={changeType === type ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setChangeType(type)}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="commit-message">Message de Commit *</Label>
            <Input
              id="commit-message"
              placeholder="Ex: Mise à jour des informations sur..."
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="detailed-notes">Notes Détaillées (optionnel)</Label>
            <Textarea
              id="detailed-notes"
              placeholder="Décrivez les changements en détail, la raison des modifications, les impacts attendus..."
              value={detailedNotes}
              onChange={(e) => setDetailedNotes(e.target.value)}
              rows={6}
              className="mt-2"
            />
          </div>

          {previousVersion && (
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600 mb-2">
                <strong>Version précédente:</strong> v{previousVersion.version_number}
              </p>
              <p className="text-xs text-slate-500">
                {previousVersion.commit_message}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleCommit}
              disabled={!commitMessage.trim() || isCommitting}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {isCommitting ? "Enregistrement..." : "Enregistrer Version"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}