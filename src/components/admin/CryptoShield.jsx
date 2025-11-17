/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Crypto Shield Alpha-Numérique Niveau 4                     ║
 * ║ Protection cryptographique avec Unicode Archétypales                      ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect, createContext, useContext } from "react";
import { base44 } from "@/api/base44Client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Lock, Key, Zap, CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Unicode Archétypales pour le cryptage avancé
 */
const ARCHETYPAL_UNICODE = {
  level1: ['⚡', '⚛', '⚜', '☯', '☸', '✧', '✦', '✵'],
  level2: ['𝕬', '𝕭', '𝕮', '𝕯', '𝕰', '𝕱', '𝕲', '𝕳'],
  level3: ['⍟', '⎔', '⏣', '⎈', '⎊', '⏦', '⏧', '⏨'],
  level4: ['𓀀', '𓀁', '𓀂', '𓀃', '𓀄', '𓀅', '𓀆', '𓀇']
};

class AlphaNumericCrypto {
  constructor() {
    this.sessionDuration = 30 * 60 * 1000;
  }

  injectArchetypalUnicode(hash, level = 4) {
    const unicodes = ARCHETYPAL_UNICODE[`level${level}`];
    let enhanced = '';
    
    for (let i = 0; i < hash.length; i++) {
      enhanced += hash[i];
      if (i % 4 === 3) {
        enhanced += unicodes[Math.floor(Math.random() * unicodes.length)];
      }
    }
    
    return enhanced;
  }

  extractFromArchetypal(enhanced) {
    let hash = '';
    const allUnicodes = Object.values(ARCHETYPAL_UNICODE).flat();
    
    for (let char of enhanced) {
      if (!allUnicodes.includes(char)) {
        hash += char;
      }
    }
    
    return hash;
  }

  async generateHash(input) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  getTemporalKey() {
    const now = new Date();
    const minute = Math.floor(now.getTime() / 60000);
    return `OMEGA_${minute}`;
  }

  async verifyAdminToken(userEmail, inputToken) {
    const cleanToken = this.extractFromArchetypal(inputToken.toUpperCase());
    
    const temporalKey = this.getTemporalKey();
    const expectedToken = await this.generateHash(`${userEmail}_${temporalKey}_DRUIDE_ARCHETYPE_4`);
    
    const prevTemporalKey = `OMEGA_${Math.floor(Date.now() / 60000) - 1}`;
    const prevToken = await this.generateHash(`${userEmail}_${prevTemporalKey}_DRUIDE_ARCHETYPE_4`);
    
    return cleanToken === expectedToken.slice(0, 16) || cleanToken === prevToken.slice(0, 16);
  }

  async generateAdminToken(userEmail) {
    const temporalKey = this.getTemporalKey();
    const fullToken = await this.generateHash(`${userEmail}_${temporalKey}_DRUIDE_ARCHETYPE_4`);
    const baseToken = fullToken.slice(0, 16).toUpperCase();
    
    return this.injectArchetypalUnicode(baseToken, 4);
  }

  encryptSession(data) {
    const sessionKey = Math.random().toString(36).substring(2, 15);
    const encrypted = btoa(JSON.stringify({ ...data, key: sessionKey, timestamp: Date.now() }));
    return encrypted;
  }

  decryptSession(encrypted) {
    try {
      const decrypted = JSON.parse(atob(encrypted));
      if (Date.now() - decrypted.timestamp > this.sessionDuration) {
        return null;
      }
      return decrypted;
    } catch {
      return null;
    }
  }
}

const crypto4 = new AlphaNumericCrypto();

// Context pour partager l'état d'authentification
const CryptoContext = createContext(null);

export const useCryptoShield = () => {
  const context = useContext(CryptoContext);
  if (!context) {
    throw new Error('useCryptoShield must be used within CryptoShield');
  }
  return context;
};

export default function CryptoShield({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [tokenInput, setTokenInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [generatedToken, setGeneratedToken] = useState("");
  const [showToken, setShowToken] = useState(false);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);

      if (currentUser.role !== 'admin') {
        setLoading(false);
        return;
      }

      const encryptedSession = sessionStorage.getItem('druide_crypto_shield_4');
      if (encryptedSession) {
        const session = crypto4.decryptSession(encryptedSession);
        if (session && session.email === currentUser.email && session.authenticated) {
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateToken = async () => {
    if (!user) return;
    const token = await crypto4.generateAdminToken(user.email);
    setGeneratedToken(token);
    setShowToken(true);
    setTimeout(() => setShowToken(false), 60000);
  };

  const handleVerifyToken = async () => {
    if (!user || !tokenInput) {
      setError("Veuillez entrer un token");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const isValid = await crypto4.verifyAdminToken(user.email, tokenInput);
      
      if (isValid) {
        const encryptedSession = crypto4.encryptSession({
          email: user.email,
          role: user.role,
          authenticated: true,
          timestamp: Date.now()
        });
        
        sessionStorage.setItem('druide_crypto_shield_4', encryptedSession);
        setIsAuthenticated(true);
      } else {
        setError("Token invalide ou expiré");
      }
    } catch (err) {
      setError("Erreur de vérification");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('druide_crypto_shield_4');
    setIsAuthenticated(false);
    setTokenInput("");
    setError("");
    setGeneratedToken("");
    setShowToken(false);
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
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Card className="p-8 max-w-md bg-slate-800/90 border-red-500/50">
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Non Connecté</h2>
            <p className="text-slate-300 mb-4">Veuillez vous connecter à Base44</p>
            <Button 
              onClick={() => base44.auth.redirectToLogin(window.location.pathname)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Se Connecter
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Card className="p-8 max-w-md bg-slate-800/90 border-red-500/50">
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Accès Refusé</h2>
            <p className="text-slate-300">Niveau d'autorisation insuffisant</p>
            <p className="text-slate-400 text-sm mt-2">Email: {user.email}</p>
            <p className="text-slate-400 text-sm">Rôle: {user.role}</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <Card className="p-8 max-w-xl w-full bg-slate-800/90 backdrop-blur-xl border-purple-500/50">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div className="text-center mb-6">
              <motion.div
                animate={{ boxShadow: ["0 0 20px rgba(168, 85, 247, 0.4)", "0 0 40px rgba(168, 85, 247, 0.6)", "0 0 20px rgba(168, 85, 247, 0.4)"] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 rounded-2xl flex items-center justify-center"
              >
                <Shield className="w-10 h-10 text-white" />
              </motion.div>
              <h1 className="text-3xl font-bold text-white mb-2">Crypto Shield Niveau 4</h1>
              <p className="text-purple-300 text-sm">Protection Unicode Archétypale • SHA-256</p>
              <div className="mt-3 flex items-center justify-center gap-2">
                <Lock className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-slate-400 font-mono">{user.email}</span>
              </div>
              <div className="mt-2">
                <span className="text-xs text-green-400">✓ Authentifié Base44</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-700/50 p-4 rounded-lg border border-purple-500/30">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-slate-300">Token Archétypal Temporel</span>
                  <Button size="sm" onClick={generateToken} className="bg-purple-600 hover:bg-purple-700">
                    <Key className="w-4 h-4 mr-2" />
                    Générer
                  </Button>
                </div>
                <AnimatePresence>
                  {showToken && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-purple-900/50 p-3 rounded border border-purple-500/50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <code className="text-sm font-mono text-purple-200 tracking-wider break-all">
                          {generatedToken}
                        </code>
                        <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0 ml-2" />
                      </div>
                      <p className="text-xs text-purple-300">Valide 1 minute • Glyphes archétypaux intégrés</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">Entrez le Token Unicode</label>
                <Input
                  type="text"
                  placeholder="Token avec glyphes..."
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  className="bg-slate-700/50 border-purple-500/50 text-white font-mono text-sm"
                  onKeyDown={(e) => e.key === 'Enter' && handleVerifyToken()}
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-red-900/30 border border-red-500/50 p-3 rounded flex items-center gap-2"
                >
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span className="text-sm text-red-200">{error}</span>
                </motion.div>
              )}

              <Button
                onClick={handleVerifyToken}
                disabled={loading || !tokenInput}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold h-12"
              >
                {loading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                    <Shield className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Vérifier & Accéder
                  </>
                )}
              </Button>

              <div className="text-center space-y-1">
                <p className="text-xs text-slate-500">SHA-256 + Unicode Archétypales • Session 30min</p>
                <div className="flex items-center justify-center gap-2 text-purple-400">
                  {Object.values(ARCHETYPAL_UNICODE).flat().slice(0, 8).map((glyph, i) => (
                    <span key={i} className="text-lg">{glyph}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </Card>
      </div>
    );
  }

  return (
    <CryptoContext.Provider value={{ user, isAuthenticated, handleLogout }}>
      {children}
    </CryptoContext.Provider>
  );
}