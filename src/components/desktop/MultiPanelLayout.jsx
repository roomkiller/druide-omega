/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Desktop Multi-Panel Layout                                 ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, BookOpen, Database, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function MultiPanelLayout({ 
  children,
  leftPanel = null,
  rightPanel = null,
  showLeftPanel = false,
  showRightPanel = true
}) {
  const [leftCollapsed, setLeftCollapsed] = useState(!showLeftPanel);
  const [rightCollapsed, setRightCollapsed] = useState(false);

  return (
    <div className="h-full flex">
      {/* Left Panel - Context/Memory */}
      {leftPanel && (
        <motion.aside
          initial={false}
          animate={{ width: leftCollapsed ? 0 : 320 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative border-r border-slate-200 bg-white overflow-hidden"
        >
          <ScrollArea className="h-full p-4">
            {!leftCollapsed && leftPanel}
          </ScrollArea>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLeftCollapsed(!leftCollapsed)}
            className="absolute top-4 -right-3 w-6 h-6 rounded-full bg-white border border-slate-200 shadow-sm z-10"
          >
            {leftCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </motion.aside>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>

      {/* Right Panel - Knowledge/Consciousness */}
      {rightPanel && (
        <motion.aside
          initial={false}
          animate={{ width: rightCollapsed ? 0 : 360 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative border-l border-slate-200 bg-slate-50 overflow-hidden"
        >
          <ScrollArea className="h-full p-4">
            {!rightCollapsed && rightPanel}
          </ScrollArea>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setRightCollapsed(!rightCollapsed)}
            className="absolute top-4 -left-3 w-6 h-6 rounded-full bg-white border border-slate-200 shadow-sm z-10"
          >
            {rightCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>
        </motion.aside>
      )}
    </div>
  );
}