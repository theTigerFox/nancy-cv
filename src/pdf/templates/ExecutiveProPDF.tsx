// ============================================================================
// NANCY CV - Executive Pro PDF Template
// Template professionnel haut de gamme avec sidebar gauche
// ============================================================================

import React from 'react';
import { Page, View, Text, Document, StyleSheet, Image } from '@react-pdf/renderer';
import type { CVData } from '../../types/cv';
import type { TemplateConfig } from '../../templates/types';
import { toPDFConfig, formatDateRange, getLanguageLevelText, isSectionVisible } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Executive Pro PDF - Sidebar gauche bleu foncé avec accent doré
// ─────────────────────────────────────────────────────────────────────────────

interface ExecutiveProPDFProps {
    cvData: CVData;
    config: TemplateConfig;
}

export const ExecutiveProPDF: React.FC<ExecutiveProPDFProps> = ({ cvData, config }) => {
    const pdfConfig = toPDFConfig(config);
    const { colors, fontSizes, spacing, layout, lineHeight } = pdfConfig;
    
    const { personalInfo, education, experience, skills, languages, projects, certifications, sectionsOrder = [] } = cvData;

    const shouldShowSection = (type: string, hasData: boolean) => {
        return isSectionVisible(type, sectionsOrder as any, hasData);
    };

    // Couleurs Executive Pro
    const sidebarBg = colors.primary || '#1e3a5f';
    const accentColor = colors.accent || '#c9a227';
    const sidebarWidth = layout.sidebarWidth || 32;

    const styles = StyleSheet.create({
        page: {
            flexDirection: 'row',
            backgroundColor: colors.background,
            fontFamily: 'Helvetica',
            fontSize: fontSizes.body,
            lineHeight: lineHeight,
        },
        
        // ══════════════════════════════════════════════════════════════════════
        // SIDEBAR
        // ══════════════════════════════════════════════════════════════════════
        sidebar: {
            width: `${sidebarWidth}%`,
            backgroundColor: sidebarBg,
            padding: 24,
            color: colors.white,
        },
        
        // Photo
        photoContainer: {
            alignItems: 'center',
            marginBottom: 24,
        },
        photo: {
            width: layout.photoSize || 120,
            height: layout.photoSize || 120,
            borderWidth: 3,
            borderColor: accentColor,
            borderStyle: 'solid',
            objectFit: 'cover',
        },
        
        // Section titles sidebar
        sidebarSectionTitle: {
            fontSize: fontSizes.sectionTitle,
            fontFamily: 'Helvetica-Bold',
            color: colors.white,
            marginBottom: 12,
            paddingBottom: 6,
            borderBottomWidth: 2,
            borderBottomColor: accentColor,
            borderBottomStyle: 'solid',
        },
        
        // Contact
        contactSection: {
            marginBottom: 24,
        },
        contactItem: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
            fontSize: fontSizes.small,
        },
        contactIcon: {
            color: accentColor,
            marginRight: 8,
            width: 14,
        },
        contactText: {
            color: colors.white,
            flex: 1,
        },
        
        // Skills
        skillsSection: {
            marginBottom: 24,
        },
        skillItem: {
            marginBottom: 10,
        },
        skillName: {
            fontSize: fontSizes.small,
            color: colors.white,
            marginBottom: 4,
        },
        skillBarBg: {
            height: 4,
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: 2,
        },
        skillBarFill: {
            height: 4,
            backgroundColor: accentColor,
            borderRadius: 2,
        },
        
        // Languages
        languagesSection: {
            marginBottom: 24,
        },
        languageItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
        },
        languageName: {
            fontSize: fontSizes.small,
            color: colors.white,
        },
        languageDots: {
            flexDirection: 'row',
            gap: 3,
        },
        languageDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
        },
        languageDotFilled: {
            backgroundColor: accentColor,
        },
        languageDotEmpty: {
            backgroundColor: 'rgba(255,255,255,0.2)',
        },
        
        // ══════════════════════════════════════════════════════════════════════
        // MAIN CONTENT
        // ══════════════════════════════════════════════════════════════════════
        main: {
            flex: 1,
            padding: 28,
            backgroundColor: colors.background,
        },
        
        // Header
        header: {
            marginBottom: 28,
        },
        name: {
            fontSize: fontSizes.name || 28,
            fontFamily: 'Helvetica-Bold',
            color: sidebarBg,
            letterSpacing: 0.5,
            marginBottom: 4,
        },
        jobTitleContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        jobTitleAccent: {
            width: 30,
            height: 3,
            backgroundColor: accentColor,
            marginRight: 10,
        },
        jobTitle: {
            fontSize: fontSizes.jobTitle || 14,
            color: colors.textLight,
            textTransform: 'uppercase',
            letterSpacing: 1,
        },
        
        // Section
        section: {
            marginBottom: spacing.sectionGap,
        },
        sectionTitle: {
            fontSize: fontSizes.sectionTitle,
            fontFamily: 'Helvetica-Bold',
            color: sidebarBg,
            marginBottom: 14,
            paddingLeft: 12,
            borderLeftWidth: 3,
            borderLeftColor: accentColor,
            borderLeftStyle: 'solid',
        },
        
        // Profile
        profileText: {
            fontSize: fontSizes.body,
            color: colors.text,
            lineHeight: lineHeight,
            textAlign: 'justify',
        },
        
        // Experience
        experienceItem: {
            marginBottom: spacing.itemGap,
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
            color: colors.text,
            flex: 1,
        },
        experienceDate: {
            fontSize: fontSizes.small,
            color: accentColor,
            fontFamily: 'Helvetica-Bold',
        },
        experienceCompany: {
            fontSize: fontSizes.body,
            color: colors.secondary || colors.primary,
            marginBottom: 6,
        },
        experienceDescription: {
            fontSize: fontSizes.body,
            color: colors.textLight,
            lineHeight: lineHeight,
        },
        bulletPoint: {
            flexDirection: 'row',
            marginBottom: 3,
        },
        bulletDot: {
            width: 4,
            marginRight: 8,
            marginTop: 5,
            color: accentColor,
        },
        bulletText: {
            flex: 1,
            fontSize: fontSizes.body,
            color: colors.textLight,
        },
        
        // Education
        educationItem: {
            marginBottom: spacing.itemGap,
        },
        educationHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 2,
        },
        educationDegree: {
            fontSize: fontSizes.body + 1,
            fontFamily: 'Helvetica-Bold',
            color: colors.text,
            flex: 1,
        },
        educationDate: {
            fontSize: fontSizes.small,
            color: accentColor,
            fontFamily: 'Helvetica-Bold',
        },
        educationSchool: {
            fontSize: fontSizes.body,
            color: colors.secondary || colors.primary,
        },
        
        // Projects
        projectItem: {
            marginBottom: spacing.itemGap,
        },
        projectName: {
            fontSize: fontSizes.body,
            fontFamily: 'Helvetica-Bold',
            color: colors.text,
        },
        projectDescription: {
            fontSize: fontSizes.small,
            color: colors.textLight,
            marginTop: 2,
        },
        techTags: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 4,
            marginTop: 6,
        },
        techTag: {
            backgroundColor: colors.backgroundAlt,
            paddingVertical: 2,
            paddingHorizontal: 8,
            fontSize: fontSizes.small - 1,
            color: colors.text,
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
                        return <Text key={idx} style={styles.experienceDescription}>{line}</Text>;
                    })}
                </View>
            );
        }
        
        return <Text style={styles.experienceDescription}>{description}</Text>;
    };

    // Helper - language level to 5 dots
    const getLanguageDots = (level: string | number): number => {
        if (typeof level === 'number') return Math.min(5, Math.ceil(level / 2));
        const map: Record<string, number> = { 'A1': 1, 'A2': 2, 'B1': 2, 'B2': 3, 'C1': 4, 'C2': 5, 'native': 5 };
        return map[level] || 3;
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* ══════════════════════════════════════════════════════════════════
                    SIDEBAR
                ══════════════════════════════════════════════════════════════════ */}
                <View style={styles.sidebar}>
                    {/* Photo */}
                    {layout.showPhoto && personalInfo.photo && (
                        <View style={styles.photoContainer}>
                            <Image src={personalInfo.photo} style={styles.photo} />
                        </View>
                    )}
                    
                    {/* Contact */}
                    <View style={styles.contactSection}>
                        <Text style={styles.sidebarSectionTitle}>Contact</Text>
                        
                        {personalInfo.email && (
                            <View style={styles.contactItem}>
                                <Text style={styles.contactIcon}>✉</Text>
                                <Text style={styles.contactText}>{personalInfo.email}</Text>
                            </View>
                        )}
                        {personalInfo.phone && (
                            <View style={styles.contactItem}>
                                <Text style={styles.contactIcon}>☎</Text>
                                <Text style={styles.contactText}>{personalInfo.phone}</Text>
                            </View>
                        )}
                        {personalInfo.address && (
                            <View style={styles.contactItem}>
                                <Text style={styles.contactIcon}>⌂</Text>
                                <Text style={styles.contactText}>{personalInfo.address}</Text>
                            </View>
                        )}
                        {personalInfo.website && (
                            <View style={styles.contactItem}>
                                <Text style={styles.contactIcon}>🔗</Text>
                                <Text style={styles.contactText}>{personalInfo.website}</Text>
                            </View>
                        )}
                    </View>
                    
                    {/* Skills */}
                    {shouldShowSection('skills', skills.length > 0 && !!skills[0]?.name) && (
                        <View style={styles.skillsSection}>
                            <Text style={styles.sidebarSectionTitle}>Compétences</Text>
                            {skills.filter(s => s.name).map((skill) => (
                                <View key={skill.id} style={styles.skillItem}>
                                    <Text style={styles.skillName}>{skill.name}</Text>
                                    <View style={styles.skillBarBg}>
                                        <View style={[styles.skillBarFill, { width: `${(skill.level || 5) * 10}%` }]} />
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                    
                    {/* Languages */}
                    {shouldShowSection('languages', languages.length > 0 && !!languages[0]?.name) && (
                        <View style={styles.languagesSection}>
                            <Text style={styles.sidebarSectionTitle}>Langues</Text>
                            {languages.filter(l => l.name).map((lang) => {
                                const dots = getLanguageDots(lang.level);
                                return (
                                    <View key={lang.id} style={styles.languageItem}>
                                        <Text style={styles.languageName}>{lang.name}</Text>
                                        <View style={styles.languageDots}>
                                            {[1,2,3,4,5].map(i => (
                                                <View 
                                                    key={i} 
                                                    style={[
                                                        styles.languageDot,
                                                        i <= dots ? styles.languageDotFilled : styles.languageDotEmpty
                                                    ]} 
                                                />
                                            ))}
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    )}
                    
                    {/* Certifications */}
                    {shouldShowSection('certifications', certifications && certifications.length > 0 && !!certifications[0]?.name) && (
                        <View>
                            <Text style={styles.sidebarSectionTitle}>Certifications</Text>
                            {certifications.filter(c => c.name).map((cert) => (
                                <View key={cert.id} style={{ marginBottom: 8 }}>
                                    <Text style={styles.skillName}>{cert.name}</Text>
                                    <Text style={{ fontSize: fontSizes.small - 1, color: 'rgba(255,255,255,0.7)' }}>
                                        {cert.issuer}{cert.date ? ` • ${cert.date}` : ''}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                {/* ══════════════════════════════════════════════════════════════════
                    MAIN CONTENT
                ══════════════════════════════════════════════════════════════════ */}
                <View style={styles.main}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.name}>
                            {personalInfo.firstName} {personalInfo.lastName}
                        </Text>
                        <View style={styles.jobTitleContainer}>
                            <View style={styles.jobTitleAccent} />
                            <Text style={styles.jobTitle}>{personalInfo.jobTitle}</Text>
                        </View>
                    </View>
                    
                    {/* Profile */}
                    {(personalInfo.summary || personalInfo.description) && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Profil</Text>
                            <Text style={styles.profileText}>
                                {personalInfo.summary || personalInfo.description}
                            </Text>
                        </View>
                    )}
                    
                    {/* Experience */}
                    {shouldShowSection('experience', experience.length > 0 && !!experience[0]?.title) && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Expérience Professionnelle</Text>
                            {experience.filter(exp => exp.title).map((exp) => (
                                <View key={exp.id} style={styles.experienceItem}>
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
                                    <View style={styles.educationHeader}>
                                        <Text style={styles.educationDegree}>
                                            {edu.degree}{edu.field ? ` - ${edu.field}` : ''}
                                        </Text>
                                        <Text style={styles.educationDate}>
                                            {formatDateRange(edu.startDate, edu.endDate)}
                                        </Text>
                                    </View>
                                    <Text style={styles.educationSchool}>{edu.school}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                    
                    {/* Projects */}
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
                </View>
            </Page>
        </Document>
    );
};

export default ExecutiveProPDF;
