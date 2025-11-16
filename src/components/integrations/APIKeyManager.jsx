/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - API Key Manager (Functional)                               ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/components/utils/LanguageContext";
import { 
  Key, 
  Plus, 
  Trash2, 
  Copy, 
  CheckCircle, 
  AlertCircle,
  Eye,
  EyeOff 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function APIKeyManager() {
  const { language } = useLanguage();
  const queryClient = useQueryClient();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newKeyData, setNewKeyData] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const { data: apiKeys = [], isLoading } = useQuery({
    queryKey: ['api-keys'],
    queryFn: () => base44.entities.APIKey.list('-created_date')
  });

  const createKeyMutation = useMutation({
    mutationFn: async (data) => {
      const response = await base44.functions.invoke('generateApiKey', data);
      return response.data;
    },
    onSuccess: (data) => {
      setNewKeyData(data.data);
      queryClient.invalidateQueries(['api-keys']);
    }
  });

  const deleteKeyMutation = useMutation({
    mutationFn: (id) => base44.entities.APIKey.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['api-keys']);
    }
  });

  const toggleKeyMutation = useMutation({
    mutationFn: ({ id, active }) => base44.entities.APIKey.update(id, { active }),
    onSuccess: () => {
      queryClient.invalidateQueries(['api-keys']);
    }
  });

  const permissions = [
    { id: 'read:conversations', label: 'Read Conversations' },
    { id: 'write:conversations', label: 'Write Conversations' },
    { id: 'read:knowledge', label: 'Read Knowledge' },
    { id: 'write:knowledge', label: 'Write Knowledge' },
    { id: 'read:memories', label: 'Read Memories' },
    { id: 'write:memories', label: 'Write Memories' },
    { id: 'admin', label: 'Admin (All Permissions)' }
  ];

  const handleCreate = () => {
    const name = prompt(language === 'en' ? 'API Key Name:' : 'Nom de la clé API :');
    if (!name) return;

    if (selectedPermissions.length === 0) {
      alert(language === 'en' ? 'Select at least one permission' : 'Sélectionnez au moins une permission');
      return;
    }

    createKeyMutation.mutate({ 
      name, 
      permissions: selectedPermissions,
      expires_in_days: 365
    });
    setSelectedPermissions([]);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert(language === 'en' ? 'Copied!' : 'Copié !');
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Key className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-slate-900">
            {language === 'en' ? 'API Keys' : 'Clés API'}
          </h2>
        </div>
        <Button onClick={() => setShowCreateDialog(!showCreateDialog)}>
          <Plus className="w-4 h-4 mr-2" />
          {language === 'en' ? 'Create Key' : 'Créer une Clé'}
        </Button>
      </div>

      <AnimatePresence>
        {showCreateDialog && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200"
          >
            <h3 className="font-semibold mb-3">
              {language === 'en' ? 'Select Permissions:' : 'Sélectionner les Permissions :'}
            </h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {permissions.map(perm => (
                <label key={perm.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(perm.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPermissions([...selectedPermissions, perm.id]);
                      } else {
                        setSelectedPermissions(selectedPermissions.filter(p => p !== perm.id));
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm">{perm.label}</span>
                </label>
              ))}
            </div>
            <Button onClick={handleCreate} disabled={createKeyMutation.isPending}>
              {language === 'en' ? 'Generate API Key' : 'Générer la Clé'}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {newKeyData && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200"
        >
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-green-900 mb-2">
                {language === 'en' ? 'API Key Created!' : 'Clé API Créée !'}
              </h3>
              <p className="text-sm text-green-700 mb-3">
                {language === 'en' 
                  ? 'Save this key now. You will not be able to see it again!'
                  : 'Sauvegardez cette clé maintenant. Vous ne pourrez plus la revoir !'
                }
              </p>
              <div className="flex items-center gap-2 p-3 bg-white rounded border border-green-300">
                <code className="flex-1 text-sm font-mono">{newKeyData.key}</code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(newKeyData.key)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <Button
                onClick={() => setNewKeyData(null)}
                variant="outline"
                size="sm"
                className="mt-3"
              >
                {language === 'en' ? 'I saved it' : 'Je l\'ai sauvegardée'}
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      <ScrollArea className="h-[400px]">
        <div className="space-y-3">
          {apiKeys.map(key => (
            <Card key={key.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-slate-900">{key.name}</h3>
                    <Badge className={key.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                      {key.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-slate-600 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono bg-slate-100 px-2 py-0.5 rounded">
                        {key.key.substring(0, 16)}...
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {key.permissions.map(perm => (
                        <Badge key={perm} variant="outline" className="text-xs">
                          {perm}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-xs text-slate-500">
                      {language === 'en' ? 'Used' : 'Utilisée'}: {key.usage_count || 0} {language === 'en' ? 'times' : 'fois'}
                      {key.expires_at && ` • ${language === 'en' ? 'Expires' : 'Expire'}: ${new Date(key.expires_at).toLocaleDateString()}`}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleKeyMutation.mutate({ id: key.id, active: !key.active })}
                  >
                    {key.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      if (confirm(language === 'en' ? 'Delete this API key?' : 'Supprimer cette clé ?')) {
                        deleteKeyMutation.mutate(key.id);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {apiKeys.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <Key className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p>{language === 'en' ? 'No API keys yet' : 'Aucune clé API'}</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}