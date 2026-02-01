// ============================================================================
// NANCY CV - PWA Install Prompt (Brutalist Design)
// ============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Share, ArrowDown, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const DISMISS_STORAGE_KEY = 'pwa_install_dismissed';
const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 jours en ms
const SHOW_DELAY = 3000; // 3 secondes avant d'afficher

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

const InstallPrompt: React.FC = () => {
    const [showPrompt, setShowPrompt] = useState(false);
    const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [installStep, setInstallStep] = useState<'prompt' | 'installing' | 'success'>('prompt');
    const [isMinimized, setIsMinimized] = useState(false);

    // ─────────────────────────────────────────────────────────────────────────
    // Check if should show based on dismiss history
    // ─────────────────────────────────────────────────────────────────────────
    
    const shouldShowPrompt = useCallback(() => {
        const dismissedAt = localStorage.getItem(DISMISS_STORAGE_KEY);
        if (!dismissedAt) return true;
        
        const elapsed = Date.now() - parseInt(dismissedAt, 10);
        return elapsed > DISMISS_DURATION;
    }, []);

    // ─────────────────────────────────────────────────────────────────────────
    // Initialize
    // ─────────────────────────────────────────────────────────────────────────
    
    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            return;
        }

        // Check dismiss status
        if (!shouldShowPrompt()) return;

        // Detect iOS
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        setIsIOS(isIOSDevice);

        // For iOS, show after delay
        if (isIOSDevice) {
            const timer = setTimeout(() => setShowPrompt(true), SHOW_DELAY);
            return () => clearTimeout(timer);
        }

        // Listen for beforeinstallprompt event
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setInstallPromptEvent(e as BeforeInstallPromptEvent);
            
            // Show after delay
            setTimeout(() => setShowPrompt(true), SHOW_DELAY);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Listen for successful install
        const handleAppInstalled = () => {
            setInstallStep('success');
            setTimeout(() => {
                setIsInstalled(true);
                setShowPrompt(false);
            }, 2000);
        };

        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, [shouldShowPrompt]);

    // ─────────────────────────────────────────────────────────────────────────
    // Handlers
    // ─────────────────────────────────────────────────────────────────────────
    
    const handleInstallClick = async () => {
        if (!installPromptEvent) return;

        setInstallStep('installing');
        
        try {
            await installPromptEvent.prompt();
            const { outcome } = await installPromptEvent.userChoice;
            
            if (outcome === 'accepted') {
                setInstallStep('success');
            } else {
                setInstallStep('prompt');
            }
        } catch (error) {
            console.error('[PWA] Install error:', error);
            setInstallStep('prompt');
        }
        
        setInstallPromptEvent(null);
    };

    const dismissPrompt = () => {
        setShowPrompt(false);
        localStorage.setItem(DISMISS_STORAGE_KEY, Date.now().toString());
    };

    const toggleMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    // ─────────────────────────────────────────────────────────────────────────
    // Render guards
    // ─────────────────────────────────────────────────────────────────────────
    
    if (isInstalled) return null;
    if (!showPrompt) return null;

    // ─────────────────────────────────────────────────────────────────────────
    // Minimized state - just a floating button
    // ─────────────────────────────────────────────────────────────────────────
    
    if (isMinimized) {
        return (
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                onClick={toggleMinimize}
                className={cn(
                    "fixed bottom-6 right-6 z-50",
                    "w-14 h-14 flex items-center justify-center",
                    "bg-black border-3 border-black text-white",
                    "hover:bg-brutal-lime hover:text-black transition-colors",
                    "shadow-brutal"
                )}
            >
                <Download size={24} />
            </motion.button>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Full prompt
    // ─────────────────────────────────────────────────────────────────────────
    
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 100, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 100, scale: 0.9 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed bottom-6 right-6 left-6 sm:left-auto sm:w-[380px] z-50"
            >
                <div className="bg-white border-4 border-black shadow-brutal overflow-hidden">
                    {/* Header */}
                    <div className="bg-black text-white px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-brutal-lime flex items-center justify-center">
                                <Smartphone size={18} className="text-black" />
                            </div>
                            <span className="font-black text-sm uppercase tracking-wider">
                                Installer l'App
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={toggleMinimize}
                                className="p-1.5 hover:bg-white/10 transition-colors"
                                aria-label="Réduire"
                            >
                                <ArrowDown size={16} />
                            </button>
                            <button
                                onClick={toggleMinimize}
                                className="p-1.5 hover:bg-white/10 transition-colors"
                                aria-label="Fermer (réduire)"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-5">
                        {installStep === 'success' ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-4"
                            >
                                <div className="w-16 h-16 mx-auto mb-4 bg-brutal-lime border-3 border-black flex items-center justify-center">
                                    <Check size={32} strokeWidth={3} />
                                </div>
                                <p className="font-black text-lg">Installation réussie</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Nancy CV est maintenant sur votre appareil
                                </p>
                            </motion.div>
                        ) : (
                            <>
                                {/* Benefits */}
                                <div className="space-y-3 mb-5">
                                    <h3 className="font-black text-base">
                                        Accédez à Nancy CV plus rapidement
                                    </h3>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-start gap-2">
                                            <span className="w-5 h-5 flex-shrink-0 bg-brutal-lime border-2 border-black flex items-center justify-center text-xs font-bold">
                                                1
                                            </span>
                                            <span>Lancez l'app depuis votre écran d'accueil</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-5 h-5 flex-shrink-0 bg-brutal-lime border-2 border-black flex items-center justify-center text-xs font-bold">
                                                2
                                            </span>
                                            <span>Travaillez sur vos CV même hors connexion</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-5 h-5 flex-shrink-0 bg-brutal-lime border-2 border-black flex items-center justify-center text-xs font-bold">
                                                3
                                            </span>
                                            <span>Recevez des notifications de mise à jour</span>
                                        </li>
                                    </ul>
                                </div>
                                
                                {/* iOS Instructions */}
                                {isIOS ? (
                                    <div className="border-3 border-black p-4 bg-gray-50">
                                        <p className="font-bold text-sm mb-3 flex items-center gap-2">
                                            <Share size={16} />
                                            Comment installer sur iOS:
                                        </p>
                                        <ol className="text-sm space-y-2 text-gray-600">
                                            <li className="flex items-start gap-2">
                                                <span className="font-bold">1.</span>
                                                <span>
                                                    Appuyez sur le bouton de partage
                                                    <span className="inline-flex items-center justify-center w-5 h-5 mx-1 border border-gray-300 rounded">
                                                        <Share size={12} />
                                                    </span>
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="font-bold">2.</span>
                                                <span>Faites défiler et appuyez sur "Sur l'écran d'accueil"</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="font-bold">3.</span>
                                                <span>Appuyez sur "Ajouter"</span>
                                            </li>
                                        </ol>
                                    </div>
                                ) : (
                                    /* Install Button */
                                    <button
                                        onClick={handleInstallClick}
                                        disabled={installStep === 'installing'}
                                        className={cn(
                                            "w-full py-3 px-4 border-3 border-black font-black text-sm uppercase",
                                            "flex items-center justify-center gap-2 transition-all",
                                            installStep === 'installing'
                                                ? "bg-gray-100 text-gray-400 cursor-wait"
                                                : "bg-brutal-lime hover:shadow-brutal hover:-translate-y-0.5"
                                        )}
                                    >
                                        {installStep === 'installing' ? (
                                            <>
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                                >
                                                    <Download size={18} />
                                                </motion.div>
                                                Installation...
                                            </>
                                        ) : (
                                            <>
                                                <Download size={18} />
                                                Installer Nancy CV
                                            </>
                                        )}
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                    
                    {/* Footer */}
                    {installStep !== 'success' && (
                        <div className="px-5 pb-4">
                            <p className="text-[10px] text-gray-400 text-center">
                                L'installation est gratuite et ne prend que quelques secondes.
                                <br />
                                Aucun téléchargement depuis un store requis.
                            </p>
                        </div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default InstallPrompt;