/**
 * economyMode.js — Mode économie global.
 *
 * Quand activé, les mécanismes de fond gourmands en crédits (génération
 * automatique de pensées, etc.) sont mis en pause. Les actions manuelles
 * restent disponibles — aucune fonctionnalité n'est supprimée.
 *
 * Persistance : localStorage. Synchronisation entre composants via CustomEvent.
 */
import { useState, useEffect, useCallback } from 'react';

const KEY = 'druide_economy_mode';
const EVENT = 'druide:economy-mode';

export function isEconomyMode() {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

export function setEconomyMode(on) {
  try {
    localStorage.setItem(KEY, on ? '1' : '0');
    window.dispatchEvent(new CustomEvent(EVENT, { detail: on }));
  } catch {
    /* ignore */
  }
}

export function useEconomyMode() {
  const [economyMode, setMode] = useState(isEconomyMode);

  useEffect(() => {
    const handler = (e) => setMode(e.detail);
    window.addEventListener(EVENT, handler);
    return () => window.removeEventListener(EVENT, handler);
  }, []);

  const toggle = useCallback(() => setEconomyMode(!isEconomyMode()), []);

  return { economyMode, setEconomyMode, toggle };
}