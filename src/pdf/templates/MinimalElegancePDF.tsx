// ============================================================================
// NANCY CV - Minimal Elegance PDF Template
// Template épuré et sophistiqué avec beaucoup d'espace blanc
// ============================================================================

import React from 'react';
import { Page, View, Text, Document, StyleSheet, Link } from '@react-pdf/renderer';
import type { CVData } from '../../types/cv';
import type { TemplateConfig } from '../../templates/types';
import { toPDFConfig, formatDateRange, getLanguageLevelText, isSectionVisible } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Component Props
// ─────────────────────────────────────────────────────────────────────────────

interface MinimalElegancePDFProps {
    cvData: CVData;
    config: TemplateConfig;
}

// ─────────────────────────────────────────────────────────────────────────────
// Minimal Elegance PDF Template
// ─────────────────────────────────────────────────────────────────────────────

export const MinimalElegancePDF: React.FC<MinimalElegancePDFProps> = ({ cvData, config }) => {
    const pdfConfig = toPDFConfig(config);
    const { colors, fontSizes, spacing, lineHeight } = pdfConfig;
    
    const { personalInfo, education, experience, skills, languages, interests, projects, certifications, sectionsOrder = [] } = cvData;

    const shouldShowSection = (type: string, hasData: boolean) => {
        return isSectionVisible(type, sectionsOrder as any, hasData);
    };

    const styles = StyleSheet.create({
        page: {
            backgroundColor: colors.background,
            fontFamily: 'Helvetica',
            fontSize: fontSizes.body,
            lineHeight: lineHeight,
            padding: spacing.pageMargin || 50,
        },
        
        // Header
        header: {
            textAlign: 'center',
            marginBottom: 30,
        },
        name: {
            fontSize: fontSizes.name || 32,
            fontFamily: 'Helvetica',
            fontWeight: 400,
            color: colors.text,
            letterSpacing: 2,
            marginBottom: 6,
        },
        jobTitle: {
            fontSize: fontSizes.jobTitle || 12,
            fontWeight: 300,
            color: colors.textLight,
            textTransform: 'uppercase',
            letterSpacing: 3,
            marginBottom: 14,
        },
        contactRow: {
            flexDirection: 'row',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 8,
        },
        contactItem: {
            fontSize: fontSizes.small,
            color: colors.textLight,
        },
        contactSeparator: {
            color: colors.border,
            marginHorizontal: 8,
        },
        
        // Divider
        divider: {
            height: 1,
            backgroundColor: colors.border,
            marginVertical: 24,
        },
        
        // Section
        section: {
            marginBottom: spacing.sectionGap || 28,
        },
        sectionTitle: {
            fontSize: fontSizes.sectionTitle || 10,
            fontFamily: 'Helvetica-Bold',
            color: colors.textLight,
            textTransform: 'uppercase',
            letterSpacing: 2,
            marginBottom: 16,
        },
        
        // Profile / Summary
        profileText: {
            fontSize: fontSizes.body,
            lineHeight: 1.7,
            color: colors.text,
            textAlign: 'justify',
        },
        
        // Experience
        experienceItem: {
            marginBottom: spacing.itemGap || 18,
        },
        experienceHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 2,
        },
        experienceTitle: {
            fontSize: fontSizes.body + 1,
            fontFamily: 'Helvetica-Bold',
            color: colors.text,
        },
        experienceDate: {
            fontSize: fontSizes.small,
            color: colors.textLight,
        },
        experienceCompany: {
            fontSize: fontSizes.body,
            color: colors.secondary,
            fontStyle: 'italic',
            marginBottom: 6,
        },
        experienceDescription: {
            fontSize: fontSizes.body,
            color: colors.text,
            lineHeight: 1.6,
        },
        bulletPoint: {
            flexDirection: 'row',
            marginBottom: 3,
        },
        bulletDot: {
            width: 4,
            marginRight: 8,
            marginTop: 4,
            color: colors.textLight,
        },
        bulletText: {
            flex: 1,
            fontSize: fontSizes.body,
            color: colors.text,
            lineHeight: 1.5,
        },
        
        // Education
        educationItem: {
            marginBottom: spacing.itemGap || 14,
        },
        educationHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 2,
        },
        educationDegree: {
            fontSize: fontSizes.body + 1,
            fontFamily: 'Helvetica-Bold',
            color: colors.text,
        },
        educationDate: {
            fontSize: fontSizes.small,
            color: colors.textLight,
        },
        educationSchool: {
            fontSize: fontSizes.body,
            color: colors.secondary,
            fontStyle: 'italic',
        },
        
        // Skills
        skillsGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
        },
        skillItem: {
            paddingVertical: 4,
            paddingHorizontal: 12,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 4,
            fontSize: fontSizes.small,
            color: colors.text,
        },
        
        // Languages
        languagesGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 16,
        },
        languageItem: {
            flexDirection: 'row',
            alignItems: 'baseline',
            gap: 6,
        },
        languageName: {
            fontSize: fontSizes.body,
            fontFamily: 'Helvetica-Bold',
            color: colors.text,
        },
        languageLevel: {
            fontSize: fontSizes.small,
            color: colors.textLight,
        },
        
        // Projects
        projectItem: {
            marginBottom: spacing.itemGap || 14,
        },
        projectHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'baseline',
        },
        projectName: {
            fontSize: fontSizes.body + 1,
            fontFamily: 'Helvetica-Bold',
            color: colors.text,
        },
        projectLink: {
            fontSize: fontSizes.small,
            color: colors.secondary,
        },
        projectDescription: {
            fontSize: fontSizes.body,
            color: colors.text,
            marginTop: 4,
        },
        techTags: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: 6,
            gap: 6,
        },
        techTag: {
            backgroundColor: colors.backgroundAlt,
            paddingVertical: 2,
            paddingHorizontal: 8,
            borderRadius: 3,
            fontSize: fontSizes.small,
            color: colors.text,
        },
        
        // Certifications
        certItem: {
            marginBottom: 8,
        },
        certName: {
            fontSize: fontSizes.body,
            fontFamily: 'Helvetica-Bold',
            color: colors.text,
        },
        certDetails: {
            fontSize: fontSizes.small,
            color: colors.textLight,
        },
    });

    // Helper to parse description with bullet points
    const renderDescription = (description: string | undefined) => {
        if (!description) return null;
        
        const lines = description.split('\n').filter(line => line.trim());
        const bulletLines = lines.filter(line => line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*'));
        
        if (bulletLines.length > 0) {
            return (
                <View>
                    {lines.map((line, idx) => {
                        const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*');
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

    // Contact items array for rendering
    const contactItems: string[] = [];
    if (personalInfo.email) contactItems.push(personalInfo.email);
    if (personalInfo.phone) contactItems.push(personalInfo.phone);
    if (personalInfo.address) contactItems.push(personalInfo.address);
    if (personalInfo.city) contactItems.push(personalInfo.city);
    if (personalInfo.website) contactItems.push(personalInfo.website);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* HEADER */}
                <View style={styles.header}>
                    <Text style={styles.name}>
                        {personalInfo.firstName} {personalInfo.lastName}
                    </Text>
                    <Text style={styles.jobTitle}>
                        {personalInfo.jobTitle}
                    </Text>
                    <View style={styles.contactRow}>
                        {contactItems.map((item, idx) => (
                            <React.Fragment key={idx}>
                                <Text style={styles.contactItem}>{item}</Text>
                                {idx < contactItems.length - 1 && (
                                    <Text style={styles.contactSeparator}>•</Text>
                                )}
                            </React.Fragment>
                        ))}
                    </View>
                </View>

                <View style={styles.divider} />

                {/* PROFILE */}
                {(personalInfo.summary || personalInfo.description) && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Profil</Text>
                        <Text style={styles.profileText}>
                            {personalInfo.summary || personalInfo.description}
                        </Text>
                    </View>
                )}

                {/* EXPERIENCE */}
                {shouldShowSection('experience', experience.length > 0 && !!experience[0]?.title) && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Expérience</Text>
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

                {/* EDUCATION */}
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

                {/* SKILLS */}
                {shouldShowSection('skills', skills.length > 0 && !!skills[0]?.name) && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Compétences</Text>
                        <View style={styles.skillsGrid}>
                            {skills.filter(s => s.name).map((skill) => (
                                <Text key={skill.id} style={styles.skillItem}>{skill.name}</Text>
                            ))}
                        </View>
                    </View>
                )}

                {/* LANGUAGES */}
                {shouldShowSection('languages', languages.length > 0 && !!languages[0]?.name) && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Langues</Text>
                        <View style={styles.languagesGrid}>
                            {languages.filter(l => l.name).map((lang) => (
                                <View key={lang.id} style={styles.languageItem}>
                                    <Text style={styles.languageName}>{lang.name}</Text>
                                    <Text style={styles.languageLevel}>— {getLanguageLevelText(String(lang.level))}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* PROJECTS */}
                {shouldShowSection('projects', projects && projects.length > 0 && !!projects[0]?.name) && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Projets</Text>
                        {projects.filter(p => p.name).map((project) => (
                            <View key={project.id} style={styles.projectItem}>
                                <View style={styles.projectHeader}>
                                    <Text style={styles.projectName}>{project.name}</Text>
                                    {project.url && (
                                        <Link src={project.url} style={styles.projectLink}>
                                            {project.url.replace(/^https?:\/\//, '').slice(0, 30)}{project.url.replace(/^https?:\/\//, '').length > 30 ? '...' : ''}
                                        </Link>
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

                {/* CERTIFICATIONS */}
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

export default MinimalElegancePDF;
