// ============================================================================
// NANCY CV - Store Zustand avec Persistance & Undo/Redo
// ============================================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { temporal } from 'zundo';
import { 
    CVData,
    CVExport,
    CV_SCHEMA_VERSION,
    TemplateSettings,
    PersonalInfo,
    Experience,
    Education,
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
    SectionConfig,
    SocialLink,
    createDefaultCVData,
    createExperience,
    createEducation,
    createSkill,
    createLanguage,
    createProject,
    createCertification,
    createVolunteer,
    createInterest,
    createReference,
    createPublication,
    createAward,
    createSocialLink,
    createCustomSection,
    createCustomSectionItem,
    isCVData,
    DEFAULT_SECTIONS_ORDER,
} from '../types/cv';

// ─────────────────────────────────────────────────────────────────────────────
// Types du Store
// ─────────────────────────────────────────────────────────────────────────────

interface CVStore {
    // ===== STATE =====
    cv: CVData;
    savedCVs: CVData[]; // Liste des CVs sauvegardés
    activeCVId: string | null;
    isDirty: boolean; // Modifications non sauvegardées
    
    // UI State
    activeSection: string;
    previewZoom: number;
    showPreview: boolean;
    
    // ===== ACTIONS: CV Management =====
    createNewCV: (name?: string) => void;
    loadCV: (id: string) => void;
    saveCV: () => void;
    deleteCV: (id: string) => void;
    duplicateCV: (id: string) => void;
    renameCV: (name: string) => void;
    
    // ===== ACTIONS: Import/Export =====
    exportToJSON: () => CVExport;
    importFromJSON: (data: CVExport | CVData) => boolean;
    importCV: (data: CVExport) => void; // Alias for importFromJSON
    loadSampleData: () => void;
    resetCV: () => void;
    clearCV: () => void; // Alias for resetCV
    
    // ===== ACTIONS: Personal Info =====
    updatePersonalInfo: <K extends keyof PersonalInfo>(field: K, value: PersonalInfo[K]) => void;
    updatePhoto: (photo: string | undefined) => void;
    addSocialLink: (platform?: SocialLink['platform']) => void;
    updateSocialLink: (id: string, data: Partial<SocialLink>) => void;
    removeSocialLink: (id: string) => void;
    
    // ===== ACTIONS: Experience =====
    addExperience: () => void;
    updateExperience: (id: string, data: Partial<Experience>) => void;
    removeExperience: (id: string) => void;
    reorderExperience: (fromIndex: number, toIndex: number) => void;
    addExperienceHighlight: (expId: string) => void;
    updateExperienceHighlight: (expId: string, index: number, value: string) => void;
    removeExperienceHighlight: (expId: string, index: number) => void;
    
    // ===== ACTIONS: Education =====
    addEducation: () => void;
    updateEducation: (id: string, data: Partial<Education>) => void;
    removeEducation: (id: string) => void;
    reorderEducation: (fromIndex: number, toIndex: number) => void;
    
    // ===== ACTIONS: Skills =====
    addSkill: () => void;
    updateSkill: (id: string, data: Partial<Skill>) => void;
    removeSkill: (id: string) => void;
    
    // ===== ACTIONS: Languages =====
    addLanguage: () => void;
    updateLanguage: (id: string, data: Partial<Language>) => void;
    removeLanguage: (id: string) => void;
    
    // ===== ACTIONS: Projects =====
    addProject: () => void;
    updateProject: (id: string, data: Partial<Project>) => void;
    removeProject: (id: string) => void;
    reorderProjects: (fromIndex: number, toIndex: number) => void;
    
    // ===== ACTIONS: Certifications =====
    addCertification: () => void;
    updateCertification: (id: string, data: Partial<Certification>) => void;
    removeCertification: (id: string) => void;
    
    // ===== ACTIONS: Volunteer =====
    addVolunteer: () => void;
    updateVolunteer: (id: string, data: Partial<Volunteer>) => void;
    removeVolunteer: (id: string) => void;
    
    // ===== ACTIONS: Interests =====
    addInterest: () => void;
    updateInterest: (id: string, data: Partial<Interest>) => void;
    removeInterest: (id: string) => void;
    
    // ===== ACTIONS: References =====
    addReference: () => void;
    updateReference: (id: string, data: Partial<Reference>) => void;
    removeReference: (id: string) => void;
    
    // ===== ACTIONS: Publications =====
    addPublication: () => void;
    updatePublication: (id: string, data: Partial<Publication>) => void;
    removePublication: (id: string) => void;
    
    // ===== ACTIONS: Awards =====
    addAward: () => void;
    updateAward: (id: string, data: Partial<Award>) => void;
    removeAward: (id: string) => void;
    
    // ===== ACTIONS: Custom Sections =====
    addCustomSection: () => void;
    updateCustomSection: (id: string, data: Partial<CustomSection>) => void;
    removeCustomSection: (id: string) => void;
    addCustomSectionItem: (sectionId: string) => void;
    updateCustomSectionItem: (sectionId: string, itemId: string, data: Partial<any>) => void;
    removeCustomSectionItem: (sectionId: string, itemId: string) => void;
    
    // ===== ACTIONS: Template & Layout =====
    updateTemplate: (settings: Partial<TemplateSettings>) => void;
    updateTemplateColors: (colors: Partial<TemplateSettings['colors']>) => void;
    updateTemplateTypography: (typography: Partial<TemplateSettings['typography']>) => void;
    updateTemplateLayout: (layout: Partial<TemplateSettings['layout']>) => void;
    applyPresetTemplate: (presetId: string) => void;
    
    // ===== ACTIONS: Sections Order =====
    updateSectionConfig: (type: string, config: Partial<SectionConfig>) => void;
    reorderSections: (fromIndex: number, toIndex: number) => void;
    toggleSectionVisibility: (type: string) => void;
    
    // ===== ACTIONS: UI =====
    setActiveSection: (section: string) => void;
    setPreviewZoom: (zoom: number) => void;
    setShowPreview: (show: boolean) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Sample Data
// ─────────────────────────────────────────────────────────────────────────────

const SAMPLE_CV_DATA: Partial<CVData> = {
    personalInfo: {
        photo: undefined,
        firstName: 'Marie',
        lastName: 'Dubois',
        jobTitle: 'Développeuse Full Stack',
        headline: 'Passionnée par le code propre et les interfaces utilisateur innovantes',
        email: 'marie.dubois@email.com',
        phone: '+33 6 12 34 56 78',
        secondaryPhone: '',
        address: '15 Rue de la République',
        city: 'Paris',
        postalCode: '75001',
        country: 'France',
        website: 'www.mariedubois.dev',
        socialLinks: [
            { id: '1', platform: 'linkedin', url: 'linkedin.com/in/mariedubois' },
            { id: '2', platform: 'github', url: 'github.com/mariedubois' },
        ],
        dateOfBirth: '',
        nationality: 'Française',
        drivingLicenses: ['B'],
        summary: 'Développeuse passionnée avec 5 ans d\'expérience dans la création d\'applications web modernes. Spécialisée en React, Node.js et TypeScript. J\'aime résoudre des problèmes complexes et créer des expériences utilisateur exceptionnelles.',
    },
    experience: [
        {
            id: '1',
            title: 'Développeuse Full Stack Senior',
            company: 'TechStart Paris',
            companyLogo: undefined,
            location: 'Paris, France',
            remote: 'hybrid',
            startDate: '2022-01',
            endDate: '',
            current: true,
            contractType: 'cdi',
            description: 'Lead technique d\'une équipe de 4 développeurs sur des projets web innovants.',
            highlights: [
                'Développement d\'applications web avec React et Node.js',
                'Mise en place d\'architectures microservices',
                'Réduction de 40% du temps de chargement des applications',
                'Mentorat de développeurs juniors',
            ],
            technologies: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker'],
            order: 0,
            visible: true,
        },
        {
            id: '2',
            title: 'Développeuse Frontend',
            company: 'Digital Agency Lyon',
            companyLogo: undefined,
            location: 'Lyon, France',
            remote: 'onsite',
            startDate: '2020-03',
            endDate: '2021-12',
            current: false,
            contractType: 'cdi',
            description: 'Création d\'interfaces utilisateur pour des clients variés.',
            highlights: [
                'Création d\'interfaces utilisateur avec Vue.js et React',
                'Intégration de designs responsive et accessibles',
                'Développement de composants réutilisables',
            ],
            technologies: ['Vue.js', 'React', 'Tailwind CSS', 'JavaScript'],
            order: 1,
            visible: true,
        },
    ],
    education: [
        {
            id: '1',
            school: 'Université Paris-Saclay',
            schoolLogo: undefined,
            location: 'Paris, France',
            degree: 'Master',
            field: 'Informatique - Développement Logiciel',
            startDate: '2017',
            endDate: '2019',
            current: false,
            grade: 'Mention Très Bien',
            gpa: '',
            description: 'Spécialisation en développement web et mobile. Major de promotion.',
            relevantCourses: ['Architecture logicielle', 'UX Design', 'DevOps'],
            order: 0,
            visible: true,
        },
    ],
    skills: [
        { id: '1', name: 'React', level: 10, category: 'Frontend', visible: true },
        { id: '2', name: 'TypeScript', level: 9, category: 'Frontend', visible: true },
        { id: '3', name: 'Node.js', level: 8, category: 'Backend', visible: true },
        { id: '4', name: 'Python', level: 7, category: 'Backend', visible: true },
        { id: '5', name: 'PostgreSQL', level: 7, category: 'Database', visible: true },
        { id: '6', name: 'Docker', level: 6, category: 'DevOps', visible: true },
    ],
    languages: [
        { id: '1', name: 'Français', level: 'native', visible: true },
        { id: '2', name: 'Anglais', level: 'C1', certification: 'TOEIC', certificationScore: '945', visible: true },
        { id: '3', name: 'Espagnol', level: 'B1', visible: true },
    ],
    projects: [
        {
            id: '1',
            name: 'E-commerce Platform',
            role: 'Lead Developer',
            description: 'Plateforme e-commerce complète avec paiement Stripe.',
            highlights: ['Gestion des stocks en temps réel', 'Dashboard admin complet'],
            url: 'https://demo-shop.com',
            repoUrl: 'github.com/mariedubois/ecommerce',
            technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
            context: 'personal',
            order: 0,
            visible: true,
        },
    ],
    interests: [
        { id: '1', name: 'Photographie', description: 'Street photography', visible: true },
        { id: '2', name: 'Voyages', description: 'Découverte de nouvelles cultures', visible: true },
        { id: '3', name: 'Open Source', description: 'Contribution à des projets OSS', visible: true },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const reorderArray = <T>(arr: T[], fromIndex: number, toIndex: number): T[] => {
    const result = [...arr];
    const [removed] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, removed);
    return result;
};

const updateItemInArray = <T extends { id: string }>(
    arr: T[],
    id: string,
    updates: Partial<T>
): T[] => arr.map((item) => (item.id === id ? { ...item, ...updates } : item));

const removeItemFromArray = <T extends { id: string }>(arr: T[], id: string): T[] =>
    arr.filter((item) => item.id !== id);

// ─────────────────────────────────────────────────────────────────────────────
// Store Principal
// ─────────────────────────────────────────────────────────────────────────────

export const useCVStore = create<CVStore>()(
    temporal(
        persist(
            (set, get) => ({
                // ===== INITIAL STATE =====
                cv: createDefaultCVData(),
                savedCVs: [],
                activeCVId: null,
                isDirty: false,
                
                activeSection: 'personal',
                previewZoom: 100,
                showPreview: true,
                
                // ===== CV MANAGEMENT =====
                createNewCV: (name) => {
                    const newCV = createDefaultCVData();
                    if (name) newCV.name = name;
                    set({ cv: newCV, activeCVId: newCV.id, isDirty: false });
                },
                
                loadCV: (id) => {
                    const cv = get().savedCVs.find((c) => c.id === id);
                    if (cv) {
                        set({ cv: { ...cv }, activeCVId: id, isDirty: false });
                    }
                },
                
                saveCV: () => {
                    const { cv, savedCVs } = get();
                    const updatedCV = { ...cv, updatedAt: new Date().toISOString() };
                    const existingIndex = savedCVs.findIndex((c) => c.id === cv.id);
                    
                    if (existingIndex >= 0) {
                        const updated = [...savedCVs];
                        updated[existingIndex] = updatedCV;
                        set({ savedCVs: updated, cv: updatedCV, isDirty: false });
                    } else {
                        set({ savedCVs: [...savedCVs, updatedCV], cv: updatedCV, isDirty: false });
                    }
                },
                
                deleteCV: (id) => {
                    set((state) => ({
                        savedCVs: state.savedCVs.filter((c) => c.id !== id),
                        activeCVId: state.activeCVId === id ? null : state.activeCVId,
                    }));
                },
                
                duplicateCV: (id) => {
                    const cv = get().savedCVs.find((c) => c.id === id);
                    if (cv) {
                        const duplicated: CVData = {
                            ...cv,
                            id: crypto.randomUUID(),
                            name: `${cv.name} (copie)`,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        };
                        set((state) => ({ savedCVs: [...state.savedCVs, duplicated] }));
                    }
                },
                
                renameCV: (name) => {
                    set((state) => ({
                        cv: { ...state.cv, name },
                        isDirty: true,
                    }));
                },
                
                // ===== IMPORT/EXPORT =====
                exportToJSON: () => {
                    const { cv } = get();
                    return {
                        schemaVersion: CV_SCHEMA_VERSION,
                        exportedAt: new Date().toISOString(),
                        generator: 'nancy-cv',
                        data: cv,
                    };
                },
                
                importFromJSON: (data) => {
                    try {
                        let cvData: CVData;
                        
                        // Handle both CVExport and direct CVData formats
                        if ('data' in data && 'schemaVersion' in data) {
                            cvData = (data as CVExport).data;
                        } else if (isCVData(data)) {
                            cvData = data;
                        } else {
                            return false;
                        }
                        
                        // Assign new ID to prevent conflicts
                        const importedCV: CVData = {
                            ...cvData,
                            id: crypto.randomUUID(),
                            updatedAt: new Date().toISOString(),
                        };
                        
                        set({ cv: importedCV, activeCVId: importedCV.id, isDirty: true });
                        return true;
                    } catch {
                        return false;
                    }
                },
                
                loadSampleData: () => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            ...SAMPLE_CV_DATA,
                            updatedAt: new Date().toISOString(),
                        },
                        isDirty: true,
                    }));
                },
                
                resetCV: () => {
                    const newCV = createDefaultCVData();
                    set({ cv: newCV, isDirty: false });
                },
                
                // Alias for resetCV
                clearCV: () => {
                    const newCV = createDefaultCVData();
                    set({ cv: newCV, isDirty: false });
                },
                
                // Alias for importFromJSON
                importCV: (data) => {
                    try {
                        let cvData: CVData;
                        
                        if ('data' in data && 'schemaVersion' in data) {
                            cvData = (data as CVExport).data;
                        } else if (isCVData(data)) {
                            cvData = data as CVData;
                        } else {
                            return;
                        }
                        
                        const importedCV: CVData = {
                            ...cvData,
                            id: crypto.randomUUID(),
                            updatedAt: new Date().toISOString(),
                        };
                        
                        set({ cv: importedCV, activeCVId: importedCV.id, isDirty: true });
                    } catch {
                        // Silent fail
                    }
                },
                
                // 
                
                // ===== PERSONAL INFO =====
                updatePersonalInfo: (field, value) => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            personalInfo: { ...state.cv.personalInfo, [field]: value },
                            updatedAt: new Date().toISOString(),
                        },
                        isDirty: true,
                    }));
                },
                
                updatePhoto: (photo) => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            personalInfo: { ...state.cv.personalInfo, photo },
                            updatedAt: new Date().toISOString(),
                        },
                        isDirty: true,
                    }));
                },
                
                addSocialLink: (platform = 'linkedin') => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            personalInfo: {
                                ...state.cv.personalInfo,
                                socialLinks: [...state.cv.personalInfo.socialLinks, createSocialLink(platform)],
                            },
                        },
                        isDirty: true,
                    }));
                },
                
                updateSocialLink: (id, data) => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            personalInfo: {
                                ...state.cv.personalInfo,
                                socialLinks: updateItemInArray(state.cv.personalInfo.socialLinks, id, data),
                            },
                        },
                        isDirty: true,
                    }));
                },
                
                removeSocialLink: (id) => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            personalInfo: {
                                ...state.cv.personalInfo,
                                socialLinks: removeItemFromArray(state.cv.personalInfo.socialLinks, id),
                            },
                        },
                        isDirty: true,
                    }));
                },
                
                // ===== EXPERIENCE =====
                addExperience: () => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            experience: [...state.cv.experience, createExperience(state.cv.experience.length)],
                        },
                        isDirty: true,
                    }));
                },
                
                updateExperience: (id, data) => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            experience: updateItemInArray(state.cv.experience, id, data),
                        },
                        isDirty: true,
                    }));
                },
                
                removeExperience: (id) => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            experience: removeItemFromArray(state.cv.experience, id),
                        },
                        isDirty: true,
                    }));
                },
                
                reorderExperience: (fromIndex, toIndex) => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            experience: reorderArray(state.cv.experience, fromIndex, toIndex),
                        },
                        isDirty: true,
                    }));
                },
                
                addExperienceHighlight: (expId) => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            experience: state.cv.experience.map((exp) =>
                                exp.id === expId
                                    ? { ...exp, highlights: [...(exp.highlights || []), ''] }
                                    : exp
                            ),
                        },
                        isDirty: true,
                    }));
                },
                
                updateExperienceHighlight: (expId, index, value) => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            experience: state.cv.experience.map((exp) =>
                                exp.id === expId
                                    ? {
                                        ...exp,
                                        highlights: (exp.highlights || []).map((h, i) => (i === index ? value : h)),
                                    }
                                    : exp
                            ),
                        },
                        isDirty: true,
                    }));
                },
                
                removeExperienceHighlight: (expId, index) => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            experience: state.cv.experience.map((exp) =>
                                exp.id === expId
                                    ? { ...exp, highlights: (exp.highlights || []).filter((_, i) => i !== index) }
                                    : exp
                            ),
                        },
                        isDirty: true,
                    }));
                },
                
                // ===== EDUCATION =====
                addEducation: () => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            education: [...state.cv.education, createEducation(state.cv.education.length)],
                        },
                        isDirty: true,
                    }));
                },
                
                updateEducation: (id, data) => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            education: updateItemInArray(state.cv.education, id, data),
                        },
                        isDirty: true,
                    }));
                },
                
                removeEducation: (id) => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            education: removeItemFromArray(state.cv.education, id),
                        },
                        isDirty: true,
                    }));
                },
                
                reorderEducation: (fromIndex, toIndex) => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            education: reorderArray(state.cv.education, fromIndex, toIndex),
                        },
                        isDirty: true,
                    }));
                },
                
                // ===== SKILLS =====
                addSkill: () => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            skills: [...state.cv.skills, createSkill()],
                        },
                        isDirty: true,
                    }));
                },
                
                updateSkill: (id, data) => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            skills: updateItemInArray(state.cv.skills, id, data),
                        },
                        isDirty: true,
                    }));
                },
                
                removeSkill: (id) => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            skills: removeItemFromArray(state.cv.skills, id),
                        },
                        isDirty: true,
                    }));
                },
                
                // ===== LANGUAGES =====
                addLanguage: () => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            languages: [...state.cv.languages, createLanguage()],
                        },
                        isDirty: true,
                    }));
                },
                
                updateLanguage: (id, data) => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            languages: updateItemInArray(state.cv.languages, id, data),
                        },
                        isDirty: true,
                    }));
                },
                
                removeLanguage: (id) => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            languages: removeItemFromArray(state.cv.languages, id),
                        },
                        isDirty: true,
                    }));
                },
                
                // ===== PROJECTS =====
                addProject: () => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            projects: [...state.cv.projects, createProject(state.cv.projects.length)],
                        },
                        isDirty: true,
                    }));
                },
                
                updateProject: (id, data) => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            projects: updateItemInArray(state.cv.projects, id, data),
                        },
                        isDirty: true,
                    }));
                },
                
                removeProject: (id) => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            projects: removeItemFromArray(state.cv.projects, id),
                        },
                        isDirty: true,
                    }));
                },
                
                reorderProjects: (fromIndex, toIndex) => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            projects: reorderArray(state.cv.projects, fromIndex, toIndex),
                        },
                        isDirty: true,
                    }));
                },
                
                // ===== CERTIFICATIONS =====
                addCertification: () => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            certifications: [...state.cv.certifications, createCertification(state.cv.certifications.length)],
                        },
                        isDirty: true,
                    }));
                },
                
                updateCertification: (id, data) => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            certifications: updateItemInArray(state.cv.certifications, id, data),
                        },
                        isDirty: true,
                    }));
                },
                
                removeCertification: (id) => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            certifications: removeItemFromArray(state.cv.certifications, id),
                        },
                        isDirty: true,
                    }));
                },
                
                // ===== VOLUNTEER =====
                addVolunteer: () => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            volunteer: [...state.cv.volunteer, createVolunteer(state.cv.volunteer.length)],
                        },
                        isDirty: true,
                    }));
                },
                
                updateVolunteer: (id, data) => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            volunteer: updateItemInArray(state.cv.volunteer, id, data),
                        },
                        isDirty: true,
                    }));
                },
                
                removeVolunteer: (id) => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            volunteer: removeItemFromArray(state.cv.volunteer, id),
                        },
                        isDirty: true,
                    }));
                },
                
                // ===== INTERESTS =====
                addInterest: () => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            interests: [...state.cv.interests, createInterest()],
                        },
                        isDirty: true,
                    }));
                },
                
                updateInterest: (id, data) => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            interests: updateItemInArray(state.cv.interests, id, data),
                        },
                        isDirty: true,
                    }));
                },
                
                removeInterest: (id) => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            interests: removeItemFromArray(state.cv.interests, id),
                        },
                        isDirty: true,
                    }));
                },
                
                // ===== REFERENCES =====
                addReference: () => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            references: [...state.cv.references, createReference()],
                        },
                        isDirty: true,
                    }));
                },
                
                updateReference: (id, data) => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            references: updateItemInArray(state.cv.references, id, data),
                        },
                        isDirty: true,
                    }));
                },
                
                removeReference: (id) => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            references: removeItemFromArray(state.cv.references, id),
                        },
                        isDirty: true,
                    }));
                },
                
                // ===== PUBLICATIONS =====
                addPublication: () => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            publications: [...state.cv.publications, createPublication(state.cv.publications.length)],
                        },
                        isDirty: true,
                    }));
                },
                
                updatePublication: (id, data) => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            publications: updateItemInArray(state.cv.publications, id, data),
                        },
                        isDirty: true,
                    }));
                },
                
                removePublication: (id) => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            publications: removeItemFromArray(state.cv.publications, id),
                        },
                        isDirty: true,
                    }));
                },
                
                // ===== AWARDS =====
                addAward: () => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            awards: [...state.cv.awards, createAward(state.cv.awards.length)],
                        },
                        isDirty: true,
                    }));
                },
                
                updateAward: (id, data) => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            awards: updateItemInArray(state.cv.awards, id, data),
                        },
                        isDirty: true,
                    }));
                },
                
                removeAward: (id) => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            awards: removeItemFromArray(state.cv.awards, id),
                        },
                        isDirty: true,
                    }));
                },
                
                // ===== CUSTOM SECTIONS =====
                addCustomSection: () => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            customSections: [...state.cv.customSections, createCustomSection(state.cv.customSections.length)],
                        },
                        isDirty: true,
                    }));
                },
                
                updateCustomSection: (id, data) => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            customSections: updateItemInArray(state.cv.customSections, id, data),
                        },
                        isDirty: true,
                    }));
                },
                
                removeCustomSection: (id) => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            customSections: removeItemFromArray(state.cv.customSections, id),
                        },
                        isDirty: true,
                    }));
                },
                
                addCustomSectionItem: (sectionId) => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            customSections: state.cv.customSections.map((s) =>
                                s.id === sectionId
                                    ? { ...s, items: [...s.items, createCustomSectionItem()] }
                                    : s
                            ),
                        },
                        isDirty: true,
                    }));
                },
                
                updateCustomSectionItem: (sectionId, itemId, data) => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            customSections: state.cv.customSections.map((s) =>
                                s.id === sectionId
                                    ? { ...s, items: updateItemInArray(s.items, itemId, data) }
                                    : s
                            ),
                        },
                        isDirty: true,
                    }));
                },
                
                removeCustomSectionItem: (sectionId, itemId) => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            customSections: state.cv.customSections.map((s) =>
                                s.id === sectionId
                                    ? { ...s, items: removeItemFromArray(s.items, itemId) }
                                    : s
                            ),
                        },
                        isDirty: true,
                    }));
                },
                
                // ===== TEMPLATE =====
                updateTemplate: (settings) => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            template: { ...state.cv.template, ...settings },
                        },
                        isDirty: true,
                    }));
                },
                
                updateTemplateColors: (colors) => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            template: {
                                ...state.cv.template,
                                colors: { ...state.cv.template.colors, ...colors },
                            },
                        },
                        isDirty: true,
                    }));
                },
                
                updateTemplateTypography: (typography) => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            template: {
                                ...state.cv.template,
                                typography: { ...state.cv.template.typography, ...typography },
                            },
                        },
                        isDirty: true,
                    }));
                },
                
                updateTemplateLayout: (layout) => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            template: {
                                ...state.cv.template,
                                layout: { ...state.cv.template.layout, ...layout },
                            },
                        },
                        isDirty: true,
                    }));
                },
                
                applyPresetTemplate: (presetId) => {
                    // TODO: Implement preset templates
                    console.log('Applying preset:', presetId);
                },
                
                // ===== SECTIONS ORDER =====
                updateSectionConfig: (type, config) => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            sectionsOrder: state.cv.sectionsOrder.map((s) =>
                                s.type === type ? { ...s, ...config } : s
                            ),
                        },
                        isDirty: true,
                    }));
                },
                
                reorderSections: (fromIndex, toIndex) => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            sectionsOrder: reorderArray(state.cv.sectionsOrder, fromIndex, toIndex),
                        },
                        isDirty: true,
                    }));
                },
                
                toggleSectionVisibility: (type) => {
                    set((state) => ({
                        cv: {
                            ...state.cv,
                            sectionsOrder: state.cv.sectionsOrder.map((s) =>
                                s.type === type ? { ...s, visible: !s.visible } : s
                            ),
                        },
                        isDirty: true,
                    }));
                },
                
                // ===== UI =====
                setActiveSection: (section) => set({ activeSection: section }),
                setPreviewZoom: (zoom) => set({ previewZoom: Math.max(25, Math.min(200, zoom)) }),
                setShowPreview: (show) => set({ showPreview: show }),
            }),
            {
                name: 'nancy-cv-storage',
                storage: createJSONStorage(() => localStorage),
                version: 3, // Incrémenté pour forcer la migration
                partialize: (state) => ({
                    cv: state.cv,
                    savedCVs: state.savedCVs,
                    activeCVId: state.activeCVId,
                }),
                // Migration des anciennes données du localStorage
                migrate: (persistedState: any, version: number) => {
                    // Toujours s'assurer que sectionsOrder existe et est valide
                    if (persistedState?.cv) {
                        if (!persistedState.cv.sectionsOrder || !Array.isArray(persistedState.cv.sectionsOrder) || persistedState.cv.sectionsOrder.length === 0) {
                            persistedState.cv.sectionsOrder = [...DEFAULT_SECTIONS_ORDER];
                        }
                        // S'assurer que les arrays existent
                        if (!persistedState.cv.interests) persistedState.cv.interests = [];
                        if (!persistedState.cv.projects) persistedState.cv.projects = [];
                        if (!persistedState.cv.certifications) persistedState.cv.certifications = [];
                        if (!persistedState.cv.volunteer) persistedState.cv.volunteer = [];
                        if (!persistedState.cv.references) persistedState.cv.references = [];
                        if (!persistedState.cv.publications) persistedState.cv.publications = [];
                        if (!persistedState.cv.awards) persistedState.cv.awards = [];
                        if (!persistedState.cv.customSections) persistedState.cv.customSections = [];
                        if (!persistedState.cv.skillCategories) persistedState.cv.skillCategories = [];
                    }
                    return persistedState;
                },
                // Vérification post-réhydratation pour s'assurer que sectionsOrder est toujours valide
                onRehydrateStorage: () => (state, error) => {
                    if (error) {
                        console.error('Erreur de réhydratation du store:', error);
                        return;
                    }
                    if (state && state.cv) {
                        // Double vérification après réhydratation
                        if (!state.cv.sectionsOrder || !Array.isArray(state.cv.sectionsOrder) || state.cv.sectionsOrder.length === 0) {
                            state.cv.sectionsOrder = [...DEFAULT_SECTIONS_ORDER];
                        }
                    }
                },
            }
        ),
        {
            limit: 50, // Undo history limit
            partialize: (state) => {
                // Protection contre state.cv undefined pendant l'initialisation
                if (!state || !state.cv) return {};
                return { cv: state.cv };
            },
        }
    )
);

// ─────────────────────────────────────────────────────────────────────────────
// Selectors
// ─────────────────────────────────────────────────────────────────────────────

export const useCV = () => useCVStore((state) => state.cv);
export const usePersonalInfo = () => useCVStore((state) => state.cv.personalInfo);
export const useExperience = () => useCVStore((state) => state.cv.experience);
export const useEducation = () => useCVStore((state) => state.cv.education);
export const useSkills = () => useCVStore((state) => state.cv.skills);
export const useLanguages = () => useCVStore((state) => state.cv.languages);
export const useProjects = () => useCVStore((state) => state.cv.projects);
export const useCertifications = () => useCVStore((state) => state.cv.certifications);
export const useTemplateSettings = () => useCVStore((state) => state.cv.template);
export const useSectionsOrder = () => useCVStore((state) => state.cv.sectionsOrder);

// Undo/Redo hooks
export const useTemporalStore = () => {
    const temporal = useCVStore.temporal;
    const store = temporal.getState();
    return {
        undo: store.undo,
        redo: store.redo,
        clear: store.clear,
        pastStates: store.pastStates,
        futureStates: store.futureStates,
    };
};
