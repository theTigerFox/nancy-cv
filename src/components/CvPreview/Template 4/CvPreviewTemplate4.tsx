import { forwardRef, useState, useEffect } from 'react';
import { CvData } from '../../../types/cv';

interface CvPreviewProps {
    cvData: CvData;
    accentColor?: string;
    onAccentColorChange?: (color: string) => void;
}

const CvPreviewTemplate4 = forwardRef<HTMLDivElement, CvPreviewProps>(
    ({ cvData, accentColor = "#2d3748", onAccentColorChange }, ref) => {
        const { personalInfo, education, experience, skills, languages } = cvData;
        const [currentAccentColor, setCurrentAccentColor] = useState(accentColor);

        // Update local state when prop changes
        useEffect(() => {
            setCurrentAccentColor(accentColor);
        }, [accentColor]);

        // Handle color change
        const handleColorChange = (color: string) => {
            setCurrentAccentColor(color);
            if (onAccentColorChange) {
                onAccentColorChange(color);
            }
        };

        // Check if a list has valid content
        const hasContent = (list: any[]) => list.length > 0 && Object.values(list[0]).some(val =>
            val !== '' && val !== null && val !== undefined && val !== 5 && val !== 3
        );

        // Mapping for language level text
        const getLevelText = (level: number) => {
            const levels = ['Débutant', 'Intermédiaire', 'Avancé', 'Courant', 'Bilingue/Natif'];
            return levels[Math.min(Math.max(0, level - 1), 4)];
        };

        return (
            <div className="w-full flex flex-col items-center border border-gray-400" id={"cvPreview"}>
                {/* Color picker centered above the CV - visible only in edit mode */}
                <div className="w-full fixed z-1000 text-center mb-4 print:hidden">
                    <div className="inline-flex mt-3 items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
                        <label htmlFor="accentColor" className="text-sm text-gray-600">Couleur d'accent :</label>
                        <input
                            type="color"
                            id="accentColor"
                            value={currentAccentColor}
                            onChange={(e) => handleColorChange(e.target.value)}
                            className="w-6 h-6 border-none cursor-pointer rounded"
                        />
                    </div>
                </div>

                {/* CV Document - Clean and Minimal */}
                <div
                    ref={ref}
                    className="cv-preview w-full bg-white overflow-hidden shadow-2xl transform transition-all duration-500"
                    style={{
                        maxWidth: '210mm',
                        // margin: '0 auto',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                        fontSize: '0.95rem',
                        fontFamily: "'Arial', 'Helvetica', sans-serif"
                    }}
                >
                    {/* Header - Minimal with just name and title */}
                    <header className="px-8 py-8 bg-white border-b border-gray-200">
                        <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-wide">
                            {personalInfo.firstName || 'Prénom'} {personalInfo.lastName || 'Nom'}
                        </h1>
                        {personalInfo.jobTitle && (
                            <p className="mt-2 font-medium text-base" style={{ color: currentAccentColor }}>
                                {personalInfo.jobTitle}
                            </p>
                        )}
                    </header>

                    {/* Main Content - Two columns using table for print compatibility */}
                    <table className="w-full border-collapse">
                        <tbody>
                        <tr>
                            {/* Left column - Contact info and skills */}
                            <td className="align-top bg-gray-50 border border-gray-100 p-8" style={{ width: '33%' }}>
                                {/* Contact Information */}
                                <div className="mb-8">
                                    <h2 className="text-lg font-bold mb-4 uppercase tracking-wider pb-2 border-b" style={{ borderColor: currentAccentColor }}>
                                        Contact
                                    </h2>
                                    <ul className="space-y-3 text-sm">
                                        {personalInfo.email && (
                                            <li>
                                                <span className="font-medium block">Email</span>
                                                {personalInfo.email}
                                            </li>
                                        )}
                                        {personalInfo.phone && (
                                            <li>
                                                <span className="font-medium block">Téléphone</span>
                                                {personalInfo.phone}
                                            </li>
                                        )}
                                        {personalInfo.address && (
                                            <li>
                                                <span className="font-medium block">Adresse</span>
                                                {personalInfo.address}
                                            </li>
                                        )}
                                    </ul>
                                </div>
                                {/* Separator */}
                                <div className="border-b border-gray-200 mb-8" />

                                {/* Separator */}

                                {/* Skills - Simple list */}
                                {hasContent(skills) && (
                                    <div className="mb-8">
                                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wider pb-2 border-b" style={{ borderColor: currentAccentColor }}>
                                            Compétences
                                        </h2>
                                        <ul className="space-y-2">
                                            {skills.map((skill) => (
                                                <li key={skill.id} style={{ marginBottom: '8px' }}>
                                                    <table className="w-full">
                                                        <tbody>
                                                        <tr>
                                                            <td className="align-middle" style={{ width: '12px' }}>
                                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currentAccentColor }}></div>
                                                            </td>
                                                            <td className="align-middle pl-2">
                                                                {skill.name || 'Compétence'}
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {/* Separator */}
                                <div className="border-b border-gray-200 mb-8" />

                                {/* Separator */}

                                {/* Languages - Simple list */}
                                {hasContent(languages) && (
                                    <div>
                                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wider pb-2 border-b" style={{ borderColor: currentAccentColor }}>
                                            Langues
                                        </h2>
                                        <ul className="space-y-2">
                                            {languages.map((language) => (
                                                <li key={language.id} style={{ marginBottom: '8px' }}>
                                                    <table className="w-full">
                                                        <tbody>
                                                        <tr>
                                                            <td>{language.name || 'Langue'}</td>
                                                            <td className="text-right text-sm text-gray-600">{getLevelText(language.level)}</td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </td>

                            {/* Right column - Main content */}
                            <td className="align-top p-8" style={{ width: '67%' }}>
                                {/* Profile */}
                                {personalInfo.description && (
                                    <div className="mb-13">
                                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wider pb-2 border-b" style={{ borderColor: currentAccentColor }}>
                                            Profil
                                        </h2>
                                        <p className="text-gray-700">
                                            {personalInfo.description}
                                        </p>
                                    </div>
                                )}

                                {/* Experience */}
                                {hasContent(experience) && (
                                    <div className="mb-8">
                                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wider pb-2 border-b" style={{ borderColor: currentAccentColor }}>
                                            Expérience Professionnelle
                                        </h2>
                                        <div className="space-y-6">
                                            {experience.map((item) => (
                                                <div key={item.id} style={{ marginBottom: '24px' }}>
                                                    <table className="w-full mb-1">
                                                        <tbody>
                                                        <tr>
                                                            <td className="align-top">
                                                                <h3 className="font-bold text-gray-800">{item.title || 'Titre du poste'}</h3>
                                                                <p className="text-gray-600">{item.company || 'Entreprise'}</p>
                                                            </td>
                                                            <td className="align-top text-right">
                                                                <p className="text-sm text-gray-500 whitespace-nowrap">
                                                                    {item.startDate || 'Début'} - {item.endDate || 'Présent'}
                                                                </p>
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                    {item.description && (
                                                        <p className="mt-2 text-sm text-gray-600">{item.description}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {/* Separator */}
                                <div className=" mb-6" />

                                {/* Separator */}

                                {/* Education */}
                                {hasContent(education) && (
                                    <div>
                                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wider pb-2 border-b" style={{ borderColor: currentAccentColor }}>
                                            Formation
                                        </h2>
                                        <div className="space-y-6">
                                            {education.map((item) => (
                                                <div key={item.id} style={{ marginBottom: '24px' }}>
                                                    <table className="w-full mb-1">
                                                        <tbody>
                                                        <tr>
                                                            <td className="align-top">
                                                                <h3 className="font-bold text-gray-800">{item.degree || 'Diplôme'}</h3>
                                                                <p className="text-gray-600">{item.school || 'Établissement'}</p>
                                                            </td>
                                                            <td className="align-top text-right">
                                                                <p className="text-sm text-gray-500 whitespace-nowrap">
                                                                    {item.startDate || 'Début'} - {item.endDate || 'Fin'}
                                                                </p>
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                    {item.description && (
                                                        <p className="mt-2 text-sm text-gray-600">{item.description}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
);

CvPreviewTemplate4.displayName = 'CvPreviewTemplate4';

export default CvPreviewTemplate4;