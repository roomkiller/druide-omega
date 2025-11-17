/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Compatible Data Sources with Import Integration            ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { 
  ExternalLink, 
  Database, 
  BookOpen, 
  Globe, 
  FileText, 
  Beaker,
  Map,
  GraduationCap,
  Search,
  CheckCircle2,
  Download,
  Loader2,
  Sparkles
} from "lucide-react";

const COMPATIBLE_SOURCES = [
  {
    id: 'wikipedia',
    name: 'Wikipedia API',
    url: 'https://www.mediawiki.org/wiki/API:Main_page',
    category: 'Encyclopédie',
    icon: Globe,
    description: 'Base de connaissances collaborative gratuite avec API REST complète',
    features: ['Multilingue', 'Données structurées', 'Historique des versions'],
    license: 'CC BY-SA',
    apiAvailable: true,
    status: 'recommended',
    canImport: true,
    importMethod: 'wikipedia'
  },
  {
    id: 'wikidata',
    name: 'Wikidata',
    url: 'https://www.wikidata.org/wiki/Wikidata:Data_access',
    category: 'Base de données',
    icon: Database,
    description: 'Base de connaissances structurée et liée, parfaite pour enrichissement sémantique',
    features: ['Linked Open Data', 'SPARQL', 'Multilingue'],
    license: 'CC0',
    apiAvailable: true,
    status: 'recommended',
    canImport: false
  },
  {
    id: 'arxiv',
    name: 'arXiv',
    url: 'https://info.arxiv.org/help/api/index.html',
    category: 'Sciences',
    icon: Beaker,
    description: 'Archive de prépublications scientifiques (physique, maths, informatique)',
    features: ['Articles complets', 'Metadata', 'PDF/XML'],
    license: 'Open Access',
    apiAvailable: true,
    status: 'active',
    canImport: true,
    importMethod: 'arxiv'
  },
  {
    id: 'pubmed',
    name: 'PubMed Central',
    url: 'https://www.ncbi.nlm.nih.gov/pmc/tools/developers/',
    category: 'Médecine',
    icon: GraduationCap,
    description: 'Archives gratuites de littérature biomédicale et sciences de la vie',
    features: ['Articles peer-reviewed', 'API REST', 'Full-text'],
    license: 'Open Access',
    apiAvailable: true,
    status: 'active',
    canImport: false
  },
  {
    id: 'openstreetmap',
    name: 'OpenStreetMap',
    url: 'https://wiki.openstreetmap.org/wiki/API',
    category: 'Géographie',
    icon: Map,
    description: 'Données cartographiques et géographiques collaboratives',
    features: ['Données géospatiales', 'Points d\'intérêt', 'API Overpass'],
    license: 'ODbL',
    apiAvailable: true,
    status: 'active',
    canImport: false
  },
  {
    id: 'gutenberg',
    name: 'Project Gutenberg',
    url: 'https://www.gutenberg.org/ebooks/offline_catalogs.html',
    category: 'Littérature',
    icon: BookOpen,
    description: 'Plus de 70,000 livres du domaine public',
    features: ['Texte intégral', 'Domaine public', 'Multiformat'],
    license: 'Public Domain',
    apiAvailable: false,
    status: 'active',
    canImport: false
  },
  {
    id: 'europeana',
    name: 'Europeana',
    url: 'https://pro.europeana.eu/page/apis',
    category: 'Culture',
    icon: GraduationCap,
    description: 'Patrimoine culturel européen numérisé',
    features: ['Arts', 'Histoire', 'API REST'],
    license: 'Varies',
    apiAvailable: true,
    status: 'active',
    canImport: false
  },
  {
    id: 'harvard-dataset',
    name: 'Harvard Public Domain',
    url: 'https://library.harvard.edu/about/news/2025-09-05/harvard-library-shares-public-domain',
    category: 'Académique',
    icon: GraduationCap,
    description: 'Près d\'1 million de livres du domaine public pour l\'entraînement IA',
    features: ['Haute qualité', 'Domaine public', 'Machine-readable'],
    license: 'Public Domain',
    apiAvailable: true,
    status: 'recommended',
    canImport: false
  },
  {
    id: 'kaggle',
    name: 'Kaggle Datasets',
    url: 'https://www.kaggle.com/datasets',
    category: 'Machine Learning',
    icon: Database,
    description: 'Des milliers de datasets publics pour ML et data science',
    features: ['Communauté', 'Variés', 'API'],
    license: 'Varies',
    apiAvailable: true,
    status: 'active',
    canImport: false
  },
  {
    id: 'dbpedia',
    name: 'DBpedia',
    url: 'https://www.dbpedia.org/',
    category: 'Sémantique',
    icon: Database,
    description: 'Version structurée de Wikipedia avec données liées',
    features: ['RDF', 'SPARQL', 'Linked Data'],
    license: 'CC BY-SA',
    apiAvailable: true,
    status: 'active',
    canImport: false
  },
  {
    id: 'worldcat',
    name: 'WorldCat Search API',
    url: 'https://www.oclc.org/developer/api/oclc-apis/worldcat-search-api.en.html',
    category: 'Bibliothèque',
    icon: BookOpen,
    description: 'Catalogue mondial de bibliothèques',
    features: ['Livres', 'Métadonnées', 'API'],
    license: 'Varies',
    apiAvailable: true,
    status: 'active',
    canImport: false
  },
  {
    id: 'data-gov',
    name: 'Data.gov',
    url: 'https://data.gov/',
    category: 'Gouvernement',
    icon: FileText,
    description: 'Données ouvertes du gouvernement américain',
    features: ['Données publiques', 'API', 'Multidomaine'],
    license: 'Open Data',
    apiAvailable: true,
    status: 'active',
    canImport: false
  }
];

const CATEGORIES = ['Tous', 'Encyclopédie', 'Sciences', 'Médecine', 'Géographie', 'Littérature', 'Culture', 'Académique', 'Machine Learning', 'Sémantique', 'Bibliothèque', 'Gouvernement'];

export default function CompatibleDataSources({ onDataImported }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [importing, setImporting] = useState({});
  const [importQuery, setImportQuery] = useState('');

  const fetchFromWikipedia = async (query) => {
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
  };

  const fetchFromArXiv = async (query) => {
    const searchUrl = `https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&start=0&max_results=5`;
    const response = await fetch(searchUrl);
    const xmlText = await response.text();
    
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
  };

  const handleImport = async (source) => {
    if (!importQuery.trim()) {
      alert("Veuillez entrer un terme de recherche");
      return;
    }

    setImporting(prev => ({ ...prev, [source.id]: true }));

    try {
      let data;

      switch (source.importMethod) {
        case 'wikipedia':
          data = [await fetchFromWikipedia(importQuery)];
          break;
        case 'arxiv':
          data = await fetchFromArXiv(importQuery);
          break;
        default:
          throw new Error("Méthode d'import non implémentée");
      }

      for (const item of data) {
        await base44.entities.KnowledgeBase.create({
          name: `${item.source}: ${item.title}`,
          description: `Importé depuis ${item.source}`,
          content: item.content,
          source_url: item.url,
          tags: [item.source.toLowerCase(), importQuery.toLowerCase()],
          category: "external_data",
          version: "1.0",
          active: true,
          metadata: {
            import_date: new Date().toISOString(),
            source: item.source
          }
        });
      }

      onDataImported?.({ sourceId: source.id, count: data.length });
      alert(`✓ ${data.length} éléments importés depuis ${source.name}`);
    } catch (error) {
      console.error(`Erreur import ${source.id}:`, error);
      alert(`✗ Erreur: ${error.message}`);
    } finally {
      setImporting(prev => ({ ...prev, [source.id]: false }));
    }
  };

  const filteredSources = COMPATIBLE_SOURCES.filter(source => {
    const matchesSearch = source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         source.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Tous' || source.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Sources de Données Compatibles</h2>
          <p className="text-sm text-slate-600 mt-1">
            {filteredSources.length} sources • {filteredSources.filter(s => s.canImport).length} avec import direct
          </p>
        </div>
      </div>

      {/* Import Query */}
      <Card className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-slate-900">Recherche Globale</h3>
        </div>
        <Input
          placeholder="Ex: Artificial Intelligence, Quantum Computing..."
          value={importQuery}
          onChange={(e) => setImportQuery(e.target.value)}
          className="bg-white"
        />
        <p className="text-xs text-slate-600 mt-2">
          Utilisez cette recherche avec le bouton "Importer" sur les sources compatibles
        </p>
      </Card>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Filtrer les sources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => (
          <Button
            key={cat}
            size="sm"
            variant={selectedCategory === cat ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(cat)}
            className={selectedCategory === cat ? 'bg-purple-600' : ''}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Sources Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSources.map((source, index) => {
          const Icon = source.icon;
          const isImporting = importing[source.id];
          
          return (
            <motion.div
              key={source.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Icon className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{source.name}</h3>
                      <Badge variant="outline" className="text-xs mt-1">
                        {source.category}
                      </Badge>
                    </div>
                  </div>
                  {source.status === 'recommended' && (
                    <Badge className="bg-green-500 text-white text-xs">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Top
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-slate-600 mb-3">
                  {source.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {source.features.map(feature => (
                    <Badge key={feature} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200 mb-3">
                  <div className="text-xs text-slate-500">
                    {source.license}
                    {source.apiAvailable && (
                      <span className="ml-2 text-green-600 font-semibold">• API</span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(source.url, '_blank')}
                    className="text-purple-600 hover:text-purple-700"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>

                {source.canImport && (
                  <Button
                    onClick={() => handleImport(source)}
                    disabled={isImporting || !importQuery.trim()}
                    size="sm"
                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-600"
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
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredSources.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <Database className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Aucune source ne correspond à votre recherche</p>
        </div>
      )}
    </div>
  );
}