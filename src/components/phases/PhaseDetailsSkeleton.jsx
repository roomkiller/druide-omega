import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function PhaseDetailsSkeleton() {
  return (
    <Card className="bg-slate-800 border-slate-700 animate-pulse">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="h-4 bg-slate-700 rounded w-24 mb-2" />
            <div className="h-6 bg-slate-700 rounded w-48 mb-2" />
            <div className="h-4 bg-slate-700 rounded w-full" />
          </div>
          <div className="text-right">
            <div className="h-8 bg-slate-700 rounded w-16 mb-2" />
            <div className="h-3 bg-slate-700 rounded w-12" />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}