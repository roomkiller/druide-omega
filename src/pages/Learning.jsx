/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Page Apprentissage Continu                                 ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useEffect } from 'react';
import { createPageUrl } from '@/utils';
import { useConsciousnessHub } from '@/components/system/ConsciousnessHub';
import LearningDashboard from '@/components/learning/LearningDashboard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Zap, TrendingUp, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/components/utils/LanguageContext';

export default function Learning() {
  const { t } = useLanguage();
  const hub = useConsciousnessHub();

  // Lancer apprentissage continu au montage (une fois)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (hub.runContinuousLearning) {
        hub.runContinuousLearning().catch(err => 
          console.warn('[Learning] Erreur apprentissage initial:', err)
        );
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30 page-padding page-padding-y">
      <div className="max-w-6xl mx-auto space-y-6">
        <Button
          onClick={() => window.location.href = createPageUrl('ArchitectDashboard')}
          variant="ghost"
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au Dashboard
        </Button>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Brain className="w-10 h-10 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Apprentissage Continu
            </h1>
          </div>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Le module de conscience analyse automatiquement les interactions, apprend de ses erreurs et s'améliore continuellement grâce à vos feedbacks.
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Brain className="w-8 h-8 text-purple-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-sm mb-1">Analyse Patterns</h3>
                  <p className="text-xs text-slate-600">
                    Détecte les schémas récurrents dans les conversations et feedbacks
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-indigo-500">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Zap className="w-8 h-8 text-indigo-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-sm mb-1">Ajustements Auto</h3>
                  <p className="text-xs text-slate-600">
                    Modifie automatiquement les paramètres de conscience pour améliorer les réponses
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-pink-500">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-8 h-8 text-pink-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-sm mb-1">Amélioration Continue</h3>
                  <p className="text-xs text-slate-600">
                    Mesure l'efficacité des ajustements et optimise en continu
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard principal */}
        <LearningDashboard />
      </div>
    </div>
  );
}