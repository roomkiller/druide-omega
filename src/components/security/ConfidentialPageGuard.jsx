import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { hasArchitectBypass, hasDemoSession } from "@/lib/adminBypass";
import { Lock } from "lucide-react";

// Pages décrivant l'orchestration interne, l'architecture ou la stratégie — accès admin uniquement
const CONFIDENTIAL_PAGES = [
  // Documentation technique et architecture
  "technicalarchitecture", "druideomegaexplained", "rddocumentation",
  "documentationsynthesis", "componentdocumentation", "testingdocumentation",
  "documentation", "datamodels", "apidocumentation", "apireference", "apiportal",
  "architecturelab", "proofofconcept",
  // Orchestration et systèmes cognitifs internes
  "cognitivenetworkvisualization", "neuralsystem", "consciousnessconfiguration",
  "consciousnessanalysis", "consciousness", "consciousnessstate", "consciousnessevolution",
  "updatephases", "metalearning", "knowledgefusion", "selfcodinglab", "glossary", "changelog",
  // Registre et audit
  "registry", "applicationregistry", "applicationaudit", "applicationevaluation",
  // Stratégie et valorisation
  "legalipreport", "strategicpositioning", "marketposition", "competitiveforces",
  "projectoverview", "projectprogress",
  // Administration et contrôle
  "admin", "publicadmin", "usermanagement", "systemhealth", "systemboot",
  "druidecontrol", "architectdashboard",
  // Monitoring, tests et qualité internes
  "monitoring", "security", "securitydashboard", "testrunner",
  "conversationqualitytest", "datavalidation", "memoryconsolidation",
  // Analyses et données internes
  "analytics", "behavioranalytics", "completionanalysis",
  "cognitiveperformancegaps", "dashboardoptimizationpreview",
  "decisionarchive", "ethicalevolution", "hiddentalents", "securevault",
  // Propriété intellectuelle et plans internes
  "intellectualproperty", "copyrightorigin", "documentationexport",
  "translationaudit", "translationworkplan", "mobileplan", "reactnativesetup",
  "productmanagement", "performanceguide", "bestpractices",
];

export default function ConfidentialPageGuard({ children }) {
  const location = useLocation();
  const pageName = location.pathname.replace(/^\//, "").toLowerCase();
  const isConfidential = CONFIDENTIAL_PAGES.includes(pageName);
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    if (!isConfidential) return;
    setStatus("checking");
    // Plein accès : admin plateforme OU session architecte (email+mdp serveur)
    // La session démo est explicitement bloquée sur les pages confidentielles
    if (hasDemoSession()) {
      setStatus("denied");
      return;
    }
    base44.auth
      .me()
      .then((user) => setStatus(user?.role === "admin" || hasArchitectBypass() ? "allowed" : "denied"))
      .catch(() => setStatus(hasArchitectBypass() ? "allowed" : "denied"));
  }, [isConfidential, location.pathname]);

  if (!isConfidential || status === "allowed") return children;

  if (status === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="w-8 h-8 border-4 border-slate-700 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="text-center max-w-md">
        <div className="bg-purple-500/20 border border-purple-500/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Lock className="h-8 w-8 text-purple-300" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Accès restreint</h1>
        <p className="text-slate-400">
          Cette section contient des informations confidentielles réservées aux administrateurs.
        </p>
        <a href="/" className="inline-block mt-6 text-purple-300 hover:text-purple-200 underline">
          Retour à l'accueil
        </a>
      </div>
    </div>
  );
}