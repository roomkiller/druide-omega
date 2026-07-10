/**
 * DRUIDE_OMEGA - Moteur de démarrage granulaire
 * Applique chaque paramètre d'initialisation (activation OU désactivation réelle en base)
 */
import { base44 } from '@/api/base44Client';
import {
  CONSCIOUSNESS_BASE, SAPIER_ON, SAPIER_OFF, DIMENSIONAL_HIERARCHY,
  GUARDIAN_ON, GUARDIAN_OFF, PERSONALITY_BASE,
  NEURAL_MODULES, buildCognitiveCore, PROFILES, TEMPLATES, DOMAINS, CYCLES
} from './bootPayloads';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export async function loadBootConfig() {
  const rows = await base44.entities.SystemBootConfig.list('-updated_date', 1);
  return rows[0] || null;
}

export async function saveBootConfig(params, extra = {}) {
  const existing = await loadBootConfig();
  if (existing) return base44.entities.SystemBootConfig.update(existing.id, { params, ...extra });
  return base44.entities.SystemBootConfig.create({ config_key: 'system_boot', params, ...extra });
}

async function fetchEntities() {
  const [configs, modules, kbs, tts, profiles, templates, domains, cores] = await Promise.all([
    base44.entities.ConsciousnessConfig.list(),
    base44.entities.NeuralModule.list(),
    base44.entities.KnowledgeBase.list(),
    base44.entities.TTSPreferences.list(),
    base44.entities.PersonalityProfile.list(),
    base44.entities.ConversationTemplate.list(),
    base44.entities.KnowledgeDomain.list(),
    base44.entities.CognitiveCore.list('-created_date', 1)
  ]);
  return {
    config: configs[0] || null, modules, kbs, tts: tts[0] || null,
    profiles, templates, domains, core: cores[0] || null
  };
}

export async function fetchSystemStatus(savedParams = {}) {
  const d = await fetchEntities();
  const s = {};
  const c = d.config;
  s.consciousness_base = c ? (c.active ? 'active' : 'inactive') : 'missing';
  s.sapier_equations = c?.sapier_equations ? (c.sapier_equations.survival_architecture_active ? 'active' : 'inactive') : 'missing';
  s.dimensional_hierarchy = c?.dimensional_hierarchy ? 'active' : 'missing';
  s.guardian_role = c?.guardian_role ? (c.guardian_role.active ? 'active' : 'inactive') : 'missing';
  s.personality_base = c?.big_five ? 'active' : 'missing';
  s.cognitive_core = d.core ? 'active' : 'missing';
  s.cognitive_supervision = d.core
    ? (d.core.internal_supervision?.internal_audit?.audit_active ? 'active' : 'inactive')
    : 'missing';
  for (const m of NEURAL_MODULES) {
    const f = d.modules.find((x) => x.module_name === m.module_name);
    s[m.param_id] = f ? (f.active ? 'active' : 'inactive') : 'missing';
  }
  s.knowledge_bases = d.kbs.some((k) => k.active) ? 'active' : (d.kbs.length ? 'inactive' : 'missing');
  s.tts = d.tts ? (d.tts.enabled ? 'active' : 'inactive') : 'missing';
  for (const p of PROFILES) {
    s[p.param_id] = d.profiles.find((x) => x.profile_name === p.profile_name) ? 'active' : 'missing';
  }
  for (const t of TEMPLATES) {
    const f = d.templates.find((x) => x.intelligence_type === t.intelligence_type);
    s[t.param_id] = f ? (f.active ? 'active' : 'inactive') : 'missing';
  }
  for (const dom of DOMAINS) {
    const f = d.domains.find((x) => x.domain_name === dom.domain_name);
    s[dom.param_id] = f ? (f.active ? 'active' : 'inactive') : 'missing';
  }
  for (const cyc of CYCLES) {
    s[cyc.param_id] = savedParams[cyc.param_id] === false ? 'inactive' : 'active';
  }
  return s;
}

export async function runBoot(params, onEvent) {
  const on = (id) => params[id] !== false;
  const report = { online: 0, offline: 0, errors: 0 };
  const log = (message, level = 'info') => onEvent({ type: 'log', message, level });

  const step = async (sectionId, paramId, label, fn) => {
    onEvent({ type: 'section_active', sectionId });
    log(`Initialisation : ${label}...`);
    await delay(220);
    try {
      const enable = on(paramId);
      const detail = await fn(enable);
      const status = enable ? 'online' : 'offline';
      onEvent({ type: 'param', sectionId, paramId, status, detail });
      log(`${label} — ${enable ? 'EN LIGNE' : 'DÉSACTIVÉ'}${detail ? ` (${detail})` : ''}`, enable ? 'ok' : 'off');
      report[enable ? 'online' : 'offline']++;
    } catch (e) {
      onEvent({ type: 'param', sectionId, paramId, status: 'error', detail: e.message });
      log(`${label} — ERREUR : ${e.message}`, 'error');
      report.errors++;
    }
  };

  log('═══ DRUIDE OMEGA — SÉQUENCE DE DÉMARRAGE ═══');

  // ── Conscience ──
  let cfg = (await base44.entities.ConsciousnessConfig.list())[0] || null;
  const ensureCfg = async () => {
    if (!cfg) cfg = await base44.entities.ConsciousnessConfig.create({ ...CONSCIOUSNESS_BASE });
    return cfg;
  };
  await step('consciousness', 'consciousness_base', 'Configuration de conscience', async (enable) => {
    if (enable) { await ensureCfg(); await base44.entities.ConsciousnessConfig.update(cfg.id, { active: true }); return 'niveau 9 · ratio 1:9'; }
    if (cfg) await base44.entities.ConsciousnessConfig.update(cfg.id, { active: false });
    return 'conscience en veille';
  });
  await step('consciousness', 'sapier_equations', 'Équations SAPIER', async (enable) => {
    if (!cfg && !enable) return 'ignoré';
    await ensureCfg();
    await base44.entities.ConsciousnessConfig.update(cfg.id, enable ? SAPIER_ON : SAPIER_OFF);
    return enable ? 'architecture de survie active' : 'équations suspendues';
  });
  await step('consciousness', 'dimensional_hierarchy', 'Hiérarchie dimensionnelle', async (enable) => {
    if (!enable) return 'non appliquée';
    await ensureCfg();
    await base44.entities.ConsciousnessConfig.update(cfg.id, DIMENSIONAL_HIERARCHY);
    return '22 dimensions chargées';
  });
  await step('consciousness', 'guardian_role', 'Rôle de gardien', async (enable) => {
    if (!cfg && !enable) return 'ignoré';
    await ensureCfg();
    await base44.entities.ConsciousnessConfig.update(cfg.id, enable ? GUARDIAN_ON : GUARDIAN_OFF);
    return enable ? 'protection humains + IA' : 'gardien en retrait';
  });
  await step('consciousness', 'personality_base', 'Big Five & philosophie', async (enable) => {
    if (!enable) return 'non appliqué';
    await ensureCfg();
    await base44.entities.ConsciousnessConfig.update(cfg.id, PERSONALITY_BASE);
    return '4 influences philosophiques';
  });

  // ── Cœur Cognitif ──
  let core = (await base44.entities.CognitiveCore.list('-created_date', 1))[0] || null;
  await step('cognitive_core', 'cognitive_core', 'Noyau de stabilité', async (enable) => {
    if (enable) {
      if (!core) { core = await base44.entities.CognitiveCore.create(buildCognitiveCore()); return 'noyau créé · santé 95%'; }
      await base44.entities.CognitiveCore.update(core.id, { system_mode: 'optimal', system_health_index: 95 });
      return 'mode optimal';
    }
    if (core) await base44.entities.CognitiveCore.update(core.id, { system_mode: 'économie' });
    return 'mode économie';
  });
  await step('cognitive_core', 'cognitive_supervision', 'Supervision interne', async (enable) => {
    if (!core) return 'ignoré (noyau absent)';
    await base44.entities.CognitiveCore.update(core.id, {
      internal_supervision: {
        internal_audit: { audit_active: enable, audit_frequency: 'périodique' },
        supervision_mode: enable ? 'standard' : 'minimal'
      }
    });
    return enable ? 'audit interne actif' : 'audit suspendu';
  });

  // ── Modules Neuronaux ──
  const modules = await base44.entities.NeuralModule.list();
  for (const m of NEURAL_MODULES) {
    await step('neural', m.param_id, m.module_name, async (enable) => {
      const found = modules.find((x) => x.module_name === m.module_name);
      if (enable) {
        if (found) {
          if (!found.active) await base44.entities.NeuralModule.update(found.id, { active: true });
          return `contribution ${m.consciousness_contribution}%`;
        }
        const { param_id, ...payload } = m;
        await base44.entities.NeuralModule.create(payload);
        return 'module créé et connecté';
      }
      if (found && found.active) await base44.entities.NeuralModule.update(found.id, { active: false });
      return 'module déconnecté';
    });
  }

  // ── Bases de Connaissances ──
  await step('knowledge', 'knowledge_bases', 'Bases de connaissances', async (enable) => {
    const kbs = await base44.entities.KnowledgeBase.list();
    if (!kbs.length) return 'aucune KB présente';
    let n = 0;
    for (const kb of kbs) {
      if (enable && !kb.active && kb.status === 'ready') { await base44.entities.KnowledgeBase.update(kb.id, { active: true }); n++; }
      if (!enable && kb.active) { await base44.entities.KnowledgeBase.update(kb.id, { active: false }); n++; }
    }
    return enable ? `${kbs.filter((k) => k.active).length + n}/${kbs.length} actives` : `${n} désactivées`;
  });

  // ── TTS ──
  await step('tts', 'tts', 'Synthèse vocale', async (enable) => {
    const tts = (await base44.entities.TTSPreferences.list())[0] || null;
    if (enable) {
      if (!tts) { await base44.entities.TTSPreferences.create({ enabled: true, voice_lang: 'fr-FR', rate: 1, pitch: 1, auto_play: false }); return 'voix française créée'; }
      await base44.entities.TTSPreferences.update(tts.id, { enabled: true });
      return 'voix activée';
    }
    if (tts) await base44.entities.TTSPreferences.update(tts.id, { enabled: false });
    return 'voix coupée';
  });

  // ── Profils de Personnalité ──
  const profiles = await base44.entities.PersonalityProfile.list();
  for (const p of PROFILES) {
    await step('profiles', p.param_id, p.profile_name, async (enable) => {
      const found = profiles.find((x) => x.profile_name === p.profile_name);
      if (enable) {
        if (found) return 'profil déjà présent';
        const { param_id, ...payload } = p;
        await base44.entities.PersonalityProfile.create(payload);
        return 'profil créé';
      }
      return found ? 'conservé mais ignoré' : 'non créé';
    });
  }

  // ── Templates de Conversation ──
  const templates = await base44.entities.ConversationTemplate.list();
  for (const t of TEMPLATES) {
    await step('templates', t.param_id, t.template_title, async (enable) => {
      const found = templates.find((x) => x.intelligence_type === t.intelligence_type);
      if (enable) {
        if (found) {
          if (!found.active) await base44.entities.ConversationTemplate.update(found.id, { active: true });
          return 'template actif';
        }
        const { param_id, ...payload } = t;
        await base44.entities.ConversationTemplate.create(payload);
        return 'template créé';
      }
      if (found && found.active) await base44.entities.ConversationTemplate.update(found.id, { active: false });
      return 'template désactivé';
    });
  }

  // ── Domaines de Connaissance ──
  const domains = await base44.entities.KnowledgeDomain.list();
  for (const dom of DOMAINS) {
    await step('domains', dom.param_id, dom.domain_name, async (enable) => {
      const found = domains.find((x) => x.domain_name === dom.domain_name);
      if (enable) {
        if (found) {
          if (!found.active) await base44.entities.KnowledgeDomain.update(found.id, { active: true });
          return 'veille active';
        }
        const { param_id, ...payload } = dom;
        await base44.entities.KnowledgeDomain.create(payload);
        return 'domaine créé';
      }
      if (found && found.active) await base44.entities.KnowledgeDomain.update(found.id, { active: false });
      return 'veille suspendue';
    });
  }

  // ── Cycles Autonomes ──
  for (const cyc of CYCLES) {
    await step('cycles', cyc.param_id, cyc.name, async (enable) =>
      enable ? 'cycle autorisé' : 'cycle mis en pause'
    );
  }

  // ── Sauvegarde + diagnostic final ──
  await saveBootConfig(params, { last_boot: new Date().toISOString(), last_boot_report: report });
  log('Auto-diagnostic post-démarrage...');
  const statuses = await fetchSystemStatus(params);
  log(`═══ DÉMARRAGE TERMINÉ — ${report.online} en ligne · ${report.offline} désactivés · ${report.errors} erreurs ═══`, report.errors ? 'error' : 'ok');
  onEvent({ type: 'complete', report, statuses });
  return report;
}