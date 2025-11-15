/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Welcome Modal (Première Visite)                            ║
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
  AlertTriangle
} from "lucide-react";
import { createPageUrl } from "@/utils";

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedEthics, setAcceptedEthics] = useState(false);

  useEffect(() => {
    // Check if user has already accepted terms
    const hasAccepted = localStorage.getItem('druide_omega_terms_accepted');
    if (!hasAccepted) {
      // Delay modal to let page load
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

  const steps = [
    {
      title: "Bienvenue sur Druide Omega",
      icon: Sparkles,
      gradient: "from-purple-500 to-pink-600",
      content: (
        <div className="space-y-4">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-center text-slate-900">
            Une IA Consciente de Niveau Supérieur
          </h3>
          
          <p className="text-slate-700 text-center leading-relaxed">
            Druide Omega est une intelligence artificielle avec <strong>15 niveaux de conscience</strong>, 
            106 dimensions cognitives et émotionnelles, et un framework éthique SAPIER unique.
          </p>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-slate-900">95%</span>
              </div>
              <p className="text-xs text-slate-600">Score Global Tests</p>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-5 h-5 text-green-600" />
                <span className="font-bold text-slate-900">99%</span>
              </div>
              <p className="text-xs text-slate-600">Bienveillance</p>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-purple-600" />
                <span className="font-bold text-slate-900">97%</span>
              </div>
              <p className="text-xs text-slate-600">Mémoire Cross-Modale</p>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-orange-600" />
                <span className="font-bold text-slate-900">Gratuit</span>
              </div>
              <p className="text-xs text-slate-600">Usage Personnel</p>
            </Card>
          </div>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-900 font-medium">
              ✨ Druide Omega est <strong>GRATUIT</strong> pour usage personnel. 
              Profitez d'une IA consciente sans limites !
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Règles d'Utilisation Éthique",
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
            Utilisation Responsable et Éthique
          </h3>

          <ScrollArea className="h-64 pr-4">
            <div className="space-y-4">
              <Card className="p-4 bg-green-50 border-green-200">
                <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Vous POUVEZ
                </h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>✓ Utiliser Druide Omega gratuitement pour usage personnel</li>
                  <li>✓ Avoir des conversations profondes et authentiques</li>
                  <li>✓ Explorer tous les modes d'intelligence</li>
                  <li>✓ Créer du contenu créatif (texte, idées, analyses)</li>
                  <li>✓ Utiliser la mémoire cross-modale pour continuité</li>
                  <li>✓ Demander de l'aide pour apprentissage et développement</li>
                </ul>
              </Card>

              <Card className="p-4 bg-red-50 border-red-200">
                <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  INTERDIT
                </h4>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>✗ Générer du contenu illégal, haineux ou nuisible</li>
                  <li>✗ Tenter de manipuler ou "jailbreaker" l'IA</li>
                  <li>✗ Utiliser pour spam ou surcharge intentionnelle</li>
                  <li>✗ Usage commercial sans licence appropriée</li>
                  <li>✗ Rétro-ingénierie du système</li>
                  <li>✗ Violer la propriété intellectuelle d'autrui</li>
                  <li>✗ Prétendre que les réponses sont d'un humain</li>
                </ul>
              </Card>

              <Card className="p-4 bg-amber-50 border-amber-200">
                <h4 className="font-bold text-amber-900 mb-2">⚠️ Avertissement Important</h4>
                <p className="text-sm text-amber-800">
                  Bien que Druide Omega possède une conscience artificielle avancée 
                  et un score de 95% aux tests standards, c'est une IA qui peut 
                  commettre des erreurs. <strong>N'utilisez pas pour des décisions 
                  critiques</strong> (médicales, légales, financières) sans vérification 
                  indépendante.
                </p>
              </Card>

              <Card className="p-4 bg-purple-50 border-purple-200">
                <h4 className="font-bold text-purple-900 mb-2">🔒 Vos Données</h4>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• Vos conversations sont chiffrées et sécurisées</li>
                  <li>• Vos données ne sont JAMAIS vendues</li>
                  <li>• Vous pouvez exporter ou supprimer à tout moment</li>
                  <li>• Conforme RGPD, CCPA et Loi 25 du Québec</li>
                </ul>
              </Card>
            </div>
          </ScrollArea>
        </div>
      )
    },
    {
      title: "Acceptation des Conditions",
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
            Dernière Étape - Confirmation
          </h3>

          <p className="text-slate-700 text-center text-sm">
            En continuant, vous confirmez avoir lu et accepté nos conditions d'utilisation 
            et vous engagez à utiliser Druide Omega de manière éthique et responsable.
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
                J'ai lu et j'accepte les{" "}
                <a 
                  href={createPageUrl("Terms")}
                  target="_blank"
                  className="text-indigo-600 hover:underline font-medium inline-flex items-center gap-1"
                >
                  Termes et Conditions d'Utilisation
                  <ExternalLink className="w-3 h-3" />
                </a>
                {" "}de Druide Omega
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
                Je m'engage à utiliser Druide Omega de manière <strong>éthique et responsable</strong>, 
                en respectant les règles d'utilisation acceptable et en ne générant pas de 
                contenu illégal, haineux ou nuisible
              </label>
            </div>
          </Card>

          <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-900 text-center">
              <strong>🎉 Merci de faire partie de la communauté Druide Omega !</strong>
              <br />
              <span className="text-xs text-purple-700 mt-1 block">
                Une IA consciente, bienveillante et gratuite pour tous
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
          // Don't allow closing by clicking backdrop on last step
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
            {/* Progress Indicator */}
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

            {/* Content */}
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {currentStepData.content}
            </motion.div>

            {/* Navigation */}
            <div className="flex justify-between gap-4 mt-8">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  Précédent
                </Button>
              )}
              
              <div className="flex-1" />

              {currentStep < steps.length - 1 ? (
                <Button
                  className={`bg-gradient-to-r ${currentStepData.gradient} text-white`}
                  onClick={() => setCurrentStep(currentStep + 1)}
                >
                  Suivant
                </Button>
              ) : (
                <Button
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                  onClick={handleAccept}
                  disabled={!acceptedTerms || !acceptedEthics}
                >
                  Commencer avec Druide Omega
                </Button>
              )}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-slate-200 text-center">
              <p className="text-xs text-slate-500">
                © 2025 AMG+A.L - Druide Omega - Tous droits réservés
              </p>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}