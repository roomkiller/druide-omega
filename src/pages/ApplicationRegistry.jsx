/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Application Registry Viewer                                ║
 * ║ Visualisation du registre complet de l'application                        ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  FileCode,
  Database,
  Puzzle,
  Search,
  TrendingUp,
  Layout as LayoutIcon,
  Palette,
  Settings,
  GitBranch,
  Package
} from "lucide-react";
import { motion } from "framer-motion";
import APPLICATION_REGISTRY, {
  searchRegistry,
  getStatistics,
  getDependencyTree
} from "@/components/system/ApplicationRegistry";

export default function ApplicationRegistryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const stats = getStatistics();

  const searchResults = searchQuery.length > 2 ? searchRegistry(searchQuery) : null;

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* Header */}
      <div className="flex-shrink-0 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Registre Application</h1>
              <p className="text-sm text-slate-600">
                Catalogue exhaustif de tous les éléments
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher pages, composants, entités..."
            className="pl-10 bg-white"
          />
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex-shrink-0 bg-white/60 backdrop-blur-sm border-b border-slate-200/60 px-6 py-3">
        <div className="flex gap-6 items-center">
          <StatBadge icon={LayoutIcon} label="Pages" value={stats.totalPages} color="from-blue-500 to-cyan-600" />
          <StatBadge icon={Puzzle} label="Composants" value={stats.totalComponents} color="from-purple-500 to-pink-600" />
          <StatBadge icon={Database} label="Entités" value={stats.totalEntities} color="from-green-500 to-emerald-600" />
          <StatBadge icon={Package} label="Intégrations" value={stats.totalIntegrations} color="from-orange-500 to-red-600" />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {searchResults ? (
            <SearchResults results={searchResults} onSelect={setSelectedItem} />
          ) : (
            <Tabs defaultValue="pages" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="pages">
                  <LayoutIcon className="w-4 h-4 mr-2" />
                  Pages ({stats.totalPages})
                </TabsTrigger>
                <TabsTrigger value="components">
                  <Puzzle className="w-4 h-4 mr-2" />
                  Composants ({stats.totalComponents})
                </TabsTrigger>
                <TabsTrigger value="entities">
                  <Database className="w-4 h-4 mr-2" />
                  Entités ({stats.totalEntities})
                </TabsTrigger>
                <TabsTrigger value="architecture">
                  <GitBranch className="w-4 h-4 mr-2" />
                  Architecture
                </TabsTrigger>
                <TabsTrigger value="metadata">
                  <Settings className="w-4 h-4 mr-2" />
                  Métadonnées
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pages">
                <PagesView pages={APPLICATION_REGISTRY.pages} onSelect={setSelectedItem} />
              </TabsContent>

              <TabsContent value="components">
                <ComponentsView components={APPLICATION_REGISTRY.components} onSelect={setSelectedItem} />
              </TabsContent>

              <TabsContent value="entities">
                <EntitiesView entities={APPLICATION_REGISTRY.entities} onSelect={setSelectedItem} />
              </TabsContent>

              <TabsContent value="architecture">
                <ArchitectureView architecture={APPLICATION_REGISTRY.architecture} />
              </TabsContent>

              <TabsContent value="metadata">
                <MetadataView 
                  metadata={APPLICATION_REGISTRY.metadata}
                  layout={APPLICATION_REGISTRY.layout}
                  globals={APPLICATION_REGISTRY.globals}
                  conventions={APPLICATION_REGISTRY.conventions}
                  roadmap={APPLICATION_REGISTRY.roadmap}
                />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </ScrollArea>

      {/* Detail Panel */}
      {selectedItem && (
        <DetailPanel item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}

function StatBadge({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-8 h-8 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div>
        <div className="text-xs text-slate-600">{label}</div>
        <div className="text-lg font-bold text-slate-900">{value}</div>
      </div>
    </div>
  );
}

function PagesView({ pages, onSelect }) {
  const categories = [...new Set(pages.map(p => p.category))];

  return (
    <div className="space-y-6">
      {categories.map(category => {
        const categoryPages = pages.filter(p => p.category === category);
        return (
          <div key={category}>
            <h3 className="text-lg font-semibold text-slate-900 mb-3 capitalize">
              {category} ({categoryPages.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryPages.map((page, idx) => (
                <ItemCard key={idx} item={page} type="page" onSelect={onSelect} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ComponentsView({ components, onSelect }) {
  return (
    <div className="space-y-6">
      {Object.entries(components).map(([category, items]) => (
        <div key={category}>
          <h3 className="text-lg font-semibold text-slate-900 mb-3 capitalize">
            {category} ({items.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((component, idx) => (
              <ItemCard key={idx} item={component} type="component" onSelect={onSelect} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function EntitiesView({ entities, onSelect }) {
  const categories = [...new Set(entities.map(e => e.category))];

  return (
    <div className="space-y-6">
      {categories.map(category => {
        const categoryEntities = entities.filter(e => e.category === category);
        return (
          <div key={category}>
            <h3 className="text-lg font-semibold text-slate-900 mb-3 capitalize">
              {category} ({categoryEntities.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryEntities.map((entity, idx) => (
                <ItemCard key={idx} item={entity} type="entity" onSelect={onSelect} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ItemCard({ item, type, onSelect }) {
  const typeColors = {
    page: "from-blue-500 to-cyan-600",
    component: "from-purple-500 to-pink-600",
    entity: "from-green-500 to-emerald-600"
  };

  const typeIcons = {
    page: LayoutIcon,
    component: Puzzle,
    entity: Database
  };

  const Icon = typeIcons[type];

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Card
        className="p-4 cursor-pointer hover:shadow-lg transition-all border-slate-200 hover:border-purple-300"
        onClick={() => onSelect(item)}
      >
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-10 h-10 bg-gradient-to-br ${typeColors[type]} rounded-lg flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-slate-900 truncate">{item.name}</h4>
            <Badge variant="outline" className="text-xs mt-1">
              {item.category}
            </Badge>
          </div>
        </div>
        <p className="text-xs text-slate-600 line-clamp-2">{item.description}</p>
        {item.status && (
          <div className="mt-2">
            <Badge className={item.status === "stable" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
              {item.status}
            </Badge>
          </div>
        )}
      </Card>
    </motion.div>
  );
}

function SearchResults({ results, onSelect }) {
  const total = results.pages.length + results.components.length + results.entities.length;

  if (total === 0) {
    return (
      <Card className="p-12 text-center">
        <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500">Aucun résultat trouvé</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {results.pages.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-3">
            Pages ({results.pages.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.pages.map((page, idx) => (
              <ItemCard key={idx} item={page} type="page" onSelect={onSelect} />
            ))}
          </div>
        </div>
      )}

      {results.components.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-3">
            Composants ({results.components.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.components.map((comp, idx) => (
              <ItemCard key={idx} item={comp} type="component" onSelect={onSelect} />
            ))}
          </div>
        </div>
      )}

      {results.entities.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-3">
            Entités ({results.entities.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.entities.map((entity, idx) => (
              <ItemCard key={idx} item={entity} type="entity" onSelect={onSelect} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ArchitectureView({ architecture }) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Patterns</h3>
        <div className="space-y-3">
          {architecture.patterns.map((pattern, idx) => (
            <div key={idx} className="border-l-4 border-purple-500 pl-4 py-2">
              <h4 className="font-semibold text-slate-900">{pattern.name}</h4>
              <p className="text-sm text-slate-600">{pattern.description}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {pattern.examples.map((ex, i) => (
                  <Badge key={i} variant="outline" className="text-xs">{ex}</Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Flux de données</h3>
        <div className="space-y-2">
          {architecture.dataFlow.map((flow, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm text-slate-700">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              {flow}
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Couches de sécurité</h3>
        <div className="space-y-2">
          {architecture.securityLayers.map((layer, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm text-slate-700">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              {layer}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function MetadataView({ metadata, layout, globals, conventions, roadmap }) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Métadonnées app</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(metadata).map(([key, value]) => (
            <div key={key}>
              <div className="text-xs text-slate-500 mb-1">{key}</div>
              <div className="text-sm font-medium text-slate-900">
                {Array.isArray(value) ? value.join(", ") : value}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Layout & Globals</h3>
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-slate-700 mb-2">Layout</h4>
            <p className="text-sm text-slate-600 mb-2">{layout.description}</p>
            <div className="flex flex-wrap gap-1">
              {layout.features.map((f, i) => (
                <Badge key={i} variant="outline" className="text-xs">{f}</Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-slate-700 mb-2">Globals CSS</h4>
            <p className="text-sm text-slate-600 mb-2">{globals.description}</p>
            <div className="flex flex-wrap gap-1">
              {globals.features.map((f, i) => (
                <Badge key={i} variant="outline" className="text-xs">{f}</Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Roadmap</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <h4 className="font-semibold text-green-700 mb-2">✅ Complété</h4>
            <ul className="space-y-1 text-xs text-slate-600">
              {roadmap.completed.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-blue-700 mb-2">🔄 En cours</h4>
            <ul className="space-y-1 text-xs text-slate-600">
              {roadmap.inProgress.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-purple-700 mb-2">📋 Planifié</h4>
            <ul className="space-y-1 text-xs text-slate-600">
              {roadmap.planned.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}

function DetailPanel({ item, onClose }) {
  const dependencies = getDependencyTree(item.name);

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      className="fixed right-0 top-0 bottom-0 w-96 bg-white shadow-2xl border-l border-slate-200 z-50 overflow-auto"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">{item.name}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            ×
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <div className="text-xs text-slate-500 mb-1">Description</div>
            <p className="text-sm text-slate-700">{item.description}</p>
          </div>

          {item.path && (
            <div>
              <div className="text-xs text-slate-500 mb-1">Chemin</div>
              <code className="text-xs bg-slate-100 px-2 py-1 rounded">{item.path}</code>
            </div>
          )}

          {item.features && (
            <div>
              <div className="text-xs text-slate-500 mb-2">Features</div>
              <div className="flex flex-wrap gap-1">
                {item.features.map((f, i) => (
                  <Badge key={i} variant="outline" className="text-xs">{f}</Badge>
                ))}
              </div>
            </div>
          )}

          {dependencies.length > 0 && (
            <div>
              <div className="text-xs text-slate-500 mb-2">Dépendances</div>
              <div className="space-y-2">
                {dependencies.map((dep, i) => (
                  <div key={i} className="text-xs bg-slate-50 p-2 rounded">
                    {dep.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}