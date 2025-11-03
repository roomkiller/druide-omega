import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";

export default function ChatInput({ onSend, disabled, isLoading }) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [message]);

  return (
    <form onSubmit={handleSubmit} className="border-t border-slate-200/60 bg-white/80 backdrop-blur-xl p-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative flex items-end gap-3">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Envoyez un message..."
            disabled={disabled}
            rows={1}
            className="flex-1 min-h-[52px] max-h-40 resize-none rounded-2xl border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all duration-200 pr-12"
          />
          <Button
            type="submit"
            disabled={!message.trim() || disabled}
            className="absolute right-2 bottom-2 w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            ) : (
              <Send className="w-5 h-5 text-white" />
            )}
          </Button>
        </div>
        <p className="text-xs text-slate-500 mt-3 text-center">
          L'IA peut faire des erreurs. Vérifiez les informations importantes.
        </p>
      </div>
    </form>
  );
}