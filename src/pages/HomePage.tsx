// src/pages/HomePage.tsx
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'framer-motion'; // Nécessite: npm install framer-motion

import CvForm from '../components/CvForm/CvForm';
import CvPreview from '../components/CvPreview/CvPreview';
import {
    CvData,
    PersonalInfo,
    EducationItem,
    ExperienceItem,
    SkillItem,
    LanguageItem,
} from '../types/cv';

// Pour l'avatar de Nancy dans un cercle
import nancyAvatar from '../assets/nancy.jpg'; // Assurez-vous que ce chemin est correct

const initialCvData: CvData = {
    personalInfo: {
        photo: undefined,
        firstName: '',
        lastName: '',
        jobTitle: '',
        address: '',
        phone: '',
        email: '',
        description: '',
    },
    education: [
        { id: uuidv4(), degree: '', school: '', startDate: '', endDate: '', description: '' }
    ],
    experience: [
        { id: uuidv4(), title: '', company: '', startDate: '', endDate: '', description: '' }
    ],
    skills: [
        { id: uuidv4(), name: '', level: 5 }
    ],
    languages: [
        { id: uuidv4(), name: '', level: 3 }
    ],
};

function HomePage() {
    const [cvData, setCvData] = useState<CvData>(() => {
        // Charger les données du CV depuis le localStorage si disponibles
        const savedData = localStorage.getItem('nancyCvData');
        return savedData ? JSON.parse(savedData) : initialCvData;
    });
    const [activeView, setActiveView] = useState<'form' | 'preview'>('form');
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const previewRef = useRef<HTMLDivElement>(null);

    // Sauvegarde automatique des données dans localStorage
    useEffect(() => {
        localStorage.setItem('nancyCvData', JSON.stringify(cvData));
    }, [cvData]);

    // --- Handlers pour mettre à jour l'état ---
    const handlePersonalInfoChange = useCallback(<K extends keyof PersonalInfo>(field: K, value: PersonalInfo[K]) => {
        setCvData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, [field]: value }
        }));
    }, []);

    const handlePhotoChange = useCallback((file: File | null) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handlePersonalInfoChange('photo', reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            handlePersonalInfoChange('photo', initialCvData.personalInfo.photo);
        }
    }, [handlePersonalInfoChange]);

    const handleListChange = useCallback(<T extends { id: string }>(
        listName: keyof CvData,
        id: string,
        field: keyof T,
        value: any
    ) => {
        setCvData(prev => ({
            ...prev,
            [listName]: (prev[listName] as T[]).map(item =>
                item.id === id ? { ...item, [field]: value } : item
            ),
        }));
    }, []);

    const addListItem = useCallback((listName: keyof CvData, newItem: any) => {
        setCvData(prev => ({
            ...prev,
            [listName]: [...(prev[listName] as any[]), { ...newItem, id: uuidv4() }]
        }));
    }, []);

    const removeListItem = useCallback((listName: keyof CvData, id: string) => {
        setCvData(prev => {
            const list = prev[listName] as Array<{ id: string }>;
            if (list.length <= 1) {
                console.warn(`Cannot remove the last item from ${listName}`);
                return prev;
            }
            return {
                ...prev,
                [listName]: list.filter(item => item.id !== id)
            };
        });
    }, []);

    // --- Actions ---
    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPdf = async () => {
        const element = previewRef.current;
        if (!element) return;

        setIsGeneratingPDF(true);
        
        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                allowTaint: true,
            });
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const ratio = canvasWidth / canvasHeight;
            const imgWidth = pdfWidth;
            const imgHeight = imgWidth / ratio;

            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;

            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pdfHeight;
            }

            const firstName = cvData.personalInfo.firstName || 'cv';
            const lastName = cvData.personalInfo.lastName || '';
            pdf.save(`${firstName}_${lastName}_cv.pdf`);
        } catch (error) {
            console.error("Erreur lors de la génération du PDF:", error);
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    const handleViewToggle = (view: 'form' | 'preview') => {
        setActiveView(view);
    };

    const handleResetForm = () => {
        if (window.confirm("Êtes-vous sûr de vouloir réinitialiser le formulaire? Toutes les données seront perdues.")) {
            setCvData(initialCvData);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-purple-800 text-white">
            {/* Header with Nancy dedication */}
            <header className="w-full ">
                <div className="container mx-auto py-4 px-6 flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-pink-400 shadow-lg shadow-pink-500/30">
                            <img src={nancyAvatar} alt="Nancy" className="w-full h-full object-cover" />
                        </div>
                        <div className="ml-3">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
                                NancyCV
                            </h1>
                            <p className="text-xs text-white/70">For Nancy</p>
                        </div>
                    </div>
                    
                    <nav className="hidden md:block">
                        <ul className="flex space-x-6">
                            <li className="hover:text-pink-400 transition-colors">
                                <a href="#features">Fonctionnalités</a>
                            </li>
                            <li className="hover:text-pink-400 transition-colors">
                                <a href="#templates">Templates</a>
                            </li>
                            <li className="hover:text-pink-400 transition-colors">
                                <a href="#faq">FAQ</a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>

            <main className="container mx-auto py-8 px-4">
                {/* Title with glass effect */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className=" rounded-xl p-8 mb-8 "
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                        Allez fais ton CV rapide !
                    </h2>
                    <p className="text-center text-white/80 max-w-2xl mx-auto">
                        Un générateur de CV fait de base pour que nancy arrête de m'embêter.
                    </p>
                </motion.div>

                {/* View toggle */}
                <div className="flex justify-center mb-8">
                    <div className="inline-flex rounded-md backdrop-blur-md bg-white/10 p-1 shadow-inner">
                        <button
                            onClick={() => handleViewToggle('form')}
                            className={`px-6 py-2 rounded-md font-medium transition-all ${
                                activeView === 'form' 
                                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg' 
                                    : 'text-white/70 hover:text-white'
                            }`}
                        >
                            Formulaire
                        </button>
                        <button
                            onClick={() => handleViewToggle('preview')}
                            className={`px-6 py-2 rounded-md font-medium transition-all ${
                                activeView === 'preview' 
                                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg' 
                                    : 'text-white/70 hover:text-white'
                            }`}
                        >
                            Aperçu
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Formulaire */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ 
                            opacity: activeView === 'form' || window.innerWidth >= 1024 ? 1 : 0,
                            x: 0,
                            display: activeView === 'form' || window.innerWidth >= 1024 ? 'block' : 'none'
                        }}
                        transition={{ duration: 0.4 }}
                        className="w-full lg:w-1/2 print:hidden"
                    >
                        <div className="backdrop-blur-md bg-white/10 rounded-xl border border-white/20 shadow-xl p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold">Informations du CV</h3>
                                <button 
                                    onClick={handleResetForm}
                                    className="text-sm text-red-400 hover:text-red-300 transition-colors"
                                >
                                    Réinitialiser
                                </button>
                            </div>
                            <CvForm
                                cvData={cvData}
                                onPersonalInfoChange={handlePersonalInfoChange}
                                onPhotoChange={handlePhotoChange}
                                onListChange={handleListChange}
                                onAddItem={addListItem}
                                onRemoveItem={removeListItem}
                            />
                        </div>
                    </motion.div>

                    {/* Aperçu */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ 
                            opacity: activeView === 'preview' || window.innerWidth >= 1024 ? 1 : 0,
                            x: 0,
                            display: activeView === 'preview' || window.innerWidth >= 1024 ? 'flex' : 'none'
                        }}
                        transition={{ duration: 0.4 }}
                        className="w-full lg:w-1/2 flex flex-col items-center"
                    >
                        {/* Boutons d'action */}
                        <div className="mb-6 w-full flex justify-center gap-4 print:hidden">
                            <button
                                onClick={handlePrint}
                                disabled={isGeneratingPDF}
                                className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                                Imprimer
                            </button>
                            <button
                                onClick={handleDownloadPdf}
                                disabled={isGeneratingPDF}
                                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
                            >
                                {isGeneratingPDF ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Génération...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Télécharger PDF
                                    </>
                                )}
                            </button>
                        </div>
                        
                        {/* Preview avec effet d'ombre */}
                        <div className="w-full shadow-2xl transform hover:scale-[1.01] transition-transform duration-300  overflow-hidden">
                            <CvPreview ref={previewRef} cvData={cvData} />
                        </div>
                    </motion.div>
                </div>
            </main>
            
            {/* Footer */}
            <footer className="mt-16 border-t border-white/10 py-8 backdrop-blur-md bg-black/20">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-white/60 text-sm">
                        NancyCV © {new Date().getFullYear()} - Créé avec 💖 pour Nancy par <a href="https://the-fox.tech">Fox</a>
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default HomePage;