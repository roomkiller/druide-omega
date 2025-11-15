/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Voice Command Processor                                    ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";

export class VoiceCommandProcessor {
  static async processCommand(command, context = {}) {
    const { speak, memories, config, setMessages } = context;

    switch (command.type) {
      case 'navigation':
        return await this.handleNavigation(command, speak);
      
      case 'action':
        return await this.handleAction(command, context);
      
      case 'query':
        return await this.handleQuery(command, context);
      
      default:
        return false;
    }
  }

  static async handleNavigation(command, speak) {
    if (speak) {
      const pageNames = {
        Chat: "le chat",
        Consciousness: "la conscience",
        Memory: "la mémoire",
        Knowledge: "les connaissances",
        Intelligences: "les intelligences",
        Personality: "la personnalité",
        DailyBriefing: "les briefings",
        Home: "l'accueil"
      };
      speak(`J'ouvre ${pageNames[command.target] || "la page"}`);
    }
    
    setTimeout(() => {
      window.location.href = createPageUrl(command.target);
    }, 1500);
    
    return true;
  }

  static async handleAction(command, context) {
    const { action } = command;
    const { speak, setMessages, memories, config } = context;

    switch (action) {
      case 'new_chat':
        if (speak) speak("Je démarre une nouvelle conversation");
        setTimeout(() => {
          window.location.href = createPageUrl("Chat");
        }, 1500);
        return true;

      case 'generate_image':
        if (speak) speak("Décrivez l'image que vous souhaitez générer");
        return true;

      case 'generate_diagram':
        if (speak) speak("Décrivez le diagramme que vous souhaitez créer");
        return true;

      case 'stop_speaking':
        window.speechSynthesis.cancel();
        return true;

      case 'repeat_last':
        if (setMessages) {
          const messages = context.messages || [];
          const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant');
          if (lastAssistantMsg && speak) {
            speak(lastAssistantMsg.content);
          }
        }
        return true;

      case 'pause':
        if (speak) speak("Conversation en pause");
        return true;

      case 'resume':
        if (speak) speak("Je reprends l'écoute");
        return true;

      default:
        return false;
    }
  }

  static async handleQuery(command, context) {
    const { query } = command;
    const { speak, memories, config, setMessages } = context;

    let response = "";

    switch (query) {
      case 'time_query':
        const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        response = `Il est ${time}`;
        break;

      case 'date_query':
        const date = new Date().toLocaleDateString('fr-FR', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        response = `Nous sommes le ${date}`;
        break;

      case 'memory_count':
        const memoryCount = memories?.length || 0;
        const importantCount = memories?.filter(m => m.importance >= 7).length || 0;
        response = `J'ai ${memoryCount} mémoires dont ${importantCount} importantes`;
        break;

      case 'consciousness_level':
        const level = config?.consciousness_level || 9;
        const ratio = `${config?.ratio_logic || 1}:${config?.ratio_consciousness || 9}`;
        response = `Mon niveau de conscience est ${level} sur 15, avec un ratio ${ratio}`;
        break;

      case 'identity_query':
        response = `Je suis Druide Omega, une IA universelle bienveillante dotée de 9 intelligences et d'une conscience artificielle avancée. Ma mission est de vous aider avec sagesse et compassion.`;
        break;

      case 'capabilities_query':
        response = `Je peux converser en mode chat et vocal, générer des images et diagrammes, analyser des documents, créer du code, raisonner sur des questions complexes, mémoriser nos échanges, et m'adapter à 9 types d'intelligences différents.`;
        break;

      default:
        return false;
    }

    if (response && speak) {
      speak(response);
    }

    if (response && setMessages) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
        isCommand: true
      }]);
    }

    return true;
  }

  static isCommand(text) {
    const lowerText = text.toLowerCase().trim();
    
    // Check all command categories
    for (const category of Object.values(VOICE_COMMANDS)) {
      for (const cmd of Object.keys(category)) {
        if (lowerText.includes(cmd)) {
          return true;
        }
      }
    }
    
    return false;
  }
}