import React from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-12">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Shield className="w-12 h-12 text-white" />
          <div>
            <h1 className="text-4xl font-bold text-white">Politique de confidentialité</h1>
            <p className="text-green-100">Conforme RGPD, CCPA et Loi 25 (Québec)</p>
          </div>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Card className="p-8 dark:bg-slate-800">
            <div className="prose dark:prose-invert max-w-none">
              <h2>1. Données collectées</h2>
              <p>Nous collectons:</p>
              <ul>
                <li><strong>Données de compte:</strong> email, nom, préférences</li>
                <li><strong>Données d'utilisation:</strong> conversations, mémoires, documents uploadés</li>
                <li><strong>Données techniques:</strong> IP, browser, analytics</li>
              </ul>

              <h2>2. Utilisation des données</h2>
              <ul>
                <li>Fournir et améliorer le service</li>
                <li>Personnaliser l'expérience utilisateur</li>
                <li>Analyser l'utilisation et les performances</li>
                <li>Communiquer avec vous</li>
              </ul>

              <h2>3. Sécurité</h2>
              <p>Nous utilisons:</p>
              <ul>
                <li>Chiffrement TLS/SSL</li>
                <li>Authentification sécurisée (2FA disponible)</li>
                <li>Backups automatisés</li>
                <li>Audit logs complets</li>
              </ul>

              <h2>4. Vos droits (RGPD/Loi 25)</h2>
              <p>Vous avez le droit de:</p>
              <ul>
                <li><strong>Accès:</strong> obtenir une copie de vos données</li>
                <li><strong>Rectification:</strong> corriger vos données</li>
                <li><strong>Suppression:</strong> supprimer votre compte et données</li>
                <li><strong>Portabilité:</strong> exporter vos données (JSON)</li>
                <li><strong>Opposition:</strong> vous opposer au traitement</li>
              </ul>

              <h2>5. Cookies</h2>
              <p>Nous utilisons des cookies essentiels et analytics. Voir notre politique cookies.</p>

              <h2>6. Partage des données</h2>
              <p>Nous ne vendons jamais vos données. Partage limité à:</p>
              <ul>
                <li>Fournisseurs cloud (hébergement sécurisé)</li>
                <li>Services analytics anonymisés</li>
              </ul>

              <h2>7. Rétention</h2>
              <p>Vos données sont conservées tant que votre compte est actif. Suppression sous 30 jours après fermeture.</p>

              <h2>8. Contact DPO</h2>
              <p>Délégué à la protection des données: privacy@druideomega.com</p>
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}