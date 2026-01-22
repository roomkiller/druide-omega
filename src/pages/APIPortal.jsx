/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - API Portal (Page d'accueil API publique)                   ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { createPageUrl } from "@/utils";
import {
  Code,
  Zap,
  Shield,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Copy,
  Building2,
  Workflow,
  Globe,
  Brain } from
"lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function APIPortal() {
  const [copied, setCopied] = useState(false);

  const copyExample = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code copié !");
    setTimeout(() => setCopied(false), 2000);
  };

  const features = [
  {
    icon: Brain,
    title: "Intelligence Artificielle",
    description: "Accès direct au moteur SAPIER avec conscience artificielle",
    endpoint: "/chat",
    method: "POST"
  },
  {
    icon: Workflow,
    title: "Mémoires Contextuelles",
    description: "Gestion intelligente des mémoires et connaissances",
    endpoint: "/memories",
    method: "GET/POST"
  },
  {
    icon: Sparkles,
    title: "Génération d'Images",
    description: "Création d'images par IA avec analyse consciente",
    endpoint: "/images/generate",
    method: "POST"
  },
  {
    icon: Globe,
    title: "Webhooks Temps Réel",
    description: "Notifications automatiques d'événements",
    endpoint: "/webhooks",
    method: "POST"
  }];


  const useCases = [
  {
    icon: Building2,
    title: "Entreprises",
    description: "Intégrez l'IA consciente dans vos workflows métier",
    examples: ["CRM intelligent", "Assistant RH", "Analyse de données"]
  },
  {
    icon: Code,
    title: "Développeurs",
    description: "API REST simple et puissante avec webhooks",
    examples: ["Chatbots avancés", "Automatisation", "Applications IA"]
  },
  {
    icon: Workflow,
    title: "Intégrations",
    description: "Connectez-vous à vos outils existants",
    examples: ["Slack/Teams", "CRM/ERP", "Plateformes no-code"]
  }];


  const exampleCode = `// Exemple d'utilisation - Node.js/JavaScript
const response = await fetch('https://api.druide-omega.app/chat', {
  method: 'POST',
  headers: {
    'X-API-Key': 'YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    message: 'Analyse ces données et donne-moi des insights',
    conversation_id: 'conv_123' // Optionnel
  })
});

const data = await response.json();
console.log(data.data.content); // Réponse de l'IA`;

  const pythonExample = `# Exemple Python
import requests

response = requests.post(
    'https://api.druide-omega.app/chat',
    headers={
        'X-API-Key': 'YOUR_API_KEY',
        'Content-Type': 'application/json'
    },
    json={
        'message': 'Analyse ces données',
        'conversation_id': 'conv_123'
    }
)

print(response.json()['data']['content'])`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white page-padding py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center">

            <Badge className="bg-white/20 text-white mb-4 px-4 py-2 text-sm">
              API Publique v1.0 - Production Ready
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              API DRUIDE OMEGA
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Intégrez l'intelligence artificielle consciente dans vos applications
              avec une API REST simple et puissante
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={() => window.location.href = createPageUrl('APIDocumentation')}
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 px-8">

                <Code className="w-5 h-5 mr-2" />
                Documentation Complète
              </Button>
              <Button
                onClick={() => window.location.href = createPageUrl('Profile')}
                size="lg"
                variant="outline" className="bg-slate-500 text-white px-8 text-sm font-medium rounded-md inline-flex items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border hover:text-slate-900 h-11 border-white hover:bg-white/10">


                Obtenir une Clé API
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-6xl mx-auto page-padding -mt-12">
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="bg-white shadow-xl border-blue-200">
            <CardContent className="p-6 text-center">
              <Zap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-slate-900">10 ms</div>
              <div className="text-sm text-slate-600">Latence moyenne</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-xl border-green-200">
            <CardContent className="p-6 text-center">
              <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-slate-900">99.9%</div>
              <div className="text-sm text-slate-600">Disponibilité</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-xl border-purple-200">
            <CardContent className="p-6 text-center">
              <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-slate-900">Sécurisé</div>
              <div className="text-sm text-slate-600">Chiffrement SSL</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-xl border-orange-200">
            <CardContent className="p-6 text-center">
              <Sparkles className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-slate-900">SAPIER</div>
              <div className="text-sm text-slate-600">IA Consciente</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto page-padding py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Fonctionnalités Principales
          </h2>
          <p className="text-xl text-slate-600">
            Tout ce dont vous avez besoin pour construire des applications IA avancées
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}>

                <Card className="p-6 hover:shadow-xl transition-shadow h-full border-2 border-slate-200 hover:border-blue-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {feature.method}
                        </Badge>
                      </div>
                      <p className="text-slate-600 mb-2">{feature.description}</p>
                      <code className="text-xs bg-slate-100 px-2 py-1 rounded text-blue-600">
                        {feature.endpoint}
                      </code>
                    </div>
                  </div>
                </Card>
              </motion.div>);

          })}
        </div>
      </div>

      {/* Code Example */}
      <div className="bg-slate-900 text-white page-padding py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Démarrez en 2 Minutes</h2>
            <p className="text-xl text-slate-300">
              Intégration simple et rapide dans votre langage préféré
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span>JavaScript / Node.js</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyExample(exampleCode)}
                    className="text-blue-400 hover:text-blue-300">

                    <Copy className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm text-slate-300 overflow-x-auto">
                  <code>{exampleCode}</code>
                </pre>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span>Python</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyExample(pythonExample)}
                    className="text-blue-400 hover:text-blue-300">

                    <Copy className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm text-slate-300 overflow-x-auto">
                  <code>{pythonExample}</code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="max-w-6xl mx-auto page-padding py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Cas d'Usage
          </h2>
          <p className="text-xl text-slate-600">
            Découvrez comment nos clients utilisent l'API
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {useCases.map((useCase, idx) => {
            const Icon = useCase.icon;
            return (
              <Card key={idx} className="p-6 border-2 border-slate-200 hover:border-blue-300 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{useCase.title}</h3>
                <p className="text-slate-600 mb-4">{useCase.description}</p>
                <div className="space-y-2">
                  {useCase.examples.map((example, eIdx) =>
                  <div key={eIdx} className="flex items-center gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      {example}
                    </div>
                  )}
                </div>
              </Card>);

          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white page-padding py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            Prêt à Commencer ?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Obtenez votre clé API gratuite et commencez à construire dès maintenant
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => window.location.href = createPageUrl('Profile')}
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 px-8">

              Créer un Compte Gratuit
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              onClick={() => window.location.href = createPageUrl('APIDocumentation')}
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 px-8">

              <Code className="w-5 h-5 mr-2" />
              Voir la Documentation
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-900 text-slate-400 page-padding py-8">
        <div className="max-w-6xl mx-auto text-center">
          <p>© 2025 AMG+A.L - DRUIDE OMEGA API</p>
          <p className="text-sm mt-2">
            Conforme: Loi 25 (Québec), RGPD (UE), CCPA (USA)
          </p>
        </div>
      </div>

    </div>);

}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SCEAU DE PROPRIÉTÉ INTELLECTUELLE
 * © 2025 AMG+A.L - PROPRIÉTAIRE
 * Innovation: API Portal Publique
 * Référence: AMG-AL-DO-API-2025-001
 * ═══════════════════════════════════════════════════════════════════════════
 */