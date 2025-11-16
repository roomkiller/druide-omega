import React, { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Send, Loader2, User, Bot } from "lucide-react";
import { motion } from "framer-motion";

export default function CollaborationChat({ workspace, onSendMessage, userInput, setUserInput, isProcessing }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [workspace.collaboration_history]);

  const getMessageTypeIcon = (type) => {
    switch (type) {
      case 'idea': return '💡';
      case 'question': return '❓';
      case 'answer': return '✅';
      case 'critique': return '🔍';
      case 'synthesis': return '🎯';
      default: return '💬';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1 mb-4">
        <div className="space-y-4 pr-4">
          {workspace.collaboration_history?.length === 0 ? (
            <Card className="p-12 text-center">
              <Bot className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">Commencez la collaboration en posant une question ou en assignant une tâche</p>
            </Card>
          ) : (
            workspace.collaboration_history?.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`flex gap-3 ${msg.speaker === 'User' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.speaker !== 'User' && (
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                
                <Card className={`p-4 max-w-2xl ${msg.speaker === 'User' ? 'bg-purple-50 border-purple-200' : 'bg-white'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-sm">{msg.speaker}</span>
                    <Badge variant="outline" className="text-xs">
                      {getMessageTypeIcon(msg.message_type)} {msg.message_type}
                    </Badge>
                  </div>
                  <p className="text-slate-700 whitespace-pre-wrap">{msg.message}</p>
                  <div className="text-xs text-slate-500 mt-2">
                    {new Date(msg.timestamp).toLocaleTimeString('fr-FR')}
                  </div>
                </Card>

                {msg.speaker === 'User' && (
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </motion.div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <Card className="p-4 flex-shrink-0">
        <div className="flex gap-3">
          <Textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Posez une question ou donnez des instructions..."
            className="flex-1 resize-none"
            rows={3}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSendMessage();
              }
            }}
          />
          <Button
            onClick={onSendMessage}
            disabled={!userInput.trim() || isProcessing}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}