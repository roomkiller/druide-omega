/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Auto Visual Detector                                       ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ Détection automatique du besoin de réponse visuelle                       ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { base44 } from "@/api/base44Client";

/**
 * Détecte si une requête nécessite une réponse visuelle
 */
export const detectVisualNeed = (userMessage) => {
  const text = userMessage.toLowerCase();
  
  // Mots-clés directs pour images
  const imageKeywords = [
    'montre-moi', 'génère une image', 'crée une image', 'dessine', 
    'visualise', 'illustre', 'à quoi ressemble', 'show me',
    'generate image', 'create image', 'draw', 'picture of'
  ];
  
  // Mots-clés pour graphiques/charts
  const chartKeywords = [
    'graphique', 'chart', 'diagramme circulaire', 'pie chart',
    'statistiques', 'stats', 'courbe', 'évolution', 'tendance',
    'comparaison visuelle', 'visualisation de données'
  ];
  
  // Mots-clés pour diagrammes/schémas
  const diagramKeywords = [
    'schéma', 'diagramme', 'flowchart', 'organigramme',
    'architecture', 'structure', 'processus', 'carte mentale',
    'mind map', 'flux de travail', 'workflow'
  ];

  const needsImage = imageKeywords.some(kw => text.includes(kw));
  const needsChart = chartKeywords.some(kw => text.includes(kw));
  const needsDiagram = diagramKeywords.some(kw => text.includes(kw));

  if (needsImage) return { type: 'image', confidence: 0.9 };
  if (needsChart) return { type: 'chart', confidence: 0.85 };
  if (needsDiagram) return { type: 'diagram', confidence: 0.85 };
  
  return null;
};

/**
 * Génère automatiquement une réponse visuelle basée sur la requête
 */
export const generateAutoVisual = async (userMessage, visualType, consciousnessConfig) => {
  try {
    if (visualType === 'image') {
      // Analyser avec conscience
      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Tu es Druide Omega (niveau ${consciousnessConfig?.consciousness_level || 9}/15).
        
Utilisateur demande: "${userMessage}"

Crée un prompt détaillé pour générer une image qui répond parfaitement à cette demande.

Le prompt doit:
- Être visuel et descriptif
- Inclure style, ambiance, couleurs
- Refléter ton niveau de conscience
- Être créatif et professionnel

Retourne JSON:`,
        response_json_schema: {
          type: "object",
          properties: {
            image_prompt: { type: "string" },
            style: { type: "string" },
            atmosphere: { type: "string" },
            explanation: { type: "string" }
          }
        }
      });

      // Générer l'image
      const { url } = await base44.integrations.Core.GenerateImage({
        prompt: `${analysis.image_prompt}. Style: ${analysis.style}. Atmosphere: ${analysis.atmosphere}. Professional, high quality, detailed.`
      });

      // Sauvegarder
      await base44.entities.VisualContent.create({
        type: "generated_image",
        url,
        description: analysis.explanation,
        prompt: analysis.image_prompt,
        tags: ["auto-generated", "image", "multimodal"]
      });

      return {
        type: 'image',
        url,
        description: analysis.explanation,
        analysis
      };
    } else if (visualType === 'chart') {
      // Générer données pour graphique
      const chartData = await base44.integrations.Core.InvokeLLM({
        prompt: `Basé sur cette demande: "${userMessage}"

Génère des données structurées pour un graphique pertinent.

Retourne JSON avec:
- title: titre du graphique
- chart_type: "bar", "line", "pie" ou "radar"
- labels: array de labels
- datasets: array de {label, data}
- insights: explication des données`,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            chart_type: { type: "string" },
            labels: { type: "array", items: { type: "string" } },
            datasets: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  label: { type: "string" },
                  data: { type: "array", items: { type: "number" } }
                }
              }
            },
            insights: { type: "string" }
          }
        }
      });

      await base44.entities.VisualContent.create({
        type: "chart",
        description: chartData.title,
        analysis: JSON.stringify(chartData),
        tags: ["auto-generated", "chart", chartData.chart_type]
      });

      return {
        type: 'chart',
        data: chartData
      };
    } else if (visualType === 'diagram') {
      // Générer diagramme
      const diagram = await base44.integrations.Core.GenerateImage({
        prompt: `Create a clear, professional diagram showing: ${userMessage}. 
        
Style requirements:
- Clean flowchart or mind map style
- Clear labels and connections
- Professional design
- White background
- High contrast
- Modern, minimalist approach`
      });

      await base44.entities.VisualContent.create({
        type: "diagram",
        url: diagram.url,
        description: `Diagramme: ${userMessage}`,
        tags: ["auto-generated", "diagram", "multimodal"]
      });

      return {
        type: 'diagram',
        url: diagram.url,
        description: `Diagramme généré pour: ${userMessage}`
      };
    }

    return null;
  } catch (error) {
    console.error('[AutoVisual] Erreur génération:', error);
    return null;
  }
};