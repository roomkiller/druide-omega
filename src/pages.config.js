import Chat from './pages/Chat';
import Consciousness from './pages/Consciousness';
import Memory from './pages/Memory';
import Knowledge from './pages/Knowledge';
import Layout from './Layout.jsx';


export const PAGES = {
    "Chat": Chat,
    "Consciousness": Consciousness,
    "Memory": Memory,
    "Knowledge": Knowledge,
}

export const pagesConfig = {
    mainPage: "Chat",
    Pages: PAGES,
    Layout: Layout,
};