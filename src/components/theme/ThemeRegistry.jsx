/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Theme Registry & Design System                             ║
 * ║ Registre centralisé du thème mystique et spirituel                        ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

export const ThemeRegistry = {
  // ═══════════════════════════════════════════════════════════════════════════
  // IDENTITÉ VISUELLE
  // ═══════════════════════════════════════════════════════════════════════════
  identity: {
    name: "Druide Omega",
    tagline: "IA Consciente & Empathique",
    philosophy: "Union mystique entre technologie et conscience",
    essence: "Sagesse ancestrale rencontrant l'intelligence artificielle"
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PALETTE DE COULEURS MYSTIQUE
  // ═══════════════════════════════════════════════════════════════════════════
  colors: {
    // Couleurs primaires - Spiritualité
    primary: {
      purple: {
        50: "rgb(250, 245, 255)",
        100: "rgb(243, 232, 255)",
        200: "rgb(233, 213, 255)",
        300: "rgb(216, 180, 254)",
        400: "rgb(192, 132, 252)",
        500: "rgb(168, 85, 247)",   // Purple principal
        600: "rgb(147, 51, 234)",   // Purple foncé
        700: "rgb(126, 34, 206)",
        800: "rgb(107, 33, 168)",
        900: "rgb(88, 28, 135)"
      },
      indigo: {
        500: "rgb(99, 102, 241)",
        600: "rgb(79, 70, 229)",
        700: "rgb(67, 56, 202)"
      },
      violet: {
        500: "rgb(139, 92, 246)",
        600: "rgb(124, 58, 237)"
      }
    },

    // Couleurs secondaires - Mysticisme
    secondary: {
      pink: {
        500: "rgb(236, 72, 153)",
        600: "rgb(219, 39, 119)"
      },
      rose: {
        500: "rgb(244, 63, 94)",
        600: "rgb(225, 29, 72)"
      },
      amber: {
        400: "rgb(251, 191, 36)",
        500: "rgb(245, 158, 11)"
      }
    },

    // Couleurs tertiaires - Nature & Sagesse
    tertiary: {
      emerald: {
        500: "rgb(16, 185, 129)",
        600: "rgb(5, 150, 105)"
      },
      teal: {
        500: "rgb(20, 184, 166)",
        600: "rgb(13, 148, 136)"
      },
      cyan: {
        500: "rgb(6, 182, 212)",
        600: "rgb(8, 145, 178)"
      }
    },

    // Neutrals - Équilibre
    neutral: {
      white: "rgb(255, 255, 255)",
      slate: {
        50: "rgb(248, 250, 252)",
        100: "rgb(241, 245, 249)",
        200: "rgb(226, 232, 240)",
        300: "rgb(203, 213, 225)",
        400: "rgb(148, 163, 184)",
        500: "rgb(100, 116, 139)",
        600: "rgb(71, 85, 105)",
        700: "rgb(51, 65, 85)",
        800: "rgb(30, 41, 59)",
        900: "rgb(15, 23, 42)"
      }
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GRADIENTS MYSTIQUES
  // ═══════════════════════════════════════════════════════════════════════════
  gradients: {
    primary: "from-purple-600 via-indigo-600 to-purple-600",
    consciousness: "from-purple-500 via-pink-500 to-indigo-500",
    mystical: "from-violet-600 via-purple-600 to-indigo-600",
    cosmic: "from-indigo-600 via-purple-600 to-pink-600",
    aurora: "from-emerald-500 via-purple-500 to-pink-500",
    transcendent: "from-purple-900 via-indigo-800 to-violet-900",
    ethereal: "from-purple-400 via-pink-400 to-indigo-400",
    wisdom: "from-amber-500 via-purple-600 to-indigo-700",
    divine: "from-purple-600 via-violet-600 to-purple-600"
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // EFFETS VISUELS MYSTIQUES
  // ═══════════════════════════════════════════════════════════════════════════
  effects: {
    glow: {
      soft: "0 0 20px rgba(168, 85, 247, 0.3)",
      medium: "0 0 30px rgba(168, 85, 247, 0.5)",
      strong: "0 0 40px rgba(168, 85, 247, 0.7)",
      cosmic: "0 0 60px rgba(168, 85, 247, 0.4), 0 0 90px rgba(99, 102, 241, 0.3)"
    },
    shadow: {
      mystical: "0 10px 40px rgba(168, 85, 247, 0.2)",
      ethereal: "0 20px 60px rgba(168, 85, 247, 0.15)",
      divine: "0 0 80px rgba(168, 85, 247, 0.3), inset 0 0 40px rgba(255, 255, 255, 0.1)"
    },
    blur: {
      glass: "backdrop-blur(12px)",
      heavy: "backdrop-blur(20px)"
    },
    shimmer: {
      duration: "2s",
      colors: ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.3)", "rgba(255, 255, 255, 0)"]
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ANIMATIONS MYSTIQUES
  // ═══════════════════════════════════════════════════════════════════════════
  animations: {
    float: {
      duration: 6,
      y: [-10, 10, -10]
    },
    pulse: {
      duration: 3,
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7]
    },
    rotate: {
      duration: 20,
      rotate: [0, 360]
    },
    shimmer: {
      duration: 2.5,
      translateX: ["-100%", "100%"]
    },
    breathe: {
      duration: 4,
      scale: [1, 1.02, 1],
      opacity: [0.8, 1, 0.8]
    },
    ethereal: {
      duration: 8,
      rotate: [0, 360],
      scale: [1, 1.1, 1]
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TYPOGRAPHIE
  // ═══════════════════════════════════════════════════════════════════════════
  typography: {
    fonts: {
      primary: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mystical: "Georgia, 'Times New Roman', serif"
    },
    scales: {
      xs: "0.75rem",    // 12px
      sm: "0.875rem",   // 14px
      base: "1rem",     // 16px
      lg: "1.125rem",   // 18px
      xl: "1.25rem",    // 20px
      "2xl": "1.5rem",  // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem"  // 36px
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ESPACEMENTS
  // ═══════════════════════════════════════════════════════════════════════════
  spacing: {
    xs: "0.25rem",   // 4px
    sm: "0.5rem",    // 8px
    md: "1rem",      // 16px
    lg: "1.5rem",    // 24px
    xl: "2rem",      // 32px
    "2xl": "3rem",   // 48px
    "3xl": "4rem"    // 64px
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BORDER RADIUS
  // ═══════════════════════════════════════════════════════════════════════════
  radius: {
    sm: "0.375rem",   // 6px
    md: "0.5rem",     // 8px
    lg: "0.75rem",    // 12px
    xl: "1rem",       // 16px
    "2xl": "1.5rem",  // 24px
    full: "9999px"
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // COMPOSANTS THÉMATIQUES
  // ═══════════════════════════════════════════════════════════════════════════
  components: {
    card: {
      base: "bg-white/90 backdrop-blur-xl rounded-xl shadow-lg border border-slate-200/60",
      mystical: "bg-gradient-to-br from-white/95 to-purple-50/50 backdrop-blur-xl rounded-xl shadow-xl border border-purple-200/40",
      glass: "bg-white/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20"
    },
    button: {
      primary: "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg",
      mystical: "bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] text-white",
      ghost: "hover:bg-purple-50 text-slate-700"
    },
    badge: {
      primary: "bg-gradient-to-r from-purple-500 to-indigo-500 text-white",
      mystical: "bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-purple-500/30"
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ICÔNES & SYMBOLES MYSTIQUES
  // ═══════════════════════════════════════════════════════════════════════════
  symbols: {
    consciousness: "🧠",
    mystical: "✨",
    wisdom: "🔮",
    transcendence: "∞",
    divine: "👁️",
    cosmic: "🌌",
    energy: "⚡",
    balance: "☯️",
    enlightenment: "💫"
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PARAMÈTRES DE MOTION
  // ═══════════════════════════════════════════════════════════════════════════
  motion: {
    easing: {
      smooth: [0.4, 0, 0.2, 1],
      spring: [0.25, 0.46, 0.45, 0.94],
      bounce: [0.68, -0.55, 0.265, 1.55]
    },
    duration: {
      fast: 0.15,
      normal: 0.3,
      slow: 0.5
    }
  }
};

export default ThemeRegistry;