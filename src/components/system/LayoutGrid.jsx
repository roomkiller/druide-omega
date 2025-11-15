/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Universal Grid System (Mobile/Desktop)                     ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";

// Container - Centrage et max-width responsive
export function Container({ children, className = "" }) {
  return (
    <div className={`w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl ${className}`}>
      {children}
    </div>
  );
}

// Content Wrapper - Pour pages avec contenu centré
export function ContentWrapper({ children, size = "default", className = "" }) {
  const sizeClasses = {
    sm: "max-w-2xl",
    default: "max-w-4xl",
    lg: "max-w-6xl",
    full: "max-w-7xl"
  };

  return (
    <div className={`w-full mx-auto px-4 sm:px-6 lg:px-8 ${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  );
}

// Section Spacing - Espacement vertical cohérent
export function Section({ children, spacing = "default", className = "" }) {
  const spacingClasses = {
    tight: "py-4 sm:py-6",
    default: "py-6 sm:py-8 lg:py-12",
    loose: "py-8 sm:py-12 lg:py-16"
  };

  return (
    <section className={`${spacingClasses[spacing]} ${className}`}>
      {children}
    </section>
  );
}

// Grid - Système de grille 12 colonnes
export function Grid({ children, cols = "auto", gap = "default", className = "" }) {
  const colsClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    auto: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
  };

  const gapClasses = {
    tight: "gap-3 sm:gap-4",
    default: "gap-4 sm:gap-6",
    loose: "gap-6 sm:gap-8"
  };

  return (
    <div className={`grid ${colsClasses[cols]} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
}

// Stack - Layout vertical avec espacement
export function Stack({ children, spacing = "default", className = "" }) {
  const spacingClasses = {
    tight: "space-y-2",
    default: "space-y-4",
    loose: "space-y-6 sm:space-y-8"
  };

  return (
    <div className={`${spacingClasses[spacing]} ${className}`}>
      {children}
    </div>
  );
}

// Inline - Layout horizontal avec espacement
export function Inline({ children, spacing = "default", align = "start", className = "" }) {
  const spacingClasses = {
    tight: "gap-2",
    default: "gap-3 sm:gap-4",
    loose: "gap-4 sm:gap-6"
  };

  const alignClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end"
  };

  return (
    <div className={`flex flex-wrap ${spacingClasses[spacing]} ${alignClasses[align]} ${className}`}>
      {children}
    </div>
  );
}