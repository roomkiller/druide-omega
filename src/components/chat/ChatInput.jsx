import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, Image as ImageIcon, Mic } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/utils/LanguageContext";
import Tooltip from "@/components/ui/Tooltip";

export default function ChatInput({ onSend, disabled, isLoading }) {
  const { t } = useLanguage();
  const [message, setMessage] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((!message.trim() && selectedImages.length === 0) || disabled) return;

    onSend(message.trim(), selectedImages.length > 0 ? selectedImages : null);
    setMessage("");
    setSelectedImages([]);
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-slate-200/60 bg-white/80 backdrop-blur-xl p-4">
      <div className="max-w-4xl mx-auto">
        {selectedImages.length > 0 && (
          <div className="mb-3 flex gap-2 flex-wrap">
            {selectedImages.map((file, idx) => (
              <div key={idx} className="relative">
                <img 
                  src={URL.createObjectURL(file)} 
                  alt={`Preview ${idx + 1}`}
                  className="w-20 h-20 object-cover rounded-lg border-2 border-purple-200"
                />
                <button
                  onClick={() => setSelectedImages(prev => prev.filter((_, i) => i !== idx))}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            className="hidden"
          />

          <Tooltip content={t('tooltips.chat.upload')} position="top">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="flex-shrink-0"
            >
              <ImageIcon className="w-5 h-5" />
            </Button>
          </Tooltip>

          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('chat.newMessage')}
            disabled={disabled}
            className="flex-1 min-h-[52px] max-h-32 resize-none"
          />

          <Tooltip content={t('tooltips.chat.send')} position="top">
            <Button
              type="submit"
              disabled={disabled || (!message.trim() && selectedImages.length === 0)}
              size="icon"
              className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </Tooltip>
        </form>
      </div>
    </div>
  );
}