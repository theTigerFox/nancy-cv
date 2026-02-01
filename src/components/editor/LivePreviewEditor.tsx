// ============================================================================
// NANCY CV - Live Preview Editor Component
// Permet l'édition directe sur la prévisualisation du CV
// ============================================================================

import React, { useState, useRef, useEffect, useCallback, ElementType } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Edit3, Check, X, Type, Bold, Italic, AlignLeft, AlignCenter, 
    AlignRight, Palette, Trash2, Plus, GripVertical
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useCVStore } from '../../store/cvStore';

// Types pour les champs éditables
export type EditableFieldType = 
    | 'text' 
    | 'multiline' 
    | 'date' 
    | 'email' 
    | 'phone' 
    | 'url' 
    | 'list'
    | 'richtext';

export interface EditableFieldConfig {
    path: string; // chemin dans le store (ex: "personalInfo.firstName")
    type: EditableFieldType;
    label?: string;
    placeholder?: string;
    validation?: (value: string) => boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Context pour le mode édition
// ─────────────────────────────────────────────────────────────────────────────

interface LiveEditContextType {
    isEditMode: boolean;
    activeField: string | null;
    setActiveField: (field: string | null) => void;
    updateValue: (path: string, value: any) => void;
}

const LiveEditContext = React.createContext<LiveEditContextType>({
    isEditMode: false,
    activeField: null,
    setActiveField: () => {},
    updateValue: () => {},
});

export const useLiveEdit = () => React.useContext(LiveEditContext);

// ─────────────────────────────────────────────────────────────────────────────
// Provider pour le mode édition live
// ─────────────────────────────────────────────────────────────────────────────

interface LiveEditProviderProps {
    children: React.ReactNode;
    isEditMode: boolean;
}

export const LiveEditProvider: React.FC<LiveEditProviderProps> = ({ 
    children, 
    isEditMode 
}) => {
    const [activeField, setActiveField] = useState<string | null>(null);
    
    // Accès direct au store pour les mises à jour
    const updatePersonalInfo = useCVStore((state) => state.updatePersonalInfo);
    const updateExperience = useCVStore((state) => state.updateExperience);
    const updateEducation = useCVStore((state) => state.updateEducation);
    const updateSkill = useCVStore((state) => state.updateSkill);
    const updateLanguage = useCVStore((state) => state.updateLanguage);
    const updateProject = useCVStore((state) => state.updateProject);
    const cv = useCVStore((state) => state.cv);

    const updateValue = useCallback((path: string, value: any) => {
        const parts = path.split('.');
        
        if (parts[0] === 'personalInfo') {
            const field = parts[1] as keyof typeof cv.personalInfo;
            updatePersonalInfo(field, value);
        } else if (parts[0] === 'experience' && parts.length >= 3) {
            const index = parseInt(parts[1]);
            const field = parts[2];
            const exp = cv.experience[index];
            if (exp) {
                updateExperience(exp.id, { [field]: value });
            }
        } else if (parts[0] === 'education' && parts.length >= 3) {
            const index = parseInt(parts[1]);
            const field = parts[2];
            const edu = cv.education[index];
            if (edu) {
                updateEducation(edu.id, { [field]: value });
            }
        } else if (parts[0] === 'skills' && parts.length >= 3) {
            const index = parseInt(parts[1]);
            const field = parts[2];
            const skill = cv.skills[index];
            if (skill) {
                updateSkill(skill.id, { [field]: value });
            }
        } else if (parts[0] === 'languages' && parts.length >= 3) {
            const index = parseInt(parts[1]);
            const field = parts[2];
            const lang = cv.languages[index];
            if (lang) {
                updateLanguage(lang.id, { [field]: value });
            }
        } else if (parts[0] === 'projects' && parts.length >= 3) {
            const index = parseInt(parts[1]);
            const field = parts[2];
            const project = cv.projects[index];
            if (project) {
                updateProject(project.id, { [field]: value });
            }
        }
    }, [cv, updatePersonalInfo, updateExperience, updateEducation, updateSkill, updateLanguage, updateProject]);

    // Fermer l'éditeur actif quand on désactive le mode édition
    useEffect(() => {
        if (!isEditMode) {
            setActiveField(null);
        }
    }, [isEditMode]);

    return (
        <LiveEditContext.Provider value={{ isEditMode, activeField, setActiveField, updateValue }}>
            {children}
        </LiveEditContext.Provider>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Composant Editable Inline Text
// ─────────────────────────────────────────────────────────────────────────────

interface EditableTextProps {
    path: string;
    value: string;
    type?: EditableFieldType;
    placeholder?: string;
    className?: string;
    style?: React.CSSProperties;
    as?: ElementType;
    multiline?: boolean;
    children?: React.ReactNode;
}

export const EditableText: React.FC<EditableTextProps> = ({
    path,
    value,
    type = 'text',
    placeholder = 'Cliquez pour éditer...',
    className,
    style,
    as: Component = 'span',
    multiline = false,
    children,
}) => {
    const { isEditMode, activeField, setActiveField, updateValue } = useLiveEdit();
    const [localValue, setLocalValue] = useState(value);
    const [isHovered, setIsHovered] = useState(false);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
    const isActive = activeField === path;

    // Synchroniser la valeur locale avec la prop
    useEffect(() => {
        if (!isActive) {
            setLocalValue(value);
        }
    }, [value, isActive]);

    // Focus quand on active
    useEffect(() => {
        if (isActive && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isActive]);

    const handleSave = () => {
        updateValue(path, localValue);
        setActiveField(null);
    };

    const handleCancel = () => {
        setLocalValue(value);
        setActiveField(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !multiline) {
            e.preventDefault();
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    const handleDoubleClick = () => {
        if (isEditMode) {
            setActiveField(path);
        }
    };

    // Si pas en mode édition, afficher le contenu normalement
    if (!isEditMode) {
        const Tag = Component;
        return React.createElement(
            Tag,
            { className, style },
            children || value || placeholder
        );
    }

    // Mode édition actif pour ce champ
    if (isActive) {
        return (
            <div className="relative inline-flex items-center gap-1" style={{ minWidth: '100px' }}>
                {multiline || type === 'multiline' ? (
                    <textarea
                        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                        value={localValue}
                        onChange={(e) => setLocalValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={handleSave}
                        className={cn(
                            "w-full min-h-[60px] px-2 py-1 border-2 border-brutal-pink bg-white text-inherit resize-none focus:outline-none focus:ring-2 focus:ring-brutal-pink",
                            className
                        )}
                        style={{ ...style, fontFamily: 'inherit', fontSize: 'inherit' }}
                        placeholder={placeholder}
                    />
                ) : (
                    <input
                        ref={inputRef as React.RefObject<HTMLInputElement>}
                        type={type === 'email' ? 'email' : type === 'phone' ? 'tel' : type === 'url' ? 'url' : 'text'}
                        value={localValue}
                        onChange={(e) => setLocalValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={handleSave}
                        className={cn(
                            "px-2 py-0.5 border-2 border-brutal-pink bg-white focus:outline-none focus:ring-2 focus:ring-brutal-pink",
                            className
                        )}
                        style={{ 
                            ...style, 
                            fontFamily: 'inherit', 
                            fontSize: 'inherit',
                            width: `${Math.max(localValue.length * 0.6, 5)}em`,
                            minWidth: '80px',
                        }}
                        placeholder={placeholder}
                    />
                )}
                <div className="flex gap-0.5">
                    <button
                        onClick={handleSave}
                        className="p-1 bg-brutal-lime border border-black hover:bg-green-400 transition-colors"
                        title="Valider"
                    >
                        <Check size={12} />
                    </button>
                    <button
                        onClick={handleCancel}
                        className="p-1 bg-gray-200 border border-black hover:bg-gray-300 transition-colors"
                        title="Annuler"
                    >
                        <X size={12} />
                    </button>
                </div>
            </div>
        );
    }

    // Mode édition mais pas ce champ - afficher avec indicateur hover
    const Tag = Component;
    return React.createElement(
        Tag,
        {
            className: cn(
                "relative cursor-pointer transition-all",
                isHovered && "outline outline-2 outline-dashed outline-brutal-pink outline-offset-2",
                className
            ),
            style,
            onMouseEnter: () => setIsHovered(true),
            onMouseLeave: () => setIsHovered(false),
            onDoubleClick: handleDoubleClick,
            title: "Double-cliquez pour éditer",
        },
        <>
            {children || value || <span className="text-gray-300 italic">{placeholder}</span>}
            
            {isHovered && (
                <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -top-2 -right-2 bg-brutal-pink text-white p-0.5 rounded-full shadow-lg z-10"
                >
                    <Edit3 size={10} />
                </motion.span>
            )}
        </>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Composant Editable List Item
// ─────────────────────────────────────────────────────────────────────────────

interface EditableListItemProps {
    path: string;
    index: number;
    value: string;
    onRemove?: () => void;
    className?: string;
    style?: React.CSSProperties;
}

export const EditableListItem: React.FC<EditableListItemProps> = ({
    path,
    index,
    value,
    onRemove,
    className,
    style,
}) => {
    const { isEditMode } = useLiveEdit();
    const fullPath = `${path}.${index}`;

    return (
        <div className={cn("flex items-center gap-2 group", className)} style={style}>
            {isEditMode && (
                <GripVertical size={12} className="text-gray-300 cursor-grab" />
            )}
            <EditableText
                path={fullPath}
                value={value}
                className="flex-1"
            />
            {isEditMode && onRemove && (
                <button
                    onClick={onRemove}
                    className="opacity-0 group-hover:opacity-100 p-0.5 text-red-500 hover:bg-red-100 rounded transition-all"
                >
                    <Trash2 size={12} />
                </button>
            )}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Composant pour section éditable avec ajout/suppression
// ─────────────────────────────────────────────────────────────────────────────

interface EditableSectionProps {
    title: string;
    children: React.ReactNode;
    onAdd?: () => void;
    addLabel?: string;
    className?: string;
}

export const EditableSection: React.FC<EditableSectionProps> = ({
    title,
    children,
    onAdd,
    addLabel = 'Ajouter',
    className,
}) => {
    const { isEditMode } = useLiveEdit();

    return (
        <div className={className}>
            {children}
            
            {isEditMode && onAdd && (
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={onAdd}
                    className="mt-2 w-full py-2 border-2 border-dashed border-gray-300 text-gray-400 
                               hover:border-brutal-pink hover:text-brutal-pink flex items-center justify-center gap-2 
                               transition-colors text-sm font-bold"
                >
                    <Plus size={14} />
                    {addLabel}
                </motion.button>
            )}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Hook pour obtenir la valeur du store par chemin
// ─────────────────────────────────────────────────────────────────────────────

export const useStoreValue = (path: string): any => {
    const cv = useCVStore((state) => state.cv);
    
    const parts = path.split('.');
    let value: any = cv;
    
    for (const part of parts) {
        if (value === undefined || value === null) return undefined;
        value = value[part];
    }
    
    return value;
};

// ─────────────────────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────────────────────

export default {
    LiveEditProvider,
    EditableText,
    EditableListItem,
    EditableSection,
    useLiveEdit,
    useStoreValue,
};
