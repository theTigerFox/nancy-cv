import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, BrainCircuit, Loader2, Mic, MicOff } from 'lucide-react'; // Ajout de Mic et MicOff
import { CvData } from '../../types/cv';
import { generateCvFromPrompt } from '../../services/aiService';

// Interface pour l'API SpeechRecognition (avec préfixe webkit pour compatibilité)
interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    onresult: ((event: any) => void) | null; // Utiliser 'any' pour simplifier la gestion des types d'événements spécifiques au navigateur
    onerror: ((event: any) => void) | null;
    onend: (() => void) | null;
}

// Type guard pour vérifier si l'objet est une instance de SpeechRecognition
declare var SpeechRecognition: {
    prototype: SpeechRecognition;
    new(): SpeechRecognition;
};
declare var webkitSpeechRecognition: {
    prototype: SpeechRecognition;
    new(): SpeechRecognition;
};

interface AiModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAiGenerated: (data: CvData) => void;
}

const AiModal: React.FC<AiModalProps> = ({ isOpen, onClose, onAiGenerated }) => {
    const [prompt, setPrompt] = useState<string>(() => {
        const savedPrompt = localStorage.getItem('nancyCvAiPrompt');
        return savedPrompt || '';
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // --- State pour la saisie vocale ---
    const [isListening, setIsListening] = useState(false);
    const [isSpeechRecognitionSupported, setIsSpeechRecognitionSupported] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    // --- Fin State Saisie Vocale ---

    // Sauvegarde du prompt dans le localStorage
    useEffect(() => {
        localStorage.setItem('nancyCvAiPrompt', prompt);
    }, [prompt]);

    // --- Initialisation de SpeechRecognition ---
    useEffect(() => {
        const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognitionAPI) {
            setIsSpeechRecognitionSupported(true);
            recognitionRef.current = new SpeechRecognitionAPI();
            if (recognitionRef.current) recognitionRef.current.continuous = true; // Continue l'écoute même après une pause            recognitionRef.current.interimResults = true; // Obtient des résultats temporaires pendant la parole
            if (recognitionRef.current) recognitionRef.current.continuous = true; // Continue l'écoute même après une pause
            if (recognitionRef.current) recognitionRef.current.onresult = (event: any) => {
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
                // Ajoute le texte final à la fin du prompt existant, avec un espace
                // On utilise une fonction pour s'assurer d'avoir la dernière valeur de prompt
                if (finalTranscript) {
                    setPrompt(prevPrompt => prevPrompt.trim() ? prevPrompt + ' ' + finalTranscript.trim() : finalTranscript.trim());
                }
                // Optionnel: afficher le texte intérimaire (peut être un peu perturbant)
                // console.log("Interim:", interimTranscript);
            };

            if (recognitionRef.current) recognitionRef.current.onerror = (event: any) => {
                console.error('Speech recognition error', event.error);
                if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                    setError("L'accès au microphone est refusé. Veuillez vérifier les permissions.");
                } else {
                    setError(`Erreur de reconnaissance vocale: ${event.error}`);
                }
                setIsListening(false);
            };

            if (recognitionRef.current) recognitionRef.current.onend = () => {
                // Ne désactive isListening que si ce n'est pas nous qui l'arrêtons manuellement
                // (évite les arrêts intempestifs si continuous=true)
                // Si on a explicitement appelé stop(), isListening sera déjà false.
                // Si l'API s'arrête seule (timeout, etc.), on met à jour.
                // Note: avec continuous=true, onend ne devrait se déclencher que sur stop() ou erreur.
                // On garde cette logique au cas où, mais on la commente pour l'instant avec continuous=true
                // if (isListening) { // Vérifie si l'arrêt n'était pas volontaire
                //     setIsListening(false);
                // }
                console.log("Speech recognition ended.");
            };

        } else {
            setIsSpeechRecognitionSupported(false);
            console.warn("Web Speech API n'est pas supportée par ce navigateur.");
        }

        // Cleanup à la fermeture du modal ou au démontage
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []); // Exécuter une seule fois au montage
    // --- Fin Initialisation ---

    // --- Gestion du bouton micro ---
    const toggleListening = useCallback(() => {
        if (!recognitionRef.current) return;

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            try {
                recognitionRef.current.start();
                setIsListening(true);
                setError(null); // Réinitialise les erreurs précédentes
            } catch (err) {
                // Peut échouer si déjà démarré, mais on gère avec isListening
                console.error("Erreur au démarrage de l'écoute:", err);
                setIsListening(false); // Assure que l'état est correct
            }
        }
    }, [isListening]);
    // --- Fin Gestion Micro ---

    // Arrête l'écoute si le modal se ferme
    useEffect(() => {
        if (!isOpen && isListening && recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    }, [isOpen, isListening]);

    // Focus le textarea à l'ouverture du modal
    useEffect(() => {
        if (isOpen && textareaRef.current) {
            setTimeout(() => {
                textareaRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isListening && recognitionRef.current) {
            recognitionRef.current.stop(); // Arrête l'écoute avant de soumettre
            setIsListening(false);
        }


        if (!prompt.trim()) {
            setError("Veuillez saisir des informations pour générer votre CV");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await generateCvFromPrompt(prompt);
            if (response.error) throw new Error(response.error);
            if (!response.cvData) throw new Error("Aucune donnée n'a été générée");
            onAiGenerated(response.cvData);
            onClose();
            // Utiliser un système de notification plus robuste serait mieux qu'un alert
            alert("Votre CV a été généré avec succès !");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur est survenue lors de la génération du CV");
        } finally {
            setIsLoading(false);
        }
    };

    // Ajuster la hauteur du textarea automatiquement
    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    useEffect(() => {
        adjustTextareaHeight();
    }, [prompt]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 z-40"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl
                      bg-white border-3 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-50 overflow-hidden max-h-[90vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="bg-black p-5 text-white flex justify-between items-center flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="bg-brutal-lime p-2">
                                    <BrainCircuit size={24} className="text-black" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black uppercase tracking-tight">Génération IA</h2>
                                    <p className="text-xs text-gray-400 font-medium">Décrivez votre parcours, l'IA fait le reste</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-white hover:bg-white/10 p-2 border-2 border-white/20 hover:border-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
                            {/* Instructions Card */}
                            <div className="mb-6 bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <h3 className="font-bold text-black mb-3 flex items-center gap-2">
                                    <span className="bg-black text-brutal-lime px-2 py-0.5 text-xs font-black">GUIDE</span>
                                    Comment utiliser l'IA
                                </h3>
                                <p className="text-gray-700 text-sm mb-3">
                                    Décrivez votre parcours professionnel naturellement. Mentionnez :
                                </p>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="flex items-center gap-2 bg-gray-100 p-2 border border-gray-200">
                                        <span className="w-2 h-2 bg-black"></span>
                                        <span>Informations personnelles</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-gray-100 p-2 border border-gray-200">
                                        <span className="w-2 h-2 bg-black"></span>
                                        <span>Formation et diplômes</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-gray-100 p-2 border border-gray-200">
                                        <span className="w-2 h-2 bg-black"></span>
                                        <span>Expériences professionnelles</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-gray-100 p-2 border border-gray-200">
                                        <span className="w-2 h-2 bg-black"></span>
                                        <span>Compétences et langues</span>
                                    </div>
                                </div>
                                {isSpeechRecognitionSupported && (
                                    <p className="mt-3 text-xs text-gray-600 flex items-center gap-2 bg-brutal-lime/20 p-2 border border-brutal-lime">
                                        <Mic size={14} className="text-black" />
                                        <span><strong>Astuce :</strong> Cliquez sur le micro pour dicter votre texte</span>
                                    </p>
                                )}
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4 relative">
                                    <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">
                                        Votre description
                                    </label>
                                    <textarea
                                        ref={textareaRef}
                                        value={prompt}
                                        onChange={(e) => {
                                            setPrompt(e.target.value);
                                        }}
                                        className={`w-full border-2 border-black px-4 py-3 focus:outline-none
                                              focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow
                                              resize-none min-h-[180px] text-gray-800 font-medium ${isSpeechRecognitionSupported ? 'pr-14' : ''}`}
                                        placeholder="Je m'appelle Jean Dupont, j'ai 28 ans et je suis développeur web. J'ai étudié à l'École Supérieure d'Informatique où j'ai obtenu mon Master en 2018. J'ai travaillé chez TechCorp comme développeur frontend (2018-2020), puis chez WebSolutions comme lead developer depuis 2020. Je maîtrise React, TypeScript, Node.js. Je parle français (natif) et anglais (C1)..."
                                        rows={7}
                                    />
                                    {/* Bouton Microphone */}
                                    {isSpeechRecognitionSupported && (
                                        <button
                                            type="button"
                                            onClick={toggleListening}
                                            title={isListening ? "Arrêter l'écoute" : "Démarrer l'écoute vocale"}
                                            className={`absolute right-3 bottom-3 p-3 border-2 border-black transition-all duration-200
                                                  ${isListening
                                                ? 'bg-red-500 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                                                : 'bg-white text-black hover:bg-brutal-lime shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                                            }`}
                                        >
                                            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                                        </button>
                                    )}
                                </div>

                                {error && (
                                    <div className="mb-4 p-3 bg-red-50 text-red-700 border-2 border-red-500 text-sm font-medium">
                                        {error}
                                    </div>
                                )}

                                <div className="flex justify-between items-center border-t-2 border-gray-200 pt-4 mt-2">
                                    {/* Indicateur d'écoute */}
                                    <div className="flex items-center">
                                        {isListening && (
                                            <span className="text-sm text-black font-bold flex items-center bg-red-100 px-3 py-1 border border-red-300">
                                                <span className="relative flex h-2 w-2 mr-2">
                                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                                                </span>
                                                Écoute en cours...
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-5 py-2.5 border-2 border-black font-bold text-black hover:bg-gray-100 transition-colors"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading || isListening}
                                            className="bg-black text-white px-5 py-2.5 border-2 border-black font-bold
                                                  shadow-[4px_4px_0px_0px_#bef264] hover:shadow-[6px_6px_0px_0px_#bef264] 
                                                  disabled:opacity-50 disabled:shadow-none transition-all flex items-center gap-2"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 size={18} className="animate-spin" />
                                                    Génération...
                                                </>
                                            ) : (
                                                <>
                                                    <Send size={18} />
                                                    Générer mon CV
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AiModal;