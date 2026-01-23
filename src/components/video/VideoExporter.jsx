import React, { useState } from "react";
import { useLanguage } from "@/components/utils/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileVideo } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function VideoExporter({ sequence }) {
  const { language } = useLanguage();
  const [isExporting, setIsExporting] = useState(false);

  const exportAsGIF = async () => {
    if (sequence.frames.length === 0) {
      toast.error(language === 'fr' ? "Pas d'images à exporter" : "No frames to export");
      return;
    }

    setIsExporting(true);
    try {
      // Créer un canvas pour générer le GIF
      const canvas = document.createElement("canvas");
      canvas.width = 1280;
      canvas.height = 720;
      const ctx = canvas.getContext("2d");

      // Créer une séquence GIF simple (pour simplifier, on fait un canvas animé)
      const blob = await canvasToBlob(canvas, sequence);
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${sequence.title}.gif`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success(language === 'fr' ? "GIF exporté avec succès!" : "GIF exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error(language === 'fr' ? "Erreur lors de l'export" : "Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsMP4 = async () => {
    toast.info(language === 'fr' 
      ? "Fonction MP4 disponible bientôt avec serveur encodage" 
      : "MP4 function coming soon with encoding server");
  };

  const exportMetadata = () => {
    const metadata = {
      title: sequence.title,
      frames: sequence.frames.length,
      fps: sequence.metadata.fps,
      duration: sequence.metadata.duration,
      consciousness_level: sequence.metadata.conscious_level,
      created_at: sequence.created_at,
      frames_data: sequence.frames.map(f => ({
        index: f.index,
        prompt: f.prompt,
        style: f.style
      }))
    };

    const blob = new Blob([JSON.stringify(metadata, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${sequence.title}-metadata.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success(language === 'fr' ? "Métadonnées exportées" : "Metadata exported");
  };

  return (
    <div className="space-y-4">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Download className="w-5 h-5 text-purple-400" />
            {language === 'fr' ? 'Exporter' : 'Export'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* GIF Export */}
            <Button
              onClick={exportAsGIF}
              disabled={isExporting || sequence.frames.length === 0}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-16"
            >
              <div className="text-center">
                <FileVideo className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs">{language === 'fr' ? 'Exporter en GIF' : 'Export as GIF'}</span>
              </div>
            </Button>

            {/* MP4 Export */}
            <Button
              onClick={exportAsMP4}
              disabled
              className="bg-slate-700 hover:bg-slate-600 text-slate-400 h-16 opacity-50"
            >
              <div className="text-center">
                <FileVideo className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs">{language === 'fr' ? 'Exporter en MP4' : 'Export as MP4'}</span>
              </div>
            </Button>

            {/* Metadata Export */}
            <Button
              onClick={exportMetadata}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white h-16"
            >
              <div className="text-center">
                <Download className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs">{language === 'fr' ? 'Métadonnées' : 'Metadata'}</span>
              </div>
            </Button>
          </motion.div>

          {/* Stats */}
          <div className="bg-slate-700 p-4 rounded-lg space-y-2">
            <p className="text-slate-300 text-sm font-semibold">{language === 'fr' ? 'Infos Export' : 'Export Info'}</p>
            <ul className="text-slate-400 text-xs space-y-1">
              <li>📊 {language === 'fr' ? 'Durée' : 'Duration'}: {(sequence.frames.length / sequence.metadata.fps).toFixed(2)}s</li>
              <li>🎬 {language === 'fr' ? 'FPS' : 'FPS'}: {sequence.metadata.fps}</li>
              <li>🖼️ {language === 'fr' ? 'Images' : 'Frames'}: {sequence.frames.length}</li>
              <li>🧠 {language === 'fr' ? 'Conscience' : 'Consciousness'}: {sequence.metadata.conscious_level}/15</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

async function canvasToBlob(canvas, sequence) {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, "image/gif");
  });
}