/**
 * Optimiseur de transitions intelligentes
 * Crée des transitions fluides entre frames
 */

export class TransitionOptimizer {
  static TRANSITION_TYPES = {
    fade: { duration: 200, easing: "ease-in-out" },
    dissolve: { duration: 300, easing: "ease-in-out" },
    crossfade: { duration: 250, easing: "linear" },
    slideLeft: { duration: 400, easing: "ease-out" },
    slideRight: { duration: 400, easing: "ease-out" },
    zoomIn: { duration: 300, easing: "ease-out" },
    zoomOut: { duration: 300, easing: "ease-in" },
  };

  /**
   * Sélectionne la meilleure transition entre 2 frames
   */
  static selectOptimalTransition(frameA, frameB, style) {
    // Logique intelligente de sélection
    const styleTransitions = {
      cinematic: ["dissolve", "crossfade", "slideLeft"],
      artistic: ["fade", "zoomIn", "zoomOut"],
      abstract: ["crossfade", "fade"],
      surreal: ["dissolve", "slideLeft", "slideRight"],
    };

    const available = styleTransitions[style] || ["fade"];
    return available[Math.floor(Math.random() * available.length)];
  }

  /**
   * Génère configuration de transitions pour une séquence
   */
  static generateTransitionMap(frames, style) {
    const transitions = {};

    for (let i = 0; i < frames.length - 1; i++) {
      const type = this.selectOptimalTransition(frames[i], frames[i + 1], style);
      const config = this.TRANSITION_TYPES[type];

      transitions[i] = {
        type,
        duration: config.duration,
        easing: config.easing,
        startFrame: i,
        endFrame: i + 1,
      };
    }

    return transitions;
  }

  /**
   * Calcule duration optimale basée sur FPS
   */
  static optimizeDuration(duration, fps) {
    const frameDuration = 1000 / fps;
    return Math.ceil(duration / frameDuration) * frameDuration;
  }
}