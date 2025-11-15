/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Module Purchase Dialog                                     ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { base44 } from "@/api/base44Client";
import { CheckCircle2, AlertTriangle, Shield, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

export default function ModulePurchaseDialog({ module, open, onOpenChange, onPurchaseComplete }) {
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [error, setError] = useState(null);

  if (!module) return null;

  const plans = {
    trial: {
      name: "Essai Gratuit",
      duration: "14 jours",
      price: 0,
      restrictions: { max_daily_uses: 10 }
    },
    monthly: {
      name: "Mensuel",
      duration: "1 mois",
      price: module.price_cad_monthly || 49,
      restrictions: { max_daily_uses: 100 }
    },
    annual: {
      name: "Annuel",
      duration: "12 mois",
      price: module.price_cad_annual || 499,
      restrictions: null,
      savings: "17%"
    },
    lifetime: {
      name: "Perpétuel",
      duration: "À vie",
      price: (module.price_cad_annual || 499) * 3,
      restrictions: null
    }
  };

  const selectedPlanDetails = plans[selectedPlan];

  const handlePurchase = async () => {
    if (!acceptedTerms) {
      setError("Vous devez accepter les conditions de licence révocable");
      return;
    }

    setIsPurchasing(true);
    setError(null);

    try {
      // Calcul de la date d'expiration
      let expirationDate = null;
      if (selectedPlan === "trial") {
        expirationDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
      } else if (selectedPlan === "monthly") {
        expirationDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      } else if (selectedPlan === "annual") {
        expirationDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
      }

      // Créer la licence
      await base44.entities.ModuleLicense.create({
        module_sku: module.sku,
        module_name: module.name,
        license_type: selectedPlan,
        status: "active",
        activation_date: new Date().toISOString(),
        expiration_date: expirationDate,
        usage_count: 0,
        purchase_details: {
          price_paid: selectedPlanDetails.price,
          currency: "CAD",
          payment_method: "demo_mode",
          transaction_id: `TXN_${Date.now()}`
        },
        restrictions: selectedPlanDetails.restrictions || {}
      });

      onPurchaseComplete?.();
      onOpenChange(false);
    } catch (err) {
      setError(err.message || "Erreur lors de l'achat");
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Acheter {module.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Module Info */}
          <Card className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
            <h3 className="font-bold text-slate-900 mb-2">{module.name}</h3>
            <p className="text-sm text-slate-700">{module.description}</p>
          </Card>

          {/* Plan Selection */}
          <div>
            <h4 className="font-bold text-slate-900 mb-3">Choisissez votre plan</h4>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(plans).map(([key, plan]) => (
                <motion.div
                  key={key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    onClick={() => setSelectedPlan(key)}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedPlan === key
                        ? "border-2 border-purple-500 bg-purple-50"
                        : "hover:border-purple-200"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h5 className="font-bold text-slate-900">{plan.name}</h5>
                        <p className="text-xs text-slate-600">{plan.duration}</p>
                      </div>
                      {plan.savings && (
                        <Badge className="bg-green-500 text-white">{plan.savings}</Badge>
                      )}
                    </div>
                    <p className="text-2xl font-bold text-purple-600">
                      {plan.price === 0 ? "Gratuit" : `${plan.price} CAD`}
                    </p>
                    {plan.restrictions && (
                      <p className="text-xs text-slate-500 mt-2">
                        Max {plan.restrictions.max_daily_uses} uses/jour
                      </p>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Licence Révocable Warning */}
          <Alert className="border-amber-200 bg-amber-50">
            <Shield className="w-4 h-4 text-amber-600" />
            <AlertDescription className="text-sm text-amber-900">
              <strong>Licence Révocable :</strong> Cette licence peut être révoquée en cas de violation 
              des conditions d'utilisation, d'abus ou de non-paiement. En cas de révocation justifiée, 
              aucun remboursement ne sera effectué.
            </AlertDescription>
          </Alert>

          {/* Terms Acceptance */}
          <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
            <Checkbox
              id="terms"
              checked={acceptedTerms}
              onCheckedChange={setAcceptedTerms}
              className="mt-1"
            />
            <label htmlFor="terms" className="text-sm text-slate-700 cursor-pointer flex-1">
              J'accepte les <strong>conditions de licence révocable</strong> et je comprends que 
              l'accès peut être révoqué en cas de violation des conditions d'utilisation. 
              Je reconnais qu'aucun remboursement ne sera effectué en cas de révocation justifiée.
            </label>
          </div>

          {/* Error */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Purchase Button */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              onClick={handlePurchase}
              disabled={!acceptedTerms || isPurchasing}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
            >
              {isPurchasing ? (
                "Traitement..."
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  {selectedPlanDetails.price === 0 ? "Activer l'essai" : `Acheter ${selectedPlanDetails.price} CAD`}
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-center text-slate-500">
            Mode démo - Aucun paiement réel ne sera effectué
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}