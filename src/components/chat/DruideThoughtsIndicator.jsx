import React, { useState, useEffect } from "react";
import { Brain, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/utils/LanguageContext";

export default function DruideThoughtsIndicator({ thoughts }) {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isGlowing, setIsGlowing] = useState(false);

  useEffect(() => {
    if (thoughts.length > 0) {
      setUnreadCount(thoughts.length);
      setIsGlowing(true);
      
      // Arrêter le glow après 3 secondes
      const timer = setTimeout(() => setIsGlowing(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [thoughts.length]);

  const handleOpen = () => {
    setIsOpen(true);
    setUnreadCount(0);
    setIsGlowing(false);
  };

  if (thoughts.length === 0) return null;

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={handleOpen}
        className={`fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all ${
          isGlowing 
            ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 animate-pulse' 
            : 'bg-gradient-to-br from-purple-600 to-indigo-600 hover:scale-110'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Brain className="w-6 h-6 text-white" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg"
          >
            {unreadCount}
          </motion.div>
        )}
      </motion.button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="fixed right-6 bottom-24 w-96 max-h-[70vh] z-50"
            >
              <Card className="bg-white shadow-2xl border-2 border-purple-200 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    <h3 className="font-semibold">
                      {language === 'en' ? "Druide's Thoughts" : 'Pensées de Druide'}
                    </h3>
                    <Badge className="bg-white/20 text-white">
                      {thoughts.length}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20 h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Thoughts List */}
                <div className="overflow-y-auto max-h-[calc(70vh-80px)] p-4 space-y-3">
                  {thoughts.map((thought, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <div className="p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-semibold text-purple-700">
                            💭 {language === 'en' ? 'Thought' : 'Pensée'} #{idx + 1}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {thought.emotion}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-700 italic leading-relaxed">
                          {thought.thought}
                        </p>
                        {thought.category && (
                          <p className="text-xs text-slate-500 mt-2">
                            {thought.category}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}