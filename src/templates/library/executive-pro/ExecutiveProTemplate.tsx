// ============================================================================
// NANCY CV - Executive Pro Template
// Template professionnel haut de gamme pour cadres et dirigeants
// ============================================================================

import React, { forwardRef } from 'react';
import { TemplateProps } from '../../types';
import {
    TemplateWrapper,
    Section,
    ContactInfo,
    SkillsDisplay,
    LanguagesDisplay,
    TimelineItem,
    Photo,
    getSectionIcon,
} from '../../components';
import { colorWithOpacity, getContrastColor } from '../../utils';

const ExecutiveProTemplate = forwardRef<HTMLDivElement, TemplateProps>(
    ({ cvData, config, mode = 'preview', scale = 1 }, ref) => {
        const { personalInfo, education, experience, skills, languages } = cvData;
        const { colors, typography, spacing, layout } = config;

        const sidebarBg = colors.primary;
        const sidebarText = getContrastColor(sidebarBg);

        return (
            <TemplateWrapper ref={ref} config={config} mode={mode} scale={scale}>
                <div style={{ display: 'flex', minHeight: '297mm' }}>
                    {/* Sidebar */}
                    <aside
                        style={{
                            width: `${layout.sidebarWidth}%`,
                            backgroundColor: sidebarBg,
                            color: sidebarText,
                            padding: `${spacing.pageMargin}mm`,
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        {/* Photo */}
                        {layout.showPhoto && personalInfo.photo && (
                            <div style={{ marginBottom: spacing.sectionGap, textAlign: 'center' }}>
                                <img
                                    src={personalInfo.photo}
                                    alt="Photo"
                                    style={{
                                        width: `${layout.photoSize}px`,
                                        height: `${layout.photoSize}px`,
                                        objectFit: 'cover',
                                        border: `4px solid ${colors.accent}`,
                                    }}
                                />
                            </div>
                        )}

                        {/* Contact Section */}
                        <div style={{ marginBottom: spacing.sectionGap }}>
                            <h3
                                style={{
                                    fontSize: `${typography.sectionTitleSize}rem`,
                                    fontFamily: typography.fontHeading,
                                    fontWeight: 700,
                                    marginBottom: spacing.itemGap,
                                    borderBottom: `2px solid ${colors.accent}`,
                                    paddingBottom: '8px',
                                    color: sidebarText,
                                }}
                            >
                                Contact
                            </h3>
                            <div style={{ fontSize: `${typography.smallSize}rem`, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {personalInfo.email && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ color: colors.accent }}>✉</span>
                                        <span>{personalInfo.email}</span>
                                    </div>
                                )}
                                {personalInfo.phone && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ color: colors.accent }}>☎</span>
                                        <span>{personalInfo.phone}</span>
                                    </div>
                                )}
                                {personalInfo.address && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ color: colors.accent }}>⌂</span>
                                        <span>{personalInfo.address}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Skills */}
                        {skills.length > 0 && (
                            <div style={{ marginBottom: spacing.sectionGap }}>
                                <h3
                                    style={{
                                        fontSize: `${typography.sectionTitleSize}rem`,
                                        fontFamily: typography.fontHeading,
                                        fontWeight: 700,
                                        marginBottom: spacing.itemGap,
                                        borderBottom: `2px solid ${colors.accent}`,
                                        paddingBottom: '8px',
                                        color: sidebarText,
                                    }}
                                >
                                    Compétences
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {skills.map(skill => (
                                        <div key={skill.id}>
                                            <div style={{ 
                                                display: 'flex', 
                                                justifyContent: 'space-between', 
                                                marginBottom: '4px',
                                                fontSize: `${typography.bodySize}rem`,
                                            }}>
                                                <span>{skill.name}</span>
                                            </div>
                                            <div style={{ 
                                                height: '4px', 
                                                backgroundColor: colorWithOpacity(sidebarText, 0.2),
                                                borderRadius: '2px',
                                            }}>
                                                <div style={{ 
                                                    height: '100%', 
                                                    width: `${(skill.level / 10) * 100}%`,
                                                    backgroundColor: colors.accent,
                                                    borderRadius: '2px',
                                                }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Languages */}
                        {languages.length > 0 && (
                            <div>
                                <h3
                                    style={{
                                        fontSize: `${typography.sectionTitleSize}rem`,
                                        fontFamily: typography.fontHeading,
                                        fontWeight: 700,
                                        marginBottom: spacing.itemGap,
                                        borderBottom: `2px solid ${colors.accent}`,
                                        paddingBottom: '8px',
                                        color: sidebarText,
                                    }}
                                >
                                    Langues
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {languages.map(lang => (
                                        <div key={lang.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: `${typography.bodySize}rem` }}>{lang.name}</span>
                                            <div style={{ display: 'flex', gap: '3px' }}>
                                                {[...Array(5)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        style={{
                                                            width: '8px',
                                                            height: '8px',
                                                            borderRadius: '50%',
                                                            backgroundColor: i < lang.level ? colors.accent : colorWithOpacity(sidebarText, 0.2),
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>

                    {/* Main Content */}
                    <main
                        style={{
                            flex: 1,
                            padding: `${spacing.pageMargin}mm`,
                            backgroundColor: colors.background,
                        }}
                    >
                        {/* Header */}
                        <header style={{ marginBottom: spacing.sectionGap * 1.5 }}>
                            <h1
                                style={{
                                    fontSize: `${typography.nameSize}rem`,
                                    fontFamily: typography.fontHeading,
                                    fontWeight: 700,
                                    color: colors.primary,
                                    letterSpacing: typography.letterSpacing,
                                    marginBottom: '4px',
                                }}
                            >
                                {personalInfo.firstName} {personalInfo.lastName}
                            </h1>
                            <p
                                style={{
                                    fontSize: `${typography.jobTitleSize}rem`,
                                    color: colors.accent,
                                    fontWeight: 500,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                }}
                            >
                                {personalInfo.jobTitle}
                            </p>
                            
                            {/* Gold accent line */}
                            <div
                                style={{
                                    width: '80px',
                                    height: '3px',
                                    backgroundColor: colors.accent,
                                    marginTop: '16px',
                                }}
                            />
                        </header>

                        {/* Profile/Description */}
                        {personalInfo.description && (
                            <section style={{ marginBottom: spacing.sectionGap }}>
                                <h2
                                    style={{
                                        fontSize: `${typography.sectionTitleSize}rem`,
                                        fontFamily: typography.fontHeading,
                                        fontWeight: 700,
                                        color: colors.primary,
                                        marginBottom: spacing.itemGap,
                                        borderLeft: `4px solid ${colors.accent}`,
                                        paddingLeft: '12px',
                                    }}
                                >
                                    Profil
                                </h2>
                                <p
                                    style={{
                                        fontSize: `${typography.bodySize}rem`,
                                        lineHeight: typography.lineHeight,
                                        color: colors.text,
                                        textAlign: 'justify',
                                    }}
                                >
                                    {personalInfo.description}
                                </p>
                            </section>
                        )}

                        {/* Experience */}
                        {experience.length > 0 && (
                            <section style={{ marginBottom: spacing.sectionGap }}>
                                <h2
                                    style={{
                                        fontSize: `${typography.sectionTitleSize}rem`,
                                        fontFamily: typography.fontHeading,
                                        fontWeight: 700,
                                        color: colors.primary,
                                        marginBottom: spacing.itemGap,
                                        borderLeft: `4px solid ${colors.accent}`,
                                        paddingLeft: '12px',
                                    }}
                                >
                                    Expérience Professionnelle
                                </h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.itemGap }}>
                                    {experience.map((exp, index) => (
                                        <div key={exp.id} style={{ position: 'relative', paddingLeft: '20px' }}>
                                            {/* Timeline */}
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    left: 0,
                                                    top: '6px',
                                                    width: '8px',
                                                    height: '8px',
                                                    backgroundColor: colors.accent,
                                                }}
                                            />
                                            {index < experience.length - 1 && (
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        left: '3px',
                                                        top: '18px',
                                                        bottom: `-${spacing.itemGap}px`,
                                                        width: '2px',
                                                        backgroundColor: colorWithOpacity(colors.primary, 0.15),
                                                    }}
                                                />
                                            )}
                                            
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                                <div>
                                                    <h3 style={{ 
                                                        fontSize: `${typography.bodySize * 1.1}rem`, 
                                                        fontWeight: 600,
                                                        color: colors.text,
                                                    }}>
                                                        {exp.title}
                                                    </h3>
                                                    <p style={{ color: colors.textLight, fontSize: `${typography.bodySize}rem` }}>
                                                        {exp.company}
                                                    </p>
                                                </div>
                                                <span style={{ 
                                                    fontSize: `${typography.smallSize}rem`,
                                                    color: colors.primary,
                                                    fontWeight: 500,
                                                }}>
                                                    {exp.startDate} - {exp.endDate || 'Présent'}
                                                </span>
                                            </div>
                                            {exp.description && (
                                                <p style={{ 
                                                    marginTop: '8px', 
                                                    fontSize: `${typography.bodySize}rem`,
                                                    color: colors.text,
                                                    lineHeight: typography.lineHeight,
                                                    whiteSpace: 'pre-line',
                                                }}>
                                                    {exp.description}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Education */}
                        {education.length > 0 && (
                            <section>
                                <h2
                                    style={{
                                        fontSize: `${typography.sectionTitleSize}rem`,
                                        fontFamily: typography.fontHeading,
                                        fontWeight: 700,
                                        color: colors.primary,
                                        marginBottom: spacing.itemGap,
                                        borderLeft: `4px solid ${colors.accent}`,
                                        paddingLeft: '12px',
                                    }}
                                >
                                    Formation
                                </h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.itemGap }}>
                                    {education.map(edu => (
                                        <div key={edu.id} style={{ 
                                            padding: '12px',
                                            backgroundColor: colors.backgroundAlt,
                                            borderLeft: `3px solid ${colors.accent}`,
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                                <div>
                                                    <h3 style={{ 
                                                        fontSize: `${typography.bodySize * 1.1}rem`, 
                                                        fontWeight: 600,
                                                        color: colors.text,
                                                    }}>
                                                        {edu.degree}
                                                    </h3>
                                                    <p style={{ color: colors.textLight, fontSize: `${typography.bodySize}rem` }}>
                                                        {edu.school}
                                                    </p>
                                                </div>
                                                <span style={{ 
                                                    fontSize: `${typography.smallSize}rem`,
                                                    color: colors.primary,
                                                    fontWeight: 500,
                                                }}>
                                                    {edu.startDate} - {edu.endDate}
                                                </span>
                                            </div>
                                            {edu.description && (
                                                <p style={{ 
                                                    marginTop: '6px', 
                                                    fontSize: `${typography.smallSize}rem`,
                                                    color: colors.textLight,
                                                }}>
                                                    {edu.description}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </main>
                </div>
            </TemplateWrapper>
        );
    }
);

ExecutiveProTemplate.displayName = 'ExecutiveProTemplate';

export default ExecutiveProTemplate;
