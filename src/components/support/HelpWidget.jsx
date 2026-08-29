/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Help Widget / Support Chat                                 ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HelpCircle, X, Send, Book, MessageCircle, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPageUrl } from "@/utils";
import { navigateTo } from "@/lib/spaNavigate";

const FAQ = [
  { q: "Comment créer une conversation ?", a: "Cliquez sur 'Chat' dans le menu, puis tapez votre message." },
  { q: "Comment ajouter des documents ?", a: "Allez dans 'Connaissances' et utilisez le bouton d'upload." },
  { q: "Comment fonctionne la mémoire ?", a: "L'IA sauvegarde automatiquement les interactions importantes." },
  { q: "Puis-je exporter mes données ?", a: "Oui, allez dans Sécurité > Export de données (RGPD)." }
];

export default function HelpWidget() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState('menu'); // menu, faq, contact
  const [message, setMessage] = useState('');

  const handleContact = () => {
    const subject = encodeURIComponent('Support Druide Omega');
    const body = encodeURIComponent(message || 'Bonjour,\n\n');
    window.location.href = `mailto:support@druideomega.com?subject=${subject}&body=${body}`;
    setMessage('');
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full shadow-2xl flex items-center justify-center z-40"
      >
        <HelpCircle className="w-7 h-7 text-white" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-6 w-96 z-50"
          >
            <Card className="shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-6 h-6 text-white" />
                  <div>
                    <h3 className="font-bold text-white">Aide & Support</h3>
                    <Badge className="bg-green-500 text-white mt-1">En ligne</Badge>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="text-white hover:bg-white/20">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <ScrollArea className="h-96">
                {view === 'menu' && (
                  <div className="p-4 space-y-3">
                    <button
                      onClick={() => setView('faq')}
                      className="w-full p-4 bg-slate-50 hover:bg-slate-100 rounded-lg flex items-center gap-3 transition-colors"
                    >
                      <Book className="w-5 h-5 text-purple-600" />
                      <div className="text-left">
                        <h4 className="font-semibold text-slate-900">Questions fréquentes</h4>
                        <p className="text-xs text-slate-600">Réponses rapides</p>
                      </div>
                    </button>

                    <button
                      onClick={() => navigateTo('UserGuide')}
                      className="w-full p-4 bg-slate-50 hover:bg-slate-100 rounded-lg flex items-center gap-3 transition-colors"
                    >
                      <Book className="w-5 h-5 text-blue-600" />
                      <div className="text-left">
                        <h4 className="font-semibold text-slate-900">Guide utilisateur</h4>
                        <p className="text-xs text-slate-600">Documentation complète</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setView('contact')}
                      className="w-full p-4 bg-slate-50 hover:bg-slate-100 rounded-lg flex items-center gap-3 transition-colors"
                    >
                      <Mail className="w-5 h-5 text-green-600" />
                      <div className="text-left">
                        <h4 className="font-semibold text-slate-900">Nous contacter</h4>
                        <p className="text-xs text-slate-600">Support par email</p>
                      </div>
                    </button>
                  </div>
                )}

                {view === 'faq' && (
                  <div className="p-4">
                    <Button variant="ghost" onClick={() => setView('menu')} className="mb-4">← Retour</Button>
                    <div className="space-y-4">
                      {FAQ.map((item, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 rounded-lg">
                          <h4 className="font-semibold text-slate-900 mb-2">{item.q}</h4>
                          <p className="text-sm text-slate-600">{item.a}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {view === 'contact' && (
                  <div className="p-4">
                    <Button variant="ghost" onClick={() => setView('menu')} className="mb-4">← Retour</Button>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-semibold text-slate-900">Votre message</label>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Décrivez votre problème..."
                          className="w-full mt-2 p-3 border rounded-lg"
                          rows={5}
                        />
                      </div>
                      <Button onClick={handleContact} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600">
                        <Send className="w-4 h-4 mr-2" />
                        Envoyer
                      </Button>
                    </div>
                  </div>
                )}
              </ScrollArea>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}