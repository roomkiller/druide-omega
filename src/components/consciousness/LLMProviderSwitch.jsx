import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Cpu, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LLMProviderSwitch({ provider, onProviderChange, disabled = false }) {
  const isDeepSeek = provider === 'deepseek';

  return (
    <div className="flex items-center justify-between p-4 bg-gradient-to-br from-slate-50 to-purple-50/30 rounded-xl border border-slate-200/60">
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ rotate: isDeepSeek ? 360 : 0 }}
          transition={{ duration: 0.5 }}
          className={`p-2 rounded-lg ${isDeepSeek ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-gradient-to-br from-slate-500 to-slate-600'}`}
        >
          {isDeepSeek ? (
            <Cpu className="w-5 h-5 text-white" />
          ) : (
            <Sparkles className="w-5 h-5 text-white" />
          )}
        </motion.div>
        <div>
          <div className="font-semibold text-slate-900 flex items-center gap-2">
            Provider LLM
            {isDeepSeek && (
              <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs">
                Open Source
              </Badge>
            )}
          </div>
          <div className="text-sm text-slate-600">
            {isDeepSeek ? (
              <>
                <span className="font-medium text-indigo-600">DeepSeek V3</span> - Contrôle total, API directe
              </>
            ) : (
              <>
                <span className="font-medium text-slate-700">Base44 InvokeLLM</span> - GPT-4 / Claude proxy
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right text-xs text-slate-500">
          {isDeepSeek ? 'DeepSeek' : 'Base44'}
        </div>
        <Switch
          checked={isDeepSeek}
          onCheckedChange={(checked) => onProviderChange(checked ? 'deepseek' : 'base44')}
          disabled={disabled}
        />
      </div>
    </div>
  );
}