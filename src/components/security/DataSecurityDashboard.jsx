import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Lock, Key, Eye, Database, AlertTriangle, CheckCircle2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export default function DataSecurityDashboard() {
  const [validating, setValidating] = useState(false);
  const [lastValidation, setLastValidation] = useState(null);

  const { data: validationReport } = useQuery({
    queryKey: ["dataValidation"],
    queryFn: async () => {
      try {
        const response = await base44.functions.invoke("validatePersonalData", {});
        return response.data;
      } catch {
        return null;
      }
    },
  });

  const handleValidation = async () => {
    setValidating(true);
    try {
      const response = await base44.functions.invoke("validatePersonalData", {});
      setLastValidation(response.data);
      toast.success("Validation complétée avec succès");
    } catch (error) {
      toast.error("Erreur lors de la validation");
      console.error(error);
    } finally {
      setValidating(false);
    }
  };

  const report = lastValidation || validationReport;
  const score = report?.score || 0;
  const checks = report?.checks || [];

  const securityFeatures = [
    {
      icon: Lock,
      title: "Chiffrement TLS",
      desc: "Toutes les communications chiffrées en transit",
      status: "active",
    },
    {
      icon: Key,
      title: "Gestion des clés",
      desc: "Clés gérées par le fournisseur d'infrastructure",
      status: "active",
    },
    {
      icon: Eye,
      title: "RLS (Row Level Security)",
      desc: "Accès aux données basé sur les rôles",
      status: "active",
    },
    {
      icon: Database,
      title: "Chiffrement au repos",
      desc: "Données chiffrées en base de données",
      status: "active",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Score Card */}
      <Card className="bg-gradient-to-r from-blue-900/30 to-green-900/30 border-blue-700">
        <CardHeader>
          <CardTitle className="text-white">Score de Sécurité des Données</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-5xl font-bold text-blue-400">{score}%</div>
              <p className="text-gray-400 mt-2">
                {checks.filter((c) => c.result).length}/{checks.length} vérifications réussies
              </p>
            </div>
            <Button
              onClick={handleValidation}
              disabled={validating}
              className="bg-green-600 hover:bg-green-700"
            >
              {validating ? "Validation..." : "Revalider"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {securityFeatures.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="bg-slate-800 border-slate-700 hover:border-green-600 transition">
                <CardContent className="p-4 flex items-start gap-3">
                  <Icon className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold text-sm">{feature.title}</h4>
                    <p className="text-gray-400 text-xs mt-1">{feature.desc}</p>
                    <Badge className="mt-2 bg-green-600/30 text-green-300">Actif</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Validation Checks */}
      {checks.length > 0 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Détail des Vérifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {checks.map((check, idx) => (
              <motion.div
                key={check.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-3 rounded border flex items-start gap-3 ${
                  check.result
                    ? "bg-green-900/20 border-green-700"
                    : "bg-red-900/20 border-red-700"
                }`}
              >
                {check.result ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <h5 className="text-white font-semibold text-sm">{check.name}</h5>
                  <p className="text-gray-400 text-xs mt-0.5">{check.description}</p>
                  <p className="text-gray-500 text-xs mt-1">{check.details}</p>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}