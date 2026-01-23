import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

export default function ComponentDocumentation() {
  const [copiedCode, setCopiedCode] = useState(null);

  const components = [
    {
      name: "Button",
      file: "components/ui/button.jsx",
      props: [
        { name: "variant", type: "'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'", default: "'default'" },
        { name: "size", type: "'default' | 'sm' | 'lg' | 'icon'", default: "'default'" },
        { name: "disabled", type: "boolean", default: "false" },
        { name: "onClick", type: "(e: React.MouseEvent) => void", default: "undefined" },
      ],
      example: `<Button variant="default" size="lg" onClick={() => console.log('clicked')}>
  Click me
</Button>`,
    },
    {
      name: "Card",
      file: "components/ui/card.jsx",
      props: [
        { name: "className", type: "string", default: "undefined" },
      ],
      subComponents: ["CardHeader", "CardTitle", "CardDescription", "CardContent", "CardFooter"],
      example: `<Card>
  <CardHeader>
    <CardTitle>Titre</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Contenu</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>`,
    },
    {
      name: "Badge",
      file: "components/ui/badge.jsx",
      props: [
        { name: "variant", type: "'default' | 'secondary' | 'destructive' | 'outline'", default: "'default'" },
        { name: "className", type: "string", default: "undefined" },
      ],
      example: `<Badge variant="secondary">New</Badge>`,
    },
    {
      name: "Progress",
      file: "components/ui/progress.jsx",
      props: [
        { name: "value", type: "number (0-100)", default: "0" },
        { name: "className", type: "string", default: "undefined" },
      ],
      example: `<Progress value={65} />`,
    },
    {
      name: "Input",
      file: "components/ui/input.jsx",
      props: [
        { name: "type", type: "string", default: "'text'" },
        { name: "placeholder", type: "string", default: "undefined" },
        { name: "value", type: "string | number", default: "undefined" },
        { name: "onChange", type: "(e: React.ChangeEvent) => void", default: "undefined" },
        { name: "disabled", type: "boolean", default: "false" },
      ],
      example: `<Input 
  type="text" 
  placeholder="Entrez votre nom" 
  value={name}
  onChange={(e) => setName(e.target.value)}
/>`,
    },
    {
      name: "Select",
      file: "components/ui/select.jsx",
      props: [
        { name: "value", type: "string", default: "undefined" },
        { name: "onValueChange", type: "(value: string) => void", default: "undefined" },
      ],
      subComponents: ["SelectTrigger", "SelectValue", "SelectContent", "SelectItem"],
      example: `<Select value={status} onValueChange={setStatus}>
  <SelectTrigger>
    <SelectValue placeholder="Sélectionner..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="pending">À faire</SelectItem>
    <SelectItem value="completed">Complété</SelectItem>
  </SelectContent>
</Select>`,
    },
  ];

  const pageComponents = [
    {
      name: "UpdatePhases",
      file: "pages/UpdatePhases.jsx",
      description: "Affiche les phases de mise à jour avec gestion des filtres et édition",
      state: [
        { name: "expandedPhase", type: "string | null" },
        { name: "showHistory", type: "string | null" },
        { name: "editingPhase", type: "UpdatePhase | null" },
        { name: "filter", type: "'all' | 'completed' | 'in-progress' | 'pending' | 'blocked'" },
        { name: "search", type: "string" },
      ],
    },
    {
      name: "ApplicationAudit",
      file: "pages/ApplicationAudit.jsx",
      description: "Audit complet de l'application avec génération automatique de phases",
      state: [
        { name: "expandedSection", type: "string | null" },
        { name: "severityFilter", type: "'all' | 'high' | 'medium' | 'low'" },
        { name: "creatingPhases", type: "boolean" },
      ],
    },
  ];

  const phaseComponents = [
    {
      name: "PhaseEditModal",
      file: "components/phases/PhaseEditModal.jsx",
      props: [
        { name: "phase", type: "UpdatePhase", default: "required" },
        { name: "onClose", type: "() => void", default: "required" },
        { name: "onSave", type: "() => void", default: "required" },
      ],
      example: `<PhaseEditModal
  phase={selectedPhase}
  onClose={() => setEditingPhase(null)}
  onSave={() => queryClient.invalidateQueries(...)}
/>`,
    },
    {
      name: "PhaseHistoryPanel",
      file: "components/phases/PhaseHistoryPanel.jsx",
      props: [
        { name: "phaseId", type: "string", default: "required" },
      ],
      description: "Affiche l'historique des modifications d'une phase",
      example: `<PhaseHistoryPanel phaseId={phase.id} />`,
    },
    {
      name: "PhaseDetailsSkeleton",
      file: "components/phases/PhaseDetailsSkeleton.jsx",
      description: "Skeleton loader pour l'affichage des phases",
      example: `{isLoading ? <PhaseDetailsSkeleton /> : <PhaseItem />}`,
    },
    {
      name: "NotificationCenter",
      file: "components/notifications/NotificationCenter.jsx",
      description: "Affiche les notifications en temps réel",
      example: `<NotificationCenter />`,
    },
  ];

  const copyToClipboard = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    toast.success("Copié au presse-papiers");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const CodeBlock = ({ code, id }) => (
    <div className="bg-slate-900 rounded border border-slate-700 p-4 relative">
      <pre className="text-gray-300 text-sm overflow-x-auto">
        <code>{code}</code>
      </pre>
      <button
        onClick={() => copyToClipboard(code, id)}
        className="absolute top-2 right-2 p-2 bg-slate-700 hover:bg-slate-600 rounded text-gray-300 transition"
        title="Copier"
      >
        {copiedCode === id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">📚 Documentation des Composants</h1>
          <p className="text-gray-400">Guide complet avec props, types et exemples d'utilisation</p>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="ui" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800 border border-slate-700">
            <TabsTrigger value="ui">🎨 Composants UI</TabsTrigger>
            <TabsTrigger value="pages">📄 Pages</TabsTrigger>
            <TabsTrigger value="phases">📋 Phases</TabsTrigger>
          </TabsList>

          {/* UI Components Tab */}
          <TabsContent value="ui" className="space-y-6 mt-6">
            {components.map((component, idx) => (
              <motion.div
                key={component.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white">{component.name}</CardTitle>
                        <p className="text-sm text-gray-400 mt-1">{component.file}</p>
                      </div>
                      {component.subComponents && (
                        <Badge className="bg-purple-600/30 text-purple-300 border-purple-600">
                          {component.subComponents.length} sous-composants
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Props Table */}
                    <div>
                      <h4 className="text-white font-semibold mb-3">Props</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-gray-300">
                          <thead>
                            <tr className="border-b border-slate-700">
                              <th className="text-left py-2 px-2 text-white">Propriété</th>
                              <th className="text-left py-2 px-2 text-white">Type</th>
                              <th className="text-left py-2 px-2 text-white">Default</th>
                            </tr>
                          </thead>
                          <tbody>
                            {component.props.map((prop) => (
                              <tr key={prop.name} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                                <td className="py-2 px-2 font-mono text-purple-300">{prop.name}</td>
                                <td className="py-2 px-2 font-mono text-gray-400">{prop.type}</td>
                                <td className="py-2 px-2 font-mono text-gray-500">{prop.default || "-"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Sub-components */}
                    {component.subComponents && (
                      <div>
                        <h4 className="text-white font-semibold mb-2">Sous-composants</h4>
                        <div className="flex flex-wrap gap-2">
                          {component.subComponents.map((sub) => (
                            <Badge key={sub} className="bg-indigo-600/30 text-indigo-300 border-indigo-600">
                              {sub}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Example */}
                    <div>
                      <h4 className="text-white font-semibold mb-2">Exemple</h4>
                      <CodeBlock code={component.example} id={component.name} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          {/* Pages Tab */}
          <TabsContent value="pages" className="space-y-6 mt-6">
            {pageComponents.map((page, idx) => (
              <motion.div
                key={page.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">{page.name}</CardTitle>
                    <p className="text-sm text-gray-400 mt-1">{page.file}</p>
                    <p className="text-sm text-gray-300 mt-2">{page.description}</p>
                  </CardHeader>
                  <CardContent>
                    <h4 className="text-white font-semibold mb-3">État Interne</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-gray-300">
                        <thead>
                          <tr className="border-b border-slate-700">
                            <th className="text-left py-2 px-2 text-white">Clé</th>
                            <th className="text-left py-2 px-2 text-white">Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          {page.state.map((state) => (
                            <tr key={state.name} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                              <td className="py-2 px-2 font-mono text-purple-300">{state.name}</td>
                              <td className="py-2 px-2 font-mono text-gray-400">{state.type}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          {/* Phases Tab */}
          <TabsContent value="phases" className="space-y-6 mt-6">
            {phaseComponents.map((component, idx) => (
              <motion.div
                key={component.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">{component.name}</CardTitle>
                    <p className="text-sm text-gray-400 mt-1">{component.file}</p>
                    {component.description && (
                      <p className="text-sm text-gray-300 mt-2">{component.description}</p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {component.props && (
                      <div>
                        <h4 className="text-white font-semibold mb-3">Props</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm text-gray-300">
                            <thead>
                              <tr className="border-b border-slate-700">
                                <th className="text-left py-2 px-2 text-white">Propriété</th>
                                <th className="text-left py-2 px-2 text-white">Type</th>
                                <th className="text-left py-2 px-2 text-white">Requis</th>
                              </tr>
                            </thead>
                            <tbody>
                              {component.props.map((prop) => (
                                <tr key={prop.name} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                                  <td className="py-2 px-2 font-mono text-purple-300">{prop.name}</td>
                                  <td className="py-2 px-2 font-mono text-gray-400">{prop.type}</td>
                                  <td className="py-2 px-2">
                                    {prop.default === "required" ? (
                                      <Badge className="bg-red-600/30 text-red-300 border-red-600">Requis</Badge>
                                    ) : (
                                      <span className="text-gray-500">-</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {component.example && (
                      <div>
                        <h4 className="text-white font-semibold mb-2">Exemple</h4>
                        <CodeBlock code={component.example} id={component.name} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>

        {/* Types Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">🔷 Types & Interfaces Clés</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-purple-300 font-mono font-semibold mb-2">UpdatePhase</h4>
                <CodeBlock
                  code={`interface UpdatePhase {
  id: string;
  phase_number: number;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  progress: number; // 0-100
  duration_weeks?: number;
  dependencies?: string[]; // Phase IDs
  owner?: string; // email
  blockers?: Array<{
    issue: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }>;
}`}
                  id="UpdatePhase"
                />
              </div>

              <div>
                <h4 className="text-purple-300 font-mono font-semibold mb-2">Notification</h4>
                <CodeBlock
                  code={`interface Notification {
  id: string;
  type: 'phase_status_changed' | 'milestone_completed' | 'dependency_blocked';
  title: string;
  message: string;
  severity: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
}`}
                  id="Notification"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}