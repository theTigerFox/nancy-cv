// ============================================================================
// NANCY CV - Custom Sections Form
// ============================================================================

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutGrid, ChevronDown, ChevronUp, X, Eye, EyeOff, 
    GripVertical, Plus, Type
} from 'lucide-react';
import { CustomSection, CustomSectionItem } from '../../types/cv';
import { useCVStore } from '../../store/cvStore';
import {
    BrutalInput,
    BrutalTextarea,
    BrutalAddButton,
    TipBox,
} from './BrutalUI';
import { cn } from '../../lib/utils';

const SECTION_TEMPLATES = [
    { title: 'Publications', icon: '📚' },
    { title: 'Conférences', icon: '🎤' },
    { title: 'Prix et distinctions', icon: '🏆' },
    { title: 'Brevets', icon: '💡' },
    { title: 'Formations complémentaires', icon: '📖' },
    { title: 'Activités extra-professionnelles', icon: '⭐' },
];

interface CustomSectionItemFormProps {
    item: CustomSectionItem;
    sectionId: string;
    index: number;
    onUpdate: (itemId: string, updates: Partial<CustomSectionItem>) => void;
    onRemove: (itemId: string) => void;
}

const CustomSectionItemForm: React.FC<CustomSectionItemFormProps> = ({
    item,
    index,
    onUpdate,
    onRemove,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex items-start gap-2 p-3 bg-gray-50 border-2 border-gray-200"
        >
            <div className="cursor-grab text-gray-400 pt-2">
                <GripVertical size={16} />
            </div>
            <div className="flex-1 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <BrutalInput
                        label="Titre"
                        value={item.title}
                        onChange={(v) => onUpdate(item.id, { title: v })}
                        placeholder="Titre de l'élément"
                    />
                    <BrutalInput
                        label="Sous-titre"
                        value={item.subtitle || ''}
                        onChange={(v) => onUpdate(item.id, { subtitle: v || undefined })}
                        placeholder="Sous-titre (optionnel)"
                    />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <BrutalInput
                        label="Date"
                        value={item.date || ''}
                        onChange={(v) => onUpdate(item.id, { date: v || undefined })}
                        placeholder="2023"
                    />
                    <BrutalInput
                        label="Lieu"
                        value={item.location || ''}
                        onChange={(v) => onUpdate(item.id, { location: v || undefined })}
                        placeholder="Paris, France"
                    />
                </div>
                <BrutalTextarea
                    label="Description"
                    value={item.description || ''}
                    onChange={(v) => onUpdate(item.id, { description: v || undefined })}
                    placeholder="Description détaillée..."
                    rows={2}
                />
                <BrutalInput
                    label="Lien"
                    value={item.url || ''}
                    onChange={(v) => onUpdate(item.id, { url: v || undefined })}
                    placeholder="https://..."
                    type="url"
                />
            </div>
            <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="p-2 text-red-500 hover:bg-red-50 shrink-0"
            >
                <X size={16} />
            </button>
        </motion.div>
    );
};

interface CustomSectionCardProps {
    section: CustomSection;
    index: number;
}

const CustomSectionCard: React.FC<CustomSectionCardProps> = ({ section, index }) => {
    const updateCustomSection = useCVStore((state) => state.updateCustomSection);
    const removeCustomSection = useCVStore((state) => state.removeCustomSection);
    const addCustomSectionItem = useCVStore((state) => state.addCustomSectionItem);
    const updateCustomSectionItem = useCVStore((state) => state.updateCustomSectionItem);
    const removeCustomSectionItem = useCVStore((state) => state.removeCustomSectionItem);
    const [isExpanded, setIsExpanded] = React.useState(true);
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
                "border-3 border-black bg-white overflow-hidden",
                !section.visible && "opacity-60"
            )}
        >
            {/* Header */}
            <div
                className="flex items-center justify-between p-4 bg-gradient-to-r from-brutal-lime/20 to-brutal-yellow/20 cursor-pointer hover:from-brutal-lime/30 hover:to-brutal-yellow/30 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border-2 border-black bg-white flex items-center justify-center text-lg">
                        {section.icon || '📋'}
                    </div>
                    <div>
                        <div className="font-black">
                            {section.title || 'Nouvelle section'}
                        </div>
                        <div className="text-xs text-gray-600">
                            {section.items.length} élément{section.items.length > 1 ? 's' : ''}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            updateCustomSection(section.id, { visible: !section.visible });
                        }}
                        className="p-2 hover:bg-white transition-colors"
                    >
                        {section.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
            </div>
            
            {/* Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 space-y-4 border-t-2 border-black">
                            {/* Section Config */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <BrutalInput
                                    label="Titre de la section"
                                    value={section.title}
                                    onChange={(v) => updateCustomSection(section.id, { title: v })}
                                    placeholder="Publications, Prix..."
                                    icon={Type}
                                    required
                                />
                                <BrutalInput
                                    label="Icône (emoji)"
                                    value={section.icon || ''}
                                    onChange={(v) => updateCustomSection(section.id, { icon: v || undefined })}
                                    placeholder="📚"
                                />
                                <BrutalInput
                                    label="Ordre d'affichage"
                                    value={section.order?.toString() || ''}
                                    onChange={(v) => updateCustomSection(section.id, { order: parseInt(v) || 0 })}
                                    type="number"
                                />
                            </div>
                            
                            {/* Items */}
                            <div className="space-y-3">
                                <div className="text-xs font-black uppercase tracking-wider text-gray-500">
                                    Éléments de la section
                                </div>
                                <AnimatePresence>
                                    {section.items.map((item, itemIndex) => (
                                        <CustomSectionItemForm
                                            key={item.id}
                                            item={item}
                                            sectionId={section.id}
                                            index={itemIndex}
                                            onUpdate={(itemId, updates) => 
                                                updateCustomSectionItem(section.id, itemId, updates)
                                            }
                                            onRemove={(itemId) => 
                                                removeCustomSectionItem(section.id, itemId)
                                            }
                                        />
                                    ))}
                                </AnimatePresence>
                                
                                <button
                                    type="button"
                                    onClick={() => addCustomSectionItem(section.id)}
                                    className="w-full py-2 border-2 border-dashed border-gray-300 text-sm font-bold text-gray-500 hover:border-black hover:text-black transition-colors"
                                >
                                    <Plus size={16} className="inline mr-2" />
                                    Ajouter un élément
                                </button>
                            </div>
                            
                            {/* Delete Section */}
                            <div className="flex justify-end pt-4 border-t-2 border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => removeCustomSection(section.id)}
                                    className="px-4 py-2 border-2 border-red-500 text-red-500 font-bold text-sm hover:bg-red-50"
                                >
                                    Supprimer cette section
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export const CustomSectionsForm: React.FC = () => {
    const customSections = useCVStore((state) => state.cv.customSections);
    const addCustomSection = useCVStore((state) => state.addCustomSection);
    const updateCustomSection = useCVStore((state) => state.updateCustomSection);
    
    const createFromTemplate = (template: typeof SECTION_TEMPLATES[0]) => {
        addCustomSection();
        setTimeout(() => {
            const state = useCVStore.getState();
            const lastSection = state.cv.customSections[state.cv.customSections.length - 1];
            if (lastSection) {
                state.updateCustomSection(lastSection.id, {
                    title: template.title,
                    icon: template.icon,
                });
            }
        }, 0);
    };
    
    const existingTitles = customSections.map(s => s.title.toLowerCase());
    const availableTemplates = SECTION_TEMPLATES.filter(
        t => !existingTitles.includes(t.title.toLowerCase())
    );
    
    return (
        <div className="space-y-6">
            <TipBox type="success">
                Créez des sections personnalisées pour ajouter des informations uniques 
                à votre CV (publications, brevets, prix, etc.).
            </TipBox>
            
            {/* Quick Templates */}
            {availableTemplates.length > 0 && (
                <div className="space-y-2">
                    <span className="text-xs font-black uppercase text-gray-500">
                        Modèles de section:
                    </span>
                    <div className="flex flex-wrap gap-2">
                        {availableTemplates.map(template => (
                            <button
                                key={template.title}
                                type="button"
                                onClick={() => createFromTemplate(template)}
                                className="px-4 py-2 border-2 border-dashed border-gray-300 text-sm font-bold hover:border-black hover:bg-white transition-all"
                            >
                                {template.icon} {template.title}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Custom Sections List */}
            <div className="space-y-4">
                <AnimatePresence>
                    {customSections.map((section, index) => (
                        <CustomSectionCard
                            key={section.id}
                            section={section}
                            index={index}
                        />
                    ))}
                </AnimatePresence>
            </div>
            
            <BrutalAddButton
                label="Créer une section personnalisée"
                onClick={addCustomSection}
            />
            
            {customSections.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    <LayoutGrid size={48} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Aucune section personnalisée</p>
                    <p className="text-xs mt-1">
                        Ajoutez des sections uniques à votre CV
                    </p>
                </div>
            )}
        </div>
    );
};
