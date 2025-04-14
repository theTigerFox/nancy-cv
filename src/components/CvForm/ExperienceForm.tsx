// src/components/CvForm/ExperienceForm.tsx
import React from 'react';
import { ExperienceItem } from '../../types/cv';

interface ExperienceFormProps {
    item: ExperienceItem;
    onChange: (field: keyof Omit<ExperienceItem, 'id'>, value: string) => void;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({ item, onChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        onChange(name as keyof Omit<ExperienceItem, 'id'>, value);
    };

    return (
        <>
            <div className="mb-2">
                <label className="block text-gray-700 mb-1 text-sm font-medium">Poste</label>
                <input
                    type="text"
                    name="title"
                    value={item.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
            </div>
            <div className="mb-2">
                <label className="block text-gray-700 mb-1 text-sm font-medium">Entreprise</label>
                <input
                    type="text"
                    name="company"
                    value={item.company}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-2">
                <div>
                    <label className="block text-gray-700 mb-1 text-sm font-medium">Date de début</label>
                    <input
                        type="text"
                        name="startDate"
                        value={item.startDate}
                        onChange={handleChange}
                        placeholder="MM/AAAA"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-1 text-sm font-medium">Date de fin</label>
                    <input
                        type="text"
                        name="endDate"
                        value={item.endDate}
                        onChange={handleChange}
                        placeholder="MM/AAAA ou Présent"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                </div>
            </div>
            <div>
                <label className="block text-gray-700 mb-1 text-sm font-medium">Description (missions, réalisations)</label>
                <textarea
                    name="description"
                    value={item.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
            </div>
        </>
    );
};

export default ExperienceForm;