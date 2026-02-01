// ============================================================================
// NANCY CV - Main CV Editor Component
// ============================================================================

import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Briefcase, GraduationCap, Wrench, Globe, FolderKanban,
    Award, Heart, Sparkles, UserCheck, LayoutGrid,
    Download, Upload, Undo2, Redo2, Eye, FileJson,
    FileText, Image as ImageIcon, Trash2, RefreshCw,
    ChevronLeft, ChevronRight, Menu, FileDown, Save, Cloud, CloudOff,
    Check, Loader2, Home, LogOut, Palette, BrainCircuit, Mail, Phone, MapPin
} from 'lucide-react';
import { useCVStore, useTemporalStore } from '../../store/cvStore';
import { downloadJSON, importFromFile, exportToPDF, exportToPlainText, exportToImage } from '../../utils/export';
import { useFirestoreSync } from '../../hooks/useFirestoreSync';
import { useAuth } from '../../contexts/AuthContext';
import { CV_TEMPLATES, getTemplateById } from '../CvPreview';
import AiModal from '../AiModal/AiModal';
import type { CVData, Experience, Education, Skill, Language, Project } from '../../types/cv';

// Import all form components
import { PersonalInfoForm } from './PersonalInfoForm';
import { ExperienceForm } from './ExperienceForm';
import { EducationForm } from './EducationForm';
import { SkillsForm } from './SkillsForm';
import { LanguagesForm } from './LanguagesForm';
import { ProjectsForm } from './ProjectsForm';
import { CertificationsForm } from './CertificationsForm';
import { VolunteerForm } from './VolunteerForm';
import { InterestsForm } from './InterestsForm';
import { ReferencesForm } from './ReferencesForm';
import { CustomSectionsForm } from './CustomSectionsForm';
import { cn } from '../../lib/utils';

// Section configuration
const SECTIONS = [
    { id: 'personal', label: 'Informations', icon: User, component: PersonalInfoForm, color: 'brutal-lime' },
    { id: 'experience', label: 'Expérience', icon: Briefcase, component: ExperienceForm, color: 'brutal-blue' },
    { id: 'education', label: 'Formation', icon: GraduationCap, component: EducationForm, color: 'brutal-yellow' },
    { id: 'skills', label: 'Compétences', icon: Wrench, component: SkillsForm, color: 'brutal-pink' },
    { id: 'languages', label: 'Langues', icon: Globe, component: LanguagesForm, color: 'emerald-400' },
    { id: 'projects', label: 'Projets', icon: FolderKanban, component: ProjectsForm, color: 'purple-400' },
    { id: 'certifications', label: 'Certifications', icon: Award, component: CertificationsForm, color: 'amber-400' },
    { id: 'volunteer', label: 'Bénévolat', icon: Heart, component: VolunteerForm, color: 'rose-400' },
    { id: 'interests', label: 'Intérêts', icon: Sparkles, component: InterestsForm, color: 'cyan-400' },
    { id: 'references', label: 'Références', icon: UserCheck, component: ReferencesForm, color: 'slate-400' },
    { id: 'custom', label: 'Personnalisé', icon: LayoutGrid, component: CustomSectionsForm, color: 'orange-400' },
] as const;

type SectionId = typeof SECTIONS[number]['id'];

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar Component
// ─────────────────────────────────────────────────────────────────────────────

interface SidebarProps {
    activeSection: SectionId;
    onSectionChange: (section: SectionId) => void;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    activeSection,
    onSectionChange,
    isCollapsed,
    onToggleCollapse,
}) => {
    const cv = useCVStore((state) => state.cv);
    
    const getCounts = (sectionId: SectionId): number | null => {
        switch (sectionId) {
            case 'experience': return cv.experience.length || null;
            case 'education': return cv.education.length || null;
            case 'skills': return cv.skills.length || null;
            case 'languages': return cv.languages.length || null;
            case 'projects': return cv.projects.length || null;
            case 'certifications': return cv.certifications.length || null;
            case 'volunteer': return cv.volunteer.length || null;
            case 'interests': return cv.interests.length || null;
            case 'references': return cv.references.length || null;
            case 'custom': return cv.customSections.length || null;
            default: return null;
        }
    };
    
    return (
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? 64 : 240 }}
            className="bg-white border-r-3 border-black flex flex-col h-full"
        >
            <div className="p-2 border-b-2 border-black">
                <button
                    onClick={onToggleCollapse}
                    className="w-full p-2 hover:bg-gray-100 flex items-center justify-center"
                >
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>
            
            <nav className="flex-1 overflow-y-auto py-2">
                {SECTIONS.map((section) => {
                    const Icon = section.icon;
                    const count = getCounts(section.id);
                    const isActive = activeSection === section.id;
                    
                    return (
                        <button
                            key={section.id}
                            onClick={() => onSectionChange(section.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 text-left transition-all relative group",
                                isActive ? "bg-black text-white font-bold" : "hover:bg-gray-100"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeSection"
                                    className="absolute left-0 top-0 bottom-0 w-1 bg-brutal-lime"
                                />
                            )}
                            <Icon size={20} className="shrink-0" />
                            {!isCollapsed && (
                                <>
                                    <span className="flex-1 truncate">{section.label}</span>
                                    {count !== null && (
                                        <span className={cn(
                                            "px-2 py-0.5 text-xs font-bold rounded-none border-2",
                                            isActive ? "bg-brutal-lime text-black border-brutal-lime" : "bg-gray-100 text-gray-600 border-gray-200"
                                        )}>
                                            {count}
                                        </span>
                                    )}
                                </>
                            )}
                            {isCollapsed && count !== null && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brutal-lime text-black text-xs font-bold flex items-center justify-center border-2 border-black">
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>
        </motion.aside>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Toolbar Component
// ─────────────────────────────────────────────────────────────────────────────

interface ToolbarProps {
    onExportPDF: () => void;
    onExportJSON: () => void;
    onImportJSON: () => void;
    onTogglePreview: () => void;
    showPreview: boolean;
    onSaveCloud?: () => void;
    isSaving?: boolean;
    lastSaved?: Date | null;
    isAuthenticated?: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
    onExportPDF,
    onExportJSON,
    onImportJSON,
    onTogglePreview,
    showPreview,
    onSaveCloud,
    isSaving,
    lastSaved,
    isAuthenticated,
}) => {
    const temporalStore = useTemporalStore();
    const clearCV = useCVStore((state) => state.clearCV);
    const loadSampleData = useCVStore((state) => state.loadSampleData);
    const isDirty = useCVStore((state) => state.isDirty);
    const { user, logout } = useAuth();
    const [showExportMenu, setShowExportMenu] = React.useState(false);
    const [showMoreMenu, setShowMoreMenu] = React.useState(false);
    const [showUserMenu, setShowUserMenu] = React.useState(false);
    
    const canUndo = temporalStore.pastStates.length > 0;
    const canRedo = temporalStore.futureStates.length > 0;
    
    const exportMenuRef = React.useRef<HTMLDivElement>(null);
    const moreMenuRef = React.useRef<HTMLDivElement>(null);
    const userMenuRef = React.useRef<HTMLDivElement>(null);
    
    React.useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
                setShowExportMenu(false);
            }
            if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
                setShowMoreMenu(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    const formatLastSaved = (date: Date | null | undefined) => {
        if (!date) return null;
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        
        if (diffMins < 1) return "À l'instant";
        if (diffMins < 60) return `Il y a ${diffMins} min`;
        return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    };
    
    return (
        <div className="h-14 border-b-3 border-black bg-white flex items-center justify-between px-4">
            {/* Left side - Navigation & Undo/Redo */}
            <div className="flex items-center gap-3">
                <Link
                    to="/"
                    className="p-2 border-2 border-black hover:bg-gray-100 transition-colors"
                    title="Accueil"
                >
                    <Home size={18} />
                </Link>
                
                <div className="w-px h-6 bg-gray-300" />
                
                <button
                    onClick={() => temporalStore.undo()}
                    disabled={!canUndo}
                    className={cn(
                        "p-2 border-2 border-black transition-colors",
                        canUndo ? "hover:bg-gray-100 active:bg-gray-200" : "opacity-30 cursor-not-allowed"
                    )}
                    title="Annuler (Ctrl+Z)"
                >
                    <Undo2 size={18} />
                </button>
                <button
                    onClick={() => temporalStore.redo()}
                    disabled={!canRedo}
                    className={cn(
                        "p-2 border-2 border-black transition-colors",
                        canRedo ? "hover:bg-gray-100 active:bg-gray-200" : "opacity-30 cursor-not-allowed"
                    )}
                    title="Rétablir (Ctrl+Y)"
                >
                    <Redo2 size={18} />
                </button>
                
                <div className="w-px h-6 bg-gray-300" />
                
                {/* Cloud Save Status */}
                {isAuthenticated && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onSaveCloud}
                            disabled={isSaving || !isDirty}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 border-2 border-black text-sm font-bold transition-colors",
                                isSaving 
                                    ? "bg-gray-100 cursor-wait" 
                                    : isDirty 
                                        ? "bg-brutal-blue text-white hover:bg-brutal-blue/80"
                                        : "bg-gray-50 text-gray-400"
                            )}
                        >
                            {isSaving ? (
                                <Loader2 size={14} className="animate-spin" />
                            ) : isDirty ? (
                                <Cloud size={14} />
                            ) : (
                                <Check size={14} />
                            )}
                            {isSaving ? 'Sauvegarde...' : isDirty ? 'Sauvegarder' : 'Sauvegardé'}
                        </button>
                        
                        {lastSaved && !isSaving && (
                            <span className="text-xs text-gray-400">
                                {formatLastSaved(lastSaved)}
                            </span>
                        )}
                    </div>
                )}
            </div>
            
            {/* Right side - Actions & User */}
            <div className="flex items-center gap-2">
                <button
                    onClick={onTogglePreview}
                    className={cn(
                        "px-4 py-2 border-2 border-black font-bold text-sm transition-colors flex items-center gap-2",
                        showPreview ? "bg-black text-white" : "bg-white hover:bg-gray-100"
                    )}
                >
                    <Eye size={16} />
                    <span className="hidden sm:inline">Aperçu</span>
                </button>
                
                <button
                    onClick={onImportJSON}
                    className="px-4 py-2 border-2 border-black font-bold text-sm hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                    <Upload size={16} />
                    <span className="hidden sm:inline">Importer</span>
                </button>
                
                <div className="relative" ref={exportMenuRef}>
                    <button
                        onClick={() => setShowExportMenu(!showExportMenu)}
                        className="px-4 py-2 border-2 border-black font-bold text-sm bg-brutal-lime hover:bg-brutal-lime/80 transition-colors flex items-center gap-2"
                    >
                        <Download size={16} />
                        <span className="hidden sm:inline">Exporter</span>
                    </button>
                    
                    <AnimatePresence>
                        {showExportMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute right-0 top-full mt-2 w-48 bg-white border-3 border-black shadow-brutal z-50"
                            >
                                <button
                                    onClick={() => { onExportPDF(); setShowExportMenu(false); }}
                                    className="w-full px-4 py-3 text-left hover:bg-brutal-lime/20 flex items-center gap-3 font-bold text-sm"
                                >
                                    <FileDown size={16} />
                                    PDF
                                </button>
                                <button
                                    onClick={() => { onExportJSON(); setShowExportMenu(false); }}
                                    className="w-full px-4 py-3 text-left hover:bg-brutal-blue/20 flex items-center gap-3 font-bold text-sm border-t-2 border-black"
                                >
                                    <FileJson size={16} />
                                    JSON (sauvegarde)
                                </button>
                                <button
                                    onClick={() => {
                                        const cv = useCVStore.getState().cv;
                                        exportToPlainText(cv);
                                        setShowExportMenu(false);
                                    }}
                                    className="w-full px-4 py-3 text-left hover:bg-brutal-yellow/20 flex items-center gap-3 font-bold text-sm border-t-2 border-black"
                                >
                                    <FileText size={16} />
                                    Texte brut (ATS)
                                </button>
                                <button
                                    onClick={() => {
                                        const previewEl = document.getElementById('cv-preview');
                                        if (previewEl) exportToImage(previewEl);
                                        setShowExportMenu(false);
                                    }}
                                    className="w-full px-4 py-3 text-left hover:bg-brutal-pink/20 flex items-center gap-3 font-bold text-sm border-t-2 border-black"
                                >
                                    <ImageIcon size={16} />
                                    Image PNG
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                
                <div className="relative" ref={moreMenuRef}>
                    <button
                        onClick={() => setShowMoreMenu(!showMoreMenu)}
                        className="p-2 border-2 border-black hover:bg-gray-100 transition-colors"
                    >
                        <Menu size={18} />
                    </button>
                    
                    <AnimatePresence>
                        {showMoreMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute right-0 top-full mt-2 w-56 bg-white border-3 border-black shadow-brutal z-50"
                            >
                                <button
                                    onClick={() => { loadSampleData(); setShowMoreMenu(false); }}
                                    className="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center gap-3 font-bold text-sm"
                                >
                                    <RefreshCw size={16} />
                                    Charger exemple
                                </button>
                                <div className="border-t-2 border-gray-200" />
                                <button
                                    onClick={() => {
                                        if (confirm('Êtes-vous sûr de vouloir tout effacer ?')) {
                                            clearCV();
                                            setShowMoreMenu(false);
                                        }
                                    }}
                                    className="w-full px-4 py-3 text-left hover:bg-red-50 flex items-center gap-3 font-bold text-sm text-red-500"
                                >
                                    <Trash2 size={16} />
                                    Tout effacer
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                
                {/* User Avatar */}
                {user && (
                    <div className="relative ml-2" ref={userMenuRef}>
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center"
                        >
                            {user.photoURL ? (
                                <img
                                    src={user.photoURL}
                                    alt={user.displayName || 'Avatar'}
                                    className="w-9 h-9 rounded-full border-2 border-black object-cover hover:border-brutal-lime transition-colors"
                                />
                            ) : (
                                <div className="w-9 h-9 rounded-full border-2 border-black bg-brutal-lime flex items-center justify-center hover:bg-brutal-lime/80 transition-colors">
                                    <User size={18} />
                                </div>
                            )}
                        </button>
                        
                        <AnimatePresence>
                            {showUserMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute right-0 top-full mt-2 w-48 bg-white border-3 border-black shadow-brutal z-50"
                                >
                                    <div className="px-4 py-3 border-b-2 border-black bg-gray-50">
                                        <p className="font-bold text-sm truncate">{user.displayName}</p>
                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                    </div>
                                    <Link
                                        to="/dashboard"
                                        className="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center gap-3 font-bold text-sm"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <FolderKanban size={16} />
                                        Mes CV
                                    </Link>
                                    <button
                                        onClick={() => { logout(); setShowUserMenu(false); }}
                                        className="w-full px-4 py-3 text-left hover:bg-red-50 flex items-center gap-3 font-bold text-sm text-red-500 border-t-2 border-gray-200"
                                    >
                                        <LogOut size={16} />
                                        Déconnexion
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Preview Component
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// Template Selector Component
// ─────────────────────────────────────────────────────────────────────────────

interface TemplateSelectorProps {
    currentTemplate: string;
    onSelectTemplate: (templateId: string) => void;
    isOpen: boolean;
    onClose: () => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
    currentTemplate,
    onSelectTemplate,
    isOpen,
    onClose,
}) => {
    if (!isOpen) return null;
    
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white border-4 border-black shadow-brutal max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-black text-white px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-black uppercase flex items-center gap-3">
                        <Palette size={24} />
                        Choisir un template
                    </h2>
                    <button onClick={onClose} className="hover:bg-white/10 p-2 transition-colors">
                        <Trash2 size={20} />
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {CV_TEMPLATES.map((template) => (
                            <button
                                key={template.id}
                                onClick={() => {
                                    onSelectTemplate(template.id);
                                    onClose();
                                }}
                                className={cn(
                                    "p-4 border-3 border-black text-left transition-all hover:-translate-y-1",
                                    currentTemplate === template.id
                                        ? "bg-brutal-lime shadow-brutal"
                                        : "bg-white hover:bg-gray-50 hover:shadow-brutal"
                                )}
                            >
                                <div className="aspect-[210/297] bg-gray-100 border-2 border-black mb-3 flex items-center justify-center">
                                    <FileText size={48} className="text-gray-300" />
                                </div>
                                <h3 className="font-black uppercase text-sm">{template.name}</h3>
                                <p className="text-xs text-gray-500 mt-1">{template.description}</p>
                                <span className={cn(
                                    "inline-block mt-2 px-2 py-0.5 text-[10px] font-bold uppercase border-2 border-black",
                                    template.category === 'modern' && "bg-brutal-blue text-white",
                                    template.category === 'classic' && "bg-gray-200",
                                    template.category === 'creative' && "bg-brutal-pink text-white",
                                    template.category === 'minimal' && "bg-white"
                                )}>
                                    {template.category}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Default Preview Component (used as fallback)
// ─────────────────────────────────────────────────────────────────────────────

const CVPreviewContent: React.FC<{ cv: CVData }> = ({ cv }) => {
    const { personalInfo, experience, education, skills, languages, projects } = cv;
    
    return (
        <div className="font-sans text-sm leading-relaxed">
            <header className="border-b-4 border-black pb-4 mb-6">
                {personalInfo.photo && (
                    <img
                        src={personalInfo.photo}
                        alt="Photo"
                        className="w-24 h-24 object-cover border-3 border-black mb-4"
                    />
                )}
                <h1 className="text-3xl font-black uppercase">
                    {personalInfo.firstName} {personalInfo.lastName}
                </h1>
                {personalInfo.jobTitle && (
                    <p className="text-lg font-bold text-gray-600 mt-1">{personalInfo.jobTitle}</p>
                )}
                <div className="flex flex-wrap gap-4 mt-3 text-xs">
                    {personalInfo.email && (
                        <span className="flex items-center gap-1">
                            <Mail size={12} />
                            {personalInfo.email}
                        </span>
                    )}
                    {personalInfo.phone && (
                        <span className="flex items-center gap-1">
                            <Phone size={12} />
                            {personalInfo.phone}
                        </span>
                    )}
                    {personalInfo.city && (
                        <span className="flex items-center gap-1">
                            <MapPin size={12} />
                            {personalInfo.city}
                        </span>
                    )}
                </div>
                {personalInfo.summary && (
                    <p className="mt-4 text-gray-700">{personalInfo.summary}</p>
                )}
            </header>
            
            {experience.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-black uppercase border-b-2 border-black pb-1 mb-4">Expérience</h2>
                    {experience.filter((e: Experience) => e.visible).map((exp: Experience) => (
                        <div key={exp.id} className="mb-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold">{exp.title}</h3>
                                    <p className="text-gray-600">{exp.company}</p>
                                </div>
                                <span className="text-xs text-gray-500">
                                    {exp.startDate} - {exp.current ? 'Présent' : exp.endDate}
                                </span>
                            </div>
                            {exp.description && <p className="mt-2 text-gray-700">{exp.description}</p>}
                            {exp.highlights && exp.highlights.length > 0 && (
                                <ul className="mt-2 list-disc pl-4 text-gray-600">
                                    {exp.highlights.map((h: string, i: number) => <li key={i}>{h}</li>)}
                                </ul>
                            )}
                        </div>
                    ))}
                </section>
            )}
            
            {education.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-black uppercase border-b-2 border-black pb-1 mb-4">Formation</h2>
                    {education.filter((e: Education) => e.visible).map((edu: Education) => (
                        <div key={edu.id} className="mb-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold">{edu.degree} - {edu.field}</h3>
                                    <p className="text-gray-600">{edu.school}</p>
                                </div>
                                <span className="text-xs text-gray-500">
                                    {edu.startDate} - {edu.current ? 'Présent' : edu.endDate}
                                </span>
                            </div>
                        </div>
                    ))}
                </section>
            )}
            
            {skills.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-black uppercase border-b-2 border-black pb-1 mb-4">Compétences</h2>
                    <div className="flex flex-wrap gap-2">
                        {skills.filter((s: Skill) => s.visible).map((skill: Skill) => (
                            <span key={skill.id} className="px-2 py-1 bg-brutal-lime border-2 border-black text-xs font-bold">
                                {skill.name}
                            </span>
                        ))}
                    </div>
                </section>
            )}
            
            {languages.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-black uppercase border-b-2 border-black pb-1 mb-4">Langues</h2>
                    <div className="flex flex-wrap gap-4">
                        {languages.filter((l: Language) => l.visible).map((lang: Language) => (
                            <div key={lang.id} className="text-sm">
                                <span className="font-bold">{lang.name}</span>
                                <span className="text-gray-500 ml-2">{lang.level}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}
            
            {projects.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-black uppercase border-b-2 border-black pb-1 mb-4">Projets</h2>
                    {projects.filter((p: Project) => p.visible).map((project: Project) => (
                        <div key={project.id} className="mb-4">
                            <h3 className="font-bold">{project.name}</h3>
                            {project.description && <p className="text-gray-700 mt-1">{project.description}</p>}
                            {project.technologies && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {project.technologies.map((tech: string, i: number) => (
                                        <span key={i} className="px-2 py-0.5 bg-gray-100 text-xs">{tech}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </section>
            )}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Editor Component
// ─────────────────────────────────────────────────────────────────────────────

export const CVEditor: React.FC = () => {
    const cv = useCVStore((state) => state.cv);
    const importCV = useCVStore((state) => state.importCV);
    const [activeSection, setActiveSection] = React.useState<SectionId>('personal');
    const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
    const [showPreview, setShowPreview] = React.useState(true);
    const [selectedTemplate, setSelectedTemplate] = React.useState('brutalist');
    const [showTemplateSelector, setShowTemplateSelector] = React.useState(false);
    const [showAiModal, setShowAiModal] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const previewRef = React.useRef<HTMLDivElement>(null);
    const temporalStore = useTemporalStore();
    
    // Get CV ID from URL params
    const [searchParams] = useSearchParams();
    const cvIdFromUrl = searchParams.get('cv');
    
    // Firestore sync
    const { saveCV: saveToCloud, isSaving, lastSaved, isAuthenticated } = useFirestoreSync(cvIdFromUrl);
    
    const ActiveComponent = SECTIONS.find(s => s.id === activeSection)?.component || PersonalInfoForm;
    const activeConfig = SECTIONS.find(s => s.id === activeSection);
    
    // Get selected template component
    const templateConfig = getTemplateById(selectedTemplate);
    const TemplateComponent = templateConfig?.component;
    
    // Handler for AI generated CV
    const handleAiGenerated = (cvData: any) => {
        // Import the AI-generated CV data into the store
        importCV({ data: cvData, schemaVersion: '1.0', exportedAt: new Date().toISOString(), generator: 'nancy-cv' });
        setShowAiModal(false);
    };
    
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                temporalStore.undo();
            }
            if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
                e.preventDefault();
                temporalStore.redo();
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                // Save to cloud if authenticated, otherwise download JSON
                if (isAuthenticated) {
                    saveToCloud();
                } else {
                    downloadJSON(cv, `cv-${Date.now()}`);
                }
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [cv, temporalStore]);
    
    const handleExportPDF = async () => {
        const previewEl = document.getElementById('cv-preview');
        if (previewEl) {
            await exportToPDF(previewEl, { format: 'a4' });
        }
    };
    
    const handleExportJSON = () => {
        downloadJSON(cv, `cv-${cv.personalInfo.firstName}-${cv.personalInfo.lastName}`);
    };
    
    const handleImportJSON = () => {
        fileInputRef.current?.click();
    };
    
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const result = await importFromFile(file);
            if (result && result.data) {
                useCVStore.getState().importCV(result);
            } else {
                alert('Erreur lors de l\'import');
            }
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    
    return (
        <div className="h-screen flex flex-col bg-gray-100">
            <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
            />
            
            <Toolbar
                onExportPDF={handleExportPDF}
                onExportJSON={handleExportJSON}
                onImportJSON={handleImportJSON}
                onTogglePreview={() => setShowPreview(!showPreview)}
                showPreview={showPreview}
                onSaveCloud={saveToCloud}
                isSaving={isSaving}
                lastSaved={lastSaved}
                isAuthenticated={isAuthenticated}
            />
            
            <div className="flex-1 flex overflow-hidden">
                <Sidebar
                    activeSection={activeSection}
                    onSectionChange={setActiveSection}
                    isCollapsed={sidebarCollapsed}
                    onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                />
                
                <div className={cn("flex-1 overflow-hidden flex flex-col", showPreview ? "w-1/2" : "w-full")}>
                    <div className="bg-white border-b-2 border-black p-4">
                        <div className="flex items-center gap-3">
                            {activeConfig && (
                                <div className={cn("w-10 h-10 border-2 border-black flex items-center justify-center bg-brutal-lime")}>
                                    <activeConfig.icon size={20} />
                                </div>
                            )}
                            <div>
                                <h2 className="text-xl font-black uppercase">{activeConfig?.label}</h2>
                                <p className="text-xs text-gray-500">
                                    Section {SECTIONS.findIndex(s => s.id === activeSection) + 1} sur {SECTIONS.length}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeSection}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ActiveComponent />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                    
                    <div className="bg-white border-t-2 border-black p-4 flex justify-between items-center">
                        <button
                            onClick={() => {
                                const currentIndex = SECTIONS.findIndex(s => s.id === activeSection);
                                if (currentIndex > 0) {
                                    setActiveSection(SECTIONS[currentIndex - 1].id);
                                }
                            }}
                            disabled={activeSection === SECTIONS[0].id}
                            className={cn(
                                "px-4 py-2 border-2 border-black font-bold flex items-center gap-2 transition-colors",
                                activeSection === SECTIONS[0].id ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-100"
                            )}
                        >
                            <ChevronLeft size={18} />
                            Précédent
                        </button>
                        
                        {/* AI Button */}
                        <button
                            onClick={() => setShowAiModal(true)}
                            className="px-4 py-2 border-2 border-black font-bold flex items-center gap-2 bg-gradient-to-r from-pink-500 to-indigo-600 text-white hover:opacity-90 transition-all"
                        >
                            <BrainCircuit size={18} />
                            Générer avec IA
                        </button>
                        
                        <button
                            onClick={() => {
                                const currentIndex = SECTIONS.findIndex(s => s.id === activeSection);
                                if (currentIndex < SECTIONS.length - 1) {
                                    setActiveSection(SECTIONS[currentIndex + 1].id);
                                }
                            }}
                            disabled={activeSection === SECTIONS[SECTIONS.length - 1].id}
                            className={cn(
                                "px-4 py-2 border-2 border-black font-bold flex items-center gap-2 transition-colors",
                                activeSection === SECTIONS[SECTIONS.length - 1].id ? "opacity-30 cursor-not-allowed" : "bg-black text-white hover:bg-gray-800"
                            )}
                        >
                            Suivant
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
                
                <AnimatePresence>
                    {showPreview && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: '50%', opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="border-l-3 border-black bg-gray-200 overflow-hidden flex flex-col"
                        >
                            {/* Preview Header with Template Selector */}
                            <div className="bg-white border-b-2 border-black p-3 flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold">Template:</span>
                                    <button
                                        onClick={() => setShowTemplateSelector(true)}
                                        className="px-3 py-1.5 border-2 border-black font-bold text-sm flex items-center gap-2 hover:bg-brutal-lime transition-colors"
                                    >
                                        <Palette size={16} />
                                        {templateConfig?.name || 'Choisir'}
                                    </button>
                                </div>
                            </div>
                            
                            {/* Preview Content */}
                            <div className="flex-1 overflow-auto p-6">
                                <div className="bg-white shadow-2xl mx-auto" style={{ maxWidth: '210mm' }}>
                                    <div id="cv-preview" ref={previewRef}>
                                        {TemplateComponent ? (
                                            <TemplateComponent cvData={cv} ref={previewRef} />
                                        ) : (
                                            <div className="p-8">
                                                <CVPreviewContent cv={cv} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            {/* Template Selector Modal */}
            <AnimatePresence>
                <TemplateSelector
                    currentTemplate={selectedTemplate}
                    onSelectTemplate={setSelectedTemplate}
                    isOpen={showTemplateSelector}
                    onClose={() => setShowTemplateSelector(false)}
                />
            </AnimatePresence>
            
            {/* AI Modal */}
            <AiModal
                isOpen={showAiModal}
                onClose={() => setShowAiModal(false)}
                onAiGenerated={handleAiGenerated}
            />
        </div>
    );
};

export default CVEditor;
