// ============================================================================
// NANCY CV - Interactive Preview Container
// Container principal pour la preview interactive du CV
// ============================================================================

import React, { useState, useCallback, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MousePointer2, 
    Hand, 
    ZoomIn, 
    ZoomOut, 
    RotateCcw,
    Eye,
    Edit3,
    Palette,
    Maximize2
} from 'lucide-react';
import { cn } from '../../../lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// Context pour l'etat interactif
// ─────────────────────────────────────────────────────────────────────────────

interface InteractiveContextValue {
    /** Mode actif: 'edit' pour edition, 'preview' pour lecture seule */
    mode: 'edit' | 'preview';
    /** Zoom actuel */
    zoom: number;
    /** Element actuellement survole */
    hoveredElement: string | null;
    /** Element en cours d'edition */
    editingElement: string | null;
    /** Setters */
    setMode: (mode: 'edit' | 'preview') => void;
    setZoom: (zoom: number) => void;
    setHoveredElement: (id: string | null) => void;
    setEditingElement: (id: string | null) => void;
}

const InteractiveContext = createContext<InteractiveContextValue | null>(null);

export const useInteractivePreview = () => {
    const context = useContext(InteractiveContext);
    if (!context) {
        throw new Error('useInteractivePreview must be used within InteractivePreviewContainer');
    }
    return context;
};

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

interface InteractivePreviewContainerProps {
    children: React.ReactNode;
    onZoomChange?: (zoom: number) => void;
    initialMode?: 'edit' | 'preview';
    className?: string;
    showToolbar?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

const InteractivePreviewContainer: React.FC<InteractivePreviewContainerProps> = ({
    children,
    onZoomChange,
    initialMode = 'edit',
    className,
    showToolbar = true,
}) => {
    const [mode, setMode] = useState<'edit' | 'preview'>(initialMode);
    const [zoom, setZoomState] = useState(100);
    const [hoveredElement, setHoveredElement] = useState<string | null>(null);
    const [editingElement, setEditingElement] = useState<string | null>(null);

    const setZoom = useCallback((newZoom: number) => {
        const clampedZoom = Math.min(Math.max(newZoom, 50), 200);
        setZoomState(clampedZoom);
        onZoomChange?.(clampedZoom);
    }, [onZoomChange]);

    const handleZoomIn = () => setZoom(zoom + 10);
    const handleZoomOut = () => setZoom(zoom - 10);
    const handleResetZoom = () => setZoom(100);

    const contextValue: InteractiveContextValue = {
        mode,
        zoom,
        hoveredElement,
        editingElement,
        setMode,
        setZoom,
        setHoveredElement,
        setEditingElement,
    };

    return (
        <InteractiveContext.Provider value={contextValue}>
            <div className={cn("flex flex-col h-full", className)}>
                {/* Toolbar */}
                {showToolbar && (
                    <div className="flex items-center justify-between px-4 py-2 bg-white border-b-2 border-black">
                        {/* Mode Toggle */}
                        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded">
                            <button
                                onClick={() => setMode('edit')}
                                className={cn(
                                    "flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold transition-colors rounded",
                                    mode === 'edit' 
                                        ? "bg-brutal-lime text-black" 
                                        : "text-gray-600 hover:text-black"
                                )}
                            >
                                <Edit3 size={14} />
                                Edition
                            </button>
                            <button
                                onClick={() => setMode('preview')}
                                className={cn(
                                    "flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold transition-colors rounded",
                                    mode === 'preview' 
                                        ? "bg-brutal-blue text-white" 
                                        : "text-gray-600 hover:text-black"
                                )}
                            >
                                <Eye size={14} />
                                Apercu
                            </button>
                        </div>

                        {/* Info */}
                        {mode === 'edit' && (
                            <div className="text-xs text-gray-500 flex items-center gap-2">
                                <MousePointer2 size={12} />
                                Double-cliquez sur un element pour le modifier
                            </div>
                        )}

                        {/* Zoom Controls */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleZoomOut}
                                disabled={zoom <= 50}
                                className={cn(
                                    "p-1.5 border-2 border-black transition-colors",
                                    zoom <= 50 ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-100"
                                )}
                                title="Zoom arriere"
                            >
                                <ZoomOut size={16} />
                            </button>
                            
                            <span className="text-sm font-bold w-14 text-center">
                                {zoom}%
                            </span>
                            
                            <button
                                onClick={handleZoomIn}
                                disabled={zoom >= 200}
                                className={cn(
                                    "p-1.5 border-2 border-black transition-colors",
                                    zoom >= 200 ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-100"
                                )}
                                title="Zoom avant"
                            >
                                <ZoomIn size={16} />
                            </button>
                            
                            <button
                                onClick={handleResetZoom}
                                className="p-1.5 border-2 border-black hover:bg-gray-100 transition-colors"
                                title="Reinitialiser le zoom"
                            >
                                <RotateCcw size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Preview Area */}
                <div className="flex-1 overflow-auto bg-gray-200 p-6">
                    <div 
                        className="bg-white shadow-2xl mx-auto transition-transform origin-top"
                        style={{ 
                            maxWidth: '210mm',
                            transform: `scale(${zoom / 100})`,
                            transformOrigin: 'top center',
                        }}
                    >
                        <div className={cn(
                            "transition-all",
                            mode === 'edit' && "ring-2 ring-blue-500/20"
                        )}>
                            {children}
                        </div>
                    </div>
                </div>

                {/* Mode indicator */}
                <AnimatePresence>
                    {mode === 'edit' && (
                        <motion.div
                            initial={{ y: 100 }}
                            animate={{ y: 0 }}
                            exit={{ y: 100 }}
                            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
                        >
                            <Edit3 size={14} />
                            <span className="text-sm font-bold">Mode Edition</span>
                            <span className="text-xs opacity-70">| Echap pour quitter</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </InteractiveContext.Provider>
    );
};

export default InteractivePreviewContainer;
