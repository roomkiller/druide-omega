import React from "react";
import DocumentViewer from "../components/docs/DocumentViewer";
import { Code, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/utils/LanguageContext";

export default function APIDocumentation() {
  const { language } = useLanguage();
  
  const sections = [
    {
      id: "auth",
      title: "Authentification",
      description: "Comment s'authentifier auprès de l'API Druide Omega",
      content: "Toutes les requêtes API nécessitent un token Bearer pour l'authentification. Vous pouvez obtenir votre clé API depuis les paramètres de votre compte.",
      code: `Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

# Obtenir une clé API:
# 1. Aller dans Paramètres > Sécurité > Clés API
# 2. Cliquer sur "Générer une nouvelle clé"
# 3. Copier la clé et la stocker en sécurité`,
      info: "Ne partagez jamais votre clé API publiquement. Traitez-la comme un mot de passe."
    },
    {
      id: "conversations",
      title: "Gestion des Conversations",
      description: "Endpoints pour créer et gérer les conversations",
      subsections: [
        {
          title: "GET /api/conversations",
          content: "Récupère la liste de toutes vos conversations avec pagination optionnelle."
        },
        {
          title: "POST /api/conversations",
          content: "Crée une nouvelle conversation avec un titre et des messages initiaux."
        },
        {
          title: "GET /api/conversations/:id",
          content: "Récupère une conversation spécifique avec tous ses messages."
        },
        {
          title: "DELETE /api/conversations/:id",
          content: "Supprime définitivement une conversation."
        }
      ],
      code: `// Créer une conversation
POST /api/conversations
{
  "title": "Nouvelle conversation",
  "messages": [
    {
      "role": "user",
      "content": "Bonjour!"
    }
  ]
}

// Réponse
{
  "id": "conv_123",
  "title": "Nouvelle conversation",
  "created_date": "2025-01-16T10:00:00Z",
  "updated_date": "2025-01-16T10:00:00Z"
}`
    },
    {
      id: "memories",
      title: "Système de Mémoire",
      description: "Endpoints pour gérer les mémoires persistantes",
      content: "Les mémoires permettent à Druide Omega de se souvenir d'informations importantes entre les sessions.",
      code: `// Lister les mémoires
GET /api/memories?importance=7&limit=20

// Réponse
{
  "data": [
    {
      "id": "mem_456",
      "content": "L'utilisateur préfère le café noir",
      "type": "preference",
      "importance": 8,
      "tags": ["preference", "food"],
      "created_date": "2025-01-15T14:30:00Z"
    }
  ],
  "total": 45,
  "page": 1
}

// Créer une mémoire
POST /api/memories
{
  "content": "Information importante à retenir",
  "type": "fact",
  "importance": 9,
  "tags": ["important", "project"]
}`
    },
    {
      id: "knowledge",
      title: "Base de Connaissances",
      description: "Endpoints pour gérer les documents de connaissances",
      subsections: [
        {
          title: "POST /api/knowledge",
          content: "Upload un document (PDF, TXT, CSV, image) pour enrichir la base de connaissances."
        },
        {
          title: "GET /api/knowledge",
          content: "Liste tous les documents avec filtres optionnels par tags."
        },
        {
          title: "DELETE /api/knowledge/:id",
          content: "Supprime un document de la base de connaissances."
        }
      ],
      code: `// Upload un document
POST /api/knowledge
Content-Type: multipart/form-data

{
  "file": <binary>,
  "title": "Guide technique",
  "tags": ["documentation", "technique"],
  "extract_facts": true
}

// Réponse
{
  "id": "kb_789",
  "title": "Guide technique",
  "file_url": "https://...",
  "facts_extracted": 42,
  "created_date": "2025-01-16T11:00:00Z"
}`
    },
    {
      id: "llm",
      title: "Invocation LLM Directe",
      description: "Utiliser directement le moteur LLM avec paramètres avancés",
      content: "Pour des cas d'usage avancés, vous pouvez invoquer directement le LLM avec un contrôle total sur les paramètres.",
      code: `POST /api/llm/invoke
{
  "prompt": "Analyse cette donnée et donne-moi des insights",
  "add_context_from_internet": true,
  "response_json_schema": {
    "type": "object",
    "properties": {
      "summary": { "type": "string" },
      "insights": { 
        "type": "array", 
        "items": { "type": "string" }
      }
    }
  }
}

// Réponse structurée JSON
{
  "summary": "Analyse complète...",
  "insights": [
    "Insight 1",
    "Insight 2"
  ]
}`,
      warning: "L'invocation directe du LLM consomme des crédits. Utilisez-la avec parcimonie."
    },
    {
      id: "webhooks",
      title: "Webhooks",
      description: "Recevoir des notifications en temps réel",
      content: "Configurez des webhooks pour être notifié automatiquement lors d'événements importants.",
      items: [
        "conversation.created - Nouvelle conversation créée",
        "memory.created - Nouvelle mémoire ajoutée",
        "knowledge.uploaded - Document uploadé avec succès",
        "synthesis.completed - Synthèse intelligente terminée"
      ],
      code: `// Configuration webhook
POST /api/webhooks
{
  "url": "https://votre-serveur.com/webhook",
  "events": [
    "conversation.created",
    "memory.created"
  ],
  "secret": "votre_secret_webhook"
}

// Format de payload reçu
{
  "event": "memory.created",
  "data": {
    "id": "mem_123",
    "content": "...",
    "importance": 8
  },
  "timestamp": "2025-01-16T12:00:00Z",
  "signature": "sha256_signature"
}`
    },
    {
      id: "rate-limits",
      title: "Limites de Taux",
      description: "Comprendre les limites d'utilisation de l'API",
      items: [
        "Gratuit: 100 requêtes/heure",
        "Pro: 1000 requêtes/heure",
        "Enterprise: Illimité avec SLA",
        "Headers de réponse: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset"
      ],
      code: `// Headers de réponse
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 856
X-RateLimit-Reset: 1705406400

// Erreur 429 si limite dépassée
{
  "error": "rate_limit_exceeded",
  "message": "Trop de requêtes. Réessayez dans 15 minutes.",
  "retry_after": 900
}`,
      info: "Les limites se réinitialisent chaque heure glissante."
    },
    {
      id: "errors",
      title: "Codes d'Erreur",
      description: "Liste complète des codes d'erreur API",
      items: [
        "400 - Bad Request: Paramètres invalides",
        "401 - Unauthorized: Token manquant ou invalide",
        "403 - Forbidden: Accès refusé à cette ressource",
        "404 - Not Found: Ressource introuvable",
        "429 - Too Many Requests: Limite de taux dépassée",
        "500 - Internal Server Error: Erreur serveur",
        "503 - Service Unavailable: Service temporairement indisponible"
      ],
      code: `// Format d'erreur standard
{
  "error": "invalid_request",
  "message": "Le paramètre 'importance' doit être entre 1 et 10",
  "details": {
    "field": "importance",
    "value": 15,
    "expected": "integer between 1 and 10"
  }
}`
    }
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 sm:px-6 py-4 bg-white border-b border-slate-200">
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
      <DocumentViewer
        title="Documentation API"
        subtitle="REST API complète pour intégrations externes"
        icon={Code}
        sections={sections}
        colorScheme="blue"
        tableOfContents={true}
      />
    </div>
  );
}