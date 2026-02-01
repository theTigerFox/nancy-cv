// ============================================================================
// NANCY CV - Inline Color Picker Component
// Modification des couleurs directement dans la preview
// ============================================================================

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Pipette, RotateCcw } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface InlineColorPickerProps {
    value: string;
    onChange: (value: string) => void;
    onClose: () => void;
    position?: { x: number; y: number };
    presets?: string[];
    label?: string;
}

const DEFAULT_PRESETS = [
    '#000000', '#ffffff', '#f43f5e', '#ec4899', '#a855f7',
    '#8b5cf6', '#6366f1', '#3b82f6', '#0ea5e9', '#06b6d4',
    '#14b8a6', '#10b981', '#22c55e', '#84cc16', '#eab308',
    '#f59e0b', '#f97316', '#ef4444', '#78716c', '#64748b',
];

const InlineColorPicker: React.FC<InlineColorPickerProps> = ({
    value,
    onChange,
    onClose,
    position,
    presets = DEFAULT_PRESETS,
    label = 'Couleur',
}) => {
    const [localValue, setLocalValue] = useState(value);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                onChange(localValue);
                onClose();
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
    }, [localValue, onChange, onClose]);

    const handleColorChange = (color: string) => {
        setLocalValue(color);
    };

    const handleConfirm = () => {
        onChange(localValue);
        onClose();
    };

    return (
        <motion.div
            ref={containerRef}
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 bg-white border-3 border-black shadow-brutal p-3 w-64"
            style={position ? { left: position.x, top: position.y } : undefined}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-sm">{label}</span>
                <div className="flex items-center gap-2">
                    <div 
                        className="w-8 h-8 border-2 border-black rounded"
                        style={{ backgroundColor: localValue }}
                    />
                    <input
                        type="text"
                        value={localValue}
                        onChange={(e) => setLocalValue(e.target.value)}
                        className="w-20 px-2 py-1 text-xs border-2 border-black font-mono"
                        placeholder="#000000"
                    />
                </div>
            </div>

            {/* Color Presets */}
            <div className="grid grid-cols-10 gap-1 mb-3">
                {presets.map((color) => (
                    <button
                        key={color}
                        onClick={() => handleColorChange(color)}
                        className={cn(
                            "w-5 h-5 border border-gray-300 rounded-sm hover:scale-110 transition-transform",
                            localValue === color && "ring-2 ring-blue-500 ring-offset-1"
                        )}
                        style={{ backgroundColor: color }}
                        title={color}
                    />
                ))}
            </div>

            {/* Advanced Color Picker Toggle */}
            <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full text-xs text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1 py-1"
            >
                <Pipette size={12} />
                {showAdvanced ? 'Masquer' : 'Plus de couleurs'}
            </button>

            {/* Advanced Color Picker */}
            <AnimatePresence>
                {showAdvanced && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="pt-3 border-t border-gray-200 mt-2">
                            <input
                                ref={inputRef}
                                type="color"
                                value={localValue}
                                onChange={(e) => setLocalValue(e.target.value)}
                                className="w-full h-32 cursor-pointer border-2 border-black"
                            />
                            
                            {/* HSL Sliders could be added here */}
                            <div className="mt-2 space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500 w-8">HEX</span>
                                    <input
                                        type="text"
                                        value={localValue}
                                        onChange={(e) => setLocalValue(e.target.value)}
                                        className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded font-mono"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                <button
                    onClick={() => setLocalValue(value)}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
                >
                    <RotateCcw size={12} />
                    Reset
                </button>
                <button
                    onClick={handleConfirm}
                    className="flex items-center gap-1 px-3 py-1.5 bg-black text-white text-xs font-bold hover:bg-gray-800 transition-colors"
                >
                    <Check size={12} />
                    Appliquer
                </button>
            </div>
        </motion.div>
    );
};

export default InlineColorPicker;
