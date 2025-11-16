import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { UserCircle, Save, Loader2, Check, Mail, User } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfileSettings({ user }) {
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [saved, setSaved] = useState(false);

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      await base44.auth.updateMe(data);
    },
    onSuccess: () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  });

  const handleSave = () => {
    updateMutation.mutate({ full_name: fullName });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <UserCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Informations du Profil</h2>
            <p className="text-slate-600">Gérez vos informations personnelles</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4" />
              Nom Complet
            </Label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Votre nom complet"
            />
          </div>

          <div>
            <Label className="flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4" />
              Email
            </Label>
            <Input
              value={user?.email || ""}
              disabled
              className="bg-slate-100"
            />
            <p className="text-xs text-slate-500 mt-1">L'email ne peut pas être modifié</p>
          </div>

          <div>
            <Label className="mb-2 block">Rôle</Label>
            <Badge className={user?.role === 'admin' ? 'bg-red-500' : 'bg-blue-500'}>
              {user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
            </Badge>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {updateMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : saved ? (
              <Check className="w-4 h-4 mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saved ? 'Sauvegardé !' : 'Sauvegarder'}
          </Button>
          {saved && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm text-green-600"
            >
              ✓ Profil mis à jour
            </motion.div>
          )}
        </div>
      </Card>
    </div>
  );
}