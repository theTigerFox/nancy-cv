import React, { ReactNode } from 'react';

interface PreviewSectionProps {
    title: string;
    children: ReactNode;
    noMarginBottom?: boolean;
    icon?: ReactNode;
    accentColor?: string;
    compact?: boolean;
}

const PreviewSection: React.FC<PreviewSectionProps> = ({
                                                           title,
                                                           children,
                                                           noMarginBottom = false,
                                                           icon,
                                                           accentColor = "#6366f1",
                                                           compact = false
                                                       }) => {
    return (
        <section className={`mb-${noMarginBottom ? '0' : '4'} group`}>
            {/* Section header with simplified animation */}
            <div className="flex items-center mb-3 pb-1 border-b border-gray-100">
                {icon && (
                    <div
                        className={`mr-2 ${compact ? 'p-1' : 'p-1.5'} rounded-md bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm`}
                        style={{ color: accentColor }}
                    >
                        {icon}
                    </div>
                )}

                <h3
                    className={`${compact ? 'text-sm' : 'text-base'} font-bold uppercase tracking-wide text-gray-800`}
                    style={{ color: accentColor }}
                >
                    {title}
                </h3>

                {/* Accent line */}
                <div
                    className="ml-2 flex-grow h-px"
                    style={{ backgroundColor: `${accentColor}30` }}
                ></div>
            </div>

            {/* Section content */}
            <div>
                {children}
            </div>
        </section>
    );
};

export default PreviewSection;