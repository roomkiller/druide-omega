/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - App Entry Point with PWA                                   ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { useEffect } from 'react';
import { registerServiceWorker, requestNotificationPermission } from '@/components/utils/registerServiceWorker';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Register Service Worker for PWA
    registerServiceWorker().then(async (registration) => {
      if (registration) {
        console.log('✅ PWA Ready');
        
        // Request notification permission
        const granted = await requestNotificationPermission();
        if (granted) {
          console.log('✅ Notifications enabled');
        }
      }
    });

    // Log performance metrics
    if (typeof window !== 'undefined' && window.performance) {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      console.log(`📊 Page load: ${pageLoadTime}ms`);
    }
  }, []);

  return <Component {...pageProps} />;
}