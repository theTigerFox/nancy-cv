// ============================================================================
// NANCY CV - Base Template Component
// Reusable building blocks for all templates
// ============================================================================

import React, { forwardRef, useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CvData } from '../types/cv.d';
import { TemplateConfig, TemplateProps, SectionType } from './types';
import { 
    generateCSSVariables, 
    getContrastColor, 
    colorWithOpacity,
    getLevelText,
    getLanguageCEFR,
    normalizeLanguageLevel 
} from './utils';
import { 
    Mail, 
    Phone, 
    MapPin, 
    Linkedin, 
    Globe, 
    Github,
    Briefcase,
    GraduationCap,
    Award,
    Code,
    Languages,
    User,
    Star,
    Circle,
    Check,
    X,
    Type,
    Plus,
    Minus,
    Eye,
    EyeOff,
    GripVertical,
    Settings,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { useCVStore } from '../store/cvStore';

// ─────────────────────────────────────────────────────────────────────────────
// Universal Edit Mode System
// ─────────────────────────────────────────────────────────────────────────────

interface EditableFieldState {
    isEditing: boolean;
    value: string;
    path: string;
    rect: DOMRect | null;
}

interface UniversalEditorContextType {
    isEditMode: boolean;
    editingField: EditableFieldState | null;
    startEditing: (path: string, value: string, rect: DOMRect) => void;
    saveEdit: (value: string) => void;
    cancelEdit: () => void;
}

const UniversalEditorContext = React.createContext<UniversalEditorContextType>({
    isEditMode: false,
    editingField: null,
    startEditing: () => {},
    saveEdit: () => {},
    cancelEdit: () => {},
});

export const useUniversalEditor = () => React.useContext(UniversalEditorContext);

// Field path mapping for auto-detection
const FIELD_MAPPINGS: Record<string, { store: string; field: string; arrayField?: string }> = {
    // Personal Info
    'firstName': { store: 'personalInfo', field: 'firstName' },
    'lastName': { store: 'personalInfo', field: 'lastName' },
    'jobTitle': { store: 'personalInfo', field: 'jobTitle' },
    'email': { store: 'personalInfo', field: 'email' },
    'phone': { store: 'personalInfo', field: 'phone' },
    'address': { store: 'personalInfo', field: 'address' },
    'description': { store: 'personalInfo', field: 'description' },
    'linkedin': { store: 'personalInfo', field: 'linkedin' },
    'website': { store: 'personalInfo', field: 'website' },
    // Experience
    'exp-title': { store: 'experience', field: 'title' },
    'exp-company': { store: 'experience', field: 'company' },
    'exp-description': { store: 'experience', field: 'description' },
    'exp-startDate': { store: 'experience', field: 'startDate' },
    'exp-endDate': { store: 'experience', field: 'endDate' },
    // Education
    'edu-degree': { store: 'education', field: 'degree' },
    'edu-school': { store: 'education', field: 'school' },
    'edu-description': { store: 'education', field: 'description' },
    'edu-startDate': { store: 'education', field: 'startDate' },
    'edu-endDate': { store: 'education', field: 'endDate' },
    // Skills
    'skill-name': { store: 'skills', field: 'name' },
    // Languages
    'lang-name': { store: 'languages', field: 'name' },
    // Projects
    'proj-name': { store: 'projects', field: 'name' },
    'proj-description': { store: 'projects', field: 'description' },
    // Certifications
    'cert-name': { store: 'certifications', field: 'name' },
    'cert-issuer': { store: 'certifications', field: 'issuer' },
};

// ─────────────────────────────────────────────────────────────────────────────
// Universal Inline Editor Overlay
// ─────────────────────────────────────────────────────────────────────────────

interface UniversalEditorOverlayProps {
    editingField: EditableFieldState;
    onSave: (value: string) => void;
    onCancel: () => void;
}

const UniversalEditorOverlay: React.FC<UniversalEditorOverlayProps> = ({
    editingField,
    onSave,
    onCancel,
}) => {
    const [localValue, setLocalValue] = useState(editingField.value);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
    const isMultiline = editingField.value.length > 50 || editingField.value.includes('\n');

    useEffect(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isMultiline) {
            e.preventDefault();
            onSave(localValue);
        } else if (e.key === 'Escape') {
            onCancel();
        }
    };

    if (!editingField.rect) return null;

    const style: React.CSSProperties = {
        position: 'fixed',
        top: editingField.rect.top - 4,
        left: editingField.rect.left - 4,
        minWidth: Math.max(editingField.rect.width + 80, 200),
        zIndex: 10000,
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={style}
            className="flex items-start gap-1 bg-white shadow-2xl border-2 border-[#ff6b9d] p-1"
            onClick={(e) => e.stopPropagation()}
        >
            {isMultiline ? (
                <textarea
                    ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                    value={localValue}
                    onChange={(e) => setLocalValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 min-h-[80px] px-2 py-1 border border-gray-300 focus:outline-none focus:border-[#ff6b9d] resize-none text-sm"
                    style={{ fontFamily: 'inherit' }}
                />
            ) : (
                <input
                    ref={inputRef as React.RefObject<HTMLInputElement>}
                    type="text"
                    value={localValue}
                    onChange={(e) => setLocalValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 px-2 py-1 border border-gray-300 focus:outline-none focus:border-[#ff6b9d] text-sm"
                    style={{ fontFamily: 'inherit' }}
                />
            )}
            <div className="flex gap-0.5 shrink-0">
                <button
                    onClick={() => onSave(localValue)}
                    className="p-1.5 bg-[#bfff00] border border-black hover:bg-green-400 transition-colors"
                    title="Valider"
                >
                    <Check size={14} />
                </button>
                <button
                    onClick={onCancel}
                    className="p-1.5 bg-gray-200 border border-black hover:bg-gray-300 transition-colors"
                    title="Annuler"
                >
                    <X size={14} />
                </button>
            </div>
        </motion.div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Section Manager Component - Connected to Store
// ─────────────────────────────────────────────────────────────────────────────

interface SectionManagerProps {
    onClose: () => void;
    config: TemplateConfig;
}

// Map des types de section entre l'UI et le store
const SECTION_TYPE_MAP: Record<SectionType, string> = {
    'personal-info': 'personal',
    'contact': 'personal', // Contact fait partie de personal
    'description': 'summary',
    'experience': 'experience',
    'education': 'education',
    'skills': 'skills',
    'languages': 'languages',
    'projects': 'projects',
    'certifications': 'certifications',
    'interests': 'interests',
    'references': 'references',
};

const AVAILABLE_SECTIONS: { id: SectionType; label: string; icon: React.ReactNode; storeType: string }[] = [
    { id: 'personal-info', label: 'Informations personnelles', icon: <User size={16} />, storeType: 'personal' },
    { id: 'description', label: 'Profil / Description', icon: <User size={16} />, storeType: 'summary' },
    { id: 'experience', label: 'Experience professionnelle', icon: <Briefcase size={16} />, storeType: 'experience' },
    { id: 'education', label: 'Formation', icon: <GraduationCap size={16} />, storeType: 'education' },
    { id: 'skills', label: 'Competences', icon: <Code size={16} />, storeType: 'skills' },
    { id: 'languages', label: 'Langues', icon: <Languages size={16} />, storeType: 'languages' },
    { id: 'projects', label: 'Projets', icon: <Globe size={16} />, storeType: 'projects' },
    { id: 'certifications', label: 'Certifications', icon: <Award size={16} />, storeType: 'certifications' },
    { id: 'interests', label: 'Centres d\'interet', icon: <Star size={16} />, storeType: 'interests' },
    { id: 'references', label: 'References', icon: <User size={16} />, storeType: 'references' },
];

export const SectionManager: React.FC<SectionManagerProps> = ({ onClose, config }) => {
    const cv = useCVStore((state) => state.cv);
    const sectionsOrder = useCVStore((state) => state.cv.sectionsOrder) || [];
    const toggleSectionVisibility = useCVStore((state) => state.toggleSectionVisibility);
    const reorderSections = useCVStore((state) => state.reorderSections);

    // Ensure sectionsOrder is valid
    const validSectionsOrder = sectionsOrder.length > 0 ? sectionsOrder : [];

    const toggleSection = (storeType: string) => {
        console.log('[SectionManager] Toggling section:', storeType);
        toggleSectionVisibility(storeType);
    };

    const moveSection = (storeType: string, direction: 'up' | 'down') => {
        const currentIndex = validSectionsOrder.findIndex(s => s.type === storeType);
        if (currentIndex === -1) return;
        const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if (newIndex < 0 || newIndex >= validSectionsOrder.length) return;
        reorderSections(currentIndex, newIndex);
    };

    const getSectionDataCount = (storeType: string): number | null => {
        switch (storeType) {
            case 'experience': return cv.experience?.length || null;
            case 'education': return cv.education?.length || null;
            case 'skills': return cv.skills?.length || null;
            case 'languages': return cv.languages?.length || null;
            case 'projects': return cv.projects?.length || null;
            case 'certifications': return cv.certifications?.length || null;
            case 'interests': return cv.interests?.length || null;
            case 'references': return cv.references?.length || null;
            default: return null;
        }
    };

    const isSectionVisible = (storeType: string): boolean => {
        const section = validSectionsOrder.find(s => s.type === storeType);
        return section?.visible ?? true;
    };

    const getSectionOrder = (): typeof AVAILABLE_SECTIONS => {
        // Trier les sections selon l'ordre dans le store
        return [...AVAILABLE_SECTIONS].sort((a, b) => {
            const aIndex = validSectionsOrder.findIndex(s => s.type === a.storeType);
            const bIndex = validSectionsOrder.findIndex(s => s.type === b.storeType);
            if (aIndex === -1) return 1;
            if (bIndex === -1) return -1;
            return aIndex - bIndex;
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10001]"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white border-3 border-black shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b-2 border-black bg-gray-50">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Settings size={20} />
                        Gerer les sections
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-200 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 overflow-y-auto max-h-[60vh]">
                    <p className="text-sm text-gray-600 mb-4">
                        Activez ou desactivez les sections et reorganisez-les selon vos besoins.
                    </p>

                    <div className="space-y-2">
                        {getSectionOrder().map((section, index) => {
                            const isVisible = isSectionVisible(section.storeType);
                            const count = getSectionDataCount(section.storeType);

                            return (
                                <div
                                    key={section.id}
                                    className={`flex items-center gap-3 p-3 border-2 transition-all ${
                                        isVisible 
                                            ? 'border-black bg-white' 
                                            : 'border-gray-300 bg-gray-50 opacity-60'
                                    }`}
                                >
                                    <div className="flex flex-col gap-0.5">
                                        <button
                                            onClick={() => moveSection(section.storeType, 'up')}
                                            disabled={index === 0}
                                            className="p-0.5 hover:bg-gray-200 disabled:opacity-30 transition-colors"
                                        >
                                            <ChevronUp size={14} />
                                        </button>
                                        <button
                                            onClick={() => moveSection(section.storeType, 'down')}
                                            disabled={index === getSectionOrder().length - 1}
                                            className="p-0.5 hover:bg-gray-200 disabled:opacity-30 transition-colors"
                                        >
                                            <ChevronDown size={14} />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2 flex-1">
                                        <span className="text-gray-500">{section.icon}</span>
                                        <span className="font-medium text-sm">{section.label}</span>
                                        {count !== null && (
                                            <span className="text-xs bg-gray-200 px-1.5 py-0.5 rounded">
                                                {count}
                                            </span>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => toggleSection(section.storeType)}
                                        className={`p-2 border-2 transition-all ${
                                            isVisible
                                                ? 'bg-[#bfff00] border-black'
                                                : 'bg-gray-100 border-gray-300'
                                        }`}
                                    >
                                        {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="p-4 border-t-2 border-black bg-gray-50">
                    <button
                        onClick={onClose}
                        className="w-full py-2 bg-black text-white font-bold hover:bg-gray-800 transition-colors"
                    >
                        Fermer
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Template Wrapper with Universal Edit Mode
// ─────────────────────────────────────────────────────────────────────────────

interface TemplateWrapperProps {
    children: React.ReactNode;
    config: TemplateConfig;
    mode?: 'preview' | 'print' | 'export' | 'edit';
    scale?: number;
    className?: string;
}

export const TemplateWrapper = forwardRef<HTMLDivElement, TemplateWrapperProps>(
    ({ children, config, mode = 'preview', scale = 1, className = '' }, ref) => {
        const cssVars = generateCSSVariables(config);
        const [editingField, setEditingField] = useState<EditableFieldState | null>(null);
        const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
        const [showSectionManager, setShowSectionManager] = useState(false);
        const wrapperRef = useRef<HTMLDivElement>(null);
        
        const isEditMode = mode === 'edit';

        // Store access for updates
        const updatePersonalInfo = useCVStore((state) => state.updatePersonalInfo);
        const cv = useCVStore((state) => state.cv);

        // A4 dimensions at 96 DPI (consistent with PDF export)
        const A4_WIDTH = 794; // 210mm at 96 DPI
        const A4_HEIGHT = 1123; // 297mm at 96 DPI

        const style: React.CSSProperties = {
            ...Object.fromEntries(Object.entries(cssVars)),
            width: `${A4_WIDTH}px`,
            maxWidth: `${A4_WIDTH}px`,
            minHeight: `${A4_HEIGHT}px`,
            backgroundColor: config.colors.background,
            color: config.colors.text,
            fontFamily: config.typography.fontBody,
            fontSize: `${config.typography.baseFontSize}px`,
            lineHeight: config.typography.lineHeight,
            transform: mode === 'preview' ? `scale(${scale})` : undefined,
            transformOrigin: 'top center',
        };

        // Detect editable content from text
        const detectFieldFromContent = useCallback((text: string, element: HTMLElement): string | null => {
            const trimmedText = text.trim();
            if (!trimmedText) return null;

            // Check against CV data
            const { personalInfo, experience, education, skills, languages, projects, certifications } = cv;

            // Personal info fields
            if (trimmedText === personalInfo.firstName) return 'personalInfo.firstName';
            if (trimmedText === personalInfo.lastName) return 'personalInfo.lastName';
            if (trimmedText === `${personalInfo.firstName} ${personalInfo.lastName}`) return 'personalInfo.fullName';
            if (trimmedText === personalInfo.jobTitle) return 'personalInfo.jobTitle';
            if (trimmedText === personalInfo.email) return 'personalInfo.email';
            if (trimmedText === personalInfo.phone) return 'personalInfo.phone';
            if (trimmedText === personalInfo.address) return 'personalInfo.address';
            if (trimmedText === personalInfo.description) return 'personalInfo.description';

            // Experience fields
            for (let i = 0; i < experience.length; i++) {
                const exp = experience[i];
                if (trimmedText === exp.title) return `experience.${i}.title`;
                if (trimmedText === exp.company) return `experience.${i}.company`;
                if (trimmedText === exp.description) return `experience.${i}.description`;
            }

            // Education fields
            for (let i = 0; i < education.length; i++) {
                const edu = education[i];
                if (trimmedText === edu.degree) return `education.${i}.degree`;
                if (trimmedText === edu.school) return `education.${i}.school`;
                if (trimmedText === edu.description) return `education.${i}.description`;
            }

            // Skills
            for (let i = 0; i < skills.length; i++) {
                if (trimmedText === skills[i].name) return `skills.${i}.name`;
            }

            // Languages
            for (let i = 0; i < languages.length; i++) {
                if (trimmedText === languages[i].name) return `languages.${i}.name`;
            }

            // Projects
            for (let i = 0; i < projects.length; i++) {
                const proj = projects[i];
                if (trimmedText === proj.name) return `projects.${i}.name`;
                if (trimmedText === proj.description) return `projects.${i}.description`;
            }

            // Certifications
            for (let i = 0; i < certifications.length; i++) {
                const cert = certifications[i];
                if (trimmedText === cert.name) return `certifications.${i}.name`;
                if (trimmedText === cert.issuer) return `certifications.${i}.issuer`;
            }

            return null;
        }, [cv]);

        // Handle double-click for editing
        const handleDoubleClick = useCallback((e: MouseEvent) => {
            if (!isEditMode) return;

            const target = e.target as HTMLElement;
            if (!target || target.closest('[data-inline-editor]')) return;

            // Get text content
            const text = target.textContent || '';
            const path = detectFieldFromContent(text, target);

            if (path) {
                e.preventDefault();
                e.stopPropagation();
                const rect = target.getBoundingClientRect();
                setEditingField({
                    isEditing: true,
                    value: text,
                    path,
                    rect,
                });
            }
        }, [isEditMode, detectFieldFromContent]);

        // Handle hover effects
        const handleMouseOver = useCallback((e: MouseEvent) => {
            if (!isEditMode || editingField) return;

            const target = e.target as HTMLElement;
            if (!target || target.closest('[data-inline-editor]')) return;

            const text = target.textContent || '';
            const path = detectFieldFromContent(text, target);

            if (path && target !== hoveredElement) {
                setHoveredElement(target);
                target.style.outline = '2px dashed #ff6b9d';
                target.style.outlineOffset = '2px';
                target.style.cursor = 'pointer';
                target.title = 'Double-cliquez pour editer';
            }
        }, [isEditMode, editingField, detectFieldFromContent, hoveredElement]);

        const handleMouseOut = useCallback((e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target === hoveredElement) {
                target.style.outline = '';
                target.style.outlineOffset = '';
                target.style.cursor = '';
                target.title = '';
                setHoveredElement(null);
            }
        }, [hoveredElement]);

        // Save edit
        const saveEdit = useCallback((value: string) => {
            if (!editingField) return;

            const parts = editingField.path.split('.');
            const store = parts[0];

            if (store === 'personalInfo') {
                const field = parts[1];
                if (field === 'fullName') {
                    // Special case: split full name into first/last
                    const [firstName, ...rest] = value.split(' ');
                    updatePersonalInfo('firstName', firstName);
                    updatePersonalInfo('lastName', rest.join(' '));
                } else {
                    // Cast to valid field type
                    updatePersonalInfo(field as keyof typeof cv.personalInfo, value);
                }
            } else {
                // For arrays (experience, education, etc.)
                const index = parseInt(parts[1]);
                const field = parts[2];
                const storeState = useCVStore.getState();
                
                if (store === 'experience' && storeState.updateExperience) {
                    const exp = cv.experience[index];
                    if (exp) storeState.updateExperience(exp.id, { [field]: value });
                } else if (store === 'education' && storeState.updateEducation) {
                    const edu = cv.education[index];
                    if (edu) storeState.updateEducation(edu.id, { [field]: value });
                } else if (store === 'skills' && storeState.updateSkill) {
                    const skill = cv.skills[index];
                    if (skill) storeState.updateSkill(skill.id, { [field]: value });
                } else if (store === 'languages' && storeState.updateLanguage) {
                    const lang = cv.languages[index];
                    if (lang) storeState.updateLanguage(lang.id, { [field]: value });
                } else if (store === 'projects' && storeState.updateProject) {
                    const proj = cv.projects[index];
                    if (proj) storeState.updateProject(proj.id, { [field]: value });
                } else if (store === 'certifications' && storeState.updateCertification) {
                    const cert = cv.certifications[index];
                    if (cert) storeState.updateCertification(cert.id, { [field]: value });
                }
            }

            setEditingField(null);
        }, [editingField, cv, updatePersonalInfo]);

        const cancelEdit = useCallback(() => {
            setEditingField(null);
        }, []);

        // Event listeners
        useEffect(() => {
            const wrapper = wrapperRef.current;
            if (!wrapper || !isEditMode) return;

            wrapper.addEventListener('dblclick', handleDoubleClick);
            wrapper.addEventListener('mouseover', handleMouseOver);
            wrapper.addEventListener('mouseout', handleMouseOut);

            return () => {
                wrapper.removeEventListener('dblclick', handleDoubleClick);
                wrapper.removeEventListener('mouseover', handleMouseOver);
                wrapper.removeEventListener('mouseout', handleMouseOut);
            };
        }, [isEditMode, handleDoubleClick, handleMouseOver, handleMouseOut]);

        // Close editor on outside click
        useEffect(() => {
            if (!editingField) return;

            const handleClickOutside = (e: MouseEvent) => {
                const target = e.target as HTMLElement;
                if (!target.closest('[data-universal-editor]')) {
                    cancelEdit();
                }
            };

            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }, [editingField, cancelEdit]);

        return (
            <UniversalEditorContext.Provider value={{
                isEditMode,
                editingField,
                startEditing: (path, value, rect) => setEditingField({ isEditing: true, path, value, rect }),
                saveEdit,
                cancelEdit,
            }}>
                <div
                    ref={(node) => {
                        wrapperRef.current = node;
                        if (typeof ref === 'function') ref(node);
                        else if (ref) ref.current = node;
                    }}
                    className={`cv-template ${className} ${isEditMode ? 'edit-mode' : ''}`}
                    style={style}
                    data-mode={mode}
                    data-template-id={config.metadata.id}
                >
                    {children}

                    {/* Section Manager Button (Edit Mode Only) */}
                    {isEditMode && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="fixed bottom-4 right-4 p-3 bg-black text-white border-2 border-black shadow-lg hover:bg-gray-800 transition-colors z-[9999] flex items-center gap-2"
                            onClick={() => setShowSectionManager(true)}
                            title="Gerer les sections"
                        >
                            <Settings size={18} />
                            <span className="text-sm font-bold">Sections</span>
                        </motion.button>
                    )}
                </div>

                {/* Universal Editor Overlay */}
                <AnimatePresence>
                    {editingField && (
                        <div data-universal-editor>
                            <UniversalEditorOverlay
                                editingField={editingField}
                                onSave={saveEdit}
                                onCancel={cancelEdit}
                            />
                        </div>
                    )}
                </AnimatePresence>

                {/* Section Manager Modal */}
                <AnimatePresence>
                    {showSectionManager && (
                        <SectionManager
                            config={config}
                            onClose={() => setShowSectionManager(false)}
                        />
                    )}
                </AnimatePresence>
            </UniversalEditorContext.Provider>
        );
    }
);

TemplateWrapper.displayName = 'TemplateWrapper';

// ─────────────────────────────────────────────────────────────────────────────
// Section Components
// ─────────────────────────────────────────────────────────────────────────────

interface SectionProps {
    title: string;
    icon?: React.ReactNode;
    config: TemplateConfig;
    children: React.ReactNode;
    className?: string;
}

export const Section: React.FC<SectionProps> = ({
    title,
    icon,
    config,
    children,
    className = '',
}) => {
    const { colors, typography, sections, spacing } = config;
    const titleStyle = sections.titleStyle;

    const getTitleStyles = (): React.CSSProperties => {
        const base: React.CSSProperties = {
            fontSize: `${typography.sectionTitleSize}rem`,
            fontFamily: typography.fontHeading,
            fontWeight: 700,
            letterSpacing: typography.letterSpacing,
            marginBottom: `${spacing.itemGap}px`,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
        };

        switch (titleStyle) {
            case 'underline':
                return {
                    ...base,
                    borderBottom: `2px solid ${colors.primary}`,
                    paddingBottom: '8px',
                };
            case 'background':
                return {
                    ...base,
                    backgroundColor: colorWithOpacity(colors.primary, 0.1),
                    padding: '8px 12px',
                    borderRadius: '4px',
                };
            case 'border-left':
                return {
                    ...base,
                    borderLeft: `4px solid ${colors.primary}`,
                    paddingLeft: '12px',
                };
            default:
                return base;
        }
    };

    return (
        <section className={className} style={{ marginBottom: `${spacing.sectionGap}px` }}>
            <h2 style={getTitleStyles()}>
                {sections.useIcons && icon && (
                    <span style={{ color: colors.primary }}>{icon}</span>
                )}
                {title}
            </h2>
            <div style={{ paddingLeft: sections.titleStyle === 'border-left' ? '16px' : 0 }}>
                {children}
            </div>
        </section>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Contact Info Component
// ─────────────────────────────────────────────────────────────────────────────

interface ContactInfoProps {
    personalInfo: CvData['personalInfo'];
    config: TemplateConfig;
    layout?: 'horizontal' | 'vertical';
}

export const ContactInfo: React.FC<ContactInfoProps> = ({
    personalInfo,
    config,
    layout = 'horizontal',
}) => {
    const { colors, typography } = config;
    const items = [
        { icon: <Mail size={14} />, value: personalInfo.email },
        { icon: <Phone size={14} />, value: personalInfo.phone },
        { icon: <MapPin size={14} />, value: personalInfo.address },
    ].filter(item => item.value);

    const containerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: layout === 'horizontal' ? 'row' : 'column',
        flexWrap: 'wrap',
        gap: layout === 'horizontal' ? '16px' : '8px',
        fontSize: `${typography.smallSize}rem`,
        color: colors.textLight,
    };

    const itemStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
    };

    return (
        <div style={containerStyle}>
            {items.map((item, index) => (
                <div key={index} style={itemStyle}>
                    <span style={{ color: colors.primary }}>{item.icon}</span>
                    <span>{item.value}</span>
                </div>
            ))}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Skills Display Component
// ─────────────────────────────────────────────────────────────────────────────

interface SkillsDisplayProps {
    skills: CvData['skills'];
    config: TemplateConfig;
}

export const SkillsDisplay: React.FC<SkillsDisplayProps> = ({ skills, config }) => {
    const { colors, typography, sections, spacing } = config;
    const { type, showLevel, fillColor, backgroundColor } = sections.skills;

    const fill = fillColor || colors.primary;
    const bg = backgroundColor || colorWithOpacity(colors.border, 0.5);

    if (type === 'tags') {
        return (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {skills.map(skill => (
                    <span
                        key={skill.id}
                        style={{
                            padding: '4px 12px',
                            backgroundColor: colorWithOpacity(fill, 0.1),
                            color: fill,
                            borderRadius: '9999px',
                            fontSize: `${typography.smallSize}rem`,
                            fontWeight: 500,
                        }}
                    >
                        {skill.name}
                    </span>
                ))}
            </div>
        );
    }

    if (type === 'simple') {
        return (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {skills.map((skill, index) => (
                    <span key={skill.id} style={{ fontSize: `${typography.bodySize}rem` }}>
                        {skill.name}
                        {index < skills.length - 1 && ' • '}
                    </span>
                ))}
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: `${spacing.itemGap}px` }}>
            {skills.map(skill => (
                <div key={skill.id}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '4px',
                            fontSize: `${typography.bodySize}rem`,
                        }}
                    >
                        <span style={{ fontWeight: 500 }}>{skill.name}</span>
                        {showLevel && type !== 'bars' && (
                            <span style={{ color: colors.textLight, fontSize: `${typography.smallSize}rem` }}>
                                {getLevelText(skill.level, 'skill')}
                            </span>
                        )}
                    </div>

                    {type === 'bars' && (
                        <div
                            style={{
                                height: '6px',
                                backgroundColor: bg,
                                borderRadius: '3px',
                                overflow: 'hidden',
                            }}
                        >
                            <div
                                style={{
                                    height: '100%',
                                    width: `${(skill.level / 10) * 100}%`,
                                    backgroundColor: fill,
                                    borderRadius: '3px',
                                    transition: 'width 0.3s ease',
                                }}
                            />
                        </div>
                    )}

                    {type === 'dots' && (
                        <div style={{ display: 'flex', gap: '4px' }}>
                            {[...Array(10)].map((_, i) => (
                                <div
                                    key={i}
                                    style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        backgroundColor: i < skill.level ? fill : bg,
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {type === 'percentage' && (
                        <span style={{ color: colors.textLight, fontSize: `${typography.smallSize}rem` }}>
                            {(skill.level / 10) * 100}%
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Languages Display Component
// ─────────────────────────────────────────────────────────────────────────────

interface LanguagesDisplayProps {
    languages: CvData['languages'];
    config: TemplateConfig;
}

export const LanguagesDisplay: React.FC<LanguagesDisplayProps> = ({ languages, config }) => {
    const { colors, typography, sections, spacing } = config;
    const { type, showLevelText } = sections.languages;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: `${spacing.itemGap}px` }}>
            {languages.map(lang => {
                const numLevel = normalizeLanguageLevel(lang.level);
                return (
                <div key={lang.id}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: `${typography.bodySize}rem`,
                        }}
                    >
                        <span style={{ fontWeight: 500 }}>{lang.name}</span>
                        {showLevelText && (
                            <span style={{ color: colors.textLight, fontSize: `${typography.smallSize}rem` }}>
                                {getLevelText(lang.level, 'language')} ({getLanguageCEFR(lang.level)})
                            </span>
                        )}
                    </div>

                    {type === 'bars' && (
                        <div
                            style={{
                                height: '6px',
                                backgroundColor: colorWithOpacity(colors.border, 0.5),
                                borderRadius: '3px',
                                overflow: 'hidden',
                                marginTop: '4px',
                            }}
                        >
                            <div
                                style={{
                                    height: '100%',
                                    width: `${(numLevel / 5) * 100}%`,
                                    backgroundColor: colors.primary,
                                    borderRadius: '3px',
                                }}
                            />
                        </div>
                    )}

                    {type === 'dots' && (
                        <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    style={{
                                        width: '10px',
                                        height: '10px',
                                        borderRadius: '50%',
                                        backgroundColor: i < numLevel ? colors.primary : colorWithOpacity(colors.border, 0.5),
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {type === 'stars' && (
                        <div style={{ display: 'flex', gap: '2px', marginTop: '4px' }}>
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={14}
                                    fill={i < numLevel ? colors.primary : 'none'}
                                    stroke={colors.primary}
                                />
                            ))}
                        </div>
                    )}
                </div>
                );
            })}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Timeline Component (for Experience & Education)
// ─────────────────────────────────────────────────────────────────────────────

interface TimelineItemProps {
    title: string;
    subtitle: string;
    startDate: string;
    endDate: string;
    description?: string;
    config: TemplateConfig;
    isLast?: boolean;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({
    title,
    subtitle,
    startDate,
    endDate,
    description,
    config,
    isLast = false,
}) => {
    const { colors, typography, sections, spacing } = config;
    const { showLine, showDots, position, dotStyle } = sections.timeline;

    const getDotShape = (): React.CSSProperties => {
        const base: React.CSSProperties = {
            width: '12px',
            height: '12px',
            backgroundColor: colors.primary,
            flexShrink: 0,
        };

        switch (dotStyle) {
            case 'square':
                return { ...base, borderRadius: '2px' };
            case 'diamond':
                return { ...base, borderRadius: '2px', transform: 'rotate(45deg)' };
            default:
                return { ...base, borderRadius: '50%' };
        }
    };

    const showTimeline = showLine || showDots;

    return (
        <div
            style={{
                display: 'flex',
                gap: '16px',
                paddingBottom: isLast ? 0 : `${spacing.itemGap}px`,
            }}
        >
            {showTimeline && position !== 'none' && (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '12px',
                    }}
                >
                    {showDots && <div style={getDotShape()} />}
                    {showLine && !isLast && (
                        <div
                            style={{
                                width: '2px',
                                flex: 1,
                                backgroundColor: colorWithOpacity(colors.primary, 0.2),
                                marginTop: showDots ? '4px' : 0,
                            }}
                        />
                    )}
                </div>
            )}

            <div style={{ flex: 1 }}>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap',
                        gap: '8px',
                    }}
                >
                    <div>
                        <h3
                            style={{
                                fontSize: `${typography.bodySize * 1.1}rem`,
                                fontWeight: 600,
                                fontFamily: typography.fontHeading,
                                marginBottom: '2px',
                            }}
                        >
                            {title}
                        </h3>
                        <p style={{ color: colors.textLight, fontSize: `${typography.bodySize}rem` }}>
                            {subtitle}
                        </p>
                    </div>
                    <span
                        style={{
                            fontSize: `${typography.smallSize}rem`,
                            color: colors.textLight,
                            backgroundColor: colorWithOpacity(colors.primary, 0.1),
                            padding: '2px 8px',
                            borderRadius: '4px',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {startDate} - {endDate || 'Présent'}
                    </span>
                </div>

                {description && (
                    <p
                        style={{
                            marginTop: '8px',
                            fontSize: `${typography.bodySize}rem`,
                            color: colors.text,
                            lineHeight: typography.lineHeight,
                            whiteSpace: 'pre-line',
                        }}
                    >
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Photo Component
// ─────────────────────────────────────────────────────────────────────────────

interface PhotoProps {
    src?: string;
    config: TemplateConfig;
    className?: string;
}

export const Photo: React.FC<PhotoProps> = ({ src, config, className = '' }) => {
    const { layout, colors } = config;

    if (!src || !layout.showPhoto) return null;

    const getShapeStyles = (): React.CSSProperties => {
        const base: React.CSSProperties = {
            width: `${layout.photoSize}px`,
            height: `${layout.photoSize}px`,
            objectFit: 'cover',
            border: `3px solid ${colors.primary}`,
        };

        switch (layout.photoShape) {
            case 'circle':
                return { ...base, borderRadius: '50%' };
            case 'rounded':
                return { ...base, borderRadius: '12px' };
            default:
                return base;
        }
    };

    return (
        <img
            src={src}
            alt="Photo de profil"
            style={getShapeStyles()}
            className={className}
        />
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Interests Display Component
// ─────────────────────────────────────────────────────────────────────────────

interface InterestsDisplayProps {
    interests: CvData['interests'];
    config: TemplateConfig;
    layout?: 'tags' | 'list' | 'grid';
}

export const InterestsDisplay: React.FC<InterestsDisplayProps> = ({ 
    interests, 
    config,
    layout = 'tags'
}) => {
    const { colors, typography, spacing } = config;
    
    const visibleInterests = interests.filter(i => i.visible !== false);
    
    if (visibleInterests.length === 0) return null;

    if (layout === 'list') {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: `${spacing.itemGap / 2}px` }}>
                {visibleInterests.map(interest => (
                    <div 
                        key={interest.id}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: `${typography.bodySize}rem`,
                            color: colors.text,
                        }}
                    >
                        <span style={{ color: colors.primary }}>•</span>
                        <span>{interest.name}</span>
                    </div>
                ))}
            </div>
        );
    }

    if (layout === 'grid') {
        return (
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: `${spacing.itemGap}px` 
            }}>
                {visibleInterests.map(interest => (
                    <div 
                        key={interest.id}
                        style={{
                            padding: '8px 12px',
                            backgroundColor: colorWithOpacity(colors.primary, 0.05),
                            borderRadius: '4px',
                            fontSize: `${typography.bodySize}rem`,
                            color: colors.text,
                        }}
                    >
                        {interest.name}
                    </div>
                ))}
            </div>
        );
    }

    // Default: tags
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {visibleInterests.map(interest => (
                <span
                    key={interest.id}
                    style={{
                        padding: '4px 12px',
                        backgroundColor: colorWithOpacity(colors.primary, 0.1),
                        color: colors.primary,
                        borderRadius: '9999px',
                        fontSize: `${typography.smallSize}rem`,
                        fontWeight: 500,
                    }}
                >
                    {interest.name}
                </span>
            ))}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Projects Display Component
// ─────────────────────────────────────────────────────────────────────────────

interface ProjectsDisplayProps {
    projects: CvData['projects'];
    config: TemplateConfig;
}

export const ProjectsDisplay: React.FC<ProjectsDisplayProps> = ({ projects, config }) => {
    const { colors, typography, spacing } = config;
    
    const visibleProjects = projects.filter(p => p.visible !== false);
    
    if (visibleProjects.length === 0) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: `${spacing.itemGap}px` }}>
            {visibleProjects.map(project => (
                <div key={project.id}>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start',
                        marginBottom: '4px'
                    }}>
                        <h4 style={{ 
                            fontSize: `${typography.bodySize * 1.05}rem`, 
                            fontWeight: 600,
                            color: colors.primary 
                        }}>
                            {project.name}
                        </h4>
                        {project.url && (
                            <a 
                                href={project.url}
                                style={{ 
                                    fontSize: `${typography.smallSize}rem`,
                                    color: colors.textLight,
                                    textDecoration: 'none'
                                }}
                            >
                                Voir le projet
                            </a>
                        )}
                    </div>
                    {project.description && (
                        <p style={{ 
                            fontSize: `${typography.bodySize}rem`,
                            color: colors.text,
                            lineHeight: typography.lineHeight,
                            marginBottom: '6px'
                        }}>
                            {project.description}
                        </p>
                    )}
                    {project.technologies && project.technologies.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {project.technologies.map((tech, i) => (
                                <span 
                                    key={i}
                                    style={{
                                        padding: '2px 8px',
                                        backgroundColor: colorWithOpacity(colors.border, 0.5),
                                        borderRadius: '4px',
                                        fontSize: `${typography.smallSize * 0.9}rem`,
                                        color: colors.textLight,
                                    }}
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Certifications Display Component
// ─────────────────────────────────────────────────────────────────────────────

interface CertificationsDisplayProps {
    certifications: CvData['certifications'];
    config: TemplateConfig;
}

export const CertificationsDisplay: React.FC<CertificationsDisplayProps> = ({ certifications, config }) => {
    const { colors, typography, spacing } = config;
    
    const visibleCerts = certifications.filter(c => c.visible !== false);
    
    if (visibleCerts.length === 0) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: `${spacing.itemGap}px` }}>
            {visibleCerts.map(cert => (
                <div key={cert.id}>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'baseline' 
                    }}>
                        <h4 style={{ 
                            fontSize: `${typography.bodySize}rem`, 
                            fontWeight: 600,
                            color: colors.text
                        }}>
                            {cert.name}
                        </h4>
                        <span style={{ 
                            fontSize: `${typography.smallSize}rem`,
                            color: colors.textLight 
                        }}>
                            {cert.date}
                        </span>
                    </div>
                    <p style={{ 
                        fontSize: `${typography.bodySize}rem`,
                        color: colors.textLight,
                        fontStyle: 'italic'
                    }}>
                        {cert.issuer}
                    </p>
                </div>
            ))}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Section Icons
// ─────────────────────────────────────────────────────────────────────────────

export const SECTION_ICONS = {
    contact: Mail,
    description: User,
    experience: Briefcase,
    education: GraduationCap,
    skills: Code,
    languages: Languages,
    certifications: Award,
    projects: Globe,
    interests: Star,
};

export const getSectionIcon = (section: string, size: number = 18) => {
    const Icon = SECTION_ICONS[section as keyof typeof SECTION_ICONS];
    return Icon ? <Icon size={size} /> : null;
};
