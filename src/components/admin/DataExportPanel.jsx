/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Data Export Panel                                          ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileJson, FileText, Database, CheckCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function DataExportPanel() {
  const [exporting, setExporting] = useState(null);

  const { data: stats } = useQuery({
    queryKey: ['exportStats'],
    queryFn: async () => {
      const [conversations, memories, knowledge, users, products, licenses, thoughts, emotions] = await Promise.all([
        base44.entities.Conversation.list(),
        base44.entities.Memory.list(),
        base44.entities.KnowledgeBase.list(),
        base44.entities.User.list(),
        base44.entities.Product.list(),
        base44.entities.ModuleLicense.list(),
        base44.entities.ConsciousThought.list(),
        base44.entities.EmotionalResponse.list()
      ]);

      return {
        conversations: conversations.length,
        memories: memories.length,
        knowledge: knowledge.length,
        users: users.length,
        products: products.length,
        licenses: licenses.length,
        thoughts: thoughts.length,
        emotions: emotions.length
      };
    },
    initialData: { conversations: 0, memories: 0, knowledge: 0, users: 0, products: 0, licenses: 0, thoughts: 0, emotions: 0 }
  });

  const exportData = async (entityType) => {
    setExporting(entityType);
    try {
      let data;
      let filename;

      switch (entityType) {
        case 'conversations':
          data = await base44.entities.Conversation.list('-created_date', 10000);
          filename = 'conversations_export.json';
          break;
        case 'memories':
          data = await base44.entities.Memory.list('-created_date', 10000);
          filename = 'memories_export.json';
          break;
        case 'knowledge':
          data = await base44.entities.KnowledgeBase.list('-created_date', 10000);
          filename = 'knowledge_export.json';
          break;
        case 'users':
          data = await base44.entities.User.list('-created_date', 10000);
          filename = 'users_export.json';
          break;
        case 'products':
          data = await base44.entities.Product.list('-created_date', 10000);
          filename = 'products_export.json';
          break;
        case 'licenses':
          data = await base44.entities.ModuleLicense.list('-created_date', 10000);
          filename = 'licenses_export.json';
          break;
        case 'thoughts':
          data = await base44.entities.ConsciousThought.list('-created_date', 10000);
          filename = 'thoughts_export.json';
          break;
        case 'emotions':
          data = await base44.entities.EmotionalResponse.list('-created_date', 10000);
          filename = 'emotions_export.json';
          break;
        case 'all':
          const [conv, mem, kb, usr, prod, lic, tho, emo] = await Promise.all([
            base44.entities.Conversation.list('-created_date', 10000),
            base44.entities.Memory.list('-created_date', 10000),
            base44.entities.KnowledgeBase.list('-created_date', 10000),
            base44.entities.User.list('-created_date', 10000),
            base44.entities.Product.list('-created_date', 10000),
            base44.entities.ModuleLicense.list('-created_date', 10000),
            base44.entities.ConsciousThought.list('-created_date', 10000),
            base44.entities.EmotionalResponse.list('-created_date', 10000)
          ]);
          data = { conversations: conv, memories: mem, knowledge: kb, users: usr, products: prod, licenses: lic, thoughts: tho, emotions: emo };
          filename = 'full_export.json';
          break;
        default:
          throw new Error('Unknown entity type');
      }

      // Créer et télécharger le fichier
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Erreur lors de l\'export: ' + error.message);
    } finally {
      setExporting(null);
    }
  };

  const exportOptions = [
    { id: 'conversations', title: 'Conversations', description: 'Exporter toutes les conversations', count: stats.conversations, icon: Database, color: 'from-purple-500 to-indigo-600' },
    { id: 'memories', title: 'Mémoires', description: 'Exporter toutes les mémoires', count: stats.memories, icon: Database, color: 'from-indigo-500 to-purple-600' },
    { id: 'knowledge', title: 'Base de Connaissances', description: 'Exporter toutes les connaissances', count: stats.knowledge, icon: Database, color: 'from-blue-500 to-cyan-600' },
    { id: 'users', title: 'Utilisateurs', description: 'Exporter tous les utilisateurs', count: stats.users, icon: Database, color: 'from-pink-500 to-rose-600' },
    { id: 'products', title: 'Produits', description: 'Catalogue des produits', count: stats.products || 0, icon: Database, color: 'from-green-500 to-emerald-600' },
    { id: 'licenses', title: 'Licences', description: 'Toutes les licences modules', count: stats.licenses || 0, icon: Database, color: 'from-amber-500 to-orange-600' },
    { id: 'thoughts', title: 'Pensées Conscientes', description: 'Pensées générées par l\'IA', count: stats.thoughts || 0, icon: Database, color: 'from-violet-500 to-purple-600' },
    { id: 'emotions', title: 'Réponses Émotionnelles', description: 'Historique émotionnel', count: stats.emotions || 0, icon: Database, color: 'from-rose-500 to-pink-600' }
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">Export de Données</h3>
            <p className="text-slate-600">Exporter les données du système au format JSON</p>
          </div>
          <FileJson className="w-12 h-12 text-purple-600" />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">Format JSON</p>
              <p className="text-blue-700">
                Les données seront exportées au format JSON structuré, compatible avec la plupart des outils d'analyse et bases de données.
              </p>
            </div>
          </div>
        </div>

        {/* Export complet */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-bold text-purple-900 mb-2">Export Complet</h4>
              <p className="text-sm text-purple-700 mb-3">
                Exporter toutes les données du système en un seul fichier
              </p>
              <div className="flex items-center gap-2 text-xs text-purple-600">
                <CheckCircle className="w-4 h-4" />
                <span>Conversations, Mémoires, Connaissances, Utilisateurs</span>
              </div>
            </div>
            <Button
              onClick={() => exportData('all')}
              disabled={exporting === 'all'}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              {exporting === 'all' ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <Download className="w-5 h-5 mr-2" />
              )}
              Export Complet
            </Button>
          </div>
        </Card>
      </Card>

      {/* Exports individuels */}
      <div className="grid md:grid-cols-2 gap-4">
        {exportOptions.map((option, idx) => {
          const Icon = option.icon;
          
          return (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${option.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="bg-slate-100 text-slate-700">
                    {option.count} {option.count > 1 ? 'items' : 'item'}
                  </Badge>
                </div>

                <h4 className="font-bold text-lg text-slate-900 mb-2">{option.title}</h4>
                <p className="text-sm text-slate-600 mb-4">{option.description}</p>

                <Button
                  onClick={() => exportData(option.id)}
                  disabled={exporting === option.id}
                  variant="outline"
                  className="w-full"
                >
                  {exporting === option.id ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Exporter
                </Button>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Info sur la sécurité */}
      <Card className="p-6 bg-yellow-50 border-yellow-200">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-900">
            <p className="font-semibold mb-1">Sécurité des Données</p>
            <p className="text-yellow-700">
              Les exports contiennent des données sensibles. Assurez-vous de stocker les fichiers de manière sécurisée et de respecter les réglementations RGPD, Loi 25, et CCPA.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}