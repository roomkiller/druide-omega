import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Image as ImageIcon, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/components/utils/LanguageContext";
import IntelligenceSwitcher from "@/components/intelligence/IntelligenceSwitcher";

export default function ChatInput({ onSend, disabled, isLoading, onInputChange, conversationId }) {
  const { t } = useLanguage();
  const [input, setInput] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    if (onInputChange) onInputChange(value);
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages(prev => [...prev, ...files].slice(0, 5));
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((!input.trim() && selectedImages.length === 0) || disabled) return;

    onSend(input.trim(), selectedImages.length > 0 ? selectedImages : null);
    setInput("");
    setSelectedImages([]);
    if (onInputChange) onInputChange("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !disabled) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl">
      <form onSubmit={handleSubmit} className="p-4 sm:p-6">
        <AnimatePresence>
          {selectedImages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3 flex gap-2 overflow-x-auto pb-2"
            >
              {selectedImages.map((file, idx) => (
                <div key={idx} className="relative flex-shrink-0">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Selected ${idx + 1}`}
                    className="w-20 h-20 object-cover rounded-lg shadow-md"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full touch-target"
                    onClick={() => removeImage(idx)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-3 items-end">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            className="hidden"
          />
          
          <IntelligenceSwitcher conversationId={conversationId} />
          
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || selectedImages.length >= 5}
            className="flex-shrink-0 min-w-[48px] min-h-[48px] w-12 h-12 border-slate-300 hover:bg-purple-50 hover:border-purple-300 touch-target"
          >
            <ImageIcon className="w-5 h-5 text-purple-600" />
          </Button>

          <Textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={t('chat.placeholder')}
            disabled={disabled}
            rows={1}
            className="flex-1 resize-none rounded-2xl border-slate-300 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 text-base min-h-[48px] py-3 px-4"
          />

          <Button
            type="submit"
            disabled={(!input.trim() && selectedImages.length === 0) || disabled}
            className="flex-shrink-0 min-w-[48px] min-h-[48px] w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-2xl shadow-lg shadow-purple-500/30 touch-target"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}