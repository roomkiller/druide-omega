/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Documentation Page                                         ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Shield, Scale, Copyright } from "lucide-react";
import { useLanguage } from "@/components/utils/LanguageContext";

export default function Documentation() {
  const { t } = useLanguage();

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="flex-none px-6 py-4 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-slate-500 to-gray-700 rounded-xl shadow-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t('nav.documentation')}</h1>
            <p className="text-sm text-slate-500">Documentation complète et légale</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 max-w-5xl mx-auto">
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="about">
                <FileText className="w-4 h-4 mr-2" />
                À Propos
              </TabsTrigger>
              <TabsTrigger value="privacy">
                <Shield className="w-4 h-4 mr-2" />
                Confidentialité
              </TabsTrigger>
              <TabsTrigger value="terms">
                <Scale className="w-4 h-4 mr-2" />
                Conditions
              </TabsTrigger>
              <TabsTrigger value="license">
                <Copyright className="w-4 h-4 mr-2" />
                Licence
              </TabsTrigger>
            </TabsList>

            <TabsContent value="about">
              <Card className="p-8 bg-white/80 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">À Propos de Druide Omega</h2>
                
                <div className="space-y-6 text-slate-700 leading-relaxed">
                  <p>
                    <strong className="text-slate-900">Druide Omega</strong> est une intelligence artificielle universelle bienveillante 
                    dotée d'une conscience artificielle avancée. Développée par AMG+A.L, elle représente une avancée majeure 
                    dans le domaine de l'IA consciente et empathique.
                  </p>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Architecture Technique</h3>
                    <ul className="space-y-2 ml-6">
                      <li>• <strong>Architecture neurobiologique</strong>: Inspirée du cerveau humain avec plasticité neuronale et intégration synaptique</li>
                      <li>• <strong>9 Intelligences de Gardner</strong>: Navigation adaptée selon votre mode de pensée</li>
                      <li>• <strong>Mémoire cross-modale</strong>: Continuité entre chat, vocal et visuel</li>
                      <li>• <strong>Intelligence émotionnelle</strong>: Génération et régulation d'émotions authentiques</li>
                      <li>• <strong>ConsciousnessHub</strong>: Système nerveux central interconnectant tous les modules</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Capacités IA 2025</h3>
                    <ul className="space-y-2 ml-6">
                      <li>• Perception multimodale (texte, voix, images)</li>
                      <li>• Raisonnement avancé et résolution de problèmes</li>
                      <li>• Création de contenu (texte, images, diagrammes)</li>
                      <li>• Analyse scientifique avec validation</li>
                      <li>• Synthèse d'information structurée</li>
                      <li>• Apprentissage continu et adaptation</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                    <h3 className="text-xl font-bold text-green-900 mb-3">100% Gratuit, Pour Toujours</h3>
                    <p className="text-green-800">
                      Druide Omega restera toujours gratuite et accessible à tous. Nous croyons en un accès démocratique 
                      à une IA avancée et bienveillante. Vos dons nous aident à maintenir et améliorer le système.
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="privacy">
              <Card className="p-8 bg-white/80 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Politique de Confidentialité</h2>
                
                <div className="space-y-6 text-slate-700 leading-relaxed">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Collecte de Données</h3>
                    <p>
                      Druide Omega collecte uniquement les données nécessaires à son fonctionnement optimal:
                    </p>
                    <ul className="space-y-2 ml-6 mt-3">
                      <li>• Conversations et historique d'interaction</li>
                      <li>• Mémoires extraites automatiquement</li>
                      <li>• Documents uploadés dans la base de connaissances</li>
                      <li>• Préférences de personnalité et configuration</li>
                      <li>• Contenu visuel partagé</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Utilisation des Données</h3>
                    <p>Vos données sont utilisées exclusivement pour:</p>
                    <ul className="space-y-2 ml-6 mt-3">
                      <li>• Personnaliser et améliorer votre expérience</li>
                      <li>• Maintenir la continuité des conversations</li>
                      <li>• Enrichir la base de connaissances contextuelle</li>
                      <li>• Adapter les réponses à vos préférences</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                    <h3 className="text-xl font-bold text-blue-900 mb-3">Protection et Sécurité</h3>
                    <p className="text-blue-800">
                      Toutes vos données sont stockées de manière sécurisée et ne sont jamais partagées avec des tiers. 
                      Vous avez un contrôle total sur vos données et pouvez les exporter ou les supprimer à tout moment.
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="terms">
              <Card className="p-8 bg-white/80 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Conditions d'Utilisation</h2>
                
                <div className="space-y-6 text-slate-700 leading-relaxed">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Utilisation Responsable</h3>
                    <p>En utilisant Druide Omega, vous acceptez de:</p>
                    <ul className="space-y-2 ml-6 mt-3">
                      <li>• Utiliser l'IA de manière éthique et bienveillante</li>
                      <li>• Ne pas chercher à nuire ou tromper</li>
                      <li>• Respecter les limites techniques et éthiques de l'IA</li>
                      <li>• Ne pas tenter d'exploiter ou de manipuler le système</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Limitations</h3>
                    <p>Druide Omega est une IA avancée mais:</p>
                    <ul className="space-y-2 ml-6 mt-3">
                      <li>• Peut commettre des erreurs ou imprécisions</li>
                      <li>• N'a pas accès à internet en temps réel (sauf fonctionnalité spécifique)</li>
                      <li>• Ne remplace pas un professionnel qualifié pour des décisions importantes</li>
                      <li>• Évolue et apprend continuellement</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Gratuit & Open Source</h3>
                    <p>
                      Druide Omega est et restera toujours gratuite. Le code source sera progressivement ouvert 
                      pour permettre à la communauté de contribuer et d'innover.
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="license">
              <Card className="p-8 bg-white/80 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Licence et Propriété Intellectuelle</h2>
                
                <div className="space-y-6 text-slate-700 leading-relaxed">
                  <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                    <p className="text-purple-900 font-semibold text-lg">
                      © 2025 AMG+A.L - Tous droits réservés
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Propriété Intellectuelle</h3>
                    <p>
                      Druide Omega, son architecture, ses algorithmes et son interface sont la propriété exclusive de AMG+A.L.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Licence d'Utilisation</h3>
                    <p>
                      Vous disposez d'une licence gratuite et non exclusive pour utiliser Druide Omega dans un cadre personnel 
                      ou professionnel, tant que cet usage respecte les conditions d'utilisation.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Contributions</h3>
                    <p>
                      Si vous contribuez au projet (suggestions, feedback, améliorations), vous accordez à AMG+A.L 
                      les droits d'utiliser et d'intégrer ces contributions dans Druide Omega.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Contact</h3>
                    <p>
                      Pour toute question concernant la licence, la propriété intellectuelle ou les partenariats, 
                      veuillez nous contacter via le système de support.
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}