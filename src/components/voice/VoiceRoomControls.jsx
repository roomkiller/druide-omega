import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Mic, MicOff, Play, Pause, PhoneOff, ImageIcon, FileText, Send, Loader2 } from 'lucide-react';
import DruideStateSelector from '@/components/chat/DruideStateSelector';
import ConsciousImageGenerator from '@/components/consciousness/ConsciousImageGenerator';

export default function VoiceRoomControls({
  isListening,
  isProcessing,
  isSpeaking,
  isPaused,
  isThinking,
  isConsciousImageGenerating,
  isGeneratingDiagram,
  audioLevels,
  transcript,
  interimTranscript,
  statusMessage,
  isMobile,
  druideState,
  setDruideState,
  toggleMicrophone,
  showImageUpload,
  setShowImageUpload,
  handleImageUpload,
  handleImageGenerated,
  consciousnessConfig,
  t,
  stopListening,
  startListening,
  handsFreeModeEnabled,
  autoRestartListening,
  showDiagramGeneration,
  setShowDiagramGeneration,
  diagramType,
  setDiagramType,
  diagramPrompt,
  setDiagramPrompt,
  handleDiagramGeneration,
  togglePause,
  toggleConnection,
  thinkingPhase,
  handleSendVoiceMessage,
}) {
  return (
    <div className="flex-shrink-0 bg-black/20 backdrop-blur-xl border-t border-white/10 pt-4 pb-4">
      {/* Audio Visualizer */}
      <div className="mb-3 h-12">
        {isListening && (
          <div className="flex items-center justify-center gap-1 h-full">
            {audioLevels.map((level, index) => (
              <div
                key={index}
                className="w-2 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full transition-all duration-100"
                style={{ height: `${Math.max(12, level * 40)}px` }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Transcript Area */}
      <div className="mb-3 min-h-[120px] space-y-2">
        <div className="text-center text-xs space-y-1 mb-2">
          <div className="text-purple-300 font-bold">
            État: {isProcessing ? '⚙️ Traitement' : isThinking ? '🧠 Réflexion' : isSpeaking ? '🔊 Parle' : isListening ? '🎤 Écoute' : '⏸️ Attente'}
          </div>
          {statusMessage && <div className="text-yellow-300 font-semibold animate-pulse">{statusMessage}</div>}
          {transcript && <div className="text-green-300">✅ Transcript capturé ({transcript.length} caractères)</div>}
        </div>

        {(transcript || interimTranscript || isListening) && (
          <div className="p-3 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 max-h-20 overflow-y-auto">
            <p className="text-xs text-white/70 mb-1">
              {isListening ? '🎤 En écoute...' : 'Message capturé'}
            </p>
            <p className="text-sm text-white font-medium break-words">
              {transcript || interimTranscript || (isListening ? 'Parlez maintenant...' : '')}
              {isListening && <span className="animate-pulse">|</span>}
            </p>
          </div>
        )}

        {isMobile && transcript && transcript.trim().length > 0 && !isListening && (
          <Button
            onClick={handleSendVoiceMessage}
            disabled={isProcessing || isThinking}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 rounded-xl shadow-2xl text-lg animate-pulse"
          >
            {isProcessing || isThinking ? (
              <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Traitement en cours...</>
            ) : (
              <><Send className="w-5 h-5 mr-2" /> 📤 ENVOYER LE MESSAGE</>
            )}
          </Button>
        )}

        {isMobile && !isListening && !isProcessing && !transcript && (
          <div className="text-center text-purple-200 text-xs">
            👆 Appuyez sur le micro, parlez, puis appuyez sur ENVOYER
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center justify-center flex-wrap gap-3">
          <div className="flex-1 max-w-xs">
            <DruideStateSelector selectedState={druideState} onStateChange={setDruideState} compact={true} />
          </div>

          <div className="relative">
            <Button
              onClick={toggleMicrophone}
              size="lg"
              disabled={isProcessing || isSpeaking || isPaused || isConsciousImageGenerating || isGeneratingDiagram || isThinking}
              className={`min-w-[80px] min-h-[80px] rounded-full ${
                isListening
                  ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700'
                  : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700'
              } shadow-2xl disabled:opacity-50 transition-all duration-300 hover:scale-105 touch-target active:scale-95`}
            >
              {isListening ? <MicOff className="w-9 h-9" /> : <Mic className="w-9 h-9" />}
            </Button>
            {isListening && <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />}
          </div>

          <Dialog open={showImageUpload} onOpenChange={setShowImageUpload}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                variant="outline"
                disabled={isProcessing || isSpeaking || isConsciousImageGenerating || isGeneratingDiagram || isThinking}
                className="min-h-[56px] bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border-blue-400/40 hover:from-blue-500/30 hover:to-cyan-500/30 text-white touch-target shadow-lg"
              >
                <ImageIcon className="w-5 h-5 mr-2" />
                📷 Analyser image
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl">📷 Envoyer une image</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageUpload(e.target.files)}
                    disabled={isProcessing || isConsciousImageGenerating || isGeneratingDiagram || isThinking}
                    className="cursor-pointer"
                  />
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-blue-800">✨ L'IA analysera vos images et vous répondra vocalement</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <ConsciousImageGenerator
            onImageGenerated={handleImageGenerated}
            consciousnessConfig={consciousnessConfig}
            t={t}
            onGenerationStart={() => {}}
            onGenerationEnd={() => {}}
            stopListening={stopListening}
            startListening={startListening}
            handsFreeModeEnabled={handsFreeModeEnabled}
            autoRestartListening={autoRestartListening}
            isSpeaking={isSpeaking}
            isParentBusy={isProcessing || isSpeaking || isPaused || isGeneratingDiagram || isThinking}
            buttonClassName="min-h-[56px] bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl border-purple-400/40 hover:from-purple-500/30 hover:to-pink-500/30 text-white touch-target shadow-lg"
            buttonText="🎨 Créer image"
          />

          <Dialog open={showDiagramGeneration} onOpenChange={setShowDiagramGeneration}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                variant="outline"
                disabled={isProcessing || isSpeaking || isConsciousImageGenerating || isGeneratingDiagram || isThinking}
                className="min-h-[56px] bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/20 text-white touch-target"
              >
                <FileText className="w-5 h-5 mr-2" />
                {t('voiceRoom.diagramButton')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('voiceRoom.generateDiagram')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Select value={diagramType} onValueChange={setDiagramType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flowchart">Flowchart</SelectItem>
                    <SelectItem value="mindmap">Mind Map</SelectItem>
                    <SelectItem value="sequence">Sequence</SelectItem>
                    <SelectItem value="class">Class Diagram</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder={t('voiceRoom.describeDiagram')}
                  value={diagramPrompt}
                  onChange={(e) => setDiagramPrompt(e.target.value)}
                  disabled={isGeneratingDiagram || isConsciousImageGenerating || isThinking}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && diagramPrompt.trim() && !isGeneratingDiagram) {
                      handleDiagramGeneration();
                    }
                  }}
                />
                <Button
                  onClick={handleDiagramGeneration}
                  disabled={isGeneratingDiagram || !diagramPrompt.trim() || isConsciousImageGenerating || isThinking}
                  className="w-full"
                >
                  {isGeneratingDiagram ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t('voiceRoom.generating')}</>
                  ) : (
                    <><FileText className="w-4 h-4 mr-2" /> {t('voiceRoom.generateDiagramButton')}</>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            onClick={togglePause}
            size="lg"
            variant="outline"
            disabled={isConsciousImageGenerating || isGeneratingDiagram || isThinking}
            className="min-h-[56px] bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/20 text-white transition-all duration-300 hover:scale-105 touch-target"
          >
            {isPaused ? (
              <><Play className="w-5 h-5 mr-2" /> {t('voiceRoom.resume')}</>
            ) : (
              <><Pause className="w-5 h-5 mr-2" /> {t('voiceRoom.pause')}</>
            )}
          </Button>

          <Button
            onClick={toggleConnection}
            size="lg"
            variant="outline"
            disabled={isConsciousImageGenerating || isGeneratingDiagram || isThinking}
            className="min-h-[56px] bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/20 text-white transition-all duration-300 hover:scale-105 touch-target"
          >
            <PhoneOff className="w-5 h-5 mr-2" />
            {t('voiceRoom.disconnect')}
          </Button>
        </div>

        {/* Status Text */}
        <div className="text-center text-purple-200 text-xs px-4 mt-2">
          <p className="font-medium">
            {isPaused
              ? t('voiceRoom.conversationPaused')
              : isThinking
              ? `${t('voiceRoom.thinking')}: ${thinkingPhase}`
              : isProcessing
              ? t('voiceRoom.analysisInProgress')
              : isSpeaking
              ? t('voiceRoom.ctrlIInterrupt')
              : isListening
              ? `🎤 ${t('voiceRoom.speakNow')}`
              : handsFreeModeEnabled && autoRestartListening
              ? t('voiceRoom.handsFreeActive')
              : (isConsciousImageGenerating || isGeneratingDiagram)
              ? t('voiceRoom.generating')
              : t('voiceRoom.spaceToSpeak')}
          </p>
        </div>
      </div>
    </div>
  );
}