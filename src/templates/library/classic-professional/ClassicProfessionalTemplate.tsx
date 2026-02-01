// ============================================================================
// NANCY CV - Classic Professional Template
// Template traditionnel et sobre pour les secteurs corporate
// ============================================================================

import React, { forwardRef } from 'react';
import { TemplateProps } from '../../types';
import { TemplateWrapper, SkillsDisplay, LanguagesDisplay, InterestsDisplay, ProjectsDisplay, CertificationsDisplay } from '../../components';
import { isSectionVisible } from '../../utils';

const ClassicProfessionalTemplate = forwardRef<HTMLDivElement, TemplateProps>(
    ({ cvData, config, mode = 'preview', scale = 1 }, ref) => {
        const { personalInfo, education, experience, skills, languages, interests, projects, certifications, sectionsOrder = [] } = cvData;
        const { colors, typography, spacing, layout } = config;

        const shouldShowSection = (type: string, hasData: boolean) => {
            return isSectionVisible(type, sectionsOrder, hasData);
        };

        return (
            <TemplateWrapper ref={ref} config={config} mode={mode} scale={scale}>
                <div style={{ padding: `${spacing.pageMargin}mm` }}>
                    {/* Header */}
                    <header
                        style={{
                            borderBottom: `3px solid ${colors.primary}`,
                            paddingBottom: '20px',
                            marginBottom: `${spacing.sectionGap}px`,
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '24px',
                        }}
                    >
                        {/* Photo */}
                        {layout.showPhoto && personalInfo.photo && (
                            <img
                                src={personalInfo.photo}
                                alt="Photo"
                                style={{
                                    width: `${layout.photoSize}px`,
                                    height: `${layout.photoSize}px`,
                                    objectFit: 'cover',
                                    border: `2px solid ${colors.border}`,
                                }}
                            />
                        )}
                        
                        <div style={{ flex: 1 }}>
                            <h1
                                style={{
                                    fontSize: `${typography.nameSize}rem`,
                                    fontFamily: typography.fontHeading,
                                    fontWeight: 700,
                                    color: colors.primary,
                                    marginBottom: '4px',
                                }}
                            >
                                {personalInfo.firstName} {personalInfo.lastName}
                            </h1>
                            <p
                                style={{
                                    fontSize: `${typography.jobTitleSize}rem`,
                                    color: colors.secondary,
                                    fontWeight: 500,
                                    marginBottom: '12px',
                                }}
                            >
                                {personalInfo.jobTitle}
                            </p>
                            
                            {/* Contact inline */}
                            <div
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '20px',
                                    fontSize: `${typography.smallSize}rem`,
                                    color: colors.textLight,
                                }}
                            >
                                {personalInfo.email && <span>{personalInfo.email}</span>}
                                {personalInfo.phone && <span>{personalInfo.phone}</span>}
                                {personalInfo.address && <span>{personalInfo.address}</span>}
                            </div>
                        </div>
                    </header>

                    {/* Profile */}
                    {personalInfo.description && (
                        <section style={{ marginBottom: `${spacing.sectionGap}px` }}>
                            <h2
                                style={{
                                    fontSize: `${typography.sectionTitleSize}rem`,
                                    fontFamily: typography.fontHeading,
                                    fontWeight: 700,
                                    color: colors.primary,
                                    marginBottom: '12px',
                                    borderBottom: `2px solid ${colors.border}`,
                                    paddingBottom: '6px',
                                }}
                            >
                                Profil Professionnel
                            </h2>
                            <p
                                style={{
                                    fontSize: `${typography.bodySize}rem`,
                                    color: colors.text,
                                    lineHeight: typography.lineHeight,
                                    textAlign: 'justify',
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
                                    fontWeight: 700,
                                    color: colors.primary,
                                    marginBottom: '16px',
                                    borderBottom: `2px solid ${colors.border}`,
                                    paddingBottom: '6px',
                                }}
                            >
                                Expérience Professionnelle
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: `${spacing.itemGap}px` }}>
                                {experience.map(exp => (
                                    <div key={exp.id} style={{ paddingBottom: `${spacing.itemGap}px`, borderBottom: `1px solid ${colors.border}` }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                                            <h3 style={{ fontSize: `${typography.bodySize * 1.1}rem`, fontWeight: 600, color: colors.text }}>
                                                {exp.title}
                                            </h3>
                                            <span style={{ fontSize: `${typography.smallSize}rem`, color: colors.textLight }}>
                                                {exp.startDate} - {exp.endDate || 'Présent'}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: `${typography.bodySize}rem`, color: colors.secondary, fontWeight: 500, marginBottom: '6px' }}>
                                            {exp.company}
                                        </p>
                                        {exp.description && (
                                            <p style={{ fontSize: `${typography.bodySize}rem`, color: colors.text, lineHeight: typography.lineHeight, whiteSpace: 'pre-line' }}>
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
                                    marginBottom: '16px',
                                    borderBottom: `2px solid ${colors.border}`,
                                    paddingBottom: '6px',
                                }}
                            >
                                Formation
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: `${spacing.itemGap}px` }}>
                                {education.map(edu => (
                                    <div key={edu.id}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                            <h3 style={{ fontSize: `${typography.bodySize * 1.05}rem`, fontWeight: 600, color: colors.text }}>
                                                {edu.degree}
                                            </h3>
                                            <span style={{ fontSize: `${typography.smallSize}rem`, color: colors.textLight }}>
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

                    {/* Two columns: Skills + Languages */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: `${spacing.sectionGap}px` }}>
                        {/* Skills */}
                        {shouldShowSection('skills', skills.length > 0 && !!skills[0]?.name) && (
                            <section>
                                <h2
                                    style={{
                                        fontSize: `${typography.sectionTitleSize}rem`,
                                        fontFamily: typography.fontHeading,
                                        fontWeight: 700,
                                        color: colors.primary,
                                        marginBottom: '12px',
                                        borderBottom: `2px solid ${colors.border}`,
                                        paddingBottom: '6px',
                                    }}
                                >
                                    Compétences
                                </h2>
                                <SkillsDisplay skills={skills} config={config} />
                            </section>
                        )}

                        {/* Languages */}
                        {shouldShowSection('languages', languages.length > 0 && !!languages[0]?.name) && (
                            <section>
                                <h2
                                    style={{
                                        fontSize: `${typography.sectionTitleSize}rem`,
                                        fontFamily: typography.fontHeading,
                                        fontWeight: 700,
                                        color: colors.primary,
                                        marginBottom: '12px',
                                        borderBottom: `2px solid ${colors.border}`,
                                        paddingBottom: '6px',
                                    }}
                                >
                                    Langues
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
                                    fontWeight: 700,
                                    color: colors.primary,
                                    marginBottom: '12px',
                                    borderBottom: `2px solid ${colors.border}`,
                                    paddingBottom: '6px',
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
                                    marginBottom: '12px',
                                    borderBottom: `2px solid ${colors.border}`,
                                    paddingBottom: '6px',
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
                                    marginBottom: '12px',
                                    borderBottom: `2px solid ${colors.border}`,
                                    paddingBottom: '6px',
                                }}
                            >
                                Centres d'interet
                            </h2>
                            <InterestsDisplay interests={interests} config={config} />
                        </section>
                    )}
                </div>
            </TemplateWrapper>
        );
    }
);

ClassicProfessionalTemplate.displayName = 'ClassicProfessionalTemplate';

export default ClassicProfessionalTemplate;
