import { useState, useEffect, useRef } from "react";

// Détecter si on est sur mobile
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export function useVoiceRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const recognitionRef = useRef(null);
  const isStartingRef = useRef(false);
  const isMobileDevice = useRef(isMobile());

  useEffect(() => {
    console.log('🔍 Initialisation reconnaissance vocale...');
    console.log('📱 Mobile détecté:', isMobileDevice.current);
    console.log('🌐 User Agent:', navigator.userAgent);
    
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error('❌ API Speech Recognition non disponible');
      setIsSupported(false);
      setErrorMessage('Votre navigateur ne supporte pas la reconnaissance vocale. Essayez Chrome ou Safari.');
      return;
    }

    console.log('✅ API Speech Recognition disponible');
    setIsSupported(true);

    const recognition = new SpeechRecognition();
    
    // Configuration optimisée pour mobile
    recognition.continuous = isMobileDevice.current ? false : true;
    recognition.interimResults = true;
    recognition.lang = 'fr-FR';
    recognition.maxAlternatives = 1;
    
    console.log('⚙️ Configuration:', {
      continuous: recognition.continuous,
      lang: recognition.lang,
      mobile: isMobileDevice.current
    });

    recognition.onstart = () => {
      console.log('🎤 Reconnaissance démarrée');
      setIsListening(true);
      setHasError(false);
      setErrorMessage("");
    };

    recognition.onresult = (event) => {
      console.log('📝 Résultat reçu, event.results.length:', event.results.length);
      
      let interimText = '';
      let finalText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const resultTranscript = event.results[i][0].transcript;
        const confidence = event.results[i][0].confidence;
        
        console.log(`Résultat ${i}:`, {
          transcript: resultTranscript,
          isFinal: event.results[i].isFinal,
          confidence: confidence
        });
        
        if (event.results[i].isFinal) {
          finalText += resultTranscript + ' ';
        } else {
          interimText += resultTranscript;
        }
      }

      if (finalText) {
        const trimmedFinal = finalText.trim();
        console.log('✅ Texte final:', trimmedFinal);
        if (trimmedFinal.length > 2) {
          setTranscript(prev => (prev + finalText).trim());
          
          // Sur mobile, arrêter manuellement après résultat final
          if (isMobileDevice.current) {
            setTimeout(() => {
              try {
                recognition.stop();
              } catch (e) {
                console.log('Stop ignoré:', e);
              }
            }, 100);
          }
        }
      }
      setInterimTranscript(interimText);
    };

    recognition.onerror = (event) => {
      console.error('🔴 ERREUR reconnaissance:', event.error, event);
      
      // Silencieux pour les erreurs attendues
      if (event.error === 'aborted' || event.error === 'no-speech') {
        setIsListening(false);
        return;
      }
      
      // Gestion spécifique mobile
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        console.error('❌ Permission microphone refusée');
        setErrorMessage('Permission microphone refusée. Autorisez le micro dans les paramètres de votre navigateur.');
        alert('⚠️ IMPORTANT: Veuillez autoriser l\'accès au microphone dans les paramètres de votre navigateur/téléphone');
      } else if (event.error === 'network') {
        setErrorMessage('Erreur réseau. Vérifiez votre connexion internet.');
      } else {
        setErrorMessage(`Erreur: ${event.error}`);
      }
      
      setHasError(true);
      setIsListening(false);
    };

    recognition.onend = () => {
      console.log('🛑 Reconnaissance terminée');
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
    console.log('🎯 startListening appelé, état:', { isListening, isStarting: isStartingRef.current, hasError });
    
    if (!recognitionRef.current) {
      console.error('❌ recognitionRef.current est null');
      return;
    }
    
    if (isListening || isStartingRef.current) {
      console.log('⚠️ Déjà en écoute ou en démarrage');
      return;
    }
    
    isStartingRef.current = true;
    setTranscript('');
    setInterimTranscript('');
    setHasError(false);
    setErrorMessage("");
    
    console.log('📱 Demande permission microphone...');
    
    // Mobile: TOUJOURS re-demander permissions avant de démarrer
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          } 
        });
        console.log('✅ Stream audio obtenu:', stream);
        
        // Important: arrêter le stream tout de suite (on utilise Web Speech API après)
        stream.getTracks().forEach(track => track.stop());
      }
    } catch (err) {
      console.error('❌ ERREUR permission micro:', err);
      setErrorMessage('Permission microphone refusée');
      alert('⚠️ Veuillez autoriser l\'accès au microphone dans les paramètres');
      isStartingRef.current = false;
      setHasError(true);
      return;
    }
    
    // Arrêter toute reconnaissance en cours
    try {
      recognitionRef.current.stop();
    } catch (e) {
      console.log('Stop ignoré (normal)');
    }
    
    // Délai plus long sur mobile pour laisser le temps au système
    const delay = isMobileDevice.current ? 500 : 200;
    
    setTimeout(() => {
      try {
        console.log('🚀 LANCEMENT reconnaissance...');
        recognitionRef.current.start();
        isStartingRef.current = false;
        console.log('✅ start() appelé avec succès');
      } catch (error) {
        console.error('❌ ERREUR start():', error);
        isStartingRef.current = false;
        
        if (!error.message?.includes('already started')) {
          setHasError(true);
          setErrorMessage(`Erreur démarrage: ${error.message}`);
        }
      }
    }, delay);
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
    clearError,
    errorMessage,
    isMobile: isMobileDevice.current
  };
}