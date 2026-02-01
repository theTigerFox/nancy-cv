// ============================================================================
// NANCY CV - PDF Styles & Typography
// ============================================================================

import { StyleSheet, Font } from '@react-pdf/renderer';

// ─────────────────────────────────────────────────────────────────────────────
// Font Registration - Using bundled fonts for reliability
// ─────────────────────────────────────────────────────────────────────────────

// Use Helvetica (built-in) as primary font - no registration needed
// Helvetica is always available in PDF and provides excellent readability

// Register Open Sans from a reliable CDN as alternative
Font.register({
    family: 'Open Sans',
    fonts: [
        { 
            src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf',
            fontWeight: 400 
        },
        { 
            src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf',
            fontWeight: 600 
        },
        { 
            src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-700.ttf',
            fontWeight: 700 
        },
        { 
            src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-300.ttf',
            fontWeight: 300 
        },
        { 
            src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-italic.ttf',
            fontWeight: 400,
            fontStyle: 'italic'
        },
    ],
});

// Hyphenation callback to improve text wrapping
Font.registerHyphenationCallback(word => [word]);

// ─────────────────────────────────────────────────────────────────────────────
// Color Palettes
// ─────────────────────────────────────────────────────────────────────────────

export const COLORS = {
    black: '#000000',
    white: '#FFFFFF',
    gray: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827',
    },
    primary: {
        50: '#EEF2FF',
        100: '#E0E7FF',
        500: '#6366F1',
        600: '#4F46E5',
        700: '#4338CA',
    },
    accent: {
        lime: '#BFFF00',
        pink: '#FF6B9D',
        blue: '#3B82F6',
    },
};

// ─────────────────────────────────────────────────────────────────────────────
// Typography Scale (in points for PDF)
// ─────────────────────────────────────────────────────────────────────────────

export const FONT_SIZES = {
    xs: 8,
    sm: 9,
    base: 10,
    md: 11,
    lg: 12,
    xl: 14,
    '2xl': 16,
    '3xl': 20,
    '4xl': 24,
    '5xl': 30,
};

// ─────────────────────────────────────────────────────────────────────────────
// Spacing Scale (in points)
// ─────────────────────────────────────────────────────────────────────────────

export const SPACING = {
    0: 0,
    1: 2,
    2: 4,
    3: 6,
    4: 8,
    5: 10,
    6: 12,
    8: 16,
    10: 20,
    12: 24,
    16: 32,
    20: 40,
    24: 48,
};

// ─────────────────────────────────────────────────────────────────────────────
// A4 Page Dimensions
// ─────────────────────────────────────────────────────────────────────────────

export const PAGE = {
    width: 595.28, // A4 width in points
    height: 841.89, // A4 height in points
    margin: {
        small: 30,
        medium: 40,
        large: 50,
    },
};

// ─────────────────────────────────────────────────────────────────────────────
// Base Styles
// ─────────────────────────────────────────────────────────────────────────────

export const baseStyles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: FONT_SIZES.base,
        lineHeight: 1.5,
        color: COLORS.gray[800],
        backgroundColor: COLORS.white,
        padding: PAGE.margin.medium,
    },
    
    // Typography
    h1: {
        fontFamily: 'Helvetica-Bold',
        fontSize: FONT_SIZES['4xl'],
        fontWeight: 700,
        color: COLORS.gray[900],
        marginBottom: SPACING[2],
    },
    h2: {
        fontFamily: 'Helvetica-Bold',
        fontSize: FONT_SIZES.xl,
        fontWeight: 600,
        color: COLORS.gray[800],
        marginBottom: SPACING[3],
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    h3: {
        fontFamily: 'Helvetica-Bold',
        fontSize: FONT_SIZES.md,
        fontWeight: 600,
        color: COLORS.gray[700],
        marginBottom: SPACING[1],
    },
    body: {
        fontSize: FONT_SIZES.base,
        lineHeight: 1.6,
        color: COLORS.gray[600],
    },
    small: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.gray[500],
    },
    
    // Layout
    section: {
        marginBottom: SPACING[10],
    },
    row: {
        flexDirection: 'row',
    },
    col: {
        flexDirection: 'column',
    },
    spaceBetween: {
        justifyContent: 'space-between',
    },
    alignCenter: {
        alignItems: 'center',
    },
    
    // Dividers
    divider: {
        height: 1,
        backgroundColor: COLORS.gray[200],
        marginVertical: SPACING[6],
    },
    dividerThick: {
        height: 2,
        backgroundColor: COLORS.gray[300],
        marginVertical: SPACING[8],
    },
    
    // Links (no underline by default)
    link: {
        color: COLORS.gray[700],
        textDecoration: 'none',
    },
    
    // Lists
    listItem: {
        flexDirection: 'row',
        marginBottom: SPACING[2],
    },
    bullet: {
        width: 12,
        fontSize: FONT_SIZES.sm,
    },
    listContent: {
        flex: 1,
    },
    
    // Tags/Pills
    tag: {
        backgroundColor: COLORS.gray[100],
        paddingHorizontal: SPACING[3],
        paddingVertical: SPACING[1],
        borderRadius: 3,
        fontSize: FONT_SIZES.xs,
        color: COLORS.gray[600],
        marginRight: SPACING[2],
        marginBottom: SPACING[2],
    },
});

// ─────────────────────────────────────────────────────────────────────────────
// Utility Functions
// ─────────────────────────────────────────────────────────────────────────────

export const formatDate = (date: string | undefined): string => {
    if (!date) return '';
    if (date.toLowerCase() === 'present' || date.toLowerCase() === 'présent') {
        return 'Présent';
    }
    
    // Handle YYYY-MM format
    const parts = date.split('-');
    if (parts.length === 2) {
        const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
        const monthIndex = parseInt(parts[1], 10) - 1;
        return `${months[monthIndex] || ''} ${parts[0]}`;
    }
    
    return date;
};

export const getLanguageLevelText = (level: string | number): string => {
    if (typeof level === 'number') {
        const levels = ['Débutant', 'Élémentaire', 'Intermédiaire', 'Avancé', 'Expert'];
        return levels[Math.min(level - 1, 4)] || 'Intermédiaire';
    }
    
    const levelMap: Record<string, string> = {
        A1: 'Débutant',
        A2: 'Élémentaire',
        B1: 'Intermédiaire',
        B2: 'Intermédiaire avancé',
        C1: 'Avancé',
        C2: 'Maîtrise',
        native: 'Langue maternelle',
    };
    
    return levelMap[level] || level;
};

export const getSkillLevelPercentage = (level: number): number => {
    return Math.min(100, Math.max(0, level * 10));
};
