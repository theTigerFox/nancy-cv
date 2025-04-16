// Configuration pour les appels API
export const API_CONFIG = {
    // URL de l'API backend pour Gemini
    BACKEND_URL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001/api',

    // URL directe de l'API Gemini (si utilisée côté client pour les tests)
    GEMINI_API_URL: process.env.REACT_APP_GEMINI_API_URL,

    // Endpoints
    ENDPOINTS: {
        GENERATE_CV: '/generate-cv',
    },

    // Options par défaut
    DEFAULT_OPTIONS: {
        headers: {
            'Content-Type': 'application/json',
        },
    },
};

// Utilitaire pour générer des URLs complètes
export const getApiUrl = (endpoint: string): string => {
    return `${API_CONFIG.BACKEND_URL}${endpoint}`;
};

// Fonction pour gérer les erreurs d'API de manière cohérente
export const handleApiError = (error: any): { message: string } => {
    console.error('API Error:', error);

    if (error.response) {
        // La requête a été faite et le serveur a répondu avec un code d'erreur
        return {
            message: error.response.data?.message ||
                `Erreur serveur (${error.response.status})`
        };
    } else if (error.request) {
        // La requête a été faite mais aucune réponse n'a été reçue
        return {
            message: "Aucune réponse du serveur. Vérifiez votre connexion internet."
        };
    } else {
        // Une erreur s'est produite lors de la configuration de la requête
        return {
            message: error.message || "Une erreur inattendue s'est produite."
        };
    }
};