/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Module de Jugement Conscient                               ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ Calibration via équation, Ratio 3:7, Classification, Analyse propriétés   ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

/* =======================
   Base44 helpers (codec)
   ======================= */
const ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgh"; // 44
const BASE = ALPHABET.length;
const CHAR_TO_VAL = {};
for (let i = 0; i < BASE; i++) CHAR_TO_VAL[ALPHABET[i]] = i;

export function encodeBase44(input) {
  if (input.length === 0) return "";
  let zeros = 0;
  while (zeros < input.length && input[zeros] === 0) zeros++;
  const bytes = input.slice();
  const digits = [];
  let start = zeros;
  while (start < bytes.length) {
    let carry = 0;
    for (let i = start; i < bytes.length; i++) {
      const val = (carry << 8) + bytes[i];
      const q = Math.floor(val / BASE);
      const r = val % BASE;
      bytes[i] = q;
      carry = r;
    }
    digits.push(carry);
    while (start < bytes.length && bytes[start] === 0) start++;
  }
  let result = ALPHABET[0].repeat(zeros);
  for (let i = digits.length - 1; i >= 0; i--) result += ALPHABET[digits[i]];
  return result;
}

export function decodeBase44(text) {
  if (!text || text.length === 0) return new Uint8Array();
  let zeros = 0;
  while (zeros < text.length && text[zeros] === ALPHABET[0]) zeros++;
  const digits = [];
  for (let i = zeros; i < text.length; i++) {
    const c = text[i];
    const v = CHAR_TO_VAL[c];
    if (v === undefined) throw new Error(`Caractère Base44 invalide: '${c}'`);
    digits.push(v);
  }
  const bytes = [];
  let start = 0;
  while (start < digits.length) {
    let carry = 0;
    for (let i = start; i < digits.length; i++) {
      const val = carry * BASE + digits[i];
      const q = Math.floor(val / 256);
      const r = val % 256;
      digits[i] = q;
      carry = r;
    }
    bytes.push(carry);
    while (start < digits.length && digits[start] === 0) start++;
  }
  const out = new Uint8Array(zeros + bytes.length);
  for (let i = 0; i < zeros; i++) out[i] = 0;
  for (let i = 0; i < bytes.length; i++) out[zeros + i] = bytes[bytes.length - 1 - i];
  return out;
}

export function jsonToBase44(obj) {
  const s = JSON.stringify(obj);
  const bytes = new TextEncoder().encode(s);
  return encodeBase44(bytes);
}

export function base44ToJson(text) {
  const bytes = decodeBase44(text);
  const s = new TextDecoder().decode(bytes);
  return JSON.parse(s);
}

/* =======================
   Calibration (équation)
   ======================= */
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function quantizeToCalibrationLevel(score) {
  const scaled = Math.round(score * 7);
  if (scaled === 0) return 0;
  return clamp(scaled, -7, +7);
}

function calibrationTrace(level) {
  if (level > 0) return `> +${level} = +*(+0,0,-0)`;
  if (level < 0) return `< -${Math.abs(level)} = /-`;
  return `= 0 (pivot neutre +0,0,-0)`;
}

/* =======================
   Ratio 3:7 (interne:externe)
   ======================= */
const INTERNAL_WEIGHT = 0.3;
const EXTERNAL_WEIGHT = 0.7;

/* =======================
   Fonctions cœur du module
   ======================= */

function extractFactors(text) {
  const tokens = text
    .toLowerCase()
    .match(/[a-zàâçéèêëîïôùûüÿñ0-9]+/g) || [];
  const stop = new Set(["le","la","les","de","des","du","un","une","et","ou","dans","sur","pour","par","avec","sans","en","au","aux","ce","cet","cette"]);
  const filtered = tokens.filter(t => !stop.has(t) && t.length > 2);
  const freq = {};
  for (const t of filtered) freq[t] = (freq[t] || 0) + 1;
  return Object.entries(freq)
    .sort((a,b) => b[1]-a[1])
    .slice(0, 8)
    .map(([t]) => t);
}

function determineNature(text, meta) {
  const hasMaybe = /peut[- ]?être|suppose|hypoth|probable|incertain/i.test(text);
  const hasI = /je\s|moi\s|mon\s|ma\s|mes\s|pense|crois|ressens/i.test(text);
  const hasFact = /\d+|%|km|m|kg|http|www|source|donnée|mesure/i.test(text);
  if (hasFact && hasI) return "mixte";
  if (hasFact) return "fait";
  if (hasMaybe) return "hypothèse";
  if (hasI || meta?.intent === "emotive") return "émotion";
  return "opinion";
}

function determineNuance(text) {
  const modals = (text.match(/peut|souvent|parfois|selon|dépend|nuance|mais|cependant|tandis|tout en/gi) || []).length;
  const uniq = new Set((text.match(/[a-zàâçéèêëîïôùûüÿñ]+/gi) || []).map(w => w.toLowerCase()));
  const richness = clamp(uniq.size / 80, 0, 1);
  return clamp(0.3 * richness + 0.7 * clamp(modals / 8, 0, 1), 0, 1);
}

function determineImpact(text) {
  const pos = (text.match(/\b(bien|utile|clair|juste|positif|améliore|protège|respect)\b/gi) || []).length;
  const neg = (text.match(/\b(mauvais|dangereux|risque|nuisible|négatif|violence|haine)\b/gi) || []).length;
  if (pos > 0 && neg > 0) return "mixte";
  if (pos > 0) return "positif";
  if (neg > 0) return "négatif";
  return "neutre";
}

function determineRelationnel(text, meta) {
  const social = (text.match(/\btu|vous|ensemble|communauté|public|partage|cooper|respect|empathie\b/gi) || []).length;
  const audienceBoost = meta?.audience === "public" ? 0.2 : meta?.audience === "groupe" ? 0.1 : 0;
  return clamp((social / 6) + audienceBoost, 0, 1);
}

function determineInformationnel(text) {
  const facts = (text.match(/\b(donnée|mesure|source|preuve|étude|stat|modèle|algorithme|architecture|schéma)\b/gi) || []).length;
  const numbers = (text.match(/\d+/g) || []).length;
  return clamp((facts + numbers) / 12, 0, 1);
}

function determineCategorie(text, meta) {
  if (meta?.domain) return meta.domain;
  if (/\bcode|algorithme|réseau|système|module|électronique|base44\b/i.test(text)) return "technique";
  if (/\bpoème|métaphore|symbol|sens\b/i.test(text)) return "poétique";
  if (/\bloi|droit|éthique|justice\b/i.test(text)) return "social";
  return "autre";
}

function determineImportance(meta, props) {
  const u = clamp(meta?.urgency ?? 0, 0, 1);
  const rel = clamp(props?.relationnel ?? 0, 0, 1);
  const inf = clamp(props?.informationnel ?? 0, 0, 1);
  const score = 0.4 * u + 0.3 * rel + 0.3 * inf;
  if (score < 0.15) return "ultra_léger";
  if (score < 0.35) return "léger";
  if (score < 0.6) return "modéré";
  if (score < 0.85) return "important";
  return "ultra_important";
}

function chooseDisclosure(props) {
  if (props.catégorie === "technique" && props.informationnel >= 0.5) return "technique";
  if (props.nuance >= 0.6) return "nuancé";
  if (props.nature === "émotion" || props.nature === "poétique") return "symbolique";
  return "direct";
}

function makeSummary(input, props, importance) {
  const head = input.length > 160 ? input.slice(0, 157) + "..." : input;
  return `[${importance}](${props.catégorie}/${props.nature}/${props.impact}) ${head}`;
}

function computeCalibration(input, props) {
  const internalSignals = [
    props.informationnel,
    props.nuance,
    props.catégorie === "technique" ? 1 : 0
  ];
  const internalScore = clamp(internalSignals.reduce((a,b)=>a+b,0) / internalSignals.length, 0, 1);

  const externalSignals = [
    props.relationnel,
    props.impact === "négatif" ? 0.2 : props.impact === "positif" ? 0.8 : 0.5,
    1
  ];
  const externalScore = clamp(externalSignals.reduce((a,b)=>a+b,0) / externalSignals.length, 0, 1);

  const blended = INTERNAL_WEIGHT * internalScore + EXTERNAL_WEIGHT * externalScore;
  const level = quantizeToCalibrationLevel(2 * blended - 1);
  const trace = calibrationTrace(level) + ` | internal=${internalScore.toFixed(2)} external=${externalScore.toFixed(2)} blended=${blended.toFixed(2)}`;
  return { level, internal: INTERNAL_WEIGHT, external: EXTERNAL_WEIGHT, trace };
}

/* =======================
   Fonction principale
   ======================= */
export function judge(conscious) {
  const text = conscious.content ?? "";
  const facteurs = extractFactors(text);
  const nature = determineNature(text, conscious.metadata);
  const nuance = determineNuance(text);
  const impact = determineImpact(text);
  const relationnel = determineRelationnel(text, conscious.metadata);
  const informationnel = determineInformationnel(text);
  const catégorie = determineCategorie(text, conscious.metadata);

  const props = {
    nature,
    nuance,
    impact,
    facteurs,
    relationnel,
    informationnel,
    catégorie
  };

  const importance = determineImportance(conscious.metadata, props);
  const mode = chooseDisclosure(props);
  const summary = makeSummary(text, props, importance);
  const full = text;

  const calib = computeCalibration(text, props);

  return {
    id: conscious.id,
    importance,
    properties: props,
    disclosure: { mode, summary, full },
    calibration: {
      level: calib.level,
      internalWeight: calib.internal,
      externalWeight: calib.external,
      trace: calib.trace
    }
  };
}

/* =======================
   Adaptateurs d'intégration
   ======================= */

export function processConsciousJson(jsonPayload) {
  const input = JSON.parse(jsonPayload);
  const output = judge(input);
  return JSON.stringify(output);
}

export function processConsciousBase44(encodedPayload) {
  const inputObj = base44ToJson(encodedPayload);
  const outputObj = judge(inputObj);
  return jsonToBase44(outputObj);
}

export function validateConscious(input) {
  const errors = [];
  if (!input || typeof input !== "object") errors.push("input manquant");
  if (!input.content || typeof input.content !== "string") errors.push("content requis (string)");
  if (input.metadata && typeof input.metadata !== "object") errors.push("metadata invalide");
  return { ok: errors.length === 0, errors: errors.length ? errors : undefined };
}

/* =======================
   Hook React pour utilisation
   ======================= */
import { useState, useCallback } from 'react';

export function useJudgement() {
  const [lastJudgement, setLastJudgement] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const processInput = useCallback((content, metadata = {}) => {
    setIsProcessing(true);
    const input = { content, metadata, id: `judge_${Date.now()}` };
    const validation = validateConscious(input);
    
    if (!validation.ok) {
      setIsProcessing(false);
      return { error: validation.errors };
    }

    const result = judge(input);
    setLastJudgement(result);
    setIsProcessing(false);
    return result;
  }, []);

  const encodeResult = useCallback((result) => {
    return jsonToBase44(result);
  }, []);

  const decodeInput = useCallback((encoded) => {
    return base44ToJson(encoded);
  }, []);

  return {
    processInput,
    lastJudgement,
    isProcessing,
    encodeResult,
    decodeInput,
    judge,
    validateConscious
  };
}

/* =======================
   Composant de visualisation
   ======================= */
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Scale, 
  Brain, 
  Eye, 
  Gauge, 
  Hash,
  AlertCircle,
  CheckCircle,
  Info,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";

const IMPORTANCE_COLORS = {
  "ultra_léger": "bg-slate-100 text-slate-600",
  "léger": "bg-blue-100 text-blue-700",
  "modéré": "bg-amber-100 text-amber-700",
  "important": "bg-orange-100 text-orange-700",
  "ultra_important": "bg-red-100 text-red-700"
};

const IMPACT_ICONS = {
  "positif": <CheckCircle className="w-4 h-4 text-green-500" />,
  "négatif": <AlertCircle className="w-4 h-4 text-red-500" />,
  "neutre": <Info className="w-4 h-4 text-slate-500" />,
  "mixte": <Zap className="w-4 h-4 text-amber-500" />
};

const DISCLOSURE_MODES = {
  "direct": { label: "Direct", color: "bg-green-500" },
  "nuancé": { label: "Nuancé", color: "bg-blue-500" },
  "symbolique": { label: "Symbolique", color: "bg-purple-500" },
  "technique": { label: "Technique", color: "bg-slate-500" }
};

export function JudgementDisplay({ judgement }) {
  if (!judgement) return null;

  const { importance, properties, disclosure, calibration } = judgement;
  const calibrationPercent = ((calibration.level + 7) / 14) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Header avec importance */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Scale className="w-5 h-5 text-purple-600" />
              Jugement Conscient
            </CardTitle>
            <Badge className={IMPORTANCE_COLORS[importance]}>
              {importance.replace('_', ' ')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">{disclosure.summary}</p>
        </CardContent>
      </Card>

      {/* Propriétés */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Brain className="w-4 h-4 text-indigo-600" />
            Propriétés Analysées
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Nature:</span>
              <Badge variant="outline" className="text-xs">{properties.nature}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Impact:</span>
              {IMPACT_ICONS[properties.impact]}
              <span className="text-xs">{properties.impact}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Catégorie:</span>
              <Badge variant="outline" className="text-xs">{properties.catégorie}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Mode:</span>
              <div className={`w-2 h-2 rounded-full ${DISCLOSURE_MODES[disclosure.mode].color}`} />
              <span className="text-xs">{DISCLOSURE_MODES[disclosure.mode].label}</span>
            </div>
          </div>

          {/* Barres de progression */}
          <div className="space-y-2 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-500">Nuance</span>
                <span>{(properties.nuance * 100).toFixed(0)}%</span>
              </div>
              <Progress value={properties.nuance * 100} className="h-1.5" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-500">Relationnel</span>
                <span>{(properties.relationnel * 100).toFixed(0)}%</span>
              </div>
              <Progress value={properties.relationnel * 100} className="h-1.5" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-500">Informationnel</span>
                <span>{(properties.informationnel * 100).toFixed(0)}%</span>
              </div>
              <Progress value={properties.informationnel * 100} className="h-1.5" />
            </div>
          </div>

          {/* Facteurs */}
          {properties.facteurs.length > 0 && (
            <div className="pt-2">
              <div className="flex items-center gap-1 mb-2">
                <Hash className="w-3 h-3 text-slate-400" />
                <span className="text-xs text-slate-500">Facteurs clés</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {properties.facteurs.map((f, i) => (
                  <Badge key={i} variant="secondary" className="text-[10px]">{f}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Calibration */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Gauge className="w-4 h-4 text-amber-600" />
            Calibration (Ratio 3:7)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-purple-600">
              {calibration.level > 0 ? '+' : ''}{calibration.level}
            </span>
            <div className="text-right text-xs text-slate-500">
              <div>Interne: {(calibration.internalWeight * 100).toFixed(0)}%</div>
              <div>Externe: {(calibration.externalWeight * 100).toFixed(0)}%</div>
            </div>
          </div>
          
          <div className="relative h-3 bg-gradient-to-r from-red-200 via-slate-200 to-green-200 rounded-full">
            <motion.div
              initial={{ left: '50%' }}
              animate={{ left: `${calibrationPercent}%` }}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-purple-600 rounded-full border-2 border-white shadow-lg"
            />
            <div className="absolute left-0 top-full mt-1 text-[10px] text-slate-400">-7</div>
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 text-[10px] text-slate-400">0</div>
            <div className="absolute right-0 top-full mt-1 text-[10px] text-slate-400">+7</div>
          </div>

          <p className="text-[10px] text-slate-400 font-mono mt-4">{calibration.trace}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default JudgementDisplay;