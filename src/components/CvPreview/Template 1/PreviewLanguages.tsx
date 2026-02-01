// @ts-nocheck
import React from 'react';
import { LanguageItem } from '../../../types/cv';

interface PreviewLanguagesProps {
  languages: LanguageItem[];
  accentColor: string;
}

const PreviewLanguages: React.FC<PreviewLanguagesProps> = ({ languages, accentColor = "#6366f1" }) => {
  // Light accent color for inactive indicators
  const lightAccentColor = `${accentColor}30`;

  // Helper to check if there's at least one language with a name
  const hasVisibleLanguages = languages.some(lang => lang.name && lang.name.trim() !== '');

  if (!hasVisibleLanguages) {
    return null; // Hide section if empty
  }

  // Map numeric levels to text descriptions
  const getLevelText = (level: number): string => {
    const levels = ["Débutant", "Élémentaire", "Intermédiaire", "Avancé", "Très avancé"];
    return levels[Math.min(Math.max(0, level - 1), 4)];
  };

  return (
      <div className="space-y-3 mt-6">
        {languages
            .filter(lang => lang.name && lang.name.trim() !== '')
            .map(language => (
                <div key={language.id} className="group mt-4">
                  <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-gray-800 font-medium group-hover:text-indigo-600 mb-2 transition-colors duration-300">
                {language.name}
              </span>
                    <span className="text-gray-600 text-xs font-medium">
                {getLevelText(language.level)}
              </span>
                  </div>

                  {/* Level indicators */}
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="h-1.5 flex-1 rounded-full transition-all duration-300"
                            style={{
                              backgroundColor: i < language.level ? accentColor : lightAccentColor,
                              opacity: i < language.level ? (1 - i * 0.1) : 0.3
                            }}
                            aria-hidden="true"
                        />
                    ))}
                  </div>
                </div>
            ))}
      </div>
  );
};

export default PreviewLanguages;