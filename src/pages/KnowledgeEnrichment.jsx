import React, { useState } from "react";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Brain, 
  Sparkles, 
  Loader2,
  RefreshCw,
  Plus,
  Zap,
  Globe,
  BookOpen,
  Microscope,
  Newspaper,
  TrendingUp,
  ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";


const PREDEFINED_DOMAINS = [
  {
    domain_name: "Intelligence Artificielle & Machine Learning",
    category: "technologie",
    key_topics: ["Deep Learning", "NLP", "Computer Vision", "AGI", "Ethics AI"],
    knowledge_depth: 9
  },
  {
    domain_name: "Médecine & Santé",
    category: "medecine",
    key_topics: ["Génétique", "Immunologie", "Neurosciences", "Épidémiologie", "Thérapies innovantes"],
    knowledge_depth: 8
  },
  {
    domain_name: "Physique Quantique",
    category: "sciences",
    key_topics: ["Mécanique quantique", "Intrication", "Ordinateurs quantiques", "Théorie des cordes"],
    knowledge_depth: 8
  },
  {
    domain_name: "Changement Climatique",
    category: "environnement",
    key_topics: ["Réchauffement global", "Énergies renouvelables", "Biodiversité", "Transition écologique"],
    knowledge_depth: 9
  },
  {
    domain_name: "Géopolitique Mondiale",
    category: "politique",
    key_topics: ["Relations internationales", "Conflits", "Alliances", "Diplomatie", "Économie mondiale"],
    knowledge_depth: 7
  },
  {
    domain_name: "Biotechnologie & Génomique",
    category: "recherche",
    key_topics: ["CRISPR", "Thérapie génique", "Biologie synthétique", "Séquençage ADN"],
    knowledge_depth: 8
  },
  {
    domain_name: "Blockchain & Cryptomonnaies",
    category: "technologie",
    key_topics: ["Bitcoin", "Ethereum", "DeFi", "NFT", "Smart Contracts"],
    knowledge_depth: 7
  },
  {
    domain_name: "Neurosciences & Conscience",
    category: "sciences",
    key_topics: ["Cerveau", "Cognition", "Conscience", "Neuroplasticité", "Interface cerveau-machine"],
    knowledge_depth: 9
  },
  {
    domain_name: "Actualités Mondiales",
    category: "actualites",
    key_topics: ["Politique", "Économie", "Société", "Technologie", "Culture"],
    knowledge_depth: 6,
    update_frequency: "daily"
  },
  {
    domain_name: "Astrophysique & Cosmologie",
    category: "sciences",
    key_topics: ["Trous noirs", "Matière noire", "Big Bang", "Exoplanètes", "Univers"],
    knowledge_depth: 8
  }
];

const categoryIcons = {
  sciences: Microscope,
  technologie: Zap,
  medecine: Brain,
  recherche: BookOpen,
  medias: Newspaper,
  actualites: TrendingUp,
  environnement: Globe,
  default: Sparkles
};

const categoryColors = {
  sciences: "from-blue-500 to-cyan-500",
  technologie: "from-purple-500 to-indigo-500",
  medecine: "from-pink-500 to-rose-500",
  recherche: "from-green-500 to-emerald-500",
  medias: "from-orange-500 to-red-500",
  actualites: "from-yellow-500 to-orange-500",
  environnement: "from-teal-500 to-green-500",
  default: "from-slate-500 to-gray-500"
};

export default function KnowledgeEnrichment() {
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichmentProgress, setEnrichmentProgress] = useState(0);
  const [currentDomain, setCurrentDomain] = useState("");
  const queryClient = useQueryClient();

  const { data: domains = [], isLoading } = useQuery({
    queryKey: ['knowledgeDomains'],
    queryFn: () => base44.entities.KnowledgeDomain.list('-last_update', 100),
  });

  const createDomainMutation = useMutation({
    mutationFn: (data) => base44.entities.KnowledgeDomain.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeDomains'] });
    },
  });

  const updateDomainMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.KnowledgeDomain.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeDomains'] });
    },
  });

  const initializePredefinedDomains = async () => {
    setIsEnriching(true);
    setEnrichmentProgress(0);

    for (let i = 0; i < PREDEFINED_DOMAINS.length; i++) {
      const domain = PREDEFINED_DOMAINS[i];
      setCurrentDomain(domain.domain_name);
      
      // Check if domain already exists
      const existing = domains.find(d => d.domain_name === domain.domain_name);
      if (existing) continue;

      try {
        await createDomainMutation.mutateAsync({
          ...domain,
          last_update: new Date().toISOString(),
          auto_update: true,
          active: true,
          update_frequency: domain.update_frequency || "weekly"
        });

        // Enrich the domain immediately
        await enrichDomain(domain.domain_name, domain.category, domain.key_topics, domain.knowledge_depth);
      } catch (error) {
        console.error(`Erreur initialisation domaine ${domain.domain_name}:`, error);
      }

      setEnrichmentProgress(((i + 1) / PREDEFINED_DOMAINS.length) * 100);
    }

    setIsEnriching(false);
    setCurrentDomain("");
  };

  const enrichDomain = async (domainName, category, keyTopics, depth = 5) => {
    try {
      const prompt = `Tu es une IA qui collecte des connaissances exhaustives sur tous les domaines.

DOMAINE: ${domainName}
CATÉGORIE: ${category}
SUJETS CLÉS: ${keyTopics.join(', ')}
PROFONDEUR REQUISE: ${depth}/10

Collecte des informations COMPLÈTES et À JOUR sur ce domaine. Inclus:

1. VUE D'ENSEMBLE
   - Définition et importance du domaine
   - État actuel des connaissances
   - Évolutions récentes majeures

2. DÉCOUVERTES ET AVANCÉES RÉCENTES (derniers 6-12 mois)
   - Recherches scientifiques publiées
   - Innovations technologiques
   - Événements majeurs
   - Chiffres et statistiques récents

3. CONNAISSANCES FONDAMENTALES
   - Concepts clés
   - Théories principales
   - Méthodes et approches

4. EXPERTS ET SOURCES FIABLES
   - Chercheurs et institutions de référence
   - Publications scientifiques
   - Organisations importantes

5. PERSPECTIVES ET TENDANCES
   - Défis actuels
   - Directions futures
   - Impacts sur la société

Sois EXHAUSTIF, PRÉCIS et FACTUEL. Inclus des DATES, des NOMS, des CHIFFRES quand disponibles.

Retourne un JSON avec:
{
  "knowledge_summary": "résumé complet du domaine (500-1000 mots)",
  "recent_advances": ["avancée 1 avec date", "avancée 2 avec date", ...],
  "key_facts": ["fait 1", "fait 2", ...],
  "expert_sources": ["source 1", "source 2", ...],
  "future_trends": ["tendance 1", "tendance 2", ...]
}`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            knowledge_summary: { type: "string" },
            recent_advances: { type: "array", items: { type: "string" } },
            key_facts: { type: "array", items: { type: "string" } },
            expert_sources: { type: "array", items: { type: "string" } },
            future_trends: { type: "array", items: { type: "string" } }
          }
        }
      });

      // Create comprehensive knowledge base entries
      const kbContent = `# ${domainName}

## Résumé
${result.knowledge_summary}

## Avancées Récentes
${result.recent_advances.map((a, i) => `${i + 1}. ${a}`).join('\n')}

## Faits Clés
${result.key_facts.map((f, i) => `- ${f}`).join('\n')}

## Sources et Experts
${result.expert_sources.map((s, i) => `- ${s}`).join('\n')}

## Tendances Futures
${result.future_trends.map((t, i) => `- ${t}`).join('\n')}`;

      await base44.entities.KnowledgeBase.create({
        title: `Connaissances : ${domainName}`,
        source_type: "text",
        content: kbContent,
        summary: result.knowledge_summary.slice(0, 500),
        extracted_facts: [...result.recent_advances, ...result.key_facts].slice(0, 15),
        tags: [category, ...keyTopics, "enrichissement-auto", "à-jour"],
        status: "ready",
        active: true,
        access_count: 0,
        relevance_score: 100
      });

      // Create memories for key facts
      for (const fact of result.key_facts.slice(0, 5)) {
        await base44.entities.Memory.create({
          type: "fact",
          content: fact,
          context: `Domaine: ${domainName}`,
          importance: 8,
          modality: "system",
          tags: [category, domainName],
          access_count: 0,
          access_modalities: { chat: 0, voice: 0, visual: 0 }
        });
      }

      queryClient.invalidateQueries({ queryKey: ['knowledgeBases'] });
      queryClient.invalidateQueries({ queryKey: ['memories'] });

      return result;
    } catch (error) {
      console.error(`Erreur enrichissement ${domainName}:`, error);
      throw error;
    }
  };

  const handleEnrichAll = async () => {
    if (domains.length === 0) {
      await initializePredefinedDomains();
      return;
    }

    setIsEnriching(true);
    setEnrichmentProgress(0);

    const activeDomains = domains.filter(d => d.active);
    
    for (let i = 0; i < activeDomains.length; i++) {
      const domain = activeDomains[i];
      setCurrentDomain(domain.domain_name);

      try {
        await enrichDomain(
          domain.domain_name,
          domain.category,
          domain.key_topics || [],
          domain.knowledge_depth || 5
        );

        await updateDomainMutation.mutateAsync({
          id: domain.id,
          data: { last_update: new Date().toISOString() }
        });
      } catch (error) {
        console.error(`Erreur enrichissement ${domain.domain_name}:`, error);
      }

      setEnrichmentProgress(((i + 1) / activeDomains.length) * 100);
    }

    setIsEnriching(false);
    setCurrentDomain("");
  };

  const handleEnrichSingle = async (domain) => {
    setIsEnriching(true);
    setCurrentDomain(domain.domain_name);

    try {
      await enrichDomain(
        domain.domain_name,
        domain.category,
        domain.key_topics || [],
        domain.knowledge_depth || 5
      );

      await updateDomainMutation.mutateAsync({
        id: domain.id,
        data: { last_update: new Date().toISOString() }
      });
    } catch (error) {
      console.error("Erreur enrichissement:", error);
    } finally {
      setIsEnriching(false);
      setCurrentDomain("");
    }
  };

  const getCategoryIcon = (category) => {
    const Icon = categoryIcons[category] || categoryIcons.default;
    return Icon;
  };

  const getCategoryColor = (category) => {
    return categoryColors[category] || categoryColors.default;
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50/30 overflow-hidden">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 py-4 sm:py-6">
        <div className="max-w-6xl mx-auto">
          <Button
            onClick={() => window.location.href = createPageUrl('ArchitectDashboard')}
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au Dashboard
          </Button>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/40 flex-shrink-0"
              >
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </motion.div>
              
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 truncate">Enrichissement Automatique</h1>
                <p className="text-sm sm:text-base text-slate-600 truncate">Expansion des connaissances</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <Badge variant="outline" className="px-2 sm:px-4 py-1.5 sm:py-2 bg-white">
                <span className="text-sm sm:text-base">{domains.filter(d => d.auto_update).length}/{domains.length}</span>
              </Badge>
              <Button
                onClick={handleEnrichAll}
                disabled={isEnriching}
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                {isEnriching ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:mr-2 animate-spin" />
                    <span className="hidden sm:inline">Enrichissement...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">{domains.length === 0 ? "Initialiser" : "Enrichir"}</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          {isEnriching && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm font-medium text-slate-700 truncate max-w-[70%]">
                  {currentDomain}
                </span>
                <span className="text-xs sm:text-sm text-slate-600">
                  {Math.round(enrichmentProgress)}%
                </span>
              </div>
              <Progress value={enrichmentProgress} className="h-2" />
            </motion.div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-4">
            <Card className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg sm:text-2xl font-bold text-slate-900">{domains.length}</p>
                  <p className="text-xs sm:text-sm text-slate-600 truncate">Domaines</p>
                </div>
              </div>
            </Card>

            <Card className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg sm:text-2xl font-bold text-slate-900">
                    {domains.filter(d => d.active).length}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 truncate">Actifs</p>
                </div>
              </div>
            </Card>

            <Card className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg sm:text-2xl font-bold text-slate-900">
                    {[...new Set(domains.map(d => d.category))].length}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 truncate">Catégories</p>
                </div>
              </div>
            </Card>

            <Card className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg sm:text-2xl font-bold text-slate-900">
                    {domains.reduce((sum, d) => sum + (d.knowledge_depth || 0), 0)}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 truncate">Profondeur</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Content - Scrollable */}
      <ScrollArea className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
          ) : domains.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 sm:py-20"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Brain className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                Commencez l'enrichissement
              </h3>
              <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6 px-4">
                Initialisez avec {PREDEFINED_DOMAINS.length} domaines prédéfinis
              </p>
              <Button
                onClick={initializePredefinedDomains}
                disabled={isEnriching}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                <Plus className="w-5 h-5 mr-2" />
                Initialiser
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <AnimatePresence>
                {domains.map((domain, index) => {
                  const Icon = getCategoryIcon(domain.category);
                  const colorClass = getCategoryColor(domain.category);

                  return (
                    <motion.div
                      key={domain.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className={`p-4 sm:p-5 ${domain.active ? 'border-purple-200' : 'opacity-60'} hover:shadow-lg transition-all`}>
                        <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${colorClass} rounded-xl flex items-center justify-center shadow-md flex-shrink-0`}>
                            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1 line-clamp-2">
                              {domain.domain_name}
                            </h3>
                            <Badge variant="outline" className="text-xs">
                              {domain.category}
                            </Badge>
                          </div>
                        </div>

                        {domain.knowledge_summary && (
                          <p className="text-xs sm:text-sm text-slate-600 mb-3 line-clamp-3">
                            {domain.knowledge_summary}
                          </p>
                        )}

                        {domain.key_topics && domain.key_topics.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {domain.key_topics.slice(0, 3).map((topic, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                          <div className="text-xs text-slate-500">
                            Profondeur: {domain.knowledge_depth}/10
                          </div>
                          <Button
                            onClick={() => handleEnrichSingle(domain)}
                            disabled={isEnriching}
                            size="sm"
                            variant="outline"
                            className="border-purple-200 hover:bg-purple-50"
                          >
                            <RefreshCw className="w-3 h-3 mr-1" />
                            <span className="hidden sm:inline">Mettre à jour</span>
                          </Button>
                        </div>

                        {domain.last_update && (
                          <p className="text-xs text-slate-400 mt-2 truncate">
                            MAJ: {new Date(domain.last_update).toLocaleDateString('fr-FR')}
                          </p>
                        )}
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}