// ============================================================================
// NANCY CV - Template System Types
// Version 2.0 - JSON-Driven Template Architecture
// ============================================================================

import { CvData } from '../types/cv.d';

// ─────────────────────────────────────────────────────────────────────────────
// Template Styling Configuration
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Configuration des couleurs du template
 * Permet à l'utilisateur de personnaliser chaque couleur
 */
export interface TemplateColors {
    /** Couleur principale (headers, accents) */
    primary: string;
    /** Couleur secondaire (sous-titres, éléments secondaires) */
    secondary: string;
    /** Couleur du texte principal */
    text: string;
    /** Couleur du texte léger/secondaire */
    textLight: string;
    /** Couleur de fond principale */
    background: string;
    /** Couleur de fond alternative (sidebar, sections) */
    backgroundAlt: string;
    /** Couleur des bordures */
    border: string;
    /** Couleur d'accent (éléments interactifs, highlights) */
    accent: string;
}

/**
 * Configuration typographique du template
 */
export interface TemplateTypography {
    /** Font family pour les titres */
    fontHeading: string;
    /** Font family pour le texte */
    fontBody: string;
    /** Taille de base (px) - les autres tailles seront calculées proportionnellement */
    baseFontSize: number;
    /** Taille du nom (rem) */
    nameSize: number;
    /** Taille du titre de poste (rem) */
    jobTitleSize: number;
    /** Taille des titres de section (rem) */
    sectionTitleSize: number;
    /** Taille du texte normal (rem) */
    bodySize: number;
    /** Taille du texte petit (rem) */
    smallSize: number;
    /** Hauteur de ligne */
    lineHeight: number;
    /** Espacement des lettres pour les titres */
    letterSpacing: string;
}

/**
 * Configuration de l'espacement du template
 */
export interface TemplateSpacing {
    /** Marge extérieure du document (mm) */
    pageMargin: number;
    /** Espacement entre les sections (px) */
    sectionGap: number;
    /** Espacement interne des sections (px) */
    sectionPadding: number;
    /** Espacement entre les éléments de liste (px) */
    itemGap: number;
}

/**
 * Configuration du layout du template
 */
export interface TemplateLayout {
    /** Type de layout: 'single' | 'two-column' | 'sidebar-left' | 'sidebar-right' */
    type: 'single' | 'two-column' | 'sidebar-left' | 'sidebar-right';
    /** Largeur de la sidebar en pourcentage (si applicable) */
    sidebarWidth?: number;
    /** Sections à afficher dans la sidebar */
    sidebarSections?: SectionType[];
    /** Sections à afficher dans le contenu principal */
    mainSections?: SectionType[];
    /** Afficher la photo */
    showPhoto: boolean;
    /** Position de la photo: 'header' | 'sidebar' | 'inline' */
    photoPosition: 'header' | 'sidebar' | 'inline';
    /** Forme de la photo: 'circle' | 'square' | 'rounded' */
    photoShape: 'circle' | 'square' | 'rounded';
    /** Taille de la photo (px) */
    photoSize: number;
}

/**
 * Types de sections disponibles
 */
export type SectionType = 
    | 'personal-info'
    | 'contact'
    | 'description'
    | 'experience'
    | 'education'
    | 'skills'
    | 'languages'
    | 'certifications'
    | 'projects'
    | 'interests'
    | 'references';

/**
 * Style d'affichage des compétences
 */
export interface SkillsDisplayStyle {
    /** Type d'affichage: 'bars' | 'dots' | 'percentage' | 'tags' | 'simple' */
    type: 'bars' | 'dots' | 'percentage' | 'tags' | 'simple';
    /** Afficher le niveau */
    showLevel: boolean;
    /** Couleur de remplissage (utilise primary si non défini) */
    fillColor?: string;
    /** Couleur de fond de la barre */
    backgroundColor?: string;
}

/**
 * Style d'affichage des langues
 */
export interface LanguagesDisplayStyle {
    /** Type d'affichage: 'bars' | 'dots' | 'stars' | 'text' | 'flags' */
    type: 'bars' | 'dots' | 'stars' | 'text' | 'flags';
    /** Afficher le niveau textuel */
    showLevelText: boolean;
}

/**
 * Style d'affichage de la timeline (expérience/éducation)
 */
export interface TimelineStyle {
    /** Afficher la ligne de timeline */
    showLine: boolean;
    /** Afficher les points/dots */
    showDots: boolean;
    /** Position de la timeline: 'left' | 'right' | 'none' */
    position: 'left' | 'right' | 'none';
    /** Style des points: 'circle' | 'square' | 'diamond' */
    dotStyle: 'circle' | 'square' | 'diamond';
}

/**
 * Configuration des sections du template
 */
export interface TemplateSections {
    /** Style d'affichage des compétences */
    skills: SkillsDisplayStyle;
    /** Style d'affichage des langues */
    languages: LanguagesDisplayStyle;
    /** Style de la timeline */
    timeline: TimelineStyle;
    /** Icônes pour les sections */
    useIcons: boolean;
    /** Style des titres de section: 'underline' | 'background' | 'border-left' | 'simple' */
    titleStyle: 'underline' | 'background' | 'border-left' | 'simple';
}

// ─────────────────────────────────────────────────────────────────────────────
// Template Metadata & Configuration
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Métadonnées du template
 */
export interface TemplateMetadata {
    /** Identifiant unique du template */
    id: string;
    /** Nom du template */
    name: string;
    /** Description courte */
    description: string;
    /** Version du template */
    version: string;
    /** Auteur du template */
    author: string;
    /** Date de création */
    createdAt: string;
    /** Date de dernière modification */
    updatedAt: string;
    /** Catégorie: 'modern' | 'classic' | 'creative' | 'minimal' | 'professional' */
    category: 'modern' | 'classic' | 'creative' | 'minimal' | 'professional';
    /** Tags pour la recherche */
    tags: string[];
    /** Template premium */
    isPremium: boolean;
    /** Secteurs recommandés */
    industries: string[];
    /** Niveau d'expérience recommandé: 'junior' | 'mid' | 'senior' | 'all' */
    experienceLevel: 'junior' | 'mid' | 'senior' | 'all';
}

/**
 * Configuration complète du template
 */
export interface TemplateConfig {
    /** Métadonnées */
    metadata: TemplateMetadata;
    /** Couleurs par défaut */
    colors: TemplateColors;
    /** Typographie */
    typography: TemplateTypography;
    /** Espacement */
    spacing: TemplateSpacing;
    /** Layout */
    layout: TemplateLayout;
    /** Sections */
    sections: TemplateSections;
}

// ─────────────────────────────────────────────────────────────────────────────
// Template Manifest (for auto-discovery)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Manifest du template - fichier template.json dans chaque dossier de template
 */
export interface TemplateManifest extends TemplateConfig {
    /** Chemin vers l'image de preview */
    previewImage: string;
    /** Chemin vers le composant React (relatif) */
    componentPath: string;
    /** Fichiers CSS additionnels */
    stylesheets?: string[];
    /** Dépendances spécifiques */
    dependencies?: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Template Component Props
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Props passées à chaque composant de template
 */
export interface TemplateProps {
    /** Données du CV */
    cvData: CvData;
    /** Configuration du template (avec personnalisations utilisateur) */
    config: TemplateConfig;
    /** Mode d'affichage: 'preview' | 'print' | 'export' */
    mode?: 'preview' | 'print' | 'export';
    /** Scale factor pour le preview */
    scale?: number;
}

/**
 * Type du composant de template
 */
export type TemplateComponent = React.ForwardRefExoticComponent<
    TemplateProps & React.RefAttributes<HTMLDivElement>
>;

// ─────────────────────────────────────────────────────────────────────────────
// Template Customization
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Personnalisations utilisateur pour un template
 * Stocké dans le profil utilisateur ou le CV
 */
export interface TemplateCustomization {
    /** ID du template de base (optionnel car peut etre derive du contexte) */
    templateId?: string;
    /** Surcharges de couleurs */
    colors?: Partial<TemplateColors>;
    /** Surcharges typographiques */
    typography?: Partial<TemplateTypography>;
    /** Surcharges d'espacement */
    spacing?: Partial<TemplateSpacing>;
    /** Surcharges de layout */
    layout?: Partial<TemplateLayout>;
    /** Surcharges de sections */
    sections?: Partial<TemplateSections>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Template Registry
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Entrée dans le registre des templates
 */
export interface TemplateRegistryEntry {
    /** Manifest du template */
    manifest: TemplateManifest;
    /** Composant React */
    component: TemplateComponent;
    /** URL de l'image de preview */
    previewUrl: string;
}

/**
 * Filtres pour rechercher des templates
 */
export interface TemplateSearchFilters {
    /** Recherche textuelle */
    query?: string;
    /** Filtrer par catégorie */
    category?: TemplateMetadata['category'];
    /** Filtrer par tags */
    tags?: string[];
    /** Filtrer par industrie */
    industry?: string;
    /** Filtrer par niveau d'expérience */
    experienceLevel?: TemplateMetadata['experienceLevel'];
    /** Inclure les templates premium */
    includePremium?: boolean;
}
