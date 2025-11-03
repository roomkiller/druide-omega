
/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Chat Input Component                                       ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ Fingerprint: AMG:AL:2025:DO:NBC:8F7E:4C9A:3B2F:1E6D:5C4B                 ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, Image as ImageIcon, X, Sparkles, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ChatInput({ onSend, disabled, isLoading }) {
  const [message, setMessage] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((message.trim() || selectedImages.length > 0) && !disabled) {
      onSend(message.trim(), selectedImages);
      setMessage("");
      setSelectedImages([]);
      setImagePreviews([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) return;

    // Limit to 5 images max
    const newImages = [...selectedImages, ...imageFiles].slice(0, 5);
    setSelectedImages(newImages);

    // Generate previews
    const newPreviews = [];
    newImages.forEach((file, index) => {
      if (index >= imagePreviews.length) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
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
        {imagePreviews.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative inline-block">
                <img 
                  src={preview} 
                  alt={`Preview ${index + 1}`} 
                  className="h-24 w-24 object-cover rounded-lg border-2 border-purple-200"
                />
                <Button
                  type="button"
                  onClick={() => removeImage(index)}
                  size="icon"
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
            {selectedImages.length < 5 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="h-24 w-24 border-2 border-dashed border-purple-300 rounded-lg flex items-center justify-center hover:bg-purple-50 transition-colors"
              >
                <Plus className="w-6 h-6 text-purple-500" />
              </button>
            )}
          </div>
        )}

        {selectedImages.length > 0 && (
          <div className="mb-2 flex items-center gap-2">
            <Badge className="bg-purple-600">
              <Sparkles className="w-3 h-3 mr-1" />
              {selectedImages.length} image{selectedImages.length > 1 ? 's' : ''} • Analyse comparative activée
            </Badge>
            {selectedImages.length > 1 && (
              <Badge variant="outline" className="text-purple-600">
                Comparaison multi-images
              </Badge>
            )}
          </div>
        )}
        
        <div className="relative flex items-end gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            className="hidden"
          />
          
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || selectedImages.length >= 5}
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
            placeholder={
              selectedImages.length > 1 
                ? "Comparez ces images, trouvez les différences, ou analysez-les ensemble..." 
                : selectedImages.length === 1
                ? "Posez une question sur l'image..."
                : "Envoyez un message ou des images..."
            }
            disabled={disabled}
            rows={1}
            className="flex-1 min-h-[52px] max-h-40 resize-none rounded-2xl border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all duration-200 pr-12"
          />
          
          <Button
            type="submit"
            disabled={(!message.trim() && selectedImages.length === 0) || disabled}
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
          {selectedImages.length > 1
            ? `L'IA analysera et comparera ${selectedImages.length} images simultanément`
            : selectedImages.length === 1 
            ? "L'IA analysera votre image avec contexte visuel" 
            : "L'IA peut analyser jusqu'à 5 images, générer des diagrammes et flowcharts • Multi-modal"
          }
        </p>
      </div>
    </form>
  );
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SCEAU DE PROPRIÉTÉ INTELLECTUELLE
 * © 2025 AMG+A.L - PROPRIÉTAIRE - Utilisation non autorisée interdite
 * Référence: AMG-AL-DO-2025-001
 * ═══════════════════════════════════════════════════════════════════════════
 */
