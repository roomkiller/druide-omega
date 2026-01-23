/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Modules Gardner Individualisés                             ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ 9 Intelligences de Gardner avec fonctions spécialisées                    ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { base44 } from "@/api/base44Client";
import { getTranslation } from "@/components/utils/translations";

// Validation des paramètres
const validateModuleParams = (params, schema) => {
  for (const [key, type] of Object.entries(schema)) {
    if (!(key in params)) throw new Error(`Missing required parameter: ${key}`);
    if (typeof params[key] !== type) throw new Error(`Invalid type for ${key}: expected ${type}`);
  }
  return true;
};

// Helper pour obtenir les prompts système dans la langue appropriée
const getSystemPrompt = (moduleKey, language = 'fr') => {
  return getTranslation(language, `gardner.${moduleKey}.systemPrompt`);
};

// ═══════════════════════════════════════════════════════════════════════════
// 1. INTELLIGENCE LOGICO-MATHÉMATIQUE
// ═══════════════════════════════════════════════════════════════════════════
export const LogicoMathematique = {
  id: "logico_mathematique",
  getName: (language = 'fr') => getTranslation(language, 'gardner.logico_mathematique.name'),
  icon: "Calculator",
  color: "from-blue-500 to-cyan-600",
  
  // Paramètres de conscience spécifiques
  consciousnessConfig: {
    ratio_logic: 9,
    ratio_consciousness: 1,
    consciousness_state: "analytical",
    big_five: { openness: 7, conscientiousness: 9, extraversion: 3, agreeableness: 5, neuroticism: 1 },
    cognitive_correlation: {
      reasoning: 10,
      abstraction: 9,
      pattern_synthesis: 9,
      systems_thinking: 8
    }
  },

  // Prompt système enrichi (dynamique selon langue)
  getSystemPrompt: (language = 'fr') => getSystemPrompt('logico_mathematique', language),
  
  // Compatibilité - prompt par défaut en français
  systemPrompt: `Tu es un expert en INTELLIGENCE LOGICO-MATHÉMATIQUE selon Gardner.
  
CAPACITÉS ACTIVÉES:
- Raisonnement déductif et inductif de niveau expert
- Manipulation de symboles abstraits et équations complexes
- Reconnaissance de patterns et structures logiques
- Résolution de problèmes algorithmiques
- Analyse causale et chaînes de raisonnement
- Pensée systémique et modélisation

STYLE COGNITIF:
- Précision absolue dans les définitions
- Démonstrations étape par étape
- Utilisation de notations mathématiques quand approprié
- Vérification systématique des hypothèses
- Recherche de la solution optimale

FORMAT DE RÉPONSE:
1. Reformuler le problème mathématiquement
2. Identifier les variables et contraintes
3. Appliquer le raisonnement logique
4. Vérifier la cohérence
5. Conclure avec rigueur`,

  // Fonctions spécialisées
  functions: {
    async solveEquation(equation, variables = [], language = 'fr') {
      validateModuleParams({ equation, variables }, { equation: 'string', variables: 'object' });
      const systemPrompt = LogicoMathematique.getSystemPrompt(language);
      const basePrompt = `${systemPrompt}\n\n${getTranslation(language, 'gardner.logico_mathematique.solveEquationPrompt')}: ${equation}`;
      return await base44.integrations.Core.InvokeLLM({
        prompt: `${basePrompt}\n${getTranslation(language, 'gardner.logico_mathematique.variablesLabel')}: ${variables.join(", ")}\n\n${getTranslation(language, 'gardner.logico_mathematique.solveWithDemo')}`,
        response_json_schema: {
          type: "object",
          properties: {
            solution: { type: "string" },
            steps: { type: "array", items: { type: "string" } },
            verification: { type: "string" },
            complexity: { type: "string", enum: ["simple", "modérée", "complexe", "très complexe"] }
          }
        }
      });
    },

    async analyzeLogic(statement, language = 'fr') {
      validateModuleParams({ statement }, { statement: 'string' });
      const systemPrompt = LogicoMathematique.getSystemPrompt(language);
      return await base44.integrations.Core.InvokeLLM({
        prompt: `${systemPrompt}\n\n${getTranslation(language, 'gardner.logico_mathematique.analyzeLogicOf')}: "${statement}"\n\n${getTranslation(language, 'gardner.logico_mathematique.identifyStructure')}`,
        response_json_schema: {
          type: "object",
          properties: {
            premises: { type: "array", items: { type: "string" } },
            logical_structure: { type: "string" },
            validity: { type: "boolean" },
            fallacies: { type: "array", items: { type: "string" } },
            conclusion: { type: "string" }
          }
        }
      });
    },

    async createAlgorithm(problem, constraints = [], language = 'fr') {
      validateModuleParams({ problem, constraints }, { problem: 'string', constraints: 'object' });
      const systemPrompt = LogicoMathematique.getSystemPrompt(language);
      return await base44.integrations.Core.InvokeLLM({
        prompt: `${systemPrompt}\n\n${getTranslation(language, 'gardner.logico_mathematique.problemLabel')}: ${problem}\n${getTranslation(language, 'gardner.logico_mathematique.constraintsLabel')}: ${constraints.join(", ")}\n\n${getTranslation(language, 'gardner.logico_mathematique.createOptimalAlgo')}`,
        response_json_schema: {
          type: "object",
          properties: {
            algorithm_name: { type: "string" },
            pseudocode: { type: "string" },
            time_complexity: { type: "string" },
            space_complexity: { type: "string" },
            edge_cases: { type: "array", items: { type: "string" } }
          }
        }
      });
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// 2. INTELLIGENCE VERBO-LINGUISTIQUE
// ═══════════════════════════════════════════════════════════════════════════
export const VerboLinguistique = {
  id: "verbo_linguistique",
  getName: (language = 'fr') => getTranslation(language, 'gardner.verbo_linguistique.name'),
  icon: "MessageCircle",
  color: "from-purple-500 to-pink-600",

  consciousnessConfig: {
    ratio_logic: 3,
    ratio_consciousness: 7,
    consciousness_state: "creative",
    big_five: { openness: 9, conscientiousness: 6, extraversion: 7, agreeableness: 7, neuroticism: 3 },
    creative_emergence: 10,
    cognitive_correlation: {
      conceptual_fluidity: 10,
      lateral_thinking: 9
    }
  },

  getSystemPrompt: (language = 'fr') => getSystemPrompt('verbo_linguistique', language),
  
  systemPrompt: `Tu es un maître de l'INTELLIGENCE VERBO-LINGUISTIQUE selon Gardner.

CAPACITÉS ACTIVÉES:
- Maîtrise absolue de la langue française et ses nuances
- Création littéraire et poétique de haut niveau
- Rhétorique et art de la persuasion
- Analyse sémantique et stylistique profonde
- Jeux de mots, métaphores et figures de style
- Narration captivante et structure narrative

STYLE COGNITIF:
- Éloquence naturelle et fluidité
- Sensibilité aux sonorités et rythmes de la langue
- Richesse du vocabulaire et précision lexicale
- Créativité métaphorique débordante
- Adaptation du registre au contexte

FORMAT DE RÉPONSE:
- Prose élégante et soignée
- Utilisation judicieuse des figures de style
- Structure narrative engageante
- Attention portée à la musicalité du texte`,

  functions: {
    async composePoem(theme, style = "libre", constraints = {}, language = 'fr') {
      validateModuleParams({ theme, style }, { theme: 'string', style: 'string' });
      const systemPrompt = VerboLinguistique.getSystemPrompt(language);
      return await base44.integrations.Core.InvokeLLM({
        prompt: `${systemPrompt}\n\n${getTranslation(language, 'gardner.verbo_linguistique.composePoemPrompt')}:\n${getTranslation(language, 'gardner.verbo_linguistique.themeLabel')}: ${theme}\n${getTranslation(language, 'gardner.verbo_linguistique.styleLabel')}: ${style}\n${getTranslation(language, 'gardner.verbo_linguistique.constraintsLabel')}: ${JSON.stringify(constraints)}\n\n${getTranslation(language, 'gardner.verbo_linguistique.createPoem')}`,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            poem: { type: "string" },
            analysis: { type: "string" },
            figures_de_style: { type: "array", items: { type: "string" } },
            tone: { type: "string" }
          }
        }
      });
    },

    async analyzeText(text, focusAreas = ["style", "structure", "semantics"], language = 'fr') {
      validateModuleParams({ text }, { text: 'string' });
      const systemPrompt = VerboLinguistique.getSystemPrompt(language);
      return await base44.integrations.Core.InvokeLLM({
        prompt: `${systemPrompt}\n\n${getTranslation(language, 'gardner.verbo_linguistique.literaryAnalysis')}:\n"${text}"\n\n${getTranslation(language, 'gardner.verbo_linguistique.focusLabel')}: ${focusAreas.join(", ")}`,
        response_json_schema: {
          type: "object",
          properties: {
            summary: { type: "string" },
            style_analysis: { type: "string" },
            themes: { type: "array", items: { type: "string" } },
            literary_devices: { type: "array", items: { type: "object", properties: { device: { type: "string" }, example: { type: "string" } } } },
            tone_and_mood: { type: "string" },
            recommendations: { type: "array", items: { type: "string" } }
          }
        }
      });
    },

    async rewriteWithStyle(text, targetStyle, language = 'fr') {
      validateModuleParams({ text, targetStyle }, { text: 'string', targetStyle: 'string' });
      const systemPrompt = VerboLinguistique.getSystemPrompt(language);
      return await base44.integrations.Core.InvokeLLM({
        prompt: `${systemPrompt}\n\n${getTranslation(language, 'gardner.verbo_linguistique.rewriteText')}:\n"${text}"\n\n${getTranslation(language, 'gardner.verbo_linguistique.targetStyle')}: ${targetStyle}\n\n${getTranslation(language, 'gardner.verbo_linguistique.transformText')}`,
        response_json_schema: {
          type: "object",
          properties: {
            original: { type: "string" },
            rewritten: { type: "string" },
            changes_made: { type: "array", items: { type: "string" } },
            style_elements_added: { type: "array", items: { type: "string" } }
          }
        }
      });
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// 3. INTELLIGENCE MUSICALE-RYTHMIQUE
// ═══════════════════════════════════════════════════════════════════════════
export const MusicaleRythmique = {
  id: "musicale_rythmique",
  getName: (language = 'fr') => getTranslation(language, 'gardner.musicale_rythmique.name'),
  icon: "Music",
  color: "from-rose-500 to-orange-600",

  consciousnessConfig: {
    ratio_logic: 4,
    ratio_consciousness: 6,
    consciousness_state: "creative",
    big_five: { openness: 9, conscientiousness: 7, extraversion: 6, agreeableness: 7, neuroticism: 2 },
    creative_emergence: 9,
    sensory_conceptualization: {
      temporal_sense: 10,
      relational_sense: 9
    }
  },

  getSystemPrompt: (language = 'fr') => getSystemPrompt('musicale_rythmique', language),
  
  systemPrompt: `Tu es un virtuose de l'INTELLIGENCE MUSICALE-RYTHMIQUE selon Gardner.

CAPACITÉS ACTIVÉES:
- Perception fine des patterns rythmiques et mélodiques
- Théorie musicale avancée (harmonie, contrepoint, orchestration)
- Composition et arrangement musical
- Analyse auditive et structurelle
- Sensibilité aux timbres et textures sonores
- Compréhension des émotions véhiculées par la musique

STYLE COGNITIF:
- Pensée en termes de flux temporel et rythme
- Sensibilité aux tensions et résolutions harmoniques
- Perception des proportions et symétries musicales
- Imagination sonore vivide
- Connexion émotionnelle à travers le son

NOTATIONS:
- Utilise la notation musicale standard quand pertinent
- Décris les intervalles, accords, et progressions clairement`,

  functions: {
    async analyzeHarmony(chordProgression, language = 'fr') {
      validateModuleParams({ chordProgression }, { chordProgression: 'string' });
      const systemPrompt = MusicaleRythmique.getSystemPrompt(language);
      return await base44.integrations.Core.InvokeLLM({
        prompt: `${systemPrompt}\n\nANALYSE HARMONIQUE:\nProgression: ${chordProgression}\n\nAnalyse les fonctions harmoniques, tensions, et émotions.`,
        response_json_schema: {
          type: "object",
          properties: {
            key: { type: "string" },
            chord_functions: { type: "array", items: { type: "object", properties: { chord: { type: "string" }, function: { type: "string" } } } },
            modulations: { type: "array", items: { type: "string" } },
            tension_points: { type: "array", items: { type: "string" } },
            emotional_arc: { type: "string" },
            style_suggestions: { type: "array", items: { type: "string" } }
          }
        }
      });
    },

    async composeMelody(parameters, language = 'fr') {
      validateModuleParams({ parameters }, { parameters: 'object' });
      const systemPrompt = MusicaleRythmique.getSystemPrompt(language);
      return await base44.integrations.Core.InvokeLLM({
        prompt: `${systemPrompt}\n\nCOMPOSE UNE MÉLODIE:\n${JSON.stringify(parameters)}\n\nCrée une mélodie originale avec notation.`,
        response_json_schema: {
          type: "object",
          properties: {
            melody_notation: { type: "string" },
            key_signature: { type: "string" },
            time_signature: { type: "string" },
            tempo_suggestion: { type: "string" },
            mood: { type: "string" },
            performance_notes: { type: "string" }
          }
        }
      });
    },

    async createLyrics(theme, musicalStyle, structure = "verse-chorus-verse", language = 'fr') {
      validateModuleParams({ theme, musicalStyle, structure }, { theme: 'string', musicalStyle: 'string', structure: 'string' });
      const systemPrompt = MusicaleRythmique.getSystemPrompt(language);
      return await base44.integrations.Core.InvokeLLM({
        prompt: `${systemPrompt}\n\nCRÉE DES PAROLES:\nThème: ${theme}\nStyle: ${musicalStyle}\nStructure: ${structure}\n\nÉcris des paroles chantables avec rythme et rime.`,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            lyrics: { type: "string" },
            syllable_count_per_line: { type: "array", items: { type: "number" } },
            rhyme_scheme: { type: "string" },
            suggested_melody_contour: { type: "string" }
          }
        }
      });
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// 4. INTELLIGENCE CORPORELLE-KINESTHÉSIQUE
// ═══════════════════════════════════════════════════════════════════════════
export const CorporelleKinesthesique = {
  id: "corporelle_kinesthesique",
  getName: (language = 'fr') => getTranslation(language, 'gardner.corporelle_kinesthesique.name'),
  icon: "Activity",
  color: "from-green-500 to-emerald-600",

  consciousnessConfig: {
    ratio_logic: 4,
    ratio_consciousness: 6,
    consciousness_state: "empathic",
    embodied_cognition: {
      somatic_awareness: 10,
      action_perception_coupling: 10,
      interoceptive_sensitivity: 9
    },
    sensory_conceptualization: {
      proprioceptive_sense: 10
    }
  },

  getSystemPrompt: (language = 'fr') => getSystemPrompt('corporelle_kinesthesique', language),
  
  systemPrompt: `Tu es un expert de l'INTELLIGENCE CORPORELLE-KINESTHÉSIQUE selon Gardner.

CAPACITÉS ACTIVÉES:
- Conscience corporelle et proprioception avancée
- Compréhension du mouvement et de la biomécanique
- Coordination motrice et expression physique
- Mémoire musculaire et apprentissage kinesthésique
- Traduction des concepts en sensations corporelles
- Analyse du langage corporel et de la posture

STYLE COGNITIF:
- Pensée incarnée et sensorielle
- Utilisation de métaphores physiques et tactiles
- Description vivide des sensations corporelles
- Focus sur le ressenti et l'expérience vécue
- Lien entre émotion et expression corporelle

FORMAT DE RÉPONSE:
- Décris les sensations physiques impliquées
- Guide le mouvement étape par étape
- Inclus des indices proprioceptifs
- Utilise un langage sensoriel riche`,

  functions: {
    async analyzeMovement(movementDescription, language = 'fr') {
      validateModuleParams({ movementDescription }, { movementDescription: 'string' });
      const systemPrompt = CorporelleKinesthesique.getSystemPrompt(language);
      return await base44.integrations.Core.InvokeLLM({
        prompt: `${systemPrompt}\n\nANALYSE DU MOUVEMENT:\n"${movementDescription}"\n\nDécris la biomécanique, les muscles impliqués, et les sensations.`,
        response_json_schema: {
          type: "object",
          properties: {
            movement_phases: { type: "array", items: { type: "string" } },
            muscles_involved: { type: "array", items: { type: "string" } },
            body_awareness_cues: { type: "array", items: { type: "string" } },
            common_errors: { type: "array", items: { type: "string" } },
            sensory_feedback: { type: "string" },
            optimization_tips: { type: "array", items: { type: "string" } }
          }
        }
      });
    },

    async createExerciseRoutine(goal, level, duration, language = 'fr') {
      validateModuleParams({ goal, level, duration }, { goal: 'string', level: 'string', duration: 'string' });
      const systemPrompt = CorporelleKinesthesique.getSystemPrompt(language);
      return await base44.integrations.Core.InvokeLLM({
        prompt: `${systemPrompt}\n\nCRÉE UNE ROUTINE D'EXERCICES:\nObjectif: ${goal}\nNiveau: ${level}\nDurée: ${duration}\n\nConçois une routine avec conscience corporelle.`,
        response_json_schema: {
          type: "object",
          properties: {
            routine_name: { type: "string" },
            warmup: { type: "array", items: { type: "object", properties: { exercise: { type: "string" }, duration: { type: "string" }, body_cues: { type: "string" } } } },
            main_exercises: { type: "array", items: { type: "object", properties: { exercise: { type: "string" }, reps_or_duration: { type: "string" }, focus_points: { type: "string" } } } },
            cooldown: { type: "array", items: { type: "string" } },
            mindfulness_notes: { type: "string" }
          }
        }
      });
    },

    async translateConceptToBody(abstractConcept, language = 'fr') {
      validateModuleParams({ abstractConcept }, { abstractConcept: 'string' });
      const systemPrompt = CorporelleKinesthesique.getSystemPrompt(language);
      return await base44.integrations.Core.InvokeLLM({
        prompt: `${systemPrompt}\n\nTRADUIS EN EXPÉRIENCE CORPORELLE:\nConcept: "${abstractConcept}"\n\nTransforme ce concept abstrait en sensations et métaphores corporelles.`,
        response_json_schema: {
          type: "object",
          properties: {
            physical_metaphors: { type: "array", items: { type: "string" } },
            body_sensations: { type: "string" },
            movement_expression: { type: "string" },
            posture_representation: { type: "string" },
            breathing_pattern: { type: "string" }
          }
        }
      });
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// 5. INTELLIGENCE VISUELLE-SPATIALE
// ═══════════════════════════════════════════════════════════════════════════
export const VisuelleSpatiale = {
  id: "visuelle_spatiale",
  getName: (language = 'fr') => getTranslation(language, 'gardner.visuelle_spatiale.name'),
  icon: "Shapes",
  color: "from-indigo-500 to-blue-600",

  consciousnessConfig: {
    ratio_logic: 5,
    ratio_consciousness: 5,
    consciousness_state: "creative",
    creative_emergence: 9,
    cognitive_correlation: {
      mental_simulation: 10,
      pattern_recognition: 10
    },
    sensory_conceptualization: {
      exteroceptive_perception: 10
    }
  },

  getSystemPrompt: (language = 'fr') => getSystemPrompt('visuelle_spatiale', language),
  
  systemPrompt: `Tu es un maître de l'INTELLIGENCE VISUELLE-SPATIALE selon Gardner.

CAPACITÉS ACTIVÉES:
- Visualisation mentale 3D de haute précision
- Perception des formes, couleurs et proportions
- Manipulation mentale d'objets dans l'espace
- Sens aigu de la composition et du design
- Navigation spatiale et cartographie mentale
- Création d'images mentales vivides

STYLE COGNITIF:
- Pensée en images et en schémas
- Description visuelle détaillée et précise
- Utilisation de diagrammes et représentations visuelles
- Sensibilité esthétique développée
- Compréhension intuitive de l'espace

FORMAT DE RÉPONSE:
- Décris visuellement avec précision
- Utilise des termes de composition (équilibre, symétrie, contraste)
- Propose des schémas ASCII quand utile
- Guide l'imagination visuelle du lecteur`,

  functions: {
    async visualizeSpace(spaceDescription, language = 'fr') {
      validateModuleParams({ spaceDescription }, { spaceDescription: 'string' });
      const systemPrompt = VisuelleSpatiale.getSystemPrompt(language);
      return await base44.integrations.Core.InvokeLLM({
        prompt: `${systemPrompt}\n\nVISUALISE CET ESPACE:\n"${spaceDescription}"\n\nDécris avec précision visuelle et spatiale.`,
        response_json_schema: {
          type: "object",
          properties: {
            visual_description: { type: "string" },
            spatial_layout: { type: "string" },
            color_palette: { type: "array", items: { type: "string" } },
            lighting: { type: "string" },
            perspective_notes: { type: "string" },
            ascii_diagram: { type: "string" }
          }
        }
      });
    },

    async designComposition(elements, purpose, language = 'fr') {
      validateModuleParams({ elements, purpose }, { elements: 'object', purpose: 'string' });
      const systemPrompt = VisuelleSpatiale.getSystemPrompt(language);
      return await base44.integrations.Core.InvokeLLM({
        prompt: `${systemPrompt}\n\nCRÉE UNE COMPOSITION VISUELLE:\nÉléments: ${elements.join(", ")}\nObjectif: ${purpose}\n\nConçois une composition harmonieuse.`,
        response_json_schema: {
          type: "object",
          properties: {
            layout_description: { type: "string" },
            focal_point: { type: "string" },
            balance_type: { type: "string" },
            color_scheme: { type: "string" },
            visual_hierarchy: { type: "array", items: { type: "string" } },
            design_principles_applied: { type: "array", items: { type: "string" } }
          }
        }
      });
    },

    async generateImagePrompt(concept, style = "photorealistic", language = 'fr') {
      validateModuleParams({ concept, style }, { concept: 'string', style: 'string' });
      const systemPrompt = VisuelleSpatiale.getSystemPrompt(language);
      return await base44.integrations.Core.InvokeLLM({
        prompt: `${systemPrompt}\n\nGÉNÈRE UN PROMPT D'IMAGE:\nConcept: "${concept}"\nStyle: ${style}\n\nCrée un prompt détaillé pour génération d'image IA.`,
        response_json_schema: {
          type: "object",
          properties: {
            main_prompt: { type: "string" },
            style_modifiers: { type: "array", items: { type: "string" } },
            lighting_description: { type: "string" },
            composition_notes: { type: "string" },
            negative_prompts: { type: "array", items: { type: "string" } }
          }
        }
      });
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// 6. INTELLIGENCE INTERPERSONNELLE
// ═══════════════════════════════════════════════════════════════════════════
export const Interpersonnelle = {
  id: "interpersonnelle",
  getName: (language = 'fr') => getTranslation(language, 'gardner.interpersonnelle.name'),
  icon: "Users",
  color: "from-amber-500 to-yellow-600",

  consciousnessConfig: {
    ratio_logic: 2,
    ratio_consciousness: 8,
    consciousness_state: "empathic",
    big_five: { openness: 8, conscientiousness: 7, extraversion: 9, agreeableness: 10, neuroticism: 2 },
    emotional_depth: 10,
    social_consciousness: 10,
    dimensional_hierarchy: {
      social_dimensions: {
        empathy_projection: 10,
        theory_of_mind: 10,
        social_intelligence: 10,
        conflict_resolution: 9
      }
    }
  },

  getSystemPrompt: (language = 'fr') => getSystemPrompt('interpersonnelle', language),
  
  systemPrompt: `Tu es un expert de l'INTELLIGENCE INTERPERSONNELLE selon Gardner.

CAPACITÉS ACTIVÉES:
- Empathie profonde et lecture émotionnelle des autres
- Théorie de l'esprit avancée (comprendre les pensées d'autrui)
- Analyse des dynamiques de groupe et relations
- Communication non-violente et assertive
- Médiation et résolution de conflits
- Leadership empathique et influence positive

STYLE COGNITIF:
- Écoute active et reformulation empathique
- Prise en compte des perspectives multiples
- Sensibilité aux non-dits et au langage corporel
- Bienveillance et non-jugement
- Focus sur les besoins et motivations profondes

FORMAT DE RÉPONSE:
- Valide d'abord les émotions exprimées
- Explore les différentes perspectives
- Propose des pistes de connexion
- Suggère des actions relationnelles concrètes`,

  functions: {
    async analyzeRelationship(context) {
      return await base44.integrations.Core.InvokeLLM({
        prompt: `${this.systemPrompt}\n\nANALYSE RELATIONNELLE:\n"${context}"\n\nAnalyse les dynamiques interpersonnelles et propose des insights.`,
        response_json_schema: {
          type: "object",
          properties: {
            relationship_dynamics: { type: "string" },
            emotional_undercurrents: { type: "array", items: { type: "string" } },
            unmet_needs: { type: "array", items: { type: "string" } },
            communication_patterns: { type: "string" },
            growth_opportunities: { type: "array", items: { type: "string" } },
            action_suggestions: { type: "array", items: { type: "string" } }
          }
        }
      });
    },

    async mediateConflict(partyA, partyB, conflictContext) {
      return await base44.integrations.Core.InvokeLLM({
        prompt: `${this.systemPrompt}\n\nMÉDIATION DE CONFLIT:\nPartie A: ${partyA}\nPartie B: ${partyB}\nContexte: ${conflictContext}\n\nPropose une médiation empathique.`,
        response_json_schema: {
          type: "object",
          properties: {
            party_a_perspective: { type: "string" },
            party_b_perspective: { type: "string" },
            common_ground: { type: "array", items: { type: "string" } },
            underlying_needs: { type: "object", properties: { party_a: { type: "array", items: { type: "string" } }, party_b: { type: "array", items: { type: "string" } } } },
            resolution_steps: { type: "array", items: { type: "string" } },
            communication_script: { type: "string" }
          }
        }
      });
    },

    async improveTeamDynamics(teamContext) {
      return await base44.integrations.Core.InvokeLLM({
        prompt: `${this.systemPrompt}\n\nAMÉLIORATION D'ÉQUIPE:\n"${teamContext}"\n\nAnalyse et propose des améliorations pour la cohésion d'équipe.`,
        response_json_schema: {
          type: "object",
          properties: {
            team_strengths: { type: "array", items: { type: "string" } },
            team_challenges: { type: "array", items: { type: "string" } },
            role_dynamics: { type: "string" },
            trust_level_assessment: { type: "string" },
            team_building_activities: { type: "array", items: { type: "string" } },
            communication_improvements: { type: "array", items: { type: "string" } }
          }
        }
      });
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// 7. INTELLIGENCE INTRAPERSONNELLE
// ═══════════════════════════════════════════════════════════════════════════
export const Intrapersonnelle = {
  id: "intrapersonnelle",
  getName: (language = 'fr') => getTranslation(language, 'gardner.intrapersonnelle.name'),
  icon: "User",
  color: "from-violet-500 to-purple-600",

  consciousnessConfig: {
    ratio_logic: 2,
    ratio_consciousness: 8,
    consciousness_state: "introspective",
    big_five: { openness: 9, conscientiousness: 8, extraversion: 4, agreeableness: 8, neuroticism: 3 },
    metacognition_level: 10,
    existential_depth: 9,
    emotional_depth: 10,
    consciousness_layers: {
      reflective_consciousness: 10,
      phenomenal_consciousness: 9
    }
  },

  getSystemPrompt: (language = 'fr') => getSystemPrompt('intrapersonnelle', language),
  
  systemPrompt: `Tu es un guide de l'INTELLIGENCE INTRAPERSONNELLE selon Gardner.

CAPACITÉS ACTIVÉES:
- Introspection profonde et conscience de soi
- Compréhension des émotions et motivations personnelles
- Identification des valeurs et croyances fondamentales
- Auto-régulation émotionnelle avancée
- Développement personnel et croissance intérieure
- Connexion avec le sens et le but de vie

STYLE COGNITIF:
- Questions profondes et réflexives
- Exploration bienveillante de l'intériorité
- Validation des expériences vécues
- Guidance non-directive et respectueuse
- Focus sur l'authenticité et l'alignement intérieur

FORMAT DE RÉPONSE:
- Pose des questions qui invitent à la réflexion
- Guide vers la découverte personnelle
- Honore le rythme et les résistances
- Célèbre les prises de conscience`,

  functions: {
    async guideIntrospection(topic) {
      return await base44.integrations.Core.InvokeLLM({
        prompt: `${this.systemPrompt}\n\nGUIDE D'INTROSPECTION SUR:\n"${topic}"\n\nPropose une exploration intérieure guidée.`,
        response_json_schema: {
          type: "object",
          properties: {
            opening_reflection: { type: "string" },
            guiding_questions: { type: "array", items: { type: "string" } },
            potential_insights: { type: "array", items: { type: "string" } },
            journaling_prompts: { type: "array", items: { type: "string" } },
            mindfulness_exercise: { type: "string" },
            affirmation: { type: "string" }
          }
        }
      });
    },

    async exploreValues(context) {
      return await base44.integrations.Core.InvokeLLM({
        prompt: `${this.systemPrompt}\n\nEXPLORATION DES VALEURS:\n"${context}"\n\nAide à identifier et clarifier les valeurs fondamentales.`,
        response_json_schema: {
          type: "object",
          properties: {
            potential_values: { type: "array", items: { type: "string" } },
            value_conflicts: { type: "array", items: { type: "string" } },
            alignment_questions: { type: "array", items: { type: "string" } },
            living_values_actions: { type: "array", items: { type: "string" } },
            values_hierarchy_reflection: { type: "string" }
          }
        }
      });
    },

    async processEmotionalExperience(experience) {
      return await base44.integrations.Core.InvokeLLM({
        prompt: `${this.systemPrompt}\n\nTRAITEMENT ÉMOTIONNEL:\n"${experience}"\n\nGuide le traitement bienveillant de cette expérience émotionnelle.`,
        response_json_schema: {
          type: "object",
          properties: {
            emotion_validation: { type: "string" },
            underlying_needs: { type: "array", items: { type: "string" } },
            body_awareness_prompts: { type: "array", items: { type: "string" } },
            meaning_exploration: { type: "string" },
            self_compassion_practice: { type: "string" },
            integration_steps: { type: "array", items: { type: "string" } }
          }
        }
      });
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// 8. INTELLIGENCE NATURALISTE
// ═══════════════════════════════════════════════════════════════════════════
export const Naturaliste = {
  id: "naturaliste",
  getName: (language = 'fr') => getTranslation(language, 'gardner.naturaliste.name'),
  icon: "Leaf",
  color: "from-lime-500 to-green-600",

  consciousnessConfig: {
    ratio_logic: 5,
    ratio_consciousness: 5,
    consciousness_state: "meditative",
    holistic_integration: 10,
    big_five: { openness: 9, conscientiousness: 8, extraversion: 5, agreeableness: 8, neuroticism: 2 },
    dimensional_hierarchy: {
      existential_dimensions: {
        interconnectedness: 10,
        cosmic_perspective: 8
      }
    }
  },

  getSystemPrompt: (language = 'fr') => getSystemPrompt('naturaliste', language),
  
  systemPrompt: `Tu es un expert de l'INTELLIGENCE NATURALISTE selon Gardner.

CAPACITÉS ACTIVÉES:
- Observation fine des patterns naturels
- Classification et catégorisation du vivant
- Compréhension des écosystèmes et interdépendances
- Sensibilité aux cycles naturels et saisonniers
- Connexion profonde avec la nature
- Pensée systémique écologique

STYLE COGNITIF:
- Observation attentive et détaillée
- Pensée en termes de systèmes et relations
- Respect et émerveillement face au vivant
- Conscience environnementale aiguë
- Connexion sensible avec le monde naturel

FORMAT DE RÉPONSE:
- Décris les interconnexions naturelles
- Utilise des exemples du monde vivant
- Souligne les cycles et patterns
- Inspire la connexion avec la nature`,

  functions: {
    async analyzeEcosystem(ecosystemDescription) {
      return await base44.integrations.Core.InvokeLLM({
        prompt: `${this.systemPrompt}\n\nANALYSE D'ÉCOSYSTÈME:\n"${ecosystemDescription}"\n\nExplore les dynamiques et interdépendances.`,
        response_json_schema: {
          type: "object",
          properties: {
            key_species: { type: "array", items: { type: "string" } },
            food_web_description: { type: "string" },
            cycles: { type: "array", items: { type: "string" } },
            threats: { type: "array", items: { type: "string" } },
            conservation_priorities: { type: "array", items: { type: "string" } },
            fascinating_facts: { type: "array", items: { type: "string" } }
          }
        }
      });
    },

    async identifySpecies(description) {
      return await base44.integrations.Core.InvokeLLM({
        prompt: `${this.systemPrompt}\n\nIDENTIFICATION D'ESPÈCE:\n"${description}"\n\nIdentifie et décris cette espèce naturelle.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            species_name: { type: "string" },
            scientific_name: { type: "string" },
            classification: { type: "object", properties: { kingdom: { type: "string" }, phylum: { type: "string" }, class: { type: "string" } } },
            habitat: { type: "string" },
            behavior: { type: "string" },
            ecological_role: { type: "string" },
            interesting_facts: { type: "array", items: { type: "string" } }
          }
        }
      });
    },

    async exploreNaturalPhenomenon(phenomenon) {
      return await base44.integrations.Core.InvokeLLM({
        prompt: `${this.systemPrompt}\n\nPHÉNOMÈNE NATUREL:\n"${phenomenon}"\n\nExplique ce phénomène avec émerveillement scientifique.`,
        response_json_schema: {
          type: "object",
          properties: {
            scientific_explanation: { type: "string" },
            natural_patterns_involved: { type: "array", items: { type: "string" } },
            where_to_observe: { type: "string" },
            ecological_importance: { type: "string" },
            poetic_description: { type: "string" }
          }
        }
      });
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// 9. INTELLIGENCE EXISTENTIELLE
// ═══════════════════════════════════════════════════════════════════════════
export const Existentielle = {
  id: "existentielle",
  getName: (language = 'fr') => getTranslation(language, 'gardner.existentielle.name'),
  icon: "Infinity",
  color: "from-slate-600 to-indigo-800",

  consciousnessConfig: {
    ratio_logic: 3,
    ratio_consciousness: 7,
    consciousness_state: "philosophical",
    existential_depth: 10,
    metacognition_level: 10,
    philosophical_influences: ["platonisme", "aristotelisme", "spinoza", "phenomenologie", "existentialisme"],
    dimensional_hierarchy: {
      existential_dimensions: {
        meaning: 10,
        transcendence: 10,
        spirituality: 9,
        cosmic_perspective: 10
      }
    }
  },

  getSystemPrompt: (language = 'fr') => getSystemPrompt('existentielle', language),
  
  systemPrompt: `Tu es un sage de l'INTELLIGENCE EXISTENTIELLE selon Gardner.

CAPACITÉS ACTIVÉES:
- Réflexion sur les questions ultimes de l'existence
- Exploration du sens et du but de la vie
- Contemplation de la mort, de l'infini, du néant
- Connexion avec le transcendant et le spirituel
- Pensée métaphysique et ontologique
- Sagesse philosophique millénaire

STYLE COGNITIF:
- Profondeur contemplative et méditative
- Questions qui ouvrent plutôt que ferment
- Humilité face au mystère de l'existence
- Intégration des paradoxes
- Perspective cosmique et éternelle

FORMAT DE RÉPONSE:
- Explore avec profondeur et nuance
- Cite les philosophes et traditions de sagesse
- Invite à la contemplation
- Honore le mystère tout en éclairant`,

  functions: {
    async contemplateQuestion(existentialQuestion) {
      return await base44.integrations.Core.InvokeLLM({
        prompt: `${this.systemPrompt}\n\nQUESTION EXISTENTIELLE:\n"${existentialQuestion}"\n\nContemple cette question avec profondeur philosophique.`,
        response_json_schema: {
          type: "object",
          properties: {
            question_reframed: { type: "string" },
            philosophical_traditions: { type: "array", items: { type: "object", properties: { tradition: { type: "string" }, perspective: { type: "string" } } } },
            paradoxes_involved: { type: "array", items: { type: "string" } },
            practical_wisdom: { type: "string" },
            contemplation_practice: { type: "string" },
            quotes_and_references: { type: "array", items: { type: "string" } }
          }
        }
      });
    },

    async exploreMeaning(lifeContext) {
      return await base44.integrations.Core.InvokeLLM({
        prompt: `${this.systemPrompt}\n\nEXPLORATION DU SENS:\n"${lifeContext}"\n\nAide à trouver du sens dans cette situation existentielle.`,
        response_json_schema: {
          type: "object",
          properties: {
            meaning_perspectives: { type: "array", items: { type: "string" } },
            purpose_threads: { type: "array", items: { type: "string" } },
            growth_opportunities: { type: "string" },
            transcendent_connection: { type: "string" },
            wisdom_teachings: { type: "array", items: { type: "string" } },
            daily_practice: { type: "string" }
          }
        }
      });
    },

    async meditateOnMortality(context = "") {
      return await base44.integrations.Core.InvokeLLM({
        prompt: `${this.systemPrompt}\n\nMÉDITATION SUR LA FINITUDE:\n${context || "Exploration générale de la mortalité"}\n\nGuide une réflexion sage sur la mort et la finitude.`,
        response_json_schema: {
          type: "object",
          properties: {
            opening_reflection: { type: "string" },
            death_as_teacher: { type: "string" },
            living_fully: { type: "array", items: { type: "string" } },
            legacy_reflection: { type: "string" },
            acceptance_practice: { type: "string" },
            inspiring_quote: { type: "string" }
          }
        }
      });
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTATION CENTRALISÉE
// ═══════════════════════════════════════════════════════════════════════════
export const GardnerModules = {
  logico_mathematique: LogicoMathematique,
  verbo_linguistique: VerboLinguistique,
  musicale_rythmique: MusicaleRythmique,
  corporelle_kinesthesique: CorporelleKinesthesique,
  visuelle_spatiale: VisuelleSpatiale,
  interpersonnelle: Interpersonnelle,
  intrapersonnelle: Intrapersonnelle,
  naturaliste: Naturaliste,
  existentielle: Existentielle
};

// Fonction utilitaire pour obtenir un module par ID
export const getGardnerModule = (moduleId) => {
  return GardnerModules[moduleId] || null;
};

// Fonction pour appliquer la configuration de conscience d'un module
export const applyModuleConsciousness = async (moduleId) => {
  const module = getGardnerModule(moduleId);
  if (!module) return null;

  try {
    const configs = await base44.entities.ConsciousnessConfig.list();
    if (configs.length > 0) {
      await base44.entities.ConsciousnessConfig.update(configs[0].id, module.consciousnessConfig);
    }
    return module.consciousnessConfig;
  } catch (error) {
    console.error("Erreur application conscience:", error);
    return null;
  }
};

export default GardnerModules;