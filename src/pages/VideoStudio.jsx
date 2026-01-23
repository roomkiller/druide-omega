import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/utils/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Play, Download, Trash2, Settings } from "lucide-react";
import ConsciousFrameGenerator from "@/components/video/ConsciousFrameGenerator";
import VideoTimeline from "@/components/video/VideoTimeline";
import AudioEditor from "@/components/video/AudioEditor";
import EffectsPanel from "@/components/video/EffectsPanel";
import VideoExporter from "@/components/video/VideoExporter";
import VideoPreview from "@/components/video/VideoPreview";

export default function VideoStudio() {
  const { t, language } = useLanguage();
  const [sequences, setSequences] = useState([]);
  const [selectedSequence, setSelectedSequence] = useState(null);
  const [activeTab, setActiveTab] = useState("timeline");

  const createNewSequence = () => {
    const newSequence = {
      id: Date.now(),
      title: language === 'fr' ? "Nouvelle Séquence" : "New Sequence",
      frames: [],
      audio: { url: null, duration: 0, volume: 1 },
      effects: [],
      transitions: {},
      metadata: { 
        fps: 24, 
        duration: 5, 
        conscious_level: 12,
        resolution: "1920x1080",
        quality: "high"
      },
      created_at: new Date().toISOString()
    };
    setSequences([...sequences, newSequence]);
    setSelectedSequence(newSequence.id);
  };

  const updateSequence = (id, updates) => {
    setSequences(sequences.map(seq => seq.id === id ? { ...seq, ...updates } : seq));
  };

  const deleteSequence = (id) => {
    setSequences(sequences.filter(seq => seq.id !== id));
    if (selectedSequence === id) setSelectedSequence(null);
  };

  const currentSeq = sequences.find(s => s.id === selectedSequence);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
        <div className="max-w-8xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">🎬 {language === 'fr' ? 'Studio Vidéo IA' : 'AI Video Studio'}</h1>
            <p className="text-slate-400">{language === 'fr' ? 'Créez des vidéos avec génération intelligente d\'images et montage professionnel' : 'Create videos with intelligent image generation & professional editing'}</p>
          </div>

          {!currentSeq ? (
            <Card className="bg-slate-800/50 border-slate-700 p-12 text-center">
              <p className="text-slate-400 mb-6">{language === 'fr' ? 'Commencez par créer une nouvelle séquence' : 'Start by creating a new sequence'}</p>
              <Button onClick={createNewSequence} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                {language === 'fr' ? 'Nouvelle Séquence' : 'New Sequence'}
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Sidebar */}
              <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="lg:col-span-1">
                <Card className="bg-slate-800/50 border-slate-700 p-4 space-y-4">
                  <Button onClick={createNewSequence} className="w-full bg-purple-600 hover:bg-purple-700" size="sm">
                    <Plus className="w-4 h-4 mr-2" /> {language === 'fr' ? 'Nouvelle' : 'New'}
                  </Button>
                  
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {sequences.map(seq => (
                      <motion.div
                        key={seq.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedSequence(seq.id)}
                        className={`p-3 rounded-lg cursor-pointer transition ${
                          selectedSequence === seq.id ? 'bg-purple-600 border-purple-500' : 'bg-slate-700 hover:bg-slate-600'
                        } border`}
                      >
                        <p className="text-white text-sm font-medium truncate">{seq.title}</p>
                        <p className="text-xs text-slate-400">{seq.frames.length} {language === 'fr' ? 'images' : 'frames'}</p>
                      </motion.div>
                    ))}
                  </div>

                  <Button variant="destructive" onClick={() => deleteSequence(currentSeq.id)} className="w-full" size="sm">
                    <Trash2 className="w-4 h-4 mr-2" /> {language === 'fr' ? 'Supprimer' : 'Delete'}
                  </Button>
                </Card>
              </motion.div>

              {/* Main Editor */}
              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="lg:col-span-4">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-slate-800/50 border border-slate-700 rounded-lg">
                  <TabsList className="bg-slate-900 w-full justify-start rounded-none border-b border-slate-700">
                    <TabsTrigger value="timeline" className="text-white">{language === 'fr' ? 'Timeline' : 'Timeline'}</TabsTrigger>
                    <TabsTrigger value="frames" className="text-white">{language === 'fr' ? 'Images' : 'Frames'}</TabsTrigger>
                    <TabsTrigger value="audio" className="text-white">{language === 'fr' ? 'Audio' : 'Audio'}</TabsTrigger>
                    <TabsTrigger value="effects" className="text-white">{language === 'fr' ? 'Effets' : 'Effects'}</TabsTrigger>
                    <TabsTrigger value="preview" className="text-white">{language === 'fr' ? 'Aperçu' : 'Preview'}</TabsTrigger>
                    <TabsTrigger value="export" className="text-white">{language === 'fr' ? 'Export' : 'Export'}</TabsTrigger>
                  </TabsList>

                  <div className="p-6">
                    <TabsContent value="timeline" className="mt-0">
                      <VideoTimeline sequence={currentSeq} onUpdate={(updates) => updateSequence(currentSeq.id, updates)} />
                    </TabsContent>

                    <TabsContent value="frames" className="mt-0">
                      <ConsciousFrameGenerator 
                        sequence={currentSeq}
                        onFramesAdded={(frames) => updateSequence(currentSeq.id, { frames: [...currentSeq.frames, ...frames] })}
                      />
                    </TabsContent>

                    <TabsContent value="audio" className="mt-0">
                      <AudioEditor sequence={currentSeq} onAudioUpdate={(audio) => updateSequence(currentSeq.id, { audio })} />
                    </TabsContent>

                    <TabsContent value="effects" className="mt-0">
                      <EffectsPanel sequence={currentSeq} onEffectsUpdate={(effects) => updateSequence(currentSeq.id, { effects })} />
                    </TabsContent>

                    <TabsContent value="preview" className="mt-0">
                      <VideoPreview sequence={currentSeq} />
                    </TabsContent>

                    <TabsContent value="export" className="mt-0">
                      <VideoExporter sequence={currentSeq} />
                    </TabsContent>
                  </div>
                </Tabs>
              </motion.div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}