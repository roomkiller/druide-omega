import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { MessageSquare, Plus, Sparkles, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: conversations = [], refetch } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => base44.entities.Conversation.list('-last_message_at'),
  });

  const handleNewChat = () => {
    window.location.href = createPageUrl("Chat");
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 overflow-hidden">
      <style>{`
        :root {
          --primary: 240 5.9% 10%;
          --primary-foreground: 0 0% 98%;
          --accent: 262 83% 58%;
          --accent-light: 262 90% 95%;
        }
      `}</style>

      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex lg:flex-col w-72 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 shadow-sm">
        <div className="p-6 border-b border-slate-200/60">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Assistant IA</h1>
              <p className="text-xs text-slate-500">Conversations intelligentes</p>
            </div>
          </div>
          <Button 
            onClick={handleNewChat}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/30 transition-all duration-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle conversation
          </Button>
        </div>

        <ScrollArea className="flex-1 px-3 py-4">
          <div className="space-y-2">
            {conversations.map((conv) => (
              <Link
                key={conv.id}
                to={`${createPageUrl("Chat")}?id=${conv.id}`}
                className={`block p-3 rounded-xl transition-all duration-200 group ${
                  location.search.includes(conv.id)
                    ? "bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/50"
                    : "hover:bg-slate-50 border border-transparent"
                }`}
              >
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-4 h-4 mt-1 text-slate-400 group-hover:text-purple-600 transition-colors" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-slate-900 truncate">
                      {conv.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {conv.last_message_at && format(new Date(conv.last_message_at), "d MMM", { locale: fr })}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </aside>

      {/* Sidebar Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-2xl flex flex-col">
            <div className="p-6 border-b border-slate-200/60">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-slate-900">Assistant IA</h1>
                    <p className="text-xs text-slate-500">Conversations</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <Button 
                onClick={handleNewChat}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/30"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle conversation
              </Button>
            </div>

            <ScrollArea className="flex-1 px-3 py-4">
              <div className="space-y-2">
                {conversations.map((conv) => (
                  <Link
                    key={conv.id}
                    to={`${createPageUrl("Chat")}?id=${conv.id}`}
                    onClick={() => setSidebarOpen(false)}
                    className={`block p-3 rounded-xl transition-all duration-200 group ${
                      location.search.includes(conv.id)
                        ? "bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/50"
                        : "hover:bg-slate-50 border border-transparent"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <MessageSquare className="w-4 h-4 mt-1 text-slate-400 group-hover:text-purple-600 transition-colors" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-slate-900 truncate">
                          {conv.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {conv.last_message_at && format(new Date(conv.last_message_at), "d MMM", { locale: fr })}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </ScrollArea>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="lg:hidden bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-bold text-slate-900">Assistant IA</h1>
            </div>
            <div className="w-10" />
          </div>
        </header>
        
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}