/**
 * React Native Setup Guide - Guide de démarrage Phase 2
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, CheckCircle, Terminal, Folder, FileCode } from 'lucide-react';
import { toast } from 'sonner';

export default function ReactNativeSetup() {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success('Copié!');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const setupSteps = [
    {
      title: "1. Initialiser le projet Expo",
      commands: [
        "npx create-expo-app@latest druide-omega-mobile --template blank-typescript",
        "cd druide-omega-mobile",
        "npm install"
      ]
    },
    {
      title: "2. Installer les dépendances de navigation",
      commands: [
        "npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs @react-navigation/drawer",
        "npx expo install react-native-screens react-native-safe-area-context"
      ]
    },
    {
      title: "3. Installer les dépendances de gestes et animations",
      commands: [
        "npx expo install react-native-gesture-handler react-native-reanimated"
      ]
    },
    {
      title: "4. Installer les dépendances de stockage et sync",
      commands: [
        "npx expo install @react-native-async-storage/async-storage",
        "npm install @tanstack/react-query",
        "npm install zustand"
      ]
    },
    {
      title: "5. Installer les dépendances multimédia",
      commands: [
        "npx expo install expo-av expo-camera expo-image-picker"
      ]
    },
    {
      title: "6. Installer les dépendances de sécurité",
      commands: [
        "npx expo install expo-local-authentication expo-secure-store"
      ]
    },
    {
      title: "7. Installer les notifications",
      commands: [
        "npx expo install expo-notifications expo-device"
      ]
    },
    {
      title: "8. Installer les utilitaires",
      commands: [
        "npm install axios date-fns lodash",
        "npm install -D @types/lodash"
      ]
    }
  ];

  const fileStructure = `
druide-omega-mobile/
├── app/                          # App Router (Expo Router)
│   ├── (auth)/                  # Auth screens
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── biometric.tsx
│   ├── (tabs)/                  # Main tabs
│   │   ├── chat.tsx
│   │   ├── memory.tsx
│   │   ├── knowledge.tsx
│   │   └── profile.tsx
│   ├── _layout.tsx              # Root layout
│   └── index.tsx                # Entry point
├── components/
│   ├── chat/
│   │   ├── ChatBubble.tsx
│   │   ├── ChatInput.tsx
│   │   └── ThinkingIndicator.tsx
│   ├── consciousness/
│   │   ├── ConsciousnessGauge.tsx
│   │   └── EmotionalIndicator.tsx
│   ├── ui/                      # Reusable UI
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   └── voice/
│       ├── VoiceRecorder.tsx
│       └── AudioPlayer.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useChat.ts
│   ├── useMemory.ts
│   └── useOfflineSync.ts
├── services/
│   ├── api/
│   │   ├── base44.ts            # Base44 SDK wrapper
│   │   └── deepseek.ts          # DeepSeek integration
│   ├── storage/
│   │   ├── secureStore.ts
│   │   └── asyncStorage.ts
│   └── sync/
│       ├── offlineQueue.ts
│       └── syncManager.ts
├── store/
│   ├── authStore.ts
│   ├── chatStore.ts
│   └── consciousnessStore.ts
├── utils/
│   ├── constants.ts
│   ├── types.ts
│   └── helpers.ts
├── app.json
├── babel.config.js
├── tsconfig.json
└── package.json`;

  const appConfig = {
    "expo": {
      "name": "Druide Omega",
      "slug": "druide-omega-mobile",
      "version": "1.0.0",
      "orientation": "portrait",
      "icon": "./assets/icon.png",
      "userInterfaceStyle": "automatic",
      "splash": {
        "image": "./assets/splash.png",
        "resizeMode": "contain",
        "backgroundColor": "#7c3aed"
      },
      "ios": {
        "supportsTablet": true,
        "bundleIdentifier": "com.amgal.druideomega",
        "infoPlist": {
          "NSCameraUsageDescription": "Druide needs camera access for image analysis",
          "NSMicrophoneUsageDescription": "Druide needs microphone access for voice chat",
          "NSPhotoLibraryUsageDescription": "Druide needs photo library access"
        }
      },
      "android": {
        "adaptiveIcon": {
          "foregroundImage": "./assets/adaptive-icon.png",
          "backgroundColor": "#7c3aed"
        },
        "package": "com.amgal.druideomega",
        "permissions": [
          "CAMERA",
          "RECORD_AUDIO",
          "READ_EXTERNAL_STORAGE",
          "WRITE_EXTERNAL_STORAGE"
        ]
      },
      "plugins": [
        "expo-camera",
        "expo-av",
        [
          "expo-local-authentication",
          {
            "faceIDPermission": "Allow Druide to use Face ID for authentication"
          }
        ]
      ]
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 page-padding page-padding-y">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Terminal className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">React Native Setup</h1>
              <p className="text-slate-600">Phase 2: Configuration complète du projet mobile</p>
            </div>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-6">
            {/* Setup Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="w-6 h-6 text-purple-600" />
                  Installation des dépendances
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {setupSteps.map((step, stepIndex) => (
                  <div key={stepIndex} className="space-y-2">
                    <h3 className="font-bold text-slate-900">{step.title}</h3>
                    {step.commands.map((cmd, cmdIndex) => {
                      const index = `${stepIndex}-${cmdIndex}`;
                      return (
                        <div key={cmdIndex} className="relative group">
                          <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg text-xs font-mono overflow-x-auto">
                            {cmd}
                          </pre>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => copyToClipboard(cmd, index)}
                          >
                            {copiedIndex === index ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* File Structure */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Folder className="w-6 h-6 text-indigo-600" />
                  Structure du projet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative group">
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-xs font-mono overflow-x-auto whitespace-pre">
                    {fileStructure}
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => copyToClipboard(fileStructure, 'structure')}
                  >
                    {copiedIndex === 'structure' ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* App Config */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCode className="w-6 h-6 text-blue-600" />
                  Configuration app.json
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative group">
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-xs font-mono overflow-x-auto">
                    {JSON.stringify(appConfig, null, 2)}
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => copyToClipboard(JSON.stringify(appConfig, null, 2), 'config')}
                  >
                    {copiedIndex === 'config' ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="border-2 border-green-300 bg-green-50">
              <CardHeader>
                <CardTitle>Prochaines étapes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Configurer Base44 SDK pour React Native</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Créer les composants de base (Button, Input, Card)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Implémenter l'authentification avec biométrie</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Développer l'interface de chat</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Tester sur iOS et Android</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}