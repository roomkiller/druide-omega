import React, { useState, useRef } from "react";
import { useLanguage } from "@/components/utils/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import { ChevronUp, ChevronDown, Copy, Trash2 } from "lucide-react";

export default function VideoTimeline({ sequence, onUpdate }) {
  const { language } = useLanguage();
  const [selectedFrameIdx, setSelectedFrameIdx] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const timelineRef = useRef(null);

  const selectedFrame = sequence.frames[selectedFrameIdx];
  const frameDuration = 1 / sequence.metadata.fps;

  const duplicateFrame = () => {
    if (selectedFrame) {
      const newFrames = [...sequence.frames];
      newFrames.splice(selectedFrameIdx + 1, 0, { ...selectedFrame, id: Date.now() });
      onUpdate({ frames: newFrames });
    }
  };

  const deleteFrame = () => {
    if (sequence.frames.length > 1) {
      onUpdate({ frames: sequence.frames.filter((_, idx) => idx !== selectedFrameIdx) });
      setSelectedFrameIdx(Math.max(0, selectedFrameIdx - 1));
    }
  };

  const moveFrame = (direction) => {
    if ((direction === -1 && selectedFrameIdx > 0) || (direction === 1 && selectedFrameIdx < sequence.frames.length - 1)) {
      const newFrames = [...sequence.frames];
      [newFrames[selectedFrameIdx], newFrames[selectedFrameIdx + direction]] = [
        newFrames[selectedFrameIdx + direction],
        newFrames[selectedFrameIdx]
      ];
      onUpdate({ frames: newFrames });
      setSelectedFrameIdx(selectedFrameIdx + direction);
    }
  };

  return (
    <div className="space-y-6">
      {/* Frame Details */}
      {selectedFrame && (
        <Card className="bg-slate-700 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white text-lg">
              {language === 'fr' ? 'Image' : 'Frame'} {selectedFrameIdx + 1}/{sequence.frames.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <img src={selectedFrame.url} alt="Preview" className="rounded-lg w-full h-32 object-cover" />
              <div className="space-y-2 text-sm text-slate-300">
                <p><strong>Durée:</strong> {frameDuration.toFixed(3)}s</p>
                <p><strong>Style:</strong> {selectedFrame.style}</p>
                <p><strong>Temps:</strong> {(selectedFrameIdx * frameDuration).toFixed(2)}s</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => moveFrame(-1)} disabled={selectedFrameIdx === 0} className="flex-1 bg-slate-600" size="sm">
                <ChevronUp className="w-4 h-4 mr-1" /> {language === 'fr' ? 'Haut' : 'Up'}
              </Button>
              <Button onClick={duplicateFrame} className="flex-1 bg-slate-600" size="sm">
                <Copy className="w-4 h-4 mr-1" /> {language === 'fr' ? 'Dupliquer' : 'Duplicate'}
              </Button>
              <Button onClick={() => moveFrame(1)} disabled={selectedFrameIdx === sequence.frames.length - 1} className="flex-1 bg-slate-600" size="sm">
                <ChevronDown className="w-4 h-4 mr-1" /> {language === 'fr' ? 'Bas' : 'Down'}
              </Button>
              <Button onClick={deleteFrame} variant="destructive" className="flex-1" size="sm">
                <Trash2 className="w-4 h-4 mr-1" /> {language === 'fr' ? 'Supprimer' : 'Delete'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      <Card className="bg-slate-700 border-slate-600">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-white">{language === 'fr' ? 'Timeline' : 'Timeline'}</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Zoom:</span>
              <Slider value={[zoomLevel]} onValueChange={(val) => setZoomLevel(val[0])} min={0.5} max={3} step={0.1} className="w-32" />
              <span className="text-xs text-slate-300">{(zoomLevel * 100).toFixed(0)}%</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto bg-slate-800 rounded-lg p-4" ref={timelineRef}>
            <div className="flex gap-2 pb-4" style={{ minWidth: `${(sequence.frames.length * 80 * zoomLevel)}px` }}>
              {sequence.frames.map((frame, idx) => (
                <motion.div
                  key={frame.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedFrameIdx(idx)}
                  className={`flex-shrink-0 cursor-pointer rounded-lg border-2 overflow-hidden transition ${
                    selectedFrameIdx === idx ? 'border-purple-500 shadow-lg shadow-purple-500/50' : 'border-slate-600 hover:border-slate-500'
                  }`}
                  style={{ width: `${80 * zoomLevel}px`, height: `${45 * zoomLevel}px` }}
                >
                  <img src={frame.url} alt={`Frame ${idx}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                    <span className="text-white text-xs font-bold">{idx + 1}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Timeline Info */}
          <div className="mt-4 grid grid-cols-3 gap-4 text-xs text-slate-300">
            <div>📊 {language === 'fr' ? 'Total' : 'Total'}: {(sequence.frames.length / sequence.metadata.fps).toFixed(2)}s</div>
            <div>🎬 {language === 'fr' ? 'Images' : 'Frames'}: {sequence.frames.length}</div>
            <div>⚡ {language === 'fr' ? 'FPS' : 'FPS'}: {sequence.metadata.fps}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}