// ============================================================================
// NANCY CV - Tech Minimal Template
// Design epure pour les profils tech et developpeurs
// ============================================================================

import React, { forwardRef } from 'react';
import { TemplateProps } from '../../types';
import { TemplateWrapper, SkillsDisplay, LanguagesDisplay, InterestsDisplay, ProjectsDisplay, CertificationsDisplay } from '../../components';
import { isSectionVisible } from '../../utils';
import { Mail, Phone, MapPin, Github, Globe, Linkedin, Code } from 'lucide-react';

const TechMinimalTemplate = forwardRef<HTMLDivElement, TemplateProps>(
    ({ cvData, config, mode = 'preview', scale = 1 }, ref) => {
        const { personalInfo, education, experience, skills, languages, interests, projects, certifications, sectionsOrder = [] } = cvData;
        const { colors, typography, spacing } = config;

        const shouldShowSection = (type: string, hasData: boolean) => {
            return isSectionVisible(type, sectionsOrder, hasData);
        };

        return (
            <TemplateWrapper ref={ref} config={config} mode={mode} scale={scale}>
                <div style={{ padding: `${spacing.pageMargin}mm`, fontFamily: typography.fontBody }}>
                    {/* Header */}
                    <header style={{ marginBottom: `${spacing.sectionGap}px`, borderBottom: `2px solid ${colors.primary}`, paddingBottom: '20px' }}>
                        <h1
                            style={{
                                fontSize: `${typography.nameSize}rem`,
                                fontFamily: typography.fontHeading,
                                fontWeight: 700,
                                color: colors.text,
                                marginBottom: '4px',
                            }}
                        >
                            {personalInfo.firstName} {personalInfo.lastName}
                        </h1>
                        <p
                            style={{
                                fontSize: `${typography.jobTitleSize}rem`,
                                color: colors.primary,
                                fontFamily: typography.fontHeading,
                                marginBottom: '12px',
                            }}
                        >
                            {personalInfo.jobTitle}
                        </p>
                        
                        {/* Contact - Code style */}
                        <div style={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            gap: '16px', 
                            fontSize: `${typography.smallSize}rem`,
                            fontFamily: typography.fontHeading,
                            color: colors.textLight,
                        }}>
                            {personalInfo.email && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Mail size={12} style={{ color: colors.primary }} /> {personalInfo.email}
                                </span>
                            )}
                            {personalInfo.phone && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Phone size={12} style={{ color: colors.primary }} /> {personalInfo.phone}
                                </span>
                            )}
                            {personalInfo.address && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <MapPin size={12} style={{ color: colors.primary }} /> {personalInfo.address}
                                </span>
                            )}
                        </div>
                    </header>

                    {/* About */}
                    {personalInfo.description && (
                        <section style={{ marginBottom: `${spacing.sectionGap}px` }}>
                            <div style={{ 
                                padding: '16px', 
                                backgroundColor: colors.backgroundAlt, 
                                borderLeft: `3px solid ${colors.primary}`,
                                fontSize: `${typography.bodySize}rem`,
                                color: colors.text,
                                lineHeight: typography.lineHeight,
                            }}>
                                {personalInfo.description}
                            </div>
                        </section>
                    )}

                    {/* Skills - Uses configurable display */}
                    {shouldShowSection('skills', skills.length > 0 && !!skills[0]?.name) && (
                        <section style={{ marginBottom: `${spacing.sectionGap}px` }}>
                            <h2
                                style={{
                                    fontSize: `${typography.sectionTitleSize}rem`,
                                    fontFamily: typography.fontHeading,
                                    fontWeight: 600,
                                    color: colors.text,
                                    marginBottom: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                }}
                            >
                                <Code size={16} style={{ color: colors.primary }} />
                                skills
                            </h2>
                            <SkillsDisplay skills={skills} config={config} />
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
                                    color: colors.text,
                                    marginBottom: '16px',
                                }}
                            >
                                experience
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: `${spacing.itemGap}px` }}>
                                {experience.map(exp => (
                                    <div key={exp.id} style={{ paddingLeft: '16px', borderLeft: `2px solid ${colors.border}` }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                                            <div>
                                                <h3 style={{ fontSize: `${typography.bodySize * 1.1}rem`, fontWeight: 600, color: colors.text }}>
                                                    {exp.title}
                                                </h3>
                                                <p style={{ fontSize: `${typography.bodySize}rem`, color: colors.primary }}>
                                                    {exp.company}
                                                </p>
                                            </div>
                                            <span style={{ 
                                                fontSize: `${typography.smallSize}rem`, 
                                                color: colors.textLight,
                                                fontFamily: typography.fontHeading,
                                            }}>
                                                {exp.startDate} - {exp.endDate || 'Present'}
                                            </span>
                                        </div>
                                        {exp.description && (
                                            <p style={{ 
                                                fontSize: `${typography.bodySize}rem`, 
                                                color: colors.textLight, 
                                                lineHeight: typography.lineHeight,
                                                whiteSpace: 'pre-line',
                                                marginTop: '8px',
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
                    {shouldShowSection('education', education.length > 0 && !!education[0]?.degree) && (
                        <section style={{ marginBottom: `${spacing.sectionGap}px` }}>
                            <h2
                                style={{
                                    fontSize: `${typography.sectionTitleSize}rem`,
                                    fontFamily: typography.fontHeading,
                                    fontWeight: 600,
                                    color: colors.text,
                                    marginBottom: '16px',
                                }}
                            >
                                education
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: `${spacing.itemGap}px` }}>
                                {education.map(edu => (
                                    <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <h3 style={{ fontSize: `${typography.bodySize}rem`, fontWeight: 600, color: colors.text }}>
                                                {edu.degree}
                                            </h3>
                                            <p style={{ fontSize: `${typography.bodySize}rem`, color: colors.textLight }}>
                                                {edu.school}
                                            </p>
                                        </div>
                                        <span style={{ 
                                            fontSize: `${typography.smallSize}rem`, 
                                            color: colors.textLight,
                                            fontFamily: typography.fontHeading,
                                        }}>
                                            {edu.startDate} - {edu.endDate}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Languages - Uses configurable display */}
                    {shouldShowSection('languages', languages.length > 0 && !!languages[0]?.name) && (
                        <section style={{ marginBottom: `${spacing.sectionGap}px` }}>
                            <h2
                                style={{
                                    fontSize: `${typography.sectionTitleSize}rem`,
                                    fontFamily: typography.fontHeading,
                                    fontWeight: 600,
                                    color: colors.text,
                                    marginBottom: '12px',
                                }}
                            >
                                languages
                            </h2>
                            <LanguagesDisplay languages={languages} config={config} />
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
                                    color: colors.text,
                                    marginBottom: '12px',
                                }}
                            >
                                projects
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
                                    color: colors.text,
                                    marginBottom: '12px',
                                }}
                            >
                                certifications
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
                                    color: colors.text,
                                    marginBottom: '12px',
                                }}
                            >
                                interests
                            </h2>
                            <InterestsDisplay interests={interests} config={config} />
                        </section>
                    )}
                </div>
            </TemplateWrapper>
        );
    }
);

TechMinimalTemplate.displayName = 'TechMinimalTemplate';

export default TechMinimalTemplate;
