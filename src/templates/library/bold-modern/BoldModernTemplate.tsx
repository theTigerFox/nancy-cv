// ============================================================================
// NANCY CV - Bold Modern Template
// Design contemporain avec header coloré et mise en page dynamique
// ============================================================================

import React, { forwardRef } from 'react';
import { TemplateProps } from '../../types';
import { TemplateWrapper } from '../../components';
import { colorWithOpacity, getLevelText } from '../../utils';
import { Mail, Phone, MapPin, Briefcase, GraduationCap } from 'lucide-react';

const BoldModernTemplate = forwardRef<HTMLDivElement, TemplateProps>(
    ({ cvData, config, mode = 'preview', scale = 1 }, ref) => {
        const { personalInfo, education, experience, skills, languages } = cvData;
        const { colors, typography, spacing, layout } = config;

        return (
            <TemplateWrapper ref={ref} config={config} mode={mode} scale={scale}>
                <div style={{ display: 'flex', minHeight: '297mm' }}>
                    {/* Sidebar */}
                    <aside
                        style={{
                            width: `${layout.sidebarWidth}%`,
                            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                            color: '#ffffff',
                            padding: '32px 24px',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        {/* Photo */}
                        {layout.showPhoto && personalInfo.photo && (
                            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                                <img
                                    src={personalInfo.photo}
                                    alt="Photo"
                                    style={{
                                        width: `${layout.photoSize}px`,
                                        height: `${layout.photoSize}px`,
                                        objectFit: 'cover',
                                        borderRadius: '16px',
                                        border: '4px solid rgba(255,255,255,0.3)',
                                    }}
                                />
                            </div>
                        )}

                        {/* Name on sidebar */}
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <h1
                                style={{
                                    fontSize: '1.5rem',
                                    fontFamily: typography.fontHeading,
                                    fontWeight: 700,
                                    marginBottom: '4px',
                                }}
                            >
                                {personalInfo.firstName}
                            </h1>
                            <h1
                                style={{
                                    fontSize: '1.5rem',
                                    fontFamily: typography.fontHeading,
                                    fontWeight: 700,
                                }}
                            >
                                {personalInfo.lastName}
                            </h1>
                            <p
                                style={{
                                    fontSize: `${typography.bodySize}rem`,
                                    opacity: 0.9,
                                    marginTop: '8px',
                                }}
                            >
                                {personalInfo.jobTitle}
                            </p>
                        </div>

                        {/* Contact */}
                        <div style={{ marginBottom: '32px' }}>
                            <h3
                                style={{
                                    fontSize: `${typography.sectionTitleSize}rem`,
                                    fontFamily: typography.fontHeading,
                                    fontWeight: 600,
                                    marginBottom: '16px',
                                    paddingBottom: '8px',
                                    borderBottom: '2px solid rgba(255,255,255,0.3)',
                                }}
                            >
                                Contact
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: `${typography.smallSize}rem` }}>
                                {personalInfo.email && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <Mail size={14} />
                                        <span>{personalInfo.email}</span>
                                    </div>
                                )}
                                {personalInfo.phone && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <Phone size={14} />
                                        <span>{personalInfo.phone}</span>
                                    </div>
                                )}
                                {personalInfo.address && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <MapPin size={14} />
                                        <span>{personalInfo.address}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Skills */}
                        {skills.length > 0 && skills[0].name && (
                            <div style={{ marginBottom: '32px' }}>
                                <h3
                                    style={{
                                        fontSize: `${typography.sectionTitleSize}rem`,
                                        fontFamily: typography.fontHeading,
                                        fontWeight: 600,
                                        marginBottom: '16px',
                                        paddingBottom: '8px',
                                        borderBottom: '2px solid rgba(255,255,255,0.3)',
                                    }}
                                >
                                    Compétences
                                </h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {skills.map(skill => (
                                        <span
                                            key={skill.id}
                                            style={{
                                                padding: '4px 12px',
                                                backgroundColor: 'rgba(255,255,255,0.2)',
                                                borderRadius: '20px',
                                                fontSize: `${typography.smallSize}rem`,
                                                fontWeight: 500,
                                            }}
                                        >
                                            {skill.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Languages */}
                        {languages.length > 0 && languages[0].name && (
                            <div>
                                <h3
                                    style={{
                                        fontSize: `${typography.sectionTitleSize}rem`,
                                        fontFamily: typography.fontHeading,
                                        fontWeight: 600,
                                        marginBottom: '16px',
                                        paddingBottom: '8px',
                                        borderBottom: '2px solid rgba(255,255,255,0.3)',
                                    }}
                                >
                                    Langues
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {languages.map(lang => (
                                        <div key={lang.id}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: `${typography.bodySize}rem` }}>
                                                <span>{lang.name}</span>
                                                <span style={{ opacity: 0.8, fontSize: `${typography.smallSize}rem` }}>
                                                    {getLevelText(lang.level, 'language')}
                                                </span>
                                            </div>
                                            <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '2px' }}>
                                                <div
                                                    style={{
                                                        height: '100%',
                                                        width: `${(lang.level / 5) * 100}%`,
                                                        backgroundColor: '#ffffff',
                                                        borderRadius: '2px',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>

                    {/* Main Content */}
                    <main style={{ flex: 1, padding: '32px', backgroundColor: colors.background }}>
                        {/* Profile */}
                        {personalInfo.description && (
                            <section style={{ marginBottom: `${spacing.sectionGap}px` }}>
                                <h2
                                    style={{
                                        fontSize: `${typography.sectionTitleSize}rem`,
                                        fontFamily: typography.fontHeading,
                                        fontWeight: 600,
                                        color: colors.primary,
                                        marginBottom: '12px',
                                        padding: '8px 16px',
                                        backgroundColor: colorWithOpacity(colors.primary, 0.1),
                                        borderRadius: '8px',
                                        display: 'inline-block',
                                    }}
                                >
                                    Profil
                                </h2>
                                <p
                                    style={{
                                        fontSize: `${typography.bodySize}rem`,
                                        color: colors.text,
                                        lineHeight: typography.lineHeight,
                                    }}
                                >
                                    {personalInfo.description}
                                </p>
                            </section>
                        )}

                        {/* Experience */}
                        {experience.length > 0 && experience[0].title && (
                            <section style={{ marginBottom: `${spacing.sectionGap}px` }}>
                                <h2
                                    style={{
                                        fontSize: `${typography.sectionTitleSize}rem`,
                                        fontFamily: typography.fontHeading,
                                        fontWeight: 600,
                                        color: colors.primary,
                                        marginBottom: '16px',
                                        padding: '8px 16px',
                                        backgroundColor: colorWithOpacity(colors.primary, 0.1),
                                        borderRadius: '8px',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                    }}
                                >
                                    <Briefcase size={16} />
                                    Expérience
                                </h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: `${spacing.itemGap}px`, paddingLeft: '16px', borderLeft: `3px solid ${colors.primary}` }}>
                                    {experience.map(exp => (
                                        <div key={exp.id}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                                                <h3 style={{ fontSize: `${typography.bodySize * 1.1}rem`, fontWeight: 600, color: colors.text }}>
                                                    {exp.title}
                                                </h3>
                                                <span style={{ fontSize: `${typography.smallSize}rem`, color: colors.primary, fontWeight: 500 }}>
                                                    {exp.startDate} - {exp.endDate || 'Présent'}
                                                </span>
                                            </div>
                                            <p style={{ fontSize: `${typography.bodySize}rem`, color: colors.secondary, fontWeight: 500, marginBottom: '4px' }}>
                                                {exp.company}
                                            </p>
                                            {exp.description && (
                                                <p style={{ fontSize: `${typography.bodySize}rem`, color: colors.textLight, lineHeight: typography.lineHeight, whiteSpace: 'pre-line' }}>
                                                    {exp.description}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Education */}
                        {education.length > 0 && education[0].degree && (
                            <section>
                                <h2
                                    style={{
                                        fontSize: `${typography.sectionTitleSize}rem`,
                                        fontFamily: typography.fontHeading,
                                        fontWeight: 600,
                                        color: colors.primary,
                                        marginBottom: '16px',
                                        padding: '8px 16px',
                                        backgroundColor: colorWithOpacity(colors.primary, 0.1),
                                        borderRadius: '8px',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                    }}
                                >
                                    <GraduationCap size={16} />
                                    Formation
                                </h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: `${spacing.itemGap}px` }}>
                                    {education.map(edu => (
                                        <div
                                            key={edu.id}
                                            style={{
                                                padding: '16px',
                                                backgroundColor: colors.backgroundAlt,
                                                borderRadius: '8px',
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                                                <h3 style={{ fontSize: `${typography.bodySize * 1.05}rem`, fontWeight: 600, color: colors.text }}>
                                                    {edu.degree}
                                                </h3>
                                                <span style={{ fontSize: `${typography.smallSize}rem`, color: colors.primary, fontWeight: 500 }}>
                                                    {edu.startDate} - {edu.endDate}
                                                </span>
                                            </div>
                                            <p style={{ fontSize: `${typography.bodySize}rem`, color: colors.secondary }}>
                                                {edu.school}
                                            </p>
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

BoldModernTemplate.displayName = 'BoldModernTemplate';

export default BoldModernTemplate;
