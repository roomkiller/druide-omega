/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Security Dashboard                                         ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { createPageUrl } from "@/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Shield, Lock, FileText, Key, ArrowLeft } from "lucide-react";
import TwoFactorSetup from "../components/security/TwoFactorSetup";
import SecurityAuditLogs from "../components/security/SecurityAuditLogs";
import { motion } from "framer-motion";

export default function Security() {
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-4 sm:px-6 py-6 flex-shrink-0">
        <div className="max-w-6xl mx-auto">
          <Button
            onClick={() => window.location.href = createPageUrl('ArchitectDashboard')}
            variant="ghost"
            className="mb-4 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au Dashboard
          </Button>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-2xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Sécurité</h1>
              <p className="text-purple-100">Gestion de la sécurité et conformité</p>
            </div>
          </motion.div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <Tabs defaultValue="2fa" className="space-y-6">
            <TabsList className="bg-white shadow-md">
              <TabsTrigger value="2fa" className="text-base">
                <Lock className="w-4 h-4 mr-2" />
                Authentification 2FA
              </TabsTrigger>
              <TabsTrigger value="audit" className="text-base">
                <FileText className="w-4 h-4 mr-2" />
                Audit Logs
              </TabsTrigger>
              <TabsTrigger value="encryption" className="text-base">
                <Key className="w-4 h-4 mr-2" />
                Chiffrement
              </TabsTrigger>
            </TabsList>

            <TabsContent value="2fa">
              <TwoFactorSetup />
            </TabsContent>

            <TabsContent value="audit">
              <SecurityAuditLogs />
            </TabsContent>

            <TabsContent value="encryption">
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Key className="w-8 h-8 text-purple-600" />
                  <h3 className="text-2xl font-bold">Chiffrement End-to-End</h3>
                </div>
                <p className="text-slate-600 mb-6">
                  Toutes les données sensibles (conversations, mémoires, bases de connaissances) sont 
                  chiffrées en AES-256 avant stockage. Les clés de chiffrement sont uniques par utilisateur 
                  et stockées de manière sécurisée.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-2">✓ Données chiffrées</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• Messages conversations</li>
                      <li>• Mémoires personnelles</li>
                      <li>• Bases de connaissances</li>
                      <li>• Fichiers uploadés</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">🔒 Standards</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• AES-256-GCM</li>
                      <li>• TLS 1.3 en transit</li>
                      <li>• RGPD compliant</li>
                      <li>• ISO 27001 ready</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}