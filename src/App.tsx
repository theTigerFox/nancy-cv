import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import IntroPage from './pages/IntroPage';
import InstallPrompt from "./components/InstallPrompt/InstallPrompt.tsx";
import FaqPage from "./pages/FAQPage.tsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<IntroPage />} />
                <Route path="/create" element={<HomePage />} />
                <Route path="/faq" element={<FaqPage />} />
            </Routes>
            {/* Composant de prompt d'installation */}
            <InstallPrompt />
        </Router>
    );
}

export default App;