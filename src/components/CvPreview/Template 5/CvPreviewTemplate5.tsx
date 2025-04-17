import  { forwardRef } from 'react';
import { CvData } from '../../../types/cv'; // Ajuste le chemin si nécessaire
import { Phone, Mail, MapPin } from 'lucide-react'; // Ou tes propres icônes

interface CvPreviewProps {
    cvData: CvData;
}

// Helper pour vérifier si une section a du contenu significatif
const hasContent = (list: any[] | undefined) =>
    list && list.length > 0 && Object.values(list[0]).some(val =>
        val !== '' && val !== null && val !== undefined && (typeof val !== 'number' || (val !== 5 && val !== 3)) // Exclut les niveaux par défaut si c'est la seule info
    );

const CvPreviewTemplate5 = forwardRef<HTMLDivElement, CvPreviewProps>(({ cvData }, ref) => {
    const { personalInfo, education, experience, skills, languages } = cvData;

    // Couleurs (ajuste si besoin pour correspondre exactement)
    const sidebarBgColor = "bg-slate-800"; // Un bleu/gris foncé
    const sidebarTextColor = "text-white";
    const sectionTitleBgColor = "bg-amber-100"; // Un jaune/beige pâle
    const mainTextColor = "text-gray-800";
    const secondaryTextColor = "text-gray-600";

    // --- Section Placeholder: Centres d'intérêt ---
    // NOTE: 'interests' n'est pas dans le type CvData actuel.
    // Ajoute-le au type ou remplace cette section par des données réelles si disponibles.
    // const interests = [
    //     { id: '1', name: 'Natation' },
    //     { id: '2', name: 'Tennis en compétition' },
    //     { id: '3', name: 'Lecture et théâtre' },
    // ];
    // const hasInterests = interests.length > 0;
    // // --- Fin Placeholder ---


    return (
        <div
            ref={ref}
            id={"cvPreview"}
            className="cv-preview w-full  bg-white shadow-lg border border-gray-400"
            style={{
                maxWidth: '210mm', // Format A4 approximatif
                minHeight: '297mm',

            }}

        >
            <div className="flex min-h-[297mm]">
                {/* Colonne Latérale (Gauche) */}
                <div className={`w-1/3 ${sidebarBgColor} ${sidebarTextColor} p-6 flex flex-col`}>
                    {/* Photo */}
                    {personalInfo.photo && (
                        <div className="mb-6 text-center">
                            <img
                                src={personalInfo.photo}
                                alt="Profil"
                                className="rounded-full w-32 h-32 mx-auto object-cover border-4 border-slate-700"
                            />
                        </div>
                    )}

                    {/* Nom et Titre */}
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold uppercase">{personalInfo.firstName}</h1>
                        <h1 className="text-3xl font-bold uppercase mb-2">{personalInfo.lastName}</h1>
                        <p className="text-sm text-gray-300">{personalInfo.jobTitle}</p>
                        <hr className="border-t border-gray-500 my-4" />
                    </div>

                    {/* Profil */}
                    {personalInfo.description && (
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold uppercase mb-1">Profil</h2>
                            <hr className="border-t border-gray-600 w-1/4 mb-2" />
                            <p className="text-2xs text-gray-300 leading-relaxed">{personalInfo.description}</p>
                        </div>
                    )}

                    {/* Contact */}
                    {(personalInfo.phone || personalInfo.email || personalInfo.address) && (
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold uppercase mb-1">Contact</h2>
                            <hr className="border-t border-gray-600 w-1/4 mb-2" />
                            <div className="space-y-2 text-xs">
                                {personalInfo.phone && (
                                    <div className="flex items-center">
                                        <Phone size={14} className="mr-2 flex-shrink-0" />
                                        <span className="text-2xs">{personalInfo.phone}</span>
                                    </div>
                                )}
                                {personalInfo.email && (
                                    <div className="flex items-center">
                                        <Mail size={14} className="mr-2 flex-shrink-0" />
                                        <span className="text-2xs">{personalInfo.email}</span>
                                    </div>
                                )}
                                {personalInfo.address && (
                                    <div className="flex items-center">
                                        <MapPin size={14} className="mr-2 flex-shrink-0" />
                                        <span className="text-2xs">{personalInfo.address}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Compétences */}
                    {hasContent(skills) && (
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold uppercase mb-1">Compétences</h2>
                            <hr className="border-t border-gray-600 w-1/4 mb-2" />
                            <ul className="text-2xs text-gray-300 space-y-1">
                                {skills.map((skill) => (
                                    <li key={skill.id}>- {skill.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Centres d'intérêt (Placeholder) */}
                    {/*{hasInterests && (*/}
                    {/*    <div className="mt-auto"> /!* Pour pousser vers le bas si possible *!/*/}
                    {/*        <h2 className="text-lg font-semibold uppercase mb-1">Centres d'intérêt</h2>*/}
                    {/*        <hr className="border-t border-gray-600 w-1/4 mb-2" />*/}
                    {/*        <ul className="text-xs text-gray-300 space-y-1">*/}
                    {/*            {interests.map((interest) => (*/}
                    {/*                <li key={interest.id}>- {interest.name}</li>*/}
                    {/*            ))}*/}
                    {/*        </ul>*/}
                    {/*    </div>*/}
                    {/*)}*/}
                </div>

                {/* Colonne Principale (Droite) */}
                <div className={`w-2/3 ${mainTextColor} p-8`}>

                    {/* Formation */}
                    {hasContent(education) && (
                        <div className="mb-8">
                            <div className={`${sectionTitleBgColor} p-2 mb-4 -ml-8 pl-8`}> {/* Barre de titre */}
                                <h2 className="text-xl font-semibold uppercase tracking-wider">Formation</h2>
                            </div>
                            <div className="space-y-4">
                                {education.map((edu) => (
                                    <div key={edu.id}>
                                        <p className={`text-2xs ${secondaryTextColor} mb-0.5`}>{edu.startDate} - {edu.endDate || '-'} </p> {/* Ajout location si disponible */}
                                        <h3 className="font-bold text-3xs text-base">{edu.degree || ''}</h3>
                                        <p className={`${secondaryTextColor} text-sm`}>{edu.school || ''}</p>
                                        {edu.description && (
                                            <p className={`text-2xs ${secondaryTextColor} mt-1 italic`}>{edu.description}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}


                    <div className="mt-18"></div>

                    {/* Expérience Professionnelle */}
                    {hasContent(experience) && (
                        <div className="mb-8">
                            <div className={`${sectionTitleBgColor} p-2 mb-4 -ml-8 pl-8`}> {/* Barre de titre */}
                                <h2 className="text-xl font-semibold uppercase tracking-wider">Expérience Professionnelle</h2>
                            </div>
                            <div className="space-y-5">
                                {experience.map((exp) => (
                                    <div key={exp.id}>
                                        <h3 className="font-bold text-base text-2xs">{exp.company || ''} | <span className="font-normal text-sm">{exp.startDate} - {exp.endDate || 'Présent'}</span></h3>
                                        <p className={`${secondaryTextColor} text-2xs mb-1`}>{exp.title || ''}</p> {/* Ajout location si disponible */}
                                        {exp.description && (
                                            <>
                                                <h4 className="font-semibold text-2xs mt-1">Tâches :</h4>
                                                {/* Tentative de split la description en liste si elle contient des puces ou des retours ligne */}
                                                {exp.description.includes('\n') || exp.description.startsWith('-') || exp.description.startsWith('*') ? (
                                                    <ul className="list-disc ml-5 text-2xs ${secondaryTextColor} space-y-1">
                                                        {exp.description.split('\n').map((line, index) => line.trim() && (
                                                            <li key={index}>{line.trim().replace(/^[-*]\s*/, '')}</li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className={`text-2xs ${secondaryTextColor}`}>{exp.description}</p>
                                                )}
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}


                    <div className="mt-18"></div>

                    {/* Langues */}
                    {hasContent(languages)  &&  (
                        <div className="mb-8">
                            <div className={`${sectionTitleBgColor} p-2 mb-4 -ml-8 pl-8`}> {/* Barre de titre */}
                                <h2 className="text-xl font-semibold uppercase tracking-wider">Langues</h2>
                            </div>
                            <div className="space-y-1 text-sm">
                                {languages.map((lang) => {
                                    // Simple conversion niveau -> texte (ajuste si besoin)
                                    let levelText = '';
                                    if (lang.level === 5) levelText = 'Bilingue / Natif';
                                    else if (lang.level === 4) levelText = 'Courant';
                                    else if (lang.level === 3) levelText = 'Intermédiaire';
                                    else if (lang.level === 2) levelText = 'Débutant';
                                    else if (lang.level === 1) levelText = 'Notions';

                                    return (
                                        <p key={lang.id}>
                                            <span className="text-lg">{lang.name+(lang.name?":":'') || ''} </span> { (lang.name?levelText:'') || ``}
                                        </p>
                                    );
                                })}
                            </div>
                        </div>
                    )}


                </div>
            </div>
        </div>
    );
});

CvPreviewTemplate5.displayName = 'CvPreviewTemplate5';

export default CvPreviewTemplate5;