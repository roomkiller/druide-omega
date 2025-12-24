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

            {/* Phase 2: Detailed Timeline */}
            <Card className="border-2 border-purple-300 bg-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-6 h-6 text-purple-600" />
                  Phase 2: React Native Development (12 Weeks)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Weeks 1-2 */}
                <div className="p-4 bg-white rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-slate-900">Weeks 1-2: Foundation & Architecture</h3>
                    <Badge className="bg-purple-100 text-purple-700">Q1 2025</Badge>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li>✓ Project initialization with Expo SDK 50+</li>
                    <li>✓ Setup TypeScript, ESLint, Prettier</li>
                    <li>✓ Configure React Navigation v6</li>
                    <li>✓ Setup state management (Zustand/Redux)</li>
                    <li>✓ Configure Base44 SDK for mobile</li>
                    <li>✓ Setup native modules (Gesture Handler, Reanimated)</li>
                    <li>✓ Configure development environment (iOS/Android)</li>
                  </ul>
                </div>

                {/* Weeks 3-4 */}
                <div className="p-4 bg-white rounded-lg border border-purple-200">
                  <h3 className="font-bold text-slate-900 mb-3">Weeks 3-4: Authentication & Core UI</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li>✓ Authentication flow (Email/Password)</li>
                    <li>✓ Biometric authentication (Face ID/Touch ID)</li>
                    <li>✓ Secure token storage (Keychain/Keystore)</li>
                    <li>✓ Core UI components library</li>
                    <li>✓ Navigation structure (tabs, stack, drawer)</li>
                    <li>✓ Splash screen and onboarding</li>
                  </ul>
                </div>

                {/* Weeks 5-6 */}
                <div className="p-4 bg-white rounded-lg border border-purple-200">
                  <h3 className="font-bold text-slate-900 mb-3">Weeks 5-6: Chat & Consciousness</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li>✓ Chat interface with real-time updates</li>
                    <li>✓ Message rendering (text, images, code)</li>
                    <li>✓ Consciousness indicators</li>
                    <li>✓ Thinking engine visualization</li>
                    <li>✓ Offline message queue</li>
                    <li>✓ Push notifications setup</li>
                  </ul>
                </div>

                {/* Weeks 7-8 */}
                <div className="p-4 bg-white rounded-lg border border-purple-200">
                  <h3 className="font-bold text-slate-900 mb-3">Weeks 7-8: Voice & Multimodal</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li>✓ Voice recording with expo-av</li>
                    <li>✓ Real-time transcription</li>
                    <li>✓ Text-to-speech playback</li>
                    <li>✓ Camera integration (expo-camera)</li>
                    <li>✓ Image picker and upload</li>
                    <li>✓ Image analysis with AI</li>
                  </ul>
                </div>

                {/* Weeks 9-10 */}
                <div className="p-4 bg-white rounded-lg border border-purple-200">
                  <h3 className="font-bold text-slate-900 mb-3">Weeks 9-10: Memory & Knowledge</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li>✓ Memory system with offline sync</li>
                    <li>✓ Knowledge base viewer</li>
                    <li>✓ File upload and management</li>
                    <li>✓ Cross-modal correlation display</li>
                    <li>✓ Advanced search functionality</li>
                    <li>✓ Background sync worker</li>
                  </ul>
                </div>

                {/* Weeks 11-12 */}
                <div className="p-4 bg-white rounded-lg border border-purple-200">
                  <h3 className="font-bold text-slate-900 mb-3">Weeks 11-12: Testing & Launch</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li>✓ E2E testing with Detox</li>
                    <li>✓ Unit tests for critical features</li>
                    <li>✓ Performance optimization</li>
                    <li>✓ Beta testing (TestFlight/Internal Testing)</li>
                    <li>✓ App Store submission (iOS)</li>
                    <li>✓ Play Store submission (Android)</li>
                    <li>✓ Production monitoring setup</li>
                  </ul>
                </div>

                {/* Budget & Resources */}
                <div className="p-4 bg-slate-900 rounded-lg text-white">
                  <h3 className="font-bold mb-3">Estimated Resources</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-400 mb-1">Development Time</p>
                      <p className="font-bold">12 weeks (3 months)</p>
                    </div>
                    <div>
                      <p className="text-slate-400 mb-1">Team Size</p>
                      <p className="font-bold">2-3 developers</p>
                    </div>
                    <div>
                      <p className="text-slate-400 mb-1">Budget Estimate</p>
                      <p className="font-bold">$60k - $90k CAD</p>
                    </div>
                    <div>
                      <p className="text-slate-400 mb-1">Store Fees</p>
                      <p className="font-bold">$99/yr (iOS) + $25 (Android)</p>
                    </div>
                  </div>
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