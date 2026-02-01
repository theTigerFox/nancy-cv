// ============================================================================
// NANCY CV - Authentication Context
// ============================================================================

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User } from 'firebase/auth';
import { 
    auth, 
    signInWithGoogle, 
    signOut, 
    onAuthChange,
    getUserProfile,
    getUserCVs,
    saveCV as firebaseSaveCV,
    deleteCV as firebaseDeleteCV,
    getCV,
    type UserProfile,
    type SavedCV
} from '../lib/firebase';
import type { CVData } from '../types/cv';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface AuthContextType {
    // État
    user: User | null;
    profile: UserProfile | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    
    // Auth actions
    login: () => Promise<void>;
    logout: () => Promise<void>;
    
    // CV actions
    savedCVs: SavedCV[];
    loadingCVs: boolean;
    saveCV: (cvData: CVData, name?: string, cvId?: string) => Promise<string>;
    loadCV: (cvId: string) => Promise<CVData | null>;
    deleteCV: (cvId: string) => Promise<void>;
    refreshCVs: () => Promise<void>;
    
    // État de sauvegarde
    isSaving: boolean;
    lastSaved: Date | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ─────────────────────────────────────────────────────────────────────────────
// Provider Component
// ─────────────────────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [savedCVs, setSavedCVs] = useState<SavedCV[]>([]);
    const [loadingCVs, setLoadingCVs] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    
    // Écouter les changements d'authentification
    useEffect(() => {
        const unsubscribe = onAuthChange(async (firebaseUser) => {
            setUser(firebaseUser);
            
            if (firebaseUser) {
                // Charger le profil utilisateur
                const userProfile = await getUserProfile(firebaseUser.uid);
                setProfile(userProfile);
                
                // Charger les CVs
                setLoadingCVs(true);
                try {
                    const cvs = await getUserCVs(firebaseUser.uid);
                    setSavedCVs(cvs);
                } catch (error) {
                    console.error('Erreur chargement CVs:', error);
                } finally {
                    setLoadingCVs(false);
                }
            } else {
                setProfile(null);
                setSavedCVs([]);
            }
            
            setIsLoading(false);
        });
        
        return () => unsubscribe();
    }, []);
    
    // Connexion
    const login = useCallback(async () => {
        setIsLoading(true);
        try {
            await signInWithGoogle();
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    // Déconnexion
    const logout = useCallback(async () => {
        await signOut();
        setProfile(null);
        setSavedCVs([]);
    }, []);
    
    // Sauvegarder un CV
    const saveCV = useCallback(async (cvData: CVData, name?: string, cvId?: string): Promise<string> => {
        if (!user) throw new Error('Utilisateur non connecté');
        
        setIsSaving(true);
        try {
            const savedId = await firebaseSaveCV(user.uid, cvData, name, cvId);
            setLastSaved(new Date());
            
            // Rafraîchir la liste des CVs
            const cvs = await getUserCVs(user.uid);
            setSavedCVs(cvs);
            
            return savedId;
        } finally {
            setIsSaving(false);
        }
    }, [user]);
    
    // Charger un CV
    const loadCV = useCallback(async (cvId: string): Promise<CVData | null> => {
        if (!user) return null;
        
        const cv = await getCV(user.uid, cvId);
        return cv?.data || null;
    }, [user]);
    
    // Supprimer un CV
    const deleteCV = useCallback(async (cvId: string): Promise<void> => {
        if (!user) throw new Error('Utilisateur non connecté');
        
        await firebaseDeleteCV(user.uid, cvId);
        
        // Rafraîchir la liste
        const cvs = await getUserCVs(user.uid);
        setSavedCVs(cvs);
    }, [user]);
    
    // Rafraîchir les CVs
    const refreshCVs = useCallback(async (): Promise<void> => {
        if (!user) return;
        
        setLoadingCVs(true);
        try {
            const cvs = await getUserCVs(user.uid);
            setSavedCVs(cvs);
        } finally {
            setLoadingCVs(false);
        }
    }, [user]);
    
    const value: AuthContextType = {
        user,
        profile,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        savedCVs,
        loadingCVs,
        saveCV,
        loadCV,
        deleteCV,
        refreshCVs,
        isSaving,
        lastSaved,
    };
    
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    
    if (!context) {
        throw new Error('useAuth doit être utilisé dans un AuthProvider');
    }
    
    return context;
};

export default AuthContext;
