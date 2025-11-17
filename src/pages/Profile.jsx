/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Mon Profil (Préférences et Personnalisation)              ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/utils/LanguageContext";
import { useMinimumLoadingTime } from "@/components/system/LoadingManager";
import PageTransition from "@/components/utils/PageTransition";
import ProactiveSuggestionsPanel from "../components/proactive/ProactiveSuggestionsPanel";
import { 
  User, 
  Eye, 
  Sparkles, 
  Bot,
  Loader2,
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

  const isLoading = useMinimumLoadingTime(loading);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-slate-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30 overflow-hidden">
        {/* Header - Mobile Optimized */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 px-3 sm:px-6 py-6 sm:py-10 flex-shrink-0">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6"
            >
              <div className="min-w-[64px] min-h-[64px] w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-2xl">
                <UserCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">
                  {language === 'en' ? 'My Profile' : 'Mon Profil'}
                </h1>
                <p className="text-purple-100 text-sm sm:text-base break-all sm:break-normal">{user?.email}</p>
                <Badge className="mt-2 bg-white/20 text-white px-3 py-1">
                  {user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                </Badge>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-8 h-full">
            {/* Proactive Suggestions */}
            <div className="mb-4 sm:mb-6">
              <ProactiveSuggestionsPanel
                context={{
                  currentPage: 'Profile',
                  lastAction: 'view_profile',
                  userRole: user?.role
                }}
              />
            </div>

            <Tabs defaultValue="profile" className="h-full flex flex-col overflow-hidden">
              <ScrollArea className="w-full flex-shrink-0 mb-4 sm:mb-6">
                <TabsList className="inline-flex bg-white shadow-md w-full sm:w-auto">
                  <TabsTrigger value="profile" className="min-h-[44px] flex-1 sm:flex-initial touch-target">
                    <User className="w-4 h-4 mr-1 sm:mr-2" />
                    <span className="text-xs sm:text-sm">{language === 'en' ? 'Profile' : 'Profil'}</span>
                  </TabsTrigger>
                  <TabsTrigger value="accessibility" className="min-h-[44px] flex-1 sm:flex-initial touch-target">
                    <Eye className="w-4 h-4 mr-1 sm:mr-2" />
                    <span className="text-xs sm:text-sm">{language === 'en' ? 'A11y' : 'A11y'}</span>
                  </TabsTrigger>
                  <TabsTrigger value="recommendations" className="min-h-[44px] flex-1 sm:flex-initial touch-target">
                    <Sparkles className="w-4 h-4 mr-1 sm:mr-2" />
                    <span className="text-xs sm:text-sm">{language === 'en' ? 'Reco' : 'Reco'}</span>
                  </TabsTrigger>
                  <TabsTrigger value="characters" className="min-h-[44px] flex-1 sm:flex-initial touch-target">
                    <Bot className="w-4 h-4 mr-1 sm:mr-2" />
                    <span className="text-xs sm:text-sm">{language === 'en' ? 'AI' : 'IA'}</span>
                  </TabsTrigger>
                </TabsList>
              </ScrollArea>

              <div className="flex-1 overflow-hidden">
                <TabsContent value="profile" className="h-full mt-0">
                  <ScrollArea className="h-full">
                    <div className="pr-2 sm:pr-4 pb-6">
                      <ProfileSettings user={user} />
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="accessibility" className="h-full mt-0">
                  <ScrollArea className="h-full">
                    <div className="pr-2 sm:pr-4 pb-6">
                      <AccessibilitySettings />
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="recommendations" className="h-full mt-0">
                  <ScrollArea className="h-full">
                    <div className="pr-2 sm:pr-4 pb-6">
                      <PersonalizedRecommendations />
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="characters" className="h-full mt-0">
                  <ScrollArea className="h-full">
                    <div className="pr-2 sm:pr-4 pb-6">
                      <CustomAICharacters />
                    </div>
                  </ScrollArea>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}