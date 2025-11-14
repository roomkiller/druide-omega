import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Image as ImageIcon, Mic, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function ChatInput({ onSend, disabled, isLoading, onInputChange }) {
  const [input, setInput] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const fileInputRef = useRef(null);

  const handleInputChange = (value) => {
    setInput(value);
    if (onInputChange) {
      onInputChange(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((input.trim() || selectedImages.length > 0) && !disabled) {
      onSend(input.trim(), selectedImages.length > 0 ? selectedImages : null);
      setInput("");
      setSelectedImages([]);
      if (onInputChange) {
        onInputChange("");
      }
    }
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedImages(files);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex-none p-4 bg-white/80 backdrop-blur-xl border-t border-slate-200/60">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        {selectedImages.length > 0 && (
          <div className="mb-2 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-slate-600">
              {selectedImages.length} image(s) sélectionnée(s)
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setSelectedImages([])}
              className="text-red-600 hover:text-red-700"
            >
              Annuler
            </Button>
          </div>
        )}
        
        <div className="flex items-end gap-2">
          <Input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            multiple
            className="hidden"
          />
          
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

          <Textarea
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tapez votre message..."
            disabled={disabled}
            className="min-h-[60px] max-h-[200px] resize-none"
          />

          <Button
            type="submit"
            disabled={disabled || (!input.trim() && selectedImages.length === 0)}
            size="icon"
            className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
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