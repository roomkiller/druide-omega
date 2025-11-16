import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('druide_cookie_consent');
    if (!consent) {
      setTimeout(() => setShow(true), 2000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('druide_cookie_consent', 'accepted');
    setShow(false);
  };

  const handleReject = () => {
    localStorage.setItem('druide_cookie_consent', 'rejected');
    setShow(false);
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 left-4 right-4 md:max-w-md z-50"
      >
        <Card className="p-6 shadow-2xl bg-white/95 backdrop-blur-xl">
          <div className="flex items-start gap-4">
            <Cookie className="w-8 h-8 text-purple-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 mb-2">Cookies</h3>
              <p className="text-sm text-slate-600 mb-4">
                Nous utilisons des cookies essentiels pour le fonctionnement et des cookies analytics pour améliorer votre expérience.
              </p>
              <div className="flex gap-2">
                <Button onClick={handleAccept} size="sm" className="bg-purple-600">
                  Accepter
                </Button>
                <Button onClick={handleReject} size="sm" variant="outline">
                  Refuser
                </Button>
                <Button size="sm" variant="ghost" className="text-xs">
                  En savoir plus
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}