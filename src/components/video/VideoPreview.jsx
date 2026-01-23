import React, { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/utils/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { motion } from "framer-motion";

export default function VideoPreview({ sequence }) {
  const { language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrameIdx, setCurrentFrameIdx] = useState(0);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const totalFrames = sequence.frames.length;
  const fps = sequence.metadata.fps;
  const frameInterval = 1000 / fps;

  useEffect(() => {
    if (!isPlaying || !canvasRef.current || totalFrames === 0) return;

    const startTime = Date.now();
    let lastFrameTime = startTime;

    const animate = () => {
      const now = Date.now();
      
      if (now - lastFrameTime >= frameInterval) {
        const elapsed = now - startTime;
        const frameNum = Math.floor((elapsed / 1000) * fps) % totalFrames;
        setCurrentFrameIdx(frameNum);
        lastFrameTime = now;

        if (frameNum === totalFrames - 1 && now - startTime > (totalFrames / fps) * 1000) {
          setIsPlaying(false);
          setCurrentFrameIdx(0);
          return;
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, fps, totalFrames, frameInterval]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || totalFrames === 0) return;

    const ctx = canvas.getContext("2d");
    const frame = sequence.frames[currentFrameIdx];

    if (frame?.url) {
      const img = new Image();
      img.onload = () => {
        canvas.width = 1280;
        canvas.height = 720;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = frame.url;
    }
  }, [currentFrameIdx, sequence.frames, totalFrames]);

  if (totalFrames === 0) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-12 text-center">
          <p className="text-slate-400">
            {language === 'fr' 
              ? 'Aucune image générée. Créez-en une pour l\'aperçu.' 
              : 'No frames generated. Create some to preview.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">
            {language === 'fr' ? 'Aperçu en Direct' : 'Live Preview'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <motion.canvas
            ref={canvasRef}
            className="w-full rounded-lg bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />

          <div className="flex items-center justify-between">
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  {language === 'fr' ? 'Pause' : 'Pause'}
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  {language === 'fr' ? 'Lecture' : 'Play'}
                </>
              )}
            </Button>

            <span className="text-slate-300 text-sm">
              {language === 'fr' 
                ? `Image ${currentFrameIdx + 1}/${totalFrames}`
                : `Frame ${currentFrameIdx + 1}/${totalFrames}`}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}