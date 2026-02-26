/**
 * Proactive Needs Engine — Frontend stub
 * La logique LLM est maintenant dans functions/proactiveNeedsEngine
 */

import { base44 } from "@/api/base44Client";

export async function anticipateUserNeeds() {
  const response = await base44.functions.invoke('proactiveNeedsEngine', {});
  return response.data;
}