/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Loading Manager (Synchronisation Globale)                  ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Brain } from "lucide-react";

// Configuration globale de chargement
export const LOADING_CONFIG = {
  minDisplayTime: 300,        // Temps minimum d'affichage (ms)
  fadeInDuration: 200,        // Durée fade-in
  fadeOutDuration: 150,       // Durée fade-out
  skeletonPulseSpeed: 2,      // Vitesse pulsation skeleton
  spinnerSpeed: 1,            // Vitesse spinner
  staggerDelay: 50,           // Délai entre items
};

// Context pour gérer l'état de chargement global
const LoadingContext = createContext({
  isLoading: false,
  setLoading: () => {},
  loadingMessage: '',
  setLoadingMessage: () => {}
});

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [startTime, setStartTime] = useState(null);

  const setLoading = (loading, message = '') => {
    if (loading) {
      setStartTime(Date.now());
      setIsLoading(true);
      setLoadingMessage(message);
    } else {
      // Respecter le temps minimum d'affichage
      const elapsed = Date.now() - (startTime || 0);
      const remaining = Math.max(0, LOADING_CONFIG.minDisplayTime - elapsed);
      
      setTimeout(() => {
        setIsLoading(false);
        setLoadingMessage('');
      }, remaining);
    }
  };

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading, loadingMessage, setLoadingMessage }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);

// Composant de chargement standardisé
export const LoadingSpinner = ({ size = "default", message = "", className = "" }) => {
  const sizes = {
    small: "w-4 h-4",
    default: "w-8 h-8",
    large: "w-12 h-12"
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: LOADING_CONFIG.fadeInDuration / 1000 }}
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
    >
      <Loader2 
        className={`${sizes[size]} text-purple-600 animate-spin`}
        style={{ animationDuration: `${LOADING_CONFIG.spinnerSpeed}s` }}
      />
      {message && (
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-slate-600"
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  );
};

// Skeleton loader standardisé
export const SkeletonLoader = ({ variant = "default", count = 1, className = "" }) => {
  const variants = {
    default: "h-4 rounded",
    card: "h-32 rounded-xl",
    circle: "w-12 h-12 rounded-full",
    text: "h-4 rounded w-3/4"
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ 
            delay: i * (LOADING_CONFIG.staggerDelay / 1000),
            duration: LOADING_CONFIG.fadeInDuration / 1000
          }}
          className={`bg-slate-200 ${variants[variant]} animate-pulse`}
          style={{ 
            animationDuration: `${LOADING_CONFIG.skeletonPulseSpeed}s`,
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  );
};

// Page loader full-screen
export const PageLoader = ({ message = "Chargement..." }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: LOADING_CONFIG.fadeInDuration / 1000 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30 backdrop-blur-sm"
    >
      <div className="text-center">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mb-4"
        >
          <Brain className="w-16 h-16 text-purple-600 mx-auto" />
        </motion.div>
        <LoadingSpinner size="large" message={message} />
      </div>
    </motion.div>
  );
};

// Content loader (pour remplacer le contenu pendant le chargement)
export const ContentLoader = ({ isLoading, skeleton = "default", skeletonCount = 3, children }) => {
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: LOADING_CONFIG.fadeInDuration / 1000 }}
        >
          <SkeletonLoader variant={skeleton} count={skeletonCount} />
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: LOADING_CONFIG.fadeInDuration / 1000 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Hook pour gérer le chargement avec temps minimum
export const useMinimumLoadingTime = (isLoading, minTime = LOADING_CONFIG.minDisplayTime) => {
  const [displayLoading, setDisplayLoading] = useState(isLoading);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    if (isLoading) {
      setStartTime(Date.now());
      setDisplayLoading(true);
    } else if (startTime) {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minTime - elapsed);
      
      setTimeout(() => {
        setDisplayLoading(false);
        setStartTime(null);
      }, remaining);
    }
  }, [isLoading, startTime, minTime]);

  return displayLoading;
};

export default LoadingProvider;