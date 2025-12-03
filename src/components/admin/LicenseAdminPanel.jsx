/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Admin License Management Panel                             ║
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
  Key, Shield, Play, Pause, StopCircle, XCircle, Ban, RefreshCw,
  Mail, Smartphone, Globe, Code, UserCog, AlertTriangle, Search,
  CheckCircle, Clock, Loader2, Download, Filter, Users, BarChart3
} from "lucide-react";
import { motion } from "framer-motion";

const VPN_CHANNELS = [
  { id: "email", name: "Email", icon: Mail },
  { id: "whatsapp", name: "WhatsApp", icon: Smartphone },
  { id: "portal", name: "Portail Web", icon: Globe },
  { id: "api", name: "API Enterprise", icon: Code },
  { id: "admin", name: "Admin Direct", icon: UserCog }
];

const STATUS_CONFIG = {
  active: { label: "Actif", color: "bg-green-500", icon: CheckCircle },
  paused: { label: "En pause", color: "bg-yellow-500", icon: Pause },
  suspended: { label: "Suspendu", color: "bg-orange-500", icon: StopCircle },
  expired: { label: "Expiré", color: "bg-slate-500", icon: Clock },
  cancelled: { label: "Annulé", color: "bg-red-500", icon: XCircle },
  revoked: { label: "Révoqué", color: "bg-red-700", icon: Ban }
};

export default function LicenseAdminPanel() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionDialog, setActionDialog] = useState({ open: false, license: null, action: null });
  const [selectedChannel, setSelectedChannel] = useState("admin");
  const [actionReason, setActionReason] = useState("");
  
  const queryClient = useQueryClient();

  const { data: licenses = [], isLoading } = useQuery({
    queryKey: ['admin-licenses'],
    queryFn: () => base44.entities.ModuleLicense.list('-created_date', 500)
  });

  const { data: products = [] } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => base44.entities.Product.list()
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }) => {
      return await base44.entities.ModuleLicense.update(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-licenses'] });
      setActionDialog({ open: false, license: null, action: null });
      setActionReason("");
    }
  });

  const getProductName = (sku) => {
    const product = products.find(p => (p.data?.sku || p.sku) === sku);
    return product?.data?.name || product?.name || sku;
  };

  const filteredLicenses = licenses.filter(license => {
    const data = license.data || license;
    const matchesSearch = 
      data.module_sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      license.created_by?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || data.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: licenses.length,
    active: licenses.filter(l => (l.data?.status || l.status) === 'active').length,
    paused: licenses.filter(l => (l.data?.status || l.status) === 'paused').length,
    suspended: licenses.filter(l => (l.data?.status || l.status) === 'suspended').length,
    revoked: licenses.filter(l => (l.data?.status || l.status) === 'revoked').length
  };

  const executeAction = async (newStatus) => {
    if (!actionDialog.license) return;
    
    await updateMutation.mutateAsync({
      id: actionDialog.license.id,
      updates: {
        status: newStatus,
        last_status_change: new Date().toISOString(),
        status_reason: actionReason,
        vpn_channel: selectedChannel
      }
    });
  };

  const exportLicenses = () => {
    const csv = [
      ["SKU", "Status", "User", "Purchase Date", "Channel", "Reason"].join(","),
      ...filteredLicenses.map(l => {
        const d = l.data || l;
        return [
          d.module_sku,
          d.status,
          l.created_by,
          d.purchase_date || l.created_date,
          d.vpn_channel || "N/A",
          d.status_reason || ""
        ].join(",");
      })
    ].join("\n");

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `licenses_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Total", value: stats.total, color: "from-purple-500 to-indigo-600" },
          { label: "Actives", value: stats.active, color: "from-green-500 to-emerald-600" },
          { label: "En pause", value: stats.paused, color: "from-yellow-500 to-orange-600" },
          { label: "Suspendues", value: stats.suspended, color: "from-orange-500 to-red-600" },
          { label: "Révoquées", value: stats.revoked, color: "from-red-600 to-red-800" }
        ].map((stat, idx) => (
          <Card key={idx} className={`p-4 bg-gradient-to-br ${stat.color} text-white`}>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs opacity-80">{stat.label}</div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Rechercher par SKU ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                <SelectItem key={key} value={key}>{config.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportLicenses}>
            <Download className="w-4 h-4 mr-2" />
            Exporter CSV
          </Button>
        </div>
      </Card>

      {/* Licenses List */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="text-left p-3 text-xs font-semibold text-slate-600">Module</th>
                <th className="text-left p-3 text-xs font-semibold text-slate-600">Utilisateur</th>
                <th className="text-left p-3 text-xs font-semibold text-slate-600">Statut</th>
                <th className="text-left p-3 text-xs font-semibold text-slate-600">Canal</th>
                <th className="text-left p-3 text-xs font-semibold text-slate-600">Date</th>
                <th className="text-right p-3 text-xs font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLicenses.map((license, idx) => {
                const data = license.data || license;
                const statusConfig = STATUS_CONFIG[data.status] || STATUS_CONFIG.active;
                const StatusIcon = statusConfig.icon;
                const channelInfo = VPN_CHANNELS.find(c => c.id === data.vpn_channel);

                return (
                  <motion.tr
                    key={license.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.02 }}
                    className="hover:bg-slate-50"
                  >
                    <td className="p-3">
                      <div className="font-medium text-slate-900">{getProductName(data.module_sku)}</div>
                      <div className="text-xs text-slate-500">{data.module_sku}</div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm text-slate-700">{license.created_by}</div>
                    </td>
                    <td className="p-3">
                      <Badge className={`${statusConfig.color} text-white`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig.label}
                      </Badge>
                    </td>
                    <td className="p-3">
                      {channelInfo ? (
                        <Badge variant="outline" className="text-xs">
                          <channelInfo.icon className="w-3 h-3 mr-1" />
                          {channelInfo.name}
                        </Badge>
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="text-xs text-slate-600">
                        {new Date(data.purchase_date || license.created_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-end gap-1">
                        {data.status !== 'revoked' && (
                          <>
                            {data.status !== 'active' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => setActionDialog({ open: true, license, action: 'activate' })}
                              >
                                <Play className="w-4 h-4" />
                              </Button>
                            )}
                            {data.status === 'active' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                                onClick={() => setActionDialog({ open: true, license, action: 'pause' })}
                              >
                                <Pause className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                              onClick={() => setActionDialog({ open: true, license, action: 'suspend' })}
                            >
                              <StopCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => setActionDialog({ open: true, license, action: 'revoke' })}
                            >
                              <Ban className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredLicenses.length === 0 && (
          <div className="p-12 text-center">
            <Key className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">Aucune licence trouvée</p>
          </div>
        )}
      </Card>

      {/* Action Dialog */}
      <Dialog open={actionDialog.open} onOpenChange={(open) => setActionDialog({ ...actionDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {actionDialog.action === 'activate' && <Play className="w-5 h-5 text-green-600" />}
              {actionDialog.action === 'pause' && <Pause className="w-5 h-5 text-yellow-600" />}
              {actionDialog.action === 'suspend' && <StopCircle className="w-5 h-5 text-orange-600" />}
              {actionDialog.action === 'revoke' && <Ban className="w-5 h-5 text-red-600" />}
              {actionDialog.action === 'activate' && "Activer la licence"}
              {actionDialog.action === 'pause' && "Mettre en pause"}
              {actionDialog.action === 'suspend' && "Suspendre la licence"}
              {actionDialog.action === 'revoke' && "Révoquer définitivement"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Canal VPN</label>
              <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VPN_CHANNELS.map(channel => (
                    <SelectItem key={channel.id} value={channel.id}>
                      <div className="flex items-center gap-2">
                        <channel.icon className="w-4 h-4" />
                        {channel.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Raison</label>
              <Textarea
                placeholder="Raison de l'action..."
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
              />
            </div>

            {actionDialog.action === 'revoke' && (
              <div className="p-3 bg-red-100 border border-red-300 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-red-800">Action irréversible</p>
                    <p className="text-xs text-red-700">Cette action ne peut pas être annulée.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog({ open: false, license: null, action: null })}>
              Annuler
            </Button>
            <Button
              className={
                actionDialog.action === 'activate' ? 'bg-green-600 hover:bg-green-700' :
                actionDialog.action === 'pause' ? 'bg-yellow-600 hover:bg-yellow-700' :
                actionDialog.action === 'suspend' ? 'bg-orange-600 hover:bg-orange-700' :
                'bg-red-600 hover:bg-red-700'
              }
              onClick={() => {
                const statusMap = {
                  activate: 'active',
                  pause: 'paused',
                  suspend: 'suspended',
                  revoke: 'revoked'
                };
                executeAction(statusMap[actionDialog.action]);
              }}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}