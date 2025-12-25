/**
 * MobileTTS - VERSION ULTRA-SIMPLIFIÉE
 * Utilise uniquement Speech Synthesis API native
 * Délai mobile intégré pour éviter blocages
 */

class MobileTTS {
  constructor() {
    this.isSpeaking = false;
    this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    console.log('🎙️ MobileTTS initialized (SIMPLE MODE)');
  }

  async speak(text, options = {}) {
    const {
      lang = 'fr-FR',
      onStart = null,
      onEnd = null
    } = options;

    console.log('═══════════════════════════════════════════');
    console.log('🔊 MobileTTS.speak() - SIMPLE MODE');
    console.log('📝 Text:', text);
    console.log('📱 Mobile:', this.isMobile);
    console.log('═══════════════════════════════════════════');

    return new Promise((resolve, reject) => {
      try {
        // MOBILE: Délai critique pour éviter blocage
        const delay = this.isMobile ? 300 : 0;
        
        setTimeout(() => {
          // Arrêter toute synthèse en cours
          window.speechSynthesis.cancel();
          
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = lang;
          utterance.rate = 0.9;
          utterance.pitch = 1.0;
          utterance.volume = 1.0;
          
          utterance.onstart = () => {
            console.log('✅ Speech STARTED');
            this.isSpeaking = true;
            if (onStart) onStart();
          };
          
          utterance.onend = () => {
            console.log('✅ Speech ENDED');
            this.isSpeaking = false;
            if (onEnd) onEnd();
            resolve();
          };
          
          utterance.onerror = (error) => {
            console.error('❌ Speech ERROR:', error);
            this.isSpeaking = false;
            reject(error);
          };
          
          console.log('🚀 Calling speechSynthesis.speak()...');
          window.speechSynthesis.speak(utterance);
          console.log('✅ speechSynthesis.speak() called');
          
        }, delay);
        
      } catch (error) {
        console.error('❌ MobileTTS.speak() CRITICAL ERROR:', error);
        this.isSpeaking = false;
        reject(error);
      }
    });
  }

  stop() {
    console.log('🛑 Stopping speech');
    this.isSpeaking = false;
    window.speechSynthesis.cancel();
  }

  pause() {
    console.log('⏸️ Pausing speech');
    window.speechSynthesis.pause();
  }

  resume() {
    console.log('▶️ Resuming speech');
    window.speechSynthesis.resume();
  }
}

let instance = null;
export function getMobileTTS() {
  if (!instance) instance = new MobileTTS();
  return instance;
}