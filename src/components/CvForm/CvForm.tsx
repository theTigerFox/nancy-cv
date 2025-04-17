// src/components/CvForm/CvForm.tsx
import React from 'react';
import { CvData, EducationItem, ExperienceItem, SkillItem, LanguageItem } from '../../types/cv';
import PersonalInfoForm from './PersonalInfoForm';
import FormSection from './FormSection'; // You'll create this generic component
import EducationForm from './EducationForm'; // Specific content for education items
import ExperienceForm from './ExperienceForm'; // Specific content for experience items
import SkillsForm from './SkillsForm'; // Specific content for skill items
import LanguagesForm from './LanguagesForm'; // Specific content for language items

interface CvFormProps {
    cvData: CvData;
    onPersonalInfoChange: (field: keyof CvData['personalInfo'], value: any) => void;
    onPhotoChange: (file: File | null) => void;
    onListChange: (listName: keyof CvData, id: string, field: string, value: any) => void;
    onAddItem: (listName: keyof CvData, newItemTemplate: any) => void;
    onRemoveItem: (listName: keyof CvData, id: string) => void;
}

// Define default items to add
const defaultEducationItem: Omit<EducationItem, 'id'> = { degree: '', school: '', startDate: '', endDate: '', description: '' };
const defaultExperienceItem: Omit<ExperienceItem, 'id'> = { title: '', company: '', startDate: '', endDate: '', description: '' };
const defaultSkillItem: Omit<SkillItem, 'id'> = { name: '', level: 5 };
const defaultLanguageItem: Omit<LanguageItem, 'id'> = { name: '', level: 3 };


const CvForm: React.FC<CvFormProps> = ({
    cvData,
    onPersonalInfoChange,
    onPhotoChange,
    onListChange,
    onAddItem,
    onRemoveItem
}) => {

    function handleDlBtn2(){
        document.getElementById("btn-dl")?.click();
    }

    return (
        <div className="space-y-8">
            {/* Personal Info */}
            <PersonalInfoForm
                personalInfo={cvData.personalInfo}
                onInfoChange={onPersonalInfoChange}
                onPhotoChange={onPhotoChange}
            />

            {/* Education Section */}
             <FormSection
                title="Formation"
                items={cvData.education}
                renderItem={(item) => (
                    <EducationForm
                        item={item}
                        onChange={(field, value) => onListChange('education', item.id, field, value)}
                    />
                )}
                onAddItem={() => onAddItem('education', defaultEducationItem)}
                onRemoveItem={(id) => onRemoveItem('education', id)}
                addItemLabel="Ajouter une formation"
            />

             {/* Experience Section */}
             <FormSection
                title="Expérience Professionnelle"
                items={cvData.experience}
                renderItem={(item) => (
                    <ExperienceForm
                        item={item}
                        onChange={(field, value) => onListChange('experience', item.id, field, value)}
                    />
                )}
                onAddItem={() => onAddItem('experience', defaultExperienceItem)}
                onRemoveItem={(id) => onRemoveItem('experience', id)}
                addItemLabel="Ajouter une expérience"
            />

             {/* Skills Section */}
             <FormSection
                title="Compétences"
                items={cvData.skills}
                renderItem={(item) => (
                    <SkillsForm
                        item={item}
                        onChange={(field, value) => onListChange('skills', item.id, field, value)}
                     />
                )}
                onAddItem={() => onAddItem('skills', defaultSkillItem)}
                onRemoveItem={(id) => onRemoveItem('skills', id)}
                addItemLabel="Ajouter une compétence"
            />

             {/* Languages Section */}
            <FormSection
                title="Langues"
                items={cvData.languages}
                renderItem={(item) => (
                    <LanguagesForm
                        item={item}
                        onChange={(field, value) => onListChange('languages', item.id, field, value)}
                    />
                 )}
                onAddItem={() => onAddItem('languages', defaultLanguageItem)}
                onRemoveItem={(id) => onRemoveItem('languages', id)}
                addItemLabel="Ajouter une langue"
            />

            {/* Maybe a final submit/generate button if needed, although download/print are on preview */}
              <div className="mt-8 flex justify-center">
                  <p className="text-center"> Si vous êtes sur mobile , Allez dans <span className="text-red-600">"Preview"</span>  en haut pour télécharger votre pdf</p>

            </div>
        </div>
    );
};

export default CvForm;