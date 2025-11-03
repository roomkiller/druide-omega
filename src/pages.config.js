import Chat from './pages/Chat';
import Consciousness from './pages/Consciousness';
import Layout from './Layout.jsx';


export const PAGES = {
    "Chat": Chat,
    "Consciousness": Consciousness,
}

export const pagesConfig = {
    mainPage: "Chat",
    Pages: PAGES,
    Layout: Layout,
};