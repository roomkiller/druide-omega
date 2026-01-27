/**
 * Safe wrapper for Recharts to prevent SSR/build issues
 */

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

export default function SafeChart({ children, fallback = null, minHeight = 200 }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return fallback || (
      <Card className="p-6 flex items-center justify-center" style={{ minHeight }}>
        <div className="text-slate-400 text-sm">Chargement du graphique...</div>
      </Card>
    );
  }

  return <>{children}</>;
}