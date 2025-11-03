
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
  const hasImages = message.image_urls && message.image_urls.length > 0;
  const hasGeneratedImage = message.generated_image;
  const hasAnalysis = message.image_analysis;
  const hasDiagram = message.diagram_url;

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
            {hasImages && message.image_urls.length > 1 && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                <ImageIcon className="w-3 h-3 mr-1" />
                {message.image_urls.length} images comparées
              </Badge>
            )}
            {hasImages && message.image_urls.length === 1 && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                <ImageIcon className="w-3 h-3 mr-1" />
                Image
              </Badge>
            )}
            {hasAnalysis && (
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                <Eye className="w-3 h-3 mr-1" />
                Analyse
              </Badge>
            )}
            {hasDiagram && (
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <Sparkles className="w-3 h-3 mr-1" />
                Diagramme
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

        {/* User uploaded images - Support multiple */}
        {isUser && hasImages && (
          <div className={`mb-3 ${message.image_urls.length > 1 ? 'grid grid-cols-2 md:grid-cols-3 gap-3' : ''}`}>
            {message.image_urls.map((url, index) => (
              <div key={index} className="relative group">
                <img 
                  src={url} 
                  alt={`Image ${index + 1}`}
                  className="w-full rounded-xl border-2 border-slate-200 shadow-md hover:shadow-lg transition-shadow"
                />
                <Badge className="absolute top-2 left-2 bg-black/60 text-white">
                  {index + 1}
                </Badge>
              </div>
            ))}
          </div>
        )}

        {/* AI generated diagram */}
        {!isUser && hasDiagram && (
          <div className="mb-3 relative">
            <img 
              src={message.diagram_url} 
              alt="Diagramme généré par l'IA" 
              className="max-w-2xl w-full rounded-xl border-2 border-green-200 shadow-lg bg-white p-4"
            />
            <Badge className="absolute bottom-5 right-5 bg-green-600">
              <Sparkles className="w-3 h-3 mr-1" />
              Diagramme IA
            </Badge>
          </div>
        )}

        {/* AI generated image */}
        {!isUser && hasGeneratedImage && (
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
              <span className="text-sm font-semibold text-indigo-900">
                {message.image_urls?.length > 1 ? 'Analyse comparative' : 'Analyse visuelle'}
              </span>
            </div>
            <div className="text-sm text-indigo-800 whitespace-pre-wrap">{message.image_analysis}</div>
          </div>
        )}

        <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
}
