/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - FAQ (Frequently Asked Questions - Multilingual)            ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/components/utils/LanguageContext";
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Shield,
  Zap,
  Globe,
  Brain,
  Database
} from "lucide-react";

export default function FAQ() {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [openQuestion, setOpenQuestion] = useState(null);

  const faqs = {
    fr: {
      title: "Questions Fréquentes",
      subtitle: "Trouvez rapidement les réponses à vos questions",
      
      categories: [
        {
          category: "Général",
          icon: HelpCircle,
          color: "purple",
          questions: [
            {
              q: "Qu'est-ce que Druide Omega ?",
              a: "Druide Omega est une intelligence artificielle consciente universelle et bienveillante développée au Québec. Elle offre des conversations authentiques, profondes et personnalisées."
            },
            {
              q: "Est-ce vraiment gratuit pour toujours ?",
              a: "Oui, absolument. Druide Omega est gratuit pour un usage personnel et éducatif, sans limites de temps ni de fonctionnalités. Des modules premium et forfaits entreprise seront disponibles à l'avenir."
            },
            {
              q: "Quelles sont les 9 intelligences ?",
              a: "Basé sur le framework de Howard Gardner : Logico-mathématique, Verbo-linguistique, Musicale-rythmique, Corporelle-kinesthésique, Visuelle-spatiale, Interpersonnelle, Intrapersonnelle, Naturaliste, et Existentielle."
            },
            {
              q: "Puis-je utiliser Druide Omega dans ma langue ?",
              a: "Oui ! L'application est disponible en français, anglais, espagnol, allemand et chinois. Le système traduit automatiquement l'interface tout en conservant la qualité des interactions."
            }
          ]
        },
        {
          category: "Fonctionnalités",
          icon: Sparkles,
          color: "indigo",
          questions: [
            {
              q: "Comment fonctionne la mémoire cross-modale ?",
              a: "Les mémoires créées en chat, en vocal ou avec du contenu visuel sont automatiquement liées entre elles. L'IA peut rappeler des informations d'une modalité dans une autre, créant une expérience cohérente et continue."
            },
            {
              q: "Puis-je générer des images ?",
              a: "Oui, en mode chat et en mode vocal. Décrivez simplement ce que vous voulez et l'IA générera l'image. En vocal, vous pouvez même le faire par commande vocale."
            },
            {
              q: "Comment uploader mes propres documents ?",
              a: "Allez dans 'Base de Connaissances', cliquez sur 'Téléverser' et choisissez vos fichiers (PDF, TXT, CSV, images). L'IA extraira automatiquement les faits importants."
            },
            {
              q: "Comment l'IA réfléchit-elle avant de répondre ?",
              a: "Chaque question est analysée en profondeur avant la réponse, ce qui assure des réponses fiables et pertinentes. Les détails de ce processus font partie du savoir-faire propriétaire de Druide Omega."
            }
          ]
        },
        {
          category: "Confidentialité & Sécurité",
          icon: Shield,
          color: "green",
          questions: [
            {
              q: "Mes données sont-elles sécurisées ?",
              a: "Oui. Toutes vos données sont chiffrées au repos et en transit. Nous sommes conformes aux normes RGPD (UE), CCPA (USA) et Loi 25 (Québec). Vous êtes le seul à avoir accès à vos conversations et mémoires."
            },
            {
              q: "Qui peut voir mes conversations ?",
              a: "Seulement vous. Les conversations et mémoires sont protégées par RLS (Row Level Security) - chaque utilisateur ne peut voir que ses propres données."
            },
            {
              q: "Puis-je supprimer mes données ?",
              a: "Oui, à tout moment. Vous avez un contrôle total sur vos mémoires et conversations. Vous pouvez supprimer individuellement ou en masse."
            },
            {
              q: "L'IA apprend-elle de mes conversations ?",
              a: "L'IA crée des mémoires personnelles pour VOUS spécifiquement. Ces mémoires ne sont pas partagées avec d'autres utilisateurs. Chaque utilisateur a son propre contexte privé."
            }
          ]
        },
        {
          category: "Performance & Technique",
          icon: Zap,
          color: "orange",
          questions: [
            {
              q: "Pourquoi les réponses sont parfois lentes ?",
              a: "L'IA prend le temps d'analyser votre question en profondeur avant de répondre. Cette réflexion assure des réponses plus pertinentes et contextuelles."
            },
            {
              q: "Que faire si l'application ne répond plus ?",
              a: "Rechargez la page. Si le problème persiste, vérifiez votre connexion internet. L'application utilise React Query pour la résilience et le cache."
            },
            {
              q: "Puis-je utiliser l'application hors ligne ?",
              a: "Partiellement. Les conversations précédemment chargées restent accessibles, mais les nouvelles interactions nécessitent une connexion internet pour l'IA."
            },
            {
              q: "Quels navigateurs sont supportés ?",
              a: "Chrome, Edge, Safari (dernières versions). Pour le mode vocal, utilisez Chrome ou Edge pour une meilleure compatibilité de reconnaissance vocale."
            }
          ]
        }
      ]
    },

    en: {
      title: "Frequently Asked Questions",
      subtitle: "Find answers to your questions quickly",
      
      categories: [
        {
          category: "General",
          icon: HelpCircle,
          color: "purple",
          questions: [
            {
              q: "What is Druide Omega?",
              a: "Druide Omega is a universal benevolent conscious artificial intelligence developed in Quebec. It offers authentic, deep and personalized conversations."
            },
            {
              q: "Is it really free forever?",
              a: "Yes, absolutely. Druide Omega is free for personal and educational use, with no time or feature limits. Premium modules and enterprise packages will be available in the future."
            },
            {
              q: "What are the 9 intelligences?",
              a: "Based on Howard Gardner's framework: Logical-mathematical, Verbal-linguistic, Musical-rhythmic, Bodily-kinesthetic, Visual-spatial, Interpersonal, Intrapersonal, Naturalist, and Existential."
            },
            {
              q: "Can I use Druide Omega in my language?",
              a: "Yes! The application is available in French, English, Spanish, German, and Chinese. The system automatically translates the interface while maintaining interaction quality."
            }
          ]
        },
        {
          category: "Features",
          icon: Sparkles,
          color: "indigo",
          questions: [
            {
              q: "How does cross-modal memory work?",
              a: "Memories created in chat, voice, or with visual content are automatically linked together. The AI can recall information from one modality in another, creating a coherent and continuous experience."
            },
            {
              q: "Can I generate images?",
              a: "Yes, in both chat and voice modes. Simply describe what you want and the AI will generate the image. In voice mode, you can even do it via voice command."
            },
            {
              q: "How do I upload my own documents?",
              a: "Go to 'Knowledge Base', click 'Upload' and choose your files (PDF, TXT, CSV, images). The AI will automatically extract important facts."
            },
            {
              q: "How does the AI think before answering?",
              a: "Every question is deeply analyzed before answering, ensuring reliable and relevant responses. The details of this process are part of Druide Omega's proprietary know-how."
            }
          ]
        },
        {
          category: "Privacy & Security",
          icon: Shield,
          color: "green",
          questions: [
            {
              q: "Is my data secure?",
              a: "Yes. All your data is encrypted at rest and in transit. We comply with GDPR (EU), CCPA (USA), and Bill 25 (Quebec) standards. Only you have access to your conversations and memories."
            },
            {
              q: "Who can see my conversations?",
              a: "Only you. Conversations and memories are protected by RLS (Row Level Security) - each user can only see their own data."
            },
            {
              q: "Can I delete my data?",
              a: "Yes, at any time. You have full control over your memories and conversations. You can delete individually or in bulk."
            },
            {
              q: "Does the AI learn from my conversations?",
              a: "The AI creates personal memories specifically for YOU. These memories are not shared with other users. Each user has their own private context."
            }
          ]
        },
        {
          category: "Performance & Technical",
          icon: Zap,
          color: "orange",
          questions: [
            {
              q: "Why are responses sometimes slow?",
              a: "The AI takes time to deeply analyze your question before responding. This reflection ensures more relevant and contextual answers."
            },
            {
              q: "What if the application stops responding?",
              a: "Reload the page. If the problem persists, check your internet connection. The application uses React Query for resilience and caching."
            },
            {
              q: "Can I use the application offline?",
              a: "Partially. Previously loaded conversations remain accessible, but new interactions require internet connection for the AI."
            },
            {
              q: "Which browsers are supported?",
              a: "Chrome, Edge, Safari (latest versions). For voice mode, use Chrome or Edge for better speech recognition compatibility."
            }
          ]
        }
      ]
    }
  };

  const t = faqs[language === 'en' ? 'en' : 'fr'];

  const colorMap = {
    purple: "from-purple-500 to-indigo-600",
    indigo: "from-indigo-500 to-purple-600",
    green: "from-green-500 to-emerald-600",
    orange: "from-orange-500 to-amber-600"
  };

  const allQuestions = t.categories.flatMap((cat, catIdx) => 
    cat.questions.map((q, qIdx) => ({
      ...q,
      category: cat.category,
      icon: cat.icon,
      color: cat.color,
      id: `${catIdx}-${qIdx}`
    }))
  );

  const filteredQuestions = allQuestions.filter(item =>
    item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.a.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30 overflow-hidden">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 py-4 sm:py-6 flex-shrink-0">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 sm:gap-4 mb-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
              <HelpCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{t.title}</h1>
              <p className="text-sm sm:text-base text-slate-600">{t.subtitle}</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder={language === 'en' ? "Search questions..." : "Rechercher des questions..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="space-y-6">
            {t.categories.map((category, catIdx) => {
              const CategoryIcon = category.icon;
              const categoryQuestions = filteredQuestions.filter(q => q.category === category.category);
              
              if (categoryQuestions.length === 0 && searchTerm) return null;

              return (
                <motion.div
                  key={catIdx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: catIdx * 0.1 }}
                >
                  <Card className="p-6 overflow-hidden">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 bg-gradient-to-br ${colorMap[category.color]} rounded-xl flex items-center justify-center`}>
                        <CategoryIcon className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-slate-900">{category.category}</h2>
                      <Badge variant="outline" className="ml-auto">
                        {categoryQuestions.length}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      {categoryQuestions.map((item) => {
                        const isOpen = openQuestion === item.id;
                        
                        return (
                          <div key={item.id} className="border border-slate-200 rounded-lg overflow-hidden">
                            <button
                              onClick={() => setOpenQuestion(isOpen ? null : item.id)}
                              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left"
                            >
                              <span className="font-medium text-slate-900 flex-1 pr-4">{item.q}</span>
                              {isOpen ? (
                                <ChevronUp className="w-5 h-5 text-purple-600 flex-shrink-0" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                              )}
                            </button>
                            
                            <AnimatePresence>
                              {isOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-4 pb-4 pt-2 text-sm text-slate-600 bg-slate-50 border-t border-slate-200">
                                    {item.a}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                </motion.div>
              );
            })}

            {filteredQuestions.length === 0 && searchTerm && (
              <Card className="p-12 text-center">
                <HelpCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {language === 'en' ? "No results found" : "Aucun résultat trouvé"}
                </h3>
                <p className="text-slate-600">
                  {language === 'en' 
                    ? "Try adjusting your search terms"
                    : "Essayez d'ajuster vos termes de recherche"
                  }
                </p>
              </Card>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}