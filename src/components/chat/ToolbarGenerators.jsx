/**
 * Toolbar Générateurs - Séparé du ChatInput
 * Affiche tous les outils de génération (images, diagrammes, documents, code, etc.)
 */

import React from "react";
import { motion } from "framer-motion";
import IntelligenceSwitcher from "@/components/intelligence/IntelligenceSwitcher";
import ConsciousImageGenerator from "@/components/consciousness/ConsciousImageGenerator";
import DiagramGenerator from "@/components/chat/DiagramGenerator";
import DocumentGenerator from "@/components/chat/DocumentGenerator";
import CodeGenerator from "@/components/chat/CodeGenerator";
import TableGenerator from "@/components/chat/TableGenerator";
import FormulaGenerator from "@/components/chat/FormulaGenerator";
import TextTransformer from "@/components/chat/TextTransformer";

export default function ToolbarGenerators({
  conversationId,
  consciousnessConfig,
  onImageGenerated,
  onDiagramGenerated,
  onDocumentGenerated,
  onCodeGenerated,
  onTableGenerated,
  onFormulaGenerated,
  onTextTransformed
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-4 gap-2 p-3 bg-gradient-to-r from-slate-50 to-purple-50 rounded-xl border border-slate-200/60"
    >
      <IntelligenceSwitcher conversationId={conversationId} />
      <ConsciousImageGenerator
        onImageGenerated={onImageGenerated}
        consciousnessConfig={consciousnessConfig}
      />
      <DiagramGenerator onDiagramGenerated={onDiagramGenerated} />
      <DocumentGenerator onDocumentGenerated={onDocumentGenerated} />
      <CodeGenerator onCodeGenerated={onCodeGenerated} />
      <TableGenerator onTableGenerated={onTableGenerated} />
      <FormulaGenerator onFormulaGenerated={onFormulaGenerated} />
      <TextTransformer onTextTransformed={onTextTransformed} />
    </motion.div>
  );
}