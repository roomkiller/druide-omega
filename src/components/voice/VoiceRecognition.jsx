import { useState, useEffect, useRef } from "react";

export function useVoiceRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef(null);

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
          console.log("✅ FINAL:", resultTranscript);
        } else {
          interimText += resultTranscript;
          console.log("⏳ INTERIM:", resultTranscript);
        }
      }

      if (finalText) {
        const trimmedFinal = finalText.trim();
        console.log("📝 Texte final capturé:", trimmedFinal);
        if (trimmedFinal.length > 2) {
          setTranscript(prev => {
            const newTranscript = (prev + finalText).trim();
            console.log("💾 Nouveau transcript total:", newTranscript);
            return newTranscript;
          });
          setTimeout(() => {
            console.log("🛑 Arrêt reconnaissance");
            recognition.stop();
          }, 100);
        }
      }
      setInterimTranscript(interimText);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      
      // Ignore aborted errors (they're expected when manually stopping)
      if (event.error === 'aborted') {
        return;
      }
      
      if (event.error === 'no-speech') {
        // Don't auto-restart, let user manually restart
        recognition.stop();
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
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setInterimTranscript('');
      try {
        // Force stop before starting to avoid "already started" errors
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore if already stopped
        }
        setTimeout(() => {
          try {
            recognitionRef.current.start();
          } catch (error) {
            if (!error.message.includes('already started')) {
              console.error('Error starting recognition:', error);
            }
          }
        }, 100);
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
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

  return {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported
  };
}