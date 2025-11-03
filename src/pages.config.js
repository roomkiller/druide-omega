import Chat from './pages/Chat';
import Consciousness from './pages/Consciousness';
import Memory from './pages/Memory';
import Knowledge from './pages/Knowledge';
import Personality from './pages/Personality';
import Favorites from './pages/Favorites';
import VoiceRoom from './pages/VoiceRoom';
import VisualGallery from './pages/VisualGallery';
import KnowledgeEnrichment from './pages/KnowledgeEnrichment';
import ConsciousnessEvolution from './pages/ConsciousnessEvolution';
import DailyBriefing from './pages/DailyBriefing';
import EmotionalJournal from './pages/EmotionalJournal';
import Layout from './Layout.jsx';


export const PAGES = {
    "Chat": Chat,
    "Consciousness": Consciousness,
    "Memory": Memory,
    "Knowledge": Knowledge,
    "Personality": Personality,
    "Favorites": Favorites,
    "VoiceRoom": VoiceRoom,
    "VisualGallery": VisualGallery,
    "KnowledgeEnrichment": KnowledgeEnrichment,
    "ConsciousnessEvolution": ConsciousnessEvolution,
    "DailyBriefing": DailyBriefing,
    "EmotionalJournal": EmotionalJournal,
}

export const pagesConfig = {
    mainPage: "Chat",
    Pages: PAGES,
    Layout: Layout,
};