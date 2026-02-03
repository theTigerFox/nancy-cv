// ============================================================================
// NANCY CV - Classic Professional PDF Template
// Template classique avec mise en page traditionnelle et élégante
// ============================================================================

import React from 'react';
import { Page, View, Text, Document, StyleSheet, Image } from '@react-pdf/renderer';
import type { CVData } from '../../types/cv';
import type { TemplateConfig } from '../../templates/types';
import { toPDFConfig, formatDateRange, getLanguageLevelText, isSectionVisible } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Classic Professional PDF - Une colonne, titres soulignés, sobre et élégant
// ─────────────────────────────────────────────────────────────────────────────

interface ClassicProfessionalPDFProps {
    cvData: CVData;
    config: TemplateConfig;
}

export const ClassicProfessionalPDF: React.FC<ClassicProfessionalPDFProps> = ({ cvData, config }) => {
    const pdfConfig = toPDFConfig(config);
    const { colors, fontSizes, spacing, layout, lineHeight } = pdfConfig;
    
    const { personalInfo, education, experience, skills, languages, projects, certifications, sectionsOrder = [] } = cvData;

    const shouldShowSection = (type: string, hasData: boolean) => {
        return isSectionVisible(type, sectionsOrder as any, hasData);
    };

    // Couleurs Classic Professional
    const primaryColor = colors.primary || '#1e3a5f';
    const textColor = colors.text || '#333333';
    const lightGray = colors.textLight || '#666666';

    const styles = StyleSheet.create({
        page: {
            backgroundColor: colors.background || '#ffffff',
            padding: 40,
            fontFamily: 'Helvetica',
            fontSize: fontSizes.body,
            lineHeight: lineHeight,
        },
        
        // ══════════════════════════════════════════════════════════════════════
        // HEADER
        // ══════════════════════════════════════════════════════════════════════
        header: {
            flexDirection: 'row',
            marginBottom: 24,
            paddingBottom: 16,
            borderBottomWidth: 2,
            borderBottomColor: primaryColor,
            borderBottomStyle: 'solid',
        },
        headerContent: {
            flex: 1,
        },
        photoContainer: {
            marginLeft: 20,
        },
        photo: {
            width: layout.photoSize || 90,
            height: layout.photoSize || 90,
            borderRadius: 4,
            objectFit: 'cover',
        },
        name: {
            fontSize: fontSizes.name || 26,
            fontFamily: 'Helvetica-Bold',
            color: primaryColor,
            marginBottom: 4,
        },
        jobTitle: {
            fontSize: fontSizes.jobTitle || 14,
            color: lightGray,
            marginBottom: 12,
        },
        contactRow: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 16,
        },
        contactItem: {
            flexDirection: 'row',
            alignItems: 'center',
            fontSize: fontSizes.small,
            color: textColor,
        },
        contactIcon: {
            marginRight: 4,
            color: primaryColor,
        },
        
        // ══════════════════════════════════════════════════════════════════════
        // SECTIONS
        // ══════════════════════════════════════════════════════════════════════
        section: {
            marginBottom: spacing.sectionGap || 20,
        },
        sectionTitle: {
            fontSize: fontSizes.sectionTitle || 13,
            fontFamily: 'Helvetica-Bold',
            color: primaryColor,
            textTransform: 'uppercase',
            letterSpacing: 1,
            marginBottom: 4,
            paddingBottom: 4,
            borderBottomWidth: 1,
            borderBottomColor: primaryColor,
            borderBottomStyle: 'solid',
        },
        
        // Profile
        profileText: {
            fontSize: fontSizes.body,
            color: textColor,
            lineHeight: lineHeight,
            textAlign: 'justify',
        },
        
        // ══════════════════════════════════════════════════════════════════════
        // EXPERIENCE & EDUCATION
        // ══════════════════════════════════════════════════════════════════════
        entryItem: {
            marginTop: 12,
            marginBottom: 8,
        },
        entryHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 2,
        },
        entryTitle: {
            fontSize: fontSizes.body + 1,
            fontFamily: 'Helvetica-Bold',
            color: textColor,
            flex: 1,
        },
        entryDate: {
            fontSize: fontSizes.small,
            color: primaryColor,
            fontFamily: 'Helvetica-Bold',
        },
        entrySubtitle: {
            fontSize: fontSizes.body,
            color: lightGray,
            fontStyle: 'italic',
            marginBottom: 4,
        },
        entryDescription: {
            fontSize: fontSizes.body,
            color: textColor,
            lineHeight: lineHeight,
        },
        bulletPoint: {
            flexDirection: 'row',
            marginBottom: 2,
            paddingLeft: 8,
        },
        bulletDot: {
            marginRight: 8,
            color: primaryColor,
        },
        bulletText: {
            flex: 1,
            fontSize: fontSizes.body,
            color: textColor,
        },
        
        // ══════════════════════════════════════════════════════════════════════
        // TWO COLUMN SECTIONS
        // ══════════════════════════════════════════════════════════════════════
        twoColumnContainer: {
            flexDirection: 'row',
            gap: 30,
        },
        column: {
            flex: 1,
        },
        
        // Skills
        skillsGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 6,
            marginTop: 10,
        },
        skillItem: {
            flexDirection: 'row',
            alignItems: 'center',
            width: '48%',
            marginBottom: 6,
        },
        skillDot: {
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: primaryColor,
            marginRight: 8,
        },
        skillName: {
            fontSize: fontSizes.body,
            color: textColor,
        },
        skillLevel: {
            fontSize: fontSizes.small - 1,
            color: lightGray,
            marginLeft: 4,
        },
        
        // Languages
        languageItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 8,
            paddingBottom: 6,
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
            borderBottomStyle: 'solid',
        },
        languageName: {
            fontSize: fontSizes.body,
            fontFamily: 'Helvetica-Bold',
            color: textColor,
        },
        languageLevel: {
            fontSize: fontSizes.small,
            color: lightGray,
        },
        
        // Certifications
        certItem: {
            marginTop: 8,
        },
        certName: {
            fontSize: fontSizes.body,
            fontFamily: 'Helvetica-Bold',
            color: textColor,
        },
        certDetails: {
            fontSize: fontSizes.small,
            color: lightGray,
        },
        
        // Projects
        projectItem: {
            marginTop: 10,
        },
        projectName: {
            fontSize: fontSizes.body,
            fontFamily: 'Helvetica-Bold',
            color: textColor,
        },
        projectDescription: {
            fontSize: fontSizes.small,
            color: lightGray,
            marginTop: 2,
        },
        techTags: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 4,
            marginTop: 4,
        },
        techTag: {
            backgroundColor: colors.backgroundAlt || '#f5f5f5',
            paddingVertical: 2,
            paddingHorizontal: 6,
            fontSize: fontSizes.small - 1,
            color: primaryColor,
            borderRadius: 2,
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
                                    <Text style={styles.bulletDot}>•</Text>
                                    <Text style={styles.bulletText}>{line.trim().slice(1).trim()}</Text>
                                </View>
                            );
                        }
                        return <Text key={idx} style={styles.entryDescription}>{line}</Text>;
                    })}
                </View>
            );
        }
        
        return <Text style={styles.entryDescription}>{description}</Text>;
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* ══════════════════════════════════════════════════════════════════
                    HEADER WITH PHOTO
                ══════════════════════════════════════════════════════════════════ */}
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <Text style={styles.name}>
                            {personalInfo.firstName} {personalInfo.lastName}
                        </Text>
                        <Text style={styles.jobTitle}>{personalInfo.jobTitle}</Text>
                        
                        <View style={styles.contactRow}>
                            {personalInfo.email && (
                                <View style={styles.contactItem}>
                                    <Text style={styles.contactIcon}>✉</Text>
                                    <Text>{personalInfo.email}</Text>
                                </View>
                            )}
                            {personalInfo.phone && (
                                <View style={styles.contactItem}>
                                    <Text style={styles.contactIcon}>☎</Text>
                                    <Text>{personalInfo.phone}</Text>
                                </View>
                            )}
                            {personalInfo.address && (
                                <View style={styles.contactItem}>
                                    <Text style={styles.contactIcon}>⌂</Text>
                                    <Text>{personalInfo.address}</Text>
                                </View>
                            )}
                        </View>
                    </View>
                    
                    {layout.showPhoto && personalInfo.photo && (
                        <View style={styles.photoContainer}>
                            <Image src={personalInfo.photo} style={styles.photo} />
                        </View>
                    )}
                </View>

                {/* ══════════════════════════════════════════════════════════════════
                    PROFILE
                ══════════════════════════════════════════════════════════════════ */}
                {(personalInfo.summary || personalInfo.description) && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Profil</Text>
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
                        <Text style={styles.sectionTitle}>Expérience Professionnelle</Text>
                        {experience.filter(exp => exp.title).map((exp) => (
                            <View key={exp.id} style={styles.entryItem}>
                                <View style={styles.entryHeader}>
                                    <Text style={styles.entryTitle}>{exp.title}</Text>
                                    <Text style={styles.entryDate}>
                                        {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                                    </Text>
                                </View>
                                <Text style={styles.entrySubtitle}>{exp.company}</Text>
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
                        <Text style={styles.sectionTitle}>Formation</Text>
                        {education.filter(edu => edu.degree).map((edu) => (
                            <View key={edu.id} style={styles.entryItem}>
                                <View style={styles.entryHeader}>
                                    <Text style={styles.entryTitle}>
                                        {edu.degree}{edu.field ? ` - ${edu.field}` : ''}
                                    </Text>
                                    <Text style={styles.entryDate}>
                                        {formatDateRange(edu.startDate, edu.endDate)}
                                    </Text>
                                </View>
                                <Text style={styles.entrySubtitle}>{edu.school}</Text>
                                {edu.description && (
                                    <Text style={styles.entryDescription}>{edu.description}</Text>
                                )}
                            </View>
                        ))}
                    </View>
                )}

                {/* ══════════════════════════════════════════════════════════════════
                    TWO COLUMN: SKILLS & LANGUAGES
                ══════════════════════════════════════════════════════════════════ */}
                <View style={styles.twoColumnContainer}>
                    {/* Skills */}
                    {shouldShowSection('skills', skills.length > 0 && !!skills[0]?.name) && (
                        <View style={styles.column}>
                            <Text style={styles.sectionTitle}>Compétences</Text>
                            <View style={styles.skillsGrid}>
                                {skills.filter(s => s.name).map((skill) => (
                                    <View key={skill.id} style={styles.skillItem}>
                                        <View style={styles.skillDot} />
                                        <Text style={styles.skillName}>{skill.name}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}
                    
                    {/* Languages */}
                    {shouldShowSection('languages', languages.length > 0 && !!languages[0]?.name) && (
                        <View style={styles.column}>
                            <Text style={styles.sectionTitle}>Langues</Text>
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
                        <Text style={styles.sectionTitle}>Projets</Text>
                        {projects.filter(p => p.name).map((project) => (
                            <View key={project.id} style={styles.projectItem}>
                                <Text style={styles.projectName}>{project.name}</Text>
                                {project.description && (
                                    <Text style={styles.projectDescription}>{project.description}</Text>
                                )}
                                {project.technologies && project.technologies.length > 0 && (
                                    <View style={styles.techTags}>
                                        {project.technologies.map((tech, idx) => (
                                            <Text key={idx} style={styles.techTag}>{tech}</Text>
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
                        <Text style={styles.sectionTitle}>Certifications</Text>
                        {certifications.filter(c => c.name).map((cert) => (
                            <View key={cert.id} style={styles.certItem}>
                                <Text style={styles.certName}>{cert.name}</Text>
                                <Text style={styles.certDetails}>
                                    {cert.issuer}{cert.date ? ` • ${cert.date}` : ''}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}
            </Page>
        </Document>
    );
};

export default ClassicProfessionalPDF;
