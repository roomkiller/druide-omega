import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { NaturalSpeechEngine } from "@/components/voice/NaturalSpeechEngine";

export function useTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState(null);
  const utteranceRef = useRef(null);
  const queueRef = useRef([]);

  const { data: preferences } = useQuery({
    queryKey: ['ttsPreferences'],
    queryFn: async () => {
      const prefs = await base44.entities.TTSPreferences.list();
      return prefs[0] || null;
    },
  });

  const { data: recentEmotion } = useQuery({
    queryKey: ['mostRecentEmotion'],
    queryFn: async () => {
      const emotions = await base44.entities.EmotionalResponse.list('-timestamp', 1);
      return emotions[0] || null;
    },
    staleTime: 10000,
  });

  useEffect(() => {
    const handleEnd = () => {
      setIsSpeaking(false);
      utteranceRef.current = null;
      
      // Process next in queue
      if (queueRef.current.length > 0) {
        const next = queueRef.current.shift();
        speakSegment(next.text, next.params);
      }
    };

    if (currentUtterance) {
      currentUtterance.addEventListener('end', handleEnd);
      return () => {
        currentUtterance.removeEventListener('end', handleEnd);
      };
    }
  }, [currentUtterance]);

  const speakSegment = (text, params) => {
    const utterance = new SpeechSynthesisUtterance(text);
    
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = voices.find(v => v.name === preferences?.voice_name);
    
    if (!selectedVoice) {
      const voicePreferences = [
        (v) => v.lang.startsWith(params.lang.split('-')[0]) && v.name.toLowerCase().includes('natural'),
        (v) => v.lang.startsWith(params.lang.split('-')[0]) && !v.name.toLowerCase().includes('female'),
        (v) => v.lang.startsWith(params.lang.split('-')[0]),
        () => true
      ];

      for (const preference of voicePreferences) {
        selectedVoice = voices.find(preference);
        if (selectedVoice) break;
      }
    }
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.rate = params.rate;
    utterance.pitch = params.pitch;
    utterance.volume = params.volume;
    utterance.lang = params.lang;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onerror = (error) => {
      console.error('Speech error:', error);
      setIsSpeaking(false);
      utteranceRef.current = null;
    };

    setTimeout(() => {
      utteranceRef.current = utterance;
      setCurrentUtterance(utterance);
      window.speechSynthesis.speak(utterance);
    }, 100);
  };

  const speak = (text) => {
    if (!preferences?.enabled || !text) return;

    window.speechSynthesis.cancel();
    queueRef.current = [];

    // Améliorer le texte pour la parole naturelle
    const enhancedText = NaturalSpeechEngine.enhanceTextForSpeech(text, recentEmotion);
    
    // Calculer les paramètres vocaux optimaux
    const voiceParams = NaturalSpeechEngine.calculateVoiceParameters(
      recentEmotion,
      preferences.rate || 0.92,
      preferences.pitch || 0.90
    );

    // Segmenter pour textes longs
    const segments = NaturalSpeechEngine.segmentTextForSpeech(enhancedText, 200);
    
    if (segments.length > 1) {
      // Ajouter variations prosodiques
      const segmentsWithVariation = NaturalSpeechEngine.addProsodicVariation(
        segments,
        recentEmotion
      );

      // Parler le premier segment
      const first = segmentsWithVariation[0];
      speakSegment(first.text, {
        rate: first.rate,
        pitch: first.pitch,
        volume: first.volume,
        lang: preferences.voice_lang || 'fr-FR'
      });

      // Mettre le reste en queue
      queueRef.current = segmentsWithVariation.slice(1).map(seg => ({
        text: seg.text,
        params: {
          rate: seg.rate,
          pitch: seg.pitch,
          volume: seg.volume,
          lang: preferences.voice_lang || 'fr-FR'
        }
      }));
    } else {
      // Texte court - parler directement
      speakSegment(enhancedText, {
        rate: voiceParams.rate,
        pitch: voiceParams.pitch,
        volume: voiceParams.volume,
        lang: preferences.voice_lang || 'fr-FR'
      });
    }
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    queueRef.current = [];
    setIsSpeaking(false);
    utteranceRef.current = null;
  };

  const toggle = (text) => {
    if (isSpeaking) {
      stop();
    } else {
      speak(text);
    }
  };

  return {
    speak,
    stop,
    toggle,
    isSpeaking,
    isEnabled: preferences?.enabled || false,
    autoPlay: preferences?.auto_play || false
  };
}