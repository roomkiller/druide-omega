import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Copy, Check, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function APIDocumentation() {
  const [copiedCode, setCopiedCode] = useState(null);

  const copyToClipboard = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    toast.success("Copié au presse-papiers");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const CodeBlock = ({ code, id, language = "javascript" }) => (
    <div className="bg-slate-900 rounded border border-slate-700 p-4 relative">
      <pre className="text-gray-300 text-sm overflow-x-auto">
        <code>{code}</code>
      </pre>
      <button
        onClick={() => copyToClipboard(code, id)}
        className="absolute top-2 right-2 p-2 bg-slate-700 hover:bg-slate-600 rounded text-gray-300 transition"
      >
        {copiedCode === id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );

  const entities = [
    {
      name: "UpdatePhase",
      description: "Phases de mise à jour du système",
      operations: [
        {
          method: "LIST",
          desc: "Récupérer toutes les phases",
          code: `await base44.entities.UpdatePhase.list();`,
        },
        {
          method: "GET",
          desc: "Récupérer une phase spécifique",
          code: `await base44.entities.UpdatePhase.filter(
  { id: "phase-id" },
  "-updated_date",
  1
);`,
        },
        {
          method: "CREATE",
          desc: "Créer une nouvelle phase",
          code: `await base44.entities.UpdatePhase.create({
  phase_number: 1,
  title: "Phase Title",
  status: "pending",
  progress: 0
});`,
        },
        {
          method: "UPDATE",
          desc: "Mettre à jour une phase",
          code: `await base44.entities.UpdatePhase.update(phaseId, {
  status: "in-progress",
  progress: 50
});`,
        },
      ],
    },
    {
      name: "Notification",
      description: "Notifications en temps réel",
      operations: [
        {
          method: "LIST",
          desc: "Récupérer les notifications",
          code: `await base44.entities.Notification.filter(
  { read: false }
);`,
        },
        {
          method: "CREATE",
          desc: "Créer une notification",
          code: `await base44.entities.Notification.create({
  type: "phase_status_changed",
  title: "Phase Updated",
  message: "Phase X status changed to completed",
  severity: "info"
});`,
        },
        {
          method: "UPDATE",
          desc: "Marquer comme lu",
          code: `await base44.entities.Notification.update(notifId, {
  read: true
});`,
        },
      ],
    },
    {
      name: "PhaseHistory",
      description: "Historique des modifications de phases",
      operations: [
        {
          method: "LIST",
          desc: "Récupérer l'historique",
          code: `await base44.entities.PhaseHistory.filter(
  { phase_id: "phase-id" },
  "-timestamp",
  50
);`,
        },
        {
          method: "CREATE",
          desc: "Enregistrer un changement",
          code: `await base44.entities.PhaseHistory.create({
  phase_id: "phase-id",
  change_type: "status",
  change_description: "Status changed",
  old_value: "pending",
  new_value: "completed"
});`,
        },
      ],
    },
  ];

  const functions = [
    {
      name: "auditApplication",
      description: "Audit complet de l'application",
      input: "{}",
      output: `{
  timestamp: string,
  sections: Array<{
    category: string,
    items: Array<{
      issue: string,
      severity: 'high' | 'medium' | 'low',
      status: string
    }>
  }>,
  summary: {
    totalIssues: number,
    highSeverity: number,
    mediumSeverity: number,
    lowSeverity: number
  }
}`,
      example: `const response = await base44.functions.invoke('auditApplication', {});
console.log(response.data);`,
    },
    {
      name: "logPhaseChange",
      description: "Enregistrer un changement de phase",
      input: `{
  phase_id: string,
  change_type: 'status' | 'progress' | 'milestone' | 'dependency' | 'description',
  change_description: string,
  old_value?: string,
  new_value?: string
}`,
      output: `{
  success: boolean,
  message: string,
  history_id?: string
}`,
      example: `await base44.functions.invoke('logPhaseChange', {
  phase_id: 'phase-1',
  change_type: 'status',
  change_description: 'Statut modifié',
  old_value: 'pending',
  new_value: 'completed'
});`,
    },
  ];

  const integrations = [
    {
      name: "Core.InvokeLLM",
      description: "Générer du contenu avec LLM",
      params: [
        { name: "prompt", type: "string", required: true },
        { name: "add_context_from_internet", type: "boolean", default: "false" },
        { name: "response_json_schema", type: "object", default: "null" },
      ],
      example: `const response = await base44.integrations.Core.InvokeLLM({
  prompt: "Analyser cette donnée",
  add_context_from_internet: true
});`,
    },
    {
      name: "Core.UploadFile",
      description: "Uploader un fichier",
      params: [
        { name: "file", type: "File", required: true },
      ],
      example: `const { file_url } = await base44.integrations.Core.UploadFile({
  file: fileInput.files[0]
});`,
    },
    {
      name: "Core.SendEmail",
      description: "Envoyer un email",
      params: [
        { name: "to", type: "string", required: true },
        { name: "subject", type: "string", required: true },
        { name: "body", type: "string", required: true },
      ],
      example: `await base44.integrations.Core.SendEmail({
  to: 'user@example.com',
  subject: 'Phase Update',
  body: 'Your phase has been updated'
});`,
    },
  ];

  const authentication = [
    {
      name: "Me",
      description: "Récupérer l'utilisateur actuel",
      code: `const user = await base44.auth.me();
console.log(user); // { email, full_name, role, id }`,
    },
    {
      name: "UpdateMe",
      description: "Mettre à jour le profil utilisateur",
      code: `await base44.auth.updateMe({
  customField: 'value'
});`,
    },
    {
      name: "isAuthenticated",
      description: "Vérifier si utilisateur authentifié",
      code: `const isAuth = await base44.auth.isAuthenticated();`,
    },
    {
      name: "Logout",
      description: "Déconnecter l'utilisateur",
      code: `await base44.auth.logout('/login');`,
    },
  ];

  const realtime = [
    {
      entity: "UpdatePhase",
      code: `const unsubscribe = base44.entities.UpdatePhase.subscribe((event) => {
  console.log(\`Phase \${event.id} was \${event.type}d\`);
  console.log('Data:', event.data);
});

// Cleanup
unsubscribe();`,
    },
    {
      entity: "Notification",
      code: `base44.entities.Notification.subscribe((event) => {
  if (event.type === 'create') {
    console.log('New notification:', event.data);
  }
});`,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">📖 Documentation API</h1>
          <p className="text-gray-400">Référence complète pour intégrer Druide Omega</p>
        </motion.div>

        {/* Quick Start */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border-purple-700">
            <CardHeader>
              <CardTitle className="text-white">🚀 Démarrage Rapide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-purple-300 font-semibold mb-2">Initialisation</h4>
                <CodeBlock
                  code={`import { base44 } from "@/api/base44Client";

// Récupérer l'utilisateur
const user = await base44.auth.me();

// Récupérer les données
const phases = await base44.entities.UpdatePhase.list();`}
                  id="quickstart"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Tabs */}
        <Tabs defaultValue="entities" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800 border border-slate-700">
            <TabsTrigger value="entities">📊 Entités</TabsTrigger>
            <TabsTrigger value="functions">⚙️ Fonctions</TabsTrigger>
            <TabsTrigger value="integrations">🔗 Intégrations</TabsTrigger>
            <TabsTrigger value="auth">🔐 Auth</TabsTrigger>
            <TabsTrigger value="realtime">⚡ Temps réel</TabsTrigger>
          </TabsList>

          {/* Entities */}
          <TabsContent value="entities" className="space-y-6 mt-6">
            <div className="text-gray-300 mb-6">
              <p className="mb-2">Opérations disponibles: <Badge>LIST</Badge> <Badge>FILTER</Badge> <Badge>CREATE</Badge> <Badge>UPDATE</Badge> <Badge>DELETE</Badge></p>
            </div>
            {entities.map((entity, idx) => (
              <motion.div
                key={entity.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">{entity.name}</CardTitle>
                    <p className="text-sm text-gray-400 mt-1">{entity.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {entity.operations.map((op, i) => (
                      <div key={i} className="border-b border-slate-700 pb-4 last:border-b-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-blue-600/30 text-blue-300 border-blue-600">{op.method}</Badge>
                          <span className="text-white text-sm">{op.desc}</span>
                        </div>
                        <CodeBlock code={op.code} id={`${entity.name}-${op.method}`} />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          {/* Functions */}
          <TabsContent value="functions" className="space-y-6 mt-6">
            {functions.map((func, idx) => (
              <motion.div
                key={func.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">{func.name}</CardTitle>
                    <p className="text-sm text-gray-400 mt-1">{func.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-white font-semibold mb-2">Input</h4>
                        <CodeBlock code={func.input} id={`${func.name}-input`} />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-2">Output</h4>
                        <CodeBlock code={func.output} id={`${func.name}-output`} />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-2">Exemple</h4>
                      <CodeBlock code={func.example} id={`${func.name}-example`} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          {/* Integrations */}
          <TabsContent value="integrations" className="space-y-6 mt-6">
            {integrations.map((integration, idx) => (
              <motion.div
                key={integration.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">{integration.name}</CardTitle>
                    <p className="text-sm text-gray-400 mt-1">{integration.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-white font-semibold mb-3">Paramètres</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-gray-300">
                          <thead>
                            <tr className="border-b border-slate-700">
                              <th className="text-left py-2 px-2 text-white">Nom</th>
                              <th className="text-left py-2 px-2 text-white">Type</th>
                              <th className="text-left py-2 px-2 text-white">Requis</th>
                            </tr>
                          </thead>
                          <tbody>
                            {integration.params.map((param) => (
                              <tr key={param.name} className="border-b border-slate-700/50">
                                <td className="py-2 px-2 font-mono text-purple-300">{param.name}</td>
                                <td className="py-2 px-2 font-mono text-gray-400">{param.type}</td>
                                <td className="py-2 px-2">
                                  {param.required ? (
                                    <Badge className="bg-red-600/30 text-red-300 border-red-600">Oui</Badge>
                                  ) : (
                                    <span className="text-gray-500 text-xs">{param.default}</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-2">Exemple</h4>
                      <CodeBlock code={integration.example} id={`${integration.name}-example`} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          {/* Authentication */}
          <TabsContent value="auth" className="space-y-6 mt-6">
            {authentication.map((auth, idx) => (
              <motion.div
                key={auth.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">{auth.name}</CardTitle>
                    <p className="text-sm text-gray-400 mt-1">{auth.description}</p>
                  </CardHeader>
                  <CardContent>
                    <CodeBlock code={auth.code} id={`auth-${auth.name}`} />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          {/* Real-time */}
          <TabsContent value="realtime" className="space-y-6 mt-6">
            <Card className="bg-amber-900/20 border-amber-700">
              <CardHeader>
                <CardTitle className="text-amber-300">⚠️ WebSocket en temps réel</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm">
                  Les abonnements en temps réel permettent de recevoir les mises à jour instantanées des entités.
                </p>
              </CardContent>
            </Card>

            {realtime.map((rt, idx) => (
              <motion.div
                key={rt.entity}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Abonnement: {rt.entity}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CodeBlock code={rt.code} id={`realtime-${rt.entity}`} />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>

        {/* Best Practices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">✅ Bonnes Pratiques</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li className="flex gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Toujours utiliser <code className="bg-slate-900 px-1 rounded">queryClient.invalidateQueries()</code> après mutations</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Gérer les états de chargement avec <code className="bg-slate-900 px-1 rounded">isLoading</code></span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Toujours faire le cleanup des abonnements avec <code className="bg-slate-900 px-1 rounded">unsubscribe()</code></span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Afficher des notifications toast après actions utilisateur</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Vérifier l'authentification avant opérations sensibles</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}