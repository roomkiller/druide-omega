/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Navigation Layout with Druid Companion                     ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ Conforme: Loi 25 (Québec), RGPD (UE), CCPA (USA)                          ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from "react";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { LanguageProvider, useLanguage } from "@/components/utils/LanguageContext";

// Load ResponsiveVoice script
if (typeof window !== 'undefined' && !window.responsiveVoice) {
  const script = document.createElement('script');
  script.src = 'https://code.responsivevoice.org/responsivevoice.js?key=xgfy7Kom';
  script.async = true;
  document.head.appendChild(script);
}
import { ConsciousnessHubProvider } from "@/components/system/ConsciousnessHub";
import { DruidCompanionProvider } from "@/components/companion/DruidCompanionProvider";
import { IntelligenceProvider } from "@/components/intelligence/IntelligenceManager";
import { OfflineProvider } from "@/components/offline/OfflineManager";
import { BackgroundTasksProvider } from "@/components/system/BackgroundTasksManager";
import BackgroundTasksIndicator from "@/components/system/BackgroundTasksIndicator";
import GlobalDruidCompanion from "@/components/companion/GlobalDruidCompanion";
import ServicePersistence from "@/components/system/ServicePersistence";
import WelcomeModal from "@/components/system/WelcomeModal";
import CookieConsent from "@/components/legal/CookieConsent";
import AccessibilityWrapper from "@/components/a11y/AccessibilityWrapper";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { GlobalBehaviorTracker } from "@/components/analytics/BehaviorTracker";
import OfflineIndicator from "@/components/system/OfflineIndicator";
import LayoutPublic from "@/components/layouts/LayoutPublic";
import LayoutArchitect from "@/components/layouts/LayoutArchitect";



export default function Layout({ children, currentPageName }) {
  // Routing: Détection page public vs architecte
  const architectPages = [
    'ArchitectDashboard', 'DruideControl', 'SystemHealth', 
    'Consciousness', 'AITests', 'Admin', 
    'ApplicationEvaluation', 'UserManagement', 'PublicAdmin'
  ];

  const isArchitectPage = architectPages.includes(currentPageName);

  // Si Landing ou Home, pas de layout
  if (currentPageName === 'Landing' || currentPageName === 'Home') {
    return (
      <LanguageProvider>
        <ConsciousnessHubProvider>
          <DruidCompanionProvider>
            <IntelligenceProvider>
              <OfflineProvider>
                <BackgroundTasksProvider>
                  <div className="smooth-scroll">
                    {children}
                  </div>
                </BackgroundTasksProvider>
              </OfflineProvider>
            </IntelligenceProvider>
          </DruidCompanionProvider>
        </ConsciousnessHubProvider>
      </LanguageProvider>
    );
  }

  // Choisir layout approprié
  const LayoutComponent = isArchitectPage ? LayoutArchitect : LayoutPublic;

  return (
    <LanguageProvider>
      <ConsciousnessHubProvider>
        <DruidCompanionProvider>
          <IntelligenceProvider>
            <OfflineProvider>
              <BackgroundTasksProvider>
                <AnalyticsProvider currentPage={currentPageName}>
                  <WelcomeModal />
                  <CookieConsent />
                  <GlobalBehaviorTracker />
                  <GlobalDruidCompanion />
                  <OfflineIndicator />
                  <BackgroundTasksIndicator />
                  <AccessibilityWrapper>
                    <LayoutComponent currentPageName={currentPageName}>
                      <ServicePersistence currentPage={currentPageName} />
                      <motion.div
                        key={currentPageName}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="smooth-scroll"
                      >
                        {children}
                      </motion.div>
                    </LayoutComponent>
                  </AccessibilityWrapper>
                </AnalyticsProvider>
              </BackgroundTasksProvider>
            </OfflineProvider>
          </IntelligenceProvider>
        </DruidCompanionProvider>
      </ConsciousnessHubProvider>
    </LanguageProvider>
  );
}