// ============================================================================
// NANCY CV - Font Picker Component with Search
// ============================================================================

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Check, ChevronDown, X } from 'lucide-react';
import { cn } from '../../lib/utils';

// Liste complète de polices Google Fonts populaires
export const GOOGLE_FONTS = [
    // Sans-serif modernes
    { name: 'Inter', category: 'sans-serif', style: 'modern' },
    { name: 'Roboto', category: 'sans-serif', style: 'modern' },
    { name: 'Open Sans', category: 'sans-serif', style: 'modern' },
    { name: 'Lato', category: 'sans-serif', style: 'modern' },
    { name: 'Montserrat', category: 'sans-serif', style: 'modern' },
    { name: 'Poppins', category: 'sans-serif', style: 'modern' },
    { name: 'Nunito', category: 'sans-serif', style: 'modern' },
    { name: 'Nunito Sans', category: 'sans-serif', style: 'modern' },
    { name: 'Work Sans', category: 'sans-serif', style: 'modern' },
    { name: 'DM Sans', category: 'sans-serif', style: 'modern' },
    { name: 'Plus Jakarta Sans', category: 'sans-serif', style: 'modern' },
    { name: 'Manrope', category: 'sans-serif', style: 'modern' },
    { name: 'Outfit', category: 'sans-serif', style: 'modern' },
    { name: 'Sora', category: 'sans-serif', style: 'modern' },
    { name: 'Figtree', category: 'sans-serif', style: 'modern' },
    
    // Sans-serif classiques
    { name: 'Source Sans Pro', category: 'sans-serif', style: 'classic' },
    { name: 'Raleway', category: 'sans-serif', style: 'classic' },
    { name: 'Ubuntu', category: 'sans-serif', style: 'classic' },
    { name: 'Noto Sans', category: 'sans-serif', style: 'classic' },
    { name: 'Rubik', category: 'sans-serif', style: 'classic' },
    { name: 'Karla', category: 'sans-serif', style: 'classic' },
    { name: 'Barlow', category: 'sans-serif', style: 'classic' },
    { name: 'Mulish', category: 'sans-serif', style: 'classic' },
    { name: 'Quicksand', category: 'sans-serif', style: 'classic' },
    { name: 'Josefin Sans', category: 'sans-serif', style: 'classic' },
    
    // Sans-serif tech/géométriques
    { name: 'Space Grotesk', category: 'sans-serif', style: 'tech' },
    { name: 'IBM Plex Sans', category: 'sans-serif', style: 'tech' },
    { name: 'Fira Sans', category: 'sans-serif', style: 'tech' },
    { name: 'Exo 2', category: 'sans-serif', style: 'tech' },
    { name: 'Titillium Web', category: 'sans-serif', style: 'tech' },
    { name: 'Overpass', category: 'sans-serif', style: 'tech' },
    { name: 'Red Hat Display', category: 'sans-serif', style: 'tech' },
    { name: 'Lexend', category: 'sans-serif', style: 'tech' },
    { name: 'Albert Sans', category: 'sans-serif', style: 'tech' },
    { name: 'Urbanist', category: 'sans-serif', style: 'tech' },
    
    // Serif classiques
    { name: 'Playfair Display', category: 'serif', style: 'elegant' },
    { name: 'Merriweather', category: 'serif', style: 'elegant' },
    { name: 'Lora', category: 'serif', style: 'elegant' },
    { name: 'PT Serif', category: 'serif', style: 'elegant' },
    { name: 'Source Serif Pro', category: 'serif', style: 'elegant' },
    { name: 'Libre Baskerville', category: 'serif', style: 'elegant' },
    { name: 'Crimson Text', category: 'serif', style: 'elegant' },
    { name: 'Noto Serif', category: 'serif', style: 'elegant' },
    { name: 'EB Garamond', category: 'serif', style: 'elegant' },
    { name: 'Cormorant Garamond', category: 'serif', style: 'elegant' },
    
    // Serif modernes
    { name: 'Bitter', category: 'serif', style: 'modern' },
    { name: 'Arvo', category: 'serif', style: 'modern' },
    { name: 'Rokkitt', category: 'serif', style: 'modern' },
    { name: 'Zilla Slab', category: 'serif', style: 'modern' },
    { name: 'Spectral', category: 'serif', style: 'modern' },
    { name: 'Cardo', category: 'serif', style: 'modern' },
    { name: 'IBM Plex Serif', category: 'serif', style: 'modern' },
    { name: 'DM Serif Display', category: 'serif', style: 'modern' },
    { name: 'Fraunces', category: 'serif', style: 'modern' },
    
    // Display/Titres
    { name: 'Abril Fatface', category: 'display', style: 'creative' },
    { name: 'Bebas Neue', category: 'display', style: 'creative' },
    { name: 'Anton', category: 'display', style: 'creative' },
    { name: 'Oswald', category: 'display', style: 'creative' },
    { name: 'Archivo Black', category: 'display', style: 'creative' },
    { name: 'Righteous', category: 'display', style: 'creative' },
    { name: 'Passion One', category: 'display', style: 'creative' },
    { name: 'Fjalla One', category: 'display', style: 'creative' },
    { name: 'Alfa Slab One', category: 'display', style: 'creative' },
    { name: 'Black Ops One', category: 'display', style: 'creative' },
    
    // Monospace
    { name: 'JetBrains Mono', category: 'monospace', style: 'tech' },
    { name: 'Fira Code', category: 'monospace', style: 'tech' },
    { name: 'Source Code Pro', category: 'monospace', style: 'tech' },
    { name: 'IBM Plex Mono', category: 'monospace', style: 'tech' },
    { name: 'Roboto Mono', category: 'monospace', style: 'tech' },
    { name: 'Space Mono', category: 'monospace', style: 'tech' },
    
    // Handwriting/Script
    { name: 'Dancing Script', category: 'handwriting', style: 'creative' },
    { name: 'Pacifico', category: 'handwriting', style: 'creative' },
    { name: 'Caveat', category: 'handwriting', style: 'creative' },
    { name: 'Satisfy', category: 'handwriting', style: 'creative' },
    { name: 'Kalam', category: 'handwriting', style: 'creative' },
];

// Charger une police Google Fonts dynamiquement
export const loadGoogleFont = (fontName: string) => {
    const link = document.getElementById(`font-${fontName.replace(/\s+/g, '-')}`);
    if (!link) {
        const newLink = document.createElement('link');
        newLink.id = `font-${fontName.replace(/\s+/g, '-')}`;
        newLink.rel = 'stylesheet';
        newLink.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@400;500;600;700&display=swap`;
        document.head.appendChild(newLink);
    }
};

// Charger plusieurs polices
export const loadGoogleFonts = (fontNames: string[]) => {
    fontNames.forEach(loadGoogleFont);
};

interface FontPickerProps {
    value: string;
    onChange: (font: string) => void;
    label?: string;
    placeholder?: string;
    className?: string;
}

export const FontPicker: React.FC<FontPickerProps> = ({
    value,
    onChange,
    label,
    placeholder = 'Choisir une police...',
    className,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Charger la police sélectionnée
    useEffect(() => {
        if (value) {
            const fontName = value.replace(/['"]/g, '').split(',')[0].trim();
            loadGoogleFont(fontName);
        }
    }, [value]);

    // Fermer quand on clique en dehors
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filtrer les polices
    const filteredFonts = useMemo(() => {
        return GOOGLE_FONTS.filter(font => {
            const matchesSearch = font.name.toLowerCase().includes(search.toLowerCase()) ||
                font.category.toLowerCase().includes(search.toLowerCase()) ||
                font.style.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = !selectedCategory || font.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [search, selectedCategory]);

    // Grouper par catégorie
    const groupedFonts = useMemo(() => {
        const groups: Record<string, typeof GOOGLE_FONTS> = {};
        filteredFonts.forEach(font => {
            if (!groups[font.category]) {
                groups[font.category] = [];
            }
            groups[font.category].push(font);
        });
        return groups;
    }, [filteredFonts]);

    const categories = ['sans-serif', 'serif', 'display', 'monospace', 'handwriting'];
    const categoryLabels: Record<string, string> = {
        'sans-serif': 'Sans-Serif',
        'serif': 'Serif',
        'display': 'Display',
        'monospace': 'Monospace',
        'handwriting': 'Manuscrit',
    };

    const currentFontName = value?.replace(/['"]/g, '').split(',')[0].trim() || '';

    const handleSelectFont = (fontName: string) => {
        loadGoogleFont(fontName);
        onChange(`'${fontName}', ${GOOGLE_FONTS.find(f => f.name === fontName)?.category || 'sans-serif'}`);
        setIsOpen(false);
        setSearch('');
    };

    return (
        <div ref={containerRef} className={cn("relative", className)}>
            {label && (
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                    {label}
                </label>
            )}
            
            <button
                onClick={() => {
                    setIsOpen(!isOpen);
                    setTimeout(() => inputRef.current?.focus(), 100);
                }}
                className={cn(
                    "w-full px-3 py-2.5 border-2 border-black text-left flex items-center justify-between gap-2 hover:bg-gray-50 transition-colors",
                    isOpen && "ring-2 ring-brutal-lime"
                )}
            >
                <span 
                    className="truncate font-medium"
                    style={{ fontFamily: value || 'inherit' }}
                >
                    {currentFontName || placeholder}
                </span>
                <ChevronDown 
                    size={16} 
                    className={cn("shrink-0 transition-transform", isOpen && "rotate-180")}
                />
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-1 w-full bg-white border-2 border-black shadow-brutal max-h-96 overflow-hidden flex flex-col">
                    {/* Search */}
                    <div className="p-2 border-b-2 border-black bg-gray-50">
                        <div className="relative">
                            <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Rechercher une police..."
                                className="w-full pl-7 pr-8 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-brutal-blue"
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch('')}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div className="flex gap-1 p-2 border-b border-gray-200 overflow-x-auto">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={cn(
                                "px-2 py-1 text-[10px] font-bold uppercase border border-black whitespace-nowrap",
                                !selectedCategory ? "bg-black text-white" : "bg-white hover:bg-gray-100"
                            )}
                        >
                            Toutes
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                                className={cn(
                                    "px-2 py-1 text-[10px] font-bold uppercase border border-black whitespace-nowrap",
                                    selectedCategory === cat ? "bg-black text-white" : "bg-white hover:bg-gray-100"
                                )}
                            >
                                {categoryLabels[cat]}
                            </button>
                        ))}
                    </div>

                    {/* Font List */}
                    <div className="flex-1 overflow-y-auto">
                        {Object.entries(groupedFonts).map(([category, fonts]) => (
                            <div key={category}>
                                <div className="px-3 py-1.5 bg-gray-100 text-[10px] font-bold uppercase text-gray-500 sticky top-0">
                                    {categoryLabels[category]} ({fonts.length})
                                </div>
                                {fonts.map(font => {
                                    // Charger la police pour l'afficher dans la liste
                                    loadGoogleFont(font.name);
                                    const isSelected = currentFontName === font.name;
                                    
                                    return (
                                        <button
                                            key={font.name}
                                            onClick={() => handleSelectFont(font.name)}
                                            className={cn(
                                                "w-full px-3 py-2 text-left flex items-center justify-between hover:bg-brutal-lime/20 transition-colors",
                                                isSelected && "bg-brutal-lime"
                                            )}
                                        >
                                            <div>
                                                <span 
                                                    className="block text-base"
                                                    style={{ fontFamily: `'${font.name}', ${font.category}` }}
                                                >
                                                    {font.name}
                                                </span>
                                                <span className="text-[10px] text-gray-400">
                                                    {font.style}
                                                </span>
                                            </div>
                                            {isSelected && <Check size={16} className="text-black" />}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                        
                        {filteredFonts.length === 0 && (
                            <div className="p-4 text-center text-gray-400 text-sm">
                                Aucune police trouvée
                            </div>
                        )}
                    </div>

                    {/* Font count */}
                    <div className="px-3 py-2 border-t border-gray-200 bg-gray-50 text-[10px] text-gray-400">
                        {filteredFonts.length} police{filteredFonts.length > 1 ? 's' : ''} disponible{filteredFonts.length > 1 ? 's' : ''}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FontPicker;
