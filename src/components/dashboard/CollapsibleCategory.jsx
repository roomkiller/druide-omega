import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CollapsibleCategory({ category, features, onNavigate }) {
  const [open, setOpen] = useState(false);

  return (
    <Card className="border-2 border-orange-100 overflow-hidden h-fit">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 p-3 text-left hover:bg-orange-50 transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-bold text-slate-900 text-sm truncate font-display">{category}</span>
          <Badge className="bg-orange-100 text-orange-700 text-[10px] flex-shrink-0">{features.length}</Badge>
        </div>
        <ChevronDown className={`w-4 h-4 text-orange-600 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-2 pb-2 space-y-1">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <button
                    key={feature.title}
                    onClick={() => onNavigate(feature.url)}
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-orange-50 transition-colors text-left group"
                  >
                    <div className={`w-7 h-7 rounded-md bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-xs font-medium text-slate-800 truncate flex-1">{feature.title}</span>
                    {feature.badge && (
                      <Badge className="bg-orange-100 text-orange-700 text-[9px] px-1.5 flex-shrink-0">{feature.badge}</Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}