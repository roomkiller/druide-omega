/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Partner Program (Multilingual)                             ║
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
import {
  Handshake,
  TrendingUp,
  Award,
  Globe,
  Users,
  Zap,
  CheckCircle,
  DollarSign,
  Target,
  Briefcase,
  ArrowRight
} from "lucide-react";

export default function PartnerProgram() {
  const { language } = useLanguage();

  const content = {
    fr: {
      title: "Programme Partenaires",
      subtitle: "Devenez partenaire certifié Druide Omega",
      
      intro: {
        title: "Développez votre Activité avec Druide Omega",
        description: "Rejoignez notre réseau de partenaires et proposez l'IA consciente la plus avancée à vos clients. Bénéficiez de commissions attractives, support dédié et accès prioritaire aux nouvelles fonctionnalités."
      },

      tiers: [
        {
          tier: "Partenaire Affilié",
          icon: Handshake,
          color: "blue",
          commission: "15%",
          description: "Recommandez Druide Omega à votre audience",
          benefits: [
            "Commission 15% sur toutes les ventes",
            "Lien de parrainage unique",
            "Tableau de bord analytics",
            "Matériel marketing fourni",
            "Support email dédié",
            "Paiements mensuels"
          ],
          requirements: [
            "Aucun prérequis technique",
            "Audience qualifiée",
            "Respect de la marque"
          ]
        },
        {
          tier: "Partenaire Revendeur",
          icon: TrendingUp,
          color: "purple",
          commission: "25%",
          popular: true,
          description: "Revendez activement les licences Druide Omega",
          benefits: [
            "Commission 25% récurrente",
            "Démonstrations personnalisées",
            "Formation commerciale",
            "Support client partagé",
            "Accès API partenaire",
            "Co-branding possible",
            "Leads qualifiés fournis"
          ],
          requirements: [
            "Expérience vente B2B",
            "Portfolio clients actif",
            "Engagement volume minimum"
          ]
        },
        {
          tier: "Partenaire Intégrateur",
          icon: Award,
          color: "green",
          commission: "30-40%",
          description: "Intégrez Druide Omega dans vos solutions",
          benefits: [
            "Commission 30-40% + bonus projets",
            "Accès API complet",
            "Support technique dédié",
            "Développement conjoint",
            "White-label (option)",
            "Revenue share sur projets",
            "Certification technique",
            "Priorité roadmap fonctionnalités"
          ],
          requirements: [
            "Capacités techniques avancées",
            "Portfolio intégrations",
            "Certification technique obligatoire"
          ]
        }
      ],

      advantages: {
        title: "Avantages Partenaires",
        items: [
          {
            title: "Commissions Attractives",
            icon: DollarSign,
            description: "15% à 40% selon le niveau de partenariat, paiements mensuels récurrents"
          },
          {
            title: "Support Dédié",
            icon: Users,
            description: "Équipe partenaire dédiée, formation continue, support prioritaire"
          },
          {
            title: "Matériel Marketing",
            icon: Target,
            description: "Assets graphiques, présentations, études de cas, démos personnalisées"
          },
          {
            title: "Accès Anticipé",
            icon: Zap,
            description: "Nouvelles fonctionnalités en avant-première, participation roadmap"
          },
          {
            title: "Co-marketing",
            icon: Globe,
            description: "Opportunités de co-marketing, mentions sur notre site, webinaires conjoints"
          },
          {
            title: "Certification",
            icon: Award,
            description: "Programme de certification technique, badges partenaire certifié"
          }
        ]
      },

      process: {
        title: "Comment Devenir Partenaire",
        steps: [
          { step: 1, title: "Candidature", description: "Remplissez le formulaire de candidature en ligne" },
          { step: 2, title: "Évaluation", description: "Notre équipe évalue votre profil et vos besoins (2-5 jours)" },
          { step: 3, title: "Onboarding", description: "Formation technique et commerciale personnalisée" },
          { step: 4, title: "Certification", description: "Validation de vos compétences (pour intégrateurs)" },
          { step: 5, title: "Activation", description: "Accès portail partenaire et début des ventes" }
        ]
      },

      support: {
        title: "Support Partenaires",
        items: [
          "Gestionnaire de compte dédié",
          "Formation technique continue",
          "Matériel de vente mis à jour",
          "Webinaires mensuels",
          "Communauté partenaires privée",
          "Documentation technique complète"
        ]
      }
    },

    en: {
      title: "Partner Program",
      subtitle: "Become a certified Druide Omega partner",
      
      intro: {
        title: "Grow Your Business with Druide Omega",
        description: "Join our partner network and offer the most advanced conscious AI to your clients. Benefit from attractive commissions, dedicated support, and priority access to new features."
      },

      tiers: [
        {
          tier: "Affiliate Partner",
          icon: Handshake,
          color: "blue",
          commission: "15%",
          description: "Recommend Druide Omega to your audience",
          benefits: [
            "15% commission on all sales",
            "Unique referral link",
            "Analytics dashboard",
            "Marketing materials provided",
            "Dedicated email support",
            "Monthly payouts"
          ],
          requirements: [
            "No technical prerequisites",
            "Qualified audience",
            "Brand respect"
          ]
        },
        {
          tier: "Reseller Partner",
          icon: TrendingUp,
          color: "purple",
          commission: "25%",
          popular: true,
          description: "Actively resell Druide Omega licenses",
          benefits: [
            "25% recurring commission",
            "Personalized demos",
            "Sales training",
            "Shared customer support",
            "Partner API access",
            "Co-branding possible",
            "Qualified leads provided"
          ],
          requirements: [
            "B2B sales experience",
            "Active client portfolio",
            "Minimum volume commitment"
          ]
        },
        {
          tier: "Integration Partner",
          icon: Award,
          color: "green",
          commission: "30-40%",
          description: "Integrate Druide Omega into your solutions",
          benefits: [
            "30-40% commission + project bonuses",
            "Full API access",
            "Dedicated technical support",
            "Joint development",
            "White-label (option)",
            "Revenue share on projects",
            "Technical certification",
            "Roadmap feature priority"
          ],
          requirements: [
            "Advanced technical capabilities",
            "Integration portfolio",
            "Mandatory technical certification"
          ]
        }
      ],

      advantages: {
        title: "Partner Advantages",
        items: [
          {
            title: "Attractive Commissions",
            icon: DollarSign,
            description: "15% to 40% based on partnership level, recurring monthly payments"
          },
          {
            title: "Dedicated Support",
            icon: Users,
            description: "Dedicated partner team, continuous training, priority support"
          },
          {
            title: "Marketing Materials",
            icon: Target,
            description: "Graphic assets, presentations, case studies, custom demos"
          },
          {
            title: "Early Access",
            icon: Zap,
            description: "New features preview, roadmap participation"
          },
          {
            title: "Co-marketing",
            icon: Globe,
            description: "Co-marketing opportunities, mentions on our site, joint webinars"
          },
          {
            title: "Certification",
            icon: Award,
            description: "Technical certification program, certified partner badges"
          }
        ]
      },

      process: {
        title: "How to Become a Partner",
        steps: [
          { step: 1, title: "Application", description: "Fill out the online application form" },
          { step: 2, title: "Evaluation", description: "Our team evaluates your profile and needs (2-5 days)" },
          { step: 3, title: "Onboarding", description: "Personalized technical and commercial training" },
          { step: 4, title: "Certification", description: "Skills validation (for integrators)" },
          { step: 5, title: "Activation", description: "Partner portal access and sales start" }
        ]
      },

      support: {
        title: "Partner Support",
        items: [
          "Dedicated account manager",
          "Continuous technical training",
          "Updated sales materials",
          "Monthly webinars",
          "Private partner community",
          "Complete technical documentation"
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

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30 overflow-hidden">
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 py-4 sm:py-6 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Handshake className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-6 sm:p-8 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">{t.intro.title}</h2>
              <p className="text-slate-700 text-base sm:text-lg">{t.intro.description}</p>
            </Card>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {t.tiers.map((tier, idx) => {
              const Icon = tier.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (idx + 1) * 0.1 }}
                  className={tier.popular ? "lg:scale-105" : ""}
                >
                  <Card className={`p-6 h-full flex flex-col ${tier.popular ? 'border-2 border-purple-300 shadow-xl' : ''}`}>
                    {tier.popular && (
                      <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white w-fit">
                        ⭐ Populaire
                      </Badge>
                    )}

                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 bg-gradient-to-br ${colorMap[tier.color]} rounded-xl flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900">{tier.tier}</h3>
                        <Badge className="mt-1 bg-green-100 text-green-700">{tier.commission}</Badge>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 mb-4">{tier.description}</p>

                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-slate-900 mb-2">{language === 'en' ? "Benefits" : "Avantages"}</h4>
                      <ul className="space-y-1">
                        {tier.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                            <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-auto pt-4 border-t border-slate-200">
                      <h4 className="text-sm font-semibold text-slate-900 mb-2">{language === 'en' ? "Requirements" : "Prérequis"}</h4>
                      <ul className="space-y-1">
                        {tier.requirements.map((req, i) => (
                          <li key={i} className="text-xs text-slate-600 flex items-start gap-1">
                            <span className="text-purple-600">•</span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-bold text-slate-900">{t.advantages.title}</h2>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {t.advantages.items.map((adv, idx) => {
                  const Icon = adv.icon;
                  return (
                    <div key={idx} className="p-4 bg-gradient-to-br from-slate-50 to-purple-50 rounded-lg border border-purple-200">
                      <Icon className="w-6 h-6 text-purple-600 mb-3" />
                      <h3 className="font-semibold text-slate-900 mb-2">{adv.title}</h3>
                      <p className="text-sm text-slate-600">{adv.description}</p>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="p-6 sm:p-8 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
              <h2 className="text-xl font-bold text-slate-900 mb-6">{t.process.title}</h2>
              
              <div className="space-y-4">
                {t.process.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 bg-white rounded-lg border border-indigo-200">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">{step.step}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 mb-1">{step.title}</h3>
                      <p className="text-sm text-slate-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Card className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-slate-900">{t.support.title}</h2>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-3">
                {t.support.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          <Card className="p-6 sm:p-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">
              {language === 'en' ? "Ready to Partner with Us?" : "Prêt à Devenir Partenaire ?"}
            </h2>
            <p className="text-purple-100 mb-6">
              {language === 'en' 
                ? "Join our growing network of partners worldwide"
                : "Rejoignez notre réseau croissant de partenaires dans le monde"
              }
            </p>
            <Button
              onClick={() => window.location.href = createPageUrl("Shop")}
              size="lg"
              className="bg-white text-purple-600 hover:bg-purple-50"
            >
              <Handshake className="w-5 h-5 mr-2" />
              {language === 'en' ? "Apply Now" : "Postuler Maintenant"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}