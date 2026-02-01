// ============================================================================
// NANCY CV - PDF Base Components
// ============================================================================

import React from 'react';
import { View, Text, Link, StyleSheet } from '@react-pdf/renderer';
import { COLORS, FONT_SIZES, SPACING, formatDate, getLanguageLevelText, getSkillLevelPercentage } from './styles';
import type { Experience, Education, Skill, Language, Project, Certification, Interest } from '../types/cv';

// ─────────────────────────────────────────────────────────────────────────────
// Section Header
// ─────────────────────────────────────────────────────────────────────────────

interface SectionHeaderProps {
    title: string;
    style?: 'default' | 'elegant' | 'modern' | 'bold';
    color?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ 
    title, 
    style = 'default',
    color = COLORS.gray[800]
}) => {
    const styles = StyleSheet.create({
        default: {
            fontSize: FONT_SIZES.lg,
            fontWeight: 600,
            color,
            textTransform: 'uppercase',
            letterSpacing: 1.5,
            marginBottom: SPACING[4],
            paddingBottom: SPACING[2],
            borderBottomWidth: 1,
            borderBottomColor: COLORS.gray[200],
        },
        elegant: {
            fontSize: FONT_SIZES.md,
            fontWeight: 500,
            color: COLORS.gray[500],
            textTransform: 'uppercase',
            letterSpacing: 2,
            marginBottom: SPACING[4],
        },
        modern: {
            fontSize: FONT_SIZES.xl,
            fontWeight: 700,
            color,
            marginBottom: SPACING[4],
        },
        bold: {
            fontSize: FONT_SIZES.lg,
            fontWeight: 700,
            color: COLORS.white,
            backgroundColor: color,
            padding: SPACING[2],
            marginBottom: SPACING[4],
            textTransform: 'uppercase',
        },
    });

    return <Text style={styles[style]}>{title}</Text>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Divider
// ─────────────────────────────────────────────────────────────────────────────

interface DividerProps {
    color?: string;
    thickness?: number;
    marginVertical?: number;
}

export const Divider: React.FC<DividerProps> = ({ 
    color = COLORS.gray[200], 
    thickness = 1,
    marginVertical = SPACING[6]
}) => (
    <View style={{ 
        height: thickness, 
        backgroundColor: color, 
        marginVertical,
        width: '100%',
    }} />
);

// ─────────────────────────────────────────────────────────────────────────────
// Contact Info
// ─────────────────────────────────────────────────────────────────────────────

interface ContactInfoProps {
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    website?: string;
    layout?: 'inline' | 'stacked';
    color?: string;
    separator?: string;
}

export const ContactInfo: React.FC<ContactInfoProps> = ({
    email,
    phone,
    address,
    city,
    website,
    layout = 'inline',
    color = COLORS.gray[600],
    separator = ' | ',
}) => {
    const items = [email, phone, address || city, website].filter(Boolean);
    
    if (layout === 'inline') {
        return (
            <Text style={{ fontSize: FONT_SIZES.sm, color }}>
                {items.join(separator)}
            </Text>
        );
    }
    
    return (
        <View>
            {email && <Text style={{ fontSize: FONT_SIZES.sm, color, marginBottom: SPACING[1] }}>{email}</Text>}
            {phone && <Text style={{ fontSize: FONT_SIZES.sm, color, marginBottom: SPACING[1] }}>{phone}</Text>}
            {(address || city) && <Text style={{ fontSize: FONT_SIZES.sm, color, marginBottom: SPACING[1] }}>{address || city}</Text>}
            {website && (
                <Link src={website} style={{ fontSize: FONT_SIZES.sm, color, textDecoration: 'none' }}>
                    {website.replace(/^https?:\/\//, '')}
                </Link>
            )}
        </View>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Experience Item
// ─────────────────────────────────────────────────────────────────────────────

interface ExperienceItemProps {
    experience: Experience;
    showDescription?: boolean;
    showHighlights?: boolean;
    showTechnologies?: boolean;
    dateFormat?: 'short' | 'full';
}

export const ExperienceItem: React.FC<ExperienceItemProps> = ({
    experience,
    showDescription = true,
    showHighlights = true,
    showTechnologies = false,
    dateFormat = 'short',
}) => {
    const styles = StyleSheet.create({
        container: {
            marginBottom: SPACING[6],
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: SPACING[2],
        },
        title: {
            fontSize: FONT_SIZES.md,
            fontWeight: 600,
            color: COLORS.gray[800],
        },
        company: {
            fontSize: FONT_SIZES.base,
            color: COLORS.gray[600],
            fontStyle: 'italic',
        },
        date: {
            fontSize: FONT_SIZES.sm,
            color: COLORS.gray[500],
            textAlign: 'right',
        },
        description: {
            fontSize: FONT_SIZES.base,
            color: COLORS.gray[600],
            lineHeight: 1.6,
            marginTop: SPACING[2],
        },
        highlight: {
            flexDirection: 'row',
            marginBottom: SPACING[1],
        },
        bullet: {
            width: 10,
            fontSize: FONT_SIZES.sm,
            color: COLORS.gray[400],
        },
        highlightText: {
            flex: 1,
            fontSize: FONT_SIZES.sm,
            color: COLORS.gray[600],
            lineHeight: 1.5,
        },
        technologies: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: SPACING[3],
        },
        tag: {
            backgroundColor: COLORS.gray[100],
            paddingHorizontal: SPACING[2],
            paddingVertical: SPACING[1],
            borderRadius: 2,
            marginRight: SPACING[2],
            marginBottom: SPACING[1],
        },
        tagText: {
            fontSize: FONT_SIZES.xs,
            color: COLORS.gray[600],
        },
    });

    const dateStr = `${formatDate(experience.startDate)} - ${experience.current ? 'Présent' : formatDate(experience.endDate)}`;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={{ flex: 1, marginRight: SPACING[4] }}>
                    <Text style={styles.title}>{experience.title}</Text>
                    <Text style={styles.company}>{experience.company}{experience.location ? ` • ${experience.location}` : ''}</Text>
                </View>
                <Text style={styles.date}>{dateStr}</Text>
            </View>
            
            {showDescription && experience.description && (
                <Text style={styles.description}>{experience.description}</Text>
            )}
            
            {showHighlights && experience.highlights && experience.highlights.length > 0 && (
                <View style={{ marginTop: SPACING[2] }}>
                    {experience.highlights.map((highlight, index) => (
                        <View key={index} style={styles.highlight}>
                            <Text style={styles.bullet}>•</Text>
                            <Text style={styles.highlightText}>{highlight}</Text>
                        </View>
                    ))}
                </View>
            )}
            
            {showTechnologies && experience.technologies && experience.technologies.length > 0 && (
                <View style={styles.technologies}>
                    {experience.technologies.map((tech, index) => (
                        <View key={index} style={styles.tag}>
                            <Text style={styles.tagText}>{tech}</Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Education Item
// ─────────────────────────────────────────────────────────────────────────────

interface EducationItemProps {
    education: Education;
    showDescription?: boolean;
}

export const EducationItem: React.FC<EducationItemProps> = ({
    education,
    showDescription = false,
}) => {
    const styles = StyleSheet.create({
        container: {
            marginBottom: SPACING[4],
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
        },
        degree: {
            fontSize: FONT_SIZES.md,
            fontWeight: 600,
            color: COLORS.gray[800],
        },
        school: {
            fontSize: FONT_SIZES.base,
            color: COLORS.gray[600],
            fontStyle: 'italic',
        },
        date: {
            fontSize: FONT_SIZES.sm,
            color: COLORS.gray[500],
            textAlign: 'right',
        },
        grade: {
            fontSize: FONT_SIZES.sm,
            color: COLORS.gray[600],
            marginTop: SPACING[1],
        },
    });

    const dateStr = `${formatDate(education.startDate)} - ${education.current ? 'Présent' : formatDate(education.endDate)}`;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={{ flex: 1, marginRight: SPACING[4] }}>
                    <Text style={styles.degree}>
                        {education.degree}{education.field ? ` - ${education.field}` : ''}
                    </Text>
                    <Text style={styles.school}>{education.school}</Text>
                    {education.grade && <Text style={styles.grade}>Mention : {education.grade}</Text>}
                </View>
                <Text style={styles.date}>{dateStr}</Text>
            </View>
        </View>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Skills Display
// ─────────────────────────────────────────────────────────────────────────────

interface SkillsDisplayProps {
    skills: Skill[];
    layout?: 'bars' | 'dots' | 'tags' | 'list';
    columns?: number;
    showLevel?: boolean;
    accentColor?: string;
}

export const SkillsDisplay: React.FC<SkillsDisplayProps> = ({
    skills,
    layout = 'bars',
    columns = 2,
    showLevel = true,
    accentColor = COLORS.gray[700],
}) => {
    const visibleSkills = skills.filter(s => s.visible !== false);
    
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
        skillItem: {
            width: `${100 / columns}%`,
            paddingRight: SPACING[4],
            marginBottom: SPACING[3],
        },
        skillName: {
            fontSize: FONT_SIZES.sm,
            color: COLORS.gray[700],
            marginBottom: SPACING[1],
        },
        barContainer: {
            height: 4,
            backgroundColor: COLORS.gray[200],
            borderRadius: 2,
        },
        barFill: {
            height: 4,
            backgroundColor: accentColor,
            borderRadius: 2,
        },
        dotsContainer: {
            flexDirection: 'row',
            gap: 2,
        },
        dot: {
            width: 6,
            height: 6,
            borderRadius: 3,
            marginRight: 2,
        },
        tag: {
            backgroundColor: COLORS.gray[100],
            paddingHorizontal: SPACING[3],
            paddingVertical: SPACING[2],
            borderRadius: 2,
            marginRight: SPACING[2],
            marginBottom: SPACING[2],
        },
        tagText: {
            fontSize: FONT_SIZES.sm,
            color: COLORS.gray[700],
        },
    });

    if (layout === 'tags') {
        return (
            <View style={[styles.container, { flexDirection: 'row', flexWrap: 'wrap' }]}>
                {visibleSkills.map((skill) => (
                    <View key={skill.id} style={styles.tag}>
                        <Text style={styles.tagText}>{skill.name}</Text>
                    </View>
                ))}
            </View>
        );
    }

    if (layout === 'list') {
        return (
            <View>
                {visibleSkills.map((skill) => (
                    <Text key={skill.id} style={[styles.skillName, { marginBottom: SPACING[2] }]}>
                        • {skill.name}
                    </Text>
                ))}
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {visibleSkills.map((skill) => (
                <View key={skill.id} style={styles.skillItem}>
                    <Text style={styles.skillName}>{skill.name}</Text>
                    {showLevel && layout === 'bars' && (
                        <View style={styles.barContainer}>
                            <View style={[styles.barFill, { width: `${getSkillLevelPercentage(skill.level)}%` }]} />
                        </View>
                    )}
                    {showLevel && layout === 'dots' && (
                        <View style={styles.dotsContainer}>
                            {[1, 2, 3, 4, 5].map((level) => (
                                <View
                                    key={level}
                                    style={[
                                        styles.dot,
                                        { backgroundColor: level <= Math.ceil(skill.level / 2) ? accentColor : COLORS.gray[200] }
                                    ]}
                                />
                            ))}
                        </View>
                    )}
                </View>
            ))}
        </View>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Languages Display
// ─────────────────────────────────────────────────────────────────────────────

interface LanguagesDisplayProps {
    languages: Language[];
    showLevel?: boolean;
    layout?: 'inline' | 'list';
}

export const LanguagesDisplay: React.FC<LanguagesDisplayProps> = ({
    languages,
    showLevel = true,
    layout = 'list',
}) => {
    const visibleLanguages = languages.filter(l => l.visible !== false);
    
    const styles = StyleSheet.create({
        item: {
            marginBottom: SPACING[2],
        },
        name: {
            fontSize: FONT_SIZES.base,
            fontWeight: 500,
            color: COLORS.gray[700],
        },
        level: {
            fontSize: FONT_SIZES.sm,
            color: COLORS.gray[500],
        },
        inline: {
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
        inlineItem: {
            marginRight: SPACING[6],
        },
    });

    if (layout === 'inline') {
        return (
            <View style={styles.inline}>
                {visibleLanguages.map((lang) => (
                    <View key={lang.id} style={styles.inlineItem}>
                        <Text style={styles.name}>
                            {lang.name}
                            {showLevel && <Text style={styles.level}> ({getLanguageLevelText(lang.level)})</Text>}
                        </Text>
                    </View>
                ))}
            </View>
        );
    }

    return (
        <View>
            {visibleLanguages.map((lang) => (
                <View key={lang.id} style={styles.item}>
                    <Text style={styles.name}>
                        {lang.name}
                        {showLevel && <Text style={styles.level}> - {getLanguageLevelText(lang.level)}</Text>}
                    </Text>
                    {lang.certification && (
                        <Text style={[styles.level, { marginTop: 1 }]}>
                            {lang.certification}{lang.certificationScore ? ` (${lang.certificationScore})` : ''}
                        </Text>
                    )}
                </View>
            ))}
        </View>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Projects Display
// ─────────────────────────────────────────────────────────────────────────────

interface ProjectsDisplayProps {
    projects: Project[];
    showTechnologies?: boolean;
}

export const ProjectsDisplay: React.FC<ProjectsDisplayProps> = ({
    projects,
    showTechnologies = true,
}) => {
    const visibleProjects = projects.filter(p => p.visible !== false);
    
    const styles = StyleSheet.create({
        item: {
            marginBottom: SPACING[4],
        },
        name: {
            fontSize: FONT_SIZES.md,
            fontWeight: 600,
            color: COLORS.gray[800],
        },
        description: {
            fontSize: FONT_SIZES.sm,
            color: COLORS.gray[600],
            lineHeight: 1.5,
            marginTop: SPACING[1],
        },
        technologies: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: SPACING[2],
        },
        tag: {
            backgroundColor: COLORS.gray[100],
            paddingHorizontal: SPACING[2],
            paddingVertical: 2,
            borderRadius: 2,
            marginRight: SPACING[1],
            marginBottom: SPACING[1],
        },
        tagText: {
            fontSize: FONT_SIZES.xs,
            color: COLORS.gray[600],
        },
    });

    return (
        <View>
            {visibleProjects.map((project) => (
                <View key={project.id} style={styles.item}>
                    <Text style={styles.name}>{project.name}</Text>
                    {project.description && (
                        <Text style={styles.description}>{project.description}</Text>
                    )}
                    {showTechnologies && project.technologies && project.technologies.length > 0 && (
                        <View style={styles.technologies}>
                            {project.technologies.map((tech, index) => (
                                <View key={index} style={styles.tag}>
                                    <Text style={styles.tagText}>{tech}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            ))}
        </View>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Certifications Display
// ─────────────────────────────────────────────────────────────────────────────

interface CertificationsDisplayProps {
    certifications: Certification[];
}

export const CertificationsDisplay: React.FC<CertificationsDisplayProps> = ({
    certifications,
}) => {
    const visibleCerts = certifications.filter(c => c.visible !== false);
    
    const styles = StyleSheet.create({
        item: {
            marginBottom: SPACING[3],
        },
        name: {
            fontSize: FONT_SIZES.base,
            fontWeight: 500,
            color: COLORS.gray[700],
        },
        issuer: {
            fontSize: FONT_SIZES.sm,
            color: COLORS.gray[500],
        },
    });

    return (
        <View>
            {visibleCerts.map((cert) => (
                <View key={cert.id} style={styles.item}>
                    <Text style={styles.name}>{cert.name}</Text>
                    <Text style={styles.issuer}>
                        {cert.issuer}{cert.date ? ` • ${formatDate(cert.date)}` : ''}
                    </Text>
                </View>
            ))}
        </View>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Interests Display
// ─────────────────────────────────────────────────────────────────────────────

interface InterestsDisplayProps {
    interests: Interest[];
    layout?: 'tags' | 'list';
}

export const InterestsDisplay: React.FC<InterestsDisplayProps> = ({
    interests,
    layout = 'tags',
}) => {
    const visibleInterests = interests.filter(i => i.visible !== false);
    
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
        tag: {
            backgroundColor: COLORS.gray[100],
            paddingHorizontal: SPACING[3],
            paddingVertical: SPACING[2],
            borderRadius: 2,
            marginRight: SPACING[2],
            marginBottom: SPACING[2],
        },
        tagText: {
            fontSize: FONT_SIZES.sm,
            color: COLORS.gray[600],
        },
        listItem: {
            fontSize: FONT_SIZES.sm,
            color: COLORS.gray[600],
            marginBottom: SPACING[1],
        },
    });

    if (layout === 'list') {
        return (
            <View>
                {visibleInterests.map((interest) => (
                    <Text key={interest.id} style={styles.listItem}>• {interest.name}</Text>
                ))}
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {visibleInterests.map((interest) => (
                <View key={interest.id} style={styles.tag}>
                    <Text style={styles.tagText}>{interest.name}</Text>
                </View>
            ))}
        </View>
    );
};
