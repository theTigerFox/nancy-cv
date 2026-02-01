// ============================================================================
// NANCY CV - Experience Form
// ============================================================================

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Briefcase, Building2, MapPin, Plus, X
} from 'lucide-react';
import { Experience } from '../../types/cv';
import { useCVStore } from '../../store/cvStore';
import {
    BrutalInput,
    BrutalTextarea,
    BrutalSelect,
    BrutalDateInput,
    BrutalTagInput,
    BrutalCard,
    BrutalAddButton,
    TipBox,
} from './BrutalUI';

const CONTRACT_TYPES = [
    { value: 'cdi', label: 'CDI' },
    { value: 'cdd', label: 'CDD' },
    { value: 'freelance', label: 'Freelance / Indépendant' },
    { value: 'internship', label: 'Stage' },
    { value: 'apprenticeship', label: 'Alternance' },
    { value: 'volunteer', label: 'Bénévolat' },
    { value: 'other', label: 'Autre' },
];

const REMOTE_OPTIONS = [
    { value: 'onsite', label: 'Sur site' },
    { value: 'remote', label: 'Télétravail' },
    { value: 'hybrid', label: 'Hybride' },
];

const TECH_SUGGESTIONS = [
    'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Node.js',
    'Python', 'Java', 'C#', '.NET', 'PHP', 'Ruby', 'Go', 'Rust',
    'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis',
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
    'Git', 'CI/CD', 'Agile', 'Scrum',
    'Figma', 'Adobe XD', 'Photoshop', 'Illustrator',
];

interface ExperienceItemProps {
    experience: Experience;
    index: number;
}

const ExperienceItem: React.FC<ExperienceItemProps> = ({ experience, index }) => {
    const updateExperience = useCVStore((state) => state.updateExperience);
    const removeExperience = useCVStore((state) => state.removeExperience);
    const addExperienceHighlight = useCVStore((state) => state.addExperienceHighlight);
    const updateExperienceHighlight = useCVStore((state) => state.updateExperienceHighlight);
    const removeExperienceHighlight = useCVStore((state) => state.removeExperienceHighlight);
    
    const update = (data: Partial<Experience>) => {
        updateExperience(experience.id, data);
    };
    
    return (
        <BrutalCard
            title={experience.title || 'Nouvelle expérience'}
            subtitle={experience.company}
            index={index}
            onRemove={() => removeExperience(experience.id)}
            onToggleVisibility={() => update({ visible: !experience.visible })}
            isVisible={experience.visible}
            color="bg-brutal-pink"
        >
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
                <BrutalInput
                    label="Poste / Titre"
                    value={experience.title}
                    onChange={(v) => update({ title: v })}
                    placeholder="Développeur Full Stack"
                    icon={Briefcase}
                    required
                />
                <BrutalInput
                    label="Entreprise"
                    value={experience.company}
                    onChange={(v) => update({ company: v })}
                    placeholder="TechCorp Inc."
                    icon={Building2}
                    required
                />
            </div>
            
            {/* Location & Type */}
            <div className="grid grid-cols-3 gap-4">
                <BrutalInput
                    label="Lieu"
                    value={experience.location}
                    onChange={(v) => update({ location: v })}
                    placeholder="Paris, France"
                    icon={MapPin}
                />
                <BrutalSelect
                    label="Type de contrat"
                    options={CONTRACT_TYPES}
                    value={experience.contractType || 'cdi'}
                    onChange={(v) => update({ contractType: v as Experience['contractType'] })}
                />
                <BrutalSelect
                    label="Mode de travail"
                    options={REMOTE_OPTIONS}
                    value={experience.remote || 'onsite'}
                    onChange={(v) => update({ remote: v as Experience['remote'] })}
                />
            </div>
            
            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
                <BrutalDateInput
                    label="Date de début"
                    value={experience.startDate}
                    onChange={(v) => update({ startDate: v })}
                    required
                />
                <BrutalDateInput
                    label="Date de fin"
                    value={experience.endDate || ''}
                    onChange={(v) => update({ endDate: v })}
                    isCurrent={experience.current}
                    onCurrentChange={(c) => update({ current: c, endDate: c ? '' : experience.endDate })}
                    showCurrentOption
                    currentLabel="Poste actuel"
                />
            </div>
            
            {/* Description */}
            <BrutalTextarea
                label="Description"
                value={experience.description || ''}
                onChange={(v) => update({ description: v })}
                placeholder="Décrivez brièvement votre rôle et vos responsabilités..."
                rows={3}
            />
            
            {/* Highlights / Achievements */}
            <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-wider flex items-center justify-between">
                    Réalisations clés
                    <span className="text-gray-400 font-normal text-[10px]">
                        Commencez par un verbe d'action
                    </span>
                </label>
                <AnimatePresence>
                    {(experience.highlights || []).map((highlight, hIndex) => (
                        <motion.div
                            key={hIndex}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="flex items-center gap-2"
                        >
                            <span className="text-brutal-pink font-black">•</span>
                            <input
                                type="text"
                                value={highlight}
                                onChange={(e) => updateExperienceHighlight(experience.id, hIndex, e.target.value)}
                                placeholder="Augmenté les ventes de 25%..."
                                className="flex-1 px-3 py-2 border-2 border-gray-200 focus:border-black text-sm transition-colors focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => removeExperienceHighlight(experience.id, hIndex)}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <button
                    type="button"
                    onClick={() => addExperienceHighlight(experience.id)}
                    className="text-xs font-bold uppercase text-gray-500 hover:text-black transition-colors flex items-center gap-1"
                >
                    <Plus size={14} /> Ajouter une réalisation
                </button>
            </div>
            
            {/* Technologies */}
            <BrutalTagInput
                label="Technologies utilisées"
                tags={experience.technologies || []}
                onChange={(tags) => update({ technologies: tags })}
                placeholder="Tapez et appuyez sur Entrée..."
                suggestions={TECH_SUGGESTIONS}
            />
        </BrutalCard>
    );
};

export const ExperienceForm: React.FC = () => {
    const experience = useCVStore((state) => state.cv.experience);
    const addExperience = useCVStore((state) => state.addExperience);
    
    return (
        <div className="space-y-6">
            <TipBox type="info">
                Listez vos expériences de la plus récente à la plus ancienne.
                Utilisez des verbes d'action et quantifiez vos réalisations quand c'est possible.
            </TipBox>
            
            <div className="space-y-4">
                {experience.map((exp, index) => (
                    <ExperienceItem
                        key={exp.id}
                        experience={exp}
                        index={index}
                    />
                ))}
            </div>
            
            <BrutalAddButton
                label="Ajouter une expérience"
                onClick={addExperience}
            />
        </div>
    );
};
