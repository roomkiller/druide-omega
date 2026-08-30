import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, ShieldAlert } from "lucide-react";

/**
 * État réel de l'autorisation micro du navigateur.
 * Si l'état est « denied », Chrome n'affiche plus jamais d'invite : c'est la
 * cause la plus fréquente d'un micro qui semble introuvable en production.
 */
export default function MicPermissionCard({ onRequest }) {
  const [state, setState] = useState('unknown');

  useEffect(() => {
    let perm;
    const sync = () => setState(perm.state);
    navigator.permissions?.query({ name: 'microphone' })
      .then((p) => { perm = p; sync(); p.onchange = sync; })
      .catch(() => setState('unknown'));
    return () => { if (perm) perm.onchange = null; };
  }, []);

  if (state === 'granted') return null;

  const blocked = state === 'denied';

  return (
    <Card className={blocked ? "p-4 bg-red-50 border-red-300" : "p-4 bg-violet-50 border-violet-200"}>
      <div className="flex flex-wrap items-center gap-3">
        {blocked
          ? <ShieldAlert className="w-5 h-5 text-red-600" />
          : <Mic className="w-5 h-5 text-violet-600" />}
        <p className={blocked ? "text-sm text-red-800 flex-1" : "text-sm text-violet-900 flex-1"}>
          {blocked
            ? "Le micro est bloqué pour ce site : le navigateur ne demandera plus l'autorisation. Clique sur l'icône à gauche de l'adresse (cadenas ou curseurs) → Microphone → Autoriser, puis recharge la page."
            : "Le micro n'est pas encore autorisé pour ce site. Autorise-le une fois, puis ouvre la salle."}
        </p>
        {!blocked && (
          <Button size="sm" onClick={onRequest} className="bg-violet-600 hover:bg-violet-700">
            Autoriser le micro
          </Button>
        )}
      </div>
    </Card>
  );
}