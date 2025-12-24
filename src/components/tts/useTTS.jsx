import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { NaturalSpeechEngine } from "@/components/voice/NaturalSpeechEngine";

export function useTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState(null);
  const utteranceRef = useRef(null);
  const queueRef = useRef([]);
  const audioRef = useRef(null);
  const isProcessingRef = useRef(false);

  const { data: preferences } = useQuery({
    queryKey: ['ttsPreferences'],
    queryFn: async () => {
      const prefs = await base44.entities.TTSPreferences.list();
      return prefs[0] || { enabled: false, use_elevenlabs: true };
    },
  });

  const useElevenLabs = preferences?.use_elevenlabs ?? true;

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

  const speak = async (text) => {
    if (!preferences?.enabled || !text) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    window.speechSynthesis.cancel();
    queueRef.current = [];
    isProcessingRef.current = false;

    queueRef.current.push(text);
    processQueue();
  };

  const playWithNativeVoice = (text) => {
    const enhancedText = NaturalSpeechEngine.enhanceTextForSpeech(text, recentEmotion);
    const voiceParams = NaturalSpeechEngine.calculateVoiceParameters(
      recentEmotion,
      preferences?.rate || 0.92,
      preferences?.pitch || 0.90
    );

    const utterance = new SpeechSynthesisUtterance(enhancedText);
    
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices.find(v => v.name === preferences?.voice_name);
    if (selectedVoice) utterance.voice = selectedVoice;

    utterance.rate = voiceParams.rate;
    utterance.pitch = voiceParams.pitch;
    utterance.volume = voiceParams.volume;
    utterance.lang = preferences?.voice_lang || 'fr-FR';

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      utteranceRef.current = null;
      isProcessingRef.current = false;
      processQueue();
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      utteranceRef.current = null;
      isProcessingRef.current = false;
      processQueue();
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const processQueue = async () => {
    if (queueRef.current.length === 0 || isProcessingRef.current) return;

    isProcessingRef.current = true;
    const text = queueRef.current.shift();

    try {
      // ResponsiveVoice (prioritaire)
      if (useElevenLabs && typeof window !== 'undefined' && window.responsiveVoice) {
        setIsSpeaking(true);
        
        try {
          const voice = preferences?.voice_lang?.includes('CA') 
            ? 'Canadian French Female' 
            : 'French Female';

          window.responsiveVoice.speak(text, voice, {
            rate: preferences?.rate || 0.92,
            pitch: preferences?.pitch || 0.90,
            volume: 1,
            onstart: () => setIsSpeaking(true),
            onend: () => {
              setIsSpeaking(false);
              isProcessingRef.current = false;
              processQueue();
            },
            onerror: () => {
              console.warn('ResponsiveVoice failed, falling back to native voice');
              playWithNativeVoice(text);
            }
          });
        } catch (error) {
          console.warn('ResponsiveVoice error, falling back to native voice:', error);
          playWithNativeVoice(text);
        }
      } else {
        playWithNativeVoice(text);
      }
    } catch (error) {
      console.error('TTS error:', error);
      setIsSpeaking(false);
      isProcessingRef.current = false;
      processQueue();
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (typeof window !== 'undefined' && window.responsiveVoice) {
      window.responsiveVoice.cancel();
    }
    window.speechSynthesis.cancel();
    queueRef.current = [];
    setIsSpeaking(false);
    utteranceRef.current = null;
    isProcessingRef.current = false;
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
    autoPlay: preferences?.auto_play || false,
    useElevenLabs
  };
}