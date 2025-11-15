/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Keyboard Shortcuts System                                  ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useEffect, useState } from "react";
import { createPageUrl } from "@/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Command } from "lucide-react";

const SHORTCUTS = [
  { key: "Ctrl+K", action: "search", label: "Recherche globale", category: "Navigation" },
  { key: "Ctrl+N", action: "newConversation", label: "Nouvelle conversation", category: "Actions" },
  { key: "Ctrl+/", action: "showShortcuts", label: "Afficher les raccourcis", category: "Aide" },
  { key: "Ctrl+1", action: "goHome", label: "Aller à l'accueil", category: "Navigation" },
  { key: "Ctrl+2", action: "goChat", label: "Aller au chat", category: "Navigation" },
  { key: "Ctrl+3", action: "goConsciousness", label: "Aller à la conscience", category: "Navigation" },
  { key: "Ctrl+B", action: "toggleSidebar", label: "Toggle sidebar", category: "Interface" },
  { key: "Ctrl+Enter", action: "sendMessage", label: "Envoyer le message", category: "Actions" },
  { key: "Escape", action: "closeModal", label: "Fermer modal/dialog", category: "Interface" }
];

export default function KeyboardShortcuts() {
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isCtrl = e.ctrlKey || e.metaKey;

      // Show shortcuts help
      if (isCtrl && e.key === '/') {
        e.preventDefault();
        setShowHelp(true);
        return;
      }

      // New conversation
      if (isCtrl && e.key === 'n') {
        e.preventDefault();
        window.location.href = createPageUrl('Chat');
        return;
      }

      // Navigation shortcuts
      if (isCtrl && ['1', '2', '3', '4', '5'].includes(e.key)) {
        e.preventDefault();
        const pages = ['Home', 'Chat', 'Consciousness', 'Memory', 'Knowledge'];
        window.location.href = createPageUrl(pages[parseInt(e.key) - 1]);
        return;
      }

      // Escape closes modals
      if (e.key === 'Escape') {
        setShowHelp(false);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const categories = [...new Set(SHORTCUTS.map(s => s.category))];

  return (
    <Dialog open={showHelp} onOpenChange={setShowHelp}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Command className="w-5 h-5" />
            Raccourcis Clavier
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {categories.map(category => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">{category}</h3>
              <div className="space-y-2">
                {SHORTCUTS.filter(s => s.category === category).map(shortcut => (
                  <div key={shortcut.key} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50">
                    <span className="text-sm text-gray-600">{shortcut.label}</span>
                    <kbd className="px-3 py-1 text-xs font-mono bg-slate-100 border border-slate-200 rounded shadow-sm">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-xs text-gray-500 text-center pt-4 border-t">
          Appuyez sur <kbd className="px-2 py-0.5 bg-slate-100 rounded">Ctrl + /</kbd> pour afficher cette aide
        </div>
      </DialogContent>
    </Dialog>
  );
}