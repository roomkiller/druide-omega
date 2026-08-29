/**
 * FeatureCard — carte de fonctionnalité, lien direct vers la page.
 * Aucun handler, aucun verrou : un simple <Link> instantané.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function FeatureCard({ icon: Icon, title, description, path, color, badge }) {
  return (
    <Link to={path} className="block h-full">
      <Card className="p-6 hover:shadow-xl transition-shadow group h-full">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex items-start justify-between mb-2 gap-2">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          {badge && (
            <Badge className="bg-purple-100 text-purple-700 text-xs flex-shrink-0">{badge}</Badge>
          )}
        </div>
        <p className="text-sm text-slate-600">{description}</p>
      </Card>
    </Link>
  );
}