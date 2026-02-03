// ============================================================================
// NANCY CV - Tech Minimal PDF Template
// Template moderne minimaliste pour profils tech
// ============================================================================

import React from 'react';
import { Page, View, Text, Document, StyleSheet } from '@react-pdf/renderer';
import type { CVData } from '../../types/cv';
import type { TemplateConfig } from '../../templates/types';
import { toPDFConfig, formatDateRange, isSectionVisible } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Tech Minimal PDF - Design épuré, skills en tags, accent cyan, sans photo
// ─────────────────────────────────────────────────────────────────────────────

interface TechMinimalPDFProps {
    cvData: CVData;
    config: TemplateConfig;
}

export const TechMinimalPDF: React.FC<TechMinimalPDFProps> = ({ cvData, config }) => {
    const pdfConfig = toPDFConfig(config);
    const { colors, fontSizes, spacing, lineHeight } = pdfConfig;
    
    const { personalInfo, education, experience, skills, languages, projects, certifications, sectionsOrder = [] } = cvData;

    const shouldShowSection = (type: string, hasData: boolean) => {
        return isSectionVisible(type, sectionsOrder as any, hasData);
    };

    // Couleurs Tech Minimal - Cyan/Bleu
    const primaryColor = colors.primary || '#0ea5e9';
    const secondaryColor = colors.secondary || '#0284c7';
    const darkText = colors.text || '#0f172a';
    const lightText = colors.textLight || '#64748b';
    const bgAlt = colors.backgroundAlt || '#f8fafc';

    const styles = StyleSheet.create({
        page: {
            backgroundColor: colors.background || '#ffffff',
            padding: 40,
            fontFamily: 'Helvetica',
            fontSize: fontSizes.body,
            lineHeight: lineHeight,
        },
        
        // ══════════════════════════════════════════════════════════════════════
        // HEADER MINIMALISTE
        // ══════════════════════════════════════════════════════════════════════
        header: {
            marginBottom: 24,
            paddingBottom: 20,
            borderBottomWidth: 1,
            borderBottomColor: '#e2e8f0',
            borderBottomStyle: 'solid',
        },
        nameContainer: {
            flexDirection: 'row',
            alignItems: 'baseline',
            marginBottom: 6,
        },
        firstName: {
            fontSize: fontSizes.name || 28,
            fontFamily: 'Helvetica',
            color: darkText,
            marginRight: 8,
        },
        lastName: {
            fontSize: fontSizes.name || 28,
            fontFamily: 'Helvetica-Bold',
            color: primaryColor,
        },
        jobTitle: {
            fontSize: fontSizes.jobTitle || 13,
            color: lightText,
            textTransform: 'uppercase',
            letterSpacing: 2,
            marginBottom: 12,
        },
        contactRow: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 20,
        },
        contactItem: {
            flexDirection: 'row',
            alignItems: 'center',
            fontSize: fontSizes.small,
            color: darkText,
        },
        contactIcon: {
            marginRight: 6,
            color: primaryColor,
        },
        contactLink: {
            color: primaryColor,
        },
        
        // ══════════════════════════════════════════════════════════════════════
        // SECTIONS
        // ══════════════════════════════════════════════════════════════════════
        section: {
            marginBottom: spacing.sectionGap || 20,
        },
        sectionHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
        },
        sectionIcon: {
            width: 24,
            height: 24,
            backgroundColor: primaryColor,
            borderRadius: 4,
            marginRight: 10,
            alignItems: 'center',
            justifyContent: 'center',
        },
        sectionIconText: {
            color: '#ffffff',
            fontSize: 12,
            fontFamily: 'Helvetica-Bold',
        },
        sectionTitle: {
            fontSize: fontSizes.sectionTitle || 14,
            fontFamily: 'Helvetica-Bold',
            color: darkText,
            textTransform: 'uppercase',
            letterSpacing: 1,
        },
        
        // Profile
        profileText: {
            fontSize: fontSizes.body,
            color: darkText,
            lineHeight: lineHeight,
            backgroundColor: bgAlt,
            padding: 12,
            borderRadius: 4,
        },
        
        // ══════════════════════════════════════════════════════════════════════
        // EXPERIENCE TIMELINE
        // ══════════════════════════════════════════════════════════════════════
        experienceItem: {
            position: 'relative',
            paddingLeft: 16,
            marginBottom: 16,
            borderLeftWidth: 2,
            borderLeftColor: '#e2e8f0',
            borderLeftStyle: 'solid',
        },
        experienceDot: {
            position: 'absolute',
            left: -5,
            top: 2,
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: primaryColor,
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
            fontSize: fontSizes.small,
            color: primaryColor,
            fontFamily: 'Courier',
        },
        experienceCompany: {
            fontSize: fontSizes.body,
            color: lightText,
            marginBottom: 6,
        },
        experienceDescription: {
            fontSize: fontSizes.small,
            color: darkText,
            lineHeight: lineHeight,
        },
        bulletPoint: {
            flexDirection: 'row',
            marginBottom: 2,
        },
        bulletDot: {
            marginRight: 8,
            color: primaryColor,
        },
        bulletText: {
            flex: 1,
            fontSize: fontSizes.small,
            color: darkText,
        },
        
        // ══════════════════════════════════════════════════════════════════════
        // SKILLS TAGS
        // ══════════════════════════════════════════════════════════════════════
        skillsContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
        },
        skillTag: {
            backgroundColor: bgAlt,
            borderWidth: 1,
            borderColor: '#e2e8f0',
            borderStyle: 'solid',
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 4,
            fontSize: fontSizes.small,
            color: darkText,
        },
        skillTagHighlight: {
            backgroundColor: primaryColor,
            borderColor: primaryColor,
            color: '#ffffff',
        },
        
        // ══════════════════════════════════════════════════════════════════════
        // TWO COLUMN GRID
        // ══════════════════════════════════════════════════════════════════════
        twoColumns: {
            flexDirection: 'row',
            gap: 30,
        },
        column: {
            flex: 1,
        },
        
        // Education
        educationItem: {
            marginBottom: 12,
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
            fontFamily: 'Courier',
        },
        
        // Languages
        languageItem: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
        },
        languageName: {
            fontSize: fontSizes.body,
            color: darkText,
            width: 80,
        },
        languageBar: {
            flex: 1,
            height: 4,
            backgroundColor: '#e2e8f0',
            borderRadius: 2,
        },
        languageBarFill: {
            height: 4,
            backgroundColor: primaryColor,
            borderRadius: 2,
        },
        languageLevel: {
            fontSize: fontSizes.small - 1,
            color: lightText,
            marginLeft: 8,
            width: 30,
        },
        
        // ══════════════════════════════════════════════════════════════════════
        // PROJECTS
        // ══════════════════════════════════════════════════════════════════════
        projectItem: {
            backgroundColor: bgAlt,
            padding: 12,
            borderRadius: 4,
            marginBottom: 10,
        },
        projectHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 4,
        },
        projectName: {
            fontSize: fontSizes.body,
            fontFamily: 'Helvetica-Bold',
            color: darkText,
        },
        projectLink: {
            fontSize: fontSizes.small - 1,
            color: primaryColor,
        },
        projectDescription: {
            fontSize: fontSizes.small,
            color: lightText,
            marginBottom: 6,
        },
        techTags: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 4,
        },
        techTag: {
            backgroundColor: secondaryColor,
            color: '#ffffff',
            paddingVertical: 2,
            paddingHorizontal: 6,
            borderRadius: 2,
            fontSize: fontSizes.small - 2,
            fontFamily: 'Courier',
        },
        
        // Certifications
        certItem: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: 8,
        },
        certBadge: {
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: primaryColor,
            marginRight: 8,
            marginTop: 4,
        },
        certContent: {
            flex: 1,
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
                                    <Text style={styles.bulletDot}>→</Text>
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

    // Helper - language level to percentage
    const getLevelPercentage = (level: string | number): number => {
        if (typeof level === 'number') return level * 10;
        const map: Record<string, number> = {
            'A1': 15, 'A2': 30, 'B1': 45, 'B2': 60, 'C1': 80, 'C2': 95, 'native': 100
        };
        return map[level] || 50;
    };

    const getLevelLabel = (level: string | number): string => {
        if (typeof level === 'number') {
            if (level >= 9) return '★★★';
            if (level >= 7) return '★★☆';
            if (level >= 5) return '★☆☆';
            return '☆☆☆';
        }
        return level;
    };

    // Section icons mapping
    const getSectionIcon = (type: string): string => {
        const icons: Record<string, string> = {
            'profile': '◉',
            'experience': '▶',
            'education': '◆',
            'skills': '●',
            'languages': '◎',
            'projects': '■',
            'certifications': '✓'
        };
        return icons[type] || '●';
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* ══════════════════════════════════════════════════════════════════
                    HEADER MINIMALISTE
                ══════════════════════════════════════════════════════════════════ */}
                <View style={styles.header}>
                    <View style={styles.nameContainer}>
                        <Text style={styles.firstName}>{personalInfo.firstName}</Text>
                        <Text style={styles.lastName}>{personalInfo.lastName}</Text>
                    </View>
                    <Text style={styles.jobTitle}>{personalInfo.jobTitle}</Text>
                    
                    <View style={styles.contactRow}>
                        {personalInfo.email && (
                            <View style={styles.contactItem}>
                                <Text style={styles.contactIcon}>@</Text>
                                <Text style={styles.contactLink}>{personalInfo.email}</Text>
                            </View>
                        )}
                        {personalInfo.phone && (
                            <View style={styles.contactItem}>
                                <Text style={styles.contactIcon}>#</Text>
                                <Text>{personalInfo.phone}</Text>
                            </View>
                        )}
                        {personalInfo.website && (
                            <View style={styles.contactItem}>
                                <Text style={styles.contactIcon}>⟨⟩</Text>
                                <Text style={styles.contactLink}>{personalInfo.website}</Text>
                            </View>
                        )}
                        {personalInfo.address && (
                            <View style={styles.contactItem}>
                                <Text style={styles.contactIcon}>◊</Text>
                                <Text>{personalInfo.address}</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* ══════════════════════════════════════════════════════════════════
                    PROFILE
                ══════════════════════════════════════════════════════════════════ */}
                {(personalInfo.summary || personalInfo.description) && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionIcon}>
                                <Text style={styles.sectionIconText}>{getSectionIcon('profile')}</Text>
                            </View>
                            <Text style={styles.sectionTitle}>Profil</Text>
                        </View>
                        <Text style={styles.profileText}>
                            {personalInfo.summary || personalInfo.description}
                        </Text>
                    </View>
                )}

                {/* ══════════════════════════════════════════════════════════════════
                    SKILLS TAGS
                ══════════════════════════════════════════════════════════════════ */}
                {shouldShowSection('skills', skills.length > 0 && !!skills[0]?.name) && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionIcon}>
                                <Text style={styles.sectionIconText}>{getSectionIcon('skills')}</Text>
                            </View>
                            <Text style={styles.sectionTitle}>Stack Technique</Text>
                        </View>
                        <View style={styles.skillsContainer}>
                            {skills.filter(s => s.name).map((skill, idx) => (
                                <Text 
                                    key={skill.id} 
                                    style={[
                                        styles.skillTag,
                                        idx < 3 ? styles.skillTagHighlight : {}
                                    ]}
                                >
                                    {skill.name}
                                </Text>
                            ))}
                        </View>
                    </View>
                )}

                {/* ══════════════════════════════════════════════════════════════════
                    EXPERIENCE TIMELINE
                ══════════════════════════════════════════════════════════════════ */}
                {shouldShowSection('experience', experience.length > 0 && !!experience[0]?.title) && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionIcon}>
                                <Text style={styles.sectionIconText}>{getSectionIcon('experience')}</Text>
                            </View>
                            <Text style={styles.sectionTitle}>Expérience</Text>
                        </View>
                        {experience.filter(exp => exp.title).map((exp) => (
                            <View key={exp.id} style={styles.experienceItem}>
                                <View style={styles.experienceDot} />
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

                {/* ══════════════════════════════════════════════════════════════════
                    TWO COLUMNS: EDUCATION & LANGUAGES
                ══════════════════════════════════════════════════════════════════ */}
                <View style={styles.twoColumns}>
                    {/* Education */}
                    {shouldShowSection('education', education.length > 0 && !!education[0]?.degree) && (
                        <View style={styles.column}>
                            <View style={styles.sectionHeader}>
                                <View style={styles.sectionIcon}>
                                    <Text style={styles.sectionIconText}>{getSectionIcon('education')}</Text>
                                </View>
                                <Text style={styles.sectionTitle}>Formation</Text>
                            </View>
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

                    {/* Languages */}
                    {shouldShowSection('languages', languages.length > 0 && !!languages[0]?.name) && (
                        <View style={styles.column}>
                            <View style={styles.sectionHeader}>
                                <View style={styles.sectionIcon}>
                                    <Text style={styles.sectionIconText}>{getSectionIcon('languages')}</Text>
                                </View>
                                <Text style={styles.sectionTitle}>Langues</Text>
                            </View>
                            {languages.filter(l => l.name).map((lang) => (
                                <View key={lang.id} style={styles.languageItem}>
                                    <Text style={styles.languageName}>{lang.name}</Text>
                                    <View style={styles.languageBar}>
                                        <View style={[styles.languageBarFill, { width: `${getLevelPercentage(lang.level)}%` }]} />
                                    </View>
                                    <Text style={styles.languageLevel}>{getLevelLabel(lang.level)}</Text>
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
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionIcon}>
                                <Text style={styles.sectionIconText}>{getSectionIcon('projects')}</Text>
                            </View>
                            <Text style={styles.sectionTitle}>Projets</Text>
                        </View>
                        {projects.filter(p => p.name).map((project) => (
                            <View key={project.id} style={styles.projectItem}>
                                <View style={styles.projectHeader}>
                                    <Text style={styles.projectName}>{project.name}</Text>
                                    {project.url && (
                                        <Text style={styles.projectLink}>{project.url}</Text>
                                    )}
                                </View>
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
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionIcon}>
                                <Text style={styles.sectionIconText}>{getSectionIcon('certifications')}</Text>
                            </View>
                            <Text style={styles.sectionTitle}>Certifications</Text>
                        </View>
                        {certifications.filter(c => c.name).map((cert) => (
                            <View key={cert.id} style={styles.certItem}>
                                <View style={styles.certBadge} />
                                <View style={styles.certContent}>
                                    <Text style={styles.certName}>{cert.name}</Text>
                                    <Text style={styles.certDetails}>
                                        {cert.issuer}{cert.date ? ` • ${cert.date}` : ''}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </Page>
        </Document>
    );
};

export default TechMinimalPDF;
