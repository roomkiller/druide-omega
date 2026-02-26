/**
 * KB Reasoning Engine — Frontend stub
 * La logique LLM est maintenant dans functions/kbReasoningEngine
 */

import { base44 } from "@/api/base44Client";

export async function performAdvancedKBReasoning(query) {
  const response = await base44.functions.invoke('kbReasoningEngine', { query });
  return response.data;
}