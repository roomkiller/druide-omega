
/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Mon Profil (Préférences et Personnalisation)              ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/utils/LanguageContext";
import { 
  User, 
  Settings, 
  Eye, 
  Sparkles, 
  Bot,
  Loader2,
  Save,
  UserCircle
} from "lucide-react";
import { motion } from "framer-motion";
import AccessibilitySettings from "../components/profile/AccessibilitySettings";
import PersonalizedRecommendations from "../components/profile/PersonalizedRecommendations";
import CustomAICharacters from "../components/profile/CustomAICharacters";
import ProfileSettings from "../components/profile/ProfileSettings";

export default function Profile() {
  const { t, language } = useLanguage();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.error("Erreur chargement utilisateur:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 px-4 sm:px-6 py-8 sm:py-10 flex-shrink-0">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-center sm:items-start gap-6"
          >
            <div className="min-w-[80px] min-h-[80px] w-20 h-20 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-2xl">
              <UserCircle className="w-10 h-10 text-white" />
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                {language === 'en' ? 'My Profile' : 'Mon Profil'}
              </h1>
              <p className="text-purple-100 text-sm sm:text-base">{user?.email}</p>
              <Badge className="mt-2 bg-white/20 text-white">
                {user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
              </Badge>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 h-full">
          <Tabs defaultValue="profile" className="h-full flex flex-col overflow-hidden">
            <ScrollArea className="w-full flex-shrink-0 mb-6 whitespace-nowrap"> {/* Added whitespace-nowrap here for horizontal scroll */}
              <TabsList className="inline-flex bg-white shadow-md">
                <TabsTrigger value="profile" className="min-h-[44px] touch-target">
                  <User className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">{language === 'en' ? 'Profile' : 'Profil'}</span>
                </TabsTrigger>
                <TabsTrigger value="accessibility" className="min-h-[44px] touch-target">
                  <Eye className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">{language === 'en' ? 'Accessibility' : 'Accessibilité'}</span>
                </TabsTrigger>
                <TabsTrigger value="recommendations" className="min-h-[44px] touch-target">
                  <Sparkles className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">{language === 'en' ? 'Recommendations' : 'Reco'}</span>
                </TabsTrigger>
                <TabsTrigger value="characters" className="min-h-[44px] touch-target">
                  <Bot className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">{language === 'en' ? 'AI Characters' : 'IA'}</span>
                </TabsTrigger>
              </TabsList>
            </ScrollArea>

            <TabsContent value="profile" className="flex-1 overflow-hidden mt-0">
              <ScrollArea className="h-full">
                <div className="pr-4 pb-6">
                  <ProfileSettings user={user} />
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="accessibility" className="flex-1 overflow-hidden mt-0">
              <ScrollArea className="h-full">
                <div className="pr-4 pb-6">
                  <AccessibilitySettings />
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="recommendations" className="flex-1 overflow-hidden mt-0">
              <ScrollArea className="h-full">
                <div className="pr-4 pb-6">
                  <PersonalizedRecommendations />
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="characters" className="flex-1 overflow-hidden mt-0">
              <ScrollArea className="h-full">
                <div className="pr-4 pb-6">
                  <CustomAICharacters />
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
