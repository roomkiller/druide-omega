import './App.css'
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import VisualEditAgent from '@/lib/VisualEditAgent'
import NavigationTracker from '@/lib/NavigationTracker'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { setupIframeMessaging } from './lib/iframe-messaging';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { Suspense, lazy } from 'react';
const SystemBoot = lazy(() => import('@/pages/SystemBoot'));
const LegalIPReport = lazy(() => import('@/pages/LegalIPReport'));
const SecureVault = lazy(() => import('@/pages/SecureVault'));
const ApplicationExtraction = lazy(() => import('@/pages/ApplicationExtraction'));
import ConfidentialPageGuard from '@/components/security/ConfidentialPageGuard';
import PublicHome from '@/pages/PublicHome';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

setupIframeMessaging();

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

// Pages routées explicitement, hors de pagesConfig
const EXPLICIT_PAGES = ['SystemBoot', 'LegalIPReport', 'SecureVault'];

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, isAuthenticated, navigateToLogin } = useAuth();
  const location = useLocation();

  // Déduire le nom réel de la page depuis l'URL (le layout en dépend pour choisir public vs architecte)
  const seg = location.pathname.split('/')[1] || '';
  const currentPageName = seg
    ? (Object.keys(Pages).concat(EXPLICIT_PAGES).find(k => k.toLowerCase() === seg.toLowerCase()) || seg)
    : mainPageKey;

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <LayoutWrapper currentPageName={currentPageName}>
      <ConfidentialPageGuard>
      <Suspense fallback={
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
        </div>
      }>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/SystemBoot" element={<SystemBoot />} />
        <Route path="/LegalIPReport" element={<LegalIPReport />} />
        <Route path="/SecureVault" element={<SecureVault />} />
        <Route path="/ApplicationExtraction" element={<ApplicationExtraction />} />
        <Route path="/PublicHome" element={<PublicHome />} />
        {Object.entries(Pages).map(([path, Page]) => (
          <Route key={path} path={`/${path}`} element={<Page />} />
        ))}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      </Suspense>
      </ConfidentialPageGuard>
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
  )
}

export default App