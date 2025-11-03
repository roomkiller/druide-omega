import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export function useTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState(null);
  const utteranceRef = useRef(null);

  const { data: preferences } = useQuery({
    queryKey: ['ttsPreferences'],
    queryFn: async () => {
      const prefs = await base44.entities.TTSPreferences.list();
      return prefs[0] || null;
    },
  });

  useEffect(() => {
    const handleEnd = () => {
      setIsSpeaking(false);
      utteranceRef.current = null;
    };

    if (currentUtterance) {
      currentUtterance.addEventListener('end', handleEnd);
      return () => {
        currentUtterance.removeEventListener('end', handleEnd);
      };
    }
  }, [currentUtterance]);

  const speak = (text) => {
    if (!preferences?.enabled || !text) return;

    // Stop any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find and set the voice
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices.find(v => v.name === preferences.voice_name);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    } else if (voices.length > 0) {
      const frenchVoice = voices.find(v => v.lang.startsWith('fr'));
      utterance.voice = frenchVoice || voices[0];
    }

    utterance.rate = preferences.rate || 1.0;
    utterance.pitch = preferences.pitch || 1.0;
    utterance.lang = preferences.voice_lang || 'fr-FR';

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      utteranceRef.current = null;
    };

    utterance.onerror = (error) => {
      console.error('Speech synthesis error:', error);
      setIsSpeaking(false);
      utteranceRef.current = null;
    };

    utteranceRef.current = utterance;
    setCurrentUtterance(utterance);
    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
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