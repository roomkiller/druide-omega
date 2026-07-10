import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, KeyRound, AlertTriangle } from "lucide-react";

export default function VaultUnlock({ onUnlock, error, hasItems }) {
  const [passphrase, setPassphrase] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!passphrase) return;
    setBusy(true);
    await onUnlock(passphrase);
    setBusy(false);
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <Card className="border-2 border-purple-200 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Coffre verrouillé</h2>
          <p className="text-sm text-slate-600 mb-6">
            {hasItems
              ? "Entrez votre phrase secrète pour déchiffrer le contenu."
              : "Choisissez une phrase secrète. Elle chiffrera tout le contenu du coffre — sans elle, les données seront irrécupérables."}
          </p>
          <form onSubmit={submit} className="space-y-4">
            <Input
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="Phrase secrète"
              autoFocus
            />
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 justify-center">
                <AlertTriangle className="w-4 h-4" /> {error}
              </div>
            )}
            <Button type="submit" disabled={busy || !passphrase} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
              <KeyRound className="w-4 h-4 mr-2" />
              {busy ? "Déverrouillage..." : "Déverrouiller le coffre"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}