
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

  // NEW: Query recent emotional state for voice adaptation
  const { data: recentEmotion } = useQuery({
    queryKey: ['mostRecentEmotion'],
    queryFn: async () => {
      const emotions = await base44.entities.EmotionalResponse.list('-timestamp', 1);
      return emotions[0] || null;
    },
    staleTime: 10000, // Cache for 10 seconds
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

    // NEW: Adapt voice parameters based on emotional state
    let baseRate = preferences.rate || 0.92;
    let basePitch = preferences.pitch || 0.90;
    
    if (recentEmotion) {
      const emotionIntensity = recentEmotion.emotional_intensity / 10;
      
      // Adjust based on emotion type
      switch (recentEmotion.emotional_reaction) {
        case 'joie':
        case 'enthousiasme':
          baseRate = baseRate * (1 + emotionIntensity * 0.15); // Faster, more energetic
          basePitch = basePitch * (1 + emotionIntensity * 0.1); // Slightly higher pitch
          break;
        case 'tristesse':
        case 'préoccupation':
        case 'empathie_douloureuse':
          baseRate = baseRate * (1 - emotionIntensity * 0.1); // Slower, more measured
          basePitch = basePitch * (1 - emotionIntensity * 0.05); // Slightly lower pitch
          break;
        case 'compassion':
        case 'gratitude':
          baseRate = baseRate * (1 - emotionIntensity * 0.05); // Slightly slower, warmer
          break;
        case 'curiosité':
        case 'émerveillement':
          basePitch = basePitch * (1 + emotionIntensity * 0.08); // Slightly more expressive
          break;
        case 'sérénité':
          baseRate = baseRate * (1 - emotionIntensity * 0.08); // Calmer, slower
          break;
        case 'frustration':
        case 'déception':
          baseRate = baseRate * (1 - emotionIntensity * 0.05); // More controlled
          basePitch = basePitch * (1 - emotionIntensity * 0.08); // Lower, more serious
          break;
      }
      
      // Ensure values stay within reasonable bounds
      baseRate = Math.max(0.7, Math.min(1.3, baseRate));
      basePitch = Math.max(0.7, Math.min(1.2, basePitch));
    }

    utterance.rate = baseRate;
    utterance.pitch = basePitch;
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
