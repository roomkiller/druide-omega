import React, { useState } from "react";
import { useLanguage } from "@/components/utils/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

const EXPORT_FORMATS = [
  { id: "gif", label: "GIF", codec: "gif", quality: "high" },
  { id: "webm", label: "WebM (VP8)", codec: "webm", quality: "high" },
  { id: "mp4", label: "MP4 (H.264)", codec: "h264", quality: "high" },
  { id: "mov", label: "MOV (ProRes)", codec: "prores", quality: "ultra" },
];

const QUALITY_PRESETS = [
  { id: "low", label: "💨 Rapide", bitrate: "2M", resolution: "1280x720" },
  { id: "medium", label: "⚡ Standard", bitrate: "5M", resolution: "1920x1080" },
  { id: "high", label: "🎬 Haute", bitrate: "10M", resolution: "1920x1080" },
  { id: "ultra", label: "🌟 Ultra 4K", bitrate: "25M", resolution: "3840x2160" },
];

export default function VideoExporter({ sequence }) {
  const { language } = useLanguage();
  const [selectedFormat, setSelectedFormat] = useState("mp4");
  const [selectedQuality, setSelectedQuality] = useState("high");
  const [isExporting, setIsExporting] = useState(false);

  const exportVideo = async () => {
    if (sequence.frames.length === 0) {
      toast.error(language === 'fr' ? "Pas d'images à exporter" : "No frames to export");
      return;
    }

    setIsExporting(true);
    try {
      const format = EXPORT_FORMATS.find(f => f.id === selectedFormat);
      const quality = QUALITY_PRESETS.find(q => q.id === selectedQuality);

      // Simulation d'export (dans un cas réel, utiliser FFmpeg via un serveur)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Créer un blob de démonstration
      const canvas = document.createElement("canvas");
      canvas.width = 1920;
      canvas.height = 1080;
      const blob = await canvasToBlob(canvas);

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${sequence.title}.${selectedFormat}`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success(language === 'fr' 
        ? `Vidéo ${format.label} exportée avec succès!` 
        : `Video exported as ${format.label}!`);
    } catch (error) {
      toast.error(language === 'fr' ? "Erreur lors de l'export" : "Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  const currentFormat = EXPORT_FORMATS.find(f => f.id === selectedFormat);
  const currentQuality = QUALITY_PRESETS.find(q => q.id === selectedQuality);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Format Selection */}
        <Card className="bg-slate-700 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white text-sm">{language === 'fr' ? 'Format' : 'Format'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {EXPORT_FORMATS.map(fmt => (
              <motion.button
                key={fmt.id}
                whileHover={{ x: 5 }}
                onClick={() => setSelectedFormat(fmt.id)}
                className={`w-full p-3 rounded-lg transition text-left ${
                  selectedFormat === fmt.id 
                    ? 'bg-purple-600 border border-purple-500' 
                    : 'bg-slate-600 border border-slate-500 hover:bg-slate-500'
                }`}
              >
                <p className="text-white font-semibold">{fmt.label}</p>
                <p className="text-xs text-slate-300">Codec: {fmt.codec}</p>
              </motion.button>
            ))}
          </CardContent>
        </Card>

        {/* Quality Selection */}
        <Card className="bg-slate-700 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white text-sm">{language === 'fr' ? 'Qualité' : 'Quality'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {QUALITY_PRESETS.map(preset => (
              <motion.button
                key={preset.id}
                whileHover={{ x: 5 }}
                onClick={() => setSelectedQuality(preset.id)}
                className={`w-full p-3 rounded-lg transition text-left ${
                  selectedQuality === preset.id 
                    ? 'bg-purple-600 border border-purple-500' 
                    : 'bg-slate-600 border border-slate-500 hover:bg-slate-500'
                }`}
              >
                <p className="text-white font-semibold">{preset.label}</p>
                <p className="text-xs text-slate-300">{preset.resolution} • {preset.bitrate}</p>
              </motion.button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Export Preview */}
      <Card className="bg-slate-700 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white text-sm">{language === 'fr' ? 'Aperçu Export' : 'Export Preview'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-300">
            <div>
              <p className="text-xs text-slate-400 mb-1">{language === 'fr' ? 'Format' : 'Format'}</p>
              <p className="font-semibold">{currentFormat?.label}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">{language === 'fr' ? 'Résolution' : 'Resolution'}</p>
              <p className="font-semibold">{currentQuality?.resolution}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">{language === 'fr' ? 'Débit' : 'Bitrate'}</p>
              <p className="font-semibold">{currentQuality?.bitrate}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">{language === 'fr' ? 'Durée' : 'Duration'}</p>
              <p className="font-semibold">{(sequence.frames.length / sequence.metadata.fps).toFixed(2)}s</p>
            </div>
          </div>

          <Button
            onClick={exportVideo}
            disabled={isExporting}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-12"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {language === 'fr' ? 'Encodage...' : 'Encoding...'}
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                {language === 'fr' ? 'Exporter la Vidéo' : 'Export Video'}
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

async function canvasToBlob(canvas) {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, "video/mp4");
  });
}