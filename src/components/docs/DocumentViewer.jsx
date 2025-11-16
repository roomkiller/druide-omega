/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Document Viewer Component                                  ║
 * ║ Composant réutilisable pour afficher du contenu de documentation          ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { 
  Copy, 
  Check, 
  ChevronRight, 
  Book, 
  FileText,
  Code,
  Info
} from "lucide-react";
import { motion } from "framer-motion";

export default function DocumentViewer({ 
  title, 
  subtitle, 
  icon: Icon = Book,
  sections = [],
  tableOfContents = true,
  colorScheme = "purple" 
}) {
  const [activeSection, setActiveSection] = React.useState(sections[0]?.id || null);
  const [copiedCode, setCopiedCode] = React.useState(null);

  const colorSchemes = {
    purple: {
      gradient: "from-purple-600 to-indigo-600",
      bg: "from-purple-50 to-indigo-50",
      border: "border-purple-300",
      text: "text-purple-900",
      accent: "text-purple-600"
    },
    blue: {
      gradient: "from-blue-600 to-cyan-600",
      bg: "from-blue-50 to-cyan-50",
      border: "border-blue-300",
      text: "text-blue-900",
      accent: "text-blue-600"
    },
    green: {
      gradient: "from-green-600 to-emerald-600",
      bg: "from-green-50 to-emerald-50",
      border: "border-green-300",
      text: "text-green-900",
      accent: "text-green-600"
    }
  };

  const colors = colorSchemes[colorScheme] || colorSchemes.purple;

  const handleCopyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className={`bg-gradient-to-r ${colors.gradient} px-6 py-8 flex-shrink-0`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-2xl">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{title}</h1>
              <p className="text-white/80">{subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Table of Contents Sidebar */}
        {tableOfContents && sections.length > 0 && (
          <div className="w-64 bg-white border-r border-slate-200 flex-shrink-0 hidden lg:block">
            <ScrollArea className="h-full">
              <div className="p-6">
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Table des matières
                </h3>
                <nav className="space-y-1">
                  {sections.map((section, idx) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        activeSection === section.id
                          ? `bg-gradient-to-r ${colors.bg} ${colors.text} font-semibold`
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${
                          activeSection === section.id ? colors.accent : 'text-slate-400'
                        }`}>
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span className="flex-1">{section.title}</span>
                        {activeSection === section.id && (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </div>
                    </button>
                  ))}
                </nav>
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Main Content */}
        <ScrollArea className="flex-1">
          <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
            {sections.map((section, idx) => (
              <motion.div
                key={section.id}
                id={`section-${section.id}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className={`p-8 bg-gradient-to-br ${colors.bg} ${colors.border} border-2`}>
                  {/* Section Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`w-12 h-12 bg-gradient-to-br ${colors.gradient} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <span className="text-white font-bold text-lg">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h2 className={`text-2xl font-bold ${colors.text} mb-2`}>
                        {section.title}
                      </h2>
                      {section.description && (
                        <p className="text-slate-600">{section.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Section Content */}
                  <div className="space-y-6">
                    {/* Text Content */}
                    {section.content && (
                      <div className="prose prose-slate max-w-none">
                        <div className="text-slate-700 leading-relaxed bg-white/60 p-6 rounded-lg">
                          {section.content}
                        </div>
                      </div>
                    )}

                    {/* List Items */}
                    {section.items && section.items.length > 0 && (
                      <div className="space-y-3">
                        {section.items.map((item, i) => (
                          <div key={i} className="flex items-start gap-3 p-4 bg-white/80 rounded-lg border border-slate-200">
                            <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${colors.gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                              <Check className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 text-sm text-slate-700">{item}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Code Blocks */}
                    {section.code && (
                      <div className="relative">
                        <div className="absolute top-3 right-3 z-10">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCopyCode(section.code, section.id)}
                            className="bg-slate-800/80 hover:bg-slate-700 text-white"
                          >
                            {copiedCode === section.id ? (
                              <>
                                <Check className="w-4 h-4 mr-2" />
                                Copié
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4 mr-2" />
                                Copier
                              </>
                            )}
                          </Button>
                        </div>
                        <pre className="bg-slate-900 text-green-400 p-6 rounded-lg overflow-x-auto">
                          <code className="text-sm font-mono">{section.code}</code>
                        </pre>
                      </div>
                    )}

                    {/* Info Boxes */}
                    {section.info && (
                      <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                        <div className="flex items-start gap-3">
                          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-blue-900">{section.info}</p>
                        </div>
                      </div>
                    )}

                    {/* Warning Boxes */}
                    {section.warning && (
                      <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
                        <div className="flex items-start gap-3">
                          <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-amber-900">{section.warning}</p>
                        </div>
                      </div>
                    )}

                    {/* Subsections */}
                    {section.subsections && section.subsections.length > 0 && (
                      <div className="space-y-4 mt-6">
                        {section.subsections.map((subsection, j) => (
                          <div key={j} className="pl-6 border-l-2 border-slate-300">
                            <h3 className="font-bold text-slate-900 mb-2">{subsection.title}</h3>
                            <p className="text-sm text-slate-700">{subsection.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}