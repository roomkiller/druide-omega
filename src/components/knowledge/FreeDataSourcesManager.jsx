/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Free Data Sources Manager                                  ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { base44 } from "@/api/base44Client";
import { 
  Database, 
  BookOpen, 
  Globe, 
  Newspaper,
  Cloud,
  Rocket,
  Flask,
  RefreshCw,
  CheckCircle,
  XCircle,
  Loader2,
  Download
} from "lucide-react";
import { motion } from "framer-motion";

const FREE_SOURCES = [
  {
    id: "wikipedia",
    name: "Wikipedia",
    icon: BookOpen,
    description: "Encyclopédie libre",
    color: "from-slate-500 to-slate-700",
    enabled: true,
    rateLimit: "Illimité"
  },
  {
    id: "arxiv",
    name: "arXiv",
    icon: Flask,
    description: "Articles scientifiques",
    color: "from-red-500 to-orange-600",
    enabled: true,
    rateLimit: "3 req/sec"
  },
  {
    id: "openweather",
    name: "OpenWeather",
    icon: Cloud,
    description: "Données météo",
    color: "from-blue-500 to-cyan-600",
    enabled: false,
    requiresKey: true,
    rateLimit: "60 req/min"
  },
  {
    id: "nasa",
    name: "NASA APOD",
    icon: Rocket,
    description: "Images astronomiques",
    color: "from-indigo-500 to-purple-600",
    enabled: true,
    rateLimit: "1000 req/hour"
  },
  {
    id: "restcountries",
    name: "REST Countries",
    icon: Globe,
    description: "Données pays",
    color: "from-green-500 to-emerald-600",
    enabled: true,
    rateLimit: "Illimité"
  },
  {
    id: "newsapi",
    name: "News API",
    icon: Newspaper,
    description: "Actualités mondiales",
    color: "from-orange-500 to-red-600",
    enabled: false,
    requiresKey: true,
    rateLimit: "100 req/day"
  }
];

export default function FreeDataSourcesManager({ onDataImported }) {
  const [sources, setSources] = useState(FREE_SOURCES);
  const [importing, setImporting] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState({});

  const fetchFromWikipedia = async (query) => {
    try {
      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`
      );
      const data = await response.json();
      return {
        title: data.title,
        content: data.extract,
        url: data.content_urls?.desktop?.page,
        source: "Wikipedia"
      };
    } catch (error) {
      throw new Error("Erreur Wikipedia: " + error.message);
    }
  };

  const fetchFromArXiv = async (query) => {
    try {
      const searchUrl = `https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&start=0&max_results=5`;
      const response = await fetch(searchUrl);
      const xmlText = await response.text();
      
      // Parse XML simple (dans une vraie app, utiliser un parser)
      const entries = xmlText.match(/<entry>([\s\S]*?)<\/entry>/g) || [];
      
      return entries.slice(0, 3).map(entry => {
        const title = entry.match(/<title>(.*?)<\/title>/)?.[1] || "";
        const summary = entry.match(/<summary>(.*?)<\/summary>/)?.[1] || "";
        const link = entry.match(/<id>(.*?)<\/id>/)?.[1] || "";
        
        return {
          title: title.trim(),
          content: summary.trim().slice(0, 500),
          url: link,
          source: "arXiv"
        };
      });
    } catch (error) {
      throw new Error("Erreur arXiv: " + error.message);
    }
  };

  const fetchFromNASA = async () => {
    try {
      const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&count=3');
      const data = await response.json();
      
      return data.map(item => ({
        title: item.title,
        content: item.explanation,
        url: item.url,
        media_url: item.url,
        source: "NASA APOD"
      }));
    } catch (error) {
      throw new Error("Erreur NASA: " + error.message);
    }
  };

  const fetchFromRESTCountries = async (query) => {
    try {
      const response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(query)}`);
      const data = await response.json();
      
      return data.slice(0, 3).map(country => ({
        title: country.name.common,
        content: `Capital: ${country.capital?.[0] || 'N/A'}\nPopulation: ${country.population.toLocaleString()}\nRegion: ${country.region}\nLangues: ${Object.values(country.languages || {}).join(', ')}`,
        url: country.maps?.googleMaps,
        source: "REST Countries"
      }));
    } catch (error) {
      throw new Error("Erreur REST Countries: " + error.message);
    }
  };

  const handleImport = async (sourceId) => {
    if (!searchQuery.trim()) return;
    
    setImporting(prev => ({ ...prev, [sourceId]: true }));

    try {
      let data;
      
      switch (sourceId) {
        case "wikipedia":
          data = [await fetchFromWikipedia(searchQuery)];
          break;
        case "arxiv":
          data = await fetchFromArXiv(searchQuery);
          break;
        case "nasa":
          data = await fetchFromNASA();
          break;
        case "restcountries":
          data = await fetchFromRESTCountries(searchQuery);
          break;
        default:
          throw new Error("Source non implémentée");
      }

      setResults(prev => ({ ...prev, [sourceId]: data }));

      // Créer des Knowledge Bases pour chaque résultat
      for (const item of data) {
        await base44.entities.KnowledgeBase.create({
          name: `${item.source}: ${item.title}`,
          description: `Importé depuis ${item.source}`,
          content: item.content,
          source_url: item.url,
          tags: [item.source.toLowerCase(), searchQuery.toLowerCase()],
          category: "external_data",
          version: "1.0",
          active: true,
          metadata: {
            import_date: new Date().toISOString(),
            source: item.source,
            media_url: item.media_url
          }
        });
      }

      onDataImported?.({ sourceId, count: data.length });
    } catch (error) {
      console.error(`Erreur import ${sourceId}:`, error);
      setResults(prev => ({ ...prev, [sourceId]: { error: error.message } }));
    } finally {
      setImporting(prev => ({ ...prev, [sourceId]: false }));
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Sources de Données Gratuites</h2>
            <p className="text-sm text-slate-600">Enrichissement automatique des connaissances</p>
          </div>
        </div>

        {/* Search Input */}
        <div className="flex gap-2 mb-6">
          <Input
            placeholder="Rechercher un sujet (ex: Artificial Intelligence, Montreal, etc.)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
        </div>

        {/* Sources Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sources.map((source) => {
            const Icon = source.icon;
            const isImporting = importing[source.id];
            const hasResults = results[source.id];
            
            return (
              <motion.div
                key={source.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className={`p-4 border-2 ${source.enabled ? 'border-green-200 bg-green-50/30' : 'border-slate-200 bg-slate-50/30'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${source.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    {source.enabled ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  
                  <h3 className="font-bold text-slate-900 mb-1">{source.name}</h3>
                  <p className="text-xs text-slate-600 mb-2">{source.description}</p>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="text-[10px]">
                      {source.rateLimit}
                    </Badge>
                    {source.requiresKey && (
                      <Badge className="bg-orange-100 text-orange-700 text-[10px]">
                        API Key requise
                      </Badge>
                    )}
                  </div>

                  <Button
                    onClick={() => handleImport(source.id)}
                    disabled={!source.enabled || isImporting || !searchQuery.trim()}
                    size="sm"
                    className="w-full"
                  >
                    {isImporting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Import...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Importer
                      </>
                    )}
                  </Button>

                  {hasResults && !hasResults.error && (
                    <div className="mt-2 text-xs text-green-600 font-semibold">
                      ✓ {hasResults.length} résultats importés
                    </div>
                  )}
                  {hasResults?.error && (
                    <div className="mt-2 text-xs text-red-600">
                      ✗ {hasResults.error}
                    </div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Results Preview */}
      {Object.keys(results).length > 0 && (
        <Card className="p-6">
          <h3 className="font-bold text-slate-900 mb-4">Derniers Imports</h3>
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {Object.entries(results).map(([sourceId, data]) => {
                if (data.error) return null;
                const source = sources.find(s => s.id === sourceId);
                
                return data.map((item, idx) => (
                  <div key={`${sourceId}-${idx}`} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`bg-gradient-to-r ${source.color} text-white text-xs`}>
                        {item.source}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-2">{item.title}</h4>
                    <p className="text-sm text-slate-600 line-clamp-3 mb-2">{item.content}</p>
                    {item.url && (
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Voir la source →
                      </a>
                    )}
                  </div>
                ));
              })}
            </div>
          </ScrollArea>
        </Card>
      )}
    </div>
  );
}