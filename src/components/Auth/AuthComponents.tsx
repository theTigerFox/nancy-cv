// ============================================================================
// NANCY CV - User Authentication Components
// ============================================================================

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LogIn, 
    LogOut, 
    User, 
    FileText, 
    Settings, 
    ChevronDown,
    Loader2,
    FolderOpen,
    Plus,
    Trash2,
    Clock
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// Login Button (pour utilisateurs non connectés)
// ─────────────────────────────────────────────────────────────────────────────

export const LoginButton: React.FC<{ className?: string; variant?: 'default' | 'minimal' }> = ({ 
    className,
    variant = 'default'
}) => {
    const { login, isLoading } = useAuth();
    const [error, setError] = useState<string | null>(null);
    
    const handleLogin = async () => {
        setError(null);
        try {
            await login();
        } catch (err: any) {
            setError(err.message);
        }
    };
    
    if (variant === 'minimal') {
        return (
            <button
                onClick={handleLogin}
                disabled={isLoading}
                className={cn(
                    "flex items-center gap-2 px-4 py-2 text-sm font-bold transition-all",
                    "hover:opacity-80 disabled:opacity-50",
                    className
                )}
            >
                {isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                ) : (
                    <LogIn size={16} />
                )}
                Connexion
            </button>
        );
    }
    
    return (
        <div className="relative">
            <button
                onClick={handleLogin}
                disabled={isLoading}
                className={cn(
                    "flex items-center gap-3 px-5 py-2.5 border-3 border-black bg-white font-bold text-sm",
                    "hover:bg-brutal-lime hover:shadow-brutal transition-all",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    className
                )}
            >
                {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                ) : (
                    <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continuer avec Google
                    </>
                )}
            </button>
            
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 right-0 mt-2 p-2 bg-red-50 border-2 border-red-200 text-red-600 text-xs"
                >
                    {error}
                </motion.div>
            )}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// User Menu (pour utilisateurs connectés)
// ─────────────────────────────────────────────────────────────────────────────

export const UserMenu: React.FC<{ className?: string }> = ({ className }) => {
    const { user, profile, logout, savedCVs, loadingCVs, deleteCV } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [showCVs, setShowCVs] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    
    // Fermer le menu si on clique en dehors
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setShowCVs(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    const handleDeleteCV = async (cvId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Supprimer ce CV définitivement ?')) {
            setDeletingId(cvId);
            try {
                await deleteCV(cvId);
            } finally {
                setDeletingId(null);
            }
        }
    };
    
    const handleLoadCV = (cvId: string) => {
        navigate(`/create?cv=${cvId}`);
        setIsOpen(false);
        setShowCVs(false);
    };
    
    if (!user) return null;
    
    return (
        <div className={cn("relative", className)} ref={menuRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-3 px-3 py-2 border-3 border-black bg-white",
                    "hover:bg-gray-50 transition-all group",
                    isOpen && "bg-gray-50"
                )}
            >
                {user.photoURL ? (
                    <img
                        src={user.photoURL}
                        alt={user.displayName || 'Avatar'}
                        className="w-8 h-8 rounded-full border-2 border-black object-cover"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full border-2 border-black bg-brutal-lime flex items-center justify-center">
                        <User size={16} />
                    </div>
                )}
                <div className="hidden sm:block text-left">
                    <p className="text-sm font-bold truncate max-w-[120px]">
                        {user.displayName || 'Utilisateur'}
                    </p>
                    <p className="text-[10px] text-gray-500">
                        {savedCVs.length} CV{savedCVs.length > 1 ? 's' : ''} sauvegardé{savedCVs.length > 1 ? 's' : ''}
                    </p>
                </div>
                <ChevronDown 
                    size={16} 
                    className={cn(
                        "transition-transform text-gray-400",
                        isOpen && "rotate-180"
                    )} 
                />
            </button>
            
            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-72 bg-white border-3 border-black shadow-brutal z-50"
                    >
                        {/* Header */}
                        <div className="p-4 border-b-2 border-black bg-gray-50">
                            <div className="flex items-center gap-3">
                                {user.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt=""
                                        className="w-12 h-12 rounded-full border-2 border-black"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full border-2 border-black bg-brutal-lime flex items-center justify-center">
                                        <User size={24} />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold truncate">{user.displayName}</p>
                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* CVs Section */}
                        <div className="border-b-2 border-black">
                            <button
                                onClick={() => setShowCVs(!showCVs)}
                                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                                <span className="flex items-center gap-3 font-bold text-sm">
                                    <FolderOpen size={18} />
                                    Mes CV ({savedCVs.length})
                                </span>
                                <ChevronDown 
                                    size={16} 
                                    className={cn("transition-transform", showCVs && "rotate-180")} 
                                />
                            </button>
                            
                            <AnimatePresence>
                                {showCVs && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        {loadingCVs ? (
                                            <div className="p-4 flex items-center justify-center">
                                                <Loader2 size={20} className="animate-spin text-gray-400" />
                                            </div>
                                        ) : savedCVs.length === 0 ? (
                                            <div className="p-4 text-center text-sm text-gray-500">
                                                Aucun CV sauvegardé
                                            </div>
                                        ) : (
                                            <div className="max-h-48 overflow-y-auto">
                                                {savedCVs.map((cv) => (
                                                    <div
                                                        key={cv.id}
                                                        onClick={() => handleLoadCV(cv.id)}
                                                        className="px-4 py-2 hover:bg-brutal-lime/20 cursor-pointer flex items-center justify-between group/item border-t border-gray-100"
                                                    >
                                                        <div className="flex items-center gap-2 min-w-0">
                                                            <FileText size={14} className="text-gray-400 shrink-0" />
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-medium truncate">{cv.name}</p>
                                                                <p className="text-[10px] text-gray-400 flex items-center gap-1">
                                                                    <Clock size={10} />
                                                                    {cv.updatedAt?.toDate?.()?.toLocaleDateString('fr-FR') || 'N/A'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={(e) => handleDeleteCV(cv.id, e)}
                                                            className="opacity-0 group-hover/item:opacity-100 p-1 hover:bg-red-100 text-red-500 transition-all"
                                                            disabled={deletingId === cv.id}
                                                        >
                                                            {deletingId === cv.id ? (
                                                                <Loader2 size={14} className="animate-spin" />
                                                            ) : (
                                                                <Trash2 size={14} />
                                                            )}
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        
                                        {/* New CV Button */}
                                        <button
                                            onClick={() => {
                                                navigate('/create');
                                                setIsOpen(false);
                                            }}
                                            className="w-full px-4 py-2 flex items-center gap-2 text-sm font-bold text-brutal-blue hover:bg-brutal-blue/10 transition-colors border-t border-gray-200"
                                        >
                                            <Plus size={16} />
                                            Nouveau CV
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        
                        {/* Actions */}
                        <div className="p-2">
                            <button
                                onClick={logout}
                                className="w-full px-4 py-2 flex items-center gap-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors rounded"
                            >
                                <LogOut size={18} />
                                Déconnexion
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Auth Button (auto-switch entre Login et UserMenu)
// ─────────────────────────────────────────────────────────────────────────────

export const AuthButton: React.FC<{ className?: string }> = ({ className }) => {
    const { isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) {
        return (
            <div className={cn("flex items-center gap-2 px-4 py-2", className)}>
                <Loader2 size={18} className="animate-spin text-gray-400" />
            </div>
        );
    }
    
    return isAuthenticated ? (
        <UserMenu className={className} />
    ) : (
        <LoginButton className={className} />
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Login Page/Modal Content
// ─────────────────────────────────────────────────────────────────────────────

export const LoginPrompt: React.FC<{ 
    title?: string;
    subtitle?: string;
    onSuccess?: () => void;
}> = ({ 
    title = "Connectez-vous pour continuer",
    subtitle = "Sauvegardez vos CV et accédez-y depuis n'importe où",
    onSuccess
}) => {
    const { login, isLoading, isAuthenticated } = useAuth();
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        if (isAuthenticated && onSuccess) {
            onSuccess();
        }
    }, [isAuthenticated, onSuccess]);
    
    const handleLogin = async () => {
        setError(null);
        try {
            await login();
        } catch (err: any) {
            setError(err.message);
        }
    };
    
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 border-4 border-black bg-brutal-lime flex items-center justify-center mb-6">
                <User size={40} />
            </div>
            
            <h2 className="text-2xl font-black uppercase mb-2">{title}</h2>
            <p className="text-gray-600 mb-8 max-w-sm">{subtitle}</p>
            
            <button
                onClick={handleLogin}
                disabled={isLoading}
                className={cn(
                    "flex items-center gap-3 px-8 py-4 border-3 border-black bg-white font-bold",
                    "hover:bg-brutal-lime hover:shadow-brutal transition-all text-lg",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
            >
                {isLoading ? (
                    <Loader2 size={24} className="animate-spin" />
                ) : (
                    <>
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continuer avec Google
                    </>
                )}
            </button>
            
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 text-red-500 text-sm"
                >
                    {error}
                </motion.p>
            )}
            
            <p className="mt-6 text-xs text-gray-400 max-w-xs">
                En vous connectant, vous acceptez que vos données de CV soient stockées de manière sécurisée.
            </p>
        </div>
    );
};

export default AuthButton;
