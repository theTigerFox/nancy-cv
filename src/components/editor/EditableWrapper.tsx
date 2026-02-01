// ============================================================================
// NANCY CV - Editable Wrapper for Templates
// Rend les templates compatibles avec l'édition live
// ============================================================================

import React, { ElementType } from 'react';
import { EditableText, useLiveEdit } from './LivePreviewEditor';

// ─────────────────────────────────────────────────────────────────────────────
// HOC pour rendre un texte éditable
// ─────────────────────────────────────────────────────────────────────────────

interface EditableWrapperProps {
    path: string;
    value: string;
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    as?: ElementType;
    multiline?: boolean;
    placeholder?: string;
}

export const EditableWrapper: React.FC<EditableWrapperProps> = ({
    path,
    value,
    children,
    className,
    style,
    as = 'span',
    multiline = false,
    placeholder,
}) => {
    const { isEditMode } = useLiveEdit();

    // Si pas en mode édition ou si children est fourni, utiliser le composant natif
    if (!isEditMode) {
        const Component = as;
        return (
            <Component className={className} style={style}>
                {children || value}
            </Component>
        );
    }

    return (
        <EditableText
            path={path}
            value={value}
            className={className}
            style={style}
            as={as}
            multiline={multiline}
            placeholder={placeholder}
        >
            {children}
        </EditableText>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Composants d'édition spécifiques pour chaque type de données CV
// ─────────────────────────────────────────────────────────────────────────────

// Nom complet éditable
interface EditableNameProps {
    firstName: string;
    lastName: string;
    className?: string;
    style?: React.CSSProperties;
}

export const EditableName: React.FC<EditableNameProps> = ({
    firstName,
    lastName,
    className,
    style,
}) => {
    const { isEditMode } = useLiveEdit();

    if (!isEditMode) {
        return (
            <span className={className} style={style}>
                {firstName} {lastName}
            </span>
        );
    }

    return (
        <span className={className} style={style}>
            <EditableText
                path="personalInfo.firstName"
                value={firstName}
                placeholder="Prénom"
            />{' '}
            <EditableText
                path="personalInfo.lastName"
                value={lastName}
                placeholder="Nom"
            />
        </span>
    );
};

// Titre de poste éditable
interface EditableJobTitleProps {
    value: string;
    className?: string;
    style?: React.CSSProperties;
}

export const EditableJobTitle: React.FC<EditableJobTitleProps> = ({
    value,
    className,
    style,
}) => {
    return (
        <EditableText
            path="personalInfo.jobTitle"
            value={value}
            className={className}
            style={style}
            placeholder="Titre du poste"
        />
    );
};

// Email éditable
interface EditableEmailProps {
    value: string;
    className?: string;
    style?: React.CSSProperties;
}

export const EditableEmail: React.FC<EditableEmailProps> = ({
    value,
    className,
    style,
}) => {
    return (
        <EditableText
            path="personalInfo.email"
            value={value}
            type="email"
            className={className}
            style={style}
            placeholder="email@exemple.com"
        />
    );
};

// Téléphone éditable
interface EditablePhoneProps {
    value: string;
    className?: string;
    style?: React.CSSProperties;
}

export const EditablePhone: React.FC<EditablePhoneProps> = ({
    value,
    className,
    style,
}) => {
    return (
        <EditableText
            path="personalInfo.phone"
            value={value}
            type="phone"
            className={className}
            style={style}
            placeholder="+33 6 12 34 56 78"
        />
    );
};

// Adresse éditable
interface EditableAddressProps {
    value: string;
    className?: string;
    style?: React.CSSProperties;
}

export const EditableAddress: React.FC<EditableAddressProps> = ({
    value,
    className,
    style,
}) => {
    return (
        <EditableText
            path="personalInfo.address"
            value={value}
            className={className}
            style={style}
            placeholder="Ville, Pays"
        />
    );
};

// Résumé/Description éditable
interface EditableSummaryProps {
    value: string;
    className?: string;
    style?: React.CSSProperties;
}

export const EditableSummary: React.FC<EditableSummaryProps> = ({
    value,
    className,
    style,
}) => {
    return (
        <EditableText
            path="personalInfo.summary"
            value={value}
            multiline
            className={className}
            style={style}
            placeholder="Résumé professionnel..."
        />
    );
};

// Expérience éditable (titre de poste)
interface EditableExperienceTitleProps {
    index: number;
    value: string;
    className?: string;
    style?: React.CSSProperties;
}

export const EditableExperienceTitle: React.FC<EditableExperienceTitleProps> = ({
    index,
    value,
    className,
    style,
}) => {
    return (
        <EditableText
            path={`experience.${index}.position`}
            value={value}
            className={className}
            style={style}
            placeholder="Titre du poste"
        />
    );
};

// Expérience éditable (entreprise)
interface EditableExperienceCompanyProps {
    index: number;
    value: string;
    className?: string;
    style?: React.CSSProperties;
}

export const EditableExperienceCompany: React.FC<EditableExperienceCompanyProps> = ({
    index,
    value,
    className,
    style,
}) => {
    return (
        <EditableText
            path={`experience.${index}.company`}
            value={value}
            className={className}
            style={style}
            placeholder="Nom de l'entreprise"
        />
    );
};

// Expérience éditable (description)
interface EditableExperienceDescProps {
    index: number;
    value: string;
    className?: string;
    style?: React.CSSProperties;
}

export const EditableExperienceDesc: React.FC<EditableExperienceDescProps> = ({
    index,
    value,
    className,
    style,
}) => {
    return (
        <EditableText
            path={`experience.${index}.description`}
            value={value}
            multiline
            className={className}
            style={style}
            placeholder="Description des responsabilités..."
        />
    );
};

// Éducation éditable (diplôme)
interface EditableEducationDegreeProps {
    index: number;
    value: string;
    className?: string;
    style?: React.CSSProperties;
}

export const EditableEducationDegree: React.FC<EditableEducationDegreeProps> = ({
    index,
    value,
    className,
    style,
}) => {
    return (
        <EditableText
            path={`education.${index}.degree`}
            value={value}
            className={className}
            style={style}
            placeholder="Diplôme obtenu"
        />
    );
};

// Éducation éditable (école)
interface EditableEducationSchoolProps {
    index: number;
    value: string;
    className?: string;
    style?: React.CSSProperties;
}

export const EditableEducationSchool: React.FC<EditableEducationSchoolProps> = ({
    index,
    value,
    className,
    style,
}) => {
    return (
        <EditableText
            path={`education.${index}.school`}
            value={value}
            className={className}
            style={style}
            placeholder="Établissement"
        />
    );
};

// Compétence éditable
interface EditableSkillNameProps {
    index: number;
    value: string;
    className?: string;
    style?: React.CSSProperties;
}

export const EditableSkillName: React.FC<EditableSkillNameProps> = ({
    index,
    value,
    className,
    style,
}) => {
    return (
        <EditableText
            path={`skills.${index}.name`}
            value={value}
            className={className}
            style={style}
            placeholder="Compétence"
        />
    );
};

// Langue éditable
interface EditableLanguageNameProps {
    index: number;
    value: string;
    className?: string;
    style?: React.CSSProperties;
}

export const EditableLanguageName: React.FC<EditableLanguageNameProps> = ({
    index,
    value,
    className,
    style,
}) => {
    return (
        <EditableText
            path={`languages.${index}.name`}
            value={value}
            className={className}
            style={style}
            placeholder="Langue"
        />
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────────────────────

export default {
    EditableWrapper,
    EditableName,
    EditableJobTitle,
    EditableEmail,
    EditablePhone,
    EditableAddress,
    EditableSummary,
    EditableExperienceTitle,
    EditableExperienceCompany,
    EditableExperienceDesc,
    EditableEducationDegree,
    EditableEducationSchool,
    EditableSkillName,
    EditableLanguageName,
};
