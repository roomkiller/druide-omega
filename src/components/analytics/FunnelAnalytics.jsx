/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Funnel Analytics                                           ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, Users, ShoppingCart, CheckCircle } from "lucide-react";

export default function FunnelAnalytics() {
  const { data: events = [] } = useQuery({
    queryKey: ['funnelEvents'],
    queryFn: () => base44.entities.AnalyticsEvent.list('-timestamp', 1000)
  });

  // Shop funnel
  const shopVisits = events.filter(e => e.page_name === 'Shop').length;
  const moduleViews = events.filter(e => e.feature_name === 'module_view').length;
  const purchaseIntents = events.filter(e => e.action === 'checkout_initiated').length;
  const completedPurchases = events.filter(e => e.feature_name === 'module_purchase').length;

  const conversionRate = shopVisits > 0 ? ((completedPurchases / shopVisits) * 100).toFixed(2) : 0;

  // Engagement funnel
  const signups = events.filter(e => e.event_type === 'session_start').length;
  const firstMessages = events.filter(e => e.event_type === 'message_sent').length;
  const kbUploads = events.filter(e => e.event_type === 'kb_create').length;

  const stages = [
    { 
      label: "Visites boutique", 
      count: shopVisits, 
      icon: Users,
      color: "text-blue-600"
    },
    { 
      label: "Vues modules", 
      count: moduleViews, 
      icon: ShoppingCart,
      color: "text-purple-600",
      dropoff: shopVisits > 0 ? (((shopVisits - moduleViews) / shopVisits) * 100).toFixed(1) : 0
    },
    { 
      label: "Initiés checkout", 
      count: purchaseIntents, 
      icon: TrendingDown,
      color: "text-orange-600",
      dropoff: moduleViews > 0 ? (((moduleViews - purchaseIntents) / moduleViews) * 100).toFixed(1) : 0
    },
    { 
      label: "Achats complétés", 
      count: completedPurchases, 
      icon: CheckCircle,
      color: "text-green-600",
      dropoff: purchaseIntents > 0 ? (((purchaseIntents - completedPurchases) / purchaseIntents) * 100).toFixed(1) : 0
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Entonnoir d'achat</h3>
        
        <div className="space-y-4">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            return (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${stage.color}`} />
                    <span className="font-semibold text-slate-900">{stage.label}</span>
                  </div>
                  <Badge variant="outline">{stage.count}</Badge>
                </div>
                
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-full ${stage.color.replace('text-', 'bg-')}`}
                    style={{ width: `${(stage.count / shopVisits) * 100}%` }}
                  />
                </div>
                
                {stage.dropoff && (
                  <p className="text-xs text-red-600 mt-1">-{stage.dropoff}% de perte</p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-purple-50 rounded-lg">
          <p className="text-sm text-purple-900">
            <strong>Taux de conversion:</strong> {conversionRate}%
          </p>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Engagement utilisateurs</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-600">Inscriptions</span>
            <span className="font-bold">{signups}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Premier message envoyé</span>
            <span className="font-bold">{firstMessages}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Upload KB</span>
            <span className="font-bold">{kbUploads}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}