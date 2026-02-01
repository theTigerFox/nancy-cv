// ============================================================================
// NANCY CV - Interests & Hobbies Form
// ============================================================================

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Plus } from 'lucide-react';
import { Interest } from '../../types/cv';
import { useCVStore } from '../../store/cvStore';
import {
    BrutalSelect,
    TipBox,
} from './BrutalUI';
import { cn } from '../../lib/utils';

const INTEREST_CATEGORIES = [
    { value: 'sport', label: '🏃 Sport' },
    { value: 'art', label: '🎨 Art & Créativité' },
    { value: 'music', label: '🎵 Musique' },
    { value: 'travel', label: '✈️ Voyage' },
    { value: 'reading', label: '📚 Lecture' },
    { value: 'tech', label: '💻 Technologie' },
    { value: 'gaming', label: '🎮 Jeux vidéo' },
    { value: 'cooking', label: '🍳 Cuisine' },
    { value: 'nature', label: '🌿 Nature' },
    { value: 'social', label: '👥 Social' },
    { value: 'other', label: '✨ Autre' },
];

const INTEREST_SUGGESTIONS = [
    { name: 'Course à pied', category: 'sport' },
    { name: 'Photographie', category: 'art' },
    { name: 'Guitare', category: 'music' },
    { name: 'Randonnée', category: 'nature' },
    { name: 'Science-fiction', category: 'reading' },
    { name: 'Open source', category: 'tech' },
    { name: 'Échecs', category: 'gaming' },
    { name: 'Cuisine asiatique', category: 'cooking' },
    { name: 'Bénévolat', category: 'social' },
    { name: 'Yoga', category: 'sport' },
    { name: 'Podcasts', category: 'other' },
    { name: 'DIY', category: 'art' },
];

const getCategoryIcon = (category?: string) => {
    const icons: Record<string, string> = {
        sport: '🏃',
        art: '🎨',
        music: '🎵',
        travel: '✈️',
        reading: '📚',
        tech: '💻',
        gaming: '🎮',
        cooking: '🍳',
        nature: '🌿',
        social: '👥',
        other: '✨',
    };
    return icons[category || 'other'] || '✨';
};

const getCategoryColor = (category?: string) => {
    const colors: Record<string, string> = {
        sport: 'bg-blue-100 border-blue-300',
        art: 'bg-purple-100 border-purple-300',
        music: 'bg-pink-100 border-pink-300',
        travel: 'bg-cyan-100 border-cyan-300',
        reading: 'bg-amber-100 border-amber-300',
        tech: 'bg-green-100 border-green-300',
        gaming: 'bg-indigo-100 border-indigo-300',
        cooking: 'bg-orange-100 border-orange-300',
        nature: 'bg-emerald-100 border-emerald-300',
        social: 'bg-rose-100 border-rose-300',
        other: 'bg-gray-100 border-gray-300',
    };
    return colors[category || 'other'] || colors.other;
};

interface InterestItemProps {
    interest: Interest;
    index: number;
}

const InterestItem: React.FC<InterestItemProps> = ({ interest, index }) => {
    const updateInterest = useCVStore((state) => state.updateInterest);
    const removeInterest = useCVStore((state) => state.removeInterest);
    const [isEditing, setIsEditing] = React.useState(!interest.name);
    
    if (!isEditing && interest.name) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.03 }}
                className={cn(
                    "inline-flex items-center gap-2 px-4 py-2 border-2 border-black group cursor-pointer hover:shadow-brutal transition-all",
                    getCategoryColor(interest.category)
                )}
                onClick={() => setIsEditing(true)}
            >
                <span className="text-lg">{getCategoryIcon(interest.category)}</span>
                <span className="font-bold">{interest.name}</span>
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        removeInterest(interest.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-black/10 rounded transition-opacity"
                >
                    <X size={14} />
                </button>
            </motion.div>
        );
    }
    
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 p-2 border-2 border-black bg-white"
        >
            <BrutalSelect
                label=""
                options={INTEREST_CATEGORIES}
                value={interest.category || 'other'}
                onChange={(v) => updateInterest(interest.id, { category: v })}
            />
            <input
                type="text"
                value={interest.name}
                onChange={(e) => updateInterest(interest.id, { name: e.target.value })}
                onBlur={() => interest.name && setIsEditing(false)}
                onKeyDown={(e) => e.key === 'Enter' && interest.name && setIsEditing(false)}
                placeholder="Centre d'intérêt..."
                className="w-40 px-2 py-1 border-2 border-black text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brutal-lime"
                autoFocus
            />
            <button
                type="button"
                onClick={() => removeInterest(interest.id)}
                className="p-1 text-red-500 hover:bg-red-50"
            >
                <X size={16} />
            </button>
        </motion.div>
    );
};

export const InterestsForm: React.FC = () => {
    const interests = useCVStore((state) => state.cv.interests);
    const addInterest = useCVStore((state) => state.addInterest);
    const updateInterest = useCVStore((state) => state.updateInterest);
    
    const quickAddInterest = (suggestion: typeof INTEREST_SUGGESTIONS[0]) => {
        addInterest();
        setTimeout(() => {
            const state = useCVStore.getState();
            const lastInterest = state.cv.interests[state.cv.interests.length - 1];
            if (lastInterest) {
                state.updateInterest(lastInterest.id, {
                    name: suggestion.name,
                    category: suggestion.category,
                });
            }
        }, 0);
    };
    
    const existingNames = interests.map(i => i.name.toLowerCase());
    const availableSuggestions = INTEREST_SUGGESTIONS.filter(
        s => !existingNames.includes(s.name.toLowerCase())
    );
    
    // Group interests by category
    const groupedInterests = interests.reduce((acc, interest) => {
        const category = interest.category || 'other';
        if (!acc[category]) acc[category] = [];
        acc[category].push(interest);
        return acc;
    }, {} as Record<string, Interest[]>);
    
    return (
        <div className="space-y-6">
            <TipBox type="info">
                Les centres d'intérêt humanisent votre CV et peuvent créer des connexions 
                avec les recruteurs. Choisissez ceux qui reflètent votre personnalité.
            </TipBox>
            
            {/* Quick Add Suggestions */}
            {availableSuggestions.length > 0 && (
                <div className="space-y-2">
                    <span className="text-xs font-black uppercase text-gray-500">
                        Suggestions:
                    </span>
                    <div className="flex flex-wrap gap-2">
                        {availableSuggestions.slice(0, 8).map(suggestion => (
                            <button
                                key={suggestion.name}
                                type="button"
                                onClick={() => quickAddInterest(suggestion)}
                                className="px-3 py-1 border-2 border-dashed border-gray-300 text-xs font-bold hover:border-black hover:bg-white transition-all"
                            >
                                {getCategoryIcon(suggestion.category)} {suggestion.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Stats */}
            {interests.length > 0 && (
                <div className="flex gap-2 text-xs flex-wrap">
                    <div className="px-3 py-1 bg-gray-100 border-2 border-gray-200 font-bold">
                        {interests.length} centre{interests.length > 1 ? 's' : ''} d'intérêt
                    </div>
                    {Object.entries(groupedInterests).map(([category, items]) => (
                        <div
                            key={category}
                            className={cn(
                                "px-2 py-1 border-2 font-bold",
                                getCategoryColor(category)
                            )}
                        >
                            {getCategoryIcon(category)} {items.length}
                        </div>
                    ))}
                </div>
            )}
            
            {/* Interests Grid */}
            <div className="flex flex-wrap gap-3">
                <AnimatePresence>
                    {interests.map((interest, index) => (
                        <InterestItem
                            key={interest.id}
                            interest={interest}
                            index={index}
                        />
                    ))}
                </AnimatePresence>
                
                {/* Add Button */}
                <motion.button
                    type="button"
                    onClick={addInterest}
                    className="inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-400 text-gray-500 font-bold hover:border-black hover:text-black hover:bg-brutal-lime/20 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Plus size={18} />
                    Ajouter
                </motion.button>
            </div>
            
            {interests.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    <Sparkles size={48} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Aucun centre d'intérêt ajouté</p>
                    <p className="text-xs mt-1">
                        Partagez vos passions et hobbies
                    </p>
                </div>
            )}
            
            {/* Tips */}
            <div className="p-4 bg-gray-50 border-2 border-gray-200 text-xs space-y-2">
                <div className="font-black uppercase">💡 Conseils</div>
                <ul className="list-disc pl-4 space-y-1 text-gray-600">
                    <li>Évitez les intérêts trop génériques (musique, cinéma)</li>
                    <li>Soyez spécifique (jazz manouche, films de Kubrick)</li>
                    <li>Mentionnez des activités qui montrent des soft skills</li>
                    <li>3-5 centres d'intérêt suffisent généralement</li>
                </ul>
            </div>
        </div>
    );
};
