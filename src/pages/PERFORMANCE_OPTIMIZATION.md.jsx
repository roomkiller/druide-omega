# 🚀 DRUIDE_OMEGA - Performance Optimization Guide

© 2025 AMG+A.L - Tous droits réservés

## 📊 Database Indexes (Base44)

### Recommended Indexes

```javascript
// Conversation - Index sur created_by et last_message_at
// Memory - Index sur created_by, importance, tags
// KnowledgeBase - Index sur created_by, active
// ModuleLicense - Index sur created_by, status, expiration_date
// AuditLog - Index sur user_email, created_date, severity
// APIKey - Index sur key, active
// Webhook - Index sur active, events
```

### Query Optimization Tips

1. **Utiliser les filtres appropriés**
   ```javascript
   // ❌ Lent - Récupère tout puis filtre
   const allItems = await base44.entities.Memory.list();
   const filtered = allItems.filter(m => m.importance > 7);

   // ✅ Rapide - Filtre côté serveur
   const filtered = await base44.entities.Memory.filter({ importance: { $gte: 7 } });
   ```

2. **Limiter les résultats**
   ```javascript
   // ❌ Lent - Récupère tout
   const items = await base44.entities.Conversation.list();

   // ✅ Rapide - Limite à 50
   const items = await base44.entities.Conversation.list('-created_date', 50);
   ```

3. **Utiliser le cache intelligent**
   ```javascript
   import { useCachedQuery, CACHE_CONFIG } from '@/components/utils/QueryCache';

   // Données statiques (30min cache)
   const { data } = useCachedQuery(['products'], fetchProducts, 'static');

   // Données utilisateur (5min cache)
   const { data } = useCachedQuery(['memories'], fetchMemories, 'user');

   // Temps réel (30s cache)
   const { data } = useCachedQuery(['stats'], fetchStats, 'realtime');
   ```

## 🖼️ Image Optimization

### Compression automatique
- Utiliser `loading="lazy"` sur toutes les images
- Utiliser WebP avec fallback JPEG
- Redimensionner images avant upload (max 1920x1080)

```jsx
<img 
  src={imageUrl} 
  alt="Description"
  loading="lazy"
  className="w-full h-auto"
  width={800}
  height={600}
/>
```

## 🎯 Code Splitting & Lazy Loading

### Lazy Loading Pages

```javascript
// ✅ Utiliser lazyLoadPage pour toutes les pages non-critiques
import lazyLoadPage from '@/components/utils/LazyPage';

export const Shop = lazyLoadPage(() => import('@/pages/Shop'));
export const Memory = lazyLoadPage(() => import('@/pages/Memory'));
export const Analytics = lazyLoadPage(() => import('@/pages/Analytics'));
```

### Critical vs Non-Critical

**Critical (chargement immédiat):**
- Home
- Chat
- Layout
- Navigation

**Non-Critical (lazy loading):**
- Shop
- Billing
- Admin
- Analytics
- Documentation

## 📦 Pagination Efficace

```javascript
import Pagination from '@/components/utils/Pagination';
import { usePaginatedQuery } from '@/components/utils/QueryCache';

function MyComponent() {
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data, isLoading } = usePaginatedQuery(
    ['items'],
    async (page, size) => {
      const skip = (page - 1) * size;
      return base44.entities.Item.list('-created_date', size, skip);
    },
    { page, pageSize }
  );

  return (
    <>
      {/* Render items */}
      <Pagination
        currentPage={page}
        totalPages={Math.ceil(data?.total / pageSize)}
        totalItems={data?.total}
        onPageChange={setPage}
        itemsPerPage={pageSize}
      />
    </>
  );
}
```

## 🌐 CDN Configuration

### Cloudflare (Recommended)

1. **Enable Auto Minify**
   - JavaScript: ✅
   - CSS: ✅
   - HTML: ✅

2. **Enable Brotli Compression**
   - Better than gzip (15-20% smaller)

3. **Cache Rules**
   ```
   *.js, *.css, *.woff2, *.webp, *.png, *.jpg
   Edge Cache TTL: 1 month
   Browser Cache TTL: 1 week
   ```

4. **Rocket Loader** (Optional)
   - Defer JavaScript loading
   - Can break some React apps, test first

## 🔄 Service Worker & Offline

### Activation

```javascript
// Dans index.html ou App.jsx
import { registerServiceWorker } from '@/components/utils/registerServiceWorker';

registerServiceWorker();
```

### Cache Strategy

- **Network First**: API calls, données dynamiques
- **Cache First**: Images, fonts, CSS, JS
- **Stale While Revalidate**: HTML pages

## 📈 Performance Monitoring

### Métriques clés

1. **LCP (Largest Contentful Paint)**: < 2.5s
2. **FID (First Input Delay)**: < 100ms
3. **CLS (Cumulative Layout Shift)**: < 0.1
4. **TTFB (Time To First Byte)**: < 600ms

### React Query DevTools

```javascript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<ReactQueryDevtools initialIsOpen={false} />
```

## 🎨 CSS Optimization

1. **Purge Unused CSS** (Tailwind automatic)
2. **Critical CSS Inline** (Above the fold)
3. **Defer Non-Critical CSS**

## 🚦 Bundle Size Optimization

### Analyse Bundle
```bash
npm run build -- --analyze
```

### Tree Shaking
- Utiliser imports nommés
- Éviter `import *`

```javascript
// ❌ Mauvais - importe tout lodash
import _ from 'lodash';

// ✅ Bon - importe seulement debounce
import { debounce } from 'lodash-es';
```

## 📊 Performance Checklist

- [ ] Database indexes configurés
- [ ] Lazy loading pages non-critiques
- [ ] Pagination sur listes > 50 items
- [ ] Service Worker enregistré
- [ ] Images optimisées (WebP, lazy)
- [ ] Cache React Query configuré
- [ ] CDN activé
- [ ] Compression Brotli/gzip
- [ ] Bundle analysé
- [ ] Métriques Core Web Vitals < seuils

## 🔧 Tools Recommandés

- **Lighthouse**: Audit performance
- **WebPageTest**: Test vitesse détaillé
- **Chrome DevTools**: Network, Performance tabs
- **React Query DevTools**: Cache inspection
- **Bundle Analyzer**: Analyse taille bundles

---

**Objectif Performance DRUIDE_OMEGA:**
- Score Lighthouse: > 90
- Temps chargement: < 2s (3G)
- Bundle size: < 500KB (initial)