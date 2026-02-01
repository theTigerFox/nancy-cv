// ============================================================================
// NANCY CV - Volunteer / Bénévolat Form
// ============================================================================

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Building, Calendar, MapPin, ChevronDown, ChevronUp, X, Eye, EyeOff } from 'lucide-react';
import { Volunteer } from '../../types/cv';
import { useCVStore } from '../../store/cvStore';
import {
    BrutalInput,
    BrutalTextarea,
    BrutalCheckbox,
    BrutalAddButton,
    TipBox,
} from './BrutalUI';
import { cn } from '../../lib/utils';

interface VolunteerItemProps {
    volunteer: Volunteer;
    index: number;
}

const VolunteerItem: React.FC<VolunteerItemProps> = ({ volunteer, index }) => {
    const updateVolunteer = useCVStore((state) => state.updateVolunteer);
    const removeVolunteer = useCVStore((state) => state.removeVolunteer);
    const [isExpanded, setIsExpanded] = React.useState(true);
    
    const addHighlight = () => {
        const highlights = [...(volunteer.highlights || []), ''];
        updateVolunteer(volunteer.id, { highlights });
    };
    
    const updateHighlight = (hIndex: number, value: string) => {
        const highlights = [...(volunteer.highlights || [])];
        highlights[hIndex] = value;
        updateVolunteer(volunteer.id, { highlights });
    };
    
    const removeHighlight = (hIndex: number) => {
        const highlights = (volunteer.highlights || []).filter((_, i) => i !== hIndex);
        updateVolunteer(volunteer.id, { highlights });
    };
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
                "border-3 border-black bg-white overflow-hidden",
                !volunteer.visible && "opacity-60"
            )}
        >
            {/* Header */}
            <div
                className="flex items-center justify-between p-4 bg-brutal-pink/10 cursor-pointer hover:bg-brutal-pink/20 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border-2 border-black bg-white flex items-center justify-center">
                        <Heart size={20} className="text-red-500" />
                    </div>
                    <div>
                        <div className="font-black">
                            {volunteer.role || 'Nouveau bénévolat'}
                        </div>
                        <div className="text-xs text-gray-600">
                            {volunteer.organization || 'Organisation...'}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            updateVolunteer(volunteer.id, { visible: !volunteer.visible });
                        }}
                        className="p-2 hover:bg-white transition-colors"
                    >
                        {volunteer.visible ? <Eye size={16} /> : <EyeOff size={16} />}
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <BrutalInput
                                    label="Rôle / Mission"
                                    value={volunteer.role}
                                    onChange={(v) => updateVolunteer(volunteer.id, { role: v })}
                                    placeholder="Bénévole, Coordinateur..."
                                    required
                                />
                                <BrutalInput
                                    label="Organisation"
                                    value={volunteer.organization}
                                    onChange={(v) => updateVolunteer(volunteer.id, { organization: v })}
                                    placeholder="Croix-Rouge, Association..."
                                    icon={Building}
                                    required
                                />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <BrutalInput
                                    label="Lieu"
                                    value={volunteer.location || ''}
                                    onChange={(v) => updateVolunteer(volunteer.id, { location: v || undefined })}
                                    placeholder="Paris, France"
                                    icon={MapPin}
                                />
                                <BrutalInput
                                    label="Date de début"
                                    value={volunteer.startDate}
                                    onChange={(v) => updateVolunteer(volunteer.id, { startDate: v })}
                                    type="month"
                                    icon={Calendar}
                                />
                                <BrutalInput
                                    label="Date de fin"
                                    value={volunteer.endDate || ''}
                                    onChange={(v) => updateVolunteer(volunteer.id, { endDate: v || undefined })}
                                    type="month"
                                    disabled={volunteer.current}
                                />
                            </div>
                            
                            <BrutalCheckbox
                                label="Engagement en cours"
                                checked={volunteer.current || false}
                                onChange={(v) => updateVolunteer(volunteer.id, { 
                                    current: v, 
                                    endDate: v ? undefined : volunteer.endDate 
                                })}
                            />
                            
                            <BrutalTextarea
                                label="Description"
                                value={volunteer.description || ''}
                                onChange={(v) => updateVolunteer(volunteer.id, { description: v || undefined })}
                                placeholder="Décrivez votre engagement et vos contributions..."
                                rows={3}
                            />
                            
                            {/* Highlights */}
                            <div className="space-y-3">
                                <label className="block text-xs font-black uppercase tracking-wider">
                                    Réalisations clés
                                </label>
                                <AnimatePresence>
                                    {volunteer.highlights?.map((highlight, hIndex) => (
                                        <motion.div
                                            key={hIndex}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center gap-2"
                                        >
                                            <Heart size={12} className="text-red-400 shrink-0" />
                                            <input
                                                type="text"
                                                value={highlight}
                                                onChange={(e) => updateHighlight(hIndex, e.target.value)}
                                                placeholder="Une réalisation..."
                                                className="flex-1 px-3 py-2 border-2 border-black text-sm focus:outline-none focus:ring-2 focus:ring-brutal-pink"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeHighlight(hIndex)}
                                                className="p-2 text-red-500 hover:bg-red-50"
                                            >
                                                <X size={16} />
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                <button
                                    type="button"
                                    onClick={addHighlight}
                                    className="w-full py-2 border-2 border-dashed border-gray-300 text-sm font-bold text-gray-500 hover:border-black hover:text-black transition-colors"
                                >
                                    + Ajouter une réalisation
                                </button>
                            </div>
                            
                            {/* Delete */}
                            <div className="flex justify-end pt-4 border-t-2 border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => removeVolunteer(volunteer.id)}
                                    className="px-4 py-2 border-2 border-red-500 text-red-500 font-bold text-sm hover:bg-red-50"
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export const VolunteerForm: React.FC = () => {
    const volunteer = useCVStore((state) => state.cv.volunteer);
    const addVolunteer = useCVStore((state) => state.addVolunteer);
    
    return (
        <div className="space-y-6">
            <TipBox type="success">
                Le bénévolat montre votre engagement social et vos soft skills.
                Particulièrement valorisé pour les postes en contact avec le public.
            </TipBox>
            
            {/* Stats */}
            {volunteer.length > 0 && (
                <div className="flex gap-4 text-xs">
                    <div className="px-3 py-1 bg-brutal-pink/20 border-2 border-brutal-pink font-bold">
                        {volunteer.length} engagement{volunteer.length > 1 ? 's' : ''}
                    </div>
                </div>
            )}
            
            {/* Volunteer List */}
            <div className="space-y-4">
                <AnimatePresence>
                    {volunteer.map((vol, index) => (
                        <VolunteerItem
                            key={vol.id}
                            volunteer={vol}
                            index={index}
                        />
                    ))}
                </AnimatePresence>
            </div>
            
            <BrutalAddButton
                label="Ajouter un engagement bénévole"
                onClick={addVolunteer}
            />
            
            {volunteer.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    <Heart size={48} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Aucun bénévolat ajouté</p>
                    <p className="text-xs mt-1">
                        Valorisez vos engagements associatifs et solidaires
                    </p>
                </div>
            )}
        </div>
    );
};
