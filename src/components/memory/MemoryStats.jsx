import React from "react";
import { motion } from "framer-motion";
import { Brain, Star, Database, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MemoryStats({ memories }) {
  const totalMemories = memories.length;
  const averageImportance = memories.length > 0 
    ? (memories.reduce((sum, m) => sum + m.importance, 0) / memories.length).toFixed(1)
    : 0;
  const totalAccesses = memories.reduce((sum, m) => sum + (m.access_count || 0), 0);
  const highImportanceCount = memories.filter(m => m.importance >= 7).length;

  const stats = [
    {
      title: "Mémoires totales",
      value: totalMemories,
      icon: Database,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50"
    },
    {
      title: "Importance moyenne",
      value: `${averageImportance}/10`,
      icon: Star,
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Accès total",
      value: totalAccesses,
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50"
    },
    {
      title: "Haute priorité",
      value: highImportanceCount,
      icon: Brain,
      color: "from-purple-500 to-indigo-500",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="border-slate-200 hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-4 h-4 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} style={{WebkitTextFillColor: 'transparent'}} />
                </div>
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}