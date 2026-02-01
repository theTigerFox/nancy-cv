// ============================================================================
// NANCY CV - Types Complets pour Générateur Professionnel
// ============================================================================
// Structure inspirée des standards LinkedIn, Europass, et générateurs premium
// ============================================================================

import { v4 as uuidv4 } from 'uuid';

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1: Types de Base & Utilitaires
// ─────────────────────────────────────────────────────────────────────────────

export type DateString = string; // Format: "YYYY-MM" ou "YYYY" ou "Present"

export interface DateRange {
    start: DateString;
    end: DateString;
    current: boolean;
}

export type SkillLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type LanguageLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'native';

export const LANGUAGE_LEVELS: Record<LanguageLevel, string> = {
    A1: 'Débutant',
    A2: 'Élémentaire',
    B1: 'Intermédiaire',
    B2: 'Intermédiaire avancé',
    C1: 'Avancé',
    C2: 'Maîtrise',
    native: 'Langue maternelle',
};

export type DrivingLicense = 'A' | 'A1' | 'A2' | 'AM' | 'B' | 'B1' | 'BE' | 'C' | 'C1' | 'CE' | 'D' | 'D1' | 'DE';

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2: Informations Personnelles
// ─────────────────────────────────────────────────────────────────────────────

export interface SocialLink {
    id: string;
    platform: 'linkedin' | 'github' | 'twitter' | 'portfolio' | 'behance' | 'dribbble' | 'stackoverflow' | 'youtube' | 'medium' | 'other';
    url: string;
    label?: string; // Custom label for "other"
}

export interface PersonalInfo {
    // Identité
    photo?: string; // Base64 ou URL
    firstName: string;
    lastName: string;
    
    // Titre Professionnel
    jobTitle: string;
    headline?: string; // Phrase d'accroche courte
    
    // Coordonnées
    email: string;
    phone: string;
    secondaryPhone?: string;
    
    // Adresse
    address: string;
    city: string;
    postalCode: string;
    country: string;
    
    // Présence en ligne
    website?: string;
    socialLinks: SocialLink[];
    
    // Informations supplémentaires
    dateOfBirth?: string;
    nationality?: string;
    drivingLicenses?: DrivingLicense[];
    
    // Résumé / À propos
    summary: string;
    
    /** @deprecated Use summary instead */
    description?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3: Expériences Professionnelles
// ─────────────────────────────────────────────────────────────────────────────

export interface Experience {
    id: string;
    
    // Informations de base
    title: string;
    company: string;
    companyLogo?: string;
    
    // Localisation
    location?: string;
    remote?: 'onsite' | 'remote' | 'hybrid';
    
    // Période
    startDate: DateString;
    endDate?: DateString;
    current?: boolean;
    
    // Type de contrat
    contractType?: 'cdi' | 'cdd' | 'freelance' | 'internship' | 'apprenticeship' | 'volunteer' | 'other';
    
    // Description
    description?: string;
    
    // Points clés / Réalisations (format liste)
    highlights?: string[];
    
    // Technologies / Compétences utilisées
    technologies?: string[];
    
    // Ordre d'affichage (pour drag & drop)
    order?: number;
    
    // Visibilité
    visible?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4: Formations
// ─────────────────────────────────────────────────────────────────────────────

export interface Education {
    id: string;
    
    // Institution
    school: string;
    schoolLogo?: string;
    location?: string;
    
    // Diplôme
    degree: string;
    field?: string; // Domaine d'études
    
    // Période
    startDate: DateString;
    endDate?: DateString;
    current?: boolean;
    
    // Résultats
    grade?: string; // Note, mention
    gpa?: string;
    
    // Description
    description?: string;
    
    // Cours pertinents
    relevantCourses?: string[];
    
    // Ordre et visibilité
    order?: number;
    visible?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5: Compétences
// ─────────────────────────────────────────────────────────────────────────────

export interface Skill {
    id: string;
    name: string;
    level: SkillLevel;
    category?: string; // Frontend, Backend, Soft Skills, etc.
    keywords?: string[]; // Pour SEO/ATS
    yearsOfExperience?: number;
    visible?: boolean;
}

export interface SkillCategory {
    id: string;
    name: string;
    skills: Skill[];
    order: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 6: Langues
// ─────────────────────────────────────────────────────────────────────────────

export interface Language {
    id: string;
    name: string;
    level: LanguageLevel | number; // Support both CECRL string levels and numeric 1-5
    certification?: string; // TOEFL, DELF, etc.
    certificationScore?: string;
    visible?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 7: Projets
// ─────────────────────────────────────────────────────────────────────────────

export interface Project {
    id: string;
    
    name: string;
    role?: string; // Mon rôle dans le projet
    
    // Description
    description: string;
    highlights?: string[];
    
    // Liens
    url?: string;
    repoUrl?: string;
    github?: string; // Alias for repoUrl
    
    // Technologies
    technologies?: string[];
    
    // Images
    thumbnail?: string;
    image?: string; // Alias for thumbnail
    images?: string[];
    
    // Période
    startDate?: DateString;
    endDate?: DateString;
    current?: boolean;
    
    // Contexte
    context?: 'personal' | 'professional' | 'academic' | 'freelance' | 'opensource';
    
    // Featured
    featured?: boolean;
    
    // Ordre et visibilité
    order?: number;
    visible: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 8: Certifications
// ─────────────────────────────────────────────────────────────────────────────

export interface Certification {
    id: string;
    
    name: string;
    issuer: string;
    issuerLogo?: string;
    
    // Date
    date: DateString; // Alias for issueDate
    issueDate?: DateString;
    expiryDate?: DateString;
    doesNotExpire?: boolean;
    
    // Identifiants
    credentialId?: string;
    credentialUrl?: string;
    
    // Score
    score?: string;
    
    // Description
    description?: string;
    
    // Ordre et visibilité
    order?: number;
    visible: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 9: Bénévolat / Engagement
// ─────────────────────────────────────────────────────────────────────────────

export interface Volunteer {
    id: string;
    
    organization: string;
    role: string;
    cause?: string; // Environnement, Éducation, etc.
    
    location?: string;
    
    startDate: DateString;
    endDate?: DateString;
    current?: boolean;
    
    description?: string;
    highlights?: string[];
    
    order?: number;
    visible: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 10: Centres d'intérêt / Hobbies
// ─────────────────────────────────────────────────────────────────────────────

export interface Interest {
    id: string;
    name: string;
    icon?: string; // Nom d'icône lucide
    category?: string; // sport, art, music, etc.
    description?: string;
    visible: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 11: Références
// ─────────────────────────────────────────────────────────────────────────────

export interface Reference {
    id: string;
    
    name: string;
    position?: string; // Alias for title
    title?: string;
    company?: string;
    relationship?: string; // Manager, Collègue, Client, etc.
    
    email?: string;
    phone?: string;
    linkedin?: string;
    
    // Option "sur demande"
    hideContact?: boolean; // Alias for hideContactInfo
    hideContactInfo?: boolean;
    
    // Témoignage optionnel
    testimonial?: string;
    
    visible: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 12: Publications & Awards
// ─────────────────────────────────────────────────────────────────────────────

export interface Publication {
    id: string;
    
    title: string;
    publisher: string;
    date: DateString;
    url?: string;
    description?: string;
    authors?: string[];
    
    order: number;
    visible: boolean;
}

export interface Award {
    id: string;
    
    title: string;
    issuer: string;
    date: DateString;
    description?: string;
    
    order: number;
    visible: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 13: Sections Personnalisées
// ─────────────────────────────────────────────────────────────────────────────

export interface CustomSectionItem {
    id: string;
    title: string;
    subtitle?: string;
    date?: DateString;
    location?: string;
    description?: string;
    url?: string;
    visible: boolean;
}

export interface CustomSection {
    id: string;
    name?: string;
    title: string; // Display name
    icon?: string;
    items: CustomSectionItem[];
    order?: number;
    visible: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 14: Configuration du Template
// ─────────────────────────────────────────────────────────────────────────────

export type TemplateId = 
    | 'brutalist-nancy'
    | 'modern-clean'
    | 'classic-elegant'
    | 'creative-bold'
    | 'minimal-zen'
    | 'professional-corporate'
    | 'tech-developer'
    | 'designer-portfolio'
    | 'ats-friendly';

export interface TemplateColors {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    textLight: string;
    background: string;
    backgroundAlt: string;
}

export interface TemplateTypography {
    headingFont: string;
    bodyFont: string;
    fontSize: 'sm' | 'md' | 'lg';
    lineHeight: 'tight' | 'normal' | 'relaxed';
}

export interface TemplateLayout {
    columns: 1 | 2;
    sidebarPosition: 'left' | 'right' | 'none';
    sidebarWidth: number; // percentage
    headerStyle: 'banner' | 'compact' | 'sidebar' | 'centered';
    photoPosition: 'header' | 'sidebar' | 'none';
    photoShape: 'circle' | 'square' | 'rounded';
    photoSize: 'sm' | 'md' | 'lg';
}

export interface TemplateSettings {
    id: TemplateId;
    colors: TemplateColors;
    typography: TemplateTypography;
    layout: TemplateLayout;
    
    // Options d'affichage
    showIcons: boolean;
    showDates: boolean;
    showSkillBars: boolean;
    showSectionDividers: boolean;
    
    // Espacement
    sectionSpacing: 'compact' | 'normal' | 'relaxed';
    itemSpacing: 'compact' | 'normal' | 'relaxed';
    
    // Format
    pageSize: 'a4' | 'letter';
    margins: 'narrow' | 'normal' | 'wide';
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 15: Ordre des Sections
// ─────────────────────────────────────────────────────────────────────────────

export type SectionType = 
    | 'personal'
    | 'summary'
    | 'experience'
    | 'education'
    | 'skills'
    | 'languages'
    | 'projects'
    | 'certifications'
    | 'volunteer'
    | 'interests'
    | 'references'
    | 'publications'
    | 'awards'
    | 'custom';

export interface SectionConfig {
    type: SectionType;
    customSectionId?: string; // Pour les sections custom
    title: string; // Titre personnalisable
    visible: boolean;
    order: number;
    placement: 'main' | 'sidebar'; // Pour templates 2 colonnes
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 16: CV Data Principal
// ─────────────────────────────────────────────────────────────────────────────

export interface CVData {
    // Métadonnées
    id: string;
    name: string; // Nom du CV (ex: "CV Marketing 2024")
    createdAt: string;
    updatedAt: string;
    version: number;
    
    // Contenu
    personalInfo: PersonalInfo;
    experience: Experience[];
    education: Education[];
    skills: Skill[];
    skillCategories: SkillCategory[];
    languages: Language[];
    projects: Project[];
    certifications: Certification[];
    volunteer: Volunteer[];
    interests: Interest[];
    references: Reference[];
    publications: Publication[];
    awards: Award[];
    customSections: CustomSection[];
    
    // Configuration
    template: TemplateSettings;
    sectionsOrder: SectionConfig[];
    
    // Tags pour organisation
    tags?: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 17: Valeurs par Défaut
// ─────────────────────────────────────────────────────────────────────────────

export const DEFAULT_TEMPLATE_SETTINGS: TemplateSettings = {
    id: 'brutalist-nancy',
    colors: {
        primary: '#000000',
        secondary: '#BFFF00',
        accent: '#FF6B9D',
        text: '#000000',
        textLight: '#666666',
        background: '#FFFFFF',
        backgroundAlt: '#F5F5F5',
    },
    typography: {
        headingFont: 'Space Grotesk',
        bodyFont: 'Inter',
        fontSize: 'md',
        lineHeight: 'normal',
    },
    layout: {
        columns: 2,
        sidebarPosition: 'left',
        sidebarWidth: 35,
        headerStyle: 'banner',
        photoPosition: 'sidebar',
        photoShape: 'square',
        photoSize: 'md',
    },
    showIcons: true,
    showDates: true,
    showSkillBars: true,
    showSectionDividers: true,
    sectionSpacing: 'normal',
    itemSpacing: 'normal',
    pageSize: 'a4',
    margins: 'normal',
};

export const DEFAULT_SECTIONS_ORDER: SectionConfig[] = [
    { type: 'personal', title: 'Informations', visible: true, order: 0, placement: 'main' },
    { type: 'summary', title: 'Profil', visible: true, order: 1, placement: 'main' },
    { type: 'experience', title: 'Expériences', visible: true, order: 2, placement: 'main' },
    { type: 'education', title: 'Formation', visible: true, order: 3, placement: 'main' },
    { type: 'skills', title: 'Compétences', visible: true, order: 4, placement: 'sidebar' },
    { type: 'languages', title: 'Langues', visible: true, order: 5, placement: 'sidebar' },
    { type: 'projects', title: 'Projets', visible: true, order: 6, placement: 'main' },
    { type: 'certifications', title: 'Certifications', visible: false, order: 7, placement: 'sidebar' },
    { type: 'volunteer', title: 'Bénévolat', visible: false, order: 8, placement: 'main' },
    { type: 'interests', title: 'Centres d\'intérêt', visible: false, order: 9, placement: 'sidebar' },
    { type: 'references', title: 'Références', visible: false, order: 10, placement: 'main' },
    { type: 'publications', title: 'Publications', visible: false, order: 11, placement: 'main' },
    { type: 'awards', title: 'Distinctions', visible: false, order: 12, placement: 'main' },
];

export const createDefaultPersonalInfo = (): PersonalInfo => ({
    photo: undefined,
    firstName: '',
    lastName: '',
    jobTitle: '',
    headline: '',
    email: '',
    phone: '',
    secondaryPhone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    website: '',
    socialLinks: [],
    dateOfBirth: '',
    nationality: '',
    drivingLicenses: [],
    summary: '',
});

export const createDefaultCVData = (): CVData => ({
    id: uuidv4(),
    name: 'Mon CV',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1,
    
    personalInfo: createDefaultPersonalInfo(),
    experience: [],
    education: [],
    skills: [],
    skillCategories: [],
    languages: [],
    projects: [],
    certifications: [],
    volunteer: [],
    interests: [],
    references: [],
    publications: [],
    awards: [],
    customSections: [],
    
    template: DEFAULT_TEMPLATE_SETTINGS,
    sectionsOrder: DEFAULT_SECTIONS_ORDER,
    
    tags: [],
});

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 18: Factory Functions (Création d'items)
// ─────────────────────────────────────────────────────────────────────────────

export const createExperience = (order: number = 0): Experience => ({
    id: uuidv4(),
    title: '',
    company: '',
    companyLogo: undefined,
    location: '',
    remote: 'onsite',
    startDate: '',
    endDate: '',
    current: false,
    contractType: 'cdi',
    description: '',
    highlights: [],
    technologies: [],
    order,
    visible: true,
});

export const createEducation = (order: number = 0): Education => ({
    id: uuidv4(),
    school: '',
    schoolLogo: undefined,
    location: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    current: false,
    grade: '',
    gpa: '',
    description: '',
    relevantCourses: [],
    order,
    visible: true,
});

export const createSkill = (): Skill => ({
    id: uuidv4(),
    name: '',
    level: 5,
    category: undefined,
    keywords: [],
    yearsOfExperience: undefined,
    visible: true,
});

export const createLanguage = (): Language => ({
    id: uuidv4(),
    name: '',
    level: 'B1',
    certification: undefined,
    certificationScore: undefined,
    visible: true,
});

export const createProject = (order: number = 0): Project => ({
    id: uuidv4(),
    name: '',
    role: '',
    description: '',
    highlights: [],
    url: '',
    repoUrl: '',
    technologies: [],
    thumbnail: undefined,
    images: [],
    startDate: undefined,
    endDate: undefined,
    current: false,
    context: 'personal',
    order,
    visible: true,
});

export const createCertification = (order: number = 0): Certification => ({
    id: uuidv4(),
    name: '',
    issuer: '',
    issuerLogo: undefined,
    date: '',
    issueDate: '',
    expiryDate: undefined,
    doesNotExpire: true,
    credentialId: '',
    credentialUrl: '',
    score: undefined,
    description: undefined,
    order,
    visible: true,
});

export const createVolunteer = (order: number = 0): Volunteer => ({
    id: uuidv4(),
    organization: '',
    role: '',
    cause: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    highlights: [],
    order,
    visible: true,
});

export const createInterest = (): Interest => ({
    id: uuidv4(),
    name: '',
    icon: undefined,
    category: undefined,
    description: undefined,
    visible: true,
});

export const createReference = (): Reference => ({
    id: uuidv4(),
    name: '',
    position: '',
    title: '',
    company: '',
    relationship: '',
    email: '',
    phone: '',
    linkedin: '',
    hideContact: false,
    hideContactInfo: false,
    testimonial: '',
    visible: true,
});

export const createPublication = (order: number = 0): Publication => ({
    id: uuidv4(),
    title: '',
    publisher: '',
    date: '',
    url: '',
    description: '',
    authors: [],
    order,
    visible: true,
});

export const createAward = (order: number = 0): Award => ({
    id: uuidv4(),
    title: '',
    issuer: '',
    date: '',
    description: '',
    order,
    visible: true,
});

export const createSocialLink = (platform: SocialLink['platform'] = 'linkedin'): SocialLink => ({
    id: uuidv4(),
    platform,
    url: '',
    label: undefined,
});

export const createCustomSection = (order: number = 0): CustomSection => ({
    id: uuidv4(),
    name: 'Nouvelle section',
    title: 'Nouvelle section',
    icon: undefined,
    items: [],
    order,
    visible: true,
});

export const createCustomSectionItem = (): CustomSectionItem => ({
    id: uuidv4(),
    title: '',
    subtitle: '',
    date: '',
    location: '',
    description: '',
    url: '',
    visible: true,
});

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 19: Type Guards
// ─────────────────────────────────────────────────────────────────────────────

export const isCVData = (obj: unknown): obj is CVData => {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'id' in obj &&
        'personalInfo' in obj &&
        'experience' in obj &&
        'education' in obj
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 20: Export JSON Schema Version
// ─────────────────────────────────────────────────────────────────────────────

export const CV_SCHEMA_VERSION = '2.0.0';

export interface CVExport {
    schemaVersion: string;
    exportedAt: string;
    generator: 'nancy-cv';
    data: CVData;
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 21: Backward Compatibility Aliases (for legacy components)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @deprecated Use CVData instead
 */
export type CvData = CVData;

/**
 * @deprecated Use Experience instead
 */
export type ExperienceItem = Experience;

/**
 * @deprecated Use Education instead
 */
export type EducationItem = Education;

/**
 * @deprecated Use Skill instead
 */
export type SkillItem = Skill;

/**
 * @deprecated Use Language instead
 */
export type LanguageItem = Language;
