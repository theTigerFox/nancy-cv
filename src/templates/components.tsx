// ============================================================================
// NANCY CV - Base Template Component
// Reusable building blocks for all templates
// ============================================================================

import React, { forwardRef } from 'react';
import { CvData } from '../types/cv.d';
import { TemplateConfig, TemplateProps } from './types';
import { 
    generateCSSVariables, 
    getContrastColor, 
    colorWithOpacity,
    getLevelText,
    getLanguageCEFR 
} from './utils';
import { 
    Mail, 
    Phone, 
    MapPin, 
    Linkedin, 
    Globe, 
    Github,
    Briefcase,
    GraduationCap,
    Award,
    Code,
    Languages,
    User,
    Star,
    Circle
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Template Wrapper
// ─────────────────────────────────────────────────────────────────────────────

interface TemplateWrapperProps {
    children: React.ReactNode;
    config: TemplateConfig;
    mode?: 'preview' | 'print' | 'export' | 'edit';
    scale?: number;
    className?: string;
}

export const TemplateWrapper = forwardRef<HTMLDivElement, TemplateWrapperProps>(
    ({ children, config, mode = 'preview', scale = 1, className = '' }, ref) => {
        const cssVars = generateCSSVariables(config);
        const style: React.CSSProperties = {
            ...Object.fromEntries(Object.entries(cssVars)),
            maxWidth: '210mm',
            minHeight: '297mm',
            backgroundColor: config.colors.background,
            color: config.colors.text,
            fontFamily: config.typography.fontBody,
            fontSize: `${config.typography.baseFontSize}px`,
            lineHeight: config.typography.lineHeight,
            transform: mode === 'preview' ? `scale(${scale})` : undefined,
            transformOrigin: 'top center',
        };

        return (
            <div
                ref={ref}
                className={`cv-template ${className}`}
                style={style}
                data-mode={mode}
                data-template-id={config.metadata.id}
            >
                {children}
            </div>
        );
    }
);

TemplateWrapper.displayName = 'TemplateWrapper';

// ─────────────────────────────────────────────────────────────────────────────
// Section Components
// ─────────────────────────────────────────────────────────────────────────────

interface SectionProps {
    title: string;
    icon?: React.ReactNode;
    config: TemplateConfig;
    children: React.ReactNode;
    className?: string;
}

export const Section: React.FC<SectionProps> = ({
    title,
    icon,
    config,
    children,
    className = '',
}) => {
    const { colors, typography, sections, spacing } = config;
    const titleStyle = sections.titleStyle;

    const getTitleStyles = (): React.CSSProperties => {
        const base: React.CSSProperties = {
            fontSize: `${typography.sectionTitleSize}rem`,
            fontFamily: typography.fontHeading,
            fontWeight: 700,
            letterSpacing: typography.letterSpacing,
            marginBottom: `${spacing.itemGap}px`,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
        };

        switch (titleStyle) {
            case 'underline':
                return {
                    ...base,
                    borderBottom: `2px solid ${colors.primary}`,
                    paddingBottom: '8px',
                };
            case 'background':
                return {
                    ...base,
                    backgroundColor: colorWithOpacity(colors.primary, 0.1),
                    padding: '8px 12px',
                    borderRadius: '4px',
                };
            case 'border-left':
                return {
                    ...base,
                    borderLeft: `4px solid ${colors.primary}`,
                    paddingLeft: '12px',
                };
            default:
                return base;
        }
    };

    return (
        <section className={className} style={{ marginBottom: `${spacing.sectionGap}px` }}>
            <h2 style={getTitleStyles()}>
                {sections.useIcons && icon && (
                    <span style={{ color: colors.primary }}>{icon}</span>
                )}
                {title}
            </h2>
            <div style={{ paddingLeft: sections.titleStyle === 'border-left' ? '16px' : 0 }}>
                {children}
            </div>
        </section>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Contact Info Component
// ─────────────────────────────────────────────────────────────────────────────

interface ContactInfoProps {
    personalInfo: CvData['personalInfo'];
    config: TemplateConfig;
    layout?: 'horizontal' | 'vertical';
}

export const ContactInfo: React.FC<ContactInfoProps> = ({
    personalInfo,
    config,
    layout = 'horizontal',
}) => {
    const { colors, typography } = config;
    const items = [
        { icon: <Mail size={14} />, value: personalInfo.email },
        { icon: <Phone size={14} />, value: personalInfo.phone },
        { icon: <MapPin size={14} />, value: personalInfo.address },
    ].filter(item => item.value);

    const containerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: layout === 'horizontal' ? 'row' : 'column',
        flexWrap: 'wrap',
        gap: layout === 'horizontal' ? '16px' : '8px',
        fontSize: `${typography.smallSize}rem`,
        color: colors.textLight,
    };

    const itemStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
    };

    return (
        <div style={containerStyle}>
            {items.map((item, index) => (
                <div key={index} style={itemStyle}>
                    <span style={{ color: colors.primary }}>{item.icon}</span>
                    <span>{item.value}</span>
                </div>
            ))}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Skills Display Component
// ─────────────────────────────────────────────────────────────────────────────

interface SkillsDisplayProps {
    skills: CvData['skills'];
    config: TemplateConfig;
}

export const SkillsDisplay: React.FC<SkillsDisplayProps> = ({ skills, config }) => {
    const { colors, typography, sections, spacing } = config;
    const { type, showLevel, fillColor, backgroundColor } = sections.skills;

    const fill = fillColor || colors.primary;
    const bg = backgroundColor || colorWithOpacity(colors.border, 0.5);

    if (type === 'tags') {
        return (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {skills.map(skill => (
                    <span
                        key={skill.id}
                        style={{
                            padding: '4px 12px',
                            backgroundColor: colorWithOpacity(fill, 0.1),
                            color: fill,
                            borderRadius: '9999px',
                            fontSize: `${typography.smallSize}rem`,
                            fontWeight: 500,
                        }}
                    >
                        {skill.name}
                    </span>
                ))}
            </div>
        );
    }

    if (type === 'simple') {
        return (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {skills.map((skill, index) => (
                    <span key={skill.id} style={{ fontSize: `${typography.bodySize}rem` }}>
                        {skill.name}
                        {index < skills.length - 1 && ' • '}
                    </span>
                ))}
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: `${spacing.itemGap}px` }}>
            {skills.map(skill => (
                <div key={skill.id}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '4px',
                            fontSize: `${typography.bodySize}rem`,
                        }}
                    >
                        <span style={{ fontWeight: 500 }}>{skill.name}</span>
                        {showLevel && type !== 'bars' && (
                            <span style={{ color: colors.textLight, fontSize: `${typography.smallSize}rem` }}>
                                {getLevelText(skill.level, 'skill')}
                            </span>
                        )}
                    </div>

                    {type === 'bars' && (
                        <div
                            style={{
                                height: '6px',
                                backgroundColor: bg,
                                borderRadius: '3px',
                                overflow: 'hidden',
                            }}
                        >
                            <div
                                style={{
                                    height: '100%',
                                    width: `${(skill.level / 10) * 100}%`,
                                    backgroundColor: fill,
                                    borderRadius: '3px',
                                    transition: 'width 0.3s ease',
                                }}
                            />
                        </div>
                    )}

                    {type === 'dots' && (
                        <div style={{ display: 'flex', gap: '4px' }}>
                            {[...Array(10)].map((_, i) => (
                                <div
                                    key={i}
                                    style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        backgroundColor: i < skill.level ? fill : bg,
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {type === 'percentage' && (
                        <span style={{ color: colors.textLight, fontSize: `${typography.smallSize}rem` }}>
                            {(skill.level / 10) * 100}%
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Languages Display Component
// ─────────────────────────────────────────────────────────────────────────────

interface LanguagesDisplayProps {
    languages: CvData['languages'];
    config: TemplateConfig;
}

export const LanguagesDisplay: React.FC<LanguagesDisplayProps> = ({ languages, config }) => {
    const { colors, typography, sections, spacing } = config;
    const { type, showLevelText } = sections.languages;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: `${spacing.itemGap}px` }}>
            {languages.map(lang => (
                <div key={lang.id}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: `${typography.bodySize}rem`,
                        }}
                    >
                        <span style={{ fontWeight: 500 }}>{lang.name}</span>
                        {showLevelText && (
                            <span style={{ color: colors.textLight, fontSize: `${typography.smallSize}rem` }}>
                                {getLevelText(lang.level, 'language')} ({getLanguageCEFR(lang.level)})
                            </span>
                        )}
                    </div>

                    {type === 'bars' && (
                        <div
                            style={{
                                height: '6px',
                                backgroundColor: colorWithOpacity(colors.border, 0.5),
                                borderRadius: '3px',
                                overflow: 'hidden',
                                marginTop: '4px',
                            }}
                        >
                            <div
                                style={{
                                    height: '100%',
                                    width: `${(lang.level / 5) * 100}%`,
                                    backgroundColor: colors.primary,
                                    borderRadius: '3px',
                                }}
                            />
                        </div>
                    )}

                    {type === 'dots' && (
                        <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    style={{
                                        width: '10px',
                                        height: '10px',
                                        borderRadius: '50%',
                                        backgroundColor: i < lang.level ? colors.primary : colorWithOpacity(colors.border, 0.5),
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {type === 'stars' && (
                        <div style={{ display: 'flex', gap: '2px', marginTop: '4px' }}>
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={14}
                                    fill={i < lang.level ? colors.primary : 'none'}
                                    stroke={colors.primary}
                                />
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Timeline Component (for Experience & Education)
// ─────────────────────────────────────────────────────────────────────────────

interface TimelineItemProps {
    title: string;
    subtitle: string;
    startDate: string;
    endDate: string;
    description?: string;
    config: TemplateConfig;
    isLast?: boolean;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({
    title,
    subtitle,
    startDate,
    endDate,
    description,
    config,
    isLast = false,
}) => {
    const { colors, typography, sections, spacing } = config;
    const { showLine, showDots, position, dotStyle } = sections.timeline;

    const getDotShape = (): React.CSSProperties => {
        const base: React.CSSProperties = {
            width: '12px',
            height: '12px',
            backgroundColor: colors.primary,
            flexShrink: 0,
        };

        switch (dotStyle) {
            case 'square':
                return { ...base, borderRadius: '2px' };
            case 'diamond':
                return { ...base, borderRadius: '2px', transform: 'rotate(45deg)' };
            default:
                return { ...base, borderRadius: '50%' };
        }
    };

    const showTimeline = showLine || showDots;

    return (
        <div
            style={{
                display: 'flex',
                gap: '16px',
                paddingBottom: isLast ? 0 : `${spacing.itemGap}px`,
            }}
        >
            {showTimeline && position !== 'none' && (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '12px',
                    }}
                >
                    {showDots && <div style={getDotShape()} />}
                    {showLine && !isLast && (
                        <div
                            style={{
                                width: '2px',
                                flex: 1,
                                backgroundColor: colorWithOpacity(colors.primary, 0.2),
                                marginTop: showDots ? '4px' : 0,
                            }}
                        />
                    )}
                </div>
            )}

            <div style={{ flex: 1 }}>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap',
                        gap: '8px',
                    }}
                >
                    <div>
                        <h3
                            style={{
                                fontSize: `${typography.bodySize * 1.1}rem`,
                                fontWeight: 600,
                                fontFamily: typography.fontHeading,
                                marginBottom: '2px',
                            }}
                        >
                            {title}
                        </h3>
                        <p style={{ color: colors.textLight, fontSize: `${typography.bodySize}rem` }}>
                            {subtitle}
                        </p>
                    </div>
                    <span
                        style={{
                            fontSize: `${typography.smallSize}rem`,
                            color: colors.textLight,
                            backgroundColor: colorWithOpacity(colors.primary, 0.1),
                            padding: '2px 8px',
                            borderRadius: '4px',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {startDate} - {endDate || 'Présent'}
                    </span>
                </div>

                {description && (
                    <p
                        style={{
                            marginTop: '8px',
                            fontSize: `${typography.bodySize}rem`,
                            color: colors.text,
                            lineHeight: typography.lineHeight,
                            whiteSpace: 'pre-line',
                        }}
                    >
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Photo Component
// ─────────────────────────────────────────────────────────────────────────────

interface PhotoProps {
    src?: string;
    config: TemplateConfig;
    className?: string;
}

export const Photo: React.FC<PhotoProps> = ({ src, config, className = '' }) => {
    const { layout, colors } = config;

    if (!src || !layout.showPhoto) return null;

    const getShapeStyles = (): React.CSSProperties => {
        const base: React.CSSProperties = {
            width: `${layout.photoSize}px`,
            height: `${layout.photoSize}px`,
            objectFit: 'cover',
            border: `3px solid ${colors.primary}`,
        };

        switch (layout.photoShape) {
            case 'circle':
                return { ...base, borderRadius: '50%' };
            case 'rounded':
                return { ...base, borderRadius: '12px' };
            default:
                return base;
        }
    };

    return (
        <img
            src={src}
            alt="Photo de profil"
            style={getShapeStyles()}
            className={className}
        />
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Section Icons
// ─────────────────────────────────────────────────────────────────────────────

export const SECTION_ICONS = {
    contact: Mail,
    description: User,
    experience: Briefcase,
    education: GraduationCap,
    skills: Code,
    languages: Languages,
    certifications: Award,
    projects: Globe,
};

export const getSectionIcon = (section: string, size: number = 18) => {
    const Icon = SECTION_ICONS[section as keyof typeof SECTION_ICONS];
    return Icon ? <Icon size={size} /> : null;
};
