/**
 * Project Dashboard with Folder Organization
 * Manage all video projects and versions
 */

import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/utils/LanguageContext";
import { motion } from "framer-motion";
import { Folder, Plus, Trash2, FolderOpen, Clock } from "lucide-react";
import { toast } from "sonner";

export default function ProjectDashboard() {
  const { language } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const [projData, folderData] = await Promise.all([
        base44.entities.VideoProject.list(),
        base44.entities.ProjectFolder.list()
      ]);
      setProjects(projData);
      setFolders(folderData);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createFolder = async () => {
    const folderName = prompt(language === 'fr' ? "Nom du dossier:" : "Folder name:");
    if (!folderName) return;

    try {
      await base44.entities.ProjectFolder.create({
        name: folderName,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`
      });
      loadProjects();
      toast.success(language === 'fr' ? "Dossier créé" : "Folder created");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteProject = async (projectId) => {
    if (!confirm(language === 'fr' ? "Confirmer suppression?" : "Confirm deletion?")) return;
    
    try {
      await base44.entities.VideoProject.delete(projectId);
      loadProjects();
      toast.success(language === 'fr' ? "Projet supprimé" : "Project deleted");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredProjects = selectedFolder
    ? projects.filter(p => p.folder_id === selectedFolder)
    : projects;

  return (
    <div className="grid grid-cols-4 gap-4">
      {/* Sidebar - Folders */}
      <div className="col-span-1 space-y-2">
        <Button onClick={createFolder} variant="outline" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          {language === 'fr' ? "Nouveau dossier" : "New folder"}
        </Button>

        <div className="space-y-1">
          <button
            onClick={() => setSelectedFolder(null)}
            className={`w-full text-left p-2 rounded text-sm ${
              !selectedFolder ? "bg-purple-600" : "bg-slate-800 hover:bg-slate-700"
            }`}
          >
            📁 {language === 'fr' ? "Tous les projets" : "All projects"}
          </button>

          {folders.map(folder => (
            <button
              key={folder.id}
              onClick={() => setSelectedFolder(folder.id)}
              className={`w-full text-left p-2 rounded text-sm flex items-center gap-2 ${
                selectedFolder === folder.id ? "bg-purple-600" : "bg-slate-800 hover:bg-slate-700"
              }`}
            >
              <Folder className="w-4 h-4" />
              {folder.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main - Projects Grid */}
      <div className="col-span-3 space-y-4">
        <h2 className="text-xl font-bold text-slate-300">
          {selectedFolder 
            ? folders.find(f => f.id === selectedFolder)?.name
            : language === 'fr' ? "Tous les projets" : "All projects"}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {filteredProjects.map(project => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-slate-800 hover:bg-slate-700 cursor-pointer transition-all">
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {project.metadata?.thumbnail_url && (
                    <img 
                      src={project.metadata.thumbnail_url} 
                      alt={project.title}
                      className="w-full h-32 object-cover rounded"
                    />
                  )}
                  <div className="text-xs text-slate-400 space-y-1">
                    <p>🎬 {project.metadata?.duration?.toFixed(1) || "?"} sec</p>
                    <p>📊 {project.frames?.length || 0} frames</p>
                    <p>✓ v{project.versions?.length || 1}</p>
                  </div>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="w-full text-xs p-1 bg-red-600/20 text-red-400 rounded hover:bg-red-600/40"
                  >
                    <Trash2 className="w-3 h-3 inline mr-1" />
                    {language === 'fr' ? "Supprimer" : "Delete"}
                  </button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}