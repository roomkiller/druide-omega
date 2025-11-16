import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Plus, 
  Brain,
  Loader2,
  ChevronRight,
  Play,
  Pause,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";
import { createPageUrl } from "@/utils";

export default function AIWorkspaces() {
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const queryClient = useQueryClient();

  const { data: workspaces = [], isLoading } = useQuery({
    queryKey: ['aiWorkspaces'],
    queryFn: () => base44.entities.AIWorkspace.list('-created_date')
  });

  const { data: personalities = [] } = useQuery({
    queryKey: ['personalities'],
    queryFn: () => base44.entities.PersonalityProfile.list()
  });

  const createWorkspaceMutation = useMutation({
    mutationFn: (data) => base44.entities.AIWorkspace.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aiWorkspaces'] });
    }
  });

  const handleCreateWorkspace = () => {
    const defaultWorkspace = {
      workspace_name: "Nouveau Projet Collaboratif",
      description: "Espace de travail pour collaboration multi-IA",
      workspace_type: "brainstorming",
      assigned_characters: [],
      collaboration_history: [],
      current_objective: "Définir les objectifs",
      progress: 0,
      status: "planning",
      deliverables: [],
      collaboration_mode: "sequential"
    };
    createWorkspaceMutation.mutate(defaultWorkspace);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'planning': return 'bg-blue-500';
      case 'paused': return 'bg-yellow-500';
      case 'completed': return 'bg-purple-500';
      default: return 'bg-slate-500';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'brainstorming': return '💡';
      case 'problem_solving': return '🔧';
      case 'content_creation': return '✍️';
      case 'research': return '🔬';
      case 'code_development': return '💻';
      case 'strategic_planning': return '🎯';
      default: return '📋';
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-8 flex-shrink-0">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-2xl">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Espaces de Travail IA</h1>
                <p className="text-purple-100">Collaboration multi-IA pour résoudre des problèmes complexes</p>
              </div>
            </div>
            <Button
              onClick={handleCreateWorkspace}
              disabled={createWorkspaceMutation.isPending}
              className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Workspace
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-8 h-full">
          <ScrollArea className="h-full">
            {workspaces.length === 0 ? (
              <Card className="p-12 text-center">
                <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Aucun espace de travail</h3>
                <p className="text-slate-600 mb-6">
                  Créez votre premier espace collaboratif pour faire travailler plusieurs IA ensemble
                </p>
                <Button onClick={handleCreateWorkspace} className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Créer un Workspace
                </Button>
              </Card>
            ) : (
              <div className="space-y-4 pr-4 pb-6">
                {workspaces.map((workspace, idx) => (
                  <motion.div
                    key={workspace.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card 
                      className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-purple-300"
                      onClick={() => window.location.href = createPageUrl(`AIWorkspace?id=${workspace.id}`)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-2xl">
                            {getTypeIcon(workspace.workspace_type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-slate-900">{workspace.workspace_name}</h3>
                              <Badge className={`${getStatusColor(workspace.status)} text-white`}>
                                {workspace.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-600 mb-3">{workspace.description}</p>
                            
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <Brain className="w-4 h-4 text-purple-600" />
                                <span className="text-slate-700">
                                  {workspace.assigned_characters?.length || 0} IA assignées
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                    style={{ width: `${workspace.progress || 0}%` }}
                                  />
                                </div>
                                <span className="text-slate-600">{workspace.progress || 0}%</span>
                              </div>
                            </div>

                            {workspace.assigned_characters?.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {workspace.assigned_characters.map((char, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {char.character_name} - {char.role}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}