// ============================================================================
// NANCY CV - PDF Templates Index
// TOUS les templates ont leur propre composant PDF dédié
// ============================================================================

// ─────────────────────────────────────────────────────────────────────────────
// Export de tous les templates PDF
// ─────────────────────────────────────────────────────────────────────────────

// Template avec sidebar gauche (violet/gradient)
export { BoldModernPDF } from './BoldModernPDF';

// Template avec sidebar gauche (bleu foncé/doré)
export { ExecutiveProPDF } from './ExecutiveProPDF';

// Template créatif avec header coloré (rose/magenta)
export { CreativeSplashPDF } from './CreativeSplashPDF';

// Template minimaliste élégant (single column, centré)
export { MinimalElegancePDF } from './MinimalElegancePDF';

// Template professionnel classique (single column, souligné)
export { ClassicProfessionalPDF } from './ClassicProfessionalPDF';

// Template tech minimaliste (single column, tags, cyan)
export { TechMinimalPDF } from './TechMinimalPDF';

// Template élégant serif (single column, typography classique)
export { ElegantSerifPDF } from './ElegantSerifPDF';

// ─────────────────────────────────────────────────────────────────────────────
// Template registry - Mapping 1:1 entre template ID et composant PDF
// ─────────────────────────────────────────────────────────────────────────────

export const pdfTemplateMap = {
    'bold-modern': 'BoldModernPDF',
    'executive-pro': 'ExecutiveProPDF',
    'creative-splash': 'CreativeSplashPDF',
    'minimal-elegance': 'MinimalElegancePDF',
    'classic-professional': 'ClassicProfessionalPDF',
    'tech-minimal': 'TechMinimalPDF',
    'elegant-serif': 'ElegantSerifPDF',
} as const;

export type PDFTemplateId = keyof typeof pdfTemplateMap;
