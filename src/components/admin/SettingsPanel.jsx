/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - System Settings Panel                                      ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Settings, Save, RefreshCw, Shield, Database, Zap, Brain, 
  Bell, Mail, Globe, Lock, Eye, Palette, Clock, CheckCircle,
  AlertTriangle, Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const DEFAULT_SETTINGS = {
  maintenanceMode: false,
  debugMode: false,
  analyticsEnabled: true,
  autoBackup: true,
  maxRequestsPerMinute: 100,
  sessionTimeout: 3600,
  maxUploadSize: 50,
  cacheEnabled: true,
  compressionEnabled: true,
  // Nouveaux paramètres
  emailNotifications: true,
  pushNotifications: false,
  darkModeDefault: false,
  consciousnessAutoStart: true,
  memoryRetentionDays: 365,
  llmTemperature: 0.7,
  llmMaxTokens: 4000,
  autoArchiveConversations: true,
  archiveAfterDays: 90,
  gdprCompliance: true,
  dataEncryption: true,
  twoFactorRequired: false,
  apiRateLimit: 1000,
  webhookRetries: 3,
  logRetentionDays: 30,
  systemLanguage: 'fr',
  timezone: 'America/Montreal',
  welcomeMessage: 'Bienvenue sur Druide Omega!'
};

export default function SettingsPanel() {
  const queryClient = useQueryClient();
  
  // Charger les paramètres depuis RegistryEntry
  const { data: registrySettings, isLoading } = useQuery({
    queryKey: ['system-settings'],
    queryFn: async () => {
      try {
        const entries = await base44.entities.RegistryEntry.filter({ key: 'system_settings' });
        if (entries.length > 0) {
          return { ...DEFAULT_SETTINGS, ...JSON.parse(entries[0].value || '{}') };
        }
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
      return DEFAULT_SETTINGS;
    }
  });

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (registrySettings) {
      setSettings(registrySettings);
    }
  }, [registrySettings]);

  const saveMutation = useMutation({
    mutationFn: async (newSettings) => {
      const entries = await base44.entities.RegistryEntry.filter({ key: 'system_settings' });
      if (entries.length > 0) {
        await base44.entities.RegistryEntry.update(entries[0].id, {
          value: JSON.stringify(newSettings),
          updated_at: new Date().toISOString()
        });
      } else {
        await base44.entities.RegistryEntry.create({
          key: 'system_settings',
          value: JSON.stringify(newSettings),
          category: 'system',
          description: 'Paramètres système globaux'
        });
      }
      return newSettings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
      setHasChanges(false);
      toast.success('Paramètres enregistrés avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de l\'enregistrement: ' + error.message);
    }
  });

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    saveMutation.mutate(settings);
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    setHasChanges(true);
  };

  const settingGroups = [
    {
      title: "Mode Système",
      icon: Shield,
      color: "from-red-500 to-rose-600",
      settings: [
        { key: "maintenanceMode", label: "Mode Maintenance", description: "Mettre le système en maintenance", type: "switch" },
        { key: "debugMode", label: "Mode Debug", description: "Activer les logs de debug détaillés", type: "switch" }
      ]
    },
    {
      title: "IA & Conscience",
      icon: Brain,
      color: "from-purple-500 to-violet-600",
      settings: [
        { key: "consciousnessAutoStart", label: "Conscience Auto-Start", description: "Activer la conscience au démarrage", type: "switch" },
        { key: "llmTemperature", label: "Température LLM", description: "Créativité des réponses (0.0-1.0)", type: "number", min: 0, max: 1, step: 0.1 },
        { key: "llmMaxTokens", label: "Tokens Maximum", description: "Longueur max des réponses", type: "number", min: 500, max: 8000 }
      ]
    },
    {
      title: "Notifications",
      icon: Bell,
      color: "from-amber-500 to-orange-600",
      settings: [
        { key: "emailNotifications", label: "Notifications Email", description: "Envoyer des alertes par email", type: "switch" },
        { key: "pushNotifications", label: "Notifications Push", description: "Notifications en temps réel", type: "switch" }
      ]
    },
    {
      title: "Sécurité & Conformité",
      icon: Lock,
      color: "from-green-500 to-emerald-600",
      settings: [
        { key: "gdprCompliance", label: "Conformité RGPD", description: "Appliquer les règles RGPD/Loi 25", type: "switch" },
        { key: "dataEncryption", label: "Chiffrement Données", description: "Chiffrer les données sensibles", type: "switch" },
        { key: "twoFactorRequired", label: "2FA Obligatoire", description: "Authentification à 2 facteurs", type: "switch" }
      ]
    },
    {
      title: "Analytics & Monitoring",
      icon: Database,
      color: "from-blue-500 to-cyan-600",
      settings: [
        { key: "analyticsEnabled", label: "Analytics Activé", description: "Collecter les données d'utilisation", type: "switch" },
        { key: "autoBackup", label: "Sauvegarde Automatique", description: "Backup quotidien des données", type: "switch" },
        { key: "logRetentionDays", label: "Rétention Logs (jours)", description: "Durée de conservation des logs", type: "number", min: 7, max: 365 }
      ]
    },
    {
      title: "Performance",
      icon: Zap,
      color: "from-yellow-500 to-orange-600",
      settings: [
        { key: "maxRequestsPerMinute", label: "Requêtes Max/Min", description: "Limite de requêtes par minute", type: "number", min: 10, max: 1000 },
        { key: "sessionTimeout", label: "Timeout Session (sec)", description: "Durée d'inactivité avant déconnexion", type: "number", min: 300, max: 7200 },
        { key: "maxUploadSize", label: "Taille Upload Max (MB)", description: "Taille maximale des fichiers", type: "number", min: 1, max: 100 },
        { key: "cacheEnabled", label: "Cache Activé", description: "Activer le cache système", type: "switch" },
        { key: "compressionEnabled", label: "Compression Activée", description: "Compresser les réponses API", type: "switch" },
        { key: "apiRateLimit", label: "Rate Limit API/h", description: "Limite API par heure", type: "number", min: 100, max: 10000 }
      ]
    },
    {
      title: "Archivage",
      icon: Clock,
      color: "from-indigo-500 to-purple-600",
      settings: [
        { key: "autoArchiveConversations", label: "Auto-Archiver", description: "Archiver automatiquement les vieilles données", type: "switch" },
        { key: "archiveAfterDays", label: "Archiver après (jours)", description: "Délai avant archivage", type: "number", min: 30, max: 365 },
        { key: "memoryRetentionDays", label: "Rétention Mémoires", description: "Durée de conservation des mémoires", type: "number", min: 30, max: 730 }
      ]
    },
    {
      title: "Interface",
      icon: Palette,
      color: "from-pink-500 to-rose-600",
      settings: [
        { key: "darkModeDefault", label: "Mode Sombre Par Défaut", description: "Thème sombre pour les nouveaux utilisateurs", type: "switch" },
        { key: "systemLanguage", label: "Langue Système", description: "fr, en, es, de", type: "text" },
        { key: "timezone", label: "Fuseau Horaire", description: "Ex: America/Montreal", type: "text" },
        { key: "welcomeMessage", label: "Message d'Accueil", description: "Message affiché aux nouveaux utilisateurs", type: "textarea" }
      ]
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec actions */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Paramètres Système</h3>
              <p className="text-sm text-slate-600">Configuration globale de Druide Omega</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hasChanges && (
              <Badge className="bg-amber-500 text-white animate-pulse">
                Modifications non enregistrées
              </Badge>
            )}
            <Button variant="outline" onClick={handleReset}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Réinitialiser
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={saveMutation.isPending || !hasChanges}
              className="bg-gradient-to-r from-purple-600 to-indigo-600"
            >
              {saveMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Enregistrer
            </Button>
          </div>
        </div>

        {/* Maintenance Mode Warning */}
        {settings.maintenanceMode && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <div>
              <p className="font-semibold text-red-800">Mode Maintenance Actif</p>
              <p className="text-sm text-red-700">L'application est actuellement inaccessible aux utilisateurs.</p>
            </div>
          </div>
        )}
      </Card>

      {/* Settings Groups */}
      <div className="grid lg:grid-cols-2 gap-6">
        {settingGroups.map((group, idx) => {
          const Icon = group.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="p-6 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 bg-gradient-to-br ${group.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">{group.title}</h4>
                </div>

                <div className="space-y-3">
                  {group.settings.map((setting) => (
                    <div
                      key={setting.key}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="flex-1 mr-4">
                        <div className="font-medium text-slate-900 text-sm">{setting.label}</div>
                        <div className="text-xs text-slate-500">{setting.description}</div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {setting.type === "switch" ? (
                          <>
                            <Badge className={settings[setting.key] ? "bg-green-500 text-white text-xs" : "bg-slate-200 text-slate-600 text-xs"}>
                              {settings[setting.key] ? "ON" : "OFF"}
                            </Badge>
                            <Switch
                              checked={settings[setting.key] || false}
                              onCheckedChange={(checked) => handleChange(setting.key, checked)}
                            />
                          </>
                        ) : setting.type === "textarea" ? (
                          <Textarea
                            value={settings[setting.key] || ''}
                            onChange={(e) => handleChange(setting.key, e.target.value)}
                            className="w-48 h-16 text-sm"
                          />
                        ) : setting.type === "text" ? (
                          <Input
                            type="text"
                            value={settings[setting.key] || ''}
                            onChange={(e) => handleChange(setting.key, e.target.value)}
                            className="w-32 text-sm"
                          />
                        ) : (
                          <Input
                            type="number"
                            value={settings[setting.key] || 0}
                            onChange={(e) => handleChange(setting.key, parseFloat(e.target.value))}
                            min={setting.min}
                            max={setting.max}
                            step={setting.step || 1}
                            className="w-24 text-sm"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Status actuel */}
      <Card className={`p-6 ${settings.maintenanceMode ? 'bg-gradient-to-br from-red-50 to-orange-50 border-red-200' : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'}`}>
        <div className="flex items-center gap-3">
          {settings.maintenanceMode ? (
            <AlertTriangle className="w-6 h-6 text-red-600" />
          ) : (
            <CheckCircle className="w-6 h-6 text-green-600" />
          )}
          <div>
            <h4 className={`font-bold ${settings.maintenanceMode ? 'text-red-900' : 'text-green-900'}`}>
              {settings.maintenanceMode ? 'Mode Maintenance' : 'Système Opérationnel'}
            </h4>
            <p className={`text-sm ${settings.maintenanceMode ? 'text-red-700' : 'text-green-700'}`}>
              {settings.maintenanceMode 
                ? 'L\'application est en maintenance. Les utilisateurs ne peuvent pas accéder.' 
                : `Tous les services fonctionnent normalement • Dernière mise à jour: ${new Date().toLocaleString()}`
              }
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}