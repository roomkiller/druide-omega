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
  // Écoute continue : tant que ce drapeau est levé, la session est rouverte
  // dès que le navigateur la ferme (fin de segment, silence). Seul un arrêt
  // explicite (traitement en cours, pause, déconnexion) le baisse.
  const keepAliveRef = useRef(false);
  const hasErrorRef = useRef(false);
  // L'erreur « network » du service de reconnaissance est passagère : le
  // service de Google se ferme puis se rouvre. On la rattrape en silence.
  const networkRetriesRef = useRef(0);
  const retryTimerRef = useRef(null);

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
      networkRetriesRef.current = 0;
    };

    recognition.onresult = (event) => {
      console.log('📝 onresult DÉCLENCHÉ, event.results.length:', event.results.length);
      
      let interimText = '';
      let finalText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const resultTranscript = event.results[i][0].transcript;
        const confidence = event.results[i][0].confidence;
        
        console.log(`📋 Résultat [${i}]:`, {
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

      // Afficher interim immédiatement
      setInterimTranscript(interimText);
      console.log('💬 Interim:', interimText);

      if (finalText) {
        const trimmedFinal = finalText.trim();
        console.log('✅✅✅ TEXTE FINAL CAPTURÉ:', trimmedFinal);
        
        if (trimmedFinal.length > 0) { // Même 1-2 mots comptent
          setInterimTranscript('');
          setTranscript(prev => {
            const newTranscript = (prev + ' ' + finalText).trim();
            console.log('📌 Nouveau transcript complet:', newTranscript);
            return newTranscript;
          });
          // On ne coupe PAS la reconnaissance : le segment final part au
          // traitement pendant que l'oreille reste ouverte (dialogue fluide).
        }
      }
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
        setErrorMessage(window.self !== window.top
          ? "Le microphone est bloqué dans l'aperçu intégré. Ouvrez l'application dans un onglet à part, puis autorisez le micro."
          : 'Permission microphone refusée. Autorisez le micro pour ce site dans les réglages du navigateur.');
      } else if (event.error === 'network') {
        // Coupure passagère du service de reconnaissance : on rouvre la session
        // sans rien afficher. L'écoute ne meurt qu'après plusieurs échecs.
        networkRetriesRef.current += 1;
        if (keepAliveRef.current && networkRetriesRef.current <= 4) {
          const backoff = 400 * networkRetriesRef.current;
          console.log(`🔁 Réseau instable — nouvelle tentative dans ${backoff} ms`);
          setIsListening(false);
          clearTimeout(retryTimerRef.current);
          retryTimerRef.current = setTimeout(() => {
            retryTimerRef.current = null;
            if (!keepAliveRef.current || !recognitionRef.current) return;
            try {
              recognitionRef.current.start();
            } catch (e) {
              // « already started » : la session est déjà rouverte.
            }
          }, backoff);
          return; // ni erreur affichée, ni écoute abandonnée
        }
        setErrorMessage("La reconnaissance vocale ne joint plus son service. Vérifie ta connexion, puis relance le micro.");
      } else {
        setErrorMessage(`Erreur: ${event.error}`);
      }
      
      hasErrorRef.current = true;
      keepAliveRef.current = false;
      setHasError(true);
      setIsListening(false);
    };

    recognition.onend = () => {
      console.log('🛑 onend DÉCLENCHÉ');
      console.log('📊 État au moment de onend:', {
        transcript,
        isListening,
        hasError
      });
      
      setIsListening(false);
      setInterimTranscript('');
      isStartingRef.current = false;
      
      // Réouverture immédiate : le navigateur ferme la session à chaque
      // silence, l'écoute doit repartir sans que l'utilisateur agisse.
      // Une reprise après coupure réseau est déjà programmée avec son délai :
      // ne pas la doubler d'une réouverture immédiate.
      if (keepAliveRef.current && !hasErrorRef.current && !retryTimerRef.current) {
        setTimeout(() => {
          if (!keepAliveRef.current || isStartingRef.current || !recognitionRef.current) return;
          try {
            recognitionRef.current.start();
          } catch (e) {
            // « already started » : la session est déjà rouverte, rien à faire.
          }
        }, 150);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
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
    keepAliveRef.current = true;
    hasErrorRef.current = false;
    networkRetriesRef.current = 0;
    clearTimeout(retryTimerRef.current);
    retryTimerRef.current = null;
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
      const inFrame = window.self !== window.top;
      const name = err?.name || '';
      let message;
      if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
        message = "Aucun microphone détecté sur cet appareil. Branchez un micro ou vérifiez le périphérique d'entrée audio du système.";
      } else if (name === 'NotReadableError' || name === 'TrackStartError') {
        message = 'Le microphone est déjà utilisé par une autre application. Fermez-la puis réessayez.';
      } else if (inFrame) {
        message = "Le microphone est bloqué dans l'aperçu intégré. Ouvrez l'application dans un onglet à part, puis autorisez le micro.";
      } else {
        message = "Permission microphone refusée. Autorisez le micro pour ce site dans les réglages du navigateur (icône cadenas dans la barre d'adresse).";
      }
      setErrorMessage(message);
      isStartingRef.current = false;
      keepAliveRef.current = false;
      hasErrorRef.current = true;
      setHasError(true);
      return;
    }

    // Aucun arrêt préalable : couper puis relancer coûtait ~200 ms de surdité
    // à chaque tour. Le mobile garde un court sursis, le desktop part net.
    const delay = isMobileDevice.current ? 300 : 0;

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

  // Autorisation micro demandée DANS le geste de l'utilisateur (clic).
  // Hors geste (minuterie, reprise auto), le navigateur refuse la demande
  // sans afficher d'invite : en production le micro semble alors introuvable.
  const requestPermission = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setHasError(true);
      setErrorMessage("Ce navigateur n'expose pas l'accès au microphone. Utilisez Chrome ou Safari à jour.");
      return false;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
      setHasError(false);
      setErrorMessage("");
      return true;
    } catch (err) {
      const name = err?.name || '';
      setHasError(true);
      setErrorMessage(
        name === 'NotFoundError' || name === 'DevicesNotFoundError'
          ? "Aucun microphone détecté sur cet appareil."
          : window.self !== window.top
            ? "Le microphone est bloqué dans l'aperçu intégré. Ouvrez l'application dans un onglet à part."
            : "Autorisez le microphone pour ce site (icône cadenas dans la barre d'adresse), puis rouvrez la salle."
      );
      return false;
    }
  };

  const stopListening = () => {
    keepAliveRef.current = false;
    clearTimeout(retryTimerRef.current);
    retryTimerRef.current = null;
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
    requestPermission,
    stopListening,
    resetTranscript,
    isSupported,
    hasError,
    clearError,
    errorMessage,
    isMobile: isMobileDevice.current
  };
}