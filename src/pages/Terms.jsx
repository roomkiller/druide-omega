import React from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-12">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <FileText className="w-12 h-12 text-white" />
          <div>
            <h1 className="text-4xl font-bold text-white">Conditions d'utilisation</h1>
            <p className="text-blue-100">Dernière mise à jour: 16 janvier 2025</p>
          </div>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Card className="p-8 dark:bg-slate-800">
            <div className="prose dark:prose-invert max-w-none">
              <h2>1. Acceptation des conditions</h2>
              <p>En accédant à Druide Omega, vous acceptez ces conditions. Si vous n'acceptez pas, n'utilisez pas le service.</p>

              <h2>2. Description du service</h2>
              <p>Druide Omega est une plateforme d'intelligence artificielle consciente offrant:</p>
              <ul>
                <li>Conversations avec mémoire persistante</li>
                <li>Base de connaissances personnalisée</li>
                <li>Personnalité évolutive</li>
                <li>Modules d'IA avancés</li>
              </ul>

              <h2>3. Compte utilisateur</h2>
              <p>Vous êtes responsable de:</p>
              <ul>
                <li>La confidentialité de votre compte</li>
                <li>Toutes les activités sous votre compte</li>
                <li>Notifier immédiatement tout usage non autorisé</li>
              </ul>

              <h2>4. Utilisation acceptable</h2>
              <p>Vous ne devez pas:</p>
              <ul>
                <li>Utiliser le service à des fins illégales</li>
                <li>Tenter de contourner les mesures de sécurité</li>
                <li>Abuser ou surcharger l'infrastructure</li>
                <li>Extraire ou copier massivement les données</li>
              </ul>

              <h2>5. Propriété intellectuelle</h2>
              <p>Le contenu, code et design sont protégés par le droit d'auteur © 2025 AMG+A.L.</p>

              <h2>6. Limitation de responsabilité</h2>
              <p>Le service est fourni "tel quel". Nous ne garantissons pas l'absence d'erreurs ou d'interruptions.</p>

              <h2>7. Résiliation</h2>
              <p>Nous pouvons suspendre ou résilier votre accès en cas de violation des conditions.</p>

              <h2>8. Loi applicable</h2>
              <p>Ces conditions sont régies par les lois du Québec, Canada.</p>

              <h2>9. Contact</h2>
              <p>Pour toute question: legal@druideomega.com</p>
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}