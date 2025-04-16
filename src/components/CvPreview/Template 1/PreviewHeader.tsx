import React from 'react';
import { PersonalInfo } from '../../types/cv';

interface PreviewHeaderProps {
  personalInfo: PersonalInfo;
  accentColor?: string;
}

const PreviewHeader: React.FC<PreviewHeaderProps> = ({ personalInfo, accentColor = "#6366f1" }) => {
  const defaultName = "Prénom Nom";
  const defaultTitle = "Titre professionnel";

  return (
      <div
          className="relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
      >
        {/* Decorative element */}
        <div className="absolute top-0 right-0 w-full h-full opacity-10">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path fill="#FFFFFF" d="M41.4,-66.4C53.7,-59.5,63.6,-48.6,70.2,-35.8C76.7,-23,79.9,-8.3,78.1,5.6C76.3,19.6,69.5,32.7,59.8,42.2C50.1,51.7,37.6,57.6,24.8,60.9C12,64.2,-1.1,65,-13.7,62.2C-26.4,59.5,-38.7,53.3,-48.1,43.9C-57.6,34.6,-64.2,22.2,-68.6,8.2C-73,-5.7,-75.2,-21.2,-69.9,-33.6C-64.6,-45.9,-51.7,-55.2,-38.6,-61.6C-25.4,-68,-12.7,-71.5,0.7,-72.7C14.2,-73.8,29.1,-73.3,41.4,-66.4Z" transform="translate(100 100)" />
          </svg>
        </div>

        <div className="p-4 relative z-10 flex items-center">
          {/* Profile photo with fixed rounded shape for print */}
          <div className="relative mr-6">
            <div
                className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-md"
                style={{ borderRadius: '50%' }} // Explicitly set border-radius for print
            >
              {personalInfo.photo ? (
                  <img
                      src={personalInfo.photo}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      style={{ borderRadius: '50%' }} // Ensure image maintains rounded shape
                  />
              ) : (
                  <div
                      className="w-full h-full bg-gray-200 flex items-center justify-center"
                      style={{ borderRadius: '50%' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
              )}
            </div>
          </div>

          {/* Name and title */}
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {personalInfo.firstName || personalInfo.lastName ? `${personalInfo.firstName} ${personalInfo.lastName}`.trim() : defaultName}
            </h1>
            <h2 className="text-lg font-medium text-white/90 tracking-wide mt-1">
              {personalInfo.jobTitle || defaultTitle}
            </h2>
          </div>
        </div>
      </div>
  );
};

export default PreviewHeader;