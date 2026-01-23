/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Product Management & Revenue Strategy (Admin)              ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/components/utils/LanguageContext";
import { 
  Package, 
  DollarSign, 
  TrendingUp, 
  RefreshCw,
  Edit,
  Eye,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Target,
  Zap,
  Lock
} from "lucide-react";
import { motion } from "framer-motion";
import CompetitivePriceAnalyzer from "../components/shop/CompetitivePriceAnalyzer";

export default function ProductManagement() {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => base44.entities.Product.list('-created_date', 100)
  });

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const isAdmin = user?.role === 'admin';

  const handleRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['products'] });
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handlePricesAdjusted = (updates) => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };

  // Stats
  const stats = {
    total: products.length,
    active: products.filter(p => p.active).length,
    monthly_revenue: products.reduce((sum, p) => sum + (p.price_cad_monthly || 0), 0),
    avg_price: products.length > 0 
      ? Math.round(products.reduce((sum, p) => sum + (p.price_cad_monthly || 0), 0) / products.length)
      : 0
  };

  if (!isAdmin) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            {isEn ? "Admin Access Required" : "Accès Administrateur Requis"}
          </h1>
          <p className="text-slate-600">
            {isEn ? "Only administrators can access this page." : "Seuls les administrateurs peuvent accéder à cette page."}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 py-6 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {isEn ? "Revenue Strategy" : "Stratégie de Revenus"}
                </h1>
                <p className="text-blue-100 text-sm">
                  {isEn ? "Pricing, products & market position" : "Tarification, produits & positionnement marché"}
                </p>
              </div>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outline"
              className="bg-white/10 text-white border-white/20"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-slate-600">Produits Total</div>
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-slate-600">Actifs</div>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-600">{stats.active}</div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-slate-600">Prix Moyen</div>
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-purple-600">{stats.avg_price} CAD</div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-slate-600">Revenus Potentiels</div>
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(stats.monthly_revenue / 1000)}K CAD
              </div>
            </Card>
          </div>

          {/* Competitive Price Analyzer */}
          <CompetitivePriceAnalyzer 
            products={products} 
            onPricesAdjusted={handlePricesAdjusted}
          />

          {/* Products Table */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Catalogue de Produits</h2>
              <Badge variant="outline">{products.length} produits</Badge>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-slate-600">Chargement des produits...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-slate-900">{product.name}</h3>
                            <Badge variant="outline" className="text-xs">
                              {product.sku}
                            </Badge>
                            {product.active && (
                              <Badge className="bg-green-500 text-white text-xs">Actif</Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 mb-3">{product.description}</p>
                          
                          <div className="flex flex-wrap gap-4 text-sm">
                            <div>
                              <span className="text-slate-500">Mensuel:</span>
                              <span className="font-bold text-blue-600 ml-1">
                                {product.price_cad_monthly} CAD
                              </span>
                            </div>
                            {product.price_cad_annual && (
                              <div>
                                <span className="text-slate-500">Annuel:</span>
                                <span className="font-bold text-purple-600 ml-1">
                                  {product.price_cad_annual} CAD
                                </span>
                              </div>
                            )}
                            <div>
                              <span className="text-slate-500">Catégorie:</span>
                              <Badge className="ml-1 text-xs">{product.category}</Badge>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <BarChart3 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}