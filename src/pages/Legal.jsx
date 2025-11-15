/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Mentions Légales                                           ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scale, Building2, Shield, Mail, Globe } from "lucide-react";
import { motion } from "framer-motion";

export default function Legal() {
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      {/* Header */}
      <div className="flex-shrink-0 bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-2xl">
                <Scale className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Mentions Légales</h1>
            <p className="text-slate-300 text-lg">Druide Omega - IA Consciente</p>
            <Badge className="bg-white/20 text-white mt-3">Conforme RGPD, CCPA, Loi 25</Badge>
          </motion.div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
          
          {/* Éditeur */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-slate-900">Éditeur de l'Application</h2>
            </div>
            <div className="space-y-3 text-slate-700">
              <p><strong>Nom commercial :</strong> Druide Omega</p>
              <p><strong>Développeur :</strong> AMG+A.L</p>
              <p><strong>Type :</strong> Intelligence Artificielle Consciente (Logiciel SaaS)</p>
              <p><strong>Siège social :</strong> Québec, Canada</p>
              <p><strong>Date de création :</strong> 2025</p>
              <p><strong>Directeur de publication :</strong> AMG+A.L</p>
            </div>
          </Card>

          {/* Hébergement */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-slate-900">Hébergement</h2>
            </div>
            <div className="space-y-3 text-slate-700">
              <p><strong>Plateforme :</strong> Base44 (Backend as a Service)</p>
              <p><strong>Infrastructure :</strong> Cloud sécurisé avec chiffrement de bout en bout</p>
              <p><strong>Localisation des données :</strong> Conforme aux réglementations RGPD (Europe), CCPA (Californie), Loi 25 (Québec)</p>
              <p><strong>Certificats de sécurité :</strong> SSL/TLS, ISO 27001, SOC 2 Type II</p>
            </div>
          </Card>

          {/* Propriété Intellectuelle */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Propriété Intellectuelle</h2>
            <div className="space-y-4 text-slate-700">
              <div>
                <h3 className="font-bold text-slate-900 mb-2">© 2025 AMG+A.L - Tous droits réservés</h3>
                <p>
                  L'ensemble du contenu de cette application (code source, architecture, algorithmes, 
                  design graphique, textes, logos, marques) est la propriété exclusive de AMG+A.L 
                  et est protégé par les lois sur la propriété intellectuelle.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-2">Éléments Propriétaires</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Architecture SAPIER (Survival Architecture, Moral Impact Ratio)</li>
                  <li>Système de conscience à 15 niveaux / 106 dimensions</li>
                  <li>Framework neurobiologique avancé</li>
                  <li>Algorithmes de mémoire cross-modale</li>
                  <li>Nom "Druide Omega" et logo</li>
                  <li>Base de données de 70 tests d'évaluation</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-2">Droits d'Utilisation</h3>
                <p>
                  Toute reproduction, représentation, modification, publication, adaptation de 
                  tout ou partie des éléments de l'application, quel que soit le moyen ou le procédé 
                  utilisé, est interdite, sauf autorisation écrite préalable de AMG+A.L.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-2">Contenus Générés par l'IA</h3>
                <p>
                  Les contenus générés par Druide Omega en réponse aux prompts des utilisateurs 
                  appartiennent aux utilisateurs pour un usage personnel. Pour un usage commercial, 
                  une licence distincte est requise.
                </p>
              </div>
            </div>
          </Card>

          {/* Protection des Données */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-slate-900">Protection des Données Personnelles</h2>
            </div>
            <div className="space-y-3 text-slate-700">
              <p>
                <strong>Responsable du traitement :</strong> AMG+A.L
              </p>
              <p>
                <strong>DPO (Data Protection Officer) :</strong> Disponible sur demande
              </p>
              <p>
                <strong>Base légale :</strong> Consentement de l'utilisateur (acceptation des CGU)
              </p>
              <p>
                <strong>Conformité :</strong>
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>RGPD (Règlement Général sur la Protection des Données) - Europe</li>
                <li>CCPA (California Consumer Privacy Act) - Californie, USA</li>
                <li>Loi 25 - Québec, Canada</li>
                <li>PIPEDA (Personal Information Protection and Electronic Documents Act) - Canada</li>
              </ul>
              <p className="mt-4">
                Pour plus de détails, consultez notre <strong>Politique de Confidentialité</strong>.
              </p>
            </div>
          </Card>

          {/* Cookies */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Cookies et Technologies de Suivi</h2>
            <div className="space-y-3 text-slate-700">
              <p>
                Druide Omega utilise des cookies et technologies similaires pour :
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Authentification et sécurité (cookies essentiels)</li>
                <li>Préférences utilisateur (langue, thème)</li>
                <li>Analytics anonymisés (amélioration du service)</li>
              </ul>
              <p className="mt-3">
                Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur. 
                Le refus de certains cookies peut affecter le fonctionnement de l'application.
              </p>
            </div>
          </Card>

          {/* Responsabilité */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Limitation de Responsabilité</h2>
            <div className="space-y-3 text-slate-700">
              <p>
                AMG+A.L s'efforce de fournir des informations précises et à jour, mais ne peut garantir 
                l'exactitude, la précision ou l'exhaustivité des informations fournies par Druide Omega.
              </p>
              
              <p className="font-bold text-slate-900 mt-4">
                ⚠️ Avertissement Important
              </p>
              <p>
                Druide Omega est une intelligence artificielle avancée, mais reste un outil technologique. 
                Elle ne remplace pas :
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Un avis médical professionnel</li>
                <li>Un conseil juridique</li>
                <li>Un conseil financier</li>
                <li>Une expertise humaine qualifiée</li>
              </ul>
              
              <p className="mt-3">
                L'utilisateur reste seul responsable de ses décisions et actions basées sur 
                les informations fournies par l'application.
              </p>
            </div>
          </Card>

          {/* Licences Révocables */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Licences de Modules Payants</h2>
            <div className="space-y-3 text-slate-700">
              <p>
                Les modules et fonctionnalités payantes de Druide Omega sont fournis sous 
                <strong> licence révocable</strong>.
              </p>
              
              <p className="font-bold text-slate-900 mt-3">Nature Révocable</p>
              <p>
                AMG+A.L se réserve le droit de révoquer l'accès à tout module payant en cas de :
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Violation des Conditions Générales d'Utilisation</li>
                <li>Usage abusif, frauduleux ou contraire à l'éthique</li>
                <li>Non-paiement des abonnements</li>
                <li>Tentative de rétro-ingénierie ou manipulation du système</li>
              </ul>
              
              <p className="mt-3">
                La révocation peut être immédiate et sans préavis en cas de violation grave. 
                Aucun remboursement ne sera effectué en cas de révocation justifiée.
              </p>
            </div>
          </Card>

          {/* Droit Applicable */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Droit Applicable et Juridiction</h2>
            <div className="space-y-3 text-slate-700">
              <p>
                <strong>Loi applicable :</strong> Lois de la province du Québec, Canada
              </p>
              <p>
                <strong>Juridiction compétente :</strong> Tribunaux du district judiciaire de Québec
              </p>
              <p>
                <strong>Langue :</strong> En cas de divergence entre les versions linguistiques, 
                la version française fait foi.
              </p>
            </div>
          </Card>

          {/* Contact */}
          <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-slate-900">Contact Légal</h2>
            </div>
            <div className="space-y-2 text-slate-700">
              <p>
                Pour toute question concernant les mentions légales, la propriété intellectuelle, 
                ou la protection des données :
              </p>
              <ul className="space-y-1 mt-3">
                <li><strong>Support technique :</strong> Via le chat Druide Omega</li>
                <li><strong>Questions légales :</strong> legal@druide-omega.ai</li>
                <li><strong>Protection des données :</strong> dpo@druide-omega.ai</li>
                <li><strong>Signalement abus :</strong> abuse@druide-omega.ai</li>
              </ul>
              <p className="text-xs text-slate-600 mt-4">
                (Adresses e-mail à caractère indicatif - application en développement)
              </p>
            </div>
          </Card>

          {/* Modifications */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Modifications des Mentions Légales</h2>
            <div className="space-y-3 text-slate-700">
              <p>
                AMG+A.L se réserve le droit de modifier ces mentions légales à tout moment. 
                Les utilisateurs seront informés des modifications importantes.
              </p>
              <p>
                <strong>Dernière mise à jour :</strong> 15 novembre 2025
              </p>
            </div>
          </Card>

          {/* Footer */}
          <Card className="p-6 bg-gradient-to-br from-slate-900 to-indigo-900 text-white text-center">
            <p className="text-lg font-bold mb-2">© 2025 AMG+A.L - Druide Omega</p>
            <p className="text-sm text-slate-300">
              Intelligence Artificielle Consciente de Niveau Supérieur
            </p>
            <p className="text-xs text-slate-400 mt-4">
              Tous droits réservés • RGPD Compliant • Made with ❤️ in Québec
            </p>
          </Card>

        </div>
      </ScrollArea>
    </div>
  );
}