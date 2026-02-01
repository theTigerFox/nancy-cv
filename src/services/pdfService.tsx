// @ts-nocheck
import { CvData } from '../types/cv';
import { pdf, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';

// Définir des styles pour le document PDF
const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Helvetica',
    },
    header: {
        flexDirection: 'row',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
        paddingBottom: 10,
    },
    headerLeft: {
        flex: 1,
    },
    headerRight: {
        flex: 1,
        alignItems: 'flex-end',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    jobTitle: {
        fontSize: 14,
        marginTop: 4,
        color: '#333',
    },
    contactInfo: {
        fontSize: 10,
        marginTop: 5,
        color: '#555',
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingBottom: 5,
    },
    description: {
        fontSize: 10,
        color: '#555',
        marginBottom: 15,
        lineHeight: 1.5,
    },
    twoColumns: {
        flexDirection: 'row',
        marginTop: 10,
    },
    mainColumn: {
        flex: 2,
        paddingRight: 10,
    },
    sideColumn: {
        flex: 1,
        paddingLeft: 10,
        borderLeftWidth: 1,
        borderLeftColor: '#ddd',
    },
    experienceItem: {
        marginBottom: 12,
    },
    experienceTitle: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    experienceCompany: {
        fontSize: 10,
        marginBottom: 3,
    },
    experienceDate: {
        fontSize: 9,
        color: '#777',
        marginBottom: 3,
    },
    experienceDescription: {
        fontSize: 9,
        color: '#555',
        lineHeight: 1.4,
    },
    skillItem: {
        marginBottom: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    skillName: {
        fontSize: 10,
    },
    skillLevel: {
        fontSize: 9,
        color: '#777',
    },
    languageItem: {
        marginBottom: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    languageName: {
        fontSize: 10,
    },
    languageLevel: {
        fontSize: 9,
        color: '#777',
    },
    photo: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 10,
    },
});

// Composant Document PDF
const CvDocument = ({ cvData, templateId, accentColor }: {
    cvData: CvData;
    templateId: number;
    accentColor: string;
}) => {
    const { personalInfo, education, experience, skills, languages } = cvData;

    // Mapping pour les niveaux de langue
    const languageLevelText = (level: number) => {
        const levels = ['Débutant', 'Intermédiaire', 'Avancé', 'Courant', 'Bilingue/Natif'];
        return levels[Math.min(Math.max(0, level - 1), 4)];
    };

    // Vérifier si les sections ont du contenu
    const hasContent = (list: any[]) => list.length > 0 && Object.values(list[0]).some(val =>
        val !== '' && val !== null && val !== undefined && val !== 5 && val !== 3
    );

    // Template 1 - Moderne et Coloré
    const Template1 = () => (
        <Document>
            <Page size="A4" style={styles.page}>
        {/* Header avec photo et informations personnelles */}
        <View style={styles.header}>
    <View style={styles.headerLeft}>
    <Text style={styles.name}>{personalInfo.firstName} {personalInfo.lastName}</Text>
    <Text style={[styles.jobTitle, { color: accentColor }]}>{personalInfo.jobTitle}</Text>

    <View style={{ marginTop: 10 }}>
    {personalInfo.email && (
        <Text style={styles.contactInfo}>Email: {personalInfo.email}</Text>
    )}
    {personalInfo.phone && (
        <Text style={styles.contactInfo}>Téléphone: {personalInfo.phone}</Text>
    )}
    {personalInfo.address && (
        <Text style={styles.contactInfo}>Adresse: {personalInfo.address}</Text>
    )}
    </View>
    </View>

    {personalInfo.photo && (
        <View style={styles.headerRight}>
        <Image
            src={personalInfo.photo}
        style={styles.photo}
        />
        </View>
    )}
    </View>

    {/* Profil / Description */}
    {personalInfo.description && (
        <View>
            <Text style={[styles.sectionTitle, { color: accentColor }]}>Profil</Text>
    <Text style={styles.description}>{personalInfo.description}</Text>
        </View>
    )}

    {/* Disposition en deux colonnes */}
    <View style={styles.twoColumns}>
    <View style={styles.mainColumn}>
        {/* Expérience */}
    {hasContent(experience) && (
        <View>
            <Text style={[styles.sectionTitle, { color: accentColor }]}>Expérience Professionnelle</Text>
        {experience.map((exp, index) => (
            <View key={index} style={styles.experienceItem}>
        <Text style={styles.experienceTitle}>{exp.title}</Text>
            <Text style={styles.experienceCompany}>{exp.company}</Text>
            <Text style={styles.experienceDate}>{exp.startDate} - {exp.endDate || 'Présent'}</Text>
            {exp.description && (
                <Text style={styles.experienceDescription}>{exp.description}</Text>
            )}
            </View>
        ))}
        </View>
    )}

    {/* Formation */}
    {hasContent(education) && (
        <View>
            <Text style={[styles.sectionTitle, { color: accentColor }]}>Formation</Text>
        {education.map((edu, index) => (
            <View key={index} style={styles.experienceItem}>
        <Text style={styles.experienceTitle}>{edu.degree}</Text>
            <Text style={styles.experienceCompany}>{edu.school}</Text>
            <Text style={styles.experienceDate}>{edu.startDate} - {edu.endDate}</Text>
            {edu.description && (
                <Text style={styles.experienceDescription}>{edu.description}</Text>
            )}
            </View>
        ))}
        </View>
    )}
    </View>

    <View style={styles.sideColumn}>
        {/* Compétences */}
    {hasContent(skills) && (
        <View>
            <Text style={[styles.sectionTitle, { color: accentColor }]}>Compétences</Text>
        {skills.map((skill, index) => (
            <View key={index} style={styles.skillItem}>
        <Text style={styles.skillName}>{skill.name}</Text>
            <Text style={styles.skillLevel}>{Math.round((skill.level / 10) * 100)}%</Text>
            </View>
        ))}
        </View>
    )}

    {/* Langues */}
    {hasContent(languages) && (
        <View>
            <Text style={[styles.sectionTitle, { color: accentColor }]}>Langues</Text>
        {languages.map((lang, index) => (
            <View key={index} style={styles.languageItem}>
        <Text style={styles.languageName}>{lang.name}</Text>
            <Text style={styles.languageLevel}>{languageLevelText(lang.level)}</Text>
        </View>
        ))}
        </View>
    )}
    </View>
    </View>
    </Page>
    </Document>
);

    // Template 2 - Professionnel & Épuré
    const Template2 = () => (
        <Document>
            <Page size="A4" style={styles.page}>
        {/* Header avec nom, titre et contact */}
        <View style={[styles.header, { alignItems: 'center' }]}>
    <View style={{ flex: personalInfo.photo ? 2 : 1 }}>
    <Text style={styles.name}>{personalInfo.firstName} {personalInfo.lastName}</Text>
    <Text style={[styles.jobTitle, { color: accentColor, marginBottom: 8 }]}>{personalInfo.jobTitle}</Text>

    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
    {personalInfo.email && (
        <Text style={styles.contactInfo}>Email: {personalInfo.email}</Text>
    )}
    {personalInfo.phone && (
        <Text style={styles.contactInfo}>Tél: {personalInfo.phone}</Text>
    )}
    {personalInfo.address && (
        <Text style={styles.contactInfo}>Adresse: {personalInfo.address}</Text>
    )}
    </View>
    </View>

    {personalInfo.photo && (
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
        <Image
            src={personalInfo.photo}
        style={[styles.photo, { borderWidth: 2, borderColor: accentColor }]}
        />
        </View>
    )}
    </View>

    {/* Profil / Description */}
    {personalInfo.description && (
        <View>
            <Text style={[styles.sectionTitle, { color: accentColor }]}>Profil Professionnel</Text>
    <Text style={styles.description}>{personalInfo.description}</Text>
        </View>
    )}

    {/* Disposition en deux colonnes */}
    <View style={styles.twoColumns}>
    <View style={styles.mainColumn}>
        {/* Expérience */}
    {hasContent(experience) && (
        <View>
            <Text style={[styles.sectionTitle, { color: accentColor }]}>Expérience Professionnelle</Text>
        {experience.map((exp, index) => (
            <View key={index} style={[styles.experienceItem, { paddingLeft: 10, borderLeftWidth: 1, borderLeftColor: accentColor, borderLeftStyle: 'solid' }]}>
            <Text style={styles.experienceDate}>{exp.startDate} - {exp.endDate || 'Présent'}</Text>
                <Text style={styles.experienceTitle}>{exp.title}</Text>
            <Text style={styles.experienceCompany}>{exp.company}</Text>
            {exp.description && (
                <Text style={styles.experienceDescription}>{exp.description}</Text>
            )}
            </View>
        ))}
        </View>
    )}

    {/* Formation */}
    {hasContent(education) && (
        <View>
            <Text style={[styles.sectionTitle, { color: accentColor }]}>Formation</Text>
        {education.map((edu, index) => (
            <View key={index} style={[styles.experienceItem, { paddingLeft: 10, borderLeftWidth: 1, borderLeftColor: accentColor, borderLeftStyle: 'solid' }]}>
            <Text style={styles.experienceDate}>{edu.startDate} - {edu.endDate}</Text>
                <Text style={styles.experienceTitle}>{edu.degree}</Text>
            <Text style={styles.experienceCompany}>{edu.school}</Text>
            {edu.description && (
                <Text style={styles.experienceDescription}>{edu.description}</Text>
            )}
            </View>
        ))}
        </View>
    )}
    </View>

    <View style={styles.sideColumn}>
        {/* Compétences */}
    {hasContent(skills) && (
        <View>
            <Text style={[styles.sectionTitle, { color: accentColor }]}>Compétences</Text>
        {skills.map((skill, index) => (
            <View key={index}>
            <View style={styles.skillItem}>
            <Text style={styles.skillName}>{skill.name}</Text>
                <Text style={styles.skillLevel}>{Math.round((skill.level / 10) * 100)}%</Text>
            </View>
            <View style={{ height: 3, width: '100%', backgroundColor: '#eee', marginBottom: 8 }}>
            <View
                style={{
            height: 3,
                width: `${(skill.level / 10) * 100}%`,
                backgroundColor: accentColor
        }}
            />
            </View>
            </View>
        ))}
        </View>
    )}

    {/* Langues */}
    {hasContent(languages) && (
        <View>
            <Text style={[styles.sectionTitle, { color: accentColor }]}>Langues</Text>
        {languages.map((lang, index) => (
            <View key={index} style={styles.languageItem}>
        <Text style={styles.languageName}>{lang.name}</Text>
            <Text style={[styles.languageLevel, { color: accentColor }]}>{languageLevelText(lang.level)}</Text>
        </View>
        ))}
        </View>
    )}
    </View>
    </View>
    </Page>
    </Document>
);

    // Template 3 - Simple & Minimaliste
    const Template3 = () => (
        <Document>
            <Page size="A4" style={styles.page}>
        {/* Header avec nom et titre uniquement */}
        <View style={[styles.header, { borderBottomColor: accentColor }]}>
    <View style={styles.headerLeft}>
    <Text style={[styles.name, { textTransform: 'uppercase' }]}>
    {personalInfo.firstName} {personalInfo.lastName}
    </Text>
    {personalInfo.jobTitle && (
        <Text style={[styles.jobTitle, { color: accentColor }]}>
        {personalInfo.jobTitle}
        </Text>
    )}
    </View>
    </View>

    {/* Disposition en deux colonnes */}
    <View style={styles.twoColumns}>
        {/* Colonne de gauche - Contact et compétences */}
        <View style={[styles.sideColumn, { backgroundColor: '#f9f9f9', padding: 10, borderLeftWidth: 0 }]}>
    {/* Contact */}
    <View>
        <Text style={[styles.sectionTitle, { color: '#333', textTransform: 'uppercase', borderBottomColor: accentColor }]}>
    Contact
    </Text>

    {personalInfo.email && (
        <View style={{ marginBottom: 5 }}>
        <Text style={{ fontSize: 10, fontWeight: 'bold' }}>Email</Text>
    <Text style={{ fontSize: 9 }}>{personalInfo.email}</Text>
    </View>
    )}

    {personalInfo.phone && (
        <View style={{ marginBottom: 5 }}>
        <Text style={{ fontSize: 10, fontWeight: 'bold' }}>Téléphone</Text>
    <Text style={{ fontSize: 9 }}>{personalInfo.phone}</Text>
    </View>
    )}

    {personalInfo.address && (
        <View style={{ marginBottom: 10 }}>
        <Text style={{ fontSize: 10, fontWeight: 'bold' }}>Adresse</Text>
    <Text style={{ fontSize: 9 }}>{personalInfo.address}</Text>
    </View>
    )}
    </View>

    {/* Compétences */}
    {hasContent(skills) && (
        <View>
            <Text style={[styles.sectionTitle, { color: '#333', textTransform: 'uppercase', borderBottomColor: accentColor }]}>
        Compétences
        </Text>

        {skills.map((skill, index) => (
            <View key={index} style={{ flexDirection: 'row', marginBottom: 5 }}>
            <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: accentColor, marginTop: 3, marginRight: 5 }} />
        <Text style={{ fontSize: 9 }}>{skill.name}</Text>
        </View>
        ))}
        </View>
    )}

    {/* Langues */}
    {hasContent(languages) && (
        <View>
            <Text style={[styles.sectionTitle, { color: '#333', textTransform: 'uppercase', borderBottomColor: accentColor }]}>
        Langues
        </Text>

        {languages.map((lang, index) => (
            <View key={index} style={styles.languageItem}>
        <Text style={{ fontSize: 9 }}>{lang.name}</Text>
        <Text style={{ fontSize: 8, color: '#777' }}>{languageLevelText(lang.level)}</Text>
        </View>
        ))}
        </View>
    )}
    </View>

    {/* Colonne de droite - Profil, expérience et formation */}
    <View style={styles.mainColumn}>
        {/* Profil */}
    {personalInfo.description && (
        <View>
            <Text style={[styles.sectionTitle, { color: '#333', textTransform: 'uppercase', borderBottomColor: accentColor }]}>
        Profil
        </Text>
        <Text style={styles.description}>{personalInfo.description}</Text>
        </View>
    )}

    {/* Expérience */}
    {hasContent(experience) && (
        <View>
            <Text style={[styles.sectionTitle, { color: '#333', textTransform: 'uppercase', borderBottomColor: accentColor }]}>
        Expérience Professionnelle
    </Text>

        {experience.map((exp, index) => (
            <View key={index} style={styles.experienceItem}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
            <View>
                <Text style={styles.experienceTitle}>{exp.title}</Text>
                <Text style={styles.experienceCompany}>{exp.company}</Text>
            </View>
            <Text style={styles.experienceDate}>{exp.startDate} - {exp.endDate || 'Présent'}</Text>
            </View>

            {exp.description && (
                <Text style={styles.experienceDescription}>{exp.description}</Text>
            )}
            </View>
        ))}
        </View>
    )}

    {/* Formation */}
    {hasContent(education) && (
        <View>
            <Text style={[styles.sectionTitle, { color: '#333', textTransform: 'uppercase', borderBottomColor: accentColor }]}>
        Formation
        </Text>

        {education.map((edu, index) => (
            <View key={index} style={styles.experienceItem}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
            <View>
                <Text style={styles.experienceTitle}>{edu.degree}</Text>
                <Text style={styles.experienceCompany}>{edu.school}</Text>
            </View>
            <Text style={styles.experienceDate}>{edu.startDate} - {edu.endDate}</Text>
            </View>

            {edu.description && (
                <Text style={styles.experienceDescription}>{edu.description}</Text>
            )}
            </View>
        ))}
        </View>
    )}
    </View>
    </View>
    </Page>
    </Document>
);

    // Retourner le template approprié selon l'ID
    switch(templateId) {
        case 2:
            return <Template2 />;
        case 3:
            return <Template3 />;
        default:
            return <Template1 />; // Template par défaut
    }
};

// Fonction pour générer et télécharger le PDF
export const generatePdf = async (cvData: CvData, templateId: number, accentColor: string): Promise<void> => {
    try {
        // Créer le document avec react-pdf
        const pdfDoc = <CvDocument cvData={cvData} templateId={templateId} accentColor={accentColor} />;

        // Générer le blob du PDF
        const blob = await pdf(pdfDoc).toBlob();

        // Créer un nom de fichier avec le nom de l'utilisateur
        const firstName = cvData.personalInfo.firstName || 'cv';
        const lastName = cvData.personalInfo.lastName || '';
        const filename = `${firstName}_${lastName}_cv.pdf`;

        // Télécharger le fichier
        saveAs(blob, filename);

        return Promise.resolve();
    } catch (error) {
        console.error('Erreur lors de la génération du PDF:', error);
        return Promise.reject(error);
    }
};