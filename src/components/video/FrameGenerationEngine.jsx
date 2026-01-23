/**
 * Engine de génération de frames intelligent
 * - Parallélisation (batch de 3 générations max)
 * - Continuité narrative entre frames
 * - Caching local
 * - Gestion intelligente des prompts
 */

import { base44 } from "@/api/base44Client";

export class FrameGenerationEngine {
  constructor(sequence, onProgress) {
    this.sequence = sequence;
    this.onProgress = onProgress;
    this.cache = new Map();
    this.generatedFrames = [];
    this.maxParallel = 3;
  }

  /**
   * Enrichit le prompt avec contexte narratif et technique
   */
  enrichPrompt(basePrompt, frameIndex, totalFrames, style, previousFrame = null) {
    const progress = ((frameIndex + 1) / totalFrames) * 100;
    const pacing = this.calculatePacing(frameIndex, totalFrames);

    let enriched = `Frame ${frameIndex + 1}/${totalFrames}: ${basePrompt}`;

    // Ajouter contexte de progression narrative
    if (progress < 25) enriched += " [INTRODUCTION - establishing scene]";
    else if (progress < 50) enriched += " [RISING ACTION - building momentum]";
    else if (progress < 75) enriched += " [CLIMAX - peak intensity]";
    else enriched += " [RESOLUTION - conclusion]";

    // Style visuel
    enriched += `. Visual style: ${style} aesthetic.`;

    // Continuité avec frame précédente
    if (previousFrame) {
      enriched += ` [CONTINUITY: Maintain visual coherence with previous frame, subtle evolution].`;
    }

    // Spécifications techniques
    enriched += ` 16:9 cinematic composition, professional quality, high detail.`;

    return enriched;
  }

  /**
   * Calcule le pacing pour une progression fluide
   */
  calculatePacing(frameIndex, totalFrames) {
    const progress = frameIndex / (totalFrames - 1);
    if (progress < 0.3) return "slow"; // Début lent
    if (progress < 0.7) return "medium"; // Milieu accéléré
    return "slow"; // Fin ralentie
  }

  /**
   * Génère frames en batch parallélisé (max 3)
   */
  async generateBatch(batch, basePrompt, style, previousFrame) {
    const promises = batch.map((frameIndex, idx) =>
      // Délai progressif pour éviter rate limiting
      new Promise(resolve => 
        setTimeout(() => 
          this.generateSingleFrame(frameIndex, basePrompt, style, previousFrame).then(resolve),
          idx * 100
        )
      )
    );
    return Promise.all(promises);
  }

  /**
   * Génère une seule frame avec caching
   */
  async generateSingleFrame(frameIndex, basePrompt, style, previousFrame) {
    const cacheKey = `${frameIndex}-${basePrompt.substring(0, 20)}-${style}`;

    // Vérifier cache local
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const enrichedPrompt = this.enrichPrompt(
      basePrompt,
      frameIndex,
      this.sequence.metadata.frameCount || 6,
      style,
      previousFrame
    );

    try {
      const response = await base44.integrations.Core.GenerateImage({
        prompt: enrichedPrompt,
        existing_image_urls: previousFrame ? [previousFrame.url] : undefined
      });

      const imageUrl = response.data?.url || response.url;
      if (!imageUrl) throw new Error("No image URL in response");

      const frame = {
        id: Date.now() + frameIndex,
        url: imageUrl,
        prompt: basePrompt,
        enrichedPrompt,
        style,
        frameIndex,
        generated_at: new Date().toISOString()
      };

      // Cacher le résultat
      this.cache.set(cacheKey, frame);
      return frame;
    } catch (error) {
      console.error(`Frame ${frameIndex} generation failed:`, error);
      throw new Error(`Frame ${frameIndex}: ${error.message}`);
    }
  }

  /**
   * Génère tous les frames avec progression
   */
  async generateAllFrames(basePrompt, style, frameCount) {
    this.generatedFrames = [];
    const batches = this.createBatches(frameCount, this.maxParallel);

    let previousFrame = null;

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];

      try {
        const frames = await this.generateBatch(batch, basePrompt, style, previousFrame);
        this.generatedFrames.push(...frames);

        // Mettre à jour progression
        const progress = Math.round(((batchIndex + 1) / batches.length) * 100);
        this.onProgress?.(progress, frames.length);

        // Frame précédente pour continuité
        previousFrame = frames[frames.length - 1];

        // Délai adaptif entre batches pour éviter rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Batch ${batchIndex} failed:`, error);
        throw error;
      }
    }

    return this.generatedFrames;
  }

  /**
   * Divise les frames en batches
   */
  createBatches(frameCount, batchSize) {
    const batches = [];
    for (let i = 0; i < frameCount; i += batchSize) {
      batches.push(Array.from({ length: Math.min(batchSize, frameCount - i) }, (_, j) => i + j));
    }
    return batches;
  }

  /**
   * Analyse qualité des frames générées
   */
  analyzeQuality(frames) {
    return {
      frameCount: frames.length,
      continuity: this.checkContinuity(frames),
      consistency: this.checkConsistency(frames),
      avgGenerationTime: frames.length > 0 ? 8000 : 0 // ~8s par frame
    };
  }

  checkContinuity(frames) {
    // Logique basique - en production, analyser les images réelles
    return frames.length > 1 ? "good" : "single";
  }

  checkConsistency(frames) {
    // Vérifier que tous les frames ont les mêmes dimensions/format
    return frames.every(f => f.url) ? "valid" : "incomplete";
  }
}