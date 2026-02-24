import React from 'react';
import { Button } from "@/components/ui/button";
import { Brain, Phone, Loader2, Sparkles } from "lucide-react";
import { Image as ImageIcon } from "lucide-react";
import { useLanguage } from "@/components/utils/LanguageContext";

export default function VoiceRoomConnectionButton({ isConnected, toggleConnection, isGeneratingWelcome }) {
  const { t } = useLanguage();

  if (isConnected) return null;

  return (
    <div className="text-center max-w-3xl mx-auto">
      <div className="w-32 h-32 bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-purple-500/50">
        <Brain className="w-16 h-16 text-white" />
      </div>

      <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
        {t('voiceRoom.druideWaiting')}
      </h2>
      <p className="text-lg sm:text-xl text-purple-200 mb-8">
        {t('voiceRoom.fullCapabilities')}
      </p>

      <Button
        onClick={toggleConnection}
        disabled={isGeneratingWelcome}
        size="lg"
        className="min-h-[64px] min-w-[200px] bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 text-lg rounded-2xl shadow-2xl shadow-green-500/50 touch-target"
      >
        {isGeneratingWelcome ? (
          <>
            <Loader2 className="w-6 h-6 mr-3 animate-spin" />
            {t('voiceRoom.preparingWelcome')}
          </>
        ) : (
          <>
            <Phone className="w-6 h-6 mr-3" />
            {t('voiceRoom.connect')}
          </>
        )}
      </Button>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <Sparkles className="w-6 h-6 text-purple-300 mx-auto mb-2" />
          <p className="text-purple-200">{t('voiceRoom.naturalDialogue')}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <Brain className="w-6 h-6 text-indigo-300 mx-auto mb-2" />
          <p className="text-indigo-200">{t('voiceRoom.advancedReasoning')}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <ImageIcon className="w-6 h-6 text-blue-300 mx-auto mb-2" />
          <p className="text-blue-200">🎨 Analyse & Génération d'images</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <Sparkles className="w-6 h-6 text-pink-300 mx-auto mb-2" />
          <p className="text-pink-200">{t('voiceRoom.fullCreation')}</p>
        </div>
      </div>
    </div>
  );
}