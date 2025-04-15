import React from 'react';
import { LanguageItem } from '../../types/cv';

interface PreviewLanguagesProps {
  languages: LanguageItem[];
   accentColor : "#6366f1";
}

const PreviewLanguages: React.FC<PreviewLanguagesProps> = ({ languages ,accentColor = "#6366f1"}) => {
   // Indigo
  const lightAccentColor = "#e0e7ff"; // Indigo très clair
  
  // Helper pour vérifier s'il y a au moins une langue avec un nom
  const hasVisibleLanguages = languages.some(lang => lang.name.trim() !== '');

  if (!hasVisibleLanguages) {
    return null; // Cacher la section si vide
  }

  // Mapping des niveaux numériques aux descriptions textuelles
  const getLevelText = (level: number): string => {
    const levels = ["Débutant", "Élémentaire", "Intermédiaire", "Avancé", "Bilingue"];
    return levels[Math.min(Math.max(0, level - 1), 4)];
  };

  return (
    <div className="space-y-4">
      {languages
        .filter(lang => lang.name.trim() !== '')
        .map(language => (
          <div key={language.id} className="group">
            <div className="flex justify-between items-center text-sm mb-1.5">
              <span className="text-gray-800 font-medium group-hover:text-indigo-600 transition-colors duration-300">
                {language.name}
              </span>
              <span className="text-gray-600 text-xs font-medium">
                {getLevelText(language.level)}
              </span>
            </div>
            
            {/* Points de niveau */}
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i}
                  className="h-2 flex-1 rounded-full transition-all duration-300"
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