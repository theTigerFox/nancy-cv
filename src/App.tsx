import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EditorPage from './pages/EditorPage';
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
                
                {/* Page d'édition (Ancienne HomePage) enveloppée dans le Layout */}
                <Route path="/create" element={
                    <MainLayout>
                        <EditorPage />
                    </MainLayout>
                } />
                
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
