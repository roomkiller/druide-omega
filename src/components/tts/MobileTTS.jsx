/**
 * Mobile-Optimized Text-to-Speech Engine
 * Gère TTS natif iOS/Android avec fallbacks intelligents
 */

export class MobileTTS {
  constructor() {
    this.isSpeaking = false;
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    this.isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    this.isAndroid = /Android/i.test(navigator.userAgent);
    this.currentUtterance = null;
    this.queue = [];
    
    console.log('🔊 MobileTTS initialisé:', {
      isMobile: this.isMobile,
      isIOS: this.isIOS,
      isAndroid: this.isAndroid,
      speechSynthesis: !!window.speechSynthesis,
      responsiveVoice: !!window.responsiveVoice
    });

    // Gérer les interruptions (appels, notifications)
    if (this.isMobile) {
      this.setupInterruptionHandlers();
    }

    // Précharger les voix
    this.loadVoices();
  }

  setupInterruptionHandlers() {
    // Pause lors d'interruptions
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.isSpeaking) {
        console.log('📱 Page cachée, pause TTS');
        this.pause();
      }
    });

    // Détection perte audio focus (appel entrant, etc.)
    if ('audioSession' in navigator) {
      navigator.audioSession.type = 'playback';
    }
  }

  loadVoices() {
    if (!window.speechSynthesis) {
      console.error('❌ SpeechSynthesis non disponible');
      return;
    }

    // Sur mobile, les voix peuvent mettre du temps à charger
    const loadVoicesAsync = () => {
      return new Promise((resolve) => {
        let voices = window.speechSynthesis.getVoices();
        
        if (voices.length > 0) {
          resolve(voices);
        } else {
          // Attendre que les voix soient chargées
          window.speechSynthesis.onvoiceschanged = () => {
            voices = window.speechSynthesis.getVoices();
            console.log('🎤 Voix chargées:', voices.length);
            resolve(voices);
          };
        }
      });
    };

    loadVoicesAsync().then(voices => {
      this.voices = voices;
      console.log('✅ Voix disponibles:', voices.map(v => `${v.name} (${v.lang})`));
    });
  }

  getBestVoice(lang = 'fr-FR') {
    if (!this.voices || this.voices.length === 0) {
      this.voices = window.speechSynthesis.getVoices();
    }

    // Priorité: voix française native de qualité
    let voice = null;

    // iOS: chercher voix Amélie, Thomas, ou autre française
    if (this.isIOS) {
      voice = this.voices.find(v => v.lang === 'fr-FR' && v.name.includes('Amélie'));
      if (!voice) voice = this.voices.find(v => v.lang === 'fr-FR' && v.name.includes('Thomas'));
      if (!voice) voice = this.voices.find(v => v.lang === 'fr-FR' && !v.name.includes('Compact'));
    }

    // Android: chercher voix française de qualité
    if (this.isAndroid) {
      voice = this.voices.find(v => v.lang === 'fr-FR' && v.localService);
      if (!voice) voice = this.voices.find(v => v.lang.startsWith('fr-'));
    }

    // Fallback: n'importe quelle voix française
    if (!voice) {
      voice = this.voices.find(v => v.lang.startsWith('fr-'));
    }

    // Fallback ultime: première voix disponible
    if (!voice && this.voices.length > 0) {
      voice = this.voices[0];
    }

    console.log('🎙️ Voix sélectionnée:', voice?.name, voice?.lang);
    return voice;
  }

  async speak(text, options = {}) {
    console.log('═══════════════════════════════════════════');
    console.log('🔊 MobileTTS.speak() appelé');
    console.log('📝 Texte:', text.substring(0, 100));
    console.log('📱 Mobile:', this.isMobile);
    console.log('═══════════════════════════════════════════');

    if (!text || text.trim().length === 0) {
      console.error('❌ Texte vide, impossible de parler');
      return;
    }

    // Arrêter toute lecture en cours
    this.stop();

    return new Promise((resolve, reject) => {
      try {
        // Sur mobile: TOUJOURS utiliser Web Speech API native
        if (this.isMobile || !window.responsiveVoice) {
          console.log('📱 Utilisation Web Speech API native (mobile)');
          this.speakNative(text, options)
            .then(resolve)
            .catch(reject);
        } else {
          // Desktop: ResponsiveVoice si disponible
          console.log('🖥️ Utilisation ResponsiveVoice (desktop)');
          this.speakResponsiveVoice(text, options, resolve, reject);
        }
      } catch (error) {
        console.error('❌ Erreur TTS:', error);
        reject(error);
      }
    });
  }

  async speakNative(text, options = {}) {
    console.log('🎤 speakNative() - Démarrage');

    if (!window.speechSynthesis) {
      throw new Error('SpeechSynthesis non disponible');
    }

    // Sur mobile, parfois il faut cancel avant de parler
    if (this.isMobile) {
      window.speechSynthesis.cancel();
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configuration optimisée pour mobile
      utterance.lang = options.lang || 'fr-FR';
      utterance.rate = options.rate || (this.isMobile ? 1.0 : 1.0); // Mobile: vitesse normale
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;

      // Sélectionner meilleure voix
      const voice = this.getBestVoice(utterance.lang);
      if (voice) {
        utterance.voice = voice;
        console.log('✅ Voix assignée:', voice.name);
      }

      // Events
      utterance.onstart = () => {
        console.log('▶️ TTS démarré');
        this.isSpeaking = true;
        this.currentUtterance = utterance;
        if (options.onStart) options.onStart();
      };

      utterance.onend = () => {
        console.log('✅ TTS terminé');
        this.isSpeaking = false;
        this.currentUtterance = null;
        if (options.onEnd) options.onEnd();
        resolve();
      };

      utterance.onerror = (event) => {
        console.error('❌ Erreur TTS:', event.error);
        this.isSpeaking = false;
        this.currentUtterance = null;
        
        // Sur mobile, certaines erreurs peuvent être ignorées
        if (this.isMobile && event.error === 'interrupted') {
          console.log('⚠️ TTS interrompu (normal sur mobile)');
          resolve();
        } else {
          reject(new Error(`TTS Error: ${event.error}`));
        }
      };

      utterance.onpause = () => {
        console.log('⏸️ TTS en pause');
      };

      utterance.onresume = () => {
        console.log('▶️ TTS repris');
      };

      // Démarrer la lecture
      console.log('🚀 Lancement speechSynthesis.speak()');
      window.speechSynthesis.speak(utterance);

      // Mobile: vérifier que ça démarre vraiment
      if (this.isMobile) {
        setTimeout(() => {
          if (!this.isSpeaking) {
            console.error('❌ TTS ne démarre pas, retry...');
            window.speechSynthesis.cancel();
            setTimeout(() => {
              window.speechSynthesis.speak(utterance);
            }, 200);
          }
        }, 500);
      }
    });
  }

  speakResponsiveVoice(text, options, resolve, reject) {
    if (!window.responsiveVoice) {
      console.warn('⚠️ ResponsiveVoice non disponible, fallback native');
      this.speakNative(text, options).then(resolve).catch(reject);
      return;
    }

    console.log('🔊 ResponsiveVoice.speak()');
    this.isSpeaking = true;

    window.responsiveVoice.speak(text, options.voice || "French Female", {
      rate: options.rate || 1.0,
      pitch: options.pitch || 1.0,
      volume: options.volume || 1.0,
      onstart: () => {
        console.log('▶️ ResponsiveVoice démarré');
        if (options.onStart) options.onStart();
      },
      onend: () => {
        console.log('✅ ResponsiveVoice terminé');
        this.isSpeaking = false;
        if (options.onEnd) options.onEnd();
        resolve();
      },
      onerror: (error) => {
        console.error('❌ ResponsiveVoice erreur:', error);
        this.isSpeaking = false;
        // Fallback vers native
        console.log('🔄 Fallback vers TTS native');
        this.speakNative(text, options).then(resolve).catch(reject);
      }
    });
  }

  stop() {
    console.log('🛑 MobileTTS.stop()');
    
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    if (window.responsiveVoice) {
      window.responsiveVoice.cancel();
    }

    this.isSpeaking = false;
    this.currentUtterance = null;
    this.queue = [];
  }

  pause() {
    console.log('⏸️ MobileTTS.pause()');
    if (window.speechSynthesis && this.isSpeaking) {
      window.speechSynthesis.pause();
    }
  }

  resume() {
    console.log('▶️ MobileTTS.resume()');
    if (window.speechSynthesis) {
      window.speechSynthesis.resume();
    }
  }

  getStatus() {
    return {
      isSpeaking: this.isSpeaking,
      isMobile: this.isMobile,
      isIOS: this.isIOS,
      isAndroid: this.isAndroid,
      voicesCount: this.voices?.length || 0,
      speechSynthesisAvailable: !!window.speechSynthesis,
      responsiveVoiceAvailable: !!window.responsiveVoice
    };
  }
}

// Instance singleton
let mobileTTSInstance = null;

export function getMobileTTS() {
  if (!mobileTTSInstance) {
    mobileTTSInstance = new MobileTTS();
  }
  return mobileTTSInstance;
}