// ============================================================================
// NANCY CV - Template Library Index
// Auto-registration of all templates
// ============================================================================

import { templateRegistry } from '../registry';
import { TemplateManifest } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Import Templates
// ─────────────────────────────────────────────────────────────────────────────

// Executive Pro
import ExecutiveProTemplate from './executive-pro/ExecutiveProTemplate';
import executiveProManifest from './executive-pro/template.json';

// Minimal Elegance
import MinimalEleganceTemplate from './minimal-elegance/MinimalEleganceTemplate';
import minimalEleganceManifest from './minimal-elegance/template.json';

// Bold Modern
import BoldModernTemplate from './bold-modern/BoldModernTemplate';
import boldModernManifest from './bold-modern/template.json';

// Classic Professional
import ClassicProfessionalTemplate from './classic-professional/ClassicProfessionalTemplate';
import classicProfessionalManifest from './classic-professional/template.json';

// Creative Splash
import CreativeSplashTemplate from './creative-splash/CreativeSplashTemplate';
import creativeSplashManifest from './creative-splash/template.json';

// Tech Minimal
import TechMinimalTemplate from './tech-minimal/TechMinimalTemplate';
import techMinimalManifest from './tech-minimal/template.json';

// Elegant Serif
import ElegantSerifTemplate from './elegant-serif/ElegantSerifTemplate';
import elegantSerifManifest from './elegant-serif/template.json';

// ─────────────────────────────────────────────────────────────────────────────
// Register Templates
// ─────────────────────────────────────────────────────────────────────────────

export function registerAllTemplates(): void {
    if (templateRegistry.isInitialized) return;

    // Executive Pro
    templateRegistry.register(
        executiveProManifest as TemplateManifest,
        ExecutiveProTemplate,
        '/templates/previews/executive-pro.png'
    );

    // Minimal Elegance
    templateRegistry.register(
        minimalEleganceManifest as TemplateManifest,
        MinimalEleganceTemplate,
        '/templates/previews/minimal-elegance.png'
    );

    // Bold Modern
    templateRegistry.register(
        boldModernManifest as TemplateManifest,
        BoldModernTemplate,
        '/templates/previews/bold-modern.png'
    );

    // Classic Professional
    templateRegistry.register(
        classicProfessionalManifest as TemplateManifest,
        ClassicProfessionalTemplate,
        '/templates/previews/classic-professional.png'
    );

    // Creative Splash
    templateRegistry.register(
        creativeSplashManifest as TemplateManifest,
        CreativeSplashTemplate,
        '/templates/previews/creative-splash.png'
    );

    // Tech Minimal
    templateRegistry.register(
        techMinimalManifest as TemplateManifest,
        TechMinimalTemplate,
        '/templates/previews/tech-minimal.png'
    );

    // Elegant Serif
    templateRegistry.register(
        elegantSerifManifest as TemplateManifest,
        ElegantSerifTemplate,
        '/templates/previews/elegant-serif.png'
    );

    // Mark as initialized
    templateRegistry.setInitialized();

    console.log(`[Nancy CV] ${templateRegistry.count} templates registered`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Export template components for direct use
// ─────────────────────────────────────────────────────────────────────────────

export { 
    ExecutiveProTemplate, 
    MinimalEleganceTemplate,
    BoldModernTemplate,
    ClassicProfessionalTemplate,
    CreativeSplashTemplate,
    TechMinimalTemplate,
    ElegantSerifTemplate,
};

// ─────────────────────────────────────────────────────────────────────────────
// Template IDs for type safety
// ─────────────────────────────────────────────────────────────────────────────

export const TEMPLATE_IDS = {
    EXECUTIVE_PRO: 'executive-pro',
    MINIMAL_ELEGANCE: 'minimal-elegance',
    BOLD_MODERN: 'bold-modern',
    CLASSIC_PROFESSIONAL: 'classic-professional',
    CREATIVE_SPLASH: 'creative-splash',
    TECH_MINIMAL: 'tech-minimal',
    ELEGANT_SERIF: 'elegant-serif',
} as const;

export type TemplateId = typeof TEMPLATE_IDS[keyof typeof TEMPLATE_IDS];
