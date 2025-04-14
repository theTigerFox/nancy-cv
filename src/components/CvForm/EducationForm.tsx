import React from 'react';
import { Calendar, School, Award } from 'lucide-react';
import { EducationItem } from '../../types/cv';

interface EducationFormProps {
    item: EducationItem;
    onChange: (field: keyof Omit<EducationItem, 'id'>, value: string) => void;
}

const EducationForm: React.FC<EducationFormProps> = ({ item, onChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        onChange(name as keyof Omit<EducationItem, 'id'>, value);
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-700 font-medium">
                    <Award size={16} className="text-blue-500" />
                    Diplôme / Formation
                </label>
                <input
                    type="text"
                    name="degree"
                    value={item.degree}
                    onChange={handleChange}
                    placeholder="Ex: Master en Informatique, Licence en Design..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
            </div>
            
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-700 font-medium">
                    <School size={16} className="text-blue-500" />
                    Établissement
                </label>
                <input
                    type="text"
                    name="school"
                    value={item.school}
                    onChange={handleChange}
                    placeholder="Nom de l'université ou de l'école"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-gray-700 font-medium">
                        <Calendar size={16} className="text-blue-500" />
                        Date de début
                    </label>
                    <input
                        type="text"
                        name="startDate"
                        value={item.startDate}
                        onChange={handleChange}
                        placeholder="MM/AAAA"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    />
                </div>
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-gray-700 font-medium">
                        <Calendar size={16} className="text-blue-500" />
                        Date de fin
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            name="endDate"
                            value={item.endDate}
                            onChange={handleChange}
                            placeholder="MM/AAAA ou 'Présent'"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        />
                    </div>
                </div>
            </div>
            
            <div className="space-y-2">
                <label className="block text-gray-700 font-medium">Description</label>
                <textarea
                    name="description"
                    value={item.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Décrivez votre formation, vos spécialités, projets importants ou réalisations académiques..."
                    className="w-full px-4 py-3 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Conseils: mentionnez les compétences acquises, les projets majeurs ou votre classement si pertinent.
                </p>
            </div>
        </div>
    );
};

export default EducationForm;