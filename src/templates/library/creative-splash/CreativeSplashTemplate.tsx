// ============================================================================
// NANCY CV - Creative Splash Template
// Design audacieux et coloré pour les profils créatifs
// ============================================================================

import React, { forwardRef } from 'react';
import { TemplateProps } from '../../types';
import { TemplateWrapper, SkillsDisplay, LanguagesDisplay, InterestsDisplay, ProjectsDisplay, CertificationsDisplay } from '../../components';
import { colorWithOpacity, isSectionVisible } from '../../utils';
import { Mail, Phone, MapPin, Briefcase, GraduationCap } from 'lucide-react';

const CreativeSplashTemplate = forwardRef<HTMLDivElement, TemplateProps>(
    ({ cvData, config, mode = 'preview', scale = 1 }, ref) => {
        const { personalInfo, education, experience, skills, languages, interests, projects, certifications, sectionsOrder = [] } = cvData;
        const { colors, typography, spacing, layout } = config;

        const shouldShowSection = (type: string, hasData: boolean) => {
            return isSectionVisible(type, sectionsOrder, hasData);
        };

        return (
            <TemplateWrapper ref={ref} config={config} mode={mode} scale={scale}>
                {/* Hero Header */}
                <header
                    style={{
                        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                        padding: '40px',
                        color: '#ffffff',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {/* Decorative shapes */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '-50px',
                            right: '-50px',
                            width: '200px',
                            height: '200px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '-30px',
                            left: '20%',
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                        }}
                    />
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '32px', position: 'relative', zIndex: 1 }}>
                        {/* Photo */}
                        {layout.showPhoto && personalInfo.photo && (
                            <img
                                src={personalInfo.photo}
                                alt="Photo"
                                style={{
                                    width: `${layout.photoSize}px`,
                                    height: `${layout.photoSize}px`,
                                    objectFit: 'cover',
                                    borderRadius: '50%',
                                    border: '5px solid rgba(255,255,255,0.5)',
                                    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                                }}
                            />
                        )}
                        
                        <div>
                            <h1
                                style={{
                                    fontSize: `${typography.nameSize}rem`,
                                    fontFamily: typography.fontHeading,
                                    fontWeight: 700,
                                    letterSpacing: typography.letterSpacing,
                                    lineHeight: 1.1,
                                    marginBottom: '8px',
                                }}
                            >
                                {personalInfo.firstName}<br />{personalInfo.lastName}
                            </h1>
                            <p
                                style={{
                                    fontSize: `${typography.jobTitleSize}rem`,
                                    fontWeight: 500,
                                    opacity: 0.9,
                                    marginBottom: '16px',
                                }}
                            >
                                {personalInfo.jobTitle}
                            </p>
                            
                            {/* Contact */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', fontSize: `${typography.smallSize}rem` }}>
                                {personalInfo.email && (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Mail size={14} /> {personalInfo.email}
                                    </span>
                                )}
                                {personalInfo.phone && (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Phone size={14} /> {personalInfo.phone}
                                    </span>
                                )}
                                {personalInfo.address && (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <MapPin size={14} /> {personalInfo.address}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Two Column Content */}
                <div style={{ display: 'flex', minHeight: 'calc(297mm - 220px)' }}>
                    {/* Left Column */}
                    <div style={{ width: `${layout.sidebarWidth}%`, padding: '32px', backgroundColor: colors.backgroundAlt }}>
                        {/* About */}
                        {personalInfo.description && (
                            <section style={{ marginBottom: `${spacing.sectionGap}px` }}>
                                <h2
                                    style={{
                                        fontSize: `${typography.sectionTitleSize}rem`,
                                        fontFamily: typography.fontHeading,
                                        fontWeight: 700,
                                        color: colors.primary,
                                        marginBottom: '16px',
                                        padding: '8px 16px',
                                        backgroundColor: colorWithOpacity(colors.primary, 0.15),
                                        borderRadius: '8px',
                                        display: 'inline-block',
                                    }}
                                >
                                    A propos
                                </h2>
                                <p style={{ fontSize: `${typography.bodySize}rem`, color: colors.text, lineHeight: typography.lineHeight }}>
                                    {personalInfo.description}
                                </p>
                            </section>
                        )}

                        {/* Skills */}
                        {shouldShowSection('skills', skills.length > 0 && !!skills[0]?.name) && (
                            <section style={{ marginBottom: `${spacing.sectionGap}px` }}>
                                <h2
                                    style={{
                                        fontSize: `${typography.sectionTitleSize}rem`,
                                        fontFamily: typography.fontHeading,
                                        fontWeight: 700,
                                        color: colors.primary,
                                        marginBottom: '16px',
                                        padding: '8px 16px',
                                        backgroundColor: colorWithOpacity(colors.primary, 0.15),
                                        borderRadius: '8px',
                                        display: 'inline-block',
                                    }}
                                >
                                    Compétences
                                </h2>
                                <SkillsDisplay skills={skills} config={config} />
                            </section>
                        )}

                        {/* Languages */}
                        {/* Languages */}
                        {shouldShowSection('languages', languages.length > 0 && !!languages[0]?.name) && (
                            <section>
                                <h2
                                    style={{
                                        fontSize: `${typography.sectionTitleSize}rem`,
                                        fontFamily: typography.fontHeading,
                                        fontWeight: 700,
                                        color: colors.primary,
                                        marginBottom: '16px',
                                        padding: '8px 16px',
                                        backgroundColor: colorWithOpacity(colors.primary, 0.15),
                                        borderRadius: '8px',
                                        display: 'inline-block',
                                    }}
                                >
                                    Langues
                                </h2>
                                <LanguagesDisplay languages={languages} config={config} />
                            </section>
                        )}
                    </div>

                    {/* Right Column */}
                    <div style={{ flex: 1, padding: '32px', backgroundColor: colors.background }}>
                        {/* Experience */}
                        {shouldShowSection('experience', experience.length > 0 && !!experience[0]?.title) && (
                            <section style={{ marginBottom: `${spacing.sectionGap}px` }}>
                                <h2
                                    style={{
                                        fontSize: `${typography.sectionTitleSize}rem`,
                                        fontFamily: typography.fontHeading,
                                        fontWeight: 700,
                                        color: colors.primary,
                                        marginBottom: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                    }}
                                >
                                    <div style={{ padding: '8px', backgroundColor: colors.primary, borderRadius: '8px', color: '#fff' }}>
                                        <Briefcase size={18} />
                                    </div>
                                    Expérience
                                </h2>
                                <div style={{ paddingLeft: '20px', borderLeft: `3px solid ${colors.primary}` }}>
                                    {experience.map((exp, index) => (
                                        <div key={exp.id} style={{ position: 'relative', paddingBottom: index < experience.length - 1 ? `${spacing.itemGap}px` : 0, marginBottom: index < experience.length - 1 ? `${spacing.itemGap}px` : 0 }}>
                                            {/* Diamond dot */}
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    left: '-26px',
                                                    top: '4px',
                                                    width: '12px',
                                                    height: '12px',
                                                    backgroundColor: colors.primary,
                                                    transform: 'rotate(45deg)',
                                                }}
                                            />
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                                                <h3 style={{ fontSize: `${typography.bodySize * 1.1}rem`, fontWeight: 600, color: colors.text }}>
                                                    {exp.title}
                                                </h3>
                                                <span style={{ fontSize: `${typography.smallSize}rem`, color: '#fff', backgroundColor: colors.primary, padding: '2px 10px', borderRadius: '12px' }}>
                                                    {exp.startDate} - {exp.endDate || 'Présent'}
                                                </span>
                                            </div>
                                            <p style={{ fontSize: `${typography.bodySize}rem`, color: colors.secondary, fontWeight: 500, marginBottom: '6px' }}>
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
                                        fontWeight: 700,
                                        color: colors.primary,
                                        marginBottom: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                    }}
                                >
                                    <div style={{ padding: '8px', backgroundColor: colors.secondary, borderRadius: '8px', color: '#fff' }}>
                                        <GraduationCap size={18} />
                                    </div>
                                    Formation
                                </h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: `${spacing.itemGap}px` }}>
                                    {education.map(edu => (
                                        <div
                                            key={edu.id}
                                            style={{
                                                padding: '16px',
                                                backgroundColor: colorWithOpacity(colors.secondary, 0.08),
                                                borderRadius: '12px',
                                                borderLeft: `4px solid ${colors.secondary}`,
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                                                <h3 style={{ fontSize: `${typography.bodySize * 1.05}rem`, fontWeight: 600, color: colors.text }}>
                                                    {edu.degree}
                                                </h3>
                                                <span style={{ fontSize: `${typography.smallSize}rem`, color: colors.secondary, fontWeight: 500 }}>
                                                    {edu.startDate} - {edu.endDate}
                                                </span>
                                            </div>
                                            <p style={{ fontSize: `${typography.bodySize}rem`, color: colors.textLight }}>
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
                                        fontWeight: 700,
                                        color: colors.primary,
                                        marginBottom: '16px',
                                        padding: '8px 16px',
                                        backgroundColor: colorWithOpacity(colors.primary, 0.15),
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
                                        fontWeight: 700,
                                        color: colors.primary,
                                        marginBottom: '16px',
                                        padding: '8px 16px',
                                        backgroundColor: colorWithOpacity(colors.primary, 0.15),
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
                                        fontWeight: 700,
                                        color: colors.primary,
                                        marginBottom: '16px',
                                        padding: '8px 16px',
                                        backgroundColor: colorWithOpacity(colors.primary, 0.15),
                                        borderRadius: '8px',
                                        display: 'inline-block',
                                    }}
                                >
                                    Centres d'interet
                                </h2>
                                <InterestsDisplay interests={interests} config={config} />
                            </section>
                        )}
                    </div>
                </div>
            </TemplateWrapper>
        );
    }
);

CreativeSplashTemplate.displayName = 'CreativeSplashTemplate';

export default CreativeSplashTemplate;
