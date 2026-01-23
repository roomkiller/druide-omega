/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Two-Factor Authentication Setup                            ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Key, Copy, Check, AlertTriangle } from "lucide-react";

export default function TwoFactorSetup() {
  const [step, setStep] = useState('initial');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [verificationCode, setVerificationCode] = useState('');
  const [copied, setCopied] = useState(false);

  const queryClient = useQueryClient();

  const { data: twoFactorConfig } = useQuery({
    queryKey: ['twoFactorAuth'],
    queryFn: async () => {
      const configs = await base44.entities.TwoFactorAuth.list();
      return configs[0] || null;
    }
  });

  const setupMutation = useMutation({
    mutationFn: async () => {
      const response = await base44.functions.invoke('twoFactorAuth', { action: 'setup' });
      return response.data;
    },
    onSuccess: async (data) => {
      setSecret(data.secret);
      setBackupCodes(data.backup_codes);
      setQrCodeUrl(data.qr_code_url);
      setStep('scan');
    }
  });

  const verifyMutation = useMutation({
    mutationFn: async (code) => {
      const response = await base44.functions.invoke('twoFactorAuth', { 
        action: 'verify',
        code 
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['twoFactorAuth'] });
      setStep('success');
    },
    onError: () => {
      alert('Code invalide. Réessayez.');
    }
  });

  const disableMutation = useMutation({
    mutationFn: async (code) => {
      const response = await base44.functions.invoke('twoFactorAuth', { 
        action: 'disable',
        code 
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['twoFactorAuth'] });
      setStep('initial');
      setVerificationCode('');
    }
  });

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (twoFactorConfig?.enabled && step === 'initial') {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Authentification à deux facteurs</h3>
            <Badge className="bg-green-500 text-white">
              <Check className="w-3 h-3 mr-1" />
              Activée
            </Badge>
          </div>
        </div>

        <Alert className="mb-4">
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>
            Pour désactiver 2FA, entrez un code valide de votre application d'authentification.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <Input
            type="text"
            placeholder="Code à 6 chiffres"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            maxLength={6}
          />
          <Button
            onClick={() => disableMutation.mutate(verificationCode)}
            disabled={verificationCode.length !== 6 || disableMutation.isPending}
            variant="destructive"
            className="w-full"
          >
            Désactiver 2FA
          </Button>
        </div>
      </Card>
    );
  }

  if (step === 'initial') {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Authentification à deux facteurs</h3>
            <p className="text-sm text-slate-600">Sécurisez votre compte avec 2FA</p>
          </div>
        </div>

        <p className="text-sm text-slate-700 mb-4">
          Ajoutez une couche de sécurité supplémentaire en activant l'authentification à deux facteurs.
        </p>

        <Button onClick={() => setupMutation.mutate()} className="w-full">
          Configurer 2FA
        </Button>
      </Card>
    );
  }

  if (step === 'scan') {
    return (
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">Étape 1: Scanner le QR Code</h3>
        
        <div className="bg-white p-4 rounded-lg border mb-4 flex justify-center">
          {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />}
        </div>

        <Alert className="mb-4">
          <Key className="w-4 h-4" />
          <AlertDescription>
            Scannez ce code avec votre application d'authentification (Google Authenticator, Authy, etc.)
          </AlertDescription>
        </Alert>

        <div className="mb-4">
          <p className="text-xs text-slate-600 mb-2">Ou entrez manuellement:</p>
          <div className="flex gap-2">
            <Input value={secret} readOnly className="font-mono text-xs" />
            <Button size="sm" variant="outline" onClick={() => copyToClipboard(secret)}>
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <Button onClick={() => setStep('backup')} className="w-full">
          Suivant
        </Button>
      </Card>
    );
  }

  if (step === 'backup') {
    return (
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">Étape 2: Codes de secours</h3>
        
        <Alert className="mb-4 bg-orange-50 border-orange-200">
          <AlertTriangle className="w-4 h-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            Sauvegardez ces codes dans un endroit sûr. Chaque code ne peut être utilisé qu'une seule fois.
          </AlertDescription>
        </Alert>

        <div className="bg-slate-50 p-4 rounded-lg mb-4 grid grid-cols-2 gap-2">
          {backupCodes.map((code, idx) => (
            <div key={idx} className="font-mono text-sm bg-white p-2 rounded border">
              {code}
            </div>
          ))}
        </div>

        <Button
          onClick={() => {
            copyToClipboard(backupCodes.join('\n'));
            setStep('verify');
          }}
          className="w-full"
        >
          <Copy className="w-4 h-4 mr-2" />
          Copier et continuer
        </Button>
      </Card>
    );
  }

  if (step === 'verify') {
    return (
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">Étape 3: Vérification</h3>
        
        <p className="text-sm text-slate-700 mb-4">
          Entrez le code à 6 chiffres de votre application d'authentification pour activer 2FA.
        </p>

        <div className="space-y-3">
          <Input
            type="text"
            placeholder="Code à 6 chiffres"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            maxLength={6}
            className="text-center text-2xl tracking-widest"
          />
          <Button
            onClick={() => verifyMutation.mutate(verificationCode)}
            disabled={verificationCode.length !== 6 || verifyMutation.isPending}
            className="w-full"
          >
            Vérifier et activer
          </Button>
        </div>
      </Card>
    );
  }

  if (step === 'success') {
    return (
      <Card className="p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-bold text-xl mb-2">2FA activée avec succès!</h3>
          <p className="text-sm text-slate-600 mb-4">
            Votre compte est maintenant protégé par l'authentification à deux facteurs.
          </p>
          <Button onClick={() => window.location.reload()} className="w-full">
            Terminé
          </Button>
        </div>
      </Card>
    );
  }

  return null;
}