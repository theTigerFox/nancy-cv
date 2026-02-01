// ============================================================================
// NANCY CV - Languages Form
// ============================================================================

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Award, X } from 'lucide-react';
import { Language, LanguageLevel, LANGUAGE_LEVELS } from '../../types/cv';
import { useCVStore } from '../../store/cvStore';
import {
    BrutalInput,
    BrutalSelect,
    BrutalAddButton,
    TipBox,
} from './BrutalUI';
import { cn } from '../../lib/utils';

const LANGUAGE_LEVEL_OPTIONS = Object.entries(LANGUAGE_LEVELS).map(([value, label]) => ({
    value,
    label: `${value} - ${label}`,
}));

const COMMON_LANGUAGES = [
    'Français', 'Anglais', 'Espagnol', 'Allemand', 'Italien', 'Portugais',
    'Chinois', 'Japonais', 'Arabe', 'Russe', 'Néerlandais', 'Coréen',
];

interface LanguageItemProps {
    language: Language;
    index: number;
}

const LanguageItem: React.FC<LanguageItemProps> = ({ language, index }) => {
    const updateLanguage = useCVStore((state) => state.updateLanguage);
    const removeLanguage = useCVStore((state) => state.removeLanguage);
    
    // Convert numeric level to CECRL level if needed
    const normalizedLevel = (typeof language.level === 'number' 
        ? (['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'native'] as const)[Math.min(language.level - 1, 6)] || 'B1'
        : language.level) as LanguageLevel;
    
    const getLevelColor = (level: LanguageLevel) => {
        const colors: Record<LanguageLevel, string> = {
            A1: 'bg-red-100 border-red-300',
            A2: 'bg-orange-100 border-orange-300',
            B1: 'bg-yellow-100 border-yellow-300',
            B2: 'bg-lime-100 border-lime-300',
            C1: 'bg-green-100 border-green-300',
            C2: 'bg-emerald-100 border-emerald-300',
            native: 'bg-brutal-lime border-brutal-lime',
        };
        return colors[level];
    };
    
    const getLevelProgress = (level: LanguageLevel) => {
        const progress: Record<LanguageLevel, number> = {
            A1: 15, A2: 30, B1: 45, B2: 60, C1: 80, C2: 95, native: 100,
        };
        return progress[level];
    };
    
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
                "border-3 border-black bg-white p-4 group hover:shadow-brutal transition-all",
                !language.visible && "opacity-50"
            )}
        >
            <div className="flex items-start gap-4">
                {/* Language Info */}
                <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <BrutalInput
                            label="Langue"
                            value={language.name}
                            onChange={(v) => updateLanguage(language.id, { name: v })}
                            placeholder="Anglais, Espagnol..."
                            icon={Globe}
                        />
                        <BrutalSelect
                            label="Niveau (CECRL)"
                            options={LANGUAGE_LEVEL_OPTIONS}
                            value={normalizedLevel}
                            onChange={(v) => updateLanguage(language.id, { level: v as LanguageLevel })}
                        />
                    </div>
                    
                    {/* Level Visualization */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                            <span className="font-bold uppercase">
                                {LANGUAGE_LEVELS[normalizedLevel]}
                            </span>
                            <span className="text-gray-500">
                                {getLevelProgress(normalizedLevel)}%
                            </span>
                        </div>
                        <div className="h-3 bg-gray-100 border-2 border-black relative overflow-hidden">
                            <motion.div
                                className={cn("h-full", getLevelColor(normalizedLevel))}
                                initial={{ width: 0 }}
                                animate={{ width: `${getLevelProgress(normalizedLevel)}%` }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                            />
                        </div>
                    </div>
                    
                    {/* Certification */}
                    <div className="grid grid-cols-2 gap-4">
                        <BrutalInput
                            label="Certification"
                            value={language.certification || ''}
                            onChange={(v) => updateLanguage(language.id, { certification: v || undefined })}
                            placeholder="TOEFL, DELF, JLPT..."
                            icon={Award}
                        />
                        <BrutalInput
                            label="Score"
                            value={language.certificationScore || ''}
                            onChange={(v) => updateLanguage(language.id, { certificationScore: v || undefined })}
                            placeholder="945/990, C1..."
                        />
                    </div>
                </div>
                
                {/* Actions */}
                <div className="flex flex-col gap-2">
                    <button
                        type="button"
                        onClick={() => updateLanguage(language.id, { visible: !language.visible })}
                        className={cn(
                            "p-2 border-2 border-black transition-colors",
                            language.visible ? "bg-black text-white" : "bg-white hover:bg-gray-100"
                        )}
                        title={language.visible ? "Masquer" : "Afficher"}
                    >
                        {language.visible ? "Visible" : "Masqué"}
                    </button>
                    <button
                        type="button"
                        onClick={() => removeLanguage(language.id)}
                        className="p-2 border-2 border-black text-red-500 hover:bg-red-50 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export const LanguagesForm: React.FC = () => {
    const languages = useCVStore((state) => state.cv.languages);
    const addLanguage = useCVStore((state) => state.addLanguage);
    
    const quickAddLanguage = (name: string) => {
        addLanguage();
        setTimeout(() => {
            const state = useCVStore.getState();
            const lastLang = state.cv.languages[state.cv.languages.length - 1];
            if (lastLang) {
                state.updateLanguage(lastLang.id, { name });
            }
        }, 0);
    };
    
    const existingLanguages = languages.map(l => l.name.toLowerCase());
    const suggestedLanguages = COMMON_LANGUAGES.filter(
        l => !existingLanguages.includes(l.toLowerCase())
    );
    
    return (
        <div className="space-y-6">
            <TipBox type="info">
                Utilisez le Cadre Européen Commun de Référence (CECRL) pour indiquer votre niveau.
                Ajoutez vos certifications pour crédibiliser votre niveau.
            </TipBox>
            
            {/* Quick Add */}
            {suggestedLanguages.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    <span className="text-xs font-black uppercase text-gray-500 py-1">
                        Ajouter rapidement:
                    </span>
                    {suggestedLanguages.slice(0, 6).map(lang => (
                        <button
                            key={lang}
                            type="button"
                            onClick={() => quickAddLanguage(lang)}
                            className="px-3 py-1 border-2 border-dashed border-gray-300 text-xs font-bold hover:border-black hover:bg-white transition-all"
                        >
                            + {lang}
                        </button>
                    ))}
                </div>
            )}
            
            {/* Languages List */}
            <div className="space-y-4">
                <AnimatePresence>
                    {languages.map((language, index) => (
                        <LanguageItem
                            key={language.id}
                            language={language}
                            index={index}
                        />
                    ))}
                </AnimatePresence>
            </div>
            
            <BrutalAddButton
                label="Ajouter une langue"
                onClick={addLanguage}
            />
            
            {/* CECRL Reference */}
            <div className="p-4 bg-gray-50 border-2 border-gray-200 text-xs">
                <div className="font-black uppercase mb-2">Référence CECRL</div>
                <div className="grid grid-cols-2 gap-2 text-gray-600">
                    <div><strong>A1-A2:</strong> Niveau élémentaire</div>
                    <div><strong>B1-B2:</strong> Niveau indépendant</div>
                    <div><strong>C1-C2:</strong> Niveau expérimenté</div>
                    <div><strong>Natif:</strong> Langue maternelle</div>
                </div>
            </div>
        </div>
    );
};
