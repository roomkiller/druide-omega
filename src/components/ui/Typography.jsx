/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Typography System (Responsive Scale)                       ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";

// Heading - H1 Hero
export function H1({ children, className = "" }) {
  return (
    <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 leading-tight ${className}`}>
      {children}
    </h1>
  );
}

// Heading - H2 Section
export function H2({ children, className = "" }) {
  return (
    <h2 className={`text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 mb-2 sm:mb-3 lg:mb-4 leading-tight ${className}`}>
      {children}
    </h2>
  );
}

// Heading - H3 Subsection
export function H3({ children, className = "" }) {
  return (
    <h3 className={`text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3 leading-snug ${className}`}>
      {children}
    </h3>
  );
}

// Heading - H4 Small Section
export function H4({ children, className = "" }) {
  return (
    <h4 className={`text-base sm:text-lg font-semibold text-gray-900 mb-2 leading-snug ${className}`}>
      {children}
    </h4>
  );
}

// Text - Body
export function Text({ children, size = "default", weight = "normal", color = "default", className = "" }) {
  const sizeClasses = {
    sm: "text-xs sm:text-sm",
    default: "text-sm sm:text-base",
    lg: "text-base sm:text-lg"
  };

  const weightClasses = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold"
  };

  const colorClasses = {
    default: "text-gray-900",
    secondary: "text-gray-600",
    tertiary: "text-gray-500",
    white: "text-white"
  };

  return (
    <p className={`${sizeClasses[size]} ${weightClasses[weight]} ${colorClasses[color]} leading-relaxed mb-2 ${className}`}>
      {children}
    </p>
  );
}

// Caption - Small text
export function Caption({ children, color = "secondary", className = "" }) {
  const colorClasses = {
    secondary: "text-gray-600",
    tertiary: "text-gray-500"
  };

  return (
    <p className={`text-xs sm:text-sm ${colorClasses[color]} leading-normal mb-1 ${className}`}>
      {children}
    </p>
  );
}

// Label - Form labels
export function Label({ children, required = false, className = "" }) {
  return (
    <label className={`text-sm font-medium text-gray-700 mb-1.5 block ${className}`}>
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}