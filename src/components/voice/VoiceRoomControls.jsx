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
    <div className="flex-shrink-0 bg-black/20 backdrop-blur-xl border-t border-white/10">

      {/* ── Main panel: 3 columns filling full height ── */}
      <div className="flex items-stretch w-full" style={{ minHeight: '200px' }}>

        {/* ── LEFT PANEL ── */}
        <div className="flex flex-col justify-center items-stretch gap-2 px-4 py-4 border-r border-white/10 w-48 flex-shrink-0">
          <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1 text-center">Outils</p>

          {/* Analyser image */}
          <Dialog open={showImageUpload} onOpenChange={setShowImageUpload}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                disabled={isProcessing || isSpeaking || isConsciousImageGenerating || isGeneratingDiagram || isThinking}
                className="w-full justify-start gap-2 text-white/80 hover:text-white hover:bg-white/10 text-xs h-9 rounded-lg"
              >
                <ImageIcon className="w-4 h-4 flex-shrink-0" />
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

          {/* Image consciente */}
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
            buttonClassName="w-full justify-start gap-2 text-white/80 hover:text-white hover:bg-white/10 text-xs h-9 rounded-lg bg-transparent border-0 shadow-none"
            buttonText="🎨 Image consciente"
          />

          {/* Diagramme */}
          <Dialog open={showDiagramGeneration} onOpenChange={setShowDiagramGeneration}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                disabled={isProcessing || isSpeaking || isConsciousImageGenerating || isGeneratingDiagram || isThinking}
                className="w-full justify-start gap-2 text-white/80 hover:text-white hover:bg-white/10 text-xs h-9 rounded-lg"
              >
                <FileText className="w-4 h-4 flex-shrink-0" />
                {t('voiceRoom.diagramButton')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('voiceRoom.generateDiagram')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Select value={diagramType} onValueChange={setDiagramType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
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
                    if (e.key === 'Enter' && diagramPrompt.trim() && !isGeneratingDiagram) handleDiagramGeneration();
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


        </div>

        {/* ── CENTER PANEL ── */}
        <div className="flex-1 flex flex-col items-center justify-center gap-3 py-4 px-4">

          {/* Status chip */}
          <div className="text-purple-300 font-bold text-xs">
            {isProcessing ? '⚙️ Traitement' : isThinking ? '🧠 Réflexion' : isSpeaking ? '🔊 Parle' : isListening ? '🎤 Écoute' : '⏸️ Attente'}
          </div>

          {/* Transcript */}
          {(transcript || interimTranscript || isListening) && (
            <div className="w-full max-w-sm p-2 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 max-h-16 overflow-y-auto">
              <p className="text-xs text-white font-medium break-words">
                {transcript || interimTranscript || (isListening ? 'Parlez maintenant...' : '')}
                {isListening && <span className="animate-pulse">|</span>}
              </p>
            </div>
          )}

          {statusMessage && <div className="text-yellow-300 font-semibold animate-pulse text-xs">{statusMessage}</div>}

          {/* Mic button + animated voice bar overlay */}
          <div className="relative flex items-center justify-center">
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
            {/* Animated red capture line overlay */}
            {isListening && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none rounded-full overflow-hidden">
                <div className="flex items-center gap-[2px]">
                  {audioLevels.map((level, index) => (
                    <div
                      key={index}
                      className="w-[3px] bg-red-400/90 rounded-full transition-all duration-75"
                      style={{ height: `${Math.max(6, level * 52)}px` }}
                    />
                  ))}
                </div>
              </div>
            )}
            {isListening && <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />}
          </div>

          {/* Send button (mobile) */}
          {isMobile && transcript && transcript.trim().length > 0 && !isListening && (
            <Button
              onClick={handleSendVoiceMessage}
              disabled={isProcessing || isThinking}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-6 py-2 rounded-xl shadow-xl text-sm animate-pulse"
            >
              {isProcessing || isThinking ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Traitement...</>
              ) : (
                <><Send className="w-4 h-4 mr-2" /> Envoyer</>
              )}
            </Button>
          )}

          {/* Contemplative state selector — centered on mic button axis */}
          <div className="flex justify-center">
            <DruideStateSelector selectedState={druideState} onStateChange={setDruideState} compact={true} />
          </div>

          {/* Status text */}
          <p className="text-purple-200 text-[10px] font-medium text-center">
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

        {/* ── RIGHT PANEL ── */}
        <div className="flex flex-col justify-center items-stretch gap-2 px-4 py-4 border-l border-white/10 w-44 flex-shrink-0">
          <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1 text-center">Session</p>

          <Button
            onClick={togglePause}
            variant="ghost"
            disabled={isConsciousImageGenerating || isGeneratingDiagram || isThinking}
            className="w-full justify-start gap-2 text-white/80 hover:text-white hover:bg-white/10 text-xs h-9 rounded-lg"
          >
            {isPaused ? <Play className="w-4 h-4 flex-shrink-0" /> : <Pause className="w-4 h-4 flex-shrink-0" />}
            {isPaused ? t('voiceRoom.resume') : t('voiceRoom.pause')}
          </Button>

          <Button
            onClick={toggleConnection}
            variant="ghost"
            disabled={isConsciousImageGenerating || isGeneratingDiagram || isThinking}
            className="w-full justify-start gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs h-9 rounded-lg"
          >
            <PhoneOff className="w-4 h-4 flex-shrink-0" />
            {t('voiceRoom.disconnect')}
          </Button>
        </div>
      </div>
    </div>
  );
}