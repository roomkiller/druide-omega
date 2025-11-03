/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Comparative Analysis Display                               ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ Fingerprint: AMG:AL:2025:DO:NBC:8F7E:4C9A:3B2F:1E6D:5C4B                 ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle2, XCircle, Lightbulb, AlertTriangle, Sparkles, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function ComparativeAnalysis({ fusion }) {
  if (!fusion?.comparative_analysis) return null;

  const { agreements, disagreements, unique_contributions } = fusion.comparative_analysis;

  return (
    <div className="space-y-6">
      {/* Synthesis Overview */}
      {fusion.synthesis && (
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-bold text-slate-900">Synthèse Unifiée</h3>
            <Badge className="bg-purple-200 text-purple-800">
              {fusion.synthesis.confidence_level}% confiance
            </Badge>
          </div>

          <p className="text-slate-700 leading-relaxed mb-4">{fusion.synthesis.unified_narrative}</p>

          {fusion.synthesis.main_themes?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {fusion.synthesis.main_themes.map((theme, idx) => (
                <Badge key={idx} variant="outline" className="bg-white">
                  {theme}
                </Badge>
              ))}
            </div>
          )}
        </Card>
      )}

      <Accordion type="multiple" defaultValue={["agreements", "emergent"]} className="space-y-4">
        {/* Agreements */}
        {agreements?.length > 0 && (
          <AccordionItem value="agreements" className="border-2 border-green-200 rounded-xl overflow-hidden bg-green-50/50">
            <AccordionTrigger className="px-6 py-4 hover:bg-green-50">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-slate-900">Points de Consensus</span>
                <Badge className="bg-green-200 text-green-800">{agreements.length}</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-4 mt-4">
                {agreements.map((agreement, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-4 bg-white border border-green-200 rounded-lg"
                  >
                    <h4 className="font-semibold text-green-900 mb-2">{agreement.topic}</h4>
                    <p className="text-sm text-slate-700 mb-3">{agreement.consensus}</p>
                    <div className="flex flex-wrap gap-2">
                      {agreement.supporting_sources?.map((source, sourceIdx) => (
                        <Badge key={sourceIdx} variant="outline" className="text-xs bg-green-50">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          {source}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Disagreements */}
        {disagreements?.length > 0 && (
          <AccordionItem value="disagreements" className="border-2 border-orange-200 rounded-xl overflow-hidden bg-orange-50/50">
            <AccordionTrigger className="px-6 py-4 hover:bg-orange-50">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <span className="font-semibold text-slate-900">Points de Divergence</span>
                <Badge className="bg-orange-200 text-orange-800">{disagreements.length}</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-4 mt-4">
                {disagreements.map((disagreement, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-4 bg-white border border-orange-200 rounded-lg"
                  >
                    <h4 className="font-semibold text-orange-900 mb-3">{disagreement.topic}</h4>
                    
                    <div className="space-y-2 mb-3">
                      {disagreement.perspectives?.map((perspective, perspIdx) => (
                        <div key={perspIdx} className="p-3 bg-orange-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <XCircle className="w-4 h-4 text-orange-600" />
                            <span className="text-sm font-medium text-orange-900">{perspective.source}</span>
                          </div>
                          <p className="text-sm text-slate-700 ml-6">{perspective.position}</p>
                        </div>
                      ))}
                    </div>

                    {disagreement.resolution && (
                      <div className="p-3 bg-gradient-to-r from-orange-100 to-yellow-100 border border-orange-300 rounded-lg">
                        <p className="text-xs font-medium text-orange-900 mb-1">Résolution/Synthèse:</p>
                        <p className="text-sm text-slate-700">{disagreement.resolution}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Unique Contributions */}
        {unique_contributions?.length > 0 && (
          <AccordionItem value="unique" className="border-2 border-blue-200 rounded-xl overflow-hidden bg-blue-50/50">
            <AccordionTrigger className="px-6 py-4 hover:bg-blue-50">
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-slate-900">Contributions Uniques</span>
                <Badge className="bg-blue-200 text-blue-800">{unique_contributions.length}</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-4 mt-4">
                {unique_contributions.map((contribution, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-4 bg-white border border-blue-200 rounded-lg"
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <Badge className="bg-blue-100 text-blue-800 mb-2">{contribution.source}</Badge>
                        <p className="text-sm text-slate-700 mb-2">{contribution.contribution}</p>
                        <p className="text-xs text-blue-600 italic">
                          <strong>Signification:</strong> {contribution.significance}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Emergent Insights */}
        {fusion.emergent_insights?.length > 0 && (
          <AccordionItem value="emergent" className="border-2 border-purple-200 rounded-xl overflow-hidden bg-purple-50/50">
            <AccordionTrigger className="px-6 py-4 hover:bg-purple-50">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-slate-900">Insights Émergents</span>
                <Badge className="bg-purple-200 text-purple-800">{fusion.emergent_insights.length}</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-4 mt-4">
                {fusion.emergent_insights.map((insight, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-4 bg-white border border-purple-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <p className="font-medium text-purple-900 flex-1">{insight.insight}</p>
                      <Badge className={`flex-shrink-0 ${
                        insight.novelty_score >= 8 ? 'bg-purple-600' : 
                        insight.novelty_score >= 6 ? 'bg-purple-400' : 
                        'bg-purple-200'
                      } text-white`}>
                        Nouveauté: {insight.novelty_score}/10
                      </Badge>
                    </div>

                    {insight.supporting_evidence?.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-slate-700 mb-2">Preuves:</p>
                        <ul className="text-xs text-slate-600 space-y-1">
                          {insight.supporting_evidence.map((evidence, evidIdx) => (
                            <li key={evidIdx} className="flex items-start gap-2">
                              <span className="text-purple-400">•</span>
                              {evidence}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {insight.implications && (
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <p className="text-xs font-medium text-purple-900 mb-1">Implications:</p>
                        <p className="text-xs text-slate-700">{insight.implications}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Knowledge Gaps */}
        {fusion.knowledge_gaps?.length > 0 && (
          <AccordionItem value="gaps" className="border-2 border-red-200 rounded-xl overflow-hidden bg-red-50/50">
            <AccordionTrigger className="px-6 py-4 hover:bg-red-50">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="font-semibold text-slate-900">Lacunes de Connaissances</span>
                <Badge className="bg-red-200 text-red-800">{fusion.knowledge_gaps.length}</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-3 mt-4">
                {fusion.knowledge_gaps.map((gap, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-3 bg-white border border-red-200 rounded-lg"
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <Badge className={`${
                        gap.severity === 'critical' ? 'bg-red-600' :
                        gap.severity === 'significant' ? 'bg-orange-500' :
                        gap.severity === 'moderate' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      } text-white`}>
                        {gap.severity}
                      </Badge>
                      <p className="text-sm text-slate-900 flex-1">{gap.gap}</p>
                    </div>
                    {gap.suggested_research && (
                      <p className="text-xs text-slate-600 pl-2 border-l-2 border-red-300">
                        <strong>Recherche suggérée:</strong> {gap.suggested_research}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>

      {/* Fusion Quality Metrics */}
      {fusion.fusion_quality && (
        <Card className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4">Métriques de Qualité</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {Object.entries(fusion.fusion_quality).map(([key, value]) => (
              <div key={key} className="p-3 bg-white rounded-lg border border-slate-200">
                <p className="text-xs text-slate-600 capitalize mb-1">{key}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        value >= 80 ? 'bg-green-500' :
                        value >= 60 ? 'bg-blue-500' :
                        value >= 40 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-900">{value}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SCEAU DE PROPRIÉTÉ INTELLECTUELLE
 * © 2025 AMG+A.L - PROPRIÉTAIRE
 * Innovation: Comparative Analysis Display
 * Référence: AMG-AL-DO-2025-001
 * ═══════════════════════════════════════════════════════════════════════════
 */