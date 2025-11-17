/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - System Settings Panel                                      ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Settings, Save, RefreshCw, Shield, Database, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPanel() {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    debugMode: false,
    analyticsEnabled: true,
    autoBackup: true,
    maxRequestsPerMinute: 100,
    sessionTimeout: 3600,
    maxUploadSize: 50,
    cacheEnabled: true,
    compressionEnabled: true
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simuler l'enregistrement
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    alert('Paramètres enregistrés avec succès');
  };

  const settingGroups = [
    {
      title: "Mode Système",
      icon: Shield,
      settings: [
        {
          key: "maintenanceMode",
          label: "Mode Maintenance",
          description: "Mettre le système en maintenance",
          type: "switch"
        },
        {
          key: "debugMode",
          label: "Mode Debug",
          description: "Activer les logs de debug détaillés",
          type: "switch"
        }
      ]
    },
    {
      title: "Analytics & Monitoring",
      icon: Database,
      settings: [
        {
          key: "analyticsEnabled",
          label: "Analytics Activé",
          description: "Collecter les données d'utilisation",
          type: "switch"
        },
        {
          key: "autoBackup",
          label: "Sauvegarde Automatique",
          description: "Backup quotidien des données",
          type: "switch"
        }
      ]
    },
    {
      title: "Performance",
      icon: Zap,
      settings: [
        {
          key: "maxRequestsPerMinute",
          label: "Requêtes Max/Min",
          description: "Limite de requêtes par minute",
          type: "number",
          min: 10,
          max: 1000
        },
        {
          key: "sessionTimeout",
          label: "Timeout Session (sec)",
          description: "Durée d'inactivité avant déconnexion",
          type: "number",
          min: 300,
          max: 7200
        },
        {
          key: "maxUploadSize",
          label: "Taille Upload Max (MB)",
          description: "Taille maximale des fichiers uploadés",
          type: "number",
          min: 1,
          max: 100
        },
        {
          key: "cacheEnabled",
          label: "Cache Activé",
          description: "Activer le cache système",
          type: "switch"
        },
        {
          key: "compressionEnabled",
          label: "Compression Activée",
          description: "Compresser les réponses API",
          type: "switch"
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-purple-600" />
            <div>
              <h3 className="text-2xl font-bold">Paramètres Système</h3>
              <p className="text-sm text-slate-600">Configuration globale de l'application</p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Enregistrer
          </Button>
        </div>

        <div className="space-y-6">
          {settingGroups.map((group, idx) => {
            const Icon = group.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="p-6 bg-slate-50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900">{group.title}</h4>
                  </div>

                  <div className="space-y-4">
                    {group.settings.map((setting) => (
                      <div
                        key={setting.key}
                        className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-slate-900 mb-1">{setting.label}</div>
                          <div className="text-sm text-slate-600">{setting.description}</div>
                        </div>

                        <div className="flex items-center gap-3">
                          {setting.type === "switch" ? (
                            <>
                              <Badge className={settings[setting.key] ? "bg-green-500 text-white" : "bg-slate-200 text-slate-700"}>
                                {settings[setting.key] ? "ON" : "OFF"}
                              </Badge>
                              <Switch
                                checked={settings[setting.key]}
                                onCheckedChange={(checked) =>
                                  setSettings({ ...settings, [setting.key]: checked })
                                }
                              />
                            </>
                          ) : (
                            <Input
                              type="number"
                              value={settings[setting.key]}
                              onChange={(e) =>
                                setSettings({ ...settings, [setting.key]: parseInt(e.target.value) })
                              }
                              min={setting.min}
                              max={setting.max}
                              className="w-32"
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
      </Card>

      {/* Status actuel */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-green-600" />
          <div>
            <h4 className="font-bold text-green-900">Système Opérationnel</h4>
            <p className="text-sm text-green-700">
              Tous les services fonctionnent normalement • Dernière sauvegarde: {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}