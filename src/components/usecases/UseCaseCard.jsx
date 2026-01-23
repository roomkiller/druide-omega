import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UseCaseCard({ useCase, language }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 hover:shadow-lg transition-all border-2 border-purple-100 hover:border-purple-300">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={`${useCase.categoryColor} text-white`}>
                {useCase.category}
              </Badge>
              <Badge variant="outline" className="text-xs">
                #{useCase.id}
              </Badge>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {language === 'en' ? useCase.titleEn : useCase.titleFr}
            </h3>
            <p className="text-sm text-slate-600">
              {language === 'en' ? useCase.descriptionEn : useCase.descriptionFr}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="ml-2"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-slate-200 space-y-4"
            >
              {/* Technical Details */}
              <div>
                <h4 className="font-semibold text-sm text-slate-900 mb-2">
                  {language === 'en' ? 'Technical Implementation' : 'Implémentation Technique'}
                </h4>
                <p className="text-sm text-slate-600">
                  {language === 'en' ? useCase.technicalEn : useCase.technicalFr}
                </p>
              </div>

              {/* Druide vs Competition */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <h5 className="font-semibold text-sm text-green-900">Druide Omega</h5>
                  </div>
                  <ul className="space-y-1">
                    {useCase.druideAdvantages.map((adv, idx) => (
                      <li key={idx} className="text-xs text-green-800 flex items-start">
                        <span className="mr-1">•</span>
                        <span>{language === 'en' ? adv.en : adv.fr}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-red-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <h5 className="font-semibold text-sm text-red-900">
                      {language === 'en' ? 'Competitors' : 'Concurrents'}
                    </h5>
                  </div>
                  <ul className="space-y-1">
                    {useCase.competitorLimitations.map((lim, idx) => (
                      <li key={idx} className="text-xs text-red-800 flex items-start">
                        <span className="mr-1">•</span>
                        <span>{language === 'en' ? lim.en : lim.fr}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Practical Example */}
              <div>
                <h4 className="font-semibold text-sm text-slate-900 mb-2">
                  {language === 'en' ? 'Practical Example' : 'Exemple Pratique'}
                </h4>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-sm text-purple-900">
                    {language === 'en' ? useCase.exampleEn : useCase.exampleFr}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}