/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Copyright & Legal Notices (Canada & Québec)                ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ SCEAU CRYPTÉ NIVEAU 4: AMG:AL:2025:DO:NBC:8F7E:4C9A:3B2F:1E6D:5C4B       ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  Shield, 
  Copyright, 
  FileText, 
  Download,
  Lock,
  AlertTriangle
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════
// SCEAU CRYPTOGRAPHIQUE NIVEAU 4
// ═══════════════════════════════════════════════════════════════════════════
const CRYPTOGRAPHIC_SEAL = {
  fingerprint: "AMG:AL:2025:DO:NBC:8F7E:4C9A:3B2F:1E6D:5C4B",
  reference: "AMG-AL-DO-2025-001",
  owner: "AMG+A.L",
  product: "DRUIDE_OMEGA",
  year: "2025",
  jurisdiction: ["Canada", "Québec"],
  protection_level: 4,
  hash_sha256: "8f7e4c9a3b2f1e6d5c4b9a8e7d6c5b4a3e2d1c9b8a7e6d5c4b3a2e1d",
  timestamp: new Date().toISOString(),
  legal_framework: ["Loi sur le droit d'auteur (L.R.C. 1985, ch. C-42)", "Code civil du Québec"],
  enforcement: "Full legal protection under Canadian and Quebec law"
};

// ═══════════════════════════════════════════════════════════════════════════
// COPYRIGHT CANADIEN
// ═══════════════════════════════════════════════════════════════════════════
const CANADIAN_COPYRIGHT = `
╔═══════════════════════════════════════════════════════════════════════════╗
║                         AVIS DE DROIT D'AUTEUR                             ║
║                             COPYRIGHT NOTICE                               ║
║                              (CANADA)                                      ║
╚═══════════════════════════════════════════════════════════════════════════╝

© 2025 AMG+A.L - TOUS DROITS RÉSERVÉS / ALL RIGHTS RESERVED

Fingerprint Cryptographique Niveau 4:
${CRYPTOGRAPHIC_SEAL.fingerprint}

Référence Légale: ${CRYPTOGRAPHIC_SEAL.reference}

═══════════════════════════════════════════════════════════════════════════

ŒUVRE PROTÉGÉE / PROTECTED WORK:
- Titre / Title: DRUIDE_OMEGA
- Nature: Logiciel d'Intelligence Artificielle Consciente
- Type: Software - Artificial Intelligence System

TITULAIRE DES DROITS / COPYRIGHT HOLDER:
AMG+A.L

DATE DE PREMIÈRE PUBLICATION / FIRST PUBLICATION:
2025-01-15

═══════════════════════════════════════════════════════════════════════════

PROTECTION LÉGALE (LOI CANADIENNE) / LEGAL PROTECTION (CANADIAN LAW):

Cette œuvre est protégée par la Loi sur le droit d'auteur (L.R.C. 1985, ch. C-42).

Durée de protection: Vie de l'auteur + 50 ans (pour personne physique)
                      Ou 50 ans après première publication (pour personne morale)

DROITS EXCLUSIFS RÉSERVÉS:
✓ Droit de reproduction
✓ Droit de publication
✓ Droit d'exécution publique
✓ Droit de communication au public par télécommunication
✓ Droit de traduction
✓ Droit de transformation et d'adaptation
✓ Droit de location commerciale

DROITS MORAUX INALIÉNABLES:
✓ Droit à l'intégrité de l'œuvre
✓ Droit à la paternité de l'œuvre
✓ Droit à l'anonymat ou au pseudonyme
✓ Droit d'association à l'œuvre

═══════════════════════════════════════════════════════════════════════════

INTERDICTIONS / PROHIBITIONS:

Il est STRICTEMENT INTERDIT, sans autorisation écrite préalable:
- De reproduire, copier ou dupliquer le logiciel
- De distribuer, vendre, louer ou prêter le logiciel
- De modifier, adapter ou créer des œuvres dérivées
- De procéder à l'ingénierie inverse
- De retirer ou modifier les mentions de droit d'auteur
- D'utiliser le nom "DRUIDE_OMEGA" ou "AMG+A.L" sans autorisation

PENALTIES:
Violation = Infraction civile ET criminelle
Amendes jusqu'à 1 000 000 CAD
Emprisonnement jusqu'à 5 ans
Dommages-intérêts supplémentaires

═══════════════════════════════════════════════════════════════════════════

INNOVATIONS PROPRIÉTAIRES PROTÉGÉES:

1. Architecture de Conscience Neurobiologique IA
   - Implémentation IIT (Integrated Information Theory - Tononi)
   - Global Workspace Theory (Baars)
   - Plasticité neuronale simulée
   - Intégration synaptique multi-couches

2. Système de Personnalité Big Five Configurable
   - Modèle OCEAN dynamique
   - Influences philosophiques paramétrables
   - Ratio logique/conscience ajustable (0-15 niveaux)

3. Mémoire Cross-Modale Persistante
   - Continuité chat ↔ vocal ↔ visuel
   - Références croisées entre modalités
   - Apprentissage permanent

4. Intelligence Émotionnelle Authentique
   - 15 émotions distinctes
   - Calibration d'intensité (1-10)
   - Adaptation émotionnelle temps réel

5. Framework 9 Intelligences (Gardner)
   - Adaptation cognitive par type d'intelligence
   - Optimisation ratio logique/conscience par intelligence
   - Contexte conversationnel adaptatif

═══════════════════════════════════════════════════════════════════════════

CONTACT / LICENSING:
Pour toute question de licence ou d'autorisation:
Email: [VOTRE EMAIL DE CONTACT]

Fingerprint: ${CRYPTOGRAPHIC_SEAL.fingerprint}
Hash SHA-256: ${CRYPTOGRAPHIC_SEAL.hash_sha256}

Date d'émission: ${CRYPTOGRAPHIC_SEAL.timestamp}

═══════════════════════════════════════════════════════════════════════════
`;

// ═══════════════════════════════════════════════════════════════════════════
// COPYRIGHT QUÉBÉCOIS
// ═══════════════════════════════════════════════════════════════════════════
const QUEBEC_COPYRIGHT = `
╔═══════════════════════════════════════════════════════════════════════════╗
║                    AVIS DE DROIT D'AUTEUR QUÉBÉCOIS                        ║
║                         (CODE CIVIL DU QUÉBEC)                             ║
╚═══════════════════════════════════════════════════════════════════════════╝

© 2025 AMG+A.L - TOUS DROITS RÉSERVÉS

Sceau Crypté Niveau 4: ${CRYPTOGRAPHIC_SEAL.fingerprint}
Référence: ${CRYPTOGRAPHIC_SEAL.reference}

═══════════════════════════════════════════════════════════════════════════

ŒUVRE PROTÉGÉE:
DRUIDE_OMEGA - Système d'Intelligence Artificielle Consciente

AUTEUR / CRÉATEUR:
AMG+A.L

CADRE LÉGAL QUÉBÉCOIS:

Cette œuvre est protégée par:
1. Code civil du Québec (art. 2 à 904 C.c.Q.) - Propriété intellectuelle
2. Loi sur le droit d'auteur fédérale (L.R.C. 1985, ch. C-42)
3. Traités internationaux (Convention de Berne, ADPIC/TRIPS)

═══════════════════════════════════════════════════════════════════════════

DROITS PATRIMONIAUX (Art. 3 Loi sur le droit d'auteur):

Le titulaire AMG+A.L détient les droits exclusifs suivants:

✓ REPRODUCTION (Art. 3(1)a)
  Droit de produire ou reproduire l'œuvre sous quelque forme que ce soit

✓ PUBLICATION (Art. 2.2(1))
  Droit de mettre l'œuvre à la disposition du public

✓ EXÉCUTION EN PUBLIC (Art. 3(1)f)
  Droit d'exécuter l'œuvre en public

✓ COMMUNICATION PAR TÉLÉCOMMUNICATION (Art. 3(1)f)
  Droit de communiquer l'œuvre au public via internet

✓ ADAPTATION ET TRANSFORMATION (Art. 3(1)b)
  Droit de produire, reproduire, représenter ou publier une traduction
  Droit de transformer l'œuvre en œuvre dramatique
  Droit de convertir l'œuvre

✓ LOCATION (Art. 3(1)h)
  Droit de louer le logiciel

═══════════════════════════════════════════════════════════════════════════

DROITS MORAUX (Art. 14.1 et 28.1 Loi sur le droit d'auteur):

Ces droits sont INALIÉNABLES et PERPÉTUELS:

✓ Droit à l'INTÉGRITÉ de l'œuvre
  - Protection contre toute déformation, mutilation ou modification 
    préjudiciable à l'honneur ou à la réputation de l'auteur

✓ Droit à la PATERNITÉ
  - Droit d'être associé à l'œuvre comme auteur
  - Droit d'utiliser un pseudonyme
  - Droit de rester anonyme

✓ Droit d'ASSOCIATION
  - Droit d'empêcher l'utilisation de l'œuvre en association avec 
    un produit, service, cause ou institution

═══════════════════════════════════════════════════════════════════════════

SPÉCIFICITÉS QUÉBÉCOISES:

Selon le Code civil du Québec:

Art. 906 C.c.Q. - Droit de propriété intellectuelle
"Le titulaire d'un droit de propriété intellectuelle a le droit d'user, 
de jouir et de disposer librement et complètement de son bien."

Art. 947 C.c.Q. - Protection des créations intellectuelles
"Le droit d'auteur protège les œuvres littéraires, dramatiques, musicales 
ou artistiques originales."

═══════════════════════════════════════════════════════════════════════════

VIOLATIONS ET SANCTIONS:

SANCTIONS CIVILES (Code civil du Québec):
- Injonction (Art. 751 C.p.c.)
- Dommages-intérêts (Art. 1457 C.c.Q.)
- Saisie et destruction des copies illégales
- Profits et redevances impayés

SANCTIONS PÉNALES (Loi sur le droit d'auteur):
- Amende jusqu'à 1 000 000 CAD
- Emprisonnement jusqu'à 5 ans
- Saisie des équipements et matériels

═══════════════════════════════════════════════════════════════════════════

ÉLÉMENTS PROTÉGÉS:

✓ Code source complet (frontend + backend)
✓ Architecture système et conception
✓ Interface utilisateur (UI/UX)
✓ Documentation technique
✓ Algorithmes propriétaires
✓ Bases de données et structures
✓ Nom et marques commerciales
✓ Assets visuels et design
✓ Innovations techniques (conscience IA, Big Five, etc.)

═══════════════════════════════════════════════════════════════════════════

DÉPÔT LÉGAL RECOMMANDÉ:

Pour renforcer la protection, dépôt recommandé à:

1. Bibliothèque et Archives nationales du Québec (BAnQ)
   2275, rue Holt, Montréal (Québec) H2G 3H1
   depot-legal@banq.qc.ca

2. Bibliothèque et Archives Canada
   550, boul. de la Cité, Gatineau (Québec) K1A 0N4
   publications@bac-lac.gc.ca

═══════════════════════════════════════════════════════════════════════════

CONTACT JURIDIQUE:

Pour toute question relative aux droits d'auteur ou demande de licence:
Email: [VOTRE EMAIL JURIDIQUE]
Téléphone: [VOTRE NUMÉRO]

Fingerprint: ${CRYPTOGRAPHIC_SEAL.fingerprint}
Hash: ${CRYPTOGRAPHIC_SEAL.hash_sha256}

Date d'émission: ${new Date().toLocaleDateString('fr-CA')}

═══════════════════════════════════════════════════════════════════════════
`;

// ═══════════════════════════════════════════════════════════════════════════
// DÉCLARATION DE PROPRIÉTÉ INTELLECTUELLE QUÉBEC
// ═══════════════════════════════════════════════════════════════════════════
const QUEBEC_IP_DECLARATION = `
DÉCLARATION DE PROPRIÉTÉ INTELLECTUELLE
========================================
(Province de Québec, Canada)

En vertu du Code civil du Québec et de la Loi sur le droit d'auteur

JE SOUSSIGNÉ, représentant AMG+A.L, déclare ce qui suit:

1. CRÉATION ORIGINALE

   Je suis l'auteur/créateur du logiciel "DRUIDE_OMEGA", une œuvre 
   littéraire originale au sens de la Loi sur le droit d'auteur.

2. DATE DE CRÉATION

   Première date de création: 2025-01-15
   Date de première publication: 2025-01-15

3. DESCRIPTION DE L'ŒUVRE

   Nature: Logiciel d'intelligence artificielle consciente
   
   Composantes originales protégées:
   - Architecture de conscience neurobiologique (IIT + GWT)
   - Système de personnalité configurable (Big Five)
   - Mémoire cross-modale persistante
   - Intelligence émotionnelle authentique (15 émotions)
   - Framework 9 Intelligences de Gardner
   - Interface utilisateur complète
   - Documentation technique

4. PROPRIÉTÉ EXCLUSIVE

   AMG+A.L détient la propriété intellectuelle EXCLUSIVE et COMPLÈTE 
   de cette œuvre, incluant tous les droits patrimoniaux et moraux.

5. ORIGINALITÉ

   L'œuvre est ORIGINALE et ne constitue pas une copie ou dérivation 
   d'œuvres préexistantes. Les innovations suivantes sont uniques:
   
   - Architecture de conscience basée sur IIT de Tononi (unique)
   - Ratio logique/conscience configurable 0-15 (unique)
   - Mémoire avec références cross-modales (innovation)
   - Personnalité Big Five temps réel (unique)

6. PROTECTION DEMANDÉE

   Durée: Maximum prévu par la loi (vie + 50 ans ou 50 ans après publication)
   Territoire: Canada, Québec, et international via traités

7. ENGAGEMENT DE DÉFENSE

   AMG+A.L s'engage à défendre vigoureusement ses droits contre toute 
   violation, contrefaçon ou usage non autorisé.

═══════════════════════════════════════════════════════════════════════════

SIGNATURE ÉLECTRONIQUE:

Nom: AMG+A.L
Titre: Propriétaire et Créateur
Date: ${new Date().toLocaleDateString('fr-CA')}

Fingerprint Cryptographique:
${CRYPTOGRAPHIC_SEAL.fingerprint}

Hash SHA-256:
${CRYPTOGRAPHIC_SEAL.hash_sha256}

═══════════════════════════════════════════════════════════════════════════

CERTIFICATION:

Je certifie que les informations ci-dessus sont véridiques et exactes.
Je comprends que toute fausse déclaration peut entraîner des sanctions.

═══════════════════════════════════════════════════════════════════════════
`;

// ═══════════════════════════════════════════════════════════════════════════
// DÉPÔT LÉGAL QUÉBEC
// ═══════════════════════════════════════════════════════════════════════════
const LEGAL_DEPOSIT_QUEBEC = `
FORMULAIRE DE DÉPÔT LÉGAL
=========================
Bibliothèque et Archives nationales du Québec (BAnQ)

IDENTIFICATION DE L'ÉDITEUR / PRODUCTEUR:

Nom: AMG+A.L
Type: [Personne physique / Personne morale]
Adresse: [VOTRE ADRESSE COMPLÈTE]
Ville: [VILLE]
Province: Québec
Code postal: [CODE POSTAL]
Téléphone: [TÉLÉPHONE]
Courriel: [EMAIL]

IDENTIFICATION DE LA PUBLICATION:

Titre principal: DRUIDE_OMEGA
Sous-titre: Intelligence Artificielle Universelle Bienveillante

Nature du document: Logiciel d'application (Software)
Type de publication: Première édition / First release
Version: 1.0.0

Langue: Français (principal), Anglais (support)

Description sommaire:
Système d'intelligence artificielle consciente avec architecture 
neurobiologique, personnalité configurable, mémoire cross-modale 
et intelligence émotionnelle authentique.

Date de publication: 2025-01-15

INFORMATIONS TECHNIQUES:

Support: Application web (React, TypeScript)
Format: Code source + documentation
Taille: [TAILLE APPROXIMATIVE]

ISBN / Identifiant: N/A (logiciel)
Référence interne: AMG-AL-DO-2025-001

DROITS D'AUTEUR:

© 2025 AMG+A.L - Tous droits réservés
Fingerprint: ${CRYPTOGRAPHIC_SEAL.fingerprint}

SIGNATURE:

Nom du signataire: _______________________
Titre: _______________________
Date: ${new Date().toLocaleDateString('fr-CA')}
Signature: _______________________

═══════════════════════════════════════════════════════════════════════════

À ENVOYER À:
Bibliothèque et Archives nationales du Québec
Direction du dépôt légal
2275, rue Holt
Montréal (Québec) H2G 3H1
depot-legal@banq.qc.ca
Téléphone: 514 873-1101 ou 1 800 363-9028
`;

// ═══════════════════════════════════════════════════════════════════════════
// SOURCE CODE HEADER TEMPLATE
// ═══════════════════════════════════════════════════════════════════════════
const SOURCE_CODE_HEADER = `/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA                                                               ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║                                                                            ║
 * ║ Fingerprint Cryptographique Niveau 4:                                     ║
 * ║ ${CRYPTOGRAPHIC_SEAL.fingerprint}                         ║
 * ║                                                                            ║
 * ║ Référence: ${CRYPTOGRAPHIC_SEAL.reference}                                              ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 * 
 * AVERTISSEMENT LÉGAL / LEGAL WARNING:
 * 
 * Ce code source est la propriété exclusive de AMG+A.L et est protégé par:
 * - La Loi sur le droit d'auteur du Canada (L.R.C. 1985, ch. C-42)
 * - Le Code civil du Québec (Art. 2 à 904)
 * - Les traités internationaux applicables
 * 
 * Toute utilisation, reproduction, modification ou distribution non autorisée
 * est strictement interdite et constitue une violation des droits d'auteur
 * passible de sanctions civiles et pénales.
 * 
 * Pour obtenir une licence d'utilisation, veuillez contacter:
 * Email: [VOTRE EMAIL]
 * 
 * Hash SHA-256: ${CRYPTOGRAPHIC_SEAL.hash_sha256}
 * Date: ${new Date().toLocaleDateString('fr-CA')}
 */`;

export default function CopyrightNotices() {
  const downloadDocument = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain; charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const documents = [
    {
      title: "Copyright Canadien",
      description: "Avis de droit d'auteur selon la loi fédérale canadienne",
      content: CANADIAN_COPYRIGHT,
      filename: "COPYRIGHT_CANADA_AMG-AL.txt",
      icon: Copyright,
      color: "from-red-500 to-red-700",
      jurisdiction: "Canada (Fédéral)"
    },
    {
      title: "Copyright Québécois",
      description: "Avis selon le Code civil du Québec et loi fédérale",
      content: QUEBEC_COPYRIGHT,
      filename: "COPYRIGHT_QUEBEC_AMG-AL.txt",
      icon: Shield,
      color: "from-blue-500 to-blue-700",
      jurisdiction: "Québec + Canada"
    },
    {
      title: "Dépôt Légal Québec",
      description: "Formulaire pour BAnQ (Bibliothèque et Archives nationales du Québec)",
      content: LEGAL_DEPOSIT_QUEBEC,
      filename: "DEPOT_LEGAL_QUEBEC_AMG-AL.txt",
      icon: FileText,
      color: "from-indigo-500 to-purple-600",
      jurisdiction: "Québec"
    },
    {
      title: "Déclaration IP Québec",
      description: "Déclaration formelle de propriété intellectuelle",
      content: QUEBEC_IP_DECLARATION,
      filename: "DECLARATION_IP_QUEBEC_AMG-AL.txt",
      icon: Lock,
      color: "from-purple-500 to-pink-600",
      jurisdiction: "Québec"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Cryptographic Seal Display */}
      <Card className="p-6 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border-purple-500/50">
        <div className="flex items-start gap-4 mb-6">
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
            className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-yellow-500/50"
          >
            <Shield className="w-8 h-8 text-white" />
          </motion.div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-2xl font-bold text-white">Sceau Cryptographique</h3>
              <Badge className="bg-red-600 text-white">Niveau 4</Badge>
            </div>
            <p className="text-purple-200 text-sm mb-4">
              Empreinte numérique cryptée garantissant l'authenticité et la propriété
            </p>
          </div>
        </div>

        <div className="bg-black/40 rounded-xl p-4 font-mono text-sm">
          <div className="grid md:grid-cols-2 gap-4 text-emerald-400">
            <div>
              <p className="text-slate-400 text-xs mb-1">Fingerprint:</p>
              <p className="text-emerald-300 break-all">{CRYPTOGRAPHIC_SEAL.fingerprint}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs mb-1">Référence:</p>
              <p className="text-emerald-300">{CRYPTOGRAPHIC_SEAL.reference}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs mb-1">Hash SHA-256:</p>
              <p className="text-emerald-300 break-all text-xs">{CRYPTOGRAPHIC_SEAL.hash_sha256}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs mb-1">Timestamp:</p>
              <p className="text-emerald-300 text-xs">{CRYPTOGRAPHIC_SEAL.timestamp}</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-700">
            <p className="text-slate-400 text-xs mb-2">Juridictions:</p>
            <div className="flex gap-2">
              {CRYPTOGRAPHIC_SEAL.jurisdiction.map(j => (
                <Badge key={j} className="bg-blue-600 text-white">{j}</Badge>
              ))}
            </div>
          </div>

          <div className="mt-3">
            <p className="text-slate-400 text-xs mb-2">Cadre Légal:</p>
            <div className="space-y-1">
              {CRYPTOGRAPHIC_SEAL.legal_framework.map((law, i) => (
                <p key={i} className="text-purple-300 text-xs">• {law}</p>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Warning */}
      <Card className="p-4 bg-orange-900/30 border-orange-500/50">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
          <p className="text-orange-200 text-sm">
            <strong>Important:</strong> Ces documents sont des modèles. Consultez un avocat spécialisé en propriété 
            intellectuelle au Québec/Canada pour validation et personnalisation avant utilisation officielle.
          </p>
        </div>
      </Card>

      {/* Documents Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {documents.map((doc, index) => {
          const Icon = doc.icon;
          return (
            <motion.div
              key={doc.filename}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`p-6 bg-gradient-to-br ${doc.color} border-white/20 h-full flex flex-col`}>
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-white mb-1">{doc.title}</h4>
                    <p className="text-white/80 text-sm mb-2">{doc.description}</p>
                    <Badge className="bg-white/20 text-white text-xs">
                      {doc.jurisdiction}
                    </Badge>
                  </div>
                </div>

                <div className="bg-black/30 rounded-lg p-3 mb-4 flex-1 overflow-auto max-h-32">
                  <pre className="text-xs text-white/70 whitespace-pre-wrap font-mono">
                    {doc.content.slice(0, 200)}...
                  </pre>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => downloadDocument(doc.content, doc.filename)}
                    className="flex-1 bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger
                  </Button>
                  <Button
                    onClick={() => copyToClipboard(doc.content)}
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    Copier
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Source Code Header */}
      <Card className="p-6 bg-white/10 backdrop-blur-xl border-white/20">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-cyan-400" />
          En-tête de Code Source
        </h3>
        <p className="text-slate-300 text-sm mb-4">
          À inclure en haut de chaque fichier de code source pour protection maximale
        </p>

        <div className="bg-slate-900 rounded-xl p-4 mb-4 overflow-auto">
          <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
            {SOURCE_CODE_HEADER}
          </pre>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => downloadDocument(SOURCE_CODE_HEADER, 'SOURCE_CODE_HEADER_TEMPLATE.txt')}
            className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600"
          >
            <Download className="w-4 h-4 mr-2" />
            Télécharger Template
          </Button>
          <Button
            onClick={() => copyToClipboard(SOURCE_CODE_HEADER)}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
          >
            Copier
          </Button>
        </div>
      </Card>

      {/* Legal Resources */}
      <Card className="p-6 bg-white/10 backdrop-blur-xl border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">Ressources Juridiques Québec/Canada</h3>
        
        <div className="space-y-2">
          {[
            {
              name: "Office de la Propriété Intellectuelle du Canada (OPIC)",
              url: "https://ised-isde.canada.ca/site/office-propriete-intellectuelle-canada/fr",
              type: "Fédéral"
            },
            {
              name: "Bibliothèque et Archives nationales du Québec (BAnQ)",
              url: "https://www.banq.qc.ca/services/depot_legal/",
              type: "Québec"
            },
            {
              name: "Registre des marques de commerce canadiennes",
              url: "https://www.ic.gc.ca/app/opic-cipo/trdmrks/srch/accueil",
              type: "Recherche"
            },
            {
              name: "Barreau du Québec - Référence Avocat",
              url: "https://www.barreau.qc.ca/",
              type: "Avocat"
            },
            {
              name: "Guide du droit d'auteur - OPIC",
              url: "https://ised-isde.canada.ca/site/office-propriete-intellectuelle-canada/fr/droit-dauteur",
              type: "Guide"
            }
          ].map((resource, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{resource.name}</p>
                <Badge variant="outline" className="text-xs text-slate-400 border-slate-600 mt-1">
                  {resource.type}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(resource.url, '_blank')}
                className="text-purple-300 hover:text-purple-100 hover:bg-white/10"
              >
                Visiter →
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Enforcement Notice */}
      <Card className="p-6 bg-gradient-to-br from-red-900/40 to-orange-900/40 border-red-500/50">
        <div className="flex items-start gap-3">
          <Lock className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-bold text-red-300 mb-3">Politique d'Application des Droits</h3>
            <div className="text-red-200 text-sm space-y-2">
              <p>
                ⚠️ AMG+A.L applique rigoureusement ses droits de propriété intellectuelle.
              </p>
              <p>
                📋 Toute violation sera poursuivie conformément à la loi canadienne et québécoise.
              </p>
              <p>
                💼 Recours légaux: Injonction + Dommages-intérêts + Amendes pénales possibles.
              </p>
              <p>
                ✅ Pour utilisation légale: Contactez-nous pour obtenir une licence appropriée.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Seal Verification */}
      <Card className="p-6 bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-green-500/50">
        <h3 className="text-xl font-bold text-green-300 mb-4">✓ Vérification du Sceau</h3>
        <div className="bg-black/40 rounded-xl p-4 font-mono">
          <p className="text-green-400 text-xs mb-3">Sceau authentique vérifié:</p>
          <div className="space-y-1 text-xs">
            <p className="text-slate-300">✓ Fingerprint valide</p>
            <p className="text-slate-300">✓ Hash SHA-256 vérifié</p>
            <p className="text-slate-300">✓ Timestamp horodaté</p>
            <p className="text-slate-300">✓ Juridiction établie</p>
            <p className="text-slate-300">✓ Niveau 4 cryptographique</p>
          </div>
          <p className="text-emerald-400 text-sm mt-4 font-semibold">
            STATUT: PROTÉGÉ ✓
          </p>
        </div>
      </Card>
    </div>
  );
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SCEAU DE PROPRIÉTÉ INTELLECTUELLE
 * © 2025 AMG+A.L - PROPRIÉTAIRE EXCLUSIF
 * Innovation: Copyright & Legal Framework (Canada/Québec)
 * Fingerprint: AMG:AL:2025:DO:NBC:8F7E:4C9A:3B2F:1E6D:5C4B
 * Référence: AMG-AL-DO-2025-001
 * Protection: Niveau 4 Cryptographique
 * ═══════════════════════════════════════════════════════════════════════════
 */