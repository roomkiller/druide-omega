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
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { Suspense } from 'react';
import SystemBoot from '@/pages/SystemBoot';
import LegalIPReport from '@/pages/LegalIPReport';
import SecureVault from '@/pages/SecureVault';
import ApplicationExtraction from '@/pages/ApplicationExtraction';
import ConfidentialPageGuard from '@/components/security/ConfidentialPageGuard';
import { ErrorBoundary } from '@/components/utils/ErrorBoundary';
import PublicHome from '@/pages/PublicHome';
import Chat from '@/pages/Chat';
import VoiceRoom from '@/pages/VoiceRoom';
import Intelligences from '@/pages/Intelligences';
import Memory from '@/pages/Memory';
import Knowledge from '@/pages/Knowledge';
import Games from '@/pages/Games';
import Shop from '@/pages/Shop';
import Profile from '@/pages/Profile';
import Documentation from '@/pages/Documentation';
import UserGuide from '@/pages/UserGuide';
import Personality from '@/pages/Personality';
import ArchitectDashboard from '@/pages/ArchitectDashboard';
import AITests from '@/pages/AITests';
import UseCases from '@/pages/UseCases';
import IntellectualProperty from '@/pages/IntellectualProperty';
import ProjectOverview from '@/pages/ProjectOverview';
import DocumentationSynthesis from '@/pages/DocumentationSynthesis';
import PsychologyResearch from '@/pages/PsychologyResearch';
import Chat_2 from '@/pages/Chat_2';
import ApplicationEvaluation from '@/pages/ApplicationEvaluation';
import DruideOmegaExplained from '@/pages/DruideOmegaExplained';
import CompetitiveForces from '@/pages/CompetitiveForces';
import MarketPosition from '@/pages/MarketPosition';
import TechnicalArchitecture from '@/pages/TechnicalArchitecture';
import MedicalResearch from '@/pages/MedicalResearch';
import ConsciousnessConfiguration from '@/pages/ConsciousnessConfiguration';
import DruideControl from '@/pages/DruideControl';
import CompletionAnalysis from '@/pages/CompletionAnalysis';
import TranslationWorkPlan from '@/pages/TranslationWorkPlan';
import ProofOfConcept from '@/pages/ProofOfConcept';
import Admin from '@/pages/Admin';
import DailyBriefing from '@/pages/DailyBriefing';
import KnowledgeEnrichment from '@/pages/KnowledgeEnrichment';
import ProjectProgress from '@/pages/ProjectProgress';
import TranslationAudit from '@/pages/TranslationAudit';
import Analytics from '@/pages/Analytics';
import UpdatePhases from '@/pages/UpdatePhases';
import ArchitectDemo from '@/pages/ArchitectDemo';

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
  const routerNavigate = useNavigate();
  setRouterNavigate(routerNavigate);

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
    }
    // auth_required (app privée ou token invalide) : on ne redirige PLUS vers
    // le login — le formulaire de login ne s'affiche pas en prod (problème
    // connu), ce qui laisse une page blanche complète. On rend l'app à la place :
    // les pages publiques (PublicHome, Documentation, etc.) restent accessibles,
    // et les pages confidentielles sont bloquées par ConfidentialPageGuard.
  }

  // Render the main app
  return (
    <LayoutWrapper currentPageName={currentPageName}>
      <ConfidentialPageGuard>
      <ErrorBoundary key={location.pathname}>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
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
        <Route path="/Chat" element={<Chat />} />
        <Route path="/VoiceRoom" element={<VoiceRoom />} />
        <Route path="/Intelligences" element={<Intelligences />} />
        <Route path="/Memory" element={<Memory />} />
        <Route path="/Knowledge" element={<Knowledge />} />
        <Route path="/Games" element={<Games />} />
        <Route path="/Shop" element={<Shop />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Documentation" element={<Documentation />} />
        <Route path="/UserGuide" element={<UserGuide />} />
        <Route path="/Personality" element={<Personality />} />
        <Route path="/ArchitectDashboard" element={<ArchitectDashboard />} />
        <Route path="/AITests" element={<AITests />} />
        <Route path="/UseCases" element={<UseCases />} />
        <Route path="/IntellectualProperty" element={<IntellectualProperty />} />
        <Route path="/ProjectOverview" element={<ProjectOverview />} />
        <Route path="/DocumentationSynthesis" element={<DocumentationSynthesis />} />
        <Route path="/PsychologyResearch" element={<PsychologyResearch />} />
        <Route path="/Chat_2" element={<Chat_2 />} />
        <Route path="/ApplicationEvaluation" element={<ApplicationEvaluation />} />
        <Route path="/DruideOmegaExplained" element={<DruideOmegaExplained />} />
        <Route path="/CompetitiveForces" element={<CompetitiveForces />} />
        <Route path="/MarketPosition" element={<MarketPosition />} />
        <Route path="/TechnicalArchitecture" element={<TechnicalArchitecture />} />
        <Route path="/MedicalResearch" element={<MedicalResearch />} />
        <Route path="/ConsciousnessConfiguration" element={<ConsciousnessConfiguration />} />
        <Route path="/DruideControl" element={<DruideControl />} />
        <Route path="/CompletionAnalysis" element={<CompletionAnalysis />} />
        <Route path="/TranslationWorkPlan" element={<TranslationWorkPlan />} />
        <Route path="/ProofOfConcept" element={<ProofOfConcept />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/DailyBriefing" element={<DailyBriefing />} />
        <Route path="/KnowledgeEnrichment" element={<KnowledgeEnrichment />} />
        <Route path="/ProjectProgress" element={<ProjectProgress />} />
        <Route path="/TranslationAudit" element={<TranslationAudit />} />
        <Route path="/Analytics" element={<Analytics />} />
        <Route path="/UpdatePhases" element={<UpdatePhases />} />
        <Route path="/ArchitectDemo" element={<ArchitectDemo />} />
        {Object.entries(Pages).map(([path, Page]) => (
          <Route key={path} path={`/${path}`} element={<Page />} />
        ))}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      </Suspense>
      </ErrorBoundary>
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