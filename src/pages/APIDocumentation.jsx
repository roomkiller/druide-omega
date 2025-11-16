import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Code } from "lucide-react";

export default function APIDocumentation() {
  const endpoints = [
    {
      method: "GET",
      path: "/api/conversations",
      description: "Liste des conversations",
      auth: "Bearer token",
      response: `{ "data": [{ "id": "123", "title": "..." }] }`
    },
    {
      method: "POST",
      path: "/api/conversations",
      description: "Créer une conversation",
      auth: "Bearer token",
      body: `{ "title": "New chat", "messages": [] }`,
      response: `{ "id": "123", "created_date": "..." }`
    },
    {
      method: "GET",
      path: "/api/memories",
      description: "Liste des mémoires",
      auth: "Bearer token",
      params: "?importance=7&limit=20",
      response: `{ "data": [{ "id": "456", "content": "..." }] }`
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-12">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Code className="w-12 h-12 text-white" />
          <div>
            <h1 className="text-4xl font-bold text-white">API Documentation</h1>
            <p className="text-purple-100">REST API pour intégrations externes</p>
          </div>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="max-w-6xl mx-auto px-6 py-12 space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Authentification</h2>
            <pre className="bg-slate-900 text-green-400 p-4 rounded-lg">
{`Authorization: Bearer YOUR_API_KEY

Obtenir une clé: Settings > API Keys`}
            </pre>
          </Card>

          {endpoints.map((endpoint, i) => (
            <Card key={i} className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Badge className={endpoint.method === 'GET' ? 'bg-blue-500' : 'bg-green-500'}>
                  {endpoint.method}
                </Badge>
                <code className="text-lg font-mono">{endpoint.path}</code>
              </div>
              <p className="text-slate-600 mb-4">{endpoint.description}</p>
              
              {endpoint.body && (
                <div className="mb-4">
                  <p className="text-sm font-semibold mb-2">Request Body:</p>
                  <pre className="bg-slate-900 text-green-400 p-4 rounded-lg text-sm">{endpoint.body}</pre>
                </div>
              )}
              
              <div>
                <p className="text-sm font-semibold mb-2">Response:</p>
                <pre className="bg-slate-900 text-green-400 p-4 rounded-lg text-sm">{endpoint.response}</pre>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}