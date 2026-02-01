// ============================================================================
// NANCY CV - Minimal Elegance Template
// Template épuré et sophistiqué avec beaucoup d'espace blanc
// ============================================================================

import React, { forwardRef } from 'react';
import { TemplateProps } from '../../types';
import { TemplateWrapper, SkillsDisplay, LanguagesDisplay, Section } from '../../components';
import { getLevelText } from '../../utils';

const MinimalEleganceTemplate = forwardRef<HTMLDivElement, TemplateProps>(
    ({ cvData, config, mode = 'preview', scale = 1 }, ref) => {
        const { personalInfo, education, experience, skills, languages } = cvData;
        const { colors, typography, spacing } = config;

        // Style pour les titres de section
        const sectionTitleStyle: React.CSSProperties = {
            fontSize: `${typography.sectionTitleSize}rem`,
            fontFamily: typography.fontBody,
            fontWeight: 500,
            letterSpacing: typography.letterSpacing,
            textTransform: 'uppercase',
            color: colors.textLight,
            marginBottom: `${spacing.itemGap * 1.5}px`,
        };

        // Style pour les séparateurs
        const dividerStyle: React.CSSProperties = {
            width: '100%',
            height: '1px',
            backgroundColor: colors.border,
            margin: `${spacing.sectionGap}px 0`,
        };

        return (
            <TemplateWrapper ref={ref} config={config} mode={mode} scale={scale}>
                <div style={{ padding: `${spacing.pageMargin}mm` }}>
                    
                    {/* Header - Centered, Elegant */}
                    <header style={{ textAlign: 'center', marginBottom: `${spacing.sectionGap * 1.5}px` }}>
                        <h1
                            style={{
                                fontSize: `${typography.nameSize}rem`,
                                fontFamily: typography.fontHeading,
                                fontWeight: 400,
                                color: colors.primary,
                                letterSpacing: '0.05em',
                                marginBottom: '8px',
                                lineHeight: 1.1,
                            }}
                        >
                            {personalInfo.firstName} {personalInfo.lastName}
                        </h1>
                        
                        <p
                            style={{
                                fontSize: `${typography.jobTitleSize}rem`,
                                fontFamily: typography.fontBody,
                                fontWeight: 300,
                                color: colors.textLight,
                                letterSpacing: typography.letterSpacing,
                                textTransform: 'uppercase',
                                marginBottom: `${spacing.itemGap}px`,
                            }}
                        >
                            {personalInfo.jobTitle}
                        </p>

                        {/* Contact - Minimal inline */}
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: `${spacing.itemGap * 2}px`,
                                fontSize: `${typography.smallSize}rem`,
                                color: colors.textLight,
                                flexWrap: 'wrap',
                            }}
                        >
                            {personalInfo.email && <span>{personalInfo.email}</span>}
                            {personalInfo.phone && <span>{personalInfo.phone}</span>}
                            {personalInfo.address && <span>{personalInfo.address}</span>}
                        </div>
                    </header>

                    {/* Thin Divider */}
                    <div style={dividerStyle} />

                    {/* Profile / Description */}
                    {personalInfo.description && (
                        <>
                            <section style={{ marginBottom: `${spacing.sectionGap}px` }}>
                                <h2 style={sectionTitleStyle}>Profil</h2>
                                <p
                                    style={{
                                        fontSize: `${typography.bodySize}rem`,
                                        lineHeight: typography.lineHeight,
                                        color: colors.text,
                                        textAlign: 'justify',
                                        maxWidth: '100%',
                                    }}
                                >
                                    {personalInfo.description}
                                </p>
                            </section>
                            <div style={dividerStyle} />
                        </>
                    )}

                    {/* Experience */}
                    {experience.length > 0 && experience[0].title && (
                        <>
                            <section style={{ marginBottom: `${spacing.sectionGap}px` }}>
                                <h2 style={sectionTitleStyle}>Expérience</h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: `${spacing.itemGap * 1.5}px` }}>
                                    {experience.map((exp) => (
                                        <div key={exp.id}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                                                <h3
                                                    style={{
                                                        fontSize: `${typography.bodySize * 1.1}rem`,
                                                        fontFamily: typography.fontHeading,
                                                        fontWeight: 500,
                                                        color: colors.primary,
                                                    }}
                                                >
                                                    {exp.title}
                                                </h3>
                                                <span
                                                    style={{
                                                        fontSize: `${typography.smallSize}rem`,
                                                        color: colors.textLight,
                                                        flexShrink: 0,
                                                        marginLeft: '16px',
                                                    }}
                                                >
                                                    {exp.startDate} — {exp.endDate || 'Présent'}
                                                </span>
                                            </div>
                                            <p
                                                style={{
                                                    fontSize: `${typography.bodySize}rem`,
                                                    color: colors.textLight,
                                                    fontStyle: 'italic',
                                                    marginBottom: '6px',
                                                }}
                                            >
                                                {exp.company}
                                            </p>
                                            {exp.description && (
                                                <p
                                                    style={{
                                                        fontSize: `${typography.bodySize}rem`,
                                                        color: colors.text,
                                                        lineHeight: typography.lineHeight,
                                                        whiteSpace: 'pre-line',
                                                    }}
                                                >
                                                    {exp.description}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                            <div style={dividerStyle} />
                        </>
                    )}

                    {/* Education */}
                    {education.length > 0 && education[0].degree && (
                        <>
                            <section style={{ marginBottom: `${spacing.sectionGap}px` }}>
                                <h2 style={sectionTitleStyle}>Formation</h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: `${spacing.itemGap}px` }}>
                                    {education.map((edu) => (
                                        <div key={edu.id}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                                <div>
                                                    <h3
                                                        style={{
                                                            fontSize: `${typography.bodySize * 1.05}rem`,
                                                            fontFamily: typography.fontHeading,
                                                            fontWeight: 500,
                                                            color: colors.primary,
                                                        }}
                                                    >
                                                        {edu.degree}
                                                    </h3>
                                                    <p
                                                        style={{
                                                            fontSize: `${typography.bodySize}rem`,
                                                            color: colors.textLight,
                                                            fontStyle: 'italic',
                                                        }}
                                                    >
                                                        {edu.school}
                                                    </p>
                                                </div>
                                                <span
                                                    style={{
                                                        fontSize: `${typography.smallSize}rem`,
                                                        color: colors.textLight,
                                                        flexShrink: 0,
                                                        marginLeft: '16px',
                                                    }}
                                                >
                                                    {edu.startDate} — {edu.endDate}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                            <div style={dividerStyle} />
                        </>
                    )}

                    {/* Two Column Footer: Skills + Languages */}
                    <div style={{ display: 'flex', gap: `${spacing.sectionGap * 2}px` }}>
                        {/* Skills - Uses configurable display component */}
                        {skills.length > 0 && skills[0].name && (
                            <section style={{ flex: 1 }}>
                                <h2 style={sectionTitleStyle}>Compétences</h2>
                                <SkillsDisplay skills={skills} config={config} />
                            </section>
                        )}

                        {/* Languages - Uses configurable display component */}
                        {languages.length > 0 && languages[0].name && (
                            <section style={{ flex: 1 }}>
                                <h2 style={sectionTitleStyle}>Langues</h2>
                                <LanguagesDisplay languages={languages} config={config} />
                            </section>
                        )}
                    </div>

                </div>
            </TemplateWrapper>
        );
    }
);

MinimalEleganceTemplate.displayName = 'MinimalEleganceTemplate';

export default MinimalEleganceTemplate;
