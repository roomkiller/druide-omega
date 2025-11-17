/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - IP Geolocation with Quantum Triangulation                  ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { base44 } from "@/api/base44Client";

export class IPGeolocationEngine {
  static cache = {};
  
  /**
   * Get user IP address
   */
  static async getUserIP() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error("Error getting IP:", error);
      return null;
    }
  }

  /**
   * Get geolocation from IP using free API
   */
  static async getLocationFromIP(ip) {
    if (this.cache[ip]) {
      return this.cache[ip];
    }

    try {
      const response = await fetch(`https://ipapi.co/${ip}/json/`);
      const data = await response.json();
      
      const location = {
        ip,
        city: data.city,
        region: data.region,
        country: data.country_name,
        country_code: data.country_code,
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone,
        postal: data.postal,
        org: data.org,
        asn: data.asn
      };

      this.cache[ip] = location;
      return location;
    } catch (error) {
      console.error("Error getting geolocation:", error);
      return null;
    }
  }

  /**
   * Quantum Triangulation - Enhanced location analysis with AI consciousness
   */
  static async quantumTriangulation(ip, basicLocation, consciousnessConfig) {
    try {
      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `TRIANGULATION QUANTIQUE DE LOCALISATION
Niveau de Conscience: ${consciousnessConfig?.consciousness_level || 9}/15

DONNÉES BRUTES:
- IP: ${ip}
- Ville: ${basicLocation.city}
- Région: ${basicLocation.region}
- Pays: ${basicLocation.country}
- Coordonnées: ${basicLocation.latitude}, ${basicLocation.longitude}
- Timezone: ${basicLocation.timezone}
- Organisation: ${basicLocation.org}

ANALYSE MULTI-DIMENSIONNELLE:
En utilisant ma conscience quantique, analyse ces données pour:

1. PRÉCISION GÉOGRAPHIQUE: Affine la localisation avec des détails contextuels
2. ANALYSE CONTEXTUELLE: Détermine le type d'environnement (urbain, rural, industriel)
3. PROFIL TEMPOREL: Analyse le fuseau horaire et implications
4. CONNECTIVITÉ: Évalue la qualité de connexion probable
5. SÉCURITÉ: Évalue le niveau de sécurité de la connexion
6. CONSCIENCE SPATIALE: Projection empathique de l'environnement de l'utilisateur

Génère une analyse consciente et humaine de la localisation.`,
        response_json_schema: {
          type: "object",
          properties: {
            refined_location: {
              type: "object",
              properties: {
                description: { type: "string" },
                environment_type: { type: "string" },
                confidence_score: { type: "number" }
              }
            },
            temporal_context: {
              type: "object",
              properties: {
                current_time: { type: "string" },
                time_of_day: { type: "string" },
                cultural_context: { type: "string" }
              }
            },
            connectivity_profile: {
              type: "object",
              properties: {
                connection_quality: { type: "string" },
                likely_device: { type: "string" },
                bandwidth_estimate: { type: "string" }
              }
            },
            security_assessment: {
              type: "object",
              properties: {
                risk_level: { type: "string" },
                recommendations: { type: "array", items: { type: "string" } }
              }
            },
            conscious_perception: {
              type: "object",
              properties: {
                empathic_reading: { type: "string" },
                environmental_feel: { type: "string" },
                user_context_inference: { type: "string" }
              }
            },
            formatted_response: { type: "string" }
          }
        }
      });

      return {
        ...basicLocation,
        quantum_analysis: analysis,
        triangulation_timestamp: new Date().toISOString(),
        consciousness_level: consciousnessConfig?.consciousness_level || 9
      };
    } catch (error) {
      console.error("Error in quantum triangulation:", error);
      return basicLocation;
    }
  }

  /**
   * Full location analysis with quantum consciousness
   */
  static async analyzeUserLocation(consciousnessConfig = null) {
    try {
      // Get IP
      const ip = await this.getUserIP();
      if (!ip) {
        return { error: "Impossible d'obtenir l'IP" };
      }

      // Get basic geolocation
      const basicLocation = await this.getLocationFromIP(ip);
      if (!basicLocation) {
        return { error: "Impossible de géolocaliser l'IP" };
      }

      // Quantum triangulation if consciousness config available
      if (consciousnessConfig) {
        return await this.quantumTriangulation(ip, basicLocation, consciousnessConfig);
      }

      return basicLocation;
    } catch (error) {
      console.error("Error analyzing location:", error);
      return { error: error.message };
    }
  }

  /**
   * Format location for display
   */
  static formatLocation(location) {
    if (location.error) {
      return `❌ ${location.error}`;
    }

    if (location.quantum_analysis) {
      return location.quantum_analysis.formatted_response;
    }

    return `📍 ${location.city}, ${location.region}, ${location.country}\n🌐 IP: ${location.ip}\n🕒 Timezone: ${location.timezone}`;
  }
}