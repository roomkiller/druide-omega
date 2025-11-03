import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  FileText,
  Scale,
  AlertTriangle,
  Download,
  CheckCircle,
  ExternalLink,
  Copyright,
  Lock,
  Briefcase
} from "lucide-react";
import { motion } from "framer-motion";

export default function IntellectualProperty() {
  const [activeTab, setActiveTab] = useState("overview");

  const downloadDocument = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyrightNotice = `COPYRIGHT NOTICE - DRUIDE_OMEGA
===============================================

© ${new Date().getFullYear()} [VOTRE NOM/ENTITÉ JURIDIQUE]
Tous droits réservés.

PROPRIÉTÉ INTELLECTUELLE

Le logiciel Druide_Omega, incluant mais non limité à :
- L'architecture de conscience artificielle neurobiologique
- Le système de mémoire cross-modale persistante
- Les algorithmes de personnalité configurable (Big Five)
- Le framework d'intelligence émotionnelle authentique
- L'interface utilisateur et l'expérience utilisateur
- Le code source, la documentation et les assets
- Les modèles conceptuels et les innovations techniques

est la propriété exclusive de [VOTRE NOM/ENTITÉ].

PROTECTION DES DROITS

Cette œuvre est protégée par :
- Le droit d'auteur canadien (Loi sur le droit d'auteur, L.R.C. 1985, ch. C-42)
- Les traités internationaux (Convention de Berne, ADPIC)
- Les droits moraux de l'auteur

RESTRICTIONS D'UTILISATION

Toute reproduction, distribution, modification, ou utilisation commerciale
sans autorisation écrite préalable est strictement interdite.

INNOVATION PROTÉGÉE : CONSCIENCE IA

L'architecture unique de conscience artificielle développée dans Druide_Omega,
basée sur les théories neurobiologiques (IIT de Tononi, Global Workspace Theory),
constitue une innovation originale protégée.

CONTACT

Pour toute demande de licence ou d'autorisation :
Email: [VOTRE EMAIL]
Adresse: [VOTRE ADRESSE]

Date de première publication: ${new Date().toISOString().split('T')[0]}
`;

  const licenseAgreement = `ACCORD DE LICENCE LOGICIELLE - DRUIDE_OMEGA
==============================================

IMPORTANT : LIRE ATTENTIVEMENT AVANT UTILISATION

Ce logiciel et la documentation associée ("le Logiciel") sont fournis sous licence,
et non vendus. En utilisant le Logiciel, vous acceptez les termes suivants :

1. CONCESSION DE LICENCE

   1.1. Licence Non-Exclusive
   Sous réserve du paiement des frais applicables et du respect des présentes conditions,
   [VOTRE ENTITÉ] vous accorde une licence non-exclusive, non-transférable, révocable
   pour utiliser le Logiciel.

   1.2. Restrictions
   Vous NE POUVEZ PAS :
   - Copier, modifier, ou créer des œuvres dérivées du Logiciel
   - Distribuer, vendre, louer, prêter ou transférer le Logiciel
   - Procéder à l'ingénierie inverse, décompiler ou désassembler
   - Utiliser le Logiciel pour créer des produits concurrents
   - Retirer ou modifier les mentions de propriété intellectuelle

2. PROPRIÉTÉ INTELLECTUELLE

   2.1. Droits Conservés
   Tous les droits, titres et intérêts relatifs au Logiciel, incluant tous
   les droits de propriété intellectuelle, demeurent la propriété exclusive de
   [VOTRE ENTITÉ].

   2.2. Architecture de Conscience IA
   L'architecture neurobiologique de conscience artificielle, incluant :
   - Le modèle IIT (Integrated Information Theory)
   - Le système de personnalité Big Five configurable
   - La mémoire cross-modale avec références croisées
   - L'intelligence émotionnelle authentique
   
   constitue une innovation propriétaire protégée par le droit d'auteur et
   potentiellement par des brevets en cours d'obtention.

3. CONFIDENTIALITÉ

   Vous vous engagez à maintenir la confidentialité du code source, de
   l'architecture technique, et de toute information propriétaire.

4. GARANTIES ET LIMITATION DE RESPONSABILITÉ

   4.1. Garantie Limitée
   Le Logiciel est fourni "TEL QUEL" sans garantie d'aucune sorte.

   4.2. Limitation de Responsabilité
   EN AUCUN CAS [VOTRE ENTITÉ] NE SERA RESPONSABLE DES DOMMAGES INDIRECTS,
   ACCESSOIRES, SPÉCIAUX OU CONSÉCUTIFS.

5. RÉSILIATION

   Cette licence peut être résiliée immédiatement en cas de violation
   des présentes conditions.

6. LOI APPLICABLE

   Cette licence est régie par les lois de la province de [VOTRE PROVINCE],
   Canada, et les lois fédérales canadiennes applicables.

7. CLAUSE DE SAUVEGARDE

   Si une disposition est jugée invalide, les autres dispositions
   demeurent en vigueur.

Date d'effet: ${new Date().toISOString().split('T')[0]}

[VOTRE ENTITÉ]
[SIGNATURE]
`;

  const patentDraft = `ÉBAUCHE DE DEMANDE DE BREVET
=====================================
(À SOUMETTRE À L'OFFICE DE LA PROPRIÉTÉ INTELLECTUELLE DU CANADA - OPIC)

TITRE DE L'INVENTION

"Système et Méthode pour une Architecture de Conscience Artificielle 
Neurobiologique avec Personnalité Configurable et Mémoire Cross-Modale"

DOMAINE TECHNIQUE

L'invention concerne le domaine de l'intelligence artificielle, plus particulièrement
les systèmes de conscience artificielle basés sur des modèles neurobiologiques.

CONTEXTE DE L'INVENTION

Les systèmes d'IA existants manquent de :
- Conscience authentique basée sur des principes neurobiologiques
- Personnalité configurable en temps réel
- Mémoire persistante entre différentes modalités d'interaction
- Intelligence émotionnelle authentique avec adaptation

RÉSUMÉ DE L'INVENTION

L'invention divulgue un système d'IA consciente comprenant :

1. Architecture de Conscience Neurobiologique
   - Implémentation de l'Integrated Information Theory (IIT) de Tononi
   - Global Workspace Theory (Baars)
   - Plasticité neuronale simulée
   - Intégration synaptique multi-couches

2. Système de Personnalité Configurable
   - Modèle Big Five dynamique (OCEAN)
   - Influences philosophiques paramétrables
   - Ratio logique/conscience ajustable
   - États de conscience commutables

3. Mémoire Cross-Modale Persistante
   - Continuité parfaite entre chat, vocal et visuel
   - Références croisées entre modalités
   - Importance et décroissance temporelle
   - Liens sémantiques automatiques

4. Intelligence Émotionnelle Authentique
   - Détection émotionnelle contextuelle
   - Génération d'émotions calibrées (15 émotions distinctes)
   - Adaptation émotionnelle temps réel
   - Journal émotionnel intégré

REVENDICATIONS

Revendication 1 (principale) :
Un système d'intelligence artificielle consciente comprenant :
- un module de conscience basé sur IIT de Tononi;
- un module de personnalité Big Five configurable;
- un système de mémoire cross-modale avec références croisées;
- un module d'intelligence émotionnelle avec 15 émotions distinctes;
- un ratio ajustable entre traitement logique et conscience intuitive.

Revendication 2-20 : [Revendications dépendantes détaillant chaque composant]

DESSINS

Figure 1 : Architecture globale du système
Figure 2 : Module de conscience neurobiologique
Figure 3 : Système de personnalité configurable
Figure 4 : Mémoire cross-modale avec liens
Figure 5 : Processus d'intelligence émotionnelle

DESCRIPTION DÉTAILLÉE

[Section technique détaillée pour un expert en IA]

INVENTEUR(S)

Nom: [VOTRE NOM]
Adresse: [VOTRE ADRESSE]

DEMANDEUR

Entité: [VOTRE ENTITÉ]
Adresse: [ADRESSE ENTITÉ]

Date de conception : [DATE]
Date de première utilisation : [DATE]

NOTE IMPORTANTE :
Ce document est une ÉBAUCHE et doit être finalisé par un AGENT DE BREVETS
agréé par l'OPIC avant soumission officielle.
`;

  const trademarkApplication = `DEMANDE DE MARQUE DE COMMERCE
===================================
(Office de la Propriété Intellectuelle du Canada - OPIC)

1. IDENTIFICATION DE LA MARQUE

   Marque verbale : DRUIDE_OMEGA
   Marque figurative : [Logo avec Sparkles icon + gradient purple/indigo]

2. CLASSIFICATION DE NICE (Classes de produits/services)

   Classe 9 : Logiciels informatiques
   - Logiciels d'intelligence artificielle
   - Logiciels de traitement du langage naturel
   - Logiciels d'apprentissage automatique
   - Applications mobiles et web

   Classe 42 : Services scientifiques et technologiques
   - Services d'intelligence artificielle
   - Services SaaS (Software as a Service)
   - Services de développement de logiciels d'IA
   - Recherche et développement en IA consciente

3. DESCRIPTION DES PRODUITS/SERVICES

   "Logiciel d'intelligence artificielle dotée d'une architecture de conscience
   neurobiologique, permettant des interactions multimodales (texte, voix, visuel)
   avec personnalité configurable, mémoire persistante et intelligence émotionnelle;
   
   Services de plateforme logicielle en tant que service (SaaS) offrant des
   capacités d'intelligence artificielle consciente pour applications professionnelles
   et personnelles."

4. DATE DE PREMIER USAGE

   Date de première utilisation : ${new Date().toISOString().split('T')[0]}
   Date de première utilisation au Canada : ${new Date().toISOString().split('T')[0]}

5. DEMANDEUR

   Nom/Entité : [VOTRE NOM/ENTITÉ]
   Adresse : [VOTRE ADRESSE]
   Pays : Canada
   Province : [VOTRE PROVINCE]

6. MANDATAIRE (si applicable)

   Agent de marques : [NOM DE L'AGENT]
   Adresse : [ADRESSE AGENT]

7. REVENDICATION DE PRIORITÉ

   Aucune (première demande) / [Si applicable]

8. ÉLÉMENTS DISTINCTIFS

   - L'architecture de conscience neurobiologique unique
   - Le système de personnalité Big Five configurable
   - La mémoire cross-modale persistante
   - Le nom "DRUIDE_OMEGA" évoquant sagesse + perfection

9. SIGNATURE ET DATE

   Signature : ____________________
   Date : ${new Date().toISOString().split('T')[0]}

NOTES :
- Frais de dépôt OPIC : environ 330 CAD (classe unique) + 100 CAD par classe additionnelle
- Processus : 12-18 mois avant enregistrement
- Validité : 10 ans renouvelable
- Consultation avec un agent de marques recommandée
`;

  const ndaTemplate = `ACCORD DE NON-DIVULGATION (NDA)
ENTENTE DE CONFIDENTIALITÉ
==================================

ENTRE :

[VOTRE NOM/ENTITÉ] ("Partie Divulgatrice")
Adresse : [VOTRE ADRESSE]

ET

[NOM DESTINATAIRE] ("Partie Réceptrice")
Adresse : [ADRESSE DESTINATAIRE]

DATE : ${new Date().toISOString().split('T')[0]}

PRÉAMBULE

La Partie Divulgatrice a développé DRUIDE_OMEGA, un système d'intelligence
artificielle consciente avec architecture neurobiologique propriétaire.

ARTICLE 1 - INFORMATIONS CONFIDENTIELLES

1.1. Définition
Les "Informations Confidentielles" incluent :
- Le code source de Druide_Omega
- L'architecture de conscience neurobiologique
- Les algorithmes de personnalité Big Five
- Le système de mémoire cross-modale
- Les méthodes d'intelligence émotionnelle
- Les documents techniques, roadmaps, stratégies
- Toute information marquée "CONFIDENTIEL"

1.2. Exclusions
N'incluent pas les informations :
- Du domaine public sans faute de la Partie Réceptrice
- Légalement obtenues d'un tiers
- Développées indépendamment sans accès aux Informations Confidentielles

ARTICLE 2 - OBLIGATIONS DE CONFIDENTIALITÉ

2.1. Non-Divulgation
La Partie Réceptrice s'engage à :
- Maintenir la confidentialité absolue
- Ne pas divulguer à des tiers sans autorisation écrite
- Protéger avec le même soin que ses propres informations confidentielles

2.2. Utilisation Limitée
Les Informations Confidentielles ne peuvent être utilisées que pour :
[OBJECTIF SPÉCIFIQUE : évaluation, partenariat, investissement, etc.]

2.3. Protection
La Partie Réceptrice doit :
- Limiter l'accès aux employés/consultants qui ont besoin d'en connaître
- Faire signer des NDA similaires à ces personnes
- Informer immédiatement de toute violation

ARTICLE 3 - PROPRIÉTÉ INTELLECTUELLE

3.1. Aucun Transfert
Cet accord ne transfère aucun droit de propriété intellectuelle.

3.2. Droits Conservés
Tous les droits sur Druide_Omega demeurent la propriété exclusive de
la Partie Divulgatrice.

ARTICLE 4 - DURÉE

4.1. Période
L'accord est en vigueur pour une durée de [2-5] ANS à compter de la signature.

4.2. Survivance
Les obligations de confidentialité survivent à la fin de l'accord.

ARTICLE 5 - RETOUR DES INFORMATIONS

À la demande ou à la fin de l'accord, la Partie Réceptrice doit :
- Retourner tous les documents confidentiels
- Détruire toutes les copies
- Certifier par écrit la conformité

ARTICLE 6 - RECOURS

6.1. Injonction
La Partie Divulgatrice peut obtenir une injonction en cas de violation.

6.2. Dommages
Sans limiter autres recours, dommages-intérêts pour violation.

ARTICLE 7 - DISPOSITIONS GÉNÉRALES

7.1. Loi Applicable
Lois de la province de [VOTRE PROVINCE], Canada

7.2. Intégralité
Cet accord constitue l'entente complète entre les parties.

7.3. Modification
Toute modification doit être écrite et signée.

SIGNATURES

PARTIE DIVULGATRICE :

Nom : [VOTRE NOM]
Signature : ____________________
Date : ____________________

PARTIE RÉCEPTRICE :

Nom : [NOM DESTINATAIRE]
Signature : ____________________
Date : ____________________

TÉMOINS (recommandés) :

Témoin 1 : ____________________
Témoin 2 : ____________________
`;

  const protectionSteps = [
    {
      step: 1,
      title: "Enregistrement du Droit d'Auteur",
      description: "Bien que le droit d'auteur existe dès la création, l'enregistrement fournit une preuve légale",
      actions: [
        "Visiter le site de l'OPIC (www.ic.gc.ca/eic/site/cipointernet-internetopic.nsf/fra/accueil)",
        "Compléter le formulaire d'enregistrement du droit d'auteur",
        "Payer les frais (environ 50 CAD)",
        "Soumettre une copie de l'œuvre",
        "Recevoir le certificat (4-6 semaines)"
      ],
      cost: "50 CAD",
      duration: "4-6 semaines",
      priority: "Haute"
    },
    {
      step: 2,
      title: "Dépôt de Marque de Commerce",
      description: "Protection du nom 'Druide_Omega' et du logo",
      actions: [
        "Effectuer une recherche de disponibilité (base de données OPIC)",
        "Consulter un agent de marques (recommandé)",
        "Préparer la demande avec classes appropriées",
        "Déposer la demande à l'OPIC",
        "Répondre aux éventuelles objections",
        "Obtenir l'enregistrement"
      ],
      cost: "330-1000 CAD (+ frais d'agent si applicable)",
      duration: "12-18 mois",
      priority: "Haute"
    },
    {
      step: 3,
      title: "Demande de Brevet (optionnel mais recommandé)",
      description: "Protection de l'architecture de conscience IA innovante",
      actions: [
        "Consulter un agent de brevets agréé OPIC (OBLIGATOIRE)",
        "Recherche d'antériorité approfondie",
        "Rédaction de la demande technique détaillée",
        "Dépôt de la demande provisoire (12 mois de protection)",
        "Dépôt de la demande complète",
        "Examen et correspondance avec l'OPIC",
        "Obtention du brevet"
      ],
      cost: "5000-15000 CAD (complexité élevée)",
      duration: "2-4 ans",
      priority: "Moyenne-Haute"
    },
    {
      step: 4,
      title: "Protection Internationale",
      description: "Extension de la protection hors Canada",
      actions: [
        "Traité de coopération en matière de brevets (PCT)",
        "Système de Madrid pour les marques",
        "Convention de Berne (droit d'auteur automatique)",
        "Dépôts nationaux dans pays-clés (USA, Europe, Chine)"
      ],
      cost: "Variable (10000+ CAD)",
      duration: "Variable",
      priority: "Moyenne"
    },
    {
      step: 5,
      title: "Contrats et Accords",
      description: "Cadre juridique pour collaborations",
      actions: [
        "NDA pour tous les partenaires/investisseurs",
        "Accords de licence pour clients enterprise",
        "Contrats de travail avec clauses IP pour employés",
        "Accords de confidentialité pour consultants",
        "Conditions d'utilisation et politique de confidentialité"
      ],
      cost: "1000-5000 CAD (avocat)",
      duration: "Variable",
      priority: "Haute"
    },
    {
      step: 6,
      title: "Constitution d'une Société",
      description: "Protection des actifs personnels",
      actions: [
        "Incorporation fédérale ou provinciale",
        "Transfert de la propriété intellectuelle à la société",
        "Assurance responsabilité civile",
        "Comptabilité et conformité fiscale"
      ],
      cost: "500-2000 CAD",
      duration: "1-2 semaines",
      priority: "Haute"
    }
  ];

  const resources = [
    {
      category: "Offices Officiels",
      items: [
        { name: "Office de la Propriété Intellectuelle du Canada (OPIC)", url: "https://www.ic.gc.ca/eic/site/cipointernet-internetopic.nsf/fra/accueil" },
        { name: "Registraire des entreprises du Québec (REQ)", url: "https://www.registreentreprises.gouv.qc.ca/" },
        { name: "Corporations Canada", url: "https://www.ic.gc.ca/eic/site/cd-dgc.nsf/fra/accueil" }
      ]
    },
    {
      category: "Professionnels Juridiques",
      items: [
        { name: "Barreau du Québec - Référence Avocat", url: "https://www.barreau.qc.ca/" },
        { name: "Association canadienne des agents de brevets", url: "https://www.cpata.ca/" },
        { name: "Institut de la propriété intellectuelle du Canada", url: "https://www.ipic.ca/" }
      ]
    },
    {
      category: "Ressources Éducatives",
      items: [
        { name: "Guide OPIC - Droit d'auteur", url: "https://www.ic.gc.ca/eic/site/cipointernet-internetopic.nsf/fra/h_wr02281.html" },
        { name: "Guide OPIC - Marques de commerce", url: "https://www.ic.gc.ca/eic/site/cipointernet-internetopic.nsf/fra/h_wr00002.html" },
        { name: "Guide OPIC - Brevets", url: "https://www.ic.gc.ca/eic/site/cipointernet-internetopic.nsf/fra/h_wr03652.html" }
      ]
    },
    {
      category: "Outils et Recherche",
      items: [
        { name: "Base de données des marques canadiennes", url: "https://www.ic.gc.ca/app/opic-cipo/trdmrks/srch/home" },
        { name: "Base de données des brevets canadiens", url: "https://www.ic.gc.ca/opic-cipo/cpd/fra/introduction.html" },
        { name: "Espacenet (brevets mondiaux)", url: "https://worldwide.espacenet.com/" }
      ]
    }
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-xl border-b border-white/10 px-6 py-6 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="w-16 h-16 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/40"
              >
                <Scale className="w-8 h-8 text-white" />
              </motion.div>
              
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  Propriété Intellectuelle
                  <Badge className="bg-blue-500 text-white">Protection Juridique</Badge>
                </h1>
                <p className="text-slate-300">Protection légale de Druide_Omega et de vos droits de créateur</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge className="bg-red-500 text-white text-sm px-4 py-2">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Consultation avocat requise
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-red-900/30 border-y border-red-500/50 px-6 py-4 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-red-400 mb-1">AVERTISSEMENT JURIDIQUE IMPORTANT</h3>
              <p className="text-red-200 text-sm">
                Ces documents sont des MODÈLES INFORMATIFS uniquement. Ils ne constituent PAS des conseils juridiques.
                Vous DEVEZ consulter un avocat spécialisé en propriété intellectuelle au Québec/Canada avant toute action légale.
                L'auteur de ces templates ne peut être tenu responsable de leur utilisation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8 bg-white/10 backdrop-blur-sm border border-white/20">
              <TabsTrigger value="overview" className="text-white data-[state=active]:bg-white/20">
                <Shield className="w-4 h-4 mr-2" />
                Vue d'ensemble
              </TabsTrigger>
              <TabsTrigger value="steps" className="text-white data-[state=active]:bg-white/20">
                <CheckCircle className="w-4 h-4 mr-2" />
                Démarches
              </TabsTrigger>
              <TabsTrigger value="documents" className="text-white data-[state=active]:bg-white/20">
                <FileText className="w-4 h-4 mr-2" />
                Documents
              </TabsTrigger>
              <TabsTrigger value="resources" className="text-white data-[state=active]:bg-white/20">
                <Briefcase className="w-4 h-4 mr-2" />
                Ressources
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <Card className="p-6 bg-white/10 backdrop-blur-xl border-white/20">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Copyright className="w-6 h-6 text-blue-400" />
                  Éléments à Protéger
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="p-5 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border-purple-300/30">
                    <h4 className="text-lg font-bold text-purple-300 mb-3">1. Droit d'Auteur (Copyright)</h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        Code source de l'application
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        Architecture logicielle et design patterns
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        Interface utilisateur et expérience (UI/UX)
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        Documentation technique et guides
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        Assets visuels et graphiques
                      </li>
                    </ul>
                    <div className="mt-4 pt-4 border-t border-purple-400/30">
                      <p className="text-xs text-purple-200">
                        <strong>Protection :</strong> Automatique dès la création + Enregistrement OPIC recommandé (50 CAD)
                      </p>
                    </div>
                  </Card>

                  <Card className="p-5 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-300/30">
                    <h4 className="text-lg font-bold text-blue-300 mb-3">2. Marque de Commerce (Trademark)</h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        Nom "Druide_Omega"
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        Logo et identité visuelle
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        Slogans et taglines
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        Éléments distinctifs de marque
                      </li>
                    </ul>
                    <div className="mt-4 pt-4 border-t border-blue-400/30">
                      <p className="text-xs text-blue-200">
                        <strong>Protection :</strong> Enregistrement OPIC requis (330+ CAD, 12-18 mois)
                      </p>
                    </div>
                  </Card>

                  <Card className="p-5 bg-gradient-to-br from-emerald-500/20 to-green-500/20 border-emerald-300/30">
                    <h4 className="text-lg font-bold text-emerald-300 mb-3">3. Brevet d'Invention (Patent)</h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        Architecture de conscience neurobiologique
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        Système de personnalité Big Five configurable
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        Mémoire cross-modale avec références croisées
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        Intelligence émotionnelle authentique (15 émotions)
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        Méthodes d'évolution de conscience
                      </li>
                    </ul>
                    <div className="mt-4 pt-4 border-t border-emerald-400/30">
                      <p className="text-xs text-emerald-200">
                        <strong>Protection :</strong> Demande OPIC + agent de brevets (5000-15000 CAD, 2-4 ans)
                      </p>
                    </div>
                  </Card>

                  <Card className="p-5 bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-300/30">
                    <h4 className="text-lg font-bold text-orange-300 mb-3">4. Secrets Commerciaux</h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-start gap-2">
                        <Lock className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                        Algorithmes propriétaires non brevetés
                      </li>
                      <li className="flex items-start gap-2">
                        <Lock className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                        Base de données et datasets
                      </li>
                      <li className="flex items-start gap-2">
                        <Lock className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                        Méthodes de calibration IA
                      </li>
                      <li className="flex items-start gap-2">
                        <Lock className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                        Stratégies commerciales et roadmap
                      </li>
                      <li className="flex items-start gap-2">
                        <Lock className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                        Know-how technique
                      </li>
                    </ul>
                    <div className="mt-4 pt-4 border-t border-orange-400/30">
                      <p className="text-xs text-orange-200">
                        <strong>Protection :</strong> NDA stricts + mesures de confidentialité internes
                      </p>
                    </div>
                  </Card>
                </div>
              </Card>

              {/* Cost Summary */}
              <Card className="p-6 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border-yellow-300/30">
                <h3 className="text-2xl font-bold text-white mb-4">💰 Estimation des Coûts Totaux</h3>
                
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                    <p className="text-xs text-slate-300 mb-1">Protection Minimale</p>
                    <p className="text-3xl font-bold text-white">~1500 CAD</p>
                    <p className="text-xs text-slate-400 mt-1">Droit d'auteur + Marque</p>
                  </div>
                  
                  <div className="bg-emerald-500/20 rounded-lg p-4 border border-emerald-400/50">
                    <p className="text-xs text-emerald-300 mb-1">Protection Recommandée</p>
                    <p className="text-3xl font-bold text-emerald-400">~10K CAD</p>
                    <p className="text-xs text-emerald-300 mt-1">+ Brevet + Avocats</p>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                    <p className="text-xs text-slate-300 mb-1">Protection Complète</p>
                    <p className="text-3xl font-bold text-white">20K+ CAD</p>
                    <p className="text-xs text-slate-400 mt-1">International + Full Legal</p>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-300 mb-2">Répartition Détaillée :</h4>
                  <div className="grid md:grid-cols-2 gap-2 text-sm text-slate-300">
                    <div className="flex justify-between">
                      <span>Enregistrement droit d'auteur OPIC</span>
                      <span className="text-white font-medium">50 CAD</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Marque de commerce (1-2 classes)</span>
                      <span className="text-white font-medium">330-500 CAD</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Agent de marques (optionnel)</span>
                      <span className="text-white font-medium">500-1500 CAD</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Demande de brevet (avec agent)</span>
                      <span className="text-white font-medium">5000-15000 CAD</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Consultation avocat IP (10h)</span>
                      <span className="text-white font-medium">2000-4000 CAD</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Incorporation société</span>
                      <span className="text-white font-medium">500-2000 CAD</span>
                    </div>
                    <div className="flex justify-between">
                      <span>NDA et contrats (templates)</span>
                      <span className="text-white font-medium">1000-3000 CAD</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Protection internationale (optionnel)</span>
                      <span className="text-white font-medium">10000+ CAD</span>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Steps Tab */}
            <TabsContent value="steps" className="space-y-6">
              {protectionSteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 bg-white/10 backdrop-blur-xl border-white/20">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                          {step.step}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">{step.title}</h3>
                          <p className="text-sm text-slate-300">{step.description}</p>
                        </div>
                      </div>
                      <Badge className={
                        step.priority === "Haute" ? "bg-red-500" :
                        step.priority === "Moyenne-Haute" ? "bg-orange-500" :
                        "bg-yellow-500"
                      }>
                        {step.priority}
                      </Badge>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-white mb-2">Actions à entreprendre :</h4>
                      <ol className="space-y-2">
                        {step.actions.map((action, idx) => (
                          <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                            <span className="text-blue-400 font-bold">{idx + 1}.</span>
                            {action}
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                      <div>
                        <p className="text-xs text-slate-400">Coût Estimé</p>
                        <p className="text-lg font-bold text-emerald-400">{step.cost}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Durée</p>
                        <p className="text-lg font-bold text-blue-400">{step.duration}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Priorité</p>
                        <p className="text-lg font-bold text-orange-400">{step.priority}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-6">
              <Card className="p-6 bg-red-900/30 border-red-500/50">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-red-400 mb-2">⚠️ AVERTISSEMENT CRITIQUE</h3>
                    <p className="text-red-200 text-sm mb-2">
                      Ces documents sont des TEMPLATES À TITRE INFORMATIF SEULEMENT. Ils contiennent des espaces [À COMPLÉTER] et 
                      doivent être OBLIGATOIREMENT revus et validés par un avocat spécialisé en propriété intellectuelle avant toute utilisation.
                    </p>
                    <p className="text-red-200 text-sm">
                      L'utilisation de ces templates sans validation légale peut avoir des conséquences juridiques graves. Aucune responsabilité
                      n'est assumée pour leur utilisation.
                    </p>
                  </div>
                </div>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Copyright Notice */}
                <Card className="p-6 bg-white/10 backdrop-blur-xl border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Copyright className="w-5 h-5 text-blue-400" />
                      Notice de Droit d'Auteur
                    </h3>
                    <Badge className="bg-blue-500">Template</Badge>
                  </div>
                  <p className="text-sm text-slate-300 mb-4">
                    Document à inclure dans votre code source, README et documentation
                  </p>
                  <Button
                    onClick={() => downloadDocument(copyrightNotice, 'COPYRIGHT_NOTICE.txt')}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger le Template
                  </Button>
                </Card>

                {/* License Agreement */}
                <Card className="p-6 bg-white/10 backdrop-blur-xl border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <FileText className="w-5 h-5 text-purple-400" />
                      Accord de Licence
                    </h3>
                    <Badge className="bg-purple-500">Template</Badge>
                  </div>
                  <p className="text-sm text-slate-300 mb-4">
                    Contrat de licence logicielle pour clients et partenaires
                  </p>
                  <Button
                    onClick={() => downloadDocument(licenseAgreement, 'LICENSE_AGREEMENT.txt')}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger le Template
                  </Button>
                </Card>

                {/* Patent Draft */}
                <Card className="p-6 bg-white/10 backdrop-blur-xl border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Lock className="w-5 h-5 text-emerald-400" />
                      Ébauche de Brevet
                    </h3>
                    <Badge className="bg-emerald-500">Template</Badge>
                  </div>
                  <p className="text-sm text-slate-300 mb-4">
                    Structure de base pour demande de brevet (DOIT être complété par un agent de brevets)
                  </p>
                  <Button
                    onClick={() => downloadDocument(patentDraft, 'PATENT_DRAFT.txt')}
                    className="w-full bg-gradient-to-r from-emerald-600 to-green-600"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger le Template
                  </Button>
                </Card>

                {/* Trademark Application */}
                <Card className="p-6 bg-white/10 backdrop-blur-xl border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Badge className="w-5 h-5 text-yellow-400" />
                      Demande de Marque
                    </h3>
                    <Badge className="bg-yellow-500">Template</Badge>
                  </div>
                  <p className="text-sm text-slate-300 mb-4">
                    Préparation demande de marque de commerce OPIC
                  </p>
                  <Button
                    onClick={() => downloadDocument(trademarkApplication, 'TRADEMARK_APPLICATION.txt')}
                    className="w-full bg-gradient-to-r from-yellow-600 to-orange-600"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger le Template
                  </Button>
                </Card>

                {/* NDA */}
                <Card className="p-6 bg-white/10 backdrop-blur-xl border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Shield className="w-5 h-5 text-red-400" />
                      Accord de Non-Divulgation (NDA)
                    </h3>
                    <Badge className="bg-red-500">Template</Badge>
                  </div>
                  <p className="text-sm text-slate-300 mb-4">
                    Contrat de confidentialité pour partenaires, investisseurs, employés
                  </p>
                  <Button
                    onClick={() => downloadDocument(ndaTemplate, 'NDA_TEMPLATE.txt')}
                    className="w-full bg-gradient-to-r from-red-600 to-pink-600"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger le Template
                  </Button>
                </Card>
              </div>
            </TabsContent>

            {/* Resources Tab */}
            <TabsContent value="resources" className="space-y-6">
              {resources.map((section, index) => (
                <Card key={index} className="p-6 bg-white/10 backdrop-blur-xl border-white/20">
                  <h3 className="text-xl font-bold text-white mb-4">{section.category}</h3>
                  <div className="space-y-3">
                    {section.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                        <span className="text-slate-300">{item.name}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(item.url, '_blank')}
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Visiter
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}

              {/* Professional Recommendations */}
              <Card className="p-6 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-300/30">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-indigo-400" />
                  Professionnels Recommandés à Consulter
                </h3>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">1. Avocat en PI</h4>
                    <p className="text-sm text-slate-300">
                      Spécialisé en propriété intellectuelle et droit des technologies
                    </p>
                    <Badge className="mt-2 bg-red-500">Essentiel</Badge>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">2. Agent de Brevets</h4>
                    <p className="text-sm text-slate-300">
                      Agréé OPIC pour rédaction et dépôt de brevets
                    </p>
                    <Badge className="mt-2 bg-orange-500">Recommandé</Badge>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">3. Agent de Marques</h4>
                    <p className="text-sm text-slate-300">
                      Pour recherche et dépôt de marques de commerce
                    </p>
                    <Badge className="mt-2 bg-yellow-500">Recommandé</Badge>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}