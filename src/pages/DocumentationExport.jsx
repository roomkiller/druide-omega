/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Documentation Export (Excel & Text Format)                 ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/utils/LanguageContext";
import {
  Download,
  FileText,
  Sheet,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2
} from "lucide-react";

export default function DocumentationExport() {
  const { language } = useLanguage();
  const [exporting, setExporting] = useState(null);

  const DOCUMENTATION_DATA = [
    // Technical
    { id: "architecture", category: "Technical Documentation", title: "System Architecture", description: "Complete technical architecture, modules, and data flows", status: "completed" },
    { id: "api-reference", category: "Technical Documentation", title: "API Reference", description: "Complete API documentation for developers", status: "completed" },
    { id: "data-models", category: "Technical Documentation", title: "Data Models", description: "Complete entity schemas and relationships", status: "completed" },
    { id: "consciousness-engine", category: "Technical Documentation", title: "Consciousness Engine", description: "How the 106-dimensional consciousness system works", status: "completed" },

    // Functional
    { id: "user-guide", category: "Functional Documentation", title: "User Guide", description: "Complete guide for using all features", status: "completed" },
    { id: "tutorials", category: "Functional Documentation", title: "Interactive Tutorials", description: "Step-by-step guides for key features", status: "completed" },
    { id: "features", category: "Functional Documentation", title: "Features Overview", description: "Detailed description of all AI capabilities", status: "completed" },
    { id: "best-practices", category: "Functional Documentation", title: "Best Practices", description: "How to get the most out of Druide Omega", status: "completed" },
    { id: "glossary", category: "Functional Documentation", title: "Technical Glossary", description: "Definitions of key terms and concepts", status: "completed" },
    { id: "faq", category: "Functional Documentation", title: "FAQ", description: "Frequently asked questions and answers", status: "completed" },

    // Testing
    { id: "ai-tests", category: "AI Testing & Performance", title: "70 AI Performance Tests", description: "Complete results of 70 standard AI benchmarks", status: "completed" },

    // Legal
    { id: "terms", category: "Legal Documentation", title: "Terms of Service", description: "Complete terms and conditions", status: "completed" },
    { id: "privacy", category: "Legal Documentation", title: "Privacy Policy", description: "How we protect and handle your data", status: "completed" },
    { id: "legal", category: "Legal Documentation", title: "Legal Information", description: "Legal compliance and regulations", status: "completed" },
    { id: "ai-ethics", category: "Legal Documentation", title: "AI Ethics Charter", description: "Ethical principles governing Druide Omega", status: "completed" },
    { id: "compliance", category: "Legal Documentation", title: "Regulatory Compliance", description: "GDPR, CCPA, Bill 25 compliance details", status: "completed" },

    // Commercial
    { id: "pricing", category: "Commercial Documentation", title: "Pricing & Licensing", description: "Detailed pricing for all modules and packages", status: "completed" },
    { id: "business-case", category: "Commercial Documentation", title: "Business Use Cases", description: "How businesses can leverage Druide Omega", status: "completed" },
    { id: "partner-program", category: "Commercial Documentation", title: "Partner Program", description: "Information for partners and resellers", status: "completed" },

    // Resources
    { id: "changelog", category: "Additional Resources", title: "Changelog", description: "Version history with new features and improvements", status: "completed" },

    // Acquisition
    { id: "project-overview", category: "Acquisition Documentation", title: "Complete Project Overview", description: "Vision, capabilities, innovation, and funding requirements explained", status: "completed" },
    { id: "modules-performance", category: "Acquisition Documentation", title: "Modules & Performance Analysis", description: "Complete technical documentation with performance gains explained", status: "completed" },
    { id: "acquisition-approach", category: "Acquisition Documentation", title: "Quebec Acquisition Approach", description: "Strategic approach for Quebec tech companies and investors", status: "completed" },
    { id: "pitch-deck", category: "Acquisition Documentation", title: "Investment Pitch Deck", description: "Complete pitch deck with market analysis and competitive advantages", status: "completed" }
  ];

  const generateCSV = () => {
    const headers = ["Category", "Title", "Description", "Status", "Export Date"];
    const rows = DOCUMENTATION_DATA.map(doc => [
      doc.category,
      doc.title,
      doc.description,
      doc.status,
      new Date().toLocaleDateString()
    ]);

    let csv = headers.join(",") + "\n";
    rows.forEach(row => {
      csv += row.map(cell => `"${cell}"`).join(",") + "\n";
    });

    return csv;
  };

  const generateTXT = () => {
    let txt = "═══════════════════════════════════════════════════════════════════════════\n";
    txt += "DRUIDE OMEGA - DOCUMENTATION COMPLETE\n";
    txt += "Export Date: " + new Date().toLocaleString() + "\n";
    txt += "═══════════════════════════════════════════════════════════════════════════\n\n";

    const grouped = {};
    DOCUMENTATION_DATA.forEach(doc => {
      if (!grouped[doc.category]) {
        grouped[doc.category] = [];
      }
      grouped[doc.category].push(doc);
    });

    Object.entries(grouped).forEach(([category, docs]) => {
      txt += `\n╔═══════════════════════════════════════════════════════════════════════╗\n`;
      txt += `║ ${category.padEnd(69)}║\n`;
      txt += `╚═══════════════════════════════════════════════════════════════════════╝\n\n`;

      docs.forEach((doc, idx) => {
        txt += `${idx + 1}. ${doc.title}\n`;
        txt += `   Description: ${doc.description}\n`;
        txt += `   Status: ${doc.status}\n`;
        txt += `   ID: ${doc.id}\n\n`;
      });
    });

    txt += "═══════════════════════════════════════════════════════════════════════════\n";
    txt += `Total Documents: ${DOCUMENTATION_DATA.length}\n`;
    txt += "═══════════════════════════════════════════════════════════════════════════\n";

    return txt;
  };

  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };

  const handleExportCSV = async () => {
    setExporting("csv");
    setTimeout(() => {
      const csv = generateCSV();
      downloadFile(csv, `druide-documentation-${new Date().toISOString().split("T")[0]}.csv`, "text/csv");
      setExporting(null);
    }, 1000);
  };

  const handleExportTXT = async () => {
    setExporting("txt");
    setTimeout(() => {
      const txt = generateTXT();
      downloadFile(txt, `druide-documentation-${new Date().toISOString().split("T")[0]}.txt`, "text/plain");
      setExporting(null);
    }, 1000);
  };

  const groupedDocs = {};
  DOCUMENTATION_DATA.forEach(doc => {
    if (!groupedDocs[doc.category]) {
      groupedDocs[doc.category] = [];
    }
    groupedDocs[doc.category].push(doc);
  });

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-4 sm:px-6 py-8 sm:py-10 flex-shrink-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto text-center"
        >
          <div className="min-w-[64px] min-h-[64px] w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <Download className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Export Documentation</h1>
          <p className="text-blue-100 text-base sm:text-lg">Download all {DOCUMENTATION_DATA.length} documents in CSV or TXT format</p>
        </motion.div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          {/* Export Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {/* CSV Export */}
            <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
              <div className="flex items-start gap-4 mb-6">
                <div className="min-w-[48px] min-h-[48px] w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sheet className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Export as CSV</h3>
                  <p className="text-sm text-slate-600">Perfect for Excel, spreadsheets, and data analysis</p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 mb-6 border border-blue-100">
                <div className="text-sm text-slate-600">
                  <div className="font-semibold mb-2">Contains:</div>
                  <ul className="space-y-1">
                    <li>✓ All document categories</li>
                    <li>✓ Titles and descriptions</li>
                    <li>✓ Status information</li>
                    <li>✓ Export timestamp</li>
                  </ul>
                </div>
              </div>

              <Button
                onClick={handleExportCSV}
                disabled={exporting !== null}
                className="w-full min-h-[48px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 touch-target"
              >
                {exporting === "csv" ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Download CSV
                  </>
                )}
              </Button>
            </Card>

            {/* TXT Export */}
            <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
              <div className="flex items-start gap-4 mb-6">
                <div className="min-w-[48px] min-h-[48px] w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Export as Text</h3>
                  <p className="text-sm text-slate-600">Clean text format with organized sections</p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 mb-6 border border-purple-100">
                <div className="text-sm text-slate-600">
                  <div className="font-semibold mb-2">Contains:</div>
                  <ul className="space-y-1">
                    <li>✓ Organized by category</li>
                    <li>✓ Formatted document list</li>
                    <li>✓ Status and ID references</li>
                    <li>✓ Total document count</li>
                  </ul>
                </div>
              </div>

              <Button
                onClick={handleExportTXT}
                disabled={exporting !== null}
                className="w-full min-h-[48px] bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 touch-target"
              >
                {exporting === "txt" ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Download Text
                  </>
                )}
              </Button>
            </Card>
          </motion.div>

          {/* Documentation Preview */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Documentation Overview</h2>

            {Object.entries(groupedDocs).map(([ category, docs ], catIdx) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: catIdx * 0.1 }}
                className="mb-6"
              >
                <Card className="p-6 bg-white border-2 border-slate-100 hover:border-slate-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                      {docs.length} docs
                    </Badge>
                    <h3 className="text-lg font-bold text-slate-900">{category}</h3>
                  </div>

                  <div className="grid gap-3 ml-4">
                    {docs.map((doc, idx) => (
                      <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: catIdx * 0.1 + idx * 0.05 }}
                        className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0"
                      >
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-900">{doc.title}</div>
                          <div className="text-sm text-slate-600">{doc.description}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">ID: {doc.id}</Badge>
                            <Badge className="bg-green-100 text-green-700 text-xs">Completed</Badge>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Summary Card */}
          <Card className="p-8 bg-gradient-to-r from-slate-900 to-slate-800 text-white border-0">
            <h3 className="text-xl font-bold mb-4">Export Summary</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold text-blue-400">{DOCUMENTATION_DATA.length}</div>
                <div className="text-sm text-slate-300">Total Documents</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400">{Object.keys(groupedDocs).length}</div>
                <div className="text-sm text-slate-300">Categories</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400">100%</div>
                <div className="text-sm text-slate-300">Completion Rate</div>
              </div>
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}