import { useEffect, useRef, useState } from "react";

/**
 * Dévoilement mot à mot d'un texte déjà complet.
 * Chaque message ne se dévoile QU'UNE FOIS par session : re-rendus, retours
 * sur la page ou défilement ne relancent pas l'animation.
 */
const alreadyRevealed = new Set();

export default function useWordReveal(text, { enabled = true, speed = 45 } = {}) {
  const full = typeof text === "string" ? text : "";
  const key = full.length + "|" + full.slice(0, 80);
  const shouldAnimate = enabled && full.length > 0 && !alreadyRevealed.has(key);

  // On conserve les séparateurs pour restituer la ponctuation et les sauts de ligne.
  const parts = useRef([]);
  parts.current = full.split(/(\s+)/);

  const [count, setCount] = useState(shouldAnimate ? 0 : -1);

  useEffect(() => {
    if (!shouldAnimate) {
      setCount(-1);
      return;
    }
    setCount(0);
    let i = 0;
    const id = setInterval(() => {
      i += 2; // le mot, puis l'espace qui le suit
      if (i >= parts.current.length) {
        clearInterval(id);
        alreadyRevealed.add(key);
        setCount(-1);
      } else {
        setCount(i);
      }
    }, speed);
    return () => clearInterval(id);
  }, [key, shouldAnimate, speed]);

  if (count < 0) return { visible: full, streaming: false };
  return { visible: parts.current.slice(0, count).join(""), streaming: true };
}