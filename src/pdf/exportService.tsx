// ============================================================================
// NANCY CV - PDF Export Service
// Service professionnel d'export PDF avec @react-pdf/renderer
// ============================================================================

import { pdf } from '@react-pdf/renderer';
import type { CVData } from '../types/cv';

// Import PDF templates
import { MinimalElegancePDF } from './templates/MinimalElegancePDF';
// Future templates will be imported here

// ─────────────────────────────────────────────────────────────────────────────
// Export Options
// ─────────────────────────────────────────────────────────────────────────────

export interface PDFExportOptions {
    filename?: string;
    templateId?: string;
    openInNewTab?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Generate PDF Blob
// ─────────────────────────────────────────────────────────────────────────────

export async function generatePDFBlob(
    cvData: CVData,
    templateId: string = 'minimal-elegance'
): Promise<Blob> {
    // Create the PDF document using JSX directly
    // For now, use MinimalElegancePDF for all templates
    // @ts-ignore - ReactPDF types are tricky
    const blob = await pdf(<MinimalElegancePDF cvData={cvData} />).toBlob();
    
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
        openInNewTab = false,
    } = options;

    try {
        const blob = await generatePDFBlob(cvData, templateId);
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
    templateId: string = 'minimal-elegance'
): Promise<string> {
    const blob = await generatePDFBlob(cvData, templateId);
    return URL.createObjectURL(blob);
}

// ─────────────────────────────────────────────────────────────────────────────
// Get available templates
// ─────────────────────────────────────────────────────────────────────────────

export function getAvailablePDFTemplates(): string[] {
    return ['minimal-elegance', 'classic-professional', 'bold-modern', 'tech-minimal', 'elegant-serif', 'creative-splash', 'executive-pro'];
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
