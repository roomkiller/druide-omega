/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Testing Documentation & CI/CD Guide                        ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  CheckCircle, 
  Code, 
  Shield, 
  Zap, 
  GitBranch,
  FileText,
  AlertTriangle
} from "lucide-react";

export default function TestingDocumentation() {
  const testingSections = [
    {
      title: "Tests Unitaires",
      icon: Code,
      color: "from-blue-500 to-indigo-600",
      description: "Tests de composants isolés",
      coverage: "70%+",
      examples: [
        {
          name: "ConsciousnessHub.test.js",
          code: `import { renderHook } from '@testing-library/react';
import { useConsciousnessHub } from '@/components/system/ConsciousnessHub';

test('should register module', () => {
  const { result } = renderHook(() => useConsciousnessHub());
  result.current.registerModule('testModule');
  expect(result.current.activeModules).toContain('testModule');
});`
        },
        {
          name: "ThinkingEngine.test.js",
          code: `import { createThinkingEngine } from '@/components/consciousness/ThinkingEngine';

test('should analyze query', async () => {
  const engine = await createThinkingEngine();
  const analysis = await engine.analyzeQuery('Test query', [], 'chat');
  expect(analysis.cognitiveAnalysis).toBeDefined();
});`
        }
      ]
    },
    {
      title: "Tests d'Intégration",
      icon: GitBranch,
      color: "from-green-500 to-emerald-600",
      description: "Tests des flux API complets",
      coverage: "API Coverage",
      examples: [
        {
          name: "api.test.js",
          code: `describe('Conversation API', () => {
  test('should create conversation', async () => {
    const conv = await base44.entities.Conversation.create({
      title: 'Test',
      messages: []
    });
    expect(conv.id).toBeDefined();
  });

  test('should update conversation', async () => {
    const updated = await base44.entities.Conversation.update(id, {
      title: 'Updated'
    });
    expect(updated.title).toBe('Updated');
  });
});`
        }
      ]
    },
    {
      title: "Tests E2E (Playwright)",
      icon: CheckCircle,
      color: "from-purple-500 to-pink-600",
      description: "Tests utilisateur bout-en-bout",
      coverage: "Critical Paths",
      examples: [
        {
          name: "chat.spec.js",
          code: `test('should send message and receive response', async ({ page }) => {
  await page.goto('/Chat');
  await page.fill('textarea', 'Bonjour');
  await page.click('button[type="submit"]');
  await expect(page.getByText('Bonjour')).toBeVisible();
  await page.waitForSelector('[data-role="assistant"]');
});

test('should maintain conversation history', async ({ page }) => {
  await page.fill('textarea', 'Mon nom est Alice');
  await page.click('button[type="submit"]');
  // ... wait for response
  await page.fill('textarea', 'Quel est mon nom?');
  // Should remember context
});`
        }
      ]
    },
    {
      title: "Tests de Charge (k6)",
      icon: Zap,
      color: "from-orange-500 to-red-600",
      description: "Tests de performance et scalabilité",
      coverage: "100+ Users",
      examples: [
        {
          name: "stress-test.js",
          code: `import http from 'k6/http';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 10 },
    { duration: '5m', target: 50 },
    { duration: '2m', target: 100 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    errors: ['rate<0.1'],
  },
};

export default function () {
  let res = http.get('http://localhost:3000/');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'loads in <2s': (r) => r.timings.duration < 2000,
  });
}`
        }
      ]
    },
    {
      title: "Tests de Sécurité",
      icon: Shield,
      color: "from-red-500 to-rose-600",
      description: "Tests de vulnérabilités (OWASP)",
      coverage: "Critical Vulnerabilities",
      examples: [
        {
          name: "penetration-test.js",
          code: `describe('XSS Protection', () => {
  test('should sanitize XSS in input', async () => {
    const xssPayload = '<script>alert("XSS")</script>';
    const response = await axios.post('/api/chat', {
      message: xssPayload
    });
    expect(response.data).not.toContain('<script>');
  });
});

describe('SQL Injection Protection', () => {
  test('should reject SQL injection', async () => {
    const sqlPayload = "'; DROP TABLE users; --";
    const response = await axios.get('/api/search?q=' + sqlPayload);
    expect(response.status).not.toBe(500);
  });
});

describe('Rate Limiting', () => {
  test('should rate limit excessive requests', async () => {
    const requests = Array(100).fill().map(() => 
      axios.get('/api/chat')
    );
    const responses = await Promise.all(requests);
    expect(responses.some(r => r.status === 429)).toBe(true);
  });
});`
        }
      ]
    }
  ];

  const cicdPipeline = {
    stages: [
      {
        name: "Unit Tests",
        description: "Tests unitaires rapides",
        duration: "~2min",
        commands: ["npm run test:unit", "Coverage: 70%+"],
        color: "bg-blue-500"
      },
      {
        name: "Integration Tests",
        description: "Tests API et intégrations",
        duration: "~5min",
        commands: ["npm run test:integration", "All endpoints validated"],
        color: "bg-green-500"
      },
      {
        name: "E2E Tests",
        description: "Tests Playwright multi-navigateurs",
        duration: "~10min",
        commands: ["npx playwright test", "Chrome, Firefox, Safari, Mobile"],
        color: "bg-purple-500"
      },
      {
        name: "Security Tests",
        description: "OWASP ZAP + Custom tests",
        duration: "~8min",
        commands: ["npm run test:security", "OWASP ZAP baseline scan"],
        color: "bg-red-500"
      },
      {
        name: "Load Tests",
        description: "Tests de charge k6 (production only)",
        duration: "~15min",
        commands: ["k6 run tests/load/stress-test.js", "100+ concurrent users"],
        color: "bg-orange-500"
      },
      {
        name: "Build",
        description: "Build optimisé production",
        duration: "~3min",
        commands: ["npm run build", "Artifacts uploaded"],
        color: "bg-indigo-500"
      },
      {
        name: "Deploy",
        description: "Déploiement automatique",
        duration: "~5min",
        commands: ["Deploy to staging/production", "Notifications envoyées"],
        color: "bg-emerald-500"
      }
    ]
  };

  const configs = [
    {
      name: "jest.config.js",
      description: "Configuration Jest pour tests unitaires",
      code: `module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: ['src/**/*.{js,jsx}'],
  coverageThreshold: {
    global: { branches: 70, functions: 70, lines: 70 }
  },
};`
    },
    {
      name: "playwright.config.js",
      description: "Configuration Playwright E2E",
      code: `export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: devices['Desktop Chrome'] },
    { name: 'firefox', use: devices['Desktop Firefox'] },
    { name: 'webkit', use: devices['Desktop Safari'] },
    { name: 'Mobile Chrome', use: devices['Pixel 5'] },
  ],
});`
    },
    {
      name: ".github/workflows/ci-cd.yml",
      description: "Pipeline GitHub Actions complet",
      code: `name: CI/CD Pipeline
on:
  push:
    branches: [ main, develop ]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:unit
      - uses: codecov/codecov-action@v3

  e2e-tests:
    needs: unit-tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e

  deploy:
    needs: [unit-tests, e2e-tests]
    runs-on: ubuntu-latest
    steps:
      - run: npm run build
      - run: # Deploy commands`
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-12">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Infrastructure de Tests & CI/CD
          </h1>
          <p className="text-purple-100 text-lg max-w-3xl mx-auto">
            Documentation complète des tests unitaires, intégration, E2E, charge, sécurité et pipeline CI/CD
          </p>
          <div className="flex justify-center gap-3 mt-6">
            <Badge className="bg-white/20 text-white text-sm px-4 py-2">
              <CheckCircle className="w-4 h-4 mr-2" />
              Production-Ready
            </Badge>
            <Badge className="bg-white/20 text-white text-sm px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              Security First
            </Badge>
          </div>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-250px)]">
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
          {/* Testing Sections */}
          {testingSections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <Card key={idx} className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${section.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">{section.title}</h2>
                    <p className="text-slate-600 mb-2">{section.description}</p>
                    <Badge className="bg-green-100 text-green-700">
                      Coverage: {section.coverage}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-6">
                  {section.examples.map((example, exIdx) => (
                    <div key={exIdx}>
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="w-4 h-4 text-slate-600" />
                        <span className="font-semibold text-slate-900">{example.name}</span>
                      </div>
                      <pre className="bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{example.code}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}

          {/* CI/CD Pipeline */}
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <GitBranch className="w-8 h-8 text-purple-600" />
              <h2 className="text-2xl font-bold text-slate-900">Pipeline CI/CD</h2>
            </div>

            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200" />
              
              <div className="space-y-6">
                {cicdPipeline.stages.map((stage, idx) => (
                  <div key={idx} className="relative flex items-start gap-4 pl-16">
                    <div className={`absolute left-6 w-4 h-4 ${stage.color} rounded-full border-4 border-white`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-slate-900">{stage.name}</h3>
                        <Badge variant="outline" className="text-slate-600">{stage.duration}</Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{stage.description}</p>
                      <div className="space-y-1">
                        {stage.commands.map((cmd, cmdIdx) => (
                          <div key={cmdIdx} className="flex items-center gap-2 text-sm">
                            <Code className="w-3 h-3 text-slate-400" />
                            <code className="text-slate-700">{cmd}</code>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Configuration Files */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Fichiers de Configuration
            </h2>

            <div className="space-y-6">
              {configs.map((config, idx) => (
                <div key={idx}>
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-5 h-5 text-purple-600" />
                    <span className="font-bold text-slate-900">{config.name}</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{config.description}</p>
                  <pre className="bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{config.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          </Card>

          {/* Setup Instructions */}
          <Card className="p-8 bg-amber-50 border-amber-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-amber-900 mb-2">Instructions de Setup</h3>
                <div className="space-y-2 text-sm text-amber-800">
                  <p>1. Installer les dépendances de test :</p>
                  <code className="block bg-amber-900/10 p-2 rounded">
                    npm install --save-dev jest @testing-library/react @playwright/test
                  </code>
                  
                  <p className="mt-4">2. Créer les dossiers de tests :</p>
                  <code className="block bg-amber-900/10 p-2 rounded">
                    mkdir -p tests/unit tests/integration tests/e2e tests/load tests/security
                  </code>
                  
                  <p className="mt-4">3. Copier les fichiers de configuration ci-dessus</p>
                  
                  <p className="mt-4">4. Lancer les tests :</p>
                  <code className="block bg-amber-900/10 p-2 rounded">
                    npm run test:unit && npm run test:e2e && npm run test:security
                  </code>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}