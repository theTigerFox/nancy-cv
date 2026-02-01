// ============================================================================
// NANCY CV - Elegant Serif Template
// Design sophistique avec typographie serif pour profils seniors
// ============================================================================

import React, { forwardRef } from 'react';
import { TemplateProps } from '../../types';
import { TemplateWrapper, SkillsDisplay, LanguagesDisplay, InterestsDisplay, ProjectsDisplay, CertificationsDisplay } from '../../components';
import { isSectionVisible } from '../../utils';

const ElegantSerifTemplate = forwardRef<HTMLDivElement, TemplateProps>(
    ({ cvData, config, mode = 'preview', scale = 1 }, ref) => {
        const { personalInfo, education, experience, skills, languages, interests, projects, certifications, sectionsOrder = [] } = cvData;
        const { colors, typography, spacing, layout } = config;

        const shouldShowSection = (type: string, hasData: boolean) => {
            return isSectionVisible(type, sectionsOrder, hasData);
        };

        return (
            <TemplateWrapper ref={ref} config={config} mode={mode} scale={scale}>
                <div style={{ padding: `${spacing.pageMargin}mm`, fontFamily: typography.fontBody, color: colors.text }}>
                    {/* Elegant Header */}
                    <header style={{ 
                        textAlign: 'center', 
                        marginBottom: `${spacing.sectionGap + 10}px`,
                        paddingBottom: '24px',
                        borderBottom: `1px solid ${colors.border}`,
                    }}>
                        {/* Photo */}
                        {layout.showPhoto && personalInfo.photo && (
                            <img
                                src={personalInfo.photo}
                                alt="Photo"
                                style={{
                                    width: `${layout.photoSize}px`,
                                    height: `${layout.photoSize}px`,
                                    objectFit: 'cover',
                                    borderRadius: layout.photoShape === 'circle' ? '50%' : layout.photoShape === 'rounded' ? '8px' : 0,
                                    marginBottom: '16px',
                                    border: `2px solid ${colors.secondary}`,
                                }}
                            />
                        )}
                        
                        <h1
                            style={{
                                fontSize: `${typography.nameSize}rem`,
                                fontFamily: typography.fontHeading,
                                fontWeight: 500,
                                letterSpacing: typography.letterSpacing,
                                color: colors.primary,
                                marginBottom: '8px',
                                textTransform: 'uppercase',
                            }}
                        >
                            {personalInfo.firstName} {personalInfo.lastName}
                        </h1>
                        <p
                            style={{
                                fontSize: `${typography.jobTitleSize}rem`,
                                color: colors.secondary,
                                fontStyle: 'italic',
                                marginBottom: '16px',
                            }}
                        >
                            {personalInfo.jobTitle}
                        </p>
                        
                        {/* Contact */}
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'center',
                            flexWrap: 'wrap', 
                            gap: '20px', 
                            fontSize: `${typography.smallSize}rem`,
                            color: colors.textLight,
                        }}>
                            {personalInfo.email && <span>{personalInfo.email}</span>}
                            {personalInfo.phone && <span>{personalInfo.phone}</span>}
                            {personalInfo.address && <span>{personalInfo.address}</span>}
                        </div>
                    </header>

                    {/* About */}
                    {personalInfo.description && (
                        <section style={{ marginBottom: `${spacing.sectionGap}px`, textAlign: 'center' }}>
                            <p style={{ 
                                fontSize: `${typography.bodySize}rem`, 
                                color: colors.text, 
                                lineHeight: typography.lineHeight,
                                maxWidth: '600px',
                                margin: '0 auto',
                                fontStyle: 'italic',
                            }}>
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
                                    fontWeight: 500,
                                    color: colors.primary,
                                    marginBottom: '20px',
                                    textAlign: 'center',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                }}
                            >
                                <span style={{ 
                                    borderBottom: `2px solid ${colors.secondary}`,
                                    paddingBottom: '4px',
                                }}>
                                    Experience Professionnelle
                                </span>
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: `${spacing.itemGap}px` }}>
                                {experience.map(exp => (
                                    <div key={exp.id} style={{ paddingBottom: `${spacing.itemGap}px`, borderBottom: `1px dotted ${colors.border}` }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                                            <h3 style={{ 
                                                fontSize: `${typography.bodySize * 1.1}rem`, 
                                                fontWeight: 600, 
                                                color: colors.text,
                                            }}>
                                                {exp.title}
                                            </h3>
                                            <span style={{ 
                                                fontSize: `${typography.smallSize}rem`, 
                                                color: colors.secondary,
                                                fontStyle: 'italic',
                                            }}>
                                                {exp.startDate} - {exp.endDate || 'Present'}
                                            </span>
                                        </div>
                                        <p style={{ 
                                            fontSize: `${typography.bodySize}rem`, 
                                            color: colors.textLight,
                                            marginBottom: '8px',
                                            fontStyle: 'italic',
                                        }}>
                                            {exp.company}
                                        </p>
                                        {exp.description && (
                                            <p style={{ 
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
                    {shouldShowSection('education', education.length > 0 && !!education[0]?.degree) && (
                        <section style={{ marginBottom: `${spacing.sectionGap}px` }}>
                            <h2
                                style={{
                                    fontSize: `${typography.sectionTitleSize}rem`,
                                    fontFamily: typography.fontHeading,
                                    fontWeight: 500,
                                    color: colors.primary,
                                    marginBottom: '20px',
                                    textAlign: 'center',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                }}
                            >
                                <span style={{ 
                                    borderBottom: `2px solid ${colors.secondary}`,
                                    paddingBottom: '4px',
                                }}>
                                    Formation
                                </span>
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: `${spacing.itemGap}px` }}>
                                {education.map(edu => (
                                    <div key={edu.id} style={{ textAlign: 'center' }}>
                                        <h3 style={{ 
                                            fontSize: `${typography.bodySize * 1.05}rem`, 
                                            fontWeight: 600, 
                                            color: colors.text,
                                        }}>
                                            {edu.degree}
                                        </h3>
                                        <p style={{ fontSize: `${typography.bodySize}rem`, color: colors.textLight, fontStyle: 'italic' }}>
                                            {edu.school}
                                        </p>
                                        <span style={{ fontSize: `${typography.smallSize}rem`, color: colors.secondary }}>
                                            {edu.startDate} - {edu.endDate}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Two columns for Skills and Languages */}
                    <div style={{ display: 'flex', gap: '40px' }}>
                        {/* Skills */}
                        {shouldShowSection('skills', skills.length > 0 && !!skills[0]?.name) && (
                            <section style={{ flex: 1 }}>
                                <h2
                                    style={{
                                        fontSize: `${typography.sectionTitleSize}rem`,
                                        fontFamily: typography.fontHeading,
                                        fontWeight: 500,
                                        color: colors.primary,
                                        marginBottom: '16px',
                                        textAlign: 'center',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em',
                                    }}
                                >
                                    <span style={{ 
                                        borderBottom: `2px solid ${colors.secondary}`,
                                        paddingBottom: '4px',
                                    }}>
                                        Competences
                                    </span>
                                </h2>
                                <SkillsDisplay skills={skills} config={config} />
                            </section>
                        )}

                        {/* Languages */}
                        {shouldShowSection('languages', languages.length > 0 && !!languages[0]?.name) && (
                            <section style={{ flex: 1 }}>
                                <h2
                                    style={{
                                        fontSize: `${typography.sectionTitleSize}rem`,
                                        fontFamily: typography.fontHeading,
                                        fontWeight: 500,
                                        color: colors.primary,
                                        marginBottom: '16px',
                                        textAlign: 'center',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em',
                                    }}
                                >
                                    <span style={{ 
                                        borderBottom: `2px solid ${colors.secondary}`,
                                        paddingBottom: '4px',
                                    }}>
                                        Langues
                                    </span>
                                </h2>
                                <LanguagesDisplay languages={languages} config={config} />
                            </section>
                        )}
                    </div>

                    {/* Projects */}
                    {shouldShowSection('projects', projects && projects.length > 0 && !!projects[0]?.name) && (
                        <section style={{ marginBottom: `${spacing.sectionGap}px` }}>
                            <h2
                                style={{
                                    fontSize: `${typography.sectionTitleSize}rem`,
                                    fontFamily: typography.fontHeading,
                                    fontWeight: 500,
                                    color: colors.primary,
                                    marginBottom: '20px',
                                    textAlign: 'center',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                }}
                            >
                                <span style={{ 
                                    borderBottom: `2px solid ${colors.secondary}`,
                                    paddingBottom: '4px',
                                }}>
                                    Projets
                                </span>
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
                                    fontWeight: 500,
                                    color: colors.primary,
                                    marginBottom: '20px',
                                    textAlign: 'center',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                }}
                            >
                                <span style={{ 
                                    borderBottom: `2px solid ${colors.secondary}`,
                                    paddingBottom: '4px',
                                }}>
                                    Certifications
                                </span>
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
                                    fontWeight: 500,
                                    color: colors.primary,
                                    marginBottom: '20px',
                                    textAlign: 'center',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                }}
                            >
                                <span style={{ 
                                    borderBottom: `2px solid ${colors.secondary}`,
                                    paddingBottom: '4px',
                                }}>
                                    Centres d'interet
                                </span>
                            </h2>
                            <InterestsDisplay interests={interests} config={config} />
                        </section>
                    )}
                </div>
            </TemplateWrapper>
        );
    }
);

ElegantSerifTemplate.displayName = 'ElegantSerifTemplate';

export default ElegantSerifTemplate;
