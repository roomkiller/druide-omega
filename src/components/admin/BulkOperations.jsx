import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Archive, Tag } from "lucide-react";

export default function BulkOperations() {
  const [entity, setEntity] = useState("Conversation");
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (days) => {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      
      const items = await base44.asServiceRole.entities[entity].list();
      const toDelete = items.filter(i => new Date(i.created_date) < cutoff);
      
      for (const item of toDelete) {
        await base44.asServiceRole.entities[entity].delete(item.id);
      }
      
      return toDelete.length;
    },
    onSuccess: (count) => {
      alert(`${count} éléments supprimés`);
      queryClient.invalidateQueries();
    }
  });

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4">Opérations en masse</h3>
      
      <div className="space-y-4">
        <Select value={entity} onValueChange={setEntity}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Conversation">Conversations</SelectItem>
            <SelectItem value="Memory">Mémoires</SelectItem>
            <SelectItem value="KnowledgeBase">Connaissances</SelectItem>
            <SelectItem value="ErrorLog">Logs d'erreurs</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button onClick={() => deleteMutation.mutate(90)} variant="outline">
            <Trash2 className="w-4 h-4 mr-2" />
            Supprimer +90j
          </Button>
          <Button onClick={() => deleteMutation.mutate(180)} variant="outline">
            <Trash2 className="w-4 h-4 mr-2" />
            Supprimer +180j
          </Button>
        </div>
      </div>
    </Card>
  );
}