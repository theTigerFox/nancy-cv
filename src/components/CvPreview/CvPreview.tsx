// src/components/CvPreview/CvPreview.tsx
import  { forwardRef } from 'react';
import { CvData } from '../../types/cv';
import PreviewHeader from './PreviewHeader';
import PreviewContact from './PreviewContact';
import PreviewSection from './PreviewSection';
import PreviewSkills from './PreviewSkills';
import PreviewLanguages from './PreviewLanguages';

interface CvPreviewProps {
    cvData: CvData;
}

const CvPreview = forwardRef<HTMLDivElement, CvPreviewProps>(({ cvData }, ref) => {
    const { personalInfo, education, experience, skills, languages } = cvData;

    const hasContent = (list: any[]) => list.length > 0 && Object.values(list[0]).some(val => 
        val !== '' && val !== null && val !== undefined && val !== 5 && val !== 3
    );

    // Couleurs de thème dynamiques
    const accentColor = "#6366f1"; // Indigo-500
    const secondaryColor = "#8b5cf6"; // Violet-500

    return (
        <div 
            ref={ref} 
            id="cvPreview" 
            className="cv-preview w-full bg-white  overflow-hidden shadow-2xl transform transition-all duration-500"
            style={{ 
                maxWidth: '210mm',
                margin: '0 auto',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
            }}
        >
            {/* Header avec design moderne */}
            <PreviewHeader personalInfo={personalInfo} />

            {/* Corps du CV avec mise en page améliorée */}
            <div className="p-8 md:p-6 md:pt-3">
                {/* Contact Info */}
                <PreviewContact personalInfo={personalInfo} />

                {/* Profil/Description avec design élégant */}
                {personalInfo.description && (
                    <PreviewSection 
                        title="Profil" 
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" style={{color: accentColor}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        }
                        accentColor={accentColor}
                    >
                        <div className="bg-gray-50 text-sm p-4 rounded-lg border-l-4 text-gray-700 leading-relaxed" style={{borderColor: accentColor}}>
                            <p className="italic">{personalInfo.description}</p>
                        </div>
                    </PreviewSection>
                )}

                {/* Education avec design moderne et clair */}
                {hasContent(education) && (
                    <PreviewSection 
                        title="Formation" 
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" style={{color: accentColor}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                            </svg>
                        }
                        accentColor={accentColor}
                    >
                        <div className="space-y-0">
                            {education.map((item, index) => (
                                <div 
                                    key={item.id} 
                                    className={`p-2 rounded-lg hover:shadow-md transition-all duration-300 ${
                                        index % 2 === 0 ? 'bg-gray-50' : 'bg-white border border-gray-100'
                                    }`}
                                >
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                                        <div>
                                            <h4 className="font-bold text-gray-800 text-lg">{item.degree || 'Diplôme'}</h4>
                                            <p className="text-gray-600">{item.school || 'Établissement'}</p>
                                        </div>
                                {item.startDate &&
                                    (<div 
                                    className="mt-2 sm:mt-0 text-sm font-medium px-3 py-1 rounded-full flex-shrink-0" 
                                    style={{ 
                                        background: `linear-gradient(135deg, ${accentColor}20, ${secondaryColor}30)`,
                                        color: accentColor
                                    }}
                                >
                                 {item.startDate || ''} - {item.endDate || ''}
                                </div> )   
                                }
                                        
                                    </div>
                                    {item.description && (
                                        <div className="mt-1 text-sm leading-relaxed text-gray-700 pl-2 border-l-2" style={{borderColor: `${accentColor}50`}}>
                                            {item.description}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </PreviewSection>
                )}

                {/* Experience avec design professionnel et moderne */}
                {hasContent(experience) && (
                    <PreviewSection 
                        title="Expérience Professionnelle" 
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" style={{color: accentColor}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        }
                        accentColor={accentColor}
                    >
                        <div className="relative">
                            {/* Timeline design vertical */}
                            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 to-purple-500 hidden sm:block"></div>
                            
                            <div className="space-y-8">
                                {experience.map((item) => (
                                    <div 
                                        key={item.id} 
                                        className="relative pl-0 sm:pl-8"
                                    >
                                        {/* Point de timeline */}
                                        <div 
                                            className="absolute left-0 top-0 w-6 h-6 rounded-full bg-white border-2 hidden sm:flex items-center justify-center -ml-3"
                                            style={{borderColor: accentColor}}
                                        >
                                            <div className="w-2 h-2 rounded-full" style={{backgroundColor: accentColor}}></div>
                                        </div>
                                        
                                        {/* Carte d'expérience */}
                                        <div className="bg-white pt-1 pl-2 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                                                <div>
                                                    <h4 className="font-bold text-gray-800 text-lg">{item.title || 'Poste'}</h4>
                                                    <p className="text-gray-600 flex items-center">
                                                        <span 
                                                            className="inline-block w-2 h-2 rounded-full mr-2" 
                                                            style={{backgroundColor: accentColor}}
                                                        ></span>
                                                        {item.company || 'Entreprise'}
                                                    </p>
                                                </div>
                                                {item.startDate &&
                                    (<div 
                                    className="mt-2 sm:mt-0 text-sm font-medium px-3 py-1 rounded-full flex-shrink-0" 
                                    style={{ 
                                        background: `linear-gradient(135deg, ${accentColor}20, ${secondaryColor}30)`,
                                        color: accentColor
                                    }}
                                >
                                 {item.startDate || ''} - {item.endDate || ''}
                                </div> )   
                                }
                                            </div>
                                            {item.description && (
                                                <div className="text-gray-700 text-sm leading-relaxed mt-1">
                                                    {item.description}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </PreviewSection>
                )}

                {/* Skills & Languages dans une section avec design élégant */}
                {(hasContent(skills) || hasContent(languages)) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                        {/* Skills */}
                        {hasContent(skills) && (
                            <PreviewSection 
                                title="Compétences" 
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" style={{color: accentColor}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                }
                                accentColor={accentColor} 
                                noMarginBottom
                            >
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <PreviewSkills skills={skills} accentColor={accentColor} />
                                </div>
                            </PreviewSection>
                        )}

                        {/* Languages */}
                        {hasContent(languages) && (
                            <PreviewSection 
                                title="Langues" 
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" style={{color: accentColor}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                    </svg>
                                }
                                accentColor={accentColor} 
                                noMarginBottom
                            >
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <PreviewLanguages languages={languages} accentColor={accentColor} />
                                </div>
                            </PreviewSection>
                        )}
                    </div>
                )}
            </div>
            

       
        </div>
    );
});

CvPreview.displayName = 'CvPreview';

export default CvPreview;