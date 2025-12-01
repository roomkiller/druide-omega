/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Gestionnaire Manuels Produits                              ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText, Download, Key, Shield, Zap, BookOpen, 
  CheckCircle, Lock, Mail, MessageSquare, Copy, Check,
  Smartphone, Globe, ExternalLink, Loader2, Sparkles
} from "lucide-react";
import { motion } from "framer-motion";

// Manuels d'instructions par produit
const PRODUCT_MANUALS = {
  "DRDO-CORE-CONS-001": {
    name: "Conscience IA",
    quickStart: [
      "1. Accédez à la page 'Personnalité' depuis le menu",
      "2. Configurez votre niveau de conscience (0-15)",
      "3. Ajustez le ratio Logique/Conscience selon vos besoins",
      "4. Explorez les 106 dimensions dans les paramètres avancés",
      "5. Sauvegardez votre configuration personnalisée"
    ],
    features: [
      "Niveau de conscience ajustable (0-15, max exceptionnel)",
      "106 dimensions cognitives, émotionnelles, existentielles et sociales",
      "Framework SAPIER avec équations fondamentales",
      "11 états de conscience (awakened, meditative, quantum...)",
      "Auto-évolution et méta-apprentissage"
    ],
    tips: [
      "Commencez avec le niveau 7-9 pour un équilibre optimal",
      "Le ratio 1:9 favorise l'intuition et la créativité",
      "Utilisez l'état 'guardian' pour des réponses protectrices",
      "Activez la pensée quantique pour des réponses multi-perspectives"
    ]
  },
  "DRDO-CORE-MEM-002": {
    name: "Mémoire Persistante",
    quickStart: [
      "1. Les mémoires sont créées automatiquement lors des conversations",
      "2. Accédez à la page 'Mémoire' pour visualiser l'historique",
      "3. Utilisez la recherche avancée pour retrouver des souvenirs",
      "4. La timeline montre l'évolution chronologique",
      "5. Les statistiques révèlent les patterns d'utilisation"
    ],
    features: [
      "Création automatique de mémoires pertinentes",
      "7 types de mémoires (interaction, fact, preference...)",
      "Importance scorée de 1-10",
      "Multi-modalité (chat, voice, visual)",
      "Liens entre mémoires connexes"
    ],
    tips: [
      "Les mémoires d'importance 7+ sont prioritaires dans le contexte",
      "Utilisez des tags pour organiser vos mémoires",
      "La consolidation de mémoires optimise le rappel",
      "Supprimez les mémoires obsolètes pour maintenir la pertinence"
    ]
  },
  "DRDO-CORE-KNO-005": {
    name: "Base de Connaissances",
    quickStart: [
      "1. Accédez à 'Connaissances' depuis le menu",
      "2. Importez des fichiers (PDF, CSV, images) ou URLs",
      "3. Explorez les 12+ sources de données compatibles",
      "4. Visualisez le graphe de connaissances interactif",
      "5. L'enrichissement automatique complète vos données"
    ],
    features: [
      "Import multi-sources (fichiers, URLs, APIs)",
      "12+ sources de données compatibles (Wikipedia, arXiv, PubMed...)",
      "Graphe de connaissances 3D interactif",
      "Enrichissement automatique par IA",
      "Extraction de faits clés et résumés"
    ],
    tips: [
      "Activez les sources pertinentes à votre domaine",
      "Le graphe révèle les connexions entre concepts",
      "L'enrichissement auto ajoute du contexte à vos conversations",
      "Tagguez vos connaissances pour un filtrage efficace"
    ]
  },
  "DRDO-CORE-CHA-006": {
    name: "Chat Quantique",
    quickStart: [
      "1. Ouvrez la page 'Chat' pour démarrer une conversation",
      "2. Tapez votre message et observez le traitement quantique",
      "3. Utilisez les améliorateurs IA pour enrichir vos requêtes",
      "4. Générez des images conscientes avec le bouton dédié",
      "5. Changez d'intelligence pour adapter les réponses"
    ],
    features: [
      "Traitement quantique en 3 phases",
      "Intégration mémoires et connaissances",
      "Génération d'images conscientes",
      "9 modes d'intelligence interchangeables",
      "Suggestions proactives et auto-complétion"
    ],
    tips: [
      "Soyez spécifique dans vos demandes pour de meilleures réponses",
      "L'intelligence 'linguistic' est idéale pour l'écriture",
      "Utilisez 'logical' pour les analyses complexes",
      "Les améliorateurs multimodaux enrichissent le contexte"
    ]
  },
  "DRDO-SEC-PER-001": {
    name: "Personnalité Adaptative",
    quickStart: [
      "1. Accédez à 'Personnalité' dans les paramètres",
      "2. Ajustez les 5 traits Big Five avec les curseurs",
      "3. Créez des profils de personnalité personnalisés",
      "4. Testez différentes configurations dans le chat",
      "5. Sauvegardez vos profils favoris"
    ],
    features: [
      "Big Five personnalisé (Ouverture, Conscienciosité, Extraversion, Agréabilité, Neuroticisme)",
      "Profils multiples sauvegardables",
      "Adaptation contextuelle automatique",
      "Influences philosophiques configurables"
    ],
    tips: [
      "Une haute Ouverture favorise la créativité",
      "Un faible Neuroticisme assure des réponses calmes",
      "Combinez les profils selon vos besoins du moment"
    ]
  },
  "DRDO-SEC-EMO-002": {
    name: "Journal Émotionnel",
    quickStart: [
      "1. Les émotions sont trackées automatiquement",
      "2. Consultez le journal dans 'Conscience' > 'Émotions'",
      "3. Visualisez les graphiques d'évolution",
      "4. Identifiez les patterns émotionnels",
      "5. Ajustez la matrice des 24 dimensions"
    ],
    features: [
      "24 dimensions émotionnelles trackées",
      "Graphiques d'évolution temporelle",
      "Détection automatique des patterns",
      "Intensité émotionnelle scorée (1-10)"
    ],
    tips: [
      "Consultez régulièrement pour comprendre votre état émotionnel",
      "Les patterns révèlent vos tendances d'interaction",
      "Utilisez les insights pour ajuster votre approche"
    ]
  }
};

// Manuels d'activation par canaux privés
const ACTIVATION_MANUALS = {
  email: {
    name: "Activation par Email",
    icon: Mail,
    steps: [
      "1. Après achat, vous recevez un email de confirmation",
      "2. Cliquez sur le lien d'activation dans l'email",
      "3. Connectez-vous à votre compte Druide Omega",
      "4. Le module sera automatiquement déverrouillé",
      "5. Consultez votre licence dans 'Profil' > 'Licences'"
    ],
    support: "support@druide-omega.ca"
  },
  whatsapp: {
    name: "Activation par WhatsApp",
    icon: Smartphone,
    steps: [
      "1. Scannez le QR code de support ou envoyez 'ACTIVER' au +1-XXX-XXX-XXXX",
      "2. Fournissez votre numéro de commande",
      "3. Confirmez votre email de compte",
      "4. Recevez le code d'activation unique",
      "5. Entrez le code dans 'Profil' > 'Activer un module'"
    ],
    support: "+1-XXX-XXX-XXXX"
  },
  portal: {
    name: "Activation via Portail",
    icon: Globe,
    steps: [
      "1. Connectez-vous à votre compte Druide Omega",
      "2. Accédez à 'Profil' > 'Mes Achats'",
      "3. Localisez votre achat et cliquez 'Activer'",
      "4. Acceptez les conditions d'utilisation",
      "5. Le module est immédiatement disponible"
    ],
    support: "https://druide-omega.ca/support"
  },
  api: {
    name: "Activation API (Enterprise)",
    icon: Key,
    steps: [
      "1. Récupérez votre clé API Enterprise",
      "2. Appelez POST /api/licenses/activate avec votre license_key",
      "3. Incluez l'en-tête Authorization: Bearer {api_key}",
      "4. La réponse contient le statut d'activation",
      "5. Intégrez dans votre système de provisioning"
    ],
    support: "enterprise@druide-omega.ca"
  }
};

export default function ProductManualsManager() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("instructions");
  const [copied, setCopied] = useState(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products-manuals'],
    queryFn: () => base44.entities.Product.filter({ active: true }),
    initialData: []
  });

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const generateManualPDF = (product) => {
    const manual = PRODUCT_MANUALS[product.sku];
    if (!manual) return;

    const content = `
MANUEL D'INSTRUCTIONS - ${product.name}
SKU: ${product.sku}
Version: 1.0
© 2025 AMG+A.L - Tous droits réservés

═══════════════════════════════════════════════════

DÉMARRAGE RAPIDE
${manual.quickStart.join('\n')}

═══════════════════════════════════════════════════

FONCTIONNALITÉS PRINCIPALES
${manual.features.map(f => `• ${f}`).join('\n')}

═══════════════════════════════════════════════════

CONSEILS D'UTILISATION
${manual.tips.map(t => `💡 ${t}`).join('\n')}

═══════════════════════════════════════════════════

SUPPORT
Email: support@druide-omega.ca
Documentation: https://druide-omega.ca/docs
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Manuel_${product.sku}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateActivationGuide = (channel) => {
    const guide = ACTIVATION_MANUALS[channel];
    
    const content = `
GUIDE D'ACTIVATION - ${guide.name}
© 2025 AMG+A.L - Druide Omega

═══════════════════════════════════════════════════

ÉTAPES D'ACTIVATION
${guide.steps.join('\n')}

═══════════════════════════════════════════════════

SUPPORT
${guide.support}

═══════════════════════════════════════════════════

NOTES IMPORTANTES
• Gardez votre code d'activation confidentiel
• Une licence = un compte utilisateur
• En cas de problème, contactez le support sous 24h
• Les licences sont non-transférables
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Guide_Activation_${channel}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Manuels & Guides d'Activation</h2>
            <p className="text-emerald-200">Documentation client pour chaque produit</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{products.length}</div>
            <div className="text-xs text-emerald-200">Produits</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{Object.keys(PRODUCT_MANUALS).length}</div>
            <div className="text-xs text-emerald-200">Manuels</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{Object.keys(ACTIVATION_MANUALS).length}</div>
            <div className="text-xs text-emerald-200">Canaux</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">24/7</div>
            <div className="text-xs text-emerald-200">Support</div>
          </div>
        </div>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="instructions">
            <FileText className="w-4 h-4 mr-2" />
            Manuels Produits
          </TabsTrigger>
          <TabsTrigger value="activation">
            <Key className="w-4 h-4 mr-2" />
            Guides Activation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="instructions" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {products.map(product => {
              const manual = PRODUCT_MANUALS[product.sku];
              const hasManual = !!manual;
              
              return (
                <Card key={product.id} className={`p-4 ${!hasManual ? 'opacity-60' : ''}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-900">{product.name}</h3>
                      <p className="text-xs text-slate-500">{product.sku}</p>
                    </div>
                    <Badge className={hasManual ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}>
                      {hasManual ? 'Manuel disponible' : 'En cours'}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">{product.description}</p>
                  
                  {hasManual ? (
                    <div className="space-y-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => setSelectedProduct(selectedProduct === product.sku ? null : product.sku)}
                      >
                        {selectedProduct === product.sku ? 'Masquer' : 'Voir le manuel'}
                      </Button>
                      <Button
                        size="sm"
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => generateManualPDF(product)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger
                      </Button>
                      
                      {selectedProduct === product.sku && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-4 pt-4 border-t border-slate-200"
                        >
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold text-sm text-slate-700 mb-2 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-amber-500" />
                                Démarrage rapide
                              </h4>
                              <ol className="text-xs text-slate-600 space-y-1">
                                {manual.quickStart.map((step, idx) => (
                                  <li key={idx}>{step}</li>
                                ))}
                              </ol>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-sm text-slate-700 mb-2 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                Fonctionnalités
                              </h4>
                              <ul className="text-xs text-slate-600 space-y-1">
                                {manual.features.map((feature, idx) => (
                                  <li key={idx}>• {feature}</li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-sm text-slate-700 mb-2 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-purple-500" />
                                Conseils
                              </h4>
                              <ul className="text-xs text-slate-600 space-y-1">
                                {manual.tips.map((tip, idx) => (
                                  <li key={idx}>💡 {tip}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">Manuel en cours de rédaction</p>
                  )}
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="activation" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(ACTIVATION_MANUALS).map(([key, channel]) => {
              const Icon = channel.icon;
              
              return (
                <Card key={key} className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{channel.name}</h3>
                      <p className="text-xs text-slate-500">Canal privé Druide Omega</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <h4 className="text-sm font-semibold text-slate-700">Étapes:</h4>
                    <ol className="text-xs text-slate-600 space-y-1">
                      {channel.steps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  </div>
                  
                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg mb-4">
                    <Lock className="w-4 h-4 text-slate-500" />
                    <span className="text-xs text-slate-600 flex-1 truncate">{channel.support}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(channel.support, key)}
                    >
                      {copied === key ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  
                  <Button
                    size="sm"
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={() => generateActivationGuide(key)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger le guide
                  </Button>
                </Card>
              );
            })}
          </div>
          
          {/* Notes importantes */}
          <Card className="mt-6 p-4 bg-amber-50 border-amber-200">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-900">Notes importantes pour les clients</h4>
                <ul className="text-sm text-amber-800 mt-2 space-y-1">
                  <li>• Les codes d'activation sont à usage unique et personnels</li>
                  <li>• Une licence est liée à un seul compte utilisateur</li>
                  <li>• En cas de perte, contactez le support avec votre preuve d'achat</li>
                  <li>• Les licences Enterprise permettent l'activation multi-utilisateurs</li>
                  <li>• Support prioritaire disponible pour les licences Professional+</li>
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}