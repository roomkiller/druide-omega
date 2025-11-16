import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import CollaborationEngine from "../components/collaboration/CollaborationEngine";
import AITaskBoard from "../components/collaboration/AITaskBoard";
import CollaborationChat from "../components/collaboration/CollaborationChat";
import { 
  Users, 
  MessageSquare, 
  CheckSquare,
  FileText,
  Play,
  Pause,
  Loader2,
  Send,
  Bot
} from "lucide-react";
import { motion } from "framer-motion";

export default function AIWorkspace() {
  const [workspaceId, setWorkspaceId] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) setWorkspaceId(id);
  }, []);

  const { data: workspace, isLoading } = useQuery({
    queryKey: ['workspace', workspaceId],
    queryFn: async () => {
      const workspaces = await base44.entities.AIWorkspace.list();
      return workspaces.find(w => w.id === workspaceId);
    },
    enabled: !!workspaceId
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ['workspaceTasks', workspaceId],
    queryFn: async () => {
      const allTasks = await base44.entities.AITask.list();
      return allTasks.filter(t => t.workspace_id === workspaceId);
    },
    enabled: !!workspaceId
  });

  const { data: personalities = [] } = useQuery({
    queryKey: ['personalities'],
    queryFn: () => base44.entities.PersonalityProfile.list()
  });

  const updateWorkspaceMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.AIWorkspace.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace', workspaceId] });
    }
  });

  const handleUserMessage = async () => {
    if (!userInput.trim() || !workspace) return;

    setIsProcessing(true);
    try {
      const newHistory = [
        ...(workspace.collaboration_history || []),
        {
          timestamp: new Date().toISOString(),
          speaker: "User",
          message: userInput,
          message_type: "question"
        }
      ];

      await updateWorkspaceMutation.mutateAsync({
        id: workspace.id,
        data: { collaboration_history: newHistory }
      });

      setUserInput("");

      // Démarrer collaboration IA
      if (workspace.assigned_characters?.length > 0) {
        await CollaborationEngine.processUserInput(
          workspace,
          userInput,
          personalities,
          updateWorkspaceMutation
        );
      }
    } catch (error) {
      console.error("Erreur traitement message:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading || !workspace) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-6 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{workspace.workspace_name}</h1>
                <p className="text-purple-100 text-sm">{workspace.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-white/20 text-white">
                {workspace.assigned_characters?.length || 0} IA
              </Badge>
              <Badge className="bg-white/20 text-white">
                {workspace.progress || 0}%
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-6 h-full">
          <Tabs defaultValue="chat" className="h-full flex flex-col overflow-hidden">
            <TabsList className="bg-white shadow-md mb-4 flex-shrink-0">
              <TabsTrigger value="chat">
                <MessageSquare className="w-4 h-4 mr-2" />
                Collaboration
              </TabsTrigger>
              <TabsTrigger value="tasks">
                <CheckSquare className="w-4 h-4 mr-2" />
                Tâches ({tasks.length})
              </TabsTrigger>
              <TabsTrigger value="deliverables">
                <FileText className="w-4 h-4 mr-2" />
                Livrables ({workspace.deliverables?.length || 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="flex-1 overflow-hidden mt-0">
              <CollaborationChat 
                workspace={workspace}
                onSendMessage={handleUserMessage}
                userInput={userInput}
                setUserInput={setUserInput}
                isProcessing={isProcessing}
              />
            </TabsContent>

            <TabsContent value="tasks" className="flex-1 overflow-hidden mt-0">
              <AITaskBoard 
                tasks={tasks}
                workspace={workspace}
                personalities={personalities}
              />
            </TabsContent>

            <TabsContent value="deliverables" className="flex-1 overflow-hidden mt-0">
              <ScrollArea className="h-full">
                <div className="space-y-4 pr-4">
                  {workspace.deliverables?.length === 0 ? (
                    <Card className="p-12 text-center">
                      <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                      <p className="text-slate-600">Aucun livrable produit pour l'instant</p>
                    </Card>
                  ) : (
                    workspace.deliverables?.map((deliverable, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Card className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-bold text-lg">{deliverable.title}</h3>
                            <Badge>{deliverable.type}</Badge>
                          </div>
                          <p className="text-slate-700 whitespace-pre-wrap mb-2">{deliverable.content}</p>
                          <div className="text-xs text-slate-500">
                            Créé par {deliverable.created_by} • {new Date(deliverable.created_at).toLocaleString('fr-FR')}
                          </div>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}