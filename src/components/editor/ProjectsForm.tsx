// ============================================================================
// NANCY CV - Projects Form
// ============================================================================

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FolderKanban, Github, ChevronDown, ChevronUp, 
    X, Image, Calendar, ExternalLink, Eye, EyeOff 
} from 'lucide-react';
import { Project } from '../../types/cv';
import { useCVStore } from '../../store/cvStore';
import {
    BrutalInput,
    BrutalTextarea,
    BrutalCheckbox,
    BrutalTagInput,
    BrutalAddButton,
    TipBox,
} from './BrutalUI';
import { cn } from '../../lib/utils';

const PROJECT_TAGS = [
    'React', 'Vue', 'Angular', 'Next.js', 'Node.js', 'Python', 'Django',
    'Machine Learning', 'API REST', 'GraphQL', 'MongoDB', 'PostgreSQL',
    'Docker', 'Kubernetes', 'AWS', 'Firebase', 'Stripe', 'Open Source',
];

interface ProjectItemProps {
    project: Project;
    index: number;
}

const ProjectItem: React.FC<ProjectItemProps> = ({ project, index }) => {
    const updateProject = useCVStore((state) => state.updateProject);
    const removeProject = useCVStore((state) => state.removeProject);
    const [isExpanded, setIsExpanded] = React.useState(true);
    
    const addHighlight = () => {
        const highlights = [...(project.highlights || []), ''];
        updateProject(project.id, { highlights });
    };
    
    const updateHighlight = (hIndex: number, value: string) => {
        const highlights = [...(project.highlights || [])];
        highlights[hIndex] = value;
        updateProject(project.id, { highlights });
    };
    
    const removeHighlight = (hIndex: number) => {
        const highlights = (project.highlights || []).filter((_, i) => i !== hIndex);
        updateProject(project.id, { highlights });
    };
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
                "border-3 border-black bg-white overflow-hidden",
                !project.visible && "opacity-60"
            )}
        >
            {/* Header */}
            <div
                className="flex items-center justify-between p-4 bg-brutal-blue/10 cursor-pointer hover:bg-brutal-blue/20 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border-2 border-black bg-white flex items-center justify-center">
                        <FolderKanban size={20} />
                    </div>
                    <div>
                        <div className="font-black">
                            {project.name || 'Nouveau projet'}
                        </div>
                        <div className="text-xs text-gray-600">
                            {project.technologies?.slice(0, 3).join(' • ') || 'Technologies...'}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            updateProject(project.id, { visible: !project.visible });
                        }}
                        className="p-2 hover:bg-white transition-colors"
                        title={project.visible ? "Masquer" : "Afficher"}
                    >
                        {project.visible ? <Eye size={16} /> : <EyeOff size={16} />}
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
                        <div className="p-4 space-y-6 border-t-2 border-black">
                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <BrutalInput
                                    label="Nom du projet"
                                    value={project.name}
                                    onChange={(v) => updateProject(project.id, { name: v })}
                                    placeholder="Mon super projet"
                                    icon={FolderKanban}
                                    required
                                />
                                <BrutalInput
                                    label="Rôle"
                                    value={project.role || ''}
                                    onChange={(v) => updateProject(project.id, { role: v || undefined })}
                                    placeholder="Développeur principal, Lead..."
                                />
                            </div>
                            
                            {/* Links */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <BrutalInput
                                    label="URL du projet"
                                    value={project.url || ''}
                                    onChange={(v) => updateProject(project.id, { url: v || undefined })}
                                    placeholder="https://monprojet.com"
                                    icon={ExternalLink}
                                    type="url"
                                />
                                <BrutalInput
                                    label="GitHub / Repo"
                                    value={project.github || ''}
                                    onChange={(v) => updateProject(project.id, { github: v || undefined })}
                                    placeholder="https://github.com/..."
                                    icon={Github}
                                    type="url"
                                />
                                <BrutalInput
                                    label="Image / Preview"
                                    value={project.image || ''}
                                    onChange={(v) => updateProject(project.id, { image: v || undefined })}
                                    placeholder="URL de l'image"
                                    icon={Image}
                                    type="url"
                                />
                            </div>
                            
                            {/* Dates */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <BrutalInput
                                    label="Date de début"
                                    value={project.startDate || ''}
                                    onChange={(v) => updateProject(project.id, { startDate: v || undefined })}
                                    type="month"
                                    icon={Calendar}
                                />
                                <BrutalInput
                                    label="Date de fin"
                                    value={project.endDate || ''}
                                    onChange={(v) => updateProject(project.id, { endDate: v || undefined })}
                                    type="month"
                                    disabled={project.current}
                                />
                                <div className="col-span-2 flex items-end">
                                    <BrutalCheckbox
                                        label="Projet en cours"
                                        checked={project.current || false}
                                        onChange={(v) => updateProject(project.id, { 
                                            current: v, 
                                            endDate: v ? undefined : project.endDate 
                                        })}
                                    />
                                </div>
                            </div>
                            
                            {/* Description */}
                            <BrutalTextarea
                                label="Description"
                                value={project.description}
                                onChange={(v) => updateProject(project.id, { description: v })}
                                placeholder="Décrivez le projet, son objectif et vos contributions..."
                                rows={3}
                            />
                            
                            {/* Technologies */}
                            <BrutalTagInput
                                label="Technologies utilisées"
                                tags={project.technologies || []}
                                onChange={(tags) => updateProject(project.id, { technologies: tags })}
                                placeholder="Ajouter une technologie..."
                                suggestions={PROJECT_TAGS}
                            />
                            
                            {/* Highlights */}
                            <div className="space-y-3">
                                <label className="block text-xs font-black uppercase tracking-wider">
                                    Points clés / Réalisations
                                </label>
                                <AnimatePresence>
                                    {project.highlights?.map((highlight, hIndex) => (
                                        <motion.div
                                            key={hIndex}
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="flex items-center gap-2"
                                        >
                                            <span className="text-sm font-bold">•</span>
                                            <input
                                                type="text"
                                                value={highlight}
                                                onChange={(e) => updateHighlight(hIndex, e.target.value)}
                                                placeholder="Une réalisation importante..."
                                                className="flex-1 px-3 py-2 border-2 border-black text-sm focus:outline-none focus:ring-2 focus:ring-brutal-blue"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeHighlight(hIndex)}
                                                className="p-2 text-red-500 hover:bg-red-50 border-2 border-transparent hover:border-red-200"
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
                                    + Ajouter un point clé
                                </button>
                            </div>
                            
                            {/* Featured Project */}
                            <div className="flex items-center justify-between p-3 bg-brutal-yellow/20 border-2 border-brutal-yellow">
                                <div>
                                    <div className="font-bold text-sm">Projet mis en avant</div>
                                    <div className="text-xs text-gray-600">
                                        Ce projet sera affiché en priorité
                                    </div>
                                </div>
                                <BrutalCheckbox
                                    label=""
                                    checked={project.featured || false}
                                    onChange={(v) => updateProject(project.id, { featured: v })}
                                />
                            </div>
                            
                            {/* Delete Button */}
                            <div className="flex justify-end pt-4 border-t-2 border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => removeProject(project.id)}
                                    className="px-4 py-2 border-2 border-red-500 text-red-500 font-bold text-sm hover:bg-red-50 transition-colors"
                                >
                                    Supprimer ce projet
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export const ProjectsForm: React.FC = () => {
    const projects = useCVStore((state) => state.cv.projects);
    const addProject = useCVStore((state) => state.addProject);
    
    const featuredCount = projects.filter(p => p.featured).length;
    const visibleCount = projects.filter(p => p.visible).length;
    
    return (
        <div className="space-y-6">
            <TipBox type="success">
                Les projets personnels montrent votre passion et vos compétences pratiques.
                Incluez des liens vers des démos ou du code source pour plus d'impact.
            </TipBox>
            
            {/* Stats */}
            {projects.length > 0 && (
                <div className="flex gap-4 text-xs">
                    <div className="px-3 py-1 bg-gray-100 border-2 border-gray-200 font-bold">
                        {projects.length} projet{projects.length > 1 ? 's' : ''}
                    </div>
                    <div className="px-3 py-1 bg-brutal-blue/20 border-2 border-brutal-blue font-bold">
                        {visibleCount} visible{visibleCount > 1 ? 's' : ''}
                    </div>
                    {featuredCount > 0 && (
                        <div className="px-3 py-1 bg-brutal-yellow/20 border-2 border-brutal-yellow font-bold">
                            {featuredCount} en vedette
                        </div>
                    )}
                </div>
            )}
            
            {/* Projects List */}
            <div className="space-y-4">
                <AnimatePresence>
                    {projects.map((project, index) => (
                        <ProjectItem
                            key={project.id}
                            project={project}
                            index={index}
                        />
                    ))}
                </AnimatePresence>
            </div>
            
            <BrutalAddButton
                label="Ajouter un projet"
                onClick={addProject}
            />
            
            {projects.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    <FolderKanban size={48} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Aucun projet ajouté</p>
                    <p className="text-xs mt-1">
                        Ajoutez vos projets personnels, open source ou freelance
                    </p>
                </div>
            )}
        </div>
    );
};
