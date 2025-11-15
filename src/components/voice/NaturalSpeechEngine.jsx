/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Natural Speech Engine (SSML + Prosody)                     ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

export class NaturalSpeechEngine {
  /**
   * Améliore le texte pour une prononciation plus naturelle
   */
  static enhanceTextForSpeech(text, emotionContext = null) {
    let enhanced = text;

    // 1. Nettoyer le formatage markdown
    enhanced = enhanced
      .replace(/\*\*/g, '') // Bold
      .replace(/\*/g, '') // Italics
      .replace(/`{1,3}/g, '') // Code blocks
      .replace(/#{1,6}\s/g, '') // Headers
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Links
      .replace(/\n{3,}/g, '\n\n'); // Multiple line breaks

    // 2. Ajouter des pauses naturelles
    enhanced = enhanced
      .replace(/\.\.\./g, '... ') // Ellipses
      .replace(/([.!?])\s+/g, '$1 ') // After punctuation
      .replace(/,\s+/g, ', ') // After commas
      .replace(/:\s+/g, ': ') // After colons
      .replace(/;\s+/g, '; '); // After semicolons

    // 3. Améliorer les nombres
    enhanced = this.improveNumberPronunciation(enhanced);

    // 4. Améliorer les acronymes
    enhanced = this.improveAcronyms(enhanced);

    // 5. Ajouter de l'emphase émotionnelle si contexte fourni
    if (emotionContext) {
      enhanced = this.addEmotionalProsody(enhanced, emotionContext);
    }

    return enhanced;
  }

  static improveNumberPronunciation(text) {
    // Convertir les nombres pour une meilleure prononciation
    return text
      .replace(/(\d{1,3})\s*%/g, '$1 pour cent')
      .replace(/(\d+)\/(\d+)/g, '$1 sur $2')
      .replace(/\bIA\b/g, 'I A')
      .replace(/\bAPI\b/g, 'A P I')
      .replace(/\bURL\b/g, 'U R L');
  }

  static improveAcronyms(text) {
    const acronyms = {
      'IA': 'I A',
      'AI': 'A I',
      'API': 'A P I',
      'URL': 'U R L',
      'PDF': 'P D F',
      'JSON': 'J SON',
      'HTML': 'H T M L',
      'CSS': 'C S S',
      'RGB': 'R G B',
      'FAQ': 'F A Q'
    };

    let result = text;
    for (const [acronym, pronunciation] of Object.entries(acronyms)) {
      const regex = new RegExp(`\\b${acronym}\\b`, 'g');
      result = result.replace(regex, pronunciation);
    }

    return result;
  }

  static addEmotionalProsody(text, emotion) {
    // Ajouter des marqueurs pour inflexion émotionnelle
    const { emotional_reaction, emotional_intensity } = emotion;

    // Pour les émotions intenses, ajouter de l'emphase
    if (emotional_intensity >= 7) {
      switch (emotional_reaction) {
        case 'joie':
        case 'enthousiasme':
          // Ajouter de l'énergie
          text = text.replace(/!/g, ' !');
          break;
        
        case 'tristesse':
        case 'empathie_douloureuse':
          // Ralentir avec des pauses
          text = text.replace(/\./g, '. ');
          break;
        
        case 'émerveillement':
        case 'curiosité':
          // Ajouter de la surprise
          text = text.replace(/\?/g, ' ?');
          break;
      }
    }

    return text;
  }

  /**
   * Découpe intelligemment le texte en segments pour éviter les timeouts
   */
  static segmentTextForSpeech(text, maxLength = 200) {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const segments = [];
    let currentSegment = '';

    for (const sentence of sentences) {
      if ((currentSegment + sentence).length > maxLength) {
        if (currentSegment) {
          segments.push(currentSegment.trim());
        }
        currentSegment = sentence;
      } else {
        currentSegment += sentence;
      }
    }

    if (currentSegment) {
      segments.push(currentSegment.trim());
    }

    return segments;
  }

  /**
   * Calcule les paramètres vocaux optimaux selon l'émotion
   */
  static calculateVoiceParameters(emotion, baseRate = 0.92, basePitch = 0.90) {
    if (!emotion) return { rate: baseRate, pitch: basePitch, volume: 0.95 };

    const intensity = emotion.emotional_intensity / 10;
    let rate = baseRate;
    let pitch = basePitch;

    switch (emotion.emotional_reaction) {
      case 'joie':
      case 'enthousiasme':
        rate = baseRate * (1 + intensity * 0.15);
        pitch = basePitch * (1 + intensity * 0.1);
        break;

      case 'tristesse':
      case 'préoccupation':
      case 'empathie_douloureuse':
        rate = baseRate * (1 - intensity * 0.12);
        pitch = basePitch * (1 - intensity * 0.08);
        break;

      case 'compassion':
      case 'gratitude':
        rate = baseRate * (1 - intensity * 0.05);
        pitch = basePitch * (1 + intensity * 0.03);
        break;

      case 'curiosité':
      case 'émerveillement':
        pitch = basePitch * (1 + intensity * 0.12);
        rate = baseRate * (1 + intensity * 0.08);
        break;

      case 'sérénité':
        rate = baseRate * (1 - intensity * 0.1);
        break;

      case 'frustration':
      case 'déception':
        rate = baseRate * (1 - intensity * 0.08);
        pitch = basePitch * (1 - intensity * 0.1);
        break;

      case 'espoir':
        rate = baseRate * (1 + intensity * 0.05);
        pitch = basePitch * (1 + intensity * 0.08);
        break;
    }

    // Limites de sécurité
    rate = Math.max(0.6, Math.min(1.4, rate));
    pitch = Math.max(0.7, Math.min(1.3, pitch));

    return { rate, pitch, volume: 0.95 };
  }

  /**
   * Ajoute des variations prosodiques pour éviter la monotonie
   */
  static addProsodicVariation(segments, emotionContext = null) {
    return segments.map((segment, index) => {
      const params = this.calculateVoiceParameters(emotionContext);
      
      // Légère variation pour chaque segment
      const variation = 1 + (Math.sin(index) * 0.03);
      
      return {
        text: segment,
        rate: params.rate * variation,
        pitch: params.pitch * (1 + (index % 2 === 0 ? 0.02 : -0.02)),
        volume: params.volume
      };
    });
  }
}