/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - WCAG 2.1 AA Compliance Wrapper                             ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useEffect } from "react";

export default function AccessibilityWrapper({ children }) {
  useEffect(() => {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-purple-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg';
    skipLink.textContent = 'Aller au contenu principal';
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Announce page changes to screen readers
    const announcer = document.createElement('div');
    announcer.setAttribute('role', 'status');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.id = 'a11y-announcer';
    document.body.appendChild(announcer);

    return () => {
      skipLink.remove();
      announcer.remove();
    };
  }, []);

  return (
    <div id="main-content" role="main">
      {children}
    </div>
  );
}

// Utility to announce messages to screen readers
export function announceToScreenReader(message) {
  const announcer = document.getElementById('a11y-announcer');
  if (announcer) {
    announcer.textContent = message;
    setTimeout(() => {
      announcer.textContent = '';
    }, 1000);
  }
}

// Utility for keyboard navigation
export function useKeyboardNavigation(handlers) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (handlers[e.key]) {
        e.preventDefault();
        handlers[e.key]();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}