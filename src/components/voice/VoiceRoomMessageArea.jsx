import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Network } from 'lucide-react';
import EnhancedMessageFeedback from '@/components/chat/EnhancedMessageFeedback';

export default function VoiceRoomMessageArea({ 
  isThinking, 
  isProcessing, 
  thinkingPhase,
  isSpeaking,
  cognitiveCorrelations,
  showCorrelations,
  setShowCorrelations,
  messages,
  messageFeedback,
  messagesEndRef,
  t
}) {
  return (
    <div className="overflow-y-auto pr-4 pb-4 force-scrollbar" style={{ height: 'calc(100vh - 320px)', minHeight: '300px' }}>
      <div className="space-y-4 py-4">
        {(isThinking || isProcessing) && (
          <div className="mb-6">
            <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-900/50 to-indigo-900/50 rounded-2xl border border-purple-500/30 backdrop-blur-xl animate-pulse">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-purple-200 mb-1">
                  {isThinking ? '🧠 Réflexion en cours...' : '⚙️ Traitement...'}
                </p>
                <p className="text-xs text-purple-300">
                  {thinkingPhase || 'Analyse de votre message'}
                </p>
              </div>
            </div>
          </div>
        )}

        {isSpeaking && (
          <div className="mb-6">
            <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-2xl border border-green-500/30 backdrop-blur-xl">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Volume2 className="w-4 h-4 text-white animate-pulse" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-green-200 mb-1">
                  🔊 Druide Omega parle...
                </p>
                <p className="text-xs text-green-300">
                  Écoute en cours
                </p>
              </div>
            </div>
          </div>
        )}

        {cognitiveCorrelations.length > 0 && (
          <Card className="mb-6 p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Network className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-slate-900">{t('voiceRoom.cognitiveCorrelationsDetected')}</h3>
                <Badge className="bg-purple-100 text-purple-700">
                  {cognitiveCorrelations.length}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCorrelations(!showCorrelations)}
              >
                {showCorrelations ? t('voiceRoom.hide') : t('voiceRoom.show')}
              </Button>
            </div>

            {showCorrelations && (
              <div className="space-y-3 mt-4">
                {cognitiveCorrelations.map((corr, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded-lg border border-purple-200"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {corr.source_modality} → {corr.target_modality}
                      </Badge>
                      <Badge className={`text-xs ${
                        corr.correlation_strength >= 8 ? 'bg-green-100 text-green-700' :
                        corr.correlation_strength >= 6 ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {t('voiceRoom.strength')}: {corr.correlation_strength}/10
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {corr.correlation_type}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-700 mb-2">
                      <span className="font-medium">{t('voiceRoom.interpretation')}:</span> {corr.interpretation}
                    </p>

                    {corr.reasoning_path && corr.reasoning_path.length > 0 && (
                      <div className="mt-2 pl-3 border-l-2 border-indigo-200">
                        <p className="text-xs font-medium text-indigo-900 mb-1">{t('voiceRoom.reasoningPath')}:</p>
                        {corr.reasoning_path.map((step, stepIdx) => (
                          <div key={stepIdx} className="text-xs text-slate-600 mb-1">
                            {step.step}. {step.reasoning}
                            <span className="text-indigo-600 ml-1">
                              ({Math.round(step.confidence * 100)}%)
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] ${
              message.role === 'user'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 backdrop-blur-xl text-white border border-white/20'
            } rounded-2xl overflow-hidden`}>
              {message.image_urls && message.image_urls.length > 0 && (
                <div className={`${message.image_urls.length > 1 ? 'grid grid-cols-2 gap-2 p-3' : 'p-3'}`}>
                  {message.image_urls.map((url, idx) => (
                    <div key={idx} className="relative group">
                      <img 
                        src={url} 
                        alt={`Image ${idx + 1}`} 
                        className="w-full rounded-xl max-h-64 object-cover shadow-lg border-2 border-white/20 hover:scale-105 transition-transform cursor-pointer" 
                        onClick={() => window.open(url, '_blank')}
                      />
                      <div className="absolute top-2 right-2 bg-blue-500/90 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        📷 Image #{idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {(message.generated_image || (message.metadata?.type === "conscious_image" && message.metadata.imageUrl)) && (
                <div className="p-3">
                  <div className="relative group">
                    <img 
                      src={message.generated_image || message.metadata.imageUrl} 
                      alt="Generated" 
                      className="w-full rounded-xl max-h-80 object-cover shadow-xl border-2 border-purple-400/30 hover:scale-105 transition-transform cursor-pointer" 
                      onClick={() => window.open(message.generated_image || message.metadata.imageUrl, '_blank')}
                    />
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg">
                      🎨 Image générée par IA
                    </div>
                  </div>
                </div>
              )}

              {message.diagram_url && (
                <div className="p-3 bg-gradient-to-br from-slate-50 to-slate-100 rounded-t-xl">
                  <div className="relative group">
                    <img 
                      src={message.diagram_url} 
                      alt="Diagram" 
                      className="w-full max-h-80 object-contain rounded-lg shadow-lg hover:scale-105 transition-transform cursor-pointer" 
                      onClick={() => window.open(message.diagram_url, '_blank')}
                    />
                    <div className="absolute top-2 right-2 bg-indigo-500/90 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      📊 Diagramme
                    </div>
                  </div>
                </div>
              )}

              {message.role === 'assistant' && !message.metadata?.isInternal && (
                <EnhancedMessageFeedback 
                  feedback={messageFeedback[messages.indexOf(message)]}
                  isVisible={!!messageFeedback[messages.indexOf(message)]}
                />
              )}

              <div className="p-4">
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
                <p className="text-xs opacity-50 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}