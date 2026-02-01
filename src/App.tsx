// ============================================================================
// NANCY CV - Application principale
// ============================================================================

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import InstallPrompt from "./components/InstallPrompt/InstallPrompt";
import FaqPage from "./pages/FAQPage";
import MainLayout from './components/Layout/MainLayout';
import { CVEditor } from './components/editor';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Landing Page Brutalist */}
                    <Route path="/" element={<HomePage />} />
                    
                    {/* Éditeur de CV - Route protégée */}
                    <Route path="/create" element={
                        <ProtectedRoute>
                            <CVEditor />
                        </ProtectedRoute>
                    } />
                    
                    {/* Dashboard - Route protégée */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    } />
                    
                    {/* FAQ */}
                    <Route path="/faq" element={
                         <MainLayout>
                            <FaqPage />
                         </MainLayout>
                    } />
                </Routes>
                
                {/* Prompt d'installation PWA */}
                <InstallPrompt />
            </Router>
        </AuthProvider>
    );
}

export default App;
