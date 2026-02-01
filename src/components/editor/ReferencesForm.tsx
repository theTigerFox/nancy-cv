// ============================================================================
// NANCY CV - References Form
// ============================================================================

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, Mail, Phone, Building, Briefcase, ChevronDown, ChevronUp, Eye, EyeOff, Lock } from 'lucide-react';
import { Reference } from '../../types/cv';
import { useCVStore } from '../../store/cvStore';
import {
    BrutalInput,
    BrutalToggle,
    BrutalAddButton,
    TipBox,
} from './BrutalUI';
import { cn } from '../../lib/utils';

interface ReferenceItemProps {
    reference: Reference;
    index: number;
}

const ReferenceItem: React.FC<ReferenceItemProps> = ({ reference, index }) => {
    const updateReference = useCVStore((state) => state.updateReference);
    const removeReference = useCVStore((state) => state.removeReference);
    const [isExpanded, setIsExpanded] = React.useState(true);
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
                "border-3 border-black bg-white overflow-hidden",
                !reference.visible && "opacity-60"
            )}
        >
            {/* Header */}
            <div
                className="flex items-center justify-between p-4 bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border-2 border-black bg-white flex items-center justify-center">
                        <UserCheck size={20} />
                    </div>
                    <div>
                        <div className="font-black flex items-center gap-2">
                            {reference.name || 'Nouvelle référence'}
                            {reference.hideContact && (
                                <span title="Coordonnées masquées">
                                    <Lock size={14} className="text-gray-400" />
                                </span>
                            )}
                        </div>
                        <div className="text-xs text-gray-600">
                            {reference.position && reference.company 
                                ? `${reference.position} @ ${reference.company}`
                                : 'Position & Entreprise...'
                            }
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            updateReference(reference.id, { visible: !reference.visible });
                        }}
                        className="p-2 hover:bg-white transition-colors"
                    >
                        {reference.visible ? <Eye size={16} /> : <EyeOff size={16} />}
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
                            {/* Name */}
                            <BrutalInput
                                label="Nom complet"
                                value={reference.name}
                                onChange={(v) => updateReference(reference.id, { name: v })}
                                placeholder="Jean Dupont"
                                icon={UserCheck}
                                required
                            />
                            
                            {/* Position & Company */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <BrutalInput
                                    label="Poste"
                                    value={reference.position || ''}
                                    onChange={(v) => updateReference(reference.id, { position: v || undefined })}
                                    placeholder="Directeur Technique"
                                    icon={Briefcase}
                                />
                                <BrutalInput
                                    label="Entreprise"
                                    value={reference.company || ''}
                                    onChange={(v) => updateReference(reference.id, { company: v || undefined })}
                                    placeholder="Acme Corp"
                                    icon={Building}
                                />
                            </div>
                            
                            {/* Relationship */}
                            <BrutalInput
                                label="Relation professionnelle"
                                value={reference.relationship || ''}
                                onChange={(v) => updateReference(reference.id, { relationship: v || undefined })}
                                placeholder="Manager direct pendant 2 ans"
                            />
                            
                            {/* Contact Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <BrutalInput
                                    label="Email"
                                    value={reference.email || ''}
                                    onChange={(v) => updateReference(reference.id, { email: v || undefined })}
                                    placeholder="jean.dupont@example.com"
                                    icon={Mail}
                                    type="email"
                                />
                                <BrutalInput
                                    label="Téléphone"
                                    value={reference.phone || ''}
                                    onChange={(v) => updateReference(reference.id, { phone: v || undefined })}
                                    placeholder="+33 6 12 34 56 78"
                                    icon={Phone}
                                    type="tel"
                                />
                            </div>
                            
                            {/* Hide Contact Option */}
                            <div className="p-3 bg-gray-50 border-2 border-gray-200">
                                <BrutalToggle
                                    label="Masquer les coordonnées sur le CV"
                                    description="Affichera 'Coordonnées sur demande' au lieu des informations de contact"
                                    checked={reference.hideContact || false}
                                    onChange={(v) => updateReference(reference.id, { hideContact: v })}
                                />
                            </div>
                            
                            {/* Delete */}
                            <div className="flex justify-end pt-4 border-t-2 border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => removeReference(reference.id)}
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

export const ReferencesForm: React.FC = () => {
    const references = useCVStore((state) => state.cv.references);
    const addReference = useCVStore((state) => state.addReference);
    
    return (
        <div className="space-y-6">
            <TipBox type="warning">
                Demandez toujours l'autorisation avant d'inclure quelqu'un comme référence.
                Prévenez-les qu'ils pourraient être contactés.
            </TipBox>
            
            {/* Stats */}
            {references.length > 0 && (
                <div className="flex gap-4 text-xs">
                    <div className="px-3 py-1 bg-gray-100 border-2 border-gray-200 font-bold">
                        {references.length} référence{references.length > 1 ? 's' : ''}
                    </div>
                    <div className="px-3 py-1 bg-green-100 border-2 border-green-300 font-bold">
                        {references.filter(r => r.visible).length} visible{references.filter(r => r.visible).length > 1 ? 's' : ''}
                    </div>
                </div>
            )}
            
            {/* References List */}
            <div className="space-y-4">
                <AnimatePresence>
                    {references.map((reference, index) => (
                        <ReferenceItem
                            key={reference.id}
                            reference={reference}
                            index={index}
                        />
                    ))}
                </AnimatePresence>
            </div>
            
            <BrutalAddButton
                label="Ajouter une référence"
                onClick={addReference}
            />
            
            {references.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    <UserCheck size={48} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Aucune référence ajoutée</p>
                    <p className="text-xs mt-1">
                        Ajoutez des personnes pouvant témoigner de vos compétences
                    </p>
                </div>
            )}
            
            {/* Alternative: References on Request */}
            <div className="p-4 bg-brutal-blue/10 border-2 border-brutal-blue">
                <div className="font-bold text-sm mb-2">💡 Alternative</div>
                <p className="text-xs text-gray-600">
                    Vous pouvez aussi simplement mentionner "Références disponibles sur demande" 
                    dans votre CV si vous préférez ne pas divulguer ces informations.
                </p>
            </div>
        </div>
    );
};
