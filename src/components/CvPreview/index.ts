// ============================================================================
// NANCY CV - CV Templates Index
// ============================================================================

import { forwardRef, ComponentType } from 'react';
import { CVData } from '../../types/cv';

// Import all templates
import CvPreviewBrutalist from './Brutalist/CvPreviewBrutalist';
import CvPreviewTemplate1 from './Template 1/CvPreviewTemplate1';
import CvPreviewTemplate2 from './Template 2/CvPreviewTemplate2';
import CvPreviewTemplate3 from './Template 3/CvPreviewTemplate3';
import CvPreviewTemplate4 from './Template 4/CvPreviewTemplate4';
import CvPreviewTemplate5 from './Template 5/CvPreviewTemplate5';

// ─────────────────────────────────────────────────────────────────────────────
// Template Configuration
// ─────────────────────────────────────────────────────────────────────────────

export interface TemplateConfig {
    id: string;
    name: string;
    description: string;
    category: 'modern' | 'classic' | 'creative' | 'minimal';
    component: ComponentType<any>;
    thumbnail?: string;
    isPremium?: boolean;
}

export const CV_TEMPLATES: TemplateConfig[] = [
    {
        id: 'brutalist',
        name: 'Brutalist',
        description: 'Design audacieux avec bordures épaisses et typographie forte',
        category: 'creative',
        component: CvPreviewBrutalist,
    },
    {
        id: 'template-1',
        name: 'Professionnel',
        description: 'Layout classique deux colonnes avec couleur d\'accent personnalisable',
        category: 'classic',
        component: CvPreviewTemplate1,
    },
    {
        id: 'template-2',
        name: 'Élégant',
        description: 'Design épuré avec une mise en page moderne',
        category: 'modern',
        component: CvPreviewTemplate2,
    },
    {
        id: 'template-3',
        name: 'Créatif',
        description: 'Mise en page originale pour les profils créatifs',
        category: 'creative',
        component: CvPreviewTemplate3,
    },
    {
        id: 'template-4',
        name: 'Minimaliste',
        description: 'Design simple et aéré axé sur le contenu',
        category: 'minimal',
        component: CvPreviewTemplate4,
    },
    {
        id: 'template-5',
        name: 'Moderne',
        description: 'Style contemporain avec éléments graphiques',
        category: 'modern',
        component: CvPreviewTemplate5,
    },
];

// ─────────────────────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────────────────────

export {
    CvPreviewBrutalist,
    CvPreviewTemplate1,
    CvPreviewTemplate2,
    CvPreviewTemplate3,
    CvPreviewTemplate4,
    CvPreviewTemplate5,
};

export const getTemplateById = (id: string): TemplateConfig | undefined => {
    return CV_TEMPLATES.find(t => t.id === id);
};

export const getTemplatesByCategory = (category: TemplateConfig['category']): TemplateConfig[] => {
    return CV_TEMPLATES.filter(t => t.category === category);
};
