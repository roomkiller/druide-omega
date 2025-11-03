import React from "react";
import { motion } from "framer-motion";
import { User, Sparkles, Play, Square, Image as ImageIcon, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import { useTTS } from "../tts/useTTS";

export default function ChatMessage({ message }) {
  const isUser = message.role === "user";
  const { toggle, isSpeaking, isEnabled } = useTTS();
  const hasImage = message.image_url || message.generated_image;
  const hasAnalysis = message.image_analysis;

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
          <div className="flex items-center gap-2">
            <div className={`text-sm font-semibold ${isUser ? "text-slate-900" : "text-purple-900"}`}>
              {isUser ? "Vous" : "Assistant"}
            </div>
            {hasImage && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                <ImageIcon className="w-3 h-3 mr-1" />
                Contenu visuel
              </Badge>
            )}
            {hasAnalysis && (
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                <Eye className="w-3 h-3 mr-1" />
                Analyse
              </Badge>
            )}
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

        {/* User uploaded image */}
        {isUser && message.image_url && (
          <div className="mb-3">
            <img 
              src={message.image_url} 
              alt="Image téléchargée" 
              className="max-w-md rounded-xl border-2 border-slate-200 shadow-md"
            />
          </div>
        )}

        {/* AI generated image */}
        {!isUser && message.generated_image && (
          <div className="mb-3 relative">
            <img 
              src={message.generated_image} 
              alt="Image générée par l'IA" 
              className="max-w-md rounded-xl border-2 border-purple-200 shadow-lg"
            />
            <Badge className="absolute bottom-3 right-3 bg-purple-600">
              <Sparkles className="w-3 h-3 mr-1" />
              Généré par l'IA
            </Badge>
          </div>
        )}

        {/* Image analysis section */}
        {message.image_analysis && (
          <div className="mb-3 p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-semibold text-indigo-900">Analyse visuelle</span>
            </div>
            <p className="text-sm text-indigo-800">{message.image_analysis}</p>
          </div>
        )}

        <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
}