/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Initialisation du Système (paramètres granulaires)         ║
 * ║ © 2026 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Power, Save, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { BOOT_SECTIONS, defaultParams } from '@/components/boot/bootParameters';
import { loadBootConfig, saveBootConfig, fetchSystemStatus, runBoot } from '@/components/boot/bootEngine';
import BootSection from '@/components/boot/BootSection';
import BootSequence from '@/components/boot/BootSequence';

export default function SystemBoot() {
  const navigate = useNavigate();
  const [params, setParams] = useState(defaultParams());
  const [statuses, setStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [booting, setBooting] = useState(false);
  const [showSequence, setShowSequence] = useState(false);
  const [logs, setLogs] = useState([]);
  const [paramStates, setParamStates] = useState({});
  const [activeSection, setActiveSection] = useState(null);
  const [complete, setComplete] = useState(false);
  const [report, setReport] = useState(null);

  useEffect(() => {
    (async () => {
      const config = await loadBootConfig();
      const savedParams = config?.params || {};
      setParams({ ...defaultParams(), ...savedParams });
      const s = await fetchSystemStatus(savedParams);
      setStatuses(s);
      setLoading(false);
    })();
  }, []);

  const handleToggleParam = (id, value) => {
    setParams((prev) => ({ ...prev, [id]: value }));
    setSaved(false);
  };

  const handleToggleSection = (section, value) => {
    setParams((prev) => {
      const next = { ...prev };
      for (const p of section.params) next[p.id] = value;
      return next;
    });
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await saveBootConfig(params);
    setSaving(false);
    setSaved(true);
  };

  const handleStart = async () => {
    setLogs([]);
    setParamStates({});
    setActiveSection(null);
    setComplete(false);
    setReport(null);
    setShowSequence(true);
    setBooting(true);
    await runBoot(params, (event) => {
      if (event.type === 'log') setLogs((prev) => [...prev, event]);
      if (event.type === 'section_active') setActiveSection(event.sectionId);
      if (event.type === 'param') setParamStates((prev) => ({ ...prev, [event.paramId]: event.status }));
      if (event.type === 'complete') {
        setComplete(true);
        setReport(event.report);
        setStatuses(event.statuses);
      }
    });
    setBooting(false);
    setSaved(true);
  };

  const enabledCount = Object.values(params).filter((v) => v !== false).length;
  const totalCount = Object.keys(params).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-28">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950/60 to-slate-900 border-b border-cyan-500/20 px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/ArchitectDashboard')}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-300 mb-3 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Dashboard Architecte
          </button>
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ boxShadow: ['0 0 10px rgba(34,211,238,0.4)', '0 0 25px rgba(34,211,238,0.8)', '0 0 10px rgba(34,211,238,0.4)'] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-700 flex items-center justify-center"
            >
              <Power className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold font-display tracking-wide">Initialisation du Système</h1>
              <p className="text-sm text-slate-400">
                Chaque paramètre est activable individuellement — cyan = activé, rouge = désactivé
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              {enabledCount} activés
            </span>
            <span className="px-2.5 py-1 rounded-full bg-red-500/15 text-red-300 border border-red-500/30">
              {totalCount - enabledCount} désactivés
            </span>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 items-start">
          {BOOT_SECTIONS.map((section, idx) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
            >
              <BootSection
                section={section}
                params={params}
                statuses={statuses}
                onToggleParam={handleToggleParam}
                onToggleSection={handleToggleSection}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Barre d'actions fixe */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur border-t border-cyan-500/20 px-4 py-3 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="text-xs text-slate-400 hidden sm:block">
            {saved ? (
              <span className="flex items-center gap-1 text-cyan-300">
                <CheckCircle className="w-3.5 h-3.5" /> Configuration sauvegardée
              </span>
            ) : (
              'Modifications non sauvegardées'
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleSave}
              disabled={saving || booting}
              variant="outline"
              className="border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white"
            >
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Sauvegarder
            </Button>
            <Button
              onClick={handleStart}
              disabled={booting}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(34,211,238,0.5)] px-6"
            >
              {booting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Power className="w-4 h-4 mr-2" />}
              Démarrer le système
            </Button>
          </div>
        </div>
      </div>

      {showSequence && (
        <BootSequence
          params={params}
          paramStates={paramStates}
          logs={logs}
          activeSection={activeSection}
          complete={complete}
          report={report}
          onClose={() => setShowSequence(false)}
        />
      )}
    </div>
  );
}