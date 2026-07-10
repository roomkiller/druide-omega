import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VAULT_CATEGORIES } from "./vaultCategories";

export default function VaultItemForm({ open, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("secret_commercial");
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!title || !content) return;
    setBusy(true);
    await onSave({ title, category, content });
    setBusy(false);
    setTitle(""); setCategory("secret_commercial"); setContent("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Nouvel élément chiffré</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre (visible, non chiffré)" />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {VAULT_CATEGORIES.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Contenu sensible — sera chiffré avant sauvegarde"
            rows={8}
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
            <Button type="submit" disabled={busy || !title || !content} className="bg-purple-600 hover:bg-purple-700">
              {busy ? "Chiffrement..." : "Chiffrer et sauvegarder"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}