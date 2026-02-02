// ============================================================================
// NANCY CV - PDF Templates Index
// ============================================================================

export { BoldModernPDF } from './BoldModernPDF';
export { MinimalElegancePDF } from './MinimalElegancePDF';

// Template registry mapping template IDs to their PDF components
export const pdfTemplateMap = {
    'bold-modern': 'BoldModernPDF',
    'minimal-elegance': 'MinimalElegancePDF',
    'executive-pro': 'MinimalElegancePDF', // Fallback to MinimalElegance for now
    'classic-professional': 'MinimalElegancePDF', // Fallback
    'creative-splash': 'BoldModernPDF', // Similar layout
    'tech-minimal': 'MinimalElegancePDF', // Fallback
    'elegant-serif': 'MinimalElegancePDF', // Fallback
} as const;

export type PDFTemplateId = keyof typeof pdfTemplateMap;
