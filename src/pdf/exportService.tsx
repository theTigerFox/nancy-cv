// ============================================================================
// NANCY CV - PDF Export Service
// Service professionnel d'export PDF avec @react-pdf/renderer
// ============================================================================

import React from 'react';
import { pdf } from '@react-pdf/renderer';
import type { CVData } from '../types/cv';
import type { TemplateConfig, TemplateColors, TemplateTypography, TemplateSpacing, TemplateLayout, TemplateSections } from '../templates/types';

// Import PDF templates
import { BoldModernPDF } from './templates/BoldModernPDF';
import { MinimalElegancePDF } from './templates/MinimalElegancePDF';

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
// Template Mapping
// ─────────────────────────────────────────────────────────────────────────────

type PDFTemplateType = 'bold-modern' | 'minimal-elegance' | 'sidebar-left' | 'single';

// Map template IDs to their PDF layout type
const templateLayoutMap: Record<string, PDFTemplateType> = {
    // Sidebar left templates (colorful sidebar on left)
    'bold-modern': 'bold-modern',
    'creative-splash': 'bold-modern',
    
    // Single column minimal templates
    'minimal-elegance': 'minimal-elegance',
    'executive-pro': 'minimal-elegance',
    'classic-professional': 'minimal-elegance',
    'tech-minimal': 'minimal-elegance',
    'elegant-serif': 'minimal-elegance',
};

// ─────────────────────────────────────────────────────────────────────────────
// Get PDF Component based on template and config
// ─────────────────────────────────────────────────────────────────────────────

function getPDFDocument(
    cvData: CVData,
    templateId: string,
    config: PDFTemplateConfig
): React.ReactElement {
    // Determine template type from ID or config layout
    let templateType: PDFTemplateType = templateLayoutMap[templateId] || 'minimal-elegance';
    
    // Override based on config layout type if available
    if (config?.layout?.type) {
        if (config.layout.type === 'sidebar-left' || config.layout.type === 'sidebar-right') {
            templateType = 'bold-modern';
        } else if (config.layout.type === 'single') {
            templateType = 'minimal-elegance';
        }
    }
    
    // Cast to TemplateConfig for component props (metadata not needed for PDF)
    const templateConfig = config as unknown as TemplateConfig;
    
    // Return appropriate PDF component
    switch (templateType) {
        case 'bold-modern':
            return <BoldModernPDF cvData={cvData} config={templateConfig} />;
        case 'minimal-elegance':
        default:
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
    // Use config if provided, otherwise get default
    const effectiveConfig = (config || getDefaultConfig(templateId)) as PDFTemplateConfig;
    
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
// Default Configs for templates
// ─────────────────────────────────────────────────────────────────────────────

function getDefaultConfig(templateId: string): PDFTemplateConfig {
    const configs: Record<string, PDFTemplateConfig> = {
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
    };
    
    return configs[templateId] || configs['minimal-elegance'];
}
