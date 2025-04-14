import React from 'react';
import { SkillItem } from '../../types/cv';

interface PreviewSkillsProps {
  skills: SkillItem[];
}

const PreviewSkills: React.FC<PreviewSkillsProps> = ({ skills }) => {
  const accentColor = "#6366f1"; // Indigo
  
  // Helper pour vérifier s'il y a au moins une compétence avec un nom
  const hasVisibleSkills = skills.some(skill => skill.name.trim() !== '');

  if (!hasVisibleSkills) {
    return null; // Cacher la section si vide
  }

  return (
    <div className="space-y-1">
      {skills
        .filter(skill => skill.name.trim() !== '')
        .map(skill => {
          const percentage = Math.max(10, Math.min(100, (skill.level / 10) * 100));
          
          return (
            <div key={skill.id} className="group">
              <div className="flex justify-between mb-0 text-sm">
                <span className="text-gray-800 font-medium group-hover:text-indigo-600 transition-colors duration-300">
                  {skill.name}
                </span>
                <span className="text-gray-500 font-medium opacity-80">
                  {skill.level}/10
                </span>
              </div>
              
              {/* Barre de progression avec animation */}
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out group-hover:shadow-md"
                  style={{ 
                    width: `${percentage}%`,
                    background: `linear-gradient(90deg, ${accentColor}, #818cf8)`,
                  }}
                  role="progressbar"
                  aria-valuenow={skill.level}
                  aria-valuemin={1}
                  aria-valuemax={10}
                  aria-label={`${skill.name} niveau ${skill.level} sur 10`}
                />
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default PreviewSkills;