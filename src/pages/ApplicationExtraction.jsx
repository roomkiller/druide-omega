// ═══════════════════════════════════════════════════════════════════════════
// DRUIDE OMEGA — Extraction technique universelle (page navigable)
// © 2025 AMG+A.L — Tous droits réservés
// ═══════════════════════════════════════════════════════════════════════════
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Boxes, Brain, GitBranch, Layers, ShieldCheck, Server, RefreshCw,
  Gauge, FlaskConical, FileText, Code2, ChevronRight, Database, Lock,
} from "lucide-react";
import {
  appIdentity, architecture, modules, dataFlows, stateManagement,
  security, api, devops, performance, tests, pagesOverview, codeExamples,
} from "@/components/extraction/extractionData";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const SECTIONS = [
  { id: "architecture", label: "Architecture", icon: Boxes },
  { id: "modules", label: "Modules", icon: Layers },
  { id: "flows", label: "Flux de données", icon: GitBranch },
  { id: "state", label: "État", icon: Database },
  { id: "security", label: "Sécurité", icon: ShieldCheck },
  { id: "api", label: "API", icon: Server },
  { id: "devops", label: "DevOps", icon: RefreshCw },
  { id: "performance", label: "Performance", icon: Gauge },
  { id: "tests", label: "Tests", icon: FlaskConical },
  { id: "pages", label: "Pages", icon: FileText },
  { id: "code", label: "Code bonus", icon: Code2 },
];

function Section({ title, icon: Icon, children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-purple-600" />
        <h2 className="text-xl font-bold font-display text-slate-900">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}

function CodeBlock({ code, label }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-950 overflow-hidden">
      {label && <div className="px-3 py-1.5 text-xs font-mono text-slate-400 bg-slate-900 border-b border-slate-800">{label}</div>}
      <pre className="p-4 text-xs leading-relaxed text-slate-100 overflow-x-auto font-mono whitespace-pre">{code}</pre>
    </div>
  );
}

function Pill({ children }) {
  return <Badge variant="secondary" className="font-mono text-[10px]">{children}</Badge>;
}

export default function ApplicationExtraction() {
  const [tab, setTab] = useState("architecture");

  return (
    <div className="min-h-screen bg-slate-50 page-padding page-padding-y">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>Document technique — {appIdentity.compliance.join(" · ")}</span>
          </div>
          <h1 className="text-3xl font-bold font-display text-gradient mb-1">
            {appIdentity.name} — Extraction universelle
          </h1>
          <p className="text-sm text-slate-600">
            {appIdentity.license} · {appIdentity.publishedUrl}
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {appIdentity.stack.frontend.map(s => <Pill key={s}>{s}</Pill>)}
            {appIdentity.stack.backend.map(s => <Pill key={s}>{s}</Pill>)}
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="flex flex-wrap h-auto gap-1 bg-slate-100 p-1 rounded-lg mb-6">
            {SECTIONS.map(s => {
              const Icon = s.icon;
              return (
                <TabsTrigger key={s.id} value={s.id} className="flex items-center gap-1.5 text-xs data-[state=active]:bg-white">
                  <Icon className="w-3.5 h-3.5" />
                  {s.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Architecture */}
          <TabsContent value="architecture">
            <Section title="Architecture globale" icon={Boxes}>
              <div className="grid gap-3">
                {architecture.map(l => (
                  <Card key={l.layer}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <span className="text-purple-600">{l.layer}</span>
                        <Badge variant="outline" className="text-[10px] font-mono">{l.tech}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-1">
                      <p className="text-sm text-slate-600 mb-1">{l.role}</p>
                      <p className="text-xs text-slate-400 font-mono">{l.entry}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Section>
          </TabsContent>

          {/* Modules */}
          <TabsContent value="modules">
            <Section title="Modules & sous-modules" icon={Layers}>
              <div className="grid md:grid-cols-2 gap-3">
                {modules.map(m => (
                    <Card key={m.domain}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{m.domain}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-1 space-y-2">
                        <p className="text-xs text-slate-600">{m.role}</p>
                        <div>
                          <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-1">Pages</p>
                          <div className="flex flex-wrap gap-1">{m.pages.map(p => <Pill key={p}>{p}</Pill>)}</div>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-1">Composants clés</p>
                          <p className="text-xs text-slate-600">{m.components.join(" · ")}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-1">Fonctions</p>
                          <div className="flex flex-wrap gap-1">{m.functions.map(f => <Pill key={f}>{f}</Pill>)}</div>
                        </div>
                      </CardContent>
                    </Card>
                ))}
              </div>
            </Section>
          </TabsContent>

          {/* Flows */}
          <TabsContent value="flows">
            <Section title="Flux de données" icon={GitBranch}>
              <div className="space-y-3">
                {dataFlows.map(f => (
                  <Card key={f.name}>
                    <CardHeader className="pb-2"><CardTitle className="text-base">{f.name}</CardTitle></CardHeader>
                    <CardContent className="pt-1">
                      <ol className="space-y-1.5">
                        {f.steps.map((s, i) => (
                          <li key={i} className="flex gap-2 text-sm text-slate-600">
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Section>
          </TabsContent>

          {/* State */}
          <TabsContent value="state">
            <Section title="Gestion d'état" icon={Database}>
              <div className="space-y-3">
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-base">État serveur</CardTitle></CardHeader>
                  <CardContent className="pt-1 text-sm text-slate-600 space-y-1">
                    <p><b>{stateManagement.serverState.tech}</b> — {stateManagement.serverState.usage}</p>
                    <p className="text-xs font-mono text-slate-400">{stateManagement.serverState.config}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-base">Contextes globaux</CardTitle></CardHeader>
                  <CardContent className="pt-1 space-y-1.5">
                    {stateManagement.globalContext.map(c => (
                      <div key={c.name} className="flex flex-col sm:flex-row sm:items-center gap-1 text-sm">
                        <span className="font-semibold text-slate-800">{c.name}</span>
                        <span className="text-slate-500 text-xs sm:ml-2">{c.scope}</span>
                        <span className="text-[10px] font-mono text-slate-400 sm:ml-auto">{c.file}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-base">État local (localStorage)</CardTitle></CardHeader>
                  <CardContent className="pt-1 space-y-1.5">
                    {stateManagement.localState.map(l => (
                      <div key={l.key} className="flex items-center gap-2 text-sm">
                        <Pill>{l.key}</Pill>
                        <span className="text-slate-600 text-xs">{l.usage}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 text-sm text-slate-600">
                    <b className="text-slate-800">Temps réel:</b> {stateManagement.realtime}
                  </CardContent>
                </Card>
              </div>
            </Section>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security">
            <Section title="Sécurité" icon={ShieldCheck}>
              <div className="space-y-3">
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-base">Authentification & rôles</CardTitle></CardHeader>
                  <CardContent className="pt-1 text-sm text-slate-600 space-y-1">
                    <p><b>Provider:</b> {security.auth.provider}</p>
                    <p><b>Client:</b> <code className="text-xs font-mono">{security.auth.client}</code></p>
                    <p><b>Rôles:</b> {security.auth.roles.join(" · ")}</p>
                    <p><b>Application:</b> {security.auth.enforcement}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-base">Garde de pages</CardTitle></CardHeader>
                  <CardContent className="pt-1 text-sm text-slate-600 space-y-1">
                    <p className="font-mono text-xs">{security.pageGuard.component}</p>
                    <div className="flex flex-wrap gap-1 mt-1">{security.pageGuard.protectedRoutes.map(r => <Pill key={r}>{r}</Pill>)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-base">Row-Level Security (RLS)</CardTitle></CardHeader>
                  <CardContent className="pt-1 text-sm text-slate-600 space-y-1">
                    <p>{security.rls.description}</p>
                    <ul className="list-disc list-inside text-xs space-y-0.5 mt-1">
                      {security.rls.patterns.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-base">Chiffrement & 2FA</CardTitle></CardHeader>
                  <CardContent className="pt-1 text-sm text-slate-600 space-y-1">
                    <p><b>Coffre:</b> {security.encryption.vault}</p>
                    <p><b>2FA:</b> {security.encryption.twoFactor}</p>
                    <p><b>API keys:</b> {security.encryption.apiKeys}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-base">Conformité & audit</CardTitle></CardHeader>
                  <CardContent className="pt-1 text-sm text-slate-600 space-y-1">
                    <div className="flex flex-wrap gap-1 mb-1">{security.compliance.map(c => <Pill key={c}>{c}</Pill>)}</div>
                    <p><b>Audit:</b> {security.audit.join(" · ")}</p>
                  </CardContent>
                </Card>
              </div>
            </Section>
          </TabsContent>

          {/* API */}
          <TabsContent value="api">
            <Section title="API — Fonctions backend & intégrations" icon={Server}>
              <p className="text-sm text-slate-600 mb-3">
                <b>Invocation:</b> <code className="text-xs font-mono">{api.invocation}</code>
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                {Object.entries(api.functions).map(([group, fns]) => (
                  <Card key={group}>
                    <CardHeader className="pb-2"><CardTitle className="text-sm">{group}</CardTitle></CardHeader>
                    <CardContent className="pt-1">
                      <div className="flex flex-wrap gap-1">{fns.map(f => <Pill key={f}>{f}</Pill>)}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card className="mt-3">
                <CardHeader className="pb-2"><CardTitle className="text-base">Intégrations Core</CardTitle></CardHeader>
                <CardContent className="pt-1 text-sm text-slate-600 space-y-1">
                  {api.integrations.Core.map(i => <p key={i} className="text-xs">• {i}</p>)}
                  <p className="text-xs text-slate-400 mt-1">{api.integrations.connectors}</p>
                </CardContent>
              </Card>
              <Card className="mt-3">
                <CardContent className="pt-4 text-sm text-slate-600">{api.errors}</CardContent>
              </Card>
            </Section>
          </TabsContent>

          {/* DevOps */}
          <TabsContent value="devops">
            <Section title="DevOps — Build, CI/CD, déploiement, logs" icon={RefreshCw}>
              <div className="space-y-3">
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-base">Build</CardTitle></CardHeader>
                  <CardContent className="pt-1 text-sm text-slate-600">
                    <p><b>Build:</b> {devops.build.command} · <b>Output:</b> {devops.build.output} · <b>Dev:</b> {devops.build.dev}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-base">Automations planifiées</CardTitle></CardHeader>
                  <CardContent className="pt-1 text-sm text-slate-600 space-y-1">
                    <div className="flex flex-wrap gap-1 mb-2">{devops.ci.scheduled.map(s => <Pill key={s}>{s}</Pill>)}</div>
                    <p className="text-xs"><b>Types d'automations:</b> {devops.ci.automations}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-base">Déploiement versionné</CardTitle></CardHeader>
                  <CardContent className="pt-1 text-sm text-slate-600 space-y-1">
                    <p><b>Entité:</b> {devops.deployment.entity}</p>
                    <p><b>Flux:</b> {devops.deployment.flow}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-base">Logs & purge</CardTitle></CardHeader>
                  <CardContent className="pt-1 text-sm text-slate-600 space-y-1">
                    <p><b>Logs:</b> {devops.logs.join(" · ")}</p>
                    <p><b>Purge:</b> {devops.purge}</p>
                  </CardContent>
                </Card>
              </div>
            </Section>
          </TabsContent>

          {/* Performance */}
          <TabsContent value="performance">
            <Section title="Performance — Cache, lazy loading, économie" icon={Gauge}>
              <div className="space-y-2">
                {Object.entries(performance).map(([k, v]) => (
                  <Card key={k}>
                    <CardHeader className="pb-1.5"><CardTitle className="text-sm capitalize">{k}</CardTitle></CardHeader>
                    <CardContent className="pt-0">
                      {Array.isArray(v) ? (
                        <ul className="list-disc list-inside text-xs text-slate-600 space-y-0.5">{v.map((i, idx) => <li key={idx}>{i}</li>)}</ul>
                      ) : (
                        <p className="text-xs text-slate-600">{v}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Section>
          </TabsContent>

          {/* Tests */}
          <TabsContent value="tests">
            <Section title="Tests — Unitaires, intégration, E2E" icon={FlaskConical}>
              <div className="space-y-2">
                {Object.entries(tests).map(([k, v]) => (
                  <div key={k} className="flex flex-col sm:flex-row sm:items-center gap-1 py-2 border-b border-slate-100 last:border-0">
                    <span className="font-semibold text-slate-800 text-sm w-32 flex-shrink-0 capitalize">{k}</span>
                    <span className="text-sm text-slate-600">{v}</span>
                  </div>
                ))}
              </div>
            </Section>
          </TabsContent>

          {/* Pages */}
          <TabsContent value="pages">
            <Section title="Pages & fonctionnalités" icon={FileText}>
              <div className="grid md:grid-cols-2 gap-3">
                {pagesOverview.map(g => (
                  <Card key={g.group}>
                    <CardHeader className="pb-2"><CardTitle className="text-sm">{g.group}</CardTitle></CardHeader>
                    <CardContent className="pt-1">
                      <div className="flex flex-wrap gap-1">{g.items.map(p => <Pill key={p}>{p}</Pill>)}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Section>
          </TabsContent>

          {/* Code bonus */}
          <TabsContent value="code">
            <Section title="Exemples de code bonus" icon={Code2}>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
                    <ChevronRight className="w-4 h-4 text-purple-600" /> Structure React (pages, composants, hooks, services)
                  </h3>
                  <CodeBlock code={codeExamples.reactStructure} label="src/pages/Chat.jsx (simplifié)" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
                    <ChevronRight className="w-4 h-4 text-purple-600" /> Schéma de module (interfaces, dépendances)
                  </h3>
                  <CodeBlock code={codeExamples.moduleSchema} label="base44/entities/NeuralModule.jsonc" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
                    <ChevronRight className="w-4 h-4 text-purple-600" /> Configuration (env, sécurité, cache)
                  </h3>
                  <CodeBlock code={codeExamples.configExample} label="config (env / RLS / cache / économie)" />
                </div>
              </div>
            </Section>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}