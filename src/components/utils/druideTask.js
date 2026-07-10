/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - druideTask                                                  ║
 * ║ Tâches internes routées via le moteur central DruideCore.                  ║
 * ║ Signature identique à InvokeLLM (prompt, response_json_schema,             ║
 * ║ add_context_from_internet, file_urls) — remplacement direct.               ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */
import { base44 } from '@/api/base44Client';

export async function druideTask({ prompt, response_json_schema = null, add_context_from_internet = false, file_urls = null }) {
  const res = await base44.functions.invoke('druideCore', {
    internal_task: true,
    prompt,
    response_json_schema,
    add_context_from_internet,
    file_urls
  });
  const data = res?.data || res || {};
  // Même forme de retour qu'InvokeLLM : objet si schéma JSON, texte sinon
  return data.result ?? data;
}

export default druideTask;