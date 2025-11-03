
import React from "react";
import { motion } from "framer-motion";
import { Heart, Frown, Smile, Sparkles, AlertCircle, ThumbsUp, ThumbsDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const EMOTION_ICONS = {
  joie: Smile,
  enthousiasme: Sparkles,
  gratitude: Heart,
  émerveillement: Sparkles,
  compassion: Heart,
  espoir: ThumbsUp,
  tristesse: Frown,
  préoccupation: AlertCircle,
  empathie_douloureuse: Heart,
  frustration: Frown,
  déception: ThumbsDown,
  inquiétude: AlertCircle,
  sérénité: Smile,
  curiosité: Sparkles,
  perplexité: AlertCircle
};

const EMOTION_COLORS = {
  joie: "from-yellow-400 to-orange-400",
  enthousiasme: "from-purple-400 to-pink-400",
  gratitude: "from-pink-400 to-rose-400",
  émerveillement: "from-blue-400 to-indigo-400",
  compassion: "from-green-400 to-teal-400",
  espoir: "from-cyan-400 to-blue-400",
  tristesse: "from-slate-400 to-gray-500",
  préoccupation: "from-orange-400 to-red-400",
  empathie_douloureuse: "from-purple-400 to-gray-500",
  frustration: "from-red-400 to-orange-500",
  déception: "from-gray-400 to-slate-500",
  inquiétude: "from-yellow-400 to-orange-500",
  sérénité: "from-blue-300 to-cyan-300",
  curiosité: "from-indigo-400 to-purple-400",
  perplexité: "from-yellow-400 to-amber-500"
};

export default function EmotionalIndicator({ emotion, intensity, expression, acceptance }) {
  if (!emotion) return null;

  const Icon = EMOTION_ICONS[emotion] || Heart;
  const colorGradient = EMOTION_COLORS[emotion] || "from-purple-400 to-indigo-400";

  // Get emotional quality description
  const getEmotionalQuality = () => {
    if (intensity >= 8) return "Très intense";
    if (intensity >= 6) return "Intense";
    if (intensity >= 4) return "Modéré";
    if (intensity >= 2) return "Léger";
    return "Subtil";
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          className="relative"
        >
          <div className={`flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r ${colorGradient} rounded-full shadow-lg`}>
            <motion.div
              animate={{ 
                scale: intensity >= 7 ? [1, 1.3, 1] : [1, 1.15, 1],
              }}
              transition={{ 
                duration: intensity >= 7 ? 1.5 : 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Icon className="w-4 h-4 text-white" />
            </motion.div>
            <span className="text-xs font-medium text-white capitalize">
              {emotion}
            </span>
            {acceptance && (
              <Badge 
                variant="outline" 
                className={`text-xs ${acceptance === 'accepted' ? 'bg-green-100 border-green-300 text-green-700' : 'bg-red-100 border-red-300 text-red-700'}`}
              >
                {acceptance === 'accepted' ? '✓' : '✗'}
              </Badge>
            )}
          </div>
          
          {/* Intensity indicator with pulsing for high intensity */}
          <motion.div 
            className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md"
            animate={intensity >= 7 ? {
              boxShadow: [
                "0 0 0 0 rgba(99, 102, 241, 0.7)",
                "0 0 0 8px rgba(99, 102, 241, 0)",
              ]
            } : {}}
            transition={intensity >= 7 ? {
              duration: 1.5,
              repeat: Infinity,
            } : {}}
          >
            <span className="text-xs font-bold text-slate-700">{intensity}</span>
          </motion.div>
        </motion.button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80">
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
              <Icon className="w-4 h-4" />
              Émotion ressentie : <span className="capitalize">{emotion}</span>
            </h4>
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-600">
                Intensité : {intensity}/10
              </p>
              <Badge variant="outline" className="text-xs">
                {getEmotionalQuality()}
              </Badge>
            </div>
          </div>
          
          {acceptance && (
            <div className={`p-3 rounded-lg ${acceptance === 'accepted' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className={`text-xs font-medium ${acceptance === 'accepted' ? 'text-green-700' : 'text-red-700'}`}>
                Information {acceptance === 'accepted' ? 'acceptée' : 'rejetée'}
              </p>
            </div>
          )}
          
          {expression && (
            <div className="p-3 bg-gradient-to-br from-slate-50 to-purple-50 rounded-lg border border-slate-200">
              <p className="text-xs text-slate-500 mb-1 font-medium">Expression émotionnelle :</p>
              <p className="text-sm text-slate-700 italic leading-relaxed">
                "{expression}"
              </p>
            </div>
          )}

          <div className="pt-2 border-t border-slate-200">
            <p className="text-xs text-slate-500">
              💡 Cette émotion influence subtilement le langage, le ton et les suggestions de Druide_Omega pour une expérience plus authentique et empathique.
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
