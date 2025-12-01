/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Gestionnaire VPN Licences                                  ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Key, Shield, Play, Pause, StopCircle, XCircle, RefreshCw,
  Mail, Smartphone, Globe, Code, UserCog, AlertTriangle,
  CheckCircle, Clock, Ban, Loader2, Eye, History
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const VPN_CHANNELS = [
  { id: "email", name: "Email", icon: Mail, color: "from-blue-500 to-indigo-600" },
  { id: "whatsapp", name: "WhatsApp", icon: Smartphone, color: "from-green-500 to-emerald-600" },
  { id: "portal", name: "Portail Web", icon: Globe, color: "from-purple-500 to-violet-600" },
  { id: "api", name: "API Enterprise", icon: Code, color: "from-cyan-500 to-blue-600" },
  { id: "admin", name: "Admin Direct", icon: UserCog, color: "from-red-500 to-rose-600" }
];

const STATUS_CONFIG = {
  active: { label: "Actif", icon: CheckCircle, color: "bg-green-100 text-green-700", badgeColor: "bg-green-500" },
  paused: { label: "En pause", icon: Pause, color: "bg-yellow-100 text-yellow-700", badgeColor: "bg-yellow-500" },
  suspended: { label: "Suspendu", icon: StopCircle, color: "bg-orange-100 text-orange-700", badgeColor: "bg-orange-500" },
  expired: { label: "Expiré", icon: Clock, color: "bg-slate-100 text-slate-700", badgeColor: "bg-slate-500" },
  cancelled: { label: "Annulé", icon: XCircle, color: "bg-red-100 text-red-700", badgeColor: "bg-red-500" },
  revoked: { label: "Révoqué", icon: Ban, color: "bg-red-200 text-red-900", badgeColor: "bg-red-700" }
};

const ACTIONS = [
  { id: "activate", label: "Activer", icon: Play, targetStatus: "active", color: "bg-green-600 hover:bg-green-700" },
  { id: "pause", label: "Mettre en pause", icon: Pause, targetStatus: "paused", color: "bg-yellow-600 hover:bg-yellow-700" },
  { id: "suspend", label: "Suspendre", icon: StopCircle, targetStatus: "suspended", color: "bg-orange-600 hover:bg-orange-700" },
  { id: "cancel", label: "Annuler", icon: XCircle, targetStatus: "cancelled", color: "bg-red-600 hover:bg-red-700" },
  { id: "revoke", label: "Révoquer", icon: Ban, targetStatus: "revoked", color: "bg-red-800 hover:bg-red-900" },
  { id: "reactivate", label: "Réactiver", icon: RefreshCw, targetStatus: "active", color: "bg-blue-600 hover:bg-blue-700" }
];

export default function LicenseVPNManager({ licenses = [], products = [], onUpdate }) {
  const [selectedLicense, setSelectedLicense] = useState(null);
  const [actionDialog, setActionDialog] = useState({ open: false, action: null, license: null });
  const [selectedChannel, setSelectedChannel] = useState("admin");
  const [actionReason, setActionReason] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [historyDialog, setHistoryDialog] = useState({ open: false, license: null });
  
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async ({ licenseId, updates }) => {
      return await base44.entities.ModuleLicense.update(licenseId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moduleLicenses'] });
      setActionDialog({ open: false, action: null, license: null });
      setActionReason("");
      setAdminNotes("");
      if (onUpdate) onUpdate();
    }
  });

  const getProductName = (sku) => {
    const product = products.find(p => (p.data?.sku || p.sku) === sku);
    return product?.data?.name || product?.name || sku;
  };

  const openActionDialog = (action, license) => {
    setActionDialog({ open: true, action, license });
    setSelectedChannel("admin");
    setActionReason("");
    setAdminNotes(license.admin_notes || "");
  };

  const executeAction = async () => {
    if (!actionDialog.action || !actionDialog.license) return;

    const updates = {
      status: actionDialog.action.targetStatus,
      last_status_change: new Date().toISOString(),
      status_reason: actionReason,
      vpn_channel: selectedChannel,
      admin_notes: adminNotes
    };

    if (actionDialog.action.targetStatus === "active") {
      updates.activation_date = new Date().toISOString();
    }

    await updateMutation.mutateAsync({
      licenseId: actionDialog.license.id,
      updates
    });
  };

  const getAvailableActions = (license) => {
    const status = license.status || "active";
    
    switch (status) {
      case "active":
        return ACTIONS.filter(a => ["pause", "suspend", "cancel", "revoke"].includes(a.id));
      case "paused":
        return ACTIONS.filter(a => ["activate", "suspend", "cancel", "revoke"].includes(a.id));
      case "suspended":
        return ACTIONS.filter(a => ["reactivate", "cancel", "revoke"].includes(a.id));
      case "expired":
        return ACTIONS.filter(a => ["reactivate", "revoke"].includes(a.id));
      case "cancelled":
        return ACTIONS.filter(a => ["reactivate", "revoke"].includes(a.id));
      case "revoked":
        return []; // Aucune action possible après révocation
      default:
        return ACTIONS.filter(a => ["activate"].includes(a.id));
    }
  };

  if (licenses.length === 0) {
    return (
      <Card className="p-6 text-center">
        <Key className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-700 mb-2">Aucune licence</h3>
        <p className="text-sm text-slate-500">Vous n'avez pas encore de licences de modules.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="p-4 bg-gradient-to-br from-purple-600 to-indigo-700 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Gestion des Licences VPN</h2>
            <p className="text-purple-200 text-sm">Contrôle d'accès aux modules Druide Omega</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
          {Object.entries(STATUS_CONFIG).slice(0, 4).map(([status, config]) => {
            const count = licenses.filter(l => l.status === status).length;
            return (
              <div key={status} className="bg-white/10 rounded-lg p-2 text-center">
                <div className="text-xl font-bold">{count}</div>
                <div className="text-xs text-purple-200">{config.label}</div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* VPN Channels */}
      <Card className="p-4">
        <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <Key className="w-5 h-5 text-purple-600" />
          Canaux VPN Disponibles
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {VPN_CHANNELS.map(channel => {
            const Icon = channel.icon;
            return (
              <div key={channel.id} className={`p-3 rounded-lg bg-gradient-to-br ${channel.color} text-white text-center`}>
                <Icon className="w-5 h-5 mx-auto mb-1" />
                <div className="text-xs font-medium">{channel.name}</div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Licenses List */}
      <div className="space-y-3">
        {licenses.map(license => {
          const statusConfig = STATUS_CONFIG[license.status] || STATUS_CONFIG.active;
          const StatusIcon = statusConfig.icon;
          const availableActions = getAvailableActions(license);
          const channelInfo = VPN_CHANNELS.find(c => c.id === license.vpn_channel);

          return (
            <motion.div
              key={license.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className={`p-4 border-l-4 ${license.status === 'revoked' ? 'border-l-red-700 bg-red-50' : license.status === 'active' ? 'border-l-green-500' : 'border-l-slate-300'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${statusConfig.color}`}>
                      <StatusIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{getProductName(license.module_sku)}</h4>
                      <p className="text-xs text-slate-500">{license.module_sku}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge className={`${statusConfig.badgeColor} text-white text-xs`}>
                          {statusConfig.label}
                        </Badge>
                        {channelInfo && (
                          <Badge variant="outline" className="text-xs">
                            via {channelInfo.name}
                          </Badge>
                        )}
                        {license.last_status_change && (
                          <span className="text-xs text-slate-400">
                            {new Date(license.last_status_change).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      {license.status_reason && (
                        <p className="text-xs text-slate-600 mt-1 italic">"{license.status_reason}"</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setHistoryDialog({ open: true, license })}
                    >
                      <History className="w-4 h-4 mr-1" />
                      Détails
                    </Button>
                    
                    {availableActions.map(action => {
                      const ActionIcon = action.icon;
                      return (
                        <Button
                          key={action.id}
                          size="sm"
                          className={`${action.color} text-white`}
                          onClick={() => openActionDialog(action, license)}
                        >
                          <ActionIcon className="w-4 h-4 mr-1" />
                          <span className="hidden sm:inline">{action.label}</span>
                        </Button>
                      );
                    })}

                    {availableActions.length === 0 && (
                      <Badge className="bg-slate-200 text-slate-600">
                        <Ban className="w-3 h-3 mr-1" />
                        Aucune action
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Action Dialog */}
      <Dialog open={actionDialog.open} onOpenChange={(open) => setActionDialog({ ...actionDialog, open })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {actionDialog.action && <actionDialog.action.icon className="w-5 h-5" />}
              {actionDialog.action?.label} la licence
            </DialogTitle>
            <DialogDescription>
              Module: {actionDialog.license && getProductName(actionDialog.license.module_sku)}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Channel Selection */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Canal VPN utilisé
              </label>
              <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VPN_CHANNELS.map(channel => {
                    const Icon = channel.icon;
                    return (
                      <SelectItem key={channel.id} value={channel.id}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {channel.name}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Reason */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Raison de l'action
              </label>
              <Input
                placeholder="Ex: Demande client, non-paiement, violation..."
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
              />
            </div>

            {/* Admin Notes */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Notes administratives
              </label>
              <Textarea
                placeholder="Notes internes..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
              />
            </div>

            {/* Warning for revoke */}
            {actionDialog.action?.id === "revoke" && (
              <div className="p-3 bg-red-100 border border-red-300 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-800">Action irréversible</p>
                    <p className="text-xs text-red-700">
                      La révocation est permanente. Aucune action ne sera possible après.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog({ open: false, action: null, license: null })}>
              Annuler
            </Button>
            <Button
              className={actionDialog.action?.color || "bg-purple-600"}
              onClick={executeAction}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                actionDialog.action && <actionDialog.action.icon className="w-4 h-4 mr-2" />
              )}
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={historyDialog.open} onOpenChange={(open) => setHistoryDialog({ ...historyDialog, open })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Détails de la licence</DialogTitle>
            <DialogDescription>
              {historyDialog.license && getProductName(historyDialog.license.module_sku)}
            </DialogDescription>
          </DialogHeader>

          {historyDialog.license && (
            <div className="space-y-3 py-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-500">SKU:</span>
                  <p className="font-medium">{historyDialog.license.module_sku}</p>
                </div>
                <div>
                  <span className="text-slate-500">Statut:</span>
                  <p className="font-medium">{STATUS_CONFIG[historyDialog.license.status]?.label}</p>
                </div>
                {historyDialog.license.purchase_date && (
                  <div>
                    <span className="text-slate-500">Achat:</span>
                    <p className="font-medium">{new Date(historyDialog.license.purchase_date).toLocaleDateString()}</p>
                  </div>
                )}
                {historyDialog.license.activation_date && (
                  <div>
                    <span className="text-slate-500">Activation:</span>
                    <p className="font-medium">{new Date(historyDialog.license.activation_date).toLocaleDateString()}</p>
                  </div>
                )}
                {historyDialog.license.expiry_date && (
                  <div>
                    <span className="text-slate-500">Expiration:</span>
                    <p className="font-medium">{new Date(historyDialog.license.expiry_date).toLocaleDateString()}</p>
                  </div>
                )}
                {historyDialog.license.vpn_channel && (
                  <div>
                    <span className="text-slate-500">Canal VPN:</span>
                    <p className="font-medium">{VPN_CHANNELS.find(c => c.id === historyDialog.license.vpn_channel)?.name}</p>
                  </div>
                )}
              </div>
              
              {historyDialog.license.status_reason && (
                <div className="p-3 bg-slate-100 rounded-lg">
                  <span className="text-xs text-slate-500">Raison:</span>
                  <p className="text-sm">{historyDialog.license.status_reason}</p>
                </div>
              )}
              
              {historyDialog.license.admin_notes && (
                <div className="p-3 bg-amber-50 rounded-lg">
                  <span className="text-xs text-amber-600">Notes admin:</span>
                  <p className="text-sm">{historyDialog.license.admin_notes}</p>
                </div>
              )}

              {historyDialog.license.usage_stats && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <span className="text-xs text-blue-600">Statistiques:</span>
                  <div className="grid grid-cols-2 gap-2 mt-1 text-sm">
                    <div>Accès: {historyDialog.license.usage_stats.total_accesses || 0}</div>
                    <div>Heures: {historyDialog.license.usage_stats.hours_used || 0}h</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}