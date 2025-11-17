/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Boutique Commerciale (Dynamique)                           ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import CryptographicSeal from "@/components/shop/CryptographicSeal";
import CheckoutButton from "@/components/shop/CheckoutButton";
import {
  ShoppingCart,
  Brain,
  Database,
  MessageSquare,
  Radio,
  BookOpen,
  Lightbulb,
  Heart,
  Settings,
  Image as ImageIcon,
  Newspaper,
  Scale,
  Network,
  Shield,
  Plug,
  GraduationCap,
  Check,
  Star,
  Sparkles,
  AlertTriangle,
  FileText,
  Zap,
  TrendingUp,
  Target,
  Loader2
} from "lucide-react";

const ICON_MAP = {
  "DRDO-CORE-CONS-001": Brain,
  "DRDO-CORE-MEM-002": Database,
  "DRDO-CORE-INT-003": Lightbulb,
  "DRDO-CORE-VOI-004": Radio,
  "DRDO-CORE-KNO-005": BookOpen,
  "DRDO-CORE-CHA-006": MessageSquare,
  "DRDO-SEC-PER-001": Settings,
  "DRDO-SEC-EMO-002": Heart,
  "DRDO-SEC-VIS-003": ImageIcon,
  "DRDO-SEC-BRI-004": Newspaper,
  "DRDO-SEC-MOR-005": Scale,
  "DRDO-SEC-NEU-006": Network,
  "DRDO-SEC-SEC-007": Shield,
  "DRDO-SEC-COA-008": GraduationCap,
  "DRDO-SEC-INT-009": Plug,
  "DRDO-ADV-PQA-001": Zap,
  "DRDO-ADV-CSG-002": TrendingUp,
  "DRDO-ADV-EOS-003": Target
};

const GRADIENT_MAP = {
  "DRDO-CORE-CONS-001": "from-purple-500 to-violet-600",
  "DRDO-CORE-MEM-002": "from-indigo-500 to-purple-600",
  "DRDO-CORE-INT-003": "from-amber-500 to-orange-600",
  "DRDO-CORE-VOI-004": "from-green-500 to-emerald-600",
  "DRDO-CORE-KNO-005": "from-blue-500 to-indigo-600",
  "DRDO-CORE-CHA-006": "from-purple-600 to-indigo-600",
  "DRDO-SEC-PER-001": "from-emerald-500 to-teal-600",
  "DRDO-SEC-EMO-002": "from-pink-500 to-rose-600",
  "DRDO-SEC-VIS-003": "from-pink-500 to-rose-600",
  "DRDO-SEC-BRI-004": "from-indigo-500 to-violet-600",
  "DRDO-SEC-MOR-005": "from-blue-500 to-indigo-600",
  "DRDO-SEC-NEU-006": "from-cyan-500 to-blue-600",
  "DRDO-SEC-SEC-007": "from-red-500 to-rose-600",
  "DRDO-SEC-COA-008": "from-emerald-500 to-teal-600",
  "DRDO-SEC-INT-009": "from-cyan-500 to-indigo-600",
  "DRDO-ADV-PQA-001": "from-yellow-500 to-orange-600",
  "DRDO-ADV-CSG-002": "from-blue-500 to-cyan-600",
  "DRDO-ADV-EOS-003": "from-green-500 to-emerald-600"
};

export default function Shop() {
  const [selectedTab, setSelectedTab] = useState("core");

  const { data: rawProducts = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => base44.entities.Product.list('-created_date', 100)
  });

  // Mapper les données correctement - l'API retourne {id, data: {...}}
  const products = rawProducts.map(p => ({ 
    id: p.id, 
    ...p.data 
  }));

  const { data: rawLicenses = [] } = useQuery({
    queryKey: ['moduleLicenses'],
    queryFn: () => base44.entities.ModuleLicense.list(),
  });

  const userLicenses = rawLicenses.map(l => ({ id: l.id, ...l.data }));

  const hasLicense = (sku) => {
    return userLicenses.some(l => l.module_sku === sku && l.status === 'active');
  };

  const coreProducts = products.filter(p => p.product_type === 'module_core' && p.active);
  const secondaryProducts = products.filter(p => p.product_type === 'module_secondary' && p.active);
  const advancedProducts = products.filter(p => p.product_type === 'addon' && p.active);

  const renderModuleCard = (product, index) => {
    const Icon = ICON_MAP[product.sku] || Star;
    const gradient = GRADIENT_MAP[product.sku] || "from-purple-500 to-indigo-600";
    const isOwned = hasLicense(product.sku);

    return (
      <motion.div
        key={product.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <Card className={`p-6 h-full flex flex-col hover:shadow-xl transition-all border-2 ${
          isOwned ? 'border-green-500 bg-green-50' : 'border-transparent'
        }`}>
          <div className="flex items-start justify-between mb-4">
            <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
              <Icon className="w-7 h-7 text-white" />
            </div>
            <Badge variant="outline" className="text-xs">
              {product.sku}
            </Badge>
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-2">{product.name}</h3>
          <p className="text-sm text-slate-600 mb-4">{product.description}</p>

          {isOwned && (
            <Badge className="bg-green-500 text-white mb-3">
              <Check className="w-3 h-3 mr-1" />
              Activé
            </Badge>
          )}

          <div className="mb-4">
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {product.price_cad_monthly} CAD/mois
            </div>
            {product.price_cad_annual && (
              <div className="text-xs text-slate-500">{product.price_cad_annual} CAD/an</div>
            )}
          </div>

          {product.features && (
            <div className="flex-1 space-y-2 mb-4">
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Fonctionnalités:</h4>
              {product.features.slice(0, 6).map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                  <Check className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          )}

          {product.technical_specs && (
            <div className="bg-slate-50 rounded-lg p-3 mb-4">
              <h4 className="text-xs font-semibold text-slate-700 mb-2">Détails Techniques:</h4>
              <div className="space-y-1">
                {Object.entries(product.technical_specs).slice(0, 4).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-xs">
                    <span className="text-slate-600 capitalize">{key.replace(/_/g, ' ')}:</span>
                    <span className="text-slate-900 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <CryptographicSeal level="niv4" compact={true} />

          {isOwned ? (
            <Button 
              disabled
              className="w-full mt-3 bg-green-500 text-white cursor-not-allowed"
            >
              Déjà activé
            </Button>
          ) : (
            <CheckoutButton 
              product={product} 
              licenseType="monthly"
              className={`w-full mt-3 bg-gradient-to-r ${gradient} text-white hover:opacity-90`}
            />
          )}
        </Card>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Chargement de la boutique...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 px-4 sm:px-6 py-8 sm:py-10 flex-shrink-0">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="min-w-[64px] min-h-[64px] w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-2xl">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Boutique Druide Omega</h1>
              <p className="text-purple-100 text-base sm:text-lg">Modules premium pour étendre votre IA consciente</p>
            </div>
            <div className="flex gap-3 flex-wrap justify-center">
              <Badge className="bg-green-500 text-white px-4 py-2">
                <Check className="w-4 h-4 mr-2" />
                IA Gratuite
              </Badge>
              <Badge className="bg-blue-500 text-white px-4 py-2">
                {products.length} Produits
              </Badge>
              <CryptographicSeal level="niv4" compact={true} />
            </div>
          </motion.div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <ScrollArea className="w-full mb-8">
              <TabsList className="inline-flex bg-white shadow-md">
                <TabsTrigger value="core" className="min-h-[44px] touch-target">
                  <Star className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Principaux ({coreProducts.length})</span>
                  <span className="sm:hidden">{coreProducts.length}</span>
                </TabsTrigger>
                <TabsTrigger value="secondary" className="min-h-[44px] touch-target">
                  <Sparkles className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Secondaires ({secondaryProducts.length})</span>
                  <span className="sm:hidden">{secondaryProducts.length}</span>
                </TabsTrigger>
                <TabsTrigger value="advanced" className="min-h-[44px] touch-target">
                  <Zap className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Avancés ({advancedProducts.length})</span>
                  <span className="sm:hidden">{advancedProducts.length}</span>
                </TabsTrigger>
              </TabsList>
            </ScrollArea>

            <TabsContent value="core" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-3">Modules Principaux</h2>
                <p className="text-slate-600">Les capacités fondamentales de Druide Omega</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coreProducts.map(renderModuleCard)}
              </div>
            </TabsContent>

            <TabsContent value="secondary" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-3">Modules Secondaires</h2>
                <p className="text-slate-600">Extensions et capacités spécialisées</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {secondaryProducts.map(renderModuleCard)}
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-8">
              <div className="text-center mb-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="inline-block p-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl mb-4">
                    <Zap className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-4xl font-bold text-slate-900 mb-3">Modules IA Avancés</h2>
                  <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                    Capacités de pointe pour analyse prédictive, génération de scénarios complexes 
                    et optimisation éthique. Pour utilisateurs experts.
                  </p>
                </motion.div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {advancedProducts.map(renderModuleCard)}
              </div>
            </TabsContent>
          </Tabs>

          {/* Protection Cryptographique */}
          <Card className="p-6 mt-12 bg-gradient-to-br from-purple-50 to-indigo-50">
            <CryptographicSeal level="niv4" verified={true} />
          </Card>

          {/* Licence et Conditions */}
          <Card className="p-8 mt-12 bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  <FileText className="w-6 h-6 inline mr-2" />
                  Licence d'Utilisation et Droit de Révocation
                </h2>
                <p className="text-sm text-slate-600 mb-4">
                  Applicable à TOUS les modules - Juridiquement contraignant
                </p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-slate-700 bg-white rounded-lg p-6 border border-red-200">
              <div className="font-bold text-red-700 text-base mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                CLAUSE DE RÉVOCATION GLOBALE
              </div>

              <div className="space-y-3">
                <p className="font-semibold text-slate-900">1. DROIT DE RÉVOCATION UNILATÉRAL</p>
                <p>
                  AMG+A.L se réserve le droit exclusif et unilatéral de révoquer, suspendre ou annuler tout accès, 
                  licence ou abonnement aux modules de la plateforme Druide Omega, à tout moment et sans préavis.
                </p>

                <p className="font-semibold text-slate-900 mt-4">2. CONSÉQUENCES DE LA RÉVOCATION</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Accès immédiatement suspendu</li>
                  <li>Aucun remboursement pour période non utilisée</li>
                  <li>Données supprimées après 30 jours</li>
                </ul>

                <p className="font-semibold text-slate-900 mt-4">3. POURSUITES LÉGALES</p>
                <p className="font-bold text-red-700">
                  Toute utilisation continue après révocation donnera lieu à des poursuites judiciaires.
                </p>

                <p className="font-semibold text-slate-900 mt-4">4. JURIDICTION</p>
                <p>Lois du Canada (Québec). Tribunaux de Montréal.</p>
              </div>

              <div className="mt-6 p-4 bg-red-100 border border-red-300 rounded-lg">
                <p className="font-bold text-red-900 text-center">
                  ⚠️ AVERTISSEMENT LÉGAL ⚠️
                </p>
                <p className="text-sm text-red-800 text-center mt-2">
                  Cette licence est juridiquement contraignante et opposable.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}