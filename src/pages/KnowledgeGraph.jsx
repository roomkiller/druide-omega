import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Network } from "lucide-react";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageTransition from "@/components/utils/PageTransition";
import InteractiveKnowledgeGraph from "../components/knowledge/InteractiveKnowledgeGraph";

export default function KnowledgeGraph() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
        <div className="max-w-7xl mx-auto page-padding page-padding-y">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="header-spacing"
          >
            <Link to={createPageUrl("Knowledge")}>
              <Button variant="ghost" size="sm" className="mb-4 hover:bg-slate-100">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à la Base de Connaissance
              </Button>
            </Link>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Network className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 font-display">
                  Graphe de Connaissance
                </h1>
                <p className="text-slate-600 mt-1">
                  Visualisation interactive des connexions et relations entre vos savoirs
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ height: '80vh', minHeight: 600 }}
            className="rounded-xl overflow-hidden border border-slate-200 shadow-lg"
          >
            <InteractiveKnowledgeGraph />
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}