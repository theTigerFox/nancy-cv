// ============================================================================
// NANCY CV - Skills Form
// ============================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, X, Sparkles } from 'lucide-react';
import { Skill, SkillLevel } from '../../types/cv';
import { useCVStore } from '../../store/cvStore';
import {
    BrutalInput,
    BrutalSlider,
    BrutalSelect,
    BrutalAddButton,
    TipBox,
} from './BrutalUI';
import { cn } from '../../lib/utils';

const SKILL_CATEGORIES = [
    { value: '', label: 'Sans catégorie' },
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
    { value: 'database', label: 'Base de données' },
    { value: 'devops', label: 'DevOps' },
    { value: 'design', label: 'Design' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'soft-skills', label: 'Soft Skills' },
    { value: 'languages', label: 'Langages' },
    { value: 'tools', label: 'Outils' },
    { value: 'other', label: 'Autre' },
];

const SUGGESTED_SKILLS: Record<string, string[]> = {
    frontend: ['React', 'Vue.js', 'Angular', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS', 'SASS'],
    backend: ['Node.js', 'Python', 'Java', 'C#', 'PHP', 'Ruby', 'Go', 'Express', 'Django', 'Spring'],
    database: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Firebase'],
    devops: ['Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'CI/CD', 'Jenkins', 'Terraform'],
    design: ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'Sketch', 'InVision'],
    mobile: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS', 'Android'],
    tools: ['Git', 'VS Code', 'Jira', 'Slack', 'Notion', 'Postman'],
};

interface SkillItemProps {
    skill: Skill;
    index: number;
    isCompact?: boolean;
}

const SkillItem: React.FC<SkillItemProps> = ({ skill, index, isCompact }) => {
    const updateSkill = useCVStore((state) => state.updateSkill);
    const removeSkill = useCVStore((state) => state.removeSkill);
    
    if (isCompact) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="border-3 border-black bg-white p-3 group hover:shadow-brutal transition-all"
            >
                <div className="flex items-center justify-between mb-2">
                    <input
                        type="text"
                        value={skill.name}
                        onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
                        placeholder="Compétence..."
                        className="font-bold text-sm bg-transparent focus:outline-none flex-1"
                    />
                    <button
                        type="button"
                        onClick={() => removeSkill(skill.id)}
                        className="p-1 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <X size={14} strokeWidth={3} />
                    </button>
                </div>
                <div className="flex items-center gap-1 h-4">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((lvl) => (
                        <button
                            key={lvl}
                            type="button"
                            onClick={() => updateSkill(skill.id, { level: lvl as SkillLevel })}
                            className={cn(
                                "flex-1 h-full border border-black transition-all",
                                lvl <= skill.level ? "bg-black" : "bg-gray-100 hover:bg-gray-200"
                            )}
                        />
                    ))}
                </div>
            </motion.div>
        );
    }
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: index * 0.05 }}
            className="border-3 border-black bg-white p-4 group hover:shadow-brutal transition-all"
        >
            <div className="flex items-start gap-4">
                <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                        <BrutalInput
                            label="Compétence"
                            value={skill.name}
                            onChange={(v) => updateSkill(skill.id, { name: v })}
                            placeholder="React, Python, Figma..."
                            icon={Zap}
                        />
                        <div className="w-40">
                            <BrutalSelect
                                label="Catégorie"
                                options={SKILL_CATEGORIES}
                                value={skill.category || ''}
                                onChange={(v) => updateSkill(skill.id, { category: v || undefined })}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => removeSkill(skill.id)}
                            className="mt-5 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                            <X size={18} strokeWidth={3} />
                        </button>
                    </div>
                    <BrutalSlider
                        label="Niveau de maîtrise"
                        value={skill.level}
                        min={1}
                        max={10}
                        onChange={(v) => updateSkill(skill.id, { level: v as SkillLevel })}
                    />
                </div>
            </div>
        </motion.div>
    );
};

export const SkillsForm: React.FC = () => {
    const skills = useCVStore((state) => state.cv.skills);
    const addSkill = useCVStore((state) => state.addSkill);
    const [viewMode, setViewMode] = useState<'detailed' | 'compact'>('compact');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    
    // Group skills by category
    const groupedSkills = skills.reduce((acc, skill) => {
        const cat = skill.category || 'other';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(skill);
        return acc;
    }, {} as Record<string, Skill[]>);
    
    const filteredSkills = selectedCategory
        ? skills.filter(s => (s.category || 'other') === selectedCategory)
        : skills;
    
    const quickAddSkill = (name: string) => {
        addSkill();
        // Get the last added skill and update it
        setTimeout(() => {
            const state = useCVStore.getState();
            const lastSkill = state.cv.skills[state.cv.skills.length - 1];
            if (lastSkill) {
                state.updateSkill(lastSkill.id, { name, category: selectedCategory || undefined });
            }
        }, 0);
    };
    
    return (
        <div className="space-y-6">
            <TipBox type="info">
                Ajoutez vos compétences techniques et soft skills. 
                Soyez honnête sur votre niveau - les recruteurs vérifient souvent.
            </TipBox>
            
            {/* Controls */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setViewMode('compact')}
                        className={cn(
                            "px-3 py-2 border-2 border-black text-xs font-bold uppercase transition-all",
                            viewMode === 'compact' ? "bg-black text-white" : "bg-white hover:bg-gray-100"
                        )}
                    >
                        Compact
                    </button>
                    <button
                        type="button"
                        onClick={() => setViewMode('detailed')}
                        className={cn(
                            "px-3 py-2 border-2 border-black text-xs font-bold uppercase transition-all",
                            viewMode === 'detailed' ? "bg-black text-white" : "bg-white hover:bg-gray-100"
                        )}
                    >
                        Détaillé
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase text-gray-500">Filtrer:</span>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-3 py-2 border-2 border-black text-xs font-bold bg-white"
                    >
                        <option value="">Toutes</option>
                        {SKILL_CATEGORIES.slice(1).map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                    </select>
                </div>
            </div>
            
            {/* Quick Add Suggestions */}
            {selectedCategory && SUGGESTED_SKILLS[selectedCategory] && (
                <div className="p-4 bg-gray-50 border-3 border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles size={16} className="text-brutal-pink" />
                        <span className="text-xs font-black uppercase">Suggestions rapides</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {SUGGESTED_SKILLS[selectedCategory]
                            .filter(s => !skills.some(sk => sk.name.toLowerCase() === s.toLowerCase()))
                            .slice(0, 8)
                            .map(suggestion => (
                                <button
                                    key={suggestion}
                                    type="button"
                                    onClick={() => quickAddSkill(suggestion)}
                                    className="px-3 py-1 border-2 border-dashed border-gray-300 text-xs font-bold hover:border-black hover:bg-white transition-all"
                                >
                                    + {suggestion}
                                </button>
                            ))}
                    </div>
                </div>
            )}
            
            {/* Skills List */}
            <div className={cn(
                viewMode === 'compact' 
                    ? "grid grid-cols-2 gap-3" 
                    : "space-y-4"
            )}>
                <AnimatePresence>
                    {filteredSkills.map((skill, index) => (
                        <SkillItem
                            key={skill.id}
                            skill={skill}
                            index={index}
                            isCompact={viewMode === 'compact'}
                        />
                    ))}
                </AnimatePresence>
            </div>
            
            <BrutalAddButton
                label="Ajouter une compétence"
                onClick={addSkill}
            />
            
            {/* Stats */}
            {skills.length > 0 && (
                <div className="flex items-center justify-center gap-6 py-4 border-t-2 border-dashed border-gray-200">
                    <div className="text-center">
                        <div className="text-2xl font-black">{skills.length}</div>
                        <div className="text-xs text-gray-500 uppercase">Compétences</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-black">
                            {Math.round(skills.reduce((a, s) => a + s.level, 0) / skills.length * 10)}%
                        </div>
                        <div className="text-xs text-gray-500 uppercase">Niveau moyen</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-black">
                            {Object.keys(groupedSkills).length}
                        </div>
                        <div className="text-xs text-gray-500 uppercase">Catégories</div>
                    </div>
                </div>
            )}
        </div>
    );
};
