// ============================================================================
// NANCY CV - Firebase Configuration & Services
// ============================================================================

import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signOut as firebaseSignOut,
    onAuthStateChanged,
    type User
} from 'firebase/auth';
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc, 
    collection,
    query,
    where,
    getDocs,
    deleteDoc,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';
import type { CVData } from '../types/cv';

// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCM37UAYz5bRnG4tt2M00WHd7BeaS0p5KU",
    authDomain: "nancv-2a452.firebaseapp.com",
    projectId: "nancv-2a452",
    storageBucket: "nancv-2a452.firebasestorage.app",
    messagingSenderId: "678172076611",
    appId: "1:678172076611:web:6b494511535897bf5702f6",
    measurementId: "G-GW9B6XY8DQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    createdAt: Timestamp | null;
    lastLoginAt: Timestamp | null;
    cvCount: number;
}

export interface SavedCV {
    id: string;
    userId: string;
    name: string;
    data: CVData;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    isDefault?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Authentication Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Connexion avec Google
 */
export const signInWithGoogle = async (): Promise<User | null> => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        // Créer ou mettre à jour le profil utilisateur dans Firestore
        await createOrUpdateUserProfile(user);
        
        return user;
    } catch (error: any) {
        console.error('Erreur de connexion Google:', error);
        
        // Gestion des erreurs spécifiques
        if (error.code === 'auth/popup-closed-by-user') {
            throw new Error('Connexion annulée');
        }
        if (error.code === 'auth/popup-blocked') {
            throw new Error('Le popup a été bloqué. Autorisez les popups pour ce site.');
        }
        
        throw new Error('Erreur de connexion. Veuillez réessayer.');
    }
};

/**
 * Déconnexion
 */
export const signOut = async (): Promise<void> => {
    try {
        await firebaseSignOut(auth);
    } catch (error) {
        console.error('Erreur de déconnexion:', error);
        throw new Error('Erreur lors de la déconnexion');
    }
};

/**
 * Observer les changements d'état d'authentification
 */
export const onAuthChange = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
};

// ─────────────────────────────────────────────────────────────────────────────
// User Profile Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Créer ou mettre à jour le profil utilisateur lors de la première connexion
 */
export const createOrUpdateUserProfile = async (user: User): Promise<void> => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
        // Première connexion - créer le profil
        const newProfile: Omit<UserProfile, 'createdAt' | 'lastLoginAt'> & { 
            createdAt: ReturnType<typeof serverTimestamp>;
            lastLoginAt: ReturnType<typeof serverTimestamp>;
        } = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            createdAt: serverTimestamp(),
            lastLoginAt: serverTimestamp(),
            cvCount: 0,
        };
        
        await setDoc(userRef, newProfile);
        console.log('Nouveau profil utilisateur créé:', user.uid);
    } else {
        // Mise à jour de la dernière connexion
        await setDoc(userRef, {
            lastLoginAt: serverTimestamp(),
            // Mettre à jour les infos potentiellement changées
            displayName: user.displayName,
            photoURL: user.photoURL,
        }, { merge: true });
    }
};

/**
 * Récupérer le profil utilisateur
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
        return userSnap.data() as UserProfile;
    }
    
    return null;
};

// ─────────────────────────────────────────────────────────────────────────────
// CV Storage Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Remove undefined values recursively from an object
 * Firestore does not accept undefined values
 */
function removeUndefinedValues<T>(obj: T): T {
    if (obj === null || obj === undefined) {
        return obj;
    }
    
    if (Array.isArray(obj)) {
        return obj.map(item => removeUndefinedValues(item)) as T;
    }
    
    if (typeof obj === 'object' && obj !== null) {
        const cleaned: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(obj)) {
            if (value !== undefined) {
                cleaned[key] = removeUndefinedValues(value);
            }
        }
        return cleaned as T;
    }
    
    return obj;
}

/**
 * Sauvegarder un CV
 */
export const saveCV = async (
    userId: string, 
    cvData: CVData, 
    cvName?: string,
    cvId?: string
): Promise<string> => {
    const cvCollection = collection(db, 'users', userId, 'cvs');
    const finalCvId = cvId || cvData.id;
    const cvRef = doc(cvCollection, finalCvId);
    
    // Clean the cvData to remove undefined values
    const cleanedCvData = removeUndefinedValues(cvData);
    
    const cvDoc: Omit<SavedCV, 'createdAt' | 'updatedAt'> & {
        createdAt?: ReturnType<typeof serverTimestamp>;
        updatedAt: ReturnType<typeof serverTimestamp>;
    } = {
        id: finalCvId,
        userId,
        name: cvName || `${cvData.personalInfo.firstName || 'Mon'} ${cvData.personalInfo.lastName || 'CV'}`.trim() || 'Mon CV',
        data: cleanedCvData,
        updatedAt: serverTimestamp(),
    };
    
    // Vérifier si le CV existe déjà
    const existingCV = await getDoc(cvRef);
    if (!existingCV.exists()) {
        cvDoc.createdAt = serverTimestamp();
    }
    
    await setDoc(cvRef, cvDoc, { merge: true });
    
    // Mettre à jour le compteur de CV
    await updateCVCount(userId);
    
    return finalCvId;
};

/**
 * Récupérer tous les CV d'un utilisateur
 */
export const getUserCVs = async (userId: string): Promise<SavedCV[]> => {
    const cvCollection = collection(db, 'users', userId, 'cvs');
    const q = query(cvCollection);
    const querySnapshot = await getDocs(q);
    
    const cvs: SavedCV[] = [];
    querySnapshot.forEach((doc) => {
        cvs.push(doc.data() as SavedCV);
    });
    
    // Trier par date de mise à jour (plus récent en premier)
    return cvs.sort((a, b) => {
        const dateA = a.updatedAt?.toMillis() || 0;
        const dateB = b.updatedAt?.toMillis() || 0;
        return dateB - dateA;
    });
};

/**
 * Récupérer un CV spécifique
 */
export const getCV = async (userId: string, cvId: string): Promise<SavedCV | null> => {
    const cvRef = doc(db, 'users', userId, 'cvs', cvId);
    const cvSnap = await getDoc(cvRef);
    
    if (cvSnap.exists()) {
        return cvSnap.data() as SavedCV;
    }
    
    return null;
};

/**
 * Supprimer un CV
 */
export const deleteCV = async (userId: string, cvId: string): Promise<void> => {
    const cvRef = doc(db, 'users', userId, 'cvs', cvId);
    await deleteDoc(cvRef);
    
    // Mettre à jour le compteur
    await updateCVCount(userId);
};

/**
 * Mettre à jour le compteur de CV
 */
const updateCVCount = async (userId: string): Promise<void> => {
    const cvCollection = collection(db, 'users', userId, 'cvs');
    const querySnapshot = await getDocs(cvCollection);
    
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
        cvCount: querySnapshot.size
    }, { merge: true });
};

/**
 * Définir un CV comme CV par défaut
 */
export const setDefaultCV = async (userId: string, cvId: string): Promise<void> => {
    // D'abord, retirer le flag default de tous les CV
    const cvCollection = collection(db, 'users', userId, 'cvs');
    const querySnapshot = await getDocs(cvCollection);
    
    const batch: Promise<void>[] = [];
    querySnapshot.forEach((docSnap) => {
        const cvRef = doc(db, 'users', userId, 'cvs', docSnap.id);
        batch.push(setDoc(cvRef, { isDefault: docSnap.id === cvId }, { merge: true }));
    });
    
    await Promise.all(batch);
};

export default app;
