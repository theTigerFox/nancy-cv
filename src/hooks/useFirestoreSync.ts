// ============================================================================
// NANCY CV - Hook de synchronisation avec Firestore
// ============================================================================

import { useCallback, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCVStore } from '../store/cvStore';
import { CVData } from '../types/cv';
import { debounce } from '../lib/utils';

// Intervalle d'auto-save en millisecondes (30 secondes)
const AUTO_SAVE_INTERVAL = 30000;

/**
 * Hook pour synchroniser le CV store avec Firestore
 * 
 * Fonctionnalités:
 * - Charge un CV depuis Firestore via l'URL (?cv=ID)
 * - Auto-save périodique vers Firestore
 * - Sauvegarde manuelle
 * - Indicateurs de statut (isSaving, lastSaved)
 */
export function useFirestoreSync(cvIdFromUrl?: string | null) {
    const { 
        isAuthenticated, 
        user, 
        saveCV: saveToFirestore, 
        loadCV: loadFromFirestore,
        isSaving, 
        lastSaved,
        refreshCVs
    } = useAuth();
    
    const { cv, isDirty } = useCVStore();
    const lastSavedRef = useRef<string | null>(null);
    const hasLoadedRef = useRef(false);
    
    // ─────────────────────────────────────────────────────────────────────────
    // Charger un CV depuis Firestore
    // ─────────────────────────────────────────────────────────────────────────
    
    const loadCVFromFirestore = useCallback(async (cvId: string) => {
        if (!isAuthenticated || !cvId) return false;
        
        try {
            const cvData = await loadFromFirestore(cvId);
            if (cvData) {
                // Charger dans le store local
                useCVStore.setState({ 
                    cv: cvData, 
                    activeCVId: cvId, 
                    isDirty: false 
                });
                lastSavedRef.current = cvId;
                return true;
            }
        } catch (error) {
            console.error('[FirestoreSync] Erreur chargement CV:', error);
        }
        return false;
    }, [isAuthenticated, loadFromFirestore]);
    
    // ─────────────────────────────────────────────────────────────────────────
    // Sauvegarder vers Firestore (avec debounce)
    // ─────────────────────────────────────────────────────────────────────────
    
    const saveCVToFirestore = useCallback(async (force = false) => {
        if (!isAuthenticated || !user) {
            console.log('[FirestoreSync] Non authentifié, sauvegarde ignorée');
            return null;
        }
        
        if (!force && !isDirty) {
            console.log('[FirestoreSync] Pas de modifications, sauvegarde ignorée');
            return null;
        }
        
        try {
            // Générer un nom si vide
            const cvToSave: CVData = {
                ...cv,
                name: cv.name || `CV ${cv.personalInfo.firstName || 'Sans'} ${cv.personalInfo.lastName || 'Nom'}`.trim(),
            };
            
            const savedId = await saveToFirestore(cvToSave);
            
            if (savedId) {
                lastSavedRef.current = savedId;
                useCVStore.setState({ isDirty: false });
                
                // Rafraîchir la liste des CVs
                await refreshCVs();
            }
            
            return savedId;
        } catch (error) {
            console.error('[FirestoreSync] Erreur sauvegarde:', error);
            throw error;
        }
    }, [isAuthenticated, user, cv, isDirty, saveToFirestore, refreshCVs]);
    
    // Version debounced pour l'auto-save
    const debouncedSave = useCallback(
        debounce(() => {
            saveCVToFirestore(false);
        }, 5000),
        [saveCVToFirestore]
    );
    
    // ─────────────────────────────────────────────────────────────────────────
    // Effet: Charger CV depuis URL au montage
    // ─────────────────────────────────────────────────────────────────────────
    
    useEffect(() => {
        if (!isAuthenticated || hasLoadedRef.current || !cvIdFromUrl) return;
        
        hasLoadedRef.current = true;
        loadCVFromFirestore(cvIdFromUrl);
    }, [isAuthenticated, cvIdFromUrl, loadCVFromFirestore]);
    
    // ─────────────────────────────────────────────────────────────────────────
    // Effet: Auto-save quand le CV change
    // ─────────────────────────────────────────────────────────────────────────
    
    useEffect(() => {
        if (!isAuthenticated || !isDirty) return;
        
        // Déclencher le save debounced
        debouncedSave();
        
        // Cleanup
        return () => {
            // Annuler le debounce au démontage
        };
    }, [isAuthenticated, isDirty, cv, debouncedSave]);
    
    // ─────────────────────────────────────────────────────────────────────────
    // Effet: Auto-save périodique
    // ─────────────────────────────────────────────────────────────────────────
    
    useEffect(() => {
        if (!isAuthenticated) return;
        
        const interval = setInterval(() => {
            if (isDirty) {
                saveCVToFirestore(false);
            }
        }, AUTO_SAVE_INTERVAL);
        
        return () => clearInterval(interval);
    }, [isAuthenticated, isDirty, saveCVToFirestore]);
    
    // ─────────────────────────────────────────────────────────────────────────
    // Effet: Sauvegarder avant de quitter
    // ─────────────────────────────────────────────────────────────────────────
    
    useEffect(() => {
        if (!isAuthenticated) return;
        
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                // Sauvegarder de manière synchrone si possible
                saveCVToFirestore(true);
                
                // Avertir l'utilisateur
                e.preventDefault();
                e.returnValue = 'Vous avez des modifications non sauvegardées.';
                return e.returnValue;
            }
        };
        
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isAuthenticated, isDirty, saveCVToFirestore]);
    
    return {
        // Actions
        saveCV: () => saveCVToFirestore(true),
        loadCV: loadCVFromFirestore,
        
        // État
        isSaving,
        lastSaved,
        isDirty,
        isAuthenticated,
        
        // Info
        currentCVId: lastSavedRef.current,
    };
}

export default useFirestoreSync;
