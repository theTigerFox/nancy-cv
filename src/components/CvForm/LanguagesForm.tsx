import React from 'react';
import { Globe, Star } from 'lucide-react';
import { LanguageItem } from '../../types/cv';

interface LanguagesFormProps {
    item: LanguageItem;
    onChange: (field: keyof Omit<LanguageItem, 'id'>, value: string | number) => void;
}

const languageLevels = [
    { value: 1, label: "Débutant", description: "Connaissances élémentaires" },
    { value: 2, label: "Élém", description: "Comm simple" },
    { value: 3, label: "Interm", description: "Comm courante" },
    { value: 4, label: "Avancé", description: "Comm aisée" },
    { value: 5, label: "Courant", description: "Maîtrise complète" }
];

const LanguagesForm: React.FC<LanguagesFormProps> = ({ item, onChange }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        onChange(name as keyof Omit<LanguageItem, 'id'>, value);
    };

    const handleLevelChange = (level: number) => {
        onChange('level', level);
    };

    return (
        <div className="space-y-5">
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-700 font-medium">
                    <Globe size={16} className="text-blue-500" />
                    Langue
                </label>
                <input
                    type="text"
                    name="name"
                    value={item.name}
                    onChange={handleInputChange}
                    placeholder="Ex: Français, Anglais, Espagnol..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
            </div>
            
            <div className="space-y-3">
                <label className="block text-gray-700 font-medium">Niveau de maîtrise</label>
                
                <div className="flex flex-col gap-3">
                    {languageLevels.map(level => (
                        <div 
                            key={level.value}
                            onClick={() => handleLevelChange(level.value)}
                            className={`flex items-center text-gray-700 gap-3 p-3 border rounded-lg cursor-pointer transition-all duration-200
                                ${item.level === level.value 
                                    ? 'border-blue-500 bg-blue-50' 
                                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
                        >
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star 
                                        key={i} 
                                        size={16} 
                                        className={i < level.value ? 'text-blue-500 fill-blue-500' : 'text-gray-300'} 
                                    />
                                ))}
                            </div>
                            <div>
                                <div className="font-medium text-1.2xs">{level.label}</div>
                                <div className="text-xs text-gray-500">{level.description}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LanguagesForm;