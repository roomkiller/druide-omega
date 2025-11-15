/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Voice to Memory Auto-Transcription                         ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { useQueryClient } from "@tanstack/react-query";

export function useVoiceToMemory({ isListening, transcript, resetTranscript }) {
  const queryClient = useQueryClient();

  const createMemoryFromVoice = useCallback(async (voiceText) => {
    if (!voiceText || voiceText.trim().length < 10) return;

    try {
      // Analyze voice input with LLM
      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyse cette transcription vocale et extrait les informations importantes:

Transcription: "${voiceText}"

Détermine:
1. Type d'information (fait, préférence, interaction, insight)
2. Importance (1-10)
3. Tags pertinents
4. Contexte émotionnel si détectable

Retourne JSON:
{
  "should_save": true/false,
  "type": "fact|preference|interaction|insight",
  "importance": 1-10,
  "summary": "résumé court",
  "tags": ["tag1", "tag2"],
  "emotional_context": {
    "emotion": "joie|tristesse|neutre|...",
    "intensity": 1-10
  }
}`,
        response_json_schema: {
          type: "object",
          properties: {
            should_save: { type: "boolean" },
            type: { type: "string" },
            importance: { type: "number" },
            summary: { type: "string" },
            tags: { type: "array", items: { type: "string" } },
            emotional_context: {
              type: "object",
              properties: {
                emotion: { type: "string" },
                intensity: { type: "number" }
              }
            }
          }
        }
      });

      if (analysis.should_save) {
        await base44.entities.Memory.create({
          content: voiceText,
          type: analysis.type,
          importance: analysis.importance,
          modality: "voice",
          tags: analysis.tags,
          context: analysis.summary,
          emotional_context: analysis.emotional_context,
          transcription_metadata: {
            original_audio: true,
            transcribed_at: new Date().toISOString(),
            language: "fr-FR"
          }
        });

        queryClient.invalidateQueries({ queryKey: ['memories'] });
        console.log("✅ Mémoire vocale créée:", analysis.summary);
      }
    } catch (error) {
      console.error("Erreur création mémoire vocale:", error);
    }
  }, [queryClient]);

  // Auto-save when transcript is final and listening stops
  useEffect(() => {
    if (!isListening && transcript && transcript.trim().length > 10) {
      const timer = setTimeout(() => {
        createMemoryFromVoice(transcript);
        resetTranscript?.();
      }, 2000); // Wait 2s after stopping to ensure transcript is final

      return () => clearTimeout(timer);
    }
  }, [isListening, transcript, createMemoryFromVoice, resetTranscript]);

  return { createMemoryFromVoice };
}