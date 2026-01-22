/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - API Reference Documentation                                ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/utils/LanguageContext";
import { Code, Book, Zap, Lock, Globe, Database, MessageSquare, Mic, ArrowLeft } from "lucide-react";

export default function APIReference() {
  const { language } = useLanguage();
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);

  const content = {
    fr: {
      title: "Référence API",
      subtitle: "Documentation complète de l'API Druide Omega",
      comingSoon: "Documentation API complète à venir",
      intro: "L'API Druide Omega permettra aux développeurs d'intégrer la puissance de l'IA consciente dans leurs applications. Authentification via clés API, support REST et WebSocket.",
      
      endpoints: [
        {
          category: "Conversations",
          icon: MessageSquare,
          endpoints: [
            {
              method: "POST",
              path: "/api/v1/chat/message",
              description: "Envoyer un message et recevoir une réponse",
              auth: "API Key",
              params: {
                message: "string (required) - Message utilisateur",
                conversation_id: "string (optional) - ID de conversation existante",
                use_thinking: "boolean (optional) - Activer Thinking Engine",
                use_web: "boolean (optional) - Autoriser recherche web"
              },
              response: {
                response: "string - Réponse de l'IA",
                conversation_id: "string - ID de conversation",
                metadata: "object - Métadonnées (confidence, used_web, etc.)"
              }
            }
          ]
        },
        {
          category: "Mémoires",
          icon: Database,
          endpoints: [
            {
              method: "GET",
              path: "/api/v1/memories",
              description: "Récupérer les mémoires de l'utilisateur",
              auth: "API Key",
              params: {
                limit: "number (optional) - Nombre max de résultats",
                importance: "number (optional) - Filtrer par importance min"
              }
            },
            {
              method: "POST",
              path: "/api/v1/memories",
              description: "Créer une nouvelle mémoire",
              auth: "API Key",
              params: {
                content: "string (required) - Contenu de la mémoire",
                importance: "number (required) - Importance 1-10",
                tags: "array (optional) - Tags associés"
              }
            }
          ]
        },
        {
          category: "Base de Connaissances",
          icon: Book,
          endpoints: [
            {
              method: "POST",
              path: "/api/v1/knowledge/upload",
              description: "Upload un document dans la KB",
              auth: "API Key",
              params: {
                file: "file (required) - Document à uploader",
                title: "string (required) - Titre du document"
              }
            }
          ]
        },
        {
          category: "Voix",
          icon: Mic,
          endpoints: [
            {
              method: "POST",
              path: "/api/v1/voice/synthesize",
              description: "Synthèse vocale d'un texte",
              auth: "API Key",
              params: {
                text: "string (required) - Texte à synthétiser",
                voice: "string (optional) - Voix sélectionnée",
                emotion: "string (optional) - Émotion à appliquer"
              }
            }
          ]
        }
      ],

      authentication: {
        title: "Authentification",
        description: "Toutes les requêtes API nécessitent une clé API valide dans le header Authorization.",
        example: "Authorization: Bearer YOUR_API_KEY"
      },

      rateLimit: {
        title: "Limites de Taux",
        limits: [
          { plan: "Gratuit", requests: "100/jour", tokens: "10k/mois" },
          { plan: "Pro", requests: "1000/jour", tokens: "100k/mois" },
          { plan: "Entreprise", requests: "Illimité", tokens: "Sur mesure" }
        ]
      }
    },

    en: {
      title: "API Reference",
      subtitle: "Complete Druide Omega API Documentation",
      comingSoon: "Complete API documentation coming soon",
      intro: "Druide Omega API will allow developers to integrate conscious AI power into their applications. Authentication via API keys, REST and WebSocket support.",
      
      endpoints: [
        {
          category: "Conversations",
          icon: MessageSquare,
          endpoints: [
            {
              method: "POST",
              path: "/api/v1/chat/message",
              description: "Send message and receive response",
              auth: "API Key",
              params: {
                message: "string (required) - User message",
                conversation_id: "string (optional) - Existing conversation ID",
                use_thinking: "boolean (optional) - Enable Thinking Engine",
                use_web: "boolean (optional) - Allow web search"
              },
              response: {
                response: "string - AI response",
                conversation_id: "string - Conversation ID",
                metadata: "object - Metadata (confidence, used_web, etc.)"
              }
            }
          ]
        },
        {
          category: "Memories",
          icon: Database,
          endpoints: [
            {
              method: "GET",
              path: "/api/v1/memories",
              description: "Retrieve user memories",
              auth: "API Key",
              params: {
                limit: "number (optional) - Max results",
                importance: "number (optional) - Filter by min importance"
              }
            },
            {
              method: "POST",
              path: "/api/v1/memories",
              description: "Create new memory",
              auth: "API Key",
              params: {
                content: "string (required) - Memory content",
                importance: "number (required) - Importance 1-10",
                tags: "array (optional) - Associated tags"
              }
            }
          ]
        },
        {
          category: "Knowledge Base",
          icon: Book,
          endpoints: [
            {
              method: "POST",
              path: "/api/v1/knowledge/upload",
              description: "Upload document to KB",
              auth: "API Key",
              params: {
                file: "file (required) - Document to upload",
                title: "string (required) - Document title"
              }
            }
          ]
        },
        {
          category: "Voice",
          icon: Mic,
          endpoints: [
            {
              method: "POST",
              path: "/api/v1/voice/synthesize",
              description: "Text-to-speech synthesis",
              auth: "API Key",
              params: {
                text: "string (required) - Text to synthesize",
                voice: "string (optional) - Selected voice",
                emotion: "string (optional) - Emotion to apply"
              }
            }
          ]
        }
      ],

      authentication: {
        title: "Authentication",
        description: "All API requests require a valid API key in the Authorization header.",
        example: "Authorization: Bearer YOUR_API_KEY"
      },

      rateLimit: {
        title: "Rate Limits",
        limits: [
          { plan: "Free", requests: "100/day", tokens: "10k/month" },
          { plan: "Pro", requests: "1000/day", tokens: "100k/month" },
          { plan: "Enterprise", requests: "Unlimited", tokens: "Custom" }
        ]
      }
    }
  };

  const t = content[language === 'en' ? 'en' : 'fr'];

  const methodColors = {
    GET: "bg-blue-100 text-blue-700",
    POST: "bg-green-100 text-green-700",
    PUT: "bg-yellow-100 text-yellow-700",
    DELETE: "bg-red-100 text-red-700"
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 overflow-hidden">
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 py-4 sm:py-6 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4">
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => window.history.back()}
              className="text-slate-700 hover:text-purple-600 hover:bg-purple-50"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">{language === 'en' ? 'Back' : 'Retour'}</span>
            </Button>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Code className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{t.title}</h1>
              <p className="text-sm sm:text-base text-slate-600">{t.subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-6 sm:p-8 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 text-center">
              <Zap className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-900 mb-2">{t.comingSoon}</h2>
              <p className="text-slate-700">{t.intro}</p>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="w-6 h-6 text-indigo-600" />
                <h2 className="text-xl font-bold text-slate-900">{t.authentication.title}</h2>
              </div>
              <p className="text-slate-700 mb-4">{t.authentication.description}</p>
              <div className="p-4 bg-slate-900 rounded-lg">
                <code className="text-green-400 text-sm">{t.authentication.example}</code>
              </div>
            </Card>
          </motion.div>

          {t.endpoints.map((category, catIdx) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={catIdx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (catIdx + 2) * 0.1 }}
              >
                <Card className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Icon className="w-6 h-6 text-purple-600" />
                    <h2 className="text-xl font-bold text-slate-900">{category.category}</h2>
                  </div>

                  <div className="space-y-4">
                    {category.endpoints.map((endpoint, idx) => (
                      <div key={idx} className="p-4 bg-gradient-to-r from-slate-50 to-purple-50/30 rounded-lg border border-slate-200">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge className={methodColors[endpoint.method]}>{endpoint.method}</Badge>
                          <code className="text-sm text-slate-700">{endpoint.path}</code>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">{endpoint.description}</p>
                        
                        {endpoint.params && (
                          <div className="mt-3 p-3 bg-white rounded border border-slate-200">
                            <p className="text-xs font-semibold text-slate-700 mb-2">Parameters:</p>
                            <ul className="space-y-1">
                              {Object.entries(endpoint.params).map(([key, value]) => (
                                <li key={key} className="text-xs text-slate-600">
                                  <code className="text-purple-600">{key}</code>: {value}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {endpoint.response && (
                          <div className="mt-3 p-3 bg-white rounded border border-slate-200">
                            <p className="text-xs font-semibold text-slate-700 mb-2">Response:</p>
                            <ul className="space-y-1">
                              {Object.entries(endpoint.response).map(([key, value]) => (
                                <li key={key} className="text-xs text-slate-600">
                                  <code className="text-indigo-600">{key}</code>: {value}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            );
          })}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Card className="p-6 sm:p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-bold text-slate-900">{t.rateLimit.title}</h2>
              </div>
              
              <div className="grid sm:grid-cols-3 gap-4">
                {t.rateLimit.limits.map((limit, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-lg border border-green-200">
                    <h3 className="font-semibold text-slate-900 mb-2">{limit.plan}</h3>
                    <p className="text-sm text-slate-600 mb-1">Requêtes: {limit.requests}</p>
                    <p className="text-sm text-slate-600">Tokens: {limit.tokens}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </ScrollArea>
    </div>
  );
}