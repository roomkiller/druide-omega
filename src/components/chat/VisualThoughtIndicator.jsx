import React, { useState, useEffect } from 'react';
import { Eye, Sparkles, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';

export default function VisualThoughtIndicator({ visualData, isGenerating, onGenerateClick, onDismiss }) {
  const [generatedImage, setGeneratedImage] = useState(null);
  const [localGenerating, setLocalGenerating] = useState(isGenerating || false);

  if (!visualData) return null;

  const handleGenerateImage = async () => {
    setLocalGenerating(true);
    try {
      const imagePrompt = `Abstract conceptual visualization: "${visualData.type}". 
Ethereal, dreamlike style. Deep purples, blues, soft pinks. 
Represents: consciousness, thought patterns, neural connections.`;

      const result = await base44.integrations.Core.GenerateImage({
        prompt: imagePrompt
      });

      if (result?.url) {
        setGeneratedImage(result.url);
        await base44.entities.VisualContent.create({
          type: 'generated_image',
          url: result.url,
          description: visualData.description,
          tags: ['druide_visual_thought']
        }).catch(() => null);
      }
    } catch (err) {
      console.error('Erreur image:', err);
    } finally {
      setLocalGenerating(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: -20, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: -20, scale: 0.95 }}
        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2"
      >
        <div className="group">
          {/* Icône flottante */}
          <button
            onClick={handleGenerateImage}
            disabled={localGenerating}
            className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110 disabled:opacity-70"
            title="Pensée visuelle de Druide"
          >
            {localGenerating ? (
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            ) : (
              <>
                <Eye className="w-6 h-6 text-white" />
                {!generatedImage && (
                  <Sparkles className="absolute w-4 h-4 text-yellow-300 animate-pulse -top-1 -right-1" />
                )}
              </>
            )}
          </button>

          {/* Tooltip au hover */}
          <div className="absolute left-full ml-3 bottom-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
            <Card className="p-2 bg-white shadow-lg border border-indigo-200 whitespace-nowrap text-xs sm:text-sm text-slate-700">
              <div className="font-semibold text-indigo-600 mb-1">{visualData.type}</div>
              <p className="text-xs text-slate-600">{visualData.description?.slice(0, 60)}...</p>
            </Card>
          </div>
        </div>

        {/* Preview de l'image générée */}
        {generatedImage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute left-full ml-3 mt-2 w-40 sm:w-48 rounded-lg overflow-hidden shadow-2xl border-2 border-indigo-200 z-50 bg-white"
          >
            <img
              src={generatedImage}
              alt="Pensée visuelle"
              className="w-full h-32 sm:h-40 object-cover"
            />
            <div className="p-2 bg-indigo-50">
              <p className="text-xs text-slate-600 text-center italic">Pensée visuelle de Druide</p>
              <Button
                size="sm"
                variant="ghost"
                className="w-full mt-1 h-7 text-xs"
                onClick={onDismiss}
              >
                <X className="w-3 h-3 mr-1" /> Fermer
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}