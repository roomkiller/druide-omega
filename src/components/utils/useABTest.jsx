/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - A/B Testing Hook                                           ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

export function useABTest(testName) {
  const [variant, setVariant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const assignVariant = async () => {
      try {
        const tests = await base44.entities.ABTest.filter({ 
          test_name: testName, 
          status: 'active' 
        });

        if (tests.length === 0) {
          setVariant('control');
          setLoading(false);
          return;
        }

        const test = tests[0];
        
        // Check localStorage for existing assignment
        const storageKey = `ab_test_${testName}`;
        const existing = localStorage.getItem(storageKey);
        
        if (existing) {
          setVariant(existing);
          setLoading(false);
          return;
        }

        // Assign variant based on traffic percentage
        const random = Math.random() * 100;
        let cumulative = 0;
        let assignedVariant = 'control';

        for (const v of test.variants) {
          cumulative += v.traffic_percentage;
          if (random <= cumulative) {
            assignedVariant = v.id;
            break;
          }
        }

        localStorage.setItem(storageKey, assignedVariant);
        setVariant(assignedVariant);

        // Track assignment
        await base44.entities.AnalyticsEvent.create({
          event_type: 'user_flow',
          feature_name: 'ab_test',
          action: 'variant_assigned',
          metadata: {
            test_name: testName,
            variant: assignedVariant
          },
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        console.error('A/B test error:', error);
        setVariant('control');
      } finally {
        setLoading(false);
      }
    };

    assignVariant();
  }, [testName]);

  const trackConversion = async (metricName, value = 1) => {
    try {
      await base44.entities.AnalyticsEvent.create({
        event_type: 'user_flow',
        feature_name: 'ab_test_conversion',
        action: metricName,
        metadata: {
          test_name: testName,
          variant,
          value
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Conversion tracking error:', error);
    }
  };

  return { variant, loading, trackConversion };
}