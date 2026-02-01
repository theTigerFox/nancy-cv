import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import DashboardPage from './pages/DashboardPage';
import InstallPrompt from "./components/InstallPrompt/InstallPrompt.tsx";
import FaqPage from "./pages/FAQPage.tsx";
import MainLayout from './components/Layout/MainLayout';

function App() {
    return (
        <Router>
            <Routes>
                {/* Nouvelle Landing Page Brutalist */}
                <Route path="/" element={<HomePage />} />
                
                {/* Nouvelle Page de Création Brutalist - Sans MainLayout car elle a son propre header */}
                <Route path="/create" element={<CreatePage />} />
                
                {/* Dashboard */}
                <Route path="/dashboard" element={<DashboardPage />} />
                
                {/* FAQ */}
                <Route path="/faq" element={
                     <MainLayout>
                        <FaqPage />
                     </MainLayout>
                } />
            </Routes>
            {/* Composant de prompt d'installation */}
            <InstallPrompt />
        </Router>
    );
}

export default App;
