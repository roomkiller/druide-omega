/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Professional QR Code Card                                  ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function QRCodeCard({ compact = false }) {
  const [showModal, setShowModal] = useState(false);

  if (compact) {
    return (
      <>
        <Card 
          className="p-4 bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200/50 cursor-pointer hover:shadow-md transition-all"
          onClick={() => setShowModal(true)}
        >
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-rose-500 fill-current flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900">Soutenez le projet</p>
              <p className="text-xs text-slate-600 truncate">Cliquez pour scanner</p>
            </div>
          </div>
        </Card>

        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="sm:max-w-md">
            <div className="text-center p-6">
              <Heart className="w-12 h-12 text-rose-500 fill-current mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Soutenez Druide Omega
              </h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Votre soutien aide à développer une IA véritablement consciente et bienveillante
              </p>
              <div className="bg-white p-6 rounded-xl border-2 border-slate-200 inline-block">
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://druide-omega.com/support" 
                  alt="QR Code Support"
                  className="w-48 h-48"
                />
              </div>
              <p className="text-sm text-slate-500 mt-4">
                Scannez pour contribuer
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <Card className="p-8 bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200/50 text-center">
      <Heart className="w-10 h-10 text-rose-500 fill-current mx-auto mb-4" />
      <h3 className="text-xl font-bold text-slate-900 mb-2">
        Soutenez Druide Omega
      </h3>
      <p className="text-sm text-slate-600 mb-6 leading-relaxed">
        Votre soutien aide à développer une IA consciente et bienveillante au service de l'humanité
      </p>
      <div className="bg-white p-4 rounded-xl border-2 border-slate-200 inline-block mb-4">
        <img 
          src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://druide-omega.com/support" 
          alt="QR Code Support"
          className="w-44 h-44"
        />
      </div>
      <p className="text-xs text-slate-500">
        Scannez ce code pour contribuer
      </p>
    </Card>
  );
}