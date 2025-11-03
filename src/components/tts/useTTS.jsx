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
    
    // Find and set the voice - prioritize male French voices
    const voices = window.speechSynthesis.getVoices();
    
    // Try to find the user's selected voice
    let selectedVoice = voices.find(v => v.name === preferences.voice_name);
    
    // If not found, try to find a male French voice
    if (!selectedVoice) {
      selectedVoice = voices.find(v => 
        (v.lang.startsWith('fr') || v.lang.includes('FR')) &&
        (v.name.toLowerCase().includes('male') && !v.name.toLowerCase().includes('female') ||
         v.name.toLowerCase().includes('homme') ||
         v.name.toLowerCase().includes('thomas') ||
         v.name.toLowerCase().includes('daniel'))
      );
    }
    
    // If still not found, try any French voice
    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.lang.startsWith('fr') || v.lang.includes('FR'));
    }
    
    // Otherwise use first available voice
    if (!selectedVoice && voices.length > 0) {
      selectedVoice = voices[0];
    }
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    // Apply voice settings for a softer, more natural sound
    utterance.rate = preferences.rate || 0.9; // Slightly slower
    utterance.pitch = preferences.pitch || 0.95; // Slightly lower for male voice
    utterance.lang = preferences.voice_lang || 'fr-FR';
    utterance.volume = 1.0; // Full volume for clarity

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

    // Small delay to ensure clean speech synthesis
    setTimeout(() => {
      utteranceRef.current = utterance;
      setCurrentUtterance(utterance);
      window.speechSynthesis.speak(utterance);
    }, 100);
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