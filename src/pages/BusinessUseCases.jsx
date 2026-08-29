/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Business Use Cases (Multilingual)                          ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/utils/LanguageContext";
import { createPageUrl } from "@/utils";
import { navigateTo } from "@/lib/spaNavigate";
import {
  Briefcase,
  Building2,
  GraduationCap,
  Stethoscope,
  Scale,
  TrendingUp,
  Users,
  Lightbulb,
  CheckCircle,
  ArrowRight
} from "lucide-react";

export default function BusinessUseCases() {
  const { language } = useLanguage();

  const content = {
    fr: {
      title: "Cas d'Usage Entreprise",
      subtitle: "Comment les organisations utilisent Druide Omega",
      
      useCases: [
        {
          sector: "Éducation & Formation",
          icon: GraduationCap,
          color: "blue",
          description: "Accompagnement pédagogique intelligent et personnalisé",
          benefits: [
            "Tutorat IA adapté à chaque étudiant",
            "Génération de contenus pédagogiques",
            "Évaluation formative intelligente",
            "Suivi personnalisé des progrès",
            "Base de connaissances pour cours"
          ],
          examples: [
            "Université: Assistant virtuel pour 10,000+ étudiants",
            "École primaire: Aide aux devoirs personnalisée",
            "Formation professionnelle: Modules interactifs"
          ],
          roi: "Réduction de 60% du temps de tutorat, +40% engagement"
        },
        {
          sector: "Santé & Bien-être",
          icon: Stethoscope,
          color: "green",
          description: "Support empathique et suivi personnalisé",
          benefits: [
            "Accompagnement émotionnel 24/7",
            "Rappels de santé et habitudes",
            "Journal de bien-être intelligent",
            "Détection proactive de patterns",
            "Support confidentiel RGPD"
          ],
          examples: [
            "Clinique: Suivi post-consultation patients",
            "Centre bien-être: Coaching personnalisé",
            "Télémédecine: Triage intelligent initial"
          ],
          roi: "Satisfaction patient +35%, charge admin -50%"
        },
        {
          sector: "Services Professionnels",
          icon: Briefcase,
          color: "purple",
          description: "Assistance intelligente pour consultants et professionnels",
          benefits: [
            "Recherche et synthèse documentaire",
            "Rédaction assistée de rapports",
            "Base de connaissances métier",
            "Analyse de tendances",
            "Veille concurrentielle"
          ],
          examples: [
            "Cabinet conseil: Recherche pour 50+ consultants",
            "Avocats: Analyse jurisprudentielle rapide",
            "Comptables: Assistant fiscal intelligent"
          ],
          roi: "Productivité +45%, recherche 3x plus rapide"
        },
        {
          sector: "Technologie & Innovation",
          icon: Lightbulb,
          color: "orange",
          description: "R&D assistée et documentation technique",
          benefits: [
            "Documentation automatique de code",
            "Recherche scientifique accélérée",
            "Brainstorming créatif structuré",
            "Veille technologique continue",
            "Prototypage conceptuel rapide"
          ],
          examples: [
            "Startup tech: Documentation API automatique",
            "Labo R&D: Synthèse littérature scientifique",
            "Innovation: Idéation et validation concepts"
          ],
          roi: "Time-to-market -30%, documentation +90%"
        },
        {
          sector: "Ressources Humaines",
          icon: Users,
          color: "pink",
          description: "Recrutement, formation et engagement employés",
          benefits: [
            "Pré-qualification candidats intelligente",
            "Formation personnalisée employés",
            "Onboarding interactif",
            "Support RH 24/7",
            "Analyse sentiment équipe"
          ],
          examples: [
            "Grande entreprise: Onboarding 200+ employés/an",
            "PME: Recrutement assisté IA",
            "Startup: Culture d'entreprise interactive"
          ],
          roi: "Coût recrutement -40%, satisfaction +50%"
        },
        {
          sector: "Juridique & Conformité",
          icon: Scale,
          color: "indigo",
          description: "Assistance légale et conformité réglementaire",
          benefits: [
            "Analyse de contrats et clauses",
            "Veille réglementaire automatique",
            "Conformité RGPD/CCPA/Loi 25",
            "Recherche jurisprudentielle",
            "Rédaction assistée documents légaux"
          ],
          examples: [
            "Cabinet avocat: Analyse 1000+ contrats/mois",
            "Compliance officer: Veille réglementaire continue",
            "DPO: Gestion RGPD entreprise"
          ],
          roi: "Temps analyse -70%, erreurs -85%"
        }
      ],

      enterpriseFeatures: {
        title: "Fonctionnalités Entreprise",
        features: [
          { name: "Multi-utilisateurs", description: "Licences d'équipe avec gestion centralisée" },
          { name: "SSO", description: "Authentification unique (Azure AD, Okta, Google)" },
          { name: "Sécurité avancée", description: "Chiffrement renforcé, audits, conformité" },
          { name: "API dédiée", description: "Intégration dans vos systèmes existants" },
          { name: "Support prioritaire", description: "SLA garanti, support 24/7" },
          { name: "Formation sur mesure", description: "Onboarding et formation de vos équipes" },
          { name: "Hébergement privé", description: "Infrastructure dédiée (option)" },
          { name: "Personnalisation", description: "Modules et workflows personnalisés" }
        ]
      }
    },

    en: {
      title: "Business Use Cases",
      subtitle: "How organizations use Druide Omega",
      
      useCases: [
        {
          sector: "Education & Training",
          icon: GraduationCap,
          color: "blue",
          description: "Intelligent and personalized educational support",
          benefits: [
            "AI tutoring adapted to each student",
            "Educational content generation",
            "Intelligent formative assessment",
            "Personalized progress tracking",
            "Knowledge base for courses"
          ],
          examples: [
            "University: Virtual assistant for 10,000+ students",
            "Primary school: Personalized homework help",
            "Professional training: Interactive modules"
          ],
          roi: "60% reduction in tutoring time, +40% engagement"
        },
        {
          sector: "Health & Wellness",
          icon: Stethoscope,
          color: "green",
          description: "Empathetic support and personalized tracking",
          benefits: [
            "24/7 emotional support",
            "Health and habit reminders",
            "Intelligent wellness journal",
            "Proactive pattern detection",
            "GDPR-compliant confidential support"
          ],
          examples: [
            "Clinic: Post-consultation patient follow-up",
            "Wellness center: Personalized coaching",
            "Telemedicine: Intelligent initial triage"
          ],
          roi: "Patient satisfaction +35%, admin load -50%"
        },
        {
          sector: "Professional Services",
          icon: Briefcase,
          color: "purple",
          description: "Intelligent assistance for consultants and professionals",
          benefits: [
            "Document research and synthesis",
            "Assisted report writing",
            "Industry knowledge base",
            "Trend analysis",
            "Competitive intelligence"
          ],
          examples: [
            "Consulting firm: Research for 50+ consultants",
            "Lawyers: Rapid case law analysis",
            "Accountants: Intelligent tax assistant"
          ],
          roi: "Productivity +45%, research 3x faster"
        },
        {
          sector: "Technology & Innovation",
          icon: Lightbulb,
          color: "orange",
          description: "AI-assisted R&D and technical documentation",
          benefits: [
            "Automatic code documentation",
            "Accelerated scientific research",
            "Structured creative brainstorming",
            "Continuous technology watch",
            "Rapid conceptual prototyping"
          ],
          examples: [
            "Tech startup: Automatic API documentation",
            "R&D lab: Scientific literature synthesis",
            "Innovation: Concept ideation and validation"
          ],
          roi: "Time-to-market -30%, documentation +90%"
        },
        {
          sector: "Human Resources",
          icon: Users,
          color: "pink",
          description: "Recruitment, training and employee engagement",
          benefits: [
            "Intelligent candidate pre-qualification",
            "Personalized employee training",
            "Interactive onboarding",
            "24/7 HR support",
            "Team sentiment analysis"
          ],
          examples: [
            "Large company: Onboarding 200+ employees/year",
            "SME: AI-assisted recruitment",
            "Startup: Interactive company culture"
          ],
          roi: "Recruitment cost -40%, satisfaction +50%"
        },
        {
          sector: "Legal & Compliance",
          icon: Scale,
          color: "indigo",
          description: "Legal assistance and regulatory compliance",
          benefits: [
            "Contract and clause analysis",
            "Automatic regulatory monitoring",
            "GDPR/CCPA/Bill 25 compliance",
            "Case law research",
            "Assisted legal document drafting"
          ],
          examples: [
            "Law firm: Analysis of 1000+ contracts/month",
            "Compliance officer: Continuous regulatory watch",
            "DPO: Enterprise GDPR management"
          ],
          roi: "Analysis time -70%, errors -85%"
        }
      ],

      enterpriseFeatures: {
        title: "Enterprise Features",
        features: [
          { name: "Multi-user", description: "Team licenses with centralized management" },
          { name: "SSO", description: "Single sign-on (Azure AD, Okta, Google)" },
          { name: "Advanced security", description: "Enhanced encryption, audits, compliance" },
          { name: "Dedicated API", description: "Integration with your existing systems" },
          { name: "Priority support", description: "Guaranteed SLA, 24/7 support" },
          { name: "Custom training", description: "Onboarding and team training" },
          { name: "Private hosting", description: "Dedicated infrastructure (option)" },
          { name: "Customization", description: "Custom modules and workflows" }
        ]
      }
    }
  };

  const t = content[language === 'en' ? 'en' : 'fr'];

  const colorMap = {
    blue: "from-blue-500 to-indigo-600",
    green: "from-green-500 to-emerald-600",
    purple: "from-purple-500 to-violet-600",
    orange: "from-orange-500 to-amber-600",
    pink: "from-pink-500 to-rose-600",
    indigo: "from-indigo-500 to-purple-600"
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 overflow-hidden">
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 py-4 sm:py-6 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
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
          {t.useCases.map((useCase, idx) => {
            const Icon = useCase.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="p-6 sm:p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`w-12 h-12 bg-gradient-to-br ${colorMap[useCase.color]} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-slate-900 mb-2">{useCase.sector}</h2>
                      <p className="text-slate-600">{useCase.description}</p>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-3">{language === 'en' ? "Benefits" : "Bénéfices"}</h3>
                      <ul className="space-y-2">
                        {useCase.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-900 mb-3">{language === 'en' ? "Examples" : "Exemples"}</h3>
                      <div className="space-y-2">
                        {useCase.examples.map((example, i) => (
                          <div key={i} className="p-3 bg-slate-50 rounded-lg text-sm text-slate-700">
                            {example}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-900">ROI:</span>
                      <span className="text-sm text-green-700">{useCase.roi}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Card className="p-6 sm:p-8 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
              <div className="flex items-center gap-3 mb-6">
                <Building2 className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-bold text-slate-900">{t.enterpriseFeatures.title}</h2>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {t.enterpriseFeatures.features.map((feature, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-lg border border-purple-200">
                    <h3 className="font-semibold text-slate-900 mb-2 text-sm">{feature.name}</h3>
                    <p className="text-xs text-slate-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          <Card className="p-6 sm:p-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">
              {language === 'en' ? "Interested in Enterprise Solutions?" : "Intéressé par les Solutions Entreprise ?"}
            </h2>
            <p className="text-purple-100 mb-6">
              {language === 'en' 
                ? "Contact us for a personalized demonstration and custom quote"
                : "Contactez-nous pour une démonstration personnalisée et un devis sur mesure"
              }
            </p>
            <Button
              onClick={() => navigateTo("Shop")}
              size="lg"
              className="bg-white text-indigo-600 hover:bg-purple-50"
            >
              <Building2 className="w-5 h-5 mr-2" />
              {language === 'en' ? "Contact Sales" : "Contacter les Ventes"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}