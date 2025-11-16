/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Regulatory Compliance Documentation                        ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/utils/LanguageContext";
import { Shield, CheckCircle, Globe, FileCheck, Lock, AlertTriangle } from "lucide-react";

export default function RegulatoryCompliance() {
  const { language } = useLanguage();

  const content = {
    fr: {
      title: "Conformité Réglementaire",
      subtitle: "RGPD, CCPA, Loi 25 - Garanties de conformité",
      
      regulations: [
        {
          name: "RGPD (UE)",
          region: "Union Européenne",
          icon: Globe,
          color: "blue",
          description: "Règlement Général sur la Protection des Données",
          compliance: [
            "Consentement explicite pour traitement des données",
            "Droit d'accès, rectification et portabilité",
            "Droit à l'effacement (droit à l'oubli)",
            "Notification de violation sous 72h",
            "Désignation d'un DPO (Data Protection Officer)",
            "Privacy by Design & by Default",
            "Transferts internationaux sécurisés",
            "Registre des traitements maintenu"
          ],
          measures: [
            "Chiffrement AES-256 bout-en-bout",
            "Pseudonymisation des données personnelles",
            "RLS (Row Level Security) stricte",
            "Audits de sécurité trimestriels",
            "Formation RGPD pour toute l'équipe"
          ]
        },
        {
          name: "CCPA (USA)",
          region: "Californie, États-Unis",
          icon: Shield,
          color: "purple",
          description: "California Consumer Privacy Act",
          compliance: [
            "Droit de savoir quelles données sont collectées",
            "Droit de supprimer ses données",
            "Droit de refuser la vente de données (opt-out)",
            "Droit à la non-discrimination",
            "Transparence totale sur utilisation des données",
            "Notification obligatoire en cas de violation"
          ],
          measures: [
            "Aucune vente de données personnelles",
            "Interface de suppression de compte",
            "Politique de confidentialité claire",
            "Processus de demande de données simplifié",
            "Conformité vérifiée par audit externe"
          ]
        },
        {
          name: "Loi 25 (Québec)",
          region: "Québec, Canada",
          icon: FileCheck,
          color: "green",
          description: "Loi modernisant les dispositions législatives en matière de protection des renseignements personnels",
          compliance: [
            "Consentement éclairé pour collecte",
            "Finalité déterminée et légitime",
            "Minimisation de la collecte",
            "Conservation limitée dans le temps",
            "Sécurité renforcée des données",
            "Évaluation des facteurs relatifs à la vie privée (EFVP)",
            "Registre des incidents obligatoire",
            "Notification à la CNIL Québec en cas de violation"
          ],
          measures: [
            "Chiffrement conforme aux normes canadiennes",
            "Hébergement de données au Canada (option disponible)",
            "EFVP réalisée et documentée",
            "Formation Loi 25 pour personnel québécois",
            "Politique bilingue FR/EN"
          ]
        }
      ],

      certifications: {
        title: "Certifications & Standards",
        items: [
          { name: "ISO 27001", status: "planned", description: "Système de management sécurité de l'information" },
          { name: "SOC 2 Type II", status: "planned", description: "Sécurité, disponibilité, intégrité" },
          { name: "PCI-DSS", status: "planned", description: "Sécurité des paiements (si applicable)" }
        ]
      },

      technicalMeasures: {
        title: "Mesures Techniques de Sécurité",
        measures: [
          {
            category: "Chiffrement",
            items: [
              "AES-256 pour données au repos",
              "TLS 1.3 pour données en transit",
              "Clés de chiffrement rotatives",
              "Chiffrement bout-en-bout pour données sensibles"
            ]
          },
          {
            category: "Authentification",
            items: [
              "JWT avec expiration courte",
              "Refresh tokens sécurisés",
              "2FA disponible (à venir)",
              "SSO pour entreprises (à venir)"
            ]
          },
          {
            category: "Accès aux Données",
            items: [
              "RLS (Row Level Security) PostgreSQL",
              "Principe du moindre privilège",
              "Logs d'accès complets",
              "Revue d'accès trimestrielle"
            ]
          },
          {
            category: "Infrastructure",
            items: [
              "Hébergement sécurisé (Base44)",
              "Backups quotidiens chiffrés",
              "Disaster recovery plan",
              "Monitoring 24/7"
            ]
          }
        ]
      },

      dataRetention: {
        title: "Politique de Rétention des Données",
        periods: [
          { type: "Conversations", duration: "90 jours par défaut (configurable)", deletion: "Automatique ou manuelle" },
          { type: "Mémoires", duration: "Indéfini (contrôle utilisateur)", deletion: "Manuelle uniquement" },
          { type: "Base de Connaissances", duration: "Indéfini (contrôle utilisateur)", deletion: "Manuelle uniquement" },
          { type: "Logs d'audit", duration: "1 an", deletion: "Automatique" },
          { type: "Données de compte", duration: "Jusqu'à suppression compte", deletion: "Manuelle (droit à l'oubli)" }
        ]
      },

      userRights: {
        title: "Droits des Utilisateurs",
        rights: [
          { right: "Droit d'accès", description: "Obtenir une copie de toutes vos données", howTo: "Demande via interface ou email" },
          { right: "Droit de rectification", description: "Corriger vos données inexactes", howTo: "Modification directe dans l'interface" },
          { right: "Droit à l'effacement", description: "Supprimer définitivement vos données", howTo: "Suppression de compte dans Paramètres" },
          { right: "Droit à la portabilité", description: "Recevoir vos données en format lisible", howTo: "Export JSON/CSV disponible" },
          { right: "Droit d'opposition", description: "S'opposer au traitement de vos données", howTo: "Désactivation fonctionnalités ou suppression compte" },
          { right: "Droit de limitation", description: "Limiter le traitement temporairement", howTo: "Désactivation temporaire possible" }
        ]
      }
    },

    en: {
      title: "Regulatory Compliance",
      subtitle: "GDPR, CCPA, Bill 25 - Compliance guarantees",
      
      regulations: [
        {
          name: "GDPR (EU)",
          region: "European Union",
          icon: Globe,
          color: "blue",
          description: "General Data Protection Regulation",
          compliance: [
            "Explicit consent for data processing",
            "Right to access, rectification and portability",
            "Right to erasure (right to be forgotten)",
            "Breach notification within 72h",
            "DPO (Data Protection Officer) designation",
            "Privacy by Design & by Default",
            "Secure international transfers",
            "Processing registry maintained"
          ],
          measures: [
            "AES-256 end-to-end encryption",
            "Personal data pseudonymization",
            "Strict RLS (Row Level Security)",
            "Quarterly security audits",
            "GDPR training for entire team"
          ]
        },
        {
          name: "CCPA (USA)",
          region: "California, United States",
          icon: Shield,
          color: "purple",
          description: "California Consumer Privacy Act",
          compliance: [
            "Right to know what data is collected",
            "Right to delete data",
            "Right to opt-out of data sale",
            "Right to non-discrimination",
            "Full transparency on data use",
            "Mandatory breach notification"
          ],
          measures: [
            "No sale of personal data",
            "Account deletion interface",
            "Clear privacy policy",
            "Simplified data request process",
            "Compliance verified by external audit"
          ]
        },
        {
          name: "Bill 25 (Quebec)",
          region: "Quebec, Canada",
          icon: FileCheck,
          color: "green",
          description: "Act to modernize legislative provisions on personal information protection",
          compliance: [
            "Informed consent for collection",
            "Determined and legitimate purpose",
            "Collection minimization",
            "Limited retention period",
            "Enhanced data security",
            "Privacy impact assessment (PIA)",
            "Mandatory incident registry",
            "Notification to Quebec CNIL on breach"
          ],
          measures: [
            "Encryption compliant with Canadian standards",
            "Data hosting in Canada (option available)",
            "PIA completed and documented",
            "Bill 25 training for Quebec personnel",
            "Bilingual FR/EN policy"
          ]
        }
      ],

      certifications: {
        title: "Certifications & Standards",
        items: [
          { name: "ISO 27001", status: "planned", description: "Information security management system" },
          { name: "SOC 2 Type II", status: "planned", description: "Security, availability, integrity" },
          { name: "PCI-DSS", status: "planned", description: "Payment security (if applicable)" }
        ]
      },

      technicalMeasures: {
        title: "Technical Security Measures",
        measures: [
          {
            category: "Encryption",
            items: [
              "AES-256 for data at rest",
              "TLS 1.3 for data in transit",
              "Rotating encryption keys",
              "End-to-end encryption for sensitive data"
            ]
          },
          {
            category: "Authentication",
            items: [
              "JWT with short expiration",
              "Secure refresh tokens",
              "2FA available (coming soon)",
              "SSO for enterprises (coming soon)"
            ]
          },
          {
            category: "Data Access",
            items: [
              "PostgreSQL RLS (Row Level Security)",
              "Principle of least privilege",
              "Complete access logs",
              "Quarterly access review"
            ]
          },
          {
            category: "Infrastructure",
            items: [
              "Secure hosting (Base44)",
              "Encrypted daily backups",
              "Disaster recovery plan",
              "24/7 monitoring"
            ]
          }
        ]
      },

      dataRetention: {
        title: "Data Retention Policy",
        periods: [
          { type: "Conversations", duration: "90 days default (configurable)", deletion: "Automatic or manual" },
          { type: "Memories", duration: "Indefinite (user control)", deletion: "Manual only" },
          { type: "Knowledge Base", duration: "Indefinite (user control)", deletion: "Manual only" },
          { type: "Audit logs", duration: "1 year", deletion: "Automatic" },
          { type: "Account data", duration: "Until account deletion", deletion: "Manual (right to erasure)" }
        ]
      },

      userRights: {
        title: "User Rights",
        rights: [
          { right: "Right to access", description: "Obtain copy of all your data", howTo: "Request via interface or email" },
          { right: "Right to rectification", description: "Correct inaccurate data", howTo: "Direct modification in interface" },
          { right: "Right to erasure", description: "Permanently delete your data", howTo: "Account deletion in Settings" },
          { right: "Right to portability", description: "Receive data in readable format", howTo: "JSON/CSV export available" },
          { right: "Right to object", description: "Object to data processing", howTo: "Disable features or delete account" },
          { right: "Right to restriction", description: "Temporarily limit processing", howTo: "Temporary deactivation possible" }
        ]
      }
    }
  };

  const t = content[language === 'en' ? 'en' : 'fr'];

  const colorMap = {
    blue: "from-blue-500 to-indigo-600",
    purple: "from-purple-500 to-violet-600",
    green: "from-green-500 to-emerald-600"
  };

  const statusColors = {
    active: "bg-green-100 text-green-700",
    planned: "bg-orange-100 text-orange-700"
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-green-50/30 to-emerald-50/30 overflow-hidden">
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 py-4 sm:py-6 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
              <FileCheck className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{t.title}</h1>
              <p className="text-sm sm:text-base text-slate-600">{t.subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
          {t.regulations.map((reg, idx) => {
            const Icon = reg.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="p-6 sm:p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`w-12 h-12 bg-gradient-to-br ${colorMap[reg.color]} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-xl font-bold text-slate-900">{reg.name}</h2>
                        <Badge variant="outline">{reg.region}</Badge>
                      </div>
                      <p className="text-sm text-slate-600">{reg.description}</p>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-3">{language === 'en' ? "Compliance Points" : "Points de Conformité"}</h3>
                      <div className="space-y-2">
                        {reg.compliance.map((point, i) => (
                          <div key={i} className="flex items-start gap-2 p-2 bg-slate-50 rounded">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-slate-700">{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-900 mb-3">{language === 'en' ? "Our Measures" : "Nos Mesures"}</h3>
                      <div className="space-y-2">
                        {reg.measures.map((measure, i) => (
                          <div key={i} className="flex items-start gap-2 p-2 bg-green-50 rounded">
                            <Shield className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-slate-700">{measure}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="p-6 sm:p-8 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
              <h2 className="text-xl font-bold text-slate-900 mb-6">{t.certifications.title}</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {t.certifications.items.map((cert, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-lg border border-indigo-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-slate-900">{cert.name}</h3>
                      <Badge className={statusColors[cert.status]}>{cert.status}</Badge>
                    </div>
                    <p className="text-xs text-slate-600">{cert.description}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-slate-900">{t.technicalMeasures.title}</h2>
              </div>
              <div className="grid lg:grid-cols-2 gap-6">
                {t.technicalMeasures.measures.map((category, idx) => (
                  <div key={idx}>
                    <h3 className="font-semibold text-slate-900 mb-3">{category.category}</h3>
                    <ul className="space-y-2">
                      {category.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                          <span className="text-blue-600 mt-0.5">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Card className="p-6 sm:p-8 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
              <h2 className="text-xl font-bold text-slate-900 mb-6">{t.dataRetention.title}</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-amber-200">
                      <th className="text-left py-2 font-semibold">{language === 'en' ? "Type" : "Type"}</th>
                      <th className="text-left py-2 font-semibold">{language === 'en' ? "Duration" : "Durée"}</th>
                      <th className="text-left py-2 font-semibold">{language === 'en' ? "Deletion" : "Suppression"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {t.dataRetention.periods.map((period, idx) => (
                      <tr key={idx} className="border-b border-amber-100">
                        <td className="py-2 font-medium">{period.type}</td>
                        <td className="py-2">{period.duration}</td>
                        <td className="py-2">{period.deletion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <Card className="p-6 sm:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">{t.userRights.title}</h2>
              <div className="space-y-4">
                {t.userRights.rights.map((right, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-lg">
                    <h3 className="font-semibold text-slate-900 mb-2">{right.right}</h3>
                    <p className="text-sm text-slate-600 mb-2">{right.description}</p>
                    <p className="text-xs text-indigo-600">{language === 'en' ? "How:" : "Comment :"} {right.howTo}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </ScrollArea>
    </div>
  );
}