/**
 * Mobile Development Plan - Roadmap pour application native
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Smartphone, CheckCircle, Code, Zap, Download } from 'lucide-react';

export default function MobilePlan() {
  return (
    <div className="min-h-screen bg-slate-50 page-padding page-padding-y">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Smartphone className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Mobile Development Plan</h1>
              <p className="text-slate-600">Native iOS/Android implementation roadmap</p>
            </div>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-6">
            {/* Current Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Current Mobile Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>PWA with offline support</span>
                  <Badge variant="secondary">Implemented</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Responsive mobile-first design</span>
                  <Badge variant="secondary">Implemented</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Touch-optimized UI</span>
                  <Badge variant="secondary">Implemented</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Advanced gesture support</span>
                  <Badge className="bg-green-100 text-green-700">New</Badge>
                </div>
              </CardContent>
            </Card>

            {/* React Native Implementation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-6 h-6 text-purple-600" />
                  React Native Implementation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-bold text-slate-900 mb-2">Phase 1: Setup (Week 1-2)</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li>• Initialize React Native project with Expo</li>
                    <li>• Configure TypeScript and ESLint</li>
                    <li>• Setup navigation (React Navigation)</li>
                    <li>• Configure native modules</li>
                  </ul>
                  <div className="mt-3 p-3 bg-slate-900 rounded text-slate-100 text-xs font-mono">
                    npx create-expo-app@latest druide-omega-mobile<br/>
                    cd druide-omega-mobile<br/>
                    npm install @react-navigation/native<br/>
                    npx expo install react-native-gesture-handler
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-bold text-slate-900 mb-2">Phase 2: Core Features (Week 3-6)</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li>• Authentication flow</li>
                    <li>• Chat interface with offline support</li>
                    <li>• Voice recording and playback</li>
                    <li>• Memory and knowledge base sync</li>
                    <li>• Push notifications</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-bold text-slate-900 mb-2">Phase 3: Advanced Features (Week 7-10)</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li>• Biometric authentication</li>
                    <li>• Background sync</li>
                    <li>• Advanced gestures (pinch, swipe, long-press)</li>
                    <li>• Camera integration</li>
                    <li>• Native sharing</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-bold text-slate-900 mb-2">Phase 4: Testing & Launch (Week 11-12)</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li>• E2E testing with Detox</li>
                    <li>• iOS App Store submission</li>
                    <li>• Google Play Store submission</li>
                    <li>• Beta testing program</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Key Dependencies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-6 h-6 text-indigo-600" />
                  Required React Native Packages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-slate-900 rounded text-slate-100 text-xs font-mono space-y-1">
                  <div># Navigation</div>
                  <div>npm install @react-navigation/native @react-navigation/stack</div>
                  <div className="mt-2"># Gestures</div>
                  <div>npx expo install react-native-gesture-handler react-native-reanimated</div>
                  <div className="mt-2"># Storage</div>
                  <div>npx expo install @react-native-async-storage/async-storage</div>
                  <div className="mt-2"># Voice</div>
                  <div>npx expo install expo-av</div>
                  <div className="mt-2"># Camera</div>
                  <div>npx expo install expo-camera expo-image-picker</div>
                  <div className="mt-2"># Notifications</div>
                  <div>npx expo install expo-notifications</div>
                  <div className="mt-2"># Biometrics</div>
                  <div>npx expo install expo-local-authentication</div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Optimizations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-6 h-6 text-yellow-600" />
                  Mobile Performance Optimizations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Image lazy loading with blur placeholder</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Virtual scrolling for long lists</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Request batching and caching</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Service Worker for offline caching</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Advanced gesture handler</span>
                </div>
              </CardContent>
            </Card>

            {/* Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Useful Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <a href="https://reactnative.dev/" target="_blank" rel="noopener" className="block text-blue-600 hover:underline">
                  → React Native Documentation
                </a>
                <a href="https://docs.expo.dev/" target="_blank" rel="noopener" className="block text-blue-600 hover:underline">
                  → Expo Documentation
                </a>
                <a href="https://reactnavigation.org/" target="_blank" rel="noopener" className="block text-blue-600 hover:underline">
                  → React Navigation
                </a>
                <a href="https://docs.swmansion.com/react-native-gesture-handler/" target="_blank" rel="noopener" className="block text-blue-600 hover:underline">
                  → React Native Gesture Handler
                </a>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}