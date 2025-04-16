import React from 'react';
import { PersonalInfo } from '../../../types/cv';
import { Phone, Mail, MapPin } from 'lucide-react';

interface PreviewContact2Props {
    personalInfo: PersonalInfo;
    accentColor: string;
}

const PreviewContact2: React.FC<PreviewContact2Props> = ({ personalInfo, accentColor }) => {
    // Check if we have any contact info to display
    const hasContactInfo = personalInfo.email || personalInfo.phone || personalInfo.address;

    if (!hasContactInfo) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            {personalInfo.phone && (
                <div className="flex items-center gap-2">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${accentColor}15` }}>
                        <Phone size={16} style={{ color: accentColor }} />
                    </div>
                    <div>
                        <div className="text-xs text-gray-500">Téléphone</div>
                        <div className="text-sm font-medium">{personalInfo.phone}</div>
                    </div>
                </div>
            )}

            {personalInfo.email && (
                <div className="flex items-center gap-2">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${accentColor}15` }}>
                        <Mail size={16} style={{ color: accentColor }} />
                    </div>
                    <div>
                        <div className="text-xs text-gray-500">Email</div>
                        <div className="text-sm font-medium">{personalInfo.email}</div>
                    </div>
                </div>
            )}

            {personalInfo.address && (
                <div className="flex items-center gap-2">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${accentColor}15` }}>
                        <MapPin size={16} style={{ color: accentColor }} />
                    </div>
                    <div>
                        <div className="text-xs text-gray-500">Adresse</div>
                        <div className="text-sm font-medium">{personalInfo.address}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PreviewContact2;