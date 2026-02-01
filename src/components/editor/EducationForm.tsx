// ============================================================================
// NANCY CV - Education Form
// ============================================================================

import React from 'react';
import { GraduationCap, Building2, MapPin, Award } from 'lucide-react';
import { Education } from '../../types/cv';
import { useCVStore } from '../../store/cvStore';
import {
    BrutalInput,
    BrutalTextarea,
    BrutalDateInput,
    BrutalTagInput,
    BrutalCard,
    BrutalAddButton,
    TipBox,
} from './BrutalUI';

interface EducationItemProps {
    education: Education;
    index: number;
}

const EducationItem: React.FC<EducationItemProps> = ({ education, index }) => {
    const updateEducation = useCVStore((state) => state.updateEducation);
    const removeEducation = useCVStore((state) => state.removeEducation);
    
    const update = (data: Partial<Education>) => {
        updateEducation(education.id, data);
    };
    
    return (
        <BrutalCard
            title={education.degree || 'Nouvelle formation'}
            subtitle={education.school}
            index={index}
            onRemove={() => removeEducation(education.id)}
            onToggleVisibility={() => update({ visible: !education.visible })}
            isVisible={education.visible}
            color="bg-brutal-blue"
        >
            {/* Degree & Field */}
            <div className="grid grid-cols-2 gap-4">
                <BrutalInput
                    label="Diplôme"
                    value={education.degree}
                    onChange={(v) => update({ degree: v })}
                    placeholder="Master, Licence, BTS..."
                    icon={GraduationCap}
                    required
                />
                <BrutalInput
                    label="Domaine d'études"
                    value={education.field}
                    onChange={(v) => update({ field: v })}
                    placeholder="Informatique, Marketing..."
                    required
                />
            </div>
            
            {/* School */}
            <div className="grid grid-cols-2 gap-4">
                <BrutalInput
                    label="École / Université"
                    value={education.school}
                    onChange={(v) => update({ school: v })}
                    placeholder="Université Paris-Saclay"
                    icon={Building2}
                    required
                />
                <BrutalInput
                    label="Lieu"
                    value={education.location}
                    onChange={(v) => update({ location: v })}
                    placeholder="Paris, France"
                    icon={MapPin}
                />
            </div>
            
            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
                <BrutalDateInput
                    label="Date de début"
                    value={education.startDate}
                    onChange={(v) => update({ startDate: v })}
                    required
                />
                <BrutalDateInput
                    label="Date de fin"
                    value={education.endDate || ''}
                    onChange={(v) => update({ endDate: v })}
                    isCurrent={education.current}
                    onCurrentChange={(c) => update({ current: c, endDate: c ? '' : education.endDate })}
                    showCurrentOption
                    currentLabel="En cours"
                />
            </div>
            
            {/* Grade */}
            <div className="grid grid-cols-2 gap-4">
                <BrutalInput
                    label="Mention / Résultat"
                    value={education.grade || ''}
                    onChange={(v) => update({ grade: v })}
                    placeholder="Très Bien, Magna Cum Laude..."
                    icon={Award}
                />
                <BrutalInput
                    label="GPA / Moyenne"
                    value={education.gpa || ''}
                    onChange={(v) => update({ gpa: v })}
                    placeholder="3.8/4.0, 16/20..."
                />
            </div>
            
            {/* Description */}
            <BrutalTextarea
                label="Description"
                value={education.description}
                onChange={(v) => update({ description: v })}
                placeholder="Projets notables, spécialisation, activités..."
                rows={2}
            />
            
            {/* Relevant Courses */}
            <BrutalTagInput
                label="Cours pertinents"
                tags={education.relevantCourses || []}
                onChange={(tags) => update({ relevantCourses: tags })}
                placeholder="Algorithmique, UX Design..."
            />
        </BrutalCard>
    );
};

export const EducationForm: React.FC = () => {
    const education = useCVStore((state) => state.cv.education);
    const addEducation = useCVStore((state) => state.addEducation);
    
    return (
        <div className="space-y-6">
            <TipBox type="info">
                Incluez vos diplômes les plus pertinents. Pour les jeunes diplômés, 
                cette section peut précéder l'expérience professionnelle.
            </TipBox>
            
            <div className="space-y-4">
                {education.map((edu, index) => (
                    <EducationItem
                        key={edu.id}
                        education={edu}
                        index={index}
                    />
                ))}
            </div>
            
            <BrutalAddButton
                label="Ajouter une formation"
                onClick={addEducation}
            />
        </div>
    );
};
