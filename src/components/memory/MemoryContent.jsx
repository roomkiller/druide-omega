import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Code2, FileText } from "lucide-react";
import { useLanguage } from "@/components/utils/LanguageContext";

/**
 * Détecte si une chaîne est du JSON valide (objet ou tableau).
 */
function tryParseJSON(str) {
  if (typeof str !== 'string') return null;
  const trimmed = str.trim();
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    return null;
  }
}

/**
 * Extrait un aperçu lisible d'un objet JSON (premières valeurs textuelles).
 */
function extractReadablePreview(obj, maxLen = 140) {
  const walk = (val) => {
    if (val == null) return '';
    if (typeof val === 'string') return val;
    if (typeof val === 'number' || typeof val === 'boolean') return String(val);
    if (Array.isArray(val)) return val.map(walk).filter(Boolean).join(' · ');
    if (typeof val === 'object') {
      const parts = Object.entries(val).map(([k, v]) => {
        const s = walk(v);
        return s ? `${k}: ${s}` : '';
      }).filter(Boolean);
      return parts.join(' · ');
    }
    return '';
  };
  const text = walk(obj).trim();
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).trim() + '…';
}

/**
 * Formate du JSON en HTML lisible avec coloration syntaxique légère.
 */
function renderFormattedJSON(obj) {
  const pretty = JSON.stringify(obj, null, 2);
  return pretty;
}

export default function MemoryContent({ content, context }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  const analysis = useMemo(() => {
    const parsed = tryParseJSON(content);
    if (parsed !== null) {
      return {
        isJSON: true,
        preview: extractReadablePreview(parsed),
        pretty: renderFormattedJSON(parsed)
      };
    }
    return { isJSON: false, raw: content };
  }, [content]);

  const contextAnalysis = useMemo(() => {
    if (!context) return null;
    const parsed = tryParseJSON(context);
    if (parsed !== null) {
      return { isJSON: true, preview: extractReadablePreview(parsed), pretty: renderFormattedJSON(parsed) };
    }
    return { isJSON: false, raw: context };
  }, [context]);

  return (
    <div className="space-y-2.5" onClick={(e) => e.stopPropagation()}>
      {/* Contenu principal */}
      {analysis.isJSON ? (
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 overflow-hidden">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-slate-100/70 transition-colors group"
          >
            <ChevronRight
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
            />
            <Code2 className="w-3.5 h-3.5 text-violet-500 flex-shrink-0" />
            <span className="text-xs font-medium text-slate-600 flex-1 truncate">
              {t('memoryCard.rawData', 'Données structurées')}
            </span>
            <span className="text-[10px] text-slate-400 group-hover:text-slate-500 transition-colors">
              {open ? t('memoryCard.collapse', 'Réduire') : t('memoryCard.expand', 'Afficher')}
            </span>
          </button>
          <div className="px-3 pb-2.5">
            <p className="text-sm text-slate-600 leading-relaxed">
              {analysis.preview || <span className="italic text-slate-400">{t('memoryCard.emptyData', 'Aucun aperçu disponible')}</span>}
            </p>
          </div>
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="overflow-hidden border-t border-slate-200/80"
              >
                <pre className="px-3 py-3 text-[11px] leading-relaxed font-mono text-slate-700 bg-slate-50/40 overflow-x-auto max-h-72">
                  <code>{analysis.pretty}</code>
                </pre>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-wrap break-words">
          {content}
        </p>
      )}

      {/* Contexte (si présent) */}
      {contextAnalysis && (
        <div className={`rounded-lg ${contextAnalysis.isJSON ? 'border border-slate-200/70 bg-slate-50/40' : ''} px-3 py-2`}>
          {contextAnalysis.isJSON ? (
            <ContextCollapsible label={t('memoryCard.context', 'Contexte')} preview={contextAnalysis.preview} pretty={contextAnalysis.pretty} t={t} />
          ) : (
            <p className="text-xs text-slate-500 italic leading-relaxed">
              <span className="font-medium not-italic text-slate-400">{t('memoryCard.context', 'Contexte')}: </span>
              {contextAnalysis.raw}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function ContextCollapsible({ label, preview, pretty, t }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 text-left group"
      >
        <ChevronRight className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${open ? 'rotate-90' : ''}`} />
        <FileText className="w-3 h-3 text-slate-400 flex-shrink-0" />
        <span className="text-xs font-medium text-slate-500">{label}</span>
      </button>
      <p className="text-xs text-slate-500 leading-relaxed mt-1 pl-5">
        {preview}
      </p>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <pre className="mt-2 pl-5 text-[10px] leading-relaxed font-mono text-slate-600 overflow-x-auto max-h-48">
              <code>{pretty}</code>
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}