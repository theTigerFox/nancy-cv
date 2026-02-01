// src/types/cv.d.ts
// Ce fichier réexporte les types depuis cv.ts pour la compatibilité

export {
    PersonalInfo,
    Education,
    Experience,
    Skill,
    Language,
    Project,
    Certification,
    Volunteer,
    Interest,
    Reference,
    Publication,
    Award,
    CustomSection,
    SocialLink,
    CVData,
    CVData as CvData, // Alias pour la compatibilité
    SectionConfig,
    TemplateSettings,
} from './cv';

// Alias pour la compatibilité avec l'ancien code
export type EducationItem = import('./cv').Education;
export type ExperienceItem = import('./cv').Experience;
export type SkillItem = import('./cv').Skill;
export type LanguageItem = import('./cv').Language;

// Type pour les fonctions de mise à jour passées aux composants enfants
export type CvUpdateField = <K extends keyof import('./cv').PersonalInfo>(field: K, value: import('./cv').PersonalInfo[K]) => void;
export type CvUpdateList<T> = (index: number, field: keyof T, value: any) => void;
export type CvAddListItem<T> = () => void;
export type CvRemoveListItem = (id: string) => void;