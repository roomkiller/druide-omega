/**
 * Version Control for Video Projects
 * Enables reverting to previous states
 */

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/utils/LanguageContext";
import { motion } from "framer-motion";
import { Clock, RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";

export default function VersionControl({ projectId, onVersionRestored }) {
  const { language } = useLanguage();
  const [versions, setVersions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadVersions();
  }, [projectId]);

  const loadVersions = async () => {
    try {
      const project = await base44.entities.VideoProject.list({ id: projectId });
      setVersions(project[0]?.versions || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const saveVersion = async (description) => {
    try {
      const project = await base44.entities.VideoProject.list({ id: projectId });
      const newVersion = {
        version_number: (project[0]?.versions?.length || 0) + 1,
        timestamp: new Date().toISOString(),
        snapshot: { /* current state */ },
        description: description || "Auto-save"
      };

      await base44.entities.VideoProject.update(projectId, {
        versions: [...(project[0]?.versions || []), newVersion]
      });

      loadVersions();
      toast.success(language === 'fr' ? "Version sauvegardée" : "Version saved");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const restoreVersion = async (versionNumber) => {
    if (!confirm(language === 'fr' ? "Restaurer cette version?" : "Restore this version?")) return;

    try {
      onVersionRestored?.(versionNumber);
      toast.success(language === 'fr' ? "Version restaurée" : "Version restored");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Card className="bg-slate-900 border-green-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-400">
          <Clock className="w-5 h-5" />
          {language === 'fr' ? "Contrôle de Version" : "Version Control"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          onClick={() => saveVersion("Manual save")}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {language === 'fr' ? "Sauvegarder version" : "Save version"}
        </Button>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {versions.map((version, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate-800 p-2 rounded text-xs space-y-1"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold">v{version.version_number}</span>
                <span className="text-slate-400 text-xs">
                  {new Date(version.timestamp).toLocaleDateString()}
                </span>
              </div>
              <p className="text-slate-400">{version.description}</p>
              <button
                onClick={() => restoreVersion(version.version_number)}
                className="text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded hover:bg-green-600/40 w-full"
              >
                <RotateCcw className="w-3 h-3 inline mr-1" />
                {language === 'fr' ? "Restaurer" : "Restore"}
              </button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}