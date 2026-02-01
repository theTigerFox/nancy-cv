// ============================================================================
// NANCY CV - Template Utilities & Helpers
// ============================================================================

import { 
    TemplateConfig, 
    TemplateColors, 
    TemplateTypography,
    TemplateCustomization,
    TemplateSpacing,
    TemplateLayout,
    TemplateSections
} from './types';

// ─────────────────────────────────────────────────────────────────────────────
// Default Values
// ─────────────────────────────────────────────────────────────────────────────

export const DEFAULT_COLORS: TemplateColors = {
    primary: '#1a1a1a',
    secondary: '#4a4a4a',
    text: '#1a1a1a',
    textLight: '#6b7280',
    background: '#ffffff',
    backgroundAlt: '#f9fafb',
    border: '#e5e7eb',
    accent: '#3b82f6',
};

export const DEFAULT_TYPOGRAPHY: TemplateTypography = {
    fontHeading: "'Inter', sans-serif",
    fontBody: "'Inter', sans-serif",
    baseFontSize: 16,
    nameSize: 2.5,
    jobTitleSize: 1.25,
    sectionTitleSize: 1.125,
    bodySize: 0.875,
    smallSize: 0.75,
    lineHeight: 1.5,
    letterSpacing: '-0.025em',
};

export const DEFAULT_SPACING: TemplateSpacing = {
    pageMargin: 15,
    sectionGap: 24,
    sectionPadding: 16,
    itemGap: 12,
};

export const DEFAULT_LAYOUT: TemplateLayout = {
    type: 'two-column',
    sidebarWidth: 35,
    sidebarSections: ['contact', 'skills', 'languages'],
    mainSections: ['description', 'experience', 'education'],
    showPhoto: true,
    photoPosition: 'header',
    photoShape: 'circle',
    photoSize: 100,
};

export const DEFAULT_SECTIONS: TemplateSections = {
    skills: {
        type: 'bars',
        showLevel: true,
    },
    languages: {
        type: 'dots',
        showLevelText: true,
    },
    timeline: {
        showLine: true,
        showDots: true,
        position: 'left',
        dotStyle: 'circle',
    },
    useIcons: true,
    titleStyle: 'underline',
};

// ─────────────────────────────────────────────────────────────────────────────
// Merge Utilities
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fusionne les personnalisations utilisateur avec la config de base du template
 */
export function mergeTemplateConfig(
    baseConfig: TemplateConfig,
    customization?: TemplateCustomization
): TemplateConfig {
    if (!customization) return baseConfig;

    return {
        metadata: baseConfig.metadata,
        colors: { ...baseConfig.colors, ...customization.colors },
        typography: { ...baseConfig.typography, ...customization.typography },
        spacing: { ...baseConfig.spacing, ...customization.spacing },
        layout: { ...baseConfig.layout, ...customization.layout },
        sections: { 
            ...baseConfig.sections,
            ...customization.sections,
            skills: { ...baseConfig.sections.skills, ...customization.sections?.skills },
            languages: { ...baseConfig.sections.languages, ...customization.sections?.languages },
            timeline: { ...baseConfig.sections.timeline, ...customization.sections?.timeline },
        },
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// CSS Variable Generator
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Génère les variables CSS à partir de la configuration du template
 */
export function generateCSSVariables(config: TemplateConfig): Record<string, string> {
    const { colors, typography, spacing } = config;

    return {
        // Colors
        '--cv-color-primary': colors.primary,
        '--cv-color-secondary': colors.secondary,
        '--cv-color-text': colors.text,
        '--cv-color-text-light': colors.textLight,
        '--cv-color-background': colors.background,
        '--cv-color-background-alt': colors.backgroundAlt,
        '--cv-color-border': colors.border,
        '--cv-color-accent': colors.accent,

        // Typography
        '--cv-font-heading': typography.fontHeading,
        '--cv-font-body': typography.fontBody,
        '--cv-font-size-base': `${typography.baseFontSize}px`,
        '--cv-font-size-name': `${typography.nameSize}rem`,
        '--cv-font-size-job-title': `${typography.jobTitleSize}rem`,
        '--cv-font-size-section-title': `${typography.sectionTitleSize}rem`,
        '--cv-font-size-body': `${typography.bodySize}rem`,
        '--cv-font-size-small': `${typography.smallSize}rem`,
        '--cv-line-height': `${typography.lineHeight}`,
        '--cv-letter-spacing': typography.letterSpacing,

        // Spacing
        '--cv-page-margin': `${spacing.pageMargin}mm`,
        '--cv-section-gap': `${spacing.sectionGap}px`,
        '--cv-section-padding': `${spacing.sectionPadding}px`,
        '--cv-item-gap': `${spacing.itemGap}px`,
    };
}

/**
 * Applique les variables CSS à un élément
 */
export function applyCSSVariables(
    element: HTMLElement,
    config: TemplateConfig
): void {
    const variables = generateCSSVariables(config);
    Object.entries(variables).forEach(([key, value]) => {
        element.style.setProperty(key, value);
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// Color Utilities
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convertit une couleur hex en RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

/**
 * Génère une couleur avec opacité
 */
export function colorWithOpacity(hex: string, opacity: number): string {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
}

/**
 * Détermine si une couleur est claire ou foncée
 */
export function isLightColor(hex: string): boolean {
    const rgb = hexToRgb(hex);
    if (!rgb) return true;
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness > 128;
}

/**
 * Retourne la couleur de texte appropriée pour un fond donné
 */
export function getContrastColor(backgroundColor: string): string {
    return isLightColor(backgroundColor) ? '#1a1a1a' : '#ffffff';
}

// ─────────────────────────────────────────────────────────────────────────────
// Typography Utilities
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Liste des polices Google Fonts recommandées pour les CV
 */
export const RECOMMENDED_FONTS = {
    professional: [
        { name: 'Inter', value: "'Inter', sans-serif" },
        { name: 'Roboto', value: "'Roboto', sans-serif" },
        { name: 'Open Sans', value: "'Open Sans', sans-serif" },
        { name: 'Lato', value: "'Lato', sans-serif" },
        { name: 'Source Sans Pro', value: "'Source Sans Pro', sans-serif" },
    ],
    modern: [
        { name: 'Poppins', value: "'Poppins', sans-serif" },
        { name: 'Montserrat', value: "'Montserrat', sans-serif" },
        { name: 'Raleway', value: "'Raleway', sans-serif" },
        { name: 'Nunito', value: "'Nunito', sans-serif" },
        { name: 'Work Sans', value: "'Work Sans', sans-serif" },
    ],
    classic: [
        { name: 'Merriweather', value: "'Merriweather', serif" },
        { name: 'Playfair Display', value: "'Playfair Display', serif" },
        { name: 'Lora', value: "'Lora', serif" },
        { name: 'Crimson Text', value: "'Crimson Text', serif" },
        { name: 'Georgia', value: "Georgia, serif" },
    ],
    creative: [
        { name: 'Space Grotesk', value: "'Space Grotesk', sans-serif" },
        { name: 'DM Sans', value: "'DM Sans', sans-serif" },
        { name: 'Outfit', value: "'Outfit', sans-serif" },
        { name: 'Sora', value: "'Sora', sans-serif" },
        { name: 'Manrope', value: "'Manrope', sans-serif" },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Preset Color Schemes
// ─────────────────────────────────────────────────────────────────────────────

export const COLOR_PRESETS: Record<string, Partial<TemplateColors>> = {
    professional: {
        primary: '#1e3a5f',
        secondary: '#4a6fa5',
        accent: '#2563eb',
    },
    modern: {
        primary: '#0f172a',
        secondary: '#334155',
        accent: '#6366f1',
    },
    creative: {
        primary: '#1a1a1a',
        secondary: '#404040',
        accent: '#ec4899',
    },
    minimal: {
        primary: '#171717',
        secondary: '#525252',
        accent: '#737373',
    },
    nature: {
        primary: '#14532d',
        secondary: '#166534',
        accent: '#22c55e',
    },
    warm: {
        primary: '#7c2d12',
        secondary: '#9a3412',
        accent: '#f97316',
    },
    cool: {
        primary: '#164e63',
        secondary: '#155e75',
        accent: '#06b6d4',
    },
    elegant: {
        primary: '#292524',
        secondary: '#44403c',
        accent: '#a8a29e',
    },
};

// ─────────────────────────────────────────────────────────────────────────────
// Level Display Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convertit un niveau numérique en texte
 */
export function getLevelText(level: number, type: 'skill' | 'language'): string {
    if (type === 'skill') {
        if (level <= 2) return 'Débutant';
        if (level <= 4) return 'Intermédiaire';
        if (level <= 6) return 'Avancé';
        if (level <= 8) return 'Expert';
        return 'Maître';
    } else {
        // Language levels 1-5
        const levels = ['Notions', 'Élémentaire', 'Intermédiaire', 'Avancé', 'Bilingue'];
        return levels[Math.min(level - 1, 4)] || 'Notions';
    }
}

/**
 * Convertit un niveau de langue en code CECR
 */
export function getLanguageCEFR(level: number): string {
    const levels = ['A1', 'A2/B1', 'B1/B2', 'B2/C1', 'C1/C2'];
    return levels[Math.min(level - 1, 4)] || 'A1';
}
