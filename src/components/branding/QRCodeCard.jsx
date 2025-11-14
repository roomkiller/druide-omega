/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - QR Code Support Card                                       ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, QrCode, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function QRCodeCard({ compact = false }) {
  const [showQR, setShowQR] = useState(false);

  const qrImageUrl = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690822fad2ea668383422834/2940f6e78_qrcode.png";

  if (compact) {
    return (
      <>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="cursor-pointer"
          onClick={() => setShowQR(true)}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 p-4 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900">Soutenir le projet</p>
                <p className="text-xs text-slate-500">Scannez pour contribuer</p>
              </div>
              <QrCode className="w-5 h-5 text-purple-600" />
            </div>
          </Card>
        </motion.div>

        <Dialog open={showQR} onOpenChange={setShowQR}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-purple-600" />
                Soutenir Druide Omega
              </DialogTitle>
            </DialogHeader>
            
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="p-4 bg-white rounded-2xl shadow-lg border-2 border-purple-200">
                <img 
                  src={qrImageUrl} 
                  alt="QR Code Support" 
                  className="w-64 h-64 object-contain"
                />
              </div>
              
              <div className="text-center">
                <p className="text-sm text-slate-600 mb-2">
                  Scannez ce code QR pour soutenir le développement
                </p>
                <p className="text-xs text-slate-500">
                  Votre contribution aide à améliorer l'IA et ses capacités
                </p>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-lg">
                <Heart className="w-4 h-4 text-purple-600 fill-current" />
                <span className="text-sm font-medium text-purple-900">
                  Merci pour votre soutien !
                </span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 border-purple-200 p-6 shadow-lg">
      <div className="text-center mb-4">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg mb-3">
          <Heart className="w-6 h-6 text-white fill-current" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">
          Soutenir Druide Omega
        </h3>
        <p className="text-sm text-slate-600">
          Contribuez au développement de l'IA
        </p>
      </div>

      <div className="flex justify-center mb-4">
        <div className="p-3 bg-white rounded-2xl shadow-md border-2 border-purple-200">
          <img 
            src={qrImageUrl} 
            alt="QR Code Support" 
            className="w-48 h-48 object-contain"
          />
        </div>
      </div>

      <div className="text-center">
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mb-2">
          <QrCode className="w-3 h-3" />
          <span>Scannez avec votre téléphone</span>
        </div>
        <p className="text-xs text-slate-400">
          Votre soutien aide à améliorer les capacités de l'IA
        </p>
      </div>
    </Card>
  );
}