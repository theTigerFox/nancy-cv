// ============================================================================
// NANCY CV - Template Registry
// Auto-discovery & Management System
// ============================================================================

import { ComponentType } from 'react';
import {
    TemplateConfig,
    TemplateManifest,
    TemplateRegistryEntry,
    TemplateSearchFilters,
    TemplateProps,
    TemplateCustomization,
} from './types';
import { mergeTemplateConfig } from './utils';

// ─────────────────────────────────────────────────────────────────────────────
// Template Registry Class
// ─────────────────────────────────────────────────────────────────────────────

class TemplateRegistry {
    private templates: Map<string, TemplateRegistryEntry> = new Map();
    private initialized: boolean = false;

    /**
     * Enregistre un template dans le registre
     */
    register(
        manifest: TemplateManifest,
        component: ComponentType<TemplateProps>,
        previewUrl: string
    ): void {
        this.templates.set(manifest.metadata.id, {
            manifest,
            component: component as any,
            previewUrl,
        });
    }

    /**
     * Récupère un template par son ID
     */
    get(id: string): TemplateRegistryEntry | undefined {
        return this.templates.get(id);
    }

    /**
     * Récupère tous les templates
     */
    getAll(): TemplateRegistryEntry[] {
        return Array.from(this.templates.values());
    }

    /**
     * Recherche des templates selon des filtres
     */
    search(filters: TemplateSearchFilters): TemplateRegistryEntry[] {
        let results = this.getAll();

        // Filtre par catégorie
        if (filters.category) {
            results = results.filter(t => t.manifest.metadata.category === filters.category);
        }

        // Filtre par tags
        if (filters.tags && filters.tags.length > 0) {
            results = results.filter(t =>
                filters.tags!.some(tag =>
                    t.manifest.metadata.tags.includes(tag.toLowerCase())
                )
            );
        }

        // Filtre par industrie
        if (filters.industry) {
            results = results.filter(t =>
                t.manifest.metadata.industries.includes(filters.industry!)
            );
        }

        // Filtre par niveau d'expérience
        if (filters.experienceLevel) {
            results = results.filter(t =>
                t.manifest.metadata.experienceLevel === filters.experienceLevel ||
                t.manifest.metadata.experienceLevel === 'all'
            );
        }

        // Filtre premium
        if (!filters.includePremium) {
            results = results.filter(t => !t.manifest.metadata.isPremium);
        }

        // Recherche textuelle
        if (filters.query) {
            const query = filters.query.toLowerCase();
            results = results.filter(t => {
                const { name, description, tags } = t.manifest.metadata;
                return (
                    name.toLowerCase().includes(query) ||
                    description.toLowerCase().includes(query) ||
                    tags.some(tag => tag.includes(query))
                );
            });
        }

        return results;
    }

    /**
     * Récupère les templates par catégorie
     */
    getByCategory(category: TemplateManifest['metadata']['category']): TemplateRegistryEntry[] {
        return this.search({ category });
    }

    /**
     * Récupère les catégories disponibles avec le compte de templates
     */
    getCategories(): { category: string; count: number }[] {
        const categories = new Map<string, number>();
        
        this.getAll().forEach(t => {
            const cat = t.manifest.metadata.category;
            categories.set(cat, (categories.get(cat) || 0) + 1);
        });

        return Array.from(categories.entries()).map(([category, count]) => ({
            category,
            count,
        }));
    }

    /**
     * Récupère tous les tags uniques
     */
    getTags(): string[] {
        const tags = new Set<string>();
        this.getAll().forEach(t => {
            t.manifest.metadata.tags.forEach(tag => tags.add(tag));
        });
        return Array.from(tags).sort();
    }

    /**
     * Récupère toutes les industries uniques
     */
    getIndustries(): string[] {
        const industries = new Set<string>();
        this.getAll().forEach(t => {
            t.manifest.metadata.industries.forEach(ind => industries.add(ind));
        });
        return Array.from(industries).sort();
    }

    /**
     * Compte total de templates
     */
    get count(): number {
        return this.templates.size;
    }

    /**
     * Vérifie si le registre est initialisé
     */
    get isInitialized(): boolean {
        return this.initialized;
    }

    /**
     * Marque le registre comme initialisé
     */
    setInitialized(): void {
        this.initialized = true;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Singleton Instance
// ─────────────────────────────────────────────────────────────────────────────

export const templateRegistry = new TemplateRegistry();

// ─────────────────────────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Récupère la configuration finale d'un template avec les personnalisations
 */
export function getTemplateConfig(
    templateId: string,
    customization?: TemplateCustomization
): TemplateConfig | null {
    const entry = templateRegistry.get(templateId);
    if (!entry) return null;

    return mergeTemplateConfig(entry.manifest, customization);
}

/**
 * Récupère le composant d'un template
 */
export function getTemplateComponent(templateId: string): ComponentType<TemplateProps> | null {
    const entry = templateRegistry.get(templateId);
    return entry?.component || null;
}

/**
 * Récupère l'URL de preview d'un template
 */
export function getTemplatePreviewUrl(templateId: string): string | null {
    const entry = templateRegistry.get(templateId);
    return entry?.previewUrl || null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────────────────────

export type { TemplateRegistryEntry };
