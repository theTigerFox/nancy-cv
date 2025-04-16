import { useState, useRef, useCallback, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';
import {BrainCircuit, ChevronDown, Check, Eye, View} from 'lucide-react';
import { Link } from 'react-router-dom';
import { generatePdf } from '../services/pdfService';


import CvForm from '../components/CvForm/CvForm';
import AiModal from '../components/AiModal/AiModal';
import {
    CvData,
    PersonalInfo,
} from '../types/cv';

// CV Templates
import CvPreviewTemplate1 from "../components/CvPreview/Template 1/CvPreviewTemplate1";
import CvPreviewTemplate2 from "../components/CvPreview/Template 2/CvPreviewTemplate2";

// Assets
import nancyAvatar from '../assets/nancy.jpg';
import foxLogo from '../assets/logo-fox-dark.png';

// Template thumbnails - you'll need to create these images
import template1Thumb from '../assets/template1-thumb.jpg'; // Create this thumbnail image
import template2Thumb from '../assets/template2-thumb.jpg'; // Create this thumbnail image
import template3Thumb from '../assets/template3-thumb.jpg';
import CvPreviewTemplate3 from "../components/CvPreview/Template 3/CvPreviewTemplate3.tsx";
import CvPreviewTemplate4 from "../components/CvPreview/Template 4/CvPreviewTemplate4.tsx"; // Create this thumbnail image


// Template definitions
const templates = [
    {
        "id": 1,
        "name": "Creative & Modern",
        "description": "Colorful design with a modern and dynamic layout.",
        "thumbnail": template1Thumb,
        "component": CvPreviewTemplate1,
        "accentColor": "#6366f1" // Default color for template 1
    },
    {
        "id": 2,
        "name": "Professional & Clean",
        "description": "Minimalist and elegant design, perfect for a traditional resume.",
        "thumbnail": template2Thumb,
        "component": CvPreviewTemplate2,
        "accentColor": "#374151" // Default color for template 2
    },
    {
        "id": 3,
        "name": "Professional & Minimalist",
        "description": "Truly Minimalist.",
        "thumbnail": template3Thumb,
        "component": CvPreviewTemplate3,
        "accentColor": "#374151" // Default color for template 2
    },
    {
        "id": 4,
        "name": "Simple",
        "description": "The most Minimalist.",
        "thumbnail": template3Thumb,
        "component": CvPreviewTemplate4,
        "accentColor": "#374151" // Default color for template 2
    }
];

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
        // Load CV data from localStorage if available
        const savedData = localStorage.getItem('nancyCvData');
        return savedData ? JSON.parse(savedData) : initialCvData;
    });
    const [activeView, setActiveView] = useState<'form' | 'preview'>('form');
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(() => {
        // Load selected template from localStorage if available
        const savedTemplate = localStorage.getItem('nancyCvTemplate');
        return savedTemplate ? parseInt(savedTemplate) : 1;
    });
    const [isTemplateMenuOpen, setIsTemplateMenuOpen] = useState(false);
    const [accentColor, setAccentColor] = useState(() => {
        // Load accent color from localStorage if available
        const savedColor = localStorage.getItem('nancyCvAccentColor');
        return savedColor || templates.find(t => t.id === selectedTemplate)?.accentColor || "#6366f1";
    });

    const previewRef = useRef<HTMLDivElement>(null);

    // Auto-save data to localStorage
    useEffect(() => {
        localStorage.setItem('nancyCvData', JSON.stringify(cvData));
    }, [cvData]);

    // Save selected template to localStorage
    useEffect(() => {
        localStorage.setItem('nancyCvTemplate', selectedTemplate.toString());
    }, [selectedTemplate]);

    // Save accent color to localStorage
    useEffect(() => {
        localStorage.setItem('nancyCvAccentColor', accentColor);
    }, [accentColor]);

    // Get current template component
    const CurrentTemplateComponent = templates.find(t => t.id === selectedTemplate)?.component || CvPreviewTemplate1;

    // --- State update handlers ---
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
            [listName]: (prev[listName] as unknown as T[]).map(item =>
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
            const pdf = new jsPDF('p', 'mm', 'a4',true);
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
            console.error("Error generating PDF:", error);
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    const handleDownloadPdf2 = async () => {
        setIsGeneratingPDF(true);

        try {
            await generatePdf(cvData, selectedTemplate, accentColor);
        } catch (error) {
            console.error("Error generating PDF:", error);
            // Vous pourriez afficher un message d'erreur à l'utilisateur ici
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    const handleViewToggle = (view: 'form' | 'preview') => {
        setActiveView(view);
    };

    const handleResetForm = () => {
        if (window.confirm("Are you sure you want to reset the form? All data will be lost.")) {
            setCvData(initialCvData);
        }
    };

    // Fonction pour gérer les données générées par l'IA
    const handleAiGenerated = (generatedData: CvData) => {
        // Mise à jour de l'état principal
        setCvData(generatedData);

        // Sauvegarder dans localStorage immédiatement pour garantir la persistance
        localStorage.setItem('nancyCvData', JSON.stringify(generatedData));

        // Afficher la vue du formulaire pour que l'utilisateur puisse ajuster si nécessaire
        setActiveView('form');
    };

    const handleTemplateChange = (templateId: number) => {
        setSelectedTemplate(templateId);
        setIsTemplateMenuOpen(false);

        // Optionally update accent color to the template's default
        const newTemplate = templates.find(t => t.id === templateId);
        if (newTemplate && newTemplate.accentColor) {
            setAccentColor(newTemplate.accentColor);
        }
    };

    return (
        <div className="min-h-screen bg-white text-gray-800 relative overflow-hidden">
            {/* Background gradient circles - Apple/Google style */}
            <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-r from-pink-500 to-indigo-300 opacity-50 blur-3xl"></div>
            <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-r from-pink-500 to-indigo-300 opacity-50 blur-3xl"></div>
            <div className="absolute top-1/4 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-pink-100 to-purple-800 opacity-50 blur-3xl"></div>
            <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full bg-gradient-to-br from-blue-100 to-indigo-800 opacity-40 blur-3xl"></div>

            {/* Header with Nancy dedication */}
            <header className="w-full fixed z-50 border-b border-gray-100 bg-white/70 backdrop-blur-md">
                <div className="container mx-auto py-4 px-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full overflow-hidden border border-purple-200 shadow-lg">
                            <img src={nancyAvatar} alt="Nancy" className="w-full h-full object-cover"/>
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-800">
                                Nan<span className="text-purple-600">CV</span>
                            </h1>
                            <p className="text-xs text-gray-500">For Nancy</p>
                        </div>
                    </div>

                    <nav className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/faq"
                            className="text-gray-600 hover:text-purple-600 transition-colors font-medium"
                        >
                            FAQ
                        </Link>
                        <a
                            href="https://the-fox.tech"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-purple-600 transition-colors font-medium"
                        >
                            Developer
                        </a>
                    </nav>
                </div>
            </header>

            <main className="container mt-20 mx-auto py-10 px-4 relative z-10">
                {/* Title Section */}
                <motion.div
                    initial={{opacity: 0, y: -20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                    className="mb-12 text-center"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent">
                        Create Your Professional CV
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                        A simple and elegant CV generator built for Nancy.
                    </p>

                    {/* AI Button */}
                    <motion.button
                        onClick={() => setIsAiModalOpen(true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-full
                                 shadow-lg hover:shadow-xl transition-all flex items-center mx-auto"
                    >
                        <BrainCircuit className="mr-2" size={20} />
                        Use the AI tool
                    </motion.button>

                    <div className="flex justify-center items-center mt-8">
                        <span className="text-gray-500 text-sm">Developed by</span>
                        <div className="ml-2 h-8">
                            <img src={foxLogo} alt="Fox Logo" className="h-full w-auto object-contain"/>
                        </div>
                    </div>
                </motion.div>

                {/* View and Template Controls */}
                <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-10">
                    {/* View Toggle */}
                    <div className="inline-flex rounded-full bg-gray-100 p-1 shadow-inner">
                        <button
                            onClick={() => handleViewToggle('form')}
                            className={`px-6 py-2 rounded-full font-medium transition-all ${
                                activeView === 'form'
                                    ? 'bg-white text-purple-600 shadow-md'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            Form
                        </button>
                        <button
                            onClick={() => handleViewToggle('preview')}
                            className={`px-6 py-2 rounded-full font-medium transition-all ${
                                activeView === 'preview'
                                    ? 'bg-white text-purple-600 shadow-md'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            Preview
                        </button>
                    </div>

                    {/* Template Selector */}
                    <div className="relative">
                        <button
                            onClick={() => setIsTemplateMenuOpen(!isTemplateMenuOpen)}
                            className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                        >
                            <span className="text-gray-700 mr-2">Template:</span>
                            <span className="font-medium text-gray-900">
                                {templates.find(t => t.id === selectedTemplate)?.name || "Template 1"}
                            </span>
                            <ChevronDown size={16} className="ml-2 text-gray-500" />
                        </button>

                        {/* Template Dropdown Menu */}
                        <AnimatePresence>
                            {isTemplateMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl z-20 border border-gray-100 overflow-hidden"
                                >
                                    <div className="p-3 border-b border-gray-100 bg-gray-50">
                                        <h3 className="text-sm font-semibold text-gray-700">Choisir un modèle</h3>
                                    </div>
                                    <div className="py-2">
                                        {templates.map(template => (
                                            <button
                                                key={template.id}
                                                onClick={() => handleTemplateChange(template.id)}
                                                className={`w-full text-left px-4 py-3 flex items-start hover:bg-gray-50 transition-colors ${
                                                    selectedTemplate === template.id ? 'bg-purple-50' : ''
                                                }`}
                                            >
                                                <div className="w-20 h-28 mr-3 rounded-md overflow-hidden border border-gray-200 flex-shrink-0">
                                                    <img
                                                        src={template.thumbnail}
                                                        alt={template.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="font-medium text-gray-900">{template.name}</h4>
                                                        {selectedTemplate === template.id && (
                                                            <Check size={16} className="text-purple-600" />
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">{template.description}</p>

                                                    <div className="mt-2 flex items-center text-purple-600 text-xs font-medium">
                                                        <Eye size={14} className="mr-1" />
                                                        <span>Sélectionner</span>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Form */}
                    <motion.div
                        initial={{opacity: 0, x: -20}}
                        animate={{
                            opacity: activeView === 'form' || window.innerWidth >= 1024 ? 1 : 0,
                            x: 0,
                            display: activeView === 'form' || window.innerWidth >= 1024 ? 'block' : 'none'
                        }}
                        transition={{duration: 0.4}}
                        className="w-full lg:w-1/2 print:hidden"
                    >
                        <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold text-gray-800">CV Information</h3>
                                <button
                                    onClick={handleResetForm}
                                    className="text-sm text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
                                         viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                    </svg>
                                    Reset
                                </button>
                            </div>
                            <CvForm
                                cvData={cvData}
                                onPersonalInfoChange={handlePersonalInfoChange}
                                onPhotoChange={handlePhotoChange}
                                onListChange={handleListChange as (listName: keyof CvData, id: string, field: string, value: any) => void}
                                onAddItem={addListItem}
                                onRemoveItem={removeListItem}
                            />
                        </div>
                    </motion.div>

                    {/* Preview */}
                    <motion.div
                        initial={{opacity: 0, x: 20}}
                        animate={{
                            opacity: activeView === 'preview' || window.innerWidth >= 1024 ? 1 : 0,
                            x: 0,
                            display: activeView === 'preview' || window.innerWidth >= 1024 ? 'flex' : 'none'
                        }}
                        transition={{duration: 0.4}}
                        className="w-full lg:w-1/2 flex flex-col items-center"
                    >
                        {/* Action Buttons */}
                        <div className="mb-6 w-full flex justify-center gap-4 print:hidden">
                            <button
                                id={"btn-dl"}
                                onClick={handleDownloadPdf}
                                disabled={isGeneratingPDF}
                                className="bg-gradient-to-r from-pink-500 to-indigo-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center"
                            >
                                {isGeneratingPDF ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg"
                                             fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                    strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor"
                                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none"
                                             viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                        </svg>
                                        Download PDF
                                    </>
                                )}
                            </button>

                            <button
                                id={"btn-dl"}
                                onClick={handleDownloadPdf2}
                                disabled={isGeneratingPDF}
                                className="bg-gradient-to-r from-green-500 to-indigo-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center"
                            >
                                {isGeneratingPDF ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg"
                                             fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                    strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor"
                                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none"
                                             viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                        </svg>
                                        Ultra Minimalist
                                    </>
                                )}
                            </button>


                        </div>

                        {/* CV Preview with shadow effect */}
                        <div className="w-full relative" id={'CVpreview'}>
                            {/* Subtle shadow effect behind the CV */}
                            <div
                                className="absolute -inset-1 bg-gradient-to-r from-purple-100 via-blue-100 to-purple-100 blur-md rounded-xl"></div>

                            {/* The actual CV preview */}
                            <div
                                className="relative bg-white  shadow-xl items-center rounded-xl overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
                                <CurrentTemplateComponent
                                    ref={previewRef}
                                    cvData={cvData}
                                    accentColor={accentColor}
                                    onAccentColorChange={setAccentColor}
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* AI Modal */}
            <AiModal
                isOpen={isAiModalOpen}
                onClose={() => setIsAiModalOpen(false)}
                onAiGenerated={handleAiGenerated}
            />

            {/* Footer */}
            <footer className="mt-20 py-8 border-t border-gray-200 bg-white/70 backdrop-blur-sm relative z-10">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-gray-500 text-sm">
                        NanCV © {new Date().getFullYear()} - Created with <span className="text-purple-600">a lot of annoyance</span> for
                        Nancy by <a href="https://the-fox.tech"
                                    className="text-purple-600 hover:text-purple-700 font-medium">Fox</a>
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default HomePage;