/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Billing Dashboard                                          ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/utils/LanguageContext";
import { motion } from "framer-motion";
import {
  CreditCard,
  FileText,
  Download,
  ExternalLink,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle,
  XCircle
} from "lucide-react";

export default function Billing() {
  const { language } = useLanguage();
  const queryClient = useQueryClient();

  const { data: licenses = [] } = useQuery({
    queryKey: ['licenses'],
    queryFn: () => base44.entities.ModuleLicense.list('-created_date')
  });

  const { data: invoices = [] } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const response = await base44.functions.invoke('stripeBilling', { action: 'invoices' });
      return response.data.invoices || [];
    }
  });

  const portalMutation = useMutation({
    mutationFn: async () => {
      const response = await base44.functions.invoke('stripeBilling', { action: 'portal' });
      return response.data;
    },
    onSuccess: (data) => {
      window.location.href = data.url;
    }
  });

  const statusConfig = {
    active: { label: 'Active', color: 'bg-green-100 text-green-700', icon: CheckCircle },
    suspended: { label: 'Suspended', color: 'bg-orange-100 text-orange-700', icon: AlertCircle },
    revoked: { label: 'Revoked', color: 'bg-red-100 text-red-700', icon: XCircle },
    expired: { label: 'Expired', color: 'bg-gray-100 text-gray-700', icon: XCircle }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 overflow-hidden">
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 py-4 sm:py-6 flex-shrink-0">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {language === 'en' ? 'Billing & Subscriptions' : 'Facturation & Abonnements'}
                </h1>
                <p className="text-sm sm:text-base text-slate-600">
                  {language === 'en' ? 'Manage your licenses and payments' : 'Gérez vos licences et paiements'}
                </p>
              </div>
            </div>
            <Button onClick={() => portalMutation.mutate()} disabled={portalMutation.isPending}>
              <ExternalLink className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Billing Portal' : 'Portail Facturation'}
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
          {/* Licences Actives */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              {language === 'en' ? 'Active Licenses' : 'Licences Actives'}
            </h2>

            <div className="grid gap-4">
              {licenses.map((license, idx) => {
                const StatusIcon = statusConfig[license.status]?.icon || CheckCircle;
                const isExpiringSoon = license.expiration_date && 
                  new Date(license.expiration_date) - new Date() < 7 * 24 * 60 * 60 * 1000;

                return (
                  <motion.div
                    key={license.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-lg font-semibold text-slate-900">{license.module_name}</h3>
                            <Badge className={statusConfig[license.status]?.color}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {statusConfig[license.status]?.label}
                            </Badge>
                            <Badge variant="outline">
                              {license.license_type}
                            </Badge>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-3 text-sm text-slate-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {language === 'en' ? 'Activated' : 'Activée'}: {new Date(license.activation_date).toLocaleDateString()}
                              </span>
                            </div>
                            {license.expiration_date && (
                              <div className={`flex items-center gap-2 ${isExpiringSoon ? 'text-orange-600 font-semibold' : ''}`}>
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {language === 'en' ? 'Expires' : 'Expire'}: {new Date(license.expiration_date).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4" />
                              <span>
                                {license.purchase_details?.price_paid?.toFixed(2)} {license.purchase_details?.currency?.toUpperCase()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-500">
                                {language === 'en' ? 'Used' : 'Utilisée'}: {license.usage_count || 0} {language === 'en' ? 'times' : 'fois'}
                              </span>
                            </div>
                          </div>

                          {isExpiringSoon && license.status === 'active' && (
                            <div className="mt-3 p-2 bg-orange-50 rounded border border-orange-200 text-sm text-orange-700">
                              {language === 'en' ? '⚠️ Expiring soon! Renew to keep access.' : '⚠️ Expire bientôt ! Renouvelez pour garder l\'accès.'}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}

              {licenses.length === 0 && (
                <Card className="p-12 text-center">
                  <CreditCard className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {language === 'en' ? 'No licenses yet' : 'Aucune licence'}
                  </h3>
                  <p className="text-slate-600 mb-4">
                    {language === 'en' ? 'Purchase modules to get started' : 'Achetez des modules pour commencer'}
                  </p>
                  <Button onClick={() => window.location.href = '/Shop'}>
                    {language === 'en' ? 'Browse Modules' : 'Explorer les Modules'}
                  </Button>
                </Card>
              )}
            </div>
          </div>

          {/* Factures */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              {language === 'en' ? 'Invoices' : 'Factures'}
            </h2>

            <div className="grid gap-3">
              {invoices.map((invoice, idx) => (
                <motion.div
                  key={invoice.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                >
                  <Card className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <FileText className="w-10 h-10 text-blue-600" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-slate-900">
                              {invoice.amount.toFixed(2)} {invoice.currency.toUpperCase()}
                            </span>
                            <Badge className={invoice.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}>
                              {invoice.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600">
                            {new Date(invoice.date).toLocaleDateString()} • {invoice.id}
                          </p>
                        </div>
                      </div>
                      {invoice.pdf_url && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(invoice.pdf_url, '_blank')}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          PDF
                        </Button>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}

              {invoices.length === 0 && (
                <Card className="p-8 text-center">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600">
                    {language === 'en' ? 'No invoices yet' : 'Aucune facture'}
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}