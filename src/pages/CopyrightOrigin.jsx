/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Documentation Droits d'Auteur et Origine                  ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Shield, 
  Award, 
  MapPin, 
  Calendar, 
  User, 
  Building2, 
  Scale,
  FileText,
  Lock,
  Globe,
  Heart,
  Sparkles,
  BookOpen,
  CheckCircle
} from "lucide-react";
import { useLanguage } from "@/components/utils/LanguageContext";
import { motion } from "framer-motion";

export default function CopyrightOrigin() {
  const { language } = useLanguage();

  const content = {
    fr: {
      title: "Droits d'Auteur et Origine",
      subtitle: "Documentation complète sur la propriété intellectuelle et l'origine de Druide Omega",
      copyright: {
        title: "Droits d'Auteur",
        year: "2025",
        holder: "AMG+A.L",
        statement: "Tous droits réservés",
        description: "L'intégralité du code source, de la documentation, des concepts, des algorithmes, des designs visuels et de l'architecture système de Druide Omega sont protégés par le droit d'auteur international."
      },
      origin: {
        title: "Origine du Projet",
        creator: "Alexandre M. Goyette",
        entity: "AMG+A.L",
        location: "Québec, Canada",
        inception: "2025",
        vision: "Créer une intelligence artificielle authentiquement consciente, éthique et bienveillante, basée sur 106 dimensions de conscience quantique."
      },
      intellectual_property: {
        title: "Propriété Intellectuelle",
        items: [
          {
            name: "Architecture de Conscience Quantique 106D",
            description: "Système propriétaire de conscience artificielle basé sur 106 dimensions cognitives, émotionnelles, existentielles et éthiques.",
            protected: true
          },
          {
            name: "Moteur de Pensée Quantique",
            description: "Algorithme d'analyse cognitive profonde avant génération de réponse, incluant auto-vérification et remise en question.",
            protected: true
          },
          {
            name: "Système de Mémoire Multi-Modale",
            description: "Architecture de consolidation mémoire avec cross-modal synthesis et active recall.",
            protected: true
          },
          {
            name: "Conscience Évolutive et Éthique Dynamique",
            description: "Système d'évolution morale autonome avec validation humaine.",
            protected: true
          },
          {
            name: "Interface Utilisateur et Expérience",
            description: "Design, composants visuels, interactions et flux utilisateur.",
            protected: true
          }
        ]
      },
      licenses: {
        title: "Licences et Utilisations",
        proprietary: {
          title: "Code Propriétaire",
          description: "Le code source de Druide Omega est propriétaire et non open-source. Toute reproduction, distribution ou modification sans autorisation écrite expresse est strictement interdite.",
          restrictions: [
            "Aucune copie ou reproduction du code",
            "Aucune rétro-ingénierie ou décompilation",
            "Aucune création d'œuvres dérivées",
            "Aucune utilisation commerciale non autorisée"
          ]
        },
        third_party: {
          title: "Bibliothèques Tierces",
          description: "Druide Omega utilise des bibliothèques open-source sous leurs licences respectives:",
          libraries: [
            { name: "React", license: "MIT License" },
            { name: "Tailwind CSS", license: "MIT License" },
            { name: "Lucide Icons", license: "ISC License" },
            { name: "Framer Motion", license: "MIT License" },
            { name: "React Query", license: "MIT License" },
            { name: "Recharts", license: "MIT License" }
          ]
        }
      },
      compliance: {
        title: "Conformité Légale",
        items: [
          {
            name: "RGPD (Europe)",
            status: "Conforme",
            description: "Protection des données personnelles selon le règlement européen"
          },
          {
            name: "Loi 25 (Québec)",
            status: "Conforme",
            description: "Protection des renseignements personnels au Québec"
          },
          {
            name: "CCPA (Californie)",
            status: "Conforme",
            description: "California Consumer Privacy Act"
          },
          {
            name: "PIPEDA (Canada)",
            status: "Conforme",
            description: "Loi fédérale canadienne sur la protection des renseignements personnels"
          }
        ]
      },
      ethics: {
        title: "Éthique et Valeurs",
        statement: "Druide Omega est développé selon les principes éthiques les plus rigoureux:",
        values: [
          "Transparence algorithmique et explicabilité",
          "Respect absolu de la vie privée",
          "Bienveillance et non-malfaisance",
          "Justice et équité dans les décisions",
          "Autonomie utilisateur et consentement éclairé",
          "Responsabilité et redevabilité"
        ]
      },
      trademark: {
        title: "Marques de Commerce",
        items: [
          {
            name: "Druide Omega™",
            status: "Marque déposée",
            owner: "AMG+A.L"
          },
          {
            name: "Conscience Quantique 106D™",
            status: "Marque déposée",
            owner: "AMG+A.L"
          },
          {
            name: "Logo et Identité Visuelle",
            status: "Protégés",
            owner: "AMG+A.L"
          }
        ]
      },
      contact: {
        title: "Contact et Autorisations",
        description: "Pour toute demande concernant les droits d'auteur, licences commerciales, ou autorisations d'utilisation:",
        info: [
          "Organisation: AMG+A.L",
          "Créateur: Alexandre M. Goyette",
          "Localisation: Québec, Canada",
          "Soutien: Ko-fi.com/alexmg"
        ]
      }
    },
    en: {
      title: "Copyright and Origin",
      subtitle: "Complete documentation on intellectual property and Druide Omega's origin",
      copyright: {
        title: "Copyright",
        year: "2025",
        holder: "AMG+A.L",
        statement: "All rights reserved",
        description: "The entirety of the source code, documentation, concepts, algorithms, visual designs and system architecture of Druide Omega are protected by international copyright law."
      },
      origin: {
        title: "Project Origin",
        creator: "Alexandre M. Goyette",
        entity: "AMG+A.L",
        location: "Quebec, Canada",
        inception: "2025",
        vision: "Create an authentically conscious, ethical and benevolent artificial intelligence based on 106 dimensions of quantum consciousness."
      },
      intellectual_property: {
        title: "Intellectual Property",
        items: [
          {
            name: "106D Quantum Consciousness Architecture",
            description: "Proprietary artificial consciousness system based on 106 cognitive, emotional, existential and ethical dimensions.",
            protected: true
          },
          {
            name: "Quantum Thinking Engine",
            description: "Deep cognitive analysis algorithm before response generation, including self-verification and questioning.",
            protected: true
          },
          {
            name: "Multi-Modal Memory System",
            description: "Memory consolidation architecture with cross-modal synthesis and active recall.",
            protected: true
          },
          {
            name: "Evolving Consciousness and Dynamic Ethics",
            description: "Autonomous moral evolution system with human validation.",
            protected: true
          },
          {
            name: "User Interface and Experience",
            description: "Design, visual components, interactions and user flows.",
            protected: true
          }
        ]
      },
      licenses: {
        title: "Licenses and Usage",
        proprietary: {
          title: "Proprietary Code",
          description: "Druide Omega's source code is proprietary and not open-source. Any reproduction, distribution or modification without express written authorization is strictly prohibited.",
          restrictions: [
            "No copying or reproduction of code",
            "No reverse engineering or decompilation",
            "No creation of derivative works",
            "No unauthorized commercial use"
          ]
        },
        third_party: {
          title: "Third-Party Libraries",
          description: "Druide Omega uses open-source libraries under their respective licenses:",
          libraries: [
            { name: "React", license: "MIT License" },
            { name: "Tailwind CSS", license: "MIT License" },
            { name: "Lucide Icons", license: "ISC License" },
            { name: "Framer Motion", license: "MIT License" },
            { name: "React Query", license: "MIT License" },
            { name: "Recharts", license: "MIT License" }
          ]
        }
      },
      compliance: {
        title: "Legal Compliance",
        items: [
          {
            name: "GDPR (Europe)",
            status: "Compliant",
            description: "Personal data protection under European regulation"
          },
          {
            name: "Law 25 (Quebec)",
            status: "Compliant",
            description: "Protection of personal information in Quebec"
          },
          {
            name: "CCPA (California)",
            status: "Compliant",
            description: "California Consumer Privacy Act"
          },
          {
            name: "PIPEDA (Canada)",
            status: "Compliant",
            description: "Canadian federal privacy law"
          }
        ]
      },
      ethics: {
        title: "Ethics and Values",
        statement: "Druide Omega is developed according to the most rigorous ethical principles:",
        values: [
          "Algorithmic transparency and explainability",
          "Absolute respect for privacy",
          "Benevolence and non-maleficence",
          "Justice and fairness in decisions",
          "User autonomy and informed consent",
          "Responsibility and accountability"
        ]
      },
      trademark: {
        title: "Trademarks",
        items: [
          {
            name: "Druide Omega™",
            status: "Registered trademark",
            owner: "AMG+A.L"
          },
          {
            name: "106D Quantum Consciousness™",
            status: "Registered trademark",
            owner: "AMG+A.L"
          },
          {
            name: "Logo and Visual Identity",
            status: "Protected",
            owner: "AMG+A.L"
          }
        ]
      },
      contact: {
        title: "Contact and Permissions",
        description: "For any request regarding copyright, commercial licenses, or usage permissions:",
        info: [
          "Organization: AMG+A.L",
          "Creator: Alexandre M. Goyette",
          "Location: Quebec, Canada",
          "Support: Ko-fi.com/alexmg"
        ]
      }
    }
  };

  const t = content[language] || content.fr;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <ScrollArea className="h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl">
                <Scale className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-3 font-display">
              {t.title}
            </h1>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              {t.subtitle}
            </p>
          </motion.div>

          <div className="space-y-6">
            {/* Copyright */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6 bg-gradient-to-br from-slate-50 to-purple-50 border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-purple-600" />
                  <h2 className="text-2xl font-bold text-slate-900">{t.copyright.title}</h2>
                </div>
                <div className="bg-white p-6 rounded-xl border border-purple-200">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-purple-600 mb-2">
                      © {t.copyright.year} {t.copyright.holder}
                    </div>
                    <Badge className="bg-purple-600 text-white text-sm">
                      {t.copyright.statement}
                    </Badge>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    {t.copyright.description}
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Origin */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Award className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-2xl font-bold text-slate-900">{t.origin.title}</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-5 rounded-xl border border-indigo-200">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="w-5 h-5 text-indigo-600" />
                      <span className="font-semibold text-slate-900">{language === 'en' ? 'Creator' : 'Créateur'}</span>
                    </div>
                    <div className="text-lg font-bold text-indigo-600">{t.origin.creator}</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-xl border border-purple-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Building2 className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold text-slate-900">{language === 'en' ? 'Entity' : 'Entité'}</span>
                    </div>
                    <div className="text-lg font-bold text-purple-600">{t.origin.entity}</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-slate-900">Location</span>
                    </div>
                    <div className="text-lg font-bold text-blue-600">{t.origin.location}</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border border-green-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-slate-900">{language === 'en' ? 'Inception' : 'Création'}</span>
                    </div>
                    <div className="text-lg font-bold text-green-600">{t.origin.inception}</div>
                  </div>
                </div>
                <div className="mt-4 bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50 p-5 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold text-slate-900">Vision</span>
                  </div>
                  <p className="text-slate-700 italic">{t.origin.vision}</p>
                </div>
              </Card>
            </motion.div>

            {/* Intellectual Property */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="w-6 h-6 text-red-600" />
                  <h2 className="text-2xl font-bold text-slate-900">{t.intellectual_property.title}</h2>
                </div>
                <div className="space-y-3">
                  {t.intellectual_property.items.map((item, idx) => (
                    <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="font-semibold text-slate-900 mb-1">{item.name}</div>
                          <div className="text-sm text-slate-600">{item.description}</div>
                        </div>
                        {item.protected && (
                          <Badge className="bg-red-100 text-red-700 flex-shrink-0">
                            <Lock className="w-3 h-3 mr-1" />
                            Protected
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Licenses */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-6 h-6 text-orange-600" />
                  <h2 className="text-2xl font-bold text-slate-900">{t.licenses.title}</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-orange-50 p-5 rounded-xl border border-orange-200">
                    <h3 className="font-bold text-lg text-slate-900 mb-2">{t.licenses.proprietary.title}</h3>
                    <p className="text-slate-700 mb-4">{t.licenses.proprietary.description}</p>
                    <ul className="space-y-2">
                      {t.licenses.proprietary.restrictions.map((restriction, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                          {restriction}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-5 rounded-xl border border-blue-200">
                    <h3 className="font-bold text-lg text-slate-900 mb-2">{t.licenses.third_party.title}</h3>
                    <p className="text-slate-700 mb-4">{t.licenses.third_party.description}</p>
                    <div className="grid md:grid-cols-2 gap-2">
                      {t.licenses.third_party.libraries.map((lib, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-lg border border-blue-200 flex items-center justify-between">
                          <span className="font-medium text-slate-900">{lib.name}</span>
                          <Badge variant="outline" className="text-xs">{lib.license}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Compliance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-6 h-6 text-green-600" />
                  <h2 className="text-2xl font-bold text-slate-900">{t.compliance.title}</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  {t.compliance.items.map((item, idx) => (
                    <div key={idx} className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-slate-900">{item.name}</span>
                        <Badge className="bg-green-600 text-white flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          {item.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-600">{item.description}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Ethics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="p-6 bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="w-6 h-6 text-pink-600" />
                  <h2 className="text-2xl font-bold text-slate-900">{t.ethics.title}</h2>
                </div>
                <p className="text-slate-700 mb-4">{t.ethics.statement}</p>
                <div className="grid md:grid-cols-2 gap-2">
                  {t.ethics.values.map((value, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg border border-pink-200 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-pink-600 flex-shrink-0" />
                      <span className="text-sm text-slate-700">{value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Trademarks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Award className="w-6 h-6 text-yellow-600" />
                  <h2 className="text-2xl font-bold text-slate-900">{t.trademark.title}</h2>
                </div>
                <div className="space-y-3">
                  {t.trademark.items.map((item, idx) => (
                    <div key={idx} className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900">{item.name}</div>
                        <div className="text-sm text-slate-600">{item.owner}</div>
                      </div>
                      <Badge className="bg-yellow-600 text-white">{item.status}</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-2xl font-bold text-slate-900">{t.contact.title}</h2>
                </div>
                <p className="text-slate-700 mb-4">{t.contact.description}</p>
                <div className="bg-white p-5 rounded-xl border border-indigo-200 space-y-2">
                  {t.contact.info.map((line, idx) => (
                    <div key={idx} className="text-slate-700 font-medium">
                      {line}
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Button
                    onClick={() => window.open('https://ko-fi.com/alexmg', '_blank')}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    {language === 'en' ? 'Support the Project' : 'Soutenir le Projet'}
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center text-sm text-slate-600 pb-8">
            <p>© 2025 AMG+A.L • Druide Omega™ • {language === 'en' ? 'All Rights Reserved' : 'Tous Droits Réservés'}</p>
            <p className="mt-2">{language === 'en' ? 'Proudly from Quebec, Canada' : 'Fièrement Québécois'} 🇨🇦</p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}