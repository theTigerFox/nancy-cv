import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
    User, Briefcase, GraduationCap, Wrench, Globe, FolderOpen,
    Download, RotateCcw, ZoomIn, ZoomOut, Monitor, Smartphone,
    Upload, ChevronLeft, ChevronRight, Eye, Palette,
    FileJson, Check, X, Zap, MessageSquare
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { cn } from '../lib/utils';

// Assets
import nancyAvatar from '../assets/nancy.jpg';
import foxLogoDark from '../assets/logo-fox-dark.png';

// Types
import { CvData, PersonalInfo } from '../types/cv';

// Templates
import CvPreviewTemplate1 from "../components/CvPreview/Template 1/CvPreviewTemplate1";
import CvPreviewTemplate2 from "../components/CvPreview/Template 2/CvPreviewTemplate2";
import CvPreviewTemplate3 from "../components/CvPreview/Template 3/CvPreviewTemplate3";
import CvPreviewTemplate4 from "../components/CvPreview/Template 4/CvPreviewTemplate4";
import CvPreviewTemplate5 from "../components/CvPreview/Template 5/CvPreviewTemplate5";

// Import des assets de thumbnail
import template1Thumb from '../assets/template1-thumb.jpg';
import template2Thumb from '../assets/template2-thumb.jpg';
import template3Thumb from '../assets/template3-thumb.jpg';
import template5Thumb from '../assets/template5-thumb.jpg';

// ==================== TYPES & CONSTANTS ====================

type SectionId = 'personal' | 'experience' | 'education' | 'skills' | 'languages' | 'projects';

interface Section {
    id: SectionId;
    label: string;
    icon: React.ElementType;
    color: string;
}

const sections: Section[] = [
    { id: 'personal', label: 'Profil', icon: User, color: 'bg-brutal-pink' },
    { id: 'experience', label: 'Expérience', icon: Briefcase, color: 'bg-brutal-yellow' },
    { id: 'education', label: 'Formation', icon: GraduationCap, color: 'bg-brutal-lime' },
    { id: 'skills', label: 'Compétences', icon: Wrench, color: 'bg-brutal-pink' },
    { id: 'languages', label: 'Langues', icon: Globe, color: 'bg-brutal-yellow' },
    { id: 'projects', label: 'Projets', icon: FolderOpen, color: 'bg-brutal-lime' },
];

const templates = [
    { id: 1, name: "Creative & Modern", thumb: template1Thumb, component: CvPreviewTemplate1, accent: "#6366f1" },
    { id: 2, name: "Professional & Clean", thumb: template2Thumb, component: CvPreviewTemplate2, accent: "#374151" },
    { id: 3, name: "Minimalist", thumb: template3Thumb, component: CvPreviewTemplate3, accent: "#374151" },
    { id: 4, name: "Simple", thumb: template3Thumb, component: CvPreviewTemplate4, accent: "#374151" },
    { id: 5, name: "Standard", thumb: template5Thumb, component: CvPreviewTemplate5, accent: "#374151" },
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
    education: [{ id: uuidv4(), degree: '', school: '', startDate: '', endDate: '', description: '' }],
    experience: [{ id: uuidv4(), title: '', company: '', startDate: '', endDate: '', description: '' }],
    skills: [{ id: uuidv4(), name: '', level: 5 }],
    languages: [{ id: uuidv4(), name: '', level: 3 }],
};

// ==================== COMPONENTS ====================

const NancyTip = ({ section }: { section: SectionId }) => {
    const tips = {
        personal: "Don't use that selfie from 2015. Seriously.",
        experience: "Lie a little bit. But not too much.",
        education: "Did you actually go to class?",
        skills: "Microsoft Word is not a skill, darling.",
        languages: "Duolingo streaks don't count.",
        projects: "Make it sound expensive."
    };

    return (
        <div className="mt-8 p-4 bg-brutal-yellow border-3 border-black relative rotate-1 shadow-brutal-sm">
            <div className="absolute -top-3 -left-3 bg-white border-3 border-black px-2 py-0.5 text-xs font-black uppercase text-brutal-pink -rotate-6">
                Nancy Says:
            </div>
            <p className="font-mono text-sm font-bold italic">"{tips[section]}"</p>
        </div>
    );
};

interface InputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
    icon?: React.ElementType;
    required?: boolean;
}

const BrutalInput = ({ label, value, onChange, placeholder, type = 'text', icon: Icon, required }: InputProps) => (
    <div className="mb-5 group">
        <label className="flex items-center gap-2 text-xs font-black uppercase tracking-wider mb-2 group-focus-within:text-brutal-pink transition-colors">
            {required && <span className="text-brutal-pink text-lg leading-none">*</span>}
            {label}
        </label>
        <div className="relative">
            {Icon && (
                <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center border-r-3 border-black bg-gray-50 text-black">
                    <Icon size={16} strokeWidth={2.5} />
                </div>
            )}
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={cn(
                    "w-full p-3 border-3 border-black font-mono text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]",
                    "focus:outline-none focus:shadow-brutal hover:shadow-brutal-sm transition-all",
                    "placeholder:text-gray-300",
                    Icon && "pl-14"
                )}
            />
        </div>
    </div>
);

const BrutalTextarea = ({ label, value, onChange, placeholder, rows = 4 }: InputProps & { rows?: number }) => (
    <div className="mb-5 group">
        <label className="block text-xs font-black uppercase tracking-wider mb-2 group-focus-within:text-brutal-pink transition-colors">{label}</label>
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="w-full p-3 border-3 border-black font-mono text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] focus:outline-none focus:shadow-brutal hover:shadow-brutal-sm transition-all placeholder:text-gray-300 resize-none"
        />
    </div>
);

// ==================== SECTION FORMS ====================

interface PersonalFormProps {
    data: PersonalInfo;
    onChange: <K extends keyof PersonalInfo>(field: K, value: PersonalInfo[K]) => void;
    onPhotoChange: (file: File | null) => void;
}

const PersonalForm = ({ data, onChange, onPhotoChange }: PersonalFormProps) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        onPhotoChange(file);
    };

    return (
        <div className="space-y-6">
            <NancyTip section="personal" />
            
            {/* Photo Upload */}
            <div className="bg-white border-3 border-black p-4 relative group hover:bg-gray-50 transition-colors">
                <div className="absolute -top-3 left-4 bg-black text-white px-2 py-0.5 text-xs font-bold uppercase">Profile Picture</div>
                <div className="flex items-center gap-6 mt-2">
                    <div className="w-24 h-24 border-3 border-black bg-gray-200 shrink-0 overflow-hidden relative shadow-brutal-sm">
                        {data.photo ? (
                            <img src={data.photo} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                <User size={32} />
                                <span className="text-[10px] uppercase font-bold mt-1">No Photo</span>
                            </div>
                        )}
                    </div>
                    <div className="flex-1 space-y-3">
                        <p className="text-xs font-medium text-gray-500 italic">Square photos work best. Make sure you don't look like a serial killer.</p>
                        <div className="flex gap-3">
                            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border-3 border-black bg-brutal-lime text-black font-bold text-xs uppercase hover:shadow-brutal hover:-translate-y-0.5 transition-all">
                                <Upload size={14} /> Upload
                                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            </label>
                            {data.photo && (
                                <button 
                                    onClick={() => onPhotoChange(null)}
                                    className="px-4 py-2 border-3 border-black bg-white text-red-600 font-bold text-xs uppercase hover:bg-red-50 hover:shadow-brutal hover:-translate-y-0.5 transition-all"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
                <BrutalInput label="First Name" value={data.firstName} onChange={(v) => onChange('firstName', v)} placeholder="Nancy" required icon={User} />
                <BrutalInput label="Last Name" value={data.lastName} onChange={(v) => onChange('lastName', v)} placeholder="Dubois" required />
            </div>
            <BrutalInput label="Job Title" value={data.jobTitle} onChange={(v) => onChange('jobTitle', v)} placeholder="Professional Annoyer" icon={Briefcase} />
            <div className="grid grid-cols-2 gap-5">
                <BrutalInput label="Email" value={data.email} onChange={(v) => onChange('email', v)} placeholder="nancy@email.com" type="email" required />
                <BrutalInput label="Phone" value={data.phone} onChange={(v) => onChange('phone', v)} placeholder="+33 6 12 34 56 78" type="tel" />
            </div>
            <BrutalInput label="Address" value={data.address} onChange={(v) => onChange('address', v)} placeholder="Paris, France" />
            <BrutalTextarea label="About Me" value={data.description} onChange={(v) => onChange('description', v)} placeholder="I am a very passionate individual who loves..." rows={5} />
        </div>
    );
};

interface ListFormProps<T extends { id: string }> {
    items: T[];
    onUpdate: (id: string, field: keyof T, value: any) => void;
    onAdd: () => void;
    onRemove: (id: string) => void;
    renderItem: (item: T, onUpdate: (field: keyof T, value: any) => void) => React.ReactNode;
    addLabel: string;
    itemLabel: string;
    section: SectionId;
}

function ListForm<T extends { id: string }>({ items, onUpdate, onAdd, onRemove, renderItem, addLabel, itemLabel, section }: ListFormProps<T>) {
    return (
        <div className="space-y-6">
            <NancyTip section={section} />
            
            <div className="space-y-6">
                {items.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-3 border-black p-5 bg-white relative group hover:shadow-brutal transition-shadow"
                    >
                        <div className="absolute -top-3 left-4 flex gap-2">
                             <div className="bg-black text-white px-3 py-1 text-xs font-black uppercase tracking-wider">
                                {itemLabel} #{index + 1}
                            </div>
                        </div>
                        
                        {items.length > 1 && (
                            <button
                                onClick={() => onRemove(item.id)}
                                className="absolute -top-3 -right-3 w-8 h-8 bg-white border-3 border-black text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors shadow-sm z-10"
                                title="Remove Item"
                            >
                                <X size={16} strokeWidth={3} />
                            </button>
                        )}
                        
                        <div className="mt-4 space-y-4">
                            {renderItem(item, (field, value) => onUpdate(item.id, field, value))}
                        </div>
                    </motion.div>
                ))}
            </div>

            <button
                onClick={onAdd}
                className="w-full py-5 border-3 border-dashed border-black text-gray-400 font-black uppercase hover:bg-white hover:text-black hover:border-solid hover:shadow-brutal hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group"
            >
                <div className="w-8 h-8 rounded-full border-3 border-gray-300 group-hover:border-black flex items-center justify-center transition-colors">
                    <span className="text-xl leading-none mb-0.5">+</span> 
                </div>
                {addLabel}
            </button>
        </div>
    );
}

// ==================== MAIN COMPONENT ====================

export default function CreatePage() {
    // State
    const [cvData, setCvData] = useState<CvData>(() => {
        const saved = localStorage.getItem('nancyCvData');
        return saved ? JSON.parse(saved) : initialCvData;
    });
    const [activeSection, setActiveSection] = useState<SectionId>('personal');
    const [selectedTemplate, setSelectedTemplate] = useState(() => {
        const saved = localStorage.getItem('nancyCvTemplate');
        return saved ? parseInt(saved) : 1;
    });
    const [accentColor, setAccentColor] = useState(() => {
        return localStorage.getItem('nancyCvAccentColor') || "#6366f1";
    });
    const [zoom, setZoom] = useState(70);
    const [showPreviewMobile, setShowPreviewMobile] = useState(false);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const [showTemplatePanel, setShowTemplatePanel] = useState(false);
    const [notification, setNotification] = useState<string | null>(null);

    const previewRef = useRef<HTMLDivElement>(null);

    // Auto-save
    useEffect(() => {
        localStorage.setItem('nancyCvData', JSON.stringify(cvData));
    }, [cvData]);

    useEffect(() => {
        localStorage.setItem('nancyCvTemplate', selectedTemplate.toString());
    }, [selectedTemplate]);

    useEffect(() => {
        localStorage.setItem('nancyCvAccentColor', accentColor);
    }, [accentColor]);

    // Handlers
    const handlePersonalInfoChange = useCallback(<K extends keyof PersonalInfo>(field: K, value: PersonalInfo[K]) => {
        setCvData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [field]: value } }));
    }, []);

    const handlePhotoChange = useCallback((file: File | null) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => handlePersonalInfoChange('photo', reader.result as string);
            reader.readAsDataURL(file);
        } else {
            handlePersonalInfoChange('photo', undefined);
        }
    }, [handlePersonalInfoChange]);

    const handleListUpdate = useCallback(<T extends { id: string }>(listName: keyof CvData, id: string, field: keyof T, value: any) => {
        setCvData(prev => ({
            ...prev,
            [listName]: (prev[listName] as T[]).map(item => item.id === id ? { ...item, [field]: value } : item)
        }));
    }, []);

    const handleListAdd = useCallback((listName: keyof CvData, template: Omit<any, 'id'>) => {
        setCvData(prev => ({
            ...prev,
            [listName]: [...(prev[listName] as any[]), { ...template, id: uuidv4() }]
        }));
    }, []);

    const handleListRemove = useCallback((listName: keyof CvData, id: string) => {
        setCvData(prev => {
            const list = prev[listName] as any[];
            if (list.length <= 1) return prev;
            return { ...prev, [listName]: list.filter(item => item.id !== id) };
        });
    }, []);

    const handleReset = () => {
        if (confirm("⚠️ Réinitialiser le CV ? Toutes les données seront perdues !")) {
            setCvData(initialCvData);
            showNotification("CV réinitialisé !");
        }
    };

    const handleExportJSON = () => {
        const dataStr = JSON.stringify(cvData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nancy-cv-${cvData.personalInfo.firstName || 'export'}.json`;
        a.click();
        showNotification("CV exporté en JSON !");
    };

    const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const imported = JSON.parse(event.target?.result as string);
                    setCvData(imported);
                    showNotification("CV importé avec succès !");
                } catch {
                    alert("Fichier invalide !");
                }
            };
            reader.readAsText(file);
        }
    };

    const handleDownloadPDF = async () => {
        if (!previewRef.current) return;
        setIsGeneratingPDF(true);
        try {
            const canvas = await html2canvas(previewRef.current, { scale: 2, useCORS: true, logging: false });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4', true);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const imgWidth = pdfWidth;
            const imgHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`${cvData.personalInfo.firstName || 'cv'}_${cvData.personalInfo.lastName || ''}.pdf`);
            showNotification("PDF téléchargé !");
        } catch (error) {
            console.error(error);
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    const showNotification = (msg: string) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    const CurrentTemplate = templates.find(t => t.id === selectedTemplate)?.component || CvPreviewTemplate1;

    // ==================== RENDER ====================

    return (
        <div className="h-screen flex flex-col bg-white overflow-hidden">
            {/* NOTIFICATION */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-brutal-lime border-3 border-black px-6 py-3 font-bold shadow-brutal flex items-center gap-2"
                    >
                        <Check size={20} /> {notification}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* HEADER */}
            <header className="flex-none h-16 border-b-3 border-black bg-white flex items-center justify-between px-4 z-50">
                <div className="flex items-center gap-4">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-full border-2 border-black overflow-hidden shadow-brutal-sm group-hover:rotate-6 transition-transform">
                            <img src={nancyAvatar} alt="Nancy" className="w-full h-full object-cover" />
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-xl font-black leading-none">Nancy<span className="text-brutal-pink">CV</span></h1>
                            <span className="text-[10px] font-mono font-bold text-gray-500">EDITOR MODE</span>
                        </div>
                    </Link>
                </div>

                {/* Center Actions */}
                <div className="hidden md:flex items-center gap-2">
                    <button onClick={() => setShowTemplatePanel(!showTemplatePanel)} className="flex items-center gap-2 px-4 py-2 border-3 border-black bg-white hover:bg-brutal-yellow transition-colors font-bold text-sm uppercase">
                        <Palette size={16} /> Template
                    </button>
                    <button onClick={handleExportJSON} className="flex items-center gap-2 px-4 py-2 border-3 border-black bg-white hover:bg-brutal-lime transition-colors font-bold text-sm uppercase">
                        <FileJson size={16} /> Export
                    </button>
                    <label className="flex items-center gap-2 px-4 py-2 border-3 border-black bg-white hover:bg-brutal-lime transition-colors font-bold text-sm uppercase cursor-pointer">
                        <Upload size={16} /> Import
                        <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
                    </label>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2">
                    <button 
                        onClick={handleDownloadPDF} 
                        disabled={isGeneratingPDF}
                        className="flex items-center gap-2 px-6 py-2 border-3 border-black bg-brutal-pink text-white font-black text-sm uppercase shadow-brutal hover:shadow-brutal-hover hover:-translate-y-0.5 transition-all disabled:opacity-50"
                    >
                        {isGeneratingPDF ? (
                            <span className="animate-spin">⏳</span>
                        ) : (
                            <Download size={18} />
                        )}
                        <span className="hidden sm:inline">Download PDF</span>
                    </button>
                    <button onClick={handleReset} className="p-2 border-3 border-black hover:bg-red-100 transition-colors" title="Réinitialiser">
                        <RotateCcw size={18} />
                    </button>
                </div>
            </header>

            {/* TEMPLATE PANEL */}
            <AnimatePresence>
                {showTemplatePanel && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-b-3 border-black bg-gray-50 overflow-hidden"
                    >
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-black uppercase">Choisir un Template</h3>
                                <button onClick={() => setShowTemplatePanel(false)}><X size={20} /></button>
                            </div>
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {templates.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => { setSelectedTemplate(t.id); setAccentColor(t.accent); }}
                                        className={cn(
                                            "flex-none w-32 border-3 border-black p-2 transition-all",
                                            selectedTemplate === t.id ? "bg-brutal-lime shadow-brutal" : "bg-white hover:bg-gray-100"
                                        )}
                                    >
                                        <div className="aspect-[3/4] bg-gray-200 mb-2 overflow-hidden">
                                            <img src={t.thumb} alt={t.name} className="w-full h-full object-cover" />
                                        </div>
                                        <span className="text-xs font-bold uppercase">{t.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex overflow-hidden">
                {/* SIDEBAR - Section Navigation */}
                <nav className={cn(
                    "flex-none border-r-3 border-black bg-white flex flex-col transition-all duration-300 w-20"
                )}>
                    {sections.map((section) => {
                        const Icon = section.icon;
                        const isActive = activeSection === section.id;
                        return (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={cn(
                                    "flex flex-col items-center justify-center py-4 px-2 border-b border-gray-200 transition-all relative group",
                                    isActive ? `${section.color} text-black` : "hover:bg-gray-100"
                                )}
                            >
                                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-black" />}
                                <Icon size={24} strokeWidth={isActive ? 3 : 2} />
                                <span className="text-[10px] font-bold uppercase mt-1 leading-tight text-center">
                                    {section.label}
                                </span>
                            </button>
                        );
                    })}
                    <div className="flex-1" />
                    <div className="p-2 border-t border-gray-200">
                        <img src={foxLogoDark} alt="Fox" className="w-full h-auto opacity-30" />
                    </div>
                </nav>

                {/* EDITOR PANEL */}
                <div className={cn(
                    "flex-none bg-white border-r-3 border-black flex flex-col transition-all duration-300 overflow-hidden",
                    showPreviewMobile ? "hidden lg:flex" : "flex",
                    "w-full lg:w-[420px]"
                )}>
                    {/* Section Header */}
                    <div className={cn("flex-none p-4 border-b-3 border-black", sections.find(s => s.id === activeSection)?.color)}>
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black uppercase flex items-center gap-2">
                                {(() => { const Icon = sections.find(s => s.id === activeSection)?.icon || User; return <Icon size={28} />; })()}
                                {sections.find(s => s.id === activeSection)?.label}
                            </h2>
                            <span className="bg-black text-white text-xs font-bold px-2 py-1">
                                {activeSection === 'experience' && cvData.experience.length}
                                {activeSection === 'education' && cvData.education.length}
                                {activeSection === 'skills' && cvData.skills.length}
                                {activeSection === 'languages' && cvData.languages.length}
                                {activeSection === 'personal' && '★'}
                                {activeSection === 'projects' && '∞'}
                            </span>
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {activeSection === 'personal' && (
                            <PersonalForm data={cvData.personalInfo} onChange={handlePersonalInfoChange} onPhotoChange={handlePhotoChange} />
                        )}

                        {activeSection === 'experience' && (
                            <ListForm
                                items={cvData.experience}
                                onUpdate={(id, field, value) => handleListUpdate('experience', id, field, value)}
                                onAdd={() => handleListAdd('experience', { title: '', company: '', startDate: '', endDate: '', description: '' })}
                                onRemove={(id) => handleListRemove('experience', id)}
                                addLabel="Ajouter une expérience"
                                itemLabel="Expérience"
                                section="experience"
                                renderItem={(item, update) => (
                                    <>
                                        <BrutalInput label="Poste / Titre" value={item.title} onChange={(v) => update('title', v)} placeholder="Designer Senior" icon={Briefcase} />
                                        <BrutalInput label="Entreprise" value={item.company} onChange={(v) => update('company', v)} placeholder="TechCorp Inc." />
                                        <div className="grid grid-cols-2 gap-3">
                                            <BrutalInput label="Date de début" value={item.startDate} onChange={(v) => update('startDate', v)} placeholder="2022" />
                                            <BrutalInput label="Date de fin" value={item.endDate} onChange={(v) => update('endDate', v)} placeholder="Aujourd'hui" />
                                        </div>
                                        <BrutalTextarea label="Description" value={item.description} onChange={(v) => update('description', v)} placeholder="Décrivez vos responsabilités..." rows={3} />
                                    </>
                                )}
                            />
                        )}

                        {activeSection === 'education' && (
                            <ListForm
                                items={cvData.education}
                                onUpdate={(id, field, value) => handleListUpdate('education', id, field, value)}
                                onAdd={() => handleListAdd('education', { degree: '', school: '', startDate: '', endDate: '', description: '' })}
                                onRemove={(id) => handleListRemove('education', id)}
                                addLabel="Ajouter une formation"
                                itemLabel="Formation"
                                section="education"
                                renderItem={(item, update) => (
                                    <>
                                        <BrutalInput label="Diplôme" value={item.degree} onChange={(v) => update('degree', v)} placeholder="Master Design" icon={GraduationCap} />
                                        <BrutalInput label="École / Université" value={item.school} onChange={(v) => update('school', v)} placeholder="Université de Paris" />
                                        <div className="grid grid-cols-2 gap-3">
                                            <BrutalInput label="Date de début" value={item.startDate} onChange={(v) => update('startDate', v)} placeholder="2018" />
                                            <BrutalInput label="Date de fin" value={item.endDate} onChange={(v) => update('endDate', v)} placeholder="2020" />
                                        </div>
                                        <BrutalTextarea label="Description / Résultats" value={item.description} onChange={(v) => update('description', v)} placeholder="Mention, projets..." rows={2} />
                                    </>
                                )}
                            />
                        )}

                        {activeSection === 'skills' && (
                            <ListForm
                                items={cvData.skills}
                                onUpdate={(id, field, value) => handleListUpdate('skills', id, field, value)}
                                onAdd={() => handleListAdd('skills', { name: '', level: 5 })}
                                onRemove={(id) => handleListRemove('skills', id)}
                                addLabel="Ajouter une compétence"
                                itemLabel="Compétence"
                                section="skills"
                                renderItem={(item, update) => (
                                    <div className="space-y-3">
                                        <BrutalInput 
                                            label="Compétence" 
                                            value={item.name} 
                                            onChange={(v) => update('name', v)} 
                                            placeholder="Figma, React, Dessin..." 
                                            icon={Zap}
                                        />
                                        <div>
                                            <label className="text-xs font-black uppercase tracking-wider mb-2 block">Niveau ({item.level}/10)</label>
                                            <div className="flex items-center gap-1 h-8">
                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((lvl) => (
                                                    <button
                                                        key={lvl}
                                                        onClick={() => update('level', lvl)}
                                                        onMouseEnter={(e) => { if(e.buttons === 1) update('level', lvl) }} // dragging
                                                        className={cn(
                                                            "flex-1 h-full border-2 border-black transition-all",
                                                            lvl <= item.level 
                                                                ? "bg-black translate-y-0 shadow-none" 
                                                                : "bg-white hover:bg-gray-200 translate-y-1"
                                                        )}
                                                        title={`Niveau ${lvl}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            />
                        )}

                        {activeSection === 'languages' && (
                            <ListForm
                                items={cvData.languages}
                                onUpdate={(id, field, value) => handleListUpdate('languages', id, field, value)}
                                onAdd={() => handleListAdd('languages', { name: '', level: 3 })}
                                onRemove={(id) => handleListRemove('languages', id)}
                                addLabel="Ajouter une langue"
                                itemLabel="Langue"
                                section="languages"
                                renderItem={(item, update) => (
                                    <div className="grid grid-cols-[1fr_auto] gap-4 items-end">
                                        <BrutalInput 
                                            label="Langue" 
                                            value={item.name} 
                                            onChange={(v) => update('name', v)} 
                                            placeholder="Français, Anglais..." 
                                            icon={MessageSquare}
                                        />
                                        <div className="w-40 relative">
                                            <label className="text-xs font-black uppercase tracking-wider mb-2 block">Niveau</label>
                                            <div className="relative">
                                                <select
                                                    value={item.level}
                                                    onChange={(e) => update('level', parseInt(e.target.value))}
                                                    className="w-full appearance-none bg-white border-3 border-black px-4 py-3 pr-8 font-bold text-sm focus:outline-none focus:shadow-brutal hover:bg-gray-50 transition-all cursor-pointer"
                                                >
                                                    <option value={1}>Débutant</option>
                                                    <option value={2}>Honnête</option>
                                                    <option value={3}>Intermédiaire</option>
                                                    <option value={4}>Avancé</option>
                                                    <option value={5}>Natif / Bilingue</option>
                                                </select>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <ChevronRight size={16} className="rotate-90" strokeWidth={3} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            />
                        )}

                        {activeSection === 'projects' && (
                            <div className="text-center py-12 text-gray-400">
                                <FolderOpen size={48} className="mx-auto mb-4 opacity-50" />
                                <p className="font-bold uppercase">Section Projets</p>
                                <p className="text-sm">Bientôt disponible...</p>
                            </div>
                        )}
                    </div>

                    {/* Mobile Preview Toggle */}
                    <div className="lg:hidden flex-none p-4 border-t-3 border-black">
                        <button
                            onClick={() => setShowPreviewMobile(true)}
                            className="w-full py-3 bg-brutal-lime border-3 border-black font-black uppercase flex items-center justify-center gap-2 shadow-brutal"
                        >
                            <Eye size={20} /> Voir Aperçu
                        </button>
                    </div>
                </div>

                {/* PREVIEW PANEL */}
                <div className={cn(
                    "flex-1 bg-gray-100 flex flex-col overflow-hidden relative",
                    showPreviewMobile ? "flex" : "hidden lg:flex"
                )}>
                    {/* Preview Controls */}
                    <div className="flex-none h-14 bg-white border-b-3 border-black flex items-center justify-center gap-4 px-4">
                        <button onClick={() => setShowPreviewMobile(false)} className="lg:hidden p-2 border-2 border-black hover:bg-gray-100">
                            <ChevronLeft size={18} />
                        </button>
                        <button onClick={() => setZoom(Math.max(30, zoom - 10))} className="p-2 border-2 border-black hover:bg-gray-100" title="Zoom Out">
                            <ZoomOut size={18} />
                        </button>
                        <span className="font-mono font-bold text-sm w-14 text-center">{zoom}%</span>
                        <button onClick={() => setZoom(Math.min(150, zoom + 10))} className="p-2 border-2 border-black hover:bg-gray-100" title="Zoom In">
                            <ZoomIn size={18} />
                        </button>
                        <div className="w-px h-6 bg-gray-300 mx-2" />
                        <button className="p-2 border-2 border-black hover:bg-gray-100" title="Desktop">
                            <Monitor size={18} />
                        </button>
                        <button className="p-2 border-2 border-black hover:bg-gray-100" title="Mobile">
                            <Smartphone size={18} />
                        </button>
                    </div>

                    {/* Preview Area */}
                    <div 
                        className="flex-1 overflow-auto p-8 flex justify-center"
                        style={{ 
                            backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
                            backgroundSize: '20px 20px'
                        }}
                    >
                        <div 
                            className="bg-white shadow-2xl transition-transform duration-200"
                            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
                        >
                            <CurrentTemplate
                                ref={previewRef}
                                cvData={cvData}
                                accentColor={accentColor}
                                onAccentColorChange={setAccentColor}
                            />
                        </div>
                    </div>

                    {/* Page Indicator */}
                    <div className="flex-none h-10 bg-white border-t-3 border-black flex items-center justify-center">
                        <span className="text-xs font-bold uppercase text-gray-500">Page 1 / 1</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
