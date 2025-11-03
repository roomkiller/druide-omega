import React from "react";
import { motion } from "framer-motion";
import { User, Sparkles, Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { useTTS } from "../tts/useTTS";

export default function ChatMessage({ message }) {
  const isUser = message.role === "user";
  const { toggle, isSpeaking, isEnabled } = useTTS();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`flex gap-4 px-4 py-6 ${isUser ? "" : "bg-slate-50/50"}`}
    >
      <div className={`flex-shrink-0 w-9 h-9 rounded-2xl flex items-center justify-center shadow-md ${
        isUser 
          ? "bg-gradient-to-br from-slate-700 to-slate-900" 
          : "bg-gradient-to-br from-purple-500 to-indigo-600 shadow-purple-500/30"
      }`}>
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Sparkles className="w-5 h-5 text-white" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <div className={`text-sm font-semibold ${isUser ? "text-slate-900" : "text-purple-900"}`}>
            {isUser ? "Vous" : "Assistant"}
          </div>
          
          {!isUser && isEnabled && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggle(message.content)}
              className={`h-7 w-7 ${isSpeaking ? 'text-purple-600 bg-purple-50' : 'text-slate-400 hover:text-purple-600 hover:bg-purple-50'}`}
            >
              {isSpeaking ? (
                <Square className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>
        <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
}