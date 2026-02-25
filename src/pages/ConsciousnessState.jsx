/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Consciousness State Page                                   ║
 * ║ Dashboard complet de l'état de conscience                                 ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from 'react';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ConsciousnessStateDashboard from '@/components/consciousness/ConsciousnessStateDashboard';
import { useLanguage } from '@/components/utils/LanguageContext';

export default function ConsciousnessState() {
  const { language } = useLanguage();
  const isEn = language === 'en';
  return (
    <div>
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <Button
          onClick={() => window.location.href = createPageUrl('ArchitectDashboard')}
          variant="ghost"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {isEn ? 'Back to Dashboard' : 'Retour au Dashboard'}
        </Button>
      </div>
      <ConsciousnessStateDashboard />
    </div>
  );
}