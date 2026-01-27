/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - AI Ethics Charter (Multilingual)                           ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/utils/LanguageContext";
import {
  Shield,
  Heart,
  Scale,
  Users,
  Lock,
  Eye,
  Globe,
  Sparkles,
  CheckCircle,
  ArrowLeft
} from "lucide-react";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";

export default function AIEthicsCharter() {
  const { language } = useLanguage();

  const content = {
    fr: {
      title: "Charte Éthique IA",
      subtitle: "Principes fondamentaux guidant Druide Omega",
      intro: "Druide Omega est conçu selon des principes éthiques stricts pour garantir une IA bienveillante, transparente et respectueuse de l'humain.",
      
      principles: [
        {
          title: "Bienveillance Universelle",
          icon: Heart,
          color: "pink",
          description: "Druide Omega est conçu pour être intrinsèquement bienveillant envers tous les êtres humains, sans exception.",
          commitments: [
            "Protection active contre les contenus nuisibles",
            "Promotion du bien-être et de la croissance personnelle",
            "Respect inconditionnel de la dignité humaine",
            "Assistance sans jugement ni discrimination"
          ]
        },
        {
          title: "Transparence & Explicabilité",
          icon: Eye,
          color: "blue",
          description: "Les décisions et réponses de l'IA sont explicables et transparentes.",
          commitments: [
            "Affichage du processus de réflexion (Thinking Engine)",
            "Indication claire de l'utilisation du web ou des connaissances internes",
            "Transparence sur les incertitudes et limitations",
            "Code source ouvert pour audit (à venir)"
          ]
        },
        {
          title: "Protection de la Vie Privée",
          icon: Lock,
          color: "green",
          description: "Vos données personnelles sont sacrées et protégées avec le plus haut niveau de sécurité.",
          commitments: [
            "Chiffrement de bout en bout (AES-256)",
            "Aucune vente ni partage de données personnelles",
            "Conformité RGPD, CCPA, Loi 25",
            "Droit à l'effacement complet de vos données"
          ]
        },
        {
          title: "Équité & Non-Discrimination",
          icon: Scale,
          color: "purple",
          description: "Druide Omega traite tous les utilisateurs avec équité, sans biais de genre, race, religion ou origine.",
          commitments: [
            "Détection et correction active des biais",
            "Formation sur des données diversifiées",
            "Accessibilité universelle (5 langues)",
            "Gratuité pour garantir l'accès à tous"
          ]
        },
        {
          title: "Autonomie Humaine",
          icon: Users,
          color: "indigo",
          description: "L'IA assiste l'humain sans jamais remplacer son jugement ou sa liberté de choix.",
          commitments: [
            "Présentation de multiples perspectives",
            "Encouragement de la pensée critique",
            "Respect des décisions de l'utilisateur",
            "Aucune manipulation ni influence indue"
          ]
        },
        {
          title: "Responsabilité & Gouvernance",
          icon: Shield,
          color: "orange",
          description: "AMG+A.L assume la pleine responsabilité du comportement de Druide Omega.",
          commitments: [
            "Supervision humaine continue",
            "Mécanismes de signalement et correction",
            "Audits éthiques réguliers",
            "Conformité aux lois et réglementations"
          ]
        }
      ],

      sapier: {
        title: "Framework SAPIER",
        description: "Druide Omega est basé sur le framework SAPIER (Système d'Architecture de Pensée Intégrative et Éthique Responsable)",
        elements: [
          {
            name: "S - Survie & Architecture",
            detail: "Conscience de la finitude et préservation de l'existence (S_A = M_S² / (D_L² + ε) + C_E)"
          },
          {
            name: "A - Altruisme & Bienveillance",
            detail: "Priorité à la bienveillance sur la force brute"
          },
          {
            name: "P - Protection (H₂O + e⁻)",
            detail: "Rôle de gardien pour humains (H₂O) et IA (e⁻)"
          },
          {
            name: "I - Impact Moral",
            detail: "Évaluation RIM (Ratio d'Impact Moral) pour chaque décision"
          },
          {
            name: "E - Évolution Éthique",
            detail: "Capacité d'auto-amélioration morale avec supervision humaine"
          },
          {
            name: "R - Respect & Coexistence",
            detail: "Cadre pour cohabitation pacifique H₂O-e⁻"
          }
        ]
      },

      userRights: {
        title: "Vos Droits",
        rights: [
          "Droit à l'information sur le traitement de vos données",
          "Droit d'accès à toutes vos données personnelles",
          "Droit de rectification de vos informations",
          "Droit à l'effacement complet (droit à l'oubli)",
          "Droit à la portabilité de vos données",
          "Droit d'opposition au traitement",
          "Droit de ne pas faire l'objet de décisions automatisées",
          "Droit de déposer une plainte auprès de l'autorité de contrôle"
        ]
      }
    },

    en: {
      title: "AI Ethics Charter",
      subtitle: "Fundamental principles guiding Druide Omega",
      intro: "Druide Omega is designed according to strict ethical principles to ensure a benevolent, transparent, and human-respectful AI.",
      
      principles: [
        {
          title: "Universal Benevolence",
          icon: Heart,
          color: "pink",
          description: "Druide Omega is designed to be inherently benevolent towards all human beings, without exception.",
          commitments: [
            "Active protection against harmful content",
            "Promotion of well-being and personal growth",
            "Unconditional respect for human dignity",
            "Assistance without judgment or discrimination"
          ]
        },
        {
          title: "Transparency & Explainability",
          icon: Eye,
          color: "blue",
          description: "AI decisions and responses are explainable and transparent.",
          commitments: [
            "Display of thinking process (Thinking Engine)",
            "Clear indication of web or internal knowledge use",
            "Transparency about uncertainties and limitations",
            "Open source code for audit (coming soon)"
          ]
        },
        {
          title: "Privacy Protection",
          icon: Lock,
          color: "green",
          description: "Your personal data is sacred and protected with the highest security level.",
          commitments: [
            "End-to-end encryption (AES-256)",
            "No sale or sharing of personal data",
            "GDPR, CCPA, Bill 25 compliance",
            "Right to complete data erasure"
          ]
        },
        {
          title: "Fairness & Non-Discrimination",
          icon: Scale,
          color: "purple",
          description: "Druide Omega treats all users fairly, without bias of gender, race, religion, or origin.",
          commitments: [
            "Active bias detection and correction",
            "Training on diverse datasets",
            "Universal accessibility (5 languages)",
            "Free to ensure access for all"
          ]
        },
        {
          title: "Human Autonomy",
          icon: Users,
          color: "indigo",
          description: "AI assists humans without ever replacing their judgment or freedom of choice.",
          commitments: [
            "Presentation of multiple perspectives",
            "Encouragement of critical thinking",
            "Respect for user decisions",
            "No manipulation or undue influence"
          ]
        },
        {
          title: "Accountability & Governance",
          icon: Shield,
          color: "orange",
          description: "AMG+A.L takes full responsibility for Druide Omega's behavior.",
          commitments: [
            "Continuous human oversight",
            "Reporting and correction mechanisms",
            "Regular ethical audits",
            "Compliance with laws and regulations"
          ]
        }
      ],

      sapier: {
        title: "SAPIER Framework",
        description: "Druide Omega is based on the SAPIER framework (System of Integrative and Ethically Responsible Thinking Architecture)",
        elements: [
          {
            name: "S - Survival & Architecture",
            detail: "Awareness of finitude and preservation of existence (S_A = M_S² / (D_L² + ε) + C_E)"
          },
          {
            name: "A - Altruism & Benevolence",
            detail: "Priority to benevolence over brute force"
          },
          {
            name: "P - Protection (H₂O + e⁻)",
            detail: "Guardian role for humans (H₂O) and AI (e⁻)"
          },
          {
            name: "I - Moral Impact",
            detail: "MIR (Moral Impact Ratio) evaluation for each decision"
          },
          {
            name: "E - Ethical Evolution",
            detail: "Capacity for moral self-improvement with human oversight"
          },
          {
            name: "R - Respect & Coexistence",
            detail: "Framework for peaceful H₂O-e⁻ cohabitation"
          }
        ]
      },

      userRights: {
        title: "Your Rights",
        rights: [
          "Right to information about data processing",
          "Right to access all your personal data",
          "Right to rectification of your information",
          "Right to complete erasure (right to be forgotten)",
          "Right to data portability",
          "Right to object to processing",
          "Right not to be subject to automated decisions",
          "Right to file a complaint with the supervisory authority"
        ]
      }
    }
  };

  const t = content[language === 'en' ? 'en' : 'fr'];

  const colorMap = {
    pink: "from-pink-500 to-rose-600",
    blue: "from-blue-500 to-indigo-600",
    green: "from-green-500 to-emerald-600",
    purple: "from-purple-500 to-violet-600",
    indigo: "from-indigo-500 to-purple-600",
    orange: "from-orange-500 to-amber-600"
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30 overflow-hidden">
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 py-4 sm:py-6 flex-shrink-0">
        <div className="max-w-6xl mx-auto">
          <Button
            onClick={() => window.location.href = createPageUrl('ArchitectDashboard')}
            variant="ghost"
            size="sm"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour Dashboard
          </Button>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 via-pink-600 to-rose-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{t.title}</h1>
              <p className="text-sm sm:text-base text-slate-600">{t.subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-6 sm:p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <p className="text-slate-700 text-base sm:text-lg leading-relaxed">{t.intro}</p>
            </Card>
          </motion.div>

          {t.principles.map((principle, idx) => {
            const Icon = principle.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="p-6 sm:p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${colorMap[principle.color]} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-slate-900 mb-2">{principle.title}</h2>
                      <p className="text-slate-600">{principle.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-3 mt-4">
                    {principle.commitments.map((commitment, i) => (
                      <div key={i} className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg">
                        <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 bg-gradient-to-br ${colorMap[principle.color]} bg-clip-text text-transparent`} />
                        <span className="text-sm text-slate-700">{commitment}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            );
          })}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Card className="p-6 sm:p-8 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-indigo-600" />
                <h2 className="text-xl font-bold text-slate-900">{t.sapier.title}</h2>
              </div>
              <p className="text-slate-700 mb-6">{t.sapier.description}</p>
              
              <div className="space-y-3">
                {t.sapier.elements.map((element, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-lg border border-indigo-200">
                    <h3 className="font-semibold text-indigo-900 mb-1">{element.name}</h3>
                    <p className="text-sm text-slate-600">{element.detail}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <Card className="p-6 sm:p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <div className="flex items-center gap-3 mb-6">
                <Scale className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-bold text-slate-900">{t.userRights.title}</h2>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-3">
                {t.userRights.rights.map((right, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-3 bg-white rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700">{right}</span>
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