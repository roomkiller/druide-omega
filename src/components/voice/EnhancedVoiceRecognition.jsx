/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Enhanced Voice Recognition (Multilingue + Commandes)       ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { useState, useEffect, useRef, useCallback } from "react";

const VOICE_COMMANDS = {
  navigation: {
    "ouvre chat": "Chat",
    "ouvre conversation": "Chat",
    "va au chat": "Chat",
    "ouvre conscience": "Consciousness",
    "ouvre la conscience": "Consciousness",
    "ouvre mémoire": "Memory",
    "ouvre la mémoire": "Memory",
    "ouvre connaissances": "Knowledge",
    "ouvre les connaissances": "Knowledge",
    "ouvre intelligences": "Intelligences",
    "ouvre les intelligences": "Intelligences",
    "ouvre personnalité": "Personality",
    "ouvre la personnalité": "Personality",
    "ouvre briefing": "DailyBriefing",
    "ouvre les briefings": "DailyBriefing",
    "retour accueil": "Home",
    "va à l'accueil": "Home",
    "accueil": "Home"
  },
  actions: {
    "nouvelle conversation": "new_chat",
    "démarre une conversation": "new_chat",
    "crée une conversation": "new_chat",
    "génère une image": "generate_image",
    "crée une image": "generate_image",
    "génère un diagramme": "generate_diagram",
    "crée un diagramme": "generate_diagram",
    "arrête": "stop_speaking",
    "stop": "stop_speaking",
    "silence": "stop_speaking",
    "répète": "repeat_last",
    "redis": "repeat_last",
    "parle plus fort": "volume_up",
    "parle moins fort": "volume_down",
    "parle plus vite": "speed_up",
    "parle plus lentement": "speed_down",
    "pause": "pause",
    "reprends": "resume"
  },
  queries: {
    "quelle heure est-il": "time_query",
    "quel jour sommes-nous": "date_query",
    "combien de mémoires": "memory_count",
    "quel est ton niveau de conscience": "consciousness_level",
    "qui es-tu": "identity_query",
    "quelles sont tes capacités": "capabilities_query"
  }
};

export function useEnhancedVoiceRecognition({ 
  language = "fr-FR",
  onCommandDetected,
  continuousMode = true 
}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [detectedCommand, setDetectedCommand] = useState(null);
  const [confidence, setConfidence] = useState(0);
  
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    const recognition = new SpeechRecognition();
    recognition.continuous = continuousMode;
    recognition.interimResults = true;
    recognition.lang = currentLanguage;
    recognition.maxAlternatives = 3; // Get multiple alternatives for better accuracy

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let interimText = '';
      let finalText = '';
      let maxConfidence = 0;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcriptText = result[0].transcript;
        const resultConfidence = result[0].confidence;
        
        if (result.isFinal) {
          finalText += transcriptText + ' ';
          maxConfidence = Math.max(maxConfidence, resultConfidence);
        } else {
          interimText += transcriptText;
        }
      }

      if (finalText) {
        setTranscript(prev => prev + finalText);
        setConfidence(maxConfidence);
        
        // Detect commands
        const command = detectCommand(finalText.toLowerCase().trim());
        if (command) {
          setDetectedCommand(command);
          if (onCommandDetected) {
            onCommandDetected(command);
          }
        }
      }
      setInterimTranscript(interimText);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        if (continuousMode) {
          recognition.stop();
          setTimeout(() => {
            if (isListening) {
              try {
                recognition.start();
              } catch (e) {
                console.error('Restart error:', e);
              }
            }
          }, 100);
        }
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [currentLanguage, continuousMode]);

  const detectCommand = (text) => {
    // Check navigation commands
    for (const [cmd, page] of Object.entries(VOICE_COMMANDS.navigation)) {
      if (text.includes(cmd)) {
        return { type: 'navigation', command: cmd, target: page, originalText: text };
      }
    }

    // Check action commands
    for (const [cmd, action] of Object.entries(VOICE_COMMANDS.actions)) {
      if (text.includes(cmd)) {
        return { type: 'action', command: cmd, action, originalText: text };
      }
    }

    // Check query commands
    for (const [cmd, query] of Object.entries(VOICE_COMMANDS.queries)) {
      if (text.includes(cmd)) {
        return { type: 'query', command: cmd, query, originalText: text };
      }
    }

    return null;
  };

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setInterimTranscript('');
      setDetectedCommand(null);
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setDetectedCommand(null);
  }, []);

  const changeLanguage = useCallback((newLang) => {
    const wasListening = isListening;
    if (wasListening) {
      stopListening();
    }
    setCurrentLanguage(newLang);
    if (wasListening) {
      setTimeout(() => startListening(), 500);
    }
  }, [isListening, stopListening, startListening]);

  return {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
    currentLanguage,
    changeLanguage,
    detectedCommand,
    confidence
  };
}