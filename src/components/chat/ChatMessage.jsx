import React from "react";
import { motion } from "framer-motion";
import { User, Brain } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-2 sm:gap-4 mb-4 sm:mb-6 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg ${
        isUser 
          ? 'bg-gradient-to-br from-slate-700 to-slate-900' 
          : 'bg-gradient-to-br from-purple-500 via-pink-600 to-indigo-600'
      }`}>
        {isUser ? (
          <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        ) : (
          <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        )}
      </div>

      <div className={`flex-1 min-w-0 ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className={`rounded-2xl sm:rounded-3xl px-3 py-2 sm:px-5 sm:py-3 max-w-full sm:max-w-[85%] shadow-md ${
          isUser 
            ? 'bg-gradient-to-br from-slate-700 to-slate-900 text-white' 
            : 'bg-white border border-slate-200'
        }`}>
          {message.image_urls && message.image_urls.length > 0 && (
            <div className={`grid gap-2 mb-3 ${
              message.image_urls.length === 1 
                ? 'grid-cols-1' 
                : message.image_urls.length === 2 
                  ? 'grid-cols-2' 
                  : 'grid-cols-2 sm:grid-cols-3'
            }`}>
              {message.image_urls.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Uploaded ${idx + 1}`}
                  className="rounded-xl w-full h-auto object-cover shadow-md"
                  style={{ maxHeight: message.image_urls.length === 1 ? '300px' : '150px' }}
                />
              ))}
            </div>
          )}

          {message.generated_image && (
            <img
              src={message.generated_image}
              alt="Generated"
              className="rounded-xl w-full max-w-md mb-3 shadow-lg"
            />
          )}

          {message.diagram_url && (
            <img
              src={message.diagram_url}
              alt="Diagram"
              className="rounded-xl w-full mb-3 shadow-lg bg-white p-2"
            />
          )}

          <div className={`prose prose-sm sm:prose max-w-none ${
            isUser ? 'prose-invert' : 'prose-slate'
          }`}>
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-1.5 px-2">
          {message.timestamp && format(new Date(message.timestamp), "HH:mm", { locale: fr })}
        </p>
      </div>
    </motion.div>
  );
}