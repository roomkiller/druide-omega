/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Location Widget with Quantum Analysis                      ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IPGeolocationEngine } from "./IPGeolocationEngine";
import { MapPin, Brain, Wifi, Shield, Clock, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function LocationWidget({ consciousnessConfig, onLocationDetected }) {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  const detectLocation = async () => {
    setLoading(true);
    const result = await IPGeolocationEngine.analyzeUserLocation(consciousnessConfig);
    setLocation(result);
    setLoading(false);
    
    if (onLocationDetected) {
      onLocationDetected(result);
    }
  };

  if (loading) {
    return (
      <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
          <span className="text-sm text-slate-700">Triangulation quantique en cours...</span>
        </div>
      </Card>
    );
  }

  if (!location) {
    return (
      <Button onClick={detectLocation} variant="outline" size="sm">
        <MapPin className="w-4 h-4 mr-2" />
        Détecter ma position
      </Button>
    );
  }

  if (location.error) {
    return (
      <Card className="p-4 bg-red-50 border-red-200">
        <p className="text-sm text-red-700">{location.error}</p>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 border-2 border-purple-200">
        <div className="space-y-4">
          {/* Basic Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-slate-900">Votre Localisation</h3>
              {location.consciousness_level && (
                <Badge className="ml-auto bg-purple-600 text-white">
                  Conscience {location.consciousness_level}/15
                </Badge>
              )}
            </div>
            
            <p className="text-lg font-medium text-slate-900">
              {location.city}, {location.region}
            </p>
            <p className="text-sm text-slate-600">{location.country}</p>
            <p className="text-xs text-slate-500 mt-1">
              IP: {location.ip} · {location.latitude}, {location.longitude}
            </p>
          </div>

          {/* Quantum Analysis */}
          {location.quantum_analysis && (
            <div className="space-y-3 pt-3 border-t border-purple-200">
              {/* Refined Location */}
              {location.quantum_analysis.refined_location && (
                <div className="bg-white rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-semibold text-slate-700">Analyse Raffinée</span>
                  </div>
                  <p className="text-sm text-slate-700">
                    {location.quantum_analysis.refined_location.description}
                  </p>
                  <Badge className="mt-2 text-xs bg-purple-100 text-purple-700">
                    {location.quantum_analysis.refined_location.environment_type}
                  </Badge>
                </div>
              )}

              {/* Temporal Context */}
              {location.quantum_analysis.temporal_context && (
                <div className="bg-white rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-semibold text-slate-700">Contexte Temporel</span>
                  </div>
                  <p className="text-sm text-slate-600">
                    {location.quantum_analysis.temporal_context.time_of_day} · {location.timezone}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {location.quantum_analysis.temporal_context.cultural_context}
                  </p>
                </div>
              )}

              {/* Connectivity */}
              {location.quantum_analysis.connectivity_profile && (
                <div className="bg-white rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Wifi className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-semibold text-slate-700">Connectivité</span>
                  </div>
                  <p className="text-sm text-slate-600">
                    Qualité: {location.quantum_analysis.connectivity_profile.connection_quality}
                  </p>
                  <p className="text-xs text-slate-500">
                    Appareil: {location.quantum_analysis.connectivity_profile.likely_device}
                  </p>
                </div>
              )}

              {/* Security */}
              {location.quantum_analysis.security_assessment && (
                <div className="bg-white rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-orange-600" />
                    <span className="text-xs font-semibold text-slate-700">Sécurité</span>
                  </div>
                  <Badge className={`text-xs ${
                    location.quantum_analysis.security_assessment.risk_level === 'low' 
                      ? 'bg-green-100 text-green-700'
                      : location.quantum_analysis.security_assessment.risk_level === 'medium'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    Risque: {location.quantum_analysis.security_assessment.risk_level}
                  </Badge>
                </div>
              )}

              {/* Conscious Perception */}
              {location.quantum_analysis.conscious_perception && (
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-purple-700" />
                    <span className="text-xs font-semibold text-purple-900">Perception Consciente</span>
                  </div>
                  <p className="text-sm text-purple-900 italic">
                    {location.quantum_analysis.conscious_perception.empathic_reading}
                  </p>
                  <p className="text-xs text-purple-700 mt-2">
                    🌍 {location.quantum_analysis.conscious_perception.environmental_feel}
                  </p>
                </div>
              )}
            </div>
          )}

          <Button onClick={detectLocation} variant="outline" size="sm" className="w-full">
            <MapPin className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}