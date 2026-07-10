/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Coffre-Fort Numérique (accès administrateurs uniquement)   ║
 * ║ Chiffrement AES-256-GCM côté navigateur — connaissance nulle              ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Vault, Lock, Plus, ArrowLeft, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import VaultUnlock from "@/components/vault/VaultUnlock";
import VaultItemForm from "@/components/vault/VaultItemForm";
import VaultItemCard from "@/components/vault/VaultItemCard";
import { encryptText, decryptText } from "@/components/vault/vaultCrypto";

const AUTO_LOCK_MS = 10 * 60 * 1000; // verrouillage auto après 10 min d'inactivité

export default function SecureVault() {
  const [items, setItems] = useState(null);
  const [passphrase, setPassphrase] = useState(null);
  const [unlockError, setUnlockError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const lockTimer = useRef(null);

  const loadItems = useCallback(async () => {
    const data = await base44.entities.VaultItem.list('-created_date');
    setItems(data);
  }, []);

  useEffect(() => { loadItems(); }, [loadItems]);

  const lock = useCallback(() => {
    setPassphrase(null);
    clearTimeout(lockTimer.current);
  }, []);

  const resetLockTimer = useCallback(() => {
    clearTimeout(lockTimer.current);
    lockTimer.current = setTimeout(() => {
      setPassphrase(null);
      toast.info("Coffre verrouillé automatiquement après inactivité");
    }, AUTO_LOCK_MS);
  }, []);

  useEffect(() => () => clearTimeout(lockTimer.current), []);

  const handleUnlock = async (phrase) => {
    setUnlockError(null);
    if (items && items.length > 0) {
      try {
        await decryptText(phrase, items[0]);
      } catch {
        setUnlockError("Phrase secrète incorrecte");
        return;
      }
    }
    setPassphrase(phrase);
    resetLockTimer();
  };

  const handleSave = async ({ title, category, content }) => {
    const encrypted = await encryptText(passphrase, content);
    await base44.entities.VaultItem.create({ title, category, ...encrypted });
    toast.success("Élément chiffré et sauvegardé");
    resetLockTimer();
    await loadItems();
  };

  const handleDecrypt = async (item) => {
    resetLockTimer();
    try {
      return await decryptText(passphrase, item);
    } catch {
      toast.error("Impossible de déchiffrer — cet élément utilise une autre phrase secrète");
      return null;
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Supprimer définitivement « ${item.title} » ?`)) return;
    await base44.entities.VaultItem.delete(item.id);
    toast.success("Élément supprimé");
    resetLockTimer();
    await loadItems();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 via-purple-900 to-indigo-900 text-white page-padding py-12">
        <div className="max-w-5xl mx-auto">
          <Button
            onClick={() => window.location.href = createPageUrl('ArchitectDashboard')}
            variant="ghost" size="sm"
            className="mb-4 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Retour Dashboard
          </Button>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Vault className="w-12 h-12" />
              <div>
                <h1 className="text-4xl font-bold font-display">Coffre-Fort Numérique</h1>
                <p className="text-purple-200 mt-1">
                  Secrets commerciaux et documents sensibles — chiffrés AES-256, accès administrateurs uniquement
                </p>
              </div>
            </div>
            {passphrase && (
              <Button onClick={lock} variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                <Lock className="w-4 h-4 mr-2" /> Verrouiller
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto page-padding py-8">
        {items === null ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          </div>
        ) : passphrase === null ? (
          <VaultUnlock onUnlock={handleUnlock} error={unlockError} hasItems={items.length > 0} />
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-sm text-green-700">
                <ShieldCheck className="w-4 h-4" />
                Coffre déverrouillé — verrouillage automatique après 10 min d'inactivité
              </div>
              <Button onClick={() => setShowForm(true)} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                <Plus className="w-4 h-4 mr-2" /> Nouvel élément
              </Button>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <Vault className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p>Le coffre est vide. Ajoutez votre premier élément chiffré.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {items.map((item) => (
                  <VaultItemCard key={item.id} item={item} onDecrypt={handleDecrypt} onDelete={handleDelete} />
                ))}
              </div>
            )}

            <VaultItemForm open={showForm} onClose={() => setShowForm(false)} onSave={handleSave} />
          </>
        )}
      </div>
    </div>
  );
}