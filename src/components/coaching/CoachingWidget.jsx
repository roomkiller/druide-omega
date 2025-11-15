/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Coaching Widget (Compact)                                  ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { createPageUrl } from "@/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, ArrowRight, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function CoachingWidget() {
  const { data: sessions = [] } = useQuery({
    queryKey: ["coaching-sessions"],
    queryFn: () => base44.entities.AICoachingSession.list("-session_date", 1),
    initialData: []
  });

  const latestSession = sessions[0];
  if (!latestSession) return null;

  const topInsight = latestSession.insights?.find(i => i.priority === "high") || latestSession.insights?.[0];
  if (!topInsight) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-sm font-semibold text-slate-900">Coach IA</h4>
              <Badge variant="outline" className="text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                {latestSession.engagement_score}%
              </Badge>
            </div>
            <p className="text-xs text-slate-700 font-medium mb-1">{topInsight.title}</p>
            <p className="text-xs text-slate-600 mb-3">{topInsight.description}</p>
            <Button
              size="sm"
              onClick={() => window.location.href = createPageUrl("AICoach")}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs h-8"
            >
              Voir le coaching complet
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}