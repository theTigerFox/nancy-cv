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
    Check, Loader2, Home, LogOut, Palette, BrainCircuit, Mail, Phone, MapPin,
    X, Settings2, Type, Maximize2, Edit3, ZoomIn, ZoomOut, RotateCcw,
    Layers, Grid3X3, Circle, Square, RectangleHorizontal, 
    AlignLeft, AlignCenter, AlignRight, Minus, Plus
} from 'lucide-react';
import { useCVStore, useTemporalStore } from '../../store/cvStore';
import { downloadJSON, importFromFile, exportToPlainText, exportToImage } from '../../utils/export';
import { downloadPDF as downloadPDFNative } from '../../pdf/exportService';
import { useFirestoreSync } from '../../hooks/useFirestoreSync';
import { useAuth } from '../../contexts/AuthContext';
import { templateRegistry, getTemplateConfig, getTemplateComponent } from '../../templates/registry';
import { registerAllTemplates, TEMPLATE_IDS } from '../../templates/library';
import type { TemplateConfig, TemplateCustomization, TemplateColors, TemplateTypography, TemplateSpacing, TemplateLayout } from '../../templates/types';
import type { CvData } from '../../types/cv.d';
import AiModal from '../AiModal/AiModal';
import type { CVData, Experience, Education, Skill, Language, Project } from '../../types/cv';
import { FontPicker, loadGoogleFonts, GOOGLE_FONTS } from './FontPicker';
import { InlineEditorProvider } from './InlineEditor';

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
                                        ? "bg-brutal-pink text-white hover:bg-brutal-blue/80"
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
    // Initialise les templates si pas encore fait
    React.useEffect(() => {
        registerAllTemplates();
    }, []);
    
    const templates = templateRegistry.getAll();
    const categories = templateRegistry.getCategories();
    const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
    
    const filteredTemplates = selectedCategory 
        ? templates.filter(t => t.manifest.metadata.category === selectedCategory)
        : templates;
    
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
                className="bg-white border-4 border-black shadow-brutal max-w-5xl w-full mx-4 max-h-[85vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-black text-white px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-black uppercase flex items-center gap-3">
                        <Palette size={24} />
                        Choisir un template
                    </h2>
                    <button onClick={onClose} className="hover:bg-white/10 p-2 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                
                {/* Category Filter */}
                <div className="px-6 py-3 border-b-2 border-black bg-gray-50 flex gap-2 flex-wrap">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={cn(
                            "px-3 py-1.5 border-2 border-black text-sm font-bold transition-colors",
                            !selectedCategory ? "bg-black text-white" : "bg-white hover:bg-gray-100"
                        )}
                    >
                        Tous ({templates.length})
                    </button>
                    {categories.map(({ category, count }) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={cn(
                                "px-3 py-1.5 border-2 border-black text-sm font-bold transition-colors capitalize",
                                selectedCategory === category ? "bg-black text-white" : "bg-white hover:bg-gray-100"
                            )}
                        >
                            {category} ({count})
                        </button>
                    ))}
                </div>
                
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredTemplates.map((template) => {
                            const { metadata, colors } = template.manifest;
                            return (
                                <button
                                    key={metadata.id}
                                    onClick={() => {
                                        onSelectTemplate(metadata.id);
                                        onClose();
                                    }}
                                    className={cn(
                                        "p-3 border-3 border-black text-left transition-all hover:-translate-y-1 group",
                                        currentTemplate === metadata.id
                                            ? "bg-brutal-lime shadow-brutal"
                                            : "bg-white hover:bg-gray-50 hover:shadow-brutal"
                                    )}
                                >
                                    {/* Template Preview */}
                                    <div 
                                        className="aspect-[210/297] border-2 border-black mb-3 relative overflow-hidden"
                                        style={{ 
                                            backgroundColor: colors.backgroundAlt,
                                        }}
                                    >
                                        {/* Mini preview */}
                                        <div className="absolute inset-2 flex flex-col">
                                            <div 
                                                className="h-8 mb-2" 
                                                style={{ backgroundColor: colors.primary }}
                                            />
                                            <div className="flex-1 flex">
                                                {metadata.category === 'modern' || metadata.category === 'creative' ? (
                                                    <>
                                                        <div 
                                                            className="w-2/5" 
                                                            style={{ backgroundColor: colors.secondary + '30' }}
                                                        />
                                                        <div className="flex-1 p-1">
                                                            <div className="h-1 w-3/4 mb-1" style={{ backgroundColor: colors.text + '40' }} />
                                                            <div className="h-1 w-1/2" style={{ backgroundColor: colors.text + '20' }} />
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="flex-1 p-1 space-y-1">
                                                        <div className="h-1 w-full" style={{ backgroundColor: colors.text + '30' }} />
                                                        <div className="h-1 w-3/4" style={{ backgroundColor: colors.text + '20' }} />
                                                        <div className="h-1 w-5/6" style={{ backgroundColor: colors.text + '15' }} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* Selected indicator */}
                                        {currentTemplate === metadata.id && (
                                            <div className="absolute top-2 right-2 w-6 h-6 bg-black text-white flex items-center justify-center">
                                                <Check size={14} />
                                            </div>
                                        )}
                                    </div>
                                    
                                    <h3 className="font-black uppercase text-sm truncate">{metadata.name}</h3>
                                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{metadata.description}</p>
                                    
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        <span className={cn(
                                            "px-2 py-0.5 text-[10px] font-bold uppercase border border-black",
                                            metadata.category === 'modern' && "bg-brutal-blue text-white",
                                            metadata.category === 'classic' && "bg-gray-200",
                                            metadata.category === 'creative' && "bg-brutal-pink text-white",
                                            metadata.category === 'minimal' && "bg-white",
                                            metadata.category === 'professional' && "bg-brutal-yellow"
                                        )}>
                                            {metadata.category}
                                        </span>
                                        {metadata.isPremium && (
                                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-gradient-to-r from-amber-400 to-orange-500 text-white border border-orange-600">
                                                PRO
                                            </span>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                    
                    {filteredTemplates.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <FileText size={48} className="mx-auto mb-4 opacity-50" />
                            <p>Aucun template dans cette categorie</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Advanced Customization Panel Component
// ─────────────────────────────────────────────────────────────────────────────

interface CustomizationPanelProps {
    config: TemplateConfig;
    customization: TemplateCustomization;
    onCustomizationChange: (customization: TemplateCustomization) => void;
    isOpen: boolean;
    onClose: () => void;
}

const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
    config,
    customization,
    onCustomizationChange,
    isOpen,
    onClose,
}) => {
    const [activeTab, setActiveTab] = React.useState<'colors' | 'typography' | 'layout' | 'spacing' | 'advanced'>('colors');
    
    const updateColors = (key: keyof TemplateColors, value: string) => {
        onCustomizationChange({
            ...customization,
            colors: {
                ...customization.colors,
                [key]: value,
            },
        });
    };
    
    const updateTypography = (key: keyof TemplateTypography, value: string | number) => {
        onCustomizationChange({
            ...customization,
            typography: {
                ...customization.typography,
                [key]: value,
            },
        });
    };
    
    // Preset de couleurs - beaucoup plus riche
    const colorPresets = [
        { name: 'Pro Blue', primary: '#1e3a5f', secondary: '#2563eb', accent: '#f59e0b', text: '#1f2937', background: '#ffffff', backgroundAlt: '#f8fafc' },
        { name: 'Elegant Dark', primary: '#0f172a', secondary: '#334155', accent: '#a855f7', text: '#1e293b', background: '#ffffff', backgroundAlt: '#f1f5f9' },
        { name: 'Fresh Green', primary: '#059669', secondary: '#10b981', accent: '#fbbf24', text: '#064e3b', background: '#ffffff', backgroundAlt: '#ecfdf5' },
        { name: 'Bold Red', primary: '#dc2626', secondary: '#f97316', accent: '#fbbf24', text: '#1f2937', background: '#ffffff', backgroundAlt: '#fef2f2' },
        { name: 'Creative Purple', primary: '#8b5cf6', secondary: '#ec4899', accent: '#06b6d4', text: '#1e1b4b', background: '#ffffff', backgroundAlt: '#faf5ff' },
        { name: 'Minimal Gray', primary: '#18181b', secondary: '#3f3f46', accent: '#71717a', text: '#27272a', background: '#ffffff', backgroundAlt: '#fafafa' },
        { name: 'Ocean Blue', primary: '#0369a1', secondary: '#0ea5e9', accent: '#38bdf8', text: '#0c4a6e', background: '#ffffff', backgroundAlt: '#f0f9ff' },
        { name: 'Sunset Orange', primary: '#c2410c', secondary: '#ea580c', accent: '#fb923c', text: '#431407', background: '#ffffff', backgroundAlt: '#fff7ed' },
        { name: 'Forest', primary: '#166534', secondary: '#22c55e', accent: '#86efac', text: '#14532d', background: '#ffffff', backgroundAlt: '#f0fdf4' },
        { name: 'Royal', primary: '#4c1d95', secondary: '#7c3aed', accent: '#c4b5fd', text: '#2e1065', background: '#ffffff', backgroundAlt: '#f5f3ff' },
        { name: 'Rose', primary: '#be123c', secondary: '#f43f5e', accent: '#fda4af', text: '#881337', background: '#ffffff', backgroundAlt: '#fff1f2' },
        { name: 'Teal', primary: '#0f766e', secondary: '#14b8a6', accent: '#5eead4', text: '#134e4a', background: '#ffffff', backgroundAlt: '#f0fdfa' },
    ];
    
    // Presets de polices - plus d'options
    const fontPresets = [
        { name: 'Moderne', heading: "'Inter', sans-serif", body: "'Inter', sans-serif", desc: 'Clean et contemporain' },
        { name: 'Classique', heading: "'Playfair Display', serif", body: "'Source Sans Pro', sans-serif", desc: 'Elegant et intemporel' },
        { name: 'Tech', heading: "'Space Grotesk', sans-serif", body: "'Roboto', sans-serif", desc: 'Pour les profils tech' },
        { name: 'Editorial', heading: "'Cormorant Garamond', serif", body: "'Lora', serif", desc: 'Style magazine' },
        { name: 'Clean', heading: "'Poppins', sans-serif", body: "'Open Sans', sans-serif", desc: 'Simple et lisible' },
        { name: 'Bold', heading: "'Montserrat', sans-serif", body: "'Nunito', sans-serif", desc: 'Fort et impactant' },
        { name: 'Minimal', heading: "'DM Sans', sans-serif", body: "'DM Sans', sans-serif", desc: 'Ultra minimaliste' },
        { name: 'Creative', heading: "'Abril Fatface', serif", body: "'Quicksand', sans-serif", desc: 'Artistique et unique' },
    ];
    
    if (!isOpen) return null;
    
    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-96 bg-white border-l-4 border-black shadow-2xl z-50 flex flex-col"
        >
            <div className="bg-black text-white px-4 py-3 flex items-center justify-between">
                <h3 className="font-black uppercase flex items-center gap-2">
                    <Settings2 size={18} />
                    Personnalisation avancee
                </h3>
                <button onClick={onClose} className="hover:bg-white/10 p-1.5 transition-colors">
                    <X size={18} />
                </button>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b-2 border-black overflow-x-auto">
                {[
                    { id: 'colors', label: 'Couleurs', icon: Palette },
                    { id: 'typography', label: 'Typo', icon: Type },
                    { id: 'layout', label: 'Layout', icon: Layers },
                    { id: 'spacing', label: 'Espaces', icon: Grid3X3 },
                    { id: 'advanced', label: 'Avance', icon: Settings2 },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                            "flex-1 py-2.5 text-[10px] font-bold uppercase flex flex-col items-center gap-0.5 transition-colors min-w-[60px]",
                            activeTab === tab.id ? "bg-brutal-lime" : "hover:bg-gray-100"
                        )}
                    >
                        <tab.icon size={14} />
                        {tab.label}
                    </button>
                ))}
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
                {/* Colors Tab */}
                {activeTab === 'colors' && (
                    <div className="space-y-5">
                        {/* Presets Grid */}
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
                                Themes de couleurs
                            </label>
                            <div className="grid grid-cols-4 gap-2">
                                {colorPresets.map(preset => (
                                    <button
                                        key={preset.name}
                                        onClick={() => onCustomizationChange({
                                            ...customization,
                                            colors: {
                                                primary: preset.primary,
                                                secondary: preset.secondary,
                                                accent: preset.accent,
                                                text: preset.text,
                                                background: preset.background,
                                                backgroundAlt: preset.backgroundAlt,
                                            },
                                        })}
                                        className="p-2 border-2 border-black hover:shadow-brutal transition-all text-center group"
                                        title={preset.name}
                                    >
                                        <div className="flex gap-0.5 mb-1 justify-center">
                                            <div className="w-3 h-3 border border-black" style={{ backgroundColor: preset.primary }} />
                                            <div className="w-3 h-3 border border-black" style={{ backgroundColor: preset.secondary }} />
                                            <div className="w-3 h-3 border border-black" style={{ backgroundColor: preset.accent }} />
                                        </div>
                                        <span className="text-[8px] font-bold group-hover:text-brutal-blue">{preset.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        {/* All Color Controls */}
                        <div className="space-y-3">
                            <label className="block text-xs font-bold uppercase text-gray-500">
                                Couleurs personnalisees
                            </label>
                            {[
                                { key: 'primary', label: 'Couleur principale', desc: 'Headers, accents majeurs' },
                                { key: 'secondary', label: 'Couleur secondaire', desc: 'Sous-titres, elements' },
                                { key: 'accent', label: 'Couleur accent', desc: 'Highlights, boutons' },
                                { key: 'text', label: 'Texte principal', desc: 'Corps du texte' },
                                { key: 'textLight', label: 'Texte secondaire', desc: 'Descriptions, dates' },
                                { key: 'background', label: 'Fond principal', desc: 'Arriere-plan' },
                                { key: 'backgroundAlt', label: 'Fond alternatif', desc: 'Sidebar, sections' },
                                { key: 'border', label: 'Bordures', desc: 'Lignes, separateurs' },
                            ].map(color => (
                                <div key={color.key} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded transition-colors">
                                    <input
                                        type="color"
                                        value={(customization.colors as any)?.[color.key] || (config.colors as any)[color.key]}
                                        onChange={(e) => updateColors(color.key as keyof TemplateColors, e.target.value)}
                                        className="w-10 h-10 border-2 border-black cursor-pointer rounded"
                                    />
                                    <div className="flex-1">
                                        <label className="block text-sm font-bold">{color.label}</label>
                                        <span className="text-[10px] text-gray-400">{color.desc}</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={(customization.colors as any)?.[color.key] || (config.colors as any)[color.key]}
                                        onChange={(e) => updateColors(color.key as keyof TemplateColors, e.target.value)}
                                        className="w-20 text-xs font-mono border border-gray-300 px-2 py-1 rounded"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Typography Tab */}
                {activeTab === 'typography' && (
                    <div className="space-y-5">
                        {/* Font Pickers avec recherche */}
                        <div className="space-y-4">
                            <label className="block text-xs font-bold uppercase text-gray-500">
                                Polices personnalisées
                            </label>
                            
                            <FontPicker
                                label="Police des titres"
                                value={customization.typography?.fontHeading || config.typography.fontHeading}
                                onChange={(font) => updateTypography('fontHeading', font)}
                            />
                            
                            <FontPicker
                                label="Police du corps"
                                value={customization.typography?.fontBody || config.typography.fontBody}
                                onChange={(font) => updateTypography('fontBody', font)}
                            />
                        </div>
                        
                        {/* Font Presets */}
                        <div className="pt-4 border-t-2 border-gray-200">
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
                                Combinaisons rapides
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {fontPresets.map(preset => (
                                    <button
                                        key={preset.name}
                                        onClick={() => {
                                            loadGoogleFonts([
                                                preset.heading.replace(/['"]/g, '').split(',')[0].trim(),
                                                preset.body.replace(/['"]/g, '').split(',')[0].trim()
                                            ]);
                                            onCustomizationChange({
                                                ...customization,
                                                typography: {
                                                    ...customization.typography,
                                                    fontHeading: preset.heading,
                                                    fontBody: preset.body,
                                                },
                                            });
                                        }}
                                        className="p-2 border-2 border-black text-left hover:shadow-brutal transition-all text-xs"
                                    >
                                        <span className="font-bold block">{preset.name}</span>
                                        <span className="text-[9px] text-gray-400">{preset.desc}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        {/* Size Controls */}
                        <div className="space-y-4 pt-4 border-t-2 border-gray-200">
                            <label className="block text-xs font-bold uppercase text-gray-500">
                                Tailles de texte
                            </label>
                            
                            {/* Name Size */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-bold">Taille du nom</label>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => updateTypography('nameSize', Math.max(1.5, (customization.typography?.nameSize || config.typography.nameSize) - 0.1))}
                                            className="p-1 border border-gray-300 hover:bg-gray-100"
                                        >
                                            <Minus size={12} />
                                        </button>
                                        <span className="text-xs font-mono w-12 text-center">
                                            {(customization.typography?.nameSize || config.typography.nameSize).toFixed(1)}rem
                                        </span>
                                        <button
                                            onClick={() => updateTypography('nameSize', Math.min(5, (customization.typography?.nameSize || config.typography.nameSize) + 0.1))}
                                            className="p-1 border border-gray-300 hover:bg-gray-100"
                                        >
                                            <Plus size={12} />
                                        </button>
                                    </div>
                                </div>
                                <input
                                    type="range"
                                    min="1.5"
                                    max="5"
                                    step="0.1"
                                    value={customization.typography?.nameSize || config.typography.nameSize}
                                    onChange={(e) => updateTypography('nameSize', parseFloat(e.target.value))}
                                    className="w-full accent-brutal-lime"
                                />
                            </div>
                            
                            {/* Job Title Size */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-bold">Titre du poste</label>
                                    <span className="text-xs font-mono">
                                        {(customization.typography?.jobTitleSize || config.typography.jobTitleSize).toFixed(2)}rem
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="0.8"
                                    max="2"
                                    step="0.05"
                                    value={customization.typography?.jobTitleSize || config.typography.jobTitleSize}
                                    onChange={(e) => updateTypography('jobTitleSize', parseFloat(e.target.value))}
                                    className="w-full accent-brutal-lime"
                                />
                            </div>
                            
                            {/* Section Title Size */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-bold">Titres de section</label>
                                    <span className="text-xs font-mono">
                                        {(customization.typography?.sectionTitleSize || config.typography.sectionTitleSize).toFixed(2)}rem
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="0.7"
                                    max="1.8"
                                    step="0.05"
                                    value={customization.typography?.sectionTitleSize || config.typography.sectionTitleSize}
                                    onChange={(e) => updateTypography('sectionTitleSize', parseFloat(e.target.value))}
                                    className="w-full accent-brutal-lime"
                                />
                            </div>
                            
                            {/* Body Size */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-bold">Corps de texte</label>
                                    <span className="text-xs font-mono">
                                        {(customization.typography?.bodySize || config.typography.bodySize).toFixed(2)}rem
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="0.7"
                                    max="1.2"
                                    step="0.025"
                                    value={customization.typography?.bodySize || config.typography.bodySize}
                                    onChange={(e) => updateTypography('bodySize', parseFloat(e.target.value))}
                                    className="w-full accent-brutal-lime"
                                />
                            </div>
                            
                            {/* Line Height */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-bold">Hauteur de ligne</label>
                                    <span className="text-xs font-mono">
                                        {customization.typography?.lineHeight || config.typography.lineHeight}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="1.2"
                                    max="2.2"
                                    step="0.1"
                                    value={customization.typography?.lineHeight || config.typography.lineHeight}
                                    onChange={(e) => updateTypography('lineHeight', parseFloat(e.target.value))}
                                    className="w-full accent-brutal-lime"
                                />
                            </div>
                            
                            {/* Letter Spacing */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-bold">Espacement lettres</label>
                                    <span className="text-xs font-mono">
                                        {customization.typography?.letterSpacing || config.typography.letterSpacing}
                                    </span>
                                </div>
                                <select
                                    value={customization.typography?.letterSpacing || config.typography.letterSpacing}
                                    onChange={(e) => updateTypography('letterSpacing', e.target.value)}
                                    className="w-full border-2 border-black p-2 font-bold"
                                >
                                    <option value="-0.02em">Serre</option>
                                    <option value="0">Normal</option>
                                    <option value="0.02em">Leger</option>
                                    <option value="0.05em">Espace</option>
                                    <option value="0.1em">Large</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Layout Tab */}
                {activeTab === 'layout' && (
                    <div className="space-y-5">
                        {/* Photo Settings */}
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-3">
                                Photo de profil
                            </label>
                            
                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm font-bold mb-2 block">Afficher la photo</label>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onCustomizationChange({
                                                ...customization,
                                                layout: { ...customization.layout, showPhoto: true },
                                            })}
                                            className={cn(
                                                "flex-1 py-2 border-2 border-black font-bold text-sm",
                                                customization.layout?.showPhoto !== false ? "bg-brutal-lime" : "hover:bg-gray-100"
                                            )}
                                        >
                                            Oui
                                        </button>
                                        <button
                                            onClick={() => onCustomizationChange({
                                                ...customization,
                                                layout: { ...customization.layout, showPhoto: false },
                                            })}
                                            className={cn(
                                                "flex-1 py-2 border-2 border-black font-bold text-sm",
                                                customization.layout?.showPhoto === false ? "bg-brutal-lime" : "hover:bg-gray-100"
                                            )}
                                        >
                                            Non
                                        </button>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="text-sm font-bold mb-2 block">Forme de la photo</label>
                                    <div className="flex gap-2">
                                        {[
                                            { value: 'circle', label: 'Cercle', icon: Circle },
                                            { value: 'square', label: 'Carre', icon: Square },
                                            { value: 'rounded', label: 'Arrondi', icon: RectangleHorizontal },
                                        ].map(shape => (
                                            <button
                                                key={shape.value}
                                                onClick={() => onCustomizationChange({
                                                    ...customization,
                                                    layout: { ...customization.layout, photoShape: shape.value as any },
                                                })}
                                                className={cn(
                                                    "flex-1 py-2 border-2 border-black font-bold text-xs flex flex-col items-center gap-1",
                                                    (customization.layout?.photoShape || config.layout.photoShape) === shape.value 
                                                        ? "bg-brutal-lime" 
                                                        : "hover:bg-gray-100"
                                                )}
                                            >
                                                <shape.icon size={16} />
                                                {shape.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-sm font-bold">Taille de la photo</label>
                                        <span className="text-xs font-mono">
                                            {customization.layout?.photoSize || config.layout.photoSize}px
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="50"
                                        max="180"
                                        step="5"
                                        value={customization.layout?.photoSize || config.layout.photoSize}
                                        onChange={(e) => onCustomizationChange({
                                            ...customization,
                                            layout: { ...customization.layout, photoSize: parseInt(e.target.value) },
                                        })}
                                        className="w-full accent-brutal-lime"
                                    />
                                </div>
                                
                                <div>
                                    <label className="text-sm font-bold mb-2 block">Position de la photo</label>
                                    <select
                                        value={customization.layout?.photoPosition || config.layout.photoPosition}
                                        onChange={(e) => onCustomizationChange({
                                            ...customization,
                                            layout: { ...customization.layout, photoPosition: e.target.value as any },
                                        })}
                                        className="w-full border-2 border-black p-2 font-bold"
                                    >
                                        <option value="header">En-tete</option>
                                        <option value="sidebar">Sidebar</option>
                                        <option value="inline">Dans le texte</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        {/* Layout Type */}
                        <div className="pt-4 border-t-2 border-gray-200">
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-3">
                                Type de mise en page
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { value: 'single', label: 'Une colonne', desc: 'Classique' },
                                    { value: 'two-column', label: 'Deux colonnes', desc: 'Moderne' },
                                    { value: 'sidebar-left', label: 'Sidebar gauche', desc: 'Creative' },
                                    { value: 'sidebar-right', label: 'Sidebar droite', desc: 'Pro' },
                                ].map(layout => (
                                    <button
                                        key={layout.value}
                                        onClick={() => onCustomizationChange({
                                            ...customization,
                                            layout: { ...customization.layout, type: layout.value as any },
                                        })}
                                        className={cn(
                                            "p-3 border-2 border-black text-left",
                                            (customization.layout?.type || config.layout.type) === layout.value 
                                                ? "bg-brutal-lime shadow-brutal" 
                                                : "hover:bg-gray-100"
                                        )}
                                    >
                                        <span className="font-bold text-sm block">{layout.label}</span>
                                        <span className="text-[10px] text-gray-500">{layout.desc}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        {/* Sidebar Width */}
                        {(customization.layout?.type || config.layout.type) !== 'single' && (
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-bold">Largeur sidebar</label>
                                    <span className="text-xs font-mono">
                                        {customization.layout?.sidebarWidth || config.layout.sidebarWidth || 35}%
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="25"
                                    max="50"
                                    step="1"
                                    value={customization.layout?.sidebarWidth || config.layout.sidebarWidth || 35}
                                    onChange={(e) => onCustomizationChange({
                                        ...customization,
                                        layout: { ...customization.layout, sidebarWidth: parseInt(e.target.value) },
                                    })}
                                    className="w-full accent-brutal-lime"
                                />
                            </div>
                        )}
                    </div>
                )}
                
                {/* Spacing Tab */}
                {activeTab === 'spacing' && (
                    <div className="space-y-5">
                        <label className="block text-xs font-bold uppercase text-gray-500">
                            Espacements et marges
                        </label>
                        
                        {/* Page Margin */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-bold">Marges de page</label>
                                <span className="text-xs font-mono">
                                    {customization.spacing?.pageMargin || config.spacing.pageMargin}mm
                                </span>
                            </div>
                            <input
                                type="range"
                                min="10"
                                max="35"
                                step="1"
                                value={customization.spacing?.pageMargin || config.spacing.pageMargin}
                                onChange={(e) => onCustomizationChange({
                                    ...customization,
                                    spacing: { ...customization.spacing, pageMargin: parseInt(e.target.value) },
                                })}
                                className="w-full accent-brutal-lime"
                            />
                        </div>
                        
                        {/* Section Gap */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-bold">Espace entre sections</label>
                                <span className="text-xs font-mono">
                                    {customization.spacing?.sectionGap || config.spacing.sectionGap}px
                                </span>
                            </div>
                            <input
                                type="range"
                                min="12"
                                max="48"
                                step="2"
                                value={customization.spacing?.sectionGap || config.spacing.sectionGap}
                                onChange={(e) => onCustomizationChange({
                                    ...customization,
                                    spacing: { ...customization.spacing, sectionGap: parseInt(e.target.value) },
                                })}
                                className="w-full accent-brutal-lime"
                            />
                        </div>
                        
                        {/* Section Padding */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-bold">Padding des sections</label>
                                <span className="text-xs font-mono">
                                    {customization.spacing?.sectionPadding || config.spacing.sectionPadding}px
                                </span>
                            </div>
                            <input
                                type="range"
                                min="8"
                                max="32"
                                step="2"
                                value={customization.spacing?.sectionPadding || config.spacing.sectionPadding}
                                onChange={(e) => onCustomizationChange({
                                    ...customization,
                                    spacing: { ...customization.spacing, sectionPadding: parseInt(e.target.value) },
                                })}
                                className="w-full accent-brutal-lime"
                            />
                        </div>
                        
                        {/* Item Gap */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-bold">Espace entre elements</label>
                                <span className="text-xs font-mono">
                                    {customization.spacing?.itemGap || config.spacing.itemGap}px
                                </span>
                            </div>
                            <input
                                type="range"
                                min="8"
                                max="28"
                                step="2"
                                value={customization.spacing?.itemGap || config.spacing.itemGap}
                                onChange={(e) => onCustomizationChange({
                                    ...customization,
                                    spacing: { ...customization.spacing, itemGap: parseInt(e.target.value) },
                                })}
                                className="w-full accent-brutal-lime"
                            />
                        </div>
                    </div>
                )}
                
                {/* Advanced Tab */}
                {activeTab === 'advanced' && (
                    <div className="space-y-5">
                        <label className="block text-xs font-bold uppercase text-gray-500">
                            Options avancees
                        </label>
                        
                        {/* Skills Display */}
                        <div>
                            <label className="text-sm font-bold mb-2 block">Affichage des competences</label>
                            <select
                                value={customization.sections?.skills?.type || config.sections.skills.type}
                                onChange={(e) => onCustomizationChange({
                                    ...customization,
                                    sections: { 
                                        ...customization.sections, 
                                        skills: { 
                                            showLevel: customization.sections?.skills?.showLevel ?? config.sections.skills.showLevel,
                                            type: e.target.value as 'bars' | 'dots' | 'percentage' | 'tags' | 'simple'
                                        } 
                                    },
                                })}
                                className="w-full border-2 border-black p-2 font-bold"
                            >
                                <option value="bars">Barres de progression</option>
                                <option value="dots">Points</option>
                                <option value="percentage">Pourcentage</option>
                                <option value="tags">Tags/Badges</option>
                                <option value="simple">Texte simple</option>
                            </select>
                        </div>
                        
                        {/* Languages Display */}
                        <div>
                            <label className="text-sm font-bold mb-2 block">Affichage des langues</label>
                            <select
                                value={customization.sections?.languages?.type || config.sections.languages.type}
                                onChange={(e) => onCustomizationChange({
                                    ...customization,
                                    sections: { 
                                        ...customization.sections, 
                                        languages: { 
                                            showLevelText: customization.sections?.languages?.showLevelText ?? config.sections.languages.showLevelText,
                                            type: e.target.value as 'bars' | 'dots' | 'stars' | 'text' | 'flags'
                                        } 
                                    },
                                })}
                                className="w-full border-2 border-black p-2 font-bold"
                            >
                                <option value="bars">Barres</option>
                                <option value="dots">Points</option>
                                <option value="stars">Etoiles</option>
                                <option value="text">Texte</option>
                                <option value="flags">Drapeaux</option>
                            </select>
                        </div>
                        
                        {/* Section Title Style */}
                        <div>
                            <label className="text-sm font-bold mb-2 block">Style des titres</label>
                            <select
                                value={customization.sections?.titleStyle || config.sections.titleStyle}
                                onChange={(e) => onCustomizationChange({
                                    ...customization,
                                    sections: { 
                                        ...customization.sections, 
                                        titleStyle: e.target.value as any 
                                    },
                                })}
                                className="w-full border-2 border-black p-2 font-bold"
                            >
                                <option value="simple">Simple</option>
                                <option value="underline">Souligne</option>
                                <option value="background">Fond colore</option>
                                <option value="border-left">Bordure gauche</option>
                            </select>
                        </div>
                        
                        {/* Use Icons */}
                        <div>
                            <label className="text-sm font-bold mb-2 block">Icones de section</label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => onCustomizationChange({
                                        ...customization,
                                        sections: { ...customization.sections, useIcons: true },
                                    })}
                                    className={cn(
                                        "flex-1 py-2 border-2 border-black font-bold text-sm",
                                        customization.sections?.useIcons !== false ? "bg-brutal-lime" : "hover:bg-gray-100"
                                    )}
                                >
                                    Afficher
                                </button>
                                <button
                                    onClick={() => onCustomizationChange({
                                        ...customization,
                                        sections: { ...customization.sections, useIcons: false },
                                    })}
                                    className={cn(
                                        "flex-1 py-2 border-2 border-black font-bold text-sm",
                                        customization.sections?.useIcons === false ? "bg-brutal-lime" : "hover:bg-gray-100"
                                    )}
                                >
                                    Masquer
                                </button>
                            </div>
                        </div>
                        
                        {/* Timeline Style */}
                        <div>
                            <label className="text-sm font-bold mb-2 block">Style de timeline</label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { value: 'circle', label: 'Cercle' },
                                    { value: 'square', label: 'Carre' },
                                    { value: 'diamond', label: 'Losange' },
                                ].map(style => (
                                    <button
                                        key={style.value}
                                        onClick={() => onCustomizationChange({
                                            ...customization,
                                            sections: { 
                                                ...customization.sections, 
                                                timeline: { 
                                                    showLine: customization.sections?.timeline?.showLine ?? config.sections.timeline.showLine,
                                                    showDots: customization.sections?.timeline?.showDots ?? config.sections.timeline.showDots,
                                                    position: customization.sections?.timeline?.position ?? config.sections.timeline.position,
                                                    dotStyle: style.value as 'circle' | 'square' | 'diamond'
                                                } 
                                            },
                                        })}
                                        className={cn(
                                            "py-2 border-2 border-black font-bold text-xs",
                                            (customization.sections?.timeline?.dotStyle || config.sections.timeline.dotStyle) === style.value 
                                                ? "bg-brutal-lime" 
                                                : "hover:bg-gray-100"
                                        )}
                                    >
                                        {style.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Reset Button */}
            <div className="p-4 border-t-2 border-black">
                <button
                    onClick={() => onCustomizationChange({})}
                    className="w-full py-2 border-2 border-black font-bold text-sm hover:bg-gray-100 flex items-center justify-center gap-2"
                >
                    <RefreshCw size={14} />
                    Reinitialiser
                </button>
            </div>
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
    const updatePersonalInfo = useCVStore((state) => state.updatePersonalInfo);
    const [activeSection, setActiveSection] = React.useState<SectionId>('personal');
    const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
    const [showPreview, setShowPreview] = React.useState(true);
    const [selectedTemplate, setSelectedTemplate] = React.useState<string>(TEMPLATE_IDS.EXECUTIVE_PRO);
    const [showTemplateSelector, setShowTemplateSelector] = React.useState(false);
    const [showAiModal, setShowAiModal] = React.useState(false);
    const [showCustomization, setShowCustomization] = React.useState(false);
    const [customization, setCustomization] = React.useState<TemplateCustomization>({});
    const [previewZoom, setPreviewZoom] = React.useState(100);
    const [isEditMode, setIsEditMode] = React.useState(true); // Par défaut en mode édition
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const previewRef = React.useRef<HTMLDivElement>(null);
    const temporalStore = useTemporalStore();
    
    // Initialise les templates au montage
    React.useEffect(() => {
        registerAllTemplates();
    }, []);
    
    // Get CV ID from URL params
    const [searchParams] = useSearchParams();
    const cvIdFromUrl = searchParams.get('cv');
    
    // Firestore sync
    const { saveCV: saveToCloud, isSaving, lastSaved, isAuthenticated } = useFirestoreSync(cvIdFromUrl);
    
    const ActiveComponent = SECTIONS.find(s => s.id === activeSection)?.component || PersonalInfoForm;
    const activeConfig = SECTIONS.find(s => s.id === activeSection);
    
    // Get selected template using new registry
    const templateEntry = templateRegistry.get(selectedTemplate);
    const TemplateComponent = templateEntry?.component;
    const templateConfig = getTemplateConfig(selectedTemplate, customization);
    const templateMetadata = templateEntry?.manifest?.metadata;
    
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
        try {
            // Use the new @react-pdf/renderer export with real text
            // Pass the template config to ensure PDF matches the preview
            await downloadPDFNative(cv as CVData, {
                filename: `cv-${cv.personalInfo.firstName || 'mon'}-${cv.personalInfo.lastName || 'cv'}`,
                templateId: selectedTemplate,
                config: templateConfig || undefined,
            });
        } catch (error) {
            console.error('Erreur export PDF:', error);
            alert('Erreur lors de l\'export PDF. Veuillez réessayer.');
        }
    };
    
    const handleExportJSON = () => {
        downloadJSON(cv, `cv-${cv.personalInfo.firstName}-${cv.personalInfo.lastName}`);
    };
    
    const handleImportJSON = () => {
        fileInputRef.current?.click();
    };
    
    // Handler pour les mises à jour de customisation depuis l'éditeur inline
    const handleCustomizationUpdate = React.useCallback((path: string, value: any) => {
        const parts = path.split('.');
        const category = parts[0] as keyof TemplateCustomization;
        const field = parts.slice(1).join('.');
        
        setCustomization(prev => {
            const newCustomization = { ...prev };
            
            if (category === 'colors') {
                newCustomization.colors = {
                    ...prev.colors,
                    [field]: value,
                };
            } else if (category === 'typography') {
                newCustomization.typography = {
                    ...prev.typography,
                    [field]: value,
                };
            } else if (category === 'spacing') {
                newCustomization.spacing = {
                    ...prev.spacing,
                    [field]: value,
                };
            } else if (category === 'layout') {
                newCustomization.layout = {
                    ...prev.layout,
                    [field]: value,
                };
            }
            
            return newCustomization;
        });
    }, []);
    
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
                            {/* Preview Header with Template Selector & Controls */}
                            <div className="bg-white border-b-2 border-black p-3 flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold">Template:</span>
                                    <button
                                        onClick={() => setShowTemplateSelector(true)}
                                        className="px-3 py-1.5 border-2 border-black font-bold text-sm flex items-center gap-2 hover:bg-brutal-lime transition-colors"
                                    >
                                        <Palette size={16} />
                                        {templateMetadata?.name || 'Choisir'}
                                    </button>
                                </div>
                                
                                {/* Edit/Preview Mode Switch */}
                                <div className="flex items-center gap-3">
                                    {/* Toggle Switch */}
                                    <div className="flex items-center border-2 border-black overflow-hidden">
                                        <button
                                            onClick={() => setIsEditMode(true)}
                                            className={cn(
                                                "px-3 py-1.5 font-bold text-sm flex items-center gap-1.5 transition-all",
                                                isEditMode 
                                                    ? "bg-brutal-pink text-white" 
                                                    : "bg-white hover:bg-gray-100"
                                            )}
                                        >
                                            <Edit3 size={14} />
                                            Édition
                                        </button>
                                        <button
                                            onClick={() => setIsEditMode(false)}
                                            className={cn(
                                                "px-3 py-1.5 font-bold text-sm flex items-center gap-1.5 transition-all border-l-2 border-black",
                                                !isEditMode 
                                                    ? "bg-brutal-pink text-black" 
                                                    : "bg-gray-400 hover:bg-gray-700"
                                            )}
                                        >
                                            <Eye size={14} />
                                            Aperçu
                                        </button>
                                    </div>
                                    
                                    <button
                                        onClick={() => setShowCustomization(true)}
                                        className="px-3 py-1.5 border-2 border-black font-bold text-sm flex items-center gap-2 hover:bg-brutal-yellow transition-colors"
                                    >
                                        <Settings2 size={16} />
                                    </button>
                                </div>
                            </div>
                            
                            {/* Zoom Controls */}
                            <div className="bg-gray-100 border-b border-gray-300 px-4 py-2 flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setPreviewZoom(Math.max(25, previewZoom - 10))}
                                        className="p-1.5 border border-gray-400 hover:bg-white transition-colors"
                                        disabled={previewZoom <= 25}
                                    >
                                        <ZoomOut size={14} />
                                    </button>
                                    <div className="flex items-center gap-1">
                                        <input
                                            type="range"
                                            min="25"
                                            max="200"
                                            step="5"
                                            value={previewZoom}
                                            onChange={(e) => setPreviewZoom(parseInt(e.target.value))}
                                            className="w-24 accent-brutal-blue"
                                        />
                                        <span className="text-xs font-mono w-12 text-center">{previewZoom}%</span>
                                    </div>
                                    <button
                                        onClick={() => setPreviewZoom(Math.min(200, previewZoom + 10))}
                                        className="p-1.5 border border-gray-400 hover:bg-white transition-colors"
                                        disabled={previewZoom >= 200}
                                    >
                                        <ZoomIn size={14} />
                                    </button>
                                    <button
                                        onClick={() => setPreviewZoom(100)}
                                        className="p-1.5 border border-gray-400 hover:bg-white transition-colors ml-1"
                                        title="Réinitialiser le zoom"
                                    >
                                        <RotateCcw size={14} />
                                    </button>
                                </div>
                                
                                {isEditMode && (
                                    <span className="text-xs text-brutal-pink font-bold animate-pulse">
                                        Double-cliquez sur un element pour l'editer
                                    </span>
                                )}
                            </div>
                            
                            {/* Preview Content with Live Edit */}
                            <div className="flex-1 overflow-auto p-6">
                                <InlineEditorProvider 
                                    isEditMode={isEditMode}
                                    onCustomizationUpdate={handleCustomizationUpdate}
                                >
                                    <div 
                                        className="bg-white shadow-2xl mx-auto transition-transform origin-top"
                                        style={{ 
                                            maxWidth: '210mm',
                                            transform: `scale(${previewZoom / 100})`,
                                            transformOrigin: 'top center',
                                        }}
                                    >
                                        <div 
                                            id="cv-preview" 
                                            ref={previewRef}
                                            className={cn(
                                                "relative",
                                                isEditMode && "ring-2 ring-brutal-pink ring-offset-2"
                                            )}
                                        >
                                            {TemplateComponent && templateConfig ? (
                                                <TemplateComponent 
                                                    cvData={cv as unknown as CvData} 
                                                    config={templateConfig}
                                                    mode={isEditMode ? "edit" : "preview"}
                                                    ref={previewRef} 
                                                />
                                            ) : (
                                                <div className="p-8">
                                                    <CVPreviewContent cv={cv} />
                                                </div>
                                            )}
                                            
                                            {/* Edit Mode Overlay Badge */}
                                            {isEditMode && (
                                                <div className="absolute top-2 right-2 bg-brutal-pink text-white text-[10px] px-2 py-1 font-bold shadow-lg z-50 uppercase tracking-wider">
                                                    Edition Live
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </InlineEditorProvider>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            {/* Template Selector Modal */}
            <AnimatePresence>
                <TemplateSelector
                    currentTemplate={selectedTemplate}
                    onSelectTemplate={(id) => {
                        setSelectedTemplate(id);
                        setCustomization({}); // Reset customization when changing template
                    }}
                    isOpen={showTemplateSelector}
                    onClose={() => setShowTemplateSelector(false)}
                />
            </AnimatePresence>
            
            {/* Customization Panel */}
            <AnimatePresence>
                {templateConfig && (
                    <CustomizationPanel
                        config={templateConfig}
                        customization={customization}
                        onCustomizationChange={setCustomization}
                        isOpen={showCustomization}
                        onClose={() => setShowCustomization(false)}
                    />
                )}
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
