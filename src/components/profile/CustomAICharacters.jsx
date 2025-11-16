import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Bot, 
  Plus, 
  Trash2, 
  Edit,
  Loader2,
  Sparkles,
  Heart,
  Zap,
  BookOpen,
  Smile
} from "lucide-react";
import { motion } from "framer-motion";

export default function CustomAICharacters() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState(null);
  const [newCharacter, setNewCharacter] = useState({
    name: "",
    description: "",
    personality_traits: {
      openness: 50,
      conscientiousness: 50,
      extraversion: 50,
      agreeableness: 80,
      neuroticism: 20
    },
    conversation_style: "friendly",
    expertise_areas: [],
    emotional_depth: 80,
    creativity_level: 70
  });

  const queryClient = useQueryClient();

  const { data: personalities = [], isLoading } = useQuery({
    queryKey: ['customPersonalities'],
    queryFn: () => base44.entities.PersonalityProfile.list('-created_date')
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.PersonalityProfile.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customPersonalities'] });
      setDialogOpen(false);
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.PersonalityProfile.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customPersonalities'] });
    }
  });

  const resetForm = () => {
    setNewCharacter({
      name: "",
      description: "",
      personality_traits: {
        openness: 50,
        conscientiousness: 50,
        extraversion: 50,
        agreeableness: 80,
        neuroticism: 20
      },
      conversation_style: "friendly",
      expertise_areas: [],
      emotional_depth: 80,
      creativity_level: 70
    });
    setEditingCharacter(null);
  };

  const handleCreate = () => {
    createMutation.mutate({
      profile_name: newCharacter.name,
      description: newCharacter.description,
      big_five_traits: newCharacter.personality_traits,
      conversation_style: newCharacter.conversation_style,
      expertise_domains: newCharacter.expertise_areas,
      emotional_range: {
        depth: newCharacter.emotional_depth,
        variability: 75,
        empathy_level: newCharacter.personality_traits.agreeableness
      },
      active: true,
      is_custom: true
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Personnages IA Personnalisés</h2>
              <p className="text-slate-600">Créez des assistants IA uniques avec des personnalités distinctes</p>
            </div>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Personnage
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Créer un Personnage IA</DialogTitle>
                <DialogDescription>
                  Configurez la personnalité, le style et les capacités de votre assistant IA
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div>
                  <Label>Nom du Personnage</Label>
                  <Input
                    value={newCharacter.name}
                    onChange={(e) => setNewCharacter({ ...newCharacter, name: e.target.value })}
                    placeholder="Ex: Assistant Créatif, Coach Motivant..."
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={newCharacter.description}
                    onChange={(e) => setNewCharacter({ ...newCharacter, description: e.target.value })}
                    placeholder="Décrivez le rôle et les spécialités de ce personnage..."
                    rows={3}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Traits de Personnalité (Big Five)
                  </h3>

                  {[
                    { key: 'openness', label: 'Ouverture (créativité, curiosité)', icon: Sparkles },
                    { key: 'conscientiousness', label: 'Conscience (organisation, rigueur)', icon: BookOpen },
                    { key: 'extraversion', label: 'Extraversion (sociabilité, énergie)', icon: Zap },
                    { key: 'agreeableness', label: 'Amabilité (empathie, bienveillance)', icon: Heart },
                    { key: 'neuroticism', label: 'Neuroticisme (sensibilité émotionnelle)', icon: Smile }
                  ].map(({ key, label, icon: Icon }) => (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2 text-sm">
                          <Icon className="w-4 h-4 text-purple-600" />
                          {label}
                        </Label>
                        <Badge>{newCharacter.personality_traits[key]}%</Badge>
                      </div>
                      <Slider
                        value={[newCharacter.personality_traits[key]]}
                        onValueChange={(val) => setNewCharacter({
                          ...newCharacter,
                          personality_traits: {
                            ...newCharacter.personality_traits,
                            [key]: val[0]
                          }
                        })}
                        min={0}
                        max={100}
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label>Profondeur Émotionnelle</Label>
                  <div className="flex items-center gap-3">
                    <Slider
                      value={[newCharacter.emotional_depth]}
                      onValueChange={(val) => setNewCharacter({ ...newCharacter, emotional_depth: val[0] })}
                      min={0}
                      max={100}
                      className="flex-1"
                    />
                    <Badge>{newCharacter.emotional_depth}%</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Niveau de Créativité</Label>
                  <div className="flex items-center gap-3">
                    <Slider
                      value={[newCharacter.creativity_level]}
                      onValueChange={(val) => setNewCharacter({ ...newCharacter, creativity_level: val[0] })}
                      min={0}
                      max={100}
                      className="flex-1"
                    />
                    <Badge>{newCharacter.creativity_level}%</Badge>
                  </div>
                </div>

                <Button
                  onClick={handleCreate}
                  disabled={!newCharacter.name || createMutation.isPending}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {createMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Créer le Personnage
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-600" />
          </div>
        ) : personalities.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl">
            <Bot className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 mb-4">Aucun personnage personnalisé créé</p>
            <p className="text-sm text-slate-500">Créez votre premier assistant IA avec une personnalité unique</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {personalities.map((personality, idx) => (
              <motion.div
                key={personality.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="p-5 hover:shadow-lg transition-all border-2 hover:border-purple-300">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <Bot className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{personality.profile_name}</h3>
                        <Badge variant="outline" className="text-xs mt-1">
                          {personality.conversation_style || 'friendly'}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => deleteMutation.mutate(personality.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>

                  <p className="text-sm text-slate-600 mb-3">{personality.description}</p>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {personality.big_five_traits && Object.entries(personality.big_five_traits).map(([trait, value]) => (
                      <div key={trait} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                        <span className="text-slate-600 capitalize">{trait.slice(0, 8)}:</span>
                        <span className="font-semibold text-slate-900">{value}%</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}