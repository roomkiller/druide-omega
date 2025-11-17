/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Evolution History Display                                  ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function EvolutionHistory({ history }) {
  if (!history || history.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-slate-500">Aucun événement d'évolution enregistré</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {[...history].reverse().map((event, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 flex-1">
                <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                  {event.from_stage}
                </Badge>
                <ArrowRight className="w-4 h-4 text-slate-400" />
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                  {event.to_stage}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Clock className="w-4 h-4" />
                {format(new Date(event.timestamp), 'dd MMM yyyy HH:mm', { locale: fr })}
              </div>
            </div>

            <div className="mt-3">
              <p className="text-sm font-semibold text-slate-700 mb-2">
                Capacités débloquées:
              </p>
              <div className="flex flex-wrap gap-2">
                {event.unlocked_capabilities.map(cap => (
                  <Badge key={cap} variant="outline" className="text-xs">
                    ✨ {cap.replace(/_/g, ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}