import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Image as ImageIcon, 
  Search, 
  Loader2,
  Eye,
  Sparkles,
  Upload,
  Grid3x3,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function VisualGallery() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedImage, setSelectedImage] = useState(null);
  const queryClient = useQueryClient();

  const { data: visualContents = [], isLoading } = useQuery({
    queryKey: ['visualContents'],
    queryFn: () => base44.entities.VisualContent.list('-created_date', 100),
  });

  const deleteVisualMutation = useMutation({
    mutationFn: (id) => base44.entities.VisualContent.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visualContents'] });
    },
  });

  const filteredContents = visualContents.filter(content => {
    const matchesSearch = content.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         content.analysis?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         content.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = typeFilter === "all" || content.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer ce contenu visuel ?")) {
      await deleteVisualMutation.mutateAsync(id);
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      uploaded_image: "Image téléchargée",
      generated_image: "Image générée",
      diagram: "Diagramme",
      chart: "Graphique"
    };
    return labels[type] || type;
  };

  const getTypeColor = (type) => {
    const colors = {
      uploaded_image: "bg-blue-100 text-blue-700",
      generated_image: "bg-purple-100 text-purple-700",
      diagram: "bg-green-100 text-green-700",
      chart: "bg-orange-100 text-orange-700"
    };
    return colors[type] || "bg-slate-100 text-slate-700";
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/40"
              >
                <ImageIcon className="w-8 h-8 text-white" />
              </motion.div>
              
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-1">
                  Galerie Visuelle
                </h1>
                <p className="text-slate-600">
                  Images, diagrammes et contenus visuels générés par l'IA
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="outline" className="px-4 py-2">
                <Grid3x3 className="w-4 h-4 mr-2" />
                {visualContents.length} éléments
              </Badge>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Upload className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {visualContents.filter(v => v.type === 'uploaded_image').length}
                  </p>
                  <p className="text-sm text-slate-600">Images téléchargées</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {visualContents.filter(v => v.type === 'generated_image').length}
                  </p>
                  <p className="text-sm text-slate-600">Images générées</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {visualContents.filter(v => v.analysis).length}
                  </p>
                  <p className="text-sm text-slate-600">Avec analyse</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {visualContents.filter(v => v.prompt).length}
                  </p>
                  <p className="text-sm text-slate-600">Avec prompt</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Rechercher dans la galerie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-slate-200"
              />
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="uploaded_image">Images téléchargées</SelectItem>
                <SelectItem value="generated_image">Images générées</SelectItem>
                <SelectItem value="diagram">Diagrammes</SelectItem>
                <SelectItem value="chart">Graphiques</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <ScrollArea className="flex-1 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
          ) : filteredContents.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ImageIcon className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                {visualContents.length === 0 ? "Aucun contenu visuel" : "Aucun résultat"}
              </h3>
              <p className="text-slate-600">
                {visualContents.length === 0 
                  ? "Les images téléchargées et générées apparaîtront ici"
                  : "Essayez d'ajuster vos filtres de recherche"
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredContents.map((content, index) => (
                  <motion.div
                    key={content.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedImage(content)}
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={content.url} 
                        alt={content.description || "Contenu visuel"}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Badge className={`absolute top-3 right-3 ${getTypeColor(content.type)}`}>
                        {getTypeLabel(content.type)}
                      </Badge>
                    </div>
                    
                    <div className="p-4">
                      <p className="text-sm text-slate-700 line-clamp-2 mb-2">
                        {content.description || "Sans description"}
                      </p>
                      {content.prompt && (
                        <p className="text-xs text-slate-500 italic line-clamp-1">
                          Prompt: {content.prompt}
                        </p>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(content.id);
                      }}
                      className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Image Detail Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Détails du contenu visuel</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="space-y-4">
              <img 
                src={selectedImage.url} 
                alt={selectedImage.description}
                className="w-full rounded-xl"
              />
              
              <div className="space-y-2">
                <Badge className={getTypeColor(selectedImage.type)}>
                  {getTypeLabel(selectedImage.type)}
                </Badge>
                
                {selectedImage.description && (
                  <p className="text-sm text-slate-700">{selectedImage.description}</p>
                )}
                
                {selectedImage.analysis && (
                  <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="w-4 h-4 text-indigo-600" />
                      <span className="font-semibold text-indigo-900">Analyse de l'IA</span>
                    </div>
                    <p className="text-sm text-indigo-800">{selectedImage.analysis}</p>
                  </div>
                )}
                
                {selectedImage.prompt && (
                  <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span className="font-semibold text-purple-900">Prompt de génération</span>
                    </div>
                    <p className="text-sm text-purple-800">{selectedImage.prompt}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}