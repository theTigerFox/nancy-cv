// ============================================================================
// NANCY CV - PDF Template Types
// ============================================================================

import type { CVData } from '../types/cv';
import type { TemplateConfig, TemplateColors, TemplateTypography, TemplateSpacing, TemplateLayout } from '../templates/types';

// ─────────────────────────────────────────────────────────────────────────────
// PDF Template Props
// ─────────────────────────────────────────────────────────────────────────────

export interface PDFTemplateProps {
    cvData: CVData;
    config: TemplateConfig;
}

// ─────────────────────────────────────────────────────────────────────────────
// PDF Colors (mapped from TemplateColors)
// ─────────────────────────────────────────────────────────────────────────────

export interface PDFColors {
    primary: string;
    secondary: string;
    text: string;
    textLight: string;
    background: string;
    backgroundAlt: string;
    border: string;
    accent: string;
    white: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// PDF Font Sizes (calculated from config)
// ─────────────────────────────────────────────────────────────────────────────

export interface PDFFontSizes {
    name: number;
    jobTitle: number;
    sectionTitle: number;
    body: number;
    small: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// PDF Config (processed from TemplateConfig for PDF rendering)
// ─────────────────────────────────────────────────────────────────────────────

export interface PDFConfig {
    colors: PDFColors;
    fontSizes: PDFFontSizes;
    spacing: TemplateSpacing;
    layout: TemplateLayout;
    lineHeight: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper to convert TemplateConfig to PDFConfig
// ─────────────────────────────────────────────────────────────────────────────

export function toPDFConfig(config: TemplateConfig): PDFConfig {
    const baseFontSize = config.typography.baseFontSize || 14;
    
    return {
        colors: {
            ...config.colors,
            white: '#ffffff',
        },
        fontSizes: {
            // Convert rem to pt (base 14px = ~10.5pt)
            name: Math.round(config.typography.nameSize * baseFontSize * 0.75),
            jobTitle: Math.round(config.typography.jobTitleSize * baseFontSize * 0.75),
            sectionTitle: Math.round(config.typography.sectionTitleSize * baseFontSize * 0.75),
            body: Math.round(config.typography.bodySize * baseFontSize * 0.75),
            small: Math.round(config.typography.smallSize * baseFontSize * 0.75),
        },
        spacing: config.spacing,
        layout: config.layout,
        lineHeight: config.typography.lineHeight,
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// Date formatting utilities
// ─────────────────────────────────────────────────────────────────────────────

export function formatDate(date: string | undefined): string {
    if (!date) return '';
    if (date.toLowerCase() === 'present' || date.toLowerCase() === 'présent') return 'Présent';
    
    // Handle YYYY-MM format
    const parts = date.split('-');
    if (parts.length >= 2) {
        const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
        const monthIndex = parseInt(parts[1], 10) - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
            return `${months[monthIndex]} ${parts[0]}`;
        }
    }
    
    return date;
}

export function formatDateRange(startDate?: string, endDate?: string, current?: boolean): string {
    const start = formatDate(startDate);
    const end = current ? 'Présent' : formatDate(endDate);
    
    if (start && end) {
        return `${start} — ${end}`;
    }
    if (start) {
        return start;
    }
    return '';
}

// ─────────────────────────────────────────────────────────────────────────────
// Language level utilities
// ─────────────────────────────────────────────────────────────────────────────

export function getLanguageLevelText(level: string | number): string {
    // Handle numeric levels
    if (typeof level === 'number') {
        if (level >= 9) return 'Langue maternelle';
        if (level >= 7) return 'Avancé';
        if (level >= 5) return 'Intermédiaire avancé';
        if (level >= 3) return 'Intermédiaire';
        if (level >= 2) return 'Élémentaire';
        return 'Débutant';
    }
    
    // Handle string levels
    const levels: Record<string, string> = {
        A1: 'Débutant',
        A2: 'Élémentaire',
        B1: 'Intermédiaire',
        B2: 'Intermédiaire avancé',
        C1: 'Avancé',
        C2: 'Maîtrise',
        native: 'Langue maternelle',
    };
    return levels[level] || level;
}

// ─────────────────────────────────────────────────────────────────────────────
// Section visibility
// ─────────────────────────────────────────────────────────────────────────────

export function isSectionVisible(
    sectionType: string,
    sectionsOrder: Array<{ type: string; visible: boolean }>,
    hasData: boolean
): boolean {
    if (!hasData) return false;
    
    const section = sectionsOrder.find(s => s.type === sectionType);
    if (section) {
        return section.visible;
    }
    
    // Default to visible if not in sectionsOrder
    return true;
}
