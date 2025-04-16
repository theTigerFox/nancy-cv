import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';

const InstallPrompt: React.FC = () => {
    const [showPrompt, setShowPrompt] = useState(false);
    const [installPromptEvent, setInstallPromptEvent] = useState<any>(null);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Vérifier si l'app est déjà installée
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            return;
        }

        // Détecter iOS
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        setIsIOS(isIOSDevice);

        // Écouter l'événement beforeinstallprompt
        const handleBeforeInstallPrompt = (e: Event) => {
            // Empêcher Chrome 67+ d'afficher automatiquement le prompt
            e.preventDefault();
            // Stocker l'événement pour l'utiliser plus tard
            setInstallPromptEvent(e);
            // Afficher notre propre UI
            setShowPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Vérifier si l'application a été installée
        window.addEventListener('appinstalled', () => {
            setIsInstalled(true);
            setShowPrompt(false);
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = () => {
        if (!installPromptEvent) return;

        // Afficher le prompt d'installation
        installPromptEvent.prompt();

        // Attendre que l'utilisateur réponde au prompt
        installPromptEvent.userChoice.then((choiceResult: { outcome: string }) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('Utilisateur a accepté l\'installation');
                setIsInstalled(true);
            } else {
                console.log('Utilisateur a refusé l\'installation');
            }
            setInstallPromptEvent(null);
            setShowPrompt(false);
        });
    };

    const dismissPrompt = () => {
        setShowPrompt(false);
        // Sauvegarder dans localStorage pour ne pas afficher trop souvent
        localStorage.setItem('installPromptDismissed', Date.now().toString());
    };

    // Ne pas afficher si déjà installé
    if (isInstalled) return null;

    // Ne pas afficher si pas d'événement d'installation et pas iOS
    if (!showPrompt && !isIOS) return null;

    return (
        <AnimatePresence>
            {showPrompt && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ duration: 0.3 }}
                    className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-4 sm:bottom-4 sm:max-w-sm z-50"
                >
                    <div className="bg-white rounded-lg shadow-lg border border-purple-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-pink-500 to-indigo-600 px-4 py-2 text-white flex justify-between items-center">
                            <h3 className="font-medium text-sm">Installer NancyCV</h3>
                            <button
                                onClick={dismissPrompt}
                                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <div className="p-4">
                            <p className="text-sm text-gray-600 mb-3">
                                {isIOS ?
                                    "Ajoutez NancyCV à votre écran d'accueil pour y accéder plus rapidement ! Appuyez sur l'icône de partage puis \"Sur l'écran d'accueil\"." :
                                    "Installez NancyCV sur votre appareil pour y accéder plus rapidement, même hors ligne !"}
                            </p>

                            {!isIOS && (
                                <button
                                    onClick={handleInstallClick}
                                    className="w-full bg-gradient-to-r from-pink-500 to-indigo-600 text-white py-2 px-4 rounded-lg text-sm flex items-center justify-center"
                                >
                                    <Download size={16} className="mr-2" />
                                    Installer l'application
                                </button>
                            )}

                            {isIOS && (
                                <div className="flex items-center text-sm text-indigo-600">
                                    <span className="mr-2">1. Appuyez sur</span>
                                    <svg className="w-5 h-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zM13 7h-2v4H7v2h4v4h2v-4h4v-2h-4z"></path>
                                    </svg>
                                    <span className="ml-2">puis "Sur l'écran d'accueil"</span>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default InstallPrompt;