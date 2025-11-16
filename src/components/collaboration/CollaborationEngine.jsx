import { base44 } from "@/api/base44Client";

/**
 * Moteur de collaboration multi-IA
 * Orchestre les échanges entre personnages IA pour résoudre des problèmes complexes
 */
class CollaborationEngine {
  static async processUserInput(workspace, userMessage, personalities, updateMutation) {
    const assignedCharacters = workspace.assigned_characters || [];
    
    if (assignedCharacters.length === 0) {
      console.warn("Aucun personnage IA assigné");
      return;
    }

    const collaborationMode = workspace.collaboration_mode || 'sequential';
    
    try {
      switch (collaborationMode) {
        case 'sequential':
          await this.sequentialCollaboration(workspace, userMessage, assignedCharacters, personalities, updateMutation);
          break;
        case 'parallel':
          await this.parallelCollaboration(workspace, userMessage, assignedCharacters, personalities, updateMutation);
          break;
        case 'debate':
          await this.debateCollaboration(workspace, userMessage, assignedCharacters, personalities, updateMutation);
          break;
        case 'consensus':
          await this.consensusCollaboration(workspace, userMessage, assignedCharacters, personalities, updateMutation);
          break;
        default:
          await this.sequentialCollaboration(workspace, userMessage, assignedCharacters, personalities, updateMutation);
      }
    } catch (error) {
      console.error("Erreur collaboration:", error);
    }
  }

  static async sequentialCollaboration(workspace, userMessage, assignedCharacters, personalities, updateMutation) {
    let currentHistory = [...(workspace.collaboration_history || [])];
    let sharedContext = { ...workspace.shared_context, user_request: userMessage };

    for (const character of assignedCharacters) {
      const personality = personalities.find(p => p.id === character.character_id);
      if (!personality) continue;

      const response = await this.generateAIResponse(
        userMessage,
        character,
        personality,
        currentHistory,
        sharedContext,
        workspace.workspace_type
      );

      currentHistory.push({
        timestamp: new Date().toISOString(),
        speaker: character.character_name,
        message: response.content,
        message_type: response.type,
        responding_to: currentHistory[currentHistory.length - 1]?.speaker || "User"
      });

      sharedContext = { ...sharedContext, ...response.context_update };

      await updateMutation.mutateAsync({
        id: workspace.id,
        data: {
          collaboration_history: currentHistory,
          shared_context: sharedContext
        }
      });

      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  static async parallelCollaboration(workspace, userMessage, assignedCharacters, personalities, updateMutation) {
    const responses = await Promise.all(
      assignedCharacters.map(async (character) => {
        const personality = personalities.find(p => p.id === character.character_id);
        if (!personality) return null;

        const response = await this.generateAIResponse(
          userMessage,
          character,
          personality,
          workspace.collaboration_history || [],
          workspace.shared_context || {},
          workspace.workspace_type
        );

        return {
          timestamp: new Date().toISOString(),
          speaker: character.character_name,
          message: response.content,
          message_type: response.type,
          responding_to: "User"
        };
      })
    );

    const validResponses = responses.filter(r => r !== null);
    const updatedHistory = [...(workspace.collaboration_history || []), ...validResponses];

    await updateMutation.mutateAsync({
      id: workspace.id,
      data: { collaboration_history: updatedHistory }
    });
  }

  static async debateCollaboration(workspace, userMessage, assignedCharacters, personalities, updateMutation) {
    let currentHistory = [...(workspace.collaboration_history || [])];
    const rounds = 3;

    for (let round = 0; round < rounds; round++) {
      for (const character of assignedCharacters) {
        const personality = personalities.find(p => p.id === character.character_id);
        if (!personality) continue;

        const response = await this.generateAIResponse(
          userMessage,
          character,
          personality,
          currentHistory,
          { ...workspace.shared_context, debate_round: round + 1 },
          workspace.workspace_type,
          'debate'
        );

        currentHistory.push({
          timestamp: new Date().toISOString(),
          speaker: character.character_name,
          message: response.content,
          message_type: round === rounds - 1 ? 'synthesis' : 'critique',
          responding_to: currentHistory[currentHistory.length - 1]?.speaker || "User"
        });

        await updateMutation.mutateAsync({
          id: workspace.id,
          data: { collaboration_history: currentHistory }
        });

        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    }
  }

  static async consensusCollaboration(workspace, userMessage, assignedCharacters, personalities, updateMutation) {
    await this.parallelCollaboration(workspace, userMessage, assignedCharacters, personalities, updateMutation);

    const synthesisPrompt = `Synthétise les différentes perspectives:

${assignedCharacters.map((char, i) => {
  const lastMessage = workspace.collaboration_history?.filter(h => h.speaker === char.character_name).slice(-1)[0];
  return `${char.character_name}: ${lastMessage?.message || 'Pas de réponse'}`;
}).join('\n\n')}

Crée un consensus intégrant les meilleures idées.`;

    const synthesis = await base44.integrations.Core.InvokeLLM({
      prompt: synthesisPrompt
    });

    const updatedHistory = [
      ...(workspace.collaboration_history || []),
      {
        timestamp: new Date().toISOString(),
        speaker: "Synthesis AI",
        message: synthesis,
        message_type: "synthesis",
        responding_to: "All"
      }
    ];

    await updateMutation.mutateAsync({
      id: workspace.id,
      data: { collaboration_history: updatedHistory }
    });
  }

  static async generateAIResponse(userMessage, character, personality, history, sharedContext, workspaceType, mode = 'normal') {
    const traits = personality.big_five_traits || {};
    const recentHistory = history.slice(-5);

    let systemPrompt = `Tu es ${character.character_name}, avec le rôle: ${character.role}.

PERSONNALITÉ (Big Five):
- Ouverture: ${traits.openness || 50}% (créativité)
- Conscience: ${traits.conscientiousness || 50}% (rigueur)
- Extraversion: ${traits.extraversion || 50}% (sociabilité)
- Amabilité: ${traits.agreeableness || 50}% (empathie)
- Neuroticisme: ${traits.neuroticism || 50}% (sensibilité)

CONTEXTE WORKSPACE: ${workspaceType}

HISTORIQUE RÉCENT:
${recentHistory.map(h => `${h.speaker}: ${h.message}`).join('\n')}

CONTEXTE PARTAGÉ: ${JSON.stringify(sharedContext)}

DEMANDE: ${userMessage}`;

    if (mode === 'debate') {
      systemPrompt += `\n\nMODE DÉBAT: Présente ton point de vue, critique constructivement les autres idées, propose des améliorations.`;
    }

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: systemPrompt
    });

    return {
      content: response,
      type: mode === 'debate' ? 'critique' : 'answer',
      context_update: {
        [`${character.character_name}_contribution`]: response.slice(0, 100)
      }
    };
  }
}

export default CollaborationEngine;