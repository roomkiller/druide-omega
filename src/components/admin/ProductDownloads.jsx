/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Product Downloads Manager (Free Demo Versions)             ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Download, 
  Package, 
  Eye, 
  CheckCircle,
  Loader2,
  FileText,
  Sparkles,
  Gift
} from "lucide-react";
import { motion } from "framer-motion";

export default function ProductDownloads() {
  const [downloading, setDownloading] = useState(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => base44.entities.Product.list('-created_date'),
    initialData: [],
  });

  const handleDownload = async (product) => {
    setDownloading(product.id);
    
    try {
      // Simuler le téléchargement d'une version démo
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Créer un fichier démo avec les informations du produit
      const demoContent = {
        product_name: product.name,
        sku: product.sku,
        version: "DEMO",
        description: product.description,
        features: product.features || [],
        technical_specs: product.technical_specs || {},
        license_type: "Demo - Evaluation Only",
        validity: "30 days trial",
        restrictions: [
          "Usage limité à 30 jours",
          "Fonctionnalités complètes mais avec watermark",
          "Pas de support technique inclus",
          "Données d'exemple uniquement"
        ],
        full_version_info: {
          price_cad_monthly: product.price_cad_monthly,
          price_cad_annual: product.price_cad_annual,
          upgrade_url: "https://druideomega.app/shop"
        },
        generated_at: new Date().toISOString(),
        copyright: "© 2025 AMG+A.L - Tous droits réservés"
      };

      // Créer et télécharger le fichier JSON
      const blob = new Blob([JSON.stringify(demoContent, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${product.sku}_DEMO_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setDownloading(null);
    }
  };

  const activeProducts = products.filter(p => p.active !== false);
  const productsByType = {
    package: activeProducts.filter(p => p.product_type === 'package'),
    module_core: activeProducts.filter(p => p.product_type === 'module_core'),
    module_secondary: activeProducts.filter(p => p.product_type === 'module_secondary'),
    addon: activeProducts.filter(p => p.product_type === 'addon'),
    license: activeProducts.filter(p => p.product_type === 'license'),
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Gift className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Téléchargements Démo Gratuits
            </h2>
            <p className="text-sm text-slate-600 mb-3">
              Versions d'évaluation gratuites de tous les produits Druide Omega. 
              Téléchargez pour examiner le contenu avant achat.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-green-100 text-green-700 border-green-300">
                <CheckCircle className="w-3 h-3 mr-1" />
                {activeProducts.length} produits disponibles
              </Badge>
              <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                <Eye className="w-3 h-3 mr-1" />
                Accès complet aux spécifications
              </Badge>
              <Badge className="bg-purple-100 text-purple-700 border-purple-300">
                <FileText className="w-3 h-3 mr-1" />
                Format JSON
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Products by Type */}
      <ScrollArea className="h-[600px]">
        <div className="space-y-6 pr-4">
          {Object.entries(productsByType).map(([type, typeProducts]) => {
            if (typeProducts.length === 0) return null;

            const typeLabels = {
              package: { name: "Forfaits Complets", color: "from-purple-500 to-indigo-600", icon: Package },
              module_core: { name: "Modules Core", color: "from-blue-500 to-cyan-600", icon: Sparkles },
              module_secondary: { name: "Modules Secondaires", color: "from-green-500 to-emerald-600", icon: Package },
              addon: { name: "Extensions", color: "from-amber-500 to-orange-600", icon: Package },
              license: { name: "Licences", color: "from-pink-500 to-rose-600", icon: FileText }
            };

            const config = typeLabels[type];
            const Icon = config.icon;

            return (
              <div key={type}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 bg-gradient-to-br ${config.color} rounded-xl flex items-center justify-center shadow-md`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{config.name}</h3>
                    <p className="text-xs text-slate-500">{typeProducts.length} produit(s)</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {typeProducts.map((product, idx) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Card className="p-5 hover:shadow-lg transition-all border-slate-200">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-slate-900 mb-1 truncate">
                              {product.name}
                            </h4>
                            <p className="text-xs text-slate-500 mb-2">SKU: {product.sku}</p>
                            <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                              {product.description}
                            </p>
                          </div>
                        </div>

                        {/* Pricing Info */}
                        <div className="bg-slate-50 rounded-lg p-3 mb-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-600">Prix mensuel:</span>
                            <span className="font-semibold text-slate-900">
                              {product.price_cad_monthly?.toLocaleString('fr-CA')} CAD/mois
                            </span>
                          </div>
                          {product.price_cad_annual && (
                            <div className="flex items-center justify-between text-xs mt-1">
                              <span className="text-slate-600">Prix annuel:</span>
                              <span className="font-semibold text-slate-900">
                                {product.price_cad_annual?.toLocaleString('fr-CA')} CAD/an
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Features Count */}
                        {product.features && product.features.length > 0 && (
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="outline" className="text-xs">
                              <Sparkles className="w-3 h-3 mr-1" />
                              {product.features.length} fonctionnalités
                            </Badge>
                          </div>
                        )}

                        {/* Download Button */}
                        <Button
                          onClick={() => handleDownload(product)}
                          disabled={downloading === product.id}
                          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                        >
                          {downloading === product.id ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Téléchargement...
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4 mr-2" />
                              Télécharger Démo
                            </>
                          )}
                        </Button>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Info Card */}
      <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
        <div className="flex items-start gap-3">
          <FileText className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-amber-900 mb-2">À propos des versions démo</h3>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>• <strong>Contenu complet:</strong> Toutes les spécifications et fonctionnalités détaillées</li>
              <li>• <strong>Format JSON:</strong> Facilement lisible et analysable</li>
              <li>• <strong>Informations tarifaires:</strong> Prix complets inclus</li>
              <li>• <strong>Restrictions:</strong> Usage limité à 30 jours d'évaluation</li>
              <li>• <strong>Copyright:</strong> Tous les droits réservés © 2025 AMG+A.L</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}