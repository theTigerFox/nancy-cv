// ============================================================================
// NANCY CV - Inline Editor System
// Système d'édition inline complet pour la preview interactive
// Permet l'édition de texte, couleurs, espacements directement sur le CV
// ============================================================================

import React, { 
    useState, 
    useRef, 
    useEffect, 
    useCallback, 
    createContext, 
    useContext,
    type ReactNode,
    type CSSProperties,
    type MouseEvent as ReactMouseEvent,
    type ElementType,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Check, X, Type, Palette, Move, Maximize2, 
    ChevronDown, RotateCcw, Eye, EyeOff, Trash2, Plus,
    AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useCVStore } from '../../store/cvStore';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════════

export type InlineEditorType = 
    | 'text' 
    | 'multiline' 
    | 'color' 
    | 'spacing' 
    | 'select'
    | 'number'
    | 'richtext';

export interface InlineEditorConfig {
    type: InlineEditorType;
    path: string;
    label?: string;
    placeholder?: string;
    min?: number;
    max?: number;
    step?: number;
    options?: { value: string; label: string }[];
    unit?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════════════════════

interface InlineEditorContextType {
    isEditMode: boolean;
    activeEditor: string | null;
    setActiveEditor: (id: string | null) => void;
    updateValue: (path: string, value: any) => void;
    getValue: (path: string) => any;
    customizationUpdateCallback?: (path: string, value: any) => void;
}

const InlineEditorContext = createContext<InlineEditorContextType>({
    isEditMode: false,
    activeEditor: null,
    setActiveEditor: () => {},
    updateValue: () => {},
    getValue: () => undefined,
});

export const useInlineEditor = () => useContext(InlineEditorContext);

// ═══════════════════════════════════════════════════════════════════════════════
// PROVIDER
// ═══════════════════════════════════════════════════════════════════════════════

interface InlineEditorProviderProps {
    children: ReactNode;
    isEditMode: boolean;
    onCustomizationUpdate?: (path: string, value: any) => void;
}

export const InlineEditorProvider: React.FC<InlineEditorProviderProps> = ({ 
    children, 
    isEditMode,
    onCustomizationUpdate,
}) => {
    const [activeEditor, setActiveEditor] = useState<string | null>(null);
    
    // Store access
    const cv = useCVStore((state) => state.cv);
    const updatePersonalInfo = useCVStore((state) => state.updatePersonalInfo);
    const updateExperience = useCVStore((state) => state.updateExperience);
    const updateEducation = useCVStore((state) => state.updateEducation);
    const updateSkill = useCVStore((state) => state.updateSkill);
    const updateLanguage = useCVStore((state) => state.updateLanguage);
    const updateProject = useCVStore((state) => state.updateProject);
    const updateCertification = useCVStore((state) => state.updateCertification);
    const updateVolunteer = useCVStore((state) => state.updateVolunteer);
    const updateInterest = useCVStore((state) => state.updateInterest);
    const updateReference = useCVStore((state) => state.updateReference);

    // Get value by path
    const getValue = useCallback((path: string): any => {
        const parts = path.split('.');
        let value: any = cv;
        
        for (const part of parts) {
            if (value === undefined || value === null) return undefined;
            const index = parseInt(part);
            value = isNaN(index) ? value[part] : value[index];
        }
        
        return value;
    }, [cv]);

    // Update value by path
    const updateValue = useCallback((path: string, value: any) => {
        const parts = path.split('.');
        
        // Handle customization paths (colors, spacing, typography, layout)
        if (['colors', 'spacing', 'typography', 'layout', 'advanced'].includes(parts[0])) {
            onCustomizationUpdate?.(path, value);
            return;
        }
        
        // Handle CV data paths
        if (parts[0] === 'personalInfo') {
            const field = parts[1] as keyof typeof cv.personalInfo;
            updatePersonalInfo(field, value);
        } else if (parts[0] === 'experience' && parts.length >= 3) {
            const index = parseInt(parts[1]);
            const field = parts[2];
            const exp = cv.experience[index];
            if (exp) updateExperience(exp.id, { [field]: value });
        } else if (parts[0] === 'education' && parts.length >= 3) {
            const index = parseInt(parts[1]);
            const field = parts[2];
            const edu = cv.education[index];
            if (edu) updateEducation(edu.id, { [field]: value });
        } else if (parts[0] === 'skills' && parts.length >= 3) {
            const index = parseInt(parts[1]);
            const field = parts[2];
            const skill = cv.skills[index];
            if (skill) updateSkill(skill.id, { [field]: value });
        } else if (parts[0] === 'languages' && parts.length >= 3) {
            const index = parseInt(parts[1]);
            const field = parts[2];
            const lang = cv.languages[index];
            if (lang) updateLanguage(lang.id, { [field]: value });
        } else if (parts[0] === 'projects' && parts.length >= 3) {
            const index = parseInt(parts[1]);
            const field = parts[2];
            const project = cv.projects[index];
            if (project) updateProject(project.id, { [field]: value });
        } else if (parts[0] === 'certifications' && parts.length >= 3) {
            const index = parseInt(parts[1]);
            const field = parts[2];
            const cert = cv.certifications[index];
            if (cert) updateCertification(cert.id, { [field]: value });
        } else if (parts[0] === 'volunteer' && parts.length >= 3) {
            const index = parseInt(parts[1]);
            const field = parts[2];
            const vol = cv.volunteer[index];
            if (vol) updateVolunteer(vol.id, { [field]: value });
        } else if (parts[0] === 'interests' && parts.length >= 3) {
            const index = parseInt(parts[1]);
            const field = parts[2];
            const interest = cv.interests[index];
            if (interest) updateInterest(interest.id, { [field]: value });
        } else if (parts[0] === 'references' && parts.length >= 3) {
            const index = parseInt(parts[1]);
            const field = parts[2];
            const ref = cv.references[index];
            if (ref) updateReference(ref.id, { [field]: value });
        }
    }, [cv, updatePersonalInfo, updateExperience, updateEducation, updateSkill, 
        updateLanguage, updateProject, updateCertification, updateVolunteer,
        updateInterest, updateReference, onCustomizationUpdate]);

    // Close active editor when switching modes
    useEffect(() => {
        if (!isEditMode) setActiveEditor(null);
    }, [isEditMode]);

    // Global click handler to close editor when clicking outside
    useEffect(() => {
        const handleGlobalClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('[data-inline-editor]') && activeEditor) {
                // Don't close if clicking on a popup/modal
                if (!target.closest('[data-editor-popup]')) {
                    setActiveEditor(null);
                }
            }
        };

        if (isEditMode) {
            document.addEventListener('mousedown', handleGlobalClick);
            return () => document.removeEventListener('mousedown', handleGlobalClick);
        }
    }, [isEditMode, activeEditor]);

    return (
        <InlineEditorContext.Provider value={{ 
            isEditMode, 
            activeEditor, 
            setActiveEditor, 
            updateValue, 
            getValue,
            customizationUpdateCallback: onCustomizationUpdate,
        }}>
            {children}
        </InlineEditorContext.Provider>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// INLINE TEXT EDITOR
// ═══════════════════════════════════════════════════════════════════════════════

interface InlineTextProps {
    path: string;
    value: string;
    placeholder?: string;
    multiline?: boolean;
    className?: string;
    style?: CSSProperties;
    as?: ElementType;
    children?: ReactNode;
    onSave?: (value: string) => void;
}

export const InlineText: React.FC<InlineTextProps> = ({
    path,
    value,
    placeholder = 'Cliquez pour éditer...',
    multiline = false,
    className,
    style,
    as: Tag = 'span',
    children,
    onSave,
}) => {
    const { isEditMode, activeEditor, setActiveEditor, updateValue } = useInlineEditor();
    const [localValue, setLocalValue] = useState(value || '');
    const [isHovered, setIsHovered] = useState(false);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isActive = activeEditor === path;

    // Sync local value
    useEffect(() => {
        if (!isActive) setLocalValue(value || '');
    }, [value, isActive]);

    // Focus on activation
    useEffect(() => {
        if (isActive && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isActive]);

    const handleSave = useCallback(() => {
        updateValue(path, localValue);
        onSave?.(localValue);
        setActiveEditor(null);
    }, [path, localValue, updateValue, onSave, setActiveEditor]);

    const handleCancel = useCallback(() => {
        setLocalValue(value || '');
        setActiveEditor(null);
    }, [value, setActiveEditor]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !multiline) {
            e.preventDefault();
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    }, [multiline, handleSave, handleCancel]);

    const handleDoubleClick = useCallback((e: ReactMouseEvent) => {
        if (isEditMode) {
            e.preventDefault();
            e.stopPropagation();
            setActiveEditor(path);
        }
    }, [isEditMode, path, setActiveEditor]);

    // Prevent text selection on double-click in edit mode
    const handleMouseDown = useCallback((e: ReactMouseEvent) => {
        if (isEditMode && e.detail >= 2) {
            e.preventDefault();
        }
    }, [isEditMode]);

    // Non-edit mode: render normally
    if (!isEditMode) {
        return React.createElement(
            Tag,
            { className, style },
            children || value || placeholder
        );
    }

    // Active editing
    if (isActive) {
        return (
            <div 
                ref={containerRef}
                data-inline-editor
                className="relative inline-flex items-center gap-1"
                style={{ minWidth: '80px' }}
            >
                {multiline ? (
                    <textarea
                        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                        value={localValue}
                        onChange={(e) => setLocalValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className={cn(
                            "w-full min-h-[80px] px-2 py-1 border-2 border-[#ff6b9d] bg-white resize-none",
                            "focus:outline-none focus:ring-2 focus:ring-[#ff6b9d] shadow-lg",
                            className
                        )}
                        style={{ 
                            ...style, 
                            fontFamily: 'inherit', 
                            fontSize: 'inherit',
                            color: 'black',
                        }}
                        placeholder={placeholder}
                    />
                ) : (
                    <input
                        ref={inputRef as React.RefObject<HTMLInputElement>}
                        type="text"
                        value={localValue}
                        onChange={(e) => setLocalValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className={cn(
                            "px-2 py-0.5 border-2 border-[#ff6b9d] bg-white",
                            "focus:outline-none focus:ring-2 focus:ring-[#ff6b9d] shadow-lg",
                        )}
                        style={{ 
                            ...style, 
                            fontFamily: 'inherit', 
                            fontSize: 'inherit',
                            width: `${Math.max((localValue?.length || 0) * 0.6 + 3, 8)}em`,
                            minWidth: '100px',
                            color: 'black',
                        }}
                        placeholder={placeholder}
                    />
                )}
                <div className="flex gap-0.5 shrink-0">
                    <button
                        onClick={handleSave}
                        className="p-1 bg-[#bfff00] border border-black hover:bg-green-400 transition-colors"
                        title="Valider (Entrée)"
                    >
                        <Check size={12} />
                    </button>
                    <button
                        onClick={handleCancel}
                        className="p-1 bg-gray-200 border border-black hover:bg-gray-300 transition-colors"
                        title="Annuler (Échap)"
                    >
                        <X size={12} />
                    </button>
                </div>
            </div>
        );
    }

    // Edit mode but not active - show hover indicator
    return React.createElement(
        Tag,
        {
            'data-inline-editor': true,
            className: cn(
                "relative cursor-pointer transition-all select-none",
                isHovered && "outline outline-2 outline-dashed outline-[#ff6b9d] outline-offset-2 bg-pink-50/30",
                className
            ),
            style: { ...style, userSelect: 'none' as const },
            onMouseEnter: () => setIsHovered(true),
            onMouseLeave: () => setIsHovered(false),
            onMouseDown: handleMouseDown,
            onDoubleClick: handleDoubleClick,
            title: "Double-cliquez pour éditer",
        },
        <>
            {children || value || <span className="text-gray-300 italic">{placeholder}</span>}
            
            <AnimatePresence>
                {isHovered && (
                    <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="absolute -top-2 -right-2 bg-[#ff6b9d] text-white p-0.5 rounded-full shadow-lg z-50"
                    >
                        <Type size={10} />
                    </motion.span>
                )}
            </AnimatePresence>
        </>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// INLINE COLOR EDITOR
// ═══════════════════════════════════════════════════════════════════════════════

interface InlineColorProps {
    path: string;
    value: string;
    label?: string;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
    showOnElement?: boolean; // Show color picker anchored to element
}

const COLOR_PRESETS = [
    '#000000', '#1f2937', '#374151', '#4b5563', '#6b7280', '#9ca3af',
    '#dc2626', '#ea580c', '#d97706', '#ca8a04', '#65a30d', '#16a34a',
    '#059669', '#0d9488', '#0891b2', '#0284c7', '#2563eb', '#4f46e5',
    '#7c3aed', '#9333ea', '#c026d3', '#db2777', '#e11d48', '#f43f5e',
    '#ffffff', '#f9fafb', '#f3f4f6', '#e5e7eb', '#d1d5db', '#fef3c7',
];

export const InlineColor: React.FC<InlineColorProps> = ({
    path,
    value,
    label,
    className,
    style,
    children,
    showOnElement = false,
}) => {
    const { isEditMode, activeEditor, setActiveEditor, updateValue } = useInlineEditor();
    const [localColor, setLocalColor] = useState(value || '#000000');
    const [isHovered, setIsHovered] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const isActive = activeEditor === `color-${path}`;

    useEffect(() => {
        if (!isActive) setLocalColor(value || '#000000');
    }, [value, isActive]);

    const handleColorChange = useCallback((newColor: string) => {
        setLocalColor(newColor);
        updateValue(path, newColor);
    }, [path, updateValue]);

    const handleClick = useCallback((e: ReactMouseEvent) => {
        if (isEditMode) {
            e.preventDefault();
            e.stopPropagation();
            setActiveEditor(isActive ? null : `color-${path}`);
        }
    }, [isEditMode, isActive, path, setActiveEditor]);

    if (!isEditMode) {
        return children ? <>{children}</> : (
            <div 
                className={className} 
                style={{ ...style, backgroundColor: value }}
            />
        );
    }

    return (
        <div 
            ref={containerRef}
            data-inline-editor
            className={cn("relative inline-block", className)}
            style={style}
        >
            <div
                onClick={handleClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={cn(
                    "cursor-pointer transition-all",
                    isHovered && "ring-2 ring-[#ff6b9d] ring-offset-1",
                    isActive && "ring-2 ring-[#ff6b9d] ring-offset-2"
                )}
                title={label || "Cliquez pour changer la couleur"}
            >
                {children || (
                    <div 
                        className="w-6 h-6 border-2 border-black shadow-sm"
                        style={{ backgroundColor: value }}
                    />
                )}
                
                <AnimatePresence>
                    {isHovered && !isActive && (
                        <motion.span
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="absolute -top-2 -right-2 bg-[#ff6b9d] text-white p-0.5 rounded-full shadow-lg z-50"
                        >
                            <Palette size={10} />
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {isActive && (
                    <motion.div
                        data-editor-popup
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute top-full left-0 mt-2 z-[100] bg-white border-2 border-black shadow-xl p-3 min-w-[220px]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-200">
                            <span className="text-xs font-bold uppercase text-gray-500">
                                {label || 'Couleur'}
                            </span>
                            <button 
                                onClick={() => setActiveEditor(null)}
                                className="p-0.5 hover:bg-gray-100 rounded"
                            >
                                <X size={12} />
                            </button>
                        </div>
                        
                        {/* Color input */}
                        <div className="flex items-center gap-2 mb-3">
                            <input
                                type="color"
                                value={localColor}
                                onChange={(e) => handleColorChange(e.target.value)}
                                className="w-10 h-10 border-2 border-black cursor-pointer"
                            />
                            <input
                                type="text"
                                value={localColor}
                                onChange={(e) => handleColorChange(e.target.value)}
                                className="flex-1 px-2 py-1 border-2 border-black text-sm font-mono uppercase"
                                placeholder="#000000"
                            />
                        </div>

                        {/* Presets */}
                        <div className="grid grid-cols-6 gap-1">
                            {COLOR_PRESETS.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => handleColorChange(color)}
                                    className={cn(
                                        "w-7 h-7 border border-gray-300 hover:border-black hover:scale-110 transition-all",
                                        localColor === color && "ring-2 ring-[#ff6b9d] ring-offset-1"
                                    )}
                                    style={{ backgroundColor: color }}
                                    title={color}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// INLINE NUMBER/SPACING EDITOR
// ═══════════════════════════════════════════════════════════════════════════════

interface InlineNumberProps {
    path: string;
    value: number;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    label?: string;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
}

export const InlineNumber: React.FC<InlineNumberProps> = ({
    path,
    value,
    min = 0,
    max = 100,
    step = 1,
    unit = '',
    label,
    className,
    style,
    children,
}) => {
    const { isEditMode, activeEditor, setActiveEditor, updateValue } = useInlineEditor();
    const [localValue, setLocalValue] = useState(value);
    const [isHovered, setIsHovered] = useState(false);
    const isActive = activeEditor === `number-${path}`;

    useEffect(() => {
        if (!isActive) setLocalValue(value);
    }, [value, isActive]);

    const handleChange = useCallback((newValue: number) => {
        const clamped = Math.min(max, Math.max(min, newValue));
        setLocalValue(clamped);
        updateValue(path, clamped);
    }, [path, min, max, updateValue]);

    const handleClick = useCallback((e: ReactMouseEvent) => {
        if (isEditMode) {
            e.preventDefault();
            e.stopPropagation();
            setActiveEditor(isActive ? null : `number-${path}`);
        }
    }, [isEditMode, isActive, path, setActiveEditor]);

    if (!isEditMode) {
        return children ? <>{children}</> : (
            <span className={className} style={style}>{value}{unit}</span>
        );
    }

    return (
        <div 
            data-inline-editor
            className={cn("relative inline-block", className)}
            style={style}
        >
            <div
                onClick={handleClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={cn(
                    "cursor-pointer transition-all px-1 rounded",
                    isHovered && "bg-pink-50 ring-1 ring-[#ff6b9d]",
                    isActive && "bg-pink-100 ring-2 ring-[#ff6b9d]"
                )}
                title={label || "Cliquez pour modifier"}
            >
                {children || <span>{value}{unit}</span>}
                
                <AnimatePresence>
                    {isHovered && !isActive && (
                        <motion.span
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="absolute -top-2 -right-2 bg-[#ff6b9d] text-white p-0.5 rounded-full shadow-lg z-50"
                        >
                            <Maximize2 size={10} />
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {isActive && (
                    <motion.div
                        data-editor-popup
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute top-full left-0 mt-2 z-[100] bg-white border-2 border-black shadow-xl p-3 min-w-[200px]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-200">
                            <span className="text-xs font-bold uppercase text-gray-500">
                                {label || 'Valeur'}
                            </span>
                            <button 
                                onClick={() => setActiveEditor(null)}
                                className="p-0.5 hover:bg-gray-100 rounded"
                            >
                                <X size={12} />
                            </button>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                            <button
                                onClick={() => handleChange(localValue - step)}
                                disabled={localValue <= min}
                                className="p-1.5 border border-black hover:bg-gray-100 disabled:opacity-30"
                            >
                                -
                            </button>
                            <input
                                type="number"
                                value={localValue}
                                onChange={(e) => handleChange(parseFloat(e.target.value) || 0)}
                                min={min}
                                max={max}
                                step={step}
                                className="flex-1 px-2 py-1 border-2 border-black text-center font-mono"
                            />
                            <button
                                onClick={() => handleChange(localValue + step)}
                                disabled={localValue >= max}
                                className="p-1.5 border border-black hover:bg-gray-100 disabled:opacity-30"
                            >
                                +
                            </button>
                        </div>

                        <input
                            type="range"
                            value={localValue}
                            onChange={(e) => handleChange(parseFloat(e.target.value))}
                            min={min}
                            max={max}
                            step={step}
                            className="w-full accent-[#ff6b9d]"
                        />

                        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                            <span>{min}{unit}</span>
                            <span className="font-bold text-black">{localValue}{unit}</span>
                            <span>{max}{unit}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// INLINE SELECT EDITOR
// ═══════════════════════════════════════════════════════════════════════════════

interface InlineSelectProps {
    path: string;
    value: string;
    options: { value: string; label: string; icon?: ReactNode }[];
    label?: string;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
}

export const InlineSelect: React.FC<InlineSelectProps> = ({
    path,
    value,
    options,
    label,
    className,
    style,
    children,
}) => {
    const { isEditMode, activeEditor, setActiveEditor, updateValue } = useInlineEditor();
    const [isHovered, setIsHovered] = useState(false);
    const isActive = activeEditor === `select-${path}`;

    const selectedOption = options.find(o => o.value === value);

    const handleSelect = useCallback((newValue: string) => {
        updateValue(path, newValue);
        setActiveEditor(null);
    }, [path, updateValue, setActiveEditor]);

    const handleClick = useCallback((e: ReactMouseEvent) => {
        if (isEditMode) {
            e.preventDefault();
            e.stopPropagation();
            setActiveEditor(isActive ? null : `select-${path}`);
        }
    }, [isEditMode, isActive, path, setActiveEditor]);

    if (!isEditMode) {
        return children ? <>{children}</> : (
            <span className={className} style={style}>{selectedOption?.label || value}</span>
        );
    }

    return (
        <div 
            data-inline-editor
            className={cn("relative inline-block", className)}
            style={style}
        >
            <div
                onClick={handleClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={cn(
                    "cursor-pointer transition-all flex items-center gap-1 px-1 rounded",
                    isHovered && "bg-pink-50 ring-1 ring-[#ff6b9d]",
                    isActive && "bg-pink-100 ring-2 ring-[#ff6b9d]"
                )}
                title={label || "Cliquez pour changer"}
            >
                {children || <span>{selectedOption?.label || value}</span>}
                <ChevronDown size={12} className={cn("transition-transform", isActive && "rotate-180")} />
            </div>

            <AnimatePresence>
                {isActive && (
                    <motion.div
                        data-editor-popup
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute top-full left-0 mt-1 z-[100] bg-white border-2 border-black shadow-xl min-w-[150px]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleSelect(option.value)}
                                className={cn(
                                    "w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-gray-100 transition-colors text-sm",
                                    value === option.value && "bg-[#bfff00] font-bold"
                                )}
                            >
                                {option.icon}
                                {option.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// EDITABLE SECTION WRAPPER
// ═══════════════════════════════════════════════════════════════════════════════

interface EditableSectionWrapperProps {
    sectionKey: string;
    title?: string;
    children: ReactNode;
    onAdd?: () => void;
    onToggleVisibility?: (visible: boolean) => void;
    isVisible?: boolean;
    className?: string;
    style?: CSSProperties;
}

export const EditableSectionWrapper: React.FC<EditableSectionWrapperProps> = ({
    sectionKey,
    title,
    children,
    onAdd,
    onToggleVisibility,
    isVisible = true,
    className,
    style,
}) => {
    const { isEditMode } = useInlineEditor();
    const [isHovered, setIsHovered] = useState(false);

    if (!isEditMode) {
        return isVisible ? <div className={className} style={style}>{children}</div> : null;
    }

    return (
        <div
            data-inline-editor
            className={cn(
                "relative transition-all",
                isHovered && "ring-2 ring-dashed ring-blue-400 ring-offset-2",
                !isVisible && "opacity-50",
                className
            )}
            style={style}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Section controls */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="absolute -right-10 top-0 flex flex-col gap-1 z-50"
                    >
                        {onToggleVisibility && (
                            <button
                                onClick={() => onToggleVisibility(!isVisible)}
                                className={cn(
                                    "p-1.5 border border-black shadow-sm transition-colors",
                                    isVisible ? "bg-white hover:bg-gray-100" : "bg-gray-300"
                                )}
                                title={isVisible ? "Masquer la section" : "Afficher la section"}
                            >
                                {isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
                            </button>
                        )}
                        {onAdd && (
                            <button
                                onClick={onAdd}
                                className="p-1.5 bg-[#bfff00] border border-black shadow-sm hover:bg-green-400 transition-colors"
                                title="Ajouter un élément"
                            >
                                <Plus size={12} />
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {children}
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// EDITABLE LIST ITEM
// ═══════════════════════════════════════════════════════════════════════════════

interface EditableListItemProps {
    index: number;
    children: ReactNode;
    onRemove?: () => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
    canMoveUp?: boolean;
    canMoveDown?: boolean;
    className?: string;
}

export const EditableListItem: React.FC<EditableListItemProps> = ({
    index,
    children,
    onRemove,
    onMoveUp,
    onMoveDown,
    canMoveUp = true,
    canMoveDown = true,
    className,
}) => {
    const { isEditMode } = useInlineEditor();
    const [isHovered, setIsHovered] = useState(false);

    if (!isEditMode) {
        return <div className={className}>{children}</div>;
    }

    return (
        <div
            data-inline-editor
            className={cn(
                "relative group transition-all",
                isHovered && "bg-gray-50/50 ring-1 ring-gray-300 ring-offset-1",
                className
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {children}

            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute -left-8 top-1/2 -translate-y-1/2 flex flex-col gap-0.5 z-50"
                    >
                        {onMoveUp && (
                            <button
                                onClick={onMoveUp}
                                disabled={!canMoveUp}
                                className="p-1 bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                                title="Monter"
                            >
                                <Move size={10} className="rotate-180" />
                            </button>
                        )}
                        {onMoveDown && (
                            <button
                                onClick={onMoveDown}
                                disabled={!canMoveDown}
                                className="p-1 bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                                title="Descendre"
                            >
                                <Move size={10} />
                            </button>
                        )}
                        {onRemove && (
                            <button
                                onClick={onRemove}
                                className="p-1 bg-red-50 border border-red-300 hover:bg-red-100 text-red-500 transition-colors"
                                title="Supprimer"
                            >
                                <Trash2 size={10} />
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default {
    InlineEditorProvider,
    InlineText,
    InlineColor,
    InlineNumber,
    InlineSelect,
    EditableSectionWrapper,
    EditableListItem,
    useInlineEditor,
};
