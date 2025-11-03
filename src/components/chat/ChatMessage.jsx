import React from "react";
import { motion } from "framer-motion";
import { User, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function ChatMessage({ message }) {
  const isUser = message.role === "user";

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
        <div className={`text-sm font-semibold mb-2 ${isUser ? "text-slate-900" : "text-purple-900"}`}>
          {isUser ? "Vous" : "Assistant"}
        </div>
        <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
}