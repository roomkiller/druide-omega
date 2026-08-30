/**
 * MobileTTS - VERSION ULTRA-SIMPLIFIÉE
 * Utilise uniquement Speech Synthesis API native
 * Délai mobile intégré pour éviter blocages
 */

class MobileTTS {
  constructor() {
    this.isSpeaking = false;
    this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    this.currentUtterance = null;
    // Chrome ne remplit la liste des voix qu'après cet événement.
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
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

    const spokenText = typeof text === 'string' ? text : String(text ?? '');
    if (!spokenText.trim()) {
      console.warn('⚠️ Rien à dire (texte vide)');
      return;
    }

    // Voix naturelle en ligne (ResponsiveVoice) quand elle est disponible.
    const rv = typeof window !== 'undefined' ? window.responsiveVoice : null;
    if (rv?.voiceSupport?.()) {
      return new Promise((resolve) => {
        // Rien en cours : aucune file à laisser respirer, on parle tout de suite.
        const wasBusy = this.isSpeaking;
        if (wasBusy) rv.cancel();
        setTimeout(() => {
          this.isSpeaking = true;
          rv.speak(spokenText, lang.startsWith('fr') ? 'French Female' : 'UK English Female', {
            rate: 0.95,
            pitch: 1,
            volume: 1,
            onstart: () => { if (onStart) onStart(); },
            onend: () => {
              this.isSpeaking = false;
              if (onEnd) onEnd();
              resolve();
            }
          });
        }, wasBusy ? 120 : 0);
      });
    }

    return new Promise((resolve, reject) => {
      try {
        // Chrome devient muet si speak() suit cancel() immédiatement — mais
        // seulement s'il y avait vraiment quelque chose à annuler. File vide :
        // on attaque sans attendre.
        const busy = this.isSpeaking || window.speechSynthesis.speaking
          || window.speechSynthesis.pending;
        if (busy) window.speechSynthesis.cancel();
        const delay = busy ? (this.isMobile ? 250 : 120) : 0;

        setTimeout(() => {
          window.speechSynthesis.resume(); // au cas où la file serait en pause

          const utterance = new SpeechSynthesisUtterance(spokenText);
          // Chrome ramasse l'utterance si rien ne la retient : sans cette
          // référence, la voix se tait sans erreur.
          this.currentUtterance = utterance;
          utterance.lang = lang;

          // On ne force une voix QUE si c'est une voix naturelle (Google /
          // Microsoft / Siri). Sinon on laisse la voix par défaut du navigateur :
          // prendre la première voix de la langue tombait sur une voix locale
          // compacte au rendu robotique.
          const prefix = lang.slice(0, 2);
          const voices = window.speechSynthesis.getVoices().filter(
            (v) => v.lang?.replace('_', '-').startsWith(prefix)
          );
          const natural = voices.find((v) =>
            /google|microsoft|siri|natural|enhanced|premium/i.test(v.name || '')
          );
          if (natural) utterance.voice = natural;
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
    if (window.responsiveVoice?.cancel) window.responsiveVoice.cancel();
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