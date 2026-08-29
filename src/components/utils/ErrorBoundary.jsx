/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Error Boundary with Auto-Logging                           ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { base44 } from "@/api/base44Client";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidUpdate(prevProps) {
    // Réinitialise l'erreur quand on navigue vers une nouvelle page,
    // sans forcer un remontage complet de l'arbre (pas de key change).
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false, error: null });
    }
  }

  async componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);

    try {
      const user = await base44.auth.me().catch(() => null);
      
      await base44.entities.ErrorLog.create({
        error_type: 'javascript',
        severity: 'critical',
        message: error.message,
        stack_trace: error.stack,
        user_email: user?.email || 'anonymous',
        page: window.location.pathname,
        browser: navigator.userAgent,
        resolved: false,
        occurrences: 1
      });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-red-50">
          <div className="max-w-md mx-auto p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-3">Une erreur s'est produite</h1>
            <p className="text-slate-600 mb-6">
              L'erreur a été automatiquement enregistrée. Veuillez rafraîchir la page.
            </p>
            <Button onClick={() => window.location.reload()} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Rafraîchir
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}