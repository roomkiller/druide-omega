import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Plus, RefreshCw, TrendingUp, FileText, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const DOMAINS = [
  'sciences',
  'technologie',
  'medecine',
  'recherche',
  'medias',
  'arts',
  'philosophie',
  'histoire',
  'economie',
  'politique'
];

export default function KnowledgeBaseEnrichmentPanel() {
  const queryClient = useQueryClient();
  const [selectedDomains, setSelectedDomains] = useState(DOMAINS);

  // Récupérer les documents KB
  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['knowledgeBase'],
    queryFn: async () => {
      return await base44.entities.KnowledgeBase.list();
    }
  });

  // Mutation pour enrichir la KB
  const enrichMutation = useMutation({
    mutationFn: async () => {
      return await base44.functions.invoke('enrichKnowledgeBase', {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase'] });
    }
  });

  const handleEnrich = () => {
    enrichMutation.mutate();
  };

  const toggleDomain = (domain) => {
    setSelectedDomains(prev =>
      prev.includes(domain)
        ? prev.filter(d => d !== domain)
        : [...prev, domain]
    );
  };

  const coverage = documents.length > 0 ? Math.round((documents.filter(d => d.active).length / documents.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <div>
              <h3 className="text-lg font-bold text-slate-900">Base de Connaissances</h3>
              <p className="text-sm text-slate-600">Enrichissement continu du corpus documentaire</p>
            </div>
          </div>
          <Button
            onClick={handleEnrich}
            disabled={enrichMutation.isPending}
            className="gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className={`w-4 h-4 ${enrichMutation.isPending ? 'animate-spin' : ''}`} />
            {enrichMutation.isPending ? 'Enrichissement...' : 'Enrichir KB'}
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-white rounded-lg border border-blue-200">
            <div className="text-sm text-slate-600 mb-1">Documents</div>
            <div className="text-2xl font-bold text-blue-600">{documents.length}</div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-blue-200">
            <div className="text-sm text-slate-600 mb-1">Actifs</div>
            <div className="text-2xl font-bold text-green-600">
              {documents.filter(d => d.active).length}
            </div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-blue-200">
            <div className="text-sm text-slate-600 mb-1">Domaines</div>
            <div className="text-2xl font-bold text-indigo-600">{DOMAINS.length}</div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-blue-200">
            <div className="text-sm text-slate-600 mb-1">Couverture</div>
            <div className="text-2xl font-bold text-purple-600">{coverage}%</div>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="documents" className="gap-2">
            <FileText className="w-4 h-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="domains" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            Domaines
          </TabsTrigger>
        </TabsList>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4">
          {isLoading ? (
            <Card className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 text-slate-600">
                <div className="animate-spin">⏳</div>
                Chargement des documents...
              </div>
            </Card>
          ) : documents.length === 0 ? (
            <Card className="p-6 bg-amber-50 border-amber-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-900 mb-1">Base vide</h4>
                  <p className="text-sm text-amber-800">Enrichissez la base de connaissances pour améliorer la contextualisation.</p>
                </div>
              </div>
            </Card>
          ) : (
            <div className="grid gap-3">
              {documents.map((doc, idx) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 mb-1">{doc.title}</h4>
                        <p className="text-sm text-slate-600 line-clamp-2">{doc.summary}</p>
                      </div>
                      {doc.active && (
                        <Badge className="bg-green-100 text-green-700 ml-2">Actif</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {doc.tags?.map(tag => (
                        <Badge key={tag} variant="outline" className="bg-slate-50">
                          {tag}
                        </Badge>
                      ))}
                      <span className="text-slate-500 ml-auto">
                        Pertinence: {doc.relevance_score || 0}%
                      </span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Domains Tab */}
        <TabsContent value="domains" className="space-y-4">
          <Card className="p-6">
            <h4 className="font-semibold text-slate-900 mb-4">Domaines de Connaissances</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {DOMAINS.map(domain => {
                const domainDocs = documents.filter(d =>
                  d.tags?.includes(domain)
                );
                const isSelected = selectedDomains.includes(domain);

                return (
                  <button
                    key={domain}
                    onClick={() => toggleDomain(domain)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 bg-white hover:border-blue-300'
                    }`}
                  >
                    <div className="font-medium text-slate-900 capitalize mb-1">
                      {domain}
                    </div>
                    <div className="text-xs text-slate-600">
                      {domainDocs.length} doc{domainDocs.length !== 1 ? 's' : ''}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Info Card */}
      <Card className="p-4 bg-slate-50 border-slate-200">
        <p className="text-xs text-slate-600">
          💡 Une base de connaissances riche améliore la contextualisation et la qualité des réponses. Les documents sont mis à jour automatiquement et restent pertinents via un scoring continu.
        </p>
      </Card>
    </div>
  );
}