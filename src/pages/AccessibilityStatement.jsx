import React from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Eye, Keyboard, Volume2, CheckCircle } from "lucide-react";

export default function AccessibilityStatement() {
  const features = [
    {
      icon: Keyboard,
      title: "Navigation au clavier",
      description: "Toutes les fonctionnalités sont accessibles au clavier. Tab, Entrée, Échap supportés.",
      wcag: "2.1.1, 2.1.3"
    },
    {
      icon: Eye,
      title: "Lecteurs d'écran",
      description: "Support ARIA complet, régions landmarks, textes alternatifs sur images.",
      wcag: "1.3.1, 4.1.2"
    },
    {
      icon: Volume2,
      title: "Synthèse vocale",
      description: "TTS intégré pour lire les réponses de l'IA. Contrôles accessibles.",
      wcag: "1.2.1"
    },
    {
      icon: CheckCircle,
      title: "Contraste des couleurs",
      description: "Ratios WCAG AA respectés (4.5:1 minimum). Mode sombre disponible.",
      wcag: "1.4.3, 1.4.11"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <Badge className="bg-white/20 text-white mb-4">WCAG 2.1 AA</Badge>
          <h1 className="text-4xl font-bold text-white mb-2">Déclaration d'accessibilité</h1>
          <p className="text-emerald-100">Druide Omega - Engagement envers l'accessibilité numérique</p>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Card className="p-8 mb-6">
            <h2 className="text-2xl font-bold mb-4">Notre engagement</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Druide Omega s'engage à rendre son intelligence artificielle accessible à tous, 
              y compris les personnes en situation de handicap. Nous visons la conformité 
              aux <strong>Web Content Accessibility Guidelines (WCAG) 2.1 niveau AA</strong>.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Date d'évaluation: 16 janvier 2025
            </p>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card key={idx} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
                      <p className="text-sm text-slate-600 mb-2">{feature.description}</p>
                      <Badge variant="outline" className="text-xs">WCAG {feature.wcag}</Badge>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <Card className="p-8 mb-6">
            <h2 className="text-xl font-bold mb-4">Raccourcis clavier</h2>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b">
                <span className="text-slate-600">Aller au contenu principal</span>
                <kbd className="px-2 py-1 bg-slate-100 rounded">Tab</kbd>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-slate-600">Naviguer entre éléments</span>
                <kbd className="px-2 py-1 bg-slate-100 rounded">Tab / Shift+Tab</kbd>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-slate-600">Activer un bouton</span>
                <kbd className="px-2 py-1 bg-slate-100 rounded">Entrée / Espace</kbd>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-600">Fermer modal</span>
                <kbd className="px-2 py-1 bg-slate-100 rounded">Échap</kbd>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-xl font-bold mb-4">Signaler un problème</h2>
            <p className="text-slate-600 mb-4">
              Si vous rencontrez des obstacles d'accessibilité, contactez-nous:
            </p>
            <div className="space-y-2 text-slate-600">
              <p>📧 Email: accessibility@druideomega.com</p>
              <p>⏱️ Délai de réponse: 48 heures</p>
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}