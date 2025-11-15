/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Voice Language Selector                                    ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Languages, Check } from "lucide-react";
import { motion } from "framer-motion";

const VOICE_LANGUAGES = [
  { code: "fr-FR", name: "Français", flag: "🇫🇷", voice: "French" },
  { code: "en-US", name: "English (US)", flag: "🇺🇸", voice: "English" },
  { code: "en-GB", name: "English (UK)", flag: "🇬🇧", voice: "English" },
  { code: "es-ES", name: "Español", flag: "🇪🇸", voice: "Spanish" },
  { code: "de-DE", name: "Deutsch", flag: "🇩🇪", voice: "German" },
  { code: "it-IT", name: "Italiano", flag: "🇮🇹", voice: "Italian" },
  { code: "pt-BR", name: "Português", flag: "🇧🇷", voice: "Portuguese" },
  { code: "zh-CN", name: "中文", flag: "🇨🇳", voice: "Chinese" },
  { code: "ja-JP", name: "日本語", flag: "🇯🇵", voice: "Japanese" },
  { code: "ar-SA", name: "العربية", flag: "🇸🇦", voice: "Arabic", rtl: true }
];

export default function VoiceLanguageSelector({ 
  currentLanguage, 
  onLanguageChange, 
  compact = false 
}) {
  const currentLang = VOICE_LANGUAGES.find(l => l.code === currentLanguage) || VOICE_LANGUAGES[0];

  if (compact) {
    return (
      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl rounded-lg px-3 py-2 border border-white/20">
        <Languages className="w-4 h-4 text-white" />
        <select
          value={currentLanguage}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="bg-transparent text-white text-sm border-none outline-none cursor-pointer"
        >
          {VOICE_LANGUAGES.map(lang => (
            <option key={lang.code} value={lang.code} className="bg-slate-900">
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <Card className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
      <div className="flex items-center gap-2 mb-4">
        <Languages className="w-5 h-5 text-indigo-600" />
        <h3 className="font-semibold text-slate-900">Langue de Reconnaissance Vocale</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {VOICE_LANGUAGES.map((lang) => (
          <motion.div
            key={lang.code}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant={currentLanguage === lang.code ? "default" : "outline"}
              size="sm"
              onClick={() => onLanguageChange(lang.code)}
              className={`w-full justify-start ${
                currentLanguage === lang.code 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                  : 'hover:bg-indigo-50'
              }`}
            >
              <span className="mr-2 text-lg">{lang.flag}</span>
              <span className="flex-1 text-left text-xs">{lang.name}</span>
              {currentLanguage === lang.code && (
                <Check className="w-4 h-4 ml-2" />
              )}
            </Button>
          </motion.div>
        ))}
      </div>

      <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-800">
          <strong>Langue actuelle:</strong> {currentLang.flag} {currentLang.name}
        </p>
      </div>
    </Card>
  );
}