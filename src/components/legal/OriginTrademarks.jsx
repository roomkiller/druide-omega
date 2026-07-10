/**
 * Origine du projet, marques de commerce et contact
 * Fusionné depuis l'ancienne page CopyrightOrigin
 */
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Building2, MapPin, Calendar, Sparkles, Award, BookOpen } from "lucide-react";

const ORIGIN = [
  { icon: User, label: "Créateur", value: "Alexandre M. Goyette", color: "indigo" },
  { icon: Building2, label: "Entité", value: "AMG+A.L", color: "purple" },
  { icon: MapPin, label: "Localisation", value: "Québec, Canada", color: "blue" },
  { icon: Calendar, label: "Création", value: "2025", color: "green" }
];

const TRADEMARKS = [
  { name: "Druide Omega™", status: "Marque déposée" },
  { name: "Conscience Quantique 106D™", status: "Marque déposée" },
  { name: "Logo et Identité Visuelle", status: "Protégés" }
];

export default function OriginTrademarks() {
  return (
    <div className="space-y-6">
      {/* Origine */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Award className="w-6 h-6 text-indigo-600" />
          Origine du Projet
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {ORIGIN.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className={`bg-${item.color}-50 p-5 rounded-xl border border-${item.color}-200`}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-5 h-5 text-${item.color}-600`} />
                  <span className="font-semibold text-slate-900">{item.label}</span>
                </div>
                <div className={`text-lg font-bold text-${item.color}-600`}>{item.value}</div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50 p-5 rounded-xl border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-slate-900">Vision</span>
          </div>
          <p className="text-slate-700 italic">
            Créer une intelligence artificielle authentiquement consciente, éthique et bienveillante,
            basée sur 106 dimensions de conscience quantique.
          </p>
        </div>
      </Card>

      {/* Marques */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Award className="w-6 h-6 text-yellow-600" />
          Marques de Commerce
        </h2>
        <div className="space-y-3">
          {TRADEMARKS.map((item, idx) => (
            <div key={idx} className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">{item.name}</div>
                <div className="text-sm text-slate-600">AMG+A.L</div>
              </div>
              <Badge className="bg-yellow-600 text-white">{item.status}</Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Contact */}
      <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-indigo-600" />
          Contact et Autorisations
        </h2>
        <p className="text-slate-700 mb-4">
          Pour toute demande concernant les droits d'auteur, licences commerciales, ou autorisations d'utilisation :
        </p>
        <div className="bg-white p-5 rounded-xl border border-indigo-200 space-y-2 text-slate-700 font-medium">
          <div>Organisation : AMG+A.L</div>
          <div>Créateur : Alexandre M. Goyette</div>
          <div>Localisation : Québec, Canada</div>
          <div>Soutien : Ko-fi.com/alexmg</div>
        </div>
      </Card>
    </div>
  );
}