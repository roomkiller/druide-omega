import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Clock, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export default function PhaseHistoryPanel({ phaseId }) {
  const { data: history = [] } = useQuery({
    queryKey: ["phaseHistory", phaseId],
    queryFn: () =>
      base44.entities.PhaseHistory.filter(
        { phase_id: phaseId },
        "-timestamp",
        50
      ),
  });

  const getChangeIcon = (type) => {
    const icons = {
      status: "📊",
      progress: "📈",
      milestone: "🎯",
      dependency: "🔗",
      description: "📝",
    };
    return icons[type] || "📌";
  };

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {history.length === 0 ? (
        <p className="text-gray-400 text-sm">Aucun changement enregistré</p>
      ) : (
        history.map((entry, idx) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-slate-700/50 rounded p-3 border border-slate-600"
          >
            <div className="flex gap-3">
              <div className="text-xl">{getChangeIcon(entry.change_type)}</div>
              <div className="flex-1 text-sm">
                <p className="text-white font-medium">{entry.change_description}</p>
                {entry.old_value && entry.new_value && (
                  <p className="text-gray-400 text-xs mt-1">
                    {entry.old_value} → {entry.new_value}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-2 text-gray-500 text-xs">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDistanceToNow(new Date(entry.timestamp), {
                      locale: fr,
                      addSuffix: true,
                    })}
                  </span>
                  {entry.changed_by_email && (
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {entry.changed_by_email}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}