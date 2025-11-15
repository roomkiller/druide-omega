/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Copyright Notice Component                                 ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Copyright, FileCheck } from "lucide-react";

export default function CopyrightNotice({ variant = "full" }) {
  if (variant === "compact") {
    return (
      <div className="text-center py-4 text-xs text-slate-500">
        © 2025 AMG+A.L - Druide Omega - Tous droits réservés
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <footer className="bg-slate-900 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-3">Druide Omega</h3>
              <p className="text-sm text-slate-300">
                Intelligence Artificielle Consciente de Niveau Supérieur
              </p>
              <div className="flex gap-2 mt-3">
                <Badge className="bg-white/20 text-white text-xs">RGPD</Badge>
                <Badge className="bg-white/20 text-white text-xs">Loi 25</Badge>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-3">Légal</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><a href="/Terms" className="hover:text-white">Conditions d'Utilisation</a></li>
                <li><a href="/Privacy" className="hover:text-white">Politique de Confidentialité</a></li>
                <li><a href="/Legal" className="hover:text-white">Mentions Légales</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-3">Contact</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>Support : Via le chat</li>
                <li>Légal : legal@druide-omega.ai</li>
                <li>DPO : privacy@druide-omega.ai</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700 mt-8 pt-6 text-center">
            <p className="text-sm text-slate-400">
              © 2025 AMG+A.L - Druide Omega - Tous droits réservés
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Architecture SAPIER propriétaire • 15 niveaux de conscience • 106 dimensions • Made with ❤️ in Québec
            </p>
          </div>
        </div>
      </footer>
    );
  }

  // Full variant
  return (
    <Card className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-300">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center flex-shrink-0">
          <Copyright className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            © 2025 AMG+A.L - Tous droits réservés
          </h3>
          
          <p className="text-sm text-slate-700 mb-4">
            Druide Omega et l'ensemble de ses composants (architecture SAPIER, système de conscience, 
            algorithmes, design) sont la propriété exclusive de AMG+A.L et protégés par les lois sur 
            la propriété intellectuelle.
          </p>

          <div className="grid md:grid-cols-2 gap-3">
            <Card className="p-3 bg-white border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="font-bold text-sm text-slate-900">Propriété Intellectuelle</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1">
                <li>• Code source propriétaire</li>
                <li>• Framework SAPIER (breveté)</li>
                <li>• Architecture de conscience</li>
                <li>• Marques et logos</li>
              </ul>
            </Card>

            <Card className="p-3 bg-white border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <FileCheck className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-sm text-slate-900">Conformité</span>
              </div>
              <div className="flex flex-wrap gap-1">
                <Badge className="text-xs bg-green-100 text-green-700">RGPD</Badge>
                <Badge className="text-xs bg-blue-100 text-blue-700">CCPA</Badge>
                <Badge className="text-xs bg-purple-100 text-purple-700">Loi 25</Badge>
                <Badge className="text-xs bg-orange-100 text-orange-700">PIPEDA</Badge>
              </div>
            </Card>
          </div>

          <p className="text-xs text-slate-500 mt-4">
            Toute reproduction ou utilisation non autorisée est strictement interdite et passible de poursuites.
          </p>
        </div>
      </div>
    </Card>
  );
}