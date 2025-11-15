/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Theme Hook                                                 ║
 * ║ Hook React pour accéder facilement au thème                               ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import ThemeRegistry from './ThemeRegistry';

/**
 * Hook pour accéder au thème
 */
export function useTheme() {
  return ThemeRegistry;
}

/**
 * Utilitaires de thème
 */
export const themeUtils = {
  /**
   * Obtient une classe de gradient
   */
  gradient: (name) => {
    return ThemeRegistry.gradients[name] || ThemeRegistry.gradients.primary;
  },

  /**
   * Obtient une classe de composant
   */
  component: (type, variant = 'base') => {
    return ThemeRegistry.components[type]?.[variant] || '';
  },

  /**
   * Obtient une couleur
   */
  color: (path) => {
    const parts = path.split('.');
    let value = ThemeRegistry.colors;
    for (const part of parts) {
      value = value?.[part];
    }
    return value;
  },

  /**
   * Obtient un effet
   */
  effect: (type, variant) => {
    return ThemeRegistry.effects[type]?.[variant];
  },

  /**
   * Obtient une animation
   */
  animation: (name) => {
    return ThemeRegistry.animations[name];
  }
};

export default useTheme;