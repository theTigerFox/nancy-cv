// ============================================================================
// NANCY CV - PDF Export Service
// Service professionnel d'export PDF avec @react-pdf/renderer
// CHAQUE template a son propre composant PDF dédié - aucun fallback
// ============================================================================

import React from 'react';
import { pdf } from '@react-pdf/renderer';
import type { CVData } from '../types/cv';
import type { TemplateConfig, TemplateColors, TemplateTypography, TemplateSpacing, TemplateLayout, TemplateSections } from '../templates/types';

// ─────────────────────────────────────────────────────────────────────────────
// Import TOUS les templates PDF dédiés
// ─────────────────────────────────────────────────────────────────────────────
import { BoldModernPDF } from './templates/BoldModernPDF';
import { MinimalElegancePDF } from './templates/MinimalElegancePDF';
import { ExecutiveProPDF } from './templates/ExecutiveProPDF';
import { ClassicProfessionalPDF } from './templates/ClassicProfessionalPDF';
import { CreativeSplashPDF } from './templates/CreativeSplashPDF';
import { TechMinimalPDF } from './templates/TechMinimalPDF';
import { ElegantSerifPDF } from './templates/ElegantSerifPDF';

// ─────────────────────────────────────────────────────────────────────────────
// PDF Config Type (subset of TemplateConfig for PDF rendering)
// ─────────────────────────────────────────────────────────────────────────────

interface PDFTemplateConfig {
    colors: TemplateColors;
    typography: TemplateTypography;
    spacing: TemplateSpacing;
    layout: TemplateLayout;
    sections?: Partial<TemplateSections>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Export Options
// ─────────────────────────────────────────────────────────────────────────────

export interface PDFExportOptions {
    filename?: string;
    templateId?: string;
    config?: TemplateConfig;
    openInNewTab?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Template IDs - Liste exhaustive des templates supportés
// ─────────────────────────────────────────────────────────────────────────────

type SupportedTemplateId = 
    | 'bold-modern'
    | 'minimal-elegance'
    | 'executive-pro'
    | 'classic-professional'
    | 'creative-splash'
    | 'tech-minimal'
    | 'elegant-serif';

// ─────────────────────────────────────────────────────────────────────────────
// Get PDF Component - Mapping direct template → composant PDF dédié
// AUCUN fallback - chaque template a son propre rendu exact
// ─────────────────────────────────────────────────────────────────────────────

function getPDFDocument(
    cvData: CVData,
    templateId: string,
    config: PDFTemplateConfig
): React.ReactElement {
    // Cast to TemplateConfig for component props
    const templateConfig = config as unknown as TemplateConfig;
    
    // Mapping direct - chaque template utilise son propre composant PDF
    switch (templateId as SupportedTemplateId) {
        // ══════════════════════════════════════════════════════════════════════
        // Templates avec sidebar gauche
        // ══════════════════════════════════════════════════════════════════════
        case 'bold-modern':
            return <BoldModernPDF cvData={cvData} config={templateConfig} />;
        
        case 'executive-pro':
            return <ExecutiveProPDF cvData={cvData} config={templateConfig} />;
        
        // ══════════════════════════════════════════════════════════════════════
        // Templates créatifs avec header coloré
        // ══════════════════════════════════════════════════════════════════════
        case 'creative-splash':
            return <CreativeSplashPDF cvData={cvData} config={templateConfig} />;
        
        // ══════════════════════════════════════════════════════════════════════
        // Templates single column
        // ══════════════════════════════════════════════════════════════════════
        case 'minimal-elegance':
            return <MinimalElegancePDF cvData={cvData} config={templateConfig} />;
        
        case 'classic-professional':
            return <ClassicProfessionalPDF cvData={cvData} config={templateConfig} />;
        
        case 'tech-minimal':
            return <TechMinimalPDF cvData={cvData} config={templateConfig} />;
        
        case 'elegant-serif':
            return <ElegantSerifPDF cvData={cvData} config={templateConfig} />;
        
        // ══════════════════════════════════════════════════════════════════════
        // Fallback pour templates non reconnus (ne devrait jamais arriver)
        // ══════════════════════════════════════════════════════════════════════
        default:
            console.warn(`Template PDF non trouvé pour: ${templateId}, utilisation de MinimalElegancePDF`);
            return <MinimalElegancePDF cvData={cvData} config={templateConfig} />;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Generate PDF Blob
// ─────────────────────────────────────────────────────────────────────────────

export async function generatePDFBlob(
    cvData: CVData,
    templateId: string = 'minimal-elegance',
    config?: TemplateConfig | PDFTemplateConfig
): Promise<Blob> {
    // Debug log
    console.log('[PDF Export] Génération PDF:', {
        templateId,
        hasConfigProvided: !!config,
        configColors: config?.colors?.primary,
    });
    
    // Use config if provided, otherwise get default for this specific template
    const effectiveConfig = (config || getDefaultConfig(templateId)) as PDFTemplateConfig;
    
    console.log('[PDF Export] Config effective:', {
        templateId,
        primaryColor: effectiveConfig.colors?.primary,
        layoutType: effectiveConfig.layout?.type,
    });
    
    // Get the appropriate PDF document
    const pdfDocument = getPDFDocument(cvData, templateId, effectiveConfig);
    
    // Generate and return blob
    // @ts-ignore - ReactPDF types are inconsistent
    const blob = await pdf(pdfDocument).toBlob();
    return blob;
}

// ─────────────────────────────────────────────────────────────────────────────
// Download PDF
// ─────────────────────────────────────────────────────────────────────────────

export async function downloadPDF(
    cvData: CVData,
    options: PDFExportOptions = {}
): Promise<void> {
    const {
        filename = `cv-${cvData.personalInfo.firstName || 'mon'}-${cvData.personalInfo.lastName || 'cv'}`,
        templateId = cvData.template?.id || 'minimal-elegance',
        config,
        openInNewTab = false,
    } = options;

    try {
        const blob = await generatePDFBlob(cvData, templateId, config);
        const url = URL.createObjectURL(blob);

        if (openInNewTab) {
            // Open in new tab for preview
            window.open(url, '_blank');
        } else {
            // Download the file
            const link = document.createElement('a');
            link.href = url;
            link.download = `${sanitizeFilename(filename)}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        // Cleanup URL after a delay
        setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (error) {
        console.error('Erreur lors de la génération du PDF:', error);
        throw new Error('Impossible de générer le PDF. Veuillez réessayer.');
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Preview PDF (returns URL for iframe/preview)
// ─────────────────────────────────────────────────────────────────────────────

export async function previewPDF(
    cvData: CVData,
    templateId: string = 'minimal-elegance',
    config?: TemplateConfig
): Promise<string> {
    const blob = await generatePDFBlob(cvData, templateId, config);
    return URL.createObjectURL(blob);
}

// ─────────────────────────────────────────────────────────────────────────────
// Get available templates
// ─────────────────────────────────────────────────────────────────────────────

export function getAvailablePDFTemplates(): string[] {
    return ['bold-modern', 'minimal-elegance', 'classic-professional', 'tech-minimal', 'elegant-serif', 'creative-splash', 'executive-pro'];
}

// ─────────────────────────────────────────────────────────────────────────────
// Utility: Sanitize filename
// ─────────────────────────────────────────────────────────────────────────────

function sanitizeFilename(name: string): string {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-z0-9-_]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        || 'cv';
}

// ─────────────────────────────────────────────────────────────────────────────
// Default Configs for ALL templates
// ─────────────────────────────────────────────────────────────────────────────

function getDefaultConfig(templateId: string): PDFTemplateConfig {
    const configs: Record<string, PDFTemplateConfig> = {
        // ══════════════════════════════════════════════════════════════════════
        // Bold Modern - Sidebar violette avec gradient
        // ══════════════════════════════════════════════════════════════════════
        'bold-modern': {
            colors: {
                primary: '#6366f1',
                secondary: '#8b5cf6',
                text: '#1e1b4b',
                textLight: '#6b7280',
                background: '#ffffff',
                backgroundAlt: '#f5f3ff',
                border: '#e0e7ff',
                accent: '#06b6d4',
            },
            typography: {
                fontHeading: 'Helvetica-Bold',
                fontBody: 'Helvetica',
                baseFontSize: 14,
                nameSize: 2.5,
                jobTitleSize: 1.2,
                sectionTitleSize: 1.0,
                bodySize: 0.875,
                smallSize: 0.75,
                lineHeight: 1.6,
                letterSpacing: '-0.01em',
            },
            spacing: {
                pageMargin: 0,
                sectionGap: 24,
                sectionPadding: 20,
                itemGap: 14,
            },
            layout: {
                type: 'sidebar-left',
                sidebarWidth: 35,
                showPhoto: true,
                photoPosition: 'sidebar',
                photoShape: 'rounded',
                photoSize: 100,
            },
            sections: {
                skills: { type: 'bars', showLevel: true },
                languages: { type: 'text', showLevelText: true },
                timeline: { showLine: true, showDots: true, position: 'left', dotStyle: 'circle' },
                useIcons: true,
                titleStyle: 'simple',
            },
        },
        
        // ══════════════════════════════════════════════════════════════════════
        // Executive Pro - Sidebar bleu foncé avec accent doré
        // ══════════════════════════════════════════════════════════════════════
        'executive-pro': {
            colors: {
                primary: '#1e3a5f',
                secondary: '#2d4a6f',
                text: '#1e293b',
                textLight: '#64748b',
                background: '#ffffff',
                backgroundAlt: '#f8fafc',
                border: '#e2e8f0',
                accent: '#c9a227',
            },
            typography: {
                fontHeading: 'Helvetica-Bold',
                fontBody: 'Helvetica',
                baseFontSize: 14,
                nameSize: 2.2,
                jobTitleSize: 1.1,
                sectionTitleSize: 0.95,
                bodySize: 0.875,
                smallSize: 0.75,
                lineHeight: 1.6,
                letterSpacing: '0.02em',
            },
            spacing: {
                pageMargin: 0,
                sectionGap: 20,
                sectionPadding: 24,
                itemGap: 14,
            },
            layout: {
                type: 'sidebar-left',
                sidebarWidth: 32,
                showPhoto: true,
                photoPosition: 'sidebar',
                photoShape: 'square',
                photoSize: 120,
            },
            sections: {
                skills: { type: 'bars', showLevel: true },
                languages: { type: 'dots', showLevelText: true },
                timeline: { showLine: false, showDots: false, position: 'none', dotStyle: 'circle' },
                useIcons: true,
                titleStyle: 'border-left',
            },
        },
        
        // ══════════════════════════════════════════════════════════════════════
        // Creative Splash - Header rose avec deux colonnes
        // ══════════════════════════════════════════════════════════════════════
        'creative-splash': {
            colors: {
                primary: '#f43f5e',
                secondary: '#ec4899',
                text: '#1f2937',
                textLight: '#6b7280',
                background: '#ffffff',
                backgroundAlt: '#fef2f2',
                border: '#fecdd3',
                accent: '#fbbf24',
            },
            typography: {
                fontHeading: 'Helvetica-Bold',
                fontBody: 'Helvetica',
                baseFontSize: 14,
                nameSize: 2.4,
                jobTitleSize: 1.1,
                sectionTitleSize: 0.9,
                bodySize: 0.85,
                smallSize: 0.7,
                lineHeight: 1.5,
                letterSpacing: '0.05em',
            },
            spacing: {
                pageMargin: 0,
                sectionGap: 20,
                sectionPadding: 16,
                itemGap: 10,
            },
            layout: {
                type: 'two-column',
                sidebarWidth: 35,
                showPhoto: true,
                photoPosition: 'header',
                photoShape: 'circle',
                photoSize: 100,
            },
            sections: {
                skills: { type: 'tags', showLevel: false },
                languages: { type: 'text', showLevelText: true },
                timeline: { showLine: true, showDots: false, position: 'left', dotStyle: 'circle' },
                useIcons: false,
                titleStyle: 'underline',
            },
        },
        
        // ══════════════════════════════════════════════════════════════════════
        // Minimal Elegance - Colonne unique, centré, minimaliste
        // ══════════════════════════════════════════════════════════════════════
        'minimal-elegance': {
            colors: {
                primary: '#1a1a1a',
                secondary: '#404040',
                text: '#1a1a1a',
                textLight: '#737373',
                background: '#ffffff',
                backgroundAlt: '#fafafa',
                border: '#e5e5e5',
                accent: '#1a1a1a',
            },
            typography: {
                fontHeading: 'Helvetica-Bold',
                fontBody: 'Helvetica',
                baseFontSize: 14,
                nameSize: 3.2,
                jobTitleSize: 1.1,
                sectionTitleSize: 0.85,
                bodySize: 0.9,
                smallSize: 0.75,
                lineHeight: 1.7,
                letterSpacing: '0.15em',
            },
            spacing: {
                pageMargin: 50,
                sectionGap: 32,
                sectionPadding: 0,
                itemGap: 16,
            },
            layout: {
                type: 'single',
                sidebarWidth: 0,
                showPhoto: false,
                photoPosition: 'header',
                photoShape: 'circle',
                photoSize: 80,
            },
            sections: {
                skills: { type: 'tags', showLevel: false },
                languages: { type: 'text', showLevelText: true },
                timeline: { showLine: false, showDots: false, position: 'none', dotStyle: 'circle' },
                useIcons: false,
                titleStyle: 'simple',
            },
        },
        
        // ══════════════════════════════════════════════════════════════════════
        // Classic Professional - Colonne unique, titres soulignés
        // ══════════════════════════════════════════════════════════════════════
        'classic-professional': {
            colors: {
                primary: '#1e3a5f',
                secondary: '#2563eb',
                text: '#333333',
                textLight: '#666666',
                background: '#ffffff',
                backgroundAlt: '#f5f5f5',
                border: '#dddddd',
                accent: '#1e3a5f',
            },
            typography: {
                fontHeading: 'Helvetica-Bold',
                fontBody: 'Helvetica',
                baseFontSize: 14,
                nameSize: 2.4,
                jobTitleSize: 1.1,
                sectionTitleSize: 0.95,
                bodySize: 0.9,
                smallSize: 0.75,
                lineHeight: 1.6,
                letterSpacing: '0.03em',
            },
            spacing: {
                pageMargin: 40,
                sectionGap: 20,
                sectionPadding: 0,
                itemGap: 12,
            },
            layout: {
                type: 'single',
                sidebarWidth: 0,
                showPhoto: true,
                photoPosition: 'header',
                photoShape: 'rounded',
                photoSize: 90,
            },
            sections: {
                skills: { type: 'simple', showLevel: false },
                languages: { type: 'text', showLevelText: true },
                timeline: { showLine: false, showDots: false, position: 'none', dotStyle: 'circle' },
                useIcons: false,
                titleStyle: 'underline',
            },
        },
        
        // ══════════════════════════════════════════════════════════════════════
        // Tech Minimal - Style tech, tags, accent cyan
        // ══════════════════════════════════════════════════════════════════════
        'tech-minimal': {
            colors: {
                primary: '#0ea5e9',
                secondary: '#0284c7',
                text: '#0f172a',
                textLight: '#64748b',
                background: '#ffffff',
                backgroundAlt: '#f8fafc',
                border: '#e2e8f0',
                accent: '#0ea5e9',
            },
            typography: {
                fontHeading: 'Helvetica-Bold',
                fontBody: 'Helvetica',
                baseFontSize: 14,
                nameSize: 2.2,
                jobTitleSize: 1.0,
                sectionTitleSize: 1.0,
                bodySize: 0.875,
                smallSize: 0.75,
                lineHeight: 1.6,
                letterSpacing: '0.05em',
            },
            spacing: {
                pageMargin: 40,
                sectionGap: 20,
                sectionPadding: 0,
                itemGap: 16,
            },
            layout: {
                type: 'single',
                sidebarWidth: 0,
                showPhoto: false,
                photoPosition: 'header',
                photoShape: 'circle',
                photoSize: 0,
            },
            sections: {
                skills: { type: 'tags', showLevel: false },
                languages: { type: 'bars', showLevelText: false },
                timeline: { showLine: true, showDots: true, position: 'left', dotStyle: 'square' },
                useIcons: true,
                titleStyle: 'simple',
            },
        },
        
        // ══════════════════════════════════════════════════════════════════════
        // Elegant Serif - Typographie serif, tons bruns
        // ══════════════════════════════════════════════════════════════════════
        'elegant-serif': {
            colors: {
                primary: '#92400e',
                secondary: '#b45309',
                text: '#1c1917',
                textLight: '#78716c',
                background: '#fffbeb',
                backgroundAlt: '#fef7ed',
                border: '#e7e5e4',
                accent: '#d97706',
            },
            typography: {
                fontHeading: 'Times-Bold',
                fontBody: 'Times-Roman',
                baseFontSize: 14,
                nameSize: 2.6,
                jobTitleSize: 1.1,
                sectionTitleSize: 0.9,
                bodySize: 0.9,
                smallSize: 0.75,
                lineHeight: 1.7,
                letterSpacing: '0.1em',
            },
            spacing: {
                pageMargin: 48,
                sectionGap: 24,
                sectionPadding: 0,
                itemGap: 14,
            },
            layout: {
                type: 'single',
                sidebarWidth: 0,
                showPhoto: true,
                photoPosition: 'header',
                photoShape: 'circle',
                photoSize: 100,
            },
            sections: {
                skills: { type: 'tags', showLevel: false },
                languages: { type: 'text', showLevelText: true },
                timeline: { showLine: false, showDots: false, position: 'none', dotStyle: 'circle' },
                useIcons: false,
                titleStyle: 'simple',
            },
        },
    };
    
    // Retourner le config du template ou fallback sur minimal-elegance
    const selectedConfig = configs[templateId];
    if (!selectedConfig) {
        console.warn(`[PDF Export] Config non trouvée pour template: ${templateId}, utilisation de minimal-elegance`);
    }
    return selectedConfig || configs['minimal-elegance'];
}
