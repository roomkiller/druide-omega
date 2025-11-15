/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Content Filter (Real-time Protection)                      ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { base44 } from "@/api/base44Client";

export class ContentFilter {
  static sensitivePatterns = {
    // Informations personnelles
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    phone: /\b(?:\+33|0)[1-9](?:[0-9]{8})\b/g,
    credit_card: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
    ssn: /\b\d{15}\b/g,
    
    // Données sensibles
    password: /(?:mot de passe|password|mdp)[\s:=]+[\S]+/gi,
    api_key: /(?:api[_-]?key|token|bearer)[\s:=]+[\S]+/gi,
    
    // Injections
    sql_injection: /(?:union|select|insert|update|delete|drop|create)[\s]+(?:from|into|table)/gi,
    xss: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    
    // Malicious
    malware_keywords: /\b(?:exploit|payload|shellcode|backdoor|rootkit)\b/gi
  };

  static async filterContent(content, options = {}) {
    const {
      autoRedact = true,
      strictMode = false,
      logViolations = true
    } = options;

    const violations = [];
    let filteredContent = content;
    let threatLevel = "none";

    // Détection de patterns sensibles
    for (const [category, pattern] of Object.entries(this.sensitivePatterns)) {
      const matches = content.match(pattern);
      
      if (matches) {
        violations.push({
          category,
          count: matches.length,
          severity: this.getSeverity(category),
          matches: strictMode ? matches : []
        });

        // Auto-redaction si activé
        if (autoRedact) {
          filteredContent = filteredContent.replace(pattern, (match) => {
            return "[REDACTED]";
          });
        }

        // Mise à jour du niveau de menace
        const severity = this.getSeverity(category);
        if (this.compareSeverity(severity, threatLevel) > 0) {
          threatLevel = severity;
        }
      }
    }

    // Logging des violations
    if (logViolations && violations.length > 0) {
      await this.logSecurityEvent({
        event_type: "content_filter_violation",
        violations,
        threat_level: threatLevel,
        original_length: content.length,
        filtered_length: filteredContent.length
      });
    }

    return {
      original: content,
      filtered: filteredContent,
      violations,
      threatLevel,
      isSafe: violations.length === 0,
      requiresReview: threatLevel === "high" || threatLevel === "critical"
    };
  }

  static getSeverity(category) {
    const severityMap = {
      password: "critical",
      api_key: "critical",
      credit_card: "high",
      ssn: "high",
      sql_injection: "high",
      xss: "high",
      malware_keywords: "high",
      email: "medium",
      phone: "medium"
    };
    return severityMap[category] || "low";
  }

  static compareSeverity(s1, s2) {
    const levels = { none: 0, low: 1, medium: 2, high: 3, critical: 4 };
    return levels[s1] - levels[s2];
  }

  static async logSecurityEvent(event) {
    try {
      // Log dans les analytics
      const user = await base44.auth.me();
      
      await base44.entities.AnalyticsEvent.create({
        event_type: event.event_type,
        metadata: {
          violations: event.violations,
          threat_level: event.threat_level,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error("Erreur logging événement sécurité:", error);
    }
  }

  static async anonymizeData(data) {
    let anonymized = data;

    // Anonymiser les emails
    anonymized = anonymized.replace(
      this.sensitivePatterns.email,
      (match) => {
        const [user, domain] = match.split("@");
        return `${user.charAt(0)}***@${domain}`;
      }
    );

    // Anonymiser les téléphones
    anonymized = anonymized.replace(
      this.sensitivePatterns.phone,
      (match) => `${match.substring(0, 4)}******`
    );

    // Anonymiser les cartes bancaires
    anonymized = anonymized.replace(
      this.sensitivePatterns.credit_card,
      "****-****-****-****"
    );

    return anonymized;
  }

  static async encryptSensitiveData(data) {
    // Dans un environnement de production, utiliser une vraie bibliothèque de chiffrement
    // Ici, simulation basique
    try {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      
      // Simulation de hash (utiliser crypto.subtle.encrypt en prod)
      const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      return {
        encrypted: true,
        hash: hashHex,
        algorithm: "SHA-256",
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error("Erreur chiffrement:", error);
      return { encrypted: false, error: error.message };
    }
  }

  static validateInput(input) {
    const checks = {
      hasInjection: false,
      hasXSS: false,
      hasMalicious: false,
      isSafe: true
    };

    // Vérification injections SQL
    if (this.sensitivePatterns.sql_injection.test(input)) {
      checks.hasInjection = true;
      checks.isSafe = false;
    }

    // Vérification XSS
    if (this.sensitivePatterns.xss.test(input)) {
      checks.hasXSS = true;
      checks.isSafe = false;
    }

    // Vérification contenu malveillant
    if (this.sensitivePatterns.malware_keywords.test(input)) {
      checks.hasMalicious = true;
      checks.isSafe = false;
    }

    return checks;
  }
}