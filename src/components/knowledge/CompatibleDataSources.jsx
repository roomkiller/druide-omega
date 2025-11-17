/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Compatible Data Sources with Enhanced Import               ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Sparkles,
  Bell
} from "lucide-react";
import { EnhancedDataImporter } from "./EnhancedDataImporter";
import SourceSubscriptions from "./SourceSubscriptions";

const COMPATIBLE_SOURCES = [
  {
    id: 'wikipedia',
    name: 'Wikipedia API',
    url: 'https://www.mediawiki.org/wiki/API:Main_page',
    category: 'Encyclopédie',
    icon: Globe,
    description: 'Base de connaissances collaborative gratuite',
    features: ['Multilingue', 'Données structurées'],
    license: 'CC BY-SA',
    status: 'recommended',
    canImport: true,
    importMethod: 'wikipedia'
  },
  {
    id: 'arxiv',
    name: 'arXiv',
    url: 'https://info.arxiv.org/help/api/index.html',
    category: 'Sciences',
    icon: Beaker,
    description: 'Archive de prépublications scientifiques',
    features: ['Articles complets', 'PDF/XML'],
    license: 'Open Access',
    status: 'recommended',
    canImport: true,
    importMethod: 'arxiv'
  },
  {
    id: 'pubmed',
    name: 'PubMed Central',
    url: 'https://www.ncbi.nlm.nih.gov/pmc/tools/developers/',
    category: 'Médecine',
    icon: GraduationCap,
    description: 'Archives biomédicales et sciences de la vie',
    features: ['Peer-reviewed', 'Full-text'],
    license: 'Open Access',
    status: 'active',
    canImport: true,
    importMethod: 'pubmed'
  },
  {
    id: 'openstreetmap',
    name: 'OpenStreetMap',
    url: 'https://wiki.openstreetmap.org/wiki/API',
    category: 'Géographie',
    icon: Map,
    description: 'Données cartographiques collaboratives',
    features: ['Géospatiales', 'POI'],
    license: 'ODbL',
    status: 'active',
    canImport: true,
    importMethod: 'openstreetmap'
  },
  {
    id: 'gutenberg',
    name: 'Project Gutenberg',
    url: 'https://www.gutenberg.org/',
    category: 'Littérature',
    icon: BookOpen,
    description: '70,000+ livres du domaine public',
    features: ['Texte intégral', 'Multiformat'],
    license: 'Public Domain',
    status: 'active',
    canImport: true,
    importMethod: 'gutenberg'
  },
  {
    id: 'dbpedia',
    name: 'DBpedia',
    url: 'https://www.dbpedia.org/',
    category: 'Sémantique',
    icon: Database,
    description: 'Version structurée de Wikipedia',
    features: ['RDF', 'SPARQL', 'Linked Data'],
    license: 'CC BY-SA',
    status: 'active',
    canImport: true,
    importMethod: 'dbpedia'
  },
  {
    id: 'europeana',
    name: 'Europeana',
    url: 'https://pro.europeana.eu/page/apis',
    category: 'Culture',
    icon: GraduationCap,
    description: 'Patrimoine culturel européen',
    features: ['Arts', 'Histoire', 'API'],
    license: 'Varies',
    status: 'active',
    canImport: false
  },
  {
    id: 'harvard',
    name: 'Harvard Public Domain',
    url: 'https://library.harvard.edu/',
    category: 'Académique',
    icon: GraduationCap,
    description: '1M+ livres domaine public pour IA',
    features: ['Haute qualité', 'ML-ready'],
    license: 'Public Domain',
    status: 'recommended',
    canImport: false
  }
];

const CATEGORIES = ['Tous', 'Encyclopédie', 'Sciences', 'Médecine', 'Géographie', 'Littérature', 'Sémantique', 'Culture', 'Académique'];

export default function CompatibleDataSources({ onDataImported }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [importing, setImporting] = useState({});
  const [importQuery, setImportQuery] = useState('');
  const [activeTab, setActiveTab] = useState('sources');

  const handleImport = async (source) => {
    if (!importQuery.trim()) {
      alert("Veuillez entrer un terme de recherche");
      return;
    }

    setImporting(prev => ({ ...prev, [source.id]: true }));

    try {
      const results = await EnhancedDataImporter.importAndSave(
        source.importMethod,
        importQuery,
        [source.category.toLowerCase()]
      );

      onDataImported?.({ sourceId: source.id, count: results.length });
      alert(`✓ ${results.length} éléments importés depuis ${source.name}`);
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
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
        <TabsTrigger value="sources">
          <Database className="w-4 h-4 mr-2" />
          Sources ({COMPATIBLE_SOURCES.filter(s => s.canImport).length})
        </TabsTrigger>
        <TabsTrigger value="subscriptions">
          <Bell className="w-4 h-4 mr-2" />
          Abonnements
        </TabsTrigger>
      </TabsList>

      <TabsContent value="sources" className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Sources de Données Compatibles</h2>
          <p className="text-sm text-slate-600 mt-1">
            {COMPATIBLE_SOURCES.filter(s => s.canImport).length} sources avec import direct
          </p>
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
            Cliquez sur "Importer" pour récupérer les données d'une source
          </p>
        </Card>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Filtrer les sources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

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

                  <p className="text-sm text-slate-600 mb-3">{source.description}</p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {source.features.map(feature => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-200 mb-3">
                    <div className="text-xs text-slate-500">{source.license}</div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(source.url, '_blank')}
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
      </TabsContent>

      <TabsContent value="subscriptions">
        <SourceSubscriptions />
      </TabsContent>
    </Tabs>
  );
}