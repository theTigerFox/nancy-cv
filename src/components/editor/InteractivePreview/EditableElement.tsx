// ============================================================================
// NANCY CV - Editable Element Wrapper
// Wrapper qui rend n'importe quel element editable au double-clic
// ============================================================================

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Palette, Image, Trash2 } from 'lucide-react';
import { cn } from '../../../lib/utils';
import InlineTextEditor from './InlineTextEditor';
import InlineColorPicker from './InlineColorPicker';

type EditMode = 'text' | 'color' | 'image' | null;

interface EditableElementProps {
    /** Contenu a afficher */
    children: React.ReactNode;
    /** Valeur actuelle */
    value: string;
    /** Callback de changement */
    onChange: (value: string) => void;
    /** Type d'edition */
    editType?: 'text' | 'textarea' | 'color' | 'image';
    /** Placeholder pour l'edition */
    placeholder?: string;
    /** Afficher le formatage (bold, italic, etc) */
    showFormatting?: boolean;
    /** Style a appliquer lors de l'edition */
    editStyle?: React.CSSProperties;
    /** Classe CSS */
    className?: string;
    /** Desactiver l'edition */
    disabled?: boolean;
    /** Label pour le tooltip */
    label?: string;
    /** Pour les couleurs: permettre aussi l'edition de couleur */
    colorPath?: string;
    /** Callback pour changement de couleur */
    onColorChange?: (color: string) => void;
    /** Couleur actuelle */
    currentColor?: string;
}

const EditableElement: React.FC<EditableElementProps> = ({
    children,
    value,
    onChange,
    editType = 'text',
    placeholder,
    showFormatting = false,
    editStyle,
    className,
    disabled = false,
    label,
    colorPath,
    onColorChange,
    currentColor,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [showActions, setShowActions] = useState(false);
    const [editMode, setEditMode] = useState<EditMode>(null);
    const [colorPickerPosition, setColorPickerPosition] = useState<{ x: number; y: number } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleDoubleClick = useCallback((e: React.MouseEvent) => {
        if (disabled) return;
        e.preventDefault();
        e.stopPropagation();
        
        if (editType === 'color') {
            const rect = containerRef.current?.getBoundingClientRect();
            if (rect) {
                setColorPickerPosition({ x: 0, y: rect.height + 8 });
            }
            setEditMode('color');
        } else {
            setEditMode('text');
        }
        setIsEditing(true);
    }, [disabled, editType]);

    const handleTextChange = useCallback((newValue: string) => {
        onChange(newValue);
    }, [onChange]);

    const handleColorChange = useCallback((newColor: string) => {
        if (onColorChange) {
            onColorChange(newColor);
        } else {
            onChange(newColor);
        }
    }, [onChange, onColorChange]);

    const handleClose = useCallback(() => {
        setIsEditing(false);
        setEditMode(null);
        setColorPickerPosition(null);
    }, []);

    const handleActionClick = (action: 'edit' | 'color' | 'image') => {
        if (action === 'edit') {
            setEditMode('text');
            setIsEditing(true);
        } else if (action === 'color' && onColorChange) {
            const rect = containerRef.current?.getBoundingClientRect();
            if (rect) {
                setColorPickerPosition({ x: 0, y: rect.height + 8 });
            }
            setEditMode('color');
            setIsEditing(true);
        }
        setShowActions(false);
    };

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative group",
                !disabled && "cursor-pointer",
                className
            )}
            onDoubleClick={handleDoubleClick}
            onMouseEnter={() => !disabled && setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            {/* Contenu original ou editeur */}
            <AnimatePresence mode="wait">
                {isEditing && editMode === 'text' ? (
                    <InlineTextEditor
                        key="editor"
                        value={value}
                        onChange={handleTextChange}
                        onClose={handleClose}
                        isMultiline={editType === 'textarea'}
                        placeholder={placeholder}
                        style={editStyle}
                        showFormatting={showFormatting}
                    />
                ) : (
                    <motion.div
                        key="content"
                        className={cn(
                            "relative transition-all duration-200",
                            !disabled && showActions && "outline outline-2 outline-blue-500 outline-dashed outline-offset-2"
                        )}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Color Picker Popup */}
            <AnimatePresence>
                {isEditing && editMode === 'color' && colorPickerPosition && (
                    <InlineColorPicker
                        value={currentColor || value}
                        onChange={handleColorChange}
                        onClose={handleClose}
                        position={colorPickerPosition}
                        label={label}
                    />
                )}
            </AnimatePresence>

            {/* Actions rapides au survol */}
            <AnimatePresence>
                {showActions && !isEditing && !disabled && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute -top-8 left-0 flex items-center gap-1 bg-black text-white px-1.5 py-1 rounded shadow-lg z-20"
                    >
                        <button
                            onClick={() => handleActionClick('edit')}
                            className="p-1 hover:bg-white/20 rounded transition-colors"
                            title="Modifier le texte (double-clic)"
                        >
                            <Edit2 size={12} />
                        </button>
                        {onColorChange && (
                            <button
                                onClick={() => handleActionClick('color')}
                                className="p-1 hover:bg-white/20 rounded transition-colors"
                                title="Modifier la couleur"
                            >
                                <Palette size={12} />
                            </button>
                        )}
                        {label && (
                            <span className="text-[10px] opacity-70 px-1">{label}</span>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Indicateur double-clic */}
            {!disabled && !showActions && !isEditing && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                    <div className="absolute top-1 right-1 bg-black/70 text-white text-[8px] px-1 py-0.5 rounded">
                        Double-clic pour editer
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditableElement;
