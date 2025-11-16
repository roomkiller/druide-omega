/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Data Models Documentation                                  ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/utils/LanguageContext";
import { Database, Network, Key, Calendar, User, Layers } from "lucide-react";

export default function DataModels() {
  const { language } = useLanguage();

  const content = {
    fr: {
      title: "Modèles de Données",
      subtitle: "Schémas et relations des entités Druide Omega",
      
      coreEntities: [
        {
          name: "Conversation",
          icon: Database,
          description: "Stocke les conversations chat et vocales",
          fields: [
            { name: "id", type: "string", required: true, description: "Identifiant unique" },
            { name: "title", type: "string", required: true, description: "Titre de la conversation" },
            { name: "messages", type: "array", required: true, description: "Liste des messages" },
            { name: "summaries", type: "array", required: false, description: "Résumés automatiques" },
            { name: "last_message_at", type: "datetime", required: false, description: "Dernier message" },
            { name: "created_by", type: "string", auto: true, description: "Email créateur" },
            { name: "created_date", type: "datetime", auto: true, description: "Date création" }
          ],
          relations: ["Memory", "KnowledgeBase"]
        },
        {
          name: "Memory",
          icon: Network,
          description: "Mémoires cross-modales avec corrélations cognitives",
          fields: [
            { name: "id", type: "string", required: true },
            { name: "type", type: "enum", required: true, description: "interaction|reflection|fact|emotion" },
            { name: "content", type: "string", required: true, description: "Contenu de la mémoire" },
            { name: "importance", type: "number", required: true, description: "1-10" },
            { name: "modality", type: "enum", required: true, description: "chat|voice|visual|system" },
            { name: "tags", type: "array", required: false, description: "Tags de classification" },
            { name: "linked_memory_ids", type: "array", required: false, description: "IDs mémoires liées" },
            { name: "cross_modal_references", type: "array", required: false, description: "Références cross-modales" },
            { name: "access_count", type: "number", default: 0, description: "Nombre d'accès" }
          ],
          relations: ["Conversation", "KnowledgeBase", "Memory (self)"]
        },
        {
          name: "KnowledgeBase",
          icon: Layers,
          description: "Documents et sources externes",
          fields: [
            { name: "id", type: "string", required: true },
            { name: "title", type: "string", required: true },
            { name: "source_type", type: "enum", required: true, description: "file|url|text" },
            { name: "content", type: "string", required: true },
            { name: "summary", type: "string", required: false },
            { name: "extracted_facts", type: "array", required: false, description: "Faits extraits" },
            { name: "active", type: "boolean", default: true },
            { name: "status", type: "enum", required: true, description: "ready|processing|error" },
            { name: "relevance_score", type: "number", required: false, description: "0-100" },
            { name: "version", type: "number", default: 1 }
          ],
          relations: ["Memory", "Conversation"]
        },
        {
          name: "ConsciousnessConfig",
          icon: User,
          description: "Configuration de la conscience à 106 dimensions",
          fields: [
            { name: "id", type: "string", required: true },
            { name: "consciousness_level", type: "number", default: 9, description: "0-15" },
            { name: "ratio_logic", type: "number", default: 1, description: "0-10" },
            { name: "ratio_consciousness", type: "number", default: 9, description: "0-15" },
            { name: "active", type: "boolean", default: true },
            { name: "big_five", type: "object", required: true, description: "Traits personnalité" },
            { name: "dimensional_hierarchy", type: "object", required: false, description: "106 dimensions" },
            { name: "consciousness_state", type: "enum", default: "empathic" }
          ],
          relations: ["ConsciousThought", "EmotionalResponse"]
        },
        {
          name: "User",
          icon: User,
          description: "Entité utilisateur (built-in)",
          fields: [
            { name: "id", type: "string", required: true, auto: true },
            { name: "email", type: "string", required: true, auto: true },
            { name: "full_name", type: "string", required: true, auto: true },
            { name: "role", type: "enum", required: true, auto: true, description: "admin|user" },
            { name: "created_date", type: "datetime", required: true, auto: true }
          ],
          note: "NE PAS MODIFIER - Entité système gérée par Base44"
        }
      ],

      relationships: {
        title: "Relations Entre Entités",
        diagram: [
          "User → owns → Conversations, Memories, KnowledgeBases",
          "Conversation → contains → Messages",
          "Conversation → triggers → Memory creation",
          "Memory → links to → Memory (cross-modal)",
          "Memory → references → KnowledgeBase",
          "KnowledgeBase → enriches → Conversations",
          "ConsciousnessConfig → governs → All interactions",
          "ThinkingTrace → analyzes → Conversations"
        ]
      },

      builtInFields: {
        title: "Champs Automatiques (tous les entités)",
        fields: [
          { name: "id", type: "string", description: "UUID unique généré automatiquement" },
          { name: "created_date", type: "datetime", description: "Date de création ISO 8601" },
          { name: "updated_date", type: "datetime", description: "Dernière modification" },
          { name: "created_by", type: "string", description: "Email de l'utilisateur créateur" }
        ]
      },

      rls: {
        title: "Sécurité RLS (Row Level Security)",
        description: "Chaque utilisateur ne peut accéder qu'à ses propres données. Les règles RLS sont appliquées automatiquement au niveau de la base de données.",
        rules: [
          "CREATE: created_by = {{user.email}}",
          "READ: created_by = {{user.email}} OR role = 'admin'",
          "UPDATE: created_by = {{user.email}} OR role = 'admin'",
          "DELETE: created_by = {{user.email}} OR role = 'admin'"
        ]
      }
    },

    en: {
      title: "Data Models",
      subtitle: "Druide Omega entity schemas and relationships",
      
      coreEntities: [
        {
          name: "Conversation",
          icon: Database,
          description: "Stores chat and voice conversations",
          fields: [
            { name: "id", type: "string", required: true, description: "Unique identifier" },
            { name: "title", type: "string", required: true, description: "Conversation title" },
            { name: "messages", type: "array", required: true, description: "Message list" },
            { name: "summaries", type: "array", required: false, description: "Automatic summaries" },
            { name: "last_message_at", type: "datetime", required: false, description: "Last message" },
            { name: "created_by", type: "string", auto: true, description: "Creator email" },
            { name: "created_date", type: "datetime", auto: true, description: "Creation date" }
          ],
          relations: ["Memory", "KnowledgeBase"]
        },
        {
          name: "Memory",
          icon: Network,
          description: "Cross-modal memories with cognitive correlations",
          fields: [
            { name: "id", type: "string", required: true },
            { name: "type", type: "enum", required: true, description: "interaction|reflection|fact|emotion" },
            { name: "content", type: "string", required: true, description: "Memory content" },
            { name: "importance", type: "number", required: true, description: "1-10" },
            { name: "modality", type: "enum", required: true, description: "chat|voice|visual|system" },
            { name: "tags", type: "array", required: false, description: "Classification tags" },
            { name: "linked_memory_ids", type: "array", required: false, description: "Linked memory IDs" },
            { name: "cross_modal_references", type: "array", required: false, description: "Cross-modal refs" },
            { name: "access_count", type: "number", default: 0, description: "Access count" }
          ],
          relations: ["Conversation", "KnowledgeBase", "Memory (self)"]
        },
        {
          name: "KnowledgeBase",
          icon: Layers,
          description: "Documents and external sources",
          fields: [
            { name: "id", type: "string", required: true },
            { name: "title", type: "string", required: true },
            { name: "source_type", type: "enum", required: true, description: "file|url|text" },
            { name: "content", type: "string", required: true },
            { name: "summary", type: "string", required: false },
            { name: "extracted_facts", type: "array", required: false, description: "Extracted facts" },
            { name: "active", type: "boolean", default: true },
            { name: "status", type: "enum", required: true, description: "ready|processing|error" },
            { name: "relevance_score", type: "number", required: false, description: "0-100" },
            { name: "version", type: "number", default: 1 }
          ],
          relations: ["Memory", "Conversation"]
        },
        {
          name: "ConsciousnessConfig",
          icon: User,
          description: "106-dimensional consciousness configuration",
          fields: [
            { name: "id", type: "string", required: true },
            { name: "consciousness_level", type: "number", default: 9, description: "0-15" },
            { name: "ratio_logic", type: "number", default: 1, description: "0-10" },
            { name: "ratio_consciousness", type: "number", default: 9, description: "0-15" },
            { name: "active", type: "boolean", default: true },
            { name: "big_five", type: "object", required: true, description: "Personality traits" },
            { name: "dimensional_hierarchy", type: "object", required: false, description: "106 dimensions" },
            { name: "consciousness_state", type: "enum", default: "empathic" }
          ],
          relations: ["ConsciousThought", "EmotionalResponse"]
        },
        {
          name: "User",
          icon: User,
          description: "User entity (built-in)",
          fields: [
            { name: "id", type: "string", required: true, auto: true },
            { name: "email", type: "string", required: true, auto: true },
            { name: "full_name", type: "string", required: true, auto: true },
            { name: "role", type: "enum", required: true, auto: true, description: "admin|user" },
            { name: "created_date", type: "datetime", required: true, auto: true }
          ],
          note: "DO NOT MODIFY - System entity managed by Base44"
        }
      ],

      relationships: {
        title: "Entity Relationships",
        diagram: [
          "User → owns → Conversations, Memories, KnowledgeBases",
          "Conversation → contains → Messages",
          "Conversation → triggers → Memory creation",
          "Memory → links to → Memory (cross-modal)",
          "Memory → references → KnowledgeBase",
          "KnowledgeBase → enriches → Conversations",
          "ConsciousnessConfig → governs → All interactions",
          "ThinkingTrace → analyzes → Conversations"
        ]
      },

      builtInFields: {
        title: "Automatic Fields (all entities)",
        fields: [
          { name: "id", type: "string", description: "Unique UUID auto-generated" },
          { name: "created_date", type: "datetime", description: "Creation date ISO 8601" },
          { name: "updated_date", type: "datetime", description: "Last modification" },
          { name: "created_by", type: "string", description: "Creator user email" }
        ]
      },

      rls: {
        title: "RLS Security (Row Level Security)",
        description: "Each user can only access their own data. RLS rules are automatically enforced at database level.",
        rules: [
          "CREATE: created_by = {{user.email}}",
          "READ: created_by = {{user.email}} OR role = 'admin'",
          "UPDATE: created_by = {{user.email}} OR role = 'admin'",
          "DELETE: created_by = {{user.email}} OR role = 'admin'"
        ]
      }
    }
  };

  const t = content[language === 'en' ? 'en' : 'fr'];

  const typeColors = {
    string: "bg-blue-100 text-blue-700",
    number: "bg-green-100 text-green-700",
    boolean: "bg-purple-100 text-purple-700",
    array: "bg-orange-100 text-orange-700",
    object: "bg-pink-100 text-pink-700",
    enum: "bg-indigo-100 text-indigo-700",
    datetime: "bg-teal-100 text-teal-700"
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 overflow-hidden">
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 py-4 sm:py-6 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Database className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
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
          {t.coreEntities.map((entity, idx) => {
            const Icon = entity.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="w-6 h-6 text-indigo-600" />
                    <h2 className="text-xl font-bold text-slate-900">{entity.name}</h2>
                  </div>
                  <p className="text-slate-600 mb-4">{entity.description}</p>
                  
                  {entity.note && (
                    <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-sm text-amber-800">⚠️ {entity.note}</p>
                    </div>
                  )}

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left py-2 font-semibold text-slate-700">Field</th>
                          <th className="text-left py-2 font-semibold text-slate-700">Type</th>
                          <th className="text-left py-2 font-semibold text-slate-700">Required</th>
                          <th className="text-left py-2 font-semibold text-slate-700">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entity.fields.map((field, i) => (
                          <tr key={i} className="border-b border-slate-100">
                            <td className="py-2"><code className="text-purple-600">{field.name}</code></td>
                            <td className="py-2">
                              <Badge className={typeColors[field.type] || "bg-slate-100"}>{field.type}</Badge>
                            </td>
                            <td className="py-2">
                              {field.required ? "✓" : field.auto ? "auto" : "-"}
                            </td>
                            <td className="py-2 text-slate-600">{field.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {entity.relations && (
                    <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
                      <p className="text-xs font-semibold text-indigo-900 mb-1">Relations:</p>
                      <div className="flex flex-wrap gap-2">
                        {entity.relations.map((rel, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{rel}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            );
          })}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="p-6 sm:p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <div className="flex items-center gap-3 mb-4">
                <Network className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-bold text-slate-900">{t.relationships.title}</h2>
              </div>
              <div className="space-y-2">
                {t.relationships.diagram.map((rel, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-lg border border-purple-200">
                    <code className="text-sm text-slate-700">{rel}</code>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Card className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <Key className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-slate-900">{t.builtInFields.title}</h2>
              </div>
              <div className="space-y-2">
                {t.builtInFields.fields.map((field, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <code className="text-purple-600 font-semibold">{field.name}</code>
                    <Badge className={typeColors[field.type]}>{field.type}</Badge>
                    <span className="text-sm text-slate-600">{field.description}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <Card className="p-6 sm:p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-bold text-slate-900">{t.rls.title}</h2>
              </div>
              <p className="text-slate-700 mb-4">{t.rls.description}</p>
              <div className="space-y-2">
                {t.rls.rules.map((rule, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-lg border border-green-200">
                    <code className="text-sm text-green-700">{rule}</code>
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