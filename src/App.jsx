import './App.css'
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import VisualEditAgent from '@/lib/VisualEditAgent'
import NavigationTracker from '@/lib/NavigationTracker'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { setupIframeMessaging } from './lib/iframe-messaging';
import { setRouterNavigate } from './lib/spaNavigate';
import PageNotFound from '@/lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';

import { Suspense } from 'react';
import { MotionConfig } from 'framer-motion';
import { ErrorBoundary } from '@/components/utils/ErrorBoundary';

setupIframeMessaging();

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : null;

const LayoutWrapper = ({ children, currentPageName }) => Layout
  ? <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError } = useAuth();
  const location = useLocation();
  const routerNavigate = useNavigate();
  setRouterNavigate(routerNavigate);

  // Nom de la page courant — utilisé par le Layout pour choisir public vs architecte.
  const seg = location.pathname.split('/')[1] || '';
  const currentPageName = seg
    ? (Object.keys(Pages).find((k) => k.toLowerCase() === seg.toLowerCase()) || seg)
    : mainPageKey;

  // Vérification auth + réglages publics
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  // Aucune restriction d'accès : toutes les pages sont ouvertes, quel que soit
  // l'état d'authentification. Pas de redirection vers un login (qui ne
  // s'affiche pas en prod) et aucun écran « Accès restreint ».
  return (
    <LayoutWrapper currentPageName={currentPageName}>
        <ErrorBoundary resetKey={location.pathname}>
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
            </div>
          }>
            <MotionConfig reducedMotion="always">
              <Routes>
                <Route path="/" element={MainPage ? <MainPage /> : <PageNotFound />} />
                {Object.entries(Pages).map(([path, Page]) => (
                  <Route key={path} path={`/${path}`} element={<Page />} />
                ))}
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </MotionConfig>
          </Suspense>
        </ErrorBoundary>
    </LayoutWrapper>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <NavigationTracker />
          <AuthenticatedApp />
        </Router>
        <Toaster />
        <VisualEditAgent />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;