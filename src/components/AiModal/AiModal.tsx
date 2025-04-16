import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, BrainCircuit, Loader2 } from 'lucide-react';
import { CvData } from '../../types/cv';
import { generateCvFromPrompt } from '../../services/aiService';

interface AiModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAiGenerated: (data: CvData) => void;
}

const AiModal: React.FC<AiModalProps> = ({ isOpen, onClose, onAiGenerated }) => {
    const [prompt, setPrompt] = useState<string>(() => {
        // Récupérer le prompt sauvegardé du localStorage s'il existe
        const savedPrompt = localStorage.getItem('nancyCvAiPrompt');
        return savedPrompt || '';
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Sauvegarde du prompt dans le localStorage
    useEffect(() => {
        localStorage.setItem('nancyCvAiPrompt', prompt);
    }, [prompt]);

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

        if (!prompt.trim()) {
            setError("Veuillez saisir des informations pour générer votre CV");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Appel direct au service AI
            const response = await generateCvFromPrompt(prompt);

            if (response.error) {
                throw new Error(response.error);
            }

            if (!response.cvData) {
                throw new Error("Aucune donnée n'a été générée");
            }

            // Passer les données générées au parent
            onAiGenerated(response.cvData);

            // Fermer le modal après succès
            onClose();
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
                        <div className="bg-gradient-to-r from-pink-500 to-indigo-600 p-5 text-white flex justify-between items-center">
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
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                  <textarea
                      ref={textareaRef}
                      value={prompt}
                      onChange={(e) => {
                          setPrompt(e.target.value);
                          adjustTextareaHeight();
                      }}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none
                              focus:ring-2 focus:ring-purple-500 focus:border-transparent
                              resize-none min-h-[150px] text-gray-700"
                      placeholder="Je m'appelle Jean Dupont, j'ai 28 ans et je suis développeur web. J'ai étudié à l'École Supérieure d'Informatique à Paris où j'ai obtenu mon diplôme en 2018. J'ai travaillé chez TechCorp de 2018 à 2020 comme développeur frontend, puis chez WebSolutions depuis 2020 comme lead developer. Je maîtrise HTML, CSS, JavaScript, React et Node.js. Je parle français (natif) et anglais (niveau B2)..."
                  />
                                </div>

                                {error && (
                                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg border border-red-200">
                                        {error}
                                    </div>
                                )}

                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="mr-3 px-5 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="bg-gradient-to-r from-pink-500 to-indigo-600 text-white px-5 py-2 rounded-lg
                              shadow-md hover:shadow-lg disabled:opacity-70 transition-all flex items-center"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 size={18} className="mr-2 animate-spin" />
                                                Génération en cours...
                                            </>
                                        ) : (
                                            <>
                                                <Send size={18} className="mr-2" />
                                                Générer mon CV
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