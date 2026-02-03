// ============================================================================
// NANCY CV - Elegant Serif PDF Template
// Template raffiné avec typographie serif élégante
// ============================================================================

import React from 'react';
import { Page, View, Text, Document, StyleSheet, Image } from '@react-pdf/renderer';
import type { CVData } from '../../types/cv';
import type { TemplateConfig } from '../../templates/types';
import { toPDFConfig, formatDateRange, getLanguageLevelText, isSectionVisible } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Elegant Serif PDF - Typographie classique, tons bruns/ambrés, photo ronde
// ─────────────────────────────────────────────────────────────────────────────

interface ElegantSerifPDFProps {
    cvData: CVData;
    config: TemplateConfig;
}

export const ElegantSerifPDF: React.FC<ElegantSerifPDFProps> = ({ cvData, config }) => {
    const pdfConfig = toPDFConfig(config);
    const { colors, fontSizes, spacing, layout, lineHeight } = pdfConfig;
    
    const { personalInfo, education, experience, skills, languages, projects, certifications, sectionsOrder = [] } = cvData;

    const shouldShowSection = (type: string, hasData: boolean) => {
        return isSectionVisible(type, sectionsOrder as any, hasData);
    };

    // Couleurs Elegant Serif - Tons bruns/ambrés
    const primaryColor = colors.primary || '#92400e';
    const secondaryColor = colors.secondary || '#b45309';
    const accentColor = colors.accent || '#d97706';
    const darkText = colors.text || '#1c1917';
    const lightText = colors.textLight || '#78716c';
    const bgCream = colors.backgroundAlt || '#fef7ed';

    const styles = StyleSheet.create({
        page: {
            backgroundColor: colors.background || '#fffbeb',
            padding: 48,
            fontFamily: 'Times-Roman',
            fontSize: fontSizes.body,
            lineHeight: lineHeight,
        },
        
        // ══════════════════════════════════════════════════════════════════════
        // HEADER ÉLÉGANT
        // ══════════════════════════════════════════════════════════════════════
        header: {
            alignItems: 'center',
            marginBottom: 32,
            paddingBottom: 24,
        },
        photoContainer: {
            marginBottom: 16,
        },
        photo: {
            width: layout.photoSize || 100,
            height: layout.photoSize || 100,
            borderRadius: 50,
            borderWidth: 3,
            borderColor: accentColor,
            borderStyle: 'solid',
            objectFit: 'cover',
        },
        name: {
            fontSize: fontSizes.name || 30,
            fontFamily: 'Times-Bold',
            color: primaryColor,
            textAlign: 'center',
            letterSpacing: 2,
            marginBottom: 6,
        },
        jobTitle: {
            fontSize: fontSizes.jobTitle || 14,
            fontFamily: 'Times-Italic',
            color: lightText,
            textAlign: 'center',
            marginBottom: 16,
        },
        divider: {
            width: 60,
            height: 2,
            backgroundColor: accentColor,
            marginBottom: 16,
        },
        contactRow: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 20,
        },
        contactItem: {
            flexDirection: 'row',
            alignItems: 'center',
            fontSize: fontSizes.small,
            color: darkText,
        },
        contactSeparator: {
            color: accentColor,
            marginHorizontal: 4,
        },
        
        // ══════════════════════════════════════════════════════════════════════
        // SECTIONS
        // ══════════════════════════════════════════════════════════════════════
        section: {
            marginBottom: spacing.sectionGap || 24,
        },
        sectionTitleContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
        },
        sectionTitleLine: {
            flex: 1,
            height: 1,
            backgroundColor: '#e7e5e4',
        },
        sectionTitle: {
            fontSize: fontSizes.sectionTitle || 12,
            fontFamily: 'Times-Bold',
            color: primaryColor,
            textTransform: 'uppercase',
            letterSpacing: 3,
            marginHorizontal: 16,
        },
        
        // Profile
        profileText: {
            fontSize: fontSizes.body,
            fontFamily: 'Times-Italic',
            color: darkText,
            lineHeight: lineHeight + 0.2,
            textAlign: 'center',
            paddingHorizontal: 20,
        },
        
        // ══════════════════════════════════════════════════════════════════════
        // EXPERIENCE
        // ══════════════════════════════════════════════════════════════════════
        experienceItem: {
            marginBottom: 18,
        },
        experienceHeader: {
            marginBottom: 4,
        },
        experienceTitle: {
            fontSize: fontSizes.body + 1,
            fontFamily: 'Times-Bold',
            color: darkText,
            textAlign: 'center',
        },
        experienceSubline: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 6,
        },
        experienceCompany: {
            fontSize: fontSizes.body,
            fontFamily: 'Times-Italic',
            color: secondaryColor,
        },
        experienceDot: {
            fontSize: fontSizes.small,
            color: accentColor,
            marginHorizontal: 8,
        },
        experienceDate: {
            fontSize: fontSizes.small,
            color: lightText,
        },
        experienceDescription: {
            fontSize: fontSizes.body - 1,
            color: darkText,
            lineHeight: lineHeight,
            textAlign: 'justify',
            paddingHorizontal: 12,
        },
        bulletPoint: {
            flexDirection: 'row',
            marginBottom: 3,
            paddingHorizontal: 20,
        },
        bulletDot: {
            marginRight: 8,
            color: accentColor,
            fontFamily: 'Times-Roman',
        },
        bulletText: {
            flex: 1,
            fontSize: fontSizes.body - 1,
            color: darkText,
        },
        
        // ══════════════════════════════════════════════════════════════════════
        // EDUCATION
        // ══════════════════════════════════════════════════════════════════════
        educationItem: {
            marginBottom: 14,
            alignItems: 'center',
        },
        educationDegree: {
            fontSize: fontSizes.body,
            fontFamily: 'Times-Bold',
            color: darkText,
            textAlign: 'center',
        },
        educationSchool: {
            fontSize: fontSizes.body - 1,
            fontFamily: 'Times-Italic',
            color: secondaryColor,
        },
        educationDate: {
            fontSize: fontSizes.small,
            color: lightText,
        },
        
        // ══════════════════════════════════════════════════════════════════════
        // TWO COLUMN LAYOUT
        // ══════════════════════════════════════════════════════════════════════
        twoColumns: {
            flexDirection: 'row',
            gap: 40,
        },
        column: {
            flex: 1,
        },
        
        // Skills
        skillsGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 8,
        },
        skillItem: {
            backgroundColor: bgCream,
            paddingVertical: 4,
            paddingHorizontal: 12,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#e7e5e4',
            borderStyle: 'solid',
        },
        skillName: {
            fontSize: fontSizes.small,
            color: darkText,
            fontFamily: 'Times-Roman',
        },
        
        // Languages
        languageItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
            paddingBottom: 8,
            borderBottomWidth: 1,
            borderBottomColor: '#f5f5f4',
            borderBottomStyle: 'solid',
        },
        languageName: {
            fontSize: fontSizes.body,
            fontFamily: 'Times-Bold',
            color: darkText,
        },
        languageLevel: {
            fontSize: fontSizes.small,
            fontFamily: 'Times-Italic',
            color: secondaryColor,
        },
        
        // ══════════════════════════════════════════════════════════════════════
        // PROJECTS
        // ══════════════════════════════════════════════════════════════════════
        projectItem: {
            marginBottom: 14,
            paddingBottom: 12,
            borderBottomWidth: 1,
            borderBottomColor: '#f5f5f4',
            borderBottomStyle: 'solid',
        },
        projectName: {
            fontSize: fontSizes.body,
            fontFamily: 'Times-Bold',
            color: primaryColor,
            textAlign: 'center',
            marginBottom: 4,
        },
        projectDescription: {
            fontSize: fontSizes.small,
            fontFamily: 'Times-Italic',
            color: lightText,
            textAlign: 'center',
        },
        techTags: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 6,
            marginTop: 8,
        },
        techTag: {
            fontSize: fontSizes.small - 2,
            color: secondaryColor,
            fontFamily: 'Times-Roman',
        },
        
        // Certifications
        certItem: {
            marginBottom: 10,
            alignItems: 'center',
        },
        certName: {
            fontSize: fontSizes.body - 1,
            fontFamily: 'Times-Bold',
            color: darkText,
        },
        certDetails: {
            fontSize: fontSizes.small,
            fontFamily: 'Times-Italic',
            color: lightText,
        },
        
        // Footer decoration
        footer: {
            marginTop: 'auto',
            paddingTop: 16,
            alignItems: 'center',
        },
        footerOrnament: {
            fontSize: 16,
            color: accentColor,
            letterSpacing: 4,
        },
    });

    // Helper - render description with bullets
    const renderDescription = (description: string | undefined) => {
        if (!description) return null;
        
        const lines = description.split('\n').filter(line => line.trim());
        const hasBullets = lines.some(line => /^[\-\*\•]/.test(line.trim()));
        
        if (hasBullets) {
            return (
                <View>
                    {lines.map((line, idx) => {
                        const isBullet = /^[\-\*\•]/.test(line.trim());
                        if (isBullet) {
                            return (
                                <View key={idx} style={styles.bulletPoint}>
                                    <Text style={styles.bulletDot}>❧</Text>
                                    <Text style={styles.bulletText}>{line.trim().slice(1).trim()}</Text>
                                </View>
                            );
                        }
                        return <Text key={idx} style={styles.experienceDescription}>{line}</Text>;
                    })}
                </View>
            );
        }
        
        return <Text style={styles.experienceDescription}>{description}</Text>;
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* ══════════════════════════════════════════════════════════════════
                    HEADER ÉLÉGANT CENTRÉ
                ══════════════════════════════════════════════════════════════════ */}
                <View style={styles.header}>
                    {layout.showPhoto && personalInfo.photo && (
                        <View style={styles.photoContainer}>
                            <Image src={personalInfo.photo} style={styles.photo} />
                        </View>
                    )}
                    
                    <Text style={styles.name}>
                        {personalInfo.firstName} {personalInfo.lastName}
                    </Text>
                    <Text style={styles.jobTitle}>{personalInfo.jobTitle}</Text>
                    
                    <View style={styles.divider} />
                    
                    <View style={styles.contactRow}>
                        {personalInfo.email && (
                            <View style={styles.contactItem}>
                                <Text>{personalInfo.email}</Text>
                            </View>
                        )}
                        {personalInfo.phone && (
                            <>
                                <Text style={styles.contactSeparator}>|</Text>
                                <View style={styles.contactItem}>
                                    <Text>{personalInfo.phone}</Text>
                                </View>
                            </>
                        )}
                        {personalInfo.address && (
                            <>
                                <Text style={styles.contactSeparator}>|</Text>
                                <View style={styles.contactItem}>
                                    <Text>{personalInfo.address}</Text>
                                </View>
                            </>
                        )}
                    </View>
                </View>

                {/* ══════════════════════════════════════════════════════════════════
                    PROFILE
                ══════════════════════════════════════════════════════════════════ */}
                {(personalInfo.summary || personalInfo.description) && (
                    <View style={styles.section}>
                        <View style={styles.sectionTitleContainer}>
                            <View style={styles.sectionTitleLine} />
                            <Text style={styles.sectionTitle}>À propos</Text>
                            <View style={styles.sectionTitleLine} />
                        </View>
                        <Text style={styles.profileText}>
                            {personalInfo.summary || personalInfo.description}
                        </Text>
                    </View>
                )}

                {/* ══════════════════════════════════════════════════════════════════
                    EXPERIENCE
                ══════════════════════════════════════════════════════════════════ */}
                {shouldShowSection('experience', experience.length > 0 && !!experience[0]?.title) && (
                    <View style={styles.section}>
                        <View style={styles.sectionTitleContainer}>
                            <View style={styles.sectionTitleLine} />
                            <Text style={styles.sectionTitle}>Expérience</Text>
                            <View style={styles.sectionTitleLine} />
                        </View>
                        {experience.filter(exp => exp.title).map((exp) => (
                            <View key={exp.id} style={styles.experienceItem}>
                                <View style={styles.experienceHeader}>
                                    <Text style={styles.experienceTitle}>{exp.title}</Text>
                                    <View style={styles.experienceSubline}>
                                        <Text style={styles.experienceCompany}>{exp.company}</Text>
                                        <Text style={styles.experienceDot}>•</Text>
                                        <Text style={styles.experienceDate}>
                                            {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                                        </Text>
                                    </View>
                                </View>
                                {renderDescription(exp.description)}
                            </View>
                        ))}
                    </View>
                )}

                {/* ══════════════════════════════════════════════════════════════════
                    EDUCATION
                ══════════════════════════════════════════════════════════════════ */}
                {shouldShowSection('education', education.length > 0 && !!education[0]?.degree) && (
                    <View style={styles.section}>
                        <View style={styles.sectionTitleContainer}>
                            <View style={styles.sectionTitleLine} />
                            <Text style={styles.sectionTitle}>Formation</Text>
                            <View style={styles.sectionTitleLine} />
                        </View>
                        {education.filter(edu => edu.degree).map((edu) => (
                            <View key={edu.id} style={styles.educationItem}>
                                <Text style={styles.educationDegree}>
                                    {edu.degree}{edu.field ? ` — ${edu.field}` : ''}
                                </Text>
                                <Text style={styles.educationSchool}>{edu.school}</Text>
                                <Text style={styles.educationDate}>
                                    {formatDateRange(edu.startDate, edu.endDate)}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* ══════════════════════════════════════════════════════════════════
                    TWO COLUMNS: SKILLS & LANGUAGES
                ══════════════════════════════════════════════════════════════════ */}
                <View style={styles.twoColumns}>
                    {/* Skills */}
                    {shouldShowSection('skills', skills.length > 0 && !!skills[0]?.name) && (
                        <View style={styles.column}>
                            <View style={styles.sectionTitleContainer}>
                                <View style={styles.sectionTitleLine} />
                                <Text style={styles.sectionTitle}>Compétences</Text>
                                <View style={styles.sectionTitleLine} />
                            </View>
                            <View style={styles.skillsGrid}>
                                {skills.filter(s => s.name).map((skill) => (
                                    <View key={skill.id} style={styles.skillItem}>
                                        <Text style={styles.skillName}>{skill.name}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Languages */}
                    {shouldShowSection('languages', languages.length > 0 && !!languages[0]?.name) && (
                        <View style={styles.column}>
                            <View style={styles.sectionTitleContainer}>
                                <View style={styles.sectionTitleLine} />
                                <Text style={styles.sectionTitle}>Langues</Text>
                                <View style={styles.sectionTitleLine} />
                            </View>
                            {languages.filter(l => l.name).map((lang) => (
                                <View key={lang.id} style={styles.languageItem}>
                                    <Text style={styles.languageName}>{lang.name}</Text>
                                    <Text style={styles.languageLevel}>
                                        {getLanguageLevelText(lang.level)}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                {/* ══════════════════════════════════════════════════════════════════
                    PROJECTS
                ══════════════════════════════════════════════════════════════════ */}
                {shouldShowSection('projects', projects && projects.length > 0 && !!projects[0]?.name) && (
                    <View style={styles.section}>
                        <View style={styles.sectionTitleContainer}>
                            <View style={styles.sectionTitleLine} />
                            <Text style={styles.sectionTitle}>Projets</Text>
                            <View style={styles.sectionTitleLine} />
                        </View>
                        {projects.filter(p => p.name).map((project) => (
                            <View key={project.id} style={styles.projectItem}>
                                <Text style={styles.projectName}>{project.name}</Text>
                                {project.description && (
                                    <Text style={styles.projectDescription}>{project.description}</Text>
                                )}
                                {project.technologies && project.technologies.length > 0 && (
                                    <View style={styles.techTags}>
                                        {project.technologies.map((tech, idx) => (
                                            <Text key={idx} style={styles.techTag}>
                                                {tech}{idx < project.technologies!.length - 1 ? ' · ' : ''}
                                            </Text>
                                        ))}
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
                )}

                {/* ══════════════════════════════════════════════════════════════════
                    CERTIFICATIONS
                ══════════════════════════════════════════════════════════════════ */}
                {shouldShowSection('certifications', certifications && certifications.length > 0 && !!certifications[0]?.name) && (
                    <View style={styles.section}>
                        <View style={styles.sectionTitleContainer}>
                            <View style={styles.sectionTitleLine} />
                            <Text style={styles.sectionTitle}>Certifications</Text>
                            <View style={styles.sectionTitleLine} />
                        </View>
                        {certifications.filter(c => c.name).map((cert) => (
                            <View key={cert.id} style={styles.certItem}>
                                <Text style={styles.certName}>{cert.name}</Text>
                                <Text style={styles.certDetails}>
                                    {cert.issuer}{cert.date ? ` — ${cert.date}` : ''}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Footer ornament */}
                <View style={styles.footer}>
                    <Text style={styles.footerOrnament}>❧ ❧ ❧</Text>
                </View>
            </Page>
        </Document>
    );
};

export default ElegantSerifPDF;
