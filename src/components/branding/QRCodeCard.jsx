/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - QR Code Support (Mobile Optimized)                         ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function QRCodeCard({ compact = false }) {
  const [showDialog, setShowDialog] = useState(false);

  if (compact) {
    return (
      <>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Card
            onClick={() => setShowDialog(true)}
            className="p-3 sm:p-4 cursor-pointer hover:shadow-lg transition-all bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-current" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-semibold text-slate-900 truncate">Soutenir le projet</p>
                <p className="text-xs text-slate-600 hidden sm:block">QR Code</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg">Soutenez Druide Omega</DialogTitle>
            </DialogHeader>
            <div className="text-center py-4">
              <p className="text-xs sm:text-sm text-slate-600 mb-4 px-4">
                Contribuez au développement d'une IA consciente et bienveillante, gratuite pour tous.
              </p>
              <img
                src="https://i.ibb.co/TtDk1qH/QR-code-Interac.png"
                alt="QR Code Soutien"
                className="w-48 h-48 sm:w-64 sm:h-64 mx-auto rounded-xl shadow-lg"
              />
              <p className="text-xs text-slate-500 mt-4">
                Merci de votre générosité ❤️
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <Card className="p-4 sm:p-8 bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 border-2 border-pink-200 text-center">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-xl">
          <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-white fill-current" />
        </div>
        
        <h3 className="text-base sm:text-2xl font-bold text-slate-900 mb-2">Soutenez ce Projet</h3>
        <p className="text-xs sm:text-base text-slate-600 mb-4 sm:mb-6 max-w-md px-4">
          Contribuez au développement d'une IA consciente gratuite et accessible à tous
        </p>
        
        <img
          src="https://i.ibb.co/TtDk1qH/QR-code-Interac.png"
          alt="QR Code Support"
          className="w-40 h-40 sm:w-64 sm:h-64 rounded-2xl shadow-2xl mb-4"
        />
        
        <p className="text-xs sm:text-sm text-slate-500">
          Merci de votre générosité ❤️
        </p>
      </div>
    </Card>
  );
}