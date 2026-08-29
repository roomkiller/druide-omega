/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Pricing & Licensing (Multilingual)                         ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/utils/LanguageContext";
import { createPageUrl } from "@/utils";
import { navigateTo } from "@/lib/spaNavigate";
import {
  DollarSign,
  Check,
  Star,
  Sparkles,
  Building2,
  Users,
  Globe,
  Zap,
  Shield,
  Crown
} from "lucide-react";

export default function Pricing() {
  const { language } = useLanguage();
  const [billing, setBilling] = useState("annual");

  const content = {
    fr: {
      title: "Tarifs & Licences",
      subtitle: "Choisissez le forfait adapté à vos besoins",
      free: "Gratuit pour toujours",
      monthly: "Mensuel",
      annual: "Annuel",
      save: "Économisez",
      perMonth: "/mois",
      perYear: "/an",
      getStarted: "Commencer",
      contactUs: "Nous Contacter",
      currentPlan: "Forfait Actuel",
      
      tiers: [
        {
          name: "Personnel",
          price: 0,
          icon: Star,
          color: "purple",
          description: "Pour usage personnel et éducatif",
          features: [
            "Tous les modules de base",
            "Chat illimité",
            "Interaction vocale",
            "Mémoire cross-modale",
            "Base de connaissances (5 documents)",
            "Support communautaire"
          ],
          limitations: [
            "5 documents max dans KB",
            "50 mémoires actives",
            "Support communautaire"
          ]
        },
        {
          name: "Pro",
          priceMonthly: 29,
          priceAnnual: 290,
          icon: Zap,
          color: "indigo",
          popular: true,
          description: "Pour professionnels et créateurs",
          features: [
            "Tout du forfait Personnel",
            "Documents KB illimités",
            "Mémoires illimitées",
            "Modules premium (6 inclus)",
            "Génération d'images avancée",
            "Export de données",
            "Support prioritaire",
            "API access (100k tokens/mois)"
          ]
        },
        {
          name: "Entreprise",
          price: "Sur mesure",
          icon: Building2,
          color: "emerald",
          description: "Pour équipes et organisations",
          features: [
            "Tout du forfait Pro",
            "Utilisateurs multiples",
            "SSO & Authentification avancée",
            "Modules personnalisés",
            "Conformité entreprise",
            "SLA garanti (99.9%)",
            "Support dédié 24/7",
            "Formation & onboarding",
            "Hébergement privé (option)"
          ],
          custom: true
        }
      ],

      addons: {
        title: "Modules Complémentaires",
        description: "Enrichissez votre expérience avec des modules spécialisés",
        items: [
          { name: "Pack Créativité", price: 9, features: ["Génération images avancée", "Diagrammes illimités", "Styles artistiques"] },
          { name: "Pack Analyse", price: 14, features: ["Analyse de données", "Visualisations avancées", "Reports automatiques"] },
          { name: "Pack Entreprise", price: 19, features: ["Collaboration temps réel", "Workflows personnalisés", "Intégrations"] }
        ]
      },

      faq: [
        {
          q: "Puis-je changer de forfait à tout moment ?",
          a: "Oui, vous pouvez upgrader ou downgrader à tout moment. Les changements sont appliqués immédiatement."
        },
        {
          q: "Y a-t-il une période d'essai ?",
          a: "Le forfait Personnel est gratuit pour toujours. Pour Pro, nous offrons 14 jours d'essai gratuit, sans carte de crédit."
        },
        {
          q: "Quels modes de paiement acceptez-vous ?",
          a: "Nous acceptons les cartes de crédit (Visa, Mastercard, Amex), PayPal, et virement bancaire pour les entreprises."
        },
        {
          q: "Puis-je obtenir un remboursement ?",
          a: "Oui, nous offrons une garantie de remboursement de 30 jours, sans questions."
        }
      ]
    },

    en: {
      title: "Pricing & Licensing",
      subtitle: "Choose the plan that fits your needs",
      free: "Free forever",
      monthly: "Monthly",
      annual: "Annual",
      save: "Save",
      perMonth: "/month",
      perYear: "/year",
      getStarted: "Get Started",
      contactUs: "Contact Us",
      currentPlan: "Current Plan",
      
      tiers: [
        {
          name: "Personal",
          price: 0,
          icon: Star,
          color: "purple",
          description: "For personal and educational use",
          features: [
            "All core modules",
            "Unlimited chat",
            "Voice interaction",
            "Cross-modal memory",
            "Knowledge base (5 documents)",
            "Community support"
          ],
          limitations: [
            "5 documents max in KB",
            "50 active memories",
            "Community support"
          ]
        },
        {
          name: "Pro",
          priceMonthly: 29,
          priceAnnual: 290,
          icon: Zap,
          color: "indigo",
          popular: true,
          description: "For professionals and creators",
          features: [
            "Everything in Personal",
            "Unlimited KB documents",
            "Unlimited memories",
            "Premium modules (6 included)",
            "Advanced image generation",
            "Data export",
            "Priority support",
            "API access (100k tokens/month)"
          ]
        },
        {
          name: "Enterprise",
          price: "Custom",
          icon: Building2,
          color: "emerald",
          description: "For teams and organizations",
          features: [
            "Everything in Pro",
            "Multiple users",
            "SSO & Advanced authentication",
            "Custom modules",
            "Enterprise compliance",
            "Guaranteed SLA (99.9%)",
            "24/7 dedicated support",
            "Training & onboarding",
            "Private hosting (option)"
          ],
          custom: true
        }
      ],

      addons: {
        title: "Add-on Modules",
        description: "Enhance your experience with specialized modules",
        items: [
          { name: "Creativity Pack", price: 9, features: ["Advanced image generation", "Unlimited diagrams", "Artistic styles"] },
          { name: "Analysis Pack", price: 14, features: ["Data analysis", "Advanced visualizations", "Automated reports"] },
          { name: "Enterprise Pack", price: 19, features: ["Real-time collaboration", "Custom workflows", "Integrations"] }
        ]
      },

      faq: [
        {
          q: "Can I change plans anytime?",
          a: "Yes, you can upgrade or downgrade anytime. Changes are applied immediately."
        },
        {
          q: "Is there a trial period?",
          a: "The Personal plan is free forever. For Pro, we offer a 14-day free trial, no credit card required."
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept credit cards (Visa, Mastercard, Amex), PayPal, and bank transfer for enterprises."
        },
        {
          q: "Can I get a refund?",
          a: "Yes, we offer a 30-day money-back guarantee, no questions asked."
        }
      ]
    }
  };

  const t = content[language === 'en' ? 'en' : 'fr'];

  const colorMap = {
    purple: "from-purple-500 to-violet-600",
    indigo: "from-indigo-500 to-purple-600",
    emerald: "from-emerald-500 to-teal-600"
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 overflow-hidden">
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 py-4 sm:py-6 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
                <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{t.title}</h1>
                <p className="text-sm sm:text-base text-slate-600">{t.subtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
              <Button
                variant={billing === "monthly" ? "default" : "ghost"}
                size="sm"
                onClick={() => setBilling("monthly")}
                className="text-xs sm:text-sm"
              >
                {t.monthly}
              </Button>
              <Button
                variant={billing === "annual" ? "default" : "ghost"}
                size="sm"
                onClick={() => setBilling("annual")}
                className="text-xs sm:text-sm"
              >
                {t.annual}
                {billing === "annual" && <Badge className="ml-2 bg-green-500">-15%</Badge>}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {t.tiers.map((tier, idx) => {
              const Icon = tier.icon;
              const price = tier.price === 0 
                ? t.free 
                : tier.custom 
                  ? tier.price 
                  : billing === "annual" 
                    ? `$${tier.priceAnnual}${t.perYear}`
                    : `$${tier.priceMonthly}${t.perMonth}`;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={tier.popular ? "lg:scale-105" : ""}
                >
                  <Card className={`p-6 sm:p-8 h-full flex flex-col ${tier.popular ? 'border-2 border-indigo-300 shadow-xl' : ''}`}>
                    {tier.popular && (
                      <Badge className="mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white w-fit">
                        <Crown className="w-3 h-3 mr-1" />
                        Populaire
                      </Badge>
                    )}

                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${colorMap[tier.color]} rounded-xl flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{tier.name}</h3>
                        <p className="text-sm text-slate-600">{tier.description}</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="text-3xl sm:text-4xl font-bold text-slate-900">{price}</p>
                      {billing === "annual" && tier.priceAnnual && (
                        <p className="text-sm text-green-600 mt-1">
                          {t.save} ${(tier.priceMonthly * 12 - tier.priceAnnual).toFixed(0)}
                        </p>
                      )}
                    </div>

                    <ul className="space-y-3 mb-6 flex-1">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => tier.custom ? navigateTo("Shop") : null}
                      className={`w-full ${tier.popular ? `bg-gradient-to-r ${colorMap[tier.color]}` : ''}`}
                    >
                      {tier.custom ? t.contactUs : tier.price === 0 ? t.currentPlan : t.getStarted}
                    </Button>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="p-6 sm:p-8 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-orange-600" />
                <h2 className="text-xl font-bold text-slate-900">{t.addons.title}</h2>
              </div>
              <p className="text-slate-700 mb-6">{t.addons.description}</p>
              
              <div className="grid sm:grid-cols-3 gap-4">
                {t.addons.items.map((addon, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-lg border border-orange-200">
                    <h3 className="font-semibold text-slate-900 mb-2">{addon.name}</h3>
                    <p className="text-2xl font-bold text-orange-600 mb-3">${addon.price}/mois</p>
                    <ul className="space-y-1">
                      {addon.features.map((feat, i) => (
                        <li key={i} className="text-xs text-slate-600 flex items-start gap-1">
                          <Check className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-8">
            <Card className="p-6 sm:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">FAQ</h2>
              <div className="space-y-4">
                {t.faq.map((item, idx) => (
                  <div key={idx} className="pb-4 border-b border-slate-200 last:border-0">
                    <h3 className="font-semibold text-slate-900 mb-2">{item.q}</h3>
                    <p className="text-sm text-slate-600">{item.a}</p>
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