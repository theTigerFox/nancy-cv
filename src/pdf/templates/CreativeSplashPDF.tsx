// ============================================================================
// NANCY CV - Creative Splash PDF Template
// Template créatif avec header dégradé et mise en page dynamique
// ============================================================================

import React from 'react';
import { Page, View, Text, Document, StyleSheet, Image } from '@react-pdf/renderer';
import type { CVData } from '../../types/cv';
import type { TemplateConfig } from '../../templates/types';
import { toPDFConfig, formatDateRange, isSectionVisible } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Creative Splash PDF - Header coloré avec dégradé, photo ronde, deux colonnes
// ─────────────────────────────────────────────────────────────────────────────

interface CreativeSplashPDFProps {
    cvData: CVData;
    config: TemplateConfig;
}

export const CreativeSplashPDF: React.FC<CreativeSplashPDFProps> = ({ cvData, config }) => {
    const pdfConfig = toPDFConfig(config);
    const { colors, fontSizes, spacing, layout, lineHeight } = pdfConfig;
    
    const { personalInfo, education, experience, skills, languages, projects, certifications, sectionsOrder = [] } = cvData;

    const shouldShowSection = (type: string, hasData: boolean) => {
        return isSectionVisible(type, sectionsOrder as any, hasData);
    };

    // Couleurs Creative Splash - Rose/Magenta dominant
    const primaryColor = colors.primary || '#f43f5e';
    const secondaryColor = colors.secondary || '#ec4899';
    const accentColor = colors.accent || '#fbbf24';
    const darkText = colors.text || '#1f2937';
    const lightText = colors.textLight || '#6b7280';

    const styles = StyleSheet.create({
        page: {
            backgroundColor: colors.background || '#ffffff',
            fontFamily: 'Helvetica',
            fontSize: fontSizes.body,
            lineHeight: lineHeight,
        },
        
        // ══════════════════════════════════════════════════════════════════════
        // HEADER AVEC GRADIENT (simulé avec couleur)
        // ══════════════════════════════════════════════════════════════════════
        header: {
            backgroundColor: primaryColor,
            padding: 30,
            paddingBottom: 40,
            position: 'relative',
        },
        headerContent: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        photoContainer: {
            marginRight: 24,
        },
        photo: {
            width: layout.photoSize || 100,
            height: layout.photoSize || 100,
            borderRadius: 50,
            borderWidth: 4,
            borderColor: '#ffffff',
            borderStyle: 'solid',
            objectFit: 'cover',
        },
        headerText: {
            flex: 1,
        },
        name: {
            fontSize: fontSizes.name || 28,
            fontFamily: 'Helvetica-Bold',
            color: '#ffffff',
            marginBottom: 4,
        },
        jobTitle: {
            fontSize: fontSizes.jobTitle || 14,
            color: 'rgba(255,255,255,0.9)',
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
            color: 'rgba(255,255,255,0.85)',
        },
        contactIcon: {
            marginRight: 6,
            color: accentColor,
        },
        
        // Décoration header
        headerDecoration: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 20,
            backgroundColor: secondaryColor,
        },
        
        // ══════════════════════════════════════════════════════════════════════
        // CONTENT
        // ══════════════════════════════════════════════════════════════════════
        content: {
            padding: 30,
            paddingTop: 24,
        },
        
        // Section
        section: {
            marginBottom: spacing.sectionGap || 20,
        },
        sectionTitle: {
            fontSize: fontSizes.sectionTitle || 13,
            fontFamily: 'Helvetica-Bold',
            color: primaryColor,
            textTransform: 'uppercase',
            letterSpacing: 1.5,
            marginBottom: 12,
            paddingBottom: 6,
            borderBottomWidth: 2,
            borderBottomColor: accentColor,
            borderBottomStyle: 'solid',
        },
        
        // Profile
        profileText: {
            fontSize: fontSizes.body,
            color: darkText,
            lineHeight: lineHeight,
        },
        
        // Two columns
        twoColumns: {
            flexDirection: 'row',
            gap: 24,
        },
        mainColumn: {
            flex: 1,
        },
        sideColumn: {
            width: '35%',
        },
        
        // ══════════════════════════════════════════════════════════════════════
        // EXPERIENCE CARDS
        // ══════════════════════════════════════════════════════════════════════
        experienceCard: {
            backgroundColor: colors.backgroundAlt || '#fef2f2',
            borderRadius: 6,
            padding: 12,
            marginBottom: 10,
            borderLeftWidth: 3,
            borderLeftColor: primaryColor,
            borderLeftStyle: 'solid',
        },
        experienceHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 4,
        },
        experienceTitle: {
            fontSize: fontSizes.body + 1,
            fontFamily: 'Helvetica-Bold',
            color: darkText,
            flex: 1,
        },
        experienceDate: {
            fontSize: fontSizes.small - 1,
            color: '#ffffff',
            backgroundColor: primaryColor,
            paddingVertical: 2,
            paddingHorizontal: 8,
            borderRadius: 10,
        },
        experienceCompany: {
            fontSize: fontSizes.body,
            color: secondaryColor,
            marginBottom: 6,
        },
        experienceDescription: {
            fontSize: fontSizes.small,
            color: lightText,
            lineHeight: lineHeight,
        },
        bulletPoint: {
            flexDirection: 'row',
            marginBottom: 2,
        },
        bulletDot: {
            marginRight: 6,
            color: accentColor,
        },
        bulletText: {
            flex: 1,
            fontSize: fontSizes.small,
            color: lightText,
        },
        
        // ══════════════════════════════════════════════════════════════════════
        // EDUCATION
        // ══════════════════════════════════════════════════════════════════════
        educationItem: {
            marginBottom: 12,
            paddingLeft: 12,
            borderLeftWidth: 2,
            borderLeftColor: accentColor,
            borderLeftStyle: 'solid',
        },
        educationDegree: {
            fontSize: fontSizes.body,
            fontFamily: 'Helvetica-Bold',
            color: darkText,
        },
        educationSchool: {
            fontSize: fontSizes.small,
            color: primaryColor,
        },
        educationDate: {
            fontSize: fontSizes.small - 1,
            color: lightText,
        },
        
        // ══════════════════════════════════════════════════════════════════════
        // SKILLS TAGS
        // ══════════════════════════════════════════════════════════════════════
        skillsContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 6,
        },
        skillTag: {
            backgroundColor: primaryColor,
            color: '#ffffff',
            paddingVertical: 4,
            paddingHorizontal: 10,
            borderRadius: 12,
            fontSize: fontSizes.small,
        },
        
        // ══════════════════════════════════════════════════════════════════════
        // LANGUAGES
        // ══════════════════════════════════════════════════════════════════════
        languageItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
            paddingBottom: 8,
            borderBottomWidth: 1,
            borderBottomColor: '#f3f4f6',
            borderBottomStyle: 'solid',
        },
        languageName: {
            fontSize: fontSizes.body,
            fontFamily: 'Helvetica-Bold',
            color: darkText,
        },
        languageBadge: {
            backgroundColor: accentColor,
            color: darkText,
            paddingVertical: 2,
            paddingHorizontal: 8,
            borderRadius: 8,
            fontSize: fontSizes.small - 1,
            fontFamily: 'Helvetica-Bold',
        },
        
        // ══════════════════════════════════════════════════════════════════════
        // PROJECTS
        // ══════════════════════════════════════════════════════════════════════
        projectCard: {
            backgroundColor: '#f9fafb',
            borderRadius: 6,
            padding: 10,
            marginBottom: 8,
        },
        projectName: {
            fontSize: fontSizes.body,
            fontFamily: 'Helvetica-Bold',
            color: primaryColor,
        },
        projectDescription: {
            fontSize: fontSizes.small,
            color: lightText,
            marginTop: 2,
        },
        techTags: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 4,
            marginTop: 6,
        },
        techTag: {
            backgroundColor: secondaryColor,
            color: '#ffffff',
            paddingVertical: 2,
            paddingHorizontal: 6,
            borderRadius: 4,
            fontSize: fontSizes.small - 2,
        },
        
        // Certifications
        certItem: {
            marginBottom: 8,
        },
        certName: {
            fontSize: fontSizes.small,
            fontFamily: 'Helvetica-Bold',
            color: darkText,
        },
        certDetails: {
            fontSize: fontSizes.small - 1,
            color: lightText,
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
                                    <Text style={styles.bulletDot}>★</Text>
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

    // Helper - language level text
    const getLevelText = (level: string | number): string => {
        if (typeof level === 'number') {
            if (level >= 9) return 'Natif';
            if (level >= 7) return 'C1-C2';
            if (level >= 5) return 'B2';
            if (level >= 3) return 'B1';
            return 'A1-A2';
        }
        const map: Record<string, string> = {
            'native': 'Natif',
            'C2': 'C2',
            'C1': 'C1',
            'B2': 'B2',
            'B1': 'B1',
            'A2': 'A2',
            'A1': 'A1'
        };
        return map[level] || level;
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* ══════════════════════════════════════════════════════════════════
                    HEADER COLORÉ
                ══════════════════════════════════════════════════════════════════ */}
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        {layout.showPhoto && personalInfo.photo && (
                            <View style={styles.photoContainer}>
                                <Image src={personalInfo.photo} style={styles.photo} />
                            </View>
                        )}
                        
                        <View style={styles.headerText}>
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
                    </View>
                    
                    {/* Bande décorative */}
                    <View style={styles.headerDecoration} />
                </View>

                {/* ══════════════════════════════════════════════════════════════════
                    CONTENU PRINCIPAL
                ══════════════════════════════════════════════════════════════════ */}
                <View style={styles.content}>
                    {/* Profile */}
                    {(personalInfo.summary || personalInfo.description) && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>À propos de moi</Text>
                            <Text style={styles.profileText}>
                                {personalInfo.summary || personalInfo.description}
                            </Text>
                        </View>
                    )}

                    {/* Two columns layout */}
                    <View style={styles.twoColumns}>
                        {/* Main Column */}
                        <View style={styles.mainColumn}>
                            {/* Experience */}
                            {shouldShowSection('experience', experience.length > 0 && !!experience[0]?.title) && (
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Expérience</Text>
                                    {experience.filter(exp => exp.title).map((exp) => (
                                        <View key={exp.id} style={styles.experienceCard}>
                                            <View style={styles.experienceHeader}>
                                                <Text style={styles.experienceTitle}>{exp.title}</Text>
                                                <Text style={styles.experienceDate}>
                                                    {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                                                </Text>
                                            </View>
                                            <Text style={styles.experienceCompany}>{exp.company}</Text>
                                            {renderDescription(exp.description)}
                                        </View>
                                    ))}
                                </View>
                            )}

                            {/* Education */}
                            {shouldShowSection('education', education.length > 0 && !!education[0]?.degree) && (
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Formation</Text>
                                    {education.filter(edu => edu.degree).map((edu) => (
                                        <View key={edu.id} style={styles.educationItem}>
                                            <Text style={styles.educationDegree}>
                                                {edu.degree}{edu.field ? ` - ${edu.field}` : ''}
                                            </Text>
                                            <Text style={styles.educationSchool}>{edu.school}</Text>
                                            <Text style={styles.educationDate}>
                                                {formatDateRange(edu.startDate, edu.endDate)}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            )}

                            {/* Projects */}
                            {shouldShowSection('projects', projects && projects.length > 0 && !!projects[0]?.name) && (
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Projets</Text>
                                    {projects.filter(p => p.name).map((project) => (
                                        <View key={project.id} style={styles.projectCard}>
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
                        </View>

                        {/* Side Column */}
                        <View style={styles.sideColumn}>
                            {/* Skills */}
                            {shouldShowSection('skills', skills.length > 0 && !!skills[0]?.name) && (
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Compétences</Text>
                                    <View style={styles.skillsContainer}>
                                        {skills.filter(s => s.name).map((skill) => (
                                            <Text key={skill.id} style={styles.skillTag}>
                                                {skill.name}
                                            </Text>
                                        ))}
                                    </View>
                                </View>
                            )}

                            {/* Languages */}
                            {shouldShowSection('languages', languages.length > 0 && !!languages[0]?.name) && (
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Langues</Text>
                                    {languages.filter(l => l.name).map((lang) => (
                                        <View key={lang.id} style={styles.languageItem}>
                                            <Text style={styles.languageName}>{lang.name}</Text>
                                            <Text style={styles.languageBadge}>
                                                {getLevelText(lang.level)}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            )}

                            {/* Certifications */}
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
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default CreativeSplashPDF;
