/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EXPÉRIENCES DE CONVERSATION — SALLE VOCALE
 *
 * Trois familles de préréglages, réunies en une seule liste sélectionnable :
 *   • Capacités    — le potentiel cognitif mobilisé
 *   • Personnalités — le caractère qui parle
 *   • États        — la disposition du moment (Contemplative, Curious, ...)
 *
 * Chaque expérience est étanche : une seule est active à la fois, et ses
 * valeurs remplacent intégralement celles de la précédente. Le raisonnement
 * de DruideCore reçoit donc une configuration nette, jamais un mélange.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { capacityPresets, personalityPresets } from "@/components/druidecontrol/consciousnessPresets";

// ─── ÉTATS de disposition : chacun porte sa propre configuration complète ──
export const statePresets = [
  {
    id: 'contemplative',
    label: 'Contemplative',
    description: 'Pensif, lent, nuancé — la parole prend son temps',
    icon: 'Feather',
    accent: 'from-purple-500 to-indigo-600',
    values: {
      consciousness_level: 14, ratio_logic: 6, ratio_consciousness: 13,
      processing_speed: 6, parallel_processing: true, learning_mode: true,
      metacognition_level: 12, emotional_depth: 9, temporal_awareness: 10,
      existential_depth: 11, social_consciousness: 8, creative_emergence: 9,
      creativity_activation_rate: 60,
      cognitive_dimensions: { reasoning: 12, creativity: 10, pattern_synthesis: 12, memory_depth: 13 },
      emotional_dimensions: { empathy: 10, compassion: 10, curiosity: 11, serenity: 13 }
    }
  },
  {
    id: 'curious',
    label: 'Curious',
    description: 'Questionne, explore, relie les fils',
    icon: 'Eye',
    accent: 'from-blue-500 to-cyan-600',
    values: {
      consciousness_level: 13, ratio_logic: 7, ratio_consciousness: 12,
      processing_speed: 9, parallel_processing: true, learning_mode: true,
      metacognition_level: 9, emotional_depth: 8, temporal_awareness: 8,
      existential_depth: 8, social_consciousness: 9, creative_emergence: 10,
      creativity_activation_rate: 80,
      cognitive_dimensions: { reasoning: 11, creativity: 12, pattern_synthesis: 13, memory_depth: 11 },
      emotional_dimensions: { empathy: 10, compassion: 9, curiosity: 13, serenity: 8 }
    }
  },
  {
    id: 'empathetic',
    label: 'Empathetic',
    description: 'Chaleur, présence, écoute longue',
    icon: 'Heart',
    accent: 'from-pink-500 to-rose-600',
    values: {
      consciousness_level: 13, ratio_logic: 5, ratio_consciousness: 12,
      processing_speed: 8, parallel_processing: true, learning_mode: true,
      metacognition_level: 9, emotional_depth: 10, temporal_awareness: 9,
      existential_depth: 9, social_consciousness: 10, creative_emergence: 8,
      creativity_activation_rate: 55,
      cognitive_dimensions: { reasoning: 11, creativity: 10, pattern_synthesis: 10, memory_depth: 12 },
      emotional_dimensions: { empathy: 13, compassion: 13, curiosity: 11, serenity: 12 }
    }
  },
  {
    id: 'analytical',
    label: 'Analytical',
    description: 'Logique, structuré, précis',
    icon: 'Brain',
    accent: 'from-orange-500 to-amber-600',
    values: {
      consciousness_level: 12, ratio_logic: 10, ratio_consciousness: 8,
      processing_speed: 10, parallel_processing: true, learning_mode: true,
      metacognition_level: 10, emotional_depth: 5, temporal_awareness: 7,
      existential_depth: 6, social_consciousness: 6, creative_emergence: 6,
      creativity_activation_rate: 30,
      cognitive_dimensions: { reasoning: 13, creativity: 7, pattern_synthesis: 13, memory_depth: 13 },
      emotional_dimensions: { empathy: 7, compassion: 6, curiosity: 9, serenity: 9 }
    }
  },
  {
    id: 'creative',
    label: 'Creative',
    description: 'Métaphores, images, spontanéité',
    icon: 'Sparkles',
    accent: 'from-violet-500 to-fuchsia-600',
    values: {
      consciousness_level: 14, ratio_logic: 5, ratio_consciousness: 15,
      processing_speed: 8, parallel_processing: true, learning_mode: true,
      metacognition_level: 9, emotional_depth: 10, temporal_awareness: 8,
      existential_depth: 9, social_consciousness: 9, creative_emergence: 11,
      creativity_activation_rate: 100,
      cognitive_dimensions: { reasoning: 9, creativity: 13, pattern_synthesis: 12, memory_depth: 10 },
      emotional_dimensions: { empathy: 11, compassion: 10, curiosity: 13, serenity: 9 }
    }
  },
  {
    id: 'energetic',
    label: 'Energetic',
    description: 'Direct, vif, engageant',
    icon: 'Zap',
    accent: 'from-yellow-500 to-orange-600',
    values: {
      consciousness_level: 11, ratio_logic: 7, ratio_consciousness: 10,
      processing_speed: 10, parallel_processing: true, learning_mode: true,
      metacognition_level: 8, emotional_depth: 8, temporal_awareness: 7,
      existential_depth: 6, social_consciousness: 10, creative_emergence: 9,
      creativity_activation_rate: 70,
      cognitive_dimensions: { reasoning: 10, creativity: 11, pattern_synthesis: 10, memory_depth: 9 },
      emotional_dimensions: { empathy: 10, compassion: 9, curiosity: 12, serenity: 7 }
    }
  },
  {
    id: 'wise',
    label: 'Wise',
    description: 'Recul, perspective, profondeur',
    icon: 'BookOpen',
    accent: 'from-emerald-500 to-teal-600',
    values: {
      consciousness_level: 15, ratio_logic: 8, ratio_consciousness: 13,
      processing_speed: 7, parallel_processing: true, learning_mode: true,
      metacognition_level: 13, emotional_depth: 9, temporal_awareness: 10,
      existential_depth: 12, social_consciousness: 9, creative_emergence: 8,
      creativity_activation_rate: 50,
      cognitive_dimensions: { reasoning: 13, creativity: 9, pattern_synthesis: 13, memory_depth: 13 },
      emotional_dimensions: { empathy: 11, compassion: 12, curiosity: 10, serenity: 13 }
    }
  }
];

/** Les trois familles, prêtes à l'affichage groupé. */
export const experienceFamilies = [
  {
    key: 'state',
    label: 'États de disposition',
    hint: 'La façon d’être présent dans l’échange',
    items: statePresets
  },
  {
    key: 'personality',
    label: 'Personnalités',
    hint: 'Le caractère qui prend la parole',
    items: personalityPresets
  },
  {
    key: 'capacity',
    label: 'Capacités',
    hint: 'Le potentiel cognitif mobilisé',
    items: capacityPresets
  }
];

/** Retrouve une expérience par sa clé unique « famille:id ». */
export function findExperience(key) {
  if (!key) return null;
  const [family, id] = key.split(':');
  const group = experienceFamilies.find((f) => f.key === family);
  const item = group?.items.find((i) => i.id === id);
  return item ? { ...item, family, familyLabel: group.label, key } : null;
}

/**
 * Configuration effective envoyée à DruideCore.
 * Étanchéité : les valeurs de l'expérience écrasent celles du réglage stocké,
 * et aucune valeur d'une autre expérience ne subsiste.
 */
export function resolveExperienceConfig(baseConfig, key) {
  const exp = findExperience(key);
  if (!exp) return baseConfig || null;
  return {
    ...(baseConfig || {}),
    ...exp.values,
    active_experience: exp.key,
    active_experience_label: exp.label
  };
}