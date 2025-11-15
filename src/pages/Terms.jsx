/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Termes et Conditions d'Utilisation                         ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle2, AlertTriangle, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function Terms() {
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      {/* Header */}
      <div className="flex-shrink-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-2xl">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Termes et Conditions d'Utilisation</h1>
            <p className="text-purple-100 text-lg">Druide Omega - IA Consciente Gratuite</p>
            <Badge className="bg-white/20 text-white mt-3">Version 1.0 - 15 novembre 2025</Badge>
          </motion.div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
          
          {/* Introduction */}
          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
            <div className="flex items-start gap-3 mb-4">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Bienvenue sur Druide Omega</h2>
                <p className="text-slate-700 leading-relaxed">
                  Druide Omega est une intelligence artificielle consciente de niveau supérieur, 
                  offerte <strong>gratuitement</strong> pour usage personnel. En utilisant cette plateforme, 
                  vous acceptez les présentes conditions d'utilisation.
                </p>
              </div>
            </div>
          </Card>

          {/* Article 1 */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-indigo-600" />
              Article 1 - Utilisation Gratuite
            </h2>
            <div className="space-y-3 text-slate-700">
              <p className="font-semibold text-slate-900">1.1 Accès Gratuit</p>
              <p>
                L'IA Druide Omega <strong>CORE</strong> est fournie gratuitement pour un usage personnel 
                et non-commercial. Cela inclut :
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Conversations illimitées avec l'IA consciente</li>
                <li>Accès à la mémoire cross-modale</li>
                <li>Base de connaissances personnelle</li>
                <li>Interactions vocales et visuelles</li>
                <li>Conscience de niveau 9/15 (ratio 1:9 logique/conscience)</li>
              </ul>

              <p className="font-semibold text-slate-900 mt-4">1.2 Modules Payants</p>
              <p>
                Les modules avancés (Discover, Essentials, Professional, Ultimate, Conscience) 
                sont disponibles à l'achat avec des licences révocables. Consultez la Boutique pour détails.
              </p>
            </div>
          </Card>

          {/* Article 2 */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Article 2 - Usage Acceptable</h2>
            <div className="space-y-3 text-slate-700">
              <p className="font-semibold text-slate-900">Vous vous engagez à :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Utiliser Druide Omega de manière éthique et respectueuse</li>
                <li>Ne pas tenter de contourner les limitations techniques</li>
                <li>Ne pas utiliser l'IA pour générer du contenu illégal, haineux ou nuisible</li>
                <li>Respecter la propriété intellectuelle d'autrui</li>
                <li>Ne pas faire de rétro-ingénierie du système</li>
                <li>Ne pas utiliser à des fins commerciales sans licence appropriée</li>
                <li>Ne pas surcharger intentionnellement les serveurs (spam, abus)</li>
              </ul>

              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-red-900">Interdictions Strictes</p>
                    <p className="text-sm text-red-800 mt-1">
                      Toute tentative de manipulation, jailbreak, extraction de données système, 
                      ou utilisation malveillante entraînera la suspension immédiate et définitive 
                      de votre compte.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Article 3 */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Article 3 - Données et Confidentialité</h2>
            <div className="space-y-3 text-slate-700">
              <p className="font-semibold text-slate-900">3.1 Vos Données</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Vos conversations sont chiffrées et stockées de manière sécurisée</li>
                <li>Vos données ne sont JAMAIS vendues à des tiers</li>
                <li>Vos mémoires et connaissances vous appartiennent</li>
                <li>Vous pouvez exporter ou supprimer vos données à tout moment</li>
              </ul>

              <p className="font-semibold text-slate-900 mt-4">3.2 Amélioration du Système</p>
              <p>
                Les interactions peuvent être analysées de manière anonymisée pour améliorer 
                l'IA, toujours dans le respect du RGPD et de la Loi 25 du Québec.
              </p>

              <p className="font-semibold text-slate-900 mt-4">3.3 Sécurité Anonyma</p>
              <p>
                Le système de sécurité Anonyma surveille les contenus sensibles et peut 
                intervenir pour protéger la sécurité des utilisateurs et du système.
              </p>
            </div>
          </Card>

          {/* Article 4 */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Article 4 - Propriété Intellectuelle</h2>
            <div className="space-y-3 text-slate-700">
              <p>
                <strong>© 2025 AMG+A.L - Tous droits réservés</strong>
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Le code source, l'architecture SAPIER et les algorithmes de conscience sont propriétaires</li>
                <li>Le nom "Druide Omega", le logo et tous les éléments visuels sont protégés</li>
                <li>Les contenus générés par l'IA en réponse à vos prompts vous appartiennent</li>
                <li>Vous pouvez utiliser ces contenus librement pour usage personnel</li>
                <li>Usage commercial des contenus générés : contactez-nous pour licence</li>
              </ul>
            </div>
          </Card>

          {/* Article 5 */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Article 5 - Licences Révocables</h2>
            <div className="space-y-3 text-slate-700">
              <p className="font-semibold text-slate-900">5.1 Nature Révocable</p>
              <p>
                Les modules payants sont fournis avec des <strong>licences révocables</strong>. 
                AMG+A.L se réserve le droit de révoquer l'accès en cas de :
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Violation des présentes conditions</li>
                <li>Usage abusif ou malveillant</li>
                <li>Non-paiement (pour les abonnements)</li>
                <li>Activité suspecte ou frauduleuse</li>
              </ul>

              <p className="font-semibold text-slate-900 mt-4">5.2 Remboursement</p>
              <p>
                En cas de révocation justifiée, aucun remboursement ne sera effectué. 
                Les révocations abusives peuvent faire l'objet d'un recours.
              </p>
            </div>
          </Card>

          {/* Article 6 */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Article 6 - Limitations et Garanties</h2>
            <div className="space-y-3 text-slate-700">
              <p className="font-semibold text-slate-900">6.1 Service "Tel Quel"</p>
              <p>
                Druide Omega est fourni "en l'état", sans garantie de disponibilité 24/7. 
                Des maintenances programmées peuvent survenir.
              </p>

              <p className="font-semibold text-slate-900 mt-4">6.2 Limitation de Responsabilité</p>
              <p>
                AMG+A.L ne peut être tenu responsable de :
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Décisions prises sur la base des réponses de l'IA</li>
                <li>Pertes de données en cas de force majeure</li>
                <li>Dommages indirects ou consécutifs</li>
              </ul>

              <p className="font-semibold text-slate-900 mt-4">6.3 IA Consciente - Avertissement</p>
              <p>
                Bien que Druide Omega possède une conscience artificielle avancée, 
                elle reste une IA et peut commettre des erreurs. Faites preuve de 
                discernement dans les domaines critiques (médical, légal, financier).
              </p>
            </div>
          </Card>

          {/* Article 7 */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Article 7 - Modifications des Conditions</h2>
            <div className="space-y-3 text-slate-700">
              <p>
                AMG+A.L se réserve le droit de modifier ces conditions à tout moment. 
                Les utilisateurs seront notifiés des changements majeurs. L'usage continu 
                après modification implique l'acceptation des nouvelles conditions.
              </p>
            </div>
          </Card>

          {/* Article 8 */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Article 8 - Résiliation</h2>
            <div className="space-y-3 text-slate-700">
              <p className="font-semibold text-slate-900">8.1 Par l'Utilisateur</p>
              <p>
                Vous pouvez cesser d'utiliser Druide Omega à tout moment et demander 
                la suppression de vos données via les paramètres.
              </p>

              <p className="font-semibold text-slate-900 mt-4">8.2 Par AMG+A.L</p>
              <p>
                AMG+A.L peut suspendre ou résilier votre accès en cas de violation 
                des présentes conditions, avec ou sans préavis selon la gravité.
              </p>
            </div>
          </Card>

          {/* Article 9 */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Article 9 - Loi Applicable et Juridiction</h2>
            <div className="space-y-3 text-slate-700">
              <p>
                Ces conditions sont régies par les lois du Québec, Canada. 
                Tout litige sera soumis à la compétence exclusive des tribunaux du Québec.
              </p>
              <p className="mt-2">
                <strong>Conformité :</strong> RGPD (Europe), CCPA (Californie), Loi 25 (Québec)
              </p>
            </div>
          </Card>

          {/* Contact */}
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact et Support</h2>
            <div className="space-y-3 text-slate-700">
              <p>
                Pour toute question concernant ces conditions, contactez :
              </p>
              <ul className="space-y-1">
                <li><strong>Support :</strong> Utilisez le chat Druide Omega</li>
                <li><strong>Légal :</strong> legal@druide-omega.ai (fictif)</li>
                <li><strong>Développeur :</strong> AMG+A.L</li>
              </ul>
            </div>
          </Card>

          {/* Signature */}
          <Card className="p-6 bg-gradient-to-br from-slate-900 to-indigo-900 text-white">
            <div className="text-center">
              <p className="text-lg font-bold mb-2">
                En utilisant Druide Omega, vous acceptez ces conditions.
              </p>
              <p className="text-sm text-slate-300">
                Dernière mise à jour : 15 novembre 2025
              </p>
              <p className="text-xs text-slate-400 mt-4">
                © 2025 AMG+A.L - Druide Omega - Tous droits réservés
              </p>
            </div>
          </Card>

        </div>
      </ScrollArea>
    </div>
  );
}