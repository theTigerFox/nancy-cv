// src/types/cv.d.ts

export interface PersonalInfo {
    photo?: string; // Store photo as base64 data URL or a path
    firstName: string;
    lastName: string;
    jobTitle: string;
    address: string;
    phone: string;
    email: string;
    description: string;
  }
  
  export interface EducationItem {
    id: string; // Unique ID for list rendering
    degree: string;
    school: string;
    startDate: string;
    endDate: string;
    description: string;
  }
  
  export interface ExperienceItem {
    id: string; // Unique ID
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
  }
  
  export interface SkillItem {
    id: string; // Unique ID
    name: string;
    level: number; // 1-10
  }
  
  export interface LanguageItem {
    id: string; // Unique ID
    name: string;
    level: number; // 1-5 (Débutant to Bilingue)
  }
  
  export interface CvData {
    personalInfo: PersonalInfo;
    education: EducationItem[];
    experience: ExperienceItem[];
    skills: SkillItem[];
    languages: LanguageItem[];
    [key: string]: any; // Signature d'index

  }
  
  // Type pour les fonctions de mise à jour passées aux composants enfants
  export type CvUpdateField = <K extends keyof PersonalInfo>(field: K, value: PersonalInfo[K]) => void;
  export type CvUpdateList<T> = (index: number, field: keyof T, value: any) => void;
  export type CvAddListItem<T> = () => void;
  export type CvRemoveListItem = (id: string) => void; // Use ID for removal