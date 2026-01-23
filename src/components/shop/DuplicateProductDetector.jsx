/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Duplicate Product Detector & Remover                       ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { AlertTriangle, Trash2, Loader2, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function DuplicateProductDetector({ products, onDuplicatesRemoved }) {
  const [removing, setRemoving] = useState(false);
  const [removed, setRemoved] = useState([]);

  // Detect duplicates by name and category
  const duplicates = useMemo(() => {
    const grouped = {};
    
    products.forEach(product => {
      const key = `${product.name}-${product.category}`.toLowerCase();
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(product);
    });

    return Object.values(grouped)
      .filter(group => group.length > 1)
      .map(group => ({
        name: group[0].name,
        category: group[0].category,
        count: group.length,
        items: group.sort((a, b) => new Date(b.created_date) - new Date(a.created_date)),
        toRemove: group.slice(1) // Keep newest, remove older ones
      }));
  }, [products]);

  const handleRemoveDuplicates = async () => {
    if (duplicates.length === 0) return;
    
    setRemoving(true);
    try {
      const removedIds = [];
      
      for (const dupGroup of duplicates) {
        for (const product of dupGroup.toRemove) {
          await base44.entities.Product.delete(product.id);
          removedIds.push(product.id);
        }
      }
      
      setRemoved(removedIds);
      onDuplicatesRemoved?.(removedIds);
      setTimeout(() => {
        setRemoved([]);
      }, 3000);
    } catch (error) {
      console.error("Error removing duplicates:", error);
      alert("Erreur: " + error.message);
    } finally {
      setRemoving(false);
    }
  };

  if (duplicates.length === 0) {
    return (
      <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <div>
            <h3 className="font-bold text-slate-900">Aucun doublon détecté</h3>
            <p className="text-sm text-slate-600">Votre catalogue de produits est propre</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-r from-orange-50 to-red-50 border-orange-300">
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-orange-600" />
          <div>
            <h3 className="font-bold text-slate-900">
              {duplicates.length} groupe(s) de doublon(s) détecté(s)
            </h3>
            <p className="text-sm text-slate-600">
              {duplicates.reduce((sum, d) => sum + d.toRemove.length, 0)} produits doublons à supprimer
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {duplicates.map((dupGroup, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg p-4 border-2 border-orange-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-bold text-slate-900">{dupGroup.name}</h4>
                <Badge className="mt-1 bg-orange-600">{dupGroup.count} exemplaires</Badge>
              </div>
              <Badge variant="outline">{dupGroup.category}</Badge>
            </div>

            <div className="space-y-2">
              {dupGroup.items.map((item, itemIdx) => (
                <div
                  key={item.id}
                  className={`text-sm p-2 rounded flex justify-between items-center ${
                    itemIdx === 0
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <div>
                    <span className={itemIdx === 0 ? 'font-bold text-green-700' : 'text-red-700'}>
                      {itemIdx === 0 ? '✓ Conservé' : '✗ À supprimer'}
                    </span>
                    <span className="text-slate-500 ml-2">
                      ({new Date(item.created_date).toLocaleDateString()})
                    </span>
                  </div>
                  <span className="text-xs text-slate-600">{item.sku}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <Button
        onClick={handleRemoveDuplicates}
        disabled={removing}
        className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-lg py-6 text-white"
      >
        {removing ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Suppression en cours...
          </>
        ) : (
          <>
            <Trash2 className="w-5 h-5 mr-2" />
            Supprimer les {duplicates.reduce((sum, d) => sum + d.toRemove.length, 0)} doublon(s)
          </>
        )}
      </Button>

      {removed.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-green-100 border border-green-300 rounded text-green-700 text-sm"
        >
          ✓ {removed.length} produit(s) supprimé(s) avec succès
        </motion.div>
      )}
    </Card>
  );
}