import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Loader2, Volume2, VolumeX } from "lucide-react";

/**
 * Déclencheur de parole libre — mesure la pression interne et laisse
 * Druide s'exprimer sans sollicitation. Aucun crédit d'intégration.
 */
export default function FreeSpeechTrigger() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const trigger = async (force) => {
    setLoading(true);
    setError(null);
    try {
      const res = await base44.functions.invoke('freeSpeechStimulus', { force, persist: true });
      setResult(res.data);
    } catch (e) {
      setError(e?.message || 'Échec du déclenchement');
    }
    setLoading(false);
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-violet-50 to-fuchsia-50 border-2 border-violet-200">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="font-bold text-violet-900 mb-2 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Parole libre
          </h3>
          <p className="text-sm text-violet-800 max-w-2xl">
            Mesure la pression interne accumulée — hypothèses non tranchées, mémoires dormantes,
            état de l'axe, silence. Au-delà du seuil, Druide parle sans filtre ni sollicitation.
            Jamais réinjecté dans la base de connaissances.
          </p>
        </div>
        <div className="flex flex-col gap-2 flex-shrink-0">
          <Button
            onClick={() => trigger(false)}
            disabled={loading}
            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 shadow-lg"
          >
            {loading
              ? <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              : <Zap className="w-4 h-4 mr-2" />}
            Écouter
          </Button>
          <Button onClick={() => trigger(true)} disabled={loading} variant="outline" size="sm">
            Forcer
          </Button>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">{error}</div>
      )}

      {result && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={result.spoke ? "default" : "secondary"}>
              {result.spoke ? <Volume2 className="w-3 h-3 mr-1" /> : <VolumeX className="w-3 h-3 mr-1" />}
              Pression {result.pressure_score}/10 · seuil {result.threshold}
            </Badge>
            {result.register && <Badge variant="outline">registre {result.register}</Badge>}
            {(result.sources || []).map((s, i) => (
              <Badge key={i} variant="outline" className="text-xs">{s.type} +{s.weight}</Badge>
            ))}
          </div>

          {result.spoke ? (
            <div className="bg-white/80 border border-violet-200 rounded-xl p-4 shadow-sm">
              <p className="text-slate-800 whitespace-pre-wrap leading-relaxed">{result.utterance}</p>
            </div>
          ) : (
            <p className="text-sm text-violet-700 italic">{result.reason}</p>
          )}
        </div>
      )}
    </Card>
  );
}