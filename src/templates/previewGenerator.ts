// ============================================================================
// NANCY CV - Template Preview Generator
// Génère des images de preview pour les templates
// ============================================================================

import html2canvas from 'html2canvas';
import { CVData, DEFAULT_SECTIONS_ORDER, DEFAULT_TEMPLATE_SETTINGS } from '../types/cv';
import { TemplateConfig } from './types';

// Type alias for backwards compatibility
type CvData = CVData;

// ─────────────────────────────────────────────────────────────────────────────
// Sample CV Data for Preview Generation
// ─────────────────────────────────────────────────────────────────────────────

export const SAMPLE_CV_DATA: Partial<CvData> = {
    id: 'preview-sample',
    name: 'Preview Sample',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1,
    personalInfo: {
        photo: '',
        firstName: 'Alexandre',
        lastName: 'Dubois',
        jobTitle: 'Directeur Marketing Digital',
        headline: '',
        address: 'Paris, France',
        city: 'Paris',
        postalCode: '75001',
        country: 'France',
        phone: '+33 6 12 34 56 78',
        email: 'alexandre.dubois@email.com',
        website: '',
        socialLinks: [],
        summary: 'Directeur Marketing Digital avec plus de 12 ans d\'experience dans la transformation numerique d\'entreprises B2B et B2C.',
        description: 'Directeur Marketing Digital avec plus de 12 ans d\'experience dans la transformation numerique d\'entreprises B2B et B2C. Expert en strategie d\'acquisition et growth hacking.',
    },
    education: [
        {
            id: 'edu-1',
            degree: 'MBA Marketing & Stratégie Digitale',
            school: 'HEC Paris',
            startDate: '2010',
            endDate: '2012',
            description: 'Spécialisation en transformation digitale.',
        },
        {
            id: 'edu-2',
            degree: 'Master en Communication',
            school: 'Sciences Po Paris',
            startDate: '2007',
            endDate: '2010',
            description: '',
        },
    ],
    experience: [
        {
            id: 'exp-1',
            title: 'Directeur Marketing Digital',
            company: 'TechCorp France',
            startDate: '2020',
            endDate: 'Présent',
            description: '• Direction d\'une équipe de 25 personnes\n• Augmentation du CA digital de 180%',
        },
        {
            id: 'exp-2',
            title: 'Head of Growth',
            company: 'StartupLab',
            startDate: '2016',
            endDate: '2020',
            description: '• Croissance de 0 à 500K utilisateurs',
        },
    ],
    skills: [
        { id: 'sk-1', name: 'Marketing Digital', level: 10 },
        { id: 'sk-2', name: 'Google Ads', level: 9 },
        { id: 'sk-3', name: 'SEO / SEA', level: 9 },
        { id: 'sk-4', name: 'Analytics', level: 8 },
        { id: 'sk-5', name: 'Management', level: 9 },
    ],
    languages: [
        { id: 'lang-1', name: 'Francais', level: 5 },
        { id: 'lang-2', name: 'Anglais', level: 5 },
        { id: 'lang-3', name: 'Espagnol', level: 3 },
    ],
    projects: [],
    certifications: [],
    volunteer: [],
    interests: [],
    references: [],
    publications: [],
    awards: [],
    customSections: [],
    skillCategories: [],
    template: DEFAULT_TEMPLATE_SETTINGS,
    sectionsOrder: DEFAULT_SECTIONS_ORDER,
};

// ─────────────────────────────────────────────────────────────────────────────
// Preview Generation Options
// ─────────────────────────────────────────────────────────────────────────────

export interface PreviewOptions {
    /** Largeur de l'image de preview */
    width: number;
    /** Hauteur de l'image de preview */
    height: number;
    /** Qualité de l'image (0-1) */
    quality: number;
    /** Format de sortie */
    format: 'png' | 'jpeg' | 'webp';
    /** Scale factor */
    scale: number;
}

export const DEFAULT_PREVIEW_OPTIONS: PreviewOptions = {
    width: 400,
    height: 566, // Ratio A4
    quality: 0.9,
    format: 'png',
    scale: 0.5,
};

export const THUMBNAIL_OPTIONS: PreviewOptions = {
    width: 200,
    height: 283,
    quality: 0.8,
    format: 'webp',
    scale: 0.25,
};

// ─────────────────────────────────────────────────────────────────────────────
// Preview Generation Function
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Génère une image de preview à partir d'un élément DOM
 */
export async function generatePreviewFromElement(
    element: HTMLElement,
    options: Partial<PreviewOptions> = {}
): Promise<string> {
    const opts = { ...DEFAULT_PREVIEW_OPTIONS, ...options };

    try {
        const canvas = await html2canvas(element, {
            scale: opts.scale * 2, // Higher for quality
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false,
            width: element.scrollWidth,
            height: element.scrollHeight,
        });

        // Resize to target dimensions
        const resizedCanvas = document.createElement('canvas');
        resizedCanvas.width = opts.width;
        resizedCanvas.height = opts.height;
        
        const ctx = resizedCanvas.getContext('2d');
        if (!ctx) throw new Error('Could not get canvas context');

        // Draw with smooth scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(canvas, 0, 0, opts.width, opts.height);

        // Convert to data URL
        const mimeType = `image/${opts.format}`;
        return resizedCanvas.toDataURL(mimeType, opts.quality);
    } catch (error) {
        console.error('Error generating preview:', error);
        throw error;
    }
}

/**
 * Génère une image de preview pour un template donné
 */
export async function generateTemplatePreview(
    templateId: string,
    containerElement: HTMLElement,
    options?: Partial<PreviewOptions>
): Promise<{ preview: string; thumbnail: string }> {
    // Generate full preview
    const preview = await generatePreviewFromElement(containerElement, options);
    
    // Generate thumbnail
    const thumbnail = await generatePreviewFromElement(containerElement, THUMBNAIL_OPTIONS);

    return { preview, thumbnail };
}

// ─────────────────────────────────────────────────────────────────────────────
// Preview Storage Utilities
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Sauvegarde une preview dans le localStorage (pour le cache)
 */
export function cachePreview(templateId: string, previewData: string): void {
    try {
        const key = `nancy-cv-preview-${templateId}`;
        localStorage.setItem(key, previewData);
    } catch (error) {
        console.warn('Could not cache preview:', error);
    }
}

/**
 * Récupère une preview depuis le cache
 */
export function getCachedPreview(templateId: string): string | null {
    try {
        const key = `nancy-cv-preview-${templateId}`;
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

/**
 * Efface le cache des previews
 */
export function clearPreviewCache(): void {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('nancy-cv-preview-'));
    keys.forEach(k => localStorage.removeItem(k));
}

// ─────────────────────────────────────────────────────────────────────────────
// Placeholder Preview
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Génère un placeholder SVG pour les templates sans preview
 */
export function getPlaceholderPreview(templateName: string, colors: { primary: string; background: string }): string {
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="400" height="566" viewBox="0 0 400 566">
            <rect width="400" height="566" fill="${colors.background}"/>
            <rect x="20" y="20" width="360" height="80" fill="${colors.primary}" rx="4"/>
            <rect x="20" y="120" width="120" height="426" fill="${colors.primary}" opacity="0.1" rx="4"/>
            <rect x="160" y="120" width="220" height="20" fill="${colors.primary}" opacity="0.2" rx="2"/>
            <rect x="160" y="160" width="180" height="12" fill="${colors.primary}" opacity="0.1" rx="2"/>
            <rect x="160" y="180" width="200" height="12" fill="${colors.primary}" opacity="0.1" rx="2"/>
            <rect x="160" y="220" width="220" height="20" fill="${colors.primary}" opacity="0.2" rx="2"/>
            <rect x="160" y="260" width="190" height="12" fill="${colors.primary}" opacity="0.1" rx="2"/>
            <rect x="160" y="280" width="210" height="12" fill="${colors.primary}" opacity="0.1" rx="2"/>
            <text x="200" y="490" text-anchor="middle" fill="${colors.primary}" font-family="sans-serif" font-size="14" opacity="0.5">
                ${templateName}
            </text>
        </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
}
