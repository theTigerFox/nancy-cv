// ============================================================================
// NANCY CV - Bold Modern PDF Template
// Design contemporain avec sidebar colorée à gauche
// ============================================================================

import React from 'react';
import { Page, View, Text, Document, StyleSheet, Image, Link } from '@react-pdf/renderer';
import type { CVData } from '../../types/cv';
import type { TemplateConfig } from '../../templates/types';
import { toPDFConfig, formatDateRange, getLanguageLevelText, isSectionVisible } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Component Props
// ─────────────────────────────────────────────────────────────────────────────

interface BoldModernPDFProps {
    cvData: CVData;
    config: TemplateConfig;
}

// ─────────────────────────────────────────────────────────────────────────────
// Bold Modern PDF Template
// ─────────────────────────────────────────────────────────────────────────────

export const BoldModernPDF: React.FC<BoldModernPDFProps> = ({ cvData, config }) => {
    const pdfConfig = toPDFConfig(config);
    const { colors, fontSizes, spacing, layout, lineHeight } = pdfConfig;
    
    const { personalInfo, education, experience, skills, languages, interests, projects, certifications, sectionsOrder = [] } = cvData;

    const shouldShowSection = (type: string, hasData: boolean) => {
        return isSectionVisible(type, sectionsOrder as any, hasData);
    };

    // Calculate sidebar width
    const sidebarWidthPercent = layout.sidebarWidth || 35;
    const sidebarWidth = `${sidebarWidthPercent}%`;
    const mainWidth = `${100 - sidebarWidthPercent}%`;

    const styles = StyleSheet.create({
        page: {
            flexDirection: 'row',
            backgroundColor: colors.background,
            fontFamily: 'Helvetica',
            fontSize: fontSizes.body,
            lineHeight: lineHeight,
        },
        
        // ─────────────────────────────────────────────────────────────────────
        // Sidebar
        // ─────────────────────────────────────────────────────────────────────
        sidebar: {
            width: sidebarWidth,
            backgroundColor: colors.primary,
            padding: 24,
            color: colors.white,
        },
        sidebarSection: {
            marginBottom: 20,
        },
        sidebarTitle: {
            fontSize: fontSizes.sectionTitle,
            fontFamily: 'Helvetica-Bold',
            marginBottom: 12,
            paddingBottom: 6,
            borderBottomWidth: 2,
            borderBottomColor: 'rgba(255,255,255,0.3)',
            borderBottomStyle: 'solid',
            textTransform: 'uppercase',
        },
        
        // Photo
        photoContainer: {
            alignItems: 'center',
            marginBottom: 20,
        },
        photo: {
            width: layout.photoSize || 100,
            height: layout.photoSize || 100,
            borderRadius: layout.photoShape === 'circle' ? 999 : (layout.photoShape === 'rounded' ? 12 : 0),
            objectFit: 'cover',
            borderWidth: 3,
            borderColor: 'rgba(255,255,255,0.4)',
            borderStyle: 'solid',
        },
        
        // Name in sidebar
        nameContainer: {
            textAlign: 'center',
            marginBottom: 24,
        },
        firstName: {
            fontSize: 18,
            fontFamily: 'Helvetica-Bold',
        },
        lastName: {
            fontSize: 18,
            fontFamily: 'Helvetica-Bold',
        },
        jobTitle: {
            fontSize: fontSizes.body,
            opacity: 0.9,
            marginTop: 6,
        },
        
        // Contact items
        contactItem: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
            fontSize: fontSizes.small,
        },
        contactIcon: {
            width: 12,
            marginRight: 8,
            opacity: 0.8,
        },
        contactText: {
            flex: 1,
        },
        
        // Skills
        skillItem: {
            marginBottom: 10,
        },
        skillName: {
            fontSize: fontSizes.small,
            marginBottom: 4,
        },
        skillBar: {
            height: 4,
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: 2,
        },
        skillBarFill: {
            height: '100%',
            backgroundColor: colors.white,
            borderRadius: 2,
        },
        
        // Languages
        languageItem: {
            marginBottom: 8,
        },
        languageName: {
            fontSize: fontSizes.small,
            fontFamily: 'Helvetica-Bold',
        },
        languageLevel: {
            fontSize: fontSizes.small,
            opacity: 0.8,
        },
        
        // ─────────────────────────────────────────────────────────────────────
        // Main Content
        // ─────────────────────────────────────────────────────────────────────
        main: {
            width: mainWidth,
            padding: 28,
            backgroundColor: colors.background,
        },
        section: {
            marginBottom: spacing.sectionGap,
        },
        sectionHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 14,
        },
        sectionTitleBadge: {
            backgroundColor: colors.primary + '1A', // 10% opacity
            paddingVertical: 6,
            paddingHorizontal: 14,
            borderRadius: 6,
        },
        sectionTitleText: {
            fontSize: fontSizes.sectionTitle,
            fontFamily: 'Helvetica-Bold',
            color: colors.primary,
            textTransform: 'uppercase',
        },
        
        // Profile/Description
        profileText: {
            fontSize: fontSizes.body,
            color: colors.text,
            lineHeight: lineHeight,
        },
        
        // Experience
        experienceList: {
            paddingLeft: 14,
            borderLeftWidth: 3,
            borderLeftColor: colors.primary,
            borderLeftStyle: 'solid',
        },
        experienceItem: {
            marginBottom: spacing.itemGap,
        },
        experienceHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 3,
        },
        experienceTitle: {
            fontSize: fontSizes.body + 1,
            fontFamily: 'Helvetica-Bold',
            color: colors.text,
            flex: 1,
        },
        experienceDate: {
            fontSize: fontSizes.small,
            color: colors.primary,
            fontFamily: 'Helvetica-Bold',
        },
        experienceCompany: {
            fontSize: fontSizes.body,
            color: colors.secondary,
            fontFamily: 'Helvetica-Bold',
            marginBottom: 4,
        },
        experienceDescription: {
            fontSize: fontSizes.body,
            color: colors.textLight,
            lineHeight: lineHeight,
        },
        bulletPoint: {
            flexDirection: 'row',
            marginBottom: 2,
        },
        bulletDot: {
            width: 4,
            marginRight: 6,
            marginTop: 5,
        },
        bulletText: {
            flex: 1,
            fontSize: fontSizes.body,
            color: colors.textLight,
        },
        
        // Education
        educationItem: {
            backgroundColor: colors.backgroundAlt,
            padding: 14,
            borderRadius: 6,
            marginBottom: spacing.itemGap,
        },
        educationHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 2,
        },
        educationDegree: {
            fontSize: fontSizes.body,
            fontFamily: 'Helvetica-Bold',
            color: colors.text,
            flex: 1,
        },
        educationDate: {
            fontSize: fontSizes.small,
            color: colors.primary,
            fontFamily: 'Helvetica-Bold',
        },
        educationSchool: {
            fontSize: fontSizes.body,
            color: colors.secondary,
        },
        
        // Projects
        projectItem: {
            marginBottom: spacing.itemGap,
        },
        projectHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
        },
        projectName: {
            fontSize: fontSizes.body,
            fontFamily: 'Helvetica-Bold',
            color: colors.text,
        },
        projectLink: {
            fontSize: fontSizes.small,
            color: colors.primary,
        },
        projectDescription: {
            fontSize: fontSizes.body,
            color: colors.textLight,
            marginTop: 2,
        },
        techTags: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: 6,
            gap: 4,
        },
        techTag: {
            backgroundColor: colors.backgroundAlt,
            paddingVertical: 2,
            paddingHorizontal: 8,
            borderRadius: 4,
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
        certIssuer: {
            fontSize: fontSizes.small,
            color: colors.textLight,
        },
        
        // Interests
        interestsList: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 6,
        },
        interestItem: {
            backgroundColor: colors.backgroundAlt,
            paddingVertical: 4,
            paddingHorizontal: 10,
            borderRadius: 12,
            fontSize: fontSizes.small,
            color: colors.text,
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

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* ─────────────────────────────────────────────────────────────── */}
                {/* SIDEBAR */}
                {/* ─────────────────────────────────────────────────────────────── */}
                <View style={styles.sidebar}>
                    {/* Photo */}
                    {layout.showPhoto && personalInfo.photo && (
                        <View style={styles.photoContainer}>
                            <Image src={personalInfo.photo} style={styles.photo} />
                        </View>
                    )}
                    
                    {/* Name */}
                    <View style={styles.nameContainer}>
                        <Text style={styles.firstName}>{personalInfo.firstName}</Text>
                        <Text style={styles.lastName}>{personalInfo.lastName}</Text>
                        <Text style={styles.jobTitle}>{personalInfo.jobTitle}</Text>
                    </View>
                    
                    {/* Contact */}
                    <View style={styles.sidebarSection}>
                        <Text style={styles.sidebarTitle}>Contact</Text>
                        
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
                                <Text style={styles.contactIcon}>⚯</Text>
                                <Text style={styles.contactText}>{personalInfo.website}</Text>
                            </View>
                        )}
                    </View>
                    
                    {/* Skills */}
                    {shouldShowSection('skills', skills.length > 0 && !!skills[0]?.name) && (
                        <View style={styles.sidebarSection}>
                            <Text style={styles.sidebarTitle}>Compétences</Text>
                            {skills.filter(s => s.name).map((skill) => (
                                <View key={skill.id} style={styles.skillItem}>
                                    <Text style={styles.skillName}>{skill.name}</Text>
                                    <View style={styles.skillBar}>
                                        <View style={[styles.skillBarFill, { width: `${(skill.level || 5) * 10}%` }]} />
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                    
                    {/* Languages */}
                    {shouldShowSection('languages', languages.length > 0 && !!languages[0]?.name) && (
                        <View style={styles.sidebarSection}>
                            <Text style={styles.sidebarTitle}>Langues</Text>
                            {languages.filter(l => l.name).map((lang) => (
                                <View key={lang.id} style={styles.languageItem}>
                                    <Text style={styles.languageName}>{lang.name}</Text>
                                    <Text style={styles.languageLevel}>{getLanguageLevelText(String(lang.level))}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                {/* ─────────────────────────────────────────────────────────────── */}
                {/* MAIN CONTENT */}
                {/* ─────────────────────────────────────────────────────────────── */}
                <View style={styles.main}>
                    {/* Profile / Description */}
                    {(personalInfo.summary || personalInfo.description) && (
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <View style={styles.sectionTitleBadge}>
                                    <Text style={styles.sectionTitleText}>Profil</Text>
                                </View>
                            </View>
                            <Text style={styles.profileText}>
                                {personalInfo.summary || personalInfo.description}
                            </Text>
                        </View>
                    )}
                    
                    {/* Experience */}
                    {shouldShowSection('experience', experience.length > 0 && !!experience[0]?.title) && (
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <View style={styles.sectionTitleBadge}>
                                    <Text style={styles.sectionTitleText}>Expérience</Text>
                                </View>
                            </View>
                            <View style={styles.experienceList}>
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
                        </View>
                    )}
                    
                    {/* Education */}
                    {shouldShowSection('education', education.length > 0 && !!education[0]?.degree) && (
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <View style={styles.sectionTitleBadge}>
                                    <Text style={styles.sectionTitleText}>Formation</Text>
                                </View>
                            </View>
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
                            <View style={styles.sectionHeader}>
                                <View style={styles.sectionTitleBadge}>
                                    <Text style={styles.sectionTitleText}>Projets</Text>
                                </View>
                            </View>
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
                    
                    {/* Certifications */}
                    {shouldShowSection('certifications', certifications && certifications.length > 0 && !!certifications[0]?.name) && (
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <View style={styles.sectionTitleBadge}>
                                    <Text style={styles.sectionTitleText}>Certifications</Text>
                                </View>
                            </View>
                            {certifications.filter(c => c.name).map((cert) => (
                                <View key={cert.id} style={styles.certItem}>
                                    <Text style={styles.certName}>{cert.name}</Text>
                                    <Text style={styles.certIssuer}>{cert.issuer}{cert.date ? ` - ${cert.date}` : ''}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                    
                    {/* Interests */}
                    {shouldShowSection('interests', interests && interests.length > 0 && !!interests[0]?.name) && (
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <View style={styles.sectionTitleBadge}>
                                    <Text style={styles.sectionTitleText}>Centres d'intérêt</Text>
                                </View>
                            </View>
                            <View style={styles.interestsList}>
                                {interests.filter(i => i.name).map((interest) => (
                                    <Text key={interest.id} style={styles.interestItem}>{interest.name}</Text>
                                ))}
                            </View>
                        </View>
                    )}
                </View>
            </Page>
        </Document>
    );
};

export default BoldModernPDF;
