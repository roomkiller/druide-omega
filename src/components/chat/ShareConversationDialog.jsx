/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Share Conversation Dialog                                  ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Share2, Copy, Check, Lock } from "lucide-react";

export default function ShareConversationDialog({ conversationId }) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [expiresInDays, setExpiresInDays] = useState(7);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const shareMutation = useMutation({
    mutationFn: async () => {
      const response = await base44.functions.invoke('shareConversation', {
        conversationId,
        expiresInDays,
        password: password || undefined
      });
      return response.data;
    },
    onSuccess: (data) => {
      setShareUrl(data.share_url);
    }
  });

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="w-4 h-4 mr-2" />
          Partager
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Partager la conversation</DialogTitle>
        </DialogHeader>

        {!shareUrl ? (
          <div className="space-y-4">
            <div>
              <Label>Expiration (jours)</Label>
              <Input
                type="number"
                value={expiresInDays}
                onChange={(e) => setExpiresInDays(parseInt(e.target.value))}
                min={1}
                max={365}
              />
            </div>

            <div>
              <Label className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Mot de passe (optionnel)
              </Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Protection par mot de passe"
              />
            </div>

            <Button
              onClick={() => shareMutation.mutate()}
              disabled={shareMutation.isPending}
              className="w-full"
            >
              {shareMutation.isPending ? 'Génération...' : 'Générer le lien'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-900 mb-2">Lien de partage créé !</p>
              <div className="flex gap-2">
                <Input value={shareUrl} readOnly className="flex-1" />
                <Button onClick={copyToClipboard} size="icon">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Badge variant="outline">Expire dans {expiresInDays} jours</Badge>
              {password && (
                <Badge className="bg-purple-100 text-purple-700">
                  <Lock className="w-3 h-3 mr-1" />
                  Protégé
                </Badge>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}