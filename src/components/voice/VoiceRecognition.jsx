import { useState, useEffect, useRef } from "react";

export function useVoiceRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const [hasError, setHasError] = useState(false);
  const recognitionRef = useRef(null);
  const isStartingRef = useRef(false);

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'fr-FR';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let interimText = '';
      let finalText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const resultTranscript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += resultTranscript + ' ';
        } else {
          interimText += resultTranscript;
        }
      }

      if (finalText) {
        const trimmedFinal = finalText.trim();
        if (trimmedFinal.length > 2) {
          setTranscript(prev => (prev + finalText).trim());
          setTimeout(() => recognition.stop(), 100);
        }
      }
      setInterimTranscript(interimText);
    };

    recognition.onerror = (event) => {
      // Silencieux pour les erreurs attendues
      if (event.error === 'aborted' || event.error === 'no-speech') {
        return;
      }
      
      console.error('Erreur reconnaissance vocale:', event.error);
      setHasError(true);
      setIsListening(false);
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
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening && !isStartingRef.current && !hasError) {
      isStartingRef.current = true;
      setTranscript('');
      setInterimTranscript('');
      setHasError(false);
      
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore
      }
      
      setTimeout(() => {
        try {
          recognitionRef.current.start();
          isStartingRef.current = false;
        } catch (error) {
          isStartingRef.current = false;
          if (!error.message?.includes('already started')) {
            console.error('Erreur démarrage reconnaissance:', error);
            setHasError(true);
          }
        }
      }, 150);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const resetTranscript = () => {
    setTranscript('');
    setInterimTranscript('');
  };

  const clearError = () => setHasError(false);

  return {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
    hasError,
    clearError
  };
}