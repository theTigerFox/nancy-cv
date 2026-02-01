// ============================================================================
// NANCY CV - Creative Splash Template
// Design audacieux et coloré pour les profils créatifs
// ============================================================================

import React, { forwardRef } from 'react';
import { TemplateProps } from '../../types';
import { TemplateWrapper } from '../../components';
import { colorWithOpacity } from '../../utils';
import { Mail, Phone, MapPin, Star, Briefcase, GraduationCap } from 'lucide-react';

const CreativeSplashTemplate = forwardRef<HTMLDivElement, TemplateProps>(
    ({ cvData, config, mode = 'preview', scale = 1 }, ref) => {
        const { personalInfo, education, experience, skills, languages } = cvData;
        const { colors, typography, spacing, layout } = config;

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
                        {skills.length > 0 && skills[0].name && (
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
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    {skills.map(skill => (
                                        <div key={skill.id}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                                <span style={{ fontSize: `${typography.bodySize}rem`, fontWeight: 500, color: colors.text }}>
                                                    {skill.name}
                                                </span>
                                                <span style={{ fontSize: `${typography.smallSize}rem`, color: colors.primary, fontWeight: 600 }}>
                                                    {(skill.level / 10) * 100}%
                                                </span>
                                            </div>
                                            <div style={{ height: '8px', backgroundColor: colors.border, borderRadius: '4px', overflow: 'hidden' }}>
                                                <div
                                                    style={{
                                                        height: '100%',
                                                        width: `${(skill.level / 10) * 100}%`,
                                                        background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
                                                        borderRadius: '4px',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Languages */}
                        {languages.length > 0 && languages[0].name && (
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
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {languages.map(lang => (
                                        <div key={lang.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: `${typography.bodySize}rem`, color: colors.text }}>{lang.name}</span>
                                            <div style={{ display: 'flex', gap: '4px' }}>
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={14}
                                                        fill={i < lang.level ? colors.accent : 'none'}
                                                        stroke={i < lang.level ? colors.accent : colors.border}
                                                        strokeWidth={2}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column */}
                    <div style={{ flex: 1, padding: '32px', backgroundColor: colors.background }}>
                        {/* Experience */}
                        {experience.length > 0 && experience[0].title && (
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
                        {education.length > 0 && education[0].degree && (
                            <section>
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
                    </div>
                </div>
            </TemplateWrapper>
        );
    }
);

CreativeSplashTemplate.displayName = 'CreativeSplashTemplate';

export default CreativeSplashTemplate;
