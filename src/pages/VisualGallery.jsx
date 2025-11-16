
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Image as ImageIcon,
  Search,
  Filter,
  Grid,
  List,
  Eye,
  Calendar,
  Tag,
  Sparkles,
  FileText
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function VisualGallery() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedImage, setSelectedImage] = useState(null);
  const [sortBy, setSortBy] = useState("date");

  const { data: visualContents = [], isLoading } = useQuery({
    queryKey: ['visualContents'],
    queryFn: () => base44.entities.VisualContent.list('-created_date'),
  });

  const filteredContents = visualContents
    .filter(content => {
      const matchesSearch = !searchTerm || 
        content.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        content.analysis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        content.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = selectedType === "all" || content.type === selectedType;
      
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.created_date) - new Date(a.created_date);
      }
      return 0;
    });

  const typeCount = visualContents.reduce((acc, content) => {
    acc[content.type] = (acc[content.type] || 0) + 1;
    return acc;
  }, {});

  const allTags = [...new Set(visualContents.flatMap(c => c.tags || []))];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-pink-50/30 to-purple-50/30 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="min-w-[64px] min-h-[64px] w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-pink-500/40"
              >
                <ImageIcon className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Galerie Visuelle</h1>
                <p className="text-sm sm:text-base text-slate-600">Images et diagrammes</p>
              </div>
            </div>
            
            <Badge variant="outline" className="px-4 py-2 bg-white">
              <span className="text-lg">{filteredContents.length}</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex-shrink-0 bg-white/60 backdrop-blur-sm border-b border-slate-200/60 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 min-h-[44px] bg-white"
              />
            </div>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="min-h-[44px] w-full sm:w-[200px] bg-white touch-target">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous ({visualContents.length})</SelectItem>
                <SelectItem value="uploaded_image">Uploadées ({typeCount.uploaded_image || 0})</SelectItem>
                <SelectItem value="generated_image">Générées ({typeCount.generated_image || 0})</SelectItem>
                <SelectItem value="diagram">Diagrammes ({typeCount.diagram || 0})</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-1 border border-slate-200 rounded-lg p-1 bg-white">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="min-w-[44px] min-h-[44px] touch-target"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="min-w-[44px] min-h-[44px] touch-target"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Tags */}
          {allTags.length > 0 && (
            <ScrollArea className="w-full mt-3">
              <div className="flex gap-2 pb-2">
                <span className="text-xs text-slate-500 flex items-center gap-1 flex-shrink-0">
                  <Tag className="w-3 h-3" />
                  Tags:
                </span>
                {allTags.slice(0, 8).map((tag) => (
                  <Badge key={tag} variant="outline" className="bg-white text-xs whitespace-nowrap">
                    {tag}
                  </Badge>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>

      {/* Gallery - Scrollable */}
      <ScrollArea className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {isLoading ? (
            <div className="text-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block"
              >
                <ImageIcon className="w-12 h-12 text-pink-600" />
              </motion.div>
              <p className="text-slate-600 mt-4">Chargement...</p>
            </div>
          ) : filteredContents.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucun contenu visuel</h3>
              <p className="text-slate-600">
                {searchTerm || selectedType !== "all"
                  ? "Aucun résultat"
                  : "Commencez à générer ou uploader des images"}
              </p>
            </div>
          ) : (
            <div className={viewMode === "grid" 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6" 
              : "space-y-4"
            }>
              {filteredContents.map((content, index) => (
                <motion.div
                  key={content.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group bg-white"
                    onClick={() => setSelectedImage(content)}
                  >
                    <div className="relative aspect-square bg-slate-100">
                      <img
                        src={content.url}
                        alt={content.description || "Image"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      
                      <Badge className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white border-0">
                        {content.type === "uploaded_image" && <ImageIcon className="w-3 h-3 mr-1" />}
                        {content.type === "generated_image" && <Sparkles className="w-3 h-3 mr-1" />}
                        {content.type === "diagram" && <FileText className="w-3 h-3 mr-1" />}
                        {content.type === "uploaded_image" ? "Uploadée" : 
                         content.type === "generated_image" ? "Générée" : "Diagramme"}
                      </Badge>
                    </div>
                    
                    {viewMode === "list" && (
                      <div className="p-4">
                        <p className="text-sm text-slate-700 line-clamp-2 mb-2">
                          {content.description || content.analysis || "Sans description"}
                        </p>
                        {content.tags && content.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {content.tags.slice(0, 3).map((tag, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Image Detail Dialog - With Scrolling */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Détails du contenu visuel
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="flex-1 pr-4">
            {selectedImage && (
              <div className="space-y-4">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.description}
                  className="w-full rounded-lg max-h-[50vh] object-contain bg-slate-100"
                />
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Type</h4>
                    <Badge>
                      {selectedImage.type === "uploaded_image" ? "Image uploadée" :
                       selectedImage.type === "generated_image" ? "Image générée par IA" :
                       "Diagramme"}
                    </Badge>
                  </div>
                  
                  {selectedImage.description && (
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Description</h4>
                      <p className="text-sm text-slate-700">{selectedImage.description}</p>
                    </div>
                  )}
                  
                  {selectedImage.analysis && (
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Analyse</h4>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap">{selectedImage.analysis}</p>
                    </div>
                  )}
                  
                  {selectedImage.prompt && (
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Prompt</h4>
                      <p className="text-sm text-slate-700 italic">"{selectedImage.prompt}"</p>
                    </div>
                  )}
                  
                  {selectedImage.tags && selectedImage.tags.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedImage.tags.map((tag, idx) => (
                          <Badge key={idx} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-3 border-t">
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(selectedImage.created_date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
