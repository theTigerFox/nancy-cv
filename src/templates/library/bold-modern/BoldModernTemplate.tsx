// ============================================================================
// NANCY CV - Bold Modern Template
// Design contemporain avec header coloré et mise en page dynamique
// ============================================================================

import React, { forwardRef } from 'react';
import { TemplateProps } from '../../types';
import { TemplateWrapper, SkillsDisplay, LanguagesDisplay, InterestsDisplay, ProjectsDisplay, CertificationsDisplay } from '../../components';
import { colorWithOpacity, isSectionVisible } from '../../utils';
import { Mail, Phone, MapPin, Briefcase, GraduationCap } from 'lucide-react';

const BoldModernTemplate = forwardRef<HTMLDivElement, TemplateProps>(
    ({ cvData, config, mode = 'preview', scale = 1 }, ref) => {
        const { personalInfo, education, experience, skills, languages, interests, projects, certifications, sectionsOrder = [] } = cvData;
        const { colors, typography, spacing, layout } = config;

        const shouldShowSection = (type: string, hasData: boolean) => {
            return isSectionVisible(type, sectionsOrder, hasData);
        };

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
                        {shouldShowSection('skills', skills.length > 0 && !!skills[0]?.name) && (
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
                                <SkillsDisplay skills={skills} config={config} />
                            </div>
                        )}

                        {/* Languages */}
                        {shouldShowSection('languages', languages.length > 0 && !!languages[0]?.name) && (
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
                                <LanguagesDisplay languages={languages} config={config} />
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
                        {shouldShowSection('experience', experience.length > 0 && !!experience[0]?.title) && (
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
                        {shouldShowSection('education', education.length > 0 && !!education[0]?.degree) && (
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

                        {/* Projects */}
                        {shouldShowSection('projects', projects && projects.length > 0 && !!projects[0]?.name) && (
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
                                        display: 'inline-block',
                                    }}
                                >
                                    Projets
                                </h2>
                                <ProjectsDisplay projects={projects} config={config} />
                            </section>
                        )}

                        {/* Certifications */}
                        {shouldShowSection('certifications', certifications && certifications.length > 0 && !!certifications[0]?.name) && (
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
                                        display: 'inline-block',
                                    }}
                                >
                                    Certifications
                                </h2>
                                <CertificationsDisplay certifications={certifications} config={config} />
                            </section>
                        )}

                        {/* Interests */}
                        {shouldShowSection('interests', interests && interests.length > 0 && !!interests[0]?.name) && (
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
                                        display: 'inline-block',
                                    }}
                                >
                                    Centres d'interet
                                </h2>
                                <InterestsDisplay interests={interests} config={config} />
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
