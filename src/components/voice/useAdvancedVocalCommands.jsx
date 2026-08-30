import { useCallback } from "react";
import druideTask from "@/components/utils/druideTask";

/**
 * Commandes vocales spécialisées (schéma ASCII, recherche scientifique).
 * Sorties de la page VoiceRoom : elles ne concernent pas le tour de parole
 * normal, qui passe entièrement par DruideCore.
 * Retourne true si la commande a été prise en charge.
 */
export default function useAdvancedVocalCommands({ setMessages, speak, setBusy, setPhase, t }) {
  return useCallback(async (userText) => {
    const lower = userText.toLowerCase();

    const push = (content) => setMessages((prev) => [...prev, {
      role: "assistant",
      content,
      timestamp: new Date().toISOString()
    }]);

    const isSchema = lower.includes("crée un schéma") || lower.includes("génère un schéma")
      || lower.includes("schéma ascii") || lower.includes("diagramme ascii");

    const isResearch = lower.includes("recherche scientifique") || lower.includes("valide ce concept")
      || lower.includes("corrélation entre") || lower.includes("hypothèse sur");

    if (!isSchema && !isResearch) return false;

    setBusy(true);
    setPhase(isSchema ? t('voiceRoom.asciiDiagramGeneration') : t('voiceRoom.scientificResearchWeb'));

    try {
      if (isSchema) {
        const subject = userText.replace(/crée un schéma|génère un schéma|schéma ascii|diagramme ascii/gi, '').trim();
        const schema = await druideTask({
          prompt: `Crée un schéma ASCII clair et structuré pour: ${subject}\n\nUtilise des caractères ASCII: ┌─┐│└┘├┤┬┴┼►▼◄▲●○\nStructure le schéma de manière lisible avec des légendes.`,
          add_context_from_internet: false
        });
        push(`📐 ${t('voiceRoom.asciiDiagramGenerated')}:\n\n\`\`\`\n${schema}\n\`\`\``);
        await speak(t('voiceRoom.asciiDiagramSpeak'));
      } else {
        const research = await druideTask({
          prompt: `Recherche scientifique avec accès internet sur: ${userText}\n\nValide le concept, identifie les preuves, les hypothèses et les corrélations.\nRetourne une synthèse vocale concise mais informative.`,
          add_context_from_internet: true
        });
        push(`🔬 **${t('voiceRoom.scientificResearchResults')}:**\n\n${research}`);
        await speak(research);
      }
    } catch (e) {
      push("Je n'arrive pas à produire ça pour l'instant.");
    } finally {
      setBusy(false);
      setPhase("");
    }

    return true;
  }, [setMessages, speak, setBusy, setPhase, t]);
}