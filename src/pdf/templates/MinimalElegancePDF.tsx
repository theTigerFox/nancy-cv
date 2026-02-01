// ============================================================================
// NANCY CV - Minimal Elegance PDF Template
// Template épuré et sophistiqué avec beaucoup d'espace blanc
// ============================================================================

import React from 'react';
import { Page, View, Text, Document, StyleSheet, Link, Image } from '@react-pdf/renderer';
import { COLORS, FONT_SIZES, SPACING, PAGE, formatDate, getLanguageLevelText, getSkillLevelPercentage } from '../styles';
import type { CVData, SectionConfig } from '../../types/cv';

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: FONT_SIZES.base,
        lineHeight: 1.5,
        color: COLORS.gray[700],
        backgroundColor: COLORS.white,
        padding: PAGE.margin.large,
    },
    
    // Header
    header: {
        textAlign: 'center',
        marginBottom: SPACING[8],
    },
    name: {
        fontSize: FONT_SIZES['4xl'],
        fontWeight: 400,
        color: COLORS.gray[900],
        letterSpacing: 2,
        marginBottom: SPACING[2],
    },
    jobTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: 300,
        color: COLORS.gray[500],
        textTransform: 'uppercase',
        letterSpacing: 3,
        marginBottom: SPACING[4],
    },
    contactRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: SPACING[4],
    },
    contactItem: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.gray[500],
    },
    contactSeparator: {
        color: COLORS.gray[300],
        marginHorizontal: SPACING[2],
    },
    
    // Divider
    divider: {
        height: 1,
        backgroundColor: COLORS.gray[200],
        marginVertical: SPACING[6],
    },
    
    // Section
    section: {
        marginBottom: SPACING[6],
    },
    sectionTitle: {
        fontSize: FONT_SIZES.md,
        fontWeight: 500,
        color: COLORS.gray[400],
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: SPACING[4],
    },
    
    // Summary
    summary: {
        fontSize: FONT_SIZES.base,
        lineHeight: 1.7,
        color: COLORS.gray[600],
        textAlign: 'justify',
    },
    
    // Experience
    experienceItem: {
        marginBottom: SPACING[5],
    },
    experienceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING[1],
    },
    experienceTitle: {
        fontSize: FONT_SIZES.md,
        fontWeight: 500,
        color: COLORS.gray[800],
    },
    experienceCompany: {
        fontSize: FONT_SIZES.base,
        color: COLORS.gray[500],
        fontStyle: 'italic',
        marginBottom: SPACING[2],
    },
    experienceDate: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.gray[400],
        textAlign: 'right',
        flexShrink: 0,
    },
    experienceDescription: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.gray[600],
        lineHeight: 1.6,
    },
    highlight: {
        flexDirection: 'row',
        marginBottom: SPACING[1],
        paddingLeft: SPACING[2],
    },
    bullet: {
        width: 8,
        fontSize: FONT_SIZES.sm,
        color: COLORS.gray[400],
    },
    highlightText: {
        flex: 1,
        fontSize: FONT_SIZES.sm,
        color: COLORS.gray[600],
        lineHeight: 1.5,
    },
    
    // Education
    educationItem: {
        marginBottom: SPACING[4],
    },
    educationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    degree: {
        fontSize: FONT_SIZES.md,
        fontWeight: 500,
        color: COLORS.gray[800],
    },
    school: {
        fontSize: FONT_SIZES.base,
        color: COLORS.gray[500],
        fontStyle: 'italic',
    },
    
    // Two column footer
    footer: {
        flexDirection: 'row',
        gap: SPACING[10],
    },
    footerColumn: {
        flex: 1,
    },
    
    // Skills
    skillItem: {
        marginBottom: SPACING[3],
    },
    skillName: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.gray[700],
        marginBottom: SPACING[1],
    },
    skillBar: {
        height: 3,
        backgroundColor: COLORS.gray[200],
        borderRadius: 1,
    },
    skillBarFill: {
        height: 3,
        backgroundColor: COLORS.gray[600],
        borderRadius: 1,
    },
    
    // Languages
    languageItem: {
        marginBottom: SPACING[2],
    },
    languageName: {
        fontSize: FONT_SIZES.sm,
        fontWeight: 500,
        color: COLORS.gray[700],
    },
    languageLevel: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.gray[500],
    },
    
    // Projects
    projectItem: {
        marginBottom: SPACING[4],
    },
    projectName: {
        fontSize: FONT_SIZES.base,
        fontWeight: 500,
        color: COLORS.gray[800],
    },
    projectDescription: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.gray[600],
        lineHeight: 1.5,
        marginTop: SPACING[1],
    },
    
    // Tags
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: SPACING[2],
    },
    tag: {
        backgroundColor: COLORS.gray[100],
        paddingHorizontal: SPACING[2],
        paddingVertical: 2,
        marginRight: SPACING[1],
        marginBottom: SPACING[1],
        borderRadius: 2,
    },
    tagText: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.gray[600],
    },
    
    // Certifications
    certItem: {
        marginBottom: SPACING[2],
    },
    certName: {
        fontSize: FONT_SIZES.sm,
        fontWeight: 500,
        color: COLORS.gray[700],
    },
    certIssuer: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.gray[500],
    },
    
    // Interests
    interestsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    interestTag: {
        backgroundColor: COLORS.gray[100],
        paddingHorizontal: SPACING[3],
        paddingVertical: SPACING[1],
        marginRight: SPACING[2],
        marginBottom: SPACING[2],
        borderRadius: 2,
    },
    interestText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.gray[600],
    },
});

// ─────────────────────────────────────────────────────────────────────────────
// Helper to check section visibility
// ─────────────────────────────────────────────────────────────────────────────

const isSectionVisible = (
    type: string, 
    sectionsOrder: SectionConfig[] | undefined, 
    hasData: boolean
): boolean => {
    if (!hasData) return false;
    if (!sectionsOrder || sectionsOrder.length === 0) return true;
    
    const section = sectionsOrder.find(s => s.type === type);
    return section?.visible ?? true;
};

// ─────────────────────────────────────────────────────────────────────────────
// Template Component
// ─────────────────────────────────────────────────────────────────────────────

interface MinimalElegancePDFProps {
    cvData: CVData;
}

export const MinimalElegancePDF: React.FC<MinimalElegancePDFProps> = ({ cvData }) => {
    const {
        personalInfo,
        experience,
        education,
        skills,
        languages,
        projects,
        certifications,
        interests,
        sectionsOrder,
    } = cvData;

    const shouldShow = (type: string, hasData: boolean) => 
        isSectionVisible(type, sectionsOrder, hasData);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.name}>
                        {personalInfo.firstName} {personalInfo.lastName}
                    </Text>
                    <Text style={styles.jobTitle}>{personalInfo.jobTitle}</Text>
                    
                    {/* Contact Info */}
                    <View style={styles.contactRow}>
                        {personalInfo.email && (
                            <Text style={styles.contactItem}>{personalInfo.email}</Text>
                        )}
                        {personalInfo.phone && (
                            <Text style={styles.contactItem}>{personalInfo.phone}</Text>
                        )}
                        {(personalInfo.city || personalInfo.address) && (
                            <Text style={styles.contactItem}>
                                {personalInfo.address || personalInfo.city}
                            </Text>
                        )}
                    </View>
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Summary */}
                {shouldShow('summary', !!(personalInfo.summary || personalInfo.description)) && (
                    <>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Profil</Text>
                            <Text style={styles.summary}>
                                {personalInfo.summary || personalInfo.description}
                            </Text>
                        </View>
                        <View style={styles.divider} />
                    </>
                )}

                {/* Experience */}
                {shouldShow('experience', experience.length > 0 && !!experience[0]?.title) && (
                    <>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Expérience</Text>
                            {experience
                                .filter(exp => exp.visible !== false)
                                .map((exp) => (
                                    <View key={exp.id} style={styles.experienceItem}>
                                        <View style={styles.experienceHeader}>
                                            <View style={{ flex: 1, marginRight: SPACING[4] }}>
                                                <Text style={styles.experienceTitle}>{exp.title}</Text>
                                                <Text style={styles.experienceCompany}>{exp.company}</Text>
                                            </View>
                                            <Text style={styles.experienceDate}>
                                                {formatDate(exp.startDate)} — {exp.current ? 'Présent' : formatDate(exp.endDate)}
                                            </Text>
                                        </View>
                                        
                                        {exp.description && (
                                            <Text style={styles.experienceDescription}>{exp.description}</Text>
                                        )}
                                        
                                        {exp.highlights && exp.highlights.length > 0 && (
                                            <View style={{ marginTop: SPACING[2] }}>
                                                {exp.highlights.map((h, i) => (
                                                    <View key={i} style={styles.highlight}>
                                                        <Text style={styles.bullet}>•</Text>
                                                        <Text style={styles.highlightText}>{h}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        )}
                                    </View>
                                ))}
                        </View>
                        <View style={styles.divider} />
                    </>
                )}

                {/* Education */}
                {shouldShow('education', education.length > 0 && !!education[0]?.degree) && (
                    <>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Formation</Text>
                            {education
                                .filter(edu => edu.visible !== false)
                                .map((edu) => (
                                    <View key={edu.id} style={styles.educationItem}>
                                        <View style={styles.educationHeader}>
                                            <View style={{ flex: 1, marginRight: SPACING[4] }}>
                                                <Text style={styles.degree}>
                                                    {edu.degree}{edu.field ? ` - ${edu.field}` : ''}
                                                </Text>
                                                <Text style={styles.school}>{edu.school}</Text>
                                            </View>
                                            <Text style={styles.experienceDate}>
                                                {formatDate(edu.startDate)} — {edu.current ? 'Présent' : formatDate(edu.endDate)}
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                        </View>
                        <View style={styles.divider} />
                    </>
                )}

                {/* Two Column Footer: Skills + Languages */}
                <View style={styles.footer}>
                    {/* Skills */}
                    {shouldShow('skills', skills.length > 0 && !!skills[0]?.name) && (
                        <View style={styles.footerColumn}>
                            <Text style={styles.sectionTitle}>Compétences</Text>
                            {skills
                                .filter(s => s.visible !== false)
                                .map((skill) => (
                                    <View key={skill.id} style={styles.skillItem}>
                                        <Text style={styles.skillName}>{skill.name}</Text>
                                        <View style={styles.skillBar}>
                                            <View 
                                                style={[
                                                    styles.skillBarFill, 
                                                    { width: `${getSkillLevelPercentage(skill.level)}%` }
                                                ]} 
                                            />
                                        </View>
                                    </View>
                                ))}
                        </View>
                    )}

                    {/* Languages */}
                    {shouldShow('languages', languages.length > 0 && !!languages[0]?.name) && (
                        <View style={styles.footerColumn}>
                            <Text style={styles.sectionTitle}>Langues</Text>
                            {languages
                                .filter(l => l.visible !== false)
                                .map((lang) => (
                                    <View key={lang.id} style={styles.languageItem}>
                                        <Text style={styles.languageName}>
                                            {lang.name}
                                            <Text style={styles.languageLevel}>
                                                {' '}— {getLanguageLevelText(lang.level)}
                                            </Text>
                                        </Text>
                                    </View>
                                ))}
                        </View>
                    )}
                </View>

                {/* Projects */}
                {shouldShow('projects', (projects?.length || 0) > 0 && !!projects?.[0]?.name) && (
                    <>
                        <View style={styles.divider} />
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Projets</Text>
                            {(projects || [])
                                .filter(p => p.visible !== false)
                                .map((project) => (
                                    <View key={project.id} style={styles.projectItem}>
                                        <Text style={styles.projectName}>{project.name}</Text>
                                        {project.description && (
                                            <Text style={styles.projectDescription}>{project.description}</Text>
                                        )}
                                        {project.technologies && project.technologies.length > 0 && (
                                            <View style={styles.tagsContainer}>
                                                {project.technologies.map((tech, i) => (
                                                    <View key={i} style={styles.tag}>
                                                        <Text style={styles.tagText}>{tech}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        )}
                                    </View>
                                ))}
                        </View>
                    </>
                )}

                {/* Certifications */}
                {shouldShow('certifications', (certifications?.length || 0) > 0 && !!certifications?.[0]?.name) && (
                    <>
                        <View style={styles.divider} />
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Certifications</Text>
                            {(certifications || [])
                                .filter(c => c.visible !== false)
                                .map((cert) => (
                                    <View key={cert.id} style={styles.certItem}>
                                        <Text style={styles.certName}>{cert.name}</Text>
                                        <Text style={styles.certIssuer}>
                                            {cert.issuer}{cert.date ? ` • ${formatDate(cert.date)}` : ''}
                                        </Text>
                                    </View>
                                ))}
                        </View>
                    </>
                )}

                {/* Interests */}
                {shouldShow('interests', (interests?.length || 0) > 0 && !!interests?.[0]?.name) && (
                    <>
                        <View style={styles.divider} />
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Centres d'intérêt</Text>
                            <View style={styles.interestsContainer}>
                                {(interests || [])
                                    .filter(i => i.visible !== false)
                                    .map((interest) => (
                                        <View key={interest.id} style={styles.interestTag}>
                                            <Text style={styles.interestText}>{interest.name}</Text>
                                        </View>
                                    ))}
                            </View>
                        </View>
                    </>
                )}
            </Page>
        </Document>
    );
};

export default MinimalElegancePDF;
