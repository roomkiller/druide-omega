import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, Image as ImageIcon, X, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ChatInput({ onSend, disabled, isLoading, onImageUpload }) {
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((message.trim() || selectedImage) && !disabled) {
      onSend(message.trim(), selectedImage);
      setMessage("");
      setSelectedImage(null);
      setImagePreview(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
        {imagePreview && (
          <div className="mb-3 relative inline-block">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="max-h-32 rounded-lg border-2 border-purple-200"
            />
            <Button
              type="button"
              onClick={removeImage}
              size="icon"
              variant="destructive"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
            <Badge className="absolute bottom-2 left-2 bg-purple-600">
              <Sparkles className="w-3 h-3 mr-1" />
              Analyse activée
            </Badge>
          </div>
        )}
        
        <div className="relative flex items-end gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || selectedImage}
            variant="outline"
            size="icon"
            className="flex-shrink-0 border-purple-200 hover:bg-purple-50"
          >
            <ImageIcon className="w-5 h-5 text-purple-600" />
          </Button>

          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={selectedImage ? "Posez une question sur l'image..." : "Envoyez un message ou une image..."}
            disabled={disabled}
            rows={1}
            className="flex-1 min-h-[52px] max-h-40 resize-none rounded-2xl border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all duration-200 pr-12"
          />
          
          <Button
            type="submit"
            disabled={(!message.trim() && !selectedImage) || disabled}
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
          {selectedImage 
            ? "L'IA analysera votre image et répondra avec contexte visuel" 
            : "L'IA peut analyser des images et générer des diagrammes • Multi-modal"
          }
        </p>
      </div>
    </form>
  );
}