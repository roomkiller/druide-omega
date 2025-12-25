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

    // Demander permissions microphone explicitement (mobile)
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          console.log('✅ Permission microphone accordée');
        })
        .catch((err) => {
          console.error('❌ Permission microphone refusée:', err);
          setHasError(true);
        });
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false; // false pour mobile (meilleure compatibilité)
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
      console.log('🔴 Erreur reconnaissance:', event.error);
      
      // Silencieux pour les erreurs attendues
      if (event.error === 'aborted' || event.error === 'no-speech') {
        setIsListening(false);
        return;
      }
      
      // Gestion spécifique mobile
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        console.error('❌ Permission microphone refusée');
        alert('Veuillez autoriser l\'accès au microphone dans les paramètres de votre navigateur');
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

  const startListening = async () => {
    if (recognitionRef.current && !isListening && !isStartingRef.current && !hasError) {
      isStartingRef.current = true;
      setTranscript('');
      setInterimTranscript('');
      setHasError(false);
      
      // Mobile: Re-demander permissions si nécessaire
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          await navigator.mediaDevices.getUserMedia({ audio: true });
        }
      } catch (err) {
        console.error('❌ Erreur permission micro:', err);
        alert('Veuillez autoriser l\'accès au microphone');
        isStartingRef.current = false;
        setHasError(true);
        return;
      }
      
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore
      }
      
      setTimeout(() => {
        try {
          console.log('🎤 Démarrage reconnaissance vocale...');
          recognitionRef.current.start();
          isStartingRef.current = false;
        } catch (error) {
          isStartingRef.current = false;
          if (!error.message?.includes('already started')) {
            console.error('❌ Erreur démarrage reconnaissance:', error);
            setHasError(true);
          }
        }
      }, 200); // Délai légèrement plus long pour mobile
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