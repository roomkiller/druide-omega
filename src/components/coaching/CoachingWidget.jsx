/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Coaching Widget (Compact Display)                          ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, TrendingUp, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { createPageUrl } from "@/utils";
import { safeNumber } from "@/components/utils/SafeNumber";

export default function CoachingWidget() {
  const { data: sessions = [] } = useQuery({
    queryKey: ["coaching_sessions"],
    queryFn: async () => {
      return await base44.entities.AICoachingSession.list("-created_date", 1);
    }
  });

  const latestSession = sessions[0];

  if (!latestSession) return null;

  const topInsight = latestSession.insights?.[0];
  if (!topInsight) return null;

  const engagementScore = safeNumber(latestSession.engagement_score, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="p-4 sm:p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-900">Coach IA</h3>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <Badge variant="secondary" className="text-xs">
                  {engagementScore}%
                </Badge>
              </div>
            </div>
            
            {topInsight && (
              <>
                <div className="mb-2">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      topInsight.priority === "urgent" ? "bg-red-50 border-red-300" :
                      topInsight.priority === "high" ? "bg-orange-50 border-orange-300" :
                      "bg-blue-50 border-blue-300"
                    }`}
                  >
                    {topInsight.priority}
                  </Badge>
                </div>
                <p className="text-sm font-medium text-slate-900 mb-1">{topInsight.title}</p>
                <p className="text-xs text-slate-600 mb-3 line-clamp-2">{topInsight.description}</p>
              </>
            )}

            <Button
              size="sm"
              onClick={() => window.location.href = createPageUrl("AICoach")}
              className="bg-emerald-600 hover:bg-emerald-700 text-xs"
            >
              Voir Session Complète
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}