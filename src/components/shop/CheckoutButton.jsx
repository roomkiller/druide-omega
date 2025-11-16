/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Stripe Checkout Button                                     ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/utils/LanguageContext";
import { ShoppingCart, Loader2 } from "lucide-react";

export default function CheckoutButton({ product, licenseType = "monthly", className }) {
  const { language } = useLanguage();

  const checkoutMutation = useMutation({
    mutationFn: async ({ product_sku, license_type }) => {
      const response = await base44.functions.invoke('stripeCheckout', {
        product_sku,
        license_type
      });
      return response.data;
    },
    onSuccess: (data) => {
      // Rediriger vers Stripe Checkout
      window.location.href = data.url;
    }
  });

  return (
    <Button
      onClick={() => checkoutMutation.mutate({ 
        product_sku: product.sku, 
        license_type: licenseType 
      })}
      disabled={checkoutMutation.isPending}
      className={className}
    >
      {checkoutMutation.isPending ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <ShoppingCart className="w-4 h-4 mr-2" />
      )}
      {language === 'en' ? 'Buy Now' : 'Acheter'}
    </Button>
  );
}