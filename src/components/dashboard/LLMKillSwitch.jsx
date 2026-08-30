import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Power, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { isLLMBlocked, setLLMBlocked, subscribeLLMKillSwitch } from '@/lib/llmKillSwitch';
import { useLanguage } from '@/components/utils/LanguageContext';
import { useIntegrationRelay } from '@/components/system/IntegrationRelay';

/**
 * Coupe-circuit des appels LLM. Quand ACTIF, tous les appels LLM
 * (InvokeLLM, DeepSeek, druideCore) sont bloqués à la source pour
 * stopper la consommation de crédits d'intégration.
 */
export default function LLMKillSwitch() {
  const { language } = useLanguage();
  const en = language === 'en';
  const [blocked, setBlocked] = useState(isLLMBlocked());

  useEffect(() => {
    const unsub = subscribeLLMKillSwitch(setBlocked);
    return unsub;
  }, []);

  // Fusion avec le relais d'intégration : un seul interrupteur coupe/rétablit
  // à la fois les appels LLM et le relais des fonctions d'intégration.
  const { setRelay } = useIntegrationRelay();

  const toggle = () => {
    const next = !blocked;
    setLLMBlocked(next);
    setRelay(!next);
  };

  return (
    <Card className={`p-5 border-2 transition-all ${blocked ? 'border-red-400 bg-red-50' : 'border-emerald-300 bg-emerald-50'}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${blocked ? 'bg-red-100' : 'bg-emerald-100'}`}>
            {blocked ? <ShieldAlert className="w-6 h-6 text-red-600" /> : <CheckCircle2 className="w-6 h-6 text-emerald-600" />}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-slate-900">
                {en ? 'LLM Kill Switch' : 'Coupe-circuit LLM'}
              </h3>
              <Badge className={blocked ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'}>
                {blocked ? (en ? 'ACTIVE — Blocked' : 'ACTIF — Bloqué') : (en ? 'Inactive' : 'Inactif')}
              </Badge>
            </div>
            <p className="text-sm text-slate-600">
              {blocked
                ? (en ? 'All LLM calls are blocked. Integration credits are preserved.' : 'Tous les appels LLM sont bloqués. Vos crédits d\'intégration sont préservés.')
                : (en ? 'LLM calls are active. Toggle to instantly stop credit consumption.' : 'Les appels LLM sont actifs. Activez pour stopper instantanément la consommation de crédits.')}
            </p>
          </div>
        </div>
        <Button
          onClick={toggle}
          variant={blocked ? 'default' : 'outline'}
          className={blocked
            ? 'bg-red-600 hover:bg-red-700 text-white flex-shrink-0'
            : 'border-red-400 text-red-600 hover:bg-red-50 flex-shrink-0'
          }
        >
          <Power className="w-4 h-4 mr-2" />
          {blocked ? (en ? 'Reactivate LLM' : 'Réactiver LLM') : (en ? 'Block LLM' : 'Bloquer LLM')}
        </Button>
      </div>
    </Card>
  );
}