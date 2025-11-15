/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Politique de Confidentialité                               ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Eye, Database, UserCheck, Download } from "lucide-react";
import { motion } from "framer-motion";

export default function Privacy() {
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-green-50/30 to-emerald-50/30">
      {/* Header */}
      <div className="flex-shrink-0 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-2xl">
                <Lock className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Politique de Confidentialité</h1>
            <p className="text-emerald-100 text-lg">Protection et respect de vos données personnelles</p>
            <div className="flex justify-center gap-2 mt-4 flex-wrap">
              <Badge className="bg-white/20 text-white">RGPD</Badge>
              <Badge className="bg-white/20 text-white">CCPA</Badge>
              <Badge className="bg-white/20 text-white">Loi 25</Badge>
              <Badge className="bg-white/20 text-white">PIPEDA</Badge>
            </div>
          </motion.div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">

          {/* Introduction */}
          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Notre Engagement</h2>
            <p className="text-slate-700 leading-relaxed">
              Chez Druide Omega, la protection de vos données personnelles est une priorité absolue. 
              Cette politique explique comment nous collectons, utilisons, stockons et protégeons vos informations, 
              en totale conformité avec les réglementations internationales (RGPD, CCPA, Loi 25, PIPEDA).
            </p>
          </Card>

          {/* Données Collectées */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-slate-900">1. Données Collectées</h2>
            </div>
            <div className="space-y-4 text-slate-700">
              <div>
                <h3 className="font-bold text-slate-900 mb-2">1.1 Données d'Identification</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Adresse e-mail (pour l'authentification)</li>
                  <li>Nom complet (optionnel)</li>
                  <li>Préférences de langue</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-2">1.2 Données d'Interaction</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Conversations avec l'IA (messages, contexte)</li>
                  <li>Mémoires créées (informations importantes sauvegardées)</li>
                  <li>Base de connaissances personnelle</li>
                  <li>Profils de conscience et personnalité configurés</li>
                  <li>Contenus visuels générés</li>
                  <li>Interactions vocales (si utilisées)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-2">1.3 Données Techniques</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Adresse IP (anonymisée)</li>
                  <li>Type de navigateur et appareil</li>
                  <li>Données de navigation (pages visitées, durée)</li>
                  <li>Cookies techniques essentiels</li>
                  <li>Logs de sécurité</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-2">1.4 Données Analytics</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Statistiques d'usage (anonymisées)</li>
                  <li>Comportements d'interaction</li>
                  <li>Préférences d'utilisation</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Finalités */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-slate-900">2. Finalités du Traitement</h2>
            </div>
            <div className="space-y-3 text-slate-700">
              <p>Vos données sont utilisées exclusivement pour :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Fourniture du service :</strong> Permettre le fonctionnement de l'IA et la continuité des conversations</li>
                <li><strong>Personnalisation :</strong> Adapter les réponses selon vos préférences et historique</li>
                <li><strong>Amélioration :</strong> Optimiser les algorithmes et performances (données anonymisées)</li>
                <li><strong>Sécurité :</strong> Détecter et prévenir les abus, fraudes et violations</li>
                <li><strong>Support :</strong> Vous assister en cas de problème technique</li>
                <li><strong>Conformité légale :</strong> Respecter nos obligations réglementaires</li>
              </ul>
              
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="font-bold text-green-900">✅ Garantie Zéro Vente</p>
                <p className="text-sm text-green-800 mt-1">
                  Vos données ne sont <strong>JAMAIS</strong> vendues, louées ou partagées avec des tiers 
                  à des fins commerciales. Jamais. Point final.
                </p>
              </div>
            </div>
          </Card>

          {/* Base Légale */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Base Légale du Traitement</h2>
            <div className="space-y-3 text-slate-700">
              <p>Conformément au RGPD, nos bases légales sont :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Consentement :</strong> Vous acceptez nos conditions d'utilisation lors de votre inscription</li>
                <li><strong>Exécution du contrat :</strong> Nécessaire pour fournir le service Druide Omega</li>
                <li><strong>Intérêt légitime :</strong> Amélioration du service et sécurité (anonymisé)</li>
                <li><strong>Obligation légale :</strong> Conservation de certaines données pour conformité</li>
              </ul>
            </div>
          </Card>

          {/* Conservation */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Durée de Conservation</h2>
            <div className="space-y-3 text-slate-700">
              <table className="w-full text-sm">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="text-left p-3 font-bold">Type de Données</th>
                    <th className="text-left p-3 font-bold">Durée</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-3">Compte utilisateur actif</td>
                    <td className="p-3">Tant que le compte est actif</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Conversations et mémoires</td>
                    <td className="p-3">Jusqu'à suppression par l'utilisateur</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Logs de sécurité</td>
                    <td className="p-3">12 mois maximum</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Analytics anonymisés</td>
                    <td className="p-3">24 mois</td>
                  </tr>
                  <tr>
                    <td className="p-3">Compte supprimé</td>
                    <td className="p-3">Suppression sous 30 jours (sauf obligations légales)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          {/* Sécurité */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-slate-900">5. Mesures de Sécurité</h2>
            </div>
            <div className="space-y-3 text-slate-700">
              <p>Nous mettons en œuvre des mesures de sécurité avancées :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Chiffrement :</strong> SSL/TLS pour les communications, chiffrement au repos (AES-256)</li>
                <li><strong>Authentification :</strong> Système sécurisé Base44 avec protection contre les attaques</li>
                <li><strong>Anonyma Security Layer :</strong> Système de détection des contenus sensibles et menaces</li>
                <li><strong>Isolation des données :</strong> Row Level Security (RLS) - chaque utilisateur n'accède qu'à ses données</li>
                <li><strong>Sauvegardes :</strong> Backups réguliers chiffrés</li>
                <li><strong>Audits :</strong> Revues de sécurité régulières</li>
                <li><strong>Personnel :</strong> Accès limité aux données, accord de confidentialité</li>
              </ul>
            </div>
          </Card>

          {/* Droits */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-slate-900">6. Vos Droits</h2>
            </div>
            <div className="space-y-4 text-slate-700">
              <p>Conformément aux réglementations, vous disposez des droits suivants :</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <h4 className="font-bold text-blue-900 mb-2">✅ Droit d'Accès</h4>
                  <p className="text-sm text-blue-800">
                    Obtenir une copie de toutes vos données personnelles
                  </p>
                </Card>

                <Card className="p-4 bg-green-50 border-green-200">
                  <h4 className="font-bold text-green-900 mb-2">✏️ Droit de Rectification</h4>
                  <p className="text-sm text-green-800">
                    Corriger vos données inexactes ou incomplètes
                  </p>
                </Card>

                <Card className="p-4 bg-red-50 border-red-200">
                  <h4 className="font-bold text-red-900 mb-2">🗑️ Droit à l'Effacement</h4>
                  <p className="text-sm text-red-800">
                    Supprimer vos données (droit à l'oubli)
                  </p>
                </Card>

                <Card className="p-4 bg-purple-50 border-purple-200">
                  <h4 className="font-bold text-purple-900 mb-2">⛔ Droit d'Opposition</h4>
                  <p className="text-sm text-purple-800">
                    Vous opposer au traitement de vos données
                  </p>
                </Card>

                <Card className="p-4 bg-orange-50 border-orange-200">
                  <h4 className="font-bold text-orange-900 mb-2">📦 Droit à la Portabilité</h4>
                  <p className="text-sm text-orange-800">
                    Récupérer vos données dans un format structuré
                  </p>
                </Card>

                <Card className="p-4 bg-yellow-50 border-yellow-200">
                  <h4 className="font-bold text-yellow-900 mb-2">⏸️ Droit à la Limitation</h4>
                  <p className="text-sm text-yellow-800">
                    Limiter le traitement de vos données
                  </p>
                </Card>
              </div>

              <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                <h4 className="font-bold text-indigo-900 mb-2">💡 Comment Exercer vos Droits</h4>
                <p className="text-sm text-indigo-800">
                  Via les <strong>Paramètres</strong> de l'application ou en contactant : 
                  <strong> privacy@druide-omega.ai</strong>
                  <br/>
                  Délai de réponse : <strong>30 jours maximum</strong>
                </p>
              </div>
            </div>
          </Card>

          {/* Cookies */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Cookies et Technologies Similaires</h2>
            <div className="space-y-3 text-slate-700">
              <table className="w-full text-sm">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="text-left p-3 font-bold">Type</th>
                    <th className="text-left p-3 font-bold">Finalité</th>
                    <th className="text-left p-3 font-bold">Durée</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-3">Essentiels</td>
                    <td className="p-3">Authentification, sécurité</td>
                    <td className="p-3">Session / 1 an</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Préférences</td>
                    <td className="p-3">Langue, thème, paramètres</td>
                    <td className="p-3">1 an</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Analytics</td>
                    <td className="p-3">Statistiques anonymisées</td>
                    <td className="p-3">24 mois</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-sm mt-3">
                Vous pouvez gérer les cookies via votre navigateur. Le refus de certains cookies 
                peut limiter les fonctionnalités.
              </p>
            </div>
          </Card>

          {/* Transferts Internationaux */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Transferts Internationaux</h2>
            <div className="space-y-3 text-slate-700">
              <p>
                Vos données sont hébergées sur une infrastructure cloud sécurisée conforme RGPD. 
                En cas de transfert hors UE/Canada, nous utilisons :
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Clauses contractuelles types (CCT) approuvées par la Commission Européenne</li>
                <li>Mécanismes de certification appropriés</li>
                <li>Garanties de protection équivalentes</li>
              </ul>
            </div>
          </Card>

          {/* Mineurs */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Protection des Mineurs</h2>
            <div className="space-y-3 text-slate-700">
              <p>
                Druide Omega est destiné aux personnes de <strong>13 ans et plus</strong>.
              </p>
              <p>
                Pour les mineurs de 13-15 ans (en Europe) : consentement parental requis.
              </p>
              <p>
                Si nous découvrons qu'un mineur de moins de 13 ans utilise le service sans autorisation, 
                nous supprimerons immédiatement son compte.
              </p>
            </div>
          </Card>

          {/* Modifications */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Modifications de la Politique</h2>
            <div className="space-y-3 text-slate-700">
              <p>
                Nous pouvons modifier cette politique pour refléter les évolutions de nos pratiques 
                ou des réglementations. Les modifications importantes vous seront notifiées par e-mail 
                ou via l'application.
              </p>
              <p>
                <strong>Date de dernière mise à jour :</strong> 15 novembre 2025
              </p>
            </div>
          </Card>

          {/* Contact */}
          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <Download className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-slate-900">Contact et Réclamations</h2>
            </div>
            <div className="space-y-3 text-slate-700">
              <p><strong>Responsable de la protection des données (DPO) :</strong></p>
              <ul className="space-y-1">
                <li>📧 Email : dpo@druide-omega.ai</li>
                <li>📧 Confidentialité : privacy@druide-omega.ai</li>
              </ul>
              
              <p className="mt-4"><strong>Droit de réclamation :</strong></p>
              <p className="text-sm">
                Vous avez le droit de déposer une réclamation auprès de l'autorité de contrôle compétente :
              </p>
              <ul className="text-sm space-y-1">
                <li>🇪🇺 Europe : CNIL (France), CNPD (Luxembourg), etc.</li>
                <li>🇨🇦 Canada : Commissariat à la protection de la vie privée</li>
                <li>🇺🇸 Californie : California Attorney General</li>
              </ul>
            </div>
          </Card>

          {/* Footer */}
          <Card className="p-6 bg-gradient-to-br from-slate-900 to-emerald-900 text-white text-center">
            <p className="text-lg font-bold mb-2">🔒 Votre Confiance, Notre Priorité</p>
            <p className="text-sm text-slate-300">
              Druide Omega - Protection Maximale de vos Données Personnelles
            </p>
            <p className="text-xs text-slate-400 mt-4">
              © 2025 AMG+A.L - Conforme RGPD, CCPA, Loi 25, PIPEDA
            </p>
          </Card>

        </div>
      </ScrollArea>
    </div>
  );
}