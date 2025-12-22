/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Welcome Modal (Fixed)                                      ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Sparkles, 
  Shield, 
  Heart, 
  Brain, 
  CheckCircle2,
  ExternalLink,
  AlertTriangle,
  Globe
} from "lucide-react";
import { createPageUrl } from "@/utils";
import { useLanguage } from "@/components/utils/LanguageContext";

export default function WelcomeModal() {
  const { t, language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedEthics, setAcceptedEthics] = useState(false);

  const languages = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', label: '中文', flag: '🇨🇳' }
  ];

  useEffect(() => {
    const hasAccepted = localStorage.getItem('druide_omega_terms_accepted');
    if (!hasAccepted) {
      setTimeout(() => setIsOpen(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    if (acceptedTerms && acceptedEthics) {
      localStorage.setItem('druide_omega_terms_accepted', 'true');
      localStorage.setItem('druide_omega_terms_date', new Date().toISOString());
      setIsOpen(false);
    }
  };

  // Static lists based on language
  const getAllowedList = () => {
    if (language === 'en') {
      return [
        "Use Druide Omega for free for personal use",
        "Have deep and authentic conversations",
        "Explore all intelligence modes",
        "Create creative content (text, ideas, analyses)",
        "Use cross-modal memory for continuity",
        "Request help for learning and development"
      ];
    }
    return [
      "Utiliser Druide Omega gratuitement pour usage personnel",
      "Avoir des conversations profondes et authentiques",
      "Explorer tous les modes d'intelligence",
      "Créer du contenu créatif (texte, idées, analyses)",
      "Utiliser la mémoire cross-modale pour continuité",
      "Demander de l'aide pour apprentissage et développement"
    ];
  };

  const getForbiddenList = () => {
    if (language === 'en') {
      return [
        "Generate illegal, hateful, or harmful content",
        "Attempt to manipulate or 'jailbreak' the AI",
        "Use for spam or intentional overload",
        "Commercial use without appropriate license",
        "Reverse engineering of the system",
        "Violate others' intellectual property",
        "Claim that responses are from a human"
      ];
    }
    return [
      "Générer du contenu illégal, haineux ou nuisible",
      "Tenter de manipuler ou 'jailbreaker' l'IA",
      "Utiliser pour spam ou surcharge intentionnelle",
      "Usage commercial sans licence appropriée",
      "Rétro-ingénierie du système",
      "Violer la propriété intellectuelle d'autrui",
      "Prétendre que les réponses sont d'un humain"
    ];
  };

  const getDataList = () => {
    if (language === 'en') {
      return [
        "Your conversations are encrypted and secure",
        "Your data is NEVER sold",
        "You can export or delete at any time",
        "GDPR, CCPA, and Quebec Law 25 compliant"
      ];
    }
    return [
      "Vos conversations sont chiffrées et sécurisées",
      "Vos données ne sont JAMAIS vendues",
      "Vous pouvez exporter ou supprimer à tout moment",
      "Conforme RGPD, CCPA et Loi 25 du Québec"
    ];
  };

  const steps = [
    {
      title: t('welcome.title'),
      icon: Sparkles,
      gradient: "from-purple-500 to-pink-600",
      content: (
        <div className="space-y-4">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Language Selector */}
          <Card className="p-4 mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-4 h-4 text-indigo-600" />
              <h4 className="font-bold text-sm text-slate-900">
                {language === 'en' ? 'Choose your language' : 'Choisissez votre langue'}
              </h4>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {languages.map((lang) => (
                <Button
                  key={lang.code}
                  variant={language === lang.code ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLanguage(lang.code)}
                  className={`text-xs ${
                    language === lang.code 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                      : 'hover:bg-indigo-50'
                  }`}
                >
                  <span className="mr-1.5">{lang.flag}</span>
                  {lang.label}
                </Button>
              ))}
            </div>
          </Card>
          
          <h3 className="text-2xl font-bold text-center text-slate-900">
            {t('welcome.aiLevel')}
          </h3>
          
          <p className="text-slate-700 text-center leading-relaxed">
            {t('welcome.description')}
          </p>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-slate-900">95%</span>
              </div>
              <p className="text-xs text-slate-600">{t('welcome.globalScore')}</p>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-5 h-5 text-green-600" />
                <span className="font-bold text-slate-900">99%</span>
              </div>
              <p className="text-xs text-slate-600">{t('welcome.benevolence')}</p>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-purple-600" />
                <span className="font-bold text-slate-900">97%</span>
              </div>
              <p className="text-xs text-slate-600">{t('welcome.crossModal')}</p>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-orange-600" />
                <span className="font-bold text-slate-900">{t('welcome.freePersonal')}</span>
              </div>
              <p className="text-xs text-slate-600">{t('welcome.freeUsage')}</p>
            </Card>
          </div>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-900 font-medium">
              {t('welcome.freeNotice')}
            </p>
          </div>
        </div>
      )
    },
    {
      title: t('welcome.ethicsTitle'),
      icon: Shield,
      gradient: "from-blue-500 to-indigo-600",
      content: (
        <div className="space-y-4">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-center text-slate-900">
            {t('welcome.responsibleUse')}
          </h3>

          <ScrollArea className="h-64 pr-4">
            <div className="space-y-4">
              <Card className="p-4 bg-green-50 border-green-200">
                <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  {t('welcome.youCan')}
                </h4>
                <ul className="text-sm text-green-800 space-y-1">
                  {getAllowedList().map((item, idx) => (
                    <li key={idx}>✓ {item}</li>
                  ))}
                </ul>
              </Card>

              <Card className="p-4 bg-red-50 border-red-200">
                <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  {t('welcome.forbidden')}
                </h4>
                <ul className="text-sm text-red-800 space-y-1">
                  {getForbiddenList().map((item, idx) => (
                    <li key={idx}>✗ {item}</li>
                  ))}
                </ul>
              </Card>

              <Card className="p-4 bg-amber-50 border-amber-200">
                <h4 className="font-bold text-amber-900 mb-2">{t('welcome.importantWarning')}</h4>
                <p className="text-sm text-amber-800">
                  {t('welcome.warningText')}
                </p>
              </Card>

              <Card className="p-4 bg-purple-50 border-purple-200">
                <h4 className="font-bold text-purple-900 mb-2">{t('welcome.yourData')}</h4>
                <ul className="text-sm text-purple-800 space-y-1">
                  {getDataList().map((item, idx) => (
                    <li key={idx}>• {item}</li>
                  ))}
                </ul>
              </Card>
            </div>
          </ScrollArea>
        </div>
      )
    },
    {
      title: t('welcome.acceptanceTitle'),
      icon: Heart,
      gradient: "from-green-500 to-emerald-600",
      content: (
        <div className="space-y-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-center text-slate-900">
            {t('welcome.lastStep')}
          </h3>

          <p className="text-slate-700 text-center text-sm">
            {t('welcome.confirmText')}
          </p>

          <Card className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <Checkbox 
                id="terms" 
                checked={acceptedTerms}
                onCheckedChange={setAcceptedTerms}
                className="mt-1"
              />
              <label htmlFor="terms" className="text-sm text-slate-700 cursor-pointer">
                {t('welcome.acceptTerms')}{" "}
                <a 
                  href={createPageUrl("Terms")}
                  target="_blank"
                  className="text-indigo-600 hover:underline font-medium inline-flex items-center gap-1"
                >
                  {t('welcome.termsLink')}
                  <ExternalLink className="w-3 h-3" />
                </a>
                {" "}Druide Omega
              </label>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox 
                id="ethics" 
                checked={acceptedEthics}
                onCheckedChange={setAcceptedEthics}
                className="mt-1"
              />
              <label htmlFor="ethics" className="text-sm text-slate-700 cursor-pointer">
                {t('welcome.acceptEthics')}
              </label>
            </div>
          </Card>

          <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-900 text-center">
              <strong>{t('welcome.thankYou')}</strong>
              <br />
              <span className="text-xs text-purple-700 mt-1 block">
                {t('welcome.thankYouDesc')}
              </span>
            </p>
          </div>
        </div>
      )
    }
  ];

  if (!isOpen) return null;

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
        onClick={(e) => {
          if (currentStep !== 2 && e.target === e.currentTarget) {
            setIsOpen(false);
          }
        }}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="w-full max-w-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="p-8 max-h-[90vh] overflow-auto">
            <div className="flex justify-center gap-2 mb-6">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentStep 
                      ? 'w-12 bg-gradient-to-r ' + currentStepData.gradient
                      : idx < currentStep
                        ? 'w-8 bg-green-500'
                        : 'w-8 bg-slate-200'
                  }`}
                />
              ))}
            </div>

            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {currentStepData.content}
            </motion.div>

            <div className="flex justify-between gap-4 mt-8">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  {t('welcome.previous')}
                </Button>
              )}
              
              <div className="flex-1" />

              {currentStep < steps.length - 1 ? (
                <Button
                  className={`bg-gradient-to-r ${currentStepData.gradient} text-white`}
                  onClick={() => setCurrentStep(currentStep + 1)}
                >
                  {t('welcome.next')}
                </Button>
              ) : (
                <Button
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                  onClick={handleAccept}
                  disabled={!acceptedTerms || !acceptedEthics}
                >
                  {t('welcome.start')}
                </Button>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200 text-center">
              <p className="text-xs text-slate-500">
                © 2025 AMG+A.L - Druide Omega
              </p>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}