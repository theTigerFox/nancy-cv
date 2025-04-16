import { forwardRef, useState } from 'react';
import { CvData } from '../../../types/cv';
import PreviewHeader from './PreviewHeader';
import PreviewContact from './PreviewContact';
import PreviewSection from './PreviewSection';
import PreviewSkills from './PreviewSkills';
import PreviewLanguages from './PreviewLanguages';

interface CvPreviewProps {
    cvData: CvData;
}

const CvPreviewTemplate1 = forwardRef<HTMLDivElement, CvPreviewProps>(({ cvData }, ref) => {
    const { personalInfo, education, experience, skills, languages } = cvData;

    // Default accent color with option to customize
    const [accentColor, setAccentColor] = useState("#6366f1"); // Indigo-500

    const hasContent = (list: any[]) => list.length > 0 && Object.values(list[0]).some(val =>
        val !== '' && val !== null && val !== undefined && val !== 5 && val !== 3
    );

    // Check if any sidebar content exists
    const hasSidebarContent = hasContent(skills) || hasContent(languages);

    return (
        <div className="w-full flex flex-col items-center border" id={"cvPreview"}>
            {/* Color picker centered above the CV - visible only in edit mode */}
            <div className="w-full fixed z-1000 text-center mb-4 print:hidden">
                <div className="inline-flex mt-3 items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
                    <label htmlFor="headerColor" className="text-sm  text-gray-600">Couleur Principale :</label>
                    <input
                        type="color"
                        id="headerColor"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="w-6 h-6 border-none cursor-pointer rounded"
                    />
                </div>
            </div>

            <div
                ref={ref}
                id="cvPreview"
                className="cv-preview w-full bg-white overflow-hidden shadow-2xl transform transition-all duration-500"
                style={{
                    maxWidth: '210mm',
                    // margin: '0 auto',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                    fontSize: '0.9rem' // Smaller base font size
                }}
            >
                {/* Header with the customizable color */}
                <PreviewHeader personalInfo={personalInfo} accentColor={accentColor} />

                {/* Two-column layout for CV content */}
                <div className="flex flex-row">
                    {/* Left sidebar for skills and languages - takes 1/3 of width */}
                    {hasSidebarContent && (
                        <div className="w-1/3  p-5 border-r border-gray-200">

                            {/* Contact Info in sidebar */}
                            <div className="mt-0 mb-20">
                                <PreviewSection
                                    title="Contact"
                                    icon={
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" style={{color: accentColor}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    }
                                    accentColor={accentColor}
                                    compact
                                >
                                    <div className="text-xs space-y-2">
                                        {personalInfo.email && (
                                            <div className="flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                <span className="text-gray-700">{personalInfo.email}</span>
                                            </div>
                                        )}

                                        {personalInfo.phone && (
                                            <div className="flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                                <span className="text-gray-700">{personalInfo.phone}</span>
                                            </div>
                                        )}

                                        {personalInfo.address && (
                                            <div className="flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span className="text-gray-700">{personalInfo.address}</span>
                                            </div>
                                        )}
                                    </div>
                                </PreviewSection>
                            </div>
                            {/* Skills */}
                            {hasContent(skills) && (
                                <PreviewSection
                                    title="Compétences"
                                    icon={
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" style={{color: accentColor}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                    }
                                    accentColor={accentColor}
                                    compact

                                >
                                    <PreviewSkills skills={skills} accentColor={accentColor} />
                                </PreviewSection>
                            )}

                            {/* Languages */}
                            {hasContent(languages) && (
                                <div className="mt-10">
                                    <PreviewSection
                                        title="Langues"
                                        icon={
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" style={{color: accentColor}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                            </svg>
                                        }
                                        accentColor={accentColor}
                                        compact
                                    >
                                        <PreviewLanguages languages={languages} accentColor={accentColor} />
                                    </PreviewSection>
                                </div>

                            )}

                        </div>
                    )}

                    {/* Main content area - takes 2/3 of width */}
                    <div className={`${hasSidebarContent ? 'w-2/3' : 'w-full'} p-5`}>
                        {/* Contact info at top only if not in sidebar */}
                        {!hasSidebarContent && <PreviewContact personalInfo={personalInfo} />}

                        {/* Description */}
                        {personalInfo.description && (
                            <PreviewSection
                                title="Profil"
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" style={{color: accentColor}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                }
                                accentColor={accentColor}
                                compact
                            >
                                <div className="text-sm text-gray-700 leading-relaxed border-l-3" style={{borderColor: `${accentColor}40`, paddingLeft: '0.75rem'}}>
                                    <p>{personalInfo.description}</p>
                                </div>
                            </PreviewSection>
                        )}

                        {/* Education */}
                        {hasContent(education) && (
                            <div className="mt-15">
                                <PreviewSection
                                    title="Formation"
                                    icon={
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" style={{color: accentColor}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                                        </svg>
                                    }
                                    accentColor={accentColor}
                                    compact
                                >
                                    <div className="space-y-3">
                                        {education.map((item, index) => (
                                            <div
                                                key={item.id}
                                                className={`p-2 rounded-md ${
                                                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                                                }`}
                                            >
                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 mb-1">
                                                    <div>
                                                        <h4 className="font-bold text-gray-800 text-base">{item.degree || 'Diplôme'}</h4>
                                                        <p className="text-gray-600 text-sm">{item.school || 'Établissement'}</p>
                                                    </div>
                                                    {item.startDate && (
                                                        <div
                                                            className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                                                            style={{
                                                                background: `${accentColor}15`,
                                                                color: accentColor
                                                            }}
                                                        >
                                                            {item.startDate} - {item.endDate || 'présent'}
                                                        </div>
                                                    )}
                                                </div>
                                                {item.description && (
                                                    <div className="mt-1 text-xs leading-relaxed text-gray-700 pl-2 border-l-2" style={{borderColor: `${accentColor}40`}}>
                                                        {item.description}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </PreviewSection>
                            </div>


                        )}

                        {/* Experience */}
                        {hasContent(experience) && (
                            <div className="mt-12">
                                <PreviewSection
                                    title="Expérience "
                                    icon={
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4"
                                             style={{color: accentColor}} fill="none" viewBox="0 0 24 24"
                                             stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                        </svg>
                                    }
                                    accentColor={accentColor}
                                    compact
                                >
                                    <div className="relative">
                                        {/* Timeline design - simplified for saving space */}
                                        <div
                                            className="absolute left-1.5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-400 to-purple-400 hidden sm:block"></div>

                                        <div className="space-y-4">
                                            {experience.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="relative pl-0 sm:pl-6"
                                                >
                                                    {/* Timeline dot */}
                                                    <div
                                                        className="absolute left-0 top-0 w-3 h-3 rounded-full bg-white border hidden sm:block"
                                                        style={{borderColor: accentColor, top: '0.3rem', left: '0'}}
                                                    ></div>

                                                    {/* Experience card */}
                                                    <div className="bg-white pt-0 rounded-md">
                                                        <div
                                                            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 mb-1">
                                                            <div>
                                                                <h4 className="font-bold text-gray-800 text-base">{item.title || 'Poste'}</h4>
                                                                <p className="text-gray-600 text-sm flex items-center">
                                                                <span
                                                                    className="inline-block w-1.5 h-1.5 rounded-full mr-1.5"
                                                                    style={{backgroundColor: accentColor}}
                                                                ></span>
                                                                    {item.company || 'Entreprise'}
                                                                </p>
                                                            </div>
                                                            {item.startDate && (
                                                                <div
                                                                    className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                                                                    style={{
                                                                        background: `${accentColor}15`,
                                                                        color: accentColor
                                                                    }}
                                                                >
                                                                    {item.startDate} - {item.endDate || 'présent'}
                                                                </div>
                                                            )}
                                                        </div>
                                                        {item.description && (
                                                            <div
                                                                className="text-xs text-gray-700 leading-relaxed mt-1 pl-2 border-l-2"
                                                                style={{borderColor: `${accentColor}40`}}>
                                                                {item.description}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </PreviewSection>
                            </div>
                        )}

                        {/* Skills & Languages only if no sidebar */}
                        {!hasSidebarContent && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                {/* Skills */}
                                {hasContent(skills) && (
                                    <PreviewSection
                                        title="Compétences"
                                        icon={
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" style={{color: accentColor}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                            </svg>
                                        }
                                        accentColor={accentColor}
                                        compact
                                        noMarginBottom
                                    >
                                        <PreviewSkills skills={skills} accentColor={accentColor} />
                                    </PreviewSection>
                                )}

                                {/* Languages */}
                                {hasContent(languages) && (
                                    <PreviewSection
                                        title="Langues"
                                        icon={
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" style={{color: accentColor}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                            </svg>
                                        }
                                        accentColor={accentColor}
                                        compact
                                        noMarginBottom
                                    >
                                        <PreviewLanguages languages={languages} accentColor={accentColor} />
                                    </PreviewSection>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

CvPreviewTemplate1.displayName = 'CvPreview';

export default CvPreviewTemplate1;