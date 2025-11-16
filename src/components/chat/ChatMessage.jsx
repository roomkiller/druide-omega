import React from "react";
import { motion } from "framer-motion";
import { User, Brain } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function ChatMessage({ message }) {
  if (!message) return null;
  
  const isUser = message.role === "user";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-2 sm:gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
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

      {/* Message */}
      <div className={`flex-1 min-w-0 flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`rounded-2xl sm:rounded-3xl px-3 py-2 sm:px-5 sm:py-3 max-w-full sm:max-w-[85%] shadow-md break-words ${
          isUser 
            ? 'bg-gradient-to-br from-slate-700 to-slate-900 text-white' 
            : 'bg-white border border-slate-200'
        }`}>
          {/* Images */}
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
                  loading="lazy"
                />
              ))}
            </div>
          )}

          {message.generated_image && (
            <img
              src={message.generated_image}
              alt="Generated"
              className="rounded-xl w-full max-w-md mb-3 shadow-lg"
              loading="lazy"
            />
          )}

          {message.diagram_url && (
            <img
              src={message.diagram_url}
              alt="Diagram"
              className="rounded-xl w-full mb-3 shadow-lg bg-white p-2"
              loading="lazy"
            />
          )}

          {/* Content */}
          <div className={`prose prose-sm sm:prose max-w-none ${
            isUser ? 'prose-invert' : 'prose-slate'
          }`}>
            {message.content ? (
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  ul: ({ children }) => <ul className="mb-2 pl-4">{children}</ul>,
                  ol: ({ children }) => <ol className="mb-2 pl-4">{children}</ol>,
                  li: ({ children }) => <li className="mb-1">{children}</li>,
                  code: ({ inline, children }) => 
                    inline ? (
                      <code className="px-1.5 py-0.5 bg-slate-100 text-slate-900 rounded text-sm">{children}</code>
                    ) : (
                      <code className="block p-3 bg-slate-900 text-green-400 rounded-lg overflow-x-auto text-sm">{children}</code>
                    )
                }}
              >
                {message.content}
              </ReactMarkdown>
            ) : (
              <p className="text-slate-400 italic">Message vide</p>
            )}
          </div>
        </div>

        {/* Timestamp */}
        {message.timestamp && (
          <p className="text-xs text-slate-400 mt-1.5 px-2">
            {format(new Date(message.timestamp), "HH:mm", { locale: fr })}
          </p>
        )}
      </div>
    </motion.div>
  );
}