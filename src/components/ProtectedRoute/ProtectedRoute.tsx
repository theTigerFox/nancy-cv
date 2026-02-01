// ============================================================================
// NANCY CV - Protected Route Component
// ============================================================================

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { LoginPrompt } from '../Auth/AuthComponents';

interface ProtectedRouteProps {
    children: React.ReactNode;
    fallback?: 'redirect' | 'login-prompt';
    redirectTo?: string;
}

/**
 * ProtectedRoute - Protège une route en exigeant une authentification
 * 
 * @param children - Le contenu à afficher si l'utilisateur est connecté
 * @param fallback - 'redirect' pour rediriger, 'login-prompt' pour afficher une page de connexion
 * @param redirectTo - URL de redirection si fallback='redirect'
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
    children, 
    fallback = 'login-prompt',
    redirectTo = '/'
}) => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();
    
    // Afficher un loader pendant la vérification de l'auth
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FFFBF5]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <Loader2 size={48} className="animate-spin text-brutal-blue" />
                    <p className="font-bold text-gray-600">Chargement...</p>
                </motion.div>
            </div>
        );
    }
    
    // Si non authentifié
    if (!isAuthenticated) {
        // Option 1: Redirection simple
        if (fallback === 'redirect') {
            return <Navigate to={redirectTo} state={{ from: location }} replace />;
        }
        
        // Option 2: Afficher une page de connexion
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FFFBF5]">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md mx-4"
                >
                    <div className="bg-white border-4 border-black shadow-brutal">
                        <div className="bg-black text-white px-6 py-3">
                            <h1 className="font-black text-lg uppercase tracking-wider">
                                Accès Requis
                            </h1>
                        </div>
                        <LoginPrompt 
                            title="Connexion requise"
                            subtitle="Connectez-vous pour créer et sauvegarder vos CV"
                        />
                    </div>
                    
                    {/* Bouton retour */}
                    <motion.a
                        href="/"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="block text-center mt-6 text-sm text-gray-500 hover:text-black transition-colors"
                    >
                        Retour à l'accueil
                    </motion.a>
                </motion.div>
            </div>
        );
    }
    
    // Utilisateur authentifié - afficher le contenu
    return <>{children}</>;
};

export default ProtectedRoute;
