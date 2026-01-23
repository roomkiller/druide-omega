import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { toast } from "sonner";

export default function PhaseEditModal({ phase, onClose, onSave }) {
  const [formData, setFormData] = useState(phase);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await base44.entities.UpdatePhase.update(phase.id, formData);
      toast.success("Phase mise à jour");
      onSave();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl"
      >
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-white">Éditer Phase {phase.phase_number}</CardTitle>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </CardHeader>
          <CardContent className="space-y-4 max-h-96 overflow-y-auto">
            <div>
              <label className="text-sm text-gray-300">Titre</label>
              <Input
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white mt-1"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">Description</label>
              <Input
                value={formData.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-300">Progression (%)</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progress || 0}
                  onChange={(e) => handleChange("progress", parseInt(e.target.value))}
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300">Durée (semaines)</label>
                <Input
                  type="number"
                  value={formData.duration_weeks || 0}
                  onChange={(e) => handleChange("duration_weeks", parseInt(e.target.value))}
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-300">Responsable</label>
              <Input
                value={formData.owner || ""}
                onChange={(e) => handleChange("owner", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white mt-1"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">Notes internes</label>
              <Input
                value={formData.notes || ""}
                onChange={(e) => handleChange("notes", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white mt-1"
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-700">
              <Button onClick={onClose} variant="outline" className="border-slate-600 flex-1">
                Annuler
              </Button>
              <Button onClick={handleSubmit} disabled={loading} className="bg-purple-600 hover:bg-purple-700 flex-1">
                {loading ? "Mise à jour..." : "Enregistrer"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}