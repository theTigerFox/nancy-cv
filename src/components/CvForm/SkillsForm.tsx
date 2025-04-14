// src/components/CvForm/SkillsForm.tsx
import React from 'react';
import { SkillItem } from '../../types/cv';

interface SkillsFormProps {
    item: SkillItem;
    onChange: (field: keyof Omit<SkillItem, 'id'>, value: string | number) => void;
}

const SkillsForm: React.FC<SkillsFormProps> = ({ item, onChange }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        onChange(name as keyof Omit<SkillItem, 'id'>, value);
    };

    const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        onChange(name as keyof Omit<SkillItem, 'id'>, parseInt(value, 10)); // Convert value to number
    };

    return (
        <>
            <div className="mb-2">
                <label className="block text-gray-700 mb-1 text-sm font-medium">Compétence</label>
                <input
                    type="text"
                    name="name"
                    value={item.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
            </div>
            <div className="mb-2">
                <label className="block text-gray-700 mb-1 text-sm font-medium">Niveau ({item.level}/10)</label>
                <input
                    type="range"
                    name="level"
                    min="1"
                    max="10"
                    value={item.level}
                    onChange={handleRangeChange} // Use specific handler for range
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" // Basic range styling
                />
                <div className="flex justify-between text-xs text-gray-500 px-1">
                    <span>Débutant</span>
                    <span>Expert</span>
                </div>
            </div>
        </>
    );
};

export default SkillsForm;