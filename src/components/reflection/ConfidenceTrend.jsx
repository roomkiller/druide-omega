import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { format } from "date-fns";

/**
 * Courbe de confiance dans l'ordre chronologique — on voit si Druide gagne
 * en assurance à mesure que sa matière s'accumule.
 */
export default function ConfidenceTrend({ reflections }) {
  const data = [...reflections]
    .reverse()
    .filter((r) => typeof r.confidence === "number")
    .map((r, i) => ({
      i: i + 1,
      confiance: r.confidence,
      appuis: r.support || 0,
      date: r.created_date ? format(new Date(r.created_date), "d MMM HH:mm") : ""
    }));

  if (data.length < 3) return null;

  return (
    <Card className="rounded-xl border-slate-200 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
      <CardContent className="p-5">
        <p className="text-sm font-medium text-slate-700 mb-4">
          Évolution de la confiance et des appuis
        </p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} hide={data.length > 12} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 8px 24px rgba(15,23,42,0.08)"
                }}
              />
              <Line type="monotone" dataKey="confiance" stroke="#818cf8" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="appuis" stroke="#6ee7b7" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}