import React from "react";
import { useLanguage } from "@/components/utils/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe, Loader2 } from "lucide-react";

const AVAILABLE_LANGUAGES = [
  { code: 'fr', name: 'Français', flag: '🇨🇦' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: '中文', flag: '🇨🇳' }
];

export default function LanguageSelector({ variant = "outline" }) {
  const { language, setLanguage, loading } = useLanguage();
  
  const currentLang = AVAILABLE_LANGUAGES.find(l => l.code === language) || AVAILABLE_LANGUAGES[0];

  const handleLanguageChange = async (newLang) => {
    try {
      await setLanguage(newLang);
    } catch (error) {
      console.error('Language change error:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size="sm" className="gap-1.5 sm:gap-2 h-8 sm:h-9 px-2 sm:px-3" disabled={loading}>
          {loading ? (
            <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
          ) : (
            <span className="text-base sm:text-lg">{currentLang.flag}</span>
          )}
          <span className="text-xs sm:text-sm font-medium hidden sm:inline">{currentLang.name}</span>
          <Globe className="w-3 h-3 sm:w-4 sm:h-4 sm:hidden" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 sm:w-48" sideOffset={5}>
        {AVAILABLE_LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onSelect={() => handleLanguageChange(lang.code)}
            className={`cursor-pointer text-xs sm:text-sm ${language === lang.code ? 'bg-purple-50 font-semibold' : ''}`}
            disabled={loading}
          >
            <span className="text-base sm:text-lg mr-2">{lang.flag}</span>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}