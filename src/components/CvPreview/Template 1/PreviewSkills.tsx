import React from 'react';
import { SkillItem } from '../../types/cv';

interface PreviewSkillsProps {
  skills: SkillItem[];
  accentColor: string;
}

const PreviewSkills: React.FC<PreviewSkillsProps> = ({ skills, accentColor = "#6366f1" }) => {

  // Helper to check if there's at least one skill with a name
  const hasVisibleSkills = skills.some(skill => skill.name.trim() !== '');

  if (!hasVisibleSkills) {
    return null; // Hide section if empty
  }

  return (
      <div className="space-y-2">
        {skills
            .filter(skill => skill.name.trim() !== '')
            .map(skill => {
              const percentage = Math.max(10, Math.min(100, (skill.level / 10) * 100));

              return (
                  <div key={skill.id} className="group mt-4">
                    <div className="flex justify-between mb-0.5 text-xs">
                <span className="text-gray-800 mb-2 font-medium group-hover:text-indigo-600 transition-colors duration-300">
                  {skill.name}
                </span>
                      <span className="text-gray-500 font-medium opacity-80">
                  {skill.level}/10
                </span>
                    </div>

                    {/* Progress bar with animation */}
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                          className="h-full rounded-full transition-all duration-500 ease-out group-hover:shadow-sm"
                          style={{
                            width: `${percentage}%`,
                            background: `linear-gradient(90deg, ${accentColor}, ${accentColor}aa)`,
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