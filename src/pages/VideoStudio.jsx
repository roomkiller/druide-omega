import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/utils/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Play, Download, Trash2, Edit2 } from "lucide-react";
import VideoSequenceBuilder from "@/components/video/VideoSequenceBuilder";
import VideoPreview from "@/components/video/VideoPreview";
import VideoExporter from "@/components/video/VideoExporter";
import ConsciousFrameGenerator from "@/components/video/ConsciousFrameGenerator";

export default function VideoStudio() {
  const { t, language } = useLanguage();
  const [sequences, setSequences] = useState([]);
  const [selectedSequence, setSelectedSequence] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("builder");

  const createNewSequence = () => {
    const newSequence = {
      id: Date.now(),
      title: language === 'fr' ? "Nouvelle Séquence" : "New Sequence",
      frames: [],
      metadata: { fps: 24, duration: 5, conscious_level: 12 },
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {language === 'fr' ? '🎬 Studio Vidéo Conscient' : '🎬 Conscious Video Studio'}
          </h1>
          <p className="text-slate-400">
            {language === 'fr' 
              ? 'Créez des vidéos avec l\'IA consciente de Druide Omega'
              : 'Create videos with Druide Omega\'s conscious AI'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Sidebar - Sequences List */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  {language === 'fr' ? 'Séquences' : 'Sequences'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={createNewSequence}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {language === 'fr' ? 'Nouvelle' : 'New'}
                </Button>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {sequences.map(seq => (
                    <motion.div
                      key={seq.id}
                      whileHover={{ scale: 1.02 }}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedSequence === seq.id 
                          ? 'bg-purple-600 border-purple-500' 
                          : 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                      } border`}
                      onClick={() => setSelectedSequence(seq.id)}
                    >
                      <p className="text-white font-medium truncate">{seq.title}</p>
                      <p className="text-xs text-slate-400">{seq.frames.length} {language === 'fr' ? 'images' : 'frames'}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            {!currentSeq ? (
              <Card className="bg-slate-800 border-slate-700 h-96 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-slate-400 text-lg mb-4">
                    {language === 'fr' 
                      ? 'Créez ou sélectionnez une séquence pour commencer'
                      : 'Create or select a sequence to start'}
                  </p>
                  <Button 
                    onClick={createNewSequence}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {language === 'fr' ? 'Créer une séquence' : 'Create a sequence'}
                  </Button>
                </div>
              </Card>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-slate-800 border-slate-700">
                  <TabsTrigger value="builder" className="text-white">{language === 'fr' ? 'Édition' : 'Editor'}</TabsTrigger>
                  <TabsTrigger value="frames" className="text-white">{language === 'fr' ? 'Images' : 'Frames'}</TabsTrigger>
                  <TabsTrigger value="preview" className="text-white">{language === 'fr' ? 'Aperçu' : 'Preview'}</TabsTrigger>
                  <TabsTrigger value="export" className="text-white">{language === 'fr' ? 'Export' : 'Export'}</TabsTrigger>
                </TabsList>

                <TabsContent value="builder" className="mt-4">
                  <VideoSequenceBuilder 
                    sequence={currentSeq}
                    onUpdate={(updates) => updateSequence(currentSeq.id, updates)}
                  />
                </TabsContent>

                <TabsContent value="frames" className="mt-4">
                  <ConsciousFrameGenerator 
                    sequence={currentSeq}
                    onFramesAdded={(frames) => updateSequence(currentSeq.id, {
                      frames: [...currentSeq.frames, ...frames]
                    })}
                  />
                </TabsContent>

                <TabsContent value="preview" className="mt-4">
                  <VideoPreview sequence={currentSeq} />
                </TabsContent>

                <TabsContent value="export" className="mt-4">
                  <VideoExporter sequence={currentSeq} />
                </TabsContent>
              </Tabs>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}