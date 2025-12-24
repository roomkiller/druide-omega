/**
 * Mobile Optimizations - Détection et optimisations mobiles
 */

import { useEffect, useState } from 'react';

export function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const ios = /iphone|ipad|ipod/.test(userAgent);
    const android = /android/.test(userAgent);
    
    // Detect PWA
    const isPWAMode = window.matchMedia('(display-mode: standalone)').matches || 
                      window.navigator.standalone === true;

    setIsMobile(mobile);
    setIsIOS(ios);
    setIsAndroid(android);
    setIsPWA(isPWAMode);

    // Add mobile-specific optimizations
    if (mobile) {
      // Disable hover effects on mobile
      document.body.classList.add('mobile-device');
      
      // Prevent zoom on input focus (iOS)
      if (ios) {
        const viewport = document.querySelector('meta[name=viewport]');
        if (viewport) {
          viewport.setAttribute('content', 
            'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
          );
        }
      }
    }
  }, []);

  return { isMobile, isIOS, isAndroid, isPWA };
}

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState('unknown');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Get connection type if available
    if ('connection' in navigator) {
      const conn = navigator.connection;
      setConnectionType(conn.effectiveType || 'unknown');
      
      conn.addEventListener('change', () => {
        setConnectionType(conn.effectiveType || 'unknown');
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, connectionType };
}

export function useBatteryStatus() {
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [isCharging, setIsCharging] = useState(false);

  useEffect(() => {
    if ('getBattery' in navigator) {
      navigator.getBattery().then((battery) => {
        setBatteryLevel(battery.level * 100);
        setIsCharging(battery.charging);

        battery.addEventListener('levelchange', () => {
          setBatteryLevel(battery.level * 100);
        });

        battery.addEventListener('chargingchange', () => {
          setIsCharging(battery.charging);
        });
      });
    }
  }, []);

  return { batteryLevel, isCharging };
}

// Performance-based quality adjustment
export function useAdaptiveQuality() {
  const [quality, setQuality] = useState('high');
  const { connectionType } = useNetworkStatus();
  const { batteryLevel } = useBatteryStatus();

  useEffect(() => {
    // Adjust quality based on network and battery
    if (connectionType === 'slow-2g' || connectionType === '2g') {
      setQuality('low');
    } else if (connectionType === '3g' || batteryLevel < 20) {
      setQuality('medium');
    } else {
      setQuality('high');
    }
  }, [connectionType, batteryLevel]);

  return quality;
}