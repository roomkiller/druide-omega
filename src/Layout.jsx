/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Navigation Layout with Druid Companion                     ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ Conforme: Loi 25 (Québec), RGPD (UE), CCPA (USA)                          ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { useState, useEffect } from "react";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { LanguageProvider, useLanguage } from "@/components/utils/LanguageContext";

// Load ResponsiveVoice script
if (typeof window !== 'undefined' && !window.responsiveVoice) {
  const script = document.createElement('script');
  script.src = 'https://code.responsivevoice.org/responsivevoice.js?key=xgfy7Kom';
  script.async = true;
  script.onerror = () => console.warn('ResponsiveVoice failed to load');
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
import CookieConsent from "@/components/legal/CookieConsent";
import AccessibilityWrapper from "@/components/a11y/AccessibilityWrapper";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { GlobalBehaviorTracker } from "@/components/analytics/BehaviorTracker";
import OfflineIndicator from "@/components/system/OfflineIndicator";
import LayoutPublic from "@/components/layouts/LayoutPublic";
import LayoutArchitect from "@/components/layouts/LayoutArchitect";
import { ARCHITECT_PAGES_SET } from "@/navigation.config";
import { IntegrationRelayProvider, RelayToggle, RelayBanner } from "@/components/system/IntegrationRelay";
import { Toaster } from "sonner";
import { ErrorBoundary } from "@/components/utils/ErrorBoundary";



export default function Layout({ children, currentPageName }) {
  // Routing: Détection page public vs architecte (source unique : navigation.config)
  const isArchitectPage = ARCHITECT_PAGES_SET.has((currentPageName || '').toLowerCase());

  // Si Landing ou Home, pas de layout
  if (currentPageName === 'Landing' || currentPageName === 'Home') {
    return (
      <ErrorBoundary>
      <LanguageProvider>
        <IntegrationRelayProvider>
        <ConsciousnessHubProvider>
          <DruidCompanionProvider>
            <IntelligenceProvider>
              <OfflineProvider>
                <BackgroundTasksProvider>
                  <Toaster position="top-right" richColors />
                  <RelayBanner />
                  <div className="smooth-scroll">
                    {children}
                  </div>
                </BackgroundTasksProvider>
              </OfflineProvider>
            </IntelligenceProvider>
          </DruidCompanionProvider>
        </ConsciousnessHubProvider>
        </IntegrationRelayProvider>
      </LanguageProvider>
      </ErrorBoundary>
    );
  }

  // Choisir layout approprié
  const LayoutComponent = isArchitectPage ? LayoutArchitect : LayoutPublic;

  return (
    <ErrorBoundary>
    <LanguageProvider>
      <IntegrationRelayProvider>
      <ConsciousnessHubProvider>
        <DruidCompanionProvider>
          <IntelligenceProvider>
            <OfflineProvider>
              <BackgroundTasksProvider>
                <AnalyticsProvider currentPage={currentPageName}>
                  <Toaster position="top-right" richColors />
                  <RelayBanner />
                  <RelayToggle />
                  <CookieConsent />
                  <GlobalBehaviorTracker />
                  <GlobalDruidCompanion />
                  <OfflineIndicator />
                  <BackgroundTasksIndicator />
                  <AccessibilityWrapper>
                    <LayoutComponent currentPageName={currentPageName}>
                      <ServicePersistence currentPage={currentPageName} />
                      <div className="smooth-scroll">
                        {children}
                      </div>
                    </LayoutComponent>
                  </AccessibilityWrapper>
                </AnalyticsProvider>
              </BackgroundTasksProvider>
            </OfflineProvider>
          </IntelligenceProvider>
        </DruidCompanionProvider>
      </ConsciousnessHubProvider>
      </IntegrationRelayProvider>
    </LanguageProvider>
    </ErrorBoundary>
  );
}