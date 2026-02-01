// ============================================================================
// NANCY CV - Executive Pro Template
// Template professionnel haut de gamme avec édition inline complète
// ============================================================================

import React, { forwardRef, ElementType } from 'react';
import { TemplateProps } from '../../types';
import { TemplateWrapper } from '../../components';
import { colorWithOpacity, getContrastColor } from '../../utils';
import { 
    InlineText, 
    InlineColor,
    InlineNumber,
    EditableSectionWrapper,
    EditableListItem,
    useInlineEditor 
} from '../../../components/editor/InlineEditor';

// ═══════════════════════════════════════════════════════════════════════════════
// EDITABLE FIELD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface EditableFieldProps {
    path: string;
    value: string;
    style?: React.CSSProperties;
    className?: string;
    multiline?: boolean;
    placeholder?: string;
    as?: ElementType;
}

const EditableField: React.FC<EditableFieldProps> = ({ 
    path, 
    value, 
    style, 
    className, 
    multiline, 
    placeholder,
    as = 'span'
}) => {
    return (
        <InlineText
            path={path}
            value={value || ''}
            style={style}
            className={className}
            multiline={multiline}
            placeholder={placeholder}
            as={as}
        />
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// EDITABLE COLOR ZONE - Permet l'édition des couleurs directement sur le CV
// ═══════════════════════════════════════════════════════════════════════════════

interface EditableColorZoneProps {
    colorPath: string;
    colorValue: string;
    label: string;
    children: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
    as?: ElementType;
}

const EditableColorZone: React.FC<EditableColorZoneProps> = ({
    colorPath,
    colorValue,
    label,
    children,
    style,
    className,
    as: Tag = 'div',
}) => {
    let isInEditMode = false;
    try {
        const context = useInlineEditor();
        isInEditMode = context.isEditMode;
    } catch { /* Context not available */ }
    
    if (!isInEditMode) {
        return React.createElement(Tag, { style, className }, children);
    }
    
    return React.createElement(
        Tag,
        { style: { ...style, position: 'relative' as const }, className },
        <>
            {children}
            <div style={{ position: 'absolute', top: 4, right: 4, zIndex: 50 }}>
                <InlineColor
                    path={colorPath}
                    value={colorValue}
                    label={label}
                />
            </div>
        </>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN TEMPLATE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const ExecutiveProTemplate = forwardRef<HTMLDivElement, TemplateProps>(
    ({ cvData, config, mode = 'preview', scale = 1 }, ref) => {
        const { personalInfo, education, experience, skills, languages, projects, certifications } = cvData;
        const { colors, typography, spacing, layout } = config;

        const sidebarBg = colors.primary;
        const sidebarText = getContrastColor(sidebarBg);
        
        // Détecter le mode édition (échoue silencieusement si context indisponible)
        let isInEditMode = false;
        try {
            const context = useInlineEditor();
            isInEditMode = context.isEditMode;
        } catch { /* Context not available */ }

        return (
            <TemplateWrapper ref={ref} config={config} mode={mode} scale={scale}>
                <div style={{ display: 'flex', minHeight: '297mm' }}>
                    
                    {/* ════════════════════════════════════════════════════════════════════
                        SIDEBAR
                    ════════════════════════════════════════════════════════════════════ */}
                    <EditableColorZone
                        colorPath="colors.primary"
                        colorValue={colors.primary}
                        label="Couleur sidebar"
                        as="aside"
                        style={{
                            width: `${layout.sidebarWidth}%`,
                            backgroundColor: sidebarBg,
                            color: sidebarText,
                            padding: `${spacing.pageMargin}mm`,
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        {/* Photo */}
                        {layout.showPhoto && personalInfo.photo && (
                            <div style={{ marginBottom: spacing.sectionGap, textAlign: 'center' }}>
                                <img
                                    src={personalInfo.photo}
                                    alt="Photo"
                                    style={{
                                        width: `${layout.photoSize}px`,
                                        height: `${layout.photoSize}px`,
                                        objectFit: 'cover',
                                        border: `4px solid ${colors.accent}`,
                                        borderRadius: layout.photoShape === 'circle' ? '50%' 
                                            : layout.photoShape === 'rounded' ? '12px' 
                                            : '0',
                                    }}
                                />
                            </div>
                        )}

                        {/* Contact Section */}
                        <div style={{ marginBottom: spacing.sectionGap }}>
                            <h3
                                style={{
                                    fontSize: `${typography.sectionTitleSize}rem`,
                                    fontFamily: typography.fontHeading,
                                    fontWeight: 700,
                                    marginBottom: spacing.itemGap,
                                    borderBottom: `2px solid ${colors.accent}`,
                                    paddingBottom: '8px',
                                    color: sidebarText,
                                }}
                            >
                                Contact
                            </h3>
                            <div style={{ 
                                fontSize: `${typography.smallSize || typography.bodySize * 0.85}rem`, 
                                display: 'flex', 
                                flexDirection: 'column', 
                                gap: '10px' 
                            }}>
                                {(personalInfo.email || isInEditMode) && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <InlineColor
                                            path="colors.accent"
                                            value={colors.accent}
                                            label="Couleur accent"
                                        >
                                            <span style={{ color: colors.accent }}>✉</span>
                                        </InlineColor>
                                        <EditableField 
                                            path="personalInfo.email" 
                                            value={personalInfo.email || ''}
                                            placeholder="email@exemple.com"
                                        />
                                    </div>
                                )}
                                {(personalInfo.phone || isInEditMode) && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ color: colors.accent }}>☎</span>
                                        <EditableField 
                                            path="personalInfo.phone" 
                                            value={personalInfo.phone || ''}
                                            placeholder="+33 6 00 00 00 00"
                                        />
                                    </div>
                                )}
                                {(personalInfo.address || isInEditMode) && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ color: colors.accent }}>⌂</span>
                                        <EditableField 
                                            path="personalInfo.address" 
                                            value={personalInfo.address || ''}
                                            placeholder="Ville, Pays"
                                        />
                                    </div>
                                )}
                                {(personalInfo.website || isInEditMode) && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ color: colors.accent }}>🔗</span>
                                        <EditableField 
                                            path="personalInfo.website" 
                                            value={personalInfo.website || ''}
                                            placeholder="www.exemple.com"
                                        />
                                    </div>
                                )}
                                {(personalInfo.linkedIn || isInEditMode) && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ color: colors.accent, fontWeight: 'bold', fontSize: '0.7em' }}>in</span>
                                        <EditableField 
                                            path="personalInfo.linkedIn" 
                                            value={personalInfo.linkedIn || ''}
                                            placeholder="linkedin.com/in/..."
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Skills */}
                        {skills && skills.length > 0 && (
                            <EditableSectionWrapper
                                sectionKey="skills"
                                title="Compétences"
                            >
                                <div style={{ marginBottom: spacing.sectionGap }}>
                                    <h3
                                        style={{
                                            fontSize: `${typography.sectionTitleSize}rem`,
                                            fontFamily: typography.fontHeading,
                                            fontWeight: 700,
                                            marginBottom: spacing.itemGap,
                                            borderBottom: `2px solid ${colors.accent}`,
                                            paddingBottom: '8px',
                                            color: sidebarText,
                                        }}
                                    >
                                        Compétences
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {skills.map((skill, index) => (
                                            <EditableListItem key={skill.id} index={index}>
                                                <div>
                                                    <div style={{ 
                                                        display: 'flex', 
                                                        justifyContent: 'space-between', 
                                                        marginBottom: '4px',
                                                        fontSize: `${typography.bodySize}rem`,
                                                    }}>
                                                        <EditableField
                                                            path={`skills.${index}.name`}
                                                            value={skill.name}
                                                            placeholder="Compétence"
                                                        />
                                                    </div>
                                                    <div style={{ 
                                                        height: '4px', 
                                                        backgroundColor: colorWithOpacity(sidebarText, 0.2),
                                                        borderRadius: '2px',
                                                    }}>
                                                        <div style={{ 
                                                            height: '100%', 
                                                            width: `${(skill.level / 10) * 100}%`,
                                                            backgroundColor: colors.accent,
                                                            borderRadius: '2px',
                                                            transition: 'width 0.3s ease',
                                                        }} />
                                                    </div>
                                                </div>
                                            </EditableListItem>
                                        ))}
                                    </div>
                                </div>
                            </EditableSectionWrapper>
                        )}

                        {/* Languages */}
                        {languages && languages.length > 0 && (
                            <EditableSectionWrapper sectionKey="languages" title="Langues">
                                <div>
                                    <h3
                                        style={{
                                            fontSize: `${typography.sectionTitleSize}rem`,
                                            fontFamily: typography.fontHeading,
                                            fontWeight: 700,
                                            marginBottom: spacing.itemGap,
                                            borderBottom: `2px solid ${colors.accent}`,
                                            paddingBottom: '8px',
                                            color: sidebarText,
                                        }}
                                    >
                                        Langues
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {languages.map((lang, index) => (
                                            <EditableListItem key={lang.id} index={index}>
                                                <div style={{ 
                                                    display: 'flex', 
                                                    justifyContent: 'space-between', 
                                                    alignItems: 'center' 
                                                }}>
                                                    <EditableField
                                                        path={`languages.${index}.name`}
                                                        value={lang.name}
                                                        placeholder="Langue"
                                                        style={{ fontSize: `${typography.bodySize}rem` }}
                                                    />
                                                    <div style={{ display: 'flex', gap: '3px' }}>
                                                        {[...Array(5)].map((_, i) => (
                                                            <div
                                                                key={i}
                                                                style={{
                                                                    width: '8px',
                                                                    height: '8px',
                                                                    borderRadius: '50%',
                                                                    backgroundColor: i < lang.level 
                                                                        ? colors.accent 
                                                                        : colorWithOpacity(sidebarText, 0.2),
                                                                    transition: 'background-color 0.2s ease',
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </EditableListItem>
                                        ))}
                                    </div>
                                </div>
                            </EditableSectionWrapper>
                        )}
                    </EditableColorZone>

                    {/* ════════════════════════════════════════════════════════════════════
                        MAIN CONTENT
                    ════════════════════════════════════════════════════════════════════ */}
                    <main
                        style={{
                            flex: 1,
                            padding: `${spacing.pageMargin}mm`,
                            backgroundColor: colors.background,
                        }}
                    >
                        {/* Header */}
                        <header style={{ marginBottom: spacing.sectionGap * 1.5 }}>
                            <h1
                                style={{
                                    fontSize: `${typography.nameSize}rem`,
                                    fontFamily: typography.fontHeading,
                                    fontWeight: 700,
                                    color: colors.primary,
                                    letterSpacing: typography.letterSpacing,
                                    marginBottom: '4px',
                                    display: 'flex',
                                    gap: '0.3em',
                                    flexWrap: 'wrap',
                                }}
                            >
                                <EditableField 
                                    path="personalInfo.firstName" 
                                    value={personalInfo.firstName}
                                    placeholder="Prénom"
                                    style={{ color: colors.primary }}
                                />
                                <EditableField 
                                    path="personalInfo.lastName" 
                                    value={personalInfo.lastName}
                                    placeholder="Nom"
                                    style={{ color: colors.primary }}
                                />
                            </h1>
                            
                            <InlineColor
                                path="colors.accent"
                                value={colors.accent}
                                label="Couleur du titre"
                            >
                                <p
                                    style={{
                                        fontSize: `${typography.jobTitleSize}rem`,
                                        color: colors.accent,
                                        fontWeight: 500,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em',
                                    }}
                                >
                                    <EditableField 
                                        path="personalInfo.jobTitle" 
                                        value={personalInfo.jobTitle || ''}
                                        placeholder="Titre du poste"
                                    />
                                </p>
                            </InlineColor>
                            
                            {/* Accent line */}
                            <div
                                style={{
                                    width: '80px',
                                    height: '3px',
                                    backgroundColor: colors.accent,
                                    marginTop: '16px',
                                }}
                            />
                        </header>

                        {/* Profile/Description */}
                        {(personalInfo.description || isInEditMode) && (
                            <EditableSectionWrapper sectionKey="profile" title="Profil">
                                <section style={{ marginBottom: spacing.sectionGap }}>
                                    <h2
                                        style={{
                                            fontSize: `${typography.sectionTitleSize}rem`,
                                            fontFamily: typography.fontHeading,
                                            fontWeight: 700,
                                            color: colors.primary,
                                            marginBottom: spacing.itemGap,
                                            borderLeft: `4px solid ${colors.accent}`,
                                            paddingLeft: '12px',
                                        }}
                                    >
                                        Profil
                                    </h2>
                                    <EditableField 
                                        path="personalInfo.description" 
                                        value={personalInfo.description || ''}
                                        multiline
                                        placeholder="Résumé professionnel... Décrivez votre parcours et vos objectifs."
                                        style={{
                                            fontSize: `${typography.bodySize}rem`,
                                            lineHeight: typography.lineHeight,
                                            color: colors.text,
                                            textAlign: 'justify',
                                            display: 'block',
                                        }}
                                        as="p"
                                    />
                                </section>
                            </EditableSectionWrapper>
                        )}

                        {/* Experience */}
                        {experience && experience.length > 0 && (
                            <EditableSectionWrapper sectionKey="experience" title="Expérience">
                                <section style={{ marginBottom: spacing.sectionGap }}>
                                    <h2
                                        style={{
                                            fontSize: `${typography.sectionTitleSize}rem`,
                                            fontFamily: typography.fontHeading,
                                            fontWeight: 700,
                                            color: colors.primary,
                                            marginBottom: spacing.itemGap,
                                            borderLeft: `4px solid ${colors.accent}`,
                                            paddingLeft: '12px',
                                        }}
                                    >
                                        Expérience Professionnelle
                                    </h2>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: `${spacing.itemGap}px` }}>
                                        {experience.map((exp, index) => (
                                            <EditableListItem
                                                key={exp.id}
                                                index={index}
                                                canMoveUp={index > 0}
                                                canMoveDown={index < experience.length - 1}
                                            >
                                                <div style={{ position: 'relative', paddingLeft: '20px' }}>
                                                    {/* Timeline dot */}
                                                    <div
                                                        style={{
                                                            position: 'absolute',
                                                            left: 0,
                                                            top: '6px',
                                                            width: '8px',
                                                            height: '8px',
                                                            backgroundColor: colors.accent,
                                                        }}
                                                    />
                                                    {/* Timeline line */}
                                                    {index < experience.length - 1 && (
                                                        <div
                                                            style={{
                                                                position: 'absolute',
                                                                left: '3px',
                                                                top: '18px',
                                                                bottom: `-${spacing.itemGap}px`,
                                                                width: '2px',
                                                                backgroundColor: colorWithOpacity(colors.primary, 0.15),
                                                            }}
                                                        />
                                                    )}
                                                    
                                                    <div style={{ 
                                                        display: 'flex', 
                                                        justifyContent: 'space-between', 
                                                        alignItems: 'flex-start', 
                                                        flexWrap: 'wrap',
                                                        gap: '8px',
                                                    }}>
                                                        <div style={{ flex: 1 }}>
                                                            <h3 style={{ 
                                                                fontSize: `${typography.bodySize * 1.1}rem`, 
                                                                fontWeight: 600,
                                                                color: colors.text,
                                                                marginBottom: '2px',
                                                            }}>
                                                                <EditableField
                                                                    path={`experience.${index}.title`}
                                                                    value={exp.title}
                                                                    placeholder="Titre du poste"
                                                                />
                                                            </h3>
                                                            <p style={{ 
                                                                color: colors.textLight, 
                                                                fontSize: `${typography.bodySize}rem` 
                                                            }}>
                                                                <EditableField
                                                                    path={`experience.${index}.company`}
                                                                    value={exp.company}
                                                                    placeholder="Entreprise"
                                                                />
                                                            </p>
                                                        </div>
                                                        <span style={{ 
                                                            fontSize: `${(typography.smallSize || typography.bodySize * 0.85)}rem`,
                                                            color: colors.primary,
                                                            fontWeight: 500,
                                                            whiteSpace: 'nowrap',
                                                        }}>
                                                            <EditableField
                                                                path={`experience.${index}.startDate`}
                                                                value={exp.startDate}
                                                                placeholder="Début"
                                                            />
                                                            {' - '}
                                                            <EditableField
                                                                path={`experience.${index}.endDate`}
                                                                value={exp.endDate || 'Présent'}
                                                                placeholder="Fin"
                                                            />
                                                        </span>
                                                    </div>
                                                    
                                                    {(exp.description || isInEditMode) && (
                                                        <div style={{ marginTop: '8px' }}>
                                                            <EditableField 
                                                                path={`experience.${index}.description`}
                                                                value={exp.description || ''}
                                                                multiline
                                                                placeholder="Description des responsabilités et réalisations..."
                                                                style={{
                                                                    fontSize: `${typography.bodySize}rem`,
                                                                    color: colors.text,
                                                                    lineHeight: typography.lineHeight,
                                                                    whiteSpace: 'pre-line',
                                                                    display: 'block',
                                                                }}
                                                                as="p"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </EditableListItem>
                                        ))}
                                    </div>
                                </section>
                            </EditableSectionWrapper>
                        )}

                        {/* Education */}
                        {education && education.length > 0 && (
                            <EditableSectionWrapper sectionKey="education" title="Formation">
                                <section style={{ marginBottom: spacing.sectionGap }}>
                                    <h2
                                        style={{
                                            fontSize: `${typography.sectionTitleSize}rem`,
                                            fontFamily: typography.fontHeading,
                                            fontWeight: 700,
                                            color: colors.primary,
                                            marginBottom: spacing.itemGap,
                                            borderLeft: `4px solid ${colors.accent}`,
                                            paddingLeft: '12px',
                                        }}
                                    >
                                        Formation
                                    </h2>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: `${spacing.itemGap}px` }}>
                                        {education.map((edu, index) => (
                                            <EditableListItem
                                                key={edu.id}
                                                index={index}
                                                canMoveUp={index > 0}
                                                canMoveDown={index < education.length - 1}
                                            >
                                                <div style={{ 
                                                    padding: '12px',
                                                    backgroundColor: colors.backgroundAlt,
                                                    borderLeft: `3px solid ${colors.accent}`,
                                                }}>
                                                    <div style={{ 
                                                        display: 'flex', 
                                                        justifyContent: 'space-between', 
                                                        alignItems: 'flex-start', 
                                                        flexWrap: 'wrap',
                                                        gap: '8px',
                                                    }}>
                                                        <div style={{ flex: 1 }}>
                                                            <h3 style={{ 
                                                                fontSize: `${typography.bodySize * 1.1}rem`, 
                                                                fontWeight: 600,
                                                                color: colors.text,
                                                                marginBottom: '2px',
                                                            }}>
                                                                <EditableField
                                                                    path={`education.${index}.degree`}
                                                                    value={edu.degree}
                                                                    placeholder="Diplôme"
                                                                />
                                                            </h3>
                                                            <p style={{ 
                                                                color: colors.textLight, 
                                                                fontSize: `${typography.bodySize}rem` 
                                                            }}>
                                                                <EditableField
                                                                    path={`education.${index}.school`}
                                                                    value={edu.school}
                                                                    placeholder="École/Université"
                                                                />
                                                            </p>
                                                        </div>
                                                        <span style={{ 
                                                            fontSize: `${(typography.smallSize || typography.bodySize * 0.85)}rem`,
                                                            color: colors.primary,
                                                            fontWeight: 500,
                                                            whiteSpace: 'nowrap',
                                                        }}>
                                                            <EditableField
                                                                path={`education.${index}.startDate`}
                                                                value={edu.startDate}
                                                                placeholder="Début"
                                                            />
                                                            {' - '}
                                                            <EditableField
                                                                path={`education.${index}.endDate`}
                                                                value={edu.endDate || ''}
                                                                placeholder="Fin"
                                                            />
                                                        </span>
                                                    </div>
                                                    
                                                    {(edu.description || isInEditMode) && (
                                                        <div style={{ marginTop: '6px' }}>
                                                            <EditableField 
                                                                path={`education.${index}.description`}
                                                                value={edu.description || ''}
                                                                multiline
                                                                placeholder="Description de la formation..."
                                                                style={{
                                                                    fontSize: `${(typography.smallSize || typography.bodySize * 0.85)}rem`,
                                                                    color: colors.textLight,
                                                                    display: 'block',
                                                                }}
                                                                as="p"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </EditableListItem>
                                        ))}
                                    </div>
                                </section>
                            </EditableSectionWrapper>
                        )}

                        {/* Projects */}
                        {projects && projects.length > 0 && (
                            <EditableSectionWrapper sectionKey="projects" title="Projets">
                                <section style={{ marginBottom: spacing.sectionGap }}>
                                    <h2
                                        style={{
                                            fontSize: `${typography.sectionTitleSize}rem`,
                                            fontFamily: typography.fontHeading,
                                            fontWeight: 700,
                                            color: colors.primary,
                                            marginBottom: spacing.itemGap,
                                            borderLeft: `4px solid ${colors.accent}`,
                                            paddingLeft: '12px',
                                        }}
                                    >
                                        Projets
                                    </h2>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: `${spacing.itemGap}px` }}>
                                        {projects.map((project, index) => (
                                            <EditableListItem key={project.id} index={index}>
                                                <div>
                                                    <h3 style={{ 
                                                        fontSize: `${typography.bodySize * 1.1}rem`, 
                                                        fontWeight: 600,
                                                        color: colors.text,
                                                        marginBottom: '4px',
                                                    }}>
                                                        <EditableField
                                                            path={`projects.${index}.name`}
                                                            value={project.name}
                                                            placeholder="Nom du projet"
                                                        />
                                                    </h3>
                                                    {(project.description || isInEditMode) && (
                                                        <EditableField 
                                                            path={`projects.${index}.description`}
                                                            value={project.description || ''}
                                                            multiline
                                                            placeholder="Description du projet..."
                                                            style={{
                                                                fontSize: `${typography.bodySize}rem`,
                                                                color: colors.text,
                                                                lineHeight: typography.lineHeight,
                                                                display: 'block',
                                                                marginBottom: '8px',
                                                            }}
                                                            as="p"
                                                        />
                                                    )}
                                                    {project.technologies && project.technologies.length > 0 && (
                                                        <div style={{ 
                                                            display: 'flex', 
                                                            flexWrap: 'wrap', 
                                                            gap: '4px' 
                                                        }}>
                                                            {project.technologies.map((tech, i) => (
                                                                <span
                                                                    key={i}
                                                                    style={{
                                                                        fontSize: `${(typography.smallSize || typography.bodySize * 0.85) * 0.9}rem`,
                                                                        backgroundColor: colorWithOpacity(colors.accent, 0.15),
                                                                        color: colors.primary,
                                                                        padding: '2px 8px',
                                                                        borderRadius: '4px',
                                                                    }}
                                                                >
                                                                    {tech}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </EditableListItem>
                                        ))}
                                    </div>
                                </section>
                            </EditableSectionWrapper>
                        )}

                        {/* Certifications */}
                        {certifications && certifications.length > 0 && (
                            <EditableSectionWrapper sectionKey="certifications" title="Certifications">
                                <section>
                                    <h2
                                        style={{
                                            fontSize: `${typography.sectionTitleSize}rem`,
                                            fontFamily: typography.fontHeading,
                                            fontWeight: 700,
                                            color: colors.primary,
                                            marginBottom: spacing.itemGap,
                                            borderLeft: `4px solid ${colors.accent}`,
                                            paddingLeft: '12px',
                                        }}
                                    >
                                        Certifications
                                    </h2>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: `${spacing.itemGap * 0.75}px` }}>
                                        {certifications.map((cert, index) => (
                                            <EditableListItem key={cert.id} index={index}>
                                                <div style={{ 
                                                    display: 'flex', 
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    flexWrap: 'wrap',
                                                    gap: '4px',
                                                }}>
                                                    <div>
                                                        <span style={{ 
                                                            fontSize: `${typography.bodySize}rem`,
                                                            fontWeight: 500,
                                                            color: colors.text,
                                                        }}>
                                                            <EditableField
                                                                path={`certifications.${index}.name`}
                                                                value={cert.name}
                                                                placeholder="Nom de la certification"
                                                            />
                                                        </span>
                                                        {(cert.issuer || isInEditMode) && (
                                                            <span style={{ 
                                                                fontSize: `${(typography.smallSize || typography.bodySize * 0.85)}rem`,
                                                                color: colors.textLight,
                                                                marginLeft: '8px',
                                                            }}>
                                                                - <EditableField
                                                                    path={`certifications.${index}.issuer`}
                                                                    value={cert.issuer || ''}
                                                                    placeholder="Organisme"
                                                                />
                                                            </span>
                                                        )}
                                                    </div>
                                                    {(cert.date || isInEditMode) && (
                                                        <span style={{ 
                                                            fontSize: `${(typography.smallSize || typography.bodySize * 0.85)}rem`,
                                                            color: colors.primary,
                                                        }}>
                                                            <EditableField
                                                                path={`certifications.${index}.date`}
                                                                value={cert.date || ''}
                                                                placeholder="Date"
                                                            />
                                                        </span>
                                                    )}
                                                </div>
                                            </EditableListItem>
                                        ))}
                                    </div>
                                </section>
                            </EditableSectionWrapper>
                        )}
                    </main>
                </div>
            </TemplateWrapper>
        );
    }
);

ExecutiveProTemplate.displayName = 'ExecutiveProTemplate';

export default ExecutiveProTemplate;
