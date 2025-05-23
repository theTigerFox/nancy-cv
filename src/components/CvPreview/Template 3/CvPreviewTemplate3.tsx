import { forwardRef, useState, useEffect } from 'react';
import { CvData } from '../../../types/cv';
import { Phone, Mail, MapPin, Briefcase, GraduationCap, Languages } from 'lucide-react';

interface CvPreviewProps {
    cvData: CvData;
    accentColor?: string;
    onAccentColorChange?: (color: string) => void;
}

const CvPreviewTemplate2 = forwardRef<HTMLDivElement, CvPreviewProps>(
    ({ cvData, accentColor = "#374151", onAccentColorChange }, ref) => {
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

        return (
            <div className="w-full flex flex-col items-center border border-gray-400" id={"cvPreview"}>
                {/* Color picker centered above the CV - visible only in edit mode */}
                <div className="w-full fixed z-1000 text-center mb-0 print:hidden">
                    <div className="inline-flex mt-3 items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
                        <label htmlFor="accentColor" className="text-sm text-gray-600">Accent Color:</label>
                        <input
                            type="color"
                            id="accentColor"
                            value={currentAccentColor}
                            onChange={(e) => handleColorChange(e.target.value)}
                            className="w-6 h-6 border-none cursor-pointer rounded"
                        />
                    </div>
                </div>

                {/* CV Document */}
                <div
                    ref={ref}
                    className="cv-preview w-full bg-white overflow-hidden shadow-2xl transform transition-all duration-500"
                    style={{
                        maxWidth: '210mm',
                        // margin: '0 auto',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                        fontSize: '0.92rem'
                    }}
                >
                    {/* Header */}
                    <header className="px-8 py-6 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            {/*/!* Photo *!/*/}
                            {/*{personalInfo.photo && (*/}
                            {/*    <div className="relative flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 shadow-md" style={{ borderColor: currentAccentColor }}>*/}
                            {/*        <img*/}
                            {/*            src={personalInfo.photo}*/}
                            {/*            alt={`${personalInfo.firstName} ${personalInfo.lastName}`}*/}
                            {/*            className="w-full h-full object-cover"*/}
                            {/*        />*/}
                            {/*    </div>*/}
                            {/*)}*/}

                            {/* Name and Title */}
                            <div className="flex-1">
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
                                    {personalInfo.firstName || 'Prénom'} {personalInfo.lastName || 'Nom'}
                                </h1>
                                <div className="mt-2 inline-block px-3 py-1 rounded-md text-black text-lg" >
                                    {personalInfo.jobTitle || 'Titre professionnel'}
                                </div>

                                {/* Contact Information */}
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                    {personalInfo.phone && (
                                        <div className="flex items-center gap-2">
                                            <Phone size={16} className="text-gray-500" />
                                            <span>{personalInfo.phone}</span>
                                        </div>
                                    )}

                                    {personalInfo.email && (
                                        <div className="flex items-center gap-2">
                                            <Mail size={16} className="text-gray-500" />
                                            <span>{personalInfo.email}</span>
                                        </div>
                                    )}

                                    {personalInfo.address && (
                                        <div className="flex items-center gap-2">
                                            <MapPin size={16} className="text-gray-500" />
                                            <span>{personalInfo.address}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Main Content */}
                    <div className="px-8 py-6">
                        {/* Profile */}
                        {personalInfo.description && (
                            <div className="mb-13">
                                <h2 className="text-xl font-semibold mb-3 pb-2 border-b-2" style={{ borderColor: currentAccentColor }}>
                                    Profil Professionnel
                                </h2>
                                <p className="text-gray-700 leading-relaxed">
                                    {personalInfo.description}
                                </p>
                            </div>
                        )}

                        {/* Two Column Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column - Experience and Education */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Experience Section */}
                                {hasContent(experience) && (
                                    <div>
                                        <h2 className="text-xl font-semibold mb-4 pb-2 border-b-2 flex items-center" style={{ borderColor: currentAccentColor }}>
                                            <Briefcase size={20} className="mr-2" style={{ color: currentAccentColor }} />
                                            Expérience Professionnelle
                                        </h2>

                                        <div className="space-y-5">
                                            {experience.map((item) => (
                                                <div key={item.id} className="relative">
                                                    {/* Date */}
                                                    <div className="text-sm font-semibold text-gray-600 mb-1">
                                                        {item.startDate || 'Début'} - {item.endDate || 'Présent'}
                                                    </div>

                                                    {/* Job Details */}
                                                    <div className="mb-1 pl-4 border-l-2" style={{ borderColor: currentAccentColor }}>
                                                        <h3 className="font-bold text-gray-800">
                                                            {item.title || 'Titre du poste'}
                                                        </h3>
                                                        <div className="text-gray-600 text-sm">
                                                            {item.company || 'Entreprise'}
                                                        </div>
                                                    </div>

                                                    {/* Description */}
                                                    {item.description && (
                                                        <p className="text-sm text-gray-700 mt-2">
                                                            {item.description}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Separator */}
                                <div className="border-b border-gray-200 mb-8" />

                                {/* Separator */}

                                {/* Education Section */}
                                {hasContent(education) && (
                                    <div>
                                        <h2 className="text-xl font-semibold mb-4 pb-2 border-b-2 flex items-center" style={{ borderColor: currentAccentColor }}>
                                            <GraduationCap size={20} className="mr-2" style={{ color: currentAccentColor }} />
                                            Formation
                                        </h2>

                                        <div className="space-y-5">
                                            {education.map((item) => (
                                                <div key={item.id} className="relative">
                                                    {/* Date */}
                                                    <div className="text-sm font-semibold text-gray-600 mb-1">
                                                        {item.startDate || 'Début'} - {item.endDate || 'Fin'}
                                                    </div>

                                                    {/* Education Details */}
                                                    <div className="mb-1 pl-4 border-l-2" style={{ borderColor: currentAccentColor }}>
                                                        <h3 className="font-bold text-gray-800">
                                                            {item.degree || 'Diplôme'}
                                                        </h3>
                                                        <div className="text-gray-600 text-sm">
                                                            {item.school || 'Établissement'}
                                                        </div>
                                                    </div>

                                                    {/* Description */}
                                                    {item.description && (
                                                        <p className="text-sm text-gray-700 mt-2">
                                                            {item.description}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Column - Skills and Languages */}
                            <div className="space-y-8">
                                {/* Skills Section */}
                                {hasContent(skills) && (
                                    <div>
                                        <h2 className="text-xl font-semibold mb-4 pb-2 border-b-2" style={{ borderColor: currentAccentColor }}>
                                            Compétences
                                        </h2>

                                        <div className="space-y-3">
                                            {skills.map((skill) => (
                                                <div key={skill.id}>
                                                    <div className="flex justify-between items-center mb-1">
                            <span className="font-medium text-gray-700">
                              {skill.name || 'Compétence'}
                            </span>
                                                        <span className="text-xs text-gray-500">
                              {Math.round((skill.level / 10) * 100)}%
                            </span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                        <div
                                                            className="h-1.5 rounded-full"
                                                            style={{
                                                                width: `${(skill.level / 10) * 100}%`,
                                                                backgroundColor: currentAccentColor
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {/* Separator */}
                                <div className="border-b border-gray-200 mb-8" />

                                {/* Separator */}

                                {/* Languages Section */}
                                {hasContent(languages) && (
                                    <div>
                                        <h2 className="text-xl font-semibold mb-4 pb-2 border-b-2 flex items-center" style={{ borderColor: currentAccentColor }}>
                                            <Languages size={20} className="mr-2" style={{ color: currentAccentColor }} />
                                            Langues
                                        </h2>

                                        <div className="space-y-3">
                                            {languages.map((language) => {
                                                // Map level (1-5) to descriptive text
                                                const levelDescriptions = [
                                                    'Débutant',
                                                    'Intermédiaire',
                                                    'Avancé',
                                                    'Courant',
                                                    'Bilingue/Natif'
                                                ];
                                                const levelText = levelDescriptions[Math.min(Math.max(0, language.level - 1), 4)];

                                                return (
                                                    <div key={language.id} className="flex justify-between items-center">
                            <span className="font-medium text-gray-700">
                              {language.name || 'Langue'}
                            </span>
                                                        <span
                                                            className="px-2 py-1 text-xs rounded-md"
                                                            style={{
                                                                backgroundColor: `${currentAccentColor}15`,
                                                                color: currentAccentColor
                                                            }}
                                                        >
                              {levelText}
                            </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);

CvPreviewTemplate2.displayName = 'CvPreviewTemplate2';

export default CvPreviewTemplate2;