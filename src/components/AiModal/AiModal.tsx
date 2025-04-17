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
            recognitionRef.current.continuous = true; // Continue l'écoute même après une pause
            recognitionRef.current.interimResults = true; // Obtient des résultats temporaires pendant la parole
            recognitionRef.current.lang = 'fr-FR'; // Définit la langue

            recognitionRef.current.onresult = (event: any) => {
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

            recognitionRef.current.onerror = (event: any) => {
                console.error('Speech recognition error', event.error);
                if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                    setError("L'accès au microphone est refusé. Veuillez vérifier les permissions.");
                } else {
                    setError(`Erreur de reconnaissance vocale: ${event.error}`);
                }
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
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
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl
                      bg-white rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[90vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-pink-500 to-indigo-600 p-5 text-white flex justify-between items-center flex-shrink-0">
                            <div className="flex items-center space-x-3">
                                <BrainCircuit size={24} />
                                <h2 className="text-xl font-semibold">Générer mon CV avec l'IA</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-white/80 hover:text-white transition-colors rounded-full hover:bg-white/10 p-1"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto flex-1">
                            <div className="mb-5 text-gray-600 bg-purple-50 p-4 rounded-lg border border-purple-100">
                                <h3 className="font-medium text-purple-700 mb-2">Comment utiliser l'IA pour créer votre CV</h3>
                                <p>Décrivez votre parcours professionnel comme si vous discutiez avec quelqu'un. N'oubliez pas de mentionner :</p>
                                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                                    <li>Vos informations personnelles (nom, prénom, email, téléphone)</li>
                                    <li>Votre formation et vos diplômes (écoles, dates, spécialités)</li>
                                    <li>Vos expériences professionnelles (entreprises, postes, dates, missions)</li>
                                    <li>Vos compétences techniques et linguistiques</li>
                                    <li>Une courte description de votre profil professionnel</li>
                                </ul>
                                {isSpeechRecognitionSupported && (
                                    <p className="mt-2 text-sm text-purple-600">
                                        💡 Astuce : Cliquez sur l'icône <Mic size={14} className="inline align-text-bottom"/> pour dicter votre texte !
                                    </p>
                                )}
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4 relative"> {/* Ajout de relative pour positionner le bouton micro */}
                                    <textarea
                                        ref={textareaRef}
                                        value={prompt}
                                        onChange={(e) => {
                                            setPrompt(e.target.value);
                                            // adjustTextareaHeight(); // L'ajustement auto peut être gênant avec la reco vocale, à tester
                                        }}
                                        className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none
                                              focus:ring-2 focus:ring-purple-500 focus:border-transparent
                                              resize-none min-h-[150px] text-gray-700 ${isSpeechRecognitionSupported ? 'pr-12' : ''}`} // Padding à droite si micro dispo
                                        placeholder="Je m'appelle Jean Dupont, j'ai 28 ans et je suis développeur web. J'ai étudié à l'École Supérieure d'Informatique à Paris où j'ai obtenu mon diplôme en 2018. J'ai travaillé chez TechCorp de 2018 à 2020 comme développeur frontend, puis chez WebSolutions depuis 2020 comme lead developer. Je maîtrise HTML, CSS, JavaScript, React et Node.js. Je parle français (natif) et anglais (niveau B2)..."
                                        rows={6} // Hauteur fixe initiale pour éviter les sauts
                                    />
                                    {/* Bouton Microphone */}
                                    {isSpeechRecognitionSupported && (
                                        <button
                                            type="button"
                                            onClick={toggleListening}
                                            title={isListening ? "Arrêter l'écoute" : "Démarrer l'écoute vocale"}
                                            className={`absolute right-3 bottom-3 p-2 rounded-full transition-colors duration-200
                                                  ${isListening
                                                ? 'bg-red-500 text-white animate-pulse'
                                                : 'bg-gray-200 text-gray-600 hover:bg-purple-100 hover:text-purple-600'
                                            }`}
                                        >
                                            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                                        </button>
                                    )}
                                </div>

                                {error && (
                                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg border border-red-200 text-sm">
                                        {error}
                                    </div>
                                )}

                                <div className="flex justify-end items-center">
                                    {/* Indicateur d'écoute optionnel */}
                                    {isListening && (
                                        <span className="text-sm text-purple-600 mr-4 flex items-center">
                                            <span className="relative flex h-2 w-2 mr-1.5">
                                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                                            </span>
                                            Écoute en cours...
                                        </span>
                                    )}
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="mr-3 px-5 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading || isListening} // Désactive aussi pendant l'écoute
                                        className="bg-gradient-to-r from-pink-500 to-indigo-600 text-white px-5 py-2 rounded-lg
                                              shadow-md hover:shadow-lg disabled:opacity-70 transition-all flex items-center"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 size={18} className="mr-2 animate-spin" />
                                                Génération...
                                            </>
                                        ) : (
                                            <>
                                                <Send size={18} className="mr-2" />
                                                Générer CV
                                            </>
                                        )}
                                    </button>
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