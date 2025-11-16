/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Performance & Infrastructure Guide                         ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Zap, Database, Cloud, Lock, Settings } from "lucide-react";

export default function PerformanceGuide() {
  const sections = [
    {
      title: "Database Indexing",
      icon: Database,
      color: "from-blue-500 to-indigo-600",
      items: [
        {
          name: "Conversations Index",
          code: `// Index sur created_date pour list() rapide
await base44.asServiceRole.entities.Conversation.createIndex({
  fields: ['created_date'],
  order: 'desc'
});

// Index sur created_by pour filtrage user
await base44.asServiceRole.entities.Conversation.createIndex({
  fields: ['created_by']
});`
        },
        {
          name: "Memory Index",
          code: `// Index composite importance + created_date
await base44.asServiceRole.entities.Memory.createIndex({
  fields: ['importance', 'created_date'],
  order: 'desc'
});

// Index sur modality pour filtrage
await base44.asServiceRole.entities.Memory.createIndex({
  fields: ['modality']
});`
        },
        {
          name: "Full-Text Search",
          code: `// Index full-text sur content
await base44.asServiceRole.entities.KnowledgeBase.createIndex({
  fields: ['content'],
  type: 'text'
});`
        }
      ]
    },
    {
      title: "Cache Strategies",
      icon: Zap,
      color: "from-orange-500 to-red-600",
      items: [
        {
          name: "React Query Cache",
          code: `// Cache conversations 5 minutes
const { data } = useQuery({
  queryKey: ['conversations'],
  queryFn: () => base44.entities.Conversation.list(),
  staleTime: 300000, // 5min
  cacheTime: 600000  // 10min
});

// Infinite query pour pagination
const { data, fetchNextPage } = useInfiniteQuery({
  queryKey: ['memories'],
  queryFn: ({ pageParam = 0 }) => 
    base44.entities.Memory.list('-importance', 20, pageParam),
  getNextPageParam: (lastPage, pages) => pages.length * 20
});`
        },
        {
          name: "Browser Cache",
          code: `// Service Worker cache strategy
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response;
      return fetch(event.request).then((response) => {
        const clone = response.clone();
        caches.open('v1').then((cache) => {
          cache.put(event.request, clone);
        });
        return response;
      });
    })
  );
});`
        }
      ]
    },
    {
      title: "CDN Configuration",
      icon: Cloud,
      color: "from-purple-500 to-pink-600",
      items: [
        {
          name: "Cloudflare Setup",
          code: `// Cloudflare Page Rules
1. Cache Everything
   URL: druideomega.com/*
   Cache Level: Cache Everything
   Edge Cache TTL: 1 month

2. Browser Cache TTL
   URL: druideomega.com/static/*
   Browser Cache TTL: 1 year

3. Image Optimization
   URL: druideomega.com/images/*
   Polish: Lossless
   Mirage: On`
        },
        {
          name: "Image CDN Integration",
          code: `// Imgix / Cloudinary
const optimizedUrl = \`https://druide.imgix.net/\${imageId}\
?w=800&h=600&fit=crop&auto=format,compress&q=80\`;

// Cloudflare Images
const cfImageUrl = \`https://druide.com/cdn-cgi/image/\
width=800,quality=80,format=auto/\${imageUrl}\`;`
        }
      ]
    },
    {
      title: "Service Worker (PWA)",
      icon: Settings,
      color: "from-green-500 to-emerald-600",
      items: [
        {
          name: "service-worker.js",
          code: `const CACHE_NAME = 'druide-omega-v1';
const urlsToCache = [
  '/',
  '/Chat',
  '/Memory',
  '/static/css/main.css',
  '/static/js/bundle.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => 
      cache.addAll(urlsToCache)
    )
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => 
      response || fetch(event.request)
    )
  );
});`
        },
        {
          name: "manifest.json",
          code: `{
  "name": "Druide Omega",
  "short_name": "Druide",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#8b5cf6",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}`
        }
      ]
    },
    {
      title: "Automated Backups",
      icon: Lock,
      color: "from-red-500 to-rose-600",
      items: [
        {
          name: "Cron Job Setup",
          code: `// GitHub Actions - .github/workflows/backup.yml
name: Automated Backup
on:
  schedule:
    - cron: '0 2 * * *' # Daily at 2am
jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - run: curl -X POST https://api.druideomega.com/functions/autoBackup

// Or use Deno Deploy Cron
Deno.cron("backup", "0 2 * * *", async () => {
  await fetch('https://api.druideomega.com/functions/autoBackup');
});`
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-6 py-12">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Guide Performance & Infrastructure</h1>
          <p className="text-purple-100 text-lg">Optimisations production-ready</p>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
          {sections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <Card key={idx} className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${section.color} rounded-2xl flex items-center justify-center`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">{section.title}</h2>
                </div>

                <div className="space-y-6">
                  {section.items.map((item, itemIdx) => (
                    <div key={itemIdx}>
                      <h3 className="font-bold text-slate-900 mb-3">{item.name}</h3>
                      <pre className="bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{item.code}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}

          <Card className="p-8 bg-blue-50 border-blue-200">
            <h3 className="font-bold text-blue-900 mb-4">Checklist Production</h3>
            <div className="space-y-2">
              {[
                'CDN configuré (Cloudflare/CloudFront)',
                'Database indexes créés',
                'Service Worker actif (PWA)',
                'Backup automatisé quotidien',
                'Health checks configurés',
                'Feature flags opérationnels',
                'Image optimization pipeline',
                'Cache strategies implémentées'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Badge className="bg-blue-500 text-white">✓</Badge>
                  <span className="text-blue-900">{item}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}