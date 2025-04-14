// src/components/CvPreview/PreviewSection.tsx
import React, { ReactNode } from 'react';

interface PreviewSectionProps {
    title: string;
    children: ReactNode;
    noMarginBottom?: boolean;
    icon?: ReactNode;
    accentColor?: string;
}

const PreviewSection: React.FC<PreviewSectionProps> = ({ 
    title, 
    children, 
    noMarginBottom = false,
    icon,
    accentColor = "#6366f1" // Couleur par défaut
}) => {
    return (
        <section className={`mb-${noMarginBottom ? '0' : '3'} group`}>
            {/* En-tête de section avec animation au survol */}
            <div className="flex items-center mb-5 pb-2 border-b border-gray-100 relative overflow-hidden">
                {icon && (
                    <div className="mr-3 p-2 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm transform group-hover:scale-110 transition-all duration-300">
                        {icon}
                    </div>
                )}
                
                <h3 className="text-xm font-bold tracking-tight text-gray-800 relative">
                    {title}
                    {/* Ligne d'accent avec animation */}
                    <span 
                        className="absolute -bottom-2 left-0 h-1 w-16 rounded-full transform group-hover:w-24 transition-all duration-500 ease-out"
                        style={{ 
                            background: `linear-gradient(90deg, ${accentColor}, ${accentColor}90)`
                        }}
                    ></span>
                </h3>
                
                {/* Élément de design subtil */}
                <div 
                    className="absolute right-0 bottom-0 h-8 w-16 opacity-10 transform translate-x-4 translate-y-4"
                    style={{ 
                        background: `radial-gradient(circle, ${accentColor}80, transparent)` 
                    }}
                ></div>
            </div>
            
            {/* Contenu de la section avec animation subtile d'apparition */}
            <div className="transform transition-all duration-500 ease-out">
                {children}
            </div>
        </section>
    );
};

export default PreviewSection;