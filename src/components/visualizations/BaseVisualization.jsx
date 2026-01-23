/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Base Visualization Component (Refactored)                  ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useRef, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Maximize2, Download } from "lucide-react";
import { getErrorLogger } from '@/components/system/ErrorLogger';

/**
 * Base abstraite pour visualisations
 * Gère état commun, lifecycle, export
 */
export function BaseVisualization({ 
  title, 
  data, 
  renderFunction,
  type = 'chart',
  options = {},
  onError,
  children 
}) {
  const containerRef = useRef(null);
  const logger = getErrorLogger();

  useEffect(() => {
    if (!data || !renderFunction) return;

    try {
      const startTime = Date.now();
      renderFunction(containerRef.current, data, options);
      
      // Log performance
      const renderTime = Date.now() - startTime;
      if (renderTime > 1000) {
        logger.logPerformance(`render_${type}`, renderTime);
      }
    } catch (error) {
      logger.log(error, {
        category: 'visualization',
        component: type,
        severity: 'error'
      });
      
      if (onError) onError(error);
    }
  }, [data, renderFunction, options, type]);

  const exportImage = () => {
    try {
      const element = containerRef.current;
      // Placeholder - implémentation réelle avec html2canvas
      console.log('Export not implemented yet');
    } catch (error) {
      logger.log(error, {
        category: 'export',
        component: type
      });
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-900">{title}</h3>
          {data && <Badge variant="secondary">{Array.isArray(data) ? data.length : 'N/A'}</Badge>}
        </div>
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={exportImage}>
            <Download className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost">
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div ref={containerRef} className="w-full">
        {children}
      </div>
    </Card>
  );
}

/**
 * Hook pour optimisation rendu
 */
export function useVisualizationOptimization(data, dependencies = []) {
  const [optimizedData, setOptimizedData] = React.useState(data);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Debounce pour grands datasets
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(() => {
      if (Array.isArray(data) && data.length > 1000) {
        // Downsampling pour performance
        const step = Math.ceil(data.length / 1000);
        setOptimizedData(data.filter((_, i) => i % step === 0));
      } else {
        setOptimizedData(data);
      }
    }, 300);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [data, ...dependencies]);

  return optimizedData;
}