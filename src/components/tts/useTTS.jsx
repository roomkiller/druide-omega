
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

    // NOUVEAU: Améliorer le traitement du texte pour la parole
    // Remplacer certains caractères qui peuvent causer des problèmes
    let cleanedText = text
      .replace(/\*\*/g, '') // Enlever le markdown bold
      .replace(/\*/g, '') // Enlever les astérisques
      .replace(/`/g, '') // Enlever les backticks
      .replace(/#{1,6}\s/g, '') // Enlever les headers markdown
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Simplifier les liens markdown
      .replace(/\n{3,}/g, '\n\n'); // Réduire les sauts de ligne multiples

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    
    // Find and set the voice - prioritize male French voices with natural tone
    const voices = window.speechSynthesis.getVoices();
    
    // Try to find the user's selected voice
    let selectedVoice = voices.find(v => v.name === preferences.voice_name);
    
    // If not found, try to find a male French voice with priority for natural voices
    if (!selectedVoice) {
      // Priority order for voice selection
      const voicePreferences = [
        // First try: Natural French male voices
        (v) => v.lang.startsWith('fr') && v.name.toLowerCase().includes('natural') && !v.name.toLowerCase().includes('female'),
        // Second: French male voices with common male names
        (v) => v.lang.startsWith('fr') && (
          v.name.toLowerCase().includes('thomas') ||
          v.name.toLowerCase().includes('daniel') ||
          v.name.toLowerCase().includes('antoine') ||
          v.name.toLowerCase().includes('male') ||
          v.name.toLowerCase().includes('homme')
        ),
        // Third: Any French voice that's not explicitly female
        (v) => v.lang.startsWith('fr') && !v.name.toLowerCase().includes('female') && !v.name.toLowerCase().includes('femme'),
        // Fourth: Any French voice
        (v) => v.lang.startsWith('fr'),
        // Last resort: First available voice
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

    // Apply voice settings for a softer, more natural and masculine sound
    utterance.rate = preferences.rate || 0.92; // Légèrement plus lent pour clarté
    utterance.pitch = preferences.pitch || 0.90; // Plus grave pour voix masculine
    utterance.lang = preferences.voice_lang || 'fr-FR';
    utterance.volume = 0.95; // Légèrement réduit pour un son plus naturel

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

    // NOUVEAU: Gérer les textes longs en les découpant en phrases
    // pour éviter les timeouts sur certains navigateurs
    const sentences = cleanedText.match(/[^.!?]+[.!?]+/g) || [cleanedText];
    
    if (sentences.length > 10) {
      // Pour les très longs textes, découper en chunks
      const chunks = [];
      let currentChunk = '';
      
      for (const sentence of sentences) {
        if ((currentChunk + sentence).length > 200) {
          chunks.push(currentChunk);
          currentChunk = sentence;
        } else {
          currentChunk += sentence;
        }
      }
      if (currentChunk) chunks.push(currentChunk);
      
      // Parler le premier chunk seulement pour éviter les problèmes
      utterance.text = chunks[0];
    }

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
