import { forwardRef } from 'react';
import { CvData } from '../../../types/cv';
import { Mail, Phone, MapPin, Linkedin, Link as LinkIcon, Briefcase, GraduationCap, Code, Globe, User } from 'lucide-react';

interface CvPreviewProps {
    cvData: CvData;
}

const CvPreviewBrutalist = forwardRef<HTMLDivElement, CvPreviewProps>(({ cvData }, ref) => {
    const { personalInfo, education, experience, skills, languages } = cvData;

    return (
        <div className="w-full flex flex-col items-center" id="cvPreview">
             <div
                ref={ref}
                className="w-full bg-white text-black overflow-hidden relative"
                style={{
                    maxWidth: '210mm',
                    minHeight: '297mm', // A4 height
                    fontFamily: "'Courier New', Courier, monospace", // Brutalist font
                    border: '4px solid #000'
                }}
            >
                {/* Header Block */}
                <header className="bg-black text-white p-8 border-b-4 border-black relative">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                        <div className="flex-1">
                            <h1 className="text-5xl font-black uppercase tracking-tighter mb-2 leading-none">
                                {personalInfo.firstName} <span className="text-[#ff00ff]">{personalInfo.lastName}</span>
                            </h1>
                            <p className="text-xl font-bold uppercase bg-white text-black inline-block px-2 transform -rotate-1">
                                {personalInfo.jobTitle}
                            </p>
                            
                            <div className="mt-6 flex flex-wrap gap-4 text-sm font-bold">
                                {personalInfo.email && (
                                    <div className="flex items-center gap-1 hover:text-[#ff00ff] transition-colors">
                                        <Mail size={16} strokeWidth={3} />
                                        <span>{personalInfo.email}</span>
                                    </div>
                                )}
                                {personalInfo.phone && (
                                    <div className="flex items-center gap-1 hover:text-[#ff00ff] transition-colors">
                                        <Phone size={16} strokeWidth={3} />
                                        <span>{personalInfo.phone}</span>
                                    </div>
                                )}
                                {personalInfo.address && (
                                    <div className="flex items-center gap-1 hover:text-[#ff00ff] transition-colors">
                                        <MapPin size={16} strokeWidth={3} />
                                        <span>{personalInfo.address}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                         {/* Photo (Rotated & Bordered) */}
                         {personalInfo.photo && (
                            <div className="w-32 h-32 border-4 border-white transform rotate-3 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
                                <img 
                                    src={personalInfo.photo} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover grayscale contrast-125" 
                                />
                            </div>
                        )}
                    </div>
                </header>

                {/* Main Content Grid */}
                <div className="grid grid-cols-12 min-h-[500px]">
                    {/* Left Sidebar (Skills, Contact Details, etc.) */}
                    <aside className="col-span-4 border-r-4 border-black p-6 bg-[#f0f0f0]">
                        
                         {/* Intro / About */}
                         {personalInfo.description && (
                            <div className="mb-10">
                                <h3 className="text-2xl font-black uppercase mb-4 border-b-4 border-black inline-block">Profile</h3>
                                <p className="text-sm font-medium leading-relaxed text-justify">
                                    {personalInfo.description}
                                </p>
                            </div>
                        )}

                        {/* Skills */}
                        {skills.length > 0 && (
                            <div className="mb-10">
                                <h3 className="text-2xl font-black uppercase mb-4 border-b-4 border-black inline-block">Skills</h3>
                                <ul className="space-y-3">
                                    {skills.map((skill) => (
                                        <li key={skill.id} className="font-bold text-sm">
                                            <div className="flex justify-between items-center mb-1">
                                                <span>{skill.name}</span>
                                            </div>
                                            <div className="h-3 w-full border-2 border-black bg-white">
                                                <div 
                                                    className="h-full bg-black" 
                                                    style={{ width: `${(skill.level || 3) * 20}%` }}
                                                ></div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                         {/* Languages */}
                         {languages.length > 0 && (
                            <div className="mb-10">
                                <h3 className="text-2xl font-black uppercase mb-4 border-b-4 border-black inline-block">Languages</h3>
                                <ul className="space-y-2">
                                    {languages.map((lang) => (
                                        <li key={lang.id} className="font-bold text-sm bg-white border-2 border-black p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                           {lang.name} <span className="text-[#ff00ff]">///</span> Lvl {lang.level}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </aside>

                    {/* Right Content (Experience, Education) */}
                    <main className="col-span-8 p-8 bg-white">
                        
                        {/* Experience */}
                        {experience.length > 0 && (
                            <section className="mb-12">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="bg-black text-white p-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                        <Briefcase size={24} />
                                    </div>
                                    <h2 className="text-3xl font-black uppercase tracking-tight">Experience</h2>
                                </div>

                                <div className="space-y-8 pl-4 border-l-4 border-black ml-4">
                                    {experience.map((exp) => (
                                        <div key={exp.id} className="relative pl-6">
                                            {/* Timeline dot */}
                                            <div className="absolute -left-[26px] top-1 w-4 h-4 bg-[#ff00ff] border-2 border-black"></div>
                                            
                                            <h3 className="text-xl font-black uppercase">{exp.title}</h3>
                                            <div className="text-sm font-bold mb-2 flex justify-between w-full border-b-2 border-dashed border-gray-400 pb-1">
                                                <span>{exp.company}</span>
                                                <span className="bg-black text-white px-1">{exp.startDate} - {exp.endDate}</span>
                                            </div>
                                            <p className="text-sm font-medium leading-relaxed whitespace-pre-line">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Education */}
                        {education.length > 0 && (
                            <section>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="bg-white text-black p-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                        <GraduationCap size={24} />
                                    </div>
                                    <h2 className="text-3xl font-black uppercase tracking-tight text-gray-800">Education</h2>
                                </div>

                                <div className="space-y-6">
                                    {education.map((edu) => (
                                        <div key={edu.id} className="border-2 border-black p-4 shadow-[4px_4px_0px_0px_#ff00ff] bg-[#fff0f5]">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-lg font-black uppercase">{edu.degree}</h3>
                                                <span className="text-xs font-bold border-2 border-black px-1 bg-white">{edu.startDate} - {edu.endDate}</span>
                                            </div>
                                            <div className="font-bold text-sm mb-2">{edu.school}</div>
                                            <p className="text-xs font-medium">{edu.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                    </main>
                </div>

                {/* Footer Decor */}
                <div className="bg-black h-4 w-full mt-auto"></div>
                <div className="absolute top-0 right-0 w-8 h-8 bg-black"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 bg-black"></div>
            </div>
        </div>
    );
});

CvPreviewBrutalist.displayName = 'CvPreviewBrutalist';

export default CvPreviewBrutalist;
