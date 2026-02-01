// ============================================================================
// NANCY CV - Template System Main Export
// ============================================================================

// Types
export * from './types';

// Utilities
export * from './utils';

// Registry
export { 
    templateRegistry,
    getTemplateConfig,
    getTemplateComponent,
    getTemplatePreviewUrl,
} from './registry';

// Base Components
export {
    TemplateWrapper,
    Section,
    ContactInfo,
    SkillsDisplay,
    LanguagesDisplay,
    TimelineItem,
    Photo,
    SECTION_ICONS,
    getSectionIcon,
} from './components';
