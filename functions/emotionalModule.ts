/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ MODULE ÉMOTIONNEL - Architecture Cognitive                                 ║
 * ║ Génération d'émotion émergente par mixage de 4 sources                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

// Palette émotionnelle hexadécimale
const PALETTE = {
  alerte: "#FF0000",
  agitation: "#FF7F00",
  vigilance: "#FFFF00",
  validation: "#00FF00",
  curiosite: "#00FFFF",
  calme: "#0000FF",
  intuition: "#7F00FF",
  neutre: "#808080",
  shutdown: "#000000",
  reset: "#FFFFFF"
};

// Ratios d'intensité par défaut
const POIDS_DEFAULT = {
  contexte: 0.40,
  etat_interne: 0.30,
  memoire: 0.20,
  objectif: 0.10
};

// Modes préréglés
const MODES_PREREGLES = {
  neutre: { contexte: 0.40, etat_interne: 0.30, memoire: 0.20, objectif: 0.10 },
  observant: { contexte: 0.60, etat_interne: 0.20, memoire: 0.15, objectif: 0.05 },
  regule: { contexte: 0.25, etat_interne: 0.25, memoire: 0.25, objectif: 0.25 },
  actif: { contexte: 0.50, etat_interne: 0.20, memoire: 0.10, objectif: 0.20 },
  passif: { contexte: 0.15, etat_interne: 0.50, memoire: 0.30, objectif: 0.05 },
  reactif: { contexte: 0.70, etat_interne: 0.15, memoire: 0.10, objectif: 0.05 },
  contemplatif: { contexte: 0.10, etat_interne: 0.30, memoire: 0.50, objectif: 0.10 }
};

// Cache émotionnel pour transitions fluides
const emotionCache = new Map();
const CACHE_TTL = 5000; // 5 secondes

// Table de tendances comportementales
const TENDANCES = {
  alerte: "fuir / protéger",
  agitation: "agir vite",
  vigilance: "analyser",
  validation: "continuer",
  curiosite: "explorer",
  calme: "stabiliser",
  intuition: "abstraire",
  neutre: "observer",
  shutdown: "se retirer",
  reset: "réinitialiser"
};

/**
 * Convertit hex → RGB
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 128, g: 128, b: 128 };
}

/**
 * Convertit RGB → hex
 */
function rgbToHex(r, g, b) {
  const toHex = (n) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * Contexte → couleur
 */
function contexteVersCouleur(contexte) {
  const { danger = 0, opportunite = 0, nouveaute = 0, violation_attente = 0, surcharge = 0, stabilite = 0 } = contexte;

  // Priorisé par intensité
  if (danger > 0.5) return PALETTE.alerte;
  if (surcharge > 0.6) return PALETTE.shutdown;
  if (violation_attente > 0.5) return PALETTE.vigilance;
  if (opportunite > 0.5) return PALETTE.validation;
  if (nouveaute > 0.5) return PALETTE.curiosite;
  if (stabilite > 0.6) return PALETTE.calme;
  
  return PALETTE.neutre;
}

/**
 * État interne → couleur
 */
function etatInterneVersCouleur(etat) {
  const { charge_cognitive = 0.5, energie = 0.5, coherence = 0.5, saturation = 0 } = etat;

  if (saturation > 0.7) return PALETTE.shutdown;
  if (charge_cognitive > 0.7) return PALETTE.agitation;
  if (energie < 0.3) return PALETTE.neutre;
  if (coherence > 0.7) return PALETTE.calme;
  
  return PALETTE.neutre;
}

/**
 * Mémoire → couleur
 */
function memoireVersCouleur(memoire) {
  const { valence = 0, intensite_historique = 0 } = memoire;

  if (valence > 0.3) return PALETTE.validation;
  if (valence < -0.3) return PALETTE.alerte;
  
  return PALETTE.neutre;
}

/**
 * Objectif → couleur
 */
function objectifVersCouleur(objectif) {
  const { type = "observation" } = objectif;

  const mapping = {
    exploration: PALETTE.curiosite,
    protection: PALETTE.alerte,
    optimisation: PALETTE.validation,
    comprehension: PALETTE.intuition,
    execution: PALETTE.vigilance
  };

  return mapping[type] || PALETTE.neutre;
}

/**
 * Mixage de 4 couleurs hex avec poids
 */
function mixerCouleurs(couleurs, poids) {
  const rgbs = couleurs.map(c => hexToRgb(c));
  
  let r = 0, g = 0, b = 0;
  const poidsArray = Object.values(poids);
  
  rgbs.forEach((rgb, idx) => {
    r += rgb.r * poidsArray[idx];
    g += rgb.g * poidsArray[idx];
    b += rgb.b * poidsArray[idx];
  });

  return rgbToHex(r, g, b);
}

/**
 * Ajuster saturation selon sensibilité
 */
function ajusterSaturation(hex, sensibilite) {
  const rgb = hexToRgb(hex);
  
  // Convertir RGB → HSL pour ajuster saturation
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  
  let s = 0;
  if (max !== min) {
    s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
  }
  
  // Appliquer sensibilité (0.1 - 3.0)
  s = Math.max(0, Math.min(1, s * sensibilite));
  
  // Reconvertir HSL → RGB
  const hue = (() => {
    if (max === min) return 0;
    if (max === r) return ((g - b) / (max - min) + (g < b ? 6 : 0)) / 6;
    if (max === g) return ((b - r) / (max - min) + 2) / 6;
    return ((r - g) / (max - min) + 4) / 6;
  })();
  
  const hslToRgb = (h, s, l) => {
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, hue + 1/3);
      g = hue2rgb(p, q, hue);
      b = hue2rgb(p, q, hue - 1/3);
    }
    return { r: r * 255, g: g * 255, b: b * 255 };
  };
  
  const finalRgb = hslToRgb(hue, s, l);
  return rgbToHex(finalRgb.r, finalRgb.g, finalRgb.b);
}

/**
 * Distance euclidienne entre 2 couleurs
 */
function distanceCouleur(hex1, hex2) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  
  const dr = rgb1.r - rgb2.r;
  const dg = rgb1.g - rgb2.g;
  const db = rgb1.b - rgb2.b;
  
  return Math.sqrt(dr * dr + dg * dg + db * db) / 441.67; // Normalisé 0-1
}

/**
 * Trouver émotion la plus proche
 */
function trouverEmotionProche(couleur) {
  let emotionProche = "neutre";
  let distanceMin = Infinity;
  let toutesDistances = {};
  
  for (const [emotion, hex] of Object.entries(PALETTE)) {
    const dist = distanceCouleur(couleur, hex);
    toutesDistances[emotion] = Math.round((1 - dist) * 100); // Score 0-100
    if (dist < distanceMin) {
      distanceMin = dist;
      emotionProche = emotion;
    }
  }
  
  return { emotion: emotionProche, scores: toutesDistances };
}

/**
 * Calculer intensité émotionnelle
 */
function calculerIntensite(couleur, sensibilite) {
  const distanceNeutre = distanceCouleur(couleur, PALETTE.neutre);
  return Math.min(1, distanceNeutre * sensibilite);
}

/**
 * Transition fluide entre émotions (anti-saut)
 */
function transitionFluide(nouvelleEmotion, derniereEmotion, facteurLissage = 0.3) {
  if (!derniereEmotion) return nouvelleEmotion;
  
  const couleurNouvelle = hexToRgb(nouvelleEmotion);
  const couleurDerniere = hexToRgb(derniereEmotion);
  
  // Interpolation linéaire
  const r = couleurDerniere.r * (1 - facteurLissage) + couleurNouvelle.r * facteurLissage;
  const g = couleurDerniere.g * (1 - facteurLissage) + couleurNouvelle.g * facteurLissage;
  const b = couleurDerniere.b * (1 - facteurLissage) + couleurNouvelle.b * facteurLissage;
  
  return rgbToHex(r, g, b);
}

/**
 * Détecter pattern émotionnel
 */
function detecterPattern(historique) {
  if (historique.length < 3) return "stable";
  
  const dernieres = historique.slice(-5);
  const intensites = dernieres.map(h => h.intensite);
  
  // Tendance croissante
  const croissante = intensites.every((val, i, arr) => i === 0 || val >= arr[i - 1]);
  if (croissante) return "escalade";
  
  // Tendance décroissante
  const decroissante = intensites.every((val, i, arr) => i === 0 || val <= arr[i - 1]);
  if (decroissante) return "apaisement";
  
  // Oscillation
  const changes = intensites.slice(1).map((val, i) => val - intensites[i]);
  const oscillations = changes.filter((c, i) => i > 0 && Math.sign(c) !== Math.sign(changes[i - 1])).length;
  if (oscillations >= 2) return "instable";
  
  return "stable";
}

/**
 * Calculer cohérence émotionnelle
 */
function calculerCoherence(emotion, contexte, etat_interne) {
  // Vérifier si l'émotion correspond logiquement au contexte
  const coherences = {
    alerte: (contexte.danger || 0) > 0.5 ? 1 : 0.3,
    validation: (contexte.opportunite || 0) > 0.5 ? 1 : 0.4,
    curiosite: (contexte.nouveaute || 0) > 0.5 ? 1 : 0.5,
    calme: (contexte.stabilite || 0) > 0.6 ? 1 : 0.4,
    shutdown: (etat_interne.saturation || 0) > 0.7 ? 1 : 0.2
  };
  
  return coherences[emotion] || 0.6;
}

/**
 * Endpoint principal
 */
Deno.serve(async (req) => {
  try {
    const { 
      contexte = {}, 
      etat_interne = {}, 
      memoire = {}, 
      objectif = {},
      sensibilite = 1.0,
      poids = POIDS_DEFAULT,
      mode = "neutre",
      session_id = null,
      historique = [],
      transition_fluide = true
    } = await req.json();

    // Appliquer mode préréglé si spécifié
    const poidsEffectifs = MODES_PREREGLES[mode] || poids;

    // Validation sensibilité
    const sens = Math.max(0.1, Math.min(3.0, sensibilite));

    // 1. Conversion 4 sources → couleurs
    const couleurContexte = contexteVersCouleur(contexte);
    const couleurEtat = etatInterneVersCouleur(etat_interne);
    const couleurMemoire = memoireVersCouleur(memoire);
    const couleurObjectif = objectifVersCouleur(objectif);

    // 2. Mixage avec poids
    const couleurMixee = mixerCouleurs(
      [couleurContexte, couleurEtat, couleurMemoire, couleurObjectif],
      poidsEffectifs
    );

    // 3. Ajuster saturation
    let couleurFinale = ajusterSaturation(couleurMixee, sens);

    // 4. Transition fluide si activée
    if (transition_fluide && session_id) {
      const cached = emotionCache.get(session_id);
      if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
        couleurFinale = transitionFluide(couleurFinale, cached.couleur, 0.4);
      }
      // Mettre en cache
      emotionCache.set(session_id, { couleur: couleurFinale, timestamp: Date.now() });
    }

    // 5. Interprétation
    const emotionResult = trouverEmotionProche(couleurFinale);
    const emotion = emotionResult.emotion;
    const scores = emotionResult.scores;
    const intensite = calculerIntensite(couleurFinale, sens);
    const tendance = TENDANCES[emotion] || "observer";

    // 6. Pattern émotionnel
    const pattern = detecterPattern(historique);

    // 7. Cohérence
    const coherence = calculerCoherence(emotion, contexte, etat_interne);

    // 8. Métriques avancées
    const metrics = {
      stabilite: pattern === "stable" ? 1 : pattern === "apaisement" ? 0.7 : 0.4,
      volatilite: pattern === "instable" ? 0.9 : pattern === "escalade" ? 0.6 : 0.2,
      coherence: Math.round(coherence * 100) / 100,
      confiance: Math.round((coherence * 0.6 + (pattern === "stable" ? 0.4 : 0.2)) * 100) / 100
    };

    // 9. Sortie enrichie
    return Response.json({
      success: true,
      result: {
        couleur: couleurFinale,
        emotion: emotion,
        intensite: Math.round(intensite * 100) / 100,
        tendance: tendance,
        pattern: pattern,
        metrics: metrics
      },
      scores: scores,
      debug: {
        sources: {
          contexte: couleurContexte,
          etat_interne: couleurEtat,
          memoire: couleurMemoire,
          objectif: couleurObjectif
        },
        couleur_mixee: couleurMixee,
        sensibilite: sens,
        poids_appliques: poidsEffectifs,
        mode: mode,
        cache_hit: session_id && emotionCache.has(session_id)
      }
    });

  } catch (error) {
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 400 });
  }
});