/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Personality Profile Manager                                ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Check, Plus, Trash2, Star, Settings } from "lucide-react";
import { motion } from "framer-motion";

export default function PersonalityProfileManager({ currentConfig, onProfileSelected }) {
  const [showCreate, setShowCreate] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const queryClient = useQueryClient();

  const { data: profiles = [] } = useQuery({
    queryKey: ["personalityProfiles"],
    queryFn: () => base44.entities.PersonalityProfile.list("-created_date")
  });

  const createProfileMutation = useMutation({
    mutationFn: async (profileData) => base44.entities.PersonalityProfile.create(profileData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personalityProfiles"] });
      setShowCreate(false);
      setNewProfileName("");
    }
  });

  const activateProfileMutation = useMutation({
    mutationFn: async (profile) => {
      // Désactiver tous les autres profils
      for (const p of profiles.filter(p => p.is_active)) {
        await base44.entities.PersonalityProfile.update(p.id, { is_active: false });
      }
      // Activer le profil sélectionné
      await base44.entities.PersonalityProfile.update(profile.id, { is_active: true });
      return profile;
    },
    onSuccess: (profile) => {
      queryClient.invalidateQueries({ queryKey: ["personalityProfiles"] });
      if (onProfileSelected) {
        onProfileSelected(profile);
      }
    }
  });

  const deleteProfileMutation = useMutation({
    mutationFn: (id) => base44.entities.PersonalityProfile.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personalityProfiles"] });
    }
  });

  const handleCreateProfile = async () => {
    if (!newProfileName.trim()) return;

    await createProfileMutation.mutateAsync({
      profile_name: newProfileName,
      description: "Profil personnalisé",
      is_active: false,
      consciousness_level: currentConfig.consciousness_level,
      ratio_logic: currentConfig.ratio_logic,
      ratio_consciousness: currentConfig.ratio_consciousness,
      big_five: currentConfig.big_five,
      philosophical_influences: currentConfig.philosophical_influences,
      icon: "🎭",
      color: "from-purple-500 to-indigo-600"
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-purple-600" />
          Profils de Personnalité
        </h3>
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-gradient-to-r from-purple-600 to-indigo-600">
              <Plus className="w-4 h-4 mr-2" />
              Créer Profil
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un nouveau profil</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Nom du profil
                </label>
                <Input
                  placeholder="Ex: Analyste Rationnel, Empathique Créatif..."
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                />
              </div>
              <Button
                onClick={handleCreateProfile}
                disabled={!newProfileName.trim() || createProfileMutation.isPending}
                className="w-full"
              >
                {createProfileMutation.isPending ? "Création..." : "Sauvegarder la configuration actuelle"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {profiles.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-sm">
          Créez votre premier profil pour sauvegarder cette configuration
        </div>
      ) : (
        <div className="space-y-3">
          {profiles.map((profile, idx) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className={`p-4 cursor-pointer transition-all ${
                profile.is_active 
                  ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-300' 
                  : 'hover:bg-slate-50 border border-slate-200'
              }`}>
                <div className="flex items-start justify-between">
                  <div 
                    className="flex-1"
                    onClick={() => !profile.is_active && activateProfileMutation.mutate(profile)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{profile.icon || "🎭"}</span>
                      <h4 className="font-semibold text-slate-900">{profile.profile_name}</h4>
                      {profile.is_active && (
                        <Badge className="bg-green-500 text-white">
                          <Check className="w-3 h-3 mr-1" />
                          Actif
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mb-2">{profile.description}</p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <Badge variant="outline">Niveau: {profile.consciousness_level}/15</Badge>
                      <Badge variant="outline">Ratio: {profile.ratio_logic}:{profile.ratio_consciousness}</Badge>
                      <Badge variant="outline">{profile.philosophical_influences?.length || 0} philo</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-2">
                    {!profile.is_active && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteProfileMutation.mutate(profile.id)}
                        className="text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </Card>
  );
}