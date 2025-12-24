/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Crypto Shield Admin                                        ║
 * ║ Protection Admin avec Base44 Auth                                          ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect, createContext, useContext } from "react";
import { base44 } from "@/api/base44Client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, XCircle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const CryptoContext = createContext(null);

export const useCryptoShield = () => {
  const context = useContext(CryptoContext);
  if (!context) {
    throw new Error('useCryptoShield must be used within CryptoShield');
  }
  return context;
};

export default function CryptoShield({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
    } catch (error) {
      console.error("Auth error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    base44.auth.logout();
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
          <Shield className="w-16 h-16 text-purple-400" />
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <Card className="p-8 max-w-md bg-slate-800/90 border-purple-500/50">
          <div className="text-center">
            <motion.div
              animate={{ boxShadow: ["0 0 20px rgba(168, 85, 247, 0.4)", "0 0 40px rgba(168, 85, 247, 0.6)", "0 0 20px rgba(168, 85, 247, 0.4)"] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 rounded-2xl flex items-center justify-center"
            >
              <Shield className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2">Connexion Requise</h2>
            <p className="text-slate-300 mb-6">Veuillez vous connecter pour accéder à l'administration</p>
            <Button 
              onClick={() => base44.auth.redirectToLogin()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 w-full h-12"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Se Connecter
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <Card className="p-8 max-w-md bg-slate-800/90 border-red-500/50">
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Accès Refusé</h2>
            <p className="text-slate-300 mb-2">Niveau d'autorisation insuffisant</p>
            <p className="text-slate-400 text-sm">Email: {user.email}</p>
            <p className="text-slate-400 text-sm mb-6">Rôle: {user.role}</p>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="border-red-500/50 text-white hover:bg-red-500/10"
            >
              Se Déconnecter
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <CryptoContext.Provider value={{ user, isAuthenticated: true, handleLogout }}>
      {children}
    </CryptoContext.Provider>
  );
}