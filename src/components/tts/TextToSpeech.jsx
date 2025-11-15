/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Enhanced Text-to-Speech Generator                          ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { useCallback, useRef, useState } from "react";

export function useTextToSpeech({ 
  language = "fr-FR",
  rate = 1,
  pitch = 1,
  volume = 1,
  autoPlay = false 
}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [queue, setQueue] = useState([]);
  const utteranceRef = useRef(null);

  const speak = useCallback((text, options = {}) => {
    if (!text || !window.speechSynthesis) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.language || language;
    utterance.rate = options.rate || rate;
    utterance.pitch = options.pitch || pitch;
    utterance.volume = options.volume || volume;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      utteranceRef.current = null;
      
      // Process queue
      if (queue.length > 0) {
        const [nextText, ...restQueue] = queue;
        setQueue(restQueue);
        speak(nextText, options);
      }
    };

    utterance.onerror = (error) => {
      console.error("TTS Error:", error);
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [language, rate, pitch, volume, queue]);

  const pause = useCallback(() => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, []);

  const resume = useCallback(() => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setQueue([]);
    utteranceRef.current = null;
  }, []);

  const addToQueue = useCallback((text) => {
    if (isSpeaking) {
      setQueue(prev => [...prev, text]);
    } else {
      speak(text);
    }
  }, [isSpeaking, speak]);

  const getAvailableVoices = useCallback(() => {
    return window.speechSynthesis?.getVoices() || [];
  }, []);

  const speakWithEmphasis = useCallback((text, emphasisWords = []) => {
    // Add SSML-like emphasis
    let markedText = text;
    emphasisWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      markedText = markedText.replace(regex, `<emphasis>${word}</emphasis>`);
    });
    
    speak(markedText);
  }, [speak]);

  return {
    speak,
    pause,
    resume,
    stop,
    addToQueue,
    getAvailableVoices,
    speakWithEmphasis,
    isSpeaking,
    isPaused,
    queueLength: queue.length
  };
}