/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Page Test Mode Hors-ligne                                  ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from 'react';
import { useOffline } from '@/components/offline/OfflineManager';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/components/utils/LanguageContext';
import PageTransition from '@/components/utils/PageTransition';
import { 
  Wifi, 
  WifiOff, 
  Database, 
  RefreshCw, 
  Send, 
  Brain,
  CheckCircle,
  XCircle,
  Loader2,
  HardDrive,
  Cloud
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function OfflineTest() {
  const { 
    isOnline, 
    offlineReady, 
    pendingSync, 
    invokeLLM, 
    createEntity,
    listEntity,
    forceSync,
    llmEmulator,
    offlineStorage
  } = useOffline();
  const { language } = useLanguage();
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [testEntity, setTestEntity] = useState('');
  const [entityResult, setEntityResult] = useState(null);
  const [storageInfo, setStorageInfo] = useState(null);

  const handleTestLLM = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    try {
      const result = await invokeLLM({ prompt });
      setResponse(result);
    } catch (error) {
      setResponse({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleTestEntity = async () => {
    if (!testEntity.trim()) return;
    
    setLoading(true);
    try {
      const result = await createEntity('Memory', {
        type: 'interaction',
        content: testEntity,
        importance: 5,
        modality: 'chat',
        tags: ['offline_test']
      });
      setEntityResult(result);
    } catch (error) {
      setEntityResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckStorage = async () => {
    const usage = await offlineStorage.getStorageUsage();
    setStorageInfo(usage);
  };

  const emulatorStats = llmEmulator?.getStats() || {};

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/30 page-padding page-padding-y">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-2 font-display">
              {language === 'en' ? 'Offline Mode Test' : 'Test Mode Hors-ligne'}
            </h1>
            <p className="text-slate-600">
              {language === 'en' 
                ? 'Test offline capabilities and LLM emulator'
                : 'Testez les capacités hors-ligne et l\'émulateur LLM'
              }
            </p>
          </div>

          {/* Statut Global */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-3">
                {isOnline ? (
                  <Wifi className="w-6 h-6 text-green-600" />
                ) : (
                  <WifiOff className="w-6 h-6 text-orange-600" />
                )}
                <h3 className="font-bold text-lg">
                  {language === 'en' ? 'Connection' : 'Connexion'}
                </h3>
              </div>
              <Badge variant={isOnline ? "default" : "secondary"} className="text-sm">
                {isOnline 
                  ? (language === 'en' ? 'Online' : 'En ligne')
                  : (language === 'en' ? 'Offline' : 'Hors-ligne')
                }
              </Badge>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Brain className="w-6 h-6 text-purple-600" />
                <h3 className="font-bold text-lg">
                  {language === 'en' ? 'LLM Emulator' : 'Émulateur LLM'}
                </h3>
              </div>
              <div className="space-y-1 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  {emulatorStats.ready ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                  <span>{emulatorStats.ready ? 'Ready' : 'Not Ready'}</span>
                </div>
                <div>Patterns: {emulatorStats.patternsCount || 0}</div>
                <div>History: {emulatorStats.conversationHistoryLength || 0}</div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Database className="w-6 h-6 text-blue-600" />
                <h3 className="font-bold text-lg">Sync</h3>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-slate-900">{pendingSync}</div>
                <p className="text-xs text-slate-600">
                  {language === 'en' ? 'Pending operations' : 'Opérations en attente'}
                </p>
                {isOnline && pendingSync > 0 && (
                  <Button onClick={forceSync} size="sm" className="w-full">
                    <RefreshCw className="w-3 h-3 mr-2" />
                    Sync
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* Test LLM */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-6 h-6 text-purple-600" />
              <h3 className="font-bold text-lg">
                {language === 'en' ? 'Test LLM' : 'Tester le LLM'}
              </h3>
            </div>
            
            <div className="space-y-4">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={language === 'en' ? 'Enter your prompt...' : 'Entrez votre prompt...'}
                rows={4}
              />
              
              <Button 
                onClick={handleTestLLM} 
                disabled={loading || !offlineReady}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {language === 'en' ? 'Generating...' : 'Génération...'}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    {language === 'en' ? 'Send' : 'Envoyer'}
                  </>
                )}
              </Button>

              {response && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-slate-50 rounded-lg"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {response._offline_mode ? (
                      <Badge variant="secondary" className="text-xs">Offline Mode</Badge>
                    ) : (
                      <Badge className="text-xs">Online</Badge>
                    )}
                  </div>
                  <pre className="text-sm text-slate-700 whitespace-pre-wrap">
                    {typeof response === 'string' ? response : JSON.stringify(response, null, 2)}
                  </pre>
                </motion.div>
              )}
            </div>
          </Card>

          {/* Test Entity */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-blue-600" />
              <h3 className="font-bold text-lg">
                {language === 'en' ? 'Test Entity Creation' : 'Tester Création d\'Entité'}
              </h3>
            </div>
            
            <div className="space-y-4">
              <Input
                value={testEntity}
                onChange={(e) => setTestEntity(e.target.value)}
                placeholder={language === 'en' ? 'Enter test content...' : 'Entrez du contenu test...'}
              />
              
              <Button 
                onClick={handleTestEntity} 
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {language === 'en' ? 'Creating...' : 'Création...'}
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4 mr-2" />
                    {language === 'en' ? 'Create Memory' : 'Créer Mémoire'}
                  </>
                )}
              </Button>

              {entityResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-slate-50 rounded-lg"
                >
                  <pre className="text-sm text-slate-700 whitespace-pre-wrap">
                    {JSON.stringify(entityResult, null, 2)}
                  </pre>
                </motion.div>
              )}
            </div>
          </Card>

          {/* Storage Info */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <HardDrive className="w-6 h-6 text-slate-600" />
              <h3 className="font-bold text-lg">
                {language === 'en' ? 'Storage Info' : 'Info Stockage'}
              </h3>
            </div>
            
            <Button onClick={handleCheckStorage} className="w-full mb-4">
              <Cloud className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Check Storage' : 'Vérifier Stockage'}
            </Button>

            {storageInfo && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Usage:</span>
                  <span className="font-mono">{(storageInfo.usage / 1024 / 1024).toFixed(2)} MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Quota:</span>
                  <span className="font-mono">{(storageInfo.quota / 1024 / 1024 / 1024).toFixed(2)} GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Percent:</span>
                  <span className="font-mono">{storageInfo.usagePercent}%</span>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}