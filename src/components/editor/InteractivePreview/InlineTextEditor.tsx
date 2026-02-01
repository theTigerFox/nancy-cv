// ============================================================================
// NANCY CV - Inline Text Editor Component
// Edition de texte directement dans la preview du CV
// ============================================================================

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Type, Palette, Bold, Italic, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface InlineTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    onClose: () => void;
    isMultiline?: boolean;
    placeholder?: string;
    style?: React.CSSProperties;
    className?: string;
    showFormatting?: boolean;
}

const InlineTextEditor: React.FC<InlineTextEditorProps> = ({
    value,
    onChange,
    onClose,
    isMultiline = false,
    placeholder = 'Saisissez du texte...',
    style,
    className,
    showFormatting = false,
}) => {
    const [localValue, setLocalValue] = useState(value);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('left');
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
    }, []);

    // Fermer si on clique en dehors
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                handleSave();
            }
        };
        
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [localValue]);

    const handleSave = useCallback(() => {
        onChange(localValue);
        onClose();
    }, [localValue, onChange, onClose]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isMultiline) {
            e.preventDefault();
            handleSave();
        }
        if (e.key === 'Enter' && e.ctrlKey && isMultiline) {
            e.preventDefault();
            handleSave();
        }
    };

    const InputComponent = isMultiline ? 'textarea' : 'input';

    return (
        <motion.div
            ref={containerRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="relative"
        >
            {/* Barre d'outils de formatage */}
            {showFormatting && (
                <div className="absolute -top-10 left-0 right-0 flex items-center gap-1 bg-black text-white px-2 py-1 rounded-t shadow-lg z-10">
                    <button
                        onClick={() => setIsBold(!isBold)}
                        className={cn(
                            "p-1 rounded hover:bg-white/20 transition-colors",
                            isBold && "bg-white/30"
                        )}
                    >
                        <Bold size={14} />
                    </button>
                    <button
                        onClick={() => setIsItalic(!isItalic)}
                        className={cn(
                            "p-1 rounded hover:bg-white/20 transition-colors",
                            isItalic && "bg-white/30"
                        )}
                    >
                        <Italic size={14} />
                    </button>
                    <div className="w-px h-4 bg-white/30 mx-1" />
                    <button
                        onClick={() => setAlignment('left')}
                        className={cn(
                            "p-1 rounded hover:bg-white/20 transition-colors",
                            alignment === 'left' && "bg-white/30"
                        )}
                    >
                        <AlignLeft size={14} />
                    </button>
                    <button
                        onClick={() => setAlignment('center')}
                        className={cn(
                            "p-1 rounded hover:bg-white/20 transition-colors",
                            alignment === 'center' && "bg-white/30"
                        )}
                    >
                        <AlignCenter size={14} />
                    </button>
                    <button
                        onClick={() => setAlignment('right')}
                        className={cn(
                            "p-1 rounded hover:bg-white/20 transition-colors",
                            alignment === 'right' && "bg-white/30"
                        )}
                    >
                        <AlignRight size={14} />
                    </button>
                </div>
            )}

            {/* Zone d'edition */}
            <div className="relative">
                <InputComponent
                    ref={inputRef as any}
                    value={localValue}
                    onChange={(e) => setLocalValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className={cn(
                        "w-full bg-transparent border-2 border-blue-500 outline-none",
                        "focus:border-blue-600 focus:ring-2 focus:ring-blue-500/30",
                        "px-2 py-1 rounded",
                        isMultiline && "min-h-[80px] resize-y",
                        isBold && "font-bold",
                        isItalic && "italic",
                        className
                    )}
                    style={{
                        ...style,
                        textAlign: alignment,
                    }}
                    rows={isMultiline ? 3 : undefined}
                />
                
                {/* Boutons de validation */}
                <div className="absolute -bottom-8 right-0 flex items-center gap-1">
                    <button
                        onClick={onClose}
                        className="p-1.5 bg-gray-200 hover:bg-gray-300 rounded border border-gray-300 transition-colors"
                        title="Annuler (Echap)"
                    >
                        <X size={14} />
                    </button>
                    <button
                        onClick={handleSave}
                        className="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
                        title="Valider (Entree)"
                    >
                        <Check size={14} />
                    </button>
                </div>
            </div>

            {/* Hint */}
            <div className="absolute -bottom-8 left-0 text-[10px] text-gray-400">
                {isMultiline ? 'Ctrl+Entree pour valider' : 'Entree pour valider'}
            </div>
        </motion.div>
    );
};

export default InlineTextEditor;
